/**
 * docsify-structure.js - Renders <structure>...</structure> blocks as hierarchical organizational structures.
 *
 * Attributes:
 *   - colouring: "depth" (colors by level) or "branch" (default, colors by branch)
 *
 * Usage in markdown:
 *   <structure colouring="depth">
 *   - Main Item
 *     - Child 1
 *     - Child 2
 *       - Grandchild
 *   </structure>
 *
 * Focus Marker:
 *   Prefix any item with "!! " to highlight it
 */

;(function () {
  const FOCUS_MARKER = '!! '
  const { extractMarker } = window.DocsifyUtils

  function resolveScope(root) {
    return root && typeof root.querySelectorAll === 'function' ? root : document
  }

  function processStructures(root) {
    const scope = resolveScope(root)
    const selector = scope === document ? '.markdown-section structure' : 'structure'
    const structureBlocks = scope.querySelectorAll(selector)

    structureBlocks.forEach((structureBlock) => {
      // Find the UL element inside the structure tag
      const structureList = structureBlock.querySelector('ul')
      if (!structureList) return

      // Get attributes before we move things around
      const colouringAttr = structureBlock.getAttribute('colouring')
      const colouring = (colouringAttr && colouringAttr.startsWith('depth')) ? 'depth' : 'branch'

      // Add base classes
      structureList.classList.add('structure')
      structureList.classList.add(colouring)

      // Process all items for focus markers and add classes
      const items = structureList.querySelectorAll('li')
      items.forEach((item) => {
        item.classList.add('structure-item')

        // Check for focus marker
        const heading = (item.children.length > 0) ? item.children[0] : item.childNodes[0]
        if (heading && heading.textContent) {
          const markerInfo = extractMarker(heading.textContent.trim(), FOCUS_MARKER)
          if (markerInfo.hasMarker) {
            item.classList.add('focus')
            heading.textContent = markerInfo.cleanText
          }
        }
      })

      // Add classes to nested lists
      const subLists = structureList.querySelectorAll('ul, ol')
      subLists.forEach((subList) => {
        subList.classList.add('structure-container')
        subList.classList.add(subList.tagName === 'UL' ? 'horizontal' : 'vertical')
      })

      // Replace the structure tag with the formatted UL
      structureBlock.parentNode.replaceChild(structureList, structureBlock)
    })
  }

  const docsifyStructure = function (hook) {
    hook.doneEach(function () {
      processStructures()
    })
    hook.ready(function () {
      window.DocsifyUtils.onSlidesRendered(function (root) {
        processStructures(root)
      })
    })
  }

  window.DocsifyUtils.registerPlugin(docsifyStructure)
})()

