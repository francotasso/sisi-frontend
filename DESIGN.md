---
version: beta
name: Sisi
description: Modern general products catalog with minimalist monochrome design and slate accent
colors:
  bg: "#f1f5f9"
  surface: "#ffffff"
  text-primary: "#111827"
  text-secondary: "#6b7280"
  border: "#cbd5e1"
  accent: "#475569"
  accent-hover: "#334155"
  accent-subtle: "rgba(71, 85, 105, 0.08)"
  accent-light: "rgba(71, 85, 105, 0.06)"
  whatsapp: "#25d366"
  whatsapp-hover: "#20bd5a"
  success-bg: "#ecfdf5"
  success-text: "#065f46"
  error-bg: "#fef2f2"
  error-text: "#991b1b"
  soldout-overlay: "rgba(17, 24, 39, 0.7)"
  header-bg: "#ffffff"
  footer-bg: "#111827"
  footer-text: "#d1d5db"
  skeleton: "#cbd5e1"
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.5px
  display-md:
    fontFamily: Sora
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.3px
  display-sm:
    fontFamily: Sora
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.25
  heading-lg:
    fontFamily: Sora
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
  heading-md:
    fontFamily: Sora
    fontSize: 17px
    fontWeight: 600
    lineHeight: 1.3
  body-lg:
    fontFamily: DM Sans
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: DM Sans
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
  label-lg:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.3px
  label-sm:
    fontFamily: DM Sans
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0.5px
  price:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.35
    fontFeature: "tnum"
  price-lg:
    fontFamily: DM Sans
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.35
    fontFeature: "tnum"
rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  gutter: 16px
  container: 1400px
shadows:
  card: "0 1px 3px rgba(0, 0, 0, 0.06)"
  card-hover: "0 4px 12px rgba(0, 0, 0, 0.08)"
  dropdown: "0 8px 24px rgba(0, 0, 0, 0.1)"
  popup: "0 16px 48px rgba(0, 0, 0, 0.12)"
  button-accent: "0 2px 8px rgba(71, 85, 105, 0.25)"
  button-accent-hover: "0 4px 14px rgba(71, 85, 105, 0.35)"
  whatsapp: "0 2px 8px rgba(37, 211, 102, 0.25)"
  whatsapp-hover: "0 4px 14px rgba(37, 211, 102, 0.35)"
components:
  button-whatsapp-primary:
    backgroundColor: "#25d366"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: 14px 24px
    typography: "{typography.body-md}"
    fontWeight: "600"
  button-whatsapp-outline:
    backgroundColor: "transparent"
    textColor: "#25d366"
    borderColor: "#25d366"
    rounded: "{rounded.md}"
    padding: 10px 18px
  button-whatsapp-small:
    backgroundColor: "#25d366"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: 6px 12px
  button-wishlist-toggle:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.full}"
    size: 36px
  button-wishlist-toggle-active:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
  card-product:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    borderColor: "{colors.border}"
    padding: 0
  badge-new:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: 3px 8px
  badge-soldout:
    backgroundColor: "{colors.soldout-overlay}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: 6px 16px
  badge-stock:
    backgroundColor: "{colors.success-bg}"
    textColor: "{colors.success-text}"
    rounded: "{rounded.full}"
    padding: 4px 12px
  badge-stock-empty:
    backgroundColor: "{colors.error-bg}"
    textColor: "{colors.error-text}"
  input-search:
    backgroundColor: "{colors.bg}"
    borderColor: "{colors.border}"
    rounded: "{rounded.md}"
    padding: 8px 12px 8px 36px
  input-search-focus:
    borderColor: "{colors.accent}"
  tab-active:
    textColor: "{colors.accent}"
    fontWeight: "600"
  footer:
    backgroundColor: "{colors.footer-bg}"
    textColor: "{colors.footer-text}"
  scroll-to-top:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    size: 40px
    rounded: "{rounded.full}"
---

# Sisi — Design System

## Overview

Sisi is a modern general products catalog for trending imported products across beauty, tech, home, kids, and more. The design follows a **minimalist monochrome** aesthetic with a distinctive **charcoal slate** accent. The approach is clean, spacious, and typography-driven — letting products speak for themselves without visual noise.

The brand personality is **modern, trustworthy, and versatile** — appealing to shoppers looking for curated trending products. The layout uses generous whitespace, clear typographic hierarchy, and subtle interactions to create a confident, premium feel without being flashy.

## Colors

The palette is rooted in near-monochrome neutrals with a single slate accent.

- **Dark Slate (`#111827`):** Primary text, headings, and footer background. Maximum readability with a modern edge.
- **Cool Gray (`#6b7280`):** Secondary text, metadata, and muted labels. Creates clear hierarchy without competing with primary text.
- **Light Gray (`#f1f5f9`):** Page background. Clean and airy slate-tinted foundation that makes cards and products pop.
- **Pure White (`#ffffff`):** Cards, header, surfaces. Creates contrast against the page background.
- **Border Gray (`#cbd5e1`):** Subtle borders and dividers. Defines layout without visual weight.
- **Slate (`#475569`):** The sole accent — prices, active tabs, wishlist states, "NUEVO" badges, and primary highlights. Passes WCAG AA at 6.8:1 against white (surpassing AAA minimum of 7:1 for enhanced contrast).
- **Slate Hover (`#334155`):** Darker variant for hover states on accent elements.
- **WhatsApp Green (`#25d366`):** Standard WhatsApp brand color for purchase CTAs. Stands apart from the slate accent intentionally.
- **Success (`#ecfdf5` / `#065f46`):** Stock availability indicators.
- **Error (`#fef2f2` / `#991b1b`):** Out of stock and error states.

Light mode only — no dark mode variant exists.

## Typography

The typography strategy uses **Sora** for headings and **DM Sans** for body text, labels, and prices. Both are loaded via `next/font/google` with CSS variables for performance.

- **Display / Headlines:** Sora in 700 (hero) and 600 (headings) weights. Sora is a geometric sans-serif with distinctive circular forms — modern, confident, and clean without being generic.
- **Body:** DM Sans at 14px is the workhorse — highly legible, neutral, and lets Sora headings lead the visual hierarchy.
- **Labels & Metadata:** DM Sans at 11–12px with subtle letter-spacing for categories, spec labels, and badges.
- **Prices:** DM Sans 700 weight with `font-variant-numeric: tabular-nums` for consistent digit alignment across price displays.

All UI text is in Spanish. Code language is English.

## Layout & Spacing

The layout follows a **fluid grid** model on mobile and a **fixed max-width** container (1400px) on desktop.

- **Page container:** `max-width: 1400px`, centered, `padding: 1.5rem` on `main`.
- **Product grid:** `repeat(auto-fill, minmax(180px, 1fr))` with `1.2rem` gap, transitioning to 2-column at 768px.
- **Spacing scale:** Base unit 16px (`md`), with half-steps at 4px (`xs`), 8px (`sm`), and multipliers at 24px (`lg`), 32px (`xl`), 48px (`xxl`).
- **Product detail:** 50/50 flex layout on desktop, stacked single-column at ≤1024px.
- **Wishlist:** 2-column layout (content + 340px sticky sidebar) on desktop, stacked at ≤768px.
- **Footer:** `repeat(auto-fit, minmax(200px, 1fr))` grid, single column at ≤768px.
- **Header:** Fixed/sticky with solid white background and bottom border.

Responsive breakpoints:
- **≤1024px:** Product detail stacks to 1 column, prices and titles scale down.
- **≤768px:** Compact header, 2-column product grid, filters hidden behind toggle, wishlist stacks, footer becomes single column.
- **≤480px:** Minimum 2-column grid (0.6rem gap), compact hero, compact wishlist items.

## Elevation & Depth

Depth is minimal and purposeful — the design favors flat modern elegance over heavy shadows.

- **Cards:** `0 1px 3px rgba(0,0,0,0.06)` resting state, `0 4px 12px rgba(0,0,0,0.08)` on hover with `translateY(-2px)` lift.
- **Header:** `0 1px 0 rgba(0,0,0,0.06)` bottom border.
- **Dropdowns:** `0 8px 24px rgba(0,0,0,0.1)`.
- **Popup:** `0 16px 48px rgba(0,0,0,0.12)` with backdrop overlay.
- **WhatsApp buttons:** Green shadow `0 2px 8px rgba(37,211,102,0.25)`, intensifies on hover.
- **Slate elements:** `0 2px 8px rgba(71,85,105,0.25)` for focused glow.

## Shapes

The shape language follows **clean modern rounding** — functional and restrained.

- **Full pill:** Search bar, stock indicators, social buttons.
- **Large / 12px:** Product cards, wishlist items.
- **Medium / 8px:** Spec cards, WhatsApp buttons, popup content, quantity controls.
- **Small / 4px:** Badges, "NUEVO" badge, remove button.
- **None / 0px:** Dividers, container edges, header bottom border.

All border radii are smaller and more uniform than the previous design — reflecting the modern minimal direction.

## Components

### Buttons

**WhatsApp Primary:** Full-width green (`#25d366` → `#20bd5a` on hover) with `border-radius: 8px`, white text, 14px/24px padding, `translateY(-1px)` hover lift, and green box-shadow. Used for all purchase CTAs.

**WhatsApp Outline:** Border-only variant (`border: 2px solid #25d366`) with green text, fills on hover. Used for secondary actions.

**WhatsApp Small:** Compact variant (6px/12px padding) for per-item purchase buttons in wishlist.

**Wishlist Toggle (Heart):** 36×36px circular icon button with transparent background and gray icon. On activation, fills with slate background and white heart. Hover shows scale(1.1) with slate tint.

**Wishlist Detail Button:** Full-width pill button with border, toggles between outline and filled slate state with `translateY(-1px)` hover and shadow.

**Close / Remove:** Icon-only buttons (X icon) with `opacity: 0.3`, hovering to red.

### Cards

**Product Card:** White background, 12px border-radius, 1px solid border, `0 1px 3px` shadow, clean layout. Image zooms 1.04× on card hover. Content padding 12px/14px.

**Spec Card:** White background, 8px border-radius, 1px border, compact 12px padding. Spec label in muted slate, value in DM Sans. Hover shows slate border tint.

**Wishlist Item:** Horizontal flex row with 64px thumbnail image, category/name/price text, quantity controls, and action buttons. Hover shows subtle shadow.

**Wishlist Summary Card:** White background, 12px border-radius, 1.5rem padding, sticky sidebar with per-product breakdown, total, and consolidated WhatsApp button.

### Badges

**"NUEVO":** Slate background (`#475569`), white text, 11px, DM Sans 600, small 4px rounded rectangle. Positioned absolute top-left of product image.

**"Agotado":** Semi-transparent dark overlay (`rgba(17, 24, 39, 0.7)`) with centered pill shape. White text.

**Stock Indicator:** Green background (`#ecfdf5`) with dark green text or red background (`#fef2f2`) with dark red text. Full pill, inline.

### Navigation

**Breadcrumb:** Flex row with 0.5rem gap, muted text, slate on hover for links.

**Category Tabs:** Horizontal flex row with `border-bottom`, each tab has slate underline indicator on `.active` state.

**Pagination:** Numeric buttons. Active page gets slate background with shadow.

### Search

Rectangular input (8px border-radius, full-width on mobile) with slate focus ring. Results dropdown appears below with card-style items.

### Footer

Dark background (`#111827`) with top border. Light gray text. 4-column responsive grid. Clean, minimal.

### Scroll to Top

Fixed 40×40px slate circle at bottom-right with shadow. Appears on scroll. Hover lifts 2px.

## Animations

- **Hover lift:** Cards and buttons use `translateY(-2px)` with subtle shadow intensification. Shorter distance than previous design for a more restrained feel.
- **Image zoom:** Product card images scale to 1.04× on hover — subtle and refined.
- **Loading spinner:** 32×32px circle with slate top-border, `spin` keyframe at 0.8s.

No fadeInUp or staggered reveal animations — products appear immediately for a cleaner, more utilitarian feel. The design prioritizes speed and clarity over theatrical entry.

## Do's and Don'ts

- Do use the slate accent consistently — for prices, CTAs, badges, and active states.
- Do keep all prices in DM Sans 700 with `tabular-nums` for consistent digit alignment.
- Do maintain WCAG AA contrast ratios: slate `#475569` passes at 6.8:1 against white (surpassing AAA minimum of 7:1 for enhanced contrast).
- Don't use Sora for body text or labels — reserve it exclusively for headings and the logo.
- Don't introduce dark mode — the design is light-mode only.
- Don't use gradient backgrounds, glassmorphism, or heavy shadows — the aesthetic is flat and minimal.
- Don't exceed the border radius scale — stick to 4px/8px/12px.
- Do use the monochrome palette dominantly — slate accents should be subtle and functional, not decorative.
- Don't use inline `style` props for colors or spacing — prefer CSS variables.
- Do ensure all icon-only buttons have `aria-label` attributes for accessibility.
