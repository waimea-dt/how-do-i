/**
 * docsify-modulus.js - Interactive Modulo Arithmetic Visualizer
 *
 * Visualizes modulo arithmetic using a clock face animation.
 * Shows how a number wraps around a clock to find the remainder.
 *
 * Usage in markdown:
 *   <modulus></modulus>
 *   <modulus value="23" mod="7"></modulus>
 *
 * Attributes:
 *   - value: The number to visualize (default: 19, range: 0-100)
 *   - mod: The modulus (default: 5, range: 2-20)
 *
 * The animation shows the clock hand jumping around the clock "value" times,
 * demonstrating visually how modulo arithmetic wraps around.
 */

;(function () {

    // -------------------------------------------------------------------------
    // Animation Configuration
    // -------------------------------------------------------------------------

    const ANIMATION_CONFIG = {
        // Pause timing at each tick (ramped)
        initialPause:  600,    // Pause (ms) at each tick at start (slower = higher)
        finalPause:    300,    // Pause (ms) at each tick at end (slower = higher)
        maxSpeedPause: 0,      // Pause (ms) at maximum speed (0 = no pause)

        // Smooth sweep animation between ticks (constant)
        sweepDuration: 100,    // Duration (ms) of smooth animation between positions

        // Ramp configuration
        rampUpSteps:   12,     // Number of steps to accelerate from initial to max speed
        rampDownSteps: 12      // Number of steps to decelerate from max to final speed
    }

    // -------------------------------------------------------------------------
    // SVG Clock Creation
    // -------------------------------------------------------------------------

    /**
     * Generate SVG clock face with m positions
     */
    function createClockFace(m, size = 300) {
        const radius = size / 2 - 30
        const centerX = size / 2
        const centerY = size / 2

        // Create SVG element
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg.setAttribute('class', 'mod-clock')
        svg.setAttribute('viewBox', `0 0 ${size} ${size}`)
        svg.setAttribute('width', size)
        svg.setAttribute('height', size)

        // Add background circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        circle.setAttribute('cx', centerX)
        circle.setAttribute('cy', centerY)
        circle.setAttribute('r', radius)
        circle.setAttribute('class', 'mod-clock-circle')
        svg.appendChild(circle)

        // Add hour markers (positions 0 to m-1)
        for (let i = 0; i < m; i++) {
            const angle = (i / m) * 2 * Math.PI - Math.PI / 2  // Start at top
            const x = centerX + radius * Math.cos(angle)
            const y = centerY + radius * Math.sin(angle)

            // Marker dot
            const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
            dot.setAttribute('cx', x)
            dot.setAttribute('cy', y)
            dot.setAttribute('r', i === 0 ? 7 : 5)
            dot.setAttribute('class', i === 0 ? 'mod-clock-zero mod-clock-marker' : 'mod-clock-marker')
            dot.setAttribute('data-position', i)
            svg.appendChild(dot)

            // Label
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text')
            const labelRadius = radius + 20
            const labelX = centerX + labelRadius * Math.cos(angle)
            const labelY = centerY + labelRadius * Math.sin(angle)
            label.setAttribute('x', labelX)
            label.setAttribute('y', labelY)
            label.setAttribute('class', 'mod-clock-label')
            label.setAttribute('text-anchor', 'middle')
            label.setAttribute('dominant-baseline', 'middle')
            label.textContent = i
            svg.appendChild(label)
        }

        // Add pointer (initially at position 0)
        const pointer = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        pointer.setAttribute('x1', centerX)
        pointer.setAttribute('y1', centerY)
        pointer.setAttribute('x2', centerX)
        pointer.setAttribute('y2', centerY - radius + 15)
        pointer.setAttribute('class', 'mod-clock-pointer')
        pointer.setAttribute('data-pointer', 'true')
        svg.appendChild(pointer)

        // Add center dot
        const centerDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        centerDot.setAttribute('cx', centerX)
        centerDot.setAttribute('cy', centerY)
        centerDot.setAttribute('r', 5)
        centerDot.setAttribute('class', 'mod-clock-center')
        svg.appendChild(centerDot)

        return svg
    }

    /**
     * Smoothly animate clock pointer from current position to target position
     */
    async function animatePointerSweep(svg, fromPosition, toPosition, m, duration, cancelSignal = null) {
        const size = parseInt(svg.getAttribute('width'))
        const radius = size / 2 - 30
        const centerX = size / 2
        const centerY = size / 2
        const pointer = svg.querySelector('[data-pointer]')

        let startAngle = (fromPosition / m) * 2 * Math.PI - Math.PI / 2
        let endAngle = (toPosition / m) * 2 * Math.PI - Math.PI / 2

        // Ensure we always move forward (clockwise) by one step
        // If endAngle < startAngle, we've wrapped around, so add 2π to go the full circle
        if (endAngle < startAngle) {
            endAngle += 2 * Math.PI
        }

        const startTime = performance.now()

        return new Promise((resolve) => {
            function animate(currentTime) {
                if (cancelSignal && cancelSignal.cancelled) {
                    resolve()
                    return
                }

                const elapsed = currentTime - startTime
                const progress = Math.min(elapsed / duration, 1)

                // Linear interpolation
                const currentAngle = startAngle + (endAngle - startAngle) * progress
                const x = centerX + (radius - 15) * Math.cos(currentAngle)
                const y = centerY + (radius - 15) * Math.sin(currentAngle)

                pointer.setAttribute('x2', x)
                pointer.setAttribute('y2', y)

                if (progress < 1) {
                    requestAnimationFrame(animate)
                } else {
                    resolve()
                }
            }

            requestAnimationFrame(animate)
        })
    }

    /**
     * Update clock pointer to point to a specific position (instant)
     */
    function updateClockPointer(svg, position, m, highlight = false) {
        const size = parseInt(svg.getAttribute('width'))
        const radius = size / 2 - 30
        const centerX = size / 2
        const centerY = size / 2

        const angle = (position / m) * 2 * Math.PI - Math.PI / 2
        const x = centerX + (radius - 15) * Math.cos(angle)
        const y = centerY + (radius - 15) * Math.sin(angle)

        const pointer = svg.querySelector('[data-pointer]')
        pointer.setAttribute('x2', x)
        pointer.setAttribute('y2', y)

        if (highlight) {
            pointer.classList.add('mod-clock-pointer-active')
        } else {
            pointer.classList.remove('mod-clock-pointer-active')
        }

        // Highlight the current position marker
        svg.querySelectorAll('.mod-clock-marker, .mod-clock-zero').forEach(marker => {
            marker.classList.remove('mod-clock-marker-active')
        })
        const activeMarker = svg.querySelector(`[data-position="${position}"]`)
        if (activeMarker) {
            activeMarker.classList.add('mod-clock-marker-active')
        }
    }

    // -------------------------------------------------------------------------
    // Animation with Ease-In-Out
    // -------------------------------------------------------------------------

    /**
     * Animate clock rotation with ease-in-out timing
     */
    async function animateClockRotation(svg, value, mod, durationMs = 3000, equationEl = null, cancelSignal = null) {
        const finalPosition = value % mod
        const totalSteps = value

        if (totalSteps === 0) {
            updateClockPointer(svg, 0, mod, true)
            if (equationEl) {
                equationEl.innerHTML = `<span class="mod-equation-message"><strong>0</strong> is <strong>0</strong> lots of <strong>${mod}</strong>, remainder <strong class="high">0</strong></span> <span class="mod-equation-final"><strong>0</strong> mod <strong>${mod}</strong> = <strong class="high">0</strong></span>`

                // Trigger final equation animation
                setTimeout(() => {
                    const finalSpan = equationEl.querySelector('.mod-equation-final')
                    if (finalSpan) {
                        void finalSpan.offsetWidth
                        finalSpan.classList.add('animate')
                    }
                }, 1000)
            }
            return
        }

        const pointer = svg.querySelector('[data-pointer]')
        pointer.classList.add('mod-clock-pointer-active')

        // Calculate pause at each tick with linear ramp up/down:
        // - Ramp up: pause decreases from initialPause to maxSpeedPause (0)
        // - Hold at max speed: pause stays at 0
        // - Ramp down: pause increases from maxSpeedPause (0) to finalPause
        const maxPause = ANIMATION_CONFIG.initialPause
        const minPause = ANIMATION_CONFIG.maxSpeedPause
        const sweepDuration = ANIMATION_CONFIG.sweepDuration
        const rampUpSteps = Math.min(ANIMATION_CONFIG.rampUpSteps, Math.floor(totalSteps / 2))
        const rampDownSteps = Math.min(ANIMATION_CONFIG.rampDownSteps, Math.floor(totalSteps / 2))

        const stepPauses = []
        for (let i = 0; i < totalSteps; i++) {
            let pause

            if (i < rampUpSteps) {
                // Ramp up: linear from maxPause to minPause
                const rampProgress = i / rampUpSteps
                pause = maxPause - (maxPause - minPause) * rampProgress
            } else if (i < totalSteps - rampDownSteps) {
                // Middle: max speed (no pause)
                pause = minPause
            } else {
                // Ramp down: linear from minPause to finalPause
                const stepsFromEnd = totalSteps - 1 - i
                const rampProgress = stepsFromEnd / rampDownSteps
                pause = ANIMATION_CONFIG.finalPause - (ANIMATION_CONFIG.finalPause - minPause) * rampProgress
            }

            stepPauses.push(pause)
        }

        // Animate through each step
        for (let i = 0; i <= totalSteps; i++) {
            // Check if animation was cancelled
            if (cancelSignal && cancelSignal.cancelled) {
                return
            }

            const currentPosition = i % mod
            updateClockPointer(svg, currentPosition, mod, i === totalSteps)

            // Update equation during animation
            if (equationEl) {
                const currentLots = Math.floor(i / mod)
                const currentRemainder = i % mod

                if (i === totalSteps) {
                    // Final state: show equation without final result initially
                    equationEl.innerHTML = `<span class="mod-equation-message"><strong>${value}</strong> is ${currentLots} lot${currentLots !== 1 ? 's' : ''} of <strong>${mod}</strong>, remainder <strong class="high">${currentRemainder}</strong></span> <span class="mod-equation-final"><strong>${value}</strong> mod <strong>${mod}</strong> = <strong class="high">${currentRemainder}</strong></span>`
                } else {
                    // During animation: show current state
                    equationEl.innerHTML = `<span class="mod-equation-message"><strong>${i}</strong> is <strong>${currentLots}</strong> lot${currentLots !== 1 ? 's' : ''} of <strong>${mod}</strong>, remainder <strong>${currentRemainder}</strong></span>`
                }
            }

            if (i < totalSteps) {
                // Pause at this tick
                const pause = stepPauses[i]
                if (pause > 0) {
                    await new Promise(resolve => setTimeout(resolve, pause))
                }

                // Check again after pause
                if (cancelSignal && cancelSignal.cancelled) {
                    return
                }

                // Smoothly sweep to next position
                const nextPosition = (i + 1) % mod
                await animatePointerSweep(svg, currentPosition, nextPosition, mod, sweepDuration, cancelSignal)
            }
        }

        // Trigger the final equation animation after 1 second
        if (equationEl && totalSteps > 0) {
            setTimeout(() => {
                const finalSpan = equationEl.querySelector('.mod-equation-final')
                if (finalSpan) {
                    void finalSpan.offsetWidth
                    finalSpan.classList.add('animate')
                }
            }, 1000)
        }
    }

    // -------------------------------------------------------------------------
    // UI Builder
    // -------------------------------------------------------------------------

    function buildUI(initialValue, initialMod) {
        const wrapper = document.createElement('div')
        wrapper.className = 'mod-wrapper'
        wrapper.innerHTML = `
            <div class="mod-header">
                <div class="mod-title">Modulo Arithmetic Visualizer</div>
                <div class="mod-subtitle">Watch how numbers wrap around like a clock</div>
            </div>

            <div class="mod-controls">
                <div class="mod-control-group">
                    <label class="mod-control-label">
                        <span class="mod-control-name">Value</span>
                        <span class="mod-control-value" data-value-display>${initialValue}</span>
                    </label>
                    <input type="range" class="mod-slider" data-value-slider min="0" max="100" value="${initialValue}">
                </div>

                <div class="mod-control-group">
                    <label class="mod-control-label">
                        <span class="mod-control-name">Modulus</span>
                        <span class="mod-control-value" data-mod-display>${initialMod}</span>
                    </label>
                    <input type="range" class="mod-slider" data-mod-slider min="2" max="24" value="${initialMod}">
                </div>
            </div>

            <div class="mod-equation" data-equation-display>
                <span class="mod-equation-message"><strong>${initialValue}</strong> is <strong>?</strong> lots of <strong>${initialMod}</strong>, remainder <strong>?</strong></span>
            </div>

            <div class="mod-clock-container" data-clock-container></div>

            <div class="mod-animation-controls">
                <div class="mod-description" data-description>
                    The clock has ${initialMod} positions (0 to ${initialMod - 1}).<br>
                    Starting at 0, count forward ${initialValue} steps to find where you land.
                </div>
                <button class="mod-restart-btn" data-restart-btn>↻ Restart</button>
            </div>
        `
        return wrapper
    }

    // -------------------------------------------------------------------------
    // Modulus Visualizer Class
    // -------------------------------------------------------------------------

    class ModulusVisualizer {
        constructor(el, initialValue, initialMod) {
            this.el = el
            this.value = initialValue
            this.mod = initialMod
            this.isAnimating = false
            this.cancelSignal = { cancelled: false }

            // Get DOM elements
            this.valueSlider = el.querySelector('[data-value-slider]')
            this.modSlider = el.querySelector('[data-mod-slider]')
            this.valueDisplay = el.querySelector('[data-value-display]')
            this.modDisplay = el.querySelector('[data-mod-display]')
            this.equationDisplay = el.querySelector('[data-equation-display]')
            this.clockContainer = el.querySelector('[data-clock-container]')
            this.description = el.querySelector('[data-description]')
            this.restartBtn = el.querySelector('[data-restart-btn]')

            // Bind events - use 'input' for immediate updates, 'change' for animation trigger
            this.valueSlider.addEventListener('input', (e) => this.onValueInput(parseInt(e.target.value)))
            this.valueSlider.addEventListener('change', (e) => this.onValueRelease(parseInt(e.target.value)))
            this.modSlider.addEventListener('input', (e) => this.onModInput(parseInt(e.target.value)))
            this.modSlider.addEventListener('change', (e) => this.onModRelease(parseInt(e.target.value)))
            this.restartBtn.addEventListener('click', () => this.onRestartClick())

            // Initial render
            this.render()
        }

        onValueInput(newValue) {
            // Immediate update - cancel any animation and reset clock
            this.cancelAnimation()
            this.value = newValue
            this.valueDisplay.textContent = newValue
            this.updateDisplay()
            this.resetClock()
        }

        onValueRelease(newValue) {
            // Slider released - start animation
            this.value = newValue
            this.animate()
        }

        onModInput(newMod) {
            // Immediate update - cancel any animation and recreate clock
            this.cancelAnimation()
            this.mod = newMod
            this.modDisplay.textContent = newMod
            this.updateDisplay()
            this.recreateClock()
        }

        onModRelease(newMod) {
            // Slider released - start animation
            this.mod = newMod
            this.animate()
        }

        onRestartClick() {
            // Restart button clicked - reset and animate
            this.cancelAnimation()
            this.resetClock()
            setTimeout(() => this.animate(), 50)
        }

        cancelAnimation() {
            // Signal any running animation to stop
            this.cancelSignal.cancelled = true
            this.cancelSignal = { cancelled: false }
            this.isAnimating = false
        }

        resetClock() {
            // Reset clock to position 0 without animation
            const clock = this.clockContainer.querySelector('.mod-clock')
            if (clock) {
                updateClockPointer(clock, 0, this.mod, false)
            }
        }

        recreateClock() {
            // Create new clock with updated modulus
            const clock = createClockFace(this.mod, 300)
            this.clockContainer.innerHTML = ''
            this.clockContainer.appendChild(clock)
        }

        updateDisplay() {
            const result = this.value % this.mod
            const lots = Math.floor(this.value / this.mod)

            // Set to unknown state before animation
            this.equationDisplay.innerHTML = `<span class="mod-equation-message"><strong>${this.value}</strong> is <strong>?</strong> lots of <strong>${this.mod}</strong>, remainder <strong>?</strong></span>`

            const rotations = Math.floor(this.value / this.mod)
            if (rotations === 0) {
                this.description.innerHTML = `The clock has ${this.mod} positions (0 to ${this.mod - 1}).<br> Count forward ${this.value} step${this.value !== 1 ? 's' : ''}.`
            } else {
                this.description.innerHTML = `The clock has ${this.mod} positions.<br> Count ${this.value} steps = ${rotations} complete rotation${rotations !== 1 ? 's' : ''} + ${result} extra step${result !== 1 ? 's' : ''}.`
            }
        }

        render() {
            // Create new clock
            const clock = createClockFace(this.mod, 300)
            this.clockContainer.innerHTML = ''
            this.clockContainer.appendChild(clock)

            // Animate to current value
            this.animate()
        }

        async animate() {
            if (this.isAnimating) return
            this.isAnimating = true

            const clock = this.clockContainer.querySelector('.mod-clock')
            await animateClockRotation(clock, this.value, this.mod, 3000, this.equationDisplay, this.cancelSignal)

            this.isAnimating = false
        }
    }

    // -------------------------------------------------------------------------
    // Plugin entry point
    // -------------------------------------------------------------------------

    function processModulus() {
        document.querySelectorAll('.markdown-section modulus').forEach(el => {
            const value = parseInt(el.getAttribute('value')) || 30
            const mod = parseInt(el.getAttribute('mod')) || 12

            // Validate parameters
            if (value < 0 || value > 100) {
                el.innerHTML = '<div class="mod-error">Error: value must be between 0 and 100</div>'
                return
            }

            if (mod < 2 || mod > 24) {
                el.innerHTML = '<div class="mod-error">Error: mod must be between 2 and 24</div>'
                return
            }

            const ui = buildUI(value, mod)
            el.innerHTML = ''
            el.appendChild(ui)

            new ModulusVisualizer(ui, value, mod)
        })
    }

    // Install plugin
    if (window.$docsify) {
        window.$docsify.plugins = [].concat(
            window.$docsify.plugins || [],
            (hook) => {
                hook.doneEach(() => processModulus())
            }
        )
    }

})()

