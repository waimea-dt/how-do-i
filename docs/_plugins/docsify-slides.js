// docsify-slides.js
// Renders <slides>...</slides> blocks as embedded reveal.js presentations.
// Requires reveal.js and RevealMarkdown to be loaded in index.html
//
// Usage in Markdown:
//   <slides>
//   # Slide One
//   ---
//   # Slide Two
//   </slides>

;(function () {
  const stash = {}

  function buildRevealHTML(index) {
    const slides = stash[index]
      .split(/\n---\n/)
      .map((slide) => `<section data-markdown><textarea data-template>${slide.trim()}</textarea></section>`)
      .join('\n')

    return `
      <div class="reveal docsify-slide-deck" id="slide-deck-${index}">
        <div class="slides">
          ${slides}
        </div>
      </div>
    `
  }

  function initDecks() {
    document.querySelectorAll('.reveal.docsify-slide-deck:not([data-initialized])').forEach((deck) => {
      deck.setAttribute('data-initialized', 'true')

      new Reveal(deck, {
        embedded: true,
        plugins: [RevealMarkdown, RevealHighlight],
        keyboardCondition: 'focused',
        controls: true,
        progress: true,
        center: true,
        transition: 'slide',
        backgroundTransition: 'fade',
        margin: 0.04,
        width: 1280,
        height: 720,
        mouseWheel: false,
        // view: 'scroll',
      }).initialize()
    })
  }

  var docsifySlides = function (hook) {
    hook.beforeEach(function (content) {
      Object.keys(stash).forEach((k) => delete stash[k])

      let index = 0
      return content.replace(
        /<slides>([\s\S]*?)<\/slides>/g,
        function (_match, markdown) {
          stash[index] = markdown
          const placeholder = `<div class="slides-placeholder" data-index="${index}"></div>`
          index++
          return placeholder
        }
      )
    })

    hook.doneEach(function () {
      const placeholders = document.querySelectorAll('.slides-placeholder')
      if (!placeholders.length) return

      placeholders.forEach((placeholder) => {
        const index = placeholder.getAttribute('data-index')
        placeholder.outerHTML = buildRevealHTML(index)
      })

      initDecks()
    })
  }

  window.$docsify = window.$docsify || {}
  window.$docsify.plugins = [].concat(docsifySlides, window.$docsify.plugins || [])
})()