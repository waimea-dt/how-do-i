/**
 * docsify-calc.js - Interactive binary calculator for teaching bitwise and arithmetic operations
 *
 * Visualizes operations on binary numbers with carry/overflow flags, signed/unsigned values,
 * and step-by-step explanations.
 *
 * Usage in markdown:
 *   <calculator>01100100 + 01111011</calculator>
 *   <calculator>01100100 or 01111011</calculator>
 *   <calculator>not 01111011</calculator>
 *   <calculator>01100100 << 11</calculator>
 *   <calculator>neg 01111011</calculator>
 *
 * Supported operations:
 *   - Arithmetic: + (add), - (sub)
 *   - Bitwise: and, or, xor, not
 *   - Shifts: <<, >> (logical), >>> (arithmetic)
 *   - Special: neg (two's complement negation)
 *
 * Values can be in binary (01100100) or decimal (100) format.
 * Note: All operations use 8-bit values.
 */

;(function () {

    // -------------------------------------------------------------------------
    // Animation Timing Constants
    // -------------------------------------------------------------------------
    const ANIMATION_INPUT_PHASE_MS = 1000      // Duration to highlight input operands and carry in
    const ANIMATION_CARRYOUT_PHASE_MS = 1000   // Duration to highlight result and carry out
    const ANIMATION_PAUSE_PHASE_MS = 500       // Duration of pause between bit positions (no highlighting)
    const ANIMATION_DEBOUNCE_MS = 2000         // Delay before starting animation after input change

    // Bitwise operation animation timing
    const ANIMATION_BITWISE_INPUT_PHASE_MS = 1000  // Duration to highlight input bits that are 1
    const ANIMATION_BITWISE_RESULT_PHASE_MS = 1000 // Duration to highlight result bit
    const ANIMATION_BITWISE_PAUSE_PHASE_MS = 500   // Duration of pause between positions

    // Shift operation animation timing (ripple animation)
    const ANIMATION_SHIFT_VALUE1_PHASE_MS = 1000   // Duration to highlight ALL bits in value1 (1s)
    const ANIMATION_SHIFT_COPY_PHASE_MS = 1000     // Duration to copy to result and highlight (1s)
    const ANIMATION_SHIFT_STEP_PHASE_MS = 1000     // Duration for each shift iteration (1s)
    const ANIMATION_SHIFT_PAUSE_PHASE_MS = 0       // No pause - shift happens immediately

    // Negation (two's complement) animation timing
    const ANIMATION_NEG_INPUT_PHASE_MS = 1000      // Duration to highlight input bit (1s)
    const ANIMATION_NEG_INVERT_PHASE_MS = 500      // Duration to highlight inverted bit (0.5s)
    const ANIMATION_NEG_PAUSE_PHASE_MS = 1000      // Duration of pause before +1 appears (1s)
    const ANIMATION_NEG_PLUSONE_PHASE_MS = 1000    // Duration to highlight +1 row (1s)
    const ANIMATION_NEG_RESULT_PHASE_MS = 1000     // Duration to highlight result (1s)

    // Subtraction (two's complement) animation timing
    const ANIMATION_SUB_HIGHLIGHT_B_MS = 1000      // Duration to highlight all of B (1s)
    const ANIMATION_SUB_SHOW_NEGB_MS = 1000        // Duration to show -B highlighted (1s)
    const ANIMATION_SUB_ADD_INPUT_MS = 1000        // Duration to highlight addition inputs per bit (1s)
    const ANIMATION_SUB_ADD_CARRYOUT_MS = 1000     // Duration to highlight addition carry out per bit (1s)
    const ANIMATION_SUB_ADD_PAUSE_MS = 500         // Duration of pause between bits (0.5s)

    // -------------------------------------------------------------------------
    // CSS Class Constants
    // -------------------------------------------------------------------------
    const CSS = {
        ACTIVE: ' calc-stack-active',
        ERROR: ' calc-stack-error',
        UNKNOWN: ' calc-stack-unknown',
        BIT_ONE: ' calc-stack-bit-one'
    }

    // -------------------------------------------------------------------------
    // HTML Helper Functions
    // -------------------------------------------------------------------------

    /**
     * Generate active class string based on state
     */
    function getActiveClass(isActive) {
        return isActive === 'error' ? CSS.ERROR : (isActive ? CSS.ACTIVE : '')
    }

    /**
     * Render empty interpretation columns (spacer + 3 items)
     */
    function renderEmptyInterpretations() {
        return `
            <span class="calc-stack-spacer"></span>
            <span class="calc-stack-interp-item"></span>
            <span class="calc-stack-interp-item"></span>
            <span class="calc-stack-interp-item"></span>
        `
    }

    /**
     * Render unknown interpretation columns (spacer + 3 ? items)
     */
    function renderUnknownInterpretations() {
        return `
            <span class="calc-stack-spacer"></span>
            <span class="calc-stack-interp-item">
                <span class="calc-stack-interp-value calc-stack-unknown">?</span>
            </span>
            <span class="calc-stack-interp-item">
                <span class="calc-stack-interp-value calc-stack-unknown">?</span>
            </span>
            <span class="calc-stack-interp-item">
                <span class="calc-stack-interp-value calc-stack-unknown">?</span>
            </span>
        `
    }

    /**
     * Determine if operation needs overflow/carry column
     * Addition, subtraction, left shift, negation need overflow
     */
    function needsOverflowColumn(op) {
        return ['add', 'sub', '<<', 'neg'].includes(op)
    }

    /**
     * Determine if operation needs undercarry column
     * Right shifts need undercarry
     */
    function needsUndercarryColumn(op) {
        return ['>>', '>>>'].includes(op)
    }

    // -------------------------------------------------------------------------
    // Calculator State Model
    // -------------------------------------------------------------------------

    class CalcState {
        constructor(value1, value2, op) {
            this.value1 = parseInt(value1) || 0
            this.value2 = value2 !== null ? parseInt(value2) : null
            this.op = op
            this.bits = 8
            this.maxValue = Math.pow(2, this.bits) - 1
            this.result = null
            this.steps = []
            // Animation settings
            this.animateEnabled = true // Toggle for animations (default: on)
            // Animation state
            this.animationStep = -1 // -1 = not started/complete, 0..bits-1 = current position
            this.animationPhase = 'inputs' // Animation phase varies by operation (e.g., 'inputs', 'result', 'pause', etc.)
            this.animationTimer = null
            this.phaseTimer = null
            this.debounceTimer = null
            this.animationHasRun = false // Track if animation has started (to hide carries initially)
            // Real-time addition animation state
            this.carryValues = null // Array of carry values (null = not calculated yet, 0 or 1 = carry value)
            this.currentCarry = 0 // Current carry value during addition
            // Real-time shift animation state (ripple animation)
            this.shiftCurrentBits = null // Array of current bit values during animation
            this.shiftOriginalBits = null // Boolean array marking bits from original value (for highlighting)
            this.shiftIteration = -1 // Current shift iteration (0 to shiftAmount-1)
            this.shiftPhase = null // 'highlight-value1', 'copy', 'shift'
            this.shiftLostBit = null // The bit that was shifted out (for carry/undercarry display)
            // Real-time negation animation state
            this.negateInvertedBits = null // Array of inverted bits as they're calculated
            // Real-time subtraction animation state
            this.subNegatedValue = null // The negated value of B (two's complement)
        }

        calculate() {
            // Ensure values are within bit range
            const v1 = this.value1 & this.maxValue
            const v2 = this.value2 !== null ? (this.value2 & this.maxValue) : null

            switch (this.op) {
                case 'add':
                    return this.performAdd(v1, v2)
                case 'sub':
                    return this.performSub(v1, v2)
                case 'and':
                    return this.performAnd(v1, v2)
                case 'or':
                    return this.performOr(v1, v2)
                case 'xor':
                    return this.performXor(v1, v2)
                case 'not':
                    return this.performNot(v1)
                case '<<':
                    return this.performLeftShift(v1, v2)
                case '>>':
                    return this.performRightShift(v1, v2, false)
                case '>>>':
                    return this.performRightShift(v1, v2, true)
                case 'neg':
                    return this.performNegate(v1)
                default:
                    return { result: 0, carry: false, overflow: false, steps: [] }
            }
        }

        performAdd(v1, v2) {
            const sum = v1 + v2
            const result = sum & this.maxValue
            const carry = sum > this.maxValue

            const steps = this.generateAddSteps(v1, v2, result, carry)

            return { result, steps, resultBeforeMask: sum }
        }

        performSub(v1, v2) {
            // Subtraction via two's complement: A - B = A + (-B)
            const negV2 = ((~v2) + 1) & this.maxValue
            const sum = v1 + negV2
            const result = sum & this.maxValue
            const carryOut = sum > this.maxValue

            const steps = this.generateSubSteps(v1, v2, negV2, result, carryOut)

            return { result, steps, resultBeforeMask: sum }
        }

        performAnd(v1, v2) {
            const result = (v1 & v2) & this.maxValue
            const steps = this.generateBitwiseSteps('AND', v1, v2, result)
            return { result, steps }
        }

        performOr(v1, v2) {
            const result = (v1 | v2) & this.maxValue
            const steps = this.generateBitwiseSteps('OR', v1, v2, result)
            return { result, steps }
        }

        performXor(v1, v2) {
            const result = (v1 ^ v2) & this.maxValue
            const steps = this.generateBitwiseSteps('XOR', v1, v2, result)
            return { result, steps }
        }

        performNot(v1) {
            const result = (~v1) & this.maxValue
            const steps = this.generateNotSteps(v1, result)
            return { result, steps }
        }

        performLeftShift(v1, amount) {
            amount = amount || 0
            const result = (v1 << amount) & this.maxValue
            const steps = this.generateShiftSteps('left', v1, amount, result)
            return { result, steps }
        }

        performRightShift(v1, amount, arithmetic) {
            amount = amount || 0
            let result

            if (arithmetic) {
                // Arithmetic shift: preserve sign bit
                const signBit = 1 << (this.bits - 1)
                const isNegative = (v1 & signBit) !== 0
                result = v1 >> amount

                // Fill with sign bits
                if (isNegative && amount > 0) {
                    const mask = ((1 << amount) - 1) << (this.bits - amount)
                    result |= mask
                }
            } else {
                // Logical shift: fill with zeros
                result = v1 >>> amount
            }

            result = result & this.maxValue
            const steps = this.generateShiftSteps(arithmetic ? 'arithmetic-right' : 'logical-right', v1, amount, result)
            return { result, steps }
        }

        performNegate(v1) {
            const result = ((~v1) + 1) & this.maxValue
            const steps = this.generateNegateSteps(v1, result)
            return { result, steps }
        }

        calculateCarryBits(v1, v2) {
            const carryBits = []
            let currentCarry = 0

            for (let i = 0; i < this.bits; i++) {
                const bit1 = (v1 >> i) & 1
                const bit2 = (v2 >> i) & 1
                const sum = bit1 + bit2 + currentCarry
                carryBits.unshift(currentCarry)
                currentCarry = sum >> 1
            }
            carryBits.unshift(currentCarry) // Final carry out

            return carryBits
        }

        generateAddSteps(v1, v2, result, carry) {
            const steps = []
            steps.push(`<p class="calc-step-title">Binary Addition</p>`)
            steps.push(`Add two binary numbers together, bit by bit, from right to left`)
            steps.push(`<strong>Input values:</strong>`)
            steps.push(`>>> A = ${this.toBinary(v1)} (${v1} in decimal)`)
            steps.push(`>>> B = ${this.toBinary(v2)} (${v2} in decimal)`)

            steps.push(`<strong>Process:</strong>`)
            steps.push(`>>> Start with the rightmost bit (least significant)`)
            steps.push(`>>> Add each bit position: bit₁ + bit₂ + carry`)
            steps.push(`>>> If the sum is 2 or more, carry 1 to the next position`)

            const carryBits = this.calculateCarryBits(v1, v2)
            steps.push(`>>> Carry values: ${carryBits.join(' ')}`)

            steps.push(`<strong>Result:</strong>`)
            steps.push(`>>> ${this.toBinary(result)} (${result} in decimal)`)
            if (carry) {
                steps.push(`>>> ⚠️ Overflow bit = 1 (result doesn't fit in ${this.bits} bits)`)
            }

            return steps
        }

        generateSubSteps(v1, v2, negV2, result, carryOut) {
            const steps = []
            steps.push(`<p class="calc-step-title">Binary Subtraction</p>`)
            steps.push(`Subtract using two's complement: convert B to −B, then add`)
            steps.push(`<strong>Input values:</strong>`)
            steps.push(`>>> A = ${this.toBinary(v1)} (${v1} in decimal)`)
            steps.push(`>>> B = ${this.toBinary(v2)} (${v2} in decimal)`)

            steps.push(`<strong>Process:</strong>`)
            steps.push(`>>> Step 1: Invert all bits of B`)
            steps.push(`>>> ${this.toBinary(v2)} → ${this.toBinary(~v2 & this.maxValue)}`)
            steps.push(`>>> Step 2: Add 1 to get −B (two's complement)`)
            steps.push(`>>> ${this.toBinary(~v2 & this.maxValue)} + 1 = ${this.toBinary(negV2)} (−B = ${this.toSigned(negV2)} in decimal)`)
            steps.push(`>>> Step 3: Add A + (−B)`)
            steps.push(`>>> ${v1} + ${this.toSigned(negV2)} = ${this.toSigned(result)}`)

            steps.push(`<strong>Result:</strong>`)
            steps.push(`>>> ${this.toBinary(result)} (${this.toSigned(result)} in decimal)`)
            if (carryOut) {
                steps.push(`>>> Carry-out = 1 (discarded, result is valid)`)
            } else {
                steps.push(`>>> ⚠️ Carry-out = 0 (indicates underflow)`)
            }

            return steps
        }

        generateBitwiseSteps(opName, v1, v2, result) {
            const steps = []
            const opDescriptions = {
                'AND': 'Returns 1 only when both bits are 1',
                'OR': 'Returns 1 when at least one bit is 1',
                'XOR': 'Returns 1 when bits are different (exclusive-OR)'
            }

            steps.push(`<p class="calc-step-title">${opName} Operation</p>`)
            steps.push(`${opDescriptions[opName] || 'Compare bits at each position'}`)
            steps.push(`<strong>Input values:</strong>`)
            steps.push(`>>> A = ${this.toBinary(v1)} (${v1} in decimal)`)
            steps.push(`>>> B = ${this.toBinary(v2)} (${v2} in decimal)`)

            const truthTable = {
                'AND': [[0,0,0], [0,1,0], [1,0,0], [1,1,1]],
                'OR':  [[0,0,0], [0,1,1], [1,0,1], [1,1,1]],
                'XOR': [[0,0,0], [0,1,1], [1,0,1], [1,1,0]]
            }[opName]

            if (truthTable) {
                steps.push(`<strong>Truth table:</strong>`)
                const opSymbol = {'AND': '&', 'OR': '|', 'XOR': '^'}[opName]
                const tableRows = truthTable.map(r =>
                    `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`
                ).join('')
                steps.push(`>>> <table class="calc-truth-table"><thead><tr><th>A</th><th>B</th><th>A ${opSymbol} B</th></tr></thead><tbody>${tableRows}</tbody></table>`)
            }

            steps.push(`<strong>Process:</strong>`)
            steps.push(`>>> Compare each bit position using the truth table above`)

            steps.push(`<strong>Result:</strong>`)
            steps.push(`>>> ${this.toBinary(result)} (${result} in decimal)`)

            return steps
        }

        generateNotSteps(v1, result) {
            const steps = []
            steps.push(`<p class="calc-step-title">NOT Operation (Bitwise Inversion)</p>`)
            steps.push(`Flip every bit: change 0 to 1 and 1 to 0`)
            steps.push(`<strong>Input value:</strong>`)
            steps.push(`>>> A = ${this.toBinary(v1)} (${v1} in decimal)`)

            steps.push(`<strong>Process:</strong>`)
            steps.push(`>>> Go through each bit position from left to right`)
            steps.push(`>>> Change 0 → 1 and 1 → 0`)

            steps.push(`<strong>Result:</strong>`)
            steps.push(`>>> ${this.toBinary(result)} (${result} in decimal)`)

            return steps
        }

        generateShiftSteps(direction, v1, amount, result) {
            const steps = []
            const dirName = direction === 'left' ? 'Left Shift' :
                           direction === 'arithmetic-right' ? 'Arithmetic Right Shift' :
                           'Logical Right Shift'

            steps.push(`<p class="calc-step-title">${dirName}</p>`)

            if (direction === 'left') {
                steps.push(`Move all bits ${amount} position${amount === 1 ? '' : 's'} to the left`)
                steps.push(`<strong>Input value:</strong>`)
                steps.push(`>>> A = ${this.toBinary(v1)} (${v1} in decimal)`)

                steps.push(`<strong>Process:</strong>`)
                steps.push(`>>> Shift each bit ${amount} position${amount === 1 ? '' : 's'} left`)
                steps.push(`>>> Fill empty positions on the right with 0`)
                steps.push(`>>> Bits shifted out on the left are lost`)
                steps.push(`>>> This multiplies the value by 2<sup>${amount}</sup> = ${Math.pow(2, amount)}`)

                steps.push(`<strong>Result:</strong>`)
                steps.push(`>>> ${this.toBinary(result)} (${result} in decimal)`)
                steps.push(`>>> ${v1} × ${Math.pow(2, amount)} = ${result} (before overflow)`)
            } else if (direction === 'arithmetic-right') {
                const signBit = (v1 >> (this.bits - 1)) & 1
                steps.push(`Move all bits ${amount} position${amount === 1 ? '' : 's'} to the right, preserving the sign`)
                steps.push(`<strong>Input value:</strong>`)
                steps.push(`>>> A = ${this.toBinary(v1)} (${this.toSigned(v1)} in signed decimal)`)

                steps.push(`<strong>Process:</strong>`)
                steps.push(`>>> Shift each bit ${amount} position${amount === 1 ? '' : 's'} right`)
                steps.push(`>>> Fill empty positions on the left with sign bit (${signBit})`)
                steps.push(`>>> Bits shifted out on the right are lost`)
                steps.push(`>>> This divides the value by 2<sup>${amount}</sup> = ${Math.pow(2, amount)} (rounded down)`)

                steps.push(`<strong>Result:</strong>`)
                steps.push(`>>> ${this.toBinary(result)} (${this.toSigned(result)} in signed decimal)`)
            } else {
                steps.push(`Move all bits ${amount} position${amount === 1 ? '' : 's'} to the right`)
                steps.push(`<strong>Input value:</strong>`)
                steps.push(`>>> A = ${this.toBinary(v1)} (${v1} in decimal)`)

                steps.push(`<strong>Process:</strong>`)
                steps.push(`>>> Shift each bit ${amount} position${amount === 1 ? '' : 's'} right`)
                steps.push(`>>> Fill empty positions on the left with 0`)
                steps.push(`>>> Bits shifted out on the right are lost`)

                steps.push(`<strong>Result:</strong>`)
                steps.push(`>>> ${this.toBinary(result)} (${result} in decimal)`)
            }

            return steps
        }

        generateNegateSteps(v1, result) {
            const steps = []
            steps.push(`<p class="calc-step-title">Two's Complement Negation</p>`)
            steps.push(`Convert a number to its negative using two's complement`)
            steps.push(`<strong>Input value:</strong>`)
            steps.push(`>>> A = ${this.toBinary(v1)} (${v1} in decimal, ${this.toSigned(v1)} in signed)`)

            steps.push(`<strong>Process:</strong>`)
            steps.push(`>>> Step 1: Invert all bits (flip 0→1, 1→0)`)
            steps.push(`>>> ${this.toBinary(v1)} → ${this.toBinary(~v1 & this.maxValue)}`)
            steps.push(`>>> Step 2: Add 1 to the inverted value`)
            steps.push(`>>> ${this.toBinary(~v1 & this.maxValue)} + 1 = ${this.toBinary(result)}`)

            steps.push(`<strong>Result:</strong>`)
            steps.push(`>>> ${this.toBinary(result)} (${result} in decimal, ${this.toSigned(result)} in signed)`)
            steps.push(`>>> This represents −${v1} in two's complement`)

            return steps
        }

        toBinary(value) {
            return value.toString(2).padStart(this.bits, '0')
        }

        toSigned(value) {
            const signBit = 1 << (this.bits - 1)
            if (value & signBit) {
                return value - (1 << this.bits)
            }
            return value
        }
    }

    // -------------------------------------------------------------------------
    // UI Generation
    // -------------------------------------------------------------------------

    function createCalcUI(state) {
        const wrapper = document.createElement('div')
        wrapper.className = 'calc-wrapper'

        const opInfo = getOperationInfo(state.op)
        const isBinaryOp = state.value2 !== null
        const isShiftOp = ['<<', '>>', '>>>'].includes(state.op)

        wrapper.innerHTML = `
            <div class="calc-container">
                <div class="calc-header">
                    <div class="calc-op-name">${opInfo.name}</div>

                    <div class="calc-input-group calc-animate-toggle">
                        <button class="calc-animate-btn" data-enabled="${state.animateEnabled}" aria-label="Toggle animation" title="Toggle animation">
                            <span class="calc-animate-icon">▶</span>
                        </button>
                    </div>
                </div>

                <div class="calc-inputs">
                    <div class="calc-input-group">
                        ${!isBinaryOp ? `
                            <div class="calc-operation-display">
                                <div class="calc-op-symbol">${opInfo.symbol}</div>
                            </div>
                        ` : ''}
                        <label class="calc-input-label" data-operand="1">A</label>
                        <input type="text" class="calc-input" data-operand="1" value="${state.value1.toString(2).padStart(state.bits, '0')}" maxlength="${state.bits}" pattern="[01]*">
                    </div>

                    ${isBinaryOp ? `
                        ${!isShiftOp ? `
                            <div class="calc-operation-display">
                                <div class="calc-op-symbol">${opInfo.symbol}</div>
                            </div>
                        ` : ''}
                        <div class="calc-input-group">
                            ${isShiftOp ? `
                                <div class="calc-operation-display">
                                    <div class="calc-op-symbol">${opInfo.symbol}</div>
                                </div>
                                <input type="text" class="calc-input decimal-input" data-operand="2" value="${state.value2}" maxlength="1" pattern="[0-7]*">
                                <label class="calc-input-label">bits</label>
                            ` : `
                                <input type="text" class="calc-input" data-operand="2" value="${state.value2.toString(2).padStart(state.bits, '0')}" maxlength="${state.bits}" pattern="[01]*">
                                <label class="calc-input-label" data-operand="2">B</label>
                            `}
                        </div>
                    ` : ''}
                </div>

                <div class="calc-binary-stack">
                    ${renderBinaryStack(state, opInfo, isBinaryOp)}
                </div>

                <details class="calc-steps">
                    <summary class="calc-steps-title">How It Works</summary>
                    <div class="calc-steps-list">
                        ${renderSteps(state.steps)}
                    </div>
                </details>
            </div>
        `

        return wrapper
    }

    // -------------------------------------------------------------------------
    // Rendering Helper Functions
    // -------------------------------------------------------------------------

    /**
     * Render the inverted bits row for negation operations
     */
    function renderInvertedRow(state, animStep, isAnimating) {
        if (state.op !== 'neg') return ''

        let html = `<div class="calc-stack-row calc-stack-value2">`
        html += '<span class="calc-stack-operator">~A</span>'
        html += '<span class="calc-stack-spacer"></span>'
        if (needsOverflowColumn(state.op)) {
            html += '<span class="calc-stack-overflow-placeholder"></span>'
        }

        // Build partial binary string for real-time interpretation
        let partialBits = []
        let hasAnyInvertedBit = false

        for (let i = 0; i < state.bits; i++) {
            const bitPos = state.bits - 1 - i
            const invertedBit = state.negateInvertedBits ? state.negateInvertedBits[bitPos] : null

            let displayValue = '?'
            let isActive = false

            if (invertedBit !== null) {
                displayValue = invertedBit.toString()
                partialBits.push(invertedBit.toString())
                hasAnyInvertedBit = true
            } else {
                partialBits.push('0') // Use 0 for un-inverted positions in calculation
            }

            // Highlight during invert-output phase if this is the current position
            if (isAnimating && bitPos === animStep && state.animationPhase === 'invert-output') {
                isActive = true
            }

            // Highlight during addition animation if this is the current position
            if (isAnimating && bitPos === animStep && state.animationPhase === 'neg-add-inputs') {
                isActive = true
            }

            const activeClass = getActiveClass(isActive)
            const unknownClass = invertedBit === null ? CSS.UNKNOWN : ''
            html += `<span class="calc-stack-digit calc-stack-value2${activeClass}${unknownClass}">${displayValue}</span>`
        }

        if (needsUndercarryColumn(state.op)) {
            html += '<span class="calc-stack-undercarry-placeholder"></span>'
        }

        // Show real-time interpretations as bits are inverted
        if (hasAnyInvertedBit) {
            const partialValue = parseInt(partialBits.join(''), 2)
            html += renderInterpretations(partialValue, state)
        } else {
            html += renderUnknownInterpretations()
        }

        html += '</div>'
        return html
    }

    /**
     * Render the +1 row for negation operations
     */
    function renderPlusOneRow(state, isAnimating) {
        if (state.op !== 'neg') return ''

        // Show the +1 bit only during plus-one and addition phases, result, and complete phases
        const showPlusOneBit = state.animationHasRun && (
            state.animationPhase === 'plus-one' ||
            state.animationPhase === 'neg-add-inputs' ||
            state.animationPhase === 'neg-add-carryout' ||
            state.animationPhase === 'neg-add-pause' ||
            state.animationPhase === 'result' ||
            state.animationPhase === 'complete'
        )
        // Highlight during plus-one phase or during neg-add-inputs phase at bit position 0
        const isPlusOnePhase = state.animationPhase === 'plus-one' ||
                               (state.animationPhase === 'neg-add-inputs' && state.animationStep === 0)

        let html = `<div class="calc-stack-row calc-stack-value2 calc-stack-plusone">`
        html += `<span class="calc-stack-operator">+</span>`
        html += '<span class="calc-stack-spacer"></span>'
        if (needsOverflowColumn(state.op)) {
            html += '<span class="calc-stack-overflow-placeholder"></span>'
        }

        // Show empty space for all positions except LSB, which shows "1" only after inversion complete
        for (let i = 0; i < state.bits; i++) {
            const bitPos = state.bits - 1 - i
            if (bitPos === 0) {
                // LSB position - show "1" only when all inverted bits are in place, and highlight during plus-one phase
                if (showPlusOneBit) {
                    const activeClass = getActiveClass(isPlusOnePhase)
                    html += `<span class="calc-stack-digit calc-stack-value2${activeClass}">1</span>`
                } else {
                    // Show empty space during inversion
                    html += `<span class="calc-stack-digit calc-stack-value2">&nbsp;</span>`
                }
            } else {
                // All other positions - show empty space
                html += `<span class="calc-stack-digit calc-stack-value2 calc-stack-blank"></span>`
            }
        }

        if (needsUndercarryColumn(state.op)) {
            html += '<span class="calc-stack-undercarry-placeholder"></span>'
        }

        // Show interpretations only when the "1" bit is visible
        if (showPlusOneBit) {
            html += renderInterpretations(1, state)
        } else {
            html += renderEmptyInterpretations()
        }

        html += '</div>'

        return html
    }

    /**
     * Render the -B row for subtraction operations (two's complement of B)
     */
    function renderNegatedValueRow(state, isAnimating) {
        if (state.op !== 'sub') return ''

        let html = `<div class="calc-stack-row calc-stack-value2">`
        html += '<span class="calc-stack-operator">−B</span>'
        html += '<span class="calc-stack-spacer"></span>'
        if (needsOverflowColumn(state.op)) {
            html += '<span class="calc-stack-overflow-placeholder"></span>'
        }

        // Show -B during show-negb phase and later, otherwise show ?s
        const showNegB = state.animationHasRun && (state.animationPhase === 'show-negb' || state.animationPhase === 'add-inputs' || state.animationPhase === 'add-carryout' || state.animationPhase === 'add-pause' || state.animationPhase === 'complete')
        const isHighlighted = state.animationPhase === 'show-negb'

        if (showNegB && state.subNegatedValue !== null) {
            // Show the negated value
            const binaryNegB = state.subNegatedValue.toString(2).padStart(state.bits, '0')
            for (let i = 0; i < state.bits; i++) {
                const bit = binaryNegB[i]
                const bitPos = state.bits - 1 - i

                // Highlight during add-inputs phase if this is the current position
                let isActive = false
                if (state.animationPhase === 'add-inputs' && bitPos === state.animationStep) {
                    isActive = true
                } else if (isHighlighted) {
                    // Highlight all bits during show-negb phase
                    isActive = true
                }

                const activeClass = getActiveClass(isActive)
                html += `<span class="calc-stack-digit calc-stack-value2${activeClass}">${bit}</span>`
            }

            if (needsUndercarryColumn(state.op)) {
                html += '<span class="calc-stack-undercarry-placeholder"></span>'
            }
            html += renderInterpretations(state.subNegatedValue, state)
        } else {
            // Show ?s before -B is calculated
            for (let i = 0; i < state.bits; i++) {
                html += `<span class="calc-stack-digit calc-stack-value2 calc-stack-unknown">?</span>`
            }

            if (needsUndercarryColumn(state.op)) {
                html += '<span class="calc-stack-undercarry-placeholder"></span>'
            }
            html += renderUnknownInterpretations()
        }

        html += '</div>'
        return html
    }

    /**
     * Render value1 row with operation-specific highlighting
     */
    function renderValue1Row(state, binary1, animStep, isAnimating, isShiftAnimating, opInfo, isBinaryOp, isShiftOp) {
        let html = `<div class="calc-stack-row calc-stack-value1">`

        // Operator column - show "A" label
        html += `<span class="calc-stack-operator">A</span>`
        html += '<span class="calc-stack-spacer"></span>'
        if (needsOverflowColumn(state.op)) {
            html += '<span class="calc-stack-overflow-placeholder"></span>'
        }

        // Render bits based on operation type
        if (state.op === 'neg' && state.animationStep >= 0) {
            // Negation operation - highlight current bit during invert-input phase
            for (let i = 0; i < state.bits; i++) {
                const bit = binary1[i]
                const bitPos = state.bits - 1 - i
                const isActive = bitPos === animStep && state.animationPhase === 'invert-input'
                const activeClass = getActiveClass(isActive)
                html += `<span class="calc-stack-digit calc-stack-value1${activeClass}">${bit}</span>`
            }
        } else if (['and', 'or', 'xor', 'not'].includes(state.op) && state.animationStep >= 0 && state.animationStep < state.bits) {
            // Bitwise operations
            for (let i = 0; i < state.bits; i++) {
                const bit = binary1[i]
                const bitPos = state.bits - 1 - i
                const isActive = bitPos === animStep && state.animationPhase === 'inputs'
                const activeClass = getActiveClass(isActive)
                const bitOneClass = isActive && bit === '1' ? CSS.BIT_ONE : ''
                html += `<span class="calc-stack-digit calc-stack-value1${activeClass}${bitOneClass}">${bit}</span>`
            }
        } else if (state.op === 'add') {
            // Addition
            for (let i = 0; i < state.bits; i++) {
                const bit = binary1[i]
                const bitPos = state.bits - 1 - i
                const isActive = isAnimating && bitPos === animStep && state.animationPhase === 'inputs'
                const activeClass = getActiveClass(isActive)
                html += `<span class="calc-stack-digit calc-stack-value1${activeClass}">${bit}</span>`
            }
        } else if (state.op === 'sub') {
            // Subtraction - highlight during add-inputs phase
            for (let i = 0; i < state.bits; i++) {
                const bit = binary1[i]
                const bitPos = state.bits - 1 - i
                const isActive = isAnimating && bitPos === animStep && state.animationPhase === 'add-inputs'
                const activeClass = getActiveClass(isActive)
                html += `<span class="calc-stack-digit calc-stack-value1${activeClass}">${bit}</span>`
            }
        } else if (isShiftAnimating) {
            // Shift operations
            for (let i = 0; i < state.bits; i++) {
                const bit = binary1[i]
                const isActive = state.shiftPhase === 'highlight-value1'
                const activeClass = getActiveClass(isActive)
                html += `<span class="calc-stack-digit calc-stack-value1${activeClass}">${bit}</span>`
            }
        } else {
            html += renderBinaryDigits(binary1, 'value1')
        }

        if (needsUndercarryColumn(state.op)) {
            html += '<span class="calc-stack-undercarry-placeholder"></span>'
        }
        html += renderInterpretations(state.value1, state)
        html += '</div>'

        return html
    }

    /**
     * Render value2 row with operation-specific highlighting
     */
    function renderValue2Row(state, binary2, animStep, isAnimating, opInfo) {
        let html = `<div class="calc-stack-row calc-stack-value2">`
        // Show "B" label in operator column
        html += `<span class="calc-stack-operator">B</span>`
        html += '<span class="calc-stack-spacer"></span>'
        if (needsOverflowColumn(state.op)) {
            html += '<span class="calc-stack-overflow-placeholder"></span>'
        }

        // Render bits based on operation type
        if (['and', 'or', 'xor'].includes(state.op) && state.animationStep >= 0 && state.animationStep < state.bits) {
            // Bitwise operations
            for (let i = 0; i < state.bits; i++) {
                const bit = binary2[i]
                const bitPos = state.bits - 1 - i
                const isActive = bitPos === animStep && state.animationPhase === 'inputs'
                const activeClass = getActiveClass(isActive)
                const bitOneClass = isActive && bit === '1' ? CSS.BIT_ONE : ''
                html += `<span class="calc-stack-digit calc-stack-value2${activeClass}${bitOneClass}">${bit}</span>`
            }
        } else if (state.op === 'add') {
            // Addition
            for (let i = 0; i < state.bits; i++) {
                const bit = binary2[i]
                const bitPos = state.bits - 1 - i
                const isActive = isAnimating && bitPos === animStep && state.animationPhase === 'inputs'
                const activeClass = getActiveClass(isActive)
                html += `<span class="calc-stack-digit calc-stack-value2${activeClass}">${bit}</span>`
            }
        } else if (state.op === 'sub') {
            // Subtraction - highlight all bits during highlight-b phase
            for (let i = 0; i < state.bits; i++) {
                const bit = binary2[i]
                const isActive = isAnimating && state.animationPhase === 'highlight-b'
                const activeClass = getActiveClass(isActive)
                html += `<span class="calc-stack-digit calc-stack-value2${activeClass}">${bit}</span>`
            }
        } else {
            html += renderBinaryDigits(binary2, 'value2')
        }

        if (needsUndercarryColumn(state.op)) {
            html += '<span class="calc-stack-undercarry-placeholder"></span>'
        }
        html += renderInterpretations(state.value2, state)
        html += '</div>'

        return html
    }

    /**
     * Render the carry row for addition/subtraction operations
     */
    function renderCarryRow(state, animStep, isAnimating) {
        if ((state.op !== 'add' && state.op !== 'sub' && state.op !== 'neg') || !state.carryValues) return ''

        let html = `<div class="calc-stack-row calc-stack-carry">`
        html += '<span class="calc-stack-operator"></span>'
        html += '<span class="calc-stack-spacer"></span>'
        if (needsOverflowColumn(state.op)) {
            html += '<span class="calc-stack-overflow-placeholder"></span>'
        }

        for (let i = 0; i < state.bits; i++) {
            const bitPos = state.bits - 1 - i

            // Animation uses carryValues[bitPos], static uses carryValues[i]
            const carryIndex = state.animateEnabled ? bitPos : i
            const carryBit = state.carryValues[carryIndex]

            let isCarryIn = false
            let isCarryOut = false

            if (state.op === 'add') {
                // Highlight carry IN during 'inputs' phase
                isCarryIn = isAnimating && bitPos === animStep && carryBit === 1 && state.animationPhase === 'inputs'
                // Highlight carry OUT during 'carryOut' phase
                isCarryOut = isAnimating && bitPos === animStep + 1 && carryBit === 1 && state.animationPhase === 'carryOut'
            } else if (state.op === 'sub') {
                // Highlight carry IN during 'add-inputs' phase
                isCarryIn = isAnimating && bitPos === animStep && carryBit === 1 && state.animationPhase === 'add-inputs'
                // Highlight carry OUT during 'add-carryout' phase
                isCarryOut = isAnimating && bitPos === animStep + 1 && carryBit === 1 && state.animationPhase === 'add-carryout'
            } else if (state.op === 'neg') {
                // Highlight carry IN during 'neg-add-inputs' phase
                isCarryIn = isAnimating && bitPos === animStep && carryBit === 1 && state.animationPhase === 'neg-add-inputs'
                // Highlight carry OUT during 'neg-add-carryout' phase
                isCarryOut = isAnimating && bitPos === animStep + 1 && carryBit === 1 && state.animationPhase === 'neg-add-carryout'
            }

            const isActive = isCarryIn || isCarryOut
            const activeClass = getActiveClass(isActive)
            const displayValue = carryBit !== null ? (carryBit === 1 ? '1' : '·') : '·'

            html += `<span class="calc-stack-carry-bit${activeClass}">${displayValue}</span>`
        }

        if (needsUndercarryColumn(state.op)) {
            html += '<span class="calc-stack-undercarry-placeholder"></span>'
        }
        html += renderEmptyInterpretations()
        html += '</div>'

        return html
    }

    /**
     * Render the result row with progressive revelation and real-time values
     */
    function renderResultRow(state, binaryResult, animStep, isAnimating, isShiftAnimating, isShiftOp, hasOverflowBit, overflowBit) {
        let html = `<div class="calc-stack-row calc-stack-result">`

        // Show operation expression in operator column
        const opInfo = getOperationInfo(state.op)
        let opExpression = ''
        if (['not', 'neg'].includes(state.op)) {
            // Unary operations: ~A or −A
            opExpression = `${opInfo.symbol}A`
        } else if (['<<', '>>', '>>>'].includes(state.op)) {
            // Shift operations: A<<N, A>>N, A>>>N
            opExpression = `A${opInfo.symbol}${state.value2}`
        } else if (state.op === 'sub') {
            // Subtraction: show A+(−B) to reflect two's complement
            opExpression = `A+(−B)`
        } else {
            // Binary operations: A&B, A|B, A+B, etc.
            opExpression = `A${opInfo.symbol}B`
        }
        html += `<span class="calc-stack-operator">${opExpression}</span>`
        html += '<span class="calc-stack-spacer"></span>'

        // Handle shift operations separately
        if (isShiftAnimating) {
            // Show left shift lost bit in overflow position - only during shift phase when bit is actually lost
            if (needsOverflowColumn(state.op)) {
                if (state.op === '<<' && state.shiftPhase === 'shift' && state.shiftLostBit !== null) {
                    const lostBit = state.shiftLostBit
                    html += `<span class="calc-stack-overflow-bit${CSS.ACTIVE}">${lostBit}</span>`
                } else {
                    html += '<span class="calc-stack-overflow-placeholder"></span>'
                }
            }

            if (state.shiftPhase === 'highlight-value1') {
                // Show ? during highlight-value1 phase
                for (let i = 0; i < state.bits; i++) {
                    html += `<span class="calc-stack-digit calc-stack-result calc-stack-unknown">?</span>`
                }

                if (needsUndercarryColumn(state.op)) {
                    html += '<span class="calc-stack-undercarry-placeholder"></span>'
                }
                html += renderUnknownInterpretations()
            } else {
                // Show bits during copy and shift phases
                for (let i = 0; i < state.bits; i++) {
                    const bit = state.shiftCurrentBits[i]
                    const isOriginal = state.shiftOriginalBits[i]
                    const isActive = state.shiftPhase === 'copy' || (state.shiftPhase === 'shift' && isOriginal)
                    const activeClass = getActiveClass(isActive)
                    html += `<span class="calc-stack-digit calc-stack-result${activeClass}">${bit}</span>`
                }

                // Show right shift lost bit in undercarry position - only during shift phase when bit is actually lost
                if (needsUndercarryColumn(state.op)) {
                    if ((state.op === '>>' || state.op === '>>>') && state.shiftPhase === 'shift' && state.shiftLostBit !== null) {
                        const lostBit = state.shiftLostBit
                        html += `<span class="calc-stack-overflow-bit${CSS.ACTIVE}">${lostBit}</span>`
                    } else {
                        html += '<span class="calc-stack-undercarry-placeholder"></span>'
                    }
                }

                const currentValue = parseInt(state.shiftCurrentBits.join(''), 2)
                html += renderInterpretations(currentValue, state)
            }

            html += '</div>'
            return html
        }

        // Overflow bit for add/sub
        let showOverflowBit = false
        if (hasOverflowBit && (state.op === 'add' || state.op === 'sub')) {
            if (state.animationStep < 0 && state.animationHasRun) {
                // Animation complete or no animation - show overflow bit
                // For subtraction, don't show during initial phases (highlight-b, show-negb)
                showOverflowBit = !(state.op === 'sub' && (state.animationPhase === 'highlight-b' || state.animationPhase === 'show-negb'))
            } else if (state.op === 'add' && state.currentCarry === 1 && state.animationStep >= state.bits - 1 &&
                       (state.animationPhase === 'carryOut' || state.animationPhase === 'pause')) {
                // Addition: show overflow bit during/after carryOut phase of final position
                showOverflowBit = true
            } else if (state.op === 'sub' && state.currentCarry === 1 && state.animationStep >= state.bits - 1 &&
                       (state.animationPhase === 'add-carryout' || state.animationPhase === 'add-pause')) {
                // Subtraction: show overflow bit during/after add-carryout phase of final position
                showOverflowBit = true
            }
        }

        const isOverflowHighlighted = ((state.op === 'add' && isAnimating && state.animationStep === state.bits - 1 &&
                                       state.animationPhase === 'carryOut' && showOverflowBit) ||
                                      (state.op === 'sub' && isAnimating && state.animationStep === state.bits - 1 &&
                                       state.animationPhase === 'add-carryout' && showOverflowBit))
        const overflowActiveClass = getActiveClass(isOverflowHighlighted)

        // Progressive revelation for add/sub/bitwise/neg
        let partialResultBits = []
        if (state.op === 'add' || state.op === 'sub' || ['and', 'or', 'xor', 'not', 'neg'].includes(state.op)) {
            // Add overflow placeholder for add/sub/neg
            if (needsOverflowColumn(state.op)) {
                if (showOverflowBit) {
                    html += `<span class="calc-stack-overflow-bit${overflowActiveClass}">${overflowBit}</span>`
                } else {
                    html += '<span class="calc-stack-overflow-placeholder"></span>'
                }
            }

            for (let i = 0; i < state.bits; i++) {
                const bit = binaryResult[i]
                const bitPos = state.bits - 1 - i

                let isVisible = false
                if (state.animationHasRun) {
                    if (state.op === 'neg') {
                        // For negation, show result bits progressively during addition animation
                        if (state.animationPhase === 'invert-input' || state.animationPhase === 'invert-output' ||
                            state.animationPhase === 'pause' || state.animationPhase === 'plus-one') {
                            // Don't show result during inversion or +1 highlight
                            isVisible = false
                        } else if (state.animationPhase === 'result' || state.animationPhase === 'complete') {
                            // Show all bits during final result phases
                            isVisible = true
                        } else {
                            // Progressive revelation during addition animation
                            const isPastPosition = bitPos < animStep
                            const isCurrentAndShown = bitPos === animStep && (state.animationPhase === 'neg-add-carryout' || state.animationPhase === 'neg-add-pause')
                            isVisible = state.animationStep < 0 || isPastPosition || isCurrentAndShown
                        }
                    } else if (state.op === 'sub') {
                        // For subtraction, show result bits progressively during add phases (after -B is shown)
                        if (state.animationPhase === 'highlight-b' || state.animationPhase === 'show-negb') {
                            // Don't show result during B highlighting or -B reveal
                            isVisible = false
                        } else {
                            const isPastPosition = bitPos < animStep
                            const isCurrentAndShown = bitPos === animStep && (state.animationPhase === 'add-carryout' || state.animationPhase === 'add-pause')
                            isVisible = state.animationStep < 0 || isPastPosition || isCurrentAndShown
                        }
                    } else {
                        const isPastPosition = bitPos < animStep
                        let isCurrentAndShown = false

                        if (state.op === 'add') {
                            isCurrentAndShown = bitPos === animStep && (state.animationPhase === 'carryOut' || state.animationPhase === 'pause')
                        } else if (['and', 'or', 'xor', 'not'].includes(state.op)) {
                            isCurrentAndShown = bitPos === animStep && (state.animationPhase === 'result' || state.animationPhase === 'pause')
                        }

                        isVisible = state.animationStep < 0 || isPastPosition || isCurrentAndShown
                    }
                }

                let isActive = false
                if (isAnimating) {
                    if ((state.op === 'add' && bitPos === animStep && state.animationPhase === 'carryOut') ||
                        (state.op === 'sub' && bitPos === animStep && state.animationPhase === 'add-carryout') ||
                        (state.op === 'neg' && bitPos === animStep && state.animationPhase === 'neg-add-carryout') ||
                        (['and', 'or', 'xor', 'not'].includes(state.op) && bitPos === animStep && state.animationPhase === 'result')) {
                        isActive = true
                    }
                }

                const activeClass = getActiveClass(isActive)
                const displayValue = isVisible ? bit : '?'
                const unknownClass = !isVisible ? CSS.UNKNOWN : ''
                html += `<span class="calc-stack-digit calc-stack-result${activeClass}${unknownClass}">${displayValue}</span>`

                partialResultBits.push(isVisible ? bit : '0')
            }

            if (needsUndercarryColumn(state.op)) {
                html += '<span class="calc-stack-undercarry-placeholder"></span>'
            }
        } else if (isShiftOp) {
            // Shift operations not animating - don't show lost bits
            if (needsOverflowColumn(state.op)) {
                html += '<span class="calc-stack-overflow-placeholder"></span>'
            }

            if (!state.animationHasRun) {
                for (let i = 0; i < state.bits; i++) {
                    html += `<span class="calc-stack-digit calc-stack-result calc-stack-unknown">?</span>`
                }
            } else {
                html += renderBinaryDigits(binaryResult, 'result')
            }

            if (needsUndercarryColumn(state.op)) {
                html += '<span class="calc-stack-undercarry-placeholder"></span>'
            }
        } else {
            // Other operations (shouldn't normally reach here)
            if (needsOverflowColumn(state.op)) {
                html += '<span class="calc-stack-overflow-placeholder"></span>'
            }
            html += renderBinaryDigits(binaryResult, 'result')
            if (needsUndercarryColumn(state.op)) {
                html += '<span class="calc-stack-undercarry-placeholder"></span>'
            }
        }

        // Interpretations
        if (!state.animationHasRun) {
            html += renderUnknownInterpretations()
        } else if (state.op === 'add' || state.op === 'sub' || ['and', 'or', 'xor', 'not', 'neg'].includes(state.op)) {
            // For negation, only show real interpretations during addition animation and result phases
            if (state.op === 'neg' && state.animationPhase !== 'neg-add-inputs' && state.animationPhase !== 'neg-add-carryout' &&
                state.animationPhase !== 'neg-add-pause' && state.animationPhase !== 'result' && state.animationPhase !== 'complete') {
                html += renderUnknownInterpretations()
            } else {
                const partialValue = parseInt(partialResultBits.join(''), 2)
                html += renderInterpretations(partialValue, state)
            }
        } else {
            html += renderInterpretations(state.result, state)
        }

        html += '</div>'
        return html
    }

    /**
     * Main function to render the binary stack visualization
     */
    function renderBinaryStack(state, opInfo, isBinaryOp) {
        const binary1 = state.value1.toString(2).padStart(state.bits, '0')
        const binary2 = isBinaryOp ? state.value2.toString(2).padStart(state.bits, '0') : null
        const binaryResult = state.result.toString(2).padStart(state.bits, '0')

        // Calculate overflow bit
        const fullResult = state.resultBeforeMask !== undefined ? state.resultBeforeMask : state.result
        const fullBinaryResult = fullResult.toString(2)
        const hasOverflowBit = fullBinaryResult.length > state.bits
        const overflowBit = hasOverflowBit ? fullBinaryResult[0] : null

        // Animation state
        const isAnimating = (['add', 'sub', 'and', 'or', 'xor', 'not', 'neg'].includes(state.op)) &&
                           (state.animationStep >= 0 ||
                            (state.op === 'neg' && (state.animationPhase === 'plus-one' || state.animationPhase === 'neg-add-inputs' ||
                                                     state.animationPhase === 'neg-add-carryout' || state.animationPhase === 'neg-add-pause' ||
                                                     state.animationPhase === 'result')) ||
                            (state.op === 'sub' && (state.animationPhase === 'highlight-b' || state.animationPhase === 'show-negb')))
        const animStep = state.animationStep
        const isShiftAnimating = (['<<', '>>', '>>>'].includes(state.op)) && state.shiftCurrentBits !== null
        const isShiftOp = ['<<', '>>', '>>>'].includes(state.op)

        // Determine grid layout class based on which columns are needed
        let layoutClass = ''
        const hasOverflow = needsOverflowColumn(state.op)
        const hasUndercarry = needsUndercarryColumn(state.op)

        if (hasOverflow && hasUndercarry) {
            layoutClass = ' calc-stack-both-columns'
        } else if (hasOverflow) {
            layoutClass = ' calc-stack-overflow-only'
        } else if (hasUndercarry) {
            layoutClass = ' calc-stack-undercarry-only'
        } else {
            layoutClass = ' calc-stack-no-extra-columns'
        }

        // Build HTML
        let html = `<div class="calc-stack${layoutClass}">`

        // Header
        html += '<div class="calc-stack-header">'
        html += '<span class="calc-stack-operator"></span>'
        html += '<span class="calc-stack-spacer"></span>'
        if (needsOverflowColumn(state.op)) {
            html += '<span class="calc-stack-overflow-header">&nbsp;</span>'
        }
        html += renderBitHeaders(state.bits)
        if (needsUndercarryColumn(state.op)) {
            html += '<span class="calc-stack-undercarry-header">&nbsp;</span>'
        }
        html += renderInterpretationHeaders()
        html += '</div>'

        // Rows
        html += renderValue1Row(state, binary1, animStep, isAnimating, isShiftAnimating, opInfo, isBinaryOp, isShiftOp)

        if (isBinaryOp && !isShiftOp) {
            html += renderValue2Row(state, binary2, animStep, isAnimating, opInfo)
        }

        // Subtraction-specific row
        if (state.op === 'sub') {
            html += renderNegatedValueRow(state, isAnimating)
        }

        // Negation-specific rows
        if (state.op === 'neg') {
            html += renderInvertedRow(state, animStep, isAnimating)
            html += renderPlusOneRow(state, isAnimating)
        }

        html += renderCarryRow(state, animStep, isAnimating)

        // Divider
        html += '<div class="calc-stack-divider"></div>'

        // Result
        const resultRowHtml = renderResultRow(state, binaryResult, animStep, isAnimating, isShiftAnimating, isShiftOp, hasOverflowBit, overflowBit)

        // Special handling for shift animations - return early
        if (isShiftAnimating) {
            html += resultRowHtml
            html += '</div>'
            return html
        }

        html += resultRowHtml
        html += '</div>'
        return html
    }

    function renderBitHeaders(bits) {
        let html = ''
        for (let i = bits - 1; i >= 0; i--) {
            const placeValue = Math.pow(2, i)
            html += `<span class="calc-stack-bit-header">${placeValue}</span>`
        }
        return html
    }

    function renderInterpretationHeaders() {
        return `
            <span class="calc-stack-spacer"></span>
            <span class="calc-stack-interp-item calc-stack-bit-header">Unsign</span>
            <span class="calc-stack-interp-item calc-stack-bit-header">Sign</span>
            <span class="calc-stack-interp-item calc-stack-bit-header">Hex</span>
        `
    }

    function renderBinaryDigits(binary, className) {
        return Array.from(binary).map(bit =>
            `<span class="calc-stack-digit calc-stack-${className}">${bit}</span>`
        ).join('')
    }

    function renderInterpretations(value, state) {
        const unsigned = value
        const signed = state.toSigned(value)
        const hex = '0x' + value.toString(16).toUpperCase().padStart(Math.ceil(state.bits/4), '0')

        return `
            <span class="calc-stack-spacer"></span>
            <span class="calc-stack-interp-item">
                <span class="calc-stack-interp-value">${unsigned}</span>
            </span>
            <span class="calc-stack-interp-item">
                <span class="calc-stack-interp-value">${signed}</span>
            </span>
            <span class="calc-stack-interp-item">
                <span class="calc-stack-interp-value">${hex}</span>
            </span>
        `
    }

    function renderBinaryBits(value, bits, className) {
        const binary = value.toString(2).padStart(bits, '0')
        return Array.from(binary).map((bit, idx) => {
            const position = bits - idx - 1
            const placeValue = Math.pow(2, position)
            return `
                <div class="calc-bit ${className}-bit">
                    <span class="calc-bit-value">${bit}</span>
                    <span class="calc-bit-position">2<sup>${position}</sup></span>
                    <span class="calc-bit-decimal">${bit === '1' ? placeValue : '·'}</span>
                </div>
            `
        }).join('')
    }

    function renderSteps(steps) {
        if (!steps || steps.length === 0) {
            return '<p>No steps available</p>'
        }

        const result = []
        let i = 0

        while (i < steps.length) {
            const step = steps[i]

            if (step.startsWith('>>>')) {
                // Collect all consecutive list items
                const listItems = []
                while (i < steps.length && steps[i].startsWith('>>>')) {
                    listItems.push(steps[i].substring(3).trim())
                    i++
                }
                // Wrap all items in a single list
                const items = listItems.map(item => `<li>${item}</li>`).join('')
                result.push(`<ul class="calc-nested-steps">${items}</ul>`)
            } else {
                // Regular paragraph
                result.push(`<p>${step}</p>`)
                i++
            }
        }

        return result.join('')
    }

    function getOperationInfo(op) {
        const operations = {
            'add': { symbol: '+', name: 'Binary Addition' },
            'sub': { symbol: '−', name: 'Binary Subtraction' },
            'and': { symbol: '&', name: 'Bitwise AND' },
            'or':  { symbol: '|', name: 'Bitwise OR' },
            'xor': { symbol: '^', name: 'Bitwise XOR' },
            'not': { symbol: '~', name: 'Bitwise NOT' },
            '<<':  { symbol: '<<', name: 'Logical Left Shift' },
            '>>':  { symbol: '>>', name: 'Logical Right Shift' },
            '>>>': { symbol: '>>>', name: 'Arithmetic Right Shift' },
            'neg': { symbol: '−', name: 'Two\'s Compliment' }
        }
        return operations[op] || { symbol: '?', name: 'Unknown' }
    }

    // -------------------------------------------------------------------------
    // Animation Helper Functions
    // -------------------------------------------------------------------------

    /**
     * Clear all animation timers for a state object
     */
    function clearAnimationTimers(state) {
        if (state.phaseTimer) {
            clearTimeout(state.phaseTimer)
            state.phaseTimer = null
        }
        if (state.animationTimer) {
            clearTimeout(state.animationTimer)
            state.animationTimer = null
        }
        if (state.debounceTimer) {
            clearTimeout(state.debounceTimer)
            state.debounceTimer = null
        }
    }

    /**
     * Reset animation state for the given operation
     */
    function resetAnimationState(state) {
        state.animationStep = -1
        state.animationHasRun = false

        // Operation-specific state initialization
        if (state.op === 'add') {
            state.carryValues = new Array(state.bits).fill(null)
            state.currentCarry = 0
        } else if (state.op === 'sub') {
            state.carryValues = new Array(state.bits).fill(null)
            state.currentCarry = 0
            state.subNegatedValue = null
        } else if (['<<', '>>', '>>>'].includes(state.op)) {
            state.shiftCurrentBits = null
            state.shiftOriginalBits = null
            state.shiftIteration = -1
            state.shiftPhase = null
        } else if (state.op === 'neg') {
            state.negateInvertedBits = new Array(state.bits).fill(null)
            state.carryValues = new Array(state.bits).fill(null)
            state.currentCarry = 0
        }
    }

    /**
     * Populate all animation state immediately (for when animation is disabled)
     */
    function populateImmediateState(state) {
        if (state.op === 'neg') {
            // Populate all inverted bits
            for (let i = 0; i < state.bits; i++) {
                const bit = (state.value1 >> i) & 1
                state.negateInvertedBits[i] = bit ^ 1
            }
            // Populate carry values for the addition of inverted bits + 1
            const invertedValue = (~state.value1) & state.maxValue
            const carryBits = state.calculateCarryBits(invertedValue, 1)
            state.carryValues = carryBits.slice(1) // Remove first carry out
        } else if (state.op === 'add') {
            // Populate all carry values
            const carryBits = state.calculateCarryBits(state.value1, state.value2)
            state.carryValues = carryBits.slice(1) // Remove first carry out
        } else if (state.op === 'sub') {
            // Populate negated value and carry values
            state.subNegatedValue = ((~state.value2) + 1) & state.maxValue
            const carryBits = state.calculateCarryBits(state.value1, state.subNegatedValue)
            state.carryValues = carryBits.slice(1) // Remove first carry out
        }
        // Other operations don't need immediate state population
    }

    /**
     * Start animation for the current operation after debounce
     * Note: This function references animation functions defined later in the file
     */
    function startAnimation(wrapper, state) {
        // Map operations to their animation handlers
        const animationMap = {
            'add': () => startAdditionAnimation(wrapper, state),
            'sub': () => startSubtractionAnimation(wrapper, state),
            'and': () => startBitwiseAnimation(wrapper, state),
            'or':  () => startBitwiseAnimation(wrapper, state),
            'xor': () => startBitwiseAnimation(wrapper, state),
            'not': () => startBitwiseAnimation(wrapper, state),
            '<<':  () => startShiftAnimation(wrapper, state),
            '>>':  () => startShiftAnimation(wrapper, state),
            '>>>': () => startShiftAnimation(wrapper, state),
            'neg': () => startNegateAnimation(wrapper, state)
        }

        const handler = animationMap[state.op]
        if (handler) {
            state.debounceTimer = setTimeout(handler, ANIMATION_DEBOUNCE_MS)
        }
    }

    /**
     * Parse input value based on type (binary or decimal shift amount)
     */
    function parseInputValue(inputValue, isShiftAmount, maxValue) {
        if (isShiftAmount) {
            const decimalStr = inputValue.replace(/[^0-7]/g, '')
            return decimalStr ? Math.min(Math.max(parseInt(decimalStr, 10), 0), 7) : 0
        }
        const binaryStr = inputValue.replace(/[^01]/g, '')
        return binaryStr ? Math.min(parseInt(binaryStr, 2), maxValue) : 0
    }

    /**
     * Check if a keypress is a control key (navigation, editing, copy/paste)
     */
    function isControlKey(keyCode, ctrlOrMeta) {
        const controlKeys = [8, 9, 13, 27, 37, 38, 39, 40, 46, 35, 36]
        const copyPasteKeys = ctrlOrMeta && [65, 67, 86, 88].includes(keyCode)
        return controlKeys.includes(keyCode) || copyPasteKeys
    }

    // -------------------------------------------------------------------------
    // Event Handling
    // -------------------------------------------------------------------------

    function setupCalcInteractivity(wrapper, state) {
        const inputs = wrapper.querySelectorAll('.calc-input')

        inputs.forEach(input => {
            const operand = input.getAttribute('data-operand')
            const isShiftAmount = operand === '2' && ['<<', '>>', '>>>'].includes(state.op)

            // Prevent typing invalid characters
            input.addEventListener('keydown', (e) => {
                // Allow control keys (backspace, arrows, copy/paste, etc.)
                if (isControlKey(e.keyCode, e.ctrlKey || e.metaKey)) {
                    return
                }

                if (isShiftAmount) {
                    // Allow: 0-9 for shift amount
                    if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
                        return
                    }
                } else {
                    // Allow: 0 and 1 for binary
                    if ((e.keyCode === 48 || e.keyCode === 96) || (e.keyCode === 49 || e.keyCode === 97)) {
                        return
                    }
                }

                // Prevent all other keys
                e.preventDefault()
            })

            const handleInput = () => {
                const operand = input.getAttribute('data-operand')
                const isShiftAmount = operand === '2' && ['<<', '>>', '>>>'].includes(state.op)

                // Parse input value
                const newValue = parseInputValue(input.value, isShiftAmount, state.maxValue)

                if (operand === '1') {
                    state.value1 = newValue
                } else if (operand === '2') {
                    state.value2 = newValue
                }

                // Stop any ongoing animations and clear timers
                clearAnimationTimers(state)

                // Recalculate and update UI
                const calcResult = state.calculate()
                state.result = calcResult.result
                state.steps = calcResult.steps
                state.resultBeforeMask = calcResult.resultBeforeMask

                // Reset animation state based on operation type
                resetAnimationState(state)
                updateCalcUI(wrapper, state)

                // Start animation after debounce delay (only if enabled)
                if (state.animateEnabled) {
                    startAnimation(wrapper, state)
                } else {
                    // Show result immediately without animation
                    state.animationHasRun = true
                    state.animationStep = -1
                    state.animationPhase = 'complete'
                    populateImmediateState(state)
                    updateCalcUI(wrapper, state)
                }
            }

            const handleBlur = () => {
                // Format when input loses focus
                const operand = input.getAttribute('data-operand')
                const isShiftAmount = operand === '2' && ['<<', '>>', '>>>'].includes(state.op)

                if (operand === '1') {
                    input.value = state.value1.toString(2).padStart(state.bits, '0')
                } else if (operand === '2') {
                    if (isShiftAmount) {
                        input.value = state.value2.toString()
                    } else {
                        input.value = state.value2.toString(2).padStart(state.bits, '0')
                    }
                }
            }

            input.addEventListener('input', handleInput)
            input.addEventListener('keyup', handleInput)
            input.addEventListener('blur', handleBlur)
        })

        // Animation toggle button listener
        const animateBtn = wrapper.querySelector('.calc-animate-btn')
        if (animateBtn) {
            animateBtn.addEventListener('click', (e) => {
                state.animateEnabled = !state.animateEnabled
                animateBtn.setAttribute('data-enabled', state.animateEnabled)

                // Stop any ongoing animations
                clearAnimationTimers(state)

                if (!state.animateEnabled) {
                    // Show result immediately without animation
                    resetAnimationState(state)
                    state.animationHasRun = true
                    state.animationStep = -1
                    state.animationPhase = 'complete'
                    populateImmediateState(state)
                    updateCalcUI(wrapper, state)
                } else {
                    // Reset and restart animation
                    resetAnimationState(state)
                    updateCalcUI(wrapper, state)
                    startAnimation(wrapper, state)
                }
            })
        }
    }

    function startAdditionAnimation(wrapper, state) {
        // Real-time addition animation with on-the-fly carry calculation
        // Start at position 0 (rightmost)
        state.animationStep = 0
        state.animationPhase = 'inputs'
        state.animationHasRun = true
        state.currentCarry = 0 // Start with no carry
        state.carryValues[0] = 0 // Initial carry-in to position 0 is always 0
        updateCalcUI(wrapper, state)

        const runBitAnimation = () => {
            const bitPos = state.animationStep

            // Phase 1: Show inputs (operands and carry in)
            state.animationPhase = 'inputs'
            updateCalcUI(wrapper, state)

            state.phaseTimer = setTimeout(() => {
                // Calculate addition for this position
                const bit1 = (state.value1 >> bitPos) & 1
                const bit2 = (state.value2 >> bitPos) & 1
                const sum = bit1 + bit2 + state.currentCarry

                // Calculate carry out for next position
                const carryOut = sum >> 1

                // Store the carry value at the NEXT position (to the left)
                if (bitPos + 1 < state.bits) {
                    state.carryValues[bitPos + 1] = carryOut
                }

                // Update current carry for next position
                state.currentCarry = carryOut

                // Phase 2: Show outputs (result and carry out)
                state.animationPhase = 'carryOut'
                updateCalcUI(wrapper, state)

                state.phaseTimer = setTimeout(() => {
                    // Phase 3: Pause with no highlighting
                    state.animationPhase = 'pause'
                    updateCalcUI(wrapper, state)

                    state.phaseTimer = setTimeout(() => {
                        // Move to next position
                        state.animationStep++

                        if (state.animationStep >= state.bits) {
                            // Animation complete
                            state.animationTimer = null
                            state.phaseTimer = null
                            state.animationStep = -1
                            updateCalcUI(wrapper, state)
                        } else {
                            // Continue to next bit position
                            runBitAnimation()
                        }
                    }, ANIMATION_PAUSE_PHASE_MS)
                }, ANIMATION_CARRYOUT_PHASE_MS)
            }, ANIMATION_INPUT_PHASE_MS)
        }

        // Start the animation sequence
        runBitAnimation()
    }

    function startBitwiseAnimation(wrapper, state) {
        // Real-time bitwise operation animation
        // Start at position 0 (rightmost)
        state.animationStep = 0
        state.animationPhase = 'inputs'
        state.animationHasRun = true
        updateCalcUI(wrapper, state)

        const runBitAnimation = () => {
            const bitPos = state.animationStep

            // Phase 1: Show inputs (highlight 1-bits at current position)
            state.animationPhase = 'inputs'
            updateCalcUI(wrapper, state)

            state.phaseTimer = setTimeout(() => {
                // Phase 2: Show result
                state.animationPhase = 'result'
                updateCalcUI(wrapper, state)

                state.phaseTimer = setTimeout(() => {
                    // Phase 3: Pause with no highlighting
                    state.animationPhase = 'pause'
                    updateCalcUI(wrapper, state)

                    state.phaseTimer = setTimeout(() => {
                        // Move to next position
                        state.animationStep++

                        if (state.animationStep >= state.bits) {
                            // Animation complete
                            state.animationTimer = null
                            state.phaseTimer = null
                            state.animationStep = -1
                            updateCalcUI(wrapper, state)
                        } else {
                            // Continue to next bit position
                            runBitAnimation()
                        }
                    }, ANIMATION_BITWISE_PAUSE_PHASE_MS)
                }, ANIMATION_BITWISE_RESULT_PHASE_MS)
            }, ANIMATION_BITWISE_INPUT_PHASE_MS)
        }

        // Start the animation sequence
        runBitAnimation()
    }

    function startNegateAnimation(wrapper, state) {
        // Two's complement negation animation
        // Phase 1: Invert bits one-by-one (left to right)
        // Phase 2: Show +1
        // Phase 3: Bit-by-bit addition animation
        // Phase 4: Show result

        state.animationStep = state.bits - 1 // Start from leftmost (MSB)
        state.animationPhase = 'invert-input'
        state.animationHasRun = true
        state.carryValues[0] = 0 // Initial carry-in is 0
        updateCalcUI(wrapper, state)

        const runBitInversion = () => {
            const bitPos = state.animationStep

            // Phase 1: Highlight input bit in value1 (1s)
            state.animationPhase = 'invert-input'
            updateCalcUI(wrapper, state)

            state.phaseTimer = setTimeout(() => {
                // Calculate inverted bit
                const bit = (state.value1 >> bitPos) & 1
                const invertedBit = bit ^ 1 // Flip the bit
                state.negateInvertedBits[bitPos] = invertedBit

                // Phase 2: Highlight inverted bit in row 2 (0.5s)
                state.animationPhase = 'invert-output'
                updateCalcUI(wrapper, state)

                state.phaseTimer = setTimeout(() => {
                    // Move to next position (going right)
                    state.animationStep--

                    if (state.animationStep < 0) {
                        // All bits inverted - pause before showing +1
                        state.animationPhase = 'pause'
                        updateCalcUI(wrapper, state)

                        state.phaseTimer = setTimeout(() => {
                            // Now show and highlight +1
                            state.animationPhase = 'plus-one'
                            updateCalcUI(wrapper, state)

                            state.phaseTimer = setTimeout(() => {
                                // Start bit-by-bit addition animation
                                state.animationStep = 0 // Start from rightmost (LSB)
                                state.currentCarry = 0
                                runBitAddition()
                            }, ANIMATION_NEG_PLUSONE_PHASE_MS)
                        }, ANIMATION_NEG_PAUSE_PHASE_MS)
                    } else {
                        // Continue to next bit
                        runBitInversion()
                    }
                }, ANIMATION_NEG_INVERT_PHASE_MS)
            }, ANIMATION_NEG_INPUT_PHASE_MS)
        }

        const runBitAddition = () => {
            const bitPos = state.animationStep

            // Phase 1: Show inputs (inverted bit + 1 if LSB + carry in)
            state.animationPhase = 'neg-add-inputs'
            updateCalcUI(wrapper, state)

            state.phaseTimer = setTimeout(() => {
                // Calculate addition for this position
                const invertedBit = state.negateInvertedBits[bitPos]
                const plusOneBit = bitPos === 0 ? 1 : 0 // Only add 1 at LSB
                const sum = invertedBit + plusOneBit + state.currentCarry

                // Calculate carry out for next position
                const carryOut = sum >> 1

                // Store the carry value at the NEXT position (to the left)
                if (bitPos + 1 < state.bits) {
                    state.carryValues[bitPos + 1] = carryOut
                }

                // Update current carry for next position
                state.currentCarry = carryOut

                // Phase 2: Show outputs (result and carry out)
                state.animationPhase = 'neg-add-carryout'
                updateCalcUI(wrapper, state)

                state.phaseTimer = setTimeout(() => {
                    // Phase 3: Pause
                    state.animationPhase = 'neg-add-pause'
                    updateCalcUI(wrapper, state)

                    state.phaseTimer = setTimeout(() => {
                        // Move to next position
                        state.animationStep++

                        if (state.animationStep >= state.bits) {
                            // Addition complete - show final result highlighted
                            state.animationPhase = 'result'
                            updateCalcUI(wrapper, state)

                            state.phaseTimer = setTimeout(() => {
                                // Animation complete
                                state.animationStep = -1
                                state.animationPhase = 'complete'
                                state.phaseTimer = null
                                updateCalcUI(wrapper, state)
                            }, ANIMATION_NEG_RESULT_PHASE_MS)
                        } else {
                            // Continue to next bit position
                            runBitAddition()
                        }
                    }, ANIMATION_PAUSE_PHASE_MS)
                }, ANIMATION_CARRYOUT_PHASE_MS)
            }, ANIMATION_INPUT_PHASE_MS)
        }

        // Start the animation sequence
        runBitInversion()
    }

    function startSubtractionAnimation(wrapper, state) {
        // Subtraction animation using two's complement
        // Phase 1: Highlight all of B (1s)
        // Phase 2: Calculate and show -B (two's complement of B), highlighted (1s)
        // Phase 3: Bit-by-bit addition of A + (-B)

        state.animationStep = -1 // Not yet started bit-by-bit addition
        state.animationPhase = 'highlight-b'
        state.animationHasRun = true
        state.currentCarry = 0
        state.carryValues[0] = 0 // Initial carry-in to position 0 is always 0
        updateCalcUI(wrapper, state)

        // Phase 1: Highlight all of B for 1s
        state.phaseTimer = setTimeout(() => {
            // Calculate -B (two's complement)
            state.subNegatedValue = ((~state.value2) + 1) & state.maxValue

            // Phase 2: Show -B highlighted for 1s
            state.animationPhase = 'show-negb'
            updateCalcUI(wrapper, state)

            state.phaseTimer = setTimeout(() => {
                // Start bit-by-bit addition animation
                state.animationStep = 0
                state.animationPhase = 'add-inputs'
                updateCalcUI(wrapper, state)

                const runBitAddition = () => {
                    const bitPos = state.animationStep

                    // Phase 3a: Show inputs (A, -B, and carry in)
                    state.animationPhase = 'add-inputs'
                    updateCalcUI(wrapper, state)

                    state.phaseTimer = setTimeout(() => {
                        // Calculate addition for this position
                        const bit1 = (state.value1 >> bitPos) & 1
                        const bit2 = (state.subNegatedValue >> bitPos) & 1
                        const sum = bit1 + bit2 + state.currentCarry

                        // Calculate carry out for next position
                        const carryOut = sum >> 1

                        // Store the carry value at the NEXT position (to the left)
                        if (bitPos + 1 < state.bits) {
                            state.carryValues[bitPos + 1] = carryOut
                        }

                        // Update current carry for next position
                        state.currentCarry = carryOut

                        // Phase 3b: Show outputs (result and carry out)
                        state.animationPhase = 'add-carryout'
                        updateCalcUI(wrapper, state)

                        state.phaseTimer = setTimeout(() => {
                            // Phase 3c: Pause with no highlighting
                            state.animationPhase = 'add-pause'
                            updateCalcUI(wrapper, state)

                            state.phaseTimer = setTimeout(() => {
                                // Move to next position
                                state.animationStep++

                                if (state.animationStep >= state.bits) {
                                    // Animation complete
                                    state.animationStep = -1
                                    state.animationPhase = 'complete'
                                    state.phaseTimer = null
                                    updateCalcUI(wrapper, state)
                                } else {
                                    // Continue to next bit
                                    runBitAddition()
                                }
                            }, ANIMATION_SUB_ADD_PAUSE_MS)
                        }, ANIMATION_SUB_ADD_CARRYOUT_MS)
                    }, ANIMATION_SUB_ADD_INPUT_MS)
                }

                // Start the bit-by-bit addition
                runBitAddition()
            }, ANIMATION_SUB_SHOW_NEGB_MS)
        }, ANIMATION_SUB_HIGHLIGHT_B_MS)
    }

    function startShiftAnimation(wrapper, state) {
        const shiftAmount = state.value2

        state.animationHasRun = true

        const binary1 = state.value1.toString(2).padStart(state.bits, '0')
        state.shiftIteration = 0

        // Initialize bits at the start (needed for isShiftAnimating check)
        state.shiftCurrentBits = binary1.split('')
        state.shiftOriginalBits = new Array(state.bits).fill(true)
        state.shiftLostBit = null // Initialize lost bit

        // Phase 1: Highlight 1s in value1
        state.shiftPhase = 'highlight-value1'
        updateCalcUI(wrapper, state)

        state.phaseTimer = setTimeout(() => {
            // Phase 2: Copy to result and highlight (1s)
            state.shiftPhase = 'copy'
            updateCalcUI(wrapper, state)

            state.phaseTimer = setTimeout(() => {
                // Start the shift iterations
                performShiftIteration()
            }, ANIMATION_SHIFT_COPY_PHASE_MS)
        }, ANIMATION_SHIFT_VALUE1_PHASE_MS)

        const performShiftIteration = () => {
            if (state.shiftIteration >= shiftAmount) {
                // Animation complete
                state.shiftCurrentBits = null
                state.shiftOriginalBits = null
                state.shiftLostBit = null
                state.shiftIteration = -1
                state.shiftPhase = null
                state.phaseTimer = null
                updateCalcUI(wrapper, state)
                return
            }

            // Determine padding bit
            let paddingBit
            if (state.op === '<<' || state.op === '>>') {
                paddingBit = '0' // Logical shift: fill with 0
            } else {
                // Arithmetic right shift: fill with sign bit
                const signBit = state.shiftCurrentBits[0] // MSB
                paddingBit = signBit
            }

            // Perform the shift and capture the lost bit
            if (state.op === '<<') {
                // Left shift: move bits left, add 0 on right
                state.shiftLostBit = state.shiftCurrentBits.shift() // Capture bit shifted out from left
                state.shiftCurrentBits.push(paddingBit)

                state.shiftOriginalBits.shift()
                state.shiftOriginalBits.push(false) // Padding bit is not original
            } else {
                // Right shift: move bits right, add padding on left
                state.shiftLostBit = state.shiftCurrentBits.pop() // Capture bit shifted out from right
                state.shiftCurrentBits.unshift(paddingBit)

                state.shiftOriginalBits.pop()
                state.shiftOriginalBits.unshift(false) // Padding bit is not original
            }

            // Phase 3: Shift with highlighting
            state.shiftPhase = 'shift'
            updateCalcUI(wrapper, state)

            state.phaseTimer = setTimeout(() => {
                // Move to next iteration
                state.shiftIteration++
                performShiftIteration()
            }, ANIMATION_SHIFT_STEP_PHASE_MS)
        }
    }

    function updateCalcUI(wrapper, state) {
        const opInfo = getOperationInfo(state.op)
        const isBinaryOp = state.value2 !== null

        // Update input fields with binary values (only if not focused)
        const input1 = wrapper.querySelector('.calc-input[data-operand="1"]')
        if (input1 && document.activeElement !== input1) {
            input1.value = state.value1.toString(2).padStart(state.bits, '0')
        }

        if (isBinaryOp) {
            const input2 = wrapper.querySelector('.calc-input[data-operand="2"]')
            if (input2 && document.activeElement !== input2) {
                const isShiftOp = ['<<', '>>', '>>>'].includes(state.op)
                if (isShiftOp) {
                    input2.value = state.value2.toString()
                } else {
                    input2.value = state.value2.toString(2).padStart(state.bits, '0')
                }
            }
        }

        // Update binary stack display
        const binaryStack = wrapper.querySelector('.calc-binary-stack')
        if (binaryStack) {
            binaryStack.innerHTML = renderBinaryStack(state, opInfo, isBinaryOp)
        }

        // Update steps
        const stepsList = wrapper.querySelector('.calc-steps-list')
        if (stepsList) {
            stepsList.innerHTML = renderSteps(state.steps)
        }
    }

    // -------------------------------------------------------------------------
    // Expression Parser
    // -------------------------------------------------------------------------

    /**
     * Parse calculator expression from element content
     * Formats:
     *   Binary ops: "01100100 + 01111011" or "100 + 123"
     *   Unary ops: "not 01111011" or "neg 100"
     * Returns: { value1, value2, op }
     */
    function parseCalculatorExpression(content) {
        const trimmed = content.trim()

        // Helper to convert binary or decimal to decimal number
        const parseValue = (str) => {
            str = str.trim()
            // Check if it's binary (only 0s and 1s)
            if (/^[01]+$/.test(str)) {
                return parseInt(str, 2)
            }
            // Otherwise parse as decimal
            return parseInt(str, 10)
        }

        // Unary operations: "not <value>" or "neg <value>"
        let match = trimmed.match(/^(not|neg)\s+([01]+|\d+)$/i)
        if (match) {
            return {
                value1: parseValue(match[2]),
                value2: null,
                op: match[1].toLowerCase()
            }
        }

        // Binary operations with symbol operators: "<value1> <op> <value2>"
        // Support: +, -, <<, >>, >>>, and, or, xor
        match = trimmed.match(/^([01]+|\d+)\s*(\+|\-|<<|>>>|>>|and|or|xor)\s+([01]+|\d+)$/i)
        if (match) {
            const opMap = {
                '+': 'add',
                '-': 'sub',
                '<<': '<<',
                '>>': '>>',
                '>>>': '>>>',
                'and': 'and',
                'or': 'or',
                'xor': 'xor'
            }
            return {
                value1: parseValue(match[1]),
                value2: parseValue(match[3]),
                op: opMap[match[2].toLowerCase()] || match[2].toLowerCase()
            }
        }

        // Fallback: return defaults
        console.warn('Could not parse calculator expression:', trimmed)
        return { value1: 0, value2: 0, op: 'add' }
    }

    // -------------------------------------------------------------------------
    // Main Plugin Function
    // -------------------------------------------------------------------------

    function processCalculators() {
        const calcElements = document.querySelectorAll('.markdown-section calculator')

        calcElements.forEach(element => {
            // Skip if already processed
            if (element.querySelector('.calc-wrapper')) return

            // Parse expression from element content
            const expression = element.textContent || ''
            const { value1, value2, op } = parseCalculatorExpression(expression)

            // Clear the original text content
            element.textContent = ''

            const state = new CalcState(value1, value2, op)
            const calcResult = state.calculate()
            state.result = calcResult.result
            state.steps = calcResult.steps
            state.resultBeforeMask = calcResult.resultBeforeMask

            // Initialize arrays for real-time animation
            if (state.op === 'add') {
                state.carryValues = new Array(state.bits).fill(null)
                state.currentCarry = 0
            } else if (state.op === 'neg') {
                state.negateInvertedBits = new Array(state.bits).fill(null)
            }

            const ui = createCalcUI(state)
            element.appendChild(ui)

            setupCalcInteractivity(ui, state)

            // Start animation on initial load after debounce delay
            if (state.op === 'add') {
                state.debounceTimer = setTimeout(() => {
                    startAdditionAnimation(ui, state)
                }, ANIMATION_DEBOUNCE_MS)
            } else if (['and', 'or', 'xor', 'not'].includes(state.op)) {
                state.debounceTimer = setTimeout(() => {
                    startBitwiseAnimation(ui, state)
                }, ANIMATION_DEBOUNCE_MS)
            } else if (state.op === 'neg') {
                state.debounceTimer = setTimeout(() => {
                    startNegateAnimation(ui, state)
                }, ANIMATION_DEBOUNCE_MS)
            } else if (['<<', '>>', '>>>'].includes(state.op)) {
                state.debounceTimer = setTimeout(() => {
                    startShiftAnimation(ui, state)
                }, ANIMATION_DEBOUNCE_MS)
            }
        })
    }

    // -------------------------------------------------------------------------
    // Register Docsify Plugin
    // -------------------------------------------------------------------------

    if (window.$docsify) {
        window.$docsify.plugins = (window.$docsify.plugins || []).concat(
            function (hook) {
                hook.doneEach(function () {
                    processCalculators()
                })
            }
        )
    }

})()
