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
  const { onSlidesRendered } = window.DocsifyUtils
  let fontIsReady = false

  function whenFontReady(callback) {
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

  function processSpeechInDom(root) {
    const scope = root || document

    scope.querySelectorAll('speak').forEach((speakEl) => {
      const figure = convertSpeakElement(speakEl, speakEl.ownerDocument)
      if (!figure) return
      speakEl.replaceWith(figure)
    })
  }

  function revealSpeechFigures(root) {
    const scope = root || document

    scope.querySelectorAll('figure.speech[data-speech-loading]')
      .forEach((fig) => fig.removeAttribute('data-speech-loading'))
  }

  function runSpeechPass(root) {
    const scope = root || document

    processSpeechInDom(scope)

    whenFontReady(function () {
      revealSpeechFigures(scope)
    })
  }

  const docsifySpeech = function (hook) {
    // afterEach transforms <speak> in the HTML string before Docsify sanitises the DOM.
    // Figures are marked data-speech-loading and stay invisible until the font is ready.
    hook.afterEach(function (html) {
      return transformSpeechHtml(html)
    })

    // Cover pages are not guaranteed to pass through the same HTML transform path.
    hook.doneEach(function () {
      runSpeechPass()
    })

    hook.ready(function () {
      runSpeechPass()

      onSlidesRendered(function (root) {
        runSpeechPass(root)
      })
    })
  }

  window.DocsifyUtils.registerPlugin(docsifySpeech)
})()

