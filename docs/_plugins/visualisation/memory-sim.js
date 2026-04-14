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

        // Update an object field (supports nested: obj.field.subfield = value)
        updateField(path, value) {
            const parts = path.split('.')
            if (parts.length < 2) return

            const varName = parts[0]
            const stackVar = this.stack.find(v => v.name === varName)
            if (!stackVar || stackVar.type !== 'reference') return

            let currentObj = this.heap.find(o => o.id === stackVar.objectId)
            if (!currentObj) return

            // Navigate through nested references
            for (let i = 1; i < parts.length - 1; i++) {
                const fieldName = parts[i]
                const fieldValue = currentObj.fields[fieldName]

                // If field is a reference, follow it
                if (fieldValue && typeof fieldValue === 'object' && fieldValue.$ref) {
                    currentObj = this.heap.find(o => o.id === fieldValue.$ref)
                    if (!currentObj) return
                } else {
                    // Can't navigate further
                    return
                }
            }

            // Update the final field
            const finalField = parts[parts.length - 1]
            currentObj.fields[finalField] = value
        }

        // Get object by ID
        getObject(id) {
            return this.heap.find(o => o.id === id)
        }

        // Snapshot current state for change detection
        snapshot() {
            return {
                stack: this.stack.map(v => ({ ...v })),
                heap: this.heap.map(o => ({
                    id: o.id,
                    className: o.className,
                    fields: { ...o.fields }
                }))
            }
        }

        // Find what changed between snapshots
        getChanges(previousSnapshot) {
            const changes = {
                stackVariables: new Set(),
                objectFields: new Map(), // objectId -> Set of field names
                flashedObjects: new Set() // objectIds to flash (when referenced)
            }

            if (!previousSnapshot) return changes

            // Check stack variables for changes
            for (const currentVar of this.stack) {
                const prevVar = previousSnapshot.stack.find(v => v.name === currentVar.name)
                if (!prevVar) {
                    // New variable
                    changes.stackVariables.add(currentVar.name)
                    // If it's a reference, flash the object too
                    if (currentVar.type === 'reference') {
                        changes.flashedObjects.add(currentVar.objectId)
                    }
                } else if (currentVar.type !== prevVar.type ||
                          currentVar.value !== prevVar.value ||
                          currentVar.objectId !== prevVar.objectId) {
                    // Modified variable
                    changes.stackVariables.add(currentVar.name)
                    // If it's a reference, flash the object too
                    if (currentVar.type === 'reference') {
                        changes.flashedObjects.add(currentVar.objectId)
                    }
                }
            }

            // Check object fields for changes
            for (const currentObj of this.heap) {
                const prevObj = previousSnapshot.heap.find(o => o.id === currentObj.id)
                if (!prevObj) {
                    // New object - mark all fields as changed
                    const fieldSet = new Set(Object.keys(currentObj.fields))
                    changes.objectFields.set(currentObj.id, fieldSet)
                    // Flash the new object itself
                    changes.flashedObjects.add(currentObj.id)

                    // Also flash any objects referenced by this new object's fields
                    for (const [fieldName, fieldValue] of Object.entries(currentObj.fields)) {
                        if (fieldValue && typeof fieldValue === 'object' && fieldValue.$ref) {
                            changes.flashedObjects.add(fieldValue.$ref)
                        }
                    }
                } else {
                    // Check each field for changes
                    const changedFields = new Set()
                    for (const [fieldName, fieldValue] of Object.entries(currentObj.fields)) {
                        const prevValue = prevObj.fields[fieldName]
                        // Deep compare for reference objects
                        if (JSON.stringify(fieldValue) !== JSON.stringify(prevValue)) {
                            changedFields.add(fieldName)
                            // If the changed field is a reference, flash the referenced object
                            if (fieldValue && typeof fieldValue === 'object' && fieldValue.$ref) {
                                changes.flashedObjects.add(fieldValue.$ref)
                            }
                        }
                    }
                    if (changedFields.size > 0) {
                        changes.objectFields.set(currentObj.id, changedFields)
                    }
                }
            }

            return changes
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

        // Add click handlers to reference elements to highlight referenced objects
        const references = memoryView.querySelectorAll('.value-reference, .field-ref')
        references.forEach(refElement => {
            refElement.addEventListener('click', () => {
                const objectId = refElement.dataset.objectId || refElement.dataset.refId
                const heapObject = container.querySelector(`#heap-object-${objectId}`)

                if (heapObject) {
                    // Add flash animation
                    heapObject.classList.add('flash-object')

                    // Scroll into view
                    heapObject.scrollIntoView({ behavior: 'smooth', block: 'nearest' })

                    // Remove flash class after animation completes
                    setTimeout(() => {
                        heapObject.classList.remove('flash-object')
                    }, 1000)
                }
            })
        })

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

    function findReferencedObjectIds(memory) {
        // Find all object IDs that are referenced from the stack
        const referencedIds = new Set()

        for (const variable of memory.stack) {
            if (variable.type === 'reference' && variable.objectId !== undefined) {
                referencedIds.add(variable.objectId)
            }
        }

        // Check for references in object fields
        for (const obj of memory.heap) {
            for (const [key, value] of Object.entries(obj.fields)) {
                if (value && typeof value === 'object' && value.$ref) {
                    referencedIds.add(value.$ref)
                }
            }
        }

        return referencedIds
    }

    function generateHeapView(memory, changes = null) {
        if (memory.heap.length === 0) {
            return '<div class="memory-empty">Empty</div>'
        }

        const referencedIds = findReferencedObjectIds(memory)

        return memory.heap.map(obj => {
            const changedFields = changes && changes.objectFields.get(obj.id)

            const fieldsHtml = Object.entries(obj.fields).map(([key, value]) => {
                let valueHtml
                const isFieldChanged = changedFields && changedFields.has(key)
                const flashClass = isFieldChanged ? ' flash' : ''

                // Check if value is a reference to another object
                if (value && typeof value === 'object' && value.$ref) {
                    const refObj = memory.getObject(value.$ref)
                    const refClass = refObj ? refObj.className : 'Object'
                    valueHtml = `→ <span class="field-value field-ref" data-ref-id="${value.$ref}">#${value.$ref} (${escapeHtml(refClass)})</span>`
                } else if (value === null) {
                    valueHtml = `<span class="field-value value-null">null</span>`
                } else {
                    valueHtml = `<span class="field-value">${escapeHtml(String(value))}</span>`
                }

                return `
                    <div class="object-field${flashClass}">
                        <span class="field-name">${escapeHtml(key)}</span>
                        ${valueHtml}
                    </div>
                `
            }).join('')

            // Count references to this object (from stack variables and object fields)
            let refCount = memory.stack.filter(v =>
                v.type === 'reference' && v.objectId === obj.id
            ).length

            // Also count references from object fields
            for (const heapObj of memory.heap) {
                for (const [key, value] of Object.entries(heapObj.fields)) {
                    if (value && typeof value === 'object' && value.$ref === obj.id) {
                        refCount++
                    }
                }
            }

            const isUnreferenced = !referencedIds.has(obj.id)
            const unreferencedClass = isUnreferenced ? ' unreferenced' : ''
            const isObjectFlashed = changes && changes.flashedObjects.has(obj.id)
            const objectFlashClass = isObjectFlashed ? ' flash-object' : ''

            return `
                <div class="heap-object${unreferencedClass}${objectFlashClass}" id="heap-object-${obj.id}" data-object-id="${obj.id}" ${isUnreferenced ? 'data-tooltip="This object is unreferenced. It will be cleaned up by the garbage collector"' : ''}>
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
            // Take snapshot before executing
            const previousSnapshot = memory.snapshot()

            if (memory.executeCurrentStep()) {
                const changes = memory.getChanges(previousSnapshot)
                updateUI(container, memory, changes)

                // Remove flash classes after animation
                setTimeout(() => {
                    container.querySelectorAll('.flash').forEach(el => {
                        el.classList.remove('flash')
                    })
                    container.querySelectorAll('.flash-object').forEach(el => {
                        el.classList.remove('flash-object')
                    })
                }, 1000)

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
