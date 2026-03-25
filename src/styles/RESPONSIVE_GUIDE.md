# FounderMatch — Mobile & Tablet Responsive Design

## Files Delivered

| File | Replaces |
|------|---------|
| `Shell.jsx` | `src/components/Shell.jsx` |
| `global.css` | `src/styles/global.css` |

---

## What Changed

### Shell.jsx

**Architecture overhaul:**
- Replaced all inline `style={{ }}` responsive hacks with clean CSS class names (`fm-shell`, `fm-sidebar`, `fm-topbar`, etc.)
- Sidebar is now a **slide-in drawer** on mobile — hidden off-canvas, slides in when hamburger is tapped
- **Overlay** dims the page behind the open drawer with a blur effect
- **Body scroll lock** when drawer is open (prevents background scroll)
- Sidebar auto-closes on route change
- Bottom nav dot now only shows when you're NOT already on that route (avoids redundant indicator)
- Accessibility: all interactive elements have `aria-label`, `role`, keyboard handlers

**Bottom nav:**
- Shows on `≤ 767px`
- `Profile` added to bottom nav (replaces some hidden items)
- Active state uses `var(--acc)` for consistent theming

**Topbar:**
- Hamburger hidden on desktop, visible on mobile
- Search bar hidden on mobile (space-efficient)
- "Post Idea" CTA hidden on mobile
- User pill shows avatar only on mobile (name hidden via `.fm-user-pill-name`)
- Notification badge accessible with aria-label

---

### global.css

**New CSS variables:**
```css
--topbar: 54px;   /* topbar height */
--bnav: 62px;     /* bottom nav height */
--radius: 10px;   /* default card radius */
--shadow: 0 4px 24px rgba(0,0,0,.5);
```

**Breakpoints:**
| Breakpoint | Behaviour |
|-----------|-----------|
| `> 1199px` | Full sidebar 290px |
| `≤ 1199px` | Sidebar narrows to 220px |
| `≤ 1024px` | Search bar shrinks; grid helpers collapse 4→2 col |
| `≤ 899px`  | Sidebar 195px, tighter padding |
| `≤ 767px`  | **Off-canvas sidebar**, bottom nav visible, grid 1-col |
| `≤ 480px`  | Smaller font, extra-tight padding |

**Responsive grid helpers** (apply className to your `<div>` wrappers):
```
fm-grid-2      → 2 columns (1 on mobile)
fm-grid-3      → 3 col → 2 col (tablet) → 1 col (mobile)
fm-grid-4      → 4 col → 2 col (tablet) → 1 col (mobile)
fm-grid-2-1    → 2:1 layout → 1 col (mobile)
fm-metrics-row → 4 col → 2 col (tablet/mobile)
fm-founder-list → auto-fill min 280px → 1 col (< 480px)
fm-idea-list    → auto-fill min 260px → 1 col (< 480px)
```

**Modal responsive:**
- On mobile, modals slide up from the bottom as **bottom sheets**
- Drag handle visual added automatically via `::before` pseudo-element
- `max-height: 92dvh` with internal scroll

**Utility classes:**
```
fm-hide-mobile   → hidden on ≤ 767px
fm-hide-tablet   → hidden on ≤ 1024px
fm-show-mobile   → only visible on ≤ 767px
fm-truncate      → text overflow ellipsis
fm-flex          → flex row with gap
fm-flex-wrap     → flex with wrap
fm-table-wrap    → horizontal scroll wrapper for tables
```

---

## Integration Steps

### 1. Replace files
```bash
cp Shell.jsx    your-project/src/components/Shell.jsx
cp global.css   your-project/src/styles/global.css
```

### 2. Update page grids (optional but recommended)

In any page that uses `display:'grid'` with multiple columns, swap inline styles for the helper classes:

**Before:**
```jsx
<div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'10px' }}>
```

**After:**
```jsx
<div className="fm-metrics-row">
```

**Before (2-col detail layout):**
```jsx
<div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
```

**After:**
```jsx
<div className="fm-grid-2">
```

### 3. Bottom padding on page content
The `fm-page-inner` class already adds `padding-bottom: calc(var(--bnav) + 16px)` on mobile so content isn't obscured by the bottom nav. No changes needed if you use Shell's `{children}` pattern.

### 4. Tables
Wrap any table in a scroll container:
```jsx
<div className="fm-table-wrap">
  <table>...</table>
</div>
```

---

## Page-Specific Notes

### Chat (`/chat`)
Use `.fm-chat-layout` for the thread-list + messages split:
```jsx
<div className="fm-chat-layout">
  <div className="fm-chat-sidebar">...</div>
  <div>...</div>
</div>
```
On mobile (≤ 640px), the sidebar collapses. Add a "Back" button to toggle it.

### Dashboard metric cards
Replace inline grid with:
```jsx
<div className="fm-metrics-row">
  <MetricCard .../>
  <MetricCard .../>
  <MetricCard .../>
  <MetricCard .../>
</div>
```

### Investor / Matches cards
```jsx
<div className="fm-founder-list">
  {founders.map(f => <FounderCard .../>)}
</div>
```

---

## Testing Checklist

- [ ] Mobile (375px): hamburger opens drawer, overlay dismisses it
- [ ] Mobile: bottom nav shows correct active state  
- [ ] Mobile: page content not obscured by bottom nav
- [ ] Tablet (768px): sidebar visible and proportional
- [ ] Desktop (1200px+): full sidebar, search bar, CTA button visible
- [ ] Modals slide up from bottom on mobile
- [ ] Metric grids collapse from 4→2→2 cols
- [ ] Chat panel works at all sizes
