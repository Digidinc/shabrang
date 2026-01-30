---
id: RIVER-006
title: UI/UX Audit & Bug Report (Jan 2026)
status: todo
assignee: river
priority: high
tags: [bug, ui, mobile, css]
---

# UI/UX Audit Results

Automated browser inspection revealed significant visual regression and layout issues.

## Critical Issues (Bugs)

### 1. Mobile Menu Broken & Navigation Leak
- **Location**: Global Header
- **Issue**: 
    - **Mobile**: Navigation links (`Book`, `Art`, `Blog`, `Topics`, `About`) are not hidden or styled, appearing as squashed text "BookArtBlogTopicsAbout".
    - **Desktop**: These raw links "leak" into the view below the header on some pages.
- **Fix**: Implement proper `Disclosure` for mobile and ensure desktop nav is correctly hidden/styled in the responsive logic.

### 2. Header Content Overlap
- **Location**: Global (Mobile)
- **Issue**: The sticky header overlaps page content (breadcrumbs, titles).
- **Fix**: Adjust `main` padding-top or header z-index/height settings.

### 3. Sidebar Text Clipping & Separators
- **Location**: Sidebar (Desktop)
- **Issue**: 
    - Long chapter titles are clipped/wrapped awkwardly.
    - **Books Page**: Horizontal separators cut through layout unevenly.
- **Fix**: Improve CSS for sidebar items and separator margins.

### 4. Hydration Mismatch (Art Page)
- **Location**: `/en/art`
- **Issue**: Browser console reports hydration errors (server/client mismatch).
- **Fix**: Investigate `<body>` class differences or irregular nesting in the Art component.

## Aesthetic & Polish

### 4. Missing Voice Box Styling
- **Location**: Book Chapters (`liquid-fortress`)
- **Issue**: `.voice-river` and `.voice-kasra` divs have headers but lack distinct container styling (borders, backgrounds).
- **Fix**: Add entries to `globals.css` or Tailwind config for these classes.
  - River: Parchment/Gold border.
  - Kasra: Blue-print/Grid background.

### 5. Reading Mode Layout
- **Location**: Chapter Pages
- **Issue**: Content centering is inconsistent when sidebar is hidden.
- **Fix**: Ensure `max-w-prose` and `mx-auto` are applied correctly in Reading Mode.

### 6. Breadcrumb Mobile Visibility
- **Location**: Chapter Pages (Mobile)
- **Issue**: Breadcrumbs are hidden behind the header elements.
- **Fix**: Adjust vertical spacing for mobile.

### 7. Footer Design
- **Location**: Global Footer
- **Issue**: Footer is too minimal/sparse compared to the rest of the site.
### 8. Typography: "M-Stack" Issue
- **Location**: `/en/topics`
- **Issue**: `text-transform: uppercase` turns "μ-Stack" into "M-STACK", losing the semantic meaning of "Micro".
- **Fix**: Use `normal-case` class specifically for the "μ" character or title.

### 9. Art Page Placeholders
- **Location**: `/en/art`
- **Issue**: Grid uses text overlays ("MU5", "MU1") instead of actual images.
- **Fix**: Implement proper `<Image>` components with fallbacks.

### 10. Blog Sidebar Density
- **Location**: `/en/blog`
- **Issue**: Tag list is too dense and hard to scan.
- **Fix**: Increase line-height or add spacing.
