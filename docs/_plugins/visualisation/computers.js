/**
 * docsify-computers.js — Automatically wraps content inside <computer> tags with required div structure.
 * Supports multiple computer types: desktop, window, tablet, mobile, vintage, 1980s, simple.
 * 
 * Usage in markdown:
 *   <computer type="desktop">
 *   # Your Content
 *   Regular markdown here...
 *   </computer>
 */

;(function () {

    // -------------------------------------------------------------------------
    // Main Processing Function
    // -------------------------------------------------------------------------

    function processComputers() {
        const computers = document.querySelectorAll('computer')

        if (computers.length === 0) {
            return
        }

        computers.forEach(computer => {
            // Skip if already processed
            if (computer.querySelector('.screen-outer-wrapper')) {
                return
            }

            const typeAttr = (computer.getAttribute('type') || 'simple').toLowerCase()
            const originalContent = computer.innerHTML.trim()

            // Determine computer type with flexible prefix matching
            let computerType = 'simple'
            if (typeAttr.startsWith('desk'))    computerType = 'desktop'
            if (typeAttr.startsWith('win'))     computerType = 'window'
            if (typeAttr.startsWith('tab'))     computerType = 'tablet'
            if (typeAttr.startsWith('mob'))     computerType = 'mobile'
            if (typeAttr.startsWith('mac'))     computerType = 'mac'
            if (typeAttr.startsWith('vintage') || typeAttr.startsWith('1980')) {
                computerType = 'vintage'
            }

            // Update the type attribute to normalized value
            computer.setAttribute('type', computerType)

            // Create the wrapper structure
            const outerWrapper = document.createElement('div')
            outerWrapper.className = 'screen-outer-wrapper'

            const screenWrapper = document.createElement('div')
            screenWrapper.className = 'screen-wrapper'
            screenWrapper.innerHTML = originalContent

            outerWrapper.appendChild(screenWrapper)

            // Clear the computer element and add the wrapped content
            computer.innerHTML = ''
            computer.appendChild(outerWrapper)

            // Add screen-decor div (styled based on type)
            const screenDecor = document.createElement('div')
            screenDecor.className = 'screen-decor'
            computer.appendChild(screenDecor)
        })
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


