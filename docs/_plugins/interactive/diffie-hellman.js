/**
 * docsify-diffie-hellman.js - Interactive Diffie-Hellman Key Exchange Visualizer
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
 *   <diffie-hellman colour></diffie-hellman>
 *   <diffie-hellman colour="#FF5733"></diffie-hellman>
 *   <diffie-hellman intercept></diffie-hellman>
 *
 * Attributes:
 *   - p: Prime modulus (default: 23, recommended range: 11-31 for visualization)
 *   - g: Generator base (default: 3, must be coprime to p)
 *   - colour: Enable color mixing mode (optional hex color for base, default auto-generated)
 *   - intercept: Show Eve's eavesdropping perspective (optional)
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

    // -------------------------------------------------------------------------
    // Color Mode Helpers
    // -------------------------------------------------------------------------

    /**
     * Convert hex color to RGB object
     */
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null
    }

    /**
     * Convert RGB object to hex color
     */
    function rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = Math.round(x).toString(16)
            return hex.length === 1 ? '0' + hex : hex
        }).join('')
    }

    /**
     * Mix two colors using multiplicative blending (subtractive like paint)
     * Perfectly commutative: mix(mix(base, a), b) = mix(mix(base, b), a)
     * Simulates paint mixing - colors get darker/richer
     */
    function mixColors(color1, color2) {
        const rgb1 = hexToRgb(color1)
        const rgb2 = hexToRgb(color2)
        // Multiply blend - like layering paint, colors darken
        return rgbToHex(
            Math.round((rgb1.r * rgb2.r) / 255),
            Math.round((rgb1.g * rgb2.g) / 255),
            Math.round((rgb1.b * rgb2.b) / 255)
        )
    }

    /**
     * Generate a bright color with constrained channels for paint-like mixing
     * @param {string} dominantChannel - 'r', 'g', or 'b' - which channel is brightest
     */
    function generateConstrainedColor(dominantChannel) {
        // For subtractive mixing, start with BRIGHT colors
        const bright = 255  // Full brightness
        const medium = 100 + Math.floor(Math.random() * 100)  // 100-200 range
        const low = 100 + Math.floor(Math.random() * 80)     // 100-180 range

        if (dominantChannel === 'r') {
            return rgbToHex(bright, medium, low)  // Warm colors (red-orange-pink)
        } else if (dominantChannel === 'g') {
            return rgbToHex(low, bright, medium)  // Cool colors (green-cyan)
        } else { // 'b'
            return rgbToHex(medium, low, bright)  // Cool colors (blue-purple)
        }
    }



    // -------------------------------------------------------------------------
    // HTML UI Builder
    // -------------------------------------------------------------------------

    function buildUI(p, g, mode = 'numeric', baseColor = '#9370DB', showIntercept = true) {
        const wrapper = document.createElement('div')
        wrapper.className = 'exchange-wrapper'

        // Build public params section based on mode
        const publicParamsHTML = mode === 'color' ? `
            <div class="dh-public-params">
                <div class="dh-param-label">Public Parameter (known to everyone)</div>
                <div class="dh-params-row">
                    <div class="dh-param">
                        <span class="dh-param-name">base</span>
                        <span class="dh-param-equals">=</span>
                        <span class="dh-color-swatch" style="--dh-swatch-color: ${baseColor};">${baseColor}</span>
                    </div>
                </div>
            </div>
        ` : `
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
        `

        const titleText = mode === 'color'
            ? 'Diffie-Hellman Key Exchange (Color Mixing)'
            : 'Diffie-Hellman Key Exchange'

        const subtitleText = mode === 'color'
            ? 'Watch Alice and Bob mix colors to create a shared secret'
            : 'Watch Alice and Bob establish a shared secret over a public channel'

        wrapper.innerHTML = `
            <div class="exchange-header">
                <div class="exchange-header-content">
                    <div class="exchange-title">${titleText}</div>
                    <div class="exchange-subtitle">${subtitleText}</div>
                </div>
                ${publicParamsHTML}
            </div>

            <div class="exchange-grid">

                <!-- Alice's Side -->

                <div class="exchange-party exchange-party1">
                    <div class="exchange-party-header">
                        <div class="exchange-party-name">👩 Alice</div>
                    </div>

                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 1</span>: Choose private ${mode === 'color' ? 'colour' : 'key'}</div>
                        <div class="exchange-step-content">
                            <div class="exchange-result exchange-show">
                                <div class="exchange-value-group exchange-value-party1">
                                    <span class="exchange-var">a</span> = <span class="exchange-value" data-alice-a>?</span>
                                </div>
                                <span class="exchange-badge exchange-secret-badge">Private ${mode === 'color' ? 'Colour' : 'Key'}</span>
                            </div>
                        </div>
                    </div>

                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 2</span>: Calculate public ${mode === 'color' ? 'colour' : 'value'}</div>
                        <div class="exchange-step-content">
                            <div class="dh-calculation" data-alice-calc>
                                <div class="dh-calc-display">
                                    <div class="dh-calc-step dh-calc-animate">
                                        <span class="exchange-var">A</span> = ${mode === 'color' ? 'mix(<span class="exchange-var">base</span>, <span class="exchange-var">a</span>)' : '<span class="exchange-var">g</span><sup class="exchange-var">a</sup> mod <span class="exchange-var">p</span>'}
                                    </div>
                                </div>
                            </div>
                            <div class="exchange-result exchange-show" data-alice-result>
                                <div class="exchange-value-group exchange-value-party1">
                                    <span class="exchange-var">A</span> = <span class="exchange-value" data-alice-public>?</span>
                                </div>
                                <span class="exchange-badge exchange-public-badge">Public ${mode === 'color' ? 'Colour' : 'Value'}</span>
                            </div>
                        </div>
                    </div>

                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 4</span>: Receive Bob's public ${mode === 'color' ? 'colour' : 'value'}</div>
                        <div class="exchange-step-content">
                            <div class="exchange-received">
                                <span class="exchange-label">Received</span>
                                <div class="exchange-value-group exchange-value-party2">
                                    <span class="exchange-var">B</span> = <span class="exchange-value" data-alice-received>?</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 5</span>: Calculate shared secret</div>
                        <div class="exchange-step-content">
                            <div class="dh-calculation" data-alice-secret-calc>
                                <div class="dh-calc-display">
                                    <div class="dh-calc-step dh-calc-animate">
                                        <span class="exchange-var">s</span> = ${mode === 'color' ? 'mix(<span class="exchange-var">B</span>, <span class="exchange-var">a</span>)' : '<span class="exchange-var">B</span><sup class="exchange-var">a</sup> mod <span class="exchange-var">p</span>'}
                                    </div>
                                </div>
                            </div>
                            <div class="exchange-result dh-shared-secret exchange-show" data-alice-secret-result>
                                <div class="exchange-value-group exchange-value-party1">
                                    <span class="exchange-var">s</span> = <span class="exchange-value" data-alice-secret>?</span>
                                </div>
                                <span class="exchange-badge exchange-shared-badge">Shared Secret</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Exchange Arrow -->

                <div class="exchange-column">
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 3</span>: Exchange <span class="exchange-badge exchange-public-badge">Public</span></div>
                        <div class="exchange-arrow-grid">
                            <div class="exchange-arrow-group">
                                <div class="exchange-arrow exchange-arrow-right">
                                    <div class="exchange-value-group exchange-value-party1">
                                        <span class="exchange-var">A</span> = <span class="exchange-value" data-arrow-a>?</span>
                                    </div>
                                    <span class="exchange-arrow-icon">→</span>
                                </div>
                                <div class="exchange-arrow exchange-arrow-left">
                                    <div class="exchange-value-group exchange-value-party2">
                                        <span class="exchange-var">B</span> = <span class="exchange-value" data-arrow-b>?</span>
                                    </div>
                                    <span class="exchange-arrow-icon">←</span>
                                </div>
                            </div>
                            ${showIntercept ? `
                            <div class="exchange-eve">
                                <div class="exchange-eve-icon">👁️ Eve (eavesdropper)</div>
                                <div class="exchange-eve-text">
                                    Can see: ${mode === 'color' ? 'base, A, B' : 'p, g, A, B' }
                                </div>
                                <div class="exchange-eve-text">
                                    Cannot see: a, b, s
                                </div>
                                <div class="exchange-eve-problem">
                                    ${mode === 'color' ?
                                        'Separating mixed colours to find a or b is extremely hard!'
                                        : 'Computing a or b from public values is the discrete logarithm problem and is extremely hard!'
                                    }
                                </div>
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

                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 1</span>: Choose private ${mode === 'color' ? 'colour' : 'key'}</div>
                        <div class="exchange-step-content">
                            <div class="exchange-result exchange-show">
                                <div class="exchange-value-group exchange-value-party2">
                                    <span class="exchange-var">b</span> = <span class="exchange-value" data-bob-b>?</span>
                                </div>
                                <span class="exchange-badge exchange-secret-badge">Private ${mode === 'color' ? 'Colour' : 'Key'}</span>
                            </div>
                        </div>
                    </div>

                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 2</span>: Calculate public ${mode === 'color' ? 'colour' : 'value'}</div>
                        <div class="exchange-step-content">
                            <div class="dh-calculation" data-bob-calc>
                                <div class="dh-calc-display">
                                    <div class="dh-calc-step dh-calc-animate">
                                        <span class="exchange-var">B</span> = ${mode === 'color' ? 'mix(<span class="exchange-var">base</span>, <span class="exchange-var">b</span>)' : '<span class="exchange-var">g</span><sup class="exchange-var">b</sup> mod <span class="exchange-var">p</span>'}
                                    </div>
                                </div>
                            </div>
                            <div class="exchange-result exchange-show" data-bob-result>
                                <div class="exchange-value-group exchange-value-party2">
                                    <span class="exchange-var">B</span> = <span class="exchange-value" data-bob-public>?</span>
                                </div>
                                <span class="exchange-badge exchange-public-badge">Public ${mode === 'color' ? 'Colour' : 'Value'}</span>
                            </div>
                        </div>
                    </div>

                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 4</span>: Receive Alice's public ${mode === 'color' ? 'colour' : 'value'}</div>
                        <div class="exchange-step-content">
                            <div class="exchange-received">
                                <span class="exchange-label">Received</span>
                                <div class="exchange-value-group exchange-value-party1">
                                    <span class="exchange-var">A</span> = <span class="exchange-value" data-bob-received>?</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 5</span>: Calculate shared secret</div>
                        <div class="exchange-step-content">
                            <div class="dh-calculation" data-bob-secret-calc>
                                <div class="dh-calc-display">
                                    <div class="dh-calc-step dh-calc-animate">
                                        <span class="exchange-var">s</span> = ${mode === 'color' ? 'mix(<span class="exchange-var">A</span>, <span class="exchange-var">b</span>)' : '<span class="exchange-var">A</span><sup class="exchange-var">b</sup> mod <span class="exchange-var">p</span>'}
                                    </div>
                                </div>
                            </div>
                            <div class="exchange-result dh-shared-secret exchange-show" data-bob-secret-result>
                                <div class="exchange-value-group exchange-value-party2">
                                    <span class="exchange-var">s</span> = <span class="exchange-value" data-bob-secret>?</span>
                                </div>
                                <span class="exchange-badge exchange-shared-badge">Shared Secret</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="exchange-footer">
                <div class="exchange-controls">
                    <button class="exchange-btn exchange-btn-start dh-btn-start">
                        <span class="btn-icon">▶</span>
                        <span class="btn-text">Start</span>
                    </button>
                    <button class="exchange-btn exchange-btn-reset dh-btn-reset">
                        <span class="btn-icon">↺</span>
                        <span class="btn-text">Reset</span>
                    </button>
                    <button class="exchange-btn exchange-btn-step dh-btn-step">
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

    // CSS class name constants (extend base with plugin-specific)
    const CSS_CLASSES = {
        ...window.ExchangeCore.CSS_CLASSES,
        CALC_ANIMATE: 'dh-calc-animate'
    }

    // Helper: Create formula HTML template
    function createFormulaHTML(resultVar, baseVar, expVar, modVar) {
        return `
            <div class="dh-calc-display">
                <div class="dh-calc-step dh-calc-animate">
                    <span class="exchange-var">${resultVar}</span> =
                    <span class="exchange-var">${baseVar}</span><sup class="exchange-var">${expVar}</sup> mod <span class="exchange-var">${modVar}</span>
                </div>
            </div>
        `
    }

    class DiffieHellmanAnimation extends window.ExchangeAnimation {
        constructor(el, p, g, mode = 'numeric', baseColor = '#9370DB', showIntercept = true) {
            // Animation timing configuration
            const timing = {
                BASE: 500,
                get REVEAL() { return this.BASE },
                get STEP() { return this.BASE + 200 },
                get ANIMATE() { return this.STEP + 400 },
                get CALC_WAIT() { return this.ANIMATE },
                get BETWEEN_STEPS() { return this.ANIMATE + 400 }
            }

            super(el, { timing })

            this.mode = mode
            this.showIntercept = showIntercept
            this.p = p
            this.g = g
            this.baseColor = baseColor

            // Generate initial values
            this.regenerateKeys()
            // Generate initial values
            this.regenerateKeys()
        }

        // -------------------------------------------------------------------------
        // Base Class Implementation
        // -------------------------------------------------------------------------

        getMaxSteps() {
            return this.showIntercept ? 9 : 7
        }

        async executeStep(stepNumber) {
            switch (stepNumber) {
                case 1: await this.step1_ChoosePrivateKeys(); break
                case 2: await this.step2_AliceCalculatesPublic(); break
                case 3: await this.step3_BobCalculatesPublic(); break
                case 4: await this.step4_Exchange(); break
                case 5: await this.step5_AliceCalculatesSecret(); break
                case 6: await this.step6_BobCalculatesSecret(); break
                case 7: await this.step7_HighlightSharedSecret(); break
                case 8:
                    if (this.showIntercept) {
                        await this.step8_ShowEvesProblem()
                    }
                    break
                case 9:
                    if (this.showIntercept) {
                        await this.step9_Complete()
                    }
                    break
            }
        }

        resetState() {
            this.regenerateKeys()
        }

        setupDOM() {
            // Cache frequently accessed DOM elements
            this.dom = {
                alice: {
                    privateKey: this.el.querySelector('[data-alice-a]'),
                    publicKey: this.el.querySelector('[data-alice-public]'),
                    calc: this.el.querySelector('[data-alice-calc]'),
                    result: this.el.querySelector('[data-alice-result]'),
                    received: this.el.querySelector('[data-alice-received]'),
                    secretCalc: this.el.querySelector('[data-alice-secret-calc]'),
                    secretResult: this.el.querySelector('[data-alice-secret-result]'),
                    secret: this.el.querySelector('[data-alice-secret]')
                },
                bob: {
                    privateKey: this.el.querySelector('[data-bob-b]'),
                    publicKey: this.el.querySelector('[data-bob-public]'),
                    calc: this.el.querySelector('[data-bob-calc]'),
                    result: this.el.querySelector('[data-bob-result]'),
                    received: this.el.querySelector('[data-bob-received]'),
                    secretCalc: this.el.querySelector('[data-bob-secret-calc]'),
                    secretResult: this.el.querySelector('[data-bob-secret-result]'),
                    secret: this.el.querySelector('[data-bob-secret]')
                },
                arrows: {
                    a: this.el.querySelector('[data-arrow-a]'),
                    b: this.el.querySelector('[data-arrow-b]'),
                    right: this.el.querySelector('.exchange-arrow-right'),
                    left: this.el.querySelector('.exchange-arrow-left')
                },
                exchange: this.el.querySelector('.exchange-column .exchange-step'),
                eveNote: this.el.querySelector('.exchange-eve')
            }
        }

        resetUI() {
            // Reset result containers
            this.el.querySelectorAll('[data-alice-result], [data-bob-result], [data-alice-secret-result], [data-bob-secret-result]').forEach(el => {
                el.classList.remove(CSS_CLASSES.HIGHLIGHT, CSS_CLASSES.PULSE)
            })

            if (this.dom.eveNote) {
                this.dom.eveNote.classList.remove(CSS_CLASSES.SHOW)
            }

            // Reset received value containers
            this.el.querySelectorAll('.exchange-received').forEach(el => {
                el.classList.remove(CSS_CLASSES.SHOW, CSS_CLASSES.PULSE)
            })

            // Reset all displayed values to '?'
            this.resetElementsToDefault('[data-alice-a], [data-alice-public], [data-alice-received], [data-alice-secret], [data-arrow-a]')
            this.resetElementsToDefault('[data-bob-b], [data-bob-public], [data-bob-received], [data-bob-secret], [data-arrow-b]')

            // Reset calculations to initial formulas
            if (this.isColorMode) {
                const createColorFormulaHTML = (resultVar, baseVar, secretVar) => `
                    <div class="dh-calc-display">
                        <div class="dh-calc-step dh-calc-animate">
                            <span class="exchange-var">${resultVar}</span> = mix(<span class="exchange-var">${baseVar}</span>, <span class="exchange-var">${secretVar}</span>)
                        </div>
                    </div>
                `
                this.dom.alice.calc.innerHTML = createColorFormulaHTML('A', 'base', 'a')
                this.dom.bob.calc.innerHTML = createColorFormulaHTML('B', 'base', 'b')
                this.dom.alice.secretCalc.innerHTML = createColorFormulaHTML('s', 'B', 'a')
                this.dom.bob.secretCalc.innerHTML = createColorFormulaHTML('s', 'A', 'b')
            } else {
                this.dom.alice.calc.innerHTML = createFormulaHTML('A', 'g', 'a', 'p')
                this.dom.bob.calc.innerHTML = createFormulaHTML('B', 'g', 'b', 'p')
                this.dom.alice.secretCalc.innerHTML = createFormulaHTML('s', 'B', 'a', 'p')
                this.dom.bob.secretCalc.innerHTML = createFormulaHTML('s', 'A', 'b', 'p')
            }
        }

        // -------------------------------------------------------------------------
        // Helper Methods
        // -------------------------------------------------------------------------

        /**
         * Convenience property to check if in color mode
         * @returns {boolean}
         */
        get isColorMode() {
            return this.mode === 'color'
        }

        regenerateKeys() {
            if (this.isColorMode) {
                // Color mode - regenerate constrained colors
                this.a = generateConstrainedColor('b')
                this.b = generateConstrainedColor('g')
                this.A = mixColors(this.baseColor, this.a)
                this.B = mixColors(this.baseColor, this.b)
                this.secretAlice = mixColors(this.B, this.a)
                this.secretBob = mixColors(this.A, this.b)
            } else {
                // Numeric mode - regenerate keys
                this.a = generatePrivateKey(this.p)
                this.b = generatePrivateKey(this.p)
                while (this.a === this.b) {
                    this.b = generatePrivateKey(this.p)
                }
                this.A = modPow(this.g, this.a, this.p)
                this.B = modPow(this.g, this.b, this.p)
                this.secretAlice = modPow(this.B, this.a, this.p)
                this.secretBob = modPow(this.A, this.b, this.p)
            }
        }

        // Helper: Format color display (hex code with coloured background)
        formatColorDisplay(color) {
            return `<span class="dh-color-swatch" style="--dh-swatch-color: ${color};">${color}</span>`
        }

        // Helper: Generic calculation method for public or secret values
        async calculateValue(party, valueType) {
            const isAlice = party === 'alice'
            const isPublic = valueType === 'public'
            const name = isAlice ? 'Alice' : 'Bob'
            const pronoun = isAlice ? 'her' : 'his'

            const calcContainer = isPublic ? this.dom[party].calc : this.dom[party].secretCalc
            const resultContainer = isPublic ? this.dom[party].result : this.dom[party].secretResult
            const displayEl = isPublic ? this.dom[party].publicKey : this.dom[party].secret
            const stepEl = calcContainer.closest('.exchange-step')

            this.activateStep(stepEl)

            if (this.isColorMode) {
                // Color mode
                let baseColor, secretColor, resultColor, resultVar, baseVar, secretVar, statusText

                if (isPublic) {
                    // Public value calculation: mix base with private color
                    baseColor = this.baseColor
                    secretColor = isAlice ? this.a : this.b
                    resultColor = isAlice ? this.A : this.B
                    resultVar = isAlice ? 'A' : 'B'
                    baseVar = 'base'
                    secretVar = isAlice ? 'a' : 'b'
                    statusText = `${name} mixes ${pronoun} secret color with base color`
                } else {
                    // Shared secret: mix received public value with own private color
                    baseColor = isAlice ? this.B : this.A
                    secretColor = isAlice ? this.a : this.b
                    resultColor = isAlice ? this.secretAlice : this.secretBob
                    resultVar = 's'
                    baseVar = isAlice ? 'B' : 'A'
                    secretVar = isAlice ? 'a' : 'b'
                    statusText = `${name} mixes received color with ${pronoun} secret color`
                }

                this.setStatus(statusText, 'info')

                await this.showColorMixing(
                    calcContainer,
                    resultContainer,
                    resultVar,
                    baseVar,
                    secretVar,
                    baseColor,
                    secretColor,
                    resultColor
                )

                displayEl.innerHTML = this.formatColorDisplay(resultColor)
                resultContainer.classList.add(CSS_CLASSES.PULSE)
            } else {
                // Numeric mode
                let resultVar, baseVar, expVar, baseVal, expVal, finalResult

                if (isPublic) {
                    resultVar = isAlice ? 'A' : 'B'
                    baseVar = 'g'
                    expVar = isAlice ? 'a' : 'b'
                    baseVal = this.g
                    expVal = isAlice ? this.a : this.b
                    finalResult = isAlice ? this.A : this.B
                    this.setStatus(`${name} calculates ${pronoun} public value: ${resultVar} = ${baseVal}^${expVal} mod ${this.p}`, 'info')
                } else {
                    resultVar = 's'
                    baseVar = isAlice ? 'B' : 'A'
                    expVar = isAlice ? 'a' : 'b'
                    baseVal = isAlice ? this.B : this.A
                    expVal = isAlice ? this.a : this.b
                    finalResult = isAlice ? this.secretAlice : this.secretBob
                    this.setStatus(`${name} calculates shared secret: ${resultVar} = ${baseVal}^${expVal} mod ${this.p}`, 'info')
                }

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
                resultContainer.classList.add(CSS_CLASSES.PULSE)
            }

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return
            this.completeStep(stepEl)
        }

        // -------------------------------------------------------------------------
        // Step Implementations
        // -------------------------------------------------------------------------

        async step1_ChoosePrivateKeys() {
            const keyOrColor = this.isColorMode ? 'color' : 'key'
            this.setStatus(`Alice and Bob each choose a private ${keyOrColor} (kept secret)`, 'info')

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return
            if (this.isColorMode) {
                this.dom.alice.privateKey.innerHTML = this.formatColorDisplay(this.a)
            } else {
                this.dom.alice.privateKey.textContent = this.a
            }
            const alicePrivateResult = this.dom.alice.privateKey.closest('.exchange-result')
            alicePrivateResult.classList.add(CSS_CLASSES.PULSE)
            this.activateStep(this.dom.alice.privateKey.closest('.exchange-step'))

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return
            if (this.isColorMode) {
                this.dom.bob.privateKey.innerHTML = this.formatColorDisplay(this.b)
            } else {
                this.dom.bob.privateKey.textContent = this.b
            }
            const bobPrivateResult = this.dom.bob.privateKey.closest('.exchange-result')
            bobPrivateResult.classList.add(CSS_CLASSES.PULSE)
            this.activateStep(this.dom.bob.privateKey.closest('.exchange-step'))

            // Remove highlighting after reveal completes
            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return
            this.completeStep(this.dom.alice.privateKey.closest('.exchange-step'))
            this.completeStep(this.dom.bob.privateKey.closest('.exchange-step'))
        }

        async step2_AliceCalculatesPublic() {
            await this.calculateValue('alice', 'public')
        }

        async step3_BobCalculatesPublic() {
            await this.calculateValue('bob', 'public')
        }

        async step4_Exchange() {
            const valueOrColor = this.isColorMode ? 'colors' : 'values'
            this.setStatus(`Alice and Bob exchange their public ${valueOrColor} over the public channel`, 'info')

            this.activateStep(this.dom.exchange)

            // Show values/colors in arrows
            if (this.isColorMode) {
                this.dom.arrows.a.innerHTML = this.formatColorDisplay(this.A)
                this.dom.arrows.b.innerHTML = this.formatColorDisplay(this.B)
            } else {
                this.dom.arrows.a.textContent = this.A
                this.dom.arrows.b.textContent = this.B
            }
            // Show and pulse arrows
            this.dom.arrows.right.classList.add(CSS_CLASSES.SHOW, CSS_CLASSES.PULSE)
            this.dom.arrows.left.classList.add(CSS_CLASSES.SHOW, CSS_CLASSES.PULSE)

            // Alice sends A to Bob
            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return
            this.dom.arrows.right.classList.add(CSS_CLASSES.ANIMATE)

            await this.sleep(this.TIMING.ANIMATE)
            if (!this.isRunning) return
            if (this.isColorMode) {
                this.dom.bob.received.innerHTML = this.formatColorDisplay(this.A)
            } else {
                this.dom.bob.received.textContent = this.A
            }
            const bobReceivedContainer = this.dom.bob.received.closest('.exchange-received')
            bobReceivedContainer.classList.add(CSS_CLASSES.PULSE)
            bobReceivedContainer.classList.add(CSS_CLASSES.SHOW)
            this.activateStep(this.dom.bob.received.closest('.exchange-step'))

            // Bob sends B to Alice
            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return
            this.dom.arrows.left.classList.add(CSS_CLASSES.ANIMATE)

            await this.sleep(this.TIMING.ANIMATE)
            if (!this.isRunning) return
            if (this.isColorMode) {
                this.dom.alice.received.innerHTML = this.formatColorDisplay(this.B)
            } else {
                this.dom.alice.received.textContent = this.B
            }
            const aliceReceivedContainer = this.dom.alice.received.closest('.exchange-received')
            aliceReceivedContainer.classList.add(CSS_CLASSES.PULSE)
            aliceReceivedContainer.classList.add(CSS_CLASSES.SHOW)
            this.activateStep(this.dom.alice.received.closest('.exchange-step'))

            // Remove highlighting after exchange completes
            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return
            this.completeStep(this.dom.exchange)
            this.completeStep(this.dom.bob.received.closest('.exchange-step'))
            this.completeStep(this.dom.alice.received.closest('.exchange-step'))
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
            if (!this.showIntercept) return

            this.setStatus('Eve can see all public values, but cannot calculate the shared secret 😡', 'warning')

            this.dom.eveNote.classList.add(CSS_CLASSES.SHOW)
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
            step2.innerHTML = `<span class="exchange-var">${resultVar}</span> = ${baseVal}<sup>${expVal}</sup> mod ${modVal}`
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
            step3.innerHTML = `<span class="exchange-var">${resultVar}</span> = ${fullValue.toLocaleString()} mod ${modVal}`
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
            step4.innerHTML = `<span class="exchange-var">${resultVar}</span> = <strong>${finalResult}</strong>`
            display.appendChild(step4)
            // Trigger animation after DOM insertion
            requestAnimationFrame(() => {
                step4.classList.add(CSS_CLASSES.CALC_ANIMATE)
            })

            // Show final result badge after animation
            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return
            resultContainer.classList.add(CSS_CLASSES.SHOW)
        }

        async showColorMixing(calcContainer, resultContainer, resultVar, baseVar, secretVar, baseColor, secretColor, resultColor) {
            const display = calcContainer.querySelector('.dh-calc-display')

            // The initial formula is already in the HTML, just wait a bit
            await this.sleep(this.TIMING.CALC_WAIT)
            if (!this.isRunning) return

            // Step 2: Show mixing operation with actual colors
            const step2 = document.createElement('div')
            step2.className = 'dh-calc-step'
            step2.innerHTML = `<span class="exchange-var">${resultVar}</span> = mix(${this.formatColorDisplay(baseColor)}, ${this.formatColorDisplay(secretColor)})`
            display.appendChild(step2)
            requestAnimationFrame(() => {
                step2.classList.add(CSS_CLASSES.CALC_ANIMATE)
            })
            await this.sleep(this.TIMING.CALC_WAIT)
            if (!this.isRunning) return

            // Step 3: Show final result
            const step3 = document.createElement('div')
            step3.className = 'dh-calc-step'
            step3.innerHTML = `<span class="exchange-var">${resultVar}</span> = <strong>${this.formatColorDisplay(resultColor)}</strong>`
            display.appendChild(step3)
            requestAnimationFrame(() => {
                step3.classList.add(CSS_CLASSES.CALC_ANIMATE)
            })

            // Show final result badge after animation
            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return
            resultContainer.classList.add(CSS_CLASSES.SHOW)
        }
    }

    // -------------------------------------------------------------------------
    // Plugin entry point
    // -------------------------------------------------------------------------

    function processDiffieHellman() {
        document.querySelectorAll('.markdown-section diffie-hellman').forEach(el => {
            // Check if intercept mode is enabled
            const showIntercept = el.hasAttribute('intercept')

            // Check if color mode is enabled
            const isColorMode = el.hasAttribute('colour') || el.hasAttribute('color')

            if (isColorMode) {
                // Color mode - use base color
                let baseColor = el.getAttribute('colour') || el.getAttribute('color') || el.getAttribute('base')

                // If no color specified, generate a constrained red-heavy color
                if (!baseColor) {
                    baseColor = generateConstrainedColor('r')
                } else {
                    // Validate hex color format
                    if (!/^#[0-9A-F]{6}$/i.test(baseColor)) {
                        el.innerHTML = '<div class="dh-error">Error: base color must be in hex format (e.g., #9370DB)</div>'
                        return
                    }
                }

                el.innerHTML = ''
                el.appendChild(buildUI(null, null, 'color', baseColor, showIntercept))

                // Initialize animation controller in color mode
                new DiffieHellmanAnimation(el, null, null, 'color', baseColor, showIntercept)
            } else {
                // Numeric mode
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
                el.appendChild(buildUI(p, g, 'numeric', null, showIntercept))

                // Initialize animation controller
                new DiffieHellmanAnimation(el, p, g, 'numeric', null, showIntercept)
            }
        })
    }

    const docsifyDiffieHellman = function (hook) {
        hook.doneEach(processDiffieHellman)
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyDiffieHellman, window.$docsify.plugins || [])

})()
