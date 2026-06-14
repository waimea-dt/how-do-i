/**
 * docsify-file-trees.js - Renders <filetree>...</filetree> blocks as file/folder tree structures.
 *
 * Usage in markdown:
 *   <filetree>
 *   - root/
 *     - src/
 *       - index.js
 *       - utils.js
 *     - README.md
 *   </filetree>
 *
 * Focus Marker:
 *   Prefix any item with "!! " to highlight it
 *
 * Inline Comments:
 *   Append " // comment text" to any item to render the comment in a styled span
 *   e.g. - __init__.py  // the main app with routing
 */

;(function () {
  const FOCUS_MARKER = '!! '
  const { extractMarker } = window.DocsifyUtils

  function processFileTrees() {
    const fileTreeBlocks = document.querySelectorAll('.markdown-section filetree')

    fileTreeBlocks.forEach((fileTreeBlock) => {
      // Find the UL element inside the file-tree tag
      const fileList = fileTreeBlock.querySelector('ul')
      if (!fileList) return

      // Add base class
      fileList.classList.add('file-tree')

      // Process all items for focus markers and add classes
      const items = fileList.querySelectorAll('li')
      items.forEach((item) => {
        item.classList.add('file-tree-item')

        // Find the nested UL (folder content) if it exists
        const nestedUL = item.querySelector('ul')

        // Get all child nodes except the nested UL
        const contentNodes = Array.from(item.childNodes).filter(node => node !== nestedUL)

        // Extract plain text content (this handles em/strong tags from markdown parsing)
        const textContent = contentNodes.map(node => node.textContent).join('').trim()

        // Check for focus marker
        const markerInfo = extractMarker(textContent, FOCUS_MARKER)

        if (markerInfo.hasMarker) {
          item.classList.add('focus')
        }

        // Remove all content nodes (text and formatted elements)
        contentNodes.forEach(node => node.remove())

        // Split filename and inline comment (e.g. "file.js  // description")
        const commentMatch = markerInfo.cleanText.match(/^(.*?)\s*\/\/\s*(.+)$/)
        const labelText = commentMatch ? commentMatch[1].trimEnd() : markerInfo.cleanText
        const commentText = commentMatch ? commentMatch[2] : null

        const textNode = document.createTextNode(labelText)
        if (nestedUL) {
          item.insertBefore(textNode, nestedUL)
        } else {
          item.appendChild(textNode)
        }

        if (commentText) {
          const commentSpan = document.createElement('span')
          commentSpan.className = 'comment'
          commentSpan.textContent = commentText
          if (nestedUL) {
            item.insertBefore(commentSpan, nestedUL)
          } else {
            item.appendChild(commentSpan)
          }
        }
      })

      // Add classes to nested lists (folders)
      const folders = fileList.querySelectorAll('ul')
      folders.forEach((folder) => {
        folder.classList.add('file-tree-folder')
      })

      // Replace the file-tree tag with the formatted UL
      fileTreeBlock.parentNode.replaceChild(fileList, fileTreeBlock)
    })
  }

  const docsifyFileTree = function (hook) {
    // Process markdown BEFORE parsing to escape special characters
    hook.beforeEach(function (content) {
      // Find all <filetree>...</filetree> blocks
      const fileTreeRegex = /<filetree>([\s\S]*?)<\/filetree>/g

      return content.replace(fileTreeRegex, (match, innerContent) => {
        // Escape underscores and other markdown special chars by wrapping in backticks
        const lines = innerContent.split('\n')
        const processedLines = lines.map(line => {
          // Match list items (lines starting with optional spaces and a dash)
          const listItemMatch = line.match(/^(\s*-\s+)(.+)$/)
          if (listItemMatch) {
            const prefix = listItemMatch[1]
            const content = listItemMatch[2]
            // Wrap the content in backticks to prevent markdown parsing
            return `${prefix}\`${content}\``
          }
          return line
        })

        return `<filetree>${processedLines.join('\n')}</filetree>`
      })
    })

    hook.doneEach(function () {
      processFileTrees()
    })
  }

  window.DocsifyUtils.registerPlugin(docsifyFileTree)
})()

