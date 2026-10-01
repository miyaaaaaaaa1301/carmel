import 'dotenv/config'
import bcrypt from 'bcryptjs'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { type NextFunction, type Request, type Response } from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import jwt from 'jsonwebtoken'
import { Prisma, PrismaClient } from '@prisma/client'
import { timingSafeEqual } from 'node:crypto'
import { z } from 'zod'

const app = express()
const prisma = new PrismaClient()
const port = Number(process.env.PORT || 4000)
const jwtSecret = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'local-only-change-this-secret')
if (!jwtSecret) throw new Error('Set JWT_SECRET before starting in production.')
const demoAuthEnabled = process.env.DEMO_AUTH_ENABLED === 'true' && process.env.NODE_ENV !== 'production'
const demoAdminEmail = process.env.DEMO_ADMIN_EMAIL?.toLowerCase() || ''
const demoAdminPassword = process.env.DEMO_ADMIN_PASSWORD || ''

app.disable('x-powered-by')
app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false }))
app.use('/api/donations', rateLimit({ windowMs: 60 * 60 * 1000, limit: 8, standardHeaders: 'draft-8', legacyHeaders: false }))
app.use('/api/contact', rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: 'draft-8', legacyHeaders: false }))

const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' as const, path: '/' }
type AuthRequest = Request & { auth?: { id: string; role: 'ADMIN' | 'FORMATOR' | 'USER'; demo?: boolean } }
function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.carmel_session as string | undefined
  if (!token) return res.status(401).json({ error: 'Sign in is required.' })
  try {
    const claims = jwt.verify(token, jwtSecret) as AuthRequest['auth']
    if (!claims?.id || !claims.role) return res.status(401).json({ error: 'Invalid session.' })
    req.auth = claims
    next()
  } catch { return res.status(401).json({ error: 'Your session has expired. Please sign in again.' }) }
}
function allowRoles(...roles: Array<'ADMIN' | 'FORMATOR'>) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.auth || !roles.includes(req.auth.role as 'ADMIN' | 'FORMATOR')) return res.status(403).json({ error: 'You do not have access to this resource.' })
    next()
  }
}
function validate<T extends z.ZodType>(schema: T, input: unknown) {
  const result = schema.safeParse(input)
  return result.success ? { data: result.data, error: null } : { data: null, error: result.error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })) }
}
async function audit(userId: string, action: string, entity: string, entityId: string, meta?: Prisma.InputJsonValue) {
  await prisma.auditLog.create({ data: { userId, action, entity, entityId, meta } })
}
const asyncRoute = (handler: (req: AuthRequest, res: Response) => Promise<unknown>) => (req: Request, res: Response, next: NextFunction) => Promise.resolve(handler(req as AuthRequest, res)).catch(next)
function routeParam(req: Request, name: string): string {
  const value = req.params[name]
  return Array.isArray(value) ? value[0] ?? '' : value ?? ''
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'carmel-in-communion-api' }))

const registerSchema = z.object({ name: z.string().trim().min(2).max(100), email: z.email().transform((value) => value.toLowerCase()), password: z.string().min(10).max(128) })
app.post('/api/auth/register', asyncRoute(async (req, res) => {
  const parsed = validate(registerSchema, req.body)
  if (parsed.error) return res.status(400).json({ error: 'Please check the form fields.', details: parsed.error })
  const passwordHash = await bcrypt.hash(parsed.data!.password, 12)
  try {
    const user = await prisma.user.create({ data: { ...parsed.data!, passwordHash, role: 'USER' }, select: { id: true, name: true, email: true, role: true } })
    const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: '8h' })
    res.cookie('carmel_session', token, { ...cookieOptions, maxAge: 8 * 60 * 60 * 1000 })
    res.status(201).json({ user })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') return res.status(409).json({ error: 'An account with this email already exists.' })
    throw error
  }
}))
const loginSchema = z.object({ email: z.email().transform((value) => value.toLowerCase()), password: z.string().min(1).max(128) })
app.post('/api/auth/login', asyncRoute(async (req, res) => {
  const parsed = validate(loginSchema, req.body)
  if (parsed.error) return res.status(400).json({ error: 'Enter a valid email and password.' })
  const input = parsed.data!
  const providedPassword = Buffer.from(input.password)
  const expectedPassword = Buffer.from(demoAdminPassword)
  const passwordMatches = providedPassword.length === expectedPassword.length && timingSafeEqual(providedPassword, expectedPassword)
  if (demoAuthEnabled && demoAdminEmail && demoAdminPassword && input.email === demoAdminEmail && passwordMatches) {
    const user = { id: 'local-demo-admin', name: 'Local Demo Administrator', email: demoAdminEmail, role: 'ADMIN' as const }
    const token = jwt.sign({ id: user.id, role: user.role, demo: true }, jwtSecret, { expiresIn: '8h' })
    res.cookie('carmel_session', token, { ...cookieOptions, maxAge: 8 * 60 * 60 * 1000 })
    return res.json({ user })
  }
  const user = await prisma.user.findUnique({ where: { email: input.email } })
  if (!user || !user.isActive || !(await bcrypt.compare(input.password, user.passwordHash))) return res.status(401).json({ error: 'Email or password is incorrect.' })
  const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: '8h' })
  res.cookie('carmel_session', token, { ...cookieOptions, maxAge: 8 * 60 * 60 * 1000 })
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } })
}))
app.post('/api/auth/logout', (_req, res) => { res.clearCookie('carmel_session', cookieOptions); res.status(204).end() })
app.get('/api/auth/me', authenticate, asyncRoute(async (req, res) => {
  if (req.auth!.demo && demoAuthEnabled) {
    return res.json({ user: { id: req.auth!.id, name: 'Local Demo Administrator', email: demoAdminEmail, role: 'ADMIN', isActive: true } })
  }
  const user = await prisma.user.findUnique({ where: { id: req.auth!.id }, select: { id: true, name: true, email: true, role: true, isActive: true } })
  if (!user?.isActive) return res.status(401).json({ error: 'This account is inactive.' })
  res.json({ user })
}))

const donationSchema = z.object({
  amount: z.coerce.number().finite().min(50).max(10000000),
  frequency: z.enum(['ONE_TIME', 'MONTHLY']).default('ONE_TIME'),
  payment: z.enum(['GCASH', 'MAYA', 'BANK', 'CARD']),
  anonymous: z.boolean().default(true),
  name: z.string().trim().max(100).optional().default(''),
  email: z.union([z.email(), z.literal('')]).optional().default(''),
  phone: z.string().trim().max(30).optional().default(''),
  receipt: z.boolean().default(false),
  reference: z.string().trim().max(100).optional().default(''),
  fund: z.string().trim().max(150).optional().default('Federation formation program'),
})
app.post('/api/donations', asyncRoute(async (req, res) => {
  const parsed = validate(donationSchema, req.body)
  if (parsed.error) return res.status(400).json({ error: 'Please check the donation details.', details: parsed.error })
  const input = parsed.data!
  if (!input.anonymous && (!input.name || !input.email)) return res.status(400).json({ error: 'Name and email are required for a named donation.' })
  if (input.receipt && !input.email && !input.phone) return res.status(400).json({ error: 'Add an email or phone number for the receipt.' })
  const referenceCode = `CARMEL-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`
  const retainName = !input.anonymous
  const donation = await prisma.donation.create({ data: {
    referenceCode,
    amount: new Prisma.Decimal(input.amount),
    type: input.frequency,
    fund: input.fund,
    paymentMethod: input.payment,
    isAnonymous: input.anonymous,
    donorName: retainName ? input.name || null : null,
    donorEmail: retainName || input.receipt ? input.email || null : null,
    donorPhone: retainName || input.receipt ? input.phone || null : null,
    wantsReceipt: input.receipt,
    paymentReference: input.reference || null,
    status: input.reference ? 'RECONCILING' : 'PENDING',
  }, select: { referenceCode: true, amount: true, paymentMethod: true, isAnonymous: true, status: true, createdAt: true } })
  res.status(201).json({ donation })
}))
app.get('/api/donations/:reference', asyncRoute(async (req, res) => {
  const donation = await prisma.donation.findUnique({ where: { referenceCode: routeParam(req, 'reference') }, select: { referenceCode: true, amount: true, paymentMethod: true, isAnonymous: true, status: true, createdAt: true, fund: true } })
  if (!donation) return res.status(404).json({ error: 'Acknowledgment not found.' })
  res.json({ donation })
}))

const contactSchema = z.object({ name: z.string().trim().min(2).max(100), email: z.email(), subject: z.string().trim().min(3).max(160), category: z.enum(['DONATION', 'DISCERNER', 'GENERAL']).default('GENERAL'), message: z.string().trim().min(10).max(5000) })
app.post('/api/contact', asyncRoute(async (req, res) => {
  const parsed = validate(contactSchema, req.body)
  if (parsed.error) return res.status(400).json({ error: 'Please check the message form.', details: parsed.error })
  const input = parsed.data!
  const conversation = await prisma.conversation.create({ data: { name: input.name, email: input.email, subject: input.subject, category: input.category, messages: { create: { senderType: 'VISITOR', body: input.message } } }, select: { id: true, createdAt: true } })
  res.status(201).json({ conversationId: conversation.id, received: true })
}))

app.get('/api/monasteries', asyncRoute(async (_req, res) => {
  const monasteries = await prisma.monastery.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] })
  res.json({ monasteries })
}))
app.get('/api/updates', asyncRoute(async (_req, res) => {
  const updates = await prisma.update.findMany({ where: { publishedAt: { lte: new Date() } }, orderBy: { publishedAt: 'desc' } })
  res.json({ updates })
}))
app.get('/api/content/:pageKey', asyncRoute(async (req, res) => {
  const content = await prisma.pageContent.findUnique({ where: { pageKey: routeParam(req, 'pageKey').toUpperCase() } })
  if (!content) return res.status(404).json({ error: 'Page content not found.' })
  res.json({ content })
}))
app.get('/api/faqs', asyncRoute(async (_req, res) => {
  const faqs = await prisma.fAQ.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } })
  res.json({ faqs })
}))

app.get('/api/admin/donations', authenticate, allowRoles('ADMIN', 'FORMATOR'), asyncRoute(async (_req, res) => {
  const donations = await prisma.donation.findMany({ orderBy: { createdAt: 'desc' }, include: { beneficiaryMonastery: { select: { name: true } } } })
  res.json({ donations })
}))
const statusSchema = z.object({ status: z.enum(['PENDING', 'RECONCILING', 'VERIFIED', 'COMPLETED', 'FAILED']) })
app.patch('/api/admin/donations/:id/status', authenticate, allowRoles('ADMIN', 'FORMATOR'), asyncRoute(async (req, res) => {
  const parsed = validate(statusSchema, req.body)
  if (parsed.error) return res.status(400).json({ error: 'Invalid donation status.' })
  const donationId = routeParam(req, 'id')
  const previous = await prisma.donation.findUnique({ where: { id: donationId }, select: { status: true } })
  if (!previous) return res.status(404).json({ error: 'Donation not found.' })
  const donation = await prisma.donation.update({ where: { id: donationId }, data: { status: parsed.data!.status } })
  await audit(req.auth!.id, 'UPDATE_STATUS', 'Donation', donation.id, { from: previous.status, to: donation.status })
  res.json({ donation })
}))
app.get('/api/admin/conversations', authenticate, allowRoles('ADMIN', 'FORMATOR'), asyncRoute(async (_req, res) => {
  const conversations = await prisma.conversation.findMany({ orderBy: { lastMessageAt: 'desc' }, include: { messages: { orderBy: { createdAt: 'asc' } } } })
  res.json({ conversations })
}))
const replySchema = z.object({ body: z.string().trim().min(1).max(5000) })
app.post('/api/admin/conversations/:id/messages', authenticate, allowRoles('ADMIN', 'FORMATOR'), asyncRoute(async (req, res) => {
  const parsed = validate(replySchema, req.body)
  if (parsed.error) return res.status(400).json({ error: 'A reply cannot be empty.' })
  const conversation = await prisma.conversation.findUnique({ where: { id: routeParam(req, 'id') }, select: { id: true } })
  if (!conversation) return res.status(404).json({ error: 'Conversation not found.' })
  const message = await prisma.$transaction(async (tx) => {
    const created = await tx.message.create({ data: { conversationId: conversation.id, senderType: 'ADMIN', body: parsed.data!.body } })
    await tx.conversation.update({ where: { id: conversation.id }, data: { lastMessageAt: new Date() } })
    await tx.auditLog.create({ data: { userId: req.auth!.id, action: 'REPLY', entity: 'Conversation', entityId: conversation.id } })
    return created
  })
  res.status(201).json({ message })
}))
app.get('/api/admin/audit', authenticate, allowRoles('ADMIN'), asyncRoute(async (_req, res) => {
  const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 300, include: { user: { select: { name: true, email: true } } } })
  res.json({ logs })
}))

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error)
  res.status(500).json({ error: 'The request could not be completed. Please try again.' })
})
const server = app.listen(port, () => console.log(`Carmel API listening on http://localhost:${port}`))
async function shutdown() { server.close(); await prisma.$disconnect() }
process.on('SIGINT', () => void shutdown())
process.on('SIGTERM', () => void shutdown())
