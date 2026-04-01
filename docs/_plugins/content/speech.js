/**
 * speech.js — Converts <speak>...</speak> blocks containing an image into HTML5 figure elements
 * with speech bubble styling. The image becomes <img> and all other content becomes
 * <figcaption> styled as a speech bubble.
 *
 * Usage in markdown:
 *   <speak>
 *   ![Character](character.png)
 *   Hello there!
 *   </speak>
 *
 * Becomes:
 *   <figure class="speech">
 *     <img src="character.png" alt="Character">
 *     <figcaption>Hello there!</figcaption>
 *   </figure>
 */

;(function () {
  function processSpeech() {
    const speakBlocks = document.querySelectorAll('speak')
    if (speakBlocks.length === 0) return

    speakBlocks.forEach((speakBlock) => {
      const img = speakBlock.querySelector('img')
      if (!img) return

      const children = Array.from(speakBlock.children)
      const imgParent = img.closest('p')

      const figure = document.createElement('figure')
      figure.className = 'speech'

      figure.appendChild(img.cloneNode(true))

      const figcaption = document.createElement('figcaption')
      let hasContent = false

      children.forEach((child) => {
        if (child !== imgParent) {
          figcaption.appendChild(child.cloneNode(true))
          hasContent = true
        }
      })

      if (hasContent) {
        figure.appendChild(figcaption)
      }

      speakBlock.parentNode.replaceChild(figure, speakBlock)
    })
  }

  let observer

  function startObserving() {
    if (observer) observer.disconnect()

    observer = new MutationObserver(function(mutations) {
      // Check if any speak elements were added
      const hasSpeakElements = mutations.some(mutation => {
        return Array.from(mutation.addedNodes).some(node => {
          if (node.nodeType === 1) { // Element node
            return node.tagName === 'SPEAK' || node.querySelector?.('speak')
          }
          return false
        })
      })

      if (hasSpeakElements) {
        processSpeech()
      }
    })

    // Observe the main content area
    const target = document.querySelector('#app')
    if (target) {
      observer.observe(target, {
        childList: true,
        subtree: true
      })
    }
  }

  window.$docsify = window.$docsify || {}
  window.$docsify.plugins = window.$docsify.plugins || []
  window.$docsify.plugins.push(function (hook) {
    hook.ready(function() {
      startObserving()
      // Delayed check for coverpage
      setTimeout(processSpeech, 250)
    })

    hook.doneEach(function() {
      // Try immediate processing first
      processSpeech()
      // Observer will catch any that appear later
    })
  })
})()

