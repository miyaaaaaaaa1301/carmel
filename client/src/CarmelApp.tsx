import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { BrowserRouter, Link, Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Banknote, Bell, Check, ChevronDown, Clipboard, FileText, HandHeart, Home, Image, LogOut, Mail, Menu, MessageCircle, Search, Settings, ShieldCheck, Smartphone, User, Users, X } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import './Carmel.css'

const cities = ['Angeles', 'Bacolod', 'Baguio', 'Cagayan de Oro', 'Castillejos', 'Cebu', 'Davao', 'Gumaca', 'Infanta']
const nav = [['Home', '/'], ['Our Monastery', '/monasteries'], ['Carmelife', '/carmelife'], ['Carmelights', '/carmelights'], ['About us', '/about'], ['Donations', '/donations'], ['Updates', '/updates'], ['Contact us', '/contact']]
const photo = {
  hero: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=2000&q=85',
  flower: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=85',
  chapel: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85',
  garden: 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1200&q=85',
  cosmos: 'https://images.unsplash.com/photo-1494972308805-463bc619d34e?auto=format&fit=crop&w=1800&q=85',
}
const money = (n: number) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(n)

function Brand({ light = false }: { light?: boolean }) {
  return <Link to="/" className={`brand ${light ? 'brand-light' : ''}`}><span className="brand-mark"><HandHeart size={21} /></span><span>Carmels in<br /><b>Communion</b></span></Link>
}
function Navbar() {
  const [open, setOpen] = useState(false)
  return <header className="site-header"><Brand /><button className="mobile-menu icon-button" aria-label="Toggle menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button><nav className={`main-nav ${open ? 'open' : ''}`}>{nav.map(([label, path]) => <NavLink key={path} to={path} end={path === '/'} onClick={() => setOpen(false)}>{label}</NavLink>)}</nav><div className="header-actions"><button className="search-trigger" aria-label="Search"><Search size={16} /></button><Link className="button button-dark button-small" to="/login">Sign in <ArrowUpRight size={14} /></Link></div></header>
}
function Footer() {
  return <footer className="site-footer"><div className="footer-main"><div className="footer-about"><Brand light /><p>A communion of Carmelite monasteries, living the Teresian charism in the heart of the Church.</p></div><div><h3>Explore</h3><Link to="/about">About us</Link><Link to="/monasteries">Our monasteries</Link><Link to="/updates">News & updates</Link></div><div><h3>Connect with us</h3><a href="tel:+639214192267">0921 419 2267</a><a href="mailto:ocdnuns.vocpromph@gmail.com">ocdnuns.vocpromph@gmail.com</a><a href="https://facebook.com">Carmels in Communion on Facebook</a></div><div><h3>Our location</h3><p>Brgy. Tongohin, Purok Nagsusumikap<br />Karmelo, Infanta, Quezon</p><Link to="/contact">Contact us <ArrowUpRight size={14} /></Link></div></div><div className="footer-bottom"><span>© 2026 Philippine Federation of Discalced Carmelite Nuns</span><span>Data Privacy Act of 2012 · Terms of Service · Privacy Policy</span></div></footer>
}
function PublicLayout({ children }: { children: ReactNode }) { return <><Navbar /><main>{children}</main><Footer /></> }
function HomePage() {
  const cards = [{ label: 'WHO WE ARE', title: 'The Federation', to: '/about', img: photo.chapel }, { label: 'OUR WAY OF LIFE', title: 'Vocation & Charism', to: '/carmelife', img: photo.garden }, { label: 'SISTERS’ STORIES', title: 'Vocation Stories', to: '/carmelights', img: photo.flower }, { label: 'FROM THE FEDERATION', title: 'News & Updates', to: '/updates', img: photo.cosmos }, { label: 'FIND YOUR CARMEL', title: 'Our Communities', to: '/monasteries', img: photo.hero }]
  return <><section className="home-hero" style={{ backgroundImage: `linear-gradient(90deg,rgba(37,28,21,.19),rgba(37,28,21,.03)),url(${photo.hero})` }}><div className="hero-content"><span className="eyebrow eyebrow-light">A HOME FOR THE SEEKING HEART</span><h1>Carmels in<br /><em>Communion</em></h1><p>Welcome to the Philippine Federation of Discalced Carmelite Nuns, a family of communities sharing one contemplative heart.</p><div className="hero-buttons"><Link className="button button-gold" to="/about">Explore our story <ArrowRight size={16} /></Link><Link className="button button-glass" to="/monasteries">Meet our monasteries</Link></div></div><div className="hero-caption"><span>“Let nothing disturb you, let nothing frighten you.”</span><small>ST. TERESA OF AVILA</small></div></section><section className="marquee-wrap"><div className="marquee-label">Philippine Federation<br />of Discalced Carmelite Nuns</div><div className="marquee-window"><div className="marquee-track">{[...cities, ...cities].map((city, i) => <span key={`${city}-${i}`}>{city}<i>·</i></span>)}</div></div><ArrowRight size={18} /></section><section className="vocation-section section-wrap"><div className="vocation-image"><img src={photo.flower} alt="White flowers in a monastery garden" /><span className="image-note">A life held in prayer</span></div><div className="vocation-copy"><span className="eyebrow">A QUIET INVITATION</span><h2>Is <em>God</em> calling you to a life of prayer?</h2><p>There is a place for the listening heart. Discover the contemplative vocation and the sisters who make their home in Carmel.</p><Link className="text-link" to="/monasteries">Meet our monasteries <ArrowRight size={16} /></Link><div className="handwritten">Come and see <span>↗</span></div></div></section><section className="explore-section"><div className="section-wrap"><div className="section-heading-row"><div><span className="eyebrow">WALK WITH US</span><h2>Explore <em>Carmel</em></h2></div><p>Are you discerning if God is calling you to Carmel? Let us assist you.</p></div><div className="explore-grid">{cards.map((card) => <Link className="explore-card" key={card.title} to={card.to} style={{ backgroundImage: `linear-gradient(180deg,transparent 10%,rgba(35,26,20,.8)),url(${card.img})` }}><span>{card.label}</span><div><h3>{card.title}</h3><b>Learn more <ArrowRight size={14} /></b></div></Link>)}</div></div></section><section className="quote-banner" style={{ backgroundImage: `linear-gradient(90deg,rgba(43,32,24,.15),rgba(43,32,24,.78)),url(${photo.cosmos})` }}><div className="quote-content"><span className="quote-mark">“</span><p>Carmel is not merely a geographical place, but a sacred space in the cloister of the heart where the Carmelite nun encounters God.</p><Link className="button button-light" to="/contact">We’d love to hear from you <ArrowRight size={15} /></Link></div></section></>
}
const purposes = ['To respond to the desire of St. Teresa that her Carmels be bound together by evangelical friendship.', 'To realize the desire of the Church and the Order to have close beneficial ties among the member monasteries.', 'To help each other live more faithfully the Teresian ideal of the canonical contemplative life.', 'To facilitate communication and mutual assistance in formation, government, practical skills, material and economic needs, and transfer of nuns among member monasteries.']
function AboutPage() {
  return <><section className="page-intro section-wrap"><span className="eyebrow">A FAMILY OF COMMUNITIES</span><h1>About <em>Us</em></h1><p>The Philippine Federation of Discalced Carmelite Nuns is a structure of communion among its 23 Carmelite monastery members, who all embrace the Teresian Charism.</p><Link className="button button-dark" to="/contact">Talk to us <ArrowRight size={15} /></Link></section><section className="aim-band"><div className="aim-inner"><div className="aim-copy"><span className="eyebrow eyebrow-gold">OUR PURPOSE</span><h2>AIM</h2><p>The Federation aims to make visible the unity which Jesus prayed for among His disciples.</p></div><div className="aim-words"><span>Communion.</span><span>Collaboration.</span><span>Contemplation.</span><span>Mission.</span></div></div></section><section className="assembly section-wrap"><div className="assembly-image" style={{ backgroundImage: `url(${photo.hero})` }} /><p>14th General Assembly of the Philippine Federation of Discalced Carmelite Nuns · Mere Monique Home, La Paz, Iloilo City · November 7–12, 2022</p><div className="assembly-image assembly-image-short" style={{ backgroundImage: `url(${photo.chapel})` }} /><p>Elected Officers (2022–2024) with Father General Miguel Calle, OCD, Definitor Fr. Chris Surinono, OCD, and Religious Assistant Fr. Dan Lim, OCD</p></section><section className="purpose-section section-wrap"><div className="section-heading-row"><div><span className="eyebrow">THE FEDERATION</span><h2>Our <em>purposes</em></h2><span className="gold-rule" /></div><p>Four ways we help our communities remain close in friendship and in mission.</p></div><div className="purpose-grid">{purposes.map((text, i) => <article className="purpose-card" key={text}><img src={[photo.garden, photo.chapel, photo.flower, photo.cosmos][i]} alt="Carmelite monastery life" /><span>0{i + 1}</span><p>{text}</p></article>)}</div></section><section className="saint-quote"><img src={photo.flower} alt="White flowers" /><div><span>“</span><blockquote>All must be friends, all must be loved, all must be held dear, all must be helped.</blockquote><small>ST. TERESA OF AVILA · WAY OF PERFECTION 4:7</small></div></section></>
}
function MonasteriesPage() {
  const [query, setQuery] = useState('')
  const places = [...cities, 'Iloilo', 'Lipa', 'Manila', 'Lucena', 'Ozamis', 'Tuguegarao', 'Zamboanga', 'Tagaytay', 'Quezon City', 'Cebu City', 'Cotabato', 'Antipolo', 'San Jose']
  return <section className="content-page section-wrap"><span className="eyebrow">FIND A COMMUNITY</span><h1>Our <em>Monasteries</em></h1><p className="page-lead">Twenty-three communities, one contemplative family. Find a Carmel near you.</p><label className="field-search"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by city" /></label><div className="monastery-grid">{places.filter((place) => place.toLowerCase().includes(query.toLowerCase())).map((place, i) => <article className="monastery-card" key={place}><img src={[photo.chapel, photo.garden, photo.hero][i % 3]} alt={`Monastery near ${place}`} /><div><span className="eyebrow">CARMEL IN THE PHILIPPINES</span><h3>Our Lady of {['Mount Carmel', 'the Rosary', 'Grace'][i % 3]}</h3><p>{place}, Philippines</p><a href="mailto:ocdnuns.vocpromph@gmail.com" className="text-link">Contact community <ArrowRight size={15} /></a></div></article>)}</div></section>
}
function StoryPage({ kind }: { kind: 'life' | 'stories' | 'updates' }) {
  const title = kind === 'life' ? 'Carmelife' : kind === 'stories' ? 'Carmelights' : 'News & Updates'
  const desc = kind === 'life' ? 'A contemplative life rooted in prayer, sisterhood, and the search for God.' : kind === 'stories' ? 'Small glimpses of vocation, friendship, and grace from our Carmelite sisters.' : 'The latest gatherings, reflections, and moments from the Federation.'
  const articles = kind === 'life' ? ['A day in Carmel', 'Prayer at the heart of the Church', 'The Teresian charism'] : kind === 'stories' ? ['A heart that learned to listen', 'Finding home in the silence', 'The joy of ordinary days'] : ['14th General Assembly', 'A season of prayer and renewal', 'Remembering our shared mission']
  return <section className="content-page section-wrap"><span className="eyebrow">{kind === 'life' ? 'A CONTEMPLATIVE WAY' : kind === 'stories' ? 'VOICES FROM CARMEL' : 'FROM OUR COMMUNITIES'}</span><h1>{title}</h1><p className="page-lead">{desc}</p><div className="story-grid">{articles.map((article, i) => <article className="story-card" key={article}><img src={[photo.garden, photo.flower, photo.chapel][i]} alt="A glimpse of Carmelite life" /><div><span className="eyebrow">{kind === 'updates' ? 'FEDERATION NEWS' : 'CARMELITE LIFE'}</span><h3>{article}</h3><p>In the quiet rhythm of community life, every day offers a new way to listen and to love.</p><a className="text-link" href="#read">Read story <ArrowRight size={15} /></a></div></article>)}</div></section>
}
function ContactPage() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSending(true)
    setError('')
    const values = new FormData(event.currentTarget)
    const name = String(values.get('name') || '')
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email: values.get('email'), category: values.get('category'), subject: `Website message from ${name}`, message: values.get('message') }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Your message could not be sent.')
      setSent(true)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'The message service is unavailable. Please try again.')
    } finally {
      setSending(false)
    }
  }
  return <section className="contact-page section-wrap"><div className="contact-copy"><span className="eyebrow">WE’RE HERE TO LISTEN</span><h1>Let’s <em>talk.</em></h1><p>Whether you have a question about Carmel, a donation, or your own discernment, you are welcome to write to us.</p><div className="contact-detail"><Mail size={18} /><span><b>Email</b><br />ocdnuns.vocpromph@gmail.com</span></div><div className="contact-detail"><Smartphone size={18} /><span><b>Call or text</b><br />0921 419 2267</span></div></div><form className="contact-form" onSubmit={submitContact}>{sent ? <div className="success-state"><span><Check /></span><h2>Your message is with us.</h2><p>Thank you for reaching out. We’ll be in touch soon.</p><button className="text-link" type="button" onClick={() => setSent(false)}>Send another message</button></div> : <><label>Your name<input name="name" required minLength={2} placeholder="Name" /></label><label>Email address<input name="email" type="email" required placeholder="you@example.com" /></label><label>What would you like to talk about?<select name="category" defaultValue="GENERAL"><option value="GENERAL">A general question</option><option value="DISCERNER">Vocation discernment</option><option value="DONATION">A donation</option></select></label><label>Your message<textarea name="message" required minLength={10} rows={4} placeholder="Write your message here…" /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-dark" type="submit" disabled={sending}>{sending ? 'Sending…' : <>Send message <ArrowRight size={16} /></>}</button></>}</form></section>
}

type Donation = { amount: number; custom: string; frequency: 'ONE_TIME' | 'MONTHLY'; payment: 'GCASH' | 'MAYA' | 'BANK' | 'CARD'; anonymous: boolean; name: string; email: string; phone: string; receipt: boolean; reference: string }
const initialDonation: Donation = { amount: 1000, custom: '', frequency: 'ONE_TIME', payment: 'GCASH', anonymous: true, name: '', email: '', phone: '', receipt: false, reference: '' }
const giftAmounts = [500, 1000, 2500, 5000]
const giftLabels = ['Daily food & nutrition', 'Medicines & health care', 'Young sisters’ formation', 'Infirmary & monastery upkeep']
const steps = ['Select amount', 'Payment method', 'Your details', 'Review & complete']
function DonationsPage() {
  const [gift, setGift] = useState<Donation>(() => { try { return { ...initialDonation, ...JSON.parse(sessionStorage.getItem('carmel-gift') || '{}') } } catch { return initialDonation } })
  const [step, setStep] = useState(0)
  const [receiptCode, setReceiptCode] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [showCustom, setShowCustom] = useState(false)
  const [faqOpen, setFaqOpen] = useState<number | null>(0)
  const amount = gift.custom ? Number(gift.custom) || 0 : gift.amount
  useEffect(() => { sessionStorage.setItem('carmel-gift', JSON.stringify(gift)) }, [gift])
  function next() { setError(''); if (step === 0 && amount < 50) return setError('Please choose an amount of at least ₱50.'); if (step === 2 && !gift.anonymous && (!gift.name.trim() || !gift.email.includes('@'))) return setError('Please provide your name and a valid email address.'); if (step === 2 && gift.receipt && !gift.email && !gift.phone) return setError('Add an email address or phone number for your receipt.'); setStep(Math.min(step + 1, 3)) }
  async function complete() {
    setError('')
    try {
      const response = await fetch('/api/donations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...gift, amount }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Your offering could not be recorded.')
      setReceiptCode(result.donation.referenceCode)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'The donation service is unavailable. Please try again.')
    }
  }
  const faqs = [
    ['Can I truly give 100% anonymously?', 'Yes. If you choose “Give anonymously”, your name is not shown on public acknowledgments or community reports. If you share contact details for a private receipt, those are used only for that purpose.'],
    ['How do I pay using GCash or Maya?', 'Choose GCash or Maya, then send your gift using the account number shown in the final step. Add your payment reference number so the team can match your transfer.'],
    ['How does becoming a Church Monthly Sponsor work?', 'Choose Monthly Blessing when selecting your offering. Your commitment helps communities plan for ongoing formation and daily needs; transfers are still made manually each month.'],
    ['What do the automated SMS and Email reminders look like?', 'Reminders are brief, respectful notes about your monthly intention. They include the amount and how to update your sponsorship; you can opt out at any time.'],
    ['Can I change, pause, or cancel my monthly sponsorship anytime?', 'Yes. Monthly blessings are commitments, not automatic charges. You may change or pause future transfers by contacting the Federation.'],
    ['Will I receive an official church donation receipt?', 'You can request an acknowledgment receipt in this form. Official tax documentation depends on the Federation’s current accreditation and will be confirmed directly.'],
  ]
  return <div className="donations-page"><section className="donation-heading"><span className="eyebrow">SHARE YOUR BLESSINGS</span><h1>Your generosity helps<br />formation <em>flourish.</em></h1><p>Your donation supports the formation program of the Federation. Thank you for your generosity.</p><blockquote>“Bring the whole tithe into the storehouse, that there may be food in my house. Test me in this, says the Lord Almighty...”<small>MALACHI 3:10</small></blockquote></section>
    {!receiptCode ? <section className="donation-card"><div className="donation-card-head"><span>GIFT DETAILS</span><b>STEP {step + 1} <i>OF 4</i></b></div><div className="stepper">{steps.map((name, i) => <div className={`step-node ${i < step ? 'done' : ''} ${i === step ? 'current' : ''}`} key={name}><span>{i < step ? <Check size={14} /> : i + 1}</span><small>{name}</small></div>)}</div><div className="donation-step">
      {step === 0 && <><span className="eyebrow">STEP ONE</span><h2>Select your offering</h2><p>Choose a suggested gift or enter your own preferred amount.</p><div className="segmented"><button className={gift.frequency === 'ONE_TIME' ? 'selected' : ''} onClick={() => setGift({ ...gift, frequency: 'ONE_TIME' })}>One-time offering</button><button className={gift.frequency === 'MONTHLY' ? 'selected' : ''} onClick={() => setGift({ ...gift, frequency: 'MONTHLY' })}>Monthly blessing</button></div><div className="amount-grid">{giftAmounts.map((value, i) => <button className={`amount-option ${!gift.custom && gift.amount === value ? 'selected' : ''}`} key={value} onClick={() => setGift({ ...gift, amount: value, custom: '' })}>{i === 1 && <span className="amount-badge">MOST FREQUENT</span>}<strong>{money(value).replace('.00', '')}</strong><small>{giftLabels[i]}</small></button>)}</div><button className="custom-toggle" onClick={() => setShowCustom(!showCustom)}>{showCustom ? '− Hide custom amount' : '+ Enter a different amount'}</button>{showCustom && <label className="input-label">Your amount (minimum ₱50)<span className="currency-input"><b>₱</b><input type="number" min={50} value={gift.custom} onChange={(e) => setGift({ ...gift, custom: e.target.value })} placeholder="0.00" /></span></label>}<div className="selected-offering">Selected offering <b>{money(amount)} · {gift.frequency === 'ONE_TIME' ? 'One-time' : 'Monthly'}</b></div></>}
      {step === 1 && <><span className="eyebrow">STEP TWO</span><h2>Choose payment method</h2><p>Select the channel you find most comfortable and familiar.</p><div className="payment-options">{[['GCASH', 'G', 'GCash mobile wallet', 'Send via QR code or mobile number'], ['MAYA', 'M', 'Maya (PayMaya)', 'Send via Maya QR code or account'], ['BANK', '⌂', 'Bank transfer', 'BPI / BDO direct transfer'], ['CARD', '▣', 'Debit / credit card', 'Visa or Mastercard secure checkout']].map(([id, symbol, title, desc]) => <button key={id} className={`payment-option ${gift.payment === id ? 'selected' : ''}`} onClick={() => setGift({ ...gift, payment: id as Donation['payment'] })}><span className={`payment-symbol ${id.toLowerCase()}`}>{symbol}</span><span><b>{title}</b><small>{desc}</small></span><i className="radio-dot" /></button>)}</div>{gift.payment === 'CARD' && <p className="notice">Card checkout is coming soon. Choose GCash, Maya, or bank transfer to complete the offering.</p>}</>}
      {step === 2 && <><span className="eyebrow">STEP THREE</span><h2>Donor information</h2><p>You may offer this quietly without leaving your name, or share your name.</p><div className="anonymous-options"><button className={gift.anonymous ? 'selected' : ''} onClick={() => setGift({ ...gift, anonymous: true })}><ShieldCheck /><b>Give anonymously</b><small>No name stored</small></button><button className={!gift.anonymous ? 'selected' : ''} onClick={() => setGift({ ...gift, anonymous: false })}><User /><b>Include my name</b><small>For monastery records</small></button></div>{!gift.anonymous && <div className="donor-fields"><label>Your name<input value={gift.name} onChange={(e) => setGift({ ...gift, name: e.target.value })} placeholder="Full name" /></label><label>Email address<input type="email" value={gift.email} onChange={(e) => setGift({ ...gift, email: e.target.value })} placeholder="you@example.com" /></label><label>Phone number<input type="tel" value={gift.phone} onChange={(e) => setGift({ ...gift, phone: e.target.value })} placeholder="+63" /></label></div>}<label className="check-row"><input type="checkbox" checked={gift.receipt} onChange={(e) => setGift({ ...gift, receipt: e.target.checked })} /><span>Send acknowledgment receipt by SMS or Email <small>(Optional)</small></span></label></>}
      {step === 3 && <><span className="eyebrow">STEP FOUR</span><h2>Review & complete</h2><p>Please check the details below and send your offering.</p><div className="review-box"><div><small>OFFERING AMOUNT</small><strong>{money(amount)}</strong></div><div><small>PAYMENT CHANNEL</small><b>{gift.payment}</b></div><div><small>DONOR</small><b>{gift.anonymous ? 'Anonymous Benefactor' : gift.name}</b></div></div>{gift.payment === 'CARD' ? <div className="notice">Card checkout is coming soon. Select another payment method to continue.</div> : <div className="payment-instructions"><div className="qr-placeholder"><span>SCAN<br />TO GIVE</span><i>GCASH · MAYA</i></div><div><small>ACCOUNT</small><b>FEDERATION OF DISCALCED CARMELITE NUNS</b><div className="account-number">0921-419-2267 <button onClick={() => { navigator.clipboard?.writeText('0921-419-2267'); setCopied(true); setTimeout(() => setCopied(false), 1600) }} aria-label="Copy account number">{copied ? <Check size={15} /> : <Clipboard size={15} />}{copied ? 'Copied!' : 'Copy'}</button></div></div><label>Payment reference number <small>(optional)</small><input value={gift.reference} onChange={(e) => setGift({ ...gift, reference: e.target.value })} placeholder="From your GCash / bank SMS" /></label><button className="button button-gold full-button" onClick={complete}>I have sent {money(amount)} <ArrowRight size={16} /></button></div>}</>}{error && <p className="form-error">{error}</p>}</div><div className="donation-card-foot"><button className="button button-outline" disabled={step === 0} onClick={() => { setError(''); setStep(Math.max(0, step - 1)) }}><ArrowLeft size={15} /> Back</button><span>{steps[step]}</span>{step < 3 && <button className="button button-dark" onClick={next}>Continue <ArrowRight size={15} /></button>}</div></section> : <section className="confirmation-card"><span className="confirm-icon"><Check /></span><span className="eyebrow">OFFICIAL ACKNOWLEDGMENT · PENDING VERIFICATION</span><h2>Thank you for your generosity.</h2><p>May God reward your kindness. Your offering directly sustains our elder cloistered sisters across the Philippines.</p><div className="receipt"><b>OFFICIAL ACKNOWLEDGMENT</b><strong>{receiptCode}</strong><span>Beneficiary <b>Discalced Carmelite Nuns</b></span><span>Offering amount <b>{money(amount)}</b></span><span>Payment method <b>{gift.payment}</b></span><span>Donor <b>{gift.anonymous ? 'Anonymous Benefactor' : gift.name}</b></span><span>Date <b>{new Date().toLocaleDateString('en-PH')}</b></span></div><div className="confirmation-actions"><button className="button button-outline" onClick={() => window.print()}><FileText size={16} /> Print receipt</button><button className="button button-dark" onClick={() => { setReceiptCode(''); setStep(0); setGift(initialDonation); sessionStorage.removeItem('carmel-gift') }}>Make another offering <ArrowRight size={15} /></button></div></section>}
    {!receiptCode && <div className="trust-row"><span><ShieldCheck />100% Direct to Monasteries</span><span><User />Anonymous Giving Supported</span><span><Smartphone />Helpline: (0921) 419-2267</span></div>}<section className="faq-section section-wrap"><span className="eyebrow">HERE TO HELP</span><h2>Frequently asked <em>questions</em></h2><p>Everything you need to know about giving, anonymity, GCash, and monthly sponsorship.</p><div className="faq-list">{faqs.map(([q, a], i) => <div className={`faq-item ${faqOpen === i ? 'open' : ''}`} key={q}><button onClick={() => setFaqOpen(faqOpen === i ? null : i)} aria-expanded={faqOpen === i}><span>{q}</span>{faqOpen === i ? <X size={17} /> : <ChevronDown size={17} />}</button>{faqOpen === i && <p>{a}</p>}</div>)}</div></section></div>
}
type StaffRole = 'ADMIN' | 'FORMATOR'
type PrototypeStaff = { id: string; name: string; email: string; role: StaffRole; passwordHash: string }
const prototypeStaffKey = 'carmel-prototype-staff'
const prototypeSessionKey = 'carmel-prototype-session'
const demoAdmin: PrototypeStaff = { id: 'prototype-admin', name: 'Demo Administrator', email: 'admin@carmel.test', role: 'ADMIN', passwordHash: '' }

function readPrototypeStaff(): PrototypeStaff[] {
  try { return JSON.parse(localStorage.getItem(prototypeStaffKey) || '[]') as PrototypeStaff[] } catch { return [] }
}
function readPrototypeSession(): PrototypeStaff | null {
  try { return JSON.parse(localStorage.getItem(prototypeSessionKey) || 'null') as PrototypeStaff | null } catch { return null }
}
async function hashPrototypePassword(password: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password))
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function LoginPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') || '').trim().toLowerCase()
    const password = String(form.get('password') || '')
    try {
      const localStaff = readPrototypeStaff().find((staff) => staff.email === email)
      if (email === demoAdmin.email && password === 'CarmelDemo2026!') {
        localStorage.setItem(prototypeSessionKey, JSON.stringify(demoAdmin))
        navigate('/admin', { replace: true })
        return
      }
      if (localStaff && await hashPrototypePassword(password) === localStaff.passwordHash) {
        localStorage.setItem(prototypeSessionKey, JSON.stringify(localStaff))
        navigate('/admin', { replace: true })
        return
      }
      if (localStaff) throw new Error('Email or password is incorrect.')
      const response = await fetch('/api/auth/login', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Unable to sign in.')
      if (!['ADMIN', 'FORMATOR'].includes(result.user?.role)) throw new Error('This account does not have administration access.')
      navigate('/admin', { replace: true })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to connect to the sign-in service.')
    } finally {
      setPending(false)
    }
  }
  return <section className="login-page"><div className="login-art" style={{ backgroundImage: `linear-gradient(180deg,rgba(45,32,24,.12),rgba(45,32,24,.82)),url(${photo.chapel})` }}><Brand light /><p>“In the interior castle,<br />we meet the One who waits.”</p></div><form className="login-form" onSubmit={signIn}><Link to="/" className="back-link"><ArrowLeft size={15} /> Back to the website</Link><span className="eyebrow">ADMINISTRATION</span><h1>Welcome <em>back.</em></h1><p>Sign in to manage the Federation website.</p><label>Email address<input name="email" type="email" required placeholder="name@example.com" /></label><label>Password<input name="password" type="password" required placeholder="Enter your password" /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-dark full-button" disabled={pending}>{pending ? 'Signing in…' : <>Sign in <ArrowRight size={16} /></>}</button><p className="prototype-note">Prototype Admin: <b>admin@carmel.test</b> · <b>CarmelDemo2026!</b></p><Link className="signup-link" to="/signup">Create a Formator staff account <ArrowRight size={14} /></Link></form></section>
}

function SignupPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  async function signUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') || '').trim()
    const email = String(form.get('email') || '').trim().toLowerCase()
    const password = String(form.get('password') || '')
    try {
      if (readPrototypeStaff().some((staff) => staff.email === email) || email === demoAdmin.email) throw new Error('An account with this email already exists.')
      const staff: PrototypeStaff = { id: crypto.randomUUID(), name, email, role: 'FORMATOR', passwordHash: await hashPrototypePassword(password) }
      localStorage.setItem(prototypeStaffKey, JSON.stringify([...readPrototypeStaff(), staff]))
      localStorage.setItem(prototypeSessionKey, JSON.stringify(staff))
      navigate('/admin', { replace: true })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to create the prototype account.')
    } finally {
      setPending(false)
    }
  }
  return <section className="login-page"><div className="login-art" style={{ backgroundImage: `linear-gradient(180deg,rgba(45,32,24,.12),rgba(45,32,24,.82)),url(${photo.chapel})` }}><Brand light /><p>“In the interior castle,<br />we meet the One who waits.”</p></div><form className="login-form" onSubmit={signUp}><Link to="/login" className="back-link"><ArrowLeft size={15} /> Back to sign in</Link><span className="eyebrow">FORMATOR STAFF</span><h1>Create an <em>account.</em></h1><p>Join the Federation office team. This prototype stores your account in this browser only.</p><label>Full name<input name="name" required minLength={2} maxLength={100} placeholder="Your name" /></label><label>Email address<input name="email" type="email" required placeholder="name@example.com" /></label><label>Password<input name="password" type="password" required minLength={10} maxLength={128} placeholder="At least 10 characters" /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-dark full-button" disabled={pending}>{pending ? 'Creating account…' : <>Create Formator account <ArrowRight size={16} /></>}</button><p className="prototype-note">New accounts receive the Formator staff role. An Admin can manage staff access.</p></form></section>
}

const transactions = [{ purpose: 'Formation program', monastery: 'Infanta', donor: 'Anonymous', date: 'Sep 24, 2026', amount: 5000, status: 'COMPLETED' }, { purpose: 'Medicines & health care', monastery: 'Baguio', donor: 'Maria Santos', date: 'Sep 23, 2026', amount: 2500, status: 'VERIFIED' }, { purpose: 'Daily food & nutrition', monastery: 'Cebu', donor: 'Anonymous', date: 'Sep 22, 2026', amount: 1000, status: 'RECONCILING' }, { purpose: 'Young sisters’ formation', monastery: 'Davao', donor: 'Ana Reyes', date: 'Sep 21, 2026', amount: 5000, status: 'COMPLETED' }, { purpose: 'Monastery upkeep', monastery: 'Bacolod', donor: 'Anonymous', date: 'Sep 20, 2026', amount: 500, status: 'VERIFIED' }]
const chartData = [{ month: 'Jan', amount: 42500, donors: 22 }, { month: 'Feb', amount: 51700, donors: 29 }, { month: 'Mar', amount: 48600, donors: 26 }, { month: 'Apr', amount: 68900, donors: 38 }, { month: 'May', amount: 59800, donors: 34 }, { month: 'Jun', amount: 79300, donors: 43 }, { month: 'Jul', amount: 74800, donors: 41 }, { month: 'Aug', amount: 92600, donors: 51 }, { month: 'Sep', amount: 108500, donors: 62 }]
const conversations = [{ name: 'Maria Santos', email: 'maria.santos@email.com', subject: 'Monthly offering receipt', text: 'Thank you for confirming my contribution…', time: '10:42 AM', type: 'Donation', unread: true, color: 'rose' }, { name: 'Ana Reyes', email: 'ana.reyes@email.com', subject: 'Discernment and visits', text: 'I have been thinking about visiting…', time: 'Yesterday', type: 'Discerner', unread: true, color: 'gold' }, { name: 'John Dela Cruz', email: 'john.dc@email.com', subject: 'Bank transfer question', text: 'Could you help me verify a transfer?', time: 'Sep 25', type: 'Donation', unread: false, color: 'green' }, { name: 'Rosa Villanueva', email: 'rosa.v@email.com', subject: 'A note to the sisters', text: 'Please include our family in your prayers…', time: 'Sep 24', type: 'General', unread: false, color: 'blue' }]
function AdminShell({ children, user }: { children: ReactNode; user: PrototypeStaff }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [clock, setClock] = useState(new Date())
  useEffect(() => { const timer = setInterval(() => setClock(new Date()), 60000); return () => clearInterval(timer) }, [])
  const allLinks = [['Dashboard', '/admin', Home], ['Messages', '/admin/messages', MessageCircle], ['Updates', '/admin/updates', FileText], ['Manage users', '/admin/users', Users], ['Donations', '/admin/donations', HandHeart], ['Manage details', '/admin/content', Image], ['Audit logs', '/admin/audit', Clipboard]] as const
  const links = user.role === 'ADMIN' ? allLinks : allLinks.filter(([, path]) => ['/admin', '/admin/messages', '/admin/donations'].includes(path))
  function signOut() { localStorage.removeItem(prototypeSessionKey); void fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {}) }
  return <div className="admin-layout"><aside className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`}><Brand light /><div className="admin-role">{user.role === 'ADMIN' ? 'FEDERATION ADMIN' : 'FORMATOR STAFF'}</div><nav>{links.map(([label, path, Icon]) => <NavLink key={path} to={path} end={path === '/admin'} onClick={() => setMobileOpen(false)}><Icon size={17} />{label}{label === 'Messages' && <i className="unread-count">2</i>}</NavLink>)}</nav><div className="sidebar-bottom"><span>{clock.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span><b>{clock.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</b><Link to="/" onClick={signOut}><LogOut size={15} /> Sign out</Link></div></aside><div className="admin-main"><header className="admin-topbar"><button className="icon-button admin-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Open menu"><Menu /></button><div className="admin-search"><Search size={17} /><input placeholder="Search donations, donors, or messages..." /></div><div className="admin-top-actions"><button aria-label="Notifications"><Bell size={19} /><i /></button><button aria-label="Settings"><Settings size={18} /></button><span className="admin-user"><i>{user.name[0]?.toUpperCase()}</i><span>{user.name}<small>{user.role === 'ADMIN' ? 'Administrator' : 'Formator'}</small></span><ChevronDown size={14} /></span></div></header><div className="admin-content">{children}</div></div></div>
}
function StatCard({ label, value, sub, tone, badge }: { label: string; value: string; sub: string; tone: string; badge?: string }) { return <article className={`stat-card ${tone}`}><div className="stat-top"><span>{label}</span><span className="stat-icon"><Banknote size={18} /></span></div><div className="stat-value">{value}{badge && <small>{badge}</small>}</div><p>{sub}</p><span className="stat-trend">↗ 12.8% <i>this month</i></span></article> }
function DashboardPage() {
  const [mode, setMode] = useState('Both')
  const [selected, setSelected] = useState(chartData[8])
  const [statuses, setStatuses] = useState(transactions.map((row) => row.status))
  const cycle = (i: number) => { const order = ['PENDING', 'RECONCILING', 'VERIFIED', 'COMPLETED']; setStatuses(statuses.map((s, n) => n === i ? order[(order.indexOf(s) + 1) % order.length] : s)) }
  const exportCsv = () => { const csv = ['Purpose,Beneficiary,Donor,Date,Amount,Status', ...transactions.map((r, i) => `${r.purpose},${r.monastery},${r.donor},${r.date},${r.amount},${statuses[i]}`)].join('\n'); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'carmel-donations.csv'; a.click() }
  return <><div className="admin-title-row"><div><span className="eyebrow">OVERVIEW</span><h1>Dashboard</h1><p>A quiet look at the Federation’s giving and connections.</p></div><button className="button button-dark" onClick={exportCsv}><ArrowDown size={15} /> Export donations CSV</button></div><div className="stat-grid"><StatCard label="GROSS OFFERINGS" value="₱486,720" sub="Total federation contributions" tone="brown" /><StatCard label="NET MONASTERY SUPPORT" value="₱486,720" sub="100% directly to Carmelite monasteries" tone="green" /><StatCard label="PLATFORM FEE" value="₱0" sub="100% non-profit church mission" tone="gold" badge="0%" /></div><div className="dashboard-middle"><section className="admin-panel chart-panel"><div className="panel-heading"><div><h2>Monthly donators & total amount</h2><p>Tracks active monthly supporters alongside offering volume.</p></div><span className="date-pill">2026 Year-to-date <ChevronDown size={14} /></span></div><div className="chart-switch">{['Both', 'Amount (₱)', 'Donor count'].map((m) => <button className={mode === m ? 'active' : ''} onClick={() => setMode(m)} key={m}>{m}</button>)}</div><div className="chart-summary"><span>Selected month <b>{selected.month} 2026</b></span><span>Total offerings <b>₱{selected.amount.toLocaleString()}</b></span><span>Monthly donators <b>{selected.donors}</b></span></div><div className="chart-area"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} onMouseMove={(s: any) => { if (s?.activePayload?.[0]?.payload) setSelected(s.activePayload[0].payload) }} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}><defs><linearGradient id="givingFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b5e3c" stopOpacity={0.2} /><stop offset="95%" stopColor="#8b5e3c" stopOpacity={0.01} /></linearGradient></defs><CartesianGrid strokeDasharray="3 5" vertical={false} stroke="#eee6dc" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8f8378', fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#8f8378', fontSize: 10 }} tickFormatter={(v) => `${v / 1000}k`} /><Tooltip /><Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />{mode !== 'Donor count' && <Area type="monotone" dataKey="amount" name="Offering amount" stroke="#8b5e3c" fill="url(#givingFill)" strokeWidth={2.5} />}{mode !== 'Amount (₱)' && <Line type="monotone" dataKey="donors" name="Monthly donators" stroke="#729278" strokeWidth={2.5} dot={{ r: 3 }} />}</AreaChart></ResponsiveContainer></div></section><section className="admin-panel demographics-panel"><div className="panel-heading"><div><h2>Visitor demographics</h2><p>Benefactor profile distribution</p></div><span className="more-dots">···</span></div><div className="donut-wrap"><div className="donut" /><div className="donut-label"><b>1,420</b><small>TOTAL DONORS</small></div></div><div className="donut-legend"><span><i className="dot female" />Female donors <b>48% · 682</b></span><span><i className="dot male" />Male donors <b>31% · 440</b></span><span><i className="dot anon" />Anonymous / not specified <b>21% · 298</b></span></div></section></div><section className="admin-panel transactions-panel"><div className="panel-heading"><div><h2>Recent transactions</h2><p>8 transactions recorded · showing the latest activity</p></div><Link to="/admin/donations" className="text-link">View all <ArrowRight size={15} /></Link></div><div className="table-scroll"><table><thead><tr>{['FUND / PURPOSE', 'BENEFICIARY', 'BENEFACTOR / DONOR', 'DATE', 'GROSS AMOUNT', 'PLATFORM TAKE', 'NET SUPPORT', 'STATUS'].map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{transactions.map((r, i) => <tr key={r.purpose}><td><b>{r.purpose}</b></td><td>{r.monastery}</td><td className={r.donor === 'Anonymous' ? 'anonymous-cell' : ''}>{r.donor}</td><td>{r.date}</td><td><b>{money(r.amount)}</b></td><td><span className="fee-pill">₱0 (0%)</span></td><td className="net-cell">{money(r.amount)}</td><td><button className={`status-badge ${statuses[i].toLowerCase()}`} onClick={() => cycle(i)}>{statuses[i]} <ChevronDown size={11} /></button></td></tr>)}</tbody></table></div></section></>
}
function MessagesPage() {
  const [active, setActive] = useState(0)
  const [filter, setFilter] = useState('All')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState<string[]>([])
  const person = conversations[active]
  const filtered = conversations.filter((c) => filter === 'All' || c.type === filter || (filter === 'Unread' && c.unread))
  function send() { if (!message.trim()) return; setSent([...sent, message.trim()]); setMessage('') }
  return <><div className="admin-title-row"><div><span className="eyebrow">INBOX</span><h1>Messages</h1><p>Conversations from visitors and benefactors.</p></div><div className="quick-filters">{['All', 'Unread', 'Donation', 'Discerner'].map((f) => <button className={filter === f ? 'active' : ''} onClick={() => setFilter(f)} key={f}>{f}{f === 'Unread' && <i>2</i>}</button>)}</div></div><section className="inbox-panel"><div className="conversation-list"><div className="conversation-search"><Search size={16} /><input placeholder="Search conversations" /></div><div className="inbox-tabs"><button className="active">All messages</button><button>Unread <i>2</i></button></div>{filtered.map((c) => { const ix = conversations.indexOf(c); return <button className={`conversation-row ${active === ix ? 'selected' : ''}`} key={c.email} onClick={() => setActive(ix)}><span className={`avatar ${c.color}`}>{c.name.split(' ').map((n) => n[0]).join('')}</span><span className="conversation-text"><b>{c.name}</b><small>{c.subject}</small><p className={c.unread ? 'unread-preview' : ''}>{c.text}</p><i>{c.type}</i></span><span className="conversation-meta">{c.time}{c.unread && <i />}</span></button>})}</div><div className="thread"><div className="thread-head"><span className={`avatar ${person.color}`}>{person.name.split(' ').map((n) => n[0]).join('')}</span><span><b>{person.name}</b><small>{person.email}</small></span><div><button>Mark unread</button><button aria-label="Copy email" onClick={() => navigator.clipboard?.writeText(person.email)}><Clipboard size={15} /></button></div></div><div className="subject-strip"><small>SUBJECT</small><b>{person.subject}</b></div><div className="thread-messages"><div className="thread-divider"><span>CONVERSATION STARTED · SEP 24, 2026</span></div><div className="bubble visitor">Good morning, sisters. I have sent my monthly offering for September. Could you please let me know when it has been received?<small>10:32 AM</small></div><div className="bubble admin">Peace be with you. Thank you for your generous offering. We have received your payment reference and will confirm it shortly.<small>10:38 AM <Check size={12} /></small></div>{sent.map((text, i) => <div className="bubble admin" key={i}>{text}<small>Just now <Check size={12} /></small></div>)}</div><div className="reply-chips">{['Your offering is in our prayers', 'Thank you for your generous gift', 'Peace and joy be with you'].map((t) => <button onClick={() => setMessage(t)} key={t}>{t}</button>)}</div><form className="reply-box" onSubmit={(e) => { e.preventDefault(); send() }}><button type="button" aria-label="Attach"><Image size={18} /></button><input value={message} onChange={(e) => setMessage(e.target.value)} placeholder={`Reply to ${person.name}... (Press Enter to send)`} /><button className="send-button" aria-label="Send"><ArrowRight size={18} /></button><small>Reply dispatches to {person.email}</small></form></div></section></>
}
function GenericAdmin({ title }: { title: string }) { return <><div className="admin-title-row"><div><span className="eyebrow">FEDERATION OFFICE</span><h1>{title}</h1><p>Manage {title.toLowerCase()} for Carmels in Communion.</p></div><button className="button button-dark">+ Add new</button></div><section className="admin-panel generic-panel"><div className="generic-search"><Search size={16} /><input placeholder={`Search ${title.toLowerCase()}...`} /></div><div className="empty-state"><span><FileText /></span><h2>{title} workspace</h2><p>Records and tools for this section will appear here as the connected service is configured.</p><button className="button button-outline">Configure section <ArrowRight size={15} /></button></div></section></> }

function ManageUsersPage() {
  const [staff, setStaff] = useState(readPrototypeStaff)
  function removeStaff(id: string) {
    const nextStaff = staff.filter((member) => member.id !== id)
    localStorage.setItem(prototypeStaffKey, JSON.stringify(nextStaff))
    setStaff(nextStaff)
  }
  return <><div className="admin-title-row"><div><span className="eyebrow">ACCESS CONTROL</span><h1>Manage users</h1><p>Formator staff accounts stored in this browser prototype.</p></div><Link className="button button-dark" to="/signup">Add Formator <Users size={15} /></Link></div><section className="admin-panel staff-panel"><div className="panel-heading"><div><h2>Formator staff</h2><p>{staff.length} local {staff.length === 1 ? 'account' : 'accounts'}</p></div><span className="staff-role-label">FORMATOR</span></div>{staff.length ? <div className="staff-table-wrap"><table><thead><tr><th>NAME</th><th>EMAIL</th><th>ROLE</th><th>ACCESS</th></tr></thead><tbody>{staff.map((member) => <tr key={member.id}><td><b>{member.name}</b></td><td>{member.email}</td><td>Formator</td><td><button className="staff-remove" onClick={() => removeStaff(member.id)}>Remove access</button></td></tr>)}</tbody></table></div> : <div className="staff-empty"><Users size={24} /><p>No Formator accounts yet.</p><Link to="/signup">Create the first staff account <ArrowRight size={14} /></Link></div>}</section></>
}

function AdminPage() {
  const [user, setUser] = useState<PrototypeStaff | null>(null)
  const [checking, setChecking] = useState(true)
  useEffect(() => {
    const prototypeUser = readPrototypeSession()
    if (prototypeUser && ['ADMIN', 'FORMATOR'].includes(prototypeUser.role)) {
      setUser(prototypeUser)
      setChecking(false)
      return
    }
    fetch('/api/auth/me', { credentials: 'include' }).then(async (response) => {
      const result = await response.json()
      if (response.ok && ['ADMIN', 'FORMATOR'].includes(result.user?.role)) setUser({ ...result.user, passwordHash: '' })
    }).catch(() => setUser(null)).finally(() => setChecking(false))
  }, [])
  if (checking) return <div className="admin-loading">Checking your session…</div>
  if (!user) return <Navigate to="/login" replace />
  return <AdminShell user={user}><Routes><Route index element={<DashboardPage />} /><Route path="messages" element={<MessagesPage />} /><Route path="updates" element={user.role === 'ADMIN' ? <GenericAdmin title="Updates" /> : <Navigate to="/admin" replace />} /><Route path="users" element={user.role === 'ADMIN' ? <ManageUsersPage /> : <Navigate to="/admin" replace />} /><Route path="donations" element={<GenericAdmin title="Donation logs" />} /><Route path="content" element={user.role === 'ADMIN' ? <GenericAdmin title="Manage details" /> : <Navigate to="/admin" replace />} /><Route path="audit" element={user.role === 'ADMIN' ? <GenericAdmin title="Audit logs" /> : <Navigate to="/admin" replace />} /><Route path="*" element={<DashboardPage />} /></Routes></AdminShell>
}
function AppRoutes() { return <Routes><Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} /><Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} /><Route path="/monasteries" element={<PublicLayout><MonasteriesPage /></PublicLayout>} /><Route path="/carmelife" element={<PublicLayout><StoryPage kind="life" /></PublicLayout>} /><Route path="/carmelights" element={<PublicLayout><StoryPage kind="stories" /></PublicLayout>} /><Route path="/updates" element={<PublicLayout><StoryPage kind="updates" /></PublicLayout>} /><Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} /><Route path="/donations" element={<PublicLayout><DonationsPage /></PublicLayout>} /><Route path="/login" element={<LoginPage />} /><Route path="/signup" element={<SignupPage />} /><Route path="/admin/*" element={<AdminPage />} /><Route path="*" element={<PublicLayout><section className="content-page section-wrap"><h1>This page has <em>gone quiet.</em></h1><Link className="button button-dark" to="/">Return home <ArrowRight size={15} /></Link></section></PublicLayout>} /></Routes> }
export default function CarmelApp() { return <BrowserRouter><AppRoutes /></BrowserRouter> }
