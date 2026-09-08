/**
 * home-menu.js - Renders <menu>...</menu> blocks as a responsive grid of cards with links.
 * Content is split by <hr> tags - each section becomes a card.
 *
 * Usage in markdown:
 *   <menu>
 *   # Card 1
 *   [Link](url)
 *   Content here
 *   ---
 *   # Card 2
 *   [Link](url)
 *   More content
 *   </menu>
 */

; (function () {
    function resolveScope(root) {
        return root && typeof root.querySelectorAll === 'function' ? root : document
    }

    // If the item contains a link, wrap all its content in it so the whole item is clickable
    function wrapItemContentInLink(item) {
        removeHeadingAnchors(item)

        const link = item.querySelector('a[href]')
        if (!link) return

        const wrapper = document.createElement('a')
        wrapper.setAttribute('href', link.getAttribute('href'))

        // Remove the original link and parent para
        const linkParent = link.parentNode
        item.removeChild(linkParent)

        // Move the remaining item content inside the new wrapping link
        while (item.firstChild) {
            wrapper.appendChild(item.firstChild)
        }
        item.appendChild(wrapper)
    }

    // Strip docsify's auto-generated heading anchor links (e.g. <h3><a class="anchor">...)
    function removeHeadingAnchors(item) {
        item.querySelectorAll('a.anchor').forEach((anchor) => {
            const parent = anchor.parentNode
            while (anchor.firstChild) {
                parent.insertBefore(anchor.firstChild, anchor)
            }
            parent.removeChild(anchor)
        })
    }

    function processMenu(root) {
        const scope = resolveScope(root)
        const selector = scope === document ? '.markdown-section menu' : 'menu'
        const menuBlocks = scope.querySelectorAll(selector)

        menuBlocks.forEach((menuBlock) => {
            // Get all direct children
            const children = Array.from(menuBlock.children)
            if (children.length === 0) return

            // Create the menu container
            const menuContainer = document.createElement('div')
            menuContainer.classList.add('menu-container')

            // Split content by HR elements
            let currentCard = document.createElement('div')
            currentCard.classList.add('menu-item')

            children.forEach((child) => {
                if (child.tagName === 'HR') {
                    // When we hit an HR, save the current card and start a new one
                    if (currentCard.children.length > 0) {
                        wrapItemContentInLink(currentCard)
                        menuContainer.appendChild(currentCard)
                    }
                    currentCard = document.createElement('div')
                    currentCard.classList.add('menu-item')
                } else {
                    // Add the element to the current card
                    currentCard.appendChild(child.cloneNode(true))
                }
            })

            // Don't forget the last card
            if (currentCard.children.length > 0) {
                wrapItemContentInLink(currentCard)
                menuContainer.appendChild(currentCard)
            }

            // Replace the menu tag with the formatted container
            menuBlock.parentNode.replaceChild(menuContainer, menuBlock)
        })
    }

    var docsifyMenu = function (hook) {
        hook.doneEach(function () {
            processMenu()
        })
        hook.ready(function () {
            window.DocsifyUtils.onSlidesRendered(function (root) {
                processMenu(root)
            })
        })
    }

    window.DocsifyUtils.registerPlugin(docsifyMenu)
})()

