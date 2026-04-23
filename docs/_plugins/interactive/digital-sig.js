/**
 * digital-sig.js — Digital Signature Visualiser
 *
 * Demonstrates how digital signatures prove file authenticity:
 *   - Alice hashes a file, signs the hash with her private key
 *   - Bob receives the file + signature, verifies using Alice's public key
 *   - If the file was tampered with, signature verification fails
 *
 * Usage:
 *   <digital-sig></digital-sig>
 *   <digital-sig file="contract.pdf"></digital-sig>
 *   <digital-sig tamper></digital-sig>
 *
 * Attributes:
 *   - file:   Filename to display (default: "report.pdf")
 *   - tamper: Attacker modifies the file in transit — verification fails
 *
 * Animation sequence:
 *   1. Alice has the document and her key pair; Bob has Alice's public key
 *   2. Alice hashes the file content
 *   3. Alice encrypts the hash with her private key → signature
 *   4. Alice sends the file to Bob
 *   5. Alice sends the signature to Bob  [tamper intercept shown here]
 *   6. Bob hashes the received file; Bob decrypts the signature
 *   7. Bob compares the two hashes → Verified or Invalid
 */

;(function () {

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    function randomHex(n) {
        const chars = 'ABCDEF0123456789'
        let out = ''
        for (let i = 0; i < n; i++) out += chars[Math.floor(Math.random() * chars.length)]
        return out
    }

    function formatHex(s) {
        return s.match(/.{1,4}/g).join(' ')
    }

    /**
     * FNV-1a hash of a string → 8-char hex.
     * Teaching-only visualisation — not real SHA-256.
     */
    function hashContent(content) {
        let h = 0x811c9dc5
        for (let i = 0; i < content.length; i++) {
            h ^= content.charCodeAt(i)
            h = (h * 0x01000193) >>> 0
        }
        return formatHex(h.toString(16).toUpperCase().padStart(8, '0'))
    }

    /**
     * Teaching-only signature: hash XOR'd and permuted with private key.
     * In real RSA: sig = hash^privateExponent mod n
     */
    function signHash(hash, privateKey) {
        const h = parseInt(hash.replace(/ /g, ''), 16)
        const k = parseInt(privateKey.replace(/ /g, ''), 16)
        const sig = ((h ^ k) * 0x9e3779b9) >>> 0
        return formatHex(sig.toString(16).toUpperCase().padStart(8, '0'))
    }

    // -------------------------------------------------------------------------
    // UI Builder
    // -------------------------------------------------------------------------

    function buildUI(filename, showTamper) {
        const wrapper = document.createElement('div')
        wrapper.className = 'exchange-wrapper'

        // Fixed sample content + tamper variant
        const originalContent = `Score: 85 / 100`
        const tamperedContent  = `Score: 100 / 100`

        wrapper.innerHTML = `
            <div class="exchange-header">
                <div class="exchange-header-content">
                    <div class="exchange-title">Digital Signatures</div>
                    <div class="exchange-subtitle">Sign a file with a private key. Anyone with the public key can verify authenticity — but cannot forge a signature.</div>
                </div>
                <div class="ds-header-badge">
                    <span class="ds-file-icon">📄</span>
                    <span class="ds-header-filename">${filename}</span>
                    ${showTamper ? '<span class="ds-tamper-badge">⚠️ Tamper scenario</span>' : ''}
                </div>
            </div>

            <div class="exchange-grid">

                <!-- ======================== Alice ======================== -->
                <div class="exchange-party exchange-party1">
                    <div class="exchange-party-header">
                        <div class="exchange-party-name">👩 Alice (Sender)</div>
                    </div>

                    <!-- Step 1: Document + key pair -->
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 1</span>: Document &amp; keys</div>
                        <div class="exchange-step-content">
                            <div class="exchange-result exchange-show" data-alice-doc-result>
                                <div class="exchange-value-group exchange-value-party1">
                                    <span class="exchange-var">file</span> = <span class="exchange-value ds-content" data-alice-content>?</span>
                                </div>
                            </div>
                            <div class="exchange-result exchange-show" data-alice-keys-result>
                                <div class="exchange-value-group exchange-value-party1">
                                    <span class="exchange-var">privateKey</span> = <span class="exchange-value ds-key" data-alice-private>?</span>
                                </div>
                                <span class="exchange-badge exchange-secret-badge">Private Key</span>
                                <div class="exchange-value-group exchange-value-party1 ds-pubkey-row">
                                    <span class="exchange-var">publicKey</span> = <span class="exchange-value ds-key" data-alice-public>?</span>
                                </div>
                                <span class="exchange-badge exchange-public-badge">Public Key</span>
                            </div>
                        </div>
                    </div>

                    <!-- Step 2: Hash the file -->
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 2</span>: Hash the file</div>
                        <div class="exchange-step-content">
                            <div class="ds-formula">SHA-256(<span class="ds-func">file</span>)</div>
                            <div class="exchange-result" data-alice-hash-result>
                                <div class="exchange-value-group exchange-value-party1">
                                    <span class="exchange-var">hash</span> = <span class="exchange-value ds-hash" data-alice-hash>?</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Step 3: Sign the hash -->
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 3</span>: Sign the hash</div>
                        <div class="exchange-step-content">
                            <div class="ds-formula">encrypt(<span class="ds-func">hash</span>, privateKey)</div>
                            <div class="exchange-result" data-alice-sig-result>
                                <div class="exchange-value-group exchange-value-party1">
                                    <span class="exchange-var">signature</span> = <span class="exchange-value ds-hash" data-alice-sig>?</span>
                                </div>
                                <span class="exchange-badge exchange-secret-badge">Only Alice can create this</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ======================== Middle ======================== -->
                <div class="exchange-column">

                    <!-- Step 4: Send file -->
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 4</span>: Send file</div>
                        <div class="exchange-arrow-grid">
                            <div class="exchange-arrow-group">
                                <div class="exchange-arrow exchange-arrow-right">
                                    <div class="exchange-value-group">
                                        <span class="exchange-var">file</span> = <span class="exchange-value ds-content" data-arrow-content>?</span>
                                    </div>
                                    <span class="exchange-arrow-icon">→</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Step 5: Send signature -->
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 5</span>: Send signature</div>
                        <div class="exchange-arrow-grid">
                            <div class="exchange-arrow-group">
                                <div class="exchange-arrow exchange-arrow-right">
                                    <div class="exchange-value-group">
                                        <span class="exchange-var">sig</span> = <span class="exchange-value ds-hash" data-arrow-sig>?</span>
                                    </div>
                                    <span class="exchange-arrow-icon">→</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    ${showTamper ? `
                    <div class="exchange-eve">
                        <div class="exchange-eve-icon">⚠️ Attacker modifies file</div>
                        <div class="exchange-eve-text">Original: <span class="ds-content">${originalContent}</span></div>
                        <div class="exchange-eve-text ds-tamper-change">Changed: <span class="ds-content ds-tampered">${tamperedContent}</span></div>
                        <div class="exchange-eve-problem">Signature was computed from original content — verification will fail!</div>
                    </div>
                    ` : ''}
                </div>

                <!-- ======================== Bob ======================== -->
                <div class="exchange-party exchange-party2">
                    <div class="exchange-party-header">
                        <div class="exchange-party-name">👨 Bob (Receiver)</div>
                    </div>

                    <!-- Step 1: Bob has Alice's public key -->
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 1</span>: Alice's public key</div>
                        <div class="exchange-step-content">
                            <div class="exchange-result exchange-show" data-bob-pubkey-result>
                                <div class="exchange-value-group exchange-value-party2">
                                    <span class="exchange-var">publicKey</span> = <span class="exchange-value ds-key" data-bob-public>?</span>
                                </div>
                                <span class="exchange-badge exchange-public-badge">Alice's Public Key</span>
                            </div>
                        </div>
                    </div>

                    <!-- Step 6: Process received data -->
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 6</span>: Process received data</div>
                        <div class="exchange-step-content">
                            <div class="exchange-result" data-bob-received-result>
                                <div class="exchange-value-group exchange-value-party2">
                                    <span class="exchange-var">received</span> = <span class="exchange-value ds-content${showTamper ? ' ds-tampered' : ''}" data-bob-received>?</span>
                                </div>
                            </div>
                            <div class="ds-formula">SHA-256(<span class="ds-func">received</span>)</div>
                            <div class="exchange-result" data-bob-hash-result>
                                <div class="exchange-value-group exchange-value-party2">
                                    <span class="exchange-var">hash'</span> = <span class="exchange-value ds-hash" data-bob-hash>?</span>
                                </div>
                            </div>
                            <div class="ds-formula">decrypt(<span class="ds-func">sig</span>, publicKey)</div>
                            <div class="exchange-result" data-bob-recovered-result>
                                <div class="exchange-value-group exchange-value-party2">
                                    <span class="exchange-var">hash (from sig)</span> = <span class="exchange-value ds-hash" data-bob-recovered>?</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Step 7: Compare and verify -->
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 7</span>: Verify signature</div>
                        <div class="exchange-step-content">
                            <div class="ds-compare-label" data-bob-compare-label></div>
                            <div class="exchange-result" data-bob-verdict-result>
                                <div class="exchange-value-group" data-bob-verdict-group>
                                    <span class="exchange-var">Verdict</span> = <span class="exchange-value" data-bob-verdict>?</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div class="exchange-footer">
                <div class="exchange-controls">
                    <button class="exchange-btn exchange-btn-start">
                        <span class="btn-icon">▶</span>
                        <span class="btn-text">Start</span>
                    </button>
                    <button class="exchange-btn exchange-btn-reset">
                        <span class="btn-icon">↺</span>
                        <span class="btn-text">Reset</span>
                    </button>
                    <button class="exchange-btn exchange-btn-step">
                        <span class="btn-icon">→</span>
                        <span class="btn-text">Next</span>
                    </button>
                </div>
                <div class="exchange-status" aria-live="polite"></div>
            </div>
        `

        return wrapper
    }

    // -------------------------------------------------------------------------
    // Animation
    // -------------------------------------------------------------------------

    const CSS_CLASSES = window.ExchangeCore.CSS_CLASSES

    class DigitalSigAnimation extends window.ExchangeAnimation {
        constructor(el, filename, showTamper) {
            const timing = {
                BASE: 500,
                get REVEAL() { return this.BASE },
                get STEP() { return this.BASE + 200 },
                get ANIMATE() { return this.STEP + 300 },
                get BETWEEN_STEPS() { return this.ANIMATE + 350 }
            }
            super(el, { timing })

            this.filename = filename
            this.showTamper = showTamper

            this.originalContent = `Score: 85 / 100`
            this.tamperedContent  = `Score: 100 / 100`

            this.regenerateState()
        }

        getMaxSteps() {
            return 7
        }

        async executeStep(stepNumber) {
            switch (stepNumber) {
                case 1: await this.step1_setup(); break
                case 2: await this.step2_hashFile(); break
                case 3: await this.step3_signHash(); break
                case 4: await this.step4_sendFile(); break
                case 5: await this.step5_sendSig(); break
                case 6: await this.step6_bobProcess(); break
                case 7: await this.step7_verify(); break
            }
        }

        resetState() {
            this.regenerateState()
        }

        setupDOM() {
            const q = (s) => this.el.querySelector(s)

            this.dom = {
                alice: {
                    content:        q('[data-alice-content]'),
                    privateKey:     q('[data-alice-private]'),
                    publicKey:      q('[data-alice-public]'),
                    hash:           q('[data-alice-hash]'),
                    sig:            q('[data-alice-sig]'),
                    hashResult:     q('[data-alice-hash-result]'),
                    sigResult:      q('[data-alice-sig-result]')
                },
                arrows: {
                    content:        q('[data-arrow-content]'),
                    sig:            q('[data-arrow-sig]')
                },
                bob: {
                    publicKey:      q('[data-bob-public]'),
                    received:       q('[data-bob-received]'),
                    hash:           q('[data-bob-hash]'),
                    recovered:      q('[data-bob-recovered]'),
                    verdict:        q('[data-bob-verdict]'),
                    compareLabel:   q('[data-bob-compare-label]'),
                    verdictGroup:   q('[data-bob-verdict-group]'),
                    receivedResult: q('[data-bob-received-result]'),
                    hashResult:     q('[data-bob-hash-result]'),
                    recoveredResult:q('[data-bob-recovered-result]'),
                    verdictResult:  q('[data-bob-verdict-result]')
                },
                exchangeSteps: this.el.querySelectorAll('.exchange-column .exchange-step'),
                eveNote: q('.exchange-eve')
            }
        }

        resetUI() {
            this.resetElementsToDefault([
                '[data-alice-content]',
                '[data-alice-private]',
                '[data-alice-public]',
                '[data-alice-hash]',
                '[data-alice-sig]',
                '[data-arrow-content]',
                '[data-arrow-sig]',
                '[data-bob-public]',
                '[data-bob-received]',
                '[data-bob-hash]',
                '[data-bob-recovered]',
                '[data-bob-verdict]'
            ].join(', '))

            // Restore initial shown state
            this.el.querySelectorAll(
                '[data-alice-doc-result], [data-alice-keys-result], [data-bob-pubkey-result]'
            ).forEach(el => el.classList.add(CSS_CLASSES.SHOW))

            // Clear compare label
            if (this.dom.bob.compareLabel) this.dom.bob.compareLabel.textContent = ''

            // Reset verdict group class
            if (this.dom.bob.verdictGroup) {
                this.dom.bob.verdictGroup.className = 'exchange-value-group'
            }

            // Hide Eve note
            if (this.dom.eveNote) {
                this.dom.eveNote.classList.remove(CSS_CLASSES.SHOW, CSS_CLASSES.HIGHLIGHT)
            }
        }

        regenerateState() {
            this.privateKey       = formatHex(randomHex(8))
            this.publicKey        = formatHex(randomHex(8))
            this.receivedContent  = this.showTamper ? this.tamperedContent : this.originalContent
            this.aliceHash        = hashContent(this.originalContent)
            this.signature        = signHash(this.aliceHash, this.privateKey)
            this.bobComputedHash  = hashContent(this.receivedContent)
            this.bobRecoveredHash = this.aliceHash   // decrypting sig always yields original hash
            this.valid            = this.bobComputedHash === this.bobRecoveredHash
        }

        revealResult(resultEl, valueEl, value) {
            if (valueEl && value !== undefined) valueEl.textContent = value
            if (resultEl) {
                resultEl.classList.add(CSS_CLASSES.SHOW)
                resultEl.classList.add(CSS_CLASSES.PULSE)
            }
        }

        async animateArrow(stepEl, valueEl, value) {
            if (valueEl) valueEl.textContent = value
            const arrowEl = stepEl.querySelector('.exchange-arrow')
            arrowEl.classList.add(CSS_CLASSES.SHOW, CSS_CLASSES.PULSE, CSS_CLASSES.ANIMATE)
            await this.sleep(this.TIMING.ANIMATE)
        }

        // -------------------------------------------------------------------------
        // Steps
        // -------------------------------------------------------------------------

        async step1_setup() {
            this.setStatus('Alice has the document and her key pair. Bob already has Alice\'s public key.', 'info')

            const aliceStep    = this.dom.alice.content.closest('.exchange-step')
            const bobStep      = this.dom.bob.publicKey.closest('.exchange-step')
            this.activateStep(aliceStep)
            this.activateStep(bobStep)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            this.dom.alice.content.textContent    = this.originalContent
            this.dom.alice.privateKey.textContent = this.privateKey
            this.dom.alice.publicKey.textContent  = this.publicKey
            this.dom.bob.publicKey.textContent    = this.publicKey

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.completeStep(aliceStep)
            this.completeStep(bobStep)
        }

        async step2_hashFile() {
            this.setStatus('Alice runs the file through a hash function (SHA-256). Any change to the file produces a completely different hash.', 'info')

            const stepEl = this.dom.alice.hash.closest('.exchange-step')
            this.activateStep(stepEl)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            this.revealResult(this.dom.alice.hashResult, this.dom.alice.hash, this.aliceHash)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.completeStep(stepEl)
        }

        async step3_signHash() {
            this.setStatus('Alice encrypts the hash with her private key. This is the digital signature — only Alice could have created it.', 'info')

            const stepEl = this.dom.alice.sig.closest('.exchange-step')
            this.activateStep(stepEl)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            this.revealResult(this.dom.alice.sigResult, this.dom.alice.sig, this.signature)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.completeStep(stepEl)
        }

        async step4_sendFile() {
            this.setStatus('Alice sends the file to Bob. The signature travels separately.', 'info')

            const stepEl = this.dom.exchangeSteps[0]
            this.activateStep(stepEl)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            await this.animateArrow(stepEl, this.dom.arrows.content, this.originalContent)
            if (!this.isRunning) return

            this.completeStep(stepEl)
        }

        async step5_sendSig() {
            this.setStatus('Alice sends the signature. Bob now has both the file and the signature.', 'info')

            const stepEl = this.dom.exchangeSteps[1]
            this.activateStep(stepEl)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            await this.animateArrow(stepEl, this.dom.arrows.sig, this.signature)
            if (!this.isRunning) return

            if (this.showTamper && this.dom.eveNote) {
                this.dom.eveNote.classList.add(CSS_CLASSES.SHOW)
                this.dom.eveNote.classList.add(CSS_CLASSES.HIGHLIGHT)

                await this.sleep(this.TIMING.STEP)
                if (!this.isRunning) return
            }

            this.completeStep(stepEl)
        }

        async step6_bobProcess() {
            const tamperMsg = this.showTamper
                ? 'Bob hashes the (tampered) file he received. He also decrypts the signature using Alice\'s public key.'
                : 'Bob hashes the file he received. He also decrypts the signature using Alice\'s public key to recover the original hash.'
            this.setStatus(tamperMsg, 'info')

            const stepEl = this.dom.bob.received.closest('.exchange-step')
            this.activateStep(stepEl)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            // Show received content
            this.revealResult(this.dom.bob.receivedResult, this.dom.bob.received, this.receivedContent)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            // Show Bob's computed hash
            this.revealResult(this.dom.bob.hashResult, this.dom.bob.hash, this.bobComputedHash)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            // Show recovered hash from signature
            this.revealResult(this.dom.bob.recoveredResult, this.dom.bob.recovered, this.bobRecoveredHash)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.completeStep(stepEl)
        }

        async step7_verify() {
            const statusType = this.valid ? 'success' : 'warning'
            const statusMsg  = this.valid
                ? 'Hashes match! The file is authentic — it came from Alice and was not modified.'
                : 'Hashes do not match! The file was tampered with — Alice\'s signature is invalid for this content.'
            this.setStatus(statusMsg, statusType)

            const stepEl = this.dom.bob.verdict.closest('.exchange-step')
            this.activateStep(stepEl)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            // Show comparison label
            if (this.dom.bob.compareLabel) {
                this.dom.bob.compareLabel.textContent = this.valid
                    ? `hash' = ${this.bobComputedHash}`
                    : `hash' ≠ ${this.bobComputedHash}`
                this.dom.bob.compareLabel.className = `ds-compare-label ${this.valid ? 'ds-compare-match' : 'ds-compare-mismatch'}`
            }

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            // Verdict
            const verdictGroup = this.dom.bob.verdictGroup
            if (verdictGroup) {
                verdictGroup.className = this.valid
                    ? 'exchange-value-group exchange-value-success'
                    : 'exchange-value-group ds-value-invalid'
            }

            const verdict = this.valid ? '✅ Signature valid' : '⛔ Signature invalid'
            this.revealResult(this.dom.bob.verdictResult, this.dom.bob.verdict, verdict)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.completeStep(stepEl)
        }
    }

    // -------------------------------------------------------------------------
    // Plugin entry point
    // -------------------------------------------------------------------------

    function processPlugin() {
        document.querySelectorAll('.markdown-section digital-sig').forEach(el => {
            const filename    = el.getAttribute('file') || 'report.pdf'
            const showTamper  = el.hasAttribute('tamper')

            el.innerHTML = ''
            el.appendChild(buildUI(filename, showTamper))
            new DigitalSigAnimation(el, filename, showTamper)
        })
    }

    const docsifyPlugin = function (hook) {
        hook.doneEach(processPlugin)
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyPlugin, window.$docsify.plugins || [])
})()
