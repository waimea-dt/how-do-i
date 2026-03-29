// docsify-structure.js
// Renders <structure>...</structure> blocks as hierarchical organizational structures.
//
// Attributes:
//   - colouring: "depth" (colors by level) or "branch" (default, colors by branch)
//
// Usage in Markdown:
//   <structure colouring="depth">
//   - Main Item
//     - Child 1
//     - Child 2
//       - Grandchild
//   </structure>
//
// Focus Marker:
//   Prefix any item with "!! " to highlight it

;(function () {
  const FOCUS_MARKER = '!! '

  function processStructures() {
    const structureBlocks = document.querySelectorAll('.markdown-section structure')

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
          const name = heading.textContent.trim()
          if (name.startsWith(FOCUS_MARKER)) {
            item.classList.add('focus')
            heading.textContent = name.slice(FOCUS_MARKER.length)
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

  var docsifyStructure = function (hook) {
    hook.doneEach(function () {
      processStructures()
    })
  }

  window.$docsify = window.$docsify || {}
  window.$docsify.plugins = [].concat(docsifyStructure, window.$docsify.plugins || [])
})()
