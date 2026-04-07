/**
 * docsify-memory-sim.js — Interactive memory visualization for teaching OOP concepts
 *
 * Helps students understand:
 *   - Local variables vs Heap memory
 *   - Value types vs Reference types
 *   - Object instantiation and field storage
 *   - Reference copying and aliasing
 *   - Null references
 *
 * Usage in markdown:
 *   ```memory-sim
 *   // Step: Create primitive
 *   val age = 25
 *
 *   // Step: Create object
 *   val person = Person("Alice", 25)
 *
 *   // Step: Copy reference
 *   val person2 = person
 *
 *   // Step: Modify through reference
 *   person2.age = 26
 *   ```
 *
 * Syntax:
 *   - Lines starting with "// Step:" mark execution steps
 *   - Supports: val declarations, object creation, field updates, null assignments
 *   - Object syntax: ClassName(field1, field2, ...)
 */

;(function () {

    // -------------------------------------------------------------------------
    // Memory State Model
    // -------------------------------------------------------------------------

    class MemoryState {
        constructor() {
            this.stack = []         // Local variables (both primitives and references)
            this.heap = []          // Heap objects with unique IDs
            this.nextObjectId = 1   // Auto-increment object IDs
            this.currentStep = 0    // Current execution step
            this.steps = []         // Array of parsed steps
        }

        reset() {
            this.stack = []
            this.heap = []
            this.nextObjectId = 1
            this.currentStep = 0
        }

        // Add a primitive value to local variables
        addPrimitive(name, value) {
            const existing = this.stack.find(v => v.name === name)
            if (existing) {
                existing.value = value
                existing.type = 'primitive'
            } else {
                this.stack.push({
                    name,
                    value,
                    type: 'primitive'
                })
            }
        }

        // Add a reference to local variables and create object on heap
        addObject(name, className, fields) {
            const objectId = this.nextObjectId++

            // Create object on heap
            this.heap.push({
                id: objectId,
                className,
                fields: { ...fields }
            })

            // Add reference to local variables
            const existing = this.stack.find(v => v.name === name)
            if (existing) {
                existing.type = 'reference'
                existing.objectId = objectId
            } else {
                this.stack.push({
                    name,
                    type: 'reference',
                    objectId
                })
            }
        }

        // Copy a reference
        copyReference(newName, existingName) {
            const existing = this.stack.find(v => v.name === existingName)
            if (!existing) return

            const target = this.stack.find(v => v.name === newName)

            if (existing.type === 'reference') {
                if (target) {
                    target.type = 'reference'
                    target.objectId = existing.objectId
                    delete target.value
                } else {
                    this.stack.push({
                        name: newName,
                        type: 'reference',
                        objectId: existing.objectId
                    })
                }
            } else {
                // Copy primitive value
                if (target) {
                    target.type = 'primitive'
                    target.value = existing.value
                    delete target.objectId
                } else {
                    this.stack.push({
                        name: newName,
                        type: 'primitive',
                        value: existing.value
                    })
                }
            }
        }

        // Set reference to null
        setNull(name) {
            const existing = this.stack.find(v => v.name === name)
            if (existing) {
                existing.type = 'null'
                delete existing.objectId
                delete existing.value
            } else {
                this.stack.push({
                    name,
                    type: 'null'
                })
            }
        }

        // Update an object field
        updateField(varName, fieldName, value) {
            const stackVar = this.stack.find(v => v.name === varName)
            if (!stackVar || stackVar.type !== 'reference') return

            const obj = this.heap.find(o => o.id === stackVar.objectId)
            if (obj) {
                obj.fields[fieldName] = value
            }
        }

        // Get object by ID
        getObject(id) {
            return this.heap.find(o => o.id === id)
        }

        // Execute the current step
        executeCurrentStep() {
            if (this.currentStep >= this.steps.length) return false

            const step = this.steps[this.currentStep]
            step.execute(this)
            this.currentStep++
            return true
        }

        // Go to previous step by resetting and replaying
        previousStep() {
            if (this.currentStep <= 0) return

            this.currentStep--
            this.reset()

            for (let i = 0; i < this.currentStep; i++) {
                this.steps[i].execute(this)
            }
        }

        canStepForward() {
            return this.currentStep < this.steps.length
        }

        canStepBack() {
            return this.currentStep > 0
        }
    }

    // -------------------------------------------------------------------------
    // Code Parser
    // -------------------------------------------------------------------------

    function parseMemoryCode(code) {
        const lines = code.split('\n')
        const steps = []
        let currentStepLines = []
        let stepDescription = ''
        let stepStartLine = -1
        let stepCommentLine = -1

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]
            const trimmed = line.trim()

            // Check for step marker
            if (trimmed.startsWith('// Step:')) {
                // Save previous step if exists
                if (currentStepLines.length > 0) {
                    steps.push(createStep(stepDescription, currentStepLines, stepCommentLine, stepStartLine))
                }

                stepDescription = trimmed.substring(8).trim()
                stepCommentLine = i
                currentStepLines = []
                stepStartLine = -1
            } else if (trimmed && !trimmed.startsWith('//')) {
                // Non-comment, non-empty line
                if (stepStartLine === -1) stepStartLine = i
                currentStepLines.push(trimmed)
            }
        }

        // Save last step
        if (currentStepLines.length > 0) {
            steps.push(createStep(stepDescription, currentStepLines, stepCommentLine, stepStartLine))
        }

        return { steps, allLines: lines }
    }

    function createStep(description, codeLines, commentLineNum, startLineNum) {
        const code = codeLines.join('\n')
        const endLineNum = startLineNum + codeLines.length - 1

        return {
            description: description || 'Execute code',
            code,
            commentLineNum,
            startLineNum,
            endLineNum,
            execute: (memory) => {
                for (const line of codeLines) {
                    executeLine(line, memory)
                }
            }
        }
    }

    function executeLine(line, memory) {
        // val varName = value
        const valMatch = line.match(/^val\s+(\w+)\s*=\s*(.+)$/)
        if (valMatch) {
            const varName = valMatch[1]
            const valueExpr = valMatch[2].trim()

            // Check if it's an object instantiation
            const objectMatch = valueExpr.match(/^(\w+)\s*\((.*)\)$/)
            if (objectMatch) {
                const className = objectMatch[1]
                const argsStr = objectMatch[2]
                const fields = parseObjectArgs(className, argsStr)
                memory.addObject(varName, className, fields)
                return
            }

            // Check if it's null
            if (valueExpr === 'null') {
                memory.setNull(varName)
                return
            }

            // Check if it's a reference copy
            if (/^[a-zA-Z_]\w*$/.test(valueExpr)) {
                memory.copyReference(varName, valueExpr)
                return
            }

            // Otherwise it's a primitive
            const value = parseValue(valueExpr)
            memory.addPrimitive(varName, value)
            return
        }

        // varName.field = value
        const fieldUpdateMatch = line.match(/^(\w+)\.(\w+)\s*=\s*(.+)$/)
        if (fieldUpdateMatch) {
            const varName = fieldUpdateMatch[1]
            const fieldName = fieldUpdateMatch[2]
            const value = parseValue(fieldUpdateMatch[3])
            memory.updateField(varName, fieldName, value)
            return
        }

        // varName = value (reassignment)
        const assignMatch = line.match(/^(\w+)\s*=\s*(.+)$/)
        if (assignMatch) {
            const varName = assignMatch[1]
            const valueExpr = assignMatch[2].trim()

            if (valueExpr === 'null') {
                memory.setNull(varName)
                return
            }

            if (/^[a-zA-Z_]\w*$/.test(valueExpr)) {
                memory.copyReference(varName, valueExpr)
                return
            }

            const value = parseValue(valueExpr)
            memory.addPrimitive(varName, value)
        }
    }

    function parseObjectArgs(className, argsStr) {
        if (!argsStr.trim()) return {}

        const args = argsStr.split(',').map(s => s.trim())
        const fields = {}

        // Common class patterns - infer field names
        const patterns = {
            Person: ['name', 'age'],
            Student: ['name', 'id', 'grade'],
            Book: ['title', 'author', 'year'],
            Car: ['make', 'model', 'year'],
            Point: ['x', 'y'],
            Rectangle: ['x', 'y', 'width', 'height']
        }

        const fieldNames = patterns[className] || args.map((_, i) => `field${i}`)

        args.forEach((arg, i) => {
            const fieldName = fieldNames[i] || `field${i}`
            fields[fieldName] = parseValue(arg)
        })

        return fields
    }

    function parseValue(str) {
        str = str.trim()

        // String literal
        if (str.startsWith('"') && str.endsWith('"')) {
            return str.slice(1, -1)
        }

        // Number
        if (/^-?\d+(\.\d+)?$/.test(str)) {
            return parseFloat(str)
        }

        // Boolean
        if (str === 'true') return true
        if (str === 'false') return false

        // Default: treat as string
        return str
    }

    // -------------------------------------------------------------------------
    // UI Generation
    // -------------------------------------------------------------------------

    function escapeHtml(text) {
        const div = document.createElement('div')
        div.textContent = text
        return div.innerHTML
    }

    function updateUI(container, memory) {
        const variablesHtml = generateVariablesView(memory)
        const heapHtml = generateHeapView(memory)

        const memoryView = container.querySelector('.memory-view')
        memoryView.innerHTML = `
            <div class="memory-section variables-section">
                <h5>Variables</h5>
                <div class="variables-list">
                    ${variablesHtml}
                </div>
            </div>
            <div class="memory-section heap-section">
                <h5>Heap</h5>
                <div class="heap-list">
                    ${heapHtml}
                </div>
            </div>
        `

        // Update step display
        const stepInfo = container.querySelector('.step-info')
        if (memory.currentStep === 0) {
            stepInfo.textContent = 'Ready to execute'
        } else {
            const step = memory.steps[memory.currentStep - 1]
            stepInfo.textContent = step.description
        }

        // Update code highlighting
        updateCodeHighlight(container, memory)

        // Update button states
        const nextBtn = container.querySelector('.mem-btn-next')
        const resetBtn = container.querySelector('.mem-btn-reset')

        nextBtn.disabled = !memory.canStepForward()
        resetBtn.disabled = memory.currentStep === 0
    }

    function generateVariablesView(memory) {
        if (memory.stack.length === 0) {
            return '<div class="memory-empty">Empty</div>'
        }

        return memory.stack.map(variable => {
            let valueDisplay = ''

            if (variable.type === 'primitive') {
                valueDisplay = `<span class="value-primitive">${escapeHtml(String(variable.value))}</span>`
            } else if (variable.type === 'reference') {
                const obj = memory.getObject(variable.objectId)
                valueDisplay = `
                    <span class="value-reference" data-object-id="${variable.objectId}">
                        → #${variable.objectId} (${escapeHtml(obj.className)})
                    </span>
                `
            } else if (variable.type === 'null') {
                valueDisplay = `<span class="value-null">null</span>`
            }

            return `
                <div class="variable-item">
                    <span class="var-name">${escapeHtml(variable.name)}</span>
                    <span class="var-value">${valueDisplay}</span>
                </div>
            `
        }).join('')
    }

    function findReferencedObjectIds(memory) {
        // Find all object IDs that are referenced from the stack
        const referencedIds = new Set()

        for (const variable of memory.stack) {
            if (variable.type === 'reference' && variable.objectId !== undefined) {
                referencedIds.add(variable.objectId)
            }
        }

        // Future enhancement: Could also check for references in object fields
        // if we support objects referencing other objects

        return referencedIds
    }

    function generateHeapView(memory) {
        if (memory.heap.length === 0) {
            return '<div class="memory-empty">Empty</div>'
        }

        const referencedIds = findReferencedObjectIds(memory)

        return memory.heap.map(obj => {
            const fieldsHtml = Object.entries(obj.fields).map(([key, value]) => `
                <div class="object-field">
                    <span class="field-name">${escapeHtml(key)}</span>
                    <span class="field-value">${escapeHtml(String(value))}</span>
                </div>
            `).join('')

            // Count references to this object
            const refCount = memory.stack.filter(v =>
                v.type === 'reference' && v.objectId === obj.id
            ).length

            const isUnreferenced = !referencedIds.has(obj.id)
            const unreferencedClass = isUnreferenced ? ' unreferenced' : ''

            return `
                <div class="heap-object${unreferencedClass}" id="heap-object-${obj.id}" data-object-id="${obj.id}">
                    <div class="object-header">
                        <span class="object-id">#${obj.id}</span>
                        <span class="object-class">${escapeHtml(obj.className)}</span>
                        <span class="object-refs">${refCount} ref${refCount !== 1 ? 's' : ''}</span>
                    </div>
                    <div class="object-fields">
                        ${fieldsHtml}
                    </div>
                </div>
            `
        }).join('')
    }

    function updateCodeHighlight(container, memory) {
        const codeLines = container.querySelectorAll('.code-line')
        codeLines.forEach((line) => {
            line.classList.remove('executed', 'current')
        })

        if (memory.currentStep > 0) {
            const currentStep = memory.steps[memory.currentStep - 1]

            // Highlight comment line
            if (currentStep.commentLineNum >= 0) {
                const commentLine = codeLines[currentStep.commentLineNum]
                if (commentLine) commentLine.classList.add('current')
            }

            // Highlight code lines for current step
            for (let i = currentStep.startLineNum; i <= currentStep.endLineNum; i++) {
                const codeLine = codeLines[i]
                if (codeLine) codeLine.classList.add('current')
            }

            // Mark previous steps as executed
            for (let stepIdx = 0; stepIdx < memory.currentStep - 1; stepIdx++) {
                const step = memory.steps[stepIdx]
                if (step.commentLineNum >= 0) {
                    const commentLine = codeLines[step.commentLineNum]
                    if (commentLine) commentLine.classList.add('executed')
                }
                for (let i = step.startLineNum; i <= step.endLineNum; i++) {
                    const codeLine = codeLines[i]
                    if (codeLine) codeLine.classList.add('executed')
                }
            }
        }
    }

    function clearCodeHighlight(container) {
        const codeLines = container.querySelectorAll('.code-line')
        codeLines.forEach((line) => {
            // Remove current highlighting and add executed state (dimmed)
            line.classList.remove('current')
            line.classList.add('executed')
        })
    }

    function generateCodeView(allLines) {
        const linesHtml = allLines.map((line, idx) => {
            const highlightedLine = highlightKotlinSyntax(line)
            return `<div class="code-line" data-line="${idx}">${highlightedLine}</div>`
        }).join('')

        return `<pre class="code-listing"><code>${linesHtml}</code></pre>`
    }

    function highlightKotlinSyntax(line) {
        if (!line.trim()) return '&nbsp;'

        let result = ''
        let remaining = line

        // Preserve leading whitespace
        const leadingSpaceMatch = line.match(/^(\s*)/)
        if (leadingSpaceMatch && leadingSpaceMatch[1]) {
            result += leadingSpaceMatch[1]
            remaining = line.slice(leadingSpaceMatch[1].length)
        }

        // Check for full-line comment
        if (remaining.trim().startsWith('//')) {
            const commentMatch = remaining.match(/(\/\/.*)$/)
            if (commentMatch) {
                result += `<span class="hl-comment">${escapeHtml(commentMatch[1])}</span>`
                return result
            }
        }

        // Keywords
        const keywords = ['val', 'var', 'fun', 'class', 'object', 'interface', 'enum', 'data', 'sealed',
                         'return', 'if', 'else', 'when', 'for', 'while', 'do', 'break', 'continue',
                         'null', 'true', 'false', 'this', 'super', 'is', 'in', 'as', 'try', 'catch',
                         'finally', 'throw', 'import', 'package', 'public', 'private', 'protected',
                         'internal', 'abstract', 'final', 'open', 'override', 'companion']

        const keywordPattern = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g')

        // Process the line with multiple patterns
        const tokens = []
        let pos = 0

        // Tokenize: strings, comments, identifiers, numbers, keywords, classes, operators
        const patterns = [
            { regex: /\/\/.*$/, type: 'comment' },
            { regex: /"(?:[^"\\]|\\.)*"/, type: 'string' },
            { regex: new RegExp(`\\b(${keywords.join('|')})\\b`), type: 'keyword' },
            { regex: /\b[A-Z][a-zA-Z0-9]*\b/, type: 'class' },
            { regex: /\b[a-z_][a-zA-Z0-9_]*\b/, type: 'identifier' },
            { regex: /\b\d+\.?\d*\b/, type: 'number' },
            { regex: /[=+\-*/<>!&|]+/, type: 'operator' },
            { regex: /[(){}\[\],.:;]/, type: 'punctuation' }
        ]

        while (pos < remaining.length) {
            let matched = false

            for (const { regex, type } of patterns) {
                const tempRegex = new RegExp('^' + regex.source)
                const match = remaining.slice(pos).match(tempRegex)

                if (match) {
                    tokens.push({ text: match[0], type })
                    pos += match[0].length
                    matched = true
                    break
                }
            }

            if (!matched) {
                // Regular text
                tokens.push({ text: remaining[pos], type: 'text' })
                pos++
            }
        }

        // Build result from tokens
        for (const token of tokens) {
            const escaped = escapeHtml(token.text)

            switch (token.type) {
                case 'comment':
                    result += `<span class="hl-comment">${escaped}</span>`
                    break
                case 'string':
                    result += `<span class="hl-string">${escaped}</span>`
                    break
                case 'number':
                    result += `<span class="hl-number">${escaped}</span>`
                    break
                case 'keyword':
                    result += `<span class="hl-keyword">${escaped}</span>`
                    break
                case 'class':
                    result += `<span class="hl-class">${escaped}</span>`
                    break
                case 'identifier':
                    result += escaped  // No special highlighting for identifiers
                    break
                case 'operator':
                    result += `<span class="hl-operator">${escaped}</span>`
                    break
                case 'punctuation':
                    result += `<span class="hl-punctuation">${escaped}</span>`
                    break
                default:
                    result += escaped
            }
        }

        return result || '&nbsp;'
    }

    // -------------------------------------------------------------------------
    // Controls
    // -------------------------------------------------------------------------

    function setupControls(container, memory) {
        const nextBtn = container.querySelector('.mem-btn-next')
        const resetBtn = container.querySelector('.mem-btn-reset')

        nextBtn.addEventListener('click', () => {
            if (memory.executeCurrentStep()) {
                updateUI(container, memory)

                // Check if this was the last step
                if (!memory.canStepForward()) {
                    // Clear highlighting after 1 second
                    setTimeout(() => {
                        clearCodeHighlight(container)
                    }, 2000)
                }
            }
        })

        resetBtn.addEventListener('click', () => {
            memory.currentStep = 0
            memory.reset()
            updateUI(container, memory)
        })

        // Initial UI update
        updateUI(container, memory)
    }

    // -------------------------------------------------------------------------
    // Plugin Initialization
    // -------------------------------------------------------------------------

    function processMemorySims() {
        const simBlocks = document.querySelectorAll('pre[data-lang="memory-sim"]:not(.processed)')

        simBlocks.forEach(block => {
            block.classList.add('processed')

            const code = block.textContent
            const parseResult = parseMemoryCode(code)

            const memory = new MemoryState()
            memory.steps = parseResult.steps

            // Create container
            const container = document.createElement('div')
            container.className = 'memory-sim'

            container.innerHTML = `
                <div class="memory-sim-grid">
                    <div class="memory-sim-code memory-sim-panel">
                        <h4>Code</h4>
                        <div class="code-display">
                            ${generateCodeView(parseResult.allLines)}
                        </div>
                    </div>
                    <div class="memory-sim-memory memory-sim-panel">
                        <h4>Memory</h4>
                        <div class="memory-view">
                            <!-- Generated by updateUI -->
                        </div>
                    </div>
                    <div class="memory-sim-status">
                        <div class="step-info">Ready to execute</div>
                    </div>
                    <div class="memory-sim-controls">
                        <button class="mem-btn mem-btn-reset" disabled>
                            <span class="btn-icon">↺</span>
                            <span class="btn-text">Reset</span>
                        </button>
                        <button class="mem-btn mem-btn-next">
                            <span class="btn-icon">→</span>
                            <span class="btn-text">Next</span>
                        </button>
                    </div>
                </div>
            `

            block.parentNode.insertBefore(container, block)
            block.style.display = 'none'

            setupControls(container, memory)
        })
    }

    // -------------------------------------------------------------------------
    // Docsify Plugin
    // -------------------------------------------------------------------------

    const docsifyMemorySim = function (hook) {
        hook.doneEach(function () {
            processMemorySims()
        })
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyMemorySim, window.$docsify.plugins || [])

})()
