# Copilot Prompt Pack: "Carmel in Communion" Website + Admin System

## How to use this

1. Create a folder for the project and put your 10 screenshots inside `/design-reference/` (Copilot Chat can read attached images; attach the relevant one for each phase).
2. Paste **Part A** into a file called `.github/copilot-instructions.md`. Copilot then remembers it for every request.
3. Use **Copilot Agent mode** (Claude Sonnet or GPT model) and paste **Phase 1, 2, 3...** one at a time. Test each phase before moving on. One giant prompt usually produces messy results, so phases work better.

The stack below is my default choice (React + Node + PostgreSQL). If you prefer Laravel, Next.js or something else, just change the "Tech stack" section.

---

## PART A: Project instructions (paste into `.github/copilot-instructions.md`)

```markdown
# Project: Carmel in Communion
Official website of the Philippine Federation of Discalced Carmelite Nuns (23 monasteries), used for vocation promotion, information, and donations. It has a public website and a private admin dashboard.

## Tech stack
- Frontend: React 18 + Vite + TypeScript, React Router, Tailwind CSS, lucide-react icons, Recharts for charts
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL with Prisma ORM
- Auth: JWT in httpOnly cookies, bcrypt password hashing, role-based access (ADMIN, FORMATOR, USER)
- File uploads: multer (local /uploads in dev, easy to swap to S3 later)
- Validation: zod on both client and server
- Structure: /client, /server, /design-reference (screenshots)

## Design system (match the screenshots exactly)
Mood: warm, prayerful, calm, earthy. Never flashy.
- Colors (define as Tailwind theme tokens):
  - carmel-brown-900: #3B2A1E (footer, dark buttons, admin text)
  - carmel-brown-700: #6B4423 (primary buttons, nav links, headings)
  - carmel-brown-500: #8B5E3C (admin sidebar)
  - carmel-gold: #B98042 (accents, active step, "GOD" highlight, stepper)
  - carmel-tan: #C9A67A (secondary accent)
  - cream-50: #FDF9F1 (page background sections)
  - cream-100: #F5EEE6 (cards, panels)
  - success green: #16A34A, info blue: #2563EB, warning orange: #D97706
- Fonts (Google Fonts): Raleway ExtraBold for big hero/section headings, Inter for UI and body, Playfair Display italic for scripture/quote blocks.
- Rounded corners (12-16px cards, 8px buttons), soft shadows, generous whitespace.
- Fully responsive (mobile first), accessible (labels, focus rings, alt text, AA contrast).
- Currency is Philippine Peso: format with the ₱ symbol and thousand separators (₱1,000.00).

## Global layout
- Sticky white top navbar: logo (small Carmelite crest) on the left; links: Home, Our Monastery, Carmelife, Carmelights, About us, Donations, Updates, Contact us; a rounded search input; a brown "Sign in" button on the far right. Highlight the active link. Collapse to a hamburger on mobile.
- Dark brown footer (4 columns): About Us (short blurb), Connect With Us (Facebook: Carmels in Communion, Phone: 0921 419 2267, Email: ocdnuns.vocpromph@gmail.com), Our Location (Brgy. Tongohin, Purok Nagsusumikap, Karmelo, Infanta Quezon), Legal & Privacy (Data Privacy Act of 2012 (RA 10173), Terms of Service, Privacy Policy). Bottom line: "© 2026 All Rights Reserved."

## Coding rules
- Reusable components, no duplicated markup (Navbar, Footer, SectionHeading, Card, Button, Stepper, StatCard, DataTable, StatusBadge).
- All site content that admins edit (pages, monasteries, updates) is stored in the database and served by the API, not hard-coded.
- Never store secrets in code; use .env and provide .env.example.
- Comply with the Philippine Data Privacy Act: collect the minimum, honor anonymous donations (store no name), and never expose donor data on public pages.
- Write clear comments and a README with setup steps.
```

---

## PHASE 1: Project setup, database and auth

```markdown
Set up the full-stack project described in .github/copilot-instructions.md.

1. Scaffold /client (Vite React TS + Tailwind) and /server (Express TS + Prisma + PostgreSQL). Add scripts so `npm run dev` runs both.
2. Configure the Tailwind theme with the color tokens and fonts from the instructions.
3. Create the Prisma schema with these models:
   - User (id, name, email, passwordHash, role ADMIN|FORMATOR|USER, createdAt)
   - Monastery (id, name, city, slug, description, imageUrl, address, contact, order)
   - Donation (id, referenceCode e.g. "CARMEL-2026-199CF4", amount Decimal, type ONE_TIME|MONTHLY, fund/purpose, paymentMethod GCASH|MAYA|BANK|CARD, isAnonymous, donorName?, donorEmail?, donorPhone?, wantsReceipt, paymentReference?, beneficiaryMonasteryId?, status PENDING|RECONCILING|VERIFIED|COMPLETED|FAILED, createdAt)
   - DonationFile (id, donationId, fileUrl, type)
   - Message (id, conversationId, senderType VISITOR|ADMIN, body, createdAt, readAt)
   - Conversation (id, name, email, subject, category DONATION|DISCERNER|GENERAL, isRead, lastMessageAt)
   - Update (id, title, slug, excerpt, body, coverImage, category, publishedAt)
   - PageContent (id, pageKey e.g. HOME|ABOUT|OUR_MONASTERY|CARMELIFE|CARMELIGHT|CONTACT, blocks JSON, updatedAt)
   - AuditLog (id, userId, action, entity, entityId, meta JSON, createdAt)
4. Implement auth: register (USER only), login, logout, /me, JWT httpOnly cookie, role middleware, and password hashing. Seed one ADMIN account (from .env) and the monasteries list: Angeles, Bacolod, Baguio, Cagayan de Oro, Castillejos, Cebu, Davao, Gumaca, Infanta, and placeholders for the rest up to 23.
5. Create an AuditLog helper that records every admin create/update/delete action.
6. The "Sign in" button opens a clean login page in the same brown/cream style. After login, ADMIN users are redirected to /admin.
```

---

## PHASE 2: Shared layout and Home page

*(Attach `Home Page.png`)*

```markdown
Build the shared Navbar, Footer and the Home page so they match the attached screenshot as closely as possible.

Home page sections, in order:
1. HERO: rounded large image card (group photo of the sisters) with a dark brown gradient at the bottom. Large heading "Carmels in **Communion**" (second word in gold), subtitle: "Welcome! You have arrived at the official website of the Philippine Federation of Discalced Carmelite Nuns for vocation promotion." Two buttons: brown "Explore" and light "Meet our Monasteries".
2. MONASTERY MARQUEE: a cream rounded bar with the bold label "Philippine Federation of Discalced Carmelite Nuns" on the left and a continuously scrolling (CSS marquee, pause on hover) list of monastery cities in gold-brown text separated by dashes (Angeles – Bacolod – Baguio – Cagayan de Oro – Castillejos – Cebu – Davao – Gumaca – Infanta ...). Load names from the Monastery table.
3. VOCATION CALL: two columns. Left: rounded photo of white flowers. Right: heading "Is **GOD** calling you to be a Discalced Carmelite Nun?" (GOD in gold), a short paragraph inviting discernment, and a brown button "Meet Our Monasteries".
4. EXPLORE: cream rounded panel with the heading "Explore" and a horizontally scrollable row of 5 image cards with dark overlay, small uppercase label, bold title and "Learn More →": The Federation (About us), Our vocation and Charism (Carmelife), Vocation Stories (Carmelights), News and Updates (Updates), Discover our communities (Our Monastery). Each card links to its page. Add scroll-snap and arrow buttons on desktop.
5. QUOTE BANNER: full-width rounded image (pink cosmos flower) with a text block on the right: "Carmel symbolizes prayer. More than a geographical place, it is a sacred space in the cloister of the heart where the Carmelite nun encounters God." and a white "Contact us" button.
6. Footer.

Fix these typos that appear in the design: "scared space" should be "sacred space", and the truncated "Let us a" text in the Explore header should be the full sentence: "Are you discerning if God is calling you to Carmel? Let us assist you."
Use placeholder images from /client/public/images with descriptive alt text. Make everything responsive.
```

---

## PHASE 3: About Us page and content pages

*(Attach `About Us.png`)*

```markdown
Build the About Us page to match the attached screenshot.

Sections:
1. Hero: cream background, big bold "About Us" heading, paragraph: "The Philippine Federation of Discalced Carmelite Nuns is a structure of communion among its 23 Carmelite monastery members, who all embrace the Teresian Charism." and a small brown "Talk To Us" button linking to Contact.
2. AIM band: dark brown background. Left: small uppercase label "OUR PURPOSE", large white "AIM", and gold text "The Federation aims to make visible the unity which Jesus prayed for among His disciples." Right: four stacked large white uppercase words: COMMUNION. COLLABORATION. CONTEMPLATION. MISSION.
3. Two full-width group photos, each with a centered brown caption:
   - "14th General Assembly of the Philippine Federation of Discalced Carmelite Nuns, Mere Monique Home, La Paz, Iloilo City, November 7-12, 2022"
   - "Elected Officers (2022-2024) with Father General Miguel Calle, OCD, Definitor Fr. Chris Surinono, OCD, and Religious Assistant Fr. Dan Lim, OCD"
4. PURPOSES: small label "THE FEDERATION", heading "PURPOSES" with a short gold underline, then 4 numbered cards (01-04) with top image, number in bold, and paragraph:
   01 To respond to the desire of St. Teresa that her Carmels be bound together by evangelical friendship.
   02 To realize the desire of the Church and the Order to have close beneficial ties among the member monasteries.
   03 To help each other live more faithfully the Teresian ideal of the canonical contemplative life.
   04 To facilitate communication and mutual assistance in formation, government, practical skills, material and economic needs, and transfer of nuns among the member monasteries. (VDq no.30)
5. Split quote section: left image (white flowers), right dark brown panel with a large gold quotation mark and Playfair Display italic text: "All must be friends, all must be loved, all must be held dear, all must be helped." followed by "- St. Teresa of Avila (Way of Perfection 4:7)".
6. Footer.

Then create simple but consistent pages for Our Monastery (grid of 23 monastery cards from the database with a detail page each), Carmelife, Carmelights (vocation stories), Updates (news list + detail page), and Contact us (form that creates a Conversation + Message in the database and is visible in the admin Messages inbox). Reuse the same hero, card and footer components. Page text for Home, About, Carmelife, Carmelight and Contact must be loaded from the PageContent table so admins can edit it later.
```

---

## PHASE 4: Donation flow (4 steps)

*(Attach `donation.png`, `donation-1.png` ... `donation-5.png`)*

```markdown
Build the /donations page with a 4-step donation wizard that matches the attached screenshots.

Page header (shown on all steps): small uppercase gold label "SHARE YOUR BLESSINGS", bold centered heading "Your donation will be used for the formation program of the Federation. Thank you for your generosity!", and a cream quote card with a gold quote icon: "Bring the whole tithe into the storehouse, that there may be food in my house. Test me in this, says the Lord Almighty, and see if I will not throw open the floodgates of heaven." - Malachi 3:10 (Playfair Display italic).

Wizard card (centered, max width ~520px, rounded, soft shadow) with a header showing "Step X of 4", the step name on the right, and a 4-node progress stepper (completed = dark brown check, current = gold with number, upcoming = outlined). Footer of the card has Back (outlined) and Next (dark brown) buttons. Keep state in a React context or reducer and persist it in sessionStorage so refresh doesn't lose progress.

STEP 1: Select Amount
- Title "Select Your Offering", subtitle "Choose a suggested gift or enter your own preferred amount."
- Segmented toggle: One-Time Offering | Monthly Blessing.
- 2x2 grid of amount cards: ₱500 (Daily food & nutrition), ₱1,000 (Medicines & health care, badge "MOST FREQUENT", selected by default with gold border), ₱2,500 (Young sisters' formation), ₱5,000 (Infirmary & monastery upkeep).
- Dashed button "+ Enter a Different Amount" that reveals a numeric input (minimum ₱50).
- Line at the bottom: "Selected Offering: ₱1,000 (One-time)".

STEP 2: Payment Method
- Title "Choose Payment Method", subtitle "Select the channel you find most comfortable and familiar."
- Four radio cards: GCash Mobile Wallet (blue "G" icon, "Send via QR code or mobile number"), Maya (PayMaya) (green "M" icon, "Send via Maya QR code or account"), Bank Transfer (BPI / BDO) (brown building icon, "Direct online banking transfer"), Debit / Credit Card (brown lock icon, "Visa or Mastercard secure checkout"). Selected card has blue border/light blue background and a checked circle.

STEP 3: Donor Information
- Title "Donor Information", subtitle "You may offer this quietly without leaving your name, or share your name."
- Two option cards: "Give Anonymously" (eye-off icon, "No name stored") selected by default, and "Include My Name" (user icon, "For monastery records"). If "Include My Name" is chosen, show name, email and phone inputs with validation.
- Checkbox: "Send acknowledgment receipt by SMS or Email (Optional)". If checked, require email or phone.
- Button "Review & Pay".

STEP 4: Review & Complete
- Title "Review & Complete Offering", subtitle "Please check the details below and send your offering."
- Summary box: Offering Amount (large, ₱1,000.00), Payment Channel (uppercase), Donor ("Anonymous Benefactor" when anonymous).
- Payment instruction box: QR code image ("SCAN QR"), "Account: FEDERATION OF DISCALCED CARMELITE NUNS", number 0921-419-2267 with a "Copy Number" button (copies to clipboard and shows "Copied!"), and an optional input "Payment Reference Number (from your GCash / Bank SMS)".
- Gold button "I Have Sent ₱1,000" which POSTs the donation to the API with status PENDING (or RECONCILING when a reference number is supplied) and generates a reference code like CARMEL-2026-XXXXXX.
- For Card payment show a "Coming soon: card checkout" notice or integrate a gateway later (leave a clean PaymentProvider interface so PayMongo/Xendit can be plugged in).

CONFIRMATION SCREEN: card with header "Official Acknowledgment | Completed", circle check icon, heading "Thank You for Your Generosity!", text "May God reward your kindness. Your offering directly sustains our elder cloistered sisters across the Philippines." and a receipt box: OFFICIAL ACKNOWLEDGMENT with the reference code in gold, Beneficiary (Discalced Carmelite Nuns), Offering Amount, Payment Method, Donor, Date. Buttons: "Print Receipt" (print-friendly CSS) and "Make Another Offering" (resets the wizard).

Under the wizard on every step show three small trust badges: "100% Direct to Monasteries", "Anonymous Giving Supported", "Helpline: (0921) 419-2267".

FAQ SECTION below (on the Donations page): pill label "Common Questions", heading "Frequently Asked Questions", subtitle "Everything you need to know about giving, anonymity, GCash, and monthly church sponsorships." Accessible accordion (one open at a time) with these questions:
1. Can I truly give 100% anonymously? (Answer: Yes. If you choose "Give Anonymously", your name is never displayed on public acknowledgments, church bulletins or community reports. Our records log your gift as "Anonymous Brother / Sister in Christ". If you still provide your email or phone, it is used strictly to send your private official receipt and payment verification.)
2. How do I pay using GCash or Maya?
3. How does becoming a Church Monthly Sponsor work?
4. What do the automated SMS and Email reminders look like?
5. Can I change, pause, or cancel my monthly sponsorship anytime?
6. Will I receive an official church donation receipt?
Write sensible, warm answers for 2-6. Store FAQs in the database so admins can edit them.

Backend: POST /api/donations (public, rate-limited, zod-validated), GET /api/donations/:reference (for the receipt). If isAnonymous is true, never store name, email or phone unless a receipt was requested, and then store only what is needed for the receipt.
```

---

## PHASE 5: Admin dashboard

*(Attach `Admin dashboard.png` and `Admin dashboard-1.png`)*

```markdown
Build the protected admin area under /admin (ADMIN and FORMATOR roles only; FORMATOR sees a limited menu) matching the attached screenshots.

LAYOUT
- Top bar: crest + "Carmel in Communion" on the left; centered rounded search input; notification bell with a green dot, settings gear; user pill on the right (first name + avatar initial).
- Left sidebar (rounded, brown #8B5E3C, white text, active item is a white rounded pill with dark text):
  - Dashboard
  - Messages (orange badge with unread count)
  - Updates
  - Manage Users (collapsible): Formator, User
  - Donations (collapsible): Logs, Files
  - Manage Details (collapsible): Home, Our Monastery, Carmelife, Carmelight, About Us, Contact Us
  - Audit Logs
  - At the bottom: current date and time (live clock, e.g. "September 25, 2026 / Friday 10:31 AM")
- Change the top search placeholder to "Search donations, donors, or messages..." (the screenshot's placeholder was copied from another project).

DASHBOARD PAGE
1. Top-right button "Export Donations CSV" (server generates and downloads the CSV, respects filters).
2. Three stat cards: GROSS OFFERINGS (₱ total, "Total federation contributions", red trend icon), NET MONASTERY SUPPORT (green ₱ total, "100% directly to Carmelite monasteries", green $ icon), PLATFORM FEE (badge "0%", ₱0, "100% non-profit church mission").
3. Chart card "Monthly Donators Count & Total Amount" with a "2026 Year-to-Date" pill, description "Tracks active monthly contributing supporters alongside gross offering volume.", and a toggle Both | Amount (₱) | Donors Count. Show a summary strip (Selected Month, Total Offerings, Monthly Donators) that updates on hover/click of a month. Use Recharts: brown area/line for amount, green line for donor count, dashed vertical marker for the selected month, legend at the bottom.
4. Donut card "Visitor Demographics" ("Benefactor profile distribution") with a Gender | Age toggle, total donors in the center (e.g. 1,420 TOTAL DONORS), and a legend with percentage and count: Female Donors, Male Donors, Anonymous / Not Specified. Only use aggregated data; never expose individual donors here.
5. Transactions table with search ("Search monastery fund, benefactor, receipt..."), "8 transactions recorded" counter, columns: Monastery Fund / Purpose, Beneficiary, Benefactor / Donor (italic gray "Anonymous" when anonymous), Date, Gross Amount, Platform Take (gray pill "₱0 (0%)"), Net Monastery Support (green), Status badge (Completed = green, Verified = blue, Reconciling = orange). Add sorting, pagination, and a row action to change the status (PENDING → RECONCILING → VERIFIED → COMPLETED), which writes to the AuditLog.

MESSAGES PAGE (second screenshot)
- Quick filter chips at the top right: All, Unread (count), Donation, Discerner.
- Two-pane inbox in a rounded card. Left: search conversations, filter tabs, and a list of conversations (colored initials avatar with an online dot, name, time, bold preview when unread with a gold unread dot, category tag "Donations" or "Discerner"). Selected item has a cream highlight.
- Right: header with avatar, name, email and time, actions (Unread, Copy, Details), a "SUBJECT:" strip, chat bubbles (visitor = white, admin = dark brown with time and read ticks), and a "CONVERSATION STARTED" divider.
- Bottom: horizontally scrollable quick-reply chips (e.g. "Added to our daily Vespers & Holy Mass prayers", "Official BIR digital tax receipt is being emailed", "May the peace and joy of Christ be with you"), an attachment button, input "Reply to <name>... (Press Enter to send)", send button, and the helper line "Dispatches direct reply to <email>".
- Sending a reply saves the Message and emails the visitor through Nodemailer (SMTP settings in .env).

OTHER ADMIN PAGES
- Updates: CRUD with rich text editor and cover image upload.
- Manage Users: Formator and User tables with add/edit/deactivate, role assignment.
- Donations > Logs: full filterable log; Files: uploaded proofs/receipts per donation.
- Manage Details: simple forms that edit each page's PageContent blocks and the Monastery records.
- Audit Logs: read-only table (who, action, entity, when) with filters.

All admin API routes require auth + role checks, and every mutation writes an AuditLog entry. Seed realistic demo data matching the screenshots (8 transactions, monthly totals rising from January to September 2026, 5 conversations).
```

---

## PHASE 6: Polish and hardening

```markdown
Review the whole project and:
1. Compare each page against the screenshots in /design-reference and fix spacing, font weights, colors and alignment differences.
2. Make every page responsive (test 375px, 768px, 1280px) and keyboard accessible.
3. Add loading skeletons, empty states, and friendly error messages.
4. Add server-side security: helmet, CORS allow-list, rate limiting on login/donation/contact endpoints, input sanitization, CSRF protection for cookie auth.
5. Add SEO basics (page titles, meta descriptions, Open Graph tags) and a sitemap.
6. Write unit tests for the donation validation and amount formatting, plus a README with setup, seed and deploy instructions.
```

---

## Notes and things to decide

- **Payments:** The screenshots show a manual flow (donor sends money by GCash/Maya/bank, then clicks "I Have Sent"; admin reconciles). That is why the statuses are "Reconciling" and "Verified". If you want automatic confirmation, ask Copilot later to integrate PayMongo or Xendit.
- **Design typos to fix:** "scared space" (should be "sacred"), the cut-off "Let us a" text on the Home page, and the admin search placeholder that mentions "artworks".
- **Sensitive data:** The admin messages show real-looking names and emails. Use fake demo data, not real people's information, in any public repo.
- **BIR receipts:** The admin chat mentions BIR certificates. Real tax-exempt receipts require the organization's official accreditation, so confirm that with your accountant before promising it in the FAQ.
