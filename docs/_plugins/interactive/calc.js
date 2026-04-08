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
    const ANIMATION_SUB_RESULT_PHASE_MS = 500  // Duration to highlight result
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
            this.borrowAnimationStep = -1 // For subtraction: which borrow propagation step we're on
            this.borrowAnimationPhase = null // For subtraction: 'search', 'found', 'propagate'
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

            // Calculate carry bits for each position
            const carryBits = this.calculateCarryBits(v1, v2)

            const steps = this.generateAddSteps(v1, v2, result, carry)

            return { result, carry, overflow, steps, resultBeforeMask: sum, carryBits }
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

            // Calculate borrow bits for each position
            const borrowBits = this.calculateBorrowBits(v1, v2)
            const adjustedV1Digits = this.calculateAdjustedValue1(v1, v2, borrowBits)
            const borrowPropagation = this.calculateBorrowPropagation(v1, v2)

            const steps = this.generateSubSteps(v1, v2, negV2, result, borrow)

            return { result, carry: !borrow, overflow, steps, resultBeforeMask: sum, borrowBits, adjustedV1Digits, borrowPropagation }
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

        calculateBorrowBits(v1, v2) {
            const borrowBits = []
            let currentBorrow = 0

            for (let i = 0; i < this.bits; i++) {
                const bit1 = (v1 >> i) & 1
                const bit2 = (v2 >> i) & 1

                // Need to borrow if (bit1 - currentBorrow) < bit2
                const effectiveBit1 = bit1 - currentBorrow
                if (effectiveBit1 < bit2) {
                    borrowBits.unshift(1)
                    currentBorrow = 1
                } else {
                    borrowBits.unshift(0)
                    currentBorrow = 0
                }
            }
            borrowBits.unshift(0) // No borrow into leftmost position

            return borrowBits
        }

        calculateAdjustedValue1(v1, v2, borrowBits) {
            // Calculate what each digit of v1 effectively becomes after borrowing
            const adjustedDigits = []
            let currentBorrow = 0

            for (let i = 0; i < this.bits; i++) {
                const bit1 = (v1 >> i) & 1
                const bit2 = (v2 >> i) & 1

                // This position's value after accounting for previous borrow
                let adjustedBit = bit1 - currentBorrow

                // Need to borrow if adjusted value is less than bit2
                if (adjustedBit < bit2) {
                    adjustedBit += 2 // Add 10 in binary (borrow from next position)
                    currentBorrow = 1
                } else {
                    currentBorrow = 0
                }

                adjustedDigits.unshift(adjustedBit)
            }

            return adjustedDigits
        }

        calculateBorrowPropagation(v1, v2) {
            // Calculate detailed borrow propagation for animation
            // Returns array of objects: { needsBorrow, sourcePos, propagationPath }
            const propagationInfo = []

            for (let i = 0; i < this.bits; i++) {
                const bitPos = i // Position 0 is rightmost, position (bits-1) is leftmost
                const bit1 = (v1 >> i) & 1
                const bit2 = (v2 >> i) & 1

                // Check if we need to borrow (considering already borrowed from previous)
                let effectiveBit1 = bit1
                // Check if this position was borrowed from by the position to the right
                if (i > 0) {
                    const rightBit1 = (v1 >> (i - 1)) & 1
                    const rightBit2 = (v2 >> (i - 1)) & 1
                    // Simplified: if right position can't subtract, it borrows from us

                if (rightBit1 < rightBit2) {
                        effectiveBit1 = bit1 - 1
                    }
                }

                if (effectiveBit1 < bit2) {
                    // Need to borrow - find source
                    const path = [bitPos]
                    let sourcePos = bitPos

                    // Search left (higher positions) for a 1 to borrow from
                    for (let j = i + 1; j < this.bits; j++) {
                        const sourceBit = (v1 >> j) & 1
                        sourcePos = j
                        path.push(sourcePos)

                        if (sourceBit === 1) {
                            break
                        }
                    }

                    propagationInfo.push({
                        position: bitPos,
                        needsBorrow: true,
                        sourcePos: sourcePos,
                        propagationPath: path
                    })
                } else {
                    propagationInfo.push({
                        position: bitPos,
                        needsBorrow: false,
                        sourcePos: null,
                        propagationPath: []
                    })
                }
            }

            return propagationInfo
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
        if (state.op === 'sub' && state.adjustedV1Digits) {
            html += `<div class="calc-stack-row calc-stack-borrow">`
            html += '<span class="calc-stack-operator"></span>'
            html += '<span class="calc-stack-overflow-placeholder"></span>'
            // Show adjusted values in borrow row (only where borrowing occurred)
            for (let i = 0; i < state.bits; i++) {
                const originalBit = (state.value1 >> (state.bits - 1 - i)) & 1
                const adjustedValue = state.adjustedV1Digits[i]
                const bitPos = state.bits - 1 - i
                const borrowInfo = state.borrowPropagation ? state.borrowPropagation[animStep] : null

                // During animation, determine what to show based on borrow animation state
                let displayValue = '\u00b7'
                let isActive = false

                if (isAnimating && state.animationPhase === 'borrow' && borrowInfo && borrowInfo.propagationPath) {
                    const pathIndex = borrowInfo.propagationPath.indexOf(bitPos)

                    if (state.borrowAnimationPhase === 'found' && bitPos === borrowInfo.sourcePos) {
                        // Source position shows '0' after being found
                        displayValue = '0'
                        isActive = true
                    } else if (state.borrowAnimationPhase === 'propagate' && pathIndex >= 0 && pathIndex < borrowInfo.propagationPath.length - 1) {
                        // During propagate phase, show intermediate values
                        // borrowAnimationStep indicates how far we've propagated from source (0-indexed)
                        const sourceIndex = borrowInfo.propagationPath.length - 1
                        const stepsFromSource = sourceIndex - pathIndex
                        const propagateStep = state.borrowAnimationStep

                        if (stepsFromSource < propagateStep) {
                            // This position was already processed - show final '1' or final value
                            if (pathIndex === 0) {
                                // Original position that needed borrow - show final value
                                const adjBinary = adjustedValue > 1 ? adjustedValue.toString(2) : adjustedValue.toString()
                                displayValue = adjBinary
                            } else {
                                // Intermediate position - shows '1' after giving to next position
                                displayValue = '1'
                            }
                        } else if (stepsFromSource === propagateStep) {
                            // This position is currently being processed
                            if (pathIndex === 0) {
                                // Original position - receives final borrow value
                                const adjBinary = adjustedValue > 1 ? adjustedValue.toString(2) : adjustedValue.toString()
                                displayValue = adjBinary
                                isActive = true
                            } else {
                                // Intermediate position - show '10' which will reduce to '1'
                                displayValue = '10'
                                isActive = true
                            }
                        }
                    }
                } else if (bitPos === animStep && state.animationPhase === 'inputs' && adjustedValue !== originalBit && borrowInfo && borrowInfo.needsBorrow) {
                    // During inputs phase after borrow is resolved, highlight the borrow value
                    // But if we're still in the initial inputs phase (no borrow shown yet), don't show it
                    const animationComplete = state.animationHasRun && state.animationStep < 0
                    const positionComplete = state.animationStep >= 0 && bitPos < animStep
                    if (animationComplete || positionComplete) {
                        const adjustedBinary = adjustedValue > 1 ? adjustedValue.toString(2) : adjustedValue.toString()
                        displayValue = adjustedBinary
                        isActive = true
                    }
                } else if (adjustedValue !== originalBit) {
                    // Static display (after animation or for completed positions)
                    const animationComplete = state.animationHasRun && state.animationStep < 0
                    const positionComplete = state.animationStep >= 0 && bitPos < animStep
                    const currentPositionShown = bitPos === animStep && (state.animationPhase === 'result' || state.animationPhase === 'pause')

                    if (animationComplete || positionComplete || currentPositionShown) {
                        const adjustedBinary = adjustedValue > 1 ? adjustedValue.toString(2) : adjustedValue.toString()
                        displayValue = adjustedBinary
                    }
                }

                const activeClass = isActive ? ' calc-stack-active' : ''
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

        // For subtraction, show original digits (grey where borrowed AFTER animation reaches that point)
        if (state.op === 'sub' && state.adjustedV1Digits) {
            for (let i = 0; i < state.bits; i++) {
                const originalBit = (state.value1 >> (state.bits - 1 - i)) & 1
                const adjustedValue = state.adjustedV1Digits[i]
                const bitPos = state.bits - 1 - i
                const borrowInfo = state.borrowPropagation ? state.borrowPropagation[animStep] : null

                // Determine if this bit should be highlighted or greyed out
                let isActive = false
                let shouldBeGreyed = false

                if (isAnimating) {
                    if (bitPos === animStep && state.animationPhase === 'inputs') {
                        // During inputs, highlight value1 if no borrow, or show error if borrow needed
                        if (adjustedValue === originalBit) {
                            isActive = true
                        } else if (borrowInfo && borrowInfo.needsBorrow) {
                            // Show error state (will be styled red)
                            isActive = 'error'
                        }
                    } else if (state.animationPhase === 'borrow' && borrowInfo && borrowInfo.propagationPath) {
                        const pathIndex = borrowInfo.propagationPath.indexOf(bitPos)

                        if (state.borrowAnimationPhase === 'search' && pathIndex > 0 && pathIndex === state.borrowAnimationStep) {
                            // Highlight current position being searched
                            isActive = true
                        } else if (state.borrowAnimationPhase === 'found' && bitPos === borrowInfo.sourcePos) {
                            // Highlight and grey out the source position after it's found
                            shouldBeGreyed = true
                            isActive = true
                        } else if (state.borrowAnimationPhase === 'propagate' && pathIndex >= 0 && pathIndex < borrowInfo.propagationPath.length - 1) {
                            // Grey out positions as propagation reaches them
                            const sourceIndex = borrowInfo.propagationPath.length - 1
                            const stepsFromSource = sourceIndex - pathIndex
                            if (stepsFromSource <= state.borrowAnimationStep) {
                                shouldBeGreyed = true
                                if (stepsFromSource === state.borrowAnimationStep) isActive = true
                            }
                        }
                    }
                }

                // Also grey out if animation is complete or position already processed
                if (!shouldBeGreyed && adjustedValue !== originalBit) {
                    const animationComplete = state.animationHasRun && state.animationStep < 0
                    const positionComplete = state.animationStep >= 0 && bitPos < animStep
                    const currentPositionShown = bitPos === animStep && (state.animationPhase === 'result' || state.animationPhase === 'pause')
                    shouldBeGreyed = animationComplete || positionComplete || currentPositionShown
                }

                const activeClass = isActive === 'error' ? ' calc-stack-error' : (isActive ? ' calc-stack-active' : '')
                const greyedClass = shouldBeGreyed ? ' calc-stack-borrowed' : ''
                html += `<span class="calc-stack-digit calc-stack-value1${activeClass}${greyedClass}">${originalBit}</span>`
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
                            const borrowInfo = state.borrowPropagation ? state.borrowPropagation[animStep] : null
                            if (borrowInfo && borrowInfo.needsBorrow) {
                                isActive = 'error' // Show error state
                            } else {
                                isActive = true
                            }
                        } else {
                            isActive = true
                        }
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

        // Carry row (for addition only)
        // Animation sequence: Phase 1 (inputs) shows operands + carry in, Phase 2 (carryOut) shows result + carry out
        if (state.op === 'add' && state.carryBits) {
            html += `<div class="calc-stack-row calc-stack-carry">`
            html += '<span class="calc-stack-operator"></span>'
            html += '<span class="calc-stack-overflow-placeholder"></span>'
            // Render carry bits
            for (let i = 1; i < state.carryBits.length; i++) {
                const carryBit = state.carryBits[i]
                const bitPos = state.bits - i

                // Highlight carry IN (being used at current position) during 'inputs' phase
                const isCarryIn = isAnimating && bitPos === animStep && carryBit === 1 && state.animationPhase === 'inputs'

                // Highlight carry OUT (just generated at next position) during 'carryOut' phase
                const isCarryOut = isAnimating && bitPos === animStep + 1 && carryBit === 1 && state.animationPhase === 'carryOut'

                const isActive = isCarryIn || isCarryOut
                const activeClass = isActive ? ' calc-stack-active' : ''

                // Show carry if: animation has completed, OR currently being processed/generated during animation
                const shouldShowGenerated = (state.animationPhase === 'carryOut' || state.animationPhase === 'pause') && bitPos === animStep + 1
                const animationComplete = state.animationHasRun && state.animationStep < 0
                const positionProcessed = state.animationStep >= 0 && bitPos <= animStep
                const finalVisible = animationComplete || positionProcessed || shouldShowGenerated

                const displayValue = finalVisible ? (carryBit === 1 ? '1' : '·') : '·'
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
        if (hasOverflowBit && (state.op === 'add' || state.op === 'sub')) {
            html += `<span class="calc-stack-overflow-bit">${overflowBit}</span>`
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
                state.carryBits = calcResult.carryBits
                state.borrowBits = calcResult.borrowBits
                state.adjustedV1Digits = calcResult.adjustedV1Digits
                state.borrowPropagation = calcResult.borrowPropagation

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
        // Animation sequence for each bit position:
        // Phase 1 (ANIMATION_INPUT_PHASE_MS): 'inputs' - highlight operand bits and carry in
        // Phase 2 (ANIMATION_CARRYOUT_PHASE_MS): 'carryOut' - highlight result bit and carry out
        // Phase 3 (ANIMATION_PAUSE_PHASE_MS): 'pause' - no highlighting (clear all highlights)
        // Then advance to next position
        state.animationStep = 0
        state.animationPhase = 'inputs'
        state.animationHasRun = true // Mark that animation has started
        updateCalcUI(wrapper, state)

        const runBitAnimation = () => {
            // Phase 1: Show inputs (operands and carry in)
            state.animationPhase = 'inputs'
            updateCalcUI(wrapper, state)

            state.phaseTimer = setTimeout(() => {
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
                            state.animationStep = -1 // Show complete result
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
        // Animation sequence for each bit position in subtraction:
        // Phase 1 (ANIMATION_SUB_INPUT_PHASE_MS): 'inputs' - highlight digits to subtract
        // If borrow needed:
        //   Phase 2: 'borrow' - animate borrow propagation (multiple steps of ANIMATION_SUB_BORROW_STEP_MS each)
        // Phase 3 (ANIMATION_SUB_RESULT_PHASE_MS): 'result' - highlight result
        // Phase 4 (ANIMATION_SUB_PAUSE_PHASE_MS): 'pause' - no highlighting
        // Then advance to next position
        state.animationStep = 0
        state.animationPhase = 'inputs'
        state.animationHasRun = true
        state.borrowAnimationStep = -1
        state.borrowAnimationPhase = null
        updateCalcUI(wrapper, state)

        const runBitAnimation = () => {
            const bitPos = state.bits - 1 - state.animationStep
            const borrowInfo = state.borrowPropagation ? state.borrowPropagation[state.animationStep] : null

            // Phase 1: Show inputs (digits to subtract)
            state.animationPhase = 'inputs'
            state.borrowAnimationStep = -1
            state.borrowAnimationPhase = null
            updateCalcUI(wrapper, state)

            state.phaseTimer = setTimeout(() => {
                // Check if this position needs borrowing
                if (borrowInfo && borrowInfo.needsBorrow && borrowInfo.propagationPath && borrowInfo.propagationPath.length > 1) {
                    // Phase 2: Animate borrow propagation
                    state.animationPhase = 'borrow'

                    // Sub-phase 2a: Search left for a 1 to borrow
                    state.borrowAnimationPhase = 'search'
                    state.borrowAnimationStep = 1 // Start at position 1 in path (skip position 0 which is current)
                    updateCalcUI(wrapper, state)

                    const animateSearch = () => {
                        state.borrowAnimationStep++
                        updateCalcUI(wrapper, state)

                        if (state.borrowAnimationStep < borrowInfo.propagationPath.length - 1) {
                            // More positions to search
                            state.phaseTimer = setTimeout(animateSearch, ANIMATION_SUB_BORROW_STEP_MS)
                        } else {
                            // Found the source! Show it as 0
                            state.phaseTimer = setTimeout(() => {
                                state.borrowAnimationPhase = 'found'
                                updateCalcUI(wrapper, state)

                                // Sub-phase 2c: Propagate the borrow back to the right
                                state.phaseTimer = setTimeout(() => {
                                    state.borrowAnimationPhase = 'propagate'
                                    state.borrowAnimationStep = 0
                                    updateCalcUI(wrapper, state)

                                    const animatePropagate = () => {
                                        state.borrowAnimationStep++
                                        updateCalcUI(wrapper, state)

                                        const maxPropagateSteps = borrowInfo.propagationPath.length - 1
                                        if (state.borrowAnimationStep < maxPropagateSteps) {
                                            state.phaseTimer = setTimeout(animatePropagate, ANIMATION_SUB_BORROW_STEP_MS)
                                        } else {
                                            // Propagation complete, show result
                                            state.phaseTimer = setTimeout(() => {
                                                showResultAndContinue()
                                            }, ANIMATION_SUB_BORROW_STEP_MS)
                                        }
                                    }

                                    animatePropagate()
                                }, ANIMATION_SUB_BORROW_STEP_MS)
                            }, ANIMATION_SUB_BORROW_STEP_MS)
                        }
                    }

                    animateSearch()
                } else {
                    // No borrow needed, go straight to result
                    showResultAndContinue()
                }
            }, ANIMATION_SUB_INPUT_PHASE_MS)
        }

        const showResultAndContinue = () => {
            // Phase 3: Show result
            state.animationPhase = 'result'
            state.borrowAnimationStep = -1
            state.borrowAnimationPhase = null
            updateCalcUI(wrapper, state)

            state.phaseTimer = setTimeout(() => {
                // Phase 4: Pause
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
                        state.borrowAnimationStep = -1
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
            state.carryBits = calcResult.carryBits
            state.borrowBits = calcResult.borrowBits
            state.adjustedV1Digits = calcResult.adjustedV1Digits
            state.borrowPropagation = calcResult.borrowPropagation

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
