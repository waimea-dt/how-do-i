/**
 * docsify-logic.js — Renders interactive logic gates and truth tables from markdown code blocks.
 * 
 * Usage in markdown:
 *   ```logic
 *   gate 10 AND A B Out
 *   table 10 AND A B Out
 *   ```
 * 
 * Supported operations: AND, OR, NOT, XOR, NAND, NOR (plus 3-input variants AND3, OR3, XOR3)
 * Supported styles: 10, TF, ON, YN, HL, 5V, CROSS, TICK, DOT, RAW, NONE, HIDE
 */

;(function () {

    // -------------------------------------------------------------------------
    // Configuration
    // -------------------------------------------------------------------------

    const validFormats = ['GATE', 'TABLE']

    const logicOps = {
        NOP1: {
            name: null,
            inputs: 1,
            outputs: 0,
            logic: a => null,
        },
        NOP2: {
            name: null,
            inputs: 2,
            outputs: 0,
            logic: (a, b) => null,
        },
        NOP3: {
            name: null,
            inputs: 3,
            outputs: 0,
            logic: (a, b, c) => null,
        },
        NOT: {
            name: 'NOT',
            inputs: 1,
            outputs: 1,
            logic: a => !a,
        },
        AND: {
            name: 'AND',
            inputs: 2,
            outputs: 1,
            logic: (a, b) => a && b,
        },
        AND3: {
            name: 'AND',
            inputs: 3,
            outputs: 1,
            logic: (a, b, c) => a && b && c,
        },
        OR: {
            name: 'OR',
            inputs: 2,
            outputs: 1,
            logic: (a, b) => a || b,
        },
        OR3: {
            name: 'OR',
            inputs: 3,
            outputs: 1,
            logic: (a, b, c) => a || b || c,
        },
        XOR: {
            name: 'XOR',
            inputs: 2,
            outputs: 1,
            logic: (a, b) => a !== b,
        },
        XOR3: {
            name: 'XOR',
            inputs: 3,
            outputs: 1,
            logic: (a, b, c) => [a, b, c].filter(x => x).length === 1,
        },
        NAND: {
            name: 'NAND',
            inputs: 2,
            outputs: 1,
            logic: (a, b) => !(a && b),
        },
        NOR: {
            name: 'NOR',
            inputs: 2,
            outputs: 1,
            logic: (a, b) => !(a || b),
        },
    }

    const styles = {
        '10':   { false: 0,        true: 1      },
        'TF':   { false: 'False',  true: 'True' },
        'ON':   { false: 'Off',    true: 'On'   },
        'YN':   { false: 'No',     true: 'Yes'  },
        'HL':   { false: 'Low',    true: 'High' },
        '5V':   { false: '0V',     true: '+5V'  },
        'CROSS': { false: '&nbsp;', true: '✗'    },
        'TICK': { false: '&nbsp;', true: '✓'    },
        'DOT':  { false: '&nbsp;', true: '•'    },
        'RAW':  { false: null,     true: null   },
        'NONE': { false: null,     true: null   },
        'HIDE': { false: 'Off',    true: 'On'   },
    }

    // -------------------------------------------------------------------------
    // SVG Components
    // -------------------------------------------------------------------------

    const inputWire = `
        <svg width="60" height="12" viewBox="0 0 60 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 10 6 L 60 6" stroke="currentColor" stroke-width="4" />
            <circle r="5.1" cx="5" cy="6" fill="currentColor" />
        </svg>`

    const outputWire = `
        <svg width="60" height="12" viewBox="0 0 60 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 0 6 L 50 6" stroke="currentColor" stroke-width="4" />
            <circle r="5.1" cx="55" cy="6" fill="currentColor" />
        </svg>`

    const gateSVG = (gatePath) => `
        <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g>${gatePath}</g>
        </svg>`

    const negated = `<circle r="12" cx="146" cy="80" />`

    const gates = {
        AND:  gateSVG(`<path d="M 4 2  L 78 2  A 78 78 0 0 1 78 158  L 4 158 Z" />`),
        OR:   gateSVG(`<path d="M 2 2  L 40 3  A 148 128 0 0 1 158 80  A 148 128 0 0 1 40 157  L 2 158  A 208 208 0 0 0 2 2" />`),
        NOT:  gateSVG(`<path d="M 2 2  L 136 80  L 2 158  Z" />${negated}`),
        XOR:  gateSVG(`<path d="M 22 2  L 40 2  A 148 128 0 0 1 158 80  A 148 128 0 0 1 40 158  L 22 158  A 208 208 0 0 0 22 2" />
                       <path fill="none" d="M 2 158  A 208 208 0 0 0 2 2" />`),
        NAND: gateSVG(`<path d="M 2 2  L 58 2  A 78 78 0 0 1 58 158  L 2 158  Z" />${negated}`),
        NOR:  gateSVG(`<path d="M 2 2  L 18 2  A 148 128 0 0 1 138 80  A 148 128 0 0 1 18 158  L 2 158  A 208 208 0 0 0 2 2" />${negated}`),
    }

    // -------------------------------------------------------------------------
    // Utility Functions
    // -------------------------------------------------------------------------

    const stripQuotes = (str) => str.replace(/^["']|["']$/g, '')

    // -------------------------------------------------------------------------
    // Main Processing Functions
    // -------------------------------------------------------------------------

    function processLogic() {
        const logicBlocks = document.querySelectorAll('pre[data-lang="logic"]')

        logicBlocks.forEach(block => {
            // Skip if already processed
            if (block.classList.contains('logic-processed')) {
                return
            }

            const codeBlock = block.querySelector('code')
            if (!codeBlock) return

            const code = codeBlock.textContent
            if (!code) return

            const lines = code.trim().split('\n')
            let processedContent = ''

            lines.forEach(line => {
                if (line.trim() !== '') {
                    processedContent += parseLine(line) + '\n'
                }
            })

            const logicDiv = document.createElement('div')
            logicDiv.classList.add('display-logic')
            logicDiv.innerHTML = processedContent

            // Wrap the logic display in a scroll container
            const scrollWrapper = document.createElement('div')
            scrollWrapper.classList.add('logic-scroll')
            scrollWrapper.appendChild(logicDiv)

            // Replace the pre block with the wrapped logic display
            block.parentNode.replaceChild(scrollWrapper, block)

            // Prevent double-click selection
            logicDiv.addEventListener('mousedown', (e) => {
                if (e.detail > 1) e.preventDefault()
            }, false)
        })
    }

    function parseLine(line) {
        // Break up line by spaces (respecting quoted strings)
        const parts = line.trim().split(/\s+(?=(?:[^"']*["'][^"']*["'])*[^"']*$)/)

        // Get the format
        const format = parts.shift().toUpperCase()
        if (!validFormats.includes(format)) {
            return `${line} &lt;&lt;&lt; unknown format '${format}' <br>`
        }

        // Get the style
        const style = parts.shift().toUpperCase()
        if (!(style in styles)) {
            return `${line} &lt;&lt;&lt; unknown style '${style}' <br>`
        }

        // Get the operation
        const op = parts.shift().toUpperCase()
        if (!(op in logicOps)) {
            return `${line} &lt;&lt;&lt; unknown operation '${op}' <br>`
        }

        // Lookup required config
        const logicOp = logicOps[op]
        const opName = logicOp.name
        const numInputs = logicOp.inputs

        // Set defaults
        let in1 = 'A'
        let in2 = 'B'
        let in3 = 'C'
        let out = numInputs === 1 ?
            `<span class="logic-op">${opName}</span> A` :
            (numInputs === 2 ?
            `A <span class="logic-op">${opName}</span> B` :
            `A <span class="logic-op">${opName}</span> B <span class="logic-op">${opName}</span> C`)
        let in1Val = false
        let in2Val = false
        let in3Val = false

        // Process custom names if specified
        if (parts.length > 0) {
            // Check arg count
            if (parts.length !== numInputs + 1) {
                return `${line} &lt;&lt;&lt; Wrong arg count (should be ${numInputs + 1}) <br>`
            }

            // Get input and output labels
            in1 = stripQuotes(parts.shift())
            if (numInputs >= 2) in2 = stripQuotes(parts.shift())
            if (numInputs === 3) in3 = stripQuotes(parts.shift())
            out = stripQuotes(parts.shift())

            // Check for initial high values (marked with +)
            if (in1.slice(-1) === '+') {
                in1Val = true
                in1 = in1.slice(0, -1)
            }
            if (in2.slice(-1) === '+') {
                in2Val = true
                in2 = in2.slice(0, -1)
            }
            if (in3.slice(-1) === '+') {
                in3Val = true
                in3 = in3.slice(0, -1)
            }
        }

        // Generate output HTML
        let displayCode = ''

        switch (format) {
            case 'GATE':
                displayCode = createGate(op, in1, in1Val, in2, in2Val, in3, in3Val, out, style)
                break
            case 'TABLE':
                displayCode = createTable(op, in1, in2, in3, out, style)
                break
        }

        return displayCode
    }

    function createGate(op, in1, in1Val, in2, in2Val, in3, in3Val, out, style) {
        const logicOp = logicOps[op]
        const gateName = logicOp.name
        const numInputs = logicOp.inputs
        const numOutputs = logicOp.outputs

        if (numOutputs === 0) return ''

        const valuesCode = `
            <span class="value-on">${styles[style][true]}</span>
            <span class="value-off">${styles[style][false]}</span>`

        const inputCode = (num, label = '', val = false) => `
            <div class="gate-input input-${num}">
                <label>
                    ${label === '' ? '&nbsp;' : label}
                    <input
                        type="checkbox"
                        class="input-toggle toggle-${num}"
                        ${val ? 'checked' : ''}
                    >
                </label>` +
                (style === 'RAW' || style === 'NONE' ? '' : valuesCode) +
                `${inputWire}
            </div>`

        const outputCode = (label = '') => `
            <div class="gate-output">
                ${outputWire}` +
                (style === 'RAW' || style === 'NONE' ? '' : valuesCode) +
                (style === 'RAW' ? '' : `<label>${label}</label>`) +
            `</div>`

        // Build the gate HTML
        let code = `<div class="logic-gate gate-${gateName.toLowerCase()}">`

        if (numInputs >= 1) code += inputCode('one', in1, in1Val)
        if (numInputs >= 2) code += inputCode('two', in2, in2Val)
        if (numInputs === 3) code += inputCode('three', in3, in3Val)

        code += `
            <div class="gate-body">` +
                (style === 'HIDE' ? '' : `<label>${op}</label>`) +
                `${gates[gateName]}
            </div>`

        code += outputCode(out)
        code += `</div>`

        return code
    }

    function createTable(op, in1, in2, in3, out, style) {
        const logicOp = logicOps[op]
        const numInputs = logicOp.inputs
        const numOutputs = logicOp.outputs
        const logic = logicOp.logic

        let code = `
            <table class="logic-table">
                <thead>
                    <tr>
                        <th class="in">${in1}</th>`
        if (numInputs >= 2) code += `<th class="in">${in2}</th>`
        if (numInputs === 3) code += `<th class="in">${in3}</th>`
        if (numOutputs === 1) code += `<th class="out">${out}</th>`
        code += `
                    </tr>
                </thead>
                <tbody>`

        let result = null

        if (numInputs === 1) {
            [false, true].forEach((val) => {
                result = logic(val)
                code += `<tr>
                            <td class="in ${val}">${styles[style][val]}</td>`
                if (numOutputs === 1) {
                    code += `<td class="out ${result}">${styles[style][result]}</td>`
                }
                code += `</tr>`
            })
        }
        else if (numInputs === 2) {
            [false, true].forEach((val1) => {
                [false, true].forEach((val2) => {
                    result = logic(val1, val2)
                    code += `<tr>
                                <td class="in ${val1}">${styles[style][val1]}</td>
                                <td class="in ${val2}">${styles[style][val2]}</td>`
                    if (numOutputs === 1) {
                        code += `<td class="out ${result}">${styles[style][result]}</td>`
                    }
                    code += `</tr>`
                })
            })
        }
        else if (numInputs === 3) {
            [false, true].forEach((val1) => {
                [false, true].forEach((val2) => {
                    [false, true].forEach((val3) => {
                        result = logic(val1, val2, val3)
                        code += `<tr>
                                    <td class="in ${val1}">${styles[style][val1]}</td>
                                    <td class="in ${val2}">${styles[style][val2]}</td>
                                    <td class="in ${val3}">${styles[style][val3]}</td>`
                        if (numOutputs === 1) {
                            code += `<td class="out ${result}">${styles[style][result]}</td>`
                        }
                        code += `</tr>`
                    })
                })
            })
        }

        code += `</tbody>
            </table>`
        return code
    }

    // -------------------------------------------------------------------------
    // Plugin Registration
    // -------------------------------------------------------------------------

    const docsifyLogic = function (hook) {
        hook.doneEach(function () {
            processLogic()
        })
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyLogic, window.$docsify.plugins || [])

})()

