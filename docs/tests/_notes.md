# Plugin Implementation Notes

## General

When building new plugins:
- Follow existing patterns from knapsack.js, drag-drop.js, cpu-sim.js, etc.
- Code should be well-written, maintainable and easily extensible
- Use helper functions, re-usable classes, etc.


## CSS

✅ **Do:**
- Use modern, nested CSS that follows the HTML structure where is makes sense to
- Use CSS variables from theme.css, never hardcode: `var(--theme-color)`, `var(--color-mono-4)`, etc.
- use locally scoped CSS variables in the plugin's root container, e.g. .markdown-section diffie-hellman {...}
- Cache all DOM elements
- Document plugin-specific features in CSS header
- Use `@container` queries (not `@media`)
- Use consistent naming conventions


## JavaScript

✅ **Do:**
- Use IIFE Pattern
- Document plugin-specific features in JS header
- Use consistent naming conventions

❌ **Don't:**
- Query selectors in loops (cache in constructor)
- Use `var` for variables (use `const`/`let`)

