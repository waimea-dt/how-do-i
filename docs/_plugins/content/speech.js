/**
 * speech.js - Converts <speak>...</speak> blocks containing an image into HTML5 figure elements
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
  let appObserver = null

  function processSpeechInDom(root) {
    const scope = root || document
    scope.querySelectorAll('speak').forEach((speakEl) => {
      const figure = convertSpeakElement(speakEl, speakEl.ownerDocument)
      if (!figure) return
      speakEl.replaceWith(figure)
    })
  }

  function processSpeechFromAddedNode(node) {
    if (!node || node.nodeType !== 1) return false

    if (node.tagName === 'SPEAK') {
      const figure = convertSpeakElement(node, node.ownerDocument)
      if (figure) {
        node.replaceWith(figure)
        return true
      }
      return false
    }

    if (node.querySelector) {
      const nestedSpeak = node.querySelector('speak')
      if (nestedSpeak) {
        processSpeechInDom(node)
        return true
      }
    }

    return false
  }

  function findObserverTarget() {
    return (
      document.querySelector('#app') ||
      document.querySelector('.cover-main') ||
      document.querySelector('.markdown-section') ||
      document.body ||
      document.documentElement ||
      null
    )
  }

  function ensureObserver() {
    const target = findObserverTarget()

    if (appObserver) {
      const currentTargetName = appObserver.__speechTargetName || 'unknown'
      const nextTargetName = target ? (target.id ? `#${target.id}` : target.className || target.nodeName) : 'none'
      if (currentTargetName === nextTargetName) return

      appObserver.disconnect()
      appObserver = null
    }

    if (!target) return

    const targetName = target.id ? `#${target.id}` : target.className || target.nodeName

    appObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          processSpeechFromAddedNode(node)
        })
      })
    })

    appObserver.observe(target, {
      childList: true,
      subtree: true,
    })

    appObserver.__speechTargetName = targetName
  }

  function convertSpeakElement(speakEl, documentRef) {
    const img = speakEl.querySelector('img')
    if (!img) return null

    const imgParent = img.closest('p')

    const figure = documentRef.createElement('figure')
    figure.className = 'speech'
    figure.appendChild(img.cloneNode(true))

    const figcaption = documentRef.createElement('figcaption')
    let hasContent = false

    Array.from(speakEl.childNodes).forEach((node) => {
      if (node === imgParent) return
      if (node.nodeType === 3 && !node.textContent.trim()) return

      figcaption.appendChild(node.cloneNode(true))
      hasContent = true
    })

    if (hasContent) {
      figure.appendChild(figcaption)
    }

    return figure
  }

  function transformSpeechHtml(html) {
    if (!html || html.indexOf('<speak') === -1) return html

    const wrapper = document.createElement('div')
    wrapper.innerHTML = html

    wrapper.querySelectorAll('speak').forEach((speakEl) => {
      const figure = convertSpeakElement(speakEl, wrapper.ownerDocument)
      if (!figure) return
      speakEl.replaceWith(figure)
    })

    return wrapper.innerHTML
  }

  const docsifySpeech = function (hook) {
    hook.mounted(function () {
      ensureObserver()
    })

    hook.afterEach(function (html) {
      return transformSpeechHtml(html)
    })

    // Cover pages are not guaranteed to pass through the same html transform path.
    // Run an immediate DOM pass after each render cycle with no timeout.
    hook.doneEach(function () {
      ensureObserver()
      processSpeechInDom(document)
    })

    // Initial load safety for first cover render.
    hook.ready(function () {
      ensureObserver()
      processSpeechInDom(document)
    })
  }

  window.$docsify = window.$docsify || {}
  window.$docsify.plugins = [].concat(docsifySpeech, window.$docsify.plugins || [])
})()

