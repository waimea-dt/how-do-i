/**
 * docsify-hasher.js — Interactive SHA-256 hashing demo for teaching cryptographic hash functions
 *
 * Helps students understand:
 *   - What a hash function produces (fixed-length output from any input)
 *   - Determinism: same input always gives the same hash
 *   - The avalanche effect: a tiny change → completely different hash
 *
 * Usage in markdown:
 *   <hasher></hasher>
 *   <hasher value="hello world"></hasher>
 *
 * Attributes:
 *   - value: Initial input text (default: "hello")
 */

;(function () {

    // -------------------------------------------------------------------------
    // Crypto
    // -------------------------------------------------------------------------

    async function sha256(text) {
        const encoder = new TextEncoder()
        const data = encoder.encode(text)
        const buffer = await crypto.subtle.digest('SHA-256', data)
        return Array.from(new Uint8Array(buffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')
    }

    function generateSalt() {
        return Array.from(crypto.getRandomValues(new Uint8Array(8)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')
    }

    // -------------------------------------------------------------------------
    // HTML Helpers
    // -------------------------------------------------------------------------

    function escapeAttr(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
    }

    function renderHashGroups(hash) {
        // Split into 8 groups of 8 hex chars (each group = one 32-bit word)
        return hash.match(/.{1,8}/g)
            .map(group => `<span class="hasher-group">${group}</span>`)
            .join('')
    }

    function renderBinaryGroups(hash) {
        // Each pair of hex chars = 1 byte = 8 bits (32 groups total)
        return hash.match(/.{2}/g)
            .map(byte => `<span class="hasher-group">${parseInt(byte, 16).toString(2).padStart(8, '0')}</span>`)
            .join('')
    }

    // -------------------------------------------------------------------------
    // UI Construction
    // -------------------------------------------------------------------------

    function buildHasherUI(initialValue, saltMode, showHistory, showBinary) {
        // saltMode: null = hidden, true = visible+checked, false = visible+unchecked
        const saltHidden  = saltMode === null
        const saltChecked = saltMode === true
        const wrapper = document.createElement('div')
        wrapper.className = 'hasher-wrapper'
        wrapper.innerHTML = `
            <div class="hasher-input-section">
                <div class="hasher-label">Input text</div>
                <input
                    type="text"
                    class="hasher-input"
                    value="${escapeAttr(initialValue)}"
                    placeholder="Type anything…"
                    autocomplete="off"
                    spellcheck="false"
                >
                <div class="hasher-salt-row"${saltHidden ? ' hidden' : ''}>
                    <label class="hasher-salt-toggle">
                        <input type="checkbox" class="hasher-salt-checkbox"${saltChecked ? ' checked' : ''}>
                        <span>Add salt</span>
                    </label>
                    <div class="hasher-salt-display"${saltChecked ? '' : ' hidden'}>
                        <span class="hasher-salt-label">Salt:</span>
                        <code class="hasher-salt-value"></code>
                        <button class="hasher-salt-refresh-btn" title="Generate new salt">↺ New</button>
                    </div>
                </div>
            </div>
            <div class="hasher-arrow" aria-hidden="true"></div>
            <div class="hasher-output-section">
                <div class="hasher-label">
                    SHA-256 hash
                    <span class="hasher-label-note">· 256 bits · 64 hex chars</span>
                    <button class="hasher-copy-btn" title="Copy hash">Copy</button>
                </div>
                <div class="hasher-output" aria-live="polite">
                    <code class="hasher-hash"></code>
                </div>
                ${showBinary ? `
                    <div class="hasher-label">
                        Binary
                        <span class="hasher-label-note">· 256 bits · 32 8-bit bytes</span>
                    </div>
                    <div class="hasher-output" aria-live="polite">
                        <code class="hasher-hash hasher-binary"></code>
                    </div>
                ` : ''}
            </div>
            ${showHistory ? `
            <div class="hasher-history">
                <div class="hasher-history-label">History <span class="hasher-history-note">· last ${HISTORY_MAX} values</span></div>
                <pre class="hasher-history-pre"><code class="hasher-history-code"></code></pre>
            </div>` : ''}
        `
        return wrapper
    }

    // -------------------------------------------------------------------------
    // Hash Update
    // -------------------------------------------------------------------------

    async function updateHash(input, hashEl, salt = '') {
        const text = input.value

        if (text === '') {
            hashEl.classList.remove('is-updated')
            hashEl.innerHTML = '<span class="hasher-empty">——</span>'
            return null
        }

        const hash = await sha256(salt + text)

        // Re-trigger the flash animation on every update
        hashEl.classList.remove('is-updated')
        void hashEl.offsetWidth
        hashEl.classList.add('is-updated')
        hashEl.dataset.hash = hash
        hashEl.innerHTML = renderHashGroups(hash)
        return hash
    }

    // -------------------------------------------------------------------------
    // History
    // -------------------------------------------------------------------------

    const HISTORY_MAX = 15

    function buildHistoryEl() {
        const div = document.createElement('div')
        div.className = 'hasher-history'
        div.innerHTML = `
            <div class="hasher-history-label">History <span class="hasher-history-note">· last ${HISTORY_MAX} values</span></div>
            <pre class="hasher-history-pre"><code class="hasher-history-code"></code></pre>
        `
        return div
    }

    function renderHistory(historyEl, entries) {
        const codeEl = historyEl.querySelector('.hasher-history-code')
        const hasSalt = entries.some(e => e.salt)
        const lines = []
        for (let i = 0; i < HISTORY_MAX; i++) {
            if (i < entries.length) {
                let line = ''
                const { text, salt, hash } = entries[i]
                const label = text.length > 16 ? text.slice(0, 15) + '…' : text
                line += `<span class="input-value">${label.padEnd(16)}</span> → `
                if (hasSalt) {
                    line += `<span class="salt-value">${salt}</span><span class="input-value">${label.padEnd(16)}</span> → `
                }
                line += `<span class="hash-value">${hash}</span>`
                lines.push(line)
            } else {
                lines.push('')
            }
        }
        codeEl.innerHTML = lines.join('\n')
    }

    // -------------------------------------------------------------------------
    // Plugin Entry Point
    // -------------------------------------------------------------------------

    function processHashers() {
        document.querySelectorAll('.markdown-section hasher').forEach(el => {
            const initialValue = el.getAttribute('value') ?? 'hello'
            const saltAttr     = el.getAttribute('salted')  // null | '' | 'true' | 'false'
            const saltMode     = saltAttr === null ? null : saltAttr === 'false' ? false : true
            const showHistory  = el.hasAttribute('history')
            const showBinary   = el.hasAttribute('binary')

            const wrapper = buildHasherUI(initialValue, saltMode, showHistory, showBinary)
            el.innerHTML = ''
            el.appendChild(wrapper)

            let historyEl      = showHistory ? el.querySelector('.hasher-history') : null
            let historyEntries = []

            if (historyEl) renderHistory(historyEl, historyEntries)

            function pushHistory(text, salt, hash) {
                if (!historyEl || !text) return
                historyEntries.unshift({ text, salt, hash })
                if (historyEntries.length > HISTORY_MAX) historyEntries.length = HISTORY_MAX
                renderHistory(historyEl, historyEntries)
            }

            const input     = el.querySelector('.hasher-input')
            const hashEl    = el.querySelector('.hasher-hash')
            const binaryEl  = showBinary ? el.querySelector('.hasher-binary') : null

            function updateBinary(hash) {
                if (!binaryEl) return
                if (!hash) {
                    binaryEl.classList.remove('is-updated')
                    binaryEl.innerHTML = '<span class="hasher-empty">——</span>'
                    return
                }
                binaryEl.classList.remove('is-updated')
                void binaryEl.offsetWidth
                binaryEl.classList.add('is-updated')
                binaryEl.innerHTML = renderBinaryGroups(hash)
            }
            const copyBtn   = el.querySelector('.hasher-copy-btn')
            const saltCheck = el.querySelector('.hasher-salt-checkbox')
            const saltDisp  = el.querySelector('.hasher-salt-display')
            const saltValEl = el.querySelector('.hasher-salt-value')
            const saltRefr  = el.querySelector('.hasher-salt-refresh-btn')

            let currentSalt = saltMode === true ? generateSalt() : ''
            if (saltMode === true) saltValEl.textContent = currentSalt

            updateHash(input, hashEl, currentSalt).then(h => { updateBinary(h); pushHistory(input.value, currentSalt, h) })
            input.addEventListener('input', async () => {
                const h = await updateHash(input, hashEl, currentSalt)
                updateBinary(h)
                pushHistory(input.value, currentSalt, h)
            })

            saltCheck.addEventListener('change', async () => {
                if (saltCheck.checked) {
                    currentSalt = generateSalt()
                    saltValEl.textContent = currentSalt
                    saltDisp.hidden = false
                } else {
                    currentSalt = ''
                    saltDisp.hidden = true
                }
                const h = await updateHash(input, hashEl, currentSalt)
                updateBinary(h)
                pushHistory(input.value, currentSalt, h)
            })

            saltRefr.addEventListener('click', async () => {
                currentSalt = generateSalt()
                saltValEl.textContent = currentSalt
                const h = await updateHash(input, hashEl, currentSalt)
                updateBinary(h)
                pushHistory(input.value, currentSalt, h)
            })

            copyBtn.addEventListener('click', () => {
                const hash = hashEl.dataset.hash
                if (!hash) return
                navigator.clipboard.writeText(hash).then(() => {
                    copyBtn.textContent = 'Copied!'
                    setTimeout(() => { copyBtn.textContent = 'Copy' }, 1500)
                })
            })
        })
    }

    const docsifyHasher = function (hook) {
        hook.doneEach(processHashers)
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyHasher, window.$docsify.plugins || [])

})()
