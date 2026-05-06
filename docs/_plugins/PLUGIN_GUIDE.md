# Plugin Migration Guide

This guide is for writing new Docsify plugins in this project.

## Core Rules

- Reuse helpers from window.DocsifyUtils before writing local utility functions.
- Use window.DocsifyUtils.registerPlugin(...) for plugin registration.
- Keep plugin logic in one file per feature under the correct folder.
- Keep CSS in matching folder under docs/_css.
- Mark processed elements to keep doneEach idempotent.

## Preferred Utils

- processBlocks(lang, fn, options): For block scanning and idempotent processing.
- processVisualBlocks(lang, fn, options): For keep/hide/replace visual flows.
- escapeHtml: For untrusted text inserted into HTML.
- parseBoolean / parsePositiveInt: For attribute parsing.
- randomHex / clamp / sleep / generateId and other general helpers.

## Structure Pattern

1. Constants and small local helpers at top.
2. Main process function for DOM transformation.
3. Docsify plugin hook registration.
4. Register with window.DocsifyUtils.registerPlugin.

## Style Pattern

- Prefer const and let over var.
- Keep functions short and single purpose.
- Add short comments only where behaviour is not obvious.
- Preserve existing naming conventions in surrounding files.

## When Adding New Utilities

Add to docs/_plugins/core/utils.js only if the function is general-purpose.
Avoid moving domain-specific parsers/renderers into utils.

Good candidates:
- URL/path helpers
- marker parsing helpers
- generic error rendering
- value conversion helpers used by more than one plugin type

Not good candidates:
- simulation engine logic
- format-specific parsers
- feature-specific rendering code

## Quick Checklist

- Plugin script loaded in docs/index.html
- Matching CSS loaded in docs/index.html
- Test page added under docs/tests
- Entry added to docs/tests/_sidebar.md
- No duplicate utility copied from another plugin
