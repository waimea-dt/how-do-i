/**
 * captions.js - Converts <captioned>...</captioned> blocks containing an image into HTML5 figure elements.
 * The image becomes <img> and all other content becomes <figcaption>.
 *
 * Usage in markdown:
 *   <captioned>
 *   ![Alt text](image.png)
 *   Caption text here
 *   </captioned>
 *
 * Becomes:
 *   <figure>
 *     <img src="image.png" alt="Alt text">
 *     <figcaption>Caption text here</figcaption>
 *   </figure>
 */

;(function () {
  function resolveScope(root) {
    return root && typeof root.querySelectorAll === 'function' ? root : document
  }

  function processCaptions(root) {
    const scope = resolveScope(root)
    const selector = scope === document ? '.markdown-section captioned' : 'captioned'
    const captionBlocks = scope.querySelectorAll(selector)

    captionBlocks.forEach((captionBlock) => {
      const img = captionBlock.querySelector('img')
      if (!img) return

      const paragraphs = Array.from(captionBlock.querySelectorAll('p'))
      const imgParent = img.closest('p')

      const figure = document.createElement('figure')

      figure.appendChild(img.cloneNode(true))

      const figcaption = document.createElement('figcaption')
      let hasContent = false

      paragraphs.forEach((p) => {
        if (p !== imgParent) {
          const content = p.innerHTML
          if (content.trim()) {
            const div = document.createElement('div')
            div.innerHTML = content
            figcaption.appendChild(div)
            hasContent = true
          }
        }
      })

      if (hasContent) {
        figure.appendChild(figcaption)
      }

      captionBlock.parentNode.replaceChild(figure, captionBlock)
    })
  }

  var docsifyCaptions = function (hook) {
    // Docsify v5 doneEach may pass a lifecycle object instead of a DOM root.
    // Call without arguments so processCaptions uses document scope safely.
    hook.doneEach(function () {
      processCaptions()
    })
    hook.ready(function () {
      window.DocsifyUtils.onSlidesRendered(function (root) {
        processCaptions(root)
      })
    })
  }

  window.DocsifyUtils.registerPlugin(docsifyCaptions)
})()

