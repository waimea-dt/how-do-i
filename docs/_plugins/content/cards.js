/**
 * cards.js - Renders <cards>...</cards> blocks as a responsive grid of cards.
 * Content is split by <hr> tags - each section becomes a card.
 *
 * Attributes:
 *   - size: "narrow" (12rem cards), "full" (100% width), or default (20rem cards)
 *
 * Usage in markdown:
 *   <cards size="narrow">
 *   # Card 1
 *   Content here
 *   ---
 *   # Card 2
 *   More content
 *   </cards>
 */

;(function () {
  function processCards() {
    const cardBlocks = document.querySelectorAll('.markdown-section cards')

    cardBlocks.forEach((cardBlock) => {
      // Get all direct children
      const children = Array.from(cardBlock.children)
      if (children.length === 0) return

      // Get size attribute
      const sizeAttr = cardBlock.getAttribute('size')

      // Create the cards container
      const cardsContainer = document.createElement('div')
      cardsContainer.classList.add('cards-container')

      if (sizeAttr === 'narrow') {
        cardsContainer.classList.add('narrow')
      } else if (sizeAttr === 'full') {
        cardsContainer.classList.add('full')
      }

      // Split content by HR elements
      let currentCard = document.createElement('div')
      currentCard.classList.add('card')

      children.forEach((child) => {
        if (child.tagName === 'HR') {
          // When we hit an HR, save the current card and start a new one
          if (currentCard.children.length > 0) {
            cardsContainer.appendChild(currentCard)
          }
          currentCard = document.createElement('div')
          currentCard.classList.add('card')
        } else {
          // Add the element to the current card
          currentCard.appendChild(child.cloneNode(true))
        }
      })

      // Don't forget the last card
      if (currentCard.children.length > 0) {
        cardsContainer.appendChild(currentCard)
      }

      // Replace the cards tag with the formatted container
      cardBlock.parentNode.replaceChild(cardsContainer, cardBlock)
    })
  }

  var docsifyCards = function (hook) {
    hook.doneEach(function () {
      processCards()
    })
  }

  window.$docsify = window.$docsify || {}
  window.$docsify.plugins = [].concat(docsifyCards, window.$docsify.plugins || [])
})()

