/**
 * sim-core.js - Shared core library for educational simulator plugins
 *
 * Provides reusable utilities for memory/OOP/algorithm simulators:
 *   - Value parsing and formatting
 *   - HTML rendering helpers
 *   - Change detection (snapshot/diff pattern)
 *   - Flash animation management
 *   - Syntax highlighting (Kotlin/pseudocode)
 *   - Code view generation
 *   - Reference click handlers
 *   - Control button setup
 *
 * Usage:
 *   Depend on this file loading before your sim plugin.
 *   Access via window.SimCore.
 *
 * Consumers:
 *   - memory-sim.js
 *   - oop-sim.js (planned)
 */

;(function () {

    // -------------------------------------------------------------------------
    // Value Parsing
    // -------------------------------------------------------------------------

    /**
     * Parse a string token into a JS primitive value.
     * Handles: string literals, numbers, booleans. Falls back to raw string.
     */
    function parseValue(str) {
        str = str.trim()
        if (str.startsWith('"') && str.endsWith('"')) return str.slice(1, -1)
        if (/^-?\d+(\.\d+)?$/.test(str)) return parseFloat(str)
        if (str === 'true') return true
        if (str === 'false') return false
        return str
    }

    // -------------------------------------------------------------------------
    // HTML Utilities
    // -------------------------------------------------------------------------

    function escapeHtml(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
    }

    /**
     * Render a typed value as HTML with appropriate class.
     * Handles: $ref objects, null, primitives.
     * @param {*} value
     * @param {Function} [getObjectFn] - (id) => object, for resolving ref class names
     * @returns {string} HTML string
     */
    function renderValue(value, getObjectFn) {
        if (value === null || value === undefined) {
            return `<span class="value-null">null</span>`
        }
        if (typeof value === 'object' && value.$ref != null) {
            const refObj = getObjectFn ? getObjectFn(value.$ref) : null
            const refClass = refObj ? refObj.className : 'Object'
            return `→ <span class="sim-ref field-ref" data-ref-id="${value.$ref}">#${value.$ref} (${escapeHtml(refClass)})</span>`
        }
        if (typeof value === 'boolean' || typeof value === 'number') {
            return `<span class="value-primitive">${escapeHtml(String(value))}</span>`
        }
        return `<span class="value-primitive">${escapeHtml(String(value))}</span>`
    }

    /**
     * Render a stack variable row.
     * @param {{name:string, type:string, value?:*, objectId?:number}} variable
     * @param {boolean} isChanged
     * @param {Function} [getObjectFn]
     * @returns {string} HTML string
     */
    function renderVariable(variable, isChanged, getObjectFn) {
        const flashClass = isChanged ? ' flash' : ''
        let valueDisplay = ''

        if (variable.type === 'primitive') {
            valueDisplay = `<span class="value-primitive">${escapeHtml(String(variable.value))}</span>`
        } else if (variable.type === 'reference') {
            const obj = getObjectFn ? getObjectFn(variable.objectId) : null
            const className = obj ? obj.className : 'Object'
            valueDisplay = `→ <span class="sim-ref value-reference" data-object-id="${variable.objectId}">#${variable.objectId} (${escapeHtml(className)})</span>`
        } else {
            valueDisplay = `<span class="value-null">null</span>`
        }

        return `
            <div class="variable-item${flashClass}">
                <span class="var-name">${escapeHtml(variable.name)}</span>
                <span class="var-value">${valueDisplay}</span>
            </div>
        `
    }

    /**
     * Render an object-field row.
     * @param {string} key
     * @param {*} value
     * @param {boolean} isChanged
     * @param {Function} [getObjectFn]
     * @returns {string} HTML string
     */
    function renderField(key, value, isChanged, getObjectFn) {
        const flashClass = isChanged ? ' flash' : ''
        let valueHtml

        if (value === null || value === undefined) {
            valueHtml = `<span class="field-value value-null">null</span>`
        } else if (typeof value === 'object' && value.$ref != null) {
            const refObj = getObjectFn ? getObjectFn(value.$ref) : null
            const refClass = refObj ? refObj.className : 'Object'
            valueHtml = `→ <span class="field-value field-ref sim-ref" data-ref-id="${value.$ref}">#${value.$ref} (${escapeHtml(refClass)})</span>`
        } else {
            valueHtml = `<span class="field-value">${escapeHtml(String(value))}</span>`
        }

        return `
            <div class="object-field${flashClass}">
                <span class="field-name">${escapeHtml(key)}</span>
                ${valueHtml}
            </div>
        `
    }

    /**
     * Render a sim "empty" placeholder.
     * @param {string} [text]
     * @returns {string} HTML string
     */
    function renderEmpty(text = 'Empty') {
        return `<div class="sim-empty">${escapeHtml(text)}</div>`
    }

    // -------------------------------------------------------------------------
    // Heap Rendering
    // -------------------------------------------------------------------------

    /**
     * Return a Set of all object IDs reachable from stack variables or object fields.
     * @param {{stack: Array, heap: Array}} state
     * @returns {Set<number>}
     */
    function findReferencedObjectIds(state) {
        const referencedIds = new Set()
        for (const variable of state.stack) {
            if (variable.type === 'reference' && variable.objectId !== undefined) {
                referencedIds.add(variable.objectId)
            }
        }
        for (const obj of state.heap) {
            for (const value of Object.values(obj.fields)) {
                if (value && typeof value === 'object' && value.$ref) {
                    referencedIds.add(value.$ref)
                }
            }
        }
        return referencedIds
    }

    /**
     * Render a single heap object card as HTML.
     * @param {object} obj - {id, className, fields}
     * @param {{stack: Array, heap: Array, getObject: Function}} state
     * @param {object|null} changes - from getChanges()
     * @param {Set<number>} referencedIds - from findReferencedObjectIds()
     * @returns {string} HTML string
     */
    function renderHeapObject(obj, state, changes, referencedIds) {
        const changedFields = changes && changes.objectFields.get(obj.id)

        const fieldsHtml = Object.entries(obj.fields).map(([key, value]) => {
            let valueHtml
            const isFieldChanged = changedFields && changedFields.has(key)
            const flashClass = isFieldChanged ? ' flash' : ''

            if (value && typeof value === 'object' && value.$ref) {
                const refObj = state.getObject(value.$ref)
                const refClass = refObj ? refObj.className : 'Object'
                valueHtml = `→ <span class="field-value sim-ref field-ref" data-ref-id="${value.$ref}">#${value.$ref} (${escapeHtml(refClass)})</span>`
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

        let refCount = state.stack.filter(v =>
            v.type === 'reference' && v.objectId === obj.id
        ).length
        for (const heapObj of state.heap) {
            for (const value of Object.values(heapObj.fields)) {
                if (value && typeof value === 'object' && value.$ref === obj.id) refCount++
            }
        }

        const isUnreferenced = !referencedIds.has(obj.id)
        const unreferencedClass = isUnreferenced ? ' unreferenced' : ''
        const isObjectFlashed = changes && changes.flashedObjects.has(obj.id)
        const objectFlashClass = isObjectFlashed ? ' flash-object' : ''

        return `
            <div class="heap-object${unreferencedClass}${objectFlashClass}" id="heap-object-${obj.id}" data-object-id="${obj.id}"${isUnreferenced ? ' data-tooltip="This object is unreferenced. It will be cleaned up by the garbage collector"' : ''}>
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
    }

    // -------------------------------------------------------------------------
    // Heap State
    // -------------------------------------------------------------------------

    /**
     * Base class for simulators that operate on a stack + heap memory model.
     * Provides all stack/heap mutations and step execution management.
     * Extend this in each sim plugin and add sim-specific parsing in the subclass.
     */
    class HeapState {
        constructor() {
            this.stack = []
            this.heap = []
            this.nextObjectId = 1
            this.currentStep = 0
            this.steps = []
            this.classes = []
            this.pendingHighlight = null
        }

        reset() {
            this.stack = []
            this.heap = []
            this.nextObjectId = 1
            this.currentStep = 0
            this.classes = []
            this.pendingHighlight = null
        }

        addPrimitive(name, value) {
            const existing = this.stack.find(v => v.name === name)
            if (existing) {
                existing.value = value
                existing.type = 'primitive'
            } else {
                this.stack.push({ name, value, type: 'primitive' })
            }
        }

        addObject(name, className, fields) {
            const objectId = this.nextObjectId++
            this.heap.push({ id: objectId, className, fields: { ...fields } })
            const existing = this.stack.find(v => v.name === name)
            if (existing) {
                existing.type = 'reference'
                existing.objectId = objectId
            } else {
                this.stack.push({ name, type: 'reference', objectId })
            }
        }

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
                    this.stack.push({ name: newName, type: 'reference', objectId: existing.objectId })
                }
            } else {
                if (target) {
                    target.type = 'primitive'
                    target.value = existing.value
                    delete target.objectId
                } else {
                    this.stack.push({ name: newName, type: 'primitive', value: existing.value })
                }
            }
        }

        setNull(name) {
            const existing = this.stack.find(v => v.name === name)
            if (existing) {
                existing.type = 'null'
                delete existing.objectId
                delete existing.value
            } else {
                this.stack.push({ name, type: 'null' })
            }
        }

        updateField(path, value) {
            const parts = path.split('.')
            if (parts.length < 2) return
            const stackVar = this.stack.find(v => v.name === parts[0])
            if (!stackVar || stackVar.type !== 'reference') return
            let currentObj = this.heap.find(o => o.id === stackVar.objectId)
            if (!currentObj) return
            for (let i = 1; i < parts.length - 1; i++) {
                const fieldValue = currentObj.fields[parts[i]]
                if (fieldValue && typeof fieldValue === 'object' && fieldValue.$ref) {
                    currentObj = this.heap.find(o => o.id === fieldValue.$ref)
                    if (!currentObj) return
                } else {
                    return
                }
            }
            currentObj.fields[parts[parts.length - 1]] = value
        }

        getObject(id) {
            return this.heap.find(o => o.id === id)
        }

        defineClass(classDef) {
            if (!this.classes.find(c => c.className === classDef.className)) {
                this.classes.push(classDef)
            }
        }

        callMethod(varName, methodName) {
            const stackVar = this.stack.find(v => v.name === varName)
            if (!stackVar || stackVar.type !== 'reference') return
            const obj = this.getObject(stackVar.objectId)
            if (!obj) return
            this.pendingHighlight = { className: obj.className, methodName, objectId: stackVar.objectId }
        }

        highlightConstructor(className) {
            const classDef = this.classes.find(c => c.className === className)
            if (!classDef) return
            this.pendingHighlight = { className, methodName: classDef.constructorLabel }
        }

        snapshot() {
            return snapshot(this)
        }

        getChanges(prev) {
            return getChanges(this, prev)
        }

        executeCurrentStep() {
            if (this.currentStep >= this.steps.length) return false
            this.steps[this.currentStep].execute(this)
            this.currentStep++
            return true
        }

        canStepForward() {
            return this.currentStep < this.steps.length
        }

        canStepBack() {
            return this.currentStep > 0
        }
    }

    // -------------------------------------------------------------------------
    // Change Detection
    // -------------------------------------------------------------------------

    /**
     * Snapshot stack + heap for later diffing.
     * @param {{stack: Array, heap: Array}} state
     * @returns {object} snapshot
     */
    function snapshot(state) {
        return {
            stack: state.stack.map(v => ({ ...v })),
            heap: state.heap.map(o => ({
                id: o.id,
                className: o.className,
                fields: { ...o.fields }
            }))
        }
    }

    /**
     * Diff two snapshots, returning sets of changed names/ids.
     * @param {{stack:Array, heap:Array}} current
     * @param {{stack:Array, heap:Array}} prev
     * @returns {{stackVariables: Set, objectFields: Map, flashedObjects: Set}}
     */
    function getChanges(current, prev) {
        const changes = {
            stackVariables: new Set(),
            objectFields: new Map(),    // objectId -> Set<fieldName>
            flashedObjects: new Set()   // objectIds to animate
        }

        if (!prev) return changes

        // Stack variables
        for (const cur of current.stack) {
            const old = prev.stack.find(v => v.name === cur.name)
            const changed = !old ||
                cur.type !== old.type ||
                cur.value !== old.value ||
                cur.objectId !== old.objectId

            if (changed) {
                changes.stackVariables.add(cur.name)
                if (cur.type === 'reference') {
                    changes.flashedObjects.add(cur.objectId)
                }
            }
        }

        // Heap objects
        for (const cur of current.heap) {
            const old = prev.heap.find(o => o.id === cur.id)
            if (!old) {
                // New object
                changes.flashedObjects.add(cur.id)
                const fieldSet = new Set(Object.keys(cur.fields))
                changes.objectFields.set(cur.id, fieldSet)
                // Also flash anything this new object references
                for (const v of Object.values(cur.fields)) {
                    if (v && typeof v === 'object' && v.$ref != null) {
                        changes.flashedObjects.add(v.$ref)
                    }
                }
            } else {
                const changedFields = new Set()
                for (const [k, v] of Object.entries(cur.fields)) {
                    if (JSON.stringify(v) !== JSON.stringify(old.fields[k])) {
                        changedFields.add(k)
                        if (v && typeof v === 'object' && v.$ref != null) {
                            changes.flashedObjects.add(v.$ref)
                        }
                    }
                }
                if (changedFields.size > 0) {
                    changes.objectFields.set(cur.id, changedFields)
                }
            }
        }

        return changes
    }

    // -------------------------------------------------------------------------
    // Flash Animation
    // -------------------------------------------------------------------------

    const FLASH_DURATION_MS = 1000

    /**
     * Remove all flash classes from a container after FLASH_DURATION_MS.
     * @param {Element} container
     * @param {string[]} [extraSelectors] - additional selectors beyond default set
     */
    function scheduleFlashCleanup(container, extraSelectors = []) {
        clearTimeout(container._simFlashTimer)
        const selectors = ['.flash', '.flash-object', ...extraSelectors]
        container._simFlashTimer = setTimeout(() => {
            container._simFlashTimer = null
            for (const sel of selectors) {
                container.querySelectorAll(sel).forEach(el => el.classList.remove(sel.slice(1)))
            }
        }, FLASH_DURATION_MS)
    }

    function cancelFlashCleanup(container) {
        clearTimeout(container._simFlashTimer)
        container._simFlashTimer = null
    }

    // -------------------------------------------------------------------------
    // Reference Click Handlers
    // -------------------------------------------------------------------------

    /**
     * Attach click-to-highlight handlers on all .sim-ref elements in a container.
     * Clicking a reference flashes the target heap-object and scrolls it into view.
     * @param {Element} container
     */
    function attachReferenceHandlers(container) {
        container.querySelectorAll('.sim-ref').forEach(el => {
            el.addEventListener('click', () => {
                const objectId = el.dataset.objectId || el.dataset.refId
                const target = container.querySelector(`#heap-object-${objectId}`)
                if (!target) return
                target.classList.add('flash-object')
                target.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                setTimeout(() => target.classList.remove('flash-object'), FLASH_DURATION_MS)
            })
        })
    }

    // -------------------------------------------------------------------------
    // Syntax Highlighting
    // -------------------------------------------------------------------------

    const KOTLIN_KEYWORDS = [
        'val', 'var', 'fun', 'class', 'object', 'interface', 'enum', 'data', 'sealed',
        'return', 'if', 'else', 'when', 'for', 'while', 'do', 'break', 'continue',
        'null', 'true', 'false', 'this', 'super', 'is', 'in', 'as', 'try', 'catch',
        'finally', 'throw', 'import', 'package', 'public', 'private', 'protected',
        'internal', 'abstract', 'final', 'open', 'override', 'companion', 'constructor',
        'init', 'by', 'get', 'set', 'field', 'property', 'lateinit', 'lazy'
    ]

    const PYTHON_KEYWORDS = [
        'def', 'class', 'import', 'from', 'return', 'if', 'elif', 'else',
        'for', 'while', 'break', 'continue', 'pass', 'True', 'False', 'None',
        'and', 'or', 'not', 'in', 'is', 'lambda', 'try', 'except', 'finally',
        'raise', 'with', 'as', 'yield', 'global', 'nonlocal', 'del', 'assert',
        'self', 'cls'
    ]

    const KOTLIN_TOKEN_PATTERNS = [
        { regex: /\/\/.*$/, type: 'comment' },
        { regex: /"(?:[^"\\]|\\.)*"/, type: 'string' },
        { regex: new RegExp(`\\b(${KOTLIN_KEYWORDS.join('|')})\\b`), type: 'keyword' },
        { regex: /\b[A-Z][a-zA-Z0-9]*\b/, type: 'class' },
        { regex: /\b[a-z_][a-zA-Z0-9_]*\b/, type: 'identifier' },
        { regex: /\b\d+\.?\d*\b/, type: 'number' },
        { regex: /[=+\-*/<>!&|]+/, type: 'operator' },
        { regex: /[(){}\[\],.:;]/, type: 'punctuation' }
    ]

    const PYTHON_TOKEN_PATTERNS = [
        { regex: /#.*$/, type: 'comment' },
        { regex: /(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/, type: 'string' },
        { regex: /@\w+/, type: 'class' },
        { regex: new RegExp(`\\b(${PYTHON_KEYWORDS.join('|')})\\b`), type: 'keyword' },
        { regex: /\b[A-Z][a-zA-Z0-9]*\b/, type: 'class' },
        { regex: /\b[a-z_][a-zA-Z0-9_]*\b/, type: 'identifier' },
        { regex: /\b\d+\.?\d*\b/, type: 'number' },
        { regex: /[=+\-*/<>!&|]+/, type: 'operator' },
        { regex: /[(){}\[\],.:;]/, type: 'punctuation' }
    ]

    function getTokenPatterns(lang) {
        return lang === 'python' ? PYTHON_TOKEN_PATTERNS : KOTLIN_TOKEN_PATTERNS
    }

    /**
     * Apply syntax highlighting to a single line of code.
     * @param {string} line
     * @param {'kotlin'|'python'} [lang='kotlin']
     * @returns {string} HTML string
     */
    function highlightSyntax(line, lang = 'kotlin') {
        if (!line.trim()) return '&nbsp;'

        const patterns = getTokenPatterns(lang)
        const commentPrefix = lang === 'python' ? '#' : '//'

        let result = ''
        let remaining = line

        // Preserve leading whitespace
        const leadingSpace = line.match(/^(\s*)/)
        if (leadingSpace && leadingSpace[1]) {
            result += leadingSpace[1]
            remaining = line.slice(leadingSpace[1].length)
        }

        // Full-line comment shortcut
        if (remaining.trim().startsWith(commentPrefix)) {
            const escapedPrefix = commentPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            const m = remaining.match(new RegExp(`(${escapedPrefix}.*)$`))
            if (m) return result + `<span class="hl-comment">${escapeHtml(m[1])}</span>`
        }

        // Tokenize
        const tokens = []
        let pos = 0
        while (pos < remaining.length) {
            let matched = false
            for (const { regex, type } of patterns) {
                const m = remaining.slice(pos).match(new RegExp('^' + regex.source))
                if (m) {
                    tokens.push({ text: m[0], type })
                    pos += m[0].length
                    matched = true
                    break
                }
            }
            if (!matched) {
                tokens.push({ text: remaining[pos], type: 'text' })
                pos++
            }
        }

        // Build HTML from tokens
        for (const { text, type } of tokens) {
            const esc = escapeHtml(text)
            switch (type) {
                case 'comment':     result += `<span class="hl-comment">${esc}</span>`; break
                case 'string':      result += `<span class="hl-string">${esc}</span>`; break
                case 'number':      result += `<span class="hl-number">${esc}</span>`; break
                case 'keyword':     result += `<span class="hl-keyword">${esc}</span>`; break
                case 'class':       result += `<span class="hl-class">${esc}</span>`; break
                case 'operator':    result += `<span class="hl-operator">${esc}</span>`; break
                case 'punctuation': result += `<span class="hl-punctuation">${esc}</span>`; break
                default:            result += esc
            }
        }

        return result || '&nbsp;'
    }

    // -------------------------------------------------------------------------
    // Code View
    // -------------------------------------------------------------------------

    /**
     * Generate a <pre><code> listing with per-line divs for highlighting.
     * @param {string[]} allLines - raw source lines
     * @returns {string} HTML string
     */
    function generateCodeView(allLines, lang = 'kotlin') {
        const linesHtml = allLines.map((line, idx) =>
            `<div class="code-line" data-line="${idx}">${highlightSyntax(line, lang)}</div>`
        ).join('')
        return `
            <h4>Code</h4>
            <div class="code-display">
                <pre class="code-listing"><code>${linesHtml}</code></pre>
            </div>`
    }

    /**
     * Apply current/executed highlight classes to code lines based on step state.
     * @param {Element} container
     * @param {Array} steps - parsed steps with commentLineNum/startLineNum/endLineNum
     * @param {number} currentStep - 1-based index (0 = not started)
     */
    function updateCodeHighlight(container, steps, currentStep) {
        const codeLines = container.querySelectorAll('.code-line')
        codeLines.forEach(l => l.classList.remove('executed', 'current'))

        if (currentStep === 0) return

        const step = steps[currentStep - 1]

        if (step.commentLineNum >= 0) {
            codeLines[step.commentLineNum]?.classList.add('current')
        }
        for (let i = step.startLineNum; i <= step.endLineNum; i++) {
            codeLines[i]?.classList.add('current')
        }

        for (let s = 0; s < currentStep - 1; s++) {
            const prev = steps[s]
            if (prev.commentLineNum >= 0) codeLines[prev.commentLineNum]?.classList.add('executed')
            for (let i = prev.startLineNum; i <= prev.endLineNum; i++) {
                codeLines[i]?.classList.add('executed')
            }
        }
    }

    /**
     * Mark all code lines as executed (dim them, end-of-sim state).
     * @param {Element} container
     */
    function clearCodeHighlight(container) {
        container.querySelectorAll('.code-line').forEach(l => {
            l.classList.remove('current')
            l.classList.add('executed')
        })
    }

    // -------------------------------------------------------------------------
    // Controls
    // -------------------------------------------------------------------------

    /**
     * Build control buttons HTML.
     * Uses .sim-btn, .sim-btn-reset, .sim-btn-next class names.
     * @returns {string} HTML string
     */
    function renderControls() {
        return `
            <button class="sim-btn sim-btn-reset" disabled>
                <span class="btn-icon">↺</span>
                <span class="btn-text">Reset</span>
            </button>
            <button class="sim-btn sim-btn-next">
                <span class="btn-icon">→</span>
                <span class="btn-text">Next</span>
            </button>
        `
    }

    /**
     * Wire up Next/Reset buttons with snapshot/diff/animate cycle.
     * @param {Element} container - sim root element
     * @param {object} state - object with: snapshot(), executeCurrentStep(), reset(),
     *                         canStepForward(), canStepBack(), currentStep, steps
     * @param {Function} updateUI - (container, state, changes) => void
     * @param {Function} [onReset] - optional extra reset callback
     */
    function setupControls(container, state, updateUI, onReset) {
        const nextBtn = container.querySelector('.sim-btn-next')
        const resetBtn = container.querySelector('.sim-btn-reset')

        nextBtn.addEventListener('click', () => {
            const prev = snapshot(state)

            if (state.executeCurrentStep()) {
                const changes = getChanges(state, prev)
                updateUI(container, state, changes)
                scheduleFlashCleanup(container)

                if (!state.canStepForward()) {
                    setTimeout(() => clearCodeHighlight(container), 2000)
                }
            }
        })

        resetBtn.addEventListener('click', () => {
            state.reset()
            if (onReset) onReset()
            updateUI(container, state, null)
        })
    }

    /**
     * Sync disabled state on Next/Reset buttons.
     * Call this at the end of every updateUI.
     * @param {Element} container
     * @param {object} state
     */
    function syncButtonStates(container, state) {
        const nextBtn = container.querySelector('.sim-btn-next')
        const resetBtn = container.querySelector('.sim-btn-reset')
        if (nextBtn) nextBtn.disabled = !state.canStepForward()
        if (resetBtn) resetBtn.disabled = !state.canStepBack()
    }

    // -------------------------------------------------------------------------
    // Step Parser (shared step-comment format)
    // -------------------------------------------------------------------------

    /**
     * Parse source code into steps delimited by "// Step:" comments.
     * Each step has: description, code, commentLineNum, startLineNum, endLineNum, execute(state)
     * @param {string} code - raw source text
     * @param {Function} executeLineFn - (line: string, state: any) => void
     * @returns {{steps: Array, allLines: string[]}}
     */
    // -------------------------------------------------------------------------
    // Language Detection
    // -------------------------------------------------------------------------

    function detectLang(code) {
        if (/\bdef\s+\w+/.test(code) || /^class\s+\w+\s*:/m.test(code) || /^#\s*Step:/m.test(code) || /^#\s*ClassDefs/m.test(code)) return 'python'
        return 'kotlin'
    }

    // -------------------------------------------------------------------------
    // Class Definition Parsing
    // -------------------------------------------------------------------------

    function parseClassDef(block, lang) {
        return lang === 'python' ? parsePythonClass(block) : parseKotlinClass(block)
    }

    function parseKotlinClass(block) {
        const headerMatch = block.match(/^class\s+(\w+)\s*\(([^)]*)/)
        if (!headerMatch) return null
        const className = headerMatch[1]
        const fields = headerMatch[2]
            .split(',')
            .map(p => p.replace(/\b(val|var)\b/, '').replace(/:.*$/, '').trim())
            .filter(Boolean)
        const methods = []
        let m
        const methodRe = /\bfun\s+(\w+)\s*\(/g
        while ((m = methodRe.exec(block)) !== null) methods.push(m[1])
        return { className, fields, methods, constructorLabel: 'init' }
    }

    function parsePythonClass(block) {
        const headerMatch = block.match(/^class\s+(\w+)/)
        if (!headerMatch) return null
        const className = headerMatch[1]
        const initMatch = block.match(/\bdef\s+__init__\s*\(([^)]*)/)
        const fields = initMatch
            ? initMatch[1].split(',').map(p => p.trim()).filter(p => p && p !== 'self')
            : []
        const methods = []
        let m
        const methodRe = /\bdef\s+(\w+)\s*\(/g
        while ((m = methodRe.exec(block)) !== null) {
            if (m[1] !== '__init__') methods.push(m[1])
        }
        return { className, fields, methods, constructorLabel: '__init__' }
    }

    // -------------------------------------------------------------------------
    // Unified Code Parser
    // -------------------------------------------------------------------------

    /**
     * Parse a sim code block into steps + display lines.
     *
     * Sections:
     *   // ClassDefs  (or # ClassDefs)
     *     class Foo(...)         ← parsed into classes[], never shown
     *   // Step: description     ← defines step boundary, hidden from display
     *   # regular comment        ← shown in display as-is
     *   code line                ← shown in display, executed for active step
     *
     * @param {string} code
     * @param {function} fieldResolver  fn(className, argsStr, state) → fields object
     * @returns {{ steps, displayLines, lang, classes }}
     */
    function parseSimCode(code, fieldResolver) {
        const lang = detectLang(code)
        const stepPrefix    = lang === 'python' ? '# Step:'    : '// Step:'
        const classDefs     = lang === 'python' ? '# ClassDefs': '// ClassDefs'
        const lineComment   = lang === 'python' ? '#'          : '//'

        const rawLines = code.split('\n')
        const classes  = []
        const steps    = []
        const displayLines = []   // lines to show in code panel

        let inClassDefs   = false
        let classDefBlock = []

        let description     = ''
        let stepDisplayStart = -1
        let stepDisplayComment = -1
        let stepCodeLines   = []   // trimmed code lines for the current step (for execute)

        function flushStep() {
            if (stepCodeLines.length === 0) return
            const endLine = stepDisplayStart + stepCodeLines.length - 1
            const lines   = stepCodeLines.slice()
            const dl      = lang
            // Class definition step - parse the whole block and define on state
            const isClassDef = lines[0].startsWith('class ')
            steps.push({
                description: description || 'Execute',
                code: lines.join('\n'),
                commentLineNum:  stepDisplayComment,
                startLineNum:    stepDisplayStart,
                endLineNum:      endLine,
                execute(state) {
                    if (isClassDef) {
                        const def = parseClassDef(lines.join('\n'), dl)
                        if (def && typeof state.defineClass === 'function') state.defineClass(def)
                    } else {
                        for (const line of lines) executeSimLine(line, state, dl, fieldResolver)
                    }
                }
            })
            stepCodeLines   = []
            stepDisplayStart = -1
        }

        for (let i = 0; i < rawLines.length; i++) {
            const raw     = rawLines[i]
            const trimmed = raw.trim()

            // --- ClassDefs section start ---
            if (trimmed === classDefs) {
                flushStep()
                inClassDefs   = true
                classDefBlock = []
                continue
            }

            // --- ClassDefs: accumulate until first Step marker or non-class line ---
            if (inClassDefs) {
                if (trimmed.startsWith(stepPrefix)) {
                    // Parse accumulated class block then handle step marker below
                    if (classDefBlock.length) {
                        const def = parseClassDef(classDefBlock.join('\n'), lang)
                        if (def) classes.push(def)
                    }
                    inClassDefs   = false
                    classDefBlock = []
                    // fall through to step marker handling
                } else if (trimmed.startsWith('class ')) {
                    // Start of a new class: save previous if any
                    if (classDefBlock.length) {
                        const def = parseClassDef(classDefBlock.join('\n'), lang)
                        if (def) classes.push(def)
                    }
                    classDefBlock = [trimmed]
                    continue
                } else if (!trimmed || trimmed.startsWith('def ') || trimmed.startsWith('@') || /^\s/.test(raw)) {
                    // Still inside class body (blank line, method def, decorator, indented body)
                    if (classDefBlock.length) classDefBlock.push(trimmed)
                    continue
                } else {
                    // Regular comment or code - ClassDefs section ends here; fall through
                    if (classDefBlock.length) {
                        const def = parseClassDef(classDefBlock.join('\n'), lang)
                        if (def) classes.push(def)
                        classDefBlock = []
                    }
                    inClassDefs = false
                    // fall through to regular line handling below
                }
            }

            // --- Step marker (hidden from display) ---
            if (trimmed.startsWith(stepPrefix)) {
                flushStep()
                description          = trimmed.substring(trimmed.indexOf(':') + 1).trim()
                stepDisplayComment   = displayLines.length   // next display line index
                // Don't push to displayLines - step markers are hidden
                continue
            }

            // --- Everything else goes to display ---
            displayLines.push(raw)
            const displayIdx = displayLines.length - 1

            // Regular comment - shown in display but not executed
            if (!trimmed || trimmed.startsWith(lineComment)) continue

            // Code line - track for current step
            if (stepDisplayStart === -1) stepDisplayStart = displayIdx
            stepCodeLines.push(trimmed)
        }

        // Flush any remaining ClassDefs block
        if (inClassDefs && classDefBlock.length) {
            const def = parseClassDef(classDefBlock.join('\n'), lang)
            if (def) classes.push(def)
        }
        flushStep()

        return { steps, displayLines, lang, classes }
    }

    // -------------------------------------------------------------------------
    // Unified Line Executor
    // -------------------------------------------------------------------------

    /**
     * Execute a single statement against a HeapState.
     * fieldResolver(className, argsStr, state) → fields object
     */
    function executeSimLine(line, state, lang, fieldResolver) {
        const nullLiteral = lang === 'python' ? 'None' : 'null'

        // Method call: name.method()  - before field/assignment checks
        const methodCallMatch = line.match(/^(\w+)\.(\w+)\s*\(/)
        if (methodCallMatch && !line.includes('=')) {
            if (typeof state.callMethod === 'function') state.callMethod(methodCallMatch[1], methodCallMatch[2])
            return
        }

        // Field update: name.field(.field)* = value
        const fieldUpdateMatch = line.match(/^(\w+(?:\.\w+)+)\s*=\s*(.+)$/)
        if (fieldUpdateMatch) {
            state.updateField(fieldUpdateMatch[1], parseValue(fieldUpdateMatch[2]))
            return
        }

        // Val declaration (Kotlin): val name = expr
        const valMatch = line.match(/^val\s+(\w+)\s*=\s*(.+)$/)
        if (valMatch) {
            handleSimAssignment(valMatch[1], valMatch[2].trim(), state, lang, nullLiteral, fieldResolver)
            return
        }

        // Bare assignment: name = expr  (Python, or Kotlin reassignment)
        const assignMatch = line.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/)
        if (assignMatch) {
            handleSimAssignment(assignMatch[1], assignMatch[2].trim(), state, lang, nullLiteral, fieldResolver)
        }
    }

    function handleSimAssignment(varName, valueExpr, state, lang, nullLiteral, fieldResolver) {
        if (valueExpr === nullLiteral || valueExpr === 'null' || valueExpr === 'None') {
            state.setNull(varName)
            return
        }

        // Object instantiation: ClassName(args)
        const objectMatch = valueExpr.match(/^([A-Z]\w*)\s*\((.*)\)$/)
        if (objectMatch) {
            const fields = fieldResolver(objectMatch[1], objectMatch[2], state)
            state.addObject(varName, objectMatch[1], fields)
            if (typeof state.highlightConstructor === 'function') state.highlightConstructor(objectMatch[1])
            return
        }

        // Reference copy: bare lowercase identifier that exists on the stack
        if (/^[a-z_]\w*$/.test(valueExpr) && state.stack.find(v => v.name === valueExpr)) {
            state.copyReference(varName, valueExpr)
            return
        }

        state.addPrimitive(varName, parseValue(valueExpr))
    }

    // -------------------------------------------------------------------------
    // Field Resolver - class-definition based (used by oop-sim + memory-sim)
    // -------------------------------------------------------------------------

    /**
     * Build a fieldResolver that looks class defs up from a source array.
     * classesRef is either an array of classDef objects, or a function returning one.
     * Pass a function when the array is populated lazily (e.g. oop-sim's state.classes).
     */
    function makeClassDefResolver(classesRef) {
        return function(className, argsStr, state) {
            const classes = typeof classesRef === 'function' ? classesRef() : classesRef
            const classDef = classes.find(c => c.className === className)
            const args = argsStr.trim() ? argsStr.split(',').map(s => s.trim()) : []
            const fieldNames = classDef ? classDef.fields : args.map((_, i) => `field${i}`)
            const fields = {}

            args.forEach((arg, i) => {
                const fieldName = fieldNames[i] || `field${i}`
                if (/^[a-zA-Z_]\w*$/.test(arg)) {
                    const stackVar = state.stack.find(v => v.name === arg)
                    if (stackVar && stackVar.type === 'reference') {
                        fields[fieldName] = { $ref: stackVar.objectId }
                        return
                    }
                }
                fields[fieldName] = parseValue(arg)
            })

            for (let i = args.length; i < fieldNames.length; i++) {
                fields[fieldNames[i]] = null
            }
            return fields
        }
    }

    function parseSteps(code, executeLineFn) {
        const lines = code.split('\n')
        const steps = []
        let currentLines = []
        let description = ''
        let commentLineNum = -1
        let startLineNum = -1

        for (let i = 0; i < lines.length; i++) {
            const trimmed = lines[i].trim()

            if (trimmed.startsWith('// Step:')) {
                if (currentLines.length > 0) {
                    steps.push(buildStep(description, currentLines, commentLineNum, startLineNum, executeLineFn))
                }
                description = trimmed.substring(8).trim()
                commentLineNum = i
                currentLines = []
                startLineNum = -1
            } else if (trimmed && !trimmed.startsWith('//')) {
                if (startLineNum === -1) startLineNum = i
                currentLines.push(trimmed)
            }
        }

        if (currentLines.length > 0) {
            steps.push(buildStep(description, currentLines, commentLineNum, startLineNum, executeLineFn))
        }

        return { steps, allLines: lines }
    }

    function buildStep(description, codeLines, commentLineNum, startLineNum, executeLineFn) {
        return {
            description: description || 'Execute',
            code: codeLines.join('\n'),
            commentLineNum,
            startLineNum,
            endLineNum: startLineNum + codeLines.length - 1,
            execute(state) {
                for (const line of codeLines) {
                    executeLineFn(line, state)
                }
            }
        }
    }

    // -------------------------------------------------------------------------
    // Shared view renderers (used by memory-sim + oop-sim)
    // -------------------------------------------------------------------------

    function renderVariablesView(state, changes) {
        if (state.stack.length === 0) return renderEmpty()
        return state.stack.map(v =>
            renderVariable(v, !!(changes && changes.stackVariables.has(v.name)), id => state.getObject(id))
        ).join('')
    }

    function renderHeapView(state, changes) {
        if (state.heap.length === 0) return renderEmpty()
        const referencedIds = findReferencedObjectIds(state)
        return state.heap.map(obj => renderHeapObject(obj, state, changes, referencedIds)).join('')
    }

    function updateStepInfo(container, state) {
        const el = container.querySelector('.step-info')
        if (!el) return
        el.textContent = state.currentStep === 0
            ? 'Ready to execute'
            : state.steps[state.currentStep - 1].description
    }

    function renderMemoryPanel() {
        return `
            <h4>Memory</h4>
            <div class="sim-memory-view">
                <div class="sim-section sim-variables-section">
                    <h5>Variables</h5>
                    <div class="sim-variables-list"></div>
                </div>
                <div class="sim-section sim-heap-section">
                    <h5>Heap</h5>
                    <div class="sim-heap-list"></div>
                </div>
            </div>
        `
    }

    function renderClassesPanel() {
        return `
            <h4>Classes</h4>
            <div class="sim-classes-list"></div>
        `
    }

    function renderClassesView(classes) {
        if (!classes || classes.length === 0) return renderEmpty()
        return classes.map(def => {
            const fieldsHtml = def.fields.map(f => `
                <div class="class-member class-field-member">
                    <span class="member-name">${escapeHtml(f)}</span>
                </div>
            `).join('')

            const constructorHtml = `
                <div class="class-member class-constructor" data-method="${escapeHtml(def.constructorLabel)}">
                    <span class="member-name constructor-name">${escapeHtml(def.constructorLabel)}</span>
                    <span class="member-params">(${def.fields.map(escapeHtml).join(', ')})</span>
                </div>
            `

            const methodsHtml = def.methods.map(m => `
                <div class="class-member class-method-member" data-method="${escapeHtml(m)}">
                    <span class="member-name method-name">${escapeHtml(m)}</span>
                    <span class="member-params">()</span>
                </div>
            `).join('')

            return `
                <div class="class-def" id="class-def-${escapeHtml(def.className)}">
                    <div class="class-header">${escapeHtml(def.className)}</div>
                    <div class="class-body">
                        ${constructorHtml}
                        ${def.fields.length ? `<div class="class-divider"></div>${fieldsHtml}` : ''}
                        ${def.methods.length ? `<div class="class-divider"></div>${methodsHtml}` : ''}
                    </div>
                </div>
            `
        }).join('')
    }

    /**
     * Apply a pending class/method highlight flash and own the full flash lifecycle.
     * If state.pendingHighlight is set: flash the heap object immediately, then flash
     * the method card after 500ms and schedule cleanup inside that timeout.
     * If no pending highlight: schedule cleanup immediately (for field-update flashes).
     */
    function applyPendingHighlight(container, state) {
        if (state.pendingHighlight) {
            const { className, methodName, objectId } = state.pendingHighlight
            if (objectId != null) {
                const objEl = container.querySelector(`.heap-object[data-object-id="${objectId}"]`)
                if (objEl) objEl.classList.add('flash-object')
            }
            container._flashHighlightTimer = setTimeout(() => {
                const card = container.querySelector(`#class-def-${CSS.escape(className)}`)
                if (card) {
                    const methodEl = card.querySelector(`[data-method="${CSS.escape(methodName)}"]`)
                    if (methodEl) methodEl.classList.add('flash')
                }
                scheduleFlashCleanup(container)
            }, 500)
            state.pendingHighlight = null
        } else {
            scheduleFlashCleanup(container)
        }
    }

    // -------------------------------------------------------------------------
    // Export
    // -------------------------------------------------------------------------

    window.SimCore = {
        // Values
        parseValue,

        // HTML
        escapeHtml,
        renderValue,
        renderVariable,
        renderField,
        renderEmpty,

        // Heap rendering
        findReferencedObjectIds,
        renderHeapObject,
        renderVariablesView,
        renderHeapView,
        updateStepInfo,
        renderMemoryPanel,
        renderClassesPanel,
        renderClassesView,
        applyPendingHighlight,

        // Heap state base class
        HeapState,

        // Change detection
        snapshot,
        getChanges,

        // Animations
        FLASH_DURATION_MS,
        scheduleFlashCleanup,
        cancelFlashCleanup,
        attachReferenceHandlers,

        // Syntax highlighting
        KOTLIN_KEYWORDS, PYTHON_KEYWORDS,
        KOTLIN_TOKEN_PATTERNS, PYTHON_TOKEN_PATTERNS,
        highlightSyntax,

        // Code view
        generateCodeView,
        updateCodeHighlight,
        clearCodeHighlight,

        // Controls
        renderControls,
        setupControls,
        syncButtonStates,

        // Parser
        parseSteps,

        // Unified parser + executor
        detectLang,
        parseClassDef,
        parseKotlinClass,
        parsePythonClass,
        parseSimCode,
        executeSimLine,
        makeClassDefResolver,
    }

})()
