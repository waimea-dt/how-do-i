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
            this.carry = false
            this.overflow = false
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

            // Check overflow for signed arithmetic (two's complement)
            const signBit = 1 << (this.bits - 1)
            const v1Signed = (v1 & signBit) !== 0
            const v2Signed = (v2 & signBit) !== 0
            const resultSigned = (result & signBit) !== 0
            const overflow = (v1Signed === v2Signed) && (v1Signed !== resultSigned)

            const steps = this.generateAddSteps(v1, v2, result, carry)

            return { result, carry, overflow, steps, resultBeforeMask: sum }
        }

        performSub(v1, v2) {
            // Subtraction via two's complement: A - B = A + (-B)
            const negV2 = ((~v2) + 1) & this.maxValue
            const sum = v1 + negV2
            const result = sum & this.maxValue
            const borrow = sum <= this.maxValue

            // Check overflow
            const signBit = 1 << (this.bits - 1)
            const v1Signed = (v1 & signBit) !== 0
            const v2Signed = (v2 & signBit) !== 0
            const resultSigned = (result & signBit) !== 0
            const overflow = (v1Signed !== v2Signed) && (v1Signed !== resultSigned)

            const steps = this.generateSubSteps(v1, v2, negV2, result, borrow)

            return { result, carry: !borrow, overflow, steps, resultBeforeMask: sum }
        }

        performAnd(v1, v2) {
            const result = (v1 & v2) & this.maxValue
            const steps = this.generateBitwiseSteps('AND', v1, v2, result)
            return { result, carry: false, overflow: false, steps }
        }

        performOr(v1, v2) {
            const result = (v1 | v2) & this.maxValue
            const steps = this.generateBitwiseSteps('OR', v1, v2, result)
            return { result, carry: false, overflow: false, steps }
        }

        performXor(v1, v2) {
            const result = (v1 ^ v2) & this.maxValue
            const steps = this.generateBitwiseSteps('XOR', v1, v2, result)
            return { result, carry: false, overflow: false, steps }
        }

        performNot(v1) {
            const result = (~v1) & this.maxValue
            const steps = this.generateNotSteps(v1, result)
            return { result, carry: false, overflow: false, steps }
        }

        performLeftShift(v1, amount) {
            amount = amount || 0
            const result = (v1 << amount) & this.maxValue
            const steps = this.generateShiftSteps('left', v1, amount, result)
            return { result, carry: false, overflow: false, steps }
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
            return { result, carry: false, overflow: false, steps }
        }

        performNegate(v1) {
            const result = ((~v1) + 1) & this.maxValue
            const steps = this.generateNegateSteps(v1, result)
            return { result, carry: false, overflow: false, steps }
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
                        <label class="calc-input-label">Value 2 (Binary)</label>
                        <input type="text" class="calc-input" data-operand="2" value="${state.value2.toString(2).padStart(state.bits, '0')}" maxlength="${state.bits}" pattern="[01]*">
                    </div>
                    ` : ''}
                </div>

                <div class="calc-binary-stack">
                    ${renderBinaryStack(state, opInfo, isBinaryOp)}
                </div>

                <div class="calc-flags">
                    ${state.carry ? '<span class="calc-flag calc-flag-active">Carry</span>' : '<span class="calc-flag">Carry</span>'}
                    ${state.overflow ? '<span class="calc-flag calc-flag-active">Overflow</span>' : '<span class="calc-flag">Overflow</span>'}
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

    function renderBinaryStack(state, opInfo, isBinaryOp) {
        const binary1 = state.value1.toString(2).padStart(state.bits, '0')
        const binary2 = isBinaryOp ? state.value2.toString(2).padStart(state.bits, '0') : null
        const binaryResult = state.result.toString(2).padStart(state.bits, '0')

        // Check if result overflows (has extra bit)
        const fullResult = state.resultBeforeMask !== undefined ? state.resultBeforeMask : state.result
        const fullBinaryResult = fullResult.toString(2)
        const hasOverflowBit = fullBinaryResult.length > state.bits
        const overflowBit = hasOverflowBit ? fullBinaryResult[0] : null

        // Animation state for addition and subtraction
        const isAnimating = (state.op === 'add' || state.op === 'sub') && state.animationStep >= 0 && state.animationStep < state.bits
        const animStep = state.animationStep

        let html = '<div class="calc-stack">'

        // Header row with bit place values and interpretation labels
        html += '<div class="calc-stack-header">'
        html += '<span class="calc-stack-operator"></span>'
        html += '<span class="calc-stack-overflow-header"></span>' // Empty overflow column header
        html += renderBitHeaders(state.bits)
        html += renderInterpretationHeaders()
        html += '</div>'

        // Borrow row (for subtraction only) - appears above value1
        if (state.op === 'sub' && state.borrowValues) {
            html += `<div class="calc-stack-row calc-stack-borrow">`
            html += '<span class="calc-stack-operator"></span>'
            html += '<span class="calc-stack-overflow-placeholder"></span>'
            // Show borrow values (null = dot, number = value)
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
                    // Check if borrow value is less than value2 bit (error state)
                    const v2Bit = (state.value2 >> bitPos) & 1
                    if (borrowValue < v2Bit) {
                        isActive = 'error'
                    } else {
                        isActive = true
                    }
                }

                // Highlight during borrow propagate phase only (not search or source)
                if (isAnimating && state.animationPhase === 'borrow') {
                    if (bitPos === state.borrowPropagatePos) {
                        isActive = true
                    }
                }

                const activeClass = isActive === 'error' ? ' calc-stack-error' : (isActive ? ' calc-stack-active' : '')
                html += `<span class="calc-stack-borrow-bit${activeClass}">${displayValue}</span>`
            }
            html += '<span class="calc-stack-spacer"></span>'
            html += '<span class="calc-stack-interp-item"></span>'
            html += '<span class="calc-stack-interp-item"></span>'
            html += '<span class="calc-stack-interp-item"></span>'
            html += '</div>'
        }

        // Value 1 - no operator for binary ops, operator for unary ops
        html += `<div class="calc-stack-row calc-stack-value1">`
        if (isBinaryOp) {
            html += `<span class="calc-stack-operator"></span>`
        } else {
            html += `<span class="calc-stack-operator">${opInfo.symbol}</span>`
        }
        html += '<span class="calc-stack-overflow-placeholder"></span>' // Empty overflow column

        // For subtraction, show original digits (grey where crossed out)
        if (state.op === 'sub' && state.value1Crossed) {
            for (let i = 0; i < state.bits; i++) {
                const bit = binary1[i]
                const bitPos = state.bits - 1 - i
                const isCrossed = state.value1Crossed[bitPos]

                let isActive = false

                // Highlight during inputs phase if this is the current position and no borrow value
                if (isAnimating && bitPos === animStep && state.animationPhase === 'inputs') {
                    const borrowValue = state.borrowValues[bitPos]
                    if (borrowValue === null) {
                        // Get the actual bit values to check if borrow needed
                        const v1Bit = (state.value1 >> bitPos) & 1
                        const v2Bit = (state.value2 >> bitPos) & 1
                        if (v1Bit < v2Bit) {
                            isActive = 'error' // Show error if borrow needed but not yet resolved
                        } else {
                            isActive = true // Normal highlight
                        }
                    }
                }

                // Highlight during borrow search/source phases only (not propagate - only borrow value highlights during propagate)
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
            // For addition animation, highlight current position during 'inputs' phase
            for (let i = 0; i < state.bits; i++) {
                const bit = binary1[i]
                const bitPos = state.bits - 1 - i
                const isActive = isAnimating && bitPos === animStep && state.animationPhase === 'inputs'
                const activeClass = isActive ? ' calc-stack-active' : ''
                html += `<span class="calc-stack-digit calc-stack-value1${activeClass}">${bit}</span>`
            }
        } else {
            html += renderBinaryDigits(binary1, 'value1')
        }

        html += renderInterpretations(state.value1, state)
        html += '</div>'

        // Value 2 (if binary operation) - shows the operator
        if (isBinaryOp) {
            html += `<div class="calc-stack-row calc-stack-value2">`
            html += `<span class="calc-stack-operator">${opInfo.symbol}</span>`
            html += '<span class="calc-stack-overflow-placeholder"></span>' // Empty overflow column

            // For addition and subtraction animation, highlight current position during 'inputs' phase
            if (state.op === 'add' || state.op === 'sub') {
                for (let i = 0; i < state.bits; i++) {
                    const bit = binary2[i]
                    const bitPos = state.bits - 1 - i
                    let isActive = false
                    if (isAnimating && bitPos === animStep && state.animationPhase === 'inputs') {
                        // Check if this position needs borrowing (for subtraction error highlighting)
                        if (state.op === 'sub') {
                            const borrowValue = state.borrowValues[bitPos]
                            const v1Bit = (state.value1 >> bitPos) & 1
                            const v2Bit = (state.value2 >> bitPos) & 1
                            // Show error if borrow value (or v1 if no borrow) is less than v2
                            const effectiveV1 = borrowValue !== null ? borrowValue : v1Bit
                            if (effectiveV1 < v2Bit) {
                                isActive = 'error' // Show error state if borrow needed but not yet resolved
                            } else {
                                isActive = true
                            }
                        } else {
                            isActive = true
                        }
                    }
                    // For subtraction: also highlight at target position during final delay before subtraction
                    if (state.op === 'sub' && isAnimating && state.animationPhase === 'borrow' && bitPos === animStep && bitPos === state.borrowPropagatePos) {
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
        }

        // Carry row (for addition only) - uses real-time calculated carries
        if (state.op === 'add' && state.carryValues) {
            html += `<div class="calc-stack-row calc-stack-carry">`
            html += '<span class="calc-stack-operator"></span>'
            html += '<span class="calc-stack-overflow-placeholder"></span>'
            // Render carry bits (real-time calculated)
            for (let i = 0; i < state.bits; i++) {
                const bitPos = state.bits - 1 - i
                const carryBit = state.carryValues[bitPos]

                // Highlight carry IN (being used at current position) during 'inputs' phase
                // The carry at position bitPos comes from position bitPos-1
                const isCarryIn = isAnimating && bitPos === animStep && carryBit === 1 && state.animationPhase === 'inputs'

                // Highlight carry OUT (just generated and placed to the left) during 'carryOut' phase
                // When processing position animStep, we generate carry at position animStep+1
                const isCarryOut = isAnimating && bitPos === animStep + 1 && carryBit === 1 && state.animationPhase === 'carryOut'

                const isActive = isCarryIn || isCarryOut
                const activeClass = isActive ? ' calc-stack-active' : ''

                // Show carry if it's been calculated (not null)
                const displayValue = carryBit !== null ? (carryBit === 1 ? '1' : '·') : '·'
                html += `<span class="calc-stack-carry-bit${activeClass}">${displayValue}</span>`
            }
            html += '<span class="calc-stack-spacer"></span>'
            html += '<span class="calc-stack-interp-item"></span>'
            html += '<span class="calc-stack-interp-item"></span>'
            html += '<span class="calc-stack-interp-item"></span>'
            html += '</div>'
        }

        // Divider line
        html += '<div class="calc-stack-divider"></div>'

        // Result
        html += `<div class="calc-stack-row calc-stack-result">`
        html += '<span class="calc-stack-operator"></span>'

        // Show overflow bit only after final carry is calculated
        let showOverflowBit = false
        if (hasOverflowBit && (state.op === 'add' || state.op === 'sub')) {
            if (state.animationStep < 0 && state.animationHasRun) {
                // Animation complete - show overflow bit
                showOverflowBit = true
            } else if (state.op === 'add' && state.currentCarry === 1 && state.animationStep >= state.bits - 1 && (state.animationPhase === 'carryOut' || state.animationPhase === 'pause')) {
                // Addition: show overflow bit during/after carryOut phase of final position (when result is shown)
                showOverflowBit = true
            } else if (state.op === 'sub' && state.animationStep >= 0) {
                // Subtraction during animation: always show if it exists (not animated)
                showOverflowBit = true
            }
        }

        // Highlight overflow bit when it first appears (during carryOut phase of final position)
        const isOverflowHighlighted = state.op === 'add' && isAnimating && state.animationStep === state.bits - 1 && state.animationPhase === 'carryOut' && showOverflowBit
        const overflowActiveClass = isOverflowHighlighted ? ' calc-stack-active' : ''

        if (showOverflowBit) {
            html += `<span class="calc-stack-overflow-bit${overflowActiveClass}">${overflowBit}</span>`
        } else {
            html += '<span class="calc-stack-overflow-placeholder"></span>' // Empty overflow column
        }

        // For addition and subtraction animation, reveal result bits progressively
        // Addition: Result appears during 'carryOut' phase (0.5s after inputs are highlighted)
        // Subtraction: Result appears during 'result' phase (after borrow animation if needed)
        if (state.op === 'add' || state.op === 'sub') {
            for (let i = 0; i < state.bits; i++) {
                const bit = binaryResult[i]
                const bitPos = state.bits - 1 - i

                // Result visible if: animation complete, position already processed, or current position shown
                const isPastPosition = bitPos < animStep
                let isCurrentAndShown = false
                if (state.op === 'add') {
                    isCurrentAndShown = bitPos === animStep && (state.animationPhase === 'carryOut' || state.animationPhase === 'pause')
                } else if (state.op === 'sub') {
                    isCurrentAndShown = bitPos === animStep && (state.animationPhase === 'result' || state.animationPhase === 'pause')
                }
                const isVisible = state.animationStep < 0 || isPastPosition || isCurrentAndShown

                // Highlight result when it first appears
                let isActive = false
                if (isAnimating) {
                    if (state.op === 'add' && bitPos === animStep && state.animationPhase === 'carryOut') {
                        isActive = true
                    } else if (state.op === 'sub' && bitPos === animStep && state.animationPhase === 'result') {
                        isActive = true
                    }
                }
                const activeClass = isActive ? ' calc-stack-active' : ''
                const displayValue = isVisible ? bit : '?'
                const unknownClass = !isVisible ? ' calc-stack-unknown' : ''
                html += `<span class="calc-stack-digit calc-stack-result${activeClass}${unknownClass}">${displayValue}</span>`
            }
        } else {
            html += renderBinaryDigits(binaryResult, 'result')
        }

        html += renderInterpretations(state.result, state)
        html += '</div>'

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
    // Event Handling
    // -------------------------------------------------------------------------

    function setupCalcInteractivity(wrapper, state) {
        const inputs = wrapper.querySelectorAll('.calc-input')

        inputs.forEach(input => {
            // Prevent typing non-binary characters
            input.addEventListener('keydown', (e) => {
                // Allow: backspace, delete, tab, escape, enter, arrows, home, end
                if ([8, 9, 13, 27, 37, 38, 39, 40, 46, 35, 36].includes(e.keyCode)) {
                    return
                }
                // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                if ((e.ctrlKey || e.metaKey) && [65, 67, 86, 88].includes(e.keyCode)) {
                    return
                }
                // Allow: 0 and 1
                if ((e.keyCode === 48 || e.keyCode === 96) || (e.keyCode === 49 || e.keyCode === 97)) {
                    return
                }
                // Prevent all other keys
                e.preventDefault()
            })

            const handleInput = () => {
                const operand = input.getAttribute('data-operand')
                let binaryStr = input.value.replace(/[^01]/g, '') // Remove non-binary characters (in case of paste)

                // Parse binary to decimal (allow empty string during typing)
                const newValue = binaryStr ? parseInt(binaryStr, 2) : 0

                if (operand === '1') {
                    state.value1 = Math.min(newValue, state.maxValue)
                } else if (operand === '2') {
                    state.value2 = Math.min(newValue, state.maxValue)
                }

                // Stop any ongoing animation
                if (state.phaseTimer) {
                    clearTimeout(state.phaseTimer)
                    state.phaseTimer = null
                }
                state.animationTimer = null

                // Clear existing debounce timer
                if (state.debounceTimer) {
                    clearTimeout(state.debounceTimer)
                    state.debounceTimer = null
                }

                // Recalculate and update UI
                const calcResult = state.calculate()
                state.result = calcResult.result
                state.carry = calcResult.carry
                state.overflow = calcResult.overflow
                state.steps = calcResult.steps
                state.resultBeforeMask = calcResult.resultBeforeMask

                // Initialize arrays for real-time animation
                if (state.op === 'add') {
                    state.carryValues = new Array(state.bits).fill(null)
                    state.currentCarry = 0
                } else if (state.op === 'sub') {
                    state.borrowValues = new Array(state.bits).fill(null)
                    state.value1Crossed = new Array(state.bits).fill(false)
                }

                // Reset animation state and show static result while waiting
                state.animationStep = -1
                state.animationHasRun = false // Reset flag when inputs change
                updateCalcUI(wrapper, state)

                // Start animation after debounce delay
                if (state.op === 'add') {
                    state.debounceTimer = setTimeout(() => {
                        startAdditionAnimation(wrapper, state)
                    }, ANIMATION_DEBOUNCE_MS)
                } else if (state.op === 'sub') {
                    state.debounceTimer = setTimeout(() => {
                        startSubtractionAnimation(wrapper, state)
                    }, ANIMATION_DEBOUNCE_MS)
                }
            }

            const handleBlur = () => {
                // Format with leading zeros when input loses focus
                const operand = input.getAttribute('data-operand')
                if (operand === '1') {
                    input.value = state.value1.toString(2).padStart(state.bits, '0')
                } else if (operand === '2') {
                    input.value = state.value2.toString(2).padStart(state.bits, '0')
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
                input2.value = state.value2.toString(2).padStart(state.bits, '0')
            }
        }

        // Update binary stack display
        const binaryStack = wrapper.querySelector('.calc-binary-stack')
        if (binaryStack) {
            binaryStack.innerHTML = renderBinaryStack(state, opInfo, isBinaryOp)
        }

        // Update flags
        const flagsContainer = wrapper.querySelector('.calc-flags')
        if (flagsContainer) {
            flagsContainer.innerHTML = `
                ${state.carry ? '<span class="calc-flag calc-flag-active">Carry</span>' : '<span class="calc-flag">Carry</span>'}
                ${state.overflow ? '<span class="calc-flag calc-flag-active">Overflow</span>' : '<span class="calc-flag">Overflow</span>'}
            `
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
            state.carry = calcResult.carry
            state.overflow = calcResult.overflow
            state.steps = calcResult.steps
            state.resultBeforeMask = calcResult.resultBeforeMask

            // Initialize arrays for real-time animation
            if (state.op === 'add') {
                state.carryValues = new Array(state.bits).fill(null)
                state.currentCarry = 0
            } else if (state.op === 'sub') {
                state.borrowValues = new Array(state.bits).fill(null)
                state.value1Crossed = new Array(state.bits).fill(false)
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
