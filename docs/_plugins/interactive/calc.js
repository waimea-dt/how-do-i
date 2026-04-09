/**
 * docsify-calc.js — Interactive binary calculator for teaching bitwise and arithmetic operations
 *
 * Visualizes operations on binary numbers with carry/overflow flags, signed/unsigned values,
 * and step-by-step explanations.
 *
 * Usage in markdown:
 *   <calc value1="100" value2="123" op="add" bits="8"></calc>
 *   <calc value1="100" value2="123" op="or" bits="8"></calc>
 *   <calc value1="100" op="not" bits="8"></calc>
 *   <calc value1="100" value2="3" op="<<" bits="8"></calc>
 *
 * Supported operations:
 *   - Arithmetic: add, sub
 *   - Bitwise: and, or, xor, not
 *   - Shifts: <<, >> (logical), >>> (arithmetic)
 *   - Special: neg (two's complement negation)
 */

;(function () {

    // -------------------------------------------------------------------------
    // Animation Timing Constants
    // -------------------------------------------------------------------------
    const ANIMATION_INPUT_PHASE_MS = 1000      // Duration to highlight input operands and carry in
    const ANIMATION_CARRYOUT_PHASE_MS = 1000   // Duration to highlight result and carry out
    const ANIMATION_PAUSE_PHASE_MS = 500       // Duration of pause between bit positions (no highlighting)
    const ANIMATION_DEBOUNCE_MS = 2000         // Delay before starting animation after input change

    // Subtraction animation timing
    const ANIMATION_SUB_INPUT_PHASE_MS = 1000  // Duration to highlight digits to subtract
    const ANIMATION_SUB_BORROW_STEP_MS = 500   // Duration for each borrow propagation step
    const ANIMATION_SUB_RESULT_PHASE_MS = 1000 // Duration to highlight result (matches addition)
    const ANIMATION_SUB_PAUSE_PHASE_MS = 500   // Duration of pause between positions

    // Bitwise operation animation timing
    const ANIMATION_BITWISE_INPUT_PHASE_MS = 1000  // Duration to highlight input bits that are 1
    const ANIMATION_BITWISE_RESULT_PHASE_MS = 1000 // Duration to highlight result bit
    const ANIMATION_BITWISE_PAUSE_PHASE_MS = 500   // Duration of pause between positions

    // Shift operation animation timing (ripple animation)
    const ANIMATION_SHIFT_VALUE1_PHASE_MS = 1000   // Duration to highlight ALL bits in value1 (1s)
    const ANIMATION_SHIFT_COPY_PHASE_MS = 1000     // Duration to copy to result and highlight (1s)
    const ANIMATION_SHIFT_STEP_PHASE_MS = 1000     // Duration for each shift iteration (1s)
    const ANIMATION_SHIFT_PAUSE_PHASE_MS = 0       // No pause - shift happens immediately

    // -------------------------------------------------------------------------
    // Calculator State Model
    // -------------------------------------------------------------------------

    class CalcState {
        constructor(value1, value2, op, bits) {
            this.value1 = parseInt(value1) || 0
            this.value2 = value2 !== null ? parseInt(value2) : null
            this.op = op
            this.bits = Math.min(parseInt(bits) || 8, 8)
            this.maxValue = Math.pow(2, this.bits) - 1
            this.result = null
            this.steps = []
            // Animation state
            this.animationStep = -1 // -1 = not started/complete, 0..bits-1 = current position
            this.animationPhase = 'inputs' // For add: 'inputs', 'carryOut', 'pause'. For sub: 'inputs', 'borrow', 'result', 'pause'
            this.animationTimer = null
            this.phaseTimer = null
            this.debounceTimer = null
            this.animationHasRun = false // Track if animation has started (to hide carries/borrows initially)
            // Real-time addition animation state
            this.carryValues = null // Array of carry values (null = not calculated yet, 0 or 1 = carry value)
            this.currentCarry = 0 // Current carry value during addition
            // Real-time subtraction animation state
            this.borrowValues = null // Array of borrow values (null = not set, number = borrow value)
            this.value1Crossed = null // Array of booleans indicating if value1 bit has been crossed out
            this.borrowSearchPos = -1 // Current position being searched during borrow
            this.borrowSourcePos = -1 // Position we're borrowing from
            this.borrowPropagatePos = -1 // Current position during propagation
            // Real-time shift animation state (ripple animation)
            this.shiftCurrentBits = null // Array of current bit values during animation
            this.shiftOriginalBits = null // Boolean array marking bits from original value (for highlighting)
            this.shiftIteration = -1 // Current shift iteration (0 to shiftAmount-1)
            this.shiftPhase = null // 'highlight-value1', 'copy', 'shift'
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
            const borrow = sum <= this.maxValue

            const steps = this.generateSubSteps(v1, v2, negV2, result, borrow)

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
            steps.push(`Perform bit-by-bit addition from right to left`)

            // Show the addition process
            const carryBits = this.calculateCarryBits(v1, v2)

            steps.push(`>>> Carry bits: ${carryBits.join(' ')}`)
            steps.push(`Final carry: ${carry ? '1 (overflow detected)' : '0'}`)

            return steps
        }

        generateSubSteps(v1, v2, negV2, result, borrow) {
            const steps = []
            steps.push(`<p class="calc-step-title">Binary Subtraction</p>`)
            steps.push(`Convert to addition using two's complement`)
            steps.push(`>>> Invert ${v2}: ${this.toBinary(~v2 & this.maxValue)}`)
            steps.push(`>>> Add 1: ${this.toBinary(negV2)}`)
            steps.push(`Add ${v1} + ${negV2} = ${result}`)
            steps.push(`Borrow: ${!borrow ? '1 (underflow)' : '0'}`)

            return steps
        }

        generateBitwiseSteps(opName, v1, v2, result) {
            const steps = []
            steps.push(`<p class="calc-step-title">${opName} Operation</p>`)
            steps.push(`Apply ${opName} to each bit position`)

            const truthTable = {
                'AND': [[0,0,0], [0,1,0], [1,0,0], [1,1,1]],
                'OR':  [[0,0,0], [0,1,1], [1,0,1], [1,1,1]],
                'XOR': [[0,0,0], [0,1,1], [1,0,1], [1,1,0]]
            }[opName]

            if (truthTable) {
                steps.push(`>>> Truth table: ${truthTable.map(r => `${r[0]}${opName}${r[1]}=${r[2]}`).join(', ')}`)
            }

            return steps
        }

        generateNotSteps(v1, result) {
            const steps = []
            steps.push(`<p class="calc-step-title">NOT Operation (Bitwise Inversion)</p>`)
            steps.push(`Flip each bit: 0 → 1, 1 → 0`)
            steps.push(`Result: ${this.toBinary(result)}`)

            return steps
        }

        generateShiftSteps(direction, v1, amount, result) {
            const steps = []
            const dirName = direction === 'left' ? 'Left Shift' :
                           direction === 'arithmetic-right' ? 'Arithmetic Right Shift' :
                           'Logical Right Shift'

            steps.push(`<p class="calc-step-title">${dirName}</p>`)

            if (direction === 'left') {
                steps.push(`Shift bits ${amount} position(s) to the left`)
                steps.push(`>>> Fill with zeros on the right`)
                steps.push(`>>> Equivalent to multiplying by 2<sup>${amount}</sup> = ${Math.pow(2, amount)}`)
            } else if (direction === 'arithmetic-right') {
                steps.push(`Shift bits ${amount} position(s) to the right`)
                steps.push(`>>> Fill with sign bit (preserve sign)`)
                steps.push(`>>> Equivalent to dividing by 2<sup>${amount}</sup> = ${Math.pow(2, amount)}`)
            } else {
                steps.push(`Shift bits ${amount} position(s) to the right`)
                steps.push(`>>> Fill with zeros on the left`)
            }

            return steps
        }

        generateNegateSteps(v1, result) {
            const steps = []
            steps.push(`<p class="calc-step-title">Two's Complement Negation</p>`)
            steps.push(`Step 1: Invert all bits`)
            steps.push(`>>> ${this.toBinary(v1)} → ${this.toBinary(~v1 & this.maxValue)}`)
            steps.push(`Step 2: Add 1`)
            steps.push(`>>> ${this.toBinary((~v1) & this.maxValue)} + 1 = ${this.toBinary(result)}`)

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

        wrapper.innerHTML = `
            <div class="calc-container">
                <div class="calc-header">
                    <div class="calc-operation-display">
                        <span class="calc-op-symbol">${opInfo.symbol}</span>
                        <span class="calc-op-name">${opInfo.name}</span>
                    </div>
                </div>

                <div class="calc-inputs">
                    <div class="calc-input-group">
                        <label class="calc-input-label">Value 1 (Binary)</label>
                        <input type="text" class="calc-input" data-operand="1" value="${state.value1.toString(2).padStart(state.bits, '0')}" maxlength="${state.bits}" pattern="[01]*">
                    </div>
                    ${isBinaryOp ? `
                    <div class="calc-input-group">
                        <label class="calc-input-label">${['<<', '>>', '>>>'].includes(state.op) ? 'Shift Amount (Decimal)' : 'Value 2 (Binary)'}</label>
                        <input type="text" class="calc-input" data-operand="2" value="${['<<', '>>', '>>>'].includes(state.op) ? state.value2 : state.value2.toString(2).padStart(state.bits, '0')}" maxlength="${['<<', '>>', '>>>'].includes(state.op) ? '1' : state.bits}" pattern="${['<<', '>>', '>>>'].includes(state.op) ? '[0-9]*' : '[01]*'}">
                    </div>
                    ` : ''}
                </div>

                <div class="calc-binary-stack">
                    ${renderBinaryStack(state, opInfo, isBinaryOp)}
                </div>

                <div class="calc-steps">
                    <div class="calc-steps-title">How It Works</div>
                    <div class="calc-steps-list">
                        ${renderSteps(state.steps)}
                    </div>
                </div>
            </div>
        `

        return wrapper
    }

    // -------------------------------------------------------------------------
    // Rendering Helper Functions
    // -------------------------------------------------------------------------

    /**
     * Render the borrow row for subtraction operations
     */
    function renderBorrowRow(state, animStep, isAnimating) {
        if (state.op !== 'sub' || !state.borrowValues) return ''

        let html = `<div class="calc-stack-row calc-stack-borrow">`
        html += '<span class="calc-stack-operator"></span>'
        html += '<span class="calc-stack-overflow-placeholder"></span>'

        for (let i = 0; i < state.bits; i++) {
            const bitPos = state.bits - 1 - i
            const borrowValue = state.borrowValues[bitPos]

            let displayValue = '\u00b7' // Default: dot for null
            let isActive = false

            if (borrowValue !== null) {
                displayValue = borrowValue.toString()
            }

            // Highlight during inputs phase if this is the current position and has a borrow
            if (isAnimating && bitPos === animStep && state.animationPhase === 'inputs' && borrowValue !== null) {
                const v2Bit = (state.value2 >> bitPos) & 1
                if (borrowValue < v2Bit) {
                    isActive = 'error'
                } else {
                    isActive = true
                }
            }

            // Highlight during borrow propagate phase only
            if (isAnimating && state.animationPhase === 'borrow' && bitPos === state.borrowPropagatePos) {
                isActive = true
            }

            const activeClass = isActive === 'error' ? ' calc-stack-error' : (isActive ? ' calc-stack-active' : '')
            html += `<span class="calc-stack-borrow-bit${activeClass}">${displayValue}</span>`
        }

        html += '<span class="calc-stack-spacer"></span>'
        html += '<span class="calc-stack-interp-item"></span>'
        html += '<span class="calc-stack-interp-item"></span>'
        html += '<span class="calc-stack-interp-item"></span>'
        html += '</div>'

        return html
    }

    /**
     * Render value1 row with operation-specific highlighting
     */
    function renderValue1Row(state, binary1, animStep, isAnimating, isShiftAnimating, opInfo, isBinaryOp, isShiftOp) {
        let html = `<div class="calc-stack-row calc-stack-value1">`

        // Operator column
        if (isBinaryOp && !isShiftOp) {
            html += `<span class="calc-stack-operator"></span>`
        } else {
            html += `<span class="calc-stack-operator">${opInfo.symbol}</span>`
        }
        html += '<span class="calc-stack-overflow-placeholder"></span>'

        // Render bits based on operation type
        if (['and', 'or', 'xor', 'not'].includes(state.op) && state.animationStep >= 0 && state.animationStep < state.bits) {
            // Bitwise operations
            for (let i = 0; i < state.bits; i++) {
                const bit = binary1[i]
                const bitPos = state.bits - 1 - i
                const isActive = bitPos === animStep && state.animationPhase === 'inputs'
                const activeClass = isActive ? ' calc-stack-active' : ''
                const bitOneClass = isActive && bit === '1' ? ' calc-stack-bit-one' : ''
                html += `<span class="calc-stack-digit calc-stack-value1${activeClass}${bitOneClass}">${bit}</span>`
            }
        } else if (state.op === 'sub' && state.value1Crossed) {
            // Subtraction with crossed-out digits
            for (let i = 0; i < state.bits; i++) {
                const bit = binary1[i]
                const bitPos = state.bits - 1 - i
                const isCrossed = state.value1Crossed[bitPos]
                let isActive = false

                if (isAnimating && bitPos === animStep && state.animationPhase === 'inputs') {
                    const borrowValue = state.borrowValues[bitPos]
                    if (borrowValue === null) {
                        const v1Bit = (state.value1 >> bitPos) & 1
                        const v2Bit = (state.value2 >> bitPos) & 1
                        isActive = v1Bit < v2Bit ? 'error' : true
                    }
                }

                if (isAnimating && state.animationPhase === 'borrow') {
                    if (bitPos === state.borrowSearchPos || bitPos === state.borrowSourcePos) {
                        isActive = true
                    }
                }

                const activeClass = isActive === 'error' ? ' calc-stack-error' : (isActive ? ' calc-stack-active' : '')
                const greyedClass = isCrossed ? ' calc-stack-borrowed' : ''
                html += `<span class="calc-stack-digit calc-stack-value1${activeClass}${greyedClass}">${bit}</span>`
            }
        } else if (state.op === 'add') {
            // Addition
            for (let i = 0; i < state.bits; i++) {
                const bit = binary1[i]
                const bitPos = state.bits - 1 - i
                const isActive = isAnimating && bitPos === animStep && state.animationPhase === 'inputs'
                const activeClass = isActive ? ' calc-stack-active' : ''
                html += `<span class="calc-stack-digit calc-stack-value1${activeClass}">${bit}</span>`
            }
        } else if (isShiftAnimating) {
            // Shift operations
            for (let i = 0; i < state.bits; i++) {
                const bit = binary1[i]
                const isActive = state.shiftPhase === 'highlight-value1'
                const activeClass = isActive ? ' calc-stack-active' : ''
                html += `<span class="calc-stack-digit calc-stack-value1${activeClass}">${bit}</span>`
            }
        } else {
            html += renderBinaryDigits(binary1, 'value1')
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
        html += `<span class="calc-stack-operator">${opInfo.symbol}</span>`
        html += '<span class="calc-stack-overflow-placeholder"></span>'

        // Render bits based on operation type
        if (['and', 'or', 'xor'].includes(state.op) && state.animationStep >= 0 && state.animationStep < state.bits) {
            // Bitwise operations
            for (let i = 0; i < state.bits; i++) {
                const bit = binary2[i]
                const bitPos = state.bits - 1 - i
                const isActive = bitPos === animStep && state.animationPhase === 'inputs'
                const activeClass = isActive ? ' calc-stack-active' : ''
                const bitOneClass = isActive && bit === '1' ? ' calc-stack-bit-one' : ''
                html += `<span class="calc-stack-digit calc-stack-value2${activeClass}${bitOneClass}">${bit}</span>`
            }
        } else if (state.op === 'add' || state.op === 'sub') {
            // Addition and subtraction
            for (let i = 0; i < state.bits; i++) {
                const bit = binary2[i]
                const bitPos = state.bits - 1 - i
                let isActive = false

                if (isAnimating && bitPos === animStep && state.animationPhase === 'inputs') {
                    if (state.op === 'sub') {
                        const borrowValue = state.borrowValues[bitPos]
                        const v1Bit = (state.value1 >> bitPos) & 1
                        const v2Bit = (state.value2 >> bitPos) & 1
                        const effectiveV1 = borrowValue !== null ? borrowValue : v1Bit
                        isActive = effectiveV1 < v2Bit ? 'error' : true
                    } else {
                        isActive = true
                    }
                }

                // Subtraction: highlight during borrow propagate phase
                if (state.op === 'sub' && isAnimating && state.animationPhase === 'borrow' &&
                    bitPos === animStep && bitPos === state.borrowPropagatePos) {
                    isActive = true
                }

                const activeClass = isActive === 'error' ? ' calc-stack-error' : (isActive ? ' calc-stack-active' : '')
                html += `<span class="calc-stack-digit calc-stack-value2${activeClass}">${bit}</span>`
            }
        } else {
            html += renderBinaryDigits(binary2, 'value2')
        }

        html += renderInterpretations(state.value2, state)
        html += '</div>'

        return html
    }

    /**
     * Render the carry row for addition operations
     */
    function renderCarryRow(state, animStep, isAnimating) {
        if (state.op !== 'add' || !state.carryValues) return ''

        let html = `<div class="calc-stack-row calc-stack-carry">`
        html += '<span class="calc-stack-operator"></span>'
        html += '<span class="calc-stack-overflow-placeholder"></span>'

        for (let i = 0; i < state.bits; i++) {
            const bitPos = state.bits - 1 - i
            const carryBit = state.carryValues[bitPos]

            // Highlight carry IN during 'inputs' phase
            const isCarryIn = isAnimating && bitPos === animStep && carryBit === 1 && state.animationPhase === 'inputs'

            // Highlight carry OUT during 'carryOut' phase
            const isCarryOut = isAnimating && bitPos === animStep + 1 && carryBit === 1 && state.animationPhase === 'carryOut'

            const isActive = isCarryIn || isCarryOut
            const activeClass = isActive ? ' calc-stack-active' : ''
            const displayValue = carryBit !== null ? (carryBit === 1 ? '1' : '·') : '·'

            html += `<span class="calc-stack-carry-bit${activeClass}">${displayValue}</span>`
        }

        html += '<span class="calc-stack-spacer"></span>'
        html += '<span class="calc-stack-interp-item"></span>'
        html += '<span class="calc-stack-interp-item"></span>'
        html += '<span class="calc-stack-interp-item"></span>'
        html += '</div>'

        return html
    }

    /**
     * Render the result row with progressive revelation and real-time values
     */
    function renderResultRow(state, binaryResult, animStep, isAnimating, isShiftAnimating, isShiftOp, hasOverflowBit, overflowBit) {
        let html = `<div class="calc-stack-row calc-stack-result">`
        html += '<span class="calc-stack-operator"></span>'

        // Handle shift operations separately
        if (isShiftAnimating) {
            html += '<span class="calc-stack-overflow-placeholder"></span>'

            if (state.shiftPhase === 'highlight-value1') {
                // Show ? during highlight-value1 phase
                for (let i = 0; i < state.bits; i++) {
                    html += `<span class="calc-stack-digit calc-stack-result calc-stack-unknown">?</span>`
                }
                html += `
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
            } else {
                // Show bits during copy and shift phases
                for (let i = 0; i < state.bits; i++) {
                    const bit = state.shiftCurrentBits[i]
                    const isOriginal = state.shiftOriginalBits[i]
                    const isActive = state.shiftPhase === 'copy' || (state.shiftPhase === 'shift' && isOriginal)
                    const activeClass = isActive ? ' calc-stack-active' : ''
                    html += `<span class="calc-stack-digit calc-stack-result${activeClass}">${bit}</span>`
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
                showOverflowBit = true
            } else if (state.op === 'add' && state.currentCarry === 1 && state.animationStep >= state.bits - 1 &&
                       (state.animationPhase === 'carryOut' || state.animationPhase === 'pause')) {
                showOverflowBit = true
            } else if (state.op === 'sub' && state.animationStep >= 0) {
                showOverflowBit = true
            }
        }

        const isOverflowHighlighted = state.op === 'add' && isAnimating && state.animationStep === state.bits - 1 &&
                                      state.animationPhase === 'carryOut' && showOverflowBit
        const overflowActiveClass = isOverflowHighlighted ? ' calc-stack-active' : ''

        if (showOverflowBit) {
            html += `<span class="calc-stack-overflow-bit${overflowActiveClass}">${overflowBit}</span>`
        } else {
            html += '<span class="calc-stack-overflow-placeholder"></span>'
        }

        // Progressive revelation for add/sub/bitwise
        let partialResultBits = []
        if (state.op === 'add' || state.op === 'sub' || ['and', 'or', 'xor', 'not'].includes(state.op)) {
            for (let i = 0; i < state.bits; i++) {
                const bit = binaryResult[i]
                const bitPos = state.bits - 1 - i

                let isVisible = false
                if (state.animationHasRun) {
                    const isPastPosition = bitPos < animStep
                    let isCurrentAndShown = false

                    if (state.op === 'add') {
                        isCurrentAndShown = bitPos === animStep && (state.animationPhase === 'carryOut' || state.animationPhase === 'pause')
                    } else if (state.op === 'sub') {
                        isCurrentAndShown = bitPos === animStep && (state.animationPhase === 'result' || state.animationPhase === 'pause')
                    } else if (['and', 'or', 'xor', 'not'].includes(state.op)) {
                        isCurrentAndShown = bitPos === animStep && (state.animationPhase === 'result' || state.animationPhase === 'pause')
                    }

                    isVisible = state.animationStep < 0 || isPastPosition || isCurrentAndShown
                }

                let isActive = false
                if (isAnimating) {
                    if ((state.op === 'add' && bitPos === animStep && state.animationPhase === 'carryOut') ||
                        (state.op === 'sub' && bitPos === animStep && state.animationPhase === 'result') ||
                        (['and', 'or', 'xor', 'not'].includes(state.op) && bitPos === animStep && state.animationPhase === 'result')) {
                        isActive = true
                    }
                }

                const activeClass = isActive ? ' calc-stack-active' : ''
                const displayValue = isVisible ? bit : '?'
                const unknownClass = !isVisible ? ' calc-stack-unknown' : ''
                html += `<span class="calc-stack-digit calc-stack-result${activeClass}${unknownClass}">${displayValue}</span>`

                partialResultBits.push(isVisible ? bit : '0')
            }
        } else if (isShiftOp) {
            // Shift operations not animating
            if (!state.animationHasRun) {
                for (let i = 0; i < state.bits; i++) {
                    html += `<span class="calc-stack-digit calc-stack-result calc-stack-unknown">?</span>`
                }
            } else {
                html += renderBinaryDigits(binaryResult, 'result')
            }
        } else {
            html += renderBinaryDigits(binaryResult, 'result')
        }

        // Interpretations
        if (!state.animationHasRun) {
            html += `
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
        } else if (state.op === 'add' || state.op === 'sub' || ['and', 'or', 'xor', 'not'].includes(state.op)) {
            const partialValue = parseInt(partialResultBits.join(''), 2)
            html += renderInterpretations(partialValue, state)
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
        const isAnimating = (['add', 'sub', 'and', 'or', 'xor', 'not'].includes(state.op)) &&
                           state.animationStep >= 0 && state.animationStep < state.bits
        const animStep = state.animationStep
        const isShiftAnimating = (['<<', '>>', '>>>'].includes(state.op)) && state.shiftCurrentBits !== null
        const isShiftOp = ['<<', '>>', '>>>'].includes(state.op)

        // Build HTML
        let html = '<div class="calc-stack">'

        // Header
        html += '<div class="calc-stack-header">'
        html += '<span class="calc-stack-operator"></span>'
        html += '<span class="calc-stack-overflow-header"></span>'
        html += renderBitHeaders(state.bits)
        html += renderInterpretationHeaders()
        html += '</div>'

        // Rows
        html += renderBorrowRow(state, animStep, isAnimating)
        html += renderValue1Row(state, binary1, animStep, isAnimating, isShiftAnimating, opInfo, isBinaryOp, isShiftOp)

        if (isBinaryOp && !isShiftOp) {
            html += renderValue2Row(state, binary2, animStep, isAnimating, opInfo)
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
            <span class="calc-stack-interp-item calc-stack-bit-header">U</span>
            <span class="calc-stack-interp-item calc-stack-bit-header">S</span>
            <span class="calc-stack-interp-item calc-stack-bit-header">H</span>
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

        return steps.map(step => {
            if (step.startsWith('>>>')) {
                return `<ul class="calc-nested-steps"><li>${step.substring(3).trim()}</li></ul>`
            } else {
                return `<p>${step}</p>`
            }
        }).join('')
    }

    function getOperationInfo(op) {
        const operations = {
            'add': { symbol: '+', name: 'Addition' },
            'sub': { symbol: '−', name: 'Subtraction' },
            'and': { symbol: '∧', name: 'Bitwise AND' },
            'or': { symbol: '∨', name: 'Bitwise OR' },
            'xor': { symbol: '⊕', name: 'Bitwise XOR' },
            'not': { symbol: '¬', name: 'Bitwise NOT' },
            '<<': { symbol: '<<', name: 'Left Shift' },
            '>>': { symbol: '>>', name: 'Logical Right Shift' },
            '>>>': { symbol: '>>>', name: 'Arithmetic Right Shift' },
            'neg': { symbol: '−', name: 'Two\'s Complement' }
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
            state.borrowValues = new Array(state.bits).fill(null)
            state.value1Crossed = new Array(state.bits).fill(false)
        } else if (['<<', '>>', '>>>'].includes(state.op)) {
            state.shiftCurrentBits = null
            state.shiftOriginalBits = null
            state.shiftIteration = -1
            state.shiftPhase = null
        }
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
            'or': () => startBitwiseAnimation(wrapper, state),
            'xor': () => startBitwiseAnimation(wrapper, state),
            'not': () => startBitwiseAnimation(wrapper, state),
            '<<': () => startShiftAnimation(wrapper, state),
            '>>': () => startShiftAnimation(wrapper, state),
            '>>>': () => startShiftAnimation(wrapper, state)
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
            const decimalStr = inputValue.replace(/[^0-9]/g, '')
            return decimalStr ? Math.min(Math.max(parseInt(decimalStr, 10), 1), 7) : 1
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

                // Start animation after debounce delay
                startAnimation(wrapper, state)
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
    }

    function startAdditionAnimation(wrapper, state) {
        // Real-time addition animation with on-the-fly carry calculation
        // Start at position 0 (rightmost)
        state.animationStep = 0
        state.animationPhase = 'inputs'
        state.animationHasRun = true
        state.currentCarry = 0 // Start with no carry
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

    function startSubtractionAnimation(wrapper, state) {
        // Real-time subtraction animation with on-the-fly borrow calculation
        // Start at position 0 (rightmost)
        state.animationStep = 0
        state.animationPhase = 'inputs'
        state.animationHasRun = true
        state.borrowSearchPos = -1
        state.borrowSourcePos = -1
        state.borrowPropagatePos = -1
        updateCalcUI(wrapper, state)

        const runBitAnimation = () => {
            const bitPos = state.animationStep

            // Phase 1: Show inputs (highlight value2 and borrow/value1)
            state.animationPhase = 'inputs'
            state.borrowSearchPos = -1
            state.borrowSourcePos = -1
            state.borrowPropagatePos = -1
            updateCalcUI(wrapper, state)

            state.phaseTimer = setTimeout(() => {
                // Check if we need to borrow
                const borrowValue = state.borrowValues[bitPos]
                const v1Bit = (state.value1 >> bitPos) & 1
                const v2Bit = (state.value2 >> bitPos) & 1
                const effectiveV1 = borrowValue !== null ? borrowValue : v1Bit

                if (effectiveV1 < v2Bit) {
                    // Need to borrow - search left for a non-zero value
                    state.animationPhase = 'borrow'

                    // Search left starting from next position
                    let searchPos = bitPos + 1
                    let foundPos = -1

                    const animateSearch = () => {
                        if (searchPos >= state.bits) {
                            // Reached end without finding - shouldn't happen in valid subtraction
                            // Just proceed with result showing error
                            showResultAndContinue()
                            return
                        }

                        state.borrowSearchPos = searchPos
                        updateCalcUI(wrapper, state)

                        state.phaseTimer = setTimeout(() => {
                            // Check if this position has a non-zero value
                            const searchBorrowValue = state.borrowValues[searchPos]
                            const searchV1Bit = (state.value1 >> searchPos) & 1
                            const searchEffectiveValue = searchBorrowValue !== null ? searchBorrowValue : searchV1Bit

                            if (searchEffectiveValue > 0) {
                                // Found a value to borrow from!
                                foundPos = searchPos
                                state.borrowSourcePos = foundPos
                                state.borrowSearchPos = -1
                                updateCalcUI(wrapper, state)

                                // Now propagate the borrow back to the right (0.5s delay after finding)
                                state.phaseTimer = setTimeout(() => {
                                    animatePropagate(foundPos)
                                }, ANIMATION_SUB_BORROW_STEP_MS)
                            } else {
                                // Continue searching left
                                searchPos++
                                animateSearch()
                            }
                        }, ANIMATION_SUB_BORROW_STEP_MS)
                    }

                    const animatePropagate = (sourcePos) => {
                        // Start by reducing the source value by 1
                        const sourceBorrowValue = state.borrowValues[sourcePos]
                        const sourceV1Bit = (state.value1 >> sourcePos) & 1

                        if (sourceBorrowValue !== null) {
                            // Reduce borrow value
                            state.borrowValues[sourcePos] = sourceBorrowValue - 1
                        } else {
                            // Cross out value1 bit and set borrow to bit value - 1
                            state.value1Crossed[sourcePos] = true
                            state.borrowValues[sourcePos] = sourceV1Bit - 1
                        }

                        // Now propagate right, adding 2 (binary 10) to each position until we reach target
                        let currentPos = sourcePos - 1

                        const propagateStep = () => {
                            if (currentPos < bitPos) {
                                // Done propagating - reached target
                                showResultAndContinue()
                                return
                            }

                            // Step 1: Add 2 to current position (becomes "10" in binary) and cross out value1 immediately
                            const currentBorrowValue = state.borrowValues[currentPos]
                            const currentV1Bit = (state.value1 >> currentPos) & 1

                            // Only add +2 if not already added by previous iteration
                            const alreadyAdded = currentBorrowValue !== null && currentBorrowValue >= 2

                            if (!alreadyAdded) {
                                if (currentBorrowValue !== null) {
                                    state.borrowValues[currentPos] = currentBorrowValue + 2
                                } else {
                                    state.borrowValues[currentPos] = currentV1Bit + 2
                                }

                                // Cross out value1 bit immediately when borrow value becomes 2
                                if (!state.value1Crossed[currentPos]) {
                                    state.value1Crossed[currentPos] = true
                                }

                                // Show the position with +2 value and crossed out value1
                                state.borrowPropagatePos = currentPos
                                updateCalcUI(wrapper, state)

                                // Wait 500ms to show the "2" before processing it
                                state.phaseTimer = setTimeout(() => {
                                    processBorrowPosition()
                                }, ANIMATION_SUB_BORROW_STEP_MS)
                            } else {
                                // Already added, just process it
                                processBorrowPosition()
                            }
                        }

                        const processBorrowPosition = () => {
                            if (currentPos === bitPos) {
                                // Target position - hold for 1s with both borrow value and value2 highlighted before showing result
                                state.phaseTimer = setTimeout(() => {
                                    currentPos--
                                    propagateStep()
                                }, ANIMATION_SUB_INPUT_PHASE_MS)
                            } else {
                                // Intermediate position - borrow from it (reduce by 1) and simultaneously prepare next position
                                // Step 2: Borrow from this position (2 becomes 1)
                                state.borrowValues[currentPos] = state.borrowValues[currentPos] - 1

                                // Move to next position
                                currentPos--

                                // Immediately add 2 to next position and cross out its value1 (so both appear together)
                                const nextBorrowValue = state.borrowValues[currentPos]
                                const nextV1Bit = (state.value1 >> currentPos) & 1

                                if (nextBorrowValue !== null) {
                                    state.borrowValues[currentPos] = nextBorrowValue + 2
                                } else {
                                    state.borrowValues[currentPos] = nextV1Bit + 2
                                }

                                if (!state.value1Crossed[currentPos]) {
                                    state.value1Crossed[currentPos] = true
                                }

                                // Update propagate position to highlight next position
                                state.borrowPropagatePos = currentPos

                                // Update display to show both: previous position with 1, current position with 2
                                updateCalcUI(wrapper, state)

                                state.phaseTimer = setTimeout(() => {
                                    // Continue processing the next position (reduce it from 2 to 1, and add to the one after)
                                    propagateStep()
                                }, ANIMATION_SUB_BORROW_STEP_MS)
                            }
                        }

                        // Start propagation immediately (delay already happened after finding source)
                        state.borrowSourcePos = -1
                        propagateStep()
                    }

                    animateSearch()
                } else {
                    // No borrow needed - go straight to result
                    showResultAndContinue()
                }
            }, ANIMATION_SUB_INPUT_PHASE_MS)
        }

        const showResultAndContinue = () => {
            // Phase: Show result
            state.animationPhase = 'result'
            state.borrowSearchPos = -1
            state.borrowSourcePos = -1
            state.borrowPropagatePos = -1
            updateCalcUI(wrapper, state)

            state.phaseTimer = setTimeout(() => {
                // Phase: Pause
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
                }, ANIMATION_SUB_PAUSE_PHASE_MS)
            }, ANIMATION_SUB_RESULT_PHASE_MS)
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

    function startShiftAnimation(wrapper, state) {
        const shiftAmount = state.value2 || 1

        state.animationHasRun = true

        const binary1 = state.value1.toString(2).padStart(state.bits, '0')
        state.shiftIteration = 0

        // Initialize bits at the start (needed for isShiftAnimating check)
        state.shiftCurrentBits = binary1.split('')
        state.shiftOriginalBits = new Array(state.bits).fill(true)

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

            // Perform the shift
            if (state.op === '<<') {
                // Left shift: move bits left, add 0 on right
                state.shiftCurrentBits.push(paddingBit)
                state.shiftCurrentBits.shift()

                state.shiftOriginalBits.push(false) // Padding bit is not original
                state.shiftOriginalBits.shift()
            } else {
                // Right shift: move bits right, add padding on left
                state.shiftCurrentBits.unshift(paddingBit)
                state.shiftCurrentBits.pop()

                state.shiftOriginalBits.unshift(false) // Padding bit is not original
                state.shiftOriginalBits.pop()
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
    // Main Plugin Function
    // -------------------------------------------------------------------------

    function processCalculators() {
        const calcElements = document.querySelectorAll('.markdown-section calc')

        calcElements.forEach(element => {
            // Skip if already processed
            if (element.querySelector('.calc-wrapper')) return

            const value1 = element.getAttribute('value1') || '0'
            const value2 = element.getAttribute('value2')
            const op = element.getAttribute('op') || 'add'
            const bits = element.getAttribute('bits') || '8'

            const state = new CalcState(value1, value2, op, bits)
            const calcResult = state.calculate()
            state.result = calcResult.result
            state.steps = calcResult.steps
            state.resultBeforeMask = calcResult.resultBeforeMask

            // Initialize arrays for real-time animation
            if (state.op === 'add') {
                state.carryValues = new Array(state.bits).fill(null)
                state.currentCarry = 0
            } else if (state.op === 'sub') {
                state.borrowValues = new Array(state.bits).fill(null)
                state.value1Crossed = new Array(state.bits).fill(false)
            } else if (['<<', '>>', '>>>'].includes(state.op)) {
                state.shiftResultBits = null
                state.shiftSourcePos = -1
                state.shiftDestPos = -1
                state.shiftPaddingPhase = false
            }

            const ui = createCalcUI(state)
            element.appendChild(ui)

            setupCalcInteractivity(ui, state)

            // Start animation on initial load after debounce delay
            if (state.op === 'add') {
                state.debounceTimer = setTimeout(() => {
                    startAdditionAnimation(ui, state)
                }, ANIMATION_DEBOUNCE_MS)
            } else if (state.op === 'sub') {
                state.debounceTimer = setTimeout(() => {
                    startSubtractionAnimation(ui, state)
                }, ANIMATION_DEBOUNCE_MS)
            } else if (['and', 'or', 'xor', 'not'].includes(state.op)) {
                state.debounceTimer = setTimeout(() => {
                    startBitwiseAnimation(ui, state)
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
