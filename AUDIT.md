# Accessibility and performance audit checklist

## Lighthouse scores before changes

| Category | Score |
|---|---|
| Performance | |
| Accessibility | |
| Best Practices | |
| SEO | |

## Lighthouse scores after changes

| Category | Score |
|---|---|
| Performance | |
| Accessibility | |
| Best Practices | |
| SEO | |

Scores are intentionally blank until Lighthouse is run against a deployed or locally served build.

## Accessibility checks

- [x] Semantic header, main, sections, footer, headings, form, labels, and buttons are used.
- [x] Every form control has a visible label.
- [x] Keyboard focus styles are visible on form controls and action buttons.
- [x] Loading, result, and error regions use `aria-live="polite"` where updates occur.
- [x] Stop and Retry are native keyboard-reachable buttons.
- [x] Errors include headings and explanatory text, not color alone.
- [x] Reduced-motion support removes the loading spinner animation.
- [ ] Run Lighthouse and keyboard testing on the final deployed URL.
