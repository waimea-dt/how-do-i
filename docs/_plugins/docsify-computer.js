// docsify-computer.js
// Automatically wraps content inside <computer> tags with required div structure.
// Supports multiple computer types: desktop, window, tablet, mobile, vintage, 1980s, simple.
//
// Usage in Markdown:
//   <computer type="desktop">
//   # Your Content
//   Regular markdown here...
//   </computer>

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

            const computerType = computer.getAttribute('type') || 'desktop'
            const originalContent = computer.innerHTML.trim()

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

            // Add screen-decor div for windowed type
            if (computerType === 'window') {
                const screenDecor = document.createElement('div')
                screenDecor.className = 'screen-decor'
                computer.appendChild(screenDecor)
            }
        })
    }

    // -------------------------------------------------------------------------
    // Plugin Registration
    // -------------------------------------------------------------------------

    const docsifyComputer = function (hook) {
        hook.doneEach(function () {
            processComputers()
        })
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyComputer, window.$docsify.plugins || [])

})()

