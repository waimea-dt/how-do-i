# Copilot Instructions for dt-notes

Apply these rules when creating new or editing existing plugin files in this repository.

## Scope

- Primary scope: files under docs/_plugins and docs/_css.
- Secondary scope: matching docs/tests pages and docs/tests/_sidebar.md entries.

## Code Conventions

- Code should be well-written, maintainable and easily extensible - prioritise maintainability over clever shortcuts
- Write DRY code - Use helper functions, re-usable classes, etc.

### CSS

- Use modern, nested CSS that follows the HTML structure where is makes sense to
- Use globally defined CSS vars from themes.css for colors, spacing, buttons, etc. in preference to creating specific plugin styles.
- In required, use locally scoped CSS variables in a plugin's root container, e.g. .markdown-section diffie-hellman {...}

### JS

- Use IIFE Pattern for JS
- Cache DOM elements and don't query selectors in loops
- Use window.DocsifyUtils helpers before creating new local utility functions.
- Register plugins with window.DocsifyUtils.registerPlugin.
- Keep doneEach logic idempotent using processBlocks/processVisualBlocks helpers.
- Keep domain-specific parsing/rendering local to plugin files.
- Use consistent naming conventions
- Avoid conflicts between plugins: do not overwrite other plugins' behaviour, and use unique namespaces/prefixes for plugin-specific logic.
- Document plugin-specific features in JS header

## Plugin Structure

- Keep each plugin feature in one JS file under the correct docs/_plugins subfolder.
- Keep corresponding styles in the matching docs/_css subfolder.
- Add or update test pages in docs/tests for plugin changes.

## Code Style

- Prefer const and let over var.
- Keep functions small and focused.
- Add brief comments only where behaviour is non-obvious.
- Match existing file style when a local convention is already established.

## Content Formatting

- Use minus signs (-) instead of em-dashes (—) in documentation and markdown files.
- For complexity notation, use HTML with **uppercase N**: **O(N)** with <sup> and <sub> tags, not LaTeX.
  - Examples: **O(N)**, **O(N<sup>2</sup>)**, **O(log N)**, **O(N log N)**, **O(2<sup>N</sup>)**, **O(N!)**

## Shared Utils

- Add to docs/_plugins/core/utils.js only if helper is general-purpose.
- Do not move feature-specific engine/parser logic into shared utils.

## Checklist for New Work

1. JS plugin file created or updated in docs/_plugins.
2. Matching CSS created or updated in docs/_css.
3. Script and stylesheet links present in docs/index.html.
4. Test/demo page present in docs/tests.
5. docs/tests/_sidebar.md updated.
6. Review existing plugins for current usage and remove outdated or unused plugins and their references (but get confirmation first).
