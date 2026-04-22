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
        return result.match(/.{1,4}/g).join(' ')
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
                        <div class="exchange-step-label">Step 1: Alice has a message</div>
                        <div class="exchange-step-content">
                            <div class="exchange-result exchange-show">
                                <div class="exchange-value-group">
                                    <span class="exchange-var">p</span> = <span class="exchange-value sa-message" data-alice-message>?</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    ${isSymmetric ? `
                    <div class="exchange-step">
                        <div class="exchange-step-label">Step 3: Receive shared key</div>
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
                        <div class="exchange-step-label">Step 3: Receive Bob's public key</div>
                        <div class="exchange-step-content">
                            <div class="exchange-received">
                                <div class="exchange-value-group exchange-value-party2">
                                    <span class="exchange-var">pub</span> = <span class="exchange-value" data-alice-key>?</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    `}

                    <div class="exchange-step">
                        <div class="exchange-step-label">Step 4: Encrypt message</div>
                        <div class="exchange-step-content">
                            <div class="sa-operation">
                                <div class="sa-operation-formula">
                                    ${isSymmetric
                                        ? '<span class="exchange-var">C</span> = <span class="sa-func">AES_encrypt</span>(<span class="exchange-var">p</span>, <span class="exchange-var">key</span>)'
                                        : '<span class="exchange-var">C</span> = <span class="sa-func">RSA_encrypt</span>(<span class="exchange-var">p</span>, <span class="exchange-var">pub_key</span>)'}
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
                    <div class="exchange-column-step">
                        <div class="exchange-column-label">Step 2: Send key in <span class="exchange-badge exchange-public-badge">Public</span></div>
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
                                <div class="exchange-eve-icon">👁️ Eve intercepts!</div>
                                <div class="exchange-eve-text">Eve can see the secret key!</div>
                                <div class="exchange-eve-warning">⚠️ Key distribution problem</div>
                            </div>
                            ` : ''}
                        </div>
                    </div>

                    <div class="exchange-column-step">
                        <div class="exchange-column-label">Step 5: Send cypher in <span class="exchange-badge exchange-public-badge">Public</span></div>
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
                                <div class="exchange-eve-icon">👁️ Eve (eavesdropper)</div>
                                <div class="exchange-eve-text">Can see: <span class="exchange-var">C</span> (ciphertext)${isSymmetric ? (showInterceptKey ? ', <span class="exchange-var">key</span>' : '') : ', <span class="exchange-var">pub_key</span>'}</div>
                                <div class="exchange-eve-text">Cannot see: ${isSymmetric ? (showInterceptKey ? 'Nothing! Eve has everything!' : 'Original message, <span class="exchange-var">key</span>') : 'Original message, <span class="exchange-var">priv_key</span>'}</div>
                                <div class="exchange-eve-problem">${isSymmetric
                                    ? (showInterceptKey ? '😡 Eve saw the key! She can decrypt the message! This is the key distribution problem!' : '🔒 Eve cannot decrypt without the key')
                                    : (showInterceptKey ? '🚫 Even with the public key, Eve cannot decrypt! Only <span class="exchange-var">priv_key</span> works!' : '🚫 Eve cannot decrypt without the private key!')}</div>
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
                        <div class="exchange-step-label">Step 2: Decide secret key</div>
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
                        <div class="exchange-step-label">Step 2: Generate key pair</div>
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

                    <div class="exchange-step">
                        <div class="exchange-step-label">Step 5: Receive ciphertext</div>
                        <div class="exchange-step-content">
                            <div class="exchange-received">
                                <div class="exchange-value-group exchange-value-party1">
                                    <span class="exchange-var">C</span> = <span class="exchange-value sa-ciphertext" data-bob-received>?</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="exchange-step">
                        <div class="exchange-step-label">Step 6: Decrypt message</div>
                        <div class="exchange-step-content">
                            <div class="sa-operation">
                                <div class="sa-operation-formula">
                                    ${isSymmetric
                                        ? '<span class="exchange-var">p</span> = <span class="sa-func">AES_decrypt</span>(<span class="exchange-var">C</span>, <span class="exchange-var">key</span>)'
                                        : '<span class="exchange-var">p</span> = <span class="sa-func">RSA_decrypt</span>(<span class="exchange-var">C</span>, <span class="exchange-var">priv</span>)'}
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

    const CSS_CLASSES = {
        ACTIVE: 'exchange-active',
        COMPLETED: 'exchange-completed',
        HIGHLIGHT: 'exchange-highlight',
        ANIMATING: 'exchange-animating',
        SHOW: 'exchange-show',
        PULSE: 'exchange-pulse'
    }

    class SymAsymAnimation {
        constructor(el, mode, message, showIntercept, showInterceptKey) {
            this.el = el
            this.mode = mode
            this.message = message
            this.showIntercept = showIntercept
            this.showInterceptKey = showInterceptKey
            this.currentStep = 0
            this.isRunning = false

            // Animation timing (matching DH plugin)
            this.TIMING = {
                BASE: 500,
                get REVEAL() { return this.BASE },
                get STEP() { return this.BASE + 200 },
                get ANIMATE() { return this.STEP + 400 },
                get BETWEEN_STEPS() { return this.ANIMATE + 400 }
            }

            const isSymmetric = mode === 'symmetric'

            // Generate keys
            if (isSymmetric) {
                this.sharedKey = generateKey(KEY_LEN)
                this.encrypted = visualEncrypt(message, this.sharedKey)
            } else {
                this.publicKey = generateKey(KEY_LEN) + '-PUB'
                this.privateKey = generateKey(KEY_LEN) + '-PRV'
                this.encrypted = visualEncrypt(message, this.publicKey)
            }

            // Get DOM elements (cached for performance)
            this.statusEl = el.querySelector('.exchange-status')
            this.startBtn = el.querySelector('.exchange-btn-start')
            this.resetBtn = el.querySelector('.exchange-btn-reset')
            this.stepBtn = el.querySelector('.exchange-btn-step')

            // Cache frequently accessed DOM elements
            this.dom = {
                alice: {
                    plaintext: el.querySelector('[data-alice-message]'),
                    key: el.querySelector('[data-alice-key]'),
                    ciphertext: el.querySelector('[data-alice-ciphertext]'),
                    result: el.querySelector('[data-alice-result]')
                },
                bob: {
                    key: el.querySelector('[data-bob-key]'),
                    publicKey: el.querySelector('[data-bob-public]'),
                    privateKey: el.querySelector('[data-bob-private]'),
                    received: el.querySelector('[data-bob-received]'),
                    message: el.querySelector('[data-bob-message]'),
                    result: el.querySelector('[data-bob-result]')
                },
                arrows: {
                    key: el.querySelector('[data-arrow-key]'),
                    cipher: el.querySelector('[data-arrow-cipher]'),
                    left: el.querySelector('.exchange-arrow-left'),
                    right: el.querySelector('.exchange-arrow-right')
                },
                exchange: {
                    eveIntercept: el.querySelectorAll('.exchange-column-step')[0]?.querySelector('.exchange-eve'),
                    eveNote: el.querySelectorAll('.exchange-column-step')[1]?.querySelector('.exchange-eve')
                }
            }

            // Bind events
            this.startBtn.addEventListener('click', () => this.start())
            this.resetBtn.addEventListener('click', () => this.reset())
            this.stepBtn.addEventListener('click', () => this.nextStep())

            this.updateControls()
        }

        updateControls() {
            this.startBtn.disabled = this.isRunning
            this.resetBtn.disabled = !this.isRunning && this.currentStep === 0
            this.stepBtn.disabled = this.isRunning || this.currentStep >= 6
        }

        setStatus(msg, type = '') {
            this.statusEl.textContent = msg
            this.statusEl.className = `exchange-status ${type ? 'exchange-status-' + type : ''}`
        }

        // Helper: Activate a step (add active class)
        activateStep(stepEl) {
            if (stepEl) stepEl.classList.add(CSS_CLASSES.ACTIVE)
        }

        // Helper: Complete a step (remove active, add completed)
        completeStep(stepEl) {
            if (stepEl) {
                stepEl.classList.remove(CSS_CLASSES.ACTIVE)
                stepEl.classList.add(CSS_CLASSES.COMPLETED)
            }
        }

        // Helper: Reset multiple elements to a default value
        resetElementsToDefault(selector, defaultValue = '?') {
            this.el.querySelectorAll(selector).forEach(el => {
                el.textContent = defaultValue
            })
        }

        async start() {
            if (this.isRunning) return

            if (this.currentStep >= 6) {
                this.reset()
            }

            this.isRunning = true
            this.updateControls()

            while (this.currentStep < 6 && this.isRunning) {
                await this.nextStep()
                if (!this.isRunning) break
                await this.sleep(this.TIMING.BETWEEN_STEPS)
            }

            this.isRunning = false
            this.updateControls()
        }

        async nextStep() {
            if (this.currentStep >= 6) return

            const isManualStep = !this.isRunning
            if (isManualStep) {
                this.isRunning = true
                this.updateControls()
            }

            this.currentStep++

            switch (this.currentStep) {
                case 1: await this.step1_ShowMessage(); break
                case 2: await this.step2_GenerateKeys(); break
                case 3: await this.step3_SendKey(); break
                case 4: await this.step4_AliceEncrypts(); break
                case 5: await this.step5_SendCiphertext(); break
                case 6: await this.step6_BobDecrypts(); break
            }

            if (isManualStep) {
                this.isRunning = false
            }
            this.updateControls()
        }

        // Step 1: Show Alice's plaintext message
        async step1_ShowMessage() {
            this.setStatus(`Alice has a message for Bob: "${this.message}"`, 'info')

            const stepEl = this.dom.alice.plaintext.closest('.exchange-step')
            this.activateStep(stepEl)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            this.dom.alice.plaintext.textContent = `"${this.message}"`
            const aliceMsgResult = this.dom.alice.plaintext.closest('.exchange-result')
            aliceMsgResult.classList.add(CSS_CLASSES.PULSE)
            setTimeout(() => aliceMsgResult.classList.remove(CSS_CLASSES.PULSE), 350)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return
            this.completeStep(stepEl)
        }

        // Step 2: Bob generates key(s)
        async step2_GenerateKeys() {
            const isSymmetric = this.mode === 'symmetric'
            this.setStatus(isSymmetric ? 'Bob decides on a secret key' : 'Bob generates a public/private key pair', 'info')

            const stepEl = isSymmetric ? this.dom.bob.key.closest('.exchange-step') : this.dom.bob.publicKey.closest('.exchange-step')
            this.activateStep(stepEl)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            if (isSymmetric) {
                this.dom.bob.key.textContent = this.sharedKey
                const bobKeyResult = this.dom.bob.key.closest('.exchange-result')
                bobKeyResult.classList.add(CSS_CLASSES.PULSE)
                setTimeout(() => bobKeyResult.classList.remove(CSS_CLASSES.PULSE), 350)
            } else {
                this.dom.bob.publicKey.textContent = this.publicKey
                const bobPublicResult = this.dom.bob.publicKey.closest('.exchange-result')
                bobPublicResult.classList.add(CSS_CLASSES.PULSE)
                setTimeout(() => bobPublicResult.classList.remove(CSS_CLASSES.PULSE), 350)
                await this.sleep(this.TIMING.STEP)
                if (!this.isRunning) return
                this.dom.bob.privateKey.textContent = this.privateKey
                const bobPrivateResult = this.dom.bob.privateKey.closest('.exchange-result')
                bobPrivateResult.classList.add(CSS_CLASSES.PULSE)
                setTimeout(() => bobPrivateResult.classList.remove(CSS_CLASSES.PULSE), 350)
            }

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return
            this.completeStep(stepEl)
        }

        // Step 3: Bob sends key to Alice
        async step3_SendKey() {
            const isSymmetric = this.mode === 'symmetric'
            this.setStatus(isSymmetric ? (this.showIntercept && this.showInterceptKey ? 'Bob sends secret key to Alice (Eve is watching!)' : 'Bob sends secret key to Alice') : 'Bob sends public key to Alice', isSymmetric && this.showIntercept && this.showInterceptKey ? 'warning' : 'info')

            const exchangeStepEl = this.dom.arrows.left.closest('.exchange-column-step')
            this.activateStep(exchangeStepEl)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            // Show key on arrow
            this.dom.arrows.key.textContent = isSymmetric ? this.sharedKey : this.publicKey
            this.dom.arrows.key.classList.add(CSS_CLASSES.PULSE)
            setTimeout(() => this.dom.arrows.key.classList.remove(CSS_CLASSES.PULSE), 350)
            this.dom.arrows.left.classList.add(CSS_CLASSES.ANIMATING)

            await this.sleep(this.TIMING.ANIMATE)
            if (!this.isRunning) return

            this.dom.arrows.left.classList.remove(CSS_CLASSES.ANIMATING)

            // Alice receives
            this.dom.alice.key.textContent = isSymmetric ? this.sharedKey : this.publicKey
            const aliceStepEl = this.dom.alice.key.closest('.exchange-step')
            const aliceReceivedContainer = aliceStepEl.querySelector('.exchange-received')
            aliceReceivedContainer.classList.add(CSS_CLASSES.PULSE)
            setTimeout(() => aliceReceivedContainer.classList.remove(CSS_CLASSES.PULSE), 350)
            aliceReceivedContainer.classList.add(CSS_CLASSES.SHOW)
            this.activateStep(aliceStepEl)

            // Show Eve intercept for symmetric (if both intercept and intercept-key enabled)
            if (isSymmetric && this.showIntercept && this.showInterceptKey && this.dom.exchange.eveIntercept) {
                await this.sleep(this.TIMING.STEP)
                if (!this.isRunning) return
                this.dom.exchange.eveIntercept.classList.add(CSS_CLASSES.SHOW)
                this.dom.exchange.eveIntercept.classList.add(CSS_CLASSES.HIGHLIGHT)
            }

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.completeStep(exchangeStepEl)
            this.completeStep(aliceStepEl)
        }

        // Step 4: Alice encrypts
        async step4_AliceEncrypts() {
            const isSymmetric = this.mode === 'symmetric'
            this.setStatus(`Alice encrypts "${this.message}" with ${isSymmetric ? 'shared key' : "Bob's public key"}`, 'info')

            const stepEl = this.dom.alice.ciphertext.closest('.exchange-step')
            this.activateStep(stepEl)

            await this.sleep(this.TIMING.ANIMATE)
            if (!this.isRunning) return

            this.dom.alice.ciphertext.textContent = this.encrypted
            this.dom.alice.result.classList.add(CSS_CLASSES.PULSE)
            setTimeout(() => this.dom.alice.result.classList.remove(CSS_CLASSES.PULSE), 350)
            this.dom.alice.result.classList.add(CSS_CLASSES.SHOW)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.completeStep(stepEl)
        }

        // Step 5: Send ciphertext
        async step5_SendCiphertext() {
            this.setStatus('Alice sends encrypted message to Bob', 'info')

            const exchangeStepEl = this.dom.arrows.right.closest('.exchange-column-step')
            this.activateStep(exchangeStepEl)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            // Show ciphertext on arrow
            this.dom.arrows.cipher.textContent = this.encrypted
            this.dom.arrows.cipher.classList.add(CSS_CLASSES.PULSE)
            setTimeout(() => this.dom.arrows.cipher.classList.remove(CSS_CLASSES.PULSE), 350)
            this.dom.arrows.right.classList.add(CSS_CLASSES.ANIMATING)

            await this.sleep(this.TIMING.ANIMATE)
            if (!this.isRunning) return

            this.dom.arrows.right.classList.remove(CSS_CLASSES.ANIMATING)

            // Bob receives
            this.dom.bob.received.textContent = this.encrypted
            const bobStepEl = this.dom.bob.received.closest('.exchange-step')
            const bobReceivedContainer = bobStepEl.querySelector('.exchange-received')
            bobReceivedContainer.classList.add(CSS_CLASSES.PULSE)
            setTimeout(() => bobReceivedContainer.classList.remove(CSS_CLASSES.PULSE), 350)
            bobReceivedContainer.classList.add(CSS_CLASSES.SHOW)
            this.activateStep(bobStepEl)

            // Show Eve note (if enabled)
            if (this.showIntercept && this.dom.exchange.eveNote) {
                await this.sleep(this.TIMING.STEP)
                if (!this.isRunning) return
                this.dom.exchange.eveNote.classList.add(CSS_CLASSES.SHOW)
            }

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.completeStep(exchangeStepEl)
            this.completeStep(bobStepEl)
        }

        // Step 6: Bob decrypts
        async step6_BobDecrypts() {
            const isSymmetric = this.mode === 'symmetric'
            this.setStatus(`Bob decrypts with ${isSymmetric ? 'shared key' : 'private key'}`, 'info')

            const stepEl = this.dom.bob.message.closest('.exchange-step')
            this.activateStep(stepEl)

            await this.sleep(this.TIMING.ANIMATE)
            if (!this.isRunning) return

            this.dom.bob.message.textContent = `"${this.message}"`
            this.dom.bob.result.classList.add(CSS_CLASSES.PULSE)
            setTimeout(() => this.dom.bob.result.classList.remove(CSS_CLASSES.PULSE), 350)
            this.dom.bob.result.classList.add(CSS_CLASSES.SHOW)
            this.dom.bob.result.classList.add(CSS_CLASSES.HIGHLIGHT)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.completeStep(stepEl)

            // Final status
            if (isSymmetric) {
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

        reset() {
            this.isRunning = false
            this.currentStep = 0

            // Regenerate keys
            if (this.mode === 'symmetric') {
                this.sharedKey = generateKey(KEY_LEN)
                this.encrypted = visualEncrypt(this.message, this.sharedKey)
            } else {
                this.publicKey = generateKey(KEY_LEN) + '-PUB'
                this.privateKey = generateKey(KEY_LEN) + '-PRV'
                this.encrypted = visualEncrypt(this.message, this.publicKey)
            }

            // Reset UI classes
            this.el.querySelectorAll('.exchange-step, .exchange-column-step, .exchange-eve, .exchange-received, .exchange-result').forEach(el => {
                el.classList.remove(CSS_CLASSES.ACTIVE, CSS_CLASSES.COMPLETED, CSS_CLASSES.SHOW, CSS_CLASSES.HIGHLIGHT)
            })

            this.el.querySelectorAll('.exchange-arrow').forEach(el => {
                el.classList.remove(CSS_CLASSES.ANIMATING)
            })

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

            this.setStatus('')
            this.updateControls()
        }

        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms))
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
