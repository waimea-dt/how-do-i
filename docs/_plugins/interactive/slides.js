/**
 * docsify-slides.js - Renders <slides>...</slides> blocks as embedded reveal.js presentations.
 * Requires reveal.js and RevealMarkdown to be loaded in index.html
 *
 * Usage in markdown:
 *   <slides>
 *   # Slide One
 *   ---
 *   # Slide Two
 *   </slides>
 */

;(function () {
  const { dispatchSlidesRendered } = window.DocsifyUtils
  const stash = {}
  const deckCleanup = new WeakMap()

  function registerDeckCleanup(deck, cleanupFn) {
    if (typeof cleanupFn !== 'function') return
    const list = deckCleanup.get(deck) || []
    list.push(cleanupFn)
    deckCleanup.set(deck, list)
  }

  function escapeHtml(text) {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  }

  function normaliseSlideMarkdown(slideMarkdown) {
    // Keep Mermaid out of Reveal's code-highlighter path.
    return slideMarkdown.replace(/```mermaid\s*\n([\s\S]*?)```/g, function (_match, mermaidCode) {
      const code = (mermaidCode || '').trim()
      const hasInitDirective = /^%%\{\s*init\s*:/m.test(code)
      const slideInitDirective = '%%{init: {"flowchart": {"htmlLabels": false}, "themeVariables": {"fontFamily": "system-ui, sans-serif", "fontSize": "16px"}}}%%\n'
      const preparedCode = hasInitDirective ? code : `${slideInitDirective}${code}`
      return `<div data-slides-mermaid="true">\n${escapeHtml(preparedCode)}\n</div>`
    })
  }

  function buildRevealHTML(index) {
    const slides = stash[index]
      .split(/\n---\n/)
      .map((slide) => {
        const markdown = normaliseSlideMarkdown(slide.trim())
        return `<section data-markdown><textarea data-template>${markdown}</textarea></section>`
      })
      .join('\n')

    return `
      <div class="reveal docsify-slide-deck" id="slide-deck-${index}">
        <div class="slides">
          ${slides}
        </div>
      </div>
    `
  }

  function watchDeckLayout(deck, reveal) {
    const slidesRoot = deck.querySelector('.slides')
    if (!slidesRoot || typeof reveal?.layout !== 'function') return

    let rafId = 0
    const scheduleLayout = function () {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(function () {
        rafId = 0
        reveal.layout()
      })
    }

    // Catch late content growth (images/async plugin hydration).
    scheduleLayout()
    setTimeout(scheduleLayout, 80)
    setTimeout(scheduleLayout, 220)

    const mutationObserver = new MutationObserver(function () {
      scheduleLayout()
    })
    mutationObserver.observe(slidesRoot, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    })

    const loadHandler = function (event) {
      const target = event.target
      if (!target || !(target instanceof Element)) return
      if (target.matches('img, svg, video, iframe, canvas')) {
        scheduleLayout()
      }
    }
    deck.addEventListener('load', loadHandler, true)

    let resizeObserver = null
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(function () {
        scheduleLayout()
      })
      resizeObserver.observe(slidesRoot)
    }

    const cleanup = function () {
      if (rafId) cancelAnimationFrame(rafId)
      mutationObserver.disconnect()
      if (resizeObserver) resizeObserver.disconnect()
      deck.removeEventListener('load', loadHandler, true)
    }

    registerDeckCleanup(deck, cleanup)
  }

  function setupMermaidForDeck(deck, reveal) {
    const mermaidApi = window.mermaid
    if (!mermaidApi || typeof mermaidApi.run !== 'function') return

    let renderQueue = Promise.resolve()

    const renderSlideMermaid = function (slide) {
      if (!slide) return Promise.resolve()

      const nodes = Array.from(slide.querySelectorAll('[data-slides-mermaid="true"]:not([data-slides-mermaid-rendered="true"])'))
      if (!nodes.length) return Promise.resolve()

      nodes.forEach((node) => {
        node.classList.add('mermaid')
      })

      return mermaidApi.run({ nodes }).then(function () {
        nodes.forEach((node) => {
          node.setAttribute('data-slides-mermaid-rendered', 'true')
        })
      }).catch(function (error) {
        console.error('Failed to render Mermaid in slides.', error)
      }).finally(function () {
        if (typeof reveal.layout === 'function') {
          reveal.layout()
        }
      })
    }

    const renderCurrentSlide = function () {
      renderQueue = renderQueue.then(function () {
        return renderSlideMermaid(reveal.getCurrentSlide())
      })
      return renderQueue
    }

    const onSlideChanged = function () {
      renderCurrentSlide()
    }

    if (typeof reveal.on === 'function') {
      reveal.on('slidechanged', onSlideChanged)
      registerDeckCleanup(deck, function () {
        if (typeof reveal.off === 'function') {
          reveal.off('slidechanged', onSlideChanged)
        }
      })
    }

    renderCurrentSlide()
  }

  function cleanupDeckWatchers() {
    document.querySelectorAll('.reveal.docsify-slide-deck[data-initialized]').forEach((deck) => {
      const cleanups = deckCleanup.get(deck)
      if (!cleanups || !cleanups.length) return
      cleanups.forEach((cleanup) => cleanup())
      deckCleanup.delete(deck)
    })
  }

  function initDecks() {
    document.querySelectorAll('.reveal.docsify-slide-deck:not([data-initialized])').forEach((deck) => {
      deck.setAttribute('data-initialized', 'true')

      const reveal = new Reveal(deck, {
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
      })

      reveal.initialize().then(function () {
        watchDeckLayout(deck, reveal)
        setupMermaidForDeck(deck, reveal)
        dispatchSlidesRendered(deck)
      })
    })
  }

  var docsifySlides = function (hook) {
    hook.beforeEach(function (content) {
      cleanupDeckWatchers()
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

  window.DocsifyUtils.registerPlugin(docsifySlides)
})()

