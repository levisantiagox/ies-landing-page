# SOP: Lead-Gen Landing Page Build

## Standard Operating Procedure for High-Converting Workshop / Offer Landing Pages

**Project Reference:** Cracka Systems — Instant Estimate System (IES) Workshop Landing Page  
**Built by:** Levi Santiago / New Way Business  
**Architecture:** Static HTML/CSS/JS, GoHighLevel API integration, GitHub Pages deployment  
**Last updated:** April 2026

---

## 1. Project Overview

**What was built:** A single-page lead generation landing page for a free live workshop (The Instant Estimate System), targeting unit-rate metal tradies in Australia (roofers, fencers, gate fabricators, roof restorers). The page captures registrations via a native HTML form that posts directly to GoHighLevel (GHL) to create contacts and pipeline opportunities.

**For whom:** Cracka Systems (trades-specific automation arm of New Way Business), operated by Levi Santiago on the Gold Coast, QLD.

**Why:** To drive workshop registrations from cold/warm Meta ad traffic, convert organic search visitors, and build a pipeline of qualified trade business owners for the done-for-you service offering.

**Pages:**
- **Main landing page** (`index.html`) — Full sales page with registration form
- **Thank-you page** (`thank-you/index.html`) — Post-registration confirmation with Meta Pixel `CompleteRegistration` event and strategy call upsell

---

## 2. Tech Stack

| Component | Tool / Library | Notes |
|---|---|---|
| Markup | Static HTML5 | Semantic elements, no framework |
| Styling | Vanilla CSS3 | Custom properties for tokens, no preprocessor |
| JavaScript | Vanilla JS (ES5-compatible IIFEs) | No build step, no bundler |
| Fonts | Google Fonts — Inter (400, 600, 700, 800, 900) | `font-display: swap` via Google Fonts URL |
| Animations | GSAP 3.12.7 + ScrollTrigger | CDN via jsDelivr |
| Smooth Scroll | Lenis 1.1.18 | CDN via jsDelivr |
| Video | Vimeo embed + Vimeo Player SDK | 9:16 aspect ratio, autoplay/loop/muted/background |
| CRM | GoHighLevel API v2021-07-28 | Direct API POST with PIT (Private Integration Token) |
| Proxy (optional) | Cloudflare Worker | Server-side credential storage for production |
| Hosting | GitHub Pages | Custom subdomain via CNAME |
| Tracking | Meta Pixel, GA4 (placeholder) | data-track attributes on CTAs |

### External CDN Resources (all deferred)
```
lenis@1.1.18/dist/lenis.min.js
player.vimeo.com/api/player.js
gsap@3.12.7/dist/gsap.min.js
gsap@3.12.7/dist/ScrollTrigger.min.js
fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap
```

---

## 3. Brand Setup

### 3.1 SVG Text Logos
Logos are rendered as inline SVG `<text>` elements, not image files. This keeps them resolution-independent, instantly editable, and zero-HTTP-request.

```html
<!-- Full logo -->
<svg class="logo-svg" viewBox="0 0 310 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <text x="0" y="30" font-family="Inter, sans-serif" font-weight="900" font-size="28" fill="#FFFFFF">BRAND NAME</text>
</svg>

<!-- Small logo -->
<svg class="logo-svg logo-svg--small" viewBox="0 0 280 35" fill="none" xmlns="http://www.w3.org/2000/svg">
  <text x="0" y="26" font-family="Inter, sans-serif" font-weight="900" font-size="24" fill="#FFFFFF">BRAND NAME</text>
</svg>
```

**Key:** Adjust the `viewBox` width to fit the text. The `y` attribute controls baseline position. Test in browser to ensure no clipping.

### 3.2 CSS Custom Properties (Design Tokens)
All brand colours, fonts, spacing, and easing are defined as CSS custom properties in `:root`:

```css
:root {
  --color-bg: #0a0a0a;
  --color-bg-card: #111111;
  --color-yellow: #FFD200;        /* Primary accent */
  --color-orange: #FF6B1F;        /* Gradient accent */
  --color-white: #FFFFFF;
  --color-offwhite: #F5F5F5;      /* Body text */
  --color-muted: #A0A0A0;         /* Fine print, labels */
  --color-border: #222222;
  --color-negative: #424242;      /* "Not for you" icons */

  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --max-width: 1400px;
  --gutter: 24px;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
```

**To rebrand:** Change these 10 variables plus swap the Google Font. Everything cascades.

### 3.3 Typography Scale
| Class | Size | Weight | Use |
|---|---|---|---|
| `.eyebrow` | 12px | 700 | Section labels, uppercase, letter-spaced |
| `.hero__h1` | 80px (clamp 44-72px mobile) | 900 | Main headline |
| `.h2-stacked` | 62px (42px mobile) | 900 | Section headings, multi-line |
| `.h2-single` | 62px (42px mobile) | 900 | Section headings, single-line |
| `.section__subhead` | 18px | 400 | Section intros |
| `.section__body` | 18px | 400 | Body paragraphs |
| Base body | 16px | 400 | Default |

### 3.4 Colour Palette
- **Background:** Near-black (#0a0a0a) — high contrast, premium feel
- **Primary accent:** Yellow (#FFD200) — CTAs, numbers, highlights, proof bars
- **Secondary accent:** Orange (#FF6B1F) — gradient endpoints (progress bar, CTA card top border)
- **Text:** Off-white (#F5F5F5) body, white (#FFFFFF) headings, muted (#A0A0A0) fine print
- **Cards:** Slightly lighter black (#111111) with subtle border (#222222)

---

## 4. Page Architecture — Section-by-Section

### Section 0: Global CRO Elements (stitch.css / stitch.js)
- **Scroll progress bar** — Fixed top, 3px height, yellow-to-orange gradient, width tracks scroll position
- **Social proof toast** — Fixed bottom-left, randomised names/suburbs/times, 15-25s frequency, pauses when registration section is in view

### Section 1: Sticky Top Bar
- Fixed position, z-index 1000, blurred background (`backdrop-filter: blur(10px)`)
- Three columns: Logo | Workshop date info | "Save My Seat" CTA
- Date info hidden on tablet (1024px), full bar collapses gracefully on mobile
- All dates are dynamically calculated (next Thursday from today)

### Section 2: Hero
- Centered layout, max-width 800px
- Eyebrow tag: "LIVE WORKSHOP - BUILT FOR UNIT-RATE TRADES"
- H1: 4 lines, staggered GSAP reveal (word-by-word, 0.2s stagger)
- Subhead: Benefit-driven copy, fades in after H1
- Proof bar: Yellow left border, single case study stat, slides in from left
- Primary CTA button with `data-track="hero_cta_click"`
- Trust line: Date, time, seat count, recording included

### Section 3: VSL Video
- Vimeo embed in 9:16 aspect ratio wrapper (`aspect-ratio: 9 / 16`, max-width 480px)
- Background mode: `?autoplay=1&loop=1&muted=1&background=1&dnt=1&quality=1080p`
- Yellow glow effect behind video (radial gradient, pointer-events none)
- Custom controls overlay: Play/Pause + Mute/Unmute buttons
- Controls use Vimeo Player SDK (`new Vimeo.Player(iframe)`)
- Icons toggle visibility (display none/block) on state change

### Section 4: Press / Featured-In Marquee
- Infinite horizontal scroll using CSS `@keyframes marquee`
- Items duplicated in HTML with `aria-hidden="true"` for seamless loop
- CSS mask gradient fades edges (`mask-image: linear-gradient(...)`)
- 20s animation desktop, 30s mobile (slower for readability)

### Stitch: Arrow Connector
- Bouncing down-arrow SVG between sections
- 2s ease-in-out infinite bounce animation (6px translateY)
- Fades in on scroll via IntersectionObserver (one-shot, then unobserved)

### Section 5: The Problem (Numbered Punches)
- H2 headline: Multi-line stacked, GSAP reveal
- Three numbered punches (01, 02, 03) with large yellow numbers
- GSAP stagger animation: y:30, opacity:0, 0.2s stagger
- Transition line at bottom: yellow left bar + bold summary statement

### Stitch: Micro CTA
- Text link between sections: "Still reading? Good. Here's the proof. Save my seat"
- Subtle background (`rgba(255, 210, 0, 0.02)`), bordered top/bottom
- Fades in on scroll via IntersectionObserver

### Section 6: Case Studies Grid
- 2-column grid (stacks to 1 on mobile)
- Each card: Large stat number, label, description, client name
- Cards have dark background, subtle border, rounded corners
- GSAP stagger animation on scroll

### Inline CTA
- Full-width centered primary button: "SAVE MY SEAT (IT'S FREE)"
- `data-track="inline_cta_click"` for analytics

### Section 7: Outcomes (What You'll Walk Away With)
- 3-column grid (stacks to 1 on tablet)
- Each block: Number, title, body text
- Yellow left bar accent (4px width, 48px height, absolute positioned)
- GSAP slide-in from left animation

### Section 8: Qualifier (Yes If / Not For You)
- 2-column grid (stacks to 1 on mobile)
- "Yes" column: Yellow-tinted background, yellow border, tick icons
- "Not for you" column: Dark background, grey border, cross icons
- Tick/cross icons are pure CSS (pseudo-elements with rotation)

### Inline CTA
- "YES, SAVE MY SEAT" button

### Section 9: About (Headshot + Bio)
- 2-column grid: 280px photo column + text column (stacks on tablet)
- Headshot: 240x240px circle, yellow border, `object-fit: cover`
- WebP with JPEG fallback via `<picture>` element
- Bio paragraphs + small logo at bottom

### Stitch: Micro CTA
- "That's who's running it. Now here's what you get. Lock in your seat"

### Section 10: Bonuses List
- Numbered list (01-05) with title + description
- Items separated by bottom borders
- GSAP stagger animation on scroll

### Inline CTA
- "I'M IN - SAVE MY SEAT" button

### Section 11: Strategy Call CTA
- Centered section, text-align center
- Outline button style (transparent background, yellow border)
- Links to external booking URL (GHL/Calendly)
- `data-track="strategy_call_click"`

### Section 12: FAQ Accordion
- Native HTML `<button>` triggers, `hidden` attribute on answers
- Plus icon rotates 45 degrees to become X when open (`transform: rotate(45deg)`)
- Only one item open at a time (closes others on click)
- `aria-expanded` attribute toggled for accessibility
- FAQ content also in JSON-LD structured data in `<head>`

### Section 13: Registration Form
- Gradient background (`linear-gradient(180deg, #0a0a0a 0%, #0f0f0f 100%)`)
- Urgency bar: Pulsing yellow dot, animated seat counter (counts down from 11 to 7)
- Form fields: First name, Last name, Email, Phone, Organisation, Website (optional)
- Honeypot field: Hidden `company_url` input (offscreen, tabindex -1)
- Submit button: Full-width primary CTA
- Fine print: Date, time, duration, recording included
- Form submits via JavaScript to GHL API (see Section 6)

### Section 14: Footer
- Logo + tagline row
- Copyright + Privacy Policy + Terms of Service links
- Minimal, dark, bordered top

### Sticky Mobile CTA
- Fixed bottom bar, only visible on mobile (<640px) between hero and registration
- Yellow background with dark button
- RAF-throttled scroll handler for show/hide logic
- Currently disabled via CSS (`display: none`)

---

## 5. CRO Stitch Elements

These are the conversion-focused elements stitched between and around the main content sections. They are implemented in `css/stitch.css` and `js/stitch.js`.

### 5.1 Scroll Progress Bar
- Fixed at top of viewport, above everything (z-index 1001)
- 3px height, yellow-to-orange gradient
- Width updates on scroll via RAF-throttled handler
- CSS transition for smoothing (`width 0.1s linear`)

### 5.2 Section Stitch Connectors (Bouncing Arrows)
- SVG down-arrows placed between sections
- CSS keyframe animation: 2s ease-in-out infinite, 6px bounce
- Opacity 0.3, fade in on scroll via IntersectionObserver
- One-shot observer (unobserves after first trigger)

### 5.3 Micro-CTA Text Links
- Text links with contextual copy placed between sections
- Subtle bordered container with near-transparent yellow background
- Links point to `#register`
- Fade in on scroll via shared IntersectionObserver

### 5.4 Social Proof Toast Notifications
- Fixed bottom-left popup with name, action, and checkmark icon
- Randomised from arrays of 15 names (trade + suburb combinations) and 8 action strings
- Show for 4 seconds, then hide
- New toast every 15-25 seconds (random interval)
- Initial delay of 8 seconds after page load
- **Pauses when registration section is in view** (IntersectionObserver, threshold 0.3)
- Slide-in animation via CSS transitions
- `aria-live="polite"` for screen readers

### 5.5 Urgency Bar
- Displayed above the registration form
- Pulsing yellow dot (CSS animation: box-shadow expansion + opacity)
- Seat counter that animates from 11 down to 7 on first view
- Uses IntersectionObserver (threshold 0.5), disconnects after animation

### 5.6 Inline Save My Seat CTAs
- Full-width centered primary buttons placed between sections
- Positioned after: Case Studies, Qualifier, Bonuses
- Each has `data-track="inline_cta_click"` for analytics

---

## 6. GHL Integration

### 6.1 Architecture
The form posts directly to the GoHighLevel API from the client using a Private Integration Token (PIT). This is a two-step process:

1. **Create/update contact** — `POST /contacts/` with name, email, phone, company, tags, source
2. **Create opportunity** — `POST /opportunities/` with the returned `contactId`, pipeline ID, stage ID

### 6.2 Configuration
```javascript
var GHL_LOCATION_ID = 'YOUR_LOCATION_ID';
var GHL_PIT = 'pit-YOUR-PIT-TOKEN';
var GHL_API = 'https://services.leadconnectorhq.com';
```

### 6.3 PIT Scoping
The PIT must be scoped with minimum permissions:
- **Contacts:** Write (create/update contacts)
- **Opportunities:** Write (create opportunities)

No other scopes needed. Generate the PIT in GHL > Settings > Integrations > Private Integration Tokens.

### 6.4 API Headers
```javascript
{
  'Authorization': 'Bearer ' + GHL_PIT,
  'Content-Type': 'application/json',
  'Version': '2021-07-28'
}
```

### 6.5 Contact Payload
```javascript
{
  firstName: 'John',
  lastName: 'Smith',
  email: 'john@example.com',
  phone: '0412345678',
  companyName: 'Smith Fencing',
  website: 'https://smithfencing.com.au',  // optional
  locationId: GHL_LOCATION_ID,
  tags: ['cracka workshop'],
  source: 'Cracka Systems - IES Landing Page'
}
```

### 6.6 Opportunity Payload
```javascript
{
  pipelineId: 'YOUR_PIPELINE_ID',
  pipelineStageId: 'YOUR_STAGE_ID',
  locationId: GHL_LOCATION_ID,
  contactId: contactId,  // from Step 1 response
  name: 'John Smith — Cracka Workshop',
  status: 'open',
  source: 'Cracka Systems - IES Landing Page'
}
```

### 6.7 Honeypot Spam Protection
A hidden field (`#company_url`) is positioned offscreen. Real users never see or fill it. Bots that auto-fill all fields trigger a silent rejection:
```javascript
var honeypot = form.querySelector('#company_url');
if (honeypot && honeypot.value) {
  console.log('[IES] Honeypot triggered — submission blocked.');
  return;
}
```

### 6.8 Error Handling
- Button text changes to "SUBMITTING..." and disables on submit
- On failure: button turns red with "SOMETHING WENT WRONG - TRY AGAIN", resets after 3 seconds
- Console errors logged with `[IES]` prefix

### 6.9 Cloudflare Worker Proxy (Production)
For production, the PIT should NOT be in client-side code. Use the Cloudflare Worker proxy at `worker/ghl-proxy.js`:

- Environment variables `GHL_PIT` and `GHL_LOCATION_ID` set in Cloudflare dashboard
- CORS whitelist for allowed origins
- Handles preflight OPTIONS requests
- Same two-step contact + opportunity creation
- Deploy with `wrangler deploy` or paste into Cloudflare dashboard

To switch the form to use the proxy, change the fetch URL in `main.js` from `services.leadconnectorhq.com` to your worker URL, and remove the Authorization header (the worker adds it server-side).

---

## 7. Thank You Page

**Path:** `thank-you/index.html`

### Structure
1. **Header** — Logo linking back to main page (`../`)
2. **Confirmation hero** — Checkmark badge (animated pop), "YOU'RE IN. SEAT LOCKED." headline, workshop details (date, time, duration) in pill-style cards
3. **What happens next** — Three numbered steps (Check inbox, Show up ready, Leave competitors behind)
4. **Strategy call CTA** — Card with gradient top border, booking link, scarcity copy
5. **Footer** — Logo, tagline, copyright

### Meta Pixel CompleteRegistration
The thank-you page fires `CompleteRegistration` immediately on page load (not on a button click):
```javascript
fbq('init', '1269708681588720');
fbq('track', 'PageView');
fbq('track', 'CompleteRegistration');
```

### SEO
- `<meta name="robots" content="noindex, nofollow">` — Prevents indexing
- No JSON-LD structured data (not needed for a thank-you page)

### Assets
- Uses relative paths (`../css/styles.css`, `../css/thank-you.css`)
- Inherits base styles from `styles.css`, extends with `thank-you.css`
- No JavaScript files loaded (no animations, no Lenis, no GSAP)
- Dynamic date still works via inline reference but no JS to update it (static fallback)

---

## 8. Tracking Setup

### 8.1 Meta Pixel
- Initialised in `<head>` on both pages
- `PageView` fires on every page load
- `CompleteRegistration` fires on thank-you page
- Custom events via `fbq('trackCustom', eventName)`

### 8.2 Google Analytics 4
- Placeholder code commented out in `<head>`
- Uncomment and replace `YOUR_GA4_ID` when ready
- Events fire via `gtag('event', eventName)`

### 8.3 Custom Event Tracking
All interactive elements have `data-track` attributes:

| Element | data-track value |
|---|---|
| Top bar CTA | `sticky_cta_click` |
| Hero CTA | `hero_cta_click` |
| Inline CTAs | `inline_cta_click` |
| Strategy call button | `strategy_call_click` |
| FAQ expand buttons | `faq_expand` |
| Sticky mobile CTA | `sticky_cta_click` |

The tracking function fires both `fbq('trackCustom')` and `gtag('event')`:
```javascript
function trackEvent(eventName) {
  if (typeof fbq === 'function') fbq('trackCustom', eventName);
  if (typeof gtag === 'function') gtag('event', eventName);
  console.log('[IES Track]', eventName);
}
```

Form submission also fires `workshop_register` event before redirect.

---

## 9. Performance Optimisations

| Optimisation | Implementation |
|---|---|
| WebP images | `<picture>` with WebP source + JPEG fallback |
| Deferred scripts | All `<script>` tags use `defer` attribute |
| RAF-throttled scroll | Both scroll progress and sticky mobile CTA use `requestAnimationFrame` throttling |
| Single Lenis RAF | Lenis synced to GSAP ticker (`gsap.ticker.add`), no duplicate RAF loop |
| Preconnect hints | `<link rel="preconnect">` for Google Fonts, Google Fonts static, jsDelivr |
| Font display | Google Fonts loaded with `display=swap` parameter |
| Image dimensions | `width` and `height` attributes on all `<img>` tags to prevent layout shift |
| Lazy loading | `loading="lazy"` on below-fold images |
| IntersectionObserver cleanup | Observers `unobserve` or `disconnect` after one-shot animations |
| No unused CSS | Dead styles cleaned out during build |
| Minimal DOM | No framework overhead, no virtual DOM |

---

## 10. SEO

### 10.1 Meta Tags
```html
<title>The Instant Estimate System — Live Workshop for Metal Trades | Cracka Systems</title>
<meta name="description" content="Free live workshop for metal roofers, fencers, gate fabricators and roof restorers...">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:type" content="website">
<meta property="og:image" content="assets/images/hero-banner.png">
```

The meta description is dynamically updated by JavaScript to include the calculated next Thursday date.

### 10.2 JSON-LD Structured Data

**EducationEvent:**
```json
{
  "@type": "EducationEvent",
  "name": "The Instant Estimate System — Live Workshop for Metal Trades",
  "organizer": { "@type": "Organization", "name": "Cracka Systems" },
  "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
  "isAccessibleForFree": true,
  "offers": { "price": "0", "priceCurrency": "AUD", "availability": "LimitedAvailability" },
  "performer": { "@type": "Person", "name": "Levi Santiago" }
}
```

**FAQPage:**
All FAQ items duplicated in JSON-LD for rich snippet eligibility.

### 10.3 Semantic HTML
- `<header>`, `<section>`, `<footer>` elements
- `<h1>` on hero, `<h2>` on sections, `<h3>` and `<h4>` for sub-sections
- `<button>` for FAQ toggles (not `<div>`)
- `aria-expanded`, `aria-hidden`, `aria-label`, `aria-live` attributes throughout
- `hidden` attribute for collapsed FAQ answers

---

## 11. Deployment

### 11.1 GitHub Pages
1. Push code to a GitHub repository
2. Go to Settings > Pages > Source: Deploy from branch (main)
3. Add a `CNAME` file at the root with the custom domain (e.g., `workshop.cracka.digital`)

### 11.2 Custom Domain DNS
1. In your DNS provider, create a CNAME record:
   - **Name:** `workshop` (or whatever subdomain)
   - **Value:** `your-username.github.io`
2. GitHub auto-provisions HTTPS via Let's Encrypt
3. Wait 5-15 minutes for DNS propagation and certificate issuance

### 11.3 Cloudflare Worker (if using proxy)
1. Install Wrangler CLI: `npm install -g wrangler`
2. Login: `wrangler login`
3. Set environment variables in Cloudflare dashboard (Workers > Settings > Variables):
   - `GHL_PIT` = your PIT token
   - `GHL_LOCATION_ID` = your GHL location ID
4. Deploy: `wrangler deploy` from the `worker/` directory

---

## 12. File Structure

```
ies-landing-page/
├── index.html                    # Main landing page
├── CNAME                         # Custom domain for GitHub Pages
├── VARIABLES.md                  # Quick reference for editable values
├── SOP-LANDING-PAGE-BUILD.md     # This document
├── css/
│   ├── styles.css                # Base styles, brand tokens, all section styles
│   ├── stitch.css                # CRO stitch element styles
│   └── thank-you.css             # Thank-you page specific styles
├── js/
│   ├── main.js                   # Dynamic date, Lenis, GSAP, FAQ, form, tracking
│   └── stitch.js                 # Scroll progress, toasts, stitch reveals, Vimeo controls
├── assets/
│   └── images/
│       ├── hero-banner.png       # OG image / hero banner
│       ├── hero-banner.webp      # WebP version
│       ├── levi-headshot.jpeg    # About section headshot
│       └── levi-headshot.webp    # WebP version
├── thank-you/
│   └── index.html                # Post-registration confirmation page
└── worker/
    ├── ghl-proxy.js              # Cloudflare Worker GHL proxy
    └── wrangler.jsonc            # Wrangler config for Worker deployment
```

---

## 13. Checklist for New Builds

Use this step-by-step checklist when replicating this architecture for a new landing page.

### Pre-Build
- [ ] Confirm brand name, colours, font
- [ ] Get GHL Location ID, Pipeline ID, Pipeline Stage ID
- [ ] Generate PIT token (scoped to Contacts Write + Opportunities Write)
- [ ] Get Meta Pixel ID
- [ ] Get GA4 Measurement ID (if available)
- [ ] Get Vimeo video URL (if using VSL)
- [ ] Get booking/calendar link (if using strategy call CTA)
- [ ] Get custom domain and confirm DNS access
- [ ] Collect headshot photo, OG image, any press logos
- [ ] Write all copy: headline, subhead, proof bar, problem punches, case studies, outcomes, qualifier lists, about bio, bonuses, FAQ Q&As, form section copy

### Build — HTML
- [ ] Copy `index.html` as template
- [ ] Update `<title>`, `<meta description>`, OG tags
- [ ] Update JSON-LD EducationEvent schema (name, organizer, performer)
- [ ] Update JSON-LD FAQPage schema with actual FAQ content
- [ ] Replace Meta Pixel ID
- [ ] Uncomment and configure GA4 snippet
- [ ] Replace all SVG text logos with brand name (3 locations: top bar, about, footer)
- [ ] Update hero copy: eyebrow, H1 lines, subhead, proof bar, trust line
- [ ] Update VSL Vimeo URL (or remove section if no video)
- [ ] Update press/featured-in logos (or remove section)
- [ ] Update problem punches copy
- [ ] Update case study cards (numbers, labels, descriptions, client names)
- [ ] Update outcome blocks copy
- [ ] Update qualifier lists (yes if / not for you)
- [ ] Update about section (headshot, bio, brand references)
- [ ] Update bonus items
- [ ] Update strategy call copy and booking link
- [ ] Update FAQ questions and answers
- [ ] Update registration section copy (headline, body, urgency bar, fine print)
- [ ] Update footer (copyright entity name, links)
- [ ] Update CNAME file with new domain

### Build — CSS
- [ ] Update CSS custom properties in `:root` (colours, font, max-width)
- [ ] Adjust heading sizes if brand requires
- [ ] Update `.btn--primary` colour and hover glow to match new accent
- [ ] Test responsive breakpoints (640px, 1024px)

### Build — JavaScript
- [ ] Update `GHL_LOCATION_ID`, `GHL_PIT`, pipeline/stage IDs in `main.js`
- [ ] Update dynamic date function if workshop day is not Thursday
- [ ] Update social proof toast names/suburbs in `stitch.js` to match target audience
- [ ] Update tags array in contact payload
- [ ] Update source string in both contact and opportunity payloads
- [ ] Update `console.log` prefix from `[IES]` to new project prefix
- [ ] Update seat count starting number if different

### Build — Thank You Page
- [ ] Copy `thank-you/index.html` as template
- [ ] Update page title, meta description
- [ ] Update Meta Pixel ID and ensure `CompleteRegistration` fires
- [ ] Update confirmation hero copy
- [ ] Update "what happens next" steps
- [ ] Update strategy call CTA and booking link
- [ ] Update footer

### Build — Worker (if using proxy)
- [ ] Copy `worker/ghl-proxy.js`
- [ ] Update `ALLOWED_ORIGINS` array with new domains
- [ ] Update pipeline ID and stage ID
- [ ] Update tags and source strings
- [ ] Update `wrangler.jsonc` with new worker name
- [ ] Set environment variables in Cloudflare dashboard
- [ ] Deploy with `wrangler deploy`
- [ ] Update `main.js` to POST to worker URL instead of GHL direct

### Build — Assets
- [ ] Convert all images to WebP (keep originals as fallback)
- [ ] Add `width` and `height` attributes to all `<img>` tags
- [ ] Add `loading="lazy"` to below-fold images
- [ ] Create OG image (1200x630px recommended)

### Pre-Launch QA
- [ ] Test form submission end-to-end (check GHL contact + opportunity created)
- [ ] Test honeypot rejection
- [ ] Verify Meta Pixel fires (use Meta Pixel Helper extension)
- [ ] Verify CompleteRegistration fires on thank-you page
- [ ] Check all anchor links scroll correctly
- [ ] Test on mobile (iPhone Safari, Android Chrome)
- [ ] Test on desktop (Chrome, Firefox, Safari, Edge)
- [ ] Run Lighthouse audit (aim for 90+ on all scores)
- [ ] Verify `prefers-reduced-motion` disables all animations
- [ ] Check JSON-LD with Google Rich Results Test
- [ ] Verify dynamic date shows correct next Thursday
- [ ] Test FAQ accordion (only one open at a time)
- [ ] Verify social proof toasts pause at registration section
- [ ] Verify Vimeo controls work (play/pause, mute/unmute)
- [ ] Check all `data-track` attributes fire events

### Deployment
- [ ] Push to GitHub
- [ ] Enable GitHub Pages (Settings > Pages > main branch)
- [ ] Add CNAME file
- [ ] Configure DNS CNAME record
- [ ] Wait for HTTPS provisioning
- [ ] Test live URL
- [ ] Deploy Cloudflare Worker (if using proxy)
- [ ] Switch form endpoint to worker URL (if using proxy)
- [ ] Final live test of form submission

---

## Appendix: Quick-Reference for Editable Variables

See `VARIABLES.md` in the project root for a condensed list of all values that can be changed without touching core code structure.
