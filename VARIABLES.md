# Editable Variables Reference

All the things you can change without touching core code.

---

## CSS Variables (css/styles.css, line 6)

| Variable | Current Value | What it controls |
|---|---|---|
| `--color-yellow` | `#FFD200` | Every accent, CTA, number highlight |
| `--color-bg` | `#0a0a0a` | Page background |
| `--color-bg-card` | `#111111` | Card/section backgrounds |
| `--color-offwhite` | `#F5F5F5` | Body text |
| `--color-muted` | `#A0A0A0` | Fine print, labels |
| `--max-width` | `1400px` | Maximum container width |

---

## Dynamic Date (js/main.js, line 12)

The date is locked to **Tuesday 21 April 2026** until the day after that first workshop (controlled by `firstWorkshopCutoff`). From 22 April onwards it auto-calculates "next Tuesday" evergreen.

To change the workshop day after the first one ships (e.g. to Wednesday), edit the number `2` in the `getNextWorkshopDate()` function (0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat). To change the first-workshop lock date, edit the `firstWorkshopCutoff` and the return value inside the `if (now < firstWorkshopCutoff)` block.

---

## Case Study Numbers (index.html, Section 5)

| Client | Current Number | Label |
|---|---|---|
| Richard, Premier Gates | 30 to 150+ | Leads per month |
| Shane, Signature Fab | 6 Months | Booked out ahead |
| Kyle, A-One Fencing | 45 to 5 | Minutes to quote |
| Ed, Ontop Roofing | 650sqm | Roofs in 48 hours |

Edit these directly in the `.case-card__number` elements in `index.html`.

---

## Bonus Names (index.html, Section 9)

1. The Instant Estimate Email Template
2. The Premium Qualifier
3. The Unit-Rate Pricing Table
4. The ChatGPT Project Instructions Template
5. Workshop Recording (Lifetime Access)

Edit in the `.bonus-item__title` elements.

---

## CTA Copy (index.html)

| Location | Current Copy |
|---|---|
| Top bar button | Save My Seat |
| Hero button | YES, SAVE MY SEAT (IT'S FREE) |
| Sticky mobile CTA | SAVE MY SEAT (FREE) |
| Form submit button | YES, SAVE MY SEAT (IT'S FREE) |
| Strategy call button | BOOK A 20-MIN STRATEGY CALL |

---

## Tracking IDs

### Facebook Pixel
File: `index.html`, line ~22. Uncomment and replace `YOUR_PIXEL_ID`.

### Google Analytics 4
File: `index.html`, line ~29. Uncomment the script block and replace `YOUR_GA4_ID`.

---

## Links to Update

| Element | Current href | Replace with |
|---|---|---|
| Strategy call button (Section 10) | `#` | GHL/Calendly booking URL |
| Privacy Policy (footer) | `#` | Actual privacy policy URL |
| Terms of Service (footer) | `#` | Actual terms URL |

---

## Assets to Replace

| Placeholder | Location | Replace with |
|---|---|---|
| Hero photo placeholder | Section 2 `.hero__image-placeholder` | `<img>` tag with actual photo |
| Headshot placeholder | Section 8 `.about__photo-placeholder` | `<img>` tag with actual headshot |
| Text logos "CRACKA SYSTEMS" | Header, Section 8, Footer | Actual SVG logo file |
| Press logo text | Section 3 `.press__logo` | Actual SVG logo images |
| Client logos | Section 5 case cards | Actual client logo images |
