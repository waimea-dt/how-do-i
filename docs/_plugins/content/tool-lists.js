/**
 * tool-lists.js - Enhances lists following marked headings with semantic classes.
 *
 * Identifies tool/resource lists marked with <!-- tool-lists --> comment at page top.
 * When marker is found, ALL h2 headings and their following ULs are styled as tool lists.
 * Adds classes to list items based on metadata found in sub-lists:
 *   - **Recommended** → adds "recommended" class
 *   - **Free** / **Paid** → adds "free" or "paid" class
 *   - **Beginner friendly** → adds "beginner-friendly" class
 *
 * Usage:
 *   # Page Title
 *   <!-- tool-lists -->
 *   
 *   ## Python IDEs
 *   - [Thonny](https://thonny.org/)
 *       - **Recommended**
 *       - **Free**
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
        const container = scope === document ? document.querySelector('.markdown-section') : scope

        if (!container) return

        // Check if page has <!-- tool-lists --> marker anywhere near the top
        let hasToolListsMarker = false
        const walker = document.createTreeWalker(
            container,
            NodeFilter.SHOW_COMMENT,
            null,
            false
        )

        let commentNode
        while ((commentNode = walker.nextNode())) {
            if (commentNode.nodeValue.trim() === 'tool-lists') {
                hasToolListsMarker = true
                break
            }
            // Stop searching after first h2 (marker should be before content)
            if (commentNode.nextElementSibling?.tagName === 'H2') break
        }

        if (!hasToolListsMarker) return

        // Process ALL h2 headings in the page
        const selector = scope === document ? '.markdown-section h2' : 'h2'
        const headings = container.querySelectorAll(selector)

        headings.forEach(heading => {
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
