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

    scope.querySelectorAll('speak').forEach((speakEl) => {
      const figure = convertSpeakElement(speakEl, speakEl.ownerDocument)
      if (!figure) return
      speakEl.replaceWith(figure)
    })
  }

  function processSpeechInKnownScopes() {
    getSpeechScopes().forEach((scope) => processSpeechInDom(scope))
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

  let fontIsReady = false

  function whenFontReady(callback) {
    // Once the font has loaded once, call synchronously on all subsequent navigations.
    // Without this, document.fonts.load() always returns a Promise — even when cached —
    // which means the callback fires as a microtask after the current call stack, creating
    // a timing gap where speak elements are in the DOM but the pass finds nothing.
    if (fontIsReady) {
      callback()
      return
    }

    if (document.fonts && document.fonts.load) {
      document.fonts.load('1em "Mouse Memoirs"').then(function () {
        fontIsReady = true
        callback()
      })
    } else {
      fontIsReady = true
      callback()
    }
  }

  function runSpeechPass() {
    whenFontReady(function () {
      ensureObserver()
      revealSpeechFigures()
      // DOM pass catches cover page speak elements which bypass afterEach.
      processSpeechInKnownScopes()
    })
  }

  function bootstrapSpeechFallback() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runSpeechPass, { once: true })
    } else {
      runSpeechPass()
    }

    window.addEventListener('load', runSpeechPass)
    window.addEventListener('hashchange', runSpeechPass)
  }

  function convertSpeakElement(speakEl, documentRef) {
    const img = speakEl.querySelector('img')
    if (!img) return null

    const imgParent = img.closest('p')

    const figure = documentRef.createElement('figure')
    figure.className = 'speech'
    // Mark as pending until font is confirmed ready, so it stays invisible.
    // Removed by revealSpeechFigures() once document.fonts.load() resolves.
    if (!fontIsReady) figure.setAttribute('data-speech-loading', '')
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

  function revealSpeechFigures() {
    document.querySelectorAll('figure.speech[data-speech-loading]')
      .forEach((fig) => fig.removeAttribute('data-speech-loading'))
  }

  const docsifySpeech = function (hook) {
    hook.mounted(function () {
      ensureObserver()
    })

    // afterEach transforms <speak> in the HTML string before Docsify sanitises the DOM.
    // Figures are marked data-speech-loading and stay invisible until the font is ready.
    hook.afterEach(function (html) {
      return transformSpeechHtml(html)
    })

    // Cover pages are not guaranteed to pass through the same HTML transform path.
    hook.doneEach(runSpeechPass)

    hook.ready(runSpeechPass)
  }

  window.$docsify = window.$docsify || {}
  window.$docsify.plugins = [].concat(docsifySpeech, window.$docsify.plugins || [])
  bootstrapSpeechFallback()
})()

