// docsify-timelines.js
// Renders <timeline>...</timeline> blocks as vertical timeline visualizations.
//
// Usage in Markdown:
//   <timeline>
//   - 1945
//
//       Description paragraph here.
//
//   - 1967: Event Title
//
//       Description with title.
//
//   - 2024
//   </timeline>
//
// Format:
//   - Date alone: "1945"
//   - Date with title: "1945: Event Title"
//   - Content is in paragraphs after the date/title

;(function () {
  function processTimelines() {
    const timelineBlocks = document.querySelectorAll('.markdown-section timeline')

    timelineBlocks.forEach((timelineBlock) => {
      // Find the UL element inside the timeline tag
      const list = timelineBlock.querySelector('ul')
      if (!list) return

      // Create a DL (definition list) to replace the UL
      const dl = document.createElement('dl')
      dl.classList.add('timeline')

      // Process each LI
      const items = list.querySelectorAll(':scope > li')
      items.forEach((item) => {
        // Get the first text content (date/title line)
        // It might be in a text node or in the first paragraph
        let dateTitle = ''

        // First, try to find a direct text node
        for (const node of item.childNodes) {
          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent.trim()
            if (text) {
              dateTitle = text
              break
            }
          } else if (node.nodeName === 'CODE') {
            dateTitle = node.textContent.trim()
            break
          }
        }

        // If no text node found, the date might be in the first paragraph
        // (markdown sometimes wraps single-line list items in paragraphs)
        const allParagraphs = Array.from(item.children).filter(child => child.tagName === 'P')
        if (!dateTitle && allParagraphs.length > 0) {
          dateTitle = allParagraphs[0].textContent.trim()
        }

        if (!dateTitle) return

        // Split by colon to get date and optional title
        let date = dateTitle
        let title = null

        const colonIndex = dateTitle.indexOf(':')
        if (colonIndex !== -1) {
          date = dateTitle.substring(0, colonIndex).trim()
          title = dateTitle.substring(colonIndex + 1).trim()
        }

        // Create DT with marker, date, and optional title
        const dt = document.createElement('dt')

        const marker = document.createElement('span')
        marker.classList.add('marker')
        marker.innerHTML = '&nbsp;'
        dt.appendChild(marker)

        const dateSpan = document.createElement('span')
        dateSpan.classList.add('date')
        dateSpan.textContent = date
        dt.appendChild(dateSpan)

        if (title) {
          const titleSpan = document.createElement('span')
          titleSpan.classList.add('title')
          titleSpan.textContent = title
          dt.appendChild(titleSpan)
        }

        // Create DD with the content (paragraphs)
        const dd = document.createElement('dd')

        // Get content paragraphs (skip the first one if we used it for the date)
        const contentParagraphs = !dateTitle || allParagraphs.length === 0 || item.childNodes[0].nodeType === Node.TEXT_NODE
          ? allParagraphs
          : allParagraphs.slice(1)

        contentParagraphs.forEach((p) => {
          dd.appendChild(p.cloneNode(true))
        })

        // Add DT and DD to the definition list
        dl.appendChild(dt)
        dl.appendChild(dd)
      })

      // Replace the timeline tag with the formatted DL
      timelineBlock.parentNode.replaceChild(dl, timelineBlock)
    })
  }

  var docsifyTimeline = function (hook) {
    hook.doneEach(function () {
      processTimelines()
    })
  }

  window.$docsify = window.$docsify || {}
  window.$docsify.plugins = [].concat(docsifyTimeline, window.$docsify.plugins || [])
})()
