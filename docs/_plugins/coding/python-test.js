/**
 * docsify-python-test.js — Interactive code coverage visualization for Python testing
 *
 * Provides comprehensive test coverage analysis for Python code blocks with:
 * - Direct line instrumentation to track execution
 * - Simple arrow syntax for test cases (e.g., `95 -> "A"`)
 * - Automatic boundary detection in conditionals (e.g., `if score >= 90`)
 * - Test categorization (Invalid/Valid/Boundary sections)
 * - Visual heat map showing covered/uncovered lines
 * - Live statistics: coverage %, test results, boundary testing
 * - Split-panel layout with editable tests and read-only source
 *
 * Executes Python via Pyodide (browser-based Python runtime) with full
 * stdout capture and detailed error reporting tied to specific test lines.
 *
 * Usage in markdown:
 *   ```python test
 *   def calculate_grade(score):
 *       if score >= 90:
 *           return "A"
 *       elif score >= 70:
 *           return "B"
 *       return "F"
 *
 *   # Tests
 *   # Valid Values
 *   95 -> "A"
 *   75 -> "B"
 *   # Boundary Values
 *   90 -> "A"
 *   70 -> "B"
 *   # Invalid Values
 *   65 -> "F"
 *   ```
 *
 * Requirements:
 *   - Pyodide v0.25.0 (loaded automatically from CDN)
 *   - CodeMirror for editable test panel
 *   - Prism.js for syntax highlighting
 */

(function () {

    // Shared hidden snippet for executing coverage tests
    // Defined at module level so it's accessible from all functions
    let globalSnippet = null
    let globalPre = null
    let globalCode = null

    function ensureGlobalSnippet() {
        if (globalSnippet && document.body.contains(globalSnippet)) {
            return  // Already created and in DOM
        }

        // Create a persistent hidden execution environment
        const container = document.createElement('div')
        container.id = 'python-test-execution-env'
        container.style.cssText = 'position: absolute; left: -9999px; opacity: 0; pointer-events: none;'

        globalPre = document.createElement('pre')
        globalPre.className = 'language-python'
        globalCode = document.createElement('code')
        globalCode.className = 'language-python'
        globalCode.textContent = '# Execution environment'
        globalPre.appendChild(globalCode)
        container.appendChild(globalPre)

        globalSnippet = document.createElement('codapi-snippet')
        globalSnippet.setAttribute('engine', 'wasi')
        globalSnippet.setAttribute('sandbox', 'python')
        globalSnippet.setAttribute('editor', 'external')
        container.appendChild(globalSnippet)

        document.body.appendChild(container)
    }

    var docsifyPythonTest = function (hook) {

        // Transform markdown blocks
        hook.beforeEach(function (content) {
            content = content.replace(/\r\n/g, '\n')

            // Transform ```python test blocks
            content = content.replace(/^```python test$/gm, '```python-test')

            return content
        })

        // Wrap transformed blocks in a container
        hook.afterEach(function (html) {
            return html.replace(
                /<pre\b[^>]*\blanguage-python-test\b[^>]*>[\s\S]*?<\/pre>/g,
                function (preBlock) {
                    const cleaned = preBlock.replace(/\bpython-test\b/g, 'python')
                    return '<div class="python-test-container">' +
                            '<div class="python-test-source-section">' +
                            '<div class="python-test-source-label">Source Code</div>' +
                            '<div class="python-test-source"></div>' +
                           '</div>' +
                           '<div class="python-test-tests-section">' +
                            '<div class="python-test-tests-label">Tests (editable)</div>' +
                            '<div class="python-test-tests"></div>' +
                           '</div>' +
                           '<div class="python-test-controls">' +
                            '<button class="python-test-run-btn">▶ Run Tests</button>' +
                            '<button class="python-test-clear-btn">Reset</button>' +
                           '</div>' +
                           '<div class="python-test-original" style="display:none;">' + cleaned + '</div>' +
                           '</div>'
                }
            )
        })

        // Initialize coverage functionality after page render
        hook.doneEach(function () {
            document.querySelectorAll('.python-test-container').forEach(container => {
                const originalPre = container.querySelector('.python-test-original pre')
                const originalCode = originalPre?.querySelector('code')
                if (!originalCode) return

                const fullCode = originalCode.textContent
                const { sourceCode, testCode } = splitCodeAndTests(fullCode)

                // Create read-only source code display with syntax highlighting
                const sourceContainer = container.querySelector('.python-test-source')
                const sourcePre = document.createElement('pre')
                sourcePre.className = 'python-test-source-code'

                const sourceCodeEl = document.createElement('code')
                sourceCodeEl.className = 'language-python'
                sourceCodeEl.textContent = sourceCode
                sourcePre.appendChild(sourceCodeEl)
                sourceContainer.appendChild(sourcePre)

                // Create editable CodeMirror for tests
                const testsContainer = container.querySelector('.python-test-tests')
                const testEditor = CodeMirror(testsContainer, {
                    value: testCode,
                    mode: 'text/x-python',
                    theme: 'material-darker',
                    lineNumbers: false,
                    autoCloseBrackets: true,
                    matchBrackets: true,
                    indentUnit: 4,
                    lineWrapping: false,
                    viewportMargin: Infinity,
                    styleActiveLine: true,
                    gutters: ['CodeMirror-linenumbers'],
                })

                // Get control elements
                const runBtn = container.querySelector('.python-test-run-btn')
                const clearBtn = container.querySelector('.python-test-clear-btn')

                // Store references for coverage highlighting
                container._sourceCode = sourceCode
                container._sourceElement = sourceCodeEl
                container._sourcePre = sourcePre
                container._testEditor = testEditor

                // Render source with a persistent coverage gutter from first load.
                clearCoverageFromSource(container)

                // Run coverage analysis
                runBtn.addEventListener('click', async () => {
                    runBtn.disabled = true
                    runBtn.textContent = '⏳ Running...'

                    try {
                        // Get current test code from editor
                        const currentTestCode = testEditor.getValue()

                        if (!sourceCode.trim()) {
                            throw new Error('No source code found')
                        }

                        const instrumentedCode = instrumentCode(sourceCode, currentTestCode)

                        // Preserve current height to prevent content jump.
                        const previousHeight = Math.max(
                            getFeedbackHeight(container),
                            container._lastStatsHeight || 0
                        )

                        renderFeedbackLoading(container, previousHeight)
                        clearCoverageFromSource(container)

                        // Execute the instrumented code using Codapi
                        const output = await executeSnippetDirect(instrumentedCode)

                        // Parse coverage data
                        const coverage = parseCoverageOutput(output, sourceCode, currentTestCode)

                        // Apply visual heat map to read-only source code
                        applyHeatMapToSource(container, coverage, sourceCode)

                        // Update stats
                        displayStats(container, coverage, output)
                        const finalHeight = getFeedbackHeight(container)
                        container._lastStatsHeight = finalHeight

                    } catch (error) {
                        const errorMsg = error.message.replace('Python execution failed: ', '')
                        renderFeedbackError(container, errorMsg)
                        const errorHeight = getFeedbackHeight(container)
                        container._lastStatsHeight = errorHeight
                        console.error('Coverage error:', error)
                    } finally {
                        runBtn.disabled = false
                        runBtn.textContent = '▶ Run Tests'
                    }
                })

                // Clear coverage visualization
                clearBtn.addEventListener('click', () => {
                    clearCoverageFromSource(container)
                    clearFeedback(container)
                })
            })

            // Initialize the shared execution environment
            ensureGlobalSnippet()
        })
    }

    // -------------------------------------------------------------------------
    // Code Parsing
    // -------------------------------------------------------------------------

    function extractFunctionName(sourceCode) {
        // Find the first function definition
        const match = sourceCode.match(/^\s*def\s+(\w+)\s*\(/m)
        return match ? match[1] : null
    }

    function parseSimpleTests(testCode, functionName) {
        // Parse simple test syntax: input -> expected
        // Supports:
        //   value -> expected
        //   value1, value2 -> expected
        //   (value1, value2) -> expected

        const lines = testCode.split('\n')
        const tests = []

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim()

            // Skip empty lines and comments
            if (!line || line.startsWith('#')) continue

            // Check for simple test syntax
            const arrowMatch = line.match(/^(.+?)\s*->\s*(.+)$/)
            if (arrowMatch) {
                let inputs = arrowMatch[1].trim()
                const expected = arrowMatch[2].trim()

                // Remove outer parentheses if present
                inputs = inputs.replace(/^\((.*)\)$/, '$1')

                // Escape values for safe inclusion in Python strings
                const escapedInputs = inputs.replace(/'/g, "\\'")
                const escapedExpected = expected.replace(/'/g, "\\'")

                // Generate assert statement (use single quotes for error message with escaped content)
                const testLine = `assert ${functionName}(${inputs}) == ${expected}, 'Test failed: ${functionName}(${escapedInputs}) does not equal ${escapedExpected}'`
                tests.push({
                    lineNumber: i + 1,
                    originalLine: line,
                    testCode: testLine,
                    inputs: inputs,
                    expected: expected
                })
            } else if (line.startsWith('assert')) {
                // Keep existing assert statements
                tests.push({
                    lineNumber: i + 1,
                    originalLine: line,
                    testCode: line,
                    inputs: null,
                    expected: null
                })
            }
        }

        return tests
    }

    function splitCodeAndTests(code) {
        const lines = code.split('\n')
        let testStartIndex = -1

        // Find the line with # Tests comment (can have extra chars like dashes)
        for (let i = 0; i < lines.length; i++) {
            if (/^\s*#\s*Tests?\b/i.test(lines[i])) {
                testStartIndex = i
                break
            }
        }

        if (testStartIndex === -1) {
            // No # Tests marker, try to detect test code
            for (let i = 0; i < lines.length; i++) {
                if (/^\s*(assert|def test_|if __name__|\w+\s*->)/.test(lines[i])) {
                    testStartIndex = i
                    break
                }
            }
        }

        if (testStartIndex === -1) {
            return { sourceCode: code, testCode: '' }
        }

        let sourceCode = lines.slice(0, testStartIndex).join('\n')
        let testCode = lines.slice(testStartIndex + 1).join('\n')

        // Remove trailing blank lines from source code
        sourceCode = sourceCode.replace(/\n+$/, '')

        // Remove leading blank lines from test code
        testCode = testCode.replace(/^\n+/, '')

        return { sourceCode, testCode }
    }

    // -------------------------------------------------------------------------
    // Boundary Detection
    // -------------------------------------------------------------------------

    function detectBoundaries(sourceCode) {
        /**
         * Detect boundary conditions in source code
         * Returns array of boundary objects with line number, operator, and threshold
         */
        const boundaries = []
        const lines = sourceCode.split('\n')

        lines.forEach((line, idx) => {
            const lineNum = idx + 1
            // Match comparison operators with numeric literals
            // Patterns: if x >= 90, len(password) < 8, etc.
            const patterns = [
                // Match: variable or function_call(args) operator number
                /\b(\w+(?:\([^)]*\))?)\s*(>=|<=|>|<)\s*(-?\d+\.?\d*)/g,
                // Match: number operator variable or function_call(args)
                /(-?\d+\.?\d*)\s*(>=|<=|>|<)\s*(\w+(?:\([^)]*\))?)/g
            ]

            patterns.forEach(pattern => {
                let match
                while ((match = pattern.exec(line)) !== null) {
                    let variable, operator, threshold

                    if (match[1] && match[2] && match[3]) {
                        // Pattern 1: variable/function operator number
                        if (isNaN(match[1])) {
                            variable = match[1]
                            operator = match[2]
                            threshold = parseFloat(match[3])
                        } else {
                            // Pattern 2: number operator variable/function (reverse)
                            threshold = parseFloat(match[1])
                            operator = reverseOperator(match[2])
                            variable = match[3]
                        }

                        boundaries.push({
                            lineNum,
                            variable,
                            operator,
                            threshold,
                            line: line.trim()
                        })
                    }
                }
            })
        })

        return boundaries
    }

    function reverseOperator(op) {
        // Reverse comparison operator when threshold is on left
        // 90 <= x  becomes  x >= 90
        const reverseMap = { '>=': '<=', '<=': '>=', '>': '<', '<': '>' }
        return reverseMap[op] || op
    }

    function categorizeTests(testCode, tests) {
        /**
         * Categorize tests based on section headers in test code
         * Sections: # Invalid Values, # Valid Values, # Boundary Values
         */
        const lines = testCode.split('\n')
        const categorized = { invalid: [], valid: [], boundary: [] }
        let currentCategory = 'valid'  // default

        let testIndex = 0

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim()

            // Check for category headers
            if (/^#\s*Invalid/i.test(line)) {
                currentCategory = 'invalid'
            } else if (/^#\s*Valid(?!\s+Values)/i.test(line) || /^#\s*Valid\s+Values/i.test(line)) {
                currentCategory = 'valid'
            } else if (/^#\s*Boundary/i.test(line)) {
                currentCategory = 'boundary'
            } else if (line && !line.startsWith('#') && line.includes('->')) {
                // This is a test line
                if (testIndex < tests.length) {
                    const test = tests[testIndex]
                    test.category = currentCategory
                    categorized[currentCategory].push(test)
                    testIndex++
                }
            }
        }

        return categorized
    }

    function analyzeBoundaries(boundaries, categorizedTests) {
        /**
         * Analyze which boundary values are tested
         * Returns boundary coverage statistics
         */
        const boundaryTests = categorizedTests.boundary || []
        let totalBoundaries = 0
        let testedBoundaries = 0

        // Each boundary line needs 2 tests: valid threshold and invalid threshold
        boundaries.forEach(boundary => {
            const { threshold, operator } = boundary

            // Determine what values satisfy this boundary
            let validValue, invalidValue

            switch (operator) {
                case '>=':
                    validValue = threshold
                    invalidValue = threshold - 1
                    break
                case '>':
                    validValue = threshold + 1
                    invalidValue = threshold
                    break
                case '<=':
                    validValue = threshold
                    invalidValue = threshold + 1
                    break
                case '<':
                    validValue = threshold - 1
                    invalidValue = threshold
                    break
            }

            // Check if we have tests near this boundary
            // For len() functions, compare string lengths; otherwise compare numeric values
            const isLengthCheck = boundary.variable.startsWith('len(')

            const hasValidTest = boundaryTests.some(test => {
                const input = isLengthCheck ? parseStringLength(test.inputs) : parseTestInput(test.inputs)
                return Math.abs(input - validValue) < 0.01
            })

            const hasInvalidTest = boundaryTests.some(test => {
                const input = isLengthCheck ? parseStringLength(test.inputs) : parseTestInput(test.inputs)
                return Math.abs(input - invalidValue) < 0.01
            })

            totalBoundaries += 2  // Valid and invalid sides
            if (hasValidTest) testedBoundaries++
            if (hasInvalidTest) testedBoundaries++

            boundary.validTested = hasValidTest
            boundary.invalidTested = hasInvalidTest
        })

        return {
            boundaries,
            totalBoundaries,
            testedBoundaries,
            percentage: totalBoundaries > 0 ? Math.round((testedBoundaries / totalBoundaries) * 100) : 0
        }
    }

    function parseTestInput(inputStr) {
        /**
         * Extract numeric value from test input string
         * Handles: "95", "-5", "95, 'A'", etc.
         */
        if (!inputStr) return NaN

        // Try to extract first numeric value
        const match = inputStr.match(/-?\d+\.?\d*/)
        return match ? parseFloat(match[0]) : NaN
    }

    function parseStringLength(inputStr) {
        /**
         * Extract string length from test input
         * Handles: "Short1" -> 6, '"ValidPass123"' -> 12
         */
        if (!inputStr) return NaN

        // Try to extract string literal (with quotes)
        const stringMatch = inputStr.match(/["']([^"']+)["']/)
        if (stringMatch && stringMatch[1]) {
            return stringMatch[1].length
        }

        // Fallback: treat the whole input as a string (without quotes)
        return inputStr.trim().length
    }

    // -------------------------------------------------------------------------
    // Code Instrumentation
    // -------------------------------------------------------------------------

    function instrumentCode(sourceCode, testCode) {
        // Direct code instrumentation - inject _hit() calls
        const lines = sourceCode.split('\n')
        const instrumentedLines = []

        // Add tracking header
        instrumentedLines.push('import json')
        instrumentedLines.push('import sys')
        instrumentedLines.push('_coverage = {}')
        instrumentedLines.push('_test_results = []')
        instrumentedLines.push('def _hit(line):')
        instrumentedLines.push('    _coverage[line] = _coverage.get(line, 0) + 1')
        instrumentedLines.push('')

        // Process each line of source code
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]
            const lineNum = i + 1
            const trimmed = line.trim()

            // Add original line
            instrumentedLines.push(line)

            // Skip empty lines, comments, and non-executable lines
            if (!trimmed || trimmed.startsWith('#')) {
                continue
            }

            // Check if this is inside a function (indented) and executable
            const indent = line.match(/^\s*/)[0]
            const isInsideFunction = indent.length > 0
            const isDefinition = trimmed.startsWith('def ') ||
                                trimmed.startsWith('class ') ||
                                trimmed.endsWith(':')

            // Inject tracking call AFTER function body lines
            if (isInsideFunction && !isDefinition) {
                // Insert _hit() call before the line content
                const hitCall = `${indent}_hit(${lineNum})`
                // Replace the line we just added with hit call + line
                instrumentedLines[instrumentedLines.length - 1] = hitCall
                instrumentedLines.push(line)
            }
        }

        // Parse tests and convert simple syntax to asserts
        const functionName = extractFunctionName(sourceCode)
        const tests = parseSimpleTests(testCode, functionName)

        // Add test execution with error handling
        instrumentedLines.push('')
        instrumentedLines.push('# Execute tests')

        for (let i = 0; i < tests.length; i++) {
            const test = tests[i]
            // Add marker comment to identify which test this is (no escaping needed in comments)
            instrumentedLines.push(`# TEST_LINE: ${test.originalLine}`)
            instrumentedLines.push(`try:`)
            instrumentedLines.push(`    ${test.testCode}`)
            instrumentedLines.push(`    _test_results.append({"test": ${i + 1}, "passed": True, "line": "${escapeForPython(test.originalLine)}"})`)
            instrumentedLines.push(`except AssertionError as e:`)
            instrumentedLines.push(`    _test_results.append({"test": ${i + 1}, "passed": False, "line": "${escapeForPython(test.originalLine)}", "error": str(e)})`)
        }

        // Output results
        instrumentedLines.push('')
        instrumentedLines.push('# Output coverage and test results')
        instrumentedLines.push('print("\\n__COVERAGE__:", json.dumps(_coverage))')
        instrumentedLines.push('print("\\n__TESTS__:", json.dumps(_test_results))')

        return instrumentedLines.join('\n')
    }

    function escapeForPython(text) {
        return text.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')
    }

    // -------------------------------------------------------------------------
    // Execution
    // -------------------------------------------------------------------------

    async function executeSnippetDirect(code) {
        // Strategy: Load and use Pyodide ourselves since Codapi doesn't expose it
        // Pyodide is the most reliable way to run Python in the browser

        try {
            // Load Pyodide if not already loaded
            if (!window.pyodideInstance) {

                // Load Pyodide from CDN
                if (typeof loadPyodide === 'undefined') {
                    // Inject Pyodide loader script
                    await new Promise((resolve, reject) => {
                        const script = document.createElement('script')
                        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js'
                        script.onload = resolve
                        script.onerror = () => reject(new Error('Failed to load Pyodide'))
                        document.head.appendChild(script)
                    })
                }

                // Initialize Pyodide
                window.pyodideInstance = await loadPyodide({
                    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/'
                })
            }

            const pyodide = window.pyodideInstance

            // Capture stdout
            let output = ''
            pyodide.setStdout({
                batched: (text) => { output += text + '\n' }
            })

            // Run the code
            await pyodide.runPythonAsync(code)

            return output

        } catch (err) {
            console.error('Pyodide execution error:', err)
            // Try to extract line number and error details from Python traceback
            const errorInfo = parsePythonError(err.message, code)
            throw new Error(`Python execution failed: ${errorInfo}`)
        }
    }

    function parsePythonError(errorMessage, instrumentedCode) {
        // Extract useful error information from Python traceback
        // Look for line numbers and error types

        // Match NameError, SyntaxError, etc.
        const errorTypeMatch = errorMessage.match(/(\w+Error): (.+)$/m)
        if (!errorTypeMatch) return errorMessage

        const errorType = errorTypeMatch[1]
        const errorDetail = errorTypeMatch[2]

        // Try to find which test line caused the error
        const lines = instrumentedCode.split('\n')
        // Match the line number from the File "<exec>" reference specifically
        const testLineMatch = errorMessage.match(/File\s+"<exec>",\s+line\s+(\d+)/)

        if (testLineMatch) {
            const errorLine = parseInt(testLineMatch[1])

            // Look backwards from error line to find the TEST_LINE marker
            let testMarker = null
            const startIndex = Math.min(errorLine - 2, lines.length - 1)

            for (let i = startIndex; i >= 0; i--) {
                const line = lines[i]
                if (!line) continue

                const markerMatch = line.match(/^# TEST_LINE: (.+)$/)
                if (markerMatch) {
                    testMarker = markerMatch[1]
                    break
                }

                // Stop searching if we hit the "Execute tests" marker or go too far
                if (line.includes('# Execute tests') || errorLine - i > 15) {
                    break
                }
            }

            if (testMarker) {
                // Special handling for common syntax errors
                if (errorType === 'SyntaxError' && errorDetail.includes('unterminated string')) {
                    return `Syntax error in test <code>${testMarker}</code>: Missing closing quote. Make sure strings are properly closed.`
                }
                return `${errorType} in test <code>${testMarker}</code>: ${errorDetail}`
            }
        }

        // Special handling for common test syntax errors (fallback)
        if (errorType === 'NameError') {
            const nameMatch = errorDetail.match(/name '(\w+)' is not defined/)
            if (nameMatch) {
                const missingName = nameMatch[1]
                // Check if it looks like it should be a string
                if (missingName.length === 1 || missingName[0] === missingName[0].toUpperCase()) {
                    return `${errorType}: <code>${missingName}</code> is not defined. Did you forget quotes? Try <code>"${missingName}"</code> instead.`
                }
            }
        }

        return `${errorType}: ${errorDetail}`
    }

    // -------------------------------------------------------------------------
    // Coverage Parsing
    // -------------------------------------------------------------------------

    function parseCoverageOutput(output, sourceCode, testCode) {

        // Extract coverage data (match simple flat object with no nesting)
        const coverageMatch = output.match(/__COVERAGE__:\s*(\{[^}]*\})/)
        if (!coverageMatch) {
            console.error('Coverage marker not found. Full output:', output)
            throw new Error(`Coverage data not found in output. Check console for details.`)
        }

        // Extract test results (match array to end of output)
        const testsMatch = output.match(/__TESTS__:\s*(\[.*\])\s*$/)
        const testResults = testsMatch ? JSON.parse(testsMatch[1]) : []

        const coverageLines = JSON.parse(coverageMatch[1])
        const sourceLines = sourceCode.split('\n')

        // Determine which lines are executable
        const executable = []
        for (let i = 0; i < sourceLines.length; i++) {
            const lineNum = i + 1
            const line = sourceLines[i].trim()

            // A line is executable if it's not empty, not a comment,
            // not a docstring, not just a declaration, and is indented (inside a function)
            const isIndented = sourceLines[i].match(/^\s+/)
            const isDocstring = line.startsWith('"""') || line.startsWith("'''") ||
                               /^["']{3}.*["']{3}$/.test(line)
            const isExecutable = line.length > 0 &&
                                !line.startsWith('#') &&
                                !isDocstring &&
                                !line.endsWith(':') &&
                                !line.startsWith('def ') &&
                                !line.startsWith('class ') &&
                                isIndented

            if (isExecutable) {
                executable.push(lineNum)
            }
        }

        // Calculate statistics
        const coveredCount = executable.filter(line => coverageLines[line] > 0).length
        const executableCount = executable.length
        const percentage = executableCount > 0
            ? Math.round((coveredCount / executableCount) * 100)
            : 0

        // Find uncovered lines
        const uncovered = executable.filter(line => !coverageLines[line])

        // Detect boundaries in source code
        const detectedBoundaries = detectBoundaries(sourceCode)

        // Parse and categorize tests
        const functionName = extractFunctionName(sourceCode)
        const parsedTests = parseSimpleTests(testCode, functionName)
        const categorizedTests = categorizeTests(testCode, parsedTests)

        // Analyze boundary coverage
        const boundaryAnalysis = analyzeBoundaries(detectedBoundaries, categorizedTests)

        return {
            lines: coverageLines,
            executable,
            uncovered,
            coveredCount,
            executableCount,
            percentage,
            sourceLines,
            testResults,
            boundaries: boundaryAnalysis.boundaries,
            boundaryStats: {
                total: boundaryAnalysis.totalBoundaries,
                tested: boundaryAnalysis.testedBoundaries,
                percentage: boundaryAnalysis.percentage
            },
            categorizedTests
        }
    }

    // -------------------------------------------------------------------------
    // Visualization
    // -------------------------------------------------------------------------

    function applyHeatMapToSource(container, coverage, sourceCode) {
        const sourceCodeEl = container._sourceElement
        const sourceLines = sourceCode.split('\n')

        // Get boundary lines
        const boundaryLines = new Set((coverage.boundaries || []).map(b => b.lineNum))

        // Wrap each line with coverage information
        const wrappedLines = sourceLines.map((line, index) => {
            const lineNum = index + 1
            const hits = coverage.lines[lineNum] || 0
            const isExecutable = coverage.executable.includes(lineNum)
            const isBoundary = boundaryLines.has(lineNum)

            let className = 'python-test-line'
            let gutterContent = ''

            if (isBoundary) {
                className += ' python-test-boundary'
            }

            if (isExecutable) {
                if (hits > 0) {
                    className += ' python-test-hit'
                    gutterContent = `<span class="python-test-hit-count" title="Executed ${hits} time${hits > 1 ? 's' : ''}">${hits > 1 ? `×${hits}` : '✓'}</span>`
                } else {
                    className += ' python-test-miss'
                    gutterContent = `<span class="python-test-miss-marker" title="Not covered by tests">!</span>`
                }
            }

            // Add boundary indicator on left side of gutter
            if (isBoundary) {
                gutterContent += `<span class="python-test-boundary-indicator" title="Boundary condition">◆</span>`
            }

            const highlightedLine = highlightPythonLine(line)
            return `<div class="${className}"><span class="python-test-gutter"><span class="python-test-line-number">${lineNum}</span><span class="python-test-gutter-marker">${gutterContent}</span></span><span class="python-test-code">${highlightedLine}</span></div>`
        }).join('')

        // Replace the code element content with line-wrapped version
        sourceCodeEl.innerHTML = wrappedLines
        sourceCodeEl.classList.add('python-test-highlighted')
    }

    function clearCoverageFromSource(container) {
        const sourceCodeEl = container._sourceElement
        if (!sourceCodeEl) return

        // Restore source code with neutral gutter markup (keeps layout stable)
        const sourceCode = container._sourceCode
        if (sourceCode) {
            // Detect boundaries even when clearing (to show boundary markers)
            const boundaries = detectBoundaries(sourceCode)
            const boundaryLines = new Set(boundaries.map(b => b.lineNum))

            const sourceLines = sourceCode.split('\n')
            const wrappedLines = sourceLines.map((line, index) => {
                const lineNum = index + 1
                const isBoundary = boundaryLines.has(lineNum)

                let className = 'python-test-line'
                if (isBoundary) {
                    className += ' python-test-boundary'
                }

                // Add boundary indicator on left side of gutter
                let gutterContent = ''
                if (isBoundary) {
                    gutterContent = `<span class="python-test-boundary-indicator" title="Boundary condition">◆</span>`
                }

                const highlightedLine = highlightPythonLine(line)
                return `<div class="${className}"><span class="python-test-gutter"><span class="python-test-line-number">${lineNum}</span><span class="python-test-gutter-marker">${gutterContent}</span></span><span class="python-test-code">${highlightedLine}</span></div>`
            }).join('')

            sourceCodeEl.innerHTML = wrappedLines
            sourceCodeEl.classList.add('python-test-highlighted')
        }
    }

    // -------------------------------------------------------------------------
    // Statistics Display
    // -------------------------------------------------------------------------

    function renderTestResultItem(test, testResults, category) {
        /**
         * Render a single test result list item
         */
        const result = testResults.find(r => r.line === test.originalLine)
        if (!result) return ''

        const icon = result.passed ? '✓' : '✗'
        const cssClass = result.passed ? 'test-pass' : 'test-fail'
        return `<li class="${cssClass}">
            <span class="test-icon">${icon}</span>
            <span class="test-content"><code>${escapeHtml(result.line)}</code></span>
            <span class="test-type">${category}</span>
        </li>`
    }

    function renderCoverageItem(lines, type) {
        /**
         * Render a coverage feedback item (covered or uncovered lines)
         */
        if (lines.length === 0) return ''

        const isCovered = type === 'covered'
        const cssClass = isCovered ? 'coverage-pass' : 'coverage-fail'
        const icon = isCovered ? '✓' : '✗'
        const label = isCovered ? 'Covered line numbers:' : 'Untested line numbers:'

        return `<li class="${cssClass}">
                    <span class="test-icon">${icon}</span>
                    <span>${label}</span>
                    <span class="coverage-lines">${lines.join(', ')}</span>
                </li>`
    }

    function displayStats(container, coverage, output) {
        const cleanOutput = output
            .replace(/__COVERAGE__:.*$/m, '')
            .replace(/__TESTS__:.*$/m, '')
            .trim()

        const testResults = coverage.testResults || []
        const passedTests = testResults.filter(t => t.passed).length
        const totalTests = testResults.length
        const testsPercentage = totalTests > 0 ? Math.round((passedTests * 100) / totalTests) : 0

        // Get boundary stats
        const boundaryStats = coverage.boundaryStats || { total: 0, tested: 0, percentage: 0 }
        const categorizedTests = coverage.categorizedTests || { invalid: [], valid: [], boundary: [] }

        let html = `
            <div class="python-test-stats">
                <div class="python-test-stat">
                    <span class="python-test-stat-label">Coverage</span>
                    <span class="python-test-stat-percentage python-test-stat-${getCoverageLevel(coverage.percentage)}">${coverage.percentage}%</span>
                    <span class="python-test-stat-fraction python-test-stat-${coverage.coveredCount === coverage.executableCount ? 'excellent' : 'poor'}">${coverage.coveredCount}/${coverage.executableCount}</span>
                </div>
                <div class="python-test-stat">
                    <span class="python-test-stat-label">Tests</span>
                    <span class="python-test-stat-percentage python-test-stat-${testsPercentage === 100 ? 'excellent' : 'poor'}">${testsPercentage}%</span>
                    <span class="python-test-stat-fraction python-test-stat-${totalTests === passedTests ? 'excellent' : 'poor'}">${passedTests}/${totalTests}</span>
                </div>
                <div class="python-test-stat">
                    <span class="python-test-stat-label">Boundaries</span>
                    <span class="python-test-stat-percentage ${boundaryStats.total > 0 ? `python-test-stat-${boundaryStats.percentage === 100 ? 'excellent' : 'poor'}` : ''}">${boundaryStats.total > 0 ? `${boundaryStats.percentage}%` : '—'}</span>
                    <span class="python-test-stat-fraction ${boundaryStats.total > 0 ? `python-test-stat-${boundaryStats.tested === boundaryStats.total ? 'excellent' : 'poor'}` : ''}">${boundaryStats.total > 0 ? `${boundaryStats.tested}/${boundaryStats.total}` : '—'}</span>
                </div>
            </div>
        `

        // Show test results categorized by section
        if (testResults.length > 0) {
            html += '<div class="python-test-results">'
            html += '<div class="python-test-results-label">Test Results</div>'
            html += '<ul class="python-test-list">'

            // Render all categories using helper function
            categorizedTests.invalid.forEach(test => {
                html += renderTestResultItem(test, testResults, 'Invalid')
            })

            categorizedTests.valid.forEach(test => {
                html += renderTestResultItem(test, testResults, 'Valid')
            })

            categorizedTests.boundary.forEach(test => {
                html += renderTestResultItem(test, testResults, 'Boundary')
            })

            html += '</ul>'
            html += '</div>'
        }

        // Coverage feedback block
        html += '<div class="python-test-coverage">'
        html += '<div class="python-test-coverage-label">Test Coverage</div>'
        html += '<ul class="python-test-list">'

        // Show covered and uncovered lines
        const coveredLines = coverage.executable.filter(line => coverage.lines[line] > 0)
        html += renderCoverageItem(coveredLines, 'covered')
        html += renderCoverageItem(coverage.uncovered, 'uncovered')

        html += '</ul>'
        html += '</div>'

        if (cleanOutput) {
            html += `<div class="python-test-output">
                <div class="python-test-output-label">Code Output</div>
                <pre>${escapeHtml(cleanOutput)}</pre>
            </div>`
        }

        renderFeedbackHtml(container, html)
    }

    function getFeedbackNodes(container) {
        return Array.from(container.children).filter((child) => (
            child.classList.contains('python-test-loading') ||
            child.classList.contains('python-test-error') ||
            child.classList.contains('python-test-stats') ||
            child.classList.contains('python-test-results') ||
            child.classList.contains('python-test-coverage') ||
            child.classList.contains('python-test-output')
        ))
    }

    function clearFeedback(container) {
        getFeedbackNodes(container).forEach((node) => node.remove())
    }

    function getFeedbackHeight(container) {
        return getFeedbackNodes(container).reduce((sum, node) => sum + node.offsetHeight, 0)
    }

    function renderFeedbackLoading(container, minHeight = 0) {
        clearFeedback(container)
        const loading = document.createElement('div')
        loading.className = 'python-test-loading'
        loading.textContent = 'Running tests...'
        if (minHeight > 0) {
            loading.style.minHeight = `${minHeight}px`
        }
        container.appendChild(loading)
    }

    function renderFeedbackError(container, errorMsg) {
        clearFeedback(container)
        const error = document.createElement('div')
        error.className = 'python-test-error'
        error.innerHTML = `
            <strong>❌ Test Error</strong>
            <div class="error-message">${errorMsg}</div>
        `
        container.appendChild(error)
    }

    function renderFeedbackHtml(container, html) {
        clearFeedback(container)
        const fragmentHost = document.createElement('div')
        fragmentHost.innerHTML = html
        Array.from(fragmentHost.children).forEach((child) => container.appendChild(child))
    }

    function getCoverageLevel(percentage) {
        return percentage === 100 ? 'excellent' : 'poor'
    }

    function escapeHtml(text) {
        const div = document.createElement('div')
        div.textContent = text
        return div.innerHTML
    }

    function highlightPythonLine(line) {
        const text = line && line.length > 0 ? line : ' '
        if (window.Prism?.languages?.python) {
            return Prism.highlight(text, Prism.languages.python, 'python')
        }
        return escapeHtml(text)
    }

    // -------------------------------------------------------------------------
    // Plugin Registration
    // -------------------------------------------------------------------------

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyPythonTest, window.$docsify.plugins || [])

})()
