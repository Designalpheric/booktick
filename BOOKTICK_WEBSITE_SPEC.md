# BookTick — Complete Website Specification
> Full design + functionality reference for rebuilding or porting to another platform.

---

## 1. Project Overview

**Brand Name:** BookTick  
**Tagline:** "Travel Packages, Flights & Holiday Deals"  
**Business Type:** Indian travel agency — enquiry-only model (no direct online booking)  
**Primary Market:** Indian travellers, INR pricing  
**Founded:** 2015 (per About page copy)  
**Contact:** +91 98765 43210 | info@booktick.in | 123 Travel House, New Delhi

### Business Model
- No direct booking or payment processing on the website
- All reservations handled by travel experts after enquiry
- Users enquire via: (1) website form, (2) WhatsApp, (3) phone call
- Team response promise: within 2 hours

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + inline styles |
| Icons | Lucide React |
| Animations | Framer Motion |
| Images | Next.js `<Image>` (Unsplash URLs for demo) |
| Fonts | Google Fonts (see §4) |
| API | Next.js Route Handlers (`/api/enquiries`) |
| CRM Integration | OneDesk (optional, via env vars) |

---

## 3. Brand & Design System

### 3.1 Color Palette

| Name | Hex | Usage |
|---|---|---|
| Lagoon (Primary) | `#1F8C9E` | Buttons, icons, active states, links |
| Lagoon Dark | `#0d6677` / `#176D7B` | Text on light lagoon tints |
| Lagoon Tint | `rgba(31,140,158,0.10–0.13)` | Icon backgrounds, chip backgrounds |
| Amber (Accent) | `#F2A93B` | Stars, highlights, hero badge dot |
| Amber Tint | `rgba(242,169,59,0.14–0.18)` | Discount badges |
| Cream (Background) | `#FAF7F2` | Section backgrounds |
| Dark Navy (Footer) | `#0B0B1A` | Footer background |
| Dark Text | `#343434` | Primary text, headings |
| Body Text | `#1a1a1a` | Cards, modal text |
| Gray Text | `#374151` | Secondary text |
| Light Gray BG | `#f3f4f6` | Tab backgrounds, input areas |
| White Frosted | `rgba(255,255,255,0.88)` | Tags on photo backgrounds |
| Green (WhatsApp) | `#25d366` / `#22c55e` | WhatsApp CTAs |

### 3.2 Typography

Four Google Fonts loaded via Next.js font system:

| Variable | Font | Weights | Use |
|---|---|---|---|
| `--font-display` | Fraunces | 400–800, italic | Display headlines |
| `--font-serif` | Instrument Serif | 400, italic | Decorative italic text in headings |
| `--font-heading` | Instrument Sans | 400–700 | Section titles, nav |
| `--font-body` | Inter | 300–800 | All body copy, UI |

**Heading pattern used throughout:**  
```
"Expertly Crafted Travel"   → Instrument Sans, extrabold, #343434
"Packages for Every Traveller" → Instrument Serif, italic, #1F8C9E
```

### 3.3 Border Radius System
- Cards: `rounded-3xl` (24px) or `rounded-2xl` (16px)
- Buttons: `rounded-full` (pill) or `rounded-xl` (14px)
- Badges/tags: `rounded-full`
- Image thumbnails: `rounded-xl` (12px)
- Modal: `24px 24px 0 0` (bottom sheet on mobile, centered card on desktop)

### 3.4 Shadow System
- Hero card: `0 2px 4px rgba(20,20,20,0.04), 0 28px 48px -20px rgba(20,20,20,0.22)`
- Small cards: `0 1px 2px rgba(20,20,20,0.04), 0 18px 32px -16px rgba(20,20,20,0.18)`
- Stats card: `0 2px 4px rgba(20,20,20,0.04), 0 28px 56px -24px rgba(20,20,20,0.16)`

### 3.5 Interaction Patterns
- Hover: `hover:-translate-y-1` or `hover:-translate-y-1.5` on cards
- Hover: `hover:opacity-80` on tabs and links
- Active: `active:scale-95` on buttons
- Image zoom: `group-hover:scale-105` or `scale-110` on card images
- Transition: `duration-300` to `duration-[900ms]`

---

## 4. Pages & Routes

### 4.1 Homepage (`/`)
**Section order (top to bottom):**
1. HeroBanner
2. PopularDestinations
3. FeaturedPackages
4. DealsSection
5. TrustBadges
6. MarqueeStrip
7. CustomerReviews
8. EnquiryCTA

### 4.2 Packages Listing (`/packages`)
- Query params: `?category=national|international`, `?type=Beach|Adventure|...`, `?search=query`
- Left sidebar filters (desktop) / bottom drawer (mobile)
- Filter options: Category, Budget (4 ranges), Duration (4 ranges), Travel Type (8 tags)
- Sort: Most Popular, Top Rated, Price Low→High, Price High→Low
- Active filter count badge on filter button
- "Clear all" when filters applied
- "No packages found" empty state with clear filters CTA

### 4.3 Package Detail (`/packages/[slug]`)
- 2-column layout: Main content (2/3) + Sidebar (1/3)
- **Main content:**
  - Image gallery with thumbnails (clickable to switch main image)
  - Breadcrumb navigation
  - Package title, location, category badge
  - Quick stats: Duration, Group Size, Rating
  - Package Highlights (grid of checkmarks)
  - Tabbed content panel: Itinerary | Inclusions | Reviews | FAQs
    - **Itinerary:** Accordion by day number (Day 1, Day 2...), shows meals + accommodation pills
    - **Inclusions:** 2-column: ✓ Inclusions list + ✗ Exclusions list
    - **Reviews:** Overall rating block + individual review cards with avatar, stars, comment
    - **FAQs:** Accordion-style Q&A
  - Related Packages grid (3 cards, same destination or category)
- **Sidebar (sticky):**
  - Price display with original price + discount if applicable
  - "Submit Enquiry" button (opens EnquiryModal)
  - "Contact on WhatsApp" button
  - "Call for Details" button
  - ⚠️ "No direct booking" disclaimer
  - Quick info: Duration, Min Travellers, Destination
  - Back to all packages link

### 4.4 Flights (`/flights`)
- Enquiry-only flight explorer (no booking)
- Hero section with search card (From / To text inputs + swap button)
- Popular route quick-select pills below search
- Left sidebar filters (desktop sticky):
  - Airline search input
  - Direct Flight / Business+First Class checkboxes
  - Price range display (min/max from data)
  - Airline names checklist
- Flight results as vertical card list
- "Cheapest" badge on lowest fare card
- Sort: Price Low→High / High→Low
- Disclaimer banner: "Enquiry only — fares are estimates"

### 4.5 Destinations (`/destinations`)
- Grid of all destination cards

### 4.6 Destination Detail (`/destinations/[slug]`)
- Packages filtered by destination

### 4.7 About (`/about`)
- Hero image banner with overlay title
- Story section (2-column: text + image)
- Core Values Timeline (animated zig-zag layout, client component)
- Team grid (4 members with avatar, name, role, bio)
- CTA banner (orange gradient) with "Browse Packages" + "Contact Us Today" buttons

### 4.8 Contact (`/contact`)
- 2-column layout: Form (left) + Info sidebar (right)
- **Form fields** (all plain text inputs — no dropdowns):
  - Full Name (required)
  - Email Address (required)
  - Phone Number (required)
  - Destination of Interest
  - Travel Date (date picker)
  - Enquiry Type (text input, placeholder: "e.g. Package, Flight, General")
  - Number of Travellers (number input, 1–50)
  - Budget Range (text input, placeholder: "e.g. ₹40,000 – ₹80,000")
  - Message / Additional Info (textarea)
- Submit button: "Send Enquiry"
- **Info sidebar:**
  - Phone, Email, Address contact items
  - WhatsApp CTA card (green gradient, chat icon, "Available 24/7 · Instant reply")
  - Office hours info

### 4.9 Not Found (`/not-found`)
- Custom 404 page

---

## 5. Layout Components

### 5.1 Header
**Behavior:**
- Fixed, full-width, `z-50`
- On homepage hero: transparent background, white text/logo
- On scroll (>40px) or on any non-home page: frosted glass white (`rgba(255,255,255,0.95)` + `backdropFilter: blur(16px)`), dark text/logo
- Two logo variants: `logo-light.png` (white, for dark hero) + `logo-dark.png` (dark, for white header)

**Desktop Nav** (centered pill container):
- "India Packages" — hover dropdown, 2-column grid of 8 destinations + "View All" link
- "International" — hover dropdown, 2-column grid of 8 destinations + "View All" link
- "Flights" — direct link
- "About" — direct link
- "Contact" — direct link
- Active link gets pill highlight
- "Get Quote" CTA button (right-aligned, pill with circular lagoon arrow icon)

**Dropdown design:**
- White card, `borderRadius: 20px`, soft shadow
- Arrow pointer triangle at top center
- Hover items: lagoon tint background
- Each destination item: small icon chip + label

**Mobile:**
- Hamburger → full-width white dropdown panel
- Accordion for India/International with 2-col destination grid
- Phone number + "Get Free Quote" lagoon button at bottom

### 5.2 Footer
**Background:** `#0B0B1A` (dark navy), subtle lagoon radial glow top-right

**4-column grid:**
1. **Brand column:** Logo (light variant), brand description, social icons (Facebook, Twitter, LinkedIn, Instagram — circular pills, hover turns lagoon)
2. **Destinations:** Goa, Kerala, Rajasthan, Dubai, Bali, Maldives
3. **Travel Packages:** National Tours, International Tours, Honeymoon, Adventure, Luxury, Family
4. **Quick Links + Contact:** Flights, About Us, Contact Us + phone/email/address with icon chips

**Bottom strip:** Copyright text (left) + "We Accept" with Mastercard, Visa, PayPal marks (right)

### 5.3 WhatsApp Float Button
- Fixed, bottom-right
- Green circle with WhatsApp SVG icon
- Pulsing chat bubble popup: "Need help planning? Chat with our travel expert now!"
- Links to WhatsApp with pre-filled message

---

## 6. Homepage Sections (Detail)

### 6.1 HeroBanner
- Full-viewport-height section
- Background: Unsplash mountains photo with layered gradients (dark overlay top+bottom, radial vignette)
- **Glass pill badge:** "• Curated Tours" (white/10% glass)
- **Headline:** "Unforgettable **Experiences** Await You" — "Experiences" in amber `#F2A93B`
- **Subtitle:** tagline copy
- **Search Card** (frosted white card, `borderRadius: rounded-3xl`):
  - Tab switcher: Packages | Flights (pill toggle, active tab = lagoon tint)
  - **Packages tab fields:** Where to? (text) | When? (select) | Experience (select) | Search button (lagoon)
  - **Flights tab fields:** From (text) | To (text) | Departure (select) | Cabin class (select) | Search button
  - Search navigates to `/packages?search=...` or `/flights?from=...&to=...`
- **Trust strip** (below card): Expert Local Guides · Flexible Cancellation · 4.9/5 Average Rating — all with amber badges

### 6.2 PopularDestinations
- Grid of destination photo cards: Goa (12 trips), Kerala (10), Dubai (15), Bali (9), Maldives (11)
- Dark gradient overlay, destination name + trip count in bottom-left
- Links to `/destinations/[slug]`

### 6.3 FeaturedPackages
**Header:**
- "Expertly Crafted Travel" (Instrument Sans, extrabold, `#343434`)
- "Packages for Every Traveller" (Instrument Serif, italic, `#1F8C9E`)
- Subtitle paragraph

**Category Tabs:**
- Pills: All · National · International · Honeymoon · Adventure · Luxury
- Style: `backgroundColor: "#f3f4f6"`, `border: "1px solid #e5e7eb"`, `color: "#374151"`
- Hover: `opacity-80` only (no color change)
- Scrollable row on mobile with right-fade gradient hint
- "View all →" link (lagoon color, right-aligned, hidden on mobile)

**Bento Grid:**
- `grid-cols-1 lg:grid-cols-[1.35fr_1fr_1fr]`
- **Large hero card** (spans 2 rows): full-bleed image, dark gradient, frosted badges, large title, price + "Enquire Now" button (amber `#f9cc72`)
- **4 small cards** (2×2): image top + body bottom layout

**Hero card badges (on image):**
- Best Seller: `rgba(255,255,255,0.88)`, color `#1f2937`, `backdropFilter: blur(8px)`
- % OFF: same frosted white style
- Duration pill (top-right): dark glass `rgba(15,20,35,0.65)`, blur

**Small card badges (on image):**
- International / National: `rgba(255,255,255,0.88)`, color `#1f2937`, `backdropFilter: blur(6px)`
- Duration pill: same dark glass as hero

**Small card body:**
- Star rating (amber) + review count
- Title (line-clamp-2)
- First highlight (line-clamp-1)
- Price from + "Enquire →" teal button

**Bottom CTA:**
- "Browse All Packages →" button: `backgroundColor: "#daf0f3"`, `color: "#0d6677"`, `border: "1px solid #a8d8e2"`

Clicking any card opens **EnquiryModal** pre-filled with destination + package name.

### 6.4 DealsSection
- "Limited Time Offers" pill tag (amber icon)
- Heading: "Hot Deals & Offers"
- 4-column grid of discount packages (filtered from packages data where `discount` exists)
- Each card: photo with `% OFF` badge (amber tint) + duration pill, title, destination, current price, strikethrough original price, green "Save ₹X" text
- Cards link to `/packages/[slug]`

### 6.5 TrustBadges
**Stats Row** (animated count-up on scroll):
- 10,000+ Happy Travellers
- 50+ Destinations
- 500+ Curated Packages
- 4.8/5 Average Rating
- All icons: lagoon `#1F8C9E`, bg `rgba(31,140,158,0.10)`
- Grid with `gap-px` hairline dividers (gap background is `rgba(20,20,20,0.06)`)
- Animated with Framer Motion `whileInView`, staggered 0.08s per item
- `AnimatedNumber` component: counts from 0 using `framer-motion animate()`

**Trust Features Grid** (3 columns):
1. 100% Safe & Secure (Shield)
2. Award-Winning Agency (Award)
3. 24/7 Travel Support (Headphones)
4. Flexible Cancellation (RefreshCw)
5. Expert Travel Planners (Users)
6. Best Price Guarantee (Star)
- Icon chip: `w-14 h-14 rounded-2xl`, scales on group hover
- All icons: lagoon color + lagoon tint background

### 6.6 MarqueeStrip
- Continuous scrolling text strip (dark navy / lagoon background)
- Text items: "Curated Travel · Discover the World · Best Experiences · Wanderlust · ..." (repeating)
- Diagonal/angled strip design
- CSS animation, infinite loop

### 6.7 CustomerReviews
- "What Our Travellers Say" heading (Instrument Serif italic)
- Subtitle: "Real experiences from real people who trusted BookTick"
- Review cards: avatar, name, traveller label, star rating, review text, verified badge
- Carousel or grid layout
- Sample reviewer: Priya Sharma, 5 stars

### 6.8 EnquiryCTA
- Full-width CTA section
- Heading + subtext
- "Plan Your Trip" / enquiry button

---

## 7. Package Card Component (`PackageCard`)

Used on: `/packages` listing page, package detail related section

**Layout:** white card, `borderRadius: 20px`, padded image top (px-3 pt-3)

**Image area** (`h-200px`, `borderRadius: 14px`):
- Soft top gradient for badge legibility
- **Top-left:** badge chip (e.g., "Best Seller") — soft tinted background per badge type:
  - Best Seller: lagoon tint `rgba(31,140,158,0.13)`, text `#0d6677`
  - Top Rated: purple tint `rgba(124,58,237,0.11)`, text `#6420c8`
  - Luxury Pick: amber tint `rgba(242,169,59,0.14)`, text `#8a5c00`
  - Honeymoon Special: pink tint `rgba(236,72,153,0.11)`, text `#a8165e`
  - Heritage Special: teal tint `rgba(13,148,136,0.12)`, text `#0a7060`
  - Adventure Pick: green tint `rgba(22,163,74,0.11)`, text `#0f6e30`
  - Premium Luxury: blue tint `rgba(37,99,235,0.11)`, text `#1540b8`
  - Trending: orange tint `rgba(234,88,12,0.11)`, text `#b03800`
- **Top-right:** % OFF badge (amber tint) + category badge (International: blue tint; National: lagoon tint)

**Body area:**
- Location: MapPin icon + "Destination, Country"
- Title: extrabold, `#1a1a1a`, line-clamp-1
- Highlights: first 2 joined with " · ", gray, line-clamp-1
- Price: large extrabold + "/ person" label
- Star rating: 5 stars (filled amber to round(rating)) + review count
- Duration pill: clock icon + duration text, light gray background
- Savings line: green "Save ₹X" if discount exists

**Action buttons (bottom row):**
- "View Details →" (flex-1, outlined border, links to `/packages/[slug]`)
- Chat icon button (opens EnquiryModal)
- WhatsApp icon button (opens WhatsApp with pre-filled message)

---

## 8. Flight Card Component (`FlightCard`)

Used on: `/flights` page

**Layout:** white card, horizontal layout

**Content:**
- Airline logo/name
- From → To with IATA codes
- Departure and arrival times
- Duration
- Stops (Direct or N stop)
- Class (Economy/Business/First)
- Aircraft type
- Amenities chips (WiFi, Meals, etc.)
- Price (estimated fare, INR)
- "Cheapest" green badge if lowest fare
- WhatsApp enquiry button + Enquiry form button

---

## 9. Enquiry Modal (`EnquiryModal`)

**Trigger:** "Enquire Now" / "Enquire" buttons on package cards and detail page

**Appearance:**
- Mobile: bottom sheet (slides up from bottom, `borderRadius: 24px 24px 0 0`)
- Desktop: centered modal (`maxWidth: 480px`)
- Backdrop: `bg-black/55 backdrop-blur-sm`
- Drag handle on mobile (gray pill at top)

**Header:**
- Package name pill (if pre-filled)
- "Plan Your Trip" title
- "We'll respond within 2 hours" subtitle
- Close (×) button

**Form fields:**
1. Full Name (required)
2. Mobile (10-digit, required)
3. Email (required)
4. Destination (required, pre-filled from card)
5. Travel Date (date picker, min = today, required)
6. Number of Travellers (select 1–10+)
7. Message / Special Requirements (textarea)

**Validation:**
- Name: required
- Mobile: `/^\d{10}$/` test
- Email: `/\S+@\S+\.\S+/` test
- Destination: required
- Travel Date: required
- Inline error messages per field

**Submit:**
- POSTs to `/api/enquiries`
- Shows spinner while submitting
- On success: green checkmark screen, personalized "Thank you [name]! We'll call you at [mobile] within 2 hours."
- "🔒 Your details are secure" note below button

---

## 10. Data Models

### TravelPackage
```
id, slug, title, destination, country
category: "national" | "international"
type: string[] (Beach, Adventure, Luxury, Culture, Honeymoon, Heritage, Nature, Mountain)
duration: string (e.g., "5 Days / 4 Nights")
durationDays: number
priceFrom: number (INR)
pricePerPerson: number
currency: "INR"
coverImage: string (URL)
gallery: string[] (multiple image URLs)
rating: number (e.g., 4.8)
reviewCount: number
reviews: PackageReview[]
highlights: string[]
inclusions: string[]
exclusions: string[]
itinerary: PackageItineraryDay[]
faqs: { question, answer }[]
badge?: "Best Seller" | "Top Rated" | "Luxury Pick" | "Honeymoon Special" | "Heritage Special" | "Adventure Pick" | "Premium Luxury" | "Trending"
discount?: number (percentage)
isPopular?: boolean
isFeatured?: boolean
minTravellers: number
maxTravellers: number
tags: string[]
```

### PackageItineraryDay
```
day: number
title: string
description: string
meals: string[]
accommodation: string
```

### PackageReview
```
id, name, rating, date, comment, avatar, location
```

### Flight
```
id, airline, airlineLogo
from, fromCode, to, toCode
departure, arrival, duration
stops: number
stopDetails?: string
class: "Economy" | "Business" | "First"
estimatedFare: number
currency: string
aircraft: string
amenities: string[]
```

### Destination
```
id, slug, name, country, image
packageCount: number
description: string
popular: boolean
```

### EnquiryFormData
```
name, email, mobile, destination
travelDate, travellers: number
packageOrFlight?: string
message: string
enquiryType: "package" | "flight" | "general"
```

---

## 11. API

### POST `/api/enquiries`
**Purpose:** Submit a travel enquiry  
**Body:** `EnquiryFormData` JSON  
**Validation:** name, mobile, email required  
**Response:** `{ success: true, enquiryId: "ENQ-{timestamp}", message: "..." }`  
**Side effect (optional):** Creates ticket in OneDesk CRM if `ONEDESK_API_KEY` + `ONEDESK_COMPANY_ID` env vars are set

### GET `/api/enquiries`
**Purpose:** Admin view of all submitted enquiries (demo — in production protect with auth)  
**Response:** `{ enquiries: [...], total: number }`

### OneDesk Integration
Ticket format:
- Title: `[PACKAGE] Name → Destination`
- Description: formatted with all enquiry fields
- Priority: normal
- Tags: enquiryType, "website-enquiry", destination
- Custom fields: all enquiry data

---

## 12. WhatsApp Integration

**Utility functions in `/lib/whatsapp.ts`:**
- `getWhatsAppUrl(message)` → formats `https://wa.me/{number}?text={encoded}`
- `packageEnquiryMessage(title, destination)` → pre-filled message for package enquiry
- Phone number: `+91 98765 43210`

**Used in:**
- PackageCard (WhatsApp icon button)
- Package detail page sidebar
- Contact page sidebar CTA card
- WhatsAppFloatButton (global float)
- FlightCard

---

## 13. Navigation Structure

```
/                          ← Homepage
/packages                  ← All packages (with filters)
  ?category=national
  ?category=international
  ?type=Honeymoon
  ?search=query
/packages/[slug]           ← Package detail page
/destinations              ← All destinations
/destinations/[slug]       ← Destination detail
  /goa, /kerala, /himachal, /kashmir
  /rajasthan, /uttarakhand, /andaman, /north-east
  /dubai, /thailand, /maldives, /bali
  /singapore, /europe, /vietnam, /malaysia
/flights                   ← Flight explorer
  ?from=Delhi&to=Dubai
/about                     ← About page
/contact                   ← Contact + enquiry form
```

---

## 14. Package Listing Page — Filter System

**Filter categories:**
- **Category:** All Packages | National | International (radio)
- **Budget:** Under ₹20K | ₹20K–40K | ₹40K–80K | ₹80K+ (radio, can deselect)
- **Duration:** 1–3 days | 4–6 days | 7–10 days | 10+ days (radio, can deselect)
- **Travel Type:** Beach | Adventure | Luxury | Culture | Honeymoon | Heritage | Nature | Mountain (multi-select pills)

**Sorting:**
- Most Popular (default — by `isPopular` flag)
- Top Rated (by `rating` descending)
- Price: Low → High
- Price: High → Low

**Responsive:**
- Desktop (lg+): inline left sidebar (240–256px wide), collapsible via "Filters" button
- Mobile: off-canvas drawer (sliding from left), 288–320px, "Show N Packages" sticky footer CTA
- Filter count badge on trigger button

---

## 15. Static Content

### Footer Link Groups
**Destinations:** Goa, Kerala, Rajasthan, Dubai, Bali, Maldives  
**Travel Packages:** National Tours, International Tours, Honeymoon Packages, Adventure Tours, Luxury Tours, Family Packages  
**Quick Links:** Flights, About Us, Contact Us

### Social Media
Facebook, Twitter, LinkedIn, Instagram (links to `#` — placeholder)

### Payment Marks
Mastercard · Visa · PayPal (custom inline SVG badges in footer)

### Team (About Page)
- Ravi Kumar — Founder & CEO
- Priya Sharma — Head of Operations
- Arjun Mehta — Senior Travel Consultant
- Ananya Gupta — Customer Relations

### Stats (TrustBadges)
10,000+ Happy Travellers · 50+ Destinations · 500+ Curated Packages · 4.8/5 Average Rating

---

## 16. SEO & Metadata

**Default title:** "BookTick — Travel Packages, Flights & Holiday Deals"  
**Title template:** `%s | BookTick Travel`  
**Keywords:** travel packages, holiday deals, flights, national tours, international tours, Goa, Kerala, Dubai, Bali, Maldives, travel agency India  
**OpenGraph:** en_IN locale, website type  
**Twitter card:** summary_large_image  
**Robots:** index + follow

---

## 17. Globals / CSS

**Body class:** `antialiased` + all 4 font variables  
**Background color (sections):** cream `#FAF7F2` (`bg-cream`)  
**Scrollbar:** hidden on tab rows (`[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`)

---

## 18. Key UX Patterns

1. **Enquiry-first design** — no "Book Now", always "Enquire Now" / "Get Quote"
2. **WhatsApp as primary support channel** — always visible (float button + sidebar card + card buttons)
3. **Phone number always accessible** — in header mobile menu, footer, contact page
4. **"No direct booking" disclaimer** — shown on package detail sidebar
5. **2-hour response promise** — shown in enquiry modal + API response message
6. **Frosted glass tags on photos** — white `rgba(255,255,255,0.88)` + blur for readability on any image
7. **Soft tinted badges on white cards** — color-coded by badge type, always readable
8. **Animated stats on scroll** — counts up once when entering viewport
9. **Mobile-first responsive** — all sections stack cleanly, drawers for filters
10. **Scroll-aware header** — transparent on homepage hero, solid white elsewhere

---

*End of BookTick Website Specification*
