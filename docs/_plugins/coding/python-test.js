/**
 * docsify-python-test.js — Code coverage visualization for Python testing
 *
 * Adds test coverage analysis to Python code blocks using AST-based instrumentation.
 * Executes via Codapi's WASI engine (same as python-runner.js) and visualizes
 * line coverage with color-coded heat maps directly on editable CodeMirror blocks.
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
 *   assert calculate_grade(95) == "A"
 *   assert calculate_grade(65) == "F"
 *   ```
 *
 * Requirements:
 *   - python-runner.js must be loaded first
 *   - Codapi/WASI engine must be available
 *   - CodeMirror must be loaded
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

        console.log('Created global snippet for test execution')
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

                        // Debug: log the instrumented code
                        console.log('Instrumented code:', instrumentedCode)

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
                        const coverage = parseCoverageOutput(output, sourceCode)

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

        // Find the line with # Tests comment
        for (let i = 0; i < lines.length; i++) {
            if (/^\s*#\s*Tests?\s*$/i.test(lines[i])) {
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
                console.log('Loading Pyodide for the first time...')

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
                console.log('Initializing Pyodide...')
                window.pyodideInstance = await loadPyodide({
                    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/'
                })
                console.log('Pyodide ready')
            }

            const pyodide = window.pyodideInstance

            // Capture stdout
            let output = ''
            pyodide.setStdout({
                batched: (text) => { output += text + '\n' }
            })

            // Run the code
            await pyodide.runPythonAsync(code)

            console.log('Pyodide execution output:', output)
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

        // Special handling for common test syntax errors
        if (errorType === 'NameError') {
            const nameMatch = errorDetail.match(/name '(\w+)' is not defined/)
            if (nameMatch) {
                const missingName = nameMatch[1]
                // Check if it looks like it should be a string
                if (missingName.length === 1 || missingName[0] === missingName[0].toUpperCase()) {
                    return `Syntax error in test: <code>${missingName}</code> is not defined. Did you forget quotes? Try <code>"${missingName}"</code> instead.`
                }
            }
        }

        // Try to find which test line caused the error
        // Look for the test assertion lines in the instrumented code
        const lines = instrumentedCode.split('\n')
        const testLineMatch = errorMessage.match(/line (\d+)/)

        if (testLineMatch) {
            const errorLine = parseInt(testLineMatch[1])
            // Find the test that corresponds to this line
            let testContext = ''
            if (errorLine >= 0 && errorLine < lines.length) {
                const codeLine = lines[errorLine - 1]
                // Try to extract the original test from the assertion
                const assertMatch = codeLine.match(/assert.*'Test failed: (.+)'$/)
                if (assertMatch) {
                    testContext = ` in test: <code>${assertMatch[1]}</code>`
                }
            }

            return `${errorType}: ${errorDetail}${testContext}`
        }

        return `${errorType}: ${errorDetail}`
    }

    // -------------------------------------------------------------------------
    // Coverage Parsing
    // -------------------------------------------------------------------------

    function parseCoverageOutput(output, sourceCode) {
        // Debug: log the actual output
        console.log('Python output:', output)

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
            // not just a declaration, and is indented (inside a function)
            const isIndented = sourceLines[i].match(/^\s+/)
            const isExecutable = line.length > 0 &&
                                !line.startsWith('#') &&
                                !line.endsWith(':') &&
                                !line.startsWith('def ') &&
                                !line.startsWith('class ') &&
                                isIndented

            if (isExecutable) {
                executable.push(lineNum)
            }
        }

        // Calculate statistics
        const coveredLines = Object.keys(coverageLines).map(Number).filter(line => coverageLines[line] > 0)
        const coveredCount = coveredLines.length
        const executableCount = executable.length
        const percentage = executableCount > 0
            ? Math.round((coveredCount / executableCount) * 100)
            : 0

        // Find uncovered lines
        const uncovered = executable.filter(line => !coverageLines[line])

        return {
            lines: coverageLines,
            executable,
            uncovered,
            coveredCount,
            executableCount,
            percentage,
            sourceLines,
            testResults
        }
    }

    // -------------------------------------------------------------------------
    // Visualization
    // -------------------------------------------------------------------------

    function applyHeatMapToSource(container, coverage, sourceCode) {
        const sourceCodeEl = container._sourceElement
        const sourceLines = sourceCode.split('\n')

        // Wrap each line with coverage information
        const wrappedLines = sourceLines.map((line, index) => {
            const lineNum = index + 1
            const hits = coverage.lines[lineNum] || 0
            const isExecutable = coverage.executable.includes(lineNum)

            let className = 'python-test-line'
            let gutterContent = ''

            if (isExecutable) {
                if (hits > 0) {
                    className += ' python-test-hit'
                    gutterContent = `<span class="python-test-hit-count" title="Executed ${hits} time${hits > 1 ? 's' : ''}">${hits > 1 ? `×${hits}` : '✓'}</span>`
                } else {
                    className += ' python-test-miss'
                    gutterContent = `<span class="python-test-miss-marker" title="Not covered by tests">!</span>`
                }
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
            const sourceLines = sourceCode.split('\n')
            const wrappedLines = sourceLines.map((line, index) => {
                const lineNum = index + 1
                const highlightedLine = highlightPythonLine(line)
                return `<div class="python-test-line"><span class="python-test-gutter"><span class="python-test-line-number">${lineNum}</span><span class="python-test-gutter-marker"></span></span><span class="python-test-code">${highlightedLine}</span></div>`
            }).join('')

            sourceCodeEl.innerHTML = wrappedLines
            sourceCodeEl.classList.add('python-test-highlighted')
        }
    }

    // -------------------------------------------------------------------------
    // Statistics Display
    // -------------------------------------------------------------------------

    function displayStats(container, coverage, output) {
        const cleanOutput = output
            .replace(/__COVERAGE__:.*$/m, '')
            .replace(/__TESTS__:.*$/m, '')
            .trim()

        const testResults = coverage.testResults || []
        const passedTests = testResults.filter(t => t.passed).length
        const totalTests = testResults.length
        const testsPercentage = passedTests * 100 / totalTests

        let html = `
            <div class="python-test-stats">
                <div class="python-test-stat">
                    <span class="python-test-stat-label">Tests</span>
                    <span class="python-test-stat-value python-test-stat-${totalTests === passedTests ? 'excellent' : 'poor'}">${testsPercentage}%</span>
                </div>
                <div class="python-test-stat">
                    <span class="python-test-stat-label">Tests</span>
                    <span class="python-test-stat-value">${passedTests}/${totalTests}</span>
                </div>
                <div class="python-test-stat">
                    <span class="python-test-stat-label">Coverage</span>
                    <span class="python-test-stat-value python-test-stat-${getCoverageLevel(coverage.percentage)}">${coverage.percentage}%</span>
                </div>
                <div class="python-test-stat">
                    <span class="python-test-stat-label">Lines</span>
                    <span class="python-test-stat-value">${coverage.coveredCount}/${coverage.executableCount}</span>
                </div>
            </div>
        `

        // Show test results
        if (testResults.length > 0) {
            html += '<div class="python-test-results">'
            html += '<div class="python-test-results-label">Test Results</div>'
            html += '<ul class="python-test-list">'

            testResults.forEach(test => {
                const icon = test.passed ? '✓ Pass' : '✗ Fail'
                const cssClass = test.passed ? 'test-pass' : 'test-fail'
                html += `<li class="${cssClass}">
                    <span class="test-icon">${icon}</span>
                    <div class="test-content">
                        <code>${escapeHtml(test.line)}</code>
                    </div>
                </li>`
            })

            // Add untested lines inside test results section
            if (coverage.uncovered.length > 0) {
                html += `<li class="python-test-uncovered">
                    <strong>Untested lines:</strong> ${coverage.uncovered.join(', ')}
                </li>`
            }

            html += '</ul>'

            html += '</div>'
        }

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
        if (percentage >= 90) return 'excellent'
        if (percentage >= 80) return 'good'
        if (percentage >= 70) return 'fair'
        return 'poor'
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
