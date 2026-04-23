/**
 * exchange-core.js - Shared core library for cryptographic exchange animations
 *
 * Provides reusable base class for exchange-style animations:
 *   - Animation state management (running, stepping, aborting)
 *   - Control button management (start, reset, step)
 *   - Status display
 *   - CSS class utilities
 *   - Timing and sleep utilities
 *   - Common animation flow patterns
 *
 * Usage:
 *   Extend ExchangeAnimation class and implement:
 *     - getMaxSteps(): number
 *     - executeStep(stepNumber): Promise<void>
 *     - resetState(): void
 *     - setupDOM(): void (optional - for custom DOM caching)
 *
 * Consumers:
 *   - sym-asym.js
 *   - diffie-hellman.js
 */

;(function () {

    // -------------------------------------------------------------------------
    // Shared Constants
    // -------------------------------------------------------------------------

    const CSS_CLASSES = {
        ACTIVE: 'exchange-active',
        COMPLETED: 'exchange-completed',
        SHOW: 'exchange-show',
        PULSE: 'exchange-pulse',
        ANIMATE: 'exchange-animate',
        HIGHLIGHT: 'exchange-highlight'
    }

    const DEFAULT_TIMING = {
        BASE: 500,
        REVEAL: 500,
        STEP: 700,
        ANIMATE: 1100,
        BETWEEN_STEPS: 1500
    }

    // -------------------------------------------------------------------------
    // Base Exchange Animation Class
    // -------------------------------------------------------------------------

    /**
     * Abstract base class for exchange-style cryptographic animations.
     * Provides common animation infrastructure, state management, and control flow.
     *
     * Subclasses must implement:
     *   - getMaxSteps(): number - Return the total number of animation steps
     *   - executeStep(stepNumber): Promise<void> - Execute a specific step (1-indexed)
     *   - resetState(): void - Reset animation-specific state
     *
     * Subclasses may optionally implement:
     *   - setupDOM(): void - Cache DOM references for performance
     *   - resetUI(): void - Reset visual elements to initial state
     */
    class ExchangeAnimation {
        /**
         * @param {HTMLElement} el - The container element
         * @param {Object} options - Configuration options
         * @param {Object} options.timing - Custom timing overrides (BASE, REVEAL, STEP, ANIMATE, BETWEEN_STEPS)
         */
        constructor(el, options = {}) {
            this.el = el

            // Animation state
            this.isRunning = false
            this.currentStep = 0
            this.executingStep = false
            this.skipAnimations = false

            // Timing configuration (can be overridden by subclass)
            this.TIMING = { ...DEFAULT_TIMING, ...(options.timing || {}) }

            // Find control elements
            this.statusEl = el.querySelector('.exchange-status')
            this.startBtn = el.querySelector('.exchange-btn-start')
            this.resetBtn = el.querySelector('.exchange-btn-reset')
            this.stepBtn = el.querySelector('.exchange-btn-step')

            // Bind event handlers
            this.startBtn.addEventListener('click', () => this.start())
            this.resetBtn.addEventListener('click', () => this.reset())
            this.stepBtn.addEventListener('click', () => this.nextStep())

            // Allow subclass to setup additional DOM caching
            if (this.setupDOM) {
                this.setupDOM()
            }

            this.updateControls()
        }

        // -------------------------------------------------------------------------
        // Abstract Methods (to be implemented by subclass)
        // -------------------------------------------------------------------------

        /**
         * Get the maximum number of steps for this animation
         * @abstract
         * @returns {number} Total step count
         */
        getMaxSteps() {
            throw new Error('getMaxSteps() must be implemented by subclass')
        }

        /**
         * Execute a specific step
         * @abstract
         * @param {number} stepNumber - The step to execute (1-indexed)
         * @returns {Promise<void>}
         */
        async executeStep(stepNumber) {
            throw new Error('executeStep() must be implemented by subclass')
        }

        /**
         * Reset the animation state (regenerate values, etc.)
         * Called before UI reset
         * @abstract
         */
        resetState() {
            throw new Error('resetState() must be implemented by subclass')
        }

        /**
         * Optional: Cache DOM elements for performance
         * Override in subclass to set up this.dom object
         */
        setupDOM() {
            // Optional - subclasses can override if needed
        }

        /**
         * Optional: Reset UI elements to initial state
         * Override in subclass to reset visual elements
         */
        resetUI() {
            // Optional - subclasses can override if needed
        }

        // -------------------------------------------------------------------------
        // Control Flow
        // -------------------------------------------------------------------------

        async start() {
            if (this.isRunning) return

            this.isRunning = true
            this.updateControls()

            const maxSteps = this.getMaxSteps()
            while (this.currentStep < maxSteps && this.isRunning) {
                await this.nextStep()
                if (!this.isRunning) break
                await this.sleep(this.TIMING.BETWEEN_STEPS)
            }

            this.isRunning = false
            this.updateControls()
        }

        async nextStep() {
            const maxSteps = this.getMaxSteps()
            if (this.currentStep >= maxSteps) return

            // Track if we were already running before this call
            const wasRunning = this.isRunning

            // If currently executing a step, abort it and immediately move to next
            if (this.executingStep) {
                this.isRunning = false  // Abort current step at next checkpoint
                this.executingStep = false
                // Restore running state if we were in a run
                if (wasRunning) {
                    this.isRunning = true
                }
                // Don't return - fall through to execute the next step
            }

            const isManualStep = !wasRunning
            if (isManualStep) {
                this.isRunning = true
                this.updateControls()
            }

            this.currentStep++
            this.executingStep = true
            this.skipAnimations = false

            // Call subclass implementation
            await this.executeStep(this.currentStep)

            this.executingStep = false

            if (isManualStep) {
                this.isRunning = false
            }
            this.updateControls()
        }

        reset() {
            // Stop any running animation
            this.isRunning = false
            this.currentStep = 0

            // Call subclass implementation to reset state
            this.resetState()

            // Reset UI classes
            this.el.querySelectorAll('.exchange-step, .exchange-eve, .exchange-received, .exchange-result').forEach(el => {
                el.classList.remove(
                    CSS_CLASSES.ACTIVE,
                    CSS_CLASSES.COMPLETED,
                    CSS_CLASSES.SHOW,
                    CSS_CLASSES.HIGHLIGHT,
                    CSS_CLASSES.PULSE
                )
            })

            this.el.querySelectorAll('.exchange-arrow').forEach(el => {
                el.classList.remove(CSS_CLASSES.ANIMATE, CSS_CLASSES.SHOW, CSS_CLASSES.PULSE)
            })

            // Allow subclass to perform additional reset
            if (this.resetUI) {
                this.resetUI()
            }

            this.setStatus('')
            this.updateControls()
        }

        // -------------------------------------------------------------------------
        // UI Helpers
        // -------------------------------------------------------------------------

        /**
         * Update button states based on current animation state
         */
        updateControls() {
            const maxSteps = this.getMaxSteps()
            this.startBtn.disabled = this.isRunning
            this.resetBtn.disabled = !this.isRunning && this.currentStep === 0
            this.stepBtn.disabled = this.currentStep >= maxSteps
        }

        /**
         * Set status message with optional type
         * @param {string} msg - Status message to display
         * @param {string} type - Optional type: 'info', 'success', 'warning', 'error'
         */
        setStatus(msg, type = '') {
            this.statusEl.textContent = msg
            this.statusEl.className = `exchange-status ${type ? 'exchange-status-' + type : ''}`
        }

        /**
         * Mark a step element as active
         * @param {HTMLElement} stepEl - The step element to activate
         */
        activateStep(stepEl) {
            if (stepEl) stepEl.classList.add(CSS_CLASSES.ACTIVE)
        }

        /**
         * Mark a step element as completed
         * @param {HTMLElement} stepEl - The step element to complete
         */
        completeStep(stepEl) {
            if (stepEl) {
                stepEl.classList.remove(CSS_CLASSES.ACTIVE)
                stepEl.classList.add(CSS_CLASSES.COMPLETED)
            }
        }

        /**
         * Reset text content of elements matching selector
         * @param {string} selector - CSS selector for elements to reset
         * @param {string} defaultValue - Value to set (default: '?')
         */
        resetElementsToDefault(selector, defaultValue = '?') {
            this.el.querySelectorAll(selector).forEach(el => {
                el.textContent = defaultValue
            })
        }

        // -------------------------------------------------------------------------
        // Animation Timing & Flow Control
        // -------------------------------------------------------------------------

        /**
         * Sleep for specified duration, respecting skip flag
         * @param {number} ms - Milliseconds to sleep
         * @returns {Promise<void>}
         */
        sleep(ms) {
            if (this.skipAnimations) return Promise.resolve()
            return new Promise(resolve => setTimeout(resolve, ms))
        }

        /**
         * Check if animation was aborted, returns true if should exit early
         * Use this after sleep calls: await this.sleep(x); if (this.checkAborted()) return;
         * @returns {boolean} True if animation was stopped
         */
        checkAborted() {
            return !this.isRunning
        }

        /**
         * Sleep and check if aborted in one call
         * @param {number} ms - Milliseconds to sleep
         * @returns {Promise<boolean>} True if should return early (aborted)
         */
        async sleepAndCheck(ms) {
            await this.sleep(ms)
            return this.checkAborted()
        }
    }

    // -------------------------------------------------------------------------
    // Export
    // -------------------------------------------------------------------------

    // Expose to window for plugins to use
    window.ExchangeAnimation = ExchangeAnimation
    window.ExchangeCore = {
        CSS_CLASSES,
        DEFAULT_TIMING,
        ExchangeAnimation
    }

})()
