/**
 * docsify-diffie-hellman.js — Interactive Diffie-Hellman Key Exchange Visualizer
 *
 * Helps students understand:
 *   - How public-key exchange works
 *   - The separation between public and private information
 *   - How Alice and Bob arrive at the same shared secret
 *   - Why the discrete logarithm problem protects against eavesdropping
 *
 * Usage in markdown:
 *   <diffie-hellman></diffie-hellman>
 *   <diffie-hellman p="17" g="7"></diffie-hellman>
 *
 * Attributes:
 *   - p: Prime modulus (default: 23, recommended range: 11-31 for visualization)
 *   - g: Generator base (default: 3, must be coprime to p)
 *
 * Animation sequence:
 *   1. Show public parameters (p and g)
 *   2. Alice chooses private key a
 *   3. Bob chooses private key b
 *   4. Alice calculates A = g^a mod p
 *   5. Bob calculates B = g^b mod p
 *   6. Exchange: Alice sends A to Bob, Bob sends B to Alice
 *   7. Alice calculates shared secret: s = B^a mod p
 *   8. Bob calculates shared secret: s = A^b mod p
 *   9. Highlight that both arrive at same shared secret
 */

;(function () {

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    /**
     * Modular exponentiation: (base^exp) mod m
     * Using iterative squaring for efficiency and visualization tracking
     */
    function modPow(base, exp, mod) {
        let result = 1
        base = base % mod
        while (exp > 0) {
            if (exp % 2 === 1) {
                result = (result * base) % mod
            }
            exp = Math.floor(exp / 2)
            base = (base * base) % mod
        }
        return result
    }

    /**
     * Simple modular multiplication for animation
     */
    function modMul(a, b, mod) {
        return (a * b) % mod
    }

    /**
     * Generate a safe random private key (between 2 and 9 for smaller values)
     */
    function generatePrivateKey(p) {
        return Math.floor(Math.random() * 8) + 2  // Returns 2-9
    }

    /**
     * Escape HTML
     */
    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
    }



    // -------------------------------------------------------------------------
    // HTML UI Builder
    // -------------------------------------------------------------------------

    function buildUI(p, g) {
        const wrapper = document.createElement('div')
        wrapper.className = 'dh-wrapper'
        wrapper.innerHTML = `
            <div class="dh-header">
                <div class="dh-header-content">
                    <div class="dh-title">Diffie-Hellman Key Exchange</div>
                    <div class="dh-subtitle">Watch Alice and Bob establish a shared secret over a public channel</div>
                </div>
                <div class="dh-public-params">
                    <div class="dh-param-label">Public Parameters (known to everyone)</div>
                    <div class="dh-params-row">
                        <div class="dh-param">
                            <span class="dh-param-name">p</span>
                            <span class="dh-param-equals">=</span>
                            <span class="dh-param-value">${p}</span>
                            <span class="dh-param-desc">(prime modulus)</span>
                        </div>
                        <div class="dh-param">
                            <span class="dh-param-name">g</span>
                            <span class="dh-param-equals">=</span>
                            <span class="dh-param-value">${g}</span>
                            <span class="dh-param-desc">(generator)</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="dh-main-grid">
                <!-- Alice's Side -->
                <div class="dh-party dh-alice">
                    <div class="dh-party-header">
                        <div class="dh-party-name">👩 Alice</div>
                    </div>

                    <div class="dh-step dh-step-private-key">
                        <div class="dh-step-label">Step 1: Choose private key</div>
                        <div class="dh-step-content">
                            <div class="dh-private-key">
                                <div class="dh-value-group dh-value-alice">
                                    <span class="dh-var">a</span> = <span class="dh-value" data-alice-a>?</span>
                                </div>
                                <span class="dh-secret-badge">🔒 Private Key</span>
                            </div>
                        </div>
                    </div>

                    <div class="dh-step dh-step-calc-public">
                        <div class="dh-step-label">Step 2: Calculate public value</div>
                        <div class="dh-step-content">
                            <div class="dh-calculation" data-alice-calc>
                                <div class="dh-calc-display">
                                    <div class="dh-calc-step">
                                        <span class="dh-var">A</span> =
                                        <span class="dh-var">g</span><sup class="dh-var">a</sup> mod <span class="dh-var">p</span>
                                    </div>
                                </div>
                            </div>
                            <div class="dh-result" data-alice-result>
                                <div class="dh-value-group dh-value-alice">
                                    <span class="dh-var">A</span> = <span class="dh-value" data-alice-public>?</span>
                                </div>
                                <span class="dh-public-badge">📢 Public</span>
                            </div>
                        </div>
                    </div>

                    <div class="dh-step dh-step-receive">
                        <div class="dh-step-label">Step 4: Receive Bob's public value</div>
                        <div class="dh-step-content">
                            <div class="dh-received">
                                <span class="dh-received-label">Received</span>
                                <div class="dh-value-group dh-value-bob">
                                    <span class="dh-var">B</span> = <span class="dh-value" data-alice-received>?</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="dh-step dh-step-calc-secret">
                        <div class="dh-step-label">Step 5: Calculate shared secret</div>
                        <div class="dh-step-content">
                            <div class="dh-calculation" data-alice-secret-calc>
                                <div class="dh-calc-display">
                                    <div class="dh-calc-step">
                                        <span class="dh-var">s</span> =
                                        <span class="dh-var">B</span><sup class="dh-var">a</sup> mod <span class="dh-var">p</span>
                                    </div>
                                </div>
                            </div>
                            <div class="dh-result dh-shared-secret" data-alice-secret-result>
                                <div class="dh-value-group dh-value-alice">
                                    <span class="dh-var">s</span> = <span class="dh-value" data-alice-secret>?</span>
                                </div>
                                <span class="dh-shared-badge">🔐 Shared Secret</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Exchange Arrow -->
                <div class="dh-exchange">
                    <div class="dh-exchange-step dh-exchange-step-3">
                        <div class="dh-exchange-label">Step 3: Public Exchange</div>
                        <div class="dh-arrow dh-arrow-right">
                            <div class="dh-value-group dh-value-alice">
                                <span class="dh-var">A</span> = <span class="dh-value" data-arrow-a>?</span>
                            </div>
                            <div class="dh-arrow-label">Send</div>
                            <span class="dh-arrow-arrow">→</span>
                        </div>
                        <div class="dh-arrow dh-arrow-left">
                            <span class="dh-arrow-arrow">←</span>
                            <div class="dh-arrow-label">Send</div>
                            <div class="dh-value-group dh-value-bob">
                                <span class="dh-var">B</span> = <span class="dh-value" data-arrow-b>?</span>
                            </div>
                        </div>
                        <div class="dh-eve-note">
                            <div class="dh-eve-icon">👁️ Eve (eavesdropper)</div>
                            <div class="dh-eve-text">Can see: <span class="dh-var">p</span>, <span class="dh-var">g</span>, <span class="dh-var">A</span>, <span class="dh-var">B</span></div>
                            <div class="dh-eve-text">Cannot see: <span class="dh-var">a</span>, <span class="dh-var">b</span>, <span class="dh-var">s</span></div>
                            <div class="dh-eve-problem">Computing <span class="dh-var">a</span> or <span class="dh-var">b</span> from public values is the <strong>discrete logarithm problem</strong> — extremely hard!</div>
                        </div>
                    </div>
                </div>

                <!-- Bob's Side -->
                <div class="dh-party dh-bob">
                    <div class="dh-party-header">
                        <div class="dh-party-name">👨 Bob</div>
                    </div>

                    <div class="dh-step dh-step-private-key">
                        <div class="dh-step-label">Step 1: Choose private key</div>
                        <div class="dh-step-content">
                            <div class="dh-private-key">
                                <div class="dh-value-group dh-value-bob">
                                    <span class="dh-var">b</span> = <span class="dh-value" data-bob-b>?</span>
                                </div>
                                <span class="dh-secret-badge">🔒 Private Key</span>
                            </div>
                        </div>
                    </div>

                    <div class="dh-step dh-step-calc-public">
                        <div class="dh-step-label">Step 2: Calculate public value</div>
                        <div class="dh-step-content">
                            <div class="dh-calculation" data-bob-calc>
                                <div class="dh-calc-display">
                                    <div class="dh-calc-step">
                                        <span class="dh-var">B</span> =
                                        <span class="dh-var">g</span><sup class="dh-var">b</sup> mod <span class="dh-var">p</span>
                                    </div>
                                </div>
                            </div>
                            <div class="dh-result" data-bob-result>
                                <span class="dh-public-badge">📢 Public</span>
                                <div class="dh-value-group dh-value-bob">
                                    <span class="dh-var">B</span> = <span class="dh-value" data-bob-public>?</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="dh-step dh-step-receive">
                        <div class="dh-step-label">Step 4: Receive Alice's public value</div>
                        <div class="dh-step-content">
                            <div class="dh-received">
                                <span class="dh-received-label">Received</span>
                                <div class="dh-value-group dh-value-alice">
                                    <span class="dh-var">A</span> = <span class="dh-value" data-bob-received>?</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="dh-step dh-step-calc-secret">
                        <div class="dh-step-label">Step 5: Calculate shared secret</div>
                        <div class="dh-step-content">
                            <div class="dh-calculation" data-bob-secret-calc>
                                <div class="dh-calc-display">
                                    <div class="dh-calc-step">
                                        <span class="dh-var">s</span> =
                                        <span class="dh-var">A</span><sup class="dh-var">b</sup> mod <span class="dh-var">p</span>
                                    </div>
                                </div>
                            </div>
                            <div class="dh-result dh-shared-secret" data-bob-secret-result>
                                <div class="dh-value-group dh-value-bob">
                                    <span class="dh-var">s</span> = <span class="dh-value" data-bob-secret>?</span>
                                </div>
                                <span class="dh-shared-badge">🔐 Shared Secret</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="dh-footer">
                <div class="dh-status" aria-live="polite"></div>

                <div class="dh-controls">
                    <button class="dh-btn dh-btn-start">
                        <span class="btn-icon">▶</span>
                        <span class="btn-text">Start</span>
                    </button>
                    <button class="dh-btn dh-btn-reset">
                        <span class="btn-icon">↺</span>
                        <span class="btn-text">Reset</span>
                    </button>
                    <button class="dh-btn dh-btn-step">
                        <span class="btn-icon">→</span>
                        <span class="btn-text">Next</span>
                    </button>
                </div>
            </div>
        `
        return wrapper
    }

    // -------------------------------------------------------------------------
    // Animation Controller
    // -------------------------------------------------------------------------

    // CSS class name constants
    const CSS_CLASSES = {
        ACTIVE: 'dh-active',
        COMPLETED: 'dh-completed',
        HIGHLIGHT: 'dh-highlight',
        ANIMATING: 'dh-animating',
        RESULT_SHOW: 'dh-result-show',
        CALC_ANIMATE: 'dh-calc-animate'
    }

    // Helper: Create formula HTML template
    function createFormulaHTML(resultVar, baseVar, expVar, modVar) {
        return `
            <div class="dh-calc-display">
                <div class="dh-calc-step">
                    <span class="dh-var">${resultVar}</span> =
                    <span class="dh-var">${baseVar}</span><sup class="dh-var">${expVar}</sup> mod <span class="dh-var">${modVar}</span>
                </div>
            </div>
        `
    }

    class DiffieHellmanAnimation {
        constructor(el, p, g) {
            this.el = el
            this.p = p
            this.g = g
            this.currentStep = 0
            this.isRunning = false
            this.isPaused = false

            // Animation timing constants (in milliseconds)
            // Base delays that cascade through the animation
            // To adjust overall speed: change BASE value (default 300ms)
            // Each subsequent timing builds on previous ones
            this.TIMING = {
                BASE: 500,                           // Base unit for smallest delays
                get REVEAL() { return this.BASE },   // Time for values to appear (300ms)
                get STEP() { return this.BASE + 200 }, // Time between sub-steps (400ms)
                get ANIMATE() { return this.STEP + 400 }, // Arrow/animation duration (600ms)
                get CALC_WAIT() { return this.ANIMATE }, // Wait before showing calc step (600ms)
                get BETWEEN_STEPS() { return this.ANIMATE + 400 } // Pause between major steps (800ms)
            }

            // Generate keys (ensure they're different)
            this.a = generatePrivateKey(p)
            this.b = generatePrivateKey(p)
            while (this.a === this.b) {
                this.b = generatePrivateKey(p)
            }
            this.A = modPow(g, this.a, p)
            this.B = modPow(g, this.b, p)
            this.secretAlice = modPow(this.B, this.a, p)
            this.secretBob = modPow(this.A, this.b, p)

            // Get DOM elements (cached for performance)
            this.statusEl = el.querySelector('.dh-status')
            this.startBtn = el.querySelector('.dh-btn-start')
            this.resetBtn = el.querySelector('.dh-btn-reset')
            this.stepBtn = el.querySelector('.dh-btn-step')

            // Cache frequently accessed DOM elements
            this.dom = {
                alice: {
                    privateKey: el.querySelector('[data-alice-a]'),
                    publicKey: el.querySelector('[data-alice-public]'),
                    calc: el.querySelector('[data-alice-calc]'),
                    result: el.querySelector('[data-alice-result]'),
                    received: el.querySelector('[data-alice-received]'),
                    secretCalc: el.querySelector('[data-alice-secret-calc]'),
                    secretResult: el.querySelector('[data-alice-secret-result]'),
                    secret: el.querySelector('[data-alice-secret]')
                },
                bob: {
                    privateKey: el.querySelector('[data-bob-b]'),
                    publicKey: el.querySelector('[data-bob-public]'),
                    calc: el.querySelector('[data-bob-calc]'),
                    result: el.querySelector('[data-bob-result]'),
                    received: el.querySelector('[data-bob-received]'),
                    secretCalc: el.querySelector('[data-bob-secret-calc]'),
                    secretResult: el.querySelector('[data-bob-secret-result]'),
                    secret: el.querySelector('[data-bob-secret]')
                },
                arrows: {
                    a: el.querySelector('[data-arrow-a]'),
                    b: el.querySelector('[data-arrow-b]'),
                    right: el.querySelector('.dh-arrow-right'),
                    left: el.querySelector('.dh-arrow-left')
                },
                exchange: el.querySelector('.dh-exchange-step-3'),
                eveNote: el.querySelector('.dh-eve-note')
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
            this.stepBtn.disabled = this.isRunning || this.currentStep >= 9
        }

        setStatus(msg, type = '') {
            this.statusEl.textContent = msg
            this.statusEl.className = `dh-status ${type ? 'dh-status-' + type : ''}`
        }

        // Helper: Activate a step (add active class)
        activateStep(stepEl) {
            stepEl.classList.add(CSS_CLASSES.ACTIVE)
        }

        // Helper: Complete a step (remove active, add completed)
        completeStep(stepEl) {
            stepEl.classList.remove(CSS_CLASSES.ACTIVE)
            stepEl.classList.add(CSS_CLASSES.COMPLETED)
        }

        // Helper: Reset multiple elements to a default value
        resetElementsToDefault(selector, defaultValue = '?') {
            this.el.querySelectorAll(selector).forEach(el => {
                el.textContent = defaultValue
            })
        }

        // Helper: Generic calculation method for public or secret values
        async calculateValue(party, valueType) {
            const isAlice = party === 'alice'
            const isPublic = valueType === 'public'
            const name = isAlice ? 'Alice' : 'Bob'
            const pronoun = isAlice ? 'her' : 'his'

            let resultVar, baseVar, expVar, baseVal, expVal, finalResult
            let calcContainer, resultContainer, stepEl, displayEl

            if (isPublic) {
                // Calculate public value: A = g^a mod p or B = g^b mod p
                resultVar = isAlice ? 'A' : 'B'
                baseVar = 'g'
                expVar = isAlice ? 'a' : 'b'
                baseVal = this.g
                expVal = isAlice ? this.a : this.b
                finalResult = isAlice ? this.A : this.B

                calcContainer = this.dom[party].calc
                resultContainer = this.dom[party].result
                displayEl = this.dom[party].publicKey

                this.setStatus(`${name} calculates ${pronoun} public value: ${resultVar} = ${baseVal}^${expVal} mod ${this.p}`, 'info')
            } else {
                // Calculate shared secret: s = B^a mod p or s = A^b mod p
                resultVar = 's'
                baseVar = isAlice ? 'B' : 'A'
                expVar = isAlice ? 'a' : 'b'
                baseVal = isAlice ? this.B : this.A
                expVal = isAlice ? this.a : this.b
                finalResult = isAlice ? this.secretAlice : this.secretBob

                calcContainer = this.dom[party].secretCalc
                resultContainer = this.dom[party].secretResult
                displayEl = this.dom[party].secret

                this.setStatus(`${name} calculates shared secret: ${resultVar} = ${baseVal}^${expVal} mod ${this.p}`, 'info')
            }

            stepEl = calcContainer.closest('.dh-step')
            this.activateStep(stepEl)

            await this.showCalculation(
                calcContainer,
                resultContainer,
                resultVar,
                baseVar,
                expVar,
                'p',
                baseVal,
                expVal,
                this.p,
                finalResult
            )

            displayEl.textContent = finalResult

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return
            this.completeStep(stepEl)
        }

        async start() {
            if (this.isRunning) return

            // If animation completed, reset before restarting
            if (this.currentStep >= 9) {
                this.reset()
            }

            this.isRunning = true
            this.updateControls()

            while (this.currentStep < 9 && this.isRunning) {
                await this.nextStep()
                if (!this.isRunning) break
                await this.sleep(this.TIMING.BETWEEN_STEPS)
            }

            this.isRunning = false
            this.updateControls()
        }

        async nextStep() {
            if (this.currentStep >= 9) return

            this.currentStep++

            switch (this.currentStep) {
                case 1:
                    await this.step1_ChoosePrivateKeys()
                    break
                case 2:
                    await this.step2_AliceCalculatesPublic()
                    break
                case 3:
                    await this.step3_BobCalculatesPublic()
                    break
                case 4:
                    await this.step4_Exchange()
                    break
                case 5:
                    await this.step5_AliceCalculatesSecret()
                    break
                case 6:
                    await this.step6_BobCalculatesSecret()
                    break
                case 7:
                    await this.step7_HighlightSharedSecret()
                    break
                case 8:
                    await this.step8_ShowEvesProblem()
                    break
                case 9:
                    await this.step9_Complete()
                    break
            }

            this.updateControls()
        }

        async step1_ChoosePrivateKeys() {
            this.setStatus('Alice and Bob each choose a private key (kept secret)', 'info')

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return
            this.dom.alice.privateKey.textContent = this.a
            this.activateStep(this.dom.alice.privateKey.closest('.dh-step'))

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return
            this.dom.bob.privateKey.textContent = this.b
            this.activateStep(this.dom.bob.privateKey.closest('.dh-step'))

            // Remove highlighting after reveal completes
            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return
            this.completeStep(this.dom.alice.privateKey.closest('.dh-step'))
            this.completeStep(this.dom.bob.privateKey.closest('.dh-step'))
        }

        async step2_AliceCalculatesPublic() {
            await this.calculateValue('alice', 'public')
        }

        async step3_BobCalculatesPublic() {
            await this.calculateValue('bob', 'public')
        }

        async step4_Exchange() {
            this.setStatus('Alice and Bob exchange their public values over the public channel', 'info')

            this.activateStep(this.dom.exchange)

            // Show values in arrows
            this.dom.arrows.a.textContent = this.A
            this.dom.arrows.b.textContent = this.B

            // Alice sends A to Bob
            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return
            this.dom.arrows.right.classList.add(CSS_CLASSES.ANIMATING)

            await this.sleep(this.TIMING.ANIMATE)
            if (!this.isRunning) return
            this.dom.arrows.right.classList.remove(CSS_CLASSES.ANIMATING)
            this.dom.bob.received.textContent = this.A
            this.dom.bob.received.closest('.dh-received').classList.add(CSS_CLASSES.RESULT_SHOW)
            this.activateStep(this.dom.bob.received.closest('.dh-step'))

            // Bob sends B to Alice
            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return
            this.dom.arrows.left.classList.add(CSS_CLASSES.ANIMATING)

            await this.sleep(this.TIMING.ANIMATE)
            if (!this.isRunning) return
            this.dom.arrows.left.classList.remove(CSS_CLASSES.ANIMATING)
            this.dom.alice.received.textContent = this.B
            this.dom.alice.received.closest('.dh-received').classList.add(CSS_CLASSES.RESULT_SHOW)
            this.activateStep(this.dom.alice.received.closest('.dh-step'))

            // Remove highlighting after exchange completes
            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return
            this.completeStep(this.dom.exchange)
            this.completeStep(this.dom.bob.received.closest('.dh-step'))
            this.completeStep(this.dom.alice.received.closest('.dh-step'))
        }

        async step5_AliceCalculatesSecret() {
            await this.calculateValue('alice', 'secret')
        }

        async step6_BobCalculatesSecret() {
            await this.calculateValue('bob', 'secret')
        }

        async step7_HighlightSharedSecret() {
            this.setStatus('✨ Success! Alice and Bob have the same shared secret!', 'success')

            this.el.querySelectorAll('.dh-shared-secret').forEach(el => {
                el.classList.add(CSS_CLASSES.HIGHLIGHT)
            })

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return
        }

        async step8_ShowEvesProblem() {
            this.setStatus('Eve can see all public values, but cannot calculate the shared secret 😡', 'warning')

            this.activateStep(this.dom.eveNote)

            // Give extra time to read the Eve explanation
            await this.sleep(this.TIMING.BETWEEN_STEPS)
            if (!this.isRunning) return
        }

        async step9_Complete() {
            this.setStatus('Key exchange complete! Alice and Bob can now use their shared secret for encryption 🔐', 'success')
        }

        async showCalculation(calcContainer, resultContainer, resultVar, baseVar, expVar, modVar, baseVal, expVal, modVal, finalResult) {
            // Calculate full value (before modulo)
            let fullValue
            if (expVal <= 20 && baseVal ** expVal < Number.MAX_SAFE_INTEGER) {
                fullValue = baseVal ** expVal
            } else {
                fullValue = baseVal ** expVal  // JavaScript will handle this as approximation
            }

            const display = calcContainer.querySelector('.dh-calc-display')

            // The initial formula is already in the HTML, just wait a bit
            await this.sleep(this.TIMING.CALC_WAIT)
            if (!this.isRunning) return

            // Step 2: Show substituted values
            const step2 = document.createElement('div')
            step2.className = 'dh-calc-step'
            step2.innerHTML = `<span class="dh-var">${resultVar}</span> = ${baseVal}<sup>${expVal}</sup> mod ${modVal}`
            display.appendChild(step2)
            // Trigger animation after DOM insertion
            requestAnimationFrame(() => {
                step2.classList.add(CSS_CLASSES.CALC_ANIMATE)
            })
            await this.sleep(this.TIMING.CALC_WAIT)
            if (!this.isRunning) return

            // Step 3: Show intermediate calculation
            const step3 = document.createElement('div')
            step3.className = 'dh-calc-step'
            step3.innerHTML = `<span class="dh-var">${resultVar}</span> = ${fullValue.toLocaleString()} mod ${modVal}`
            display.appendChild(step3)
            // Trigger animation after DOM insertion
            requestAnimationFrame(() => {
                step3.classList.add(CSS_CLASSES.CALC_ANIMATE)
            })
            await this.sleep(this.TIMING.CALC_WAIT)
            if (!this.isRunning) return

            // Step 4: Show final result
            const step4 = document.createElement('div')
            step4.className = 'dh-calc-step'
            step4.innerHTML = `<span class="dh-var">${resultVar}</span> = <strong>${finalResult}</strong>`
            display.appendChild(step4)
            // Trigger animation after DOM insertion
            requestAnimationFrame(() => {
                step4.classList.add(CSS_CLASSES.CALC_ANIMATE)
            })

            // Show final result badge after animation
            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return
            resultContainer.classList.add(CSS_CLASSES.RESULT_SHOW)
        }

        reset() {
            // Stop any running animation
            this.isRunning = false
            this.currentStep = 0

            // Generate new keys (ensure they're different)
            this.a = generatePrivateKey(this.p)
            this.b = generatePrivateKey(this.p)
            while (this.a === this.b) {
                this.b = generatePrivateKey(this.p)
            }
            this.A = modPow(this.g, this.a, this.p)
            this.B = modPow(this.g, this.b, this.p)
            this.secretAlice = modPow(this.B, this.a, this.p)
            this.secretBob = modPow(this.A, this.b, this.p)

            // Reset UI classes
            this.el.querySelectorAll('.dh-step, .dh-exchange-step-3, .dh-eve-note').forEach(el => {
                el.classList.remove(CSS_CLASSES.ACTIVE, CSS_CLASSES.HIGHLIGHT, CSS_CLASSES.COMPLETED)
            })

            this.el.querySelectorAll('.dh-shared-secret').forEach(el => {
                el.classList.remove(CSS_CLASSES.HIGHLIGHT)
            })

            this.el.querySelectorAll('.dh-arrow').forEach(el => {
                el.classList.remove(CSS_CLASSES.ANIMATING)
            })

            // Reset all displayed values to '?'
            this.resetElementsToDefault('[data-alice-a], [data-alice-public], [data-alice-received], [data-alice-secret], [data-arrow-a]')
            this.resetElementsToDefault('[data-bob-b], [data-bob-public], [data-bob-received], [data-bob-secret], [data-arrow-b]')

            // Reset calculations to initial formulas using helper
            this.dom.alice.calc.innerHTML = createFormulaHTML('A', 'g', 'a', 'p')
            this.dom.bob.calc.innerHTML = createFormulaHTML('B', 'g', 'b', 'p')
            this.dom.alice.secretCalc.innerHTML = createFormulaHTML('s', 'B', 'a', 'p')
            this.dom.bob.secretCalc.innerHTML = createFormulaHTML('s', 'A', 'b', 'p')

            // Reset result displays
            this.el.querySelectorAll('[data-alice-result], [data-bob-result], [data-alice-secret-result], [data-bob-secret-result]').forEach(el => {
                el.classList.remove(CSS_CLASSES.RESULT_SHOW)
            })

            this.el.querySelectorAll('.dh-received').forEach(el => {
                el.classList.remove(CSS_CLASSES.RESULT_SHOW)
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

    function processDiffieHellman() {
        document.querySelectorAll('.markdown-section diffie-hellman').forEach(el => {
            const p = parseInt(el.getAttribute('p')) || 23
            const g = parseInt(el.getAttribute('g')) || 3

            // Validate parameters
            if (p < 11 || p > 100) {
                el.innerHTML = '<div class="dh-error">Error: p must be between 11 and 100</div>'
                return
            }

            if (g < 2 || g >= p) {
                el.innerHTML = `<div class="dh-error">Error: g must be between 2 and ${p - 1}</div>`
                return
            }

            el.innerHTML = ''
            el.appendChild(buildUI(p, g))

            // Initialize animation controller
            new DiffieHellmanAnimation(el, p, g)
        })
    }

    const docsifyDiffieHellman = function (hook) {
        hook.doneEach(processDiffieHellman)
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyDiffieHellman, window.$docsify.plugins || [])

})()
