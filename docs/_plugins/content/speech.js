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
  const DEBUG = !!(window.$docsify && window.$docsify.speechDebug)

  function debugLog(eventName, payload) {
    if (!DEBUG) return
    if (payload === undefined) {
      console.log(`[speech] ${eventName}`)
      return
    }

    console.log(`[speech] ${eventName}`, payload)
  }

  function getSpeechScopes() {
    const scopes = []
    const markdownSection = document.querySelector('.markdown-section')
    const coverMain = document.querySelector('.cover-main')

    if (markdownSection) scopes.push(markdownSection)
    if (coverMain) scopes.push(coverMain)
    if (scopes.length === 0) scopes.push(document)

    return scopes
  }

  function processSpeechInDom(root) {
    const scope = root || document
    const speakNodes = scope.querySelectorAll('speak')
    let replacedCount = 0

    speakNodes.forEach((speakEl) => {
      const figure = convertSpeakElement(speakEl, speakEl.ownerDocument)
      if (!figure) return
      speakEl.replaceWith(figure)
      replacedCount += 1
    })

    return {
      speakCount: speakNodes.length,
      replacedCount,
    }
  }

  function processSpeechInKnownScopes() {
    const totals = {
      speakCount: 0,
      replacedCount: 0,
    }

    getSpeechScopes().forEach((scope) => {
      const result = processSpeechInDom(scope)
      totals.speakCount += result.speakCount
      totals.replacedCount += result.replacedCount
    })

    return totals
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
      const currentTarget = appObserver.__speechTarget || null
      if (currentTarget === target) return

      appObserver.disconnect()
      appObserver = null
    }

    if (!target) return

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

    appObserver.__speechTarget = target
  }

  function runSpeechPass(source) {
    const triggerSource = source || 'unknown'
    const run = function () {
      ensureObserver()
      const result = processSpeechInKnownScopes()
      debugLog('pass', {
        source: triggerSource,
        route: window.location.hash || '(none)',
        speakCount: result.speakCount,
        replacedCount: result.replacedCount,
      })
    }

    run()
    setTimeout(run, 140)
  }

  function bootstrapSpeechFallback() {
    if (document.readyState === 'loading') {
      document.addEventListener(
        'DOMContentLoaded',
        function () {
          runSpeechPass('dom-content-loaded')
        },
        { once: true }
      )
    } else {
      runSpeechPass('bootstrap-immediate')
    }

    window.addEventListener('load', function () {
      runSpeechPass('window-load')
    })

    window.addEventListener('hashchange', function () {
      runSpeechPass('hashchange')
    })
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

    // Cover pages are not guaranteed to pass through the same HTML transform path.
    hook.doneEach(function () {
      runSpeechPass('hook-doneEach')
    })

    hook.ready(function () {
      runSpeechPass('hook-ready')
    })
  }

  window.$docsify = window.$docsify || {}
  window.$docsify.plugins = [].concat(docsifySpeech, window.$docsify.plugins || [])
  debugLog('plugin-registered', { route: window.location.hash || '(none)' })
  bootstrapSpeechFallback()
})()

