/**
 * docsify-data.js - Renders binary/hex/decimal/ascii/colour visualizations from markdown code blocks.
 *
 * Usage in markdown:
 *   ```data
 *   show dec 123
 *   show bin 01111011
 *   show hex 7a9c
 *   show dec 123 as bin-bytes
 *   show hex ff00aa as colour
 *   show dec 65 as ascii
 *   ```
 *
 * Supported commands: show, show-aligned, show-raw, show-raw-aligned
 * Supported types: bin, dec, hex
 * Supported conversions: bin, bin-bytes, dec, dec-val, hex, hex-bytes, colour, pixels, ascii, unicode
 */

;(function () {

    // -------------------------------------------------------------------------
    // Configuration
    // -------------------------------------------------------------------------

    const asciiDesc = {
        0:  'NULL',
        1:  'SOH',
        2:  'STX',
        3:  'ETX',
        4:  'EOT',
        5:  'ENQ',
        6:  'ACK',
        7:  'BEL',
        8:  'BS',
        9:  'HT',
        10: 'LF',
        11: 'VT',
        12: 'FF',
        13: 'CR',
        14: 'SO',
        15: 'SI',
        16: 'DLE',
        17: 'DC1',
        18: 'DC2',
        19: 'DC3',
        20: 'DC4',
        21: 'NAK',
        22: 'SYN',
        23: 'ETB',
        24: 'CAN',
        25: 'EM',
        26: 'SUB',
        27: 'ESC',
        28: 'FS',
        29: 'GS',
        30: 'RS',
        31: 'US',
        32: '(Space)',
        127: 'DEL',
    }

    const validOps = [
        'show',
        'show-aligned',
        'show-raw',
        'show-raw-aligned',
    ]

    const validSourceTypes = [
        'bin',
        'dec',
        'hex',
    ]

    const validActions = ['as']

    const targetTypeToBase = {
        'bin':        2,
        'bin-bytes':  2,
        'dec':        10,
        'dec-val':    10,
        'hex':        16,
        'hex-bytes':  16,
        'colour':     16,
        'pixels':     16,
        'ascii':      2,
        'unicode':    2,
    }

    const baseName = {
        2:  'Binary',
        10: 'Decimal',
        16: 'Hexadecimal',
    }

    // -------------------------------------------------------------------------
    // Utility Functions
    // -------------------------------------------------------------------------

    const padDigits = (digits, blockSize) => {
        return digits.padStart(blockSize * Math.ceil(digits.length / blockSize), '0')
    }

    // -------------------------------------------------------------------------
    // HTML Generation Functions
    // -------------------------------------------------------------------------

    const dataHeading = (base, baseName, info, raw = false) => {
        if (raw)
            return ''
        else
            return `
            <h4 class="number-info number-type-${base}">
                ${baseName} <span>(${info})</span>
            </h4>`
    }

    const headingsRow = (digits, base) => {
        let headingCode = `<thead><tr>`
        for (let i = digits.length - 1; i >= 0; i--) {
            headingCode += `<th>${Math.pow(base, i)}</th>`
        }
        headingCode += `</tr></thead>`
        return headingCode
    }

    const digitsRow = (digits, base, colsPerDigit = 1) => {
        let digitsCode = `<tr class="values-base-${base}">`

        // Display decimal int val as single 'digit'
        if (typeof(digits) === 'number') {
            digitsCode += `
            <td data-value="${digits}"
                colspan="${colsPerDigit}">
                ${digits}
            </td>`
        }
        else {
            // Assume we have padding
            let padding = true
            for (let i = 0; i < digits.length; i++) {
                const digit = digits[i]
                // It's padding if we've not hit a non-zero, and it's not the final value
                const padClass = (digit === '0' && padding && i !== digits.length-1) ? 'num-padding' : ''
                // Build the row
                digitsCode += `
                <td data-value="${digit}"
                    colspan="${colsPerDigit}"
                    class="${padClass}">
                    ${digit}
                </td>`
                // No more zeros?
                if (digit !== '0') padding = false
            }
        }

        digitsCode += `</tr>`
        return digitsCode
    }

    const numberInTable = (digits, base, aligned = '', raw = false) => {
        let tableCode = `<table class="number base-${base} ${aligned} ${raw ? 'raw' : ''}">`
        if (!raw) tableCode += headingsRow(digits, base)
        tableCode += `<tbody>`
        tableCode += digitsRow(digits, base)
        tableCode += `</tbody></table>`
        return tableCode
    }

    const colourInTable = (digits, aligned = '', raw = false) => {
        const red = parseInt(digits.slice(0,2), 16)
        const grn = parseInt(digits.slice(2,4), 16)
        const blu = parseInt(digits.slice(4,6), 16)

        let tableCode = `<table class="number colour ${aligned} ${raw ? 'raw' : ''}">`

        if (!raw) {
            tableCode += `
            <thead><tr>
                <th colspan="2" class="value-red">Red</th>
                <th colspan="2" class="value-green">Green</th>
                <th colspan="2" class="value-blue">Blue</th>
            </tr></thead>`

            tableCode += `<tbody>`
            tableCode += digitsRow(digits, 16)

            tableCode += `
            <tr class="values-base-10">
                <td colspan="2" class="value-red"   data-value="${red}">${red}</td>
                <td colspan="2" class="value-green" data-value="${grn}">${grn}</td>
                <td colspan="2" class="value-blue"  data-value="${blu}">${blu}</td>
            </tr>`

            tableCode += `
            <tr class="values-colour">
                <td colspan="2" style="background-color: rgb(${red},0,0);">&nbsp;</td>
                <td colspan="2" style="background-color: rgb(0,${grn},0);">&nbsp;</td>
                <td colspan="2" style="background-color: rgb(0,0,${blu});">&nbsp;</td>
            </tr>`
        }
        else {
            tableCode += `<tbody>`
        }

        tableCode += `
        <tr class="values-colour">
            <td colspan="6" style="background-color: rgb(${red},${grn},${blu});">&nbsp;</td>
        </tr>`

        tableCode += `</tbody></table>`
        return tableCode
    }

    const pixelsInTable = (digits, aligned = '', raw = false) => {
        const red = parseInt(digits.slice(0,2), 16)
        const grn = parseInt(digits.slice(2,4), 16)
        const blu = parseInt(digits.slice(4,6), 16)

        let tableCode = `<table class="number pixels ${aligned} ${raw ? 'raw' : ''}">`

        if (!raw) {
            tableCode += `
            <thead><tr>
                <th colspan="2" class="value-red">Red</th>
                <th colspan="2" class="value-green">Green</th>
                <th colspan="2" class="value-blue">Blue</th>
            </tr></thead>`

            tableCode += `<tbody>`
            tableCode += digitsRow(digits, 16)

            tableCode += `
            <tr class="values-base-10">
                <td colspan="2" class="value-red"   data-value="${red}">${red}</td>
                <td colspan="2" class="value-green" data-value="${grn}">${grn}</td>
                <td colspan="2" class="value-blue"  data-value="${blu}">${blu}</td>
            </tr>`

            tableCode += `
            <tr class="values-colour">
                <td colspan="2" style="background-color: rgb(${red},0,0);">&nbsp;</td>
                <td colspan="2" style="background-color: rgb(0,${grn},0);">&nbsp;</td>
                <td colspan="2" style="background-color: rgb(0,0,${blu});">&nbsp;</td>
            </tr>`
        }
        else {
            tableCode += `<tbody>`
        }

        const pixels = `
            <svg xmlns="http://www.w3.org/2000/svg"
                 viewBox="0 0 200 200"
                 width="200"
                 height="200"
                 fill="black"
            >
                <defs>
                    <pattern id="pixel-${digits}" x="1" y="2" width="14" height="14" patternUnits="userSpaceOnUse">
                        <rect fill="rgb(${red},0,0)" x="0" width="3" height="10" />
                        <rect fill="rgb(0,${grn},0)" x="4" width="3" height="10" />
                        <rect fill="rgb(0,0,${blu})" x="8" width="3" height="10" />
                    </pattern>
                </defs>
                <rect fill="black"       width="200" height="200" />
                <rect fill="url(#pixel-${digits})" width="200" height="200" />
            </svg>
        `

        tableCode += `
        <tr class="values-colour">
            <td colspan="6" style="background-color: rgb(${red},${grn},${blu});">&nbsp;</td>
        </tr>`

        tableCode += `
        <tr class="values-pixels">
            <td colspan="6" style="background-color: black;">
                ${pixels}
            </td>
        </tr>`

        tableCode += `</tbody></table>`
        return tableCode
    }

    const charInTable = (binDigits, aligned = '', raw = false) => {
        let tableCode = `<table class="number char ${aligned} ${raw ? 'raw' : ''}">`

        const ascii = binDigits.length === 8
        const decVal = parseInt(binDigits, 2)
        const hexDigits = padDigits(decVal.toString(16).toUpperCase(), 2)
        const colCount = ascii ? binDigits.length : hexDigits.length

        const printable = decVal > 32 && decVal !== 127
        const codeClass = printable ? '' : 'control-char'
        const char = printable ? String.fromCharCode(decVal) : asciiDesc[decVal]

        if (!raw) {
            if (ascii) {
                tableCode += headingsRow(binDigits, 2)
                tableCode += `<tbody>`
                tableCode += digitsRow(binDigits, 2)
                tableCode += digitsRow(hexDigits, 16, 4)
            }
            else {
                tableCode += headingsRow(hexDigits, 16)
                tableCode += `<tbody>`
                tableCode += digitsRow(hexDigits, 16, 1)
            }
            tableCode += digitsRow(decVal, 10, colCount)
        }
        else {
            tableCode += `<tbody>`
        }

        tableCode += `
        <tr class="values-char">
            <td colspan="${colCount}" class="${codeClass}">${char}</td>
        </tr>`
        tableCode += `</tbody></table>`
        return tableCode
    }

    // -------------------------------------------------------------------------
    // Line Parser
    // -------------------------------------------------------------------------

    const parseLine = (line) => {
        // Break up line by spaces
        let parts = line.split(/\s+/)

        // Arg num check
        if (parts.length !== 3 && parts.length !== 5)
            return `${line} &lt;&lt;&lt; Wrong arg count <br>`

        // Get first three command parts
        const op = parts.shift()
        const sourceType = parts.shift()
        const sourceNum = parts.shift()

        let targetType = sourceType
        let action = validActions[0]

        // More command parts left?
        if (parts.length > 0) {
            action = parts.shift()
            targetType = parts.shift()
        }

        // Validate the command
        if (!validOps.includes(op))
            return `${line} &lt;&lt;&lt; unknown command '${op}' <br>`
        if (!validSourceTypes.includes(sourceType))
            return `${line} &lt;&lt;&lt; unknown data type '${sourceType}' <br>`
        if (!validActions.includes(action))
            return `${line} &lt;&lt;&lt; unknown action '${action}' <br>`
        if (targetType in targetTypeToBase === false)
            return `${line} &lt;&lt;&lt; unknown data type '${targetType}' <br>`

        // Attempt to parse number
        const sourceBase = targetTypeToBase[sourceType]
        const num = parseInt(sourceNum, sourceBase)

        // Invalid?
        if (!num && num !== 0)
            return `${line} &lt;&lt;&lt; invalid number '${sourceNum}' <br>`

        // Colour must be 3 or 6 digit hex
        if ((targetType === 'colour' || targetType === 'pixels') &&
            (sourceType !== 'hex' || !(sourceNum.length === 3 || sourceNum.length === 6)) )
            return `${line} &lt;&lt;&lt; invalid hex colour code '${sourceNum}' <br>`

        // Convert into required target format
        let targetBase = targetTypeToBase[targetType]
        let targetData = num.toString(targetBase).toUpperCase()

        // Pad if required, and make all colour codes 6 digit
        switch (targetType) {
            case 'bin-bytes':
            case 'ascii':
            case 'unicode':
                targetData = padDigits(targetData, 8)
                break
            case 'hex-bytes':
                targetData = padDigits(targetData, 2)
                break
            case 'dec-val':
                targetData = parseInt(targetData)
                break
            case 'colour':
            case 'pixels':
                if (targetData.length === 3)
                    targetData = targetData[0].repeat(2) + targetData[1].repeat(2) + targetData[2].repeat(2)
        }

        // ASCII must be single byte
        if (targetType === 'ascii' && targetData.length !== 8)
            return `${line} &lt;&lt;&lt; invalid ASCII value '${sourceNum}' <br>`
        // UniCode must be 2 bytes (keep it simple!)
        if (targetType === 'unicode' && targetData.length !== 16)
            return `${line} &lt;&lt;&lt; invalid UniCode value '${sourceNum}' <br>`

        // Prepare output HTML
        let targetName = baseName[targetBase]
        let targetDesc = `Base ${targetBase}`

        const aligned = op.includes('aligned') ? 'aligned' : ''
        const raw = op.includes('raw')

        let displayCode = ''

        switch (targetType) {
            case 'bin':
            case 'bin-bytes':
            case 'dec':
            case 'dec-val':
            case 'hex':
            case 'hex-bytes':
                displayCode = dataHeading(targetType, targetName, targetDesc, raw)
                displayCode += numberInTable(targetData, targetBase, aligned, raw)
                break
            case 'colour':
                displayCode = dataHeading(targetType, 'Colour', 'RGB', raw)
                displayCode += colourInTable(targetData, aligned, raw)
                break
            case 'pixels':
                displayCode = dataHeading(targetType, 'Pixels', 'RGB', raw)
                displayCode += pixelsInTable(targetData, aligned, raw)
                break
            case 'ascii':
                displayCode = dataHeading(targetType, 'ASCII', '8-Bit', raw)
                displayCode += charInTable(targetData, aligned, raw)
                break
            case 'unicode':
                displayCode = dataHeading(targetType, 'UniCode', '16/24-Bit', raw)
                displayCode += charInTable(targetData, aligned, raw)
                break
        }

        return displayCode
    }

    // -------------------------------------------------------------------------
    // Main Processing Function
    // -------------------------------------------------------------------------

    function processData() {
        const dataBlocks = document.querySelectorAll('pre[data-lang="data"]')

        dataBlocks.forEach(block => {
            // Skip if already processed
            if (block.classList.contains('data-processed')) {
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

            const dataDiv = document.createElement('div')
            dataDiv.classList.add('display-data')
            dataDiv.innerHTML = processedContent

            // Replace the pre block with the data display
            block.parentNode.replaceChild(dataDiv, block)
        })
    }

    // -------------------------------------------------------------------------
    // Docsify Plugin Hook
    // -------------------------------------------------------------------------

    if (window.$docsify) {
        window.$docsify.plugins = [].concat(
            window.$docsify.plugins || [],
            function (hook) {
                hook.doneEach(function () {
                    processData()
                })
            }
        )
    }

    // Also run on initial load if not using docsify
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processData)
    } else {
        processData()
    }

})()

