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
                                <span class="dh-var">a</span> = <span class="dh-value" data-alice-a>?</span>
                                <span class="dh-secret-badge">🔒 Secret</span>
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
                                <span class="dh-var">A</span> = <span class="dh-value" data-alice-public>?</span>
                                <span class="dh-public-badge">📢 Public</span>
                            </div>
                        </div>
                    </div>

                    <div class="dh-step dh-step-receive">
                        <div class="dh-step-label">Step 4: Receive Bob's public value</div>
                        <div class="dh-step-content">
                            <div class="dh-received">
                                Received: <span class="dh-var">B</span> = <span class="dh-value" data-alice-received>?</span>
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
                                <span class="dh-var">s</span> = <span class="dh-value" data-alice-secret>?</span>
                                <span class="dh-secret-badge">🔐 Shared Secret</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Exchange Arrow -->
                <div class="dh-exchange">
                    <div class="dh-exchange-step dh-exchange-step-3">
                        <div class="dh-exchange-label">Step 3: Public Exchange</div>
                        <div class="dh-arrow dh-arrow-right">
                            <div class="dh-arrow-label">
                                Send <span class="dh-var">A</span> →
                            </div>
                        </div>
                        <div class="dh-arrow dh-arrow-left">
                            <div class="dh-arrow-label">
                                ← Send <span class="dh-var">B</span>
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
                                <span class="dh-var">b</span> = <span class="dh-value" data-bob-b>?</span>
                                <span class="dh-secret-badge">🔒 Secret</span>
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
                                <span class="dh-var">B</span> = <span class="dh-value" data-bob-public>?</span>
                                <span class="dh-public-badge">📢 Public</span>
                            </div>
                        </div>
                    </div>

                    <div class="dh-step dh-step-receive">
                        <div class="dh-step-label">Step 4: Receive Alice's public value</div>
                        <div class="dh-step-content">
                            <div class="dh-received">
                                Received: <span class="dh-var">A</span> = <span class="dh-value" data-bob-received>?</span>
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
                                <span class="dh-var">s</span> = <span class="dh-value" data-bob-secret>?</span>
                                <span class="dh-secret-badge">🔐 Shared Secret</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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

            <div class="dh-status" aria-live="polite"></div>
        `
        return wrapper
    }

    // -------------------------------------------------------------------------
    // Animation Controller
    // -------------------------------------------------------------------------

    class DiffieHellmanAnimation {
        constructor(el, p, g) {
            this.el = el
            this.p = p
            this.g = g
            this.currentStep = 0
            this.isRunning = false
            this.isPaused = false

            // Generate keys
            this.a = generatePrivateKey(p)
            this.b = generatePrivateKey(p)
            this.A = modPow(g, this.a, p)
            this.B = modPow(g, this.b, p)
            this.secretAlice = modPow(this.B, this.a, p)
            this.secretBob = modPow(this.A, this.b, p)

            // Get DOM elements
            this.statusEl = el.querySelector('.dh-status')
            this.startBtn = el.querySelector('.dh-btn-start')
            this.resetBtn = el.querySelector('.dh-btn-reset')
            this.stepBtn = el.querySelector('.dh-btn-step')

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

        async start() {
            if (this.isRunning) return
            this.isRunning = true
            this.updateControls()

            while (this.currentStep < 9) {
                await this.nextStep()
                await this.sleep(800)
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

            const alicePrivate = this.el.querySelector('[data-alice-a]')
            const bobPrivate = this.el.querySelector('[data-bob-b]')

            await this.sleep(300)
            alicePrivate.textContent = this.a
            alicePrivate.closest('.dh-step').classList.add('dh-active')

            await this.sleep(400)
            bobPrivate.textContent = this.b
            bobPrivate.closest('.dh-step').classList.add('dh-active')
        }

        async step2_AliceCalculatesPublic() {
            this.setStatus(`Alice calculates her public value: A = ${this.g}^${this.a} mod ${this.p}`, 'info')

            const stepEl = this.el.querySelector('[data-alice-calc]').closest('.dh-step')
            stepEl.classList.add('dh-active')

            await this.showCalculation(
                this.el.querySelector('[data-alice-calc]'),
                this.el.querySelector('[data-alice-result]'),
                'A',
                'g',
                'a',
                'p',
                this.g,
                this.a,
                this.p,
                this.A
            )

            this.el.querySelector('[data-alice-public]').textContent = this.A
        }

        async step3_BobCalculatesPublic() {
            this.setStatus(`Bob calculates his public value: B = ${this.g}^${this.b} mod ${this.p}`, 'info')

            const stepEl = this.el.querySelector('[data-bob-calc]').closest('.dh-step')
            stepEl.classList.add('dh-active')

            await this.showCalculation(
                this.el.querySelector('[data-bob-calc]'),
                this.el.querySelector('[data-bob-result]'),
                'B',
                'g',
                'b',
                'p',
                this.g,
                this.b,
                this.p,
                this.B
            )

            this.el.querySelector('[data-bob-public]').textContent = this.B
        }

        async step4_Exchange() {
            this.setStatus('Alice and Bob exchange their public values over the public channel', 'info')

            this.el.querySelector('.dh-exchange-step-3').classList.add('dh-active')

            await this.sleep(400)
            this.el.querySelector('.dh-arrow-right').classList.add('dh-animating')

            await this.sleep(600)
            this.el.querySelector('[data-bob-received]').textContent = this.A
            this.el.querySelector('[data-bob-received]').closest('.dh-step').classList.add('dh-active')

            await this.sleep(400)
            this.el.querySelector('.dh-arrow-left').classList.add('dh-animating')

            await this.sleep(600)
            this.el.querySelector('[data-alice-received]').textContent = this.B
            this.el.querySelector('[data-alice-received]').closest('.dh-step').classList.add('dh-active')
        }

        async step5_AliceCalculatesSecret() {
            this.setStatus(`Alice calculates shared secret: s = ${this.B}^${this.a} mod ${this.p}`, 'info')

            const stepEl = this.el.querySelector('[data-alice-secret-calc]').closest('.dh-step')
            stepEl.classList.add('dh-active')

            await this.showCalculation(
                this.el.querySelector('[data-alice-secret-calc]'),
                this.el.querySelector('[data-alice-secret-result]'),
                's',
                'B',
                'a',
                'p',
                this.B,
                this.a,
                this.p,
                this.secretAlice
            )

            this.el.querySelector('[data-alice-secret]').textContent = this.secretAlice
        }

        async step6_BobCalculatesSecret() {
            this.setStatus(`Bob calculates shared secret: s = ${this.A}^${this.b} mod ${this.p}`, 'info')

            const stepEl = this.el.querySelector('[data-bob-secret-calc]').closest('.dh-step')
            stepEl.classList.add('dh-active')

            await this.showCalculation(
                this.el.querySelector('[data-bob-secret-calc]'),
                this.el.querySelector('[data-bob-secret-result]'),
                's',
                'A',
                'b',
                'p',
                this.A,
                this.b,
                this.p,
                this.secretBob
            )

            this.el.querySelector('[data-bob-secret]').textContent = this.secretBob
        }

        async step7_HighlightSharedSecret() {
            this.setStatus('✨ Success! Alice and Bob have the same shared secret!', 'success')

            this.el.querySelectorAll('.dh-shared-secret').forEach(el => {
                el.classList.add('dh-highlight')
            })

            await this.sleep(300)
        }

        async step8_ShowEvesProblem() {
            this.setStatus('Eve can see all public values, but cannot calculate the shared secret', 'warning')

            this.el.querySelector('.dh-eve-note').classList.add('dh-active')
        }

        async step9_Complete() {
            this.setStatus('🎉 Key exchange complete! Alice and Bob can now use their shared secret for encryption.', 'success')
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
            await this.sleep(600)

            // Step 2: Show substituted values
            const step2 = document.createElement('div')
            step2.className = 'dh-calc-step'
            step2.innerHTML = `<span class="dh-var">${resultVar}</span> = ${baseVal}<sup>${expVal}</sup> mod ${modVal}`
            display.appendChild(step2)
            // Trigger animation after DOM insertion
            requestAnimationFrame(() => {
                step2.classList.add('dh-calc-animate')
            })
            await this.sleep(600)

            // Step 3: Show intermediate calculation
            const step3 = document.createElement('div')
            step3.className = 'dh-calc-step'
            step3.innerHTML = `<span class="dh-var">${resultVar}</span> = ${fullValue.toLocaleString()} mod ${modVal}`
            display.appendChild(step3)
            // Trigger animation after DOM insertion
            requestAnimationFrame(() => {
                step3.classList.add('dh-calc-animate')
            })
            await this.sleep(600)

            // Step 4: Show final result
            const step4 = document.createElement('div')
            step4.className = 'dh-calc-step'
            step4.innerHTML = `<span class="dh-var">${resultVar}</span> = <strong>${finalResult}</strong>`
            display.appendChild(step4)
            // Trigger animation after DOM insertion
            requestAnimationFrame(() => {
                step4.classList.add('dh-calc-animate')
            })

            // Show final result badge after animation
            await this.sleep(400)
            resultContainer.classList.add('dh-result-show')
        }

        reset() {
            // Stop any running animation
            this.isRunning = false
            this.currentStep = 0

            // Generate new keys
            this.a = generatePrivateKey(this.p)
            this.b = generatePrivateKey(this.p)
            this.A = modPow(this.g, this.a, this.p)
            this.B = modPow(this.g, this.b, this.p)
            this.secretAlice = modPow(this.B, this.a, this.p)
            this.secretBob = modPow(this.A, this.b, this.p)

            // Reset UI
            this.el.querySelectorAll('.dh-step, .dh-exchange-step-3, .dh-eve-note').forEach(el => {
                el.classList.remove('dh-active', 'dh-highlight')
            })

            this.el.querySelectorAll('.dh-shared-secret').forEach(el => {
                el.classList.remove('dh-highlight')
            })

            this.el.querySelectorAll('.dh-arrow').forEach(el => {
                el.classList.remove('dh-animating')
            })

            this.el.querySelectorAll('[data-alice-a], [data-alice-public], [data-alice-received], [data-alice-secret]').forEach(el => {
                el.textContent = '?'
            })

            this.el.querySelectorAll('[data-bob-b], [data-bob-public], [data-bob-received], [data-bob-secret]').forEach(el => {
                el.textContent = '?'
            })

            // Reset calculations to initial formula
            this.el.querySelector('[data-alice-calc]').innerHTML = `
                <div class="dh-calc-display">
                    <div class="dh-calc-step">
                        <span class="dh-var">A</span> =
                        <span class="dh-var">g</span><sup class="dh-var">a</sup> mod <span class="dh-var">p</span>
                    </div>
                </div>
            `

            this.el.querySelector('[data-bob-calc]').innerHTML = `
                <div class="dh-calc-display">
                    <div class="dh-calc-step">
                        <span class="dh-var">B</span> =
                        <span class="dh-var">g</span><sup class="dh-var">b</sup> mod <span class="dh-var">p</span>
                    </div>
                </div>
            `

            this.el.querySelector('[data-alice-secret-calc]').innerHTML = `
                <div class="dh-calc-display">
                    <div class="dh-calc-step">
                        <span class="dh-var">s</span> =
                        <span class="dh-var">B</span><sup class="dh-var">a</sup> mod <span class="dh-var">p</span>
                    </div>
                </div>
            `

            this.el.querySelector('[data-bob-secret-calc]').innerHTML = `
                <div class="dh-calc-display">
                    <div class="dh-calc-step">
                        <span class="dh-var">s</span> =
                        <span class="dh-var">A</span><sup class="dh-var">b</sup> mod <span class="dh-var">p</span>
                    </div>
                </div>
            `

            this.el.querySelectorAll('[data-alice-result], [data-bob-result], [data-alice-secret-result], [data-bob-secret-result]').forEach(el => {
                el.classList.remove('dh-result-show')
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
