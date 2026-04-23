/**
 * rolling-code.js — Garage Door Rolling Code Visualiser
 *
 * Usage:
 *   <rolling-code></rolling-code>
 *   <rolling-code counter="123"></rolling-code>
 *   <rolling-code counter="123" window="8"></rolling-code>
 *   <rolling-code counter="123" window="8" drift="2"></rolling-code>
 *   <rolling-code intercept></rolling-code>
 *
 * Attributes:
 *   - counter: Initial shared counter value (default: 100)
 *   - window:  Receiver acceptance window for missed presses (default: 8)
 *   - drift:   Extra unseen remote presses before transmission (default: 0)
 *   - intercept: Show attacker packet capture note
 */

;(function () {

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    function clampInt(value, fallback, min, max) {
        const n = Number.parseInt(value, 10)
        if (Number.isNaN(n)) return fallback
        return Math.max(min, Math.min(max, n))
    }

    function randomHex(length) {
        const chars = 'ABCDEF0123456789'
        let out = ''
        for (let i = 0; i < length; i++) {
            out += chars[Math.floor(Math.random() * chars.length)]
        }
        return out
    }

    /**
     * Visual pseudo-code generator.
     * This is not real crypto and is used for teaching only.
     */
    function makeRollingCode(secret, counter) {
        const input = `${secret}:${counter}`
        let hash = 0x811c9dc5
        for (let i = 0; i < input.length; i++) {
            hash ^= input.charCodeAt(i)
            hash = (hash * 0x01000193) >>> 0
        }
        return hash.toString(16).toUpperCase().padStart(8, '0').match(/.{1,4}/g).join(' ')
    }

    // -------------------------------------------------------------------------
    // UI
    // -------------------------------------------------------------------------

    function buildUI(startCounter, windowSize, drift, showIntercept) {
        const wrapper = document.createElement('div')
        wrapper.className = 'exchange-wrapper'

        wrapper.innerHTML = `
            <div class="exchange-header">
                <div class="exchange-header-content">
                    <div class="exchange-title">Garage Door Rolling Codes</div>
                    <div class="exchange-subtitle">One button press, one new code. Old captured codes should not work again.</div>
                </div>
                <div class="rc-config">
                    <span class="rc-chip">Start Counter: <strong>${startCounter}</strong></span>
                    <span class="rc-chip">Window: <strong>${windowSize}</strong></span>
                    <span class="rc-chip">Drift: <strong>${drift}</strong></span>
                </div>
            </div>

            <div class="exchange-grid">

                <div class="exchange-party exchange-party1">
                    <div class="exchange-party-header">
                        <div class="exchange-party-name">🚗 Remote</div>
                    </div>

                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 1</span>: Shared setup</div>
                        <div class="exchange-step-content">
                            <div class="exchange-result exchange-show" data-remote-secret-result>
                                <div class="exchange-value-group exchange-value-party1">
                                    <span class="exchange-var">Secret</span> = <span class="exchange-value rc-code" data-remote-secret>?</span>
                                </div>
                                <span class="exchange-badge exchange-secret-badge">Shared Secret</span>
                            </div>
                            <div class="exchange-result exchange-show" data-remote-counter-result>
                                <div class="exchange-value-group exchange-value-party1">
                                    <span class="exchange-var">Counter</span> = <span class="exchange-value" data-remote-counter>?</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 2</span>: Button press increments counter</div>
                        <div class="exchange-step-content">
                            <div class="exchange-result" data-remote-next-counter-result>
                                <div class="exchange-value-group exchange-value-party1">
                                    <span class="exchange-var">Next Counter</span> = <span class="exchange-value" data-remote-next-counter>?</span>
                                </div>
                            </div>
                            <div class="exchange-result" data-remote-code-result>
                                <div class="exchange-value-group exchange-value-party1">
                                    <span class="exchange-var">Code</span> = <span class="exchange-value rc-code" data-remote-code>?</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 7</span>: Remote outcome</div>
                        <div class="exchange-step-content">
                            <div class="exchange-result" data-remote-outcome-result>
                                <div class="exchange-value-group exchange-value-success">
                                    <span class="exchange-var">Result</span> = <span class="exchange-value" data-remote-outcome>?</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="exchange-column">

                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 3</span>: Send counter</div>
                        <div class="exchange-arrow-grid">
                            <div class="exchange-arrow-group">
                                <div class="exchange-arrow exchange-arrow-right">
                                    <div class="exchange-value-group exchange-value-party1">
                                        <span class="exchange-var">Counter</span> = <span class="exchange-value" data-arrow-counter>?</span>
                                    </div>
                                    <span class="exchange-arrow-icon">→</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 4</span>: Send rolling code</div>
                        <div class="exchange-arrow-grid">
                            <div class="exchange-arrow-group">
                                <div class="exchange-arrow exchange-arrow-right">
                                    <div class="exchange-value-group exchange-value-party1">
                                        <span class="exchange-var">Code</span> = <span class="exchange-value rc-code" data-arrow-code>?</span>
                                    </div>
                                    <span class="exchange-arrow-icon">→</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    ${showIntercept ? `
                    <div class="exchange-eve">
                        <div class="exchange-eve-icon">👁️ Attacker captures packet</div>
                        <div class="exchange-eve-text">Can see: Counter + rolling code</div>
                        <div class="exchange-eve-text">Cannot compute future valid codes without secret</div>
                        <div class="exchange-eve-problem">Replay of old packet is rejected because counter is already used.</div>
                    </div>
                    ` : ''}

                </div>

                <div class="exchange-party exchange-party2">
                    <div class="exchange-party-header">
                        <div class="exchange-party-name">🏠 Garage Receiver</div>
                    </div>

                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 1</span>: Shared setup</div>
                        <div class="exchange-step-content">
                            <div class="exchange-result exchange-show" data-receiver-secret-result>
                                <div class="exchange-value-group exchange-value-party2">
                                    <span class="exchange-var">Secret</span> = <span class="exchange-value rc-code" data-receiver-secret>?</span>
                                </div>
                                <span class="exchange-badge exchange-secret-badge">Shared Secret</span>
                            </div>
                            <div class="exchange-result exchange-show" data-receiver-counter-result>
                                <div class="exchange-value-group exchange-value-party2">
                                    <span class="exchange-var">Stored Counter</span> = <span class="exchange-value" data-receiver-counter>?</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 5</span>: Check counter window</div>
                        <div class="exchange-step-content">
                            <div class="exchange-result" data-window-result>
                                <div class="exchange-value-group exchange-value-party2">
                                    <span class="exchange-var">Window Check</span> = <span class="exchange-value" data-window-check>?</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 6</span>: Verify code and act</div>
                        <div class="exchange-step-content">
                            <div class="exchange-result" data-verify-result>
                                <div class="exchange-value-group exchange-value-party2">
                                    <span class="exchange-var">Verify</span> = <span class="exchange-value" data-verify-check>?</span>
                                </div>
                            </div>
                            <div class="exchange-result" data-door-result>
                                <div class="exchange-value-group exchange-value-shared">
                                    <span class="exchange-var">Door</span> = <span class="exchange-value" data-door-state>?</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 7</span>: Update stored counter</div>
                        <div class="exchange-step-content">
                            <div class="exchange-result" data-updated-counter-result>
                                <div class="exchange-value-group exchange-value-party2">
                                    <span class="exchange-var">Stored Counter</span> = <span class="exchange-value" data-updated-counter>?</span>
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

    class RollingCodeAnimation extends window.ExchangeAnimation {
        constructor(el, startCounter, windowSize, drift, showIntercept) {
            const timing = {
                BASE: 500,
                get REVEAL() { return this.BASE },
                get STEP() { return this.BASE + 200 },
                get ANIMATE() { return this.STEP + 300 },
                get BETWEEN_STEPS() { return this.ANIMATE + 350 }
            }
            super(el, { timing })

            this.startCounter = startCounter
            this.windowSize = windowSize
            this.drift = drift
            this.showIntercept = showIntercept

            this.regenerateState()
        }

        getMaxSteps() {
            return 7
        }

        async executeStep(stepNumber) {
            switch (stepNumber) {
                case 1: await this.step1_setup(); break
                case 2: await this.step2_buttonPress(); break
                case 3: await this.step3_sendCounter(); break
                case 4: await this.step4_sendCode(); break
                case 5: await this.step5_checkWindow(); break
                case 6: await this.step6_verifyAndAct(); break
                case 7: await this.step7_updateCounter(); break
            }
        }

        resetState() {
            this.regenerateState()
        }

        setupDOM() {
            const q = (s) => this.el.querySelector(s)

            this.dom = {
                remote: {
                    secret: q('[data-remote-secret]'),
                    counter: q('[data-remote-counter]'),
                    nextCounter: q('[data-remote-next-counter]'),
                    code: q('[data-remote-code]'),
                    outcome: q('[data-remote-outcome]'),
                    nextCounterResult: q('[data-remote-next-counter-result]'),
                    codeResult: q('[data-remote-code-result]'),
                    outcomeResult: q('[data-remote-outcome-result]')
                },
                receiver: {
                    secret: q('[data-receiver-secret]'),
                    counter: q('[data-receiver-counter]'),
                    windowCheck: q('[data-window-check]'),
                    verify: q('[data-verify-check]'),
                    door: q('[data-door-state]'),
                    updatedCounter: q('[data-updated-counter]'),
                    windowResult: q('[data-window-result]'),
                    verifyResult: q('[data-verify-result]'),
                    doorResult: q('[data-door-result]'),
                    updatedCounterResult: q('[data-updated-counter-result]')
                },
                arrows: {
                    counter: q('[data-arrow-counter]'),
                    code: q('[data-arrow-code]')
                },
                exchangeSteps: this.el.querySelectorAll('.exchange-column .exchange-step'),
                eveNote: q('.exchange-eve')
            }
        }

        resetUI() {
            this.resetElementsToDefault([
                '[data-remote-secret]',
                '[data-remote-counter]',
                '[data-receiver-secret]',
                '[data-receiver-counter]',
                '[data-remote-next-counter]',
                '[data-remote-code]',
                '[data-arrow-counter]',
                '[data-arrow-code]',
                '[data-window-check]',
                '[data-verify-check]',
                '[data-door-state]',
                '[data-updated-counter]',
                '[data-remote-outcome]'
            ].join(', '))

            // Keep shared setup boxes visible on reset.
            this.el.querySelectorAll('[data-remote-secret-result], [data-remote-counter-result], [data-receiver-secret-result], [data-receiver-counter-result]').forEach(el => {
                el.classList.add(CSS_CLASSES.SHOW)
            })
        }

        regenerateState() {
            this.secret = randomHex(8)
            this.remoteCounter = this.startCounter
            this.receiverCounter = this.startCounter
            this.txCounter = this.remoteCounter + 1 + this.drift
            this.txCode = makeRollingCode(this.secret, this.txCounter)
            this.expectedCode = makeRollingCode(this.secret, this.txCounter)
            this.counterDelta = this.txCounter - this.receiverCounter
            this.inWindow = this.counterDelta > 0 && this.counterDelta <= this.windowSize
            this.codeMatches = this.txCode === this.expectedCode
            this.accepted = this.inWindow && this.codeMatches
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

        async step1_setup() {
            this.setStatus('Remote and receiver share the same secret and starting counter.', 'info')

            const remoteStep = this.dom.remote.secret.closest('.exchange-step')
            const receiverStep = this.dom.receiver.secret.closest('.exchange-step')
            this.activateStep(remoteStep)
            this.activateStep(receiverStep)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            this.dom.remote.secret.textContent = this.secret
            this.dom.remote.counter.textContent = String(this.remoteCounter)
            this.dom.receiver.secret.textContent = this.secret
            this.dom.receiver.counter.textContent = String(this.receiverCounter)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.completeStep(remoteStep)
            this.completeStep(receiverStep)
        }

        async step2_buttonPress() {
            const driftMsg = this.drift > 0
                ? `Remote was pressed ${this.drift} extra times out of range, then pressed again now.`
                : 'Remote button is pressed once and counter increments by 1.'
            this.setStatus(driftMsg, this.drift > 0 ? 'warning' : 'info')

            const stepEl = this.dom.remote.nextCounter.closest('.exchange-step')
            this.activateStep(stepEl)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            this.revealResult(this.dom.remote.nextCounterResult, this.dom.remote.nextCounter, String(this.txCounter))

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.revealResult(this.dom.remote.codeResult, this.dom.remote.code, this.txCode)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.completeStep(stepEl)
        }

        async step3_sendCounter() {
            this.setStatus('Remote sends counter value to receiver.', 'info')

            const stepEl = this.dom.exchangeSteps[0]
            this.activateStep(stepEl)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            await this.animateArrow(stepEl, this.dom.arrows.counter, String(this.txCounter))
            if (!this.isRunning) return

            this.completeStep(stepEl)
        }

        async step4_sendCode() {
            this.setStatus('Remote sends rolling code value.', 'info')

            const stepEl = this.dom.exchangeSteps[1]
            this.activateStep(stepEl)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            await this.animateArrow(stepEl, this.dom.arrows.code, this.txCode)
            if (!this.isRunning) return

            if (this.showIntercept && this.dom.eveNote) {
                this.dom.eveNote.classList.add(CSS_CLASSES.SHOW)
            }

            this.completeStep(stepEl)
        }

        async step5_checkWindow() {
            this.setStatus('Receiver checks whether counter is ahead but still inside allowed window.', 'info')

            const stepEl = this.dom.receiver.windowCheck.closest('.exchange-step')
            this.activateStep(stepEl)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            const msg = this.inWindow
                ? `Pass (delta ${this.counterDelta} <= window ${this.windowSize})`
                : `Fail (delta ${this.counterDelta} > window ${this.windowSize})`
            this.revealResult(this.dom.receiver.windowResult, this.dom.receiver.windowCheck, msg)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.completeStep(stepEl)
        }

        async step6_verifyAndAct() {
            this.setStatus('Receiver recomputes expected code from secret + counter, then decides to open or reject.', this.accepted ? 'success' : 'warning')

            const stepEl = this.dom.receiver.verify.closest('.exchange-step')
            this.activateStep(stepEl)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            this.revealResult(this.dom.receiver.verifyResult, this.dom.receiver.verify, this.codeMatches ? 'Pass (code matches)' : 'Fail (code mismatch)')

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.revealResult(this.dom.receiver.doorResult, this.dom.receiver.door, this.accepted ? '✅ Opens' : '⛔ Stays locked')

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.completeStep(stepEl)
        }

        async step7_updateCounter() {
            this.setStatus(this.accepted
                ? 'Receiver updates stored counter. Old captured packets now fail replay.'
                : 'Receiver does not update counter because validation failed.', this.accepted ? 'success' : 'warning')

            const remoteStep = this.dom.remote.outcome.closest('.exchange-step')
            const receiverStep = this.dom.receiver.updatedCounter.closest('.exchange-step')
            this.activateStep(remoteStep)
            this.activateStep(receiverStep)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            this.revealResult(this.dom.remote.outcomeResult, this.dom.remote.outcome, this.accepted ? 'Accepted' : 'Rejected')

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            const stored = this.accepted ? this.txCounter : this.receiverCounter
            this.revealResult(this.dom.receiver.updatedCounterResult, this.dom.receiver.updatedCounter, String(stored))

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.completeStep(remoteStep)
            this.completeStep(receiverStep)
        }
    }

    // -------------------------------------------------------------------------
    // Entry
    // -------------------------------------------------------------------------

    function processRollingCode() {
        document.querySelectorAll('.markdown-section rolling-code').forEach(el => {
            const startCounter = clampInt(el.getAttribute('counter'), 100, 0, 999999)
            const windowSize = clampInt(el.getAttribute('window'), 8, 1, 100)
            const drift = clampInt(el.getAttribute('drift'), 0, 0, 500)
            const showIntercept = el.hasAttribute('intercept')

            el.innerHTML = ''
            el.appendChild(buildUI(startCounter, windowSize, drift, showIntercept))
            new RollingCodeAnimation(el, startCounter, windowSize, drift, showIntercept)
        })
    }

    const docsifyRollingCode = function (hook) {
        hook.doneEach(processRollingCode)
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyRollingCode, window.$docsify.plugins || [])

})()
