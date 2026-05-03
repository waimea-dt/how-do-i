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
  const DEBUG = /[?&]speechDebug=1\b/.test(window.location.search) || /[?&]speechDebug=1\b/.test(window.location.hash)
  let appObserver = null

  function debugLog(...args) {
    if (!DEBUG) return
    console.log('[speech]', ...args)
  }

  function routeInfo() {
    return {
      hash: window.location.hash,
      path: window.location.pathname,
    }
  }

  function processSpeechInDom(root) {
    const scope = root || document
    const speakBlocks = scope.querySelectorAll('speak')

    debugLog('processSpeechInDom:start', {
      ...routeInfo(),
      root: scope === document ? 'document' : scope.nodeName,
      speakCount: speakBlocks.length,
    })

    speakBlocks.forEach((speakEl, index) => {
      const figure = convertSpeakElement(speakEl, speakEl.ownerDocument)
      if (!figure) {
        debugLog('processSpeechInDom:skip', {
          index,
          reason: 'convertSpeakElement returned null',
          snippet: (speakEl.outerHTML || '').slice(0, 200),
        })
        return
      }
      speakEl.replaceWith(figure)

      debugLog('processSpeechInDom:replaced', {
        index,
        hasCaption: !!figure.querySelector('figcaption'),
      })
    })

    debugLog('processSpeechInDom:end', {
      ...routeInfo(),
      remainingSpeakCount: scope.querySelectorAll('speak').length,
      speechFigureCount: scope.querySelectorAll('figure.speech').length,
    })
  }

  function processSpeechFromAddedNode(node) {
    if (!node || node.nodeType !== 1) return false

    if (node.tagName === 'SPEAK') {
      const figure = convertSpeakElement(node, node.ownerDocument)
      if (figure) {
        node.replaceWith(figure)
        debugLog('observer:replaced-direct-speak')
        return true
      }
      return false
    }

    if (node.querySelector) {
      const nestedSpeak = node.querySelector('speak')
      if (nestedSpeak) {
        processSpeechInDom(node)
        debugLog('observer:processed-nested-speak')
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
      debugLog('observer:retarget', {
        from: currentTargetName,
        to: nextTargetName,
      })
    }

    if (!target) {
      debugLog('observer:skip-no-target', routeInfo())
      return
    }

    const targetName = target.id ? `#${target.id}` : target.className || target.nodeName

    appObserver = new MutationObserver((mutations) => {
      let handled = false

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (processSpeechFromAddedNode(node)) {
            handled = true
          }
        })
      })

      if (handled) {
        debugLog('observer:mutation-handled', {
          ...routeInfo(),
          target: targetName,
          speechFigureCount: document.querySelectorAll('figure.speech').length,
          remainingSpeakCount: document.querySelectorAll('speak').length,
        })
      }
    })

    appObserver.observe(target, {
      childList: true,
      subtree: true,
    })

    appObserver.__speechTargetName = targetName

    debugLog('observer:attached', {
      ...routeInfo(),
      target: targetName,
      hasApp: !!document.querySelector('#app'),
      hasCoverMain: !!document.querySelector('.cover-main'),
      hasMarkdownSection: !!document.querySelector('.markdown-section'),
    })
  }

  function convertSpeakElement(speakEl, documentRef) {
    const img = speakEl.querySelector('img')
    if (!img) {
      debugLog('convertSpeakElement:no-image', {
        snippet: (speakEl.outerHTML || '').slice(0, 240),
      })
      return null
    }

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
    if (!html) {
      debugLog('transformSpeechHtml:empty-html')
      return html
    }

    const hasSpeak = html.indexOf('<speak') !== -1
    debugLog('transformSpeechHtml:start', {
      ...routeInfo(),
      hasSpeak,
      htmlLength: html.length,
    })

    if (!hasSpeak) return html

    const wrapper = document.createElement('div')
    wrapper.innerHTML = html

    const speakBlocks = wrapper.querySelectorAll('speak')
    debugLog('transformSpeechHtml:found', {
      speakCount: speakBlocks.length,
    })

    speakBlocks.forEach((speakEl, index) => {
      const figure = convertSpeakElement(speakEl, wrapper.ownerDocument)
      if (!figure) {
        debugLog('transformSpeechHtml:skip', {
          index,
          reason: 'convertSpeakElement returned null',
          snippet: (speakEl.outerHTML || '').slice(0, 200),
        })
        return
      }
      speakEl.replaceWith(figure)

      debugLog('transformSpeechHtml:replaced', {
        index,
        hasCaption: !!figure.querySelector('figcaption'),
      })
    })

    debugLog('transformSpeechHtml:end', {
      remainingSpeakCount: wrapper.querySelectorAll('speak').length,
      speechFigureCount: wrapper.querySelectorAll('figure.speech').length,
    })

    return wrapper.innerHTML
  }

  const docsifySpeech = function (hook) {
    hook.init(function () {
      debugLog('hook.init', routeInfo())
    })

    hook.mounted(function () {
      debugLog('hook.mounted', routeInfo())
      ensureObserver()
    })

    hook.afterEach(function (html) {
      debugLog('hook.afterEach', {
        ...routeInfo(),
        hasSpeak: typeof html === 'string' && html.indexOf('<speak') !== -1,
      })
      return transformSpeechHtml(html)
    })

    // Cover pages are not guaranteed to pass through the same html transform path.
    // Run an immediate DOM pass after each render cycle with no timeout.
    hook.doneEach(function () {
      debugLog('hook.doneEach', routeInfo())
      ensureObserver()
      processSpeechInDom(document)
    })

    // Initial load safety for first cover render.
    hook.ready(function () {
      debugLog('hook.ready', routeInfo())
      ensureObserver()
      processSpeechInDom(document)
    })
  }

  window.$docsify = window.$docsify || {}
  window.$docsify.plugins = [].concat(docsifySpeech, window.$docsify.plugins || [])
})()

