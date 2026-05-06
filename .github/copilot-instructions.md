# Copilot Instructions for dt-notes

Apply these rules when editing plugin files in this repository.

## Scope

- Primary scope: files under docs/_plugins and docs/_css.
- Secondary scope: matching docs/tests pages and docs/tests/_sidebar.md entries.

## Plugin Conventions

- Use window.DocsifyUtils helpers before creating new local utility functions.
- Register plugins with window.DocsifyUtils.registerPlugin.
- Keep doneEach logic idempotent using processBlocks/processVisualBlocks helpers.
- Keep domain-specific parsing/rendering local to plugin files.

## Structure

- Keep each plugin feature in one JS file under the correct docs/_plugins subfolder.
- Keep corresponding styles in the matching docs/_css subfolder.
- Add or update test pages in docs/tests for plugin changes.

## Style

- Prefer const and let over var.
- Keep functions small and focused.
- Add brief comments only where behaviour is non-obvious.
- Match existing file style when a local convention is already established.

## Shared Utils

- Add to docs/_plugins/core/utils.js only if helper is general-purpose.
- Do not move feature-specific engine/parser logic into shared utils.

## Checklist for New Plugin Work

1. JS plugin file created or updated in docs/_plugins.
2. Matching CSS created or updated in docs/_css.
3. Script and stylesheet links present in docs/index.html.
4. Test/demo page present in docs/tests.
5. docs/tests/_sidebar.md updated.
