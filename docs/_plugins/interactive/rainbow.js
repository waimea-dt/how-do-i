/**
 * docsify-rainbow.js — Rainbow table attack demo for teaching password security
 *
 * Helps students understand:
 *   - Why storing plain password hashes is dangerous
 *   - How rainbow tables (pre-computed hash lookup tables) work
 *   - Why weak/common passwords are especially vulnerable
 *
 * Usage in markdown:
 *   <rainbow></rainbow>
 *
 * Attributes:
 *   - speed: Animation speed — "slow" (450ms), "normal" (200ms, default), "fast" (60ms)
 */

;(function () {

    // -------------------------------------------------------------------------
    // Data — hashes pre-computed so the plugin renders synchronously
    // -------------------------------------------------------------------------

    const TABLE = [
        { password: 'password',    hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8' },
        { password: '123456',      hash: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92' },
        { password: 'qwerty',      hash: '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5' },
        { password: 'letmein',     hash: '1c8bfe8f801d79745c4631d09fff36c82aa37fc4cce4fc946683d7b336b63032' },
        { password: '1q2w3e4r',    hash: '72ab994fa2eb426c051ef59cad617750bfe06d7cf6311285ff79c19c32afd236' },
        { password: 'monkey',      hash: '000c285457fc971f862a79b786476c78812c8897063c6fa9c045f579a3b2d63f' },
        { password: 'iloveyou',    hash: 'e4ad93ca07acb8d908a3aa41e920ea4f4ef4f26e7f86cf8291c5db289780a5ae' },
        { password: 'admin',       hash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918' },
        { password: 'welcome',     hash: '280d44ab1e9f79b5cce2dd4f58f5fe91f0fbacdac9f7447dffc318ceb79f2d02' },
        { password: 'password123', hash: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f' },
        { password: 'master',      hash: 'fc613b4dfd6736a7bd268c8a0e74ed0d1c04a959f59dd74ef2874983fd443fc9' },
        { password: 'qwerty123',   hash: 'daaad6e5604e8e17bd9f108d91e26afe6281dac8fda0091040a7a6d7bd9b43b5' },
        { password: '1234567',     hash: '8bb0cf6eb9b17d0f7d22b456f121257dc1254e1f01665370476383ea776df414' },
        { password: 'abc123',      hash: '6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090' },
        { password: 'football',    hash: '6382deaf1f5dc6e792b76db4a4a7bf2ba468884e000b25e7928e621e27fb23cb' },
    ]

    const SPEEDS = { slow: 450, normal: 200, fast: 60 }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
    }

    // -------------------------------------------------------------------------
    // HTML
    // -------------------------------------------------------------------------

    function renderTableRows(entries) {
        return entries.map((entry, i) => `
            <tr class="rt-row" data-index="${i}" data-hash="${entry.hash}">
                <td class="rt-cell-num">${i + 1}</td>
                <td class="rt-cell-password">
                    <span class="rt-password-hidden">${escapeHtml(entry.password)}</span>
                </td>
                <td class="rt-cell-hash">${entry.hash}</td>
            </tr>
        `).join('')
    }

    function buildUI(entries) {
        const wrapper = document.createElement('div')
        wrapper.className = 'rt-wrapper'
        wrapper.innerHTML = `
            <div class="rt-input-section">
                <label class="rt-label">Stolen hash to crack</label>
                <div class="rt-input-row">
                    <input
                        type="text"
                        class="rt-input"
                        placeholder="Paste a SHA-256 hash (spaces OK)…"
                        autocomplete="off"
                        spellcheck="false"
                        maxlength="80"
                    >
                    <button class="rt-start-btn">Start</button>
                    <button class="rt-reset-btn" disabled>Reset</button>
                </div>
            </div>

            <div class="rt-table-section">
                <div class="rt-section-label">
                    Rainbow Table
                    <span class="rt-section-note">· ${entries.length} entries · passwords hidden until matched</span>
                </div>
                <table class="rt-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Password</th>
                                <th>SHA-256 Hash</th>
                        </tr>
                    </thead>
                    <tbody>${renderTableRows(entries)}</tbody>
                </table>
            </div>

            <div class="rt-result" aria-live="polite"></div>
        `
        return wrapper
    }

    // -------------------------------------------------------------------------
    // Crack animation
    // -------------------------------------------------------------------------

    async function runCrack(targetHash, entries, el, stepDelay) {
        const rows     = el.querySelectorAll('.rt-row')
        const resultEl = el.querySelector('.rt-result')
        const startBtn = el.querySelector('.rt-start-btn')
        const resetBtn = el.querySelector('.rt-reset-btn')

        startBtn.disabled = true
        resetBtn.disabled = false

        for (let i = 0; i < entries.length; i++) {
            if (i > 0) rows[i - 1].classList.remove('is-checking')

            const row = rows[i]
            row.classList.add('is-checking')
            row.scrollIntoView({ block: 'nearest', behavior: 'smooth' })

            await new Promise(r => setTimeout(r, stepDelay))

            if (entries[i].hash === targetHash) {
                row.classList.remove('is-checking')
                row.classList.add('is-found')
                resultEl.className = 'rt-result is-found'
                resultEl.innerHTML = `
                    <span class="rt-result-icon">🔓</span>
                    <span class="rt-result-label">Password cracked at entry ${i + 1}:</span>
                    <span class="rt-result-value">${escapeHtml(entries[i].password)}</span>
                `
                startBtn.disabled = true
                return
            }

            row.classList.add('is-checked')
        }

        rows[rows.length - 1].classList.remove('is-checking')
        resultEl.className = 'rt-result is-not-found'
        resultEl.innerHTML = `
            <span class="rt-result-icon">🔒</span>
            <span class="rt-result-label">Not in table.</span>
            <span class="rt-result-note">This hash does not match any entry — the password may be strong, or salted.</span>
        `
        startBtn.disabled = false
    }

    function resetTable(el) {
        el.querySelectorAll('.rt-row').forEach(row => { row.className = 'rt-row' })
        const resultEl = el.querySelector('.rt-result')
        resultEl.className = 'rt-result'
        resultEl.innerHTML = ''
        el.querySelector('.rt-start-btn').disabled = false
        el.querySelector('.rt-reset-btn').disabled = true
    }

    // -------------------------------------------------------------------------
    // Plugin entry point
    // -------------------------------------------------------------------------

    function processRainbowTables() {
        document.querySelectorAll('.markdown-section rainbow').forEach(el => {
            const speedAttr = el.getAttribute('speed') || 'normal'
            const stepDelay = SPEEDS[speedAttr] ?? SPEEDS.normal

            el.innerHTML = ''
            el.appendChild(buildUI(TABLE))

            const input    = el.querySelector('.rt-input')
            const startBtn = el.querySelector('.rt-start-btn')
            const resetBtn = el.querySelector('.rt-reset-btn')
            const resultEl = el.querySelector('.rt-result')

            let isRunning = false

            async function start() {
                if (isRunning) return

                const target = input.value.replace(/\s+/g, '').trim().toLowerCase()

                if (!target) {
                    resultEl.className = 'rt-result is-error'
                    resultEl.innerHTML = `
                        <span class="rt-result-icon">⚠️</span>
                        <span class="rt-result-label">Enter a hash first.</span>
                    `
                    return
                }

                if (!/^[0-9a-f]{64}$/.test(target)) {
                    resultEl.className = 'rt-result is-error'
                    resultEl.innerHTML = `
                        <span class="rt-result-icon">⚠️</span>
                        <span class="rt-result-label">Invalid hash.</span>
                        <span class="rt-result-note">SHA-256 hashes are exactly 64 hex characters (0-9, a-f).</span>
                    `
                    return
                }

                resetTable(el)
                isRunning = true
                await runCrack(target, TABLE, el, stepDelay)
                isRunning = false
            }

            startBtn.addEventListener('click', start)
            input.addEventListener('keydown', e => { if (e.key === 'Enter') start() })
            resetBtn.addEventListener('click', () => { if (!isRunning) resetTable(el) })
            input.addEventListener('focus', () => { input.select() })
            input.addEventListener('input', () => { if (!isRunning) resetTable(el) })
            input.addEventListener('paste', () => { if (!isRunning) setTimeout(() => resetTable(el), 0) })
        })
    }

    const docsifyRainbow = function (hook) {
        hook.doneEach(processRainbowTables)
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyRainbow, window.$docsify.plugins || [])

})()
