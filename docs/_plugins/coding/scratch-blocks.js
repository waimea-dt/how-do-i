/**
 * docsify-scratch-blocks.js — Renders Scratch code blocks using the scratchblocks library.
 * 
 * Usage in markdown:
 *   ```scratch
 *   when green flag clicked
 *   move (10) steps
 *   say [Hello!] for (2) seconds
 *   ```
 * 
 *   ```scratch-inline
 *   when green flag clicked
 *   ```
 * 
 * Inline (within text):
 *   Use `when flag clicked`{.language-scratch} for inline blocks.
 * 
 * Requires: scratchblocks library (loaded via CDN in index.html)
 */

;(function () {

    // -------------------------------------------------------------------------
    // Main Processing Function
    // -------------------------------------------------------------------------

    function processScratchBlocks() {
        // Check if scratchblocks is available
        if (typeof scratchblocks === 'undefined') {
            console.warn('scratchblocks library not loaded')
            return
        }

        // Render standard scratch blocks
        const scratchElements = document.querySelectorAll('pre[data-lang="scratch"]')
        scratchElements.forEach(pre => {
            if (!pre.classList.contains('scratch-processed')) {
                pre.classList.add('scratch-processed')
            }
        })

        scratchblocks.renderMatching('pre[data-lang="scratch"]', {
            style: 'scratch3',
        })

        // Render scratch-inline blocks (block style but not inline)
        const scratchInlineElements = document.querySelectorAll('pre[data-lang="scratch-inline"]')
        scratchInlineElements.forEach(pre => {
            if (!pre.classList.contains('scratch-processed')) {
                pre.classList.add('scratch-processed')
            }
        })

        scratchblocks.renderMatching('pre[data-lang="scratch-inline"]', {
            style: 'scratch3',
            inline: false,
        })

        // Render inline scratch blocks (within text)
        const inlineElements = document.querySelectorAll('code.language-scratch')
        inlineElements.forEach(code => {
            if (!code.classList.contains('scratch-processed')) {
                code.classList.add('scratch-processed')
            }
        })

        scratchblocks.renderMatching('code.language-scratch', {
            style: 'scratch3',
            inline: true,
        })
    }

    // -------------------------------------------------------------------------
    // Plugin Registration
    // -------------------------------------------------------------------------

    const docsifyScratchBlocks = function (hook) {
        hook.doneEach(function () {
            // Small delay to ensure DOM is ready
            setTimeout(processScratchBlocks, 50)
        })
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyScratchBlocks, window.$docsify.plugins || [])

})()

