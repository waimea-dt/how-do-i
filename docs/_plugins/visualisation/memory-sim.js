/**
 * docsify-memory-sim.js — Interactive memory visualization for teaching OOP concepts
 *
 * Helps students understand:
 *   - Local variables vs Heap memory
 *   - Value types vs Reference types
 *   - Object instantiation and field storage
 *   - Reference copying and aliasing
 *   - Null references
 *   - Object composition (objects referencing other objects)
 *   - Nested field access through references
 *
 * Usage in markdown:
 *   ```memory-sim
 *   // Step: Create primitive
 *   val age = 25
 *
 *   // Step: Create object
 *   val person = Person("Alice", 25)
 *
 *   // Step: Create object with reference to another
 *   val player = Player(person, "wizard", 100)
 *
 *   // Step: Copy reference
 *   val person2 = person
 *
 *   // Step: Modify through reference
 *   person2.age = 26
 *
 *   // Step: Modify nested field
 *   player.person.age = 27
 *   ```
 *
 * Syntax:
 *   - Lines starting with "// Step:" mark execution steps
 *   - Supports: val declarations, object creation, field updates, null assignments
 *   - Object syntax: ClassName(field1, field2, ...)
 *   - Constructor args can be primitives or variable references
 *   - Field updates support nested paths: obj.field.subfield = value
 *   - Supports overloaded constructors (e.g., Rectangle(w, h) or Rectangle(x, y, w, h))
 */

;(function () {

    // -------------------------------------------------------------------------
    // Memory State Model
    // -------------------------------------------------------------------------

    class MemoryState extends SimCore.HeapState {
        constructor() {
            super()
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
                const fields = parseObjectArgs(className, argsStr, memory)
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

        // varName.field = value (supports nested: obj.field.subfield = value)
        const fieldUpdateMatch = line.match(/^(\w+(?:\.\w+)+)\s*=\s*(.+)$/)
        if (fieldUpdateMatch) {
            const fieldPath = fieldUpdateMatch[1]
            const value = parseValue(fieldUpdateMatch[2])
            memory.updateField(fieldPath, value)
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

    function parseObjectArgs(className, argsStr, memory) {
        if (!argsStr.trim()) return {}

        const args = argsStr.split(',').map(s => s.trim())
        const fields = {}

        // Common class patterns - infer field names based on argument count
        // Format: className: { argCount: [fieldNames] } or just [fieldNames] for single pattern
        const patterns = {
            Person: ['name', 'age'],

            Student: ['name', 'id', 'grade'],
            Teacher: ['name', 'code'],
            Class: ['code', 'subject', 'teacher'],

            Staff: ['person', 'role', 'salary'],
            Dept: ['name', 'head', 'assist'],

            Player: ['person', 'role', 'health'],
            Team: ['name', 'captain', 'size'],

            Book: ['title', 'author', 'year'],
            Car: ['make', 'model', 'year'],

            Point: ['x', 'y'],
            Rectangle: {
                3: ['point', 'width', 'height'],
                4: ['x', 'y', 'width', 'height']
            },
            Circle: {
                2: ['point', 'radius'],
                3: ['x', 'y', 'radius']
            },

            Location: ['name', 'north', 'east', 'south', 'west']
        }

        // Get field names based on class and arg count
        let fieldNames
        const pattern = patterns[className]
        if (pattern) {
            if (Array.isArray(pattern)) {
                // Single pattern for this class
                fieldNames = pattern
            } else {
                // Multiple patterns based on arg count
                fieldNames = pattern[args.length]
            }
        }

        // Fall back to generic field names if no pattern matched
        if (!fieldNames) {
            fieldNames = args.map((_, i) => `field${i}`)
        }

        args.forEach((arg, i) => {
            const fieldName = fieldNames[i] || `field${i}`

            // Check if arg is a variable reference
            if (/^[a-zA-Z_]\w*$/.test(arg) && memory) {
                const stackVar = memory.stack.find(v => v.name === arg)
                if (stackVar && stackVar.type === 'reference') {
                    // Store as reference to another object
                    fields[fieldName] = { $ref: stackVar.objectId }
                    return
                }
            }

            // Otherwise parse as primitive value
            fields[fieldName] = parseValue(arg)
        })

        // If pattern matched but not enough args provided, set remaining fields to null
        if (fieldNames && fieldNames.length > args.length) {
            for (let i = args.length; i < fieldNames.length; i++) {
                fields[fieldNames[i]] = null
            }
        }

        return fields
    }

    const parseValue = SimCore.parseValue

    // -------------------------------------------------------------------------
    // UI Generation
    // -------------------------------------------------------------------------

    const escapeHtml = SimCore.escapeHtml

    function updateUI(container, memory, changes = null) {
        const variablesHtml = generateVariablesView(memory, changes)
        const heapHtml = generateHeapView(memory, changes)

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

        SimCore.attachReferenceHandlers(container)

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

        SimCore.syncButtonStates(container, memory)
    }

    function generateVariablesView(memory, changes = null) {
        if (memory.stack.length === 0) {
            return '<div class="memory-empty">Empty</div>'
        }

        return memory.stack.map(variable => {
            let valueDisplay = ''
            const isChanged = changes && changes.stackVariables.has(variable.name)
            const flashClass = isChanged ? ' flash' : ''

            if (variable.type === 'primitive') {
                valueDisplay = `<span class="value-primitive">${escapeHtml(String(variable.value))}</span>`
            } else if (variable.type === 'reference') {
                const obj = memory.getObject(variable.objectId)
                valueDisplay = `
                    → <span class="value-reference" data-object-id="${variable.objectId}">
                        #${variable.objectId} (${escapeHtml(obj.className)})
                    </span>
                `
            } else if (variable.type === 'null') {
                valueDisplay = `<span class="value-null">null</span>`
            }

            return `
                <div class="variable-item${flashClass}">
                    <span class="var-name">${escapeHtml(variable.name)}</span>
                    <span class="var-value">${valueDisplay}</span>
                </div>
            `
        }).join('')
    }

    function generateHeapView(memory, changes = null) {
        if (memory.heap.length === 0) {
            return SimCore.renderEmpty()
        }
        const referencedIds = SimCore.findReferencedObjectIds(memory)
        return memory.heap.map(obj =>
            SimCore.renderHeapObject(obj, memory, changes, referencedIds)
        ).join('')
    }

    function updateCodeHighlight(container, memory) {
        SimCore.updateCodeHighlight(container, memory.steps, memory.currentStep)
    }

    const generateCodeView = SimCore.generateCodeView

    // -------------------------------------------------------------------------
    // Controls
    // -------------------------------------------------------------------------

    function setupControls(container, memory) {
        SimCore.setupControls(container, memory, updateUI)
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
            container.className = 'memory-sim sim-block'

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
                    <div class="memory-sim-controls sim-controls">
                        ${SimCore.renderControls()}
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
