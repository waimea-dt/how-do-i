/**
 * docsify-convertor.js — Interactive number base converter with educational visualization
 *
 * Helps students understand:
 *   - Binary, Decimal, and Hexadecimal number systems
 *   - Place value in different bases
 *   - Conversion algorithms between bases
 *   - Two's complement and signed numbers
 *   - Bit representation
 *
 * Usage in markdown:
 *   <convertor from="dec" to="bin" value="123" bits="8"></convertor>
 *   <convertor from="bin" to="hex" value="11010110" bits="8"></convertor>
 *   <convertor from="hex" to="dec" value="7F" bits="8"></convertor>
 *
 * Attributes:
 *   - from: Source base ("bin", "dec", "hex")
 *   - to: Target base ("bin", "dec", "hex")
 *   - value: Initial value in the source base
 *   - bits: Bit width (4, 8, 16, 32) - default 8
 *   - signed: Show signed interpretation (optional, default false)
 */

;(function () {

    // -------------------------------------------------------------------------
    // Converter State Model
    // -------------------------------------------------------------------------

    class ConverterState {
        constructor(from, to, value, bits, signed) {
            this.from = from.toLowerCase()
            this.to = to.toLowerCase()
            // Limit to 8 bits or less
            this.bits = Math.min(parseInt(bits) || 8, 8)
            this.signed = signed === 'true'
            this.maxValue = Math.pow(2, this.bits) - 1
            this.minValue = this.signed ? -Math.pow(2, this.bits - 1) : 0
            this.maxSigned = this.signed ? Math.pow(2, this.bits - 1) - 1 : this.maxValue

            this.setValue(value, this.from)
        }

        setValue(value, base) {
            // Parse value based on base
            let decimalValue = 0

            try {
                switch(base) {
                    case 'bin':
                        decimalValue = parseInt(value.replace(/\s/g, ''), 2)
                        break
                    case 'dec':
                        decimalValue = parseInt(value, 10)
                        break
                    case 'hex':
                        decimalValue = parseInt(value.replace(/0x/i, ''), 16)
                        break
                }

                // Validate range
                if (isNaN(decimalValue)) {
                    decimalValue = 0
                } else if (decimalValue < 0) {
                    decimalValue = 0
                } else if (decimalValue > this.maxValue) {
                    decimalValue = this.maxValue
                }

                this.decimalValue = decimalValue
            } catch (e) {
                this.decimalValue = 0
            }
        }

        getBinary() {
            return this.decimalValue.toString(2).padStart(this.bits, '0')
        }

        getDecimal() {
            return this.decimalValue
        }

        getHex() {
            return this.decimalValue.toString(16).toUpperCase().padStart(Math.ceil(this.bits / 4), '0')
        }

        getBinaryArray() {
            return this.getBinary().split('')
        }

        getPlaceValues(base) {
            const values = []

            switch(base) {
                case 'bin': {
                    const binary = this.getBinaryArray()
                    for (let i = 0; i < binary.length; i++) {
                        const bit = binary[i]
                        const position = binary.length - 1 - i
                        const placeValue = Math.pow(2, position)
                        values.push({
                            digit: bit,
                            position: position,
                            placeValue: placeValue,
                            contribution: parseInt(bit) * placeValue
                        })
                    }
                    break
                }
                case 'dec': {
                    const decimal = this.getDecimal().toString()
                    for (let i = 0; i < decimal.length; i++) {
                        const digit = decimal[i]
                        const position = decimal.length - 1 - i
                        const placeValue = Math.pow(10, position)
                        values.push({
                            digit: digit,
                            position: position,
                            placeValue: placeValue,
                            contribution: parseInt(digit) * placeValue
                        })
                    }
                    break
                }
                case 'hex': {
                    const hex = this.getHex()
                    for (let i = 0; i < hex.length; i++) {
                        const digit = hex[i]
                        const position = hex.length - 1 - i
                        const placeValue = Math.pow(16, position)
                        const digitValue = parseInt(digit, 16)
                        values.push({
                            digit: digit,
                            position: position,
                            placeValue: placeValue,
                            contribution: digitValue * placeValue,
                            digitValue: digitValue
                        })
                    }
                    break
                }
            }

            return values
        }

        getConversionSteps() {
            const steps = []

            // Different conversion paths
            if (this.from === 'dec' && this.to === 'bin') {
                steps.push(...this.decimalToBinarySteps())
            } else if (this.from === 'bin' && this.to === 'dec') {
                steps.push(...this.binaryToDecimalSteps())
            } else if (this.from === 'dec' && this.to === 'hex') {
                steps.push(...this.decimalToHexSteps())
            } else if (this.from === 'hex' && this.to === 'dec') {
                steps.push(...this.hexToDecimalSteps())
            } else if (this.from === 'bin' && this.to === 'hex') {
                steps.push(...this.binaryToHexSteps())
            } else if (this.from === 'hex' && this.to === 'bin') {
                steps.push(...this.hexToBinarySteps())
            }

            return steps
        }

        decimalToBinarySteps() {
            const steps = []
            let value = this.decimalValue

            steps.push(`Converting ${value}<sub>10</sub> to binary (${this.bits}-bit):`)

            if (value === 0) {
                steps.push('Value is 0, so binary is all zeros')
            } else {
                steps.push('Check each place value from left to right:')

                let remainder = value
                const bits = []

                // Check each bit position from highest to lowest
                for (let i = this.bits - 1; i >= 0; i--) {
                    const placeValue = Math.pow(2, i)

                    if (remainder >= placeValue) {
                        bits.push('1')
                        steps.push(`>>> ${remainder} ≥ ${placeValue} (2<sup>${i}</sup>): write <strong>1</strong>, subtract ${placeValue}, remainder = ${remainder - placeValue}`)
                        remainder -= placeValue
                    } else {
                        bits.push('0')
                        steps.push(`>>> ${remainder} < ${placeValue} (2<sup>${i}</sup>): write <strong>0</strong>`)
                    }
                }

                steps.push(`Result: <strong>${bits.join('')}</strong><sub>2</sub>`)
            }

            return steps
        }

        binaryToDecimalSteps() {
            const steps = []
            const placeValues = this.getPlaceValues('bin')

            steps.push(`Converting ${this.getBinary()}<sub>2</sub> to decimal:`)
            steps.push('Multiply each bit by its place value:')

            placeValues.forEach(({ digit, position, placeValue, contribution }) => {
                if (digit !== 0 && digit !== '0') {
                    steps.push(`>>> <strong>${digit}</strong> × ${placeValue} (2<sup>${position}</sup>) = <strong>${contribution}<strong>`)
                }
                else {
                    steps.push(`>>> ${digit} × ${placeValue} (2<sup>${position}</sup>) = ${contribution}`)
                }
            })

            const sum = placeValues.reduce((acc, val) => acc + val.contribution, 0)
            steps.push(`Sum the values: ${placeValues.map(v => v.contribution).join(' + ')}`)
            steps.push(`Result: <strong>${sum}</strong><sub>10</sub>`)

            return steps
        }

        decimalToHexSteps() {
            const steps = []
            let value = this.decimalValue

            const hexDigits = Math.ceil(this.bits / 4)
            steps.push(`Converting ${value}<sub>10</sub> to hexadecimal (${hexDigits} digits):`)

            if (value === 0) {
                steps.push('Value is 0, so hex is 00')
            } else {
                steps.push('Check each place value from left to right:')

                let remainder = value
                const digits = []

                // Check each hex digit position from highest to lowest
                for (let i = hexDigits - 1; i >= 0; i--) {
                    const placeValue = Math.pow(16, i)
                    const digitValue = Math.floor(remainder / placeValue)
                    const hexDigit = digitValue.toString(16).toUpperCase()

                    digits.push(hexDigit)

                    if (digitValue > 0) {
                        const subtractAmount = digitValue * placeValue
                        steps.push(`>>> ${remainder} ÷ ${placeValue} (16<sup>${i}</sup>) = ${digitValue} (${hexDigit}): write <strong>${hexDigit}</strong>, subtract ${subtractAmount} (${digitValue}×${placeValue}), remainder = ${remainder - subtractAmount}`)
                        remainder -= subtractAmount
                    } else {
                        steps.push(`>>> ${remainder} ÷ ${placeValue} (16<sup>${i}</sup>) = 0: write <strong>0</strong>`)
                    }
                }

                steps.push(`Result: <strong>${digits.join('')}</strong><sub>16</sub>`)
            }

            return steps
        }

        hexToDecimalSteps() {
            const steps = []
            const placeValues = this.getPlaceValues('hex')

            steps.push(`Converting ${this.getHex()}<sub>16</sub> to decimal:`)
            steps.push('Multiply each digit by its place value:')

            placeValues.forEach(({ digit, position, placeValue, contribution, digitValue }) => {
                if (digitValue == 0) {
                    steps.push(`>>> ${digit} (${digitValue}) × 16<sup>${position}</sup> = ${digitValue} × ${placeValue} = ${contribution}`)
                } else if (digitValue !== parseInt(digit)) {
                    steps.push(`>>> <strong>${digit}</strong> (${digitValue}) × 16<sup>${position}</sup> = ${digitValue} × ${placeValue} = <strong>${contribution}</strong>`)
                } else {
                    steps.push(`>>> <strong>${digit}</strong> × 16<sup>${position}</sup> = ${digit} × ${placeValue} = <strong>${contribution}</strong>`)
                }
            })

            const sum = placeValues.reduce((acc, val) => acc + val.contribution, 0)
            steps.push(`Sum the values: ${placeValues.map(v => v.contribution).join(' + ')}`)
            steps.push(`Result: <strong>${sum}</strong><sub>10</sub>`)

            return steps
        }

        binaryToHexSteps() {
            const steps = []
            const binary = this.getBinary()

            steps.push(`Converting ${binary}<sub>2</sub> to hexadecimal:`)
            steps.push('Group bits into sets of 4 (from right):')

            // Group into nibbles
            const nibbles = []
            for (let i = binary.length; i > 0; i -= 4) {
                const nibble = binary.substring(Math.max(0, i - 4), i)
                nibbles.unshift(nibble.padStart(4, '0'))
            }

            steps.push(`>>> <strong>${nibbles.join(' ')}</strong>`)
            steps.push('Convert each group to hex:')

            nibbles.forEach(nibble => {
                const decimal = parseInt(nibble, 2)
                const hex = decimal.toString(16).toUpperCase()
                steps.push(`>>> ${nibble}<sub>2</sub> = ${decimal}<sub>10</sub> = <strong>${hex}</strong><sub>16</sub>`)
            })

            steps.push(`Result: <strong>${this.getHex()}</strong><sub>16</sub>`)

            return steps
        }

        hexToBinarySteps() {
            const steps = []
            const hex = this.getHex()

            steps.push(`Converting ${hex}<sub>16</sub> to binary:`)
            steps.push('Convert each hex digit to 4-bit binary:')

            const nibbles = []
            for (let digit of hex) {
                const decimal = parseInt(digit, 16)
                const binary = decimal.toString(2).padStart(4, '0')
                nibbles.push(binary)
                steps.push(`>>> <strong>${digit}</strong><sub>16</sub> = ${decimal}<sub>10</sub> = <strong>${binary}</strong><sub>2</sub>`)
            }

            steps.push(`Concatenate: ${nibbles.join(' + ')}`)
            steps.push(`Result: <strong>${this.getBinary()}</strong><sub>2</sub>`)

            return steps
        }
    }

    // -------------------------------------------------------------------------
    // UI Rendering
    // -------------------------------------------------------------------------

    function createConverterUI(state, container) {
        const wrapper = document.createElement('div')
        wrapper.className = 'convertor-wrapper'

        // Add data attribute for conversion type to enable CSS styling
        if (state.from === 'bin') {
            wrapper.dataset.conversionType = 'binary-source'
        } else if (state.to === 'bin') {
            wrapper.dataset.conversionType = 'binary-target'
        } else if ((state.from === 'dec' && state.to === 'hex') || (state.from === 'hex' && state.to === 'dec')) {
            wrapper.dataset.conversionType = 'dec-hex'
        }

        // Source section
        const sourceSection = createValueSection(state, state.from, 'source')
        wrapper.appendChild(sourceSection)

        // Conversion steps
        const stepsSection = createStepsSection(state)
        wrapper.appendChild(stepsSection)

        // Target section
        const targetSection = createValueSection(state, state.to, 'target')
        wrapper.appendChild(targetSection)

        // Controls
        const controls = createControls(state, container)
        wrapper.appendChild(controls)

        return wrapper
    }

    function createValueSection(state, base, role) {
        const section = document.createElement('div')
        section.className = `convertor-section convertor-${role}`

        const title = document.createElement('h4')
        title.className = 'convertor-title'
        title.textContent = getBaseLabel(base)
        section.appendChild(title)

        // Value display/input
        const valueDisplay = document.createElement('div')
        valueDisplay.className = 'convertor-value'

        const input = document.createElement('input')
        input.type = 'text'
        input.className = 'convertor-input'
        input.dataset.base = base
        input.dataset.role = role

        switch(base) {
            case 'bin':
                input.value = state.getBinary()
                input.maxLength = state.bits
                input.pattern = '[01]*'
                break
            case 'dec':
                input.value = state.getDecimal()
                break
            case 'hex':
                input.value = state.getHex()
                break
        }

        valueDisplay.appendChild(input)
        section.appendChild(valueDisplay)

        // Place value breakdown
        const breakdown = createPlaceValueBreakdown(state, base)
        section.appendChild(breakdown)

        return section
    }

    function createPlaceValueBreakdown(state, base) {
        const breakdown = document.createElement('div')
        breakdown.className = 'convertor-breakdown'

        const placeValues = state.getPlaceValues(base)

        const grid = document.createElement('div')
        grid.className = 'convertor-place-values'

        placeValues.forEach(({ digit, position, placeValue, contribution }) => {
            const cell = document.createElement('div')
            cell.className = 'convertor-place-value'

            const digitEl = document.createElement('div')
            digitEl.className = 'place-digit'
            digitEl.textContent = digit

            const multEl = document.createElement('div')
            multEl.className = 'place-mult'
            multEl.textContent = '×'

            const expEl = document.createElement('div')
            expEl.className = 'place-exponent'
            const baseNum = base === 'bin' ? 2 : base === 'hex' ? 16 : 10
            expEl.innerHTML = `${baseNum}<sup>${position}</sup>`

            const valueEl = document.createElement('div')
            valueEl.className = 'place-value'
            valueEl.textContent = placeValue

            const equalEl = document.createElement('div')
            equalEl.className = 'place-equal'
            equalEl.textContent = '='

            const contribEl = document.createElement('div')
            contribEl.className = 'place-contribution'
            contribEl.textContent = `${contribution}`
            if (contribution > 0 || digit !== '0') {
                equalEl.classList.add('non-zero')
                contribEl.classList.add('non-zero')
            }
            cell.appendChild(digitEl)
            cell.appendChild(multEl)
            cell.appendChild(expEl)
            cell.appendChild(valueEl)
            cell.appendChild(equalEl)
            cell.appendChild(contribEl)

            grid.appendChild(cell)
        })

        breakdown.appendChild(grid)
        return breakdown
    }

    function createStepsSection(state) {
        const section = document.createElement('div')
        section.className = 'convertor-steps'

        const title = document.createElement('h4')
        title.className = 'convertor-title'
        title.textContent = 'Conversion Steps'
        section.appendChild(title)

        const steps = state.getConversionSteps()

        // First step is the conversion title
        if (steps.length > 0) {
            const conversionTitle = document.createElement('p')
            conversionTitle.className = 'convertor-conversion-title'
            conversionTitle.innerHTML = steps[0]
            section.appendChild(conversionTitle)
        }

        // Remaining steps are numbered
        if (steps.length > 1) {
            const stepsList = document.createElement('ol')
            stepsList.className = 'convertor-steps-list'

            renderStepsWithNesting(steps.slice(1), stepsList)

            section.appendChild(stepsList)
        }

        return section
    }

    function renderStepsWithNesting(steps, container) {
        let i = 0
        while (i < steps.length) {
            const step = steps[i]

            if (step.startsWith('>>> ')) {
                // Start a nested list
                const nestedUl = document.createElement('ul')
                nestedUl.className = 'convertor-nested-steps'

                // Add all consecutive >>> items
                while (i < steps.length && steps[i].startsWith('>>>')) {
                    const li = document.createElement('li')
                    li.innerHTML = steps[i].substring(3).trim() // Remove '>>>' prefix
                    nestedUl.appendChild(li)
                    i++
                }

                container.appendChild(nestedUl)
            } else {
                // Normal list item
                const li = document.createElement('li')
                li.innerHTML = step
                container.appendChild(li)
                i++
            }
        }
    }

    function createControls(state, container) {
        const controls = document.createElement('div')
        controls.className = 'convertor-controls'

        const info = document.createElement('div')
        info.className = 'convertor-info'
        info.textContent = `${state.bits}-bit • Range: ${state.minValue} to ${state.maxValue}`
        controls.appendChild(info)

        const swapBtn = document.createElement('button')
        swapBtn.className = 'convertor-btn'
        swapBtn.textContent = 'Swap Direction'
        swapBtn.onclick = () => swapDirection(state, container)
        controls.appendChild(swapBtn)

        return controls
    }

    function swapDirection(state, container) {
        // Swap from and to
        const newFrom = state.to
        const newTo = state.from
        const currentValue = state.decimalValue

        // Update container attributes
        container.setAttribute('from', newFrom)
        container.setAttribute('to', newTo)

        // Recreate state and UI
        const newState = new ConverterState(newFrom, newTo, currentValue.toString(), state.bits, state.signed)

        const wrapper = container.querySelector('.convertor-wrapper')
        if (wrapper) {
            wrapper.remove()
        }

        const newUI = createConverterUI(newState, container)
        container.appendChild(newUI)

        // Reattach input listeners
        attachInputListeners(newState, container)
    }

    function attachInputListeners(state, container) {
        const inputs = container.querySelectorAll('.convertor-input')

        inputs.forEach(input => {
            // For binary inputs, prevent typing non-binary characters
            if (input.dataset.base === 'bin') {
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
            }

            input.addEventListener('input', (e) => {
                const base = e.target.dataset.base
                let value = e.target.value

                // For binary inputs, filter out non-binary characters (in case of paste)
                if (base === 'bin') {
                    value = value.replace(/[^01]/g, '')
                    // Limit to bit width
                    if (value.length > state.bits) {
                        value = value.slice(-state.bits)
                    }
                    // Update input immediately with filtered value
                    e.target.value = value
                }

                // Update state
                state.setValue(value, base)

                // Refresh UI
                updateUI(state, container)
            })

            // For binary inputs, pad with zeros when focus is lost
            if (input.dataset.base === 'bin') {
                input.addEventListener('blur', () => {
                    input.value = state.getBinary()
                })
            }
        })
    }

    function updateUI(state, container) {
        // Update all inputs (only if not focused)
        const binInput = container.querySelector('.convertor-input[data-base="bin"]')
        const decInput = container.querySelector('.convertor-input[data-base="dec"]')
        const hexInput = container.querySelector('.convertor-input[data-base="hex"]')

        if (binInput && document.activeElement !== binInput) {
            binInput.value = state.getBinary()
        }
        if (decInput && document.activeElement !== decInput) {
            decInput.value = state.getDecimal()
        }
        if (hexInput && document.activeElement !== hexInput) {
            hexInput.value = state.getHex()
        }

        // Update place value breakdowns
        const sections = container.querySelectorAll('.convertor-section')
        sections.forEach(section => {
            const breakdown = section.querySelector('.convertor-breakdown')
            const input = section.querySelector('.convertor-input')
            if (breakdown && input) {
                const base = input.dataset.base
                const newBreakdown = createPlaceValueBreakdown(state, base)
                breakdown.replaceWith(newBreakdown)
            }
        })

        // Update conversion steps
        const stepsSection = container.querySelector('.convertor-steps')
        if (stepsSection) {
            const steps = state.getConversionSteps()

            // Update conversion title
            const conversionTitle = stepsSection.querySelector('.convertor-conversion-title')
            if (conversionTitle && steps.length > 0) {
                conversionTitle.innerHTML = steps[0]
            }

            // Update numbered steps
            const stepsList = stepsSection.querySelector('.convertor-steps-list')
            if (stepsList && steps.length > 1) {
                stepsList.innerHTML = ''
                renderStepsWithNesting(steps.slice(1), stepsList)
            }
        }
    }

    // -------------------------------------------------------------------------
    // Utilities
    // -------------------------------------------------------------------------

    function getBaseLabel(base) {
        switch(base) {
            case 'bin': return 'Binary'
            case 'dec': return 'Decimal'
            case 'hex': return 'Hexadecimal'
            default: return base
        }
    }

    // -------------------------------------------------------------------------
    // Main Processing Function
    // -------------------------------------------------------------------------

    function processConvertors() {
        const convertors = document.querySelectorAll('.markdown-section convertor')

        convertors.forEach(container => {
            // Skip if already processed
            if (container.querySelector('.convertor-wrapper')) return

            // Read attributes
            const from = container.getAttribute('from') || 'dec'
            const to = container.getAttribute('to') || 'bin'
            const value = container.getAttribute('value') || '0'
            const bits = container.getAttribute('bits') || '8'
            const signed = container.getAttribute('signed') || 'false'

            // Create state
            const state = new ConverterState(from, to, value, bits, signed)

            // Create UI
            const ui = createConverterUI(state, container)
            container.appendChild(ui)

            // Attach event listeners
            attachInputListeners(state, container)
        })
    }

    // -------------------------------------------------------------------------
    // Plugin Registration
    // -------------------------------------------------------------------------

    const docsifyConvertor = function (hook) {
        hook.doneEach(function () {
            processConvertors()
        })
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyConvertor, window.$docsify.plugins || [])

})()
