/**
 * tool-lists.js - Enhances lists following marked headings with semantic classes.
 *
 * Identifies tool/resource lists marked with <!-- tools --> comment before heading.
 * Adds classes to list items based on metadata found in sub-lists:
 *   - **Recommended** → adds "recommended" class
 *   - **Free** / **Paid** → adds "free" or "paid" class
 *   - **Beginner friendly** → adds "beginner-friendly" class
 *   - Custom badges like **Beta**, **Open Source**, etc.
 *
 * Usage:
 *   <!-- tools -->
 *   ## Python IDEs
 *   - [Thonny](https://thonny.org/)
 *       - **Recommended**
 *       - **Beginner friendly**
 *       - Simple interface
 */

;(function () {
    'use strict'

    // Metadata keywords that should become classes (case-insensitive)
    const METADATA_KEYWORDS = {
        'recommended': 'recommended',
        'free': 'free',
        'paid': 'paid',
    }

    function resolveScope(root) {
        return root && typeof root.querySelectorAll === 'function' ? root : document
    }

    function processToolLists(root) {
        const scope = resolveScope(root)
        const selector = scope === document ? '.markdown-section h1, .markdown-section h2, .markdown-section h3' : 'h1, h2, h3'
        const headings = scope.querySelectorAll(selector)

        headings.forEach(heading => {
            // Check if heading is preceded by <!-- tools --> comment
            let prevNode = heading.previousSibling
            let hasToolsMarker = false

            // Walk backwards through siblings to find comment (skip text nodes with only whitespace)
            while (prevNode) {
                if (prevNode.nodeType === Node.COMMENT_NODE && prevNode.nodeValue.trim() === 'tools') {
                    hasToolsMarker = true
                    break
                }
                // Skip whitespace-only text nodes
                if (prevNode.nodeType === Node.TEXT_NODE && prevNode.nodeValue.trim() === '') {
                    prevNode = prevNode.previousSibling
                    continue
                }
                // Stop if we hit other content
                break
            }

            if (!hasToolsMarker) return

            heading.classList.add('tools-heading')

            // Find the next sibling UL
            let nextEl = heading.nextElementSibling
            while (nextEl && nextEl.tagName !== 'UL') {
                nextEl = nextEl.nextElementSibling
            }

            if (!nextEl || nextEl.tagName !== 'UL') return

            // Mark this as a tool list
            const toolList = nextEl
            toolList.classList.add('tool-list')

            // Process each top-level LI
            const listItems = Array.from(toolList.children).filter(el => el.tagName === 'LI')

            listItems.forEach(li => {
                // Find nested UL within this LI (sub-list with metadata)
                const subList = li.querySelector('ul')
                if (!subList) return

                // Extract metadata from sub-list items that are bold
                const subItems = Array.from(subList.children).filter(el => el.tagName === 'LI')
                const foundClasses = []
                const itemsToRemove = []

                subItems.forEach(subLi => {
                    // Check if this item starts with bold text
                    const firstChild = subLi.firstChild
                    if (!firstChild) return

                    // Check for <strong> or <em><strong> patterns
                    let boldText = null
                    if (firstChild.tagName === 'STRONG') {
                        boldText = firstChild.textContent
                    } else if (firstChild.tagName === 'EM' && firstChild.firstChild?.tagName === 'STRONG') {
                        boldText = firstChild.firstChild.textContent
                    }

                    if (!boldText) return

                    // Normalize and check against keywords
                    const normalized = boldText.toLowerCase().trim()

                    // Check exact matches first
                    if (METADATA_KEYWORDS[normalized]) {
                        foundClasses.push(METADATA_KEYWORDS[normalized])
                        itemsToRemove.push(subLi)
                    }
                })

                // Add all found classes to the parent LI
                foundClasses.forEach(cls => {
                    li.classList.add(cls)
                })

                // Remove metadata items from the sub-list
                itemsToRemove.forEach(subLi => {
                    subLi.remove()
                })

                // If sub-list is now empty, remove it entirely
                if (subList.children.length === 0) {
                    subList.remove()
                }
            })
        })
    }

    const docsifyToolLists = function (hook) {
        hook.doneEach(function () {
            processToolLists()
        })

        hook.ready(function () {
            if (window.DocsifyUtils?.onSlidesRendered) {
                window.DocsifyUtils.onSlidesRendered(function (root) {
                    processToolLists(root)
                })
            }
        })
    }

    if (window.DocsifyUtils?.registerPlugin) {
        window.DocsifyUtils.registerPlugin(docsifyToolLists)
    } else {
        // Fallback if utils not loaded
        if (window.$docsify) {
            window.$docsify.plugins = [].concat(docsifyToolLists, window.$docsify.plugins || [])
        }
    }
})()
