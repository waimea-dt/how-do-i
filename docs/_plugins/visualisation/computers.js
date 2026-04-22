/**
 * docsify-computers.js - Automatically wraps content inside <computer> tags with SVG-based computer displays.
 * Supports multiple computer types: desktop, window, laptop, tablet, mobile, vintage, 1980s, macintosh, mac, simple.
 *
 * Usage in markdown:
 *   <computer type="vintage">
 *   # Your Content
 *   Regular markdown here...
 *   </computer>
 */

;(function () {

    // -------------------------------------------------------------------------
    // SVG Cache and Loading
    // -------------------------------------------------------------------------

    const SVG_CACHE = {}
    const SVG_BASE_PATH = '_assets/computers/'

    async function loadSVG(type) {
        if (SVG_CACHE[type]) {
            return SVG_CACHE[type]
        }

        try {
            const response = await fetch(`${SVG_BASE_PATH}${type}.svg`)
            if (response.ok) {
                const svgContent = await response.text()
                SVG_CACHE[type] = svgContent
                return svgContent
            }
        } catch (error) {
            console.error(`Failed to load SVG for type "${type}":`, error)
        }

        return null
    }

    // -------------------------------------------------------------------------
    // Main Processing Function
    // -------------------------------------------------------------------------

    async function processComputers() {
        const computers = document.querySelectorAll('computer')

        if (computers.length === 0) {
            return
        }

        // Process all computers
        const promises = Array.from(computers).map(async (computer) => {
            // Skip if already processed
            if (computer.querySelector('.computer-screen-content')) {
                return
            }

            const typeAttr = (computer.getAttribute('type') || 'desktop').toLowerCase()
            const originalContent = computer.innerHTML.trim()

            // Determine computer type with flexible prefix matching
            let computerType = 'desktop'
            if (typeAttr.startsWith('desk') || typeAttr.startsWith('simp')) computerType = 'desktop'
            if (typeAttr.startsWith('win'))     computerType = 'window'
            if (typeAttr.startsWith('lap'))     computerType = 'laptop'
            if (typeAttr.startsWith('tab'))     computerType = 'tablet'
            if (typeAttr.startsWith('mob'))     computerType = 'mobile'
            if (typeAttr.startsWith('mac'))     computerType = 'macintosh'
            if (typeAttr.startsWith('vintage') || typeAttr.startsWith('1980')) {
                computerType = 'vintage'
            }

            // Update the type attribute to normalized value
            computer.setAttribute('type', computerType)

            // Clear the computer element
            computer.innerHTML = ''

            // Load and insert SVG
            const svg = await loadSVG(computerType)
            if (svg) {
                computer.insertAdjacentHTML('beforeend', svg)

                // Add class to SVG for styling and remove fixed dimensions
                const svgElement = computer.querySelector('svg')
                if (svgElement) {
                    svgElement.classList.add('computer-frame')
                    svgElement.removeAttribute('width')
                    svgElement.removeAttribute('height')
                }
            }

            // Create the content wrapper
            const contentWrapper = document.createElement('div')
            contentWrapper.className = 'computer-screen-content'
            contentWrapper.innerHTML = originalContent

            computer.appendChild(contentWrapper)
        })

        await Promise.all(promises)
    }

    // -------------------------------------------------------------------------
    // Plugin Registration
    // -------------------------------------------------------------------------

    const docsifyComputers = function (hook) {
        hook.doneEach(function () {
            processComputers()
        })
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyComputers, window.$docsify.plugins || [])

})()


