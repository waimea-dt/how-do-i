// docsify-hierarchies.js
// Renders <hierarchy>...</hierarchy> blocks as tree-like hierarchical diagrams with connecting lines.
//
// Attributes:
//   - direction: "vertical" (default, top-to-bottom) or "horizontal" (left-to-right)
//   - colouring: "branch" (default, colors by branch) or "depth" (colors by level)
//
// Usage in Markdown:
//   <hierarchy direction="vertical" colouring="depth">
//   - Root Item
//     - Child 1
//       - Grandchild 1
//     - Child 2
//   </hierarchy>
//
// Focus Marker:
//   Prefix any item with "!! " to highlight it

;(function () {
  const FOCUS_MARKER = '!! '

  function processHierarchies() {
    const hierarchyBlocks = document.querySelectorAll('.markdown-section hierarchy')

    hierarchyBlocks.forEach((hierarchyBlock) => {
      // Find the UL element inside the hierarchy tag
      const hierarchyList = hierarchyBlock.querySelector('ul')
      if (!hierarchyList) return

      // Get attributes before we move things around
      const colouringAttr = hierarchyBlock.getAttribute('colouring')
      const colouring = (colouringAttr && colouringAttr.startsWith('depth')) ? 'depth' : 'branch'

      const directionAttr = hierarchyBlock.getAttribute('direction')
      const direction = (directionAttr && directionAttr.startsWith('horizontal')) ? 'horizontal' : 'vertical'

      // Add base classes
      hierarchyList.classList.add('hierarchy')
      hierarchyList.classList.add(colouring)
      hierarchyList.classList.add(direction)

      // Process all items for focus markers and add classes
      const items = hierarchyList.querySelectorAll('li')
      items.forEach((item) => {
        item.classList.add('hierarchy-item')

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
      const subLists = hierarchyList.querySelectorAll('ul')
      subLists.forEach((subList) => {
        subList.classList.add('hierarchy-container')
      })

      // Replace the hierarchy tag with the formatted UL
      hierarchyBlock.parentNode.replaceChild(hierarchyList, hierarchyBlock)
    })
  }

  var docsifyHierarchies = function (hook) {
    hook.doneEach(function () {
      processHierarchies()
    })
  }

  window.$docsify = window.$docsify || {}
  window.$docsify.plugins = [].concat(docsifyHierarchies, window.$docsify.plugins || [])
})()
