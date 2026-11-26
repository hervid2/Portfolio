---
name: ui-tokens-motion
description: Use when building or restyling any portfolio UI (components, sections, modals, buttons) to apply the Tailwind design tokens, semantic classes, themes and shared motion presets.
---
# UI tokens and motion

## When it applies
Any `.tsx` markup or `frontend/src/styles/index.css` change, and any animation.

## Deterministic rules
1. **Colors come only from the tokens** in `frontend/tailwind.config.ts`. They are backed by CSS variables in `styles/index.css`, which defines a dark default and a `.theme-light` override.
   - `surface-base` · `surface-card` · `surface-muted`
   - `text-primary` · `text-secondary`
   - `border-subtle`
   - `accent-cyan` · `accent-cyan-strong`
   - `shadow-card`
2. **No hex, rgb or arbitrary color values** (`bg-[#…]`). A new token means changing both themes in `index.css`, and it needs plan approval.
3. **Fonts:** `font-display` (Poppins) for headings; `font-body` (Inter) for text.
4. **Reuse the semantic classes** before writing utilities:
   - `.section-title`, `.section-subtitle`
   - `.btn-primary`: filled cyan, the primary CTA
   - `.btn-secondary`: outlined, the secondary CTA

   A pattern repeated 3 or more times becomes a new `@apply` class.
5. **Class order:** layout → sizing → spacing → typography → colors → borders → effects → transitions → responsive → dark. Mobile-first: base, then `md:`, then `lg:`.
6. **Motion:** import from `frontend/src/utils/motionPresets.ts`; never hand-tune new springs.
   - `fadeUpVariants`, `gridItemVariants`, `createStaggerContainer()`
   - `ENTRANCE_SPRING`, `LAYOUT_SPRING`, `HOVER_SPRING`
   - `HOVER_LIFT_Y`, `HOVER_LIFT_Y_SMALL`
   - `REPLAY_VIEWPORT`
7. **Reduced motion:** `App.tsx` wraps everything in `<MotionConfig reducedMotion="user">`, so motion components comply automatically. CSS animations and autoplaying media must check `prefers-reduced-motion` themselves (see `hooks/useMediaQuery.ts`, `hooks/useHoverPreviewVideo.ts`).
8. **LCP element:** the hero `h1` animates with no delay and never starts fully transparent (see the JSDoc in `HeroSection.tsx`). Keep that property when you touch the hero.
9. **Modals** (`components/ui/*Modal.tsx`):
   - focus trap; close on Esc and on the backdrop;
   - return focus to the trigger;
   - `role="dialog"` with `aria-modal` and a labelled title;
   - body scroll locked.
10. **Both themes:** every change must read well in dark and light. Contrast is at least 4.5:1 for text and 3:1 for UI elements (WCAG 2.2 AA).

## Correct examples
```tsx
<motion.a
  variants={fadeUpVariants}
  whileHover={{ y: HOVER_LIFT_Y_SMALL }}
  transition={HOVER_SPRING}
  className="btn-secondary gap-2"
  href={cvUrl}
  target="_blank"
  rel="noopener noreferrer"
>
  {dictionary.hero.downloadCv}
</motion.a>
```

## Typical mistakes (anti-examples)
- `className="bg-[#10d9e5] text-white"`: a hardcoded brand color, which also breaks the light theme.
- `transition={{ type: "spring", stiffness: 300 }}`: an ad-hoc spring instead of a preset.
- A CSS `@keyframes` loop with no reduced-motion guard.
- A modal without focus return or Esc handling.

## Verification
- `grep -rnE "\[#|rgb\(" frontend/src --include=*.tsx` finds nothing new.
- Check in the browser in dark and light, at 360 px and 1280 px, and with `prefers-reduced-motion: reduce` emulated.
- axe reports 0 serious or critical violations on the changed screen.
