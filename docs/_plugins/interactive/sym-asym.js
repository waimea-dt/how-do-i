/**
 * docsify-sym-asym.js — Interactive Symmetric vs Asymmetric Encryption Comparison
 *
 * Helps students understand:
 *   - The difference between symmetric and asymmetric encryption
 *   - Key distribution challenges in symmetric encryption
 *   - How public/private key pairs work in asymmetric encryption
 *   - What an eavesdropper can and cannot see in each method
 *   - Performance trade-offs between the two approaches
 *
 * Usage in markdown:
 *   <sym-asym></sym-asym>
 *   <sym-asym mode="symmetric"></sym-asym>
 *   <sym-asym mode="asymmetric"></sym-asym>
 *   <sym-asym message="Secret plans!"></sym-asym>
 *   <sym-asym intercept></sym-asym>
 *   <sym-asym intercept intercept-key></sym-asym>
 *
 * Attributes:
 *   - mode: 'symmetric' or 'asymmetric' (default: 'symmetric')
 *   - message: The message to encrypt (default: "Hello, Bob!")
 *   - intercept: Show Eve intercepting the message (optional)
 *   - intercept-key: Show Eve intercepting the key as well (requires intercept, optional)
 *
 * Animation sequence (Symmetric):
 *   1. Bob decides secret key
 *   2. Bob sends key to Alice (Eve intercepts!)
 *   3. Alice encrypts message
 *   4. Alice sends ciphertext to Bob
 *   5. Bob decrypts
 *
 * Animation sequence (Asymmetric):
 *   1. Bob generates public/private key pair
 *   2. Bob sends public key to Alice
 *   3. Alice encrypts message
 *   4. Alice sends ciphertext to Bob
 *   5. Bob decrypts
 */

;(function () {

    // -------------------------------------------------------------------------
    // Configuration
    // -------------------------------------------------------------------------

    const KEY_LEN = 8

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    /**
     * Simple visual "encryption" by converting to hex and mixing with key
     * Not real encryption - just for visualization
     */
    function visualEncrypt(message, key) {
        const combined = message + key

        // Generate multiple hash values to create a longer ciphertext
        let result = ''
        for (let offset = 0; offset < 4; offset++) {
            let hash = offset * 0x9e3779b9 // Add offset to seed
            for (let i = 0; i < combined.length; i++) {
                const char = combined.charCodeAt(i)
                hash = ((hash << 5) - hash) + char + offset * i
                hash = hash | 0 // Convert to 32-bit integer
            }
            // Convert to hex and take last 4 characters
            result += Math.abs(hash).toString(16).toUpperCase().padStart(8, '0').slice(-8)
        }
        return '<span>' + result.match(/.{1,4}/g).join('</span><span>') + '</span>'
    }

    /**
     * Generate a random key string
     */
    function generateKey(length = KEY_LEN) {
        const chars = 'ABCDEF0123456789'
        let result = ''
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return result
    }

    // -------------------------------------------------------------------------
    // HTML UI Builder
    // -------------------------------------------------------------------------

    function buildUI(mode, message, showIntercept, showInterceptKey) {
        const wrapper = document.createElement('div')
        wrapper.className = 'exchange-wrapper'

        const isSymmetric = mode === 'symmetric'
        const titleText = isSymmetric ? 'Symmetric Encryption (AES)' : 'Asymmetric Encryption (RSA)'
        const subtitleText = isSymmetric
            ? (showIntercept && showInterceptKey ? 'Watch the key distribution problem: Eve intercepts the shared key!' : showIntercept ? 'Eve can intercept the ciphertext but not the key' : 'Uses a shared secret key for encryption and decryption')
            : 'Public key can be shared openly - only private key decrypts'

        wrapper.innerHTML = `
            <div class="exchange-header">
                <div class="exchange-header-content">
                    <div class="exchange-title">${titleText}</div>
                    <div class="exchange-subtitle">${subtitleText}</div>
                </div>
                <div class="sa-mode-info">
                    <div class="sa-mode-label">Message</div>
                    <div class="sa-mode-message">"${message}"</div>
                </div>
            </div>

            <div class="exchange-grid">

                <!-- Alice's Side -->
                <div class="exchange-party exchange-party1">
                    <div class="exchange-party-header">
                        <div class="exchange-party-name">👩 Alice</div>
                    </div>

                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 1</span>: Alice needs a key to communicate securely with Bob</div>
                        <div class="exchange-step-content">
                        </div>
                    </div>

                    ${isSymmetric ? `
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 4</span>: Receive shared key</div>
                        <div class="exchange-step-content">
                            <div class="exchange-received">
                                <div class="exchange-value-group exchange-value-party2">
                                    <span class="exchange-var">key</span> = <span class="exchange-value" data-alice-key>?</span>
                                </div>
                                <span class="exchange-badge exchange-shared-badge">Shared</span>
                            </div>
                        </div>
                    </div>
                    ` : `
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 4</span>: Receive Bob's public key</div>
                        <div class="exchange-step-content">
                            <div class="exchange-received">
                                <div class="exchange-value-group exchange-value-party2">
                                    <span class="exchange-var">pub</span> = <span class="exchange-value" data-alice-key>?</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    `}
                </div>

                <!-- Exchange (middle column) -->
                <div class="exchange-column">
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 3</span>: Share key <span class="exchange-badge exchange-public-badge">Public</span></div>
                        <div class="exchange-arrow-grid">
                            <div class="exchange-arrow-group">
                                <div class="exchange-arrow exchange-arrow-left">
                                    <div class="exchange-value-group ${isSymmetric ? 'exchange-value-party2' : 'exchange-value-party2'}">
                                        <span class="exchange-var">${isSymmetric ? 'key' : 'pub'}</span> = <span class="exchange-value" data-arrow-key>?</span>
                                    </div>
                                    <span class="exchange-arrow-icon">←</span>
                                </div>
                            </div>
                            ${isSymmetric && showIntercept && showInterceptKey ? `
                            <div class="exchange-eve">
                                <div class="exchange-eve-icon">👁️ Eve</div>
                                <div class="exchange-eve-text">Eve intercepts the key!</div>
                                <div class="exchange-eve-warning">⚠️ Key distribution problem</div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>

                <!-- Bob's Side -->
                <div class="exchange-party exchange-party2">
                    <div class="exchange-party-header">
                        <div class="exchange-party-name">👨 Bob</div>
                    </div>

                    ${isSymmetric ? `
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 2</span>: Decide secret key</div>
                        <div class="exchange-step-content">
                            <div class="exchange-result exchange-show">
                                <div class="exchange-value-group exchange-value-party2">
                                    <span class="exchange-var">key</span> = <span class="exchange-value" data-bob-key>?</span>
                                </div>
                                <span class="exchange-badge exchange-shared-badge">Shared</span>
                            </div>
                        </div>
                    </div>
                    ` : `
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 2</span>: Generate key pair</div>
                        <div class="exchange-step-content">
                            <div class="sa-keypair">
                                <div class="exchange-result exchange-show">
                                    <div class="exchange-value-group exchange-value-party2">
                                        <span class="exchange-var">pub</span> = <span class="exchange-value" data-bob-public>?</span>
                                    </div>
                                    <span class="exchange-badge exchange-public-badge">Public Key</span>
                                </div>
                                <div class="exchange-result exchange-show">
                                    <div class="exchange-value-group exchange-value-party2">
                                        <span class="exchange-var">priv</span> = <span class="exchange-value" data-bob-private>?</span>
                                    </div>
                                    <span class="exchange-badge exchange-secret-badge">Private Key</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    `}
                </div>

            </div>

            <div class="exchange-grid">

                <!-- Alice's Side -->
                <div class="exchange-party exchange-party1">
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 5</span>: Alice has a message for Bob</div>
                        <div class="exchange-step-content">
                            <div class="exchange-result exchange-show">
                                <div class="exchange-value-group exchange-value-party1">
                                    <span class="exchange-var">p</span> = <span class="exchange-value sa-message" data-alice-message>?</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 6</span>: Encrypt message</div>
                        <div class="exchange-step-content">
                            <div class="sa-operation">
                                <div class="sa-operation-formula">
                                    ${isSymmetric
                                        ? '<span class="exchange-var">C</span> = <span class="sa-func">AES_encrypt</span>(<span class="exchange-var sa-var-party1">p</span>, <span class="exchange-var sa-var-party2">key</span>)'
                                        : '<span class="exchange-var">C</span> = <span class="sa-func">RSA_encrypt</span>(<span class="exchange-var sa-var-party1">p</span>, <span class="exchange-var sa-var-party2">pub</span>)'}
                                </div>
                            </div>
                            <div class="exchange-result" data-alice-result>
                                <div class="exchange-value-group exchange-value-party1">
                                    <span class="exchange-var">C</span> = <span class="exchange-value sa-ciphertext" data-alice-ciphertext>?</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Exchange (middle column) -->
                <div class="exchange-column">
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 7</span>: Send cipher <span class="exchange-badge exchange-public-badge">Public</span></div>
                        <div class="exchange-arrow-grid">
                            <div class="exchange-arrow-group">
                                <div class="exchange-arrow exchange-arrow-right">
                                    <div class="exchange-value-group exchange-value-party1">
                                        <span class="exchange-var">C</span> = <span class="exchange-value sa-ciphertext" data-arrow-cipher>?</span>
                                    </div>
                                    <span class="exchange-arrow-icon">→</span>
                                </div>
                            </div>
                            ${showIntercept ? `
                                <div class="exchange-eve">
                                    <div class="exchange-eve-icon">👁️ Eve</div>
                                    <div class="exchange-eve-text">
                                        Eve intercepts the encrypted message!
                                    </div>
                                    <div class="exchange-eve-text">
                                        ${isSymmetric ? (
                                            showInterceptKey ? `
                                                😡 Oh no! Eve now has the message and the key, so she can decrypt the message!
                                                <span class="sa-operation">
                                                    <span class="sa-operation-formula">
                                                        <span class="exchange-var">p</span> = <span class="sa-func">AES_decrypt</span>(<span class="exchange-var sa-var-party1">C</span>,<span class="exchange-var sa-var-party2">key</span>)
                                                    </span>
                                                </span>
                                                <span class="exchange-value-group exchange-value-party1">
                                                    <span class="exchange-var">p</span>=<span class="exchange-value">"${message}"</span>
                                                </span>
                                            ` : '🔒 Eve cannot decrypt the message without the key'
                                        ) : (
                                            showInterceptKey ?
                                                '🔒 Even with the public key, Eve cannot decrypt the message! Only the private key works!'
                                                : '🔒 Eve cannot decrypt the message without the private key!'
                                        )}
                                    </div>
                                </div>`
                            : ''}
                        </div>
                    </div>
                </div>

                <!-- Bob's Side -->
                <div class="exchange-party exchange-party2">
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 8</span>: Receive ciphertext</div>
                        <div class="exchange-step-content">
                            <div class="exchange-received">
                                <div class="exchange-value-group exchange-value-party1">
                                    <span class="exchange-var">C</span> = <span class="exchange-value sa-ciphertext" data-bob-received>?</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 9</span>: Decrypt message</div>
                        <div class="exchange-step-content">
                            <div class="sa-operation">
                                <div class="sa-operation-formula">
                                    ${isSymmetric
                                        ? '<span class="exchange-var">p</span> = <span class="sa-func">AES_decrypt</span>(<span class="exchange-var sa-var-party1">C</span>, <span class="exchange-var sa-var-party2">key</span>)'
                                        : '<span class="exchange-var">p</span> = <span class="sa-func">RSA_decrypt</span>(<span class="exchange-var sa-var-party1">C</span>, <span class="exchange-var sa-var-party2">priv</span>)'}
                                </div>
                            </div>
                            <div class="exchange-result sa-result-final" data-bob-result>
                                <div class="exchange-value-group exchange-value-success">
                                    <span class="exchange-var">p</span> = <span class="exchange-value" data-bob-message>?</span>
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
    // Animation Controller
    // -------------------------------------------------------------------------

    // Use CSS classes from core
    const CSS_CLASSES = window.ExchangeCore.CSS_CLASSES

    class SymAsymAnimation extends window.ExchangeAnimation {
        constructor(el, mode, message, showIntercept, showInterceptKey) {
            // Animation timing configuration
            const timing = {
                BASE: 500,
                get REVEAL() { return this.BASE },
                get STEP() { return this.BASE + 200 },
                get ANIMATE() { return this.STEP + 400 },
                get BETWEEN_STEPS() { return this.ANIMATE + 400 }
            }

            super(el, { timing })

            this.mode = mode
            this.message = message
            this.showIntercept = showIntercept
            this.showInterceptKey = showInterceptKey

            // Generate initial keys
            this.regenerateKeys()
        }

        // -------------------------------------------------------------------------
        // Base Class Implementation
        // -------------------------------------------------------------------------

        getMaxSteps() {
            return 9
        }

        async executeStep(stepNumber) {
            switch (stepNumber) {
                case 1: await this.step1_AliceNeedsKey(); break
                case 2: await this.step2_GenerateKeys(); break
                case 3: await this.step3_SendKey(); break
                case 4: await this.step4_AliceReceivesKey(); break
                case 5: await this.step5_ShowMessage(); break
                case 6: await this.step6_AliceEncrypts(); break
                case 7: await this.step7_SendCiphertext(); break
                case 8: await this.step8_BobReceives(); break
                case 9: await this.step9_BobDecrypts(); break
            }
        }

        resetState() {
            this.regenerateKeys()
        }

        setupDOM() {
            // Cache frequently accessed DOM elements
            this.dom = {
                alice: {
                    plaintext: this.el.querySelector('[data-alice-message]'),
                    key: this.el.querySelector('[data-alice-key]'),
                    ciphertext: this.el.querySelector('[data-alice-ciphertext]'),
                    result: this.el.querySelector('[data-alice-result]')
                },
                bob: {
                    key: this.el.querySelector('[data-bob-key]'),
                    publicKey: this.el.querySelector('[data-bob-public]'),
                    privateKey: this.el.querySelector('[data-bob-private]'),
                    received: this.el.querySelector('[data-bob-received]'),
                    message: this.el.querySelector('[data-bob-message]'),
                    result: this.el.querySelector('[data-bob-result]')
                },
                arrows: {
                    key: this.el.querySelector('[data-arrow-key]'),
                    cipher: this.el.querySelector('[data-arrow-cipher]'),
                    left: this.el.querySelector('.exchange-arrow-left'),
                    right: this.el.querySelector('.exchange-arrow-right')
                },
                exchange: {
                    eveIntercept: this.el.querySelectorAll('.exchange-column .exchange-step')[0]?.querySelector('.exchange-eve'),
                    eveNote: this.el.querySelectorAll('.exchange-column .exchange-step')[1]?.querySelector('.exchange-eve')
                }
            }
        }

        resetUI() {
            // Reset all displayed values to '?'
            this.resetElementsToDefault('[data-alice-message], [data-alice-key], [data-alice-ciphertext], [data-bob-key], [data-bob-public], [data-bob-private], [data-bob-received], [data-bob-message], [data-arrow-key], [data-arrow-cipher]')

            // Restore initial "show" state for step 1 (Alice's message) and step 2 (Bob's keys)
            const aliceMsgResult = this.dom.alice.plaintext.closest('.exchange-result')
            if (aliceMsgResult) {
                aliceMsgResult.classList.add(CSS_CLASSES.SHOW)
            }

            const bobKeyResults = this.mode === 'symmetric'
                ? [this.dom.bob.key.closest('.exchange-result')]
                : [this.dom.bob.publicKey.closest('.exchange-result'), this.dom.bob.privateKey.closest('.exchange-result')]
            bobKeyResults.forEach(result => {
                if (result) result.classList.add(CSS_CLASSES.SHOW)
            })
        }

        // -------------------------------------------------------------------------
        // Helper Methods
        // -------------------------------------------------------------------------

        /**
         * Convenience property to check if in symmetric mode
         * @returns {boolean}
         */
        get isSymmetric() {
            return this.mode === 'symmetric'
        }

        regenerateKeys() {
            if (this.isSymmetric) {
                this.sharedKey = generateKey(KEY_LEN)
                this.encrypted = visualEncrypt(this.message, this.sharedKey)
            } else {
                this.publicKey = generateKey(KEY_LEN) + '-PUB'
                this.privateKey = generateKey(KEY_LEN) + '-PRV'
                this.encrypted = visualEncrypt(this.message, this.publicKey)
            }
        }

        // -------------------------------------------------------------------------
        // Step Implementations
        // -------------------------------------------------------------------------

        // Step 1: Alice needs a key
        async step1_AliceNeedsKey() {
            this.setStatus('Alice needs a key to communicate securely with Bob', 'info')

            const steps = this.el.querySelectorAll('.exchange-party1 .exchange-step')
            const stepEl = steps[0]
            this.activateStep(stepEl)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return
            this.completeStep(stepEl)
        }

        // Step 2: Bob generates key(s)
        async step2_GenerateKeys() {
            this.setStatus(this.isSymmetric ? 'Bob decides on a secret key' : 'Bob generates a public/private key pair', 'info')

            const stepEl = this.isSymmetric ? this.dom.bob.key.closest('.exchange-step') : this.dom.bob.publicKey.closest('.exchange-step')
            this.activateStep(stepEl)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            if (this.isSymmetric) {
                this.dom.bob.key.textContent = this.sharedKey
                const bobKeyResult = this.dom.bob.key.closest('.exchange-result')
                bobKeyResult.classList.add(CSS_CLASSES.PULSE)
            } else {
                this.dom.bob.publicKey.textContent = this.publicKey
                const bobPublicResult = this.dom.bob.publicKey.closest('.exchange-result')
                bobPublicResult.classList.add(CSS_CLASSES.PULSE)
                await this.sleep(this.TIMING.STEP)
                if (!this.isRunning) return
                this.dom.bob.privateKey.textContent = this.privateKey
                const bobPrivateResult = this.dom.bob.privateKey.closest('.exchange-result')
                bobPrivateResult.classList.add(CSS_CLASSES.PULSE)
            }

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return
            this.completeStep(stepEl)
        }

        // Step 3: Bob sends key to Alice
        async step3_SendKey() {
            this.setStatus(this.isSymmetric ? (this.showIntercept && this.showInterceptKey ? 'Bob sends secret key to Alice (Eve is watching!)' : 'Bob sends secret key to Alice') : 'Bob sends public key to Alice', this.isSymmetric && this.showIntercept && this.showInterceptKey ? 'warning' : 'info')

            const exchangeSteps = this.el.querySelectorAll('.exchange-column .exchange-step')
            const exchangeStepEl = exchangeSteps[0]
            this.activateStep(exchangeStepEl)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            // Show key on arrow
            this.dom.arrows.key.textContent = this.isSymmetric ? this.sharedKey : this.publicKey
            this.dom.arrows.left.classList.add(CSS_CLASSES.SHOW, CSS_CLASSES.PULSE)
            this.dom.arrows.left.classList.add(CSS_CLASSES.ANIMATE)

            await this.sleep(this.TIMING.ANIMATE)
            if (!this.isRunning) return

            this.completeStep(exchangeStepEl)
        }

        // Step 4: Alice receives key
        async step4_AliceReceivesKey() {
            this.setStatus(this.isSymmetric ? 'Alice receives the shared key' : 'Alice receives Bob\'s public key', 'info')

            this.dom.alice.key.textContent = this.isSymmetric ? this.sharedKey : this.publicKey
            const aliceStepEl = this.dom.alice.key.closest('.exchange-step')
            this.activateStep(aliceStepEl)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            const aliceReceivedContainer = aliceStepEl.querySelector('.exchange-received')
            aliceReceivedContainer.classList.add(CSS_CLASSES.PULSE)
            aliceReceivedContainer.classList.add(CSS_CLASSES.SHOW)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            // Show Eve intercept for symmetric (if both intercept and intercept-key enabled)
            if (this.isSymmetric && this.showIntercept && this.showInterceptKey && this.dom.exchange.eveIntercept) {
                await this.sleep(this.TIMING.STEP)
                if (!this.isRunning) return
                this.dom.exchange.eveIntercept.classList.add(CSS_CLASSES.SHOW)
                this.dom.exchange.eveIntercept.classList.add(CSS_CLASSES.HIGHLIGHT)
            }

            this.completeStep(aliceStepEl)
        }

        // Step 5: Show Alice's message
        async step5_ShowMessage() {
            this.setStatus(`Alice has a message for Bob: "${this.message}"`, 'info')

            const stepEl = this.dom.alice.plaintext.closest('.exchange-step')
            this.activateStep(stepEl)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            this.dom.alice.plaintext.textContent = `"${this.message}"`
            const aliceMsgResult = this.dom.alice.plaintext.closest('.exchange-result')
            aliceMsgResult.classList.add(CSS_CLASSES.PULSE)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return
            this.completeStep(stepEl)
        }

        // Step 6: Alice encrypts
        async step6_AliceEncrypts() {
            this.setStatus(`Alice encrypts "${this.message}" with ${this.isSymmetric ? 'shared key' : "Bob's public key"}`, 'info')

            const stepEl = this.dom.alice.ciphertext.closest('.exchange-step')
            this.activateStep(stepEl)

            await this.sleep(this.TIMING.ANIMATE)
            this.dom.alice.ciphertext.innerHTML = this.encrypted
            this.dom.alice.result.classList.add(CSS_CLASSES.PULSE)
            this.dom.alice.result.classList.add(CSS_CLASSES.SHOW)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.completeStep(stepEl)
        }

        // Step 7: Send ciphertext
        async step7_SendCiphertext() {
            this.setStatus('Alice sends encrypted message to Bob', 'info')

            const exchangeSteps = this.el.querySelectorAll('.exchange-column .exchange-step')
            const exchangeStepEl = exchangeSteps[1]
            this.activateStep(exchangeStepEl)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            // Show ciphertext on arrow
            this.dom.arrows.cipher.innerHTML = this.encrypted
            this.dom.arrows.right.classList.add(CSS_CLASSES.SHOW, CSS_CLASSES.PULSE)
            this.dom.arrows.right.classList.add(CSS_CLASSES.ANIMATE)

            await this.sleep(this.TIMING.ANIMATE)
            if (!this.isRunning) return

            this.completeStep(exchangeStepEl)
        }

        // Step 8: Bob receives ciphertext
        async step8_BobReceives() {
            this.setStatus('Bob receives the encrypted message', 'info')

            this.dom.bob.received.innerHTML = this.encrypted
            const bobStepEl = this.dom.bob.received.closest('.exchange-step')
            this.activateStep(bobStepEl)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            const bobReceivedContainer = bobStepEl.querySelector('.exchange-received')
            bobReceivedContainer.classList.add(CSS_CLASSES.PULSE)
            bobReceivedContainer.classList.add(CSS_CLASSES.SHOW)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            // Show Eve note (if enabled)
            if (this.showIntercept && this.dom.exchange.eveNote) {
                await this.sleep(this.TIMING.STEP)
                if (!this.isRunning) return
                this.dom.exchange.eveNote.classList.add(CSS_CLASSES.SHOW)
            }

            this.completeStep(bobStepEl)
        }

        // Step 9: Bob decrypts
        async step9_BobDecrypts() {
            this.setStatus(`Bob decrypts with ${this.isSymmetric ? 'shared key' : 'private key'}`, 'info')

            const stepEl = this.dom.bob.message.closest('.exchange-step')
            this.activateStep(stepEl)

            await this.sleep(this.TIMING.ANIMATE)
            if (!this.isRunning) return

            this.dom.bob.message.textContent = `"${this.message}"`
            this.dom.bob.result.classList.add(CSS_CLASSES.PULSE)
            this.dom.bob.result.classList.add(CSS_CLASSES.SHOW)
            this.dom.bob.result.classList.add(CSS_CLASSES.HIGHLIGHT)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.completeStep(stepEl)

            // Final status
            if (this.isSymmetric) {
                if (this.showIntercept && this.showInterceptKey) {
                    this.setStatus('⚠️ Success, but Eve intercepted the key! This is the key distribution problem!', 'warning')
                } else if (this.showIntercept) {
                    this.setStatus('✨ Message successfully encrypted and decrypted! Eve saw the ciphertext but not the key.', 'success')
                } else {
                    this.setStatus('✨ Message successfully encrypted and decrypted!', 'success')
                }
            } else {
                this.setStatus('✨ Success! Secure communication without pre-shared secrets!', 'success')
            }
        }
    }

    // -------------------------------------------------------------------------
    // Plugin entry point
    // -------------------------------------------------------------------------

    function processSymAsym() {
        document.querySelectorAll('.markdown-section sym-asym').forEach(el => {
            const mode = el.getAttribute('mode') || 'symmetric'
            const message = el.getAttribute('message') || 'Hello, Bob!'
            const showIntercept = el.hasAttribute('intercept')
            const showInterceptKey = el.hasAttribute('intercept-key')

            if (mode !== 'symmetric' && mode !== 'asymmetric') {
                el.innerHTML = '<div class="sa-error">Error: mode must be "symmetric" or "asymmetric"</div>'
                return
            }

            el.innerHTML = ''
            el.appendChild(buildUI(mode, message, showIntercept, showInterceptKey))

            new SymAsymAnimation(el, mode, message, showIntercept, showInterceptKey)
        })
    }

    const docsifySymAsym = function (hook) {
        hook.doneEach(processSymAsym)
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifySymAsym, window.$docsify.plugins || [])

})()
