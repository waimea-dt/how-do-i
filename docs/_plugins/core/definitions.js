/**
 * docsify-definitions.js — Auto-links glossary terms in page content using <abbr> tags.
 *
 * The plugin loads glossary entries, then post-processes rendered markdown so matching
 * terms get a definition tooltip in the title attribute.
 *
 * Usage in markdown:
 *   Define terms in _glossary.md as list entries, for example:
 *   - CPU
 *     Central Processing Unit
 */

(function () {
  let glossary = {};
  let glossaryLoaded = false;

  const defaultOptions = {
    glossaryPath: '_glossary.md',
    replaceOnlyFirst: false, // Change to false to replace all occurrences
    caseSensitive: false,
  };

  function parseGlossary(markdown) {
    const glossaryMap = {};
    const lines = markdown.split('\n');
    let currentTerm = null;
    let currentDefinition = '';

    for (let i = 0; i < lines.length; i++) {
      // Remove carriage returns (Windows line endings)
      let line = lines[i].replace(/\r$/, '');

      // Check for term (list item starting with -)
      const termMatch = line.match(/^-\s+(.+)$/);
      if (termMatch) {
        // Save previous term if exists
        if (currentTerm && currentDefinition.trim()) {
          glossaryMap[currentTerm] = currentDefinition.trim();
        }

        // Start new term
        currentTerm = termMatch[1].trim();
        currentDefinition = '';
      } else if (currentTerm) {
        // Check if this is a new section header
        if (line.startsWith('#')) {
          // New section header - save current term and reset
          if (currentDefinition.trim()) {
            glossaryMap[currentTerm] = currentDefinition.trim();
          }
          currentTerm = null;
          currentDefinition = '';
        } else if (line.trim()) {
          // Non-empty line that's not a header - must be part of definition
          currentDefinition += line.trim() + ' ';
        }
        // Empty lines are just skipped (they separate term from definition)
      }
    }

    // Save last term
    if (currentTerm && currentDefinition.trim()) {
      glossaryMap[currentTerm] = currentDefinition.trim();
    }

    return glossaryMap;
  }

  function createTextNodeReplacer(term, definition, replaceOnlyFirst) {
    let replaced = false;

    return function replaceInTextNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        // Skip if already replaced and replaceOnlyFirst is true
        if (replaceOnlyFirst && replaced) {
          return;
        }

        // Skip empty or whitespace-only nodes
        if (!node.textContent.trim()) {
          return;
        }

        // Determine if term has any uppercase letters
        // If it does, use exact/case-sensitive matching
        const hasUppercase = /[A-Z]/.test(term);

        // Use case-sensitive matching for terms with uppercase, case-insensitive for all-lowercase terms
        const flags = hasUppercase ? 'g' : 'gi';
        // Match term with optional trailing 's' for plurals
        const regex = new RegExp(`\\b(${escapeRegExp(term)}s?)\\b`, flags);
        const text = node.textContent;

        // Check if there are any matches
        if (!regex.test(text)) {
          return;
        }

        // Reset regex (test() moves the index)
        regex.lastIndex = 0;

        // Split and rebuild with abbr tags
        const parts = text.split(regex);

        if (parts.length > 1) {
          const fragment = document.createDocumentFragment();

          // Get all matches to preserve original case
          const matches = [];
          let match;
          regex.lastIndex = 0;
          while ((match = regex.exec(text)) !== null) {
            matches.push(match[0]);
          }

          // Build fragment: text, abbr, text, abbr, ...
          for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 0) {
              // Even index = regular text
              if (parts[i]) {
                fragment.appendChild(document.createTextNode(parts[i]));
              }
            } else {
              // Odd index = matched term (use original case from matches)
              const abbr = document.createElement('abbr');
              abbr.setAttribute('data-tooltip', definition);
              abbr.textContent = matches[Math.floor(i / 2)];
              abbr.classList.add('glossary-term');
              fragment.appendChild(abbr);
            }
          }

          node.parentNode.replaceChild(fragment, node);
          replaced = true;
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Skip code blocks, pre tags, and existing abbr tags
        const skipTags = ['CODE', 'PRE', 'ABBR', 'SCRIPT', 'STYLE'];
        if (skipTags.includes(node.tagName)) {
          return;
        }

        // Recursively process child nodes
        const children = Array.from(node.childNodes);
        children.forEach(replaceInTextNode);
      }
    };
  }

  function addAbbreviations(content, options) {
    if (!glossaryLoaded || Object.keys(glossary).length === 0) {
      return content;
    }

    // Create a temporary container
    const container = document.createElement('div');
    container.innerHTML = content;

    // Sort terms by length (longest first) to avoid partial matches
    const terms = Object.keys(glossary).sort((a, b) => b.length - a.length);

    // Replace each term
    terms.forEach(term => {
      const definition = glossary[term];
      const replacer = createTextNodeReplacer(term, definition, options.replaceOnlyFirst);
      replacer(container);
    });

    return container.innerHTML;
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Install plugin
  function install(hook, vm) {
    const options = Object.assign({}, defaultOptions, vm.config.definitions || {});
    let glossaryLoadPromise = null;

    // Load glossary on init
    hook.init(function () {
      const glossaryPath = options.glossaryPath;

      glossaryLoadPromise = fetch(glossaryPath)
        .then(response => {
          if (!response.ok) {
            console.warn(`Definitions plugin: Could not load glossary from ${glossaryPath}`);
            return '';
          }
          return response.text();
        })
        .then(text => {
          if (text) {
            glossary = parseGlossary(text);
            glossaryLoaded = true;
          }
        })
        .catch(err => {
          console.warn('Definitions plugin: Error loading glossary', err);
        });
    });

    // Process content after each page render
    hook.afterEach(function (html, next) {
      // Wait for glossary to load if it's still loading
      if (glossaryLoadPromise && !glossaryLoaded) {
        glossaryLoadPromise.then(() => {
          if (glossaryLoaded) {
            html = addAbbreviations(html, options);
          }
          next(html);
        });
      } else if (glossaryLoaded) {
        html = addAbbreviations(html, options);
        next(html);
      } else {
        next(html);
      }
    });

    // Add tooltip positioning after DOM is ready
    hook.doneEach(function () {
      if (!glossaryLoaded) return;

      const glossaryTerms = document.querySelectorAll('abbr.glossary-term[data-tooltip]');

      glossaryTerms.forEach(term => {
        // Add mouseenter event to adjust tooltip position
        term.addEventListener('mouseenter', function() {
          // Use requestAnimationFrame to ensure tooltip pseudo-element is rendered
          requestAnimationFrame(() => {
            // Get container boundaries (section.content excludes sidebar)
            const contentContainer = document.querySelector('section.content');
            if (!contentContainer) return;

            const containerRect = contentContainer.getBoundingClientRect();
            const termRect = term.getBoundingClientRect();
            const tooltipText = term.getAttribute('data-tooltip');

            // Match CSS max-width calculation: min(25ch, 100vw - 2rem)
            const baseFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
            const remInPx = baseFontSize;
            const maxWidthFromVw = window.innerWidth - (2 * remInPx);
            const maxWidthFrom25Ch = 25 * baseFontSize;
            const maxWidth = Math.min(maxWidthFrom25Ch, maxWidthFromVw);

            // Better width estimation: using measured character width from CSS
            // Approximate: 0.55ch per character for typical fonts at 0.9rem
            const estimatedCharWidth = (0.9 * baseFontSize) * 0.55;
            const tooltipPadding = 2.9 * remInPx; // Left padding includes icon space

            // Estimate actual width considering line wrapping
            let estimatedWidth = (tooltipText.length * estimatedCharWidth) + tooltipPadding;
            if (estimatedWidth > maxWidth) {
              // Text will wrap, so width is capped
              estimatedWidth = maxWidth;
            }

            // Calculate where the tooltip edges would be if centered
            const termCenterX = termRect.left + termRect.width / 2;
            const tooltipLeft = termCenterX - estimatedWidth / 2;
            const tooltipRight = termCenterX + estimatedWidth / 2;

            // Check against content container boundaries (excludes sidebar area)
            const safetyMargin = remInPx * 0.5;

            // Add data attributes to control positioning via CSS
            // Only align to edges if there's actually not enough space
            if (tooltipLeft < containerRect.left + safetyMargin) {
              // Would overflow left edge of content area
              term.setAttribute('data-tooltip-align', 'left');
            } else if (tooltipRight > containerRect.right - safetyMargin) {
              // Would overflow right edge of content area
              term.setAttribute('data-tooltip-align', 'right');
            } else {
              // Center is fine - there's enough space
              term.setAttribute('data-tooltip-align', 'center');
            }
          });
        });
      });
    });
  }

  // Add plugin to docsify
  if (window.$docsify) {
    window.$docsify.plugins = [].concat(install, window.$docsify.plugins || []);
  }
})();

