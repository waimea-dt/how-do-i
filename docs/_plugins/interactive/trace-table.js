/**
 * docsify-trace-table.js - Python variable trace visualiser for Docsify pages.
 *
 * What this plugin does
 * - Finds fenced code blocks marked as Python trace blocks in rendered Docsify HTML.
 * - Executes a safe, limited in-browser interpreter over a teaching subset of Python.
 * - Renders an interactive view with:
 *   - syntax-highlighted code (Prism, if available)
 *   - step-by-step variable trace table
 *   - optional per-step output column for print statements
 *   - play / pause / next / reset controls
 *
 * Fence usage
 * - Basic trace block:
 *     ```python trace
 *     x = 0
 *     for i in range(3):
 *         x = x + i
 *     ```
 * - Hide mode (rows invisible until revealed while stepping):
 *     ```python trace hide
 *     ...
 *     ```
 * - Blank worksheet mode (editable table, no controls or execution):
 *     ```python trace blank
 *     ...
 *     ```
 * - Simulated input directive on input assignments:
 *     name = input("Name: ")    # INPUT: Bob
 *
 * Supported Python subset (intentional and limited)
 * - Assignments: x = expr, input assignment via directive, augmented assignment (+=, -=, *=, /=, %=)
 * - Branching: if / elif / else
 * - Loops: for var in range(...), for var in iterable (list/string), while condition
 * - Loop control: break, continue
 * - Output: print(...)
 * - Expression features: arithmetic/boolean expressions, True/False/None, and/or/not, len(...)
 * - String interpolation in print via basic f-string replacement
 *
 * Runtime/trace behaviour
 * - Variables are snapshotted after each executable step.
 * - Control lines (if/elif/else/while checks) are traced and can be styled as pass/fail.
 * - Changed or touched variable cells are highlighted on the active step.
 * - Output appears only on the print step row (non-print rows show empty output).
 * - Final row is an END snapshot (no code line highlight) with final variable state.
 *
 * Safety and constraints
 * - While loops are guarded by a configurable max iteration count.
 * - break/continue outside loop scope produce explicit trace errors.
 * - This is not a full Python runtime and intentionally skips unsupported statements.
 *
 * Integration notes
 * - Plugin lifecycle: Docsify hook.afterEach (block tagging) + hook.doneEach (hydration/render).
 * - CSS and behaviour options are centralised in TRACE_TABLE_CONFIG.
 */

;(function () {
    const TRACE_TABLE_CONFIG = {
        maxWhileIterations: 1000,
        autoplayDelayMs: 900,
        blockAttributes: {
            hide: 'hide',
            blank: 'blank'
        },
        cssClasses: {
            hideUntilRun: 'trace-table--hide-until-run'
        },
        uiText: {
            title: 'Variable Trace',
            subtitle: 'Track how variables change as the code runs',
            lineHeader: 'Line',
            outputHeader: 'Out',
            doneLabel: 'END',
            buttons: {
                play: 'Play',
                pause: 'Pause',
                next: 'Next',
                reset: 'Reset'
            },
            errors: {
                invalidRange: 'Invalid range(...) arguments',
                invalidForIterable: 'for loop iterable must be a list or string',
                whileLimit: 'While loop exceeded safety limit',
                breakOutsideLoop: 'break used outside loop',
                continueOutsideLoop: 'continue used outside loop'
            }
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div')
        div.textContent = text
        return div.innerHTML
    }

    function countIndent(line) {
        const m = line.match(/^\s*/)
        return m ? m[0].length : 0
    }

    function findChildIndent(lines, fromIndex, parentIndent) {
        for (let i = fromIndex; i < lines.length; i++) {
            const t = lines[i].trim()
            if (!t || t.startsWith('#')) continue
            const ind = countIndent(lines[i])
            if (ind > parentIndent) return ind
            return parentIndent + 4
        }
        return parentIndent + 4
    }

    function splitTopLevelArgs(text) {
        const out = []
        let cur = ''
        let depth = 0
        let quote = null
        for (let i = 0; i < text.length; i++) {
            const ch = text[i]
            if (quote) {
                cur += ch
                if (ch === quote && text[i - 1] !== '\\') quote = null
                continue
            }
            if (ch === '\'' || ch === '"') {
                quote = ch
                cur += ch
                continue
            }
            if (ch === '(' || ch === '[' || ch === '{') depth++
            if (ch === ')' || ch === ']' || ch === '}') depth--
            if (ch === ',' && depth === 0) {
                out.push(cur.trim())
                cur = ''
                continue
            }
            cur += ch
        }
        if (cur.trim()) out.push(cur.trim())
        return out
    }

    function parseInputDirective(line) {
        const m = line.match(/^(.*\binput\s*\([^)]*\).*)\s+#\s*INPUT:\s*(.*)$/)
        if (!m) {
            return { codeLine: line, inputText: null }
        }
        return {
            codeLine: m[1].replace(/\s+$/, ''),
            inputText: m[2].trim()
        }
    }

    function parseProgram(source) {
        const sourceLines = source.split('\n')
        const lineMeta = sourceLines.map(parseInputDirective)
        const lines = lineMeta.map(entry => entry.codeLine)

        function parseBlock(start, indentLevel) {
            const statements = []
            let i = start

            while (i < lines.length) {
                const raw = lines[i]
                const trimmed = raw.trim()

                if (!trimmed || trimmed.startsWith('#')) {
                    i++
                    continue
                }

                const indent = countIndent(raw)
                if (indent < indentLevel) break
                if (indent > indentLevel) {
                    i++
                    continue
                }

                if (/^(elif\s+|else:)/.test(trimmed)) break

                const ifMatch = trimmed.match(/^if\s+(.+):$/)
                if (ifMatch) {
                    const branches = []
                    const childIndent = findChildIndent(lines, i + 1, indent)
                    const ifBody = parseBlock(i + 1, childIndent)
                    branches.push({ kind: 'if', test: ifMatch[1], body: ifBody.statements, lineIndex: i })
                    i = ifBody.nextIndex

                    while (i < lines.length) {
                        const nxtRaw = lines[i]
                        const nxtTrim = nxtRaw.trim()
                        if (!nxtTrim || nxtTrim.startsWith('#')) {
                            i++
                            continue
                        }
                        const nxtIndent = countIndent(nxtRaw)
                        if (nxtIndent !== indent) break

                        const elifMatch = nxtTrim.match(/^elif\s+(.+):$/)
                        if (elifMatch) {
                            const elifChildIndent = findChildIndent(lines, i + 1, indent)
                            const elifBody = parseBlock(i + 1, elifChildIndent)
                            branches.push({ kind: 'elif', test: elifMatch[1], body: elifBody.statements, lineIndex: i })
                            i = elifBody.nextIndex
                            continue
                        }

                        if (nxtTrim === 'else:') {
                            const elseChildIndent = findChildIndent(lines, i + 1, indent)
                            const elseBody = parseBlock(i + 1, elseChildIndent)
                            branches.push({ kind: 'else', body: elseBody.statements, lineIndex: i })
                            i = elseBody.nextIndex
                        }
                        break
                    }

                    statements.push({ type: 'ifchain', branches, lineIndex: i })
                    continue
                }

                const forMatch = trimmed.match(/^for\s+([A-Za-z_]\w*)\s+in\s+range\((.*)\):$/)
                if (forMatch) {
                    const childIndent = findChildIndent(lines, i + 1, indent)
                    const body = parseBlock(i + 1, childIndent)
                    statements.push({
                        type: 'for',
                        varName: forMatch[1],
                        iterableType: 'range',
                        rangeExpr: forMatch[2],
                        body: body.statements,
                        lineIndex: i
                    })
                    i = body.nextIndex
                    continue
                }

                const forEachMatch = trimmed.match(/^for\s+([A-Za-z_]\w*)\s+in\s+(.+):$/)
                if (forEachMatch) {
                    const childIndent = findChildIndent(lines, i + 1, indent)
                    const body = parseBlock(i + 1, childIndent)
                    statements.push({
                        type: 'for',
                        varName: forEachMatch[1],
                        iterableType: 'iterable',
                        iterableExpr: forEachMatch[2].trim(),
                        body: body.statements,
                        lineIndex: i
                    })
                    i = body.nextIndex
                    continue
                }

                const whileMatch = trimmed.match(/^while\s+(.+):$/)
                if (whileMatch) {
                    const childIndent = findChildIndent(lines, i + 1, indent)
                    const body = parseBlock(i + 1, childIndent)
                    statements.push({
                        type: 'while',
                        test: whileMatch[1],
                        body: body.statements,
                        lineIndex: i
                    })
                    i = body.nextIndex
                    continue
                }

                const assignMatch = trimmed.match(/^([A-Za-z_]\w*)\s*=\s*(.+)$/)
                if (assignMatch) {
                    const inputText = lineMeta[i].inputText
                    const isInputAssign = inputText !== null && /^input\s*\(/.test(assignMatch[2].trim())
                    if (isInputAssign) {
                        statements.push({
                            type: 'assign_input',
                            varName: assignMatch[1],
                            inputValue: inputText,
                            lineIndex: i
                        })
                        i++
                        continue
                    }

                    statements.push({
                        type: 'assign',
                        varName: assignMatch[1],
                        expr: assignMatch[2],
                        lineIndex: i
                    })
                    i++
                    continue
                }

                const indexAssignMatch = trimmed.match(/^([A-Za-z_]\w*)\s*\[(.+)\]\s*=\s*(.+)$/)
                if (indexAssignMatch) {
                    statements.push({
                        type: 'list_set',
                        varName: indexAssignMatch[1],
                        indexExpr: indexAssignMatch[2].trim(),
                        expr: indexAssignMatch[3],
                        lineIndex: i
                    })
                    i++
                    continue
                }

                const appendMatch = trimmed.match(/^([A-Za-z_]\w*)\.append\((.*)\)$/)
                if (appendMatch) {
                    statements.push({
                        type: 'list_append',
                        varName: appendMatch[1],
                        expr: appendMatch[2],
                        lineIndex: i
                    })
                    i++
                    continue
                }

                const augAssignMatch = trimmed.match(/^([A-Za-z_]\w*)\s*([+\-*/%])=\s*(.+)$/)
                if (augAssignMatch) {
                    statements.push({
                        type: 'assign',
                        varName: augAssignMatch[1],
                        expr: `${augAssignMatch[1]} ${augAssignMatch[2]} (${augAssignMatch[3]})`,
                        lineIndex: i
                    })
                    i++
                    continue
                }

                if (trimmed === 'break') {
                    statements.push({ type: 'break', lineIndex: i })
                    i++
                    continue
                }

                if (trimmed === 'continue') {
                    statements.push({ type: 'continue', lineIndex: i })
                    i++
                    continue
                }

                const printMatch = trimmed.match(/^print\((.*)\)$/)
                if (printMatch) {
                    statements.push({
                        type: 'print',
                        argsText: printMatch[1],
                        lineIndex: i
                    })
                    i++
                    continue
                }

                // Unsupported statement: skip.
                i++
            }

            return { statements, nextIndex: i }
        }

        return { lines, statements: parseBlock(0, 0).statements }
    }

    function toJsExpr(pyExpr) {
        return pyExpr
            .replace(/\bTrue\b/g, 'true')
            .replace(/\bFalse\b/g, 'false')
            .replace(/\bNone\b/g, 'null')
            .replace(/\band\b/g, '&&')
            .replace(/\bor\b/g, '||')
            .replace(/\bnot\b/g, '!')
    }

    function evalFString(text, env) {
        return text.replace(/\{([^}]+)\}/g, (_, expr) => {
            const value = evalExpr(expr.trim(), env)
            return value === null || value === undefined ? 'None' : String(value)
        })
    }

    function evalPrintArg(pyExpr, env) {
        const trimmed = pyExpr.trim()
        const fStringMatch = trimmed.match(/^f(["'])([\s\S]*)\1$/)
        if (fStringMatch) {
            return evalFString(fStringMatch[2], env)
        }
        return evalExpr(trimmed, env)
    }

    function formatOutputValue(value) {
        if (Array.isArray(value)) {
            return `[${value.map(formatOutputValue).join(', ')}]`
        }
        if (value === null || value === undefined) return 'None'
        if (typeof value === 'boolean') return value ? 'True' : 'False'
        return String(value)
    }

    function evalExpr(pyExpr, env) {
        const jsExpr = toJsExpr(pyExpr)
        const scope = Object.create(env)

        // Provide minimal Python-like builtins used in teaching examples.
        if (typeof scope.input !== 'function') {
            scope.input = () => ''
        }
        if (typeof scope.print !== 'function') {
            scope.print = () => null
        }
        if (!Object.prototype.hasOwnProperty.call(env, 'len')) {
            scope.len = value => {
                if (Array.isArray(value) || typeof value === 'string') {
                    return value.length
                }
                throw new Error('len() expects a list or string')
            }
        }

        const fn = new Function('env', `with (env) { return (${jsExpr}); }`)
        return fn(scope)
    }

    function evalRangeArgs(argText, env) {
        const args = splitTopLevelArgs(argText).map(arg => evalExpr(arg, env))
        let start = 0
        let stop = 0
        let step = 1

        if (args.length === 1) {
            stop = Number(args[0])
        } else if (args.length === 2) {
            start = Number(args[0])
            stop = Number(args[1])
        } else if (args.length >= 3) {
            start = Number(args[0])
            stop = Number(args[1])
            step = Number(args[2])
        }

        if (!Number.isFinite(start) || !Number.isFinite(stop) || !Number.isFinite(step) || step === 0) {
            throw new Error(TRACE_TABLE_CONFIG.uiText.errors.invalidRange)
        }

        const values = []
        if (step > 0) {
            for (let v = start; v < stop; v += step) values.push(v)
        } else {
            for (let v = start; v > stop; v += step) values.push(v)
        }
        return values
    }

    function ensureListTarget(value, varName) {
        if (!Array.isArray(value)) {
            throw new Error(`${varName} is not a list`)
        }
        return value
    }

    function toValidListIndex(rawIndex, listLength, varName) {
        const index = Number(rawIndex)
        if (!Number.isInteger(index)) {
            throw new Error(`List index for ${varName} must be an integer`)
        }

        const normalized = index < 0 ? listLength + index : index
        if (normalized < 0 || normalized >= listLength) {
            throw new Error(`List index out of range for ${varName}`)
        }
        return normalized
    }

    function runTrace(program) {
        const env = Object.create(null)
        const traces = []
        const maxWhileIterations = TRACE_TABLE_CONFIG.maxWhileIterations
        const CONTROL_FLOW = {
            BREAK: 'break',
            CONTINUE: 'continue'
        }

        function snapshot(lineIndex, options = {}) {
            traces.push({
                lineIndex,
                vars: JSON.parse(JSON.stringify(env)),
                kind: options.kind || 'state',
                output: options.output !== undefined ? options.output : '',
                conditionResult: options.conditionResult,
                branchKind: options.branchKind || null,
                touchedVars: Array.isArray(options.touchedVars) ? options.touchedVars : []
            })
        }

        function execBlock(statements) {
            for (const stmt of statements) {
                const flow = execStmt(stmt)
                if (flow) return flow
            }
            return null
        }

        function execStmt(stmt) {
            if (stmt.type === 'assign_input') {
                env[stmt.varName] = stmt.inputValue
                snapshot(stmt.lineIndex, { touchedVars: [stmt.varName] })
                return
            }

            if (stmt.type === 'assign') {
                env[stmt.varName] = evalExpr(stmt.expr, env)
                snapshot(stmt.lineIndex, { touchedVars: [stmt.varName] })
                return
            }

            if (stmt.type === 'list_append') {
                const target = ensureListTarget(env[stmt.varName], stmt.varName)
                target.push(evalExpr(stmt.expr, env))
                snapshot(stmt.lineIndex, { touchedVars: [stmt.varName] })
                return
            }

            if (stmt.type === 'list_set') {
                const target = ensureListTarget(env[stmt.varName], stmt.varName)
                const index = toValidListIndex(evalExpr(stmt.indexExpr, env), target.length, stmt.varName)
                target[index] = evalExpr(stmt.expr, env)
                snapshot(stmt.lineIndex, { touchedVars: [stmt.varName] })
                return
            }

            if (stmt.type === 'break') {
                snapshot(stmt.lineIndex, { kind: 'control' })
                return CONTROL_FLOW.BREAK
            }

            if (stmt.type === 'continue') {
                snapshot(stmt.lineIndex, { kind: 'control' })
                return CONTROL_FLOW.CONTINUE
            }

            if (stmt.type === 'print') {
                const args = splitTopLevelArgs(stmt.argsText).map(arg => evalPrintArg(arg, env))
                const lineOutput = args
                    .map(formatOutputValue)
                    .join(' ')
                snapshot(stmt.lineIndex, { kind: 'print', output: lineOutput })
                return
            }

            if (stmt.type === 'ifchain') {
                for (const branch of stmt.branches) {
                    if (branch.kind === 'else') {
                        snapshot(branch.lineIndex, { kind: 'control', conditionResult: true, branchKind: 'else' })
                        return execBlock(branch.body)
                    }
                    const passed = Boolean(evalExpr(branch.test, env))
                    snapshot(branch.lineIndex, { kind: 'control', conditionResult: passed, branchKind: branch.kind })
                    if (passed) {
                        return execBlock(branch.body)
                    }
                }
                return
            }

            if (stmt.type === 'for') {
                let values
                if (stmt.iterableType === 'range') {
                    values = evalRangeArgs(stmt.rangeExpr, env)
                } else {
                    const iterable = evalExpr(stmt.iterableExpr, env)
                    if (Array.isArray(iterable) || typeof iterable === 'string') {
                        values = Array.from(iterable)
                    } else {
                        throw new Error(TRACE_TABLE_CONFIG.uiText.errors.invalidForIterable)
                    }
                }

                for (const v of values) {
                    env[stmt.varName] = v
                    snapshot(stmt.lineIndex, { touchedVars: [stmt.varName] })
                    const flow = execBlock(stmt.body)
                    if (flow === CONTROL_FLOW.BREAK) break
                    if (flow === CONTROL_FLOW.CONTINUE) continue
                    if (flow) return flow
                }
                return
            }

            if (stmt.type === 'while') {
                let guard = 0
                while (true) {
                    const passed = Boolean(evalExpr(stmt.test, env))
                    snapshot(stmt.lineIndex, { kind: 'control', conditionResult: passed })
                    if (!passed) {
                        break
                    }
                    guard += 1
                    if (guard > maxWhileIterations) {
                        throw new Error(`${TRACE_TABLE_CONFIG.uiText.errors.whileLimit} (${maxWhileIterations} iterations)`)
                    }
                    const flow = execBlock(stmt.body)
                    if (flow === CONTROL_FLOW.BREAK) break
                    if (flow === CONTROL_FLOW.CONTINUE) continue
                    if (flow) return flow
                }
            }
        }

        const flow = execBlock(program.statements)
        if (flow === CONTROL_FLOW.BREAK) {
            throw new Error(TRACE_TABLE_CONFIG.uiText.errors.breakOutsideLoop)
        }
        if (flow === CONTROL_FLOW.CONTINUE) {
            throw new Error(TRACE_TABLE_CONFIG.uiText.errors.continueOutsideLoop)
        }
        return traces
    }

    function buildTraceTable(traces) {
        const variableOrder = []
        const tableRows = traces.map((t, idx) => {
            Object.keys(t.vars).forEach(name => {
                if (!variableOrder.includes(name)) variableOrder.push(name)
            })
            const prevVars = idx > 0 ? traces[idx - 1].vars : {}
            const touchedVars = new Set(Array.isArray(t.touchedVars) ? t.touchedVars : [])
            const changedVars = new Set()
            Object.keys(t.vars).forEach(name => {
                if (!Object.prototype.hasOwnProperty.call(prevVars, name) ||
                    JSON.stringify(prevVars[name]) !== JSON.stringify(t.vars[name])) {
                    changedVars.add(name)
                }
            })
            touchedVars.forEach(name => changedVars.add(name))
            return {
                lineNumber: t.lineIndex + 1,
                lineIndex: t.lineIndex,
                variables: t.vars,
                changedVars,
                kind: t.kind || 'state',
                output: t.output || '',
                conditionResult: typeof t.conditionResult === 'boolean' ? t.conditionResult : null,
                branchKind: t.branchKind || null
            }
        })

        const finalVars = tableRows.length > 0 ? tableRows[tableRows.length - 1].variables : {}
        tableRows.push({
            lineNumber: TRACE_TABLE_CONFIG.uiText.doneLabel,
            lineIndex: null,
            variables: JSON.parse(JSON.stringify(finalVars)),
            changedVars: new Set(),
            kind: 'done',
            output: '',
            conditionResult: null,
            branchKind: null
        })

        return { variableOrder, tableRows }
    }

    function collectVariableOrder(statements) {
        const order = []
        const seen = new Set()

        function pushVar(name) {
            if (!name || seen.has(name)) return
            seen.add(name)
            order.push(name)
        }

        function walk(block) {
            block.forEach(stmt => {
                if (stmt.type === 'assign' ||
                    stmt.type === 'assign_input' ||
                    stmt.type === 'list_append' ||
                    stmt.type === 'list_set') {
                    pushVar(stmt.varName)
                    return
                }

                if (stmt.type === 'for') {
                    pushVar(stmt.varName)
                    walk(stmt.body)
                    return
                }

                if (stmt.type === 'while') {
                    walk(stmt.body)
                    return
                }

                if (stmt.type === 'ifchain') {
                    stmt.branches.forEach(branch => walk(branch.body))
                }
            })
        }

        walk(statements)
        return order
    }

    function collectTemplateLineIndexes(statements) {
        const lineIndexes = []

        function pushLine(index) {
            if (typeof index !== 'number') return
            lineIndexes.push(index)
        }

        function walk(block) {
            block.forEach(stmt => {
                if (stmt.type === 'ifchain') {
                    stmt.branches.forEach(branch => {
                        pushLine(branch.lineIndex)
                        walk(branch.body)
                    })
                    return
                }

                if (stmt.type === 'for' || stmt.type === 'while') {
                    pushLine(stmt.lineIndex)
                    walk(stmt.body)
                    return
                }

                pushLine(stmt.lineIndex)
            })
        }

        walk(statements)
        return lineIndexes
    }

    function buildBlankTemplateTable(program) {
        const variableOrder = collectVariableOrder(program.statements)
        let traceStepCount = 0
        try {
            traceStepCount = runTrace(program).length
        } catch (_err) {
            // Fallback to static statement-derived count if runtime trace fails.
            traceStepCount = collectTemplateLineIndexes(program.statements).length
        }

        const blankRowCount = traceStepCount + 2
        const tableRows = Array.from({ length: blankRowCount }, () => ({
            lineNumber: null,
            lineIndex: null,
            variables: Object.create(null),
            changedVars: new Set(),
            kind: 'blank',
            output: '',
            conditionResult: null,
            branchKind: null
        }))

        tableRows.push({
            lineNumber: TRACE_TABLE_CONFIG.uiText.doneLabel,
            lineIndex: null,
            variables: Object.create(null),
            changedVars: new Set(),
            kind: 'done',
            output: '',
            conditionResult: null,
            branchKind: null
        })

        return { variableOrder, tableRows }
    }

    function formatValue(value) {
        if (Array.isArray(value)) {
            return `[${value.map(formatValue).join(', ')}]`
        }
        if (value === null || value === undefined) return 'None'
        if (typeof value === 'string') return `'${value}'`
        if (typeof value === 'boolean') return value ? 'True' : 'False'
        return String(value)
    }

    function formatValueHtml(value) {
        if (Array.isArray(value)) {
            const items = value.map(formatValueHtml)
            const joiner = '<span class="token punctuation">, </span>'
            return `<span class="trace-table-list"><span class="token punctuation">[</span>${items.join(joiner)}<span class="token punctuation">]</span></span>`
        }
        if (value === null || value === undefined) return '<span class="token constant">None</span>'
        if (typeof value === 'string') return `<span class="token string">'${escapeHtml(value)}'</span>`
        if (typeof value === 'boolean') return `<span class="token boolean">${value ? 'True' : 'False'}</span>`
        if (typeof value === 'number') return `<span class="token number">${escapeHtml(String(value))}</span>`
        return escapeHtml(String(value))
    }

    function getTraceRenderOptions(preEl, codeEl) {
        const hideClass = TRACE_TABLE_CONFIG.blockAttributes.hide
        const blankClass = TRACE_TABLE_CONFIG.blockAttributes.blank
        return {
            hideUntilRun: preEl.classList.contains(hideClass) || codeEl.classList.contains(hideClass),
            blankTemplate: preEl.classList.contains(blankClass) || codeEl.classList.contains(blankClass)
        }
    }

    function applyValueCellTypeClasses(td, value) {
        if (Array.isArray(value)) td.classList.add('trace-table-cell-list')
        if (typeof value === 'number') td.classList.add('trace-table-cell-number')
        if (typeof value === 'string') td.classList.add('trace-table-cell-string')
        if (typeof value === 'boolean' || value === null || value === undefined) td.classList.add('trace-table-cell-boolean')
    }

    function createTraceButton(className, text, disabled = false) {
        const button = document.createElement('button')
        button.className = className
        button.textContent = text
        button.disabled = disabled
        return button
    }

    function clearStepVisualState(codeList, table) {
        codeList.querySelectorAll('.trace-table-code-line.active').forEach(el => el.classList.remove('active'))
        codeList.querySelectorAll('.trace-table-code-line.trace-table-condition-true').forEach(el => el.classList.remove('trace-table-condition-true'))
        codeList.querySelectorAll('.trace-table-code-line.trace-table-condition-false').forEach(el => el.classList.remove('trace-table-condition-false'))
        table.querySelectorAll('tbody tr.active').forEach(el => el.classList.remove('active'))
        table.querySelectorAll('td.trace-table-cell-changed').forEach(td => td.classList.remove('trace-table-cell-changed'))
        table.querySelectorAll('td.trace-table-output-active').forEach(td => td.classList.remove('trace-table-output-active'))
    }

    function updateRevealedRows(tbody, step) {
        Array.from(tbody.querySelectorAll('tr')).forEach((tr, idx) => {
            if (idx <= step) {
                tr.classList.add('trace-table-row-revealed')
            } else {
                tr.classList.remove('trace-table-row-revealed')
            }
        })
    }

    function applyConditionClass(lineEl, row) {
        if (row.kind === 'control' && (row.conditionResult === true || row.branchKind === 'else')) {
            lineEl.classList.add('trace-table-condition-true')
        }
        if (row.kind === 'control' && row.conditionResult === false) {
            lineEl.classList.add('trace-table-condition-false')
        }
    }

    function renderTraceTable(container, originalLines, variableOrder, tableRows, options = {}) {
        const wrapper = document.createElement('div')
        wrapper.className = 'trace-table-wrapper'
        if (options.hideUntilRun) {
            wrapper.classList.add(TRACE_TABLE_CONFIG.cssClasses.hideUntilRun)
        }
        if (options.blankTemplate) {
            wrapper.classList.add('trace-table--blank')
        }

        const header = document.createElement('div')
        header.className = 'trace-table-header'
        header.innerHTML = `<h3 class="trace-table-title">${escapeHtml(TRACE_TABLE_CONFIG.uiText.title)}</h3><p class="trace-table-subtitle">${escapeHtml(TRACE_TABLE_CONFIG.uiText.subtitle)}</p>`
        wrapper.appendChild(header)

        const content = document.createElement('div')
        content.className = 'trace-table-content'

        const codePanel = document.createElement('div')
        codePanel.className = 'trace-table-code-panel'
        const codeList = document.createElement('div')
        codeList.className = 'trace-table-code-list'

        originalLines.forEach((line, idx) => {
            const lineEl = document.createElement('div')
            lineEl.className = 'trace-table-code-line'
            lineEl.dataset.lineIndex = String(idx)
            const highlighted = (window.Prism && Prism.languages.python)
                ? Prism.highlight(line || '', Prism.languages.python, 'python')
                : escapeHtml(line || '')
            lineEl.innerHTML = `<span class="trace-table-code-number">${idx + 1}</span><code class="language-python">${highlighted}</code>`
            codeList.appendChild(lineEl)
        })

        codePanel.appendChild(codeList)
        content.appendChild(codePanel)

        const tablePanel = document.createElement('div')
        tablePanel.className = 'trace-table-panel'
        const table = document.createElement('table')
        table.className = 'trace-table'

        const thead = document.createElement('thead')
        const headerRow = document.createElement('tr')
        const lineTh = document.createElement('th')
        lineTh.textContent = TRACE_TABLE_CONFIG.uiText.lineHeader
        headerRow.appendChild(lineTh)
        variableOrder.forEach(name => {
            const th = document.createElement('th')
            if (options.blankTemplate) {
                const nameInput = document.createElement('input')
                nameInput.type = 'text'
                nameInput.className = 'trace-table-cell-input'
                nameInput.placeholder = '?'
                nameInput.setAttribute('aria-label', `Variable name ${name}`)
                th.appendChild(nameInput)
            } else {
                th.textContent = name
            }
            headerRow.appendChild(th)
        })
        const outputTh = document.createElement('th')
        outputTh.textContent = TRACE_TABLE_CONFIG.uiText.outputHeader
        headerRow.appendChild(outputTh)
        thead.appendChild(headerRow)
        table.appendChild(thead)

        const tbody = document.createElement('tbody')
        tableRows.forEach((row, idx) => {
            const tr = document.createElement('tr')
            tr.dataset.stepIndex = String(idx)
            tr.dataset.lineIndex = row.lineIndex === null ? '' : String(row.lineIndex)
            if (row.kind === 'done') tr.classList.add('trace-table-row-done')

            const lineTd = document.createElement('td')
            lineTd.className = 'trace-table-line-number'
            if (options.blankTemplate && row.kind !== 'done') {
                const lineInput = document.createElement('input')
                lineInput.type = 'text'
                lineInput.className = 'trace-table-cell-input'
                lineInput.placeholder = '—'
                lineInput.setAttribute('aria-label', `Line number for row ${idx + 1}`)
                lineTd.appendChild(lineInput)
            } else {
                lineTd.textContent = String(row.lineNumber)
            }
            tr.appendChild(lineTd)

            variableOrder.forEach(name => {
                const td = document.createElement('td')
                td.dataset.varName = name
                if (options.blankTemplate) {
                    const input = document.createElement('input')
                    input.type = 'text'
                    input.className = 'trace-table-cell-input'
                    input.placeholder = '—'
                    input.setAttribute('aria-label', `Row ${idx + 1}, variable ${name}`)
                    td.appendChild(input)
                } else if (Object.prototype.hasOwnProperty.call(row.variables, name)) {
                    const value = row.variables[name]
                    td.innerHTML = formatValueHtml(value)
                    applyValueCellTypeClasses(td, value)
                } else {
                    td.textContent = '—'
                    td.className = 'trace-table-cell-empty'
                }
                tr.appendChild(td)
            })

            const outputTd = document.createElement('td')
            outputTd.className = 'trace-table-output'
            if (options.blankTemplate) {
                const outputInput = document.createElement('input')
                outputInput.type = 'text'
                outputInput.className = 'trace-table-cell-input'
                outputInput.placeholder = '—'
                outputInput.setAttribute('aria-label', `Row ${idx + 1}, output`)
                outputTd.appendChild(outputInput)
            } else {
                outputTd.textContent = row.output ? row.output : '—'
                if (!row.output) outputTd.classList.add('trace-table-cell-empty')
            }
            tr.appendChild(outputTd)

            tbody.appendChild(tr)
        })

        table.appendChild(tbody)
        tablePanel.appendChild(table)
        content.appendChild(tablePanel)
        wrapper.appendChild(content)

        if (options.blankTemplate) {
            // Auto-size inputs as user types, accounting for 1rem horizontal padding
            const inputs = wrapper.querySelectorAll('.trace-table-cell-input')
            inputs.forEach(input => {
                function resizeInput() {
                    input.style.width = '3rem'
                    const scrollWidth = input.scrollWidth
                    // Account for 1rem (16px) padding on each side = 32px total, plus safety margin
                    input.style.width = Math.max(scrollWidth + 24, 48) + 'px'
                }
                input.addEventListener('input', resizeInput)
                resizeInput()
            })

            container.appendChild(wrapper)
            return
        }

        const controls = document.createElement('div')
        controls.className = 'trace-table-controls'

        const group = document.createElement('div')
        group.className = 'trace-table-button-group'

        const playBtn = createTraceButton('trace-table-btn trace-table-btn-play', TRACE_TABLE_CONFIG.uiText.buttons.play)
        const pauseBtn = createTraceButton('trace-table-btn trace-table-btn-pause', TRACE_TABLE_CONFIG.uiText.buttons.pause, true)
        const nextBtn = createTraceButton('trace-table-btn trace-table-btn-step', TRACE_TABLE_CONFIG.uiText.buttons.next)
        const resetBtn = createTraceButton('trace-table-btn trace-table-btn-reset', TRACE_TABLE_CONFIG.uiText.buttons.reset)

        group.appendChild(playBtn)
        group.appendChild(pauseBtn)
        group.appendChild(nextBtn)
        group.appendChild(resetBtn)
        controls.appendChild(group)
        wrapper.appendChild(controls)

        container.appendChild(wrapper)

        let step = -1
        let timer = null
        let stepping = false

        function setStep(newStep) {
            if (newStep < -1 || newStep >= tableRows.length) {
                return
            }

            step = newStep

            clearStepVisualState(codeList, table)

            if (stepping) {
                updateRevealedRows(tbody, step)
            }

            if (step >= 0 && step < tableRows.length) {
                const row = tableRows[step]
                const rowEl = table.querySelector(`tbody tr[data-step-index="${step}"]`)

                if (row.lineIndex !== null) {
                    const lineEl = codeList.querySelector(`[data-line-index="${row.lineIndex}"]`)
                    if (lineEl) {
                        lineEl.classList.add('active')
                        applyConditionClass(lineEl, row)
                    }
                }

                if (rowEl) {
                    rowEl.classList.add('active')
                    row.changedVars.forEach(name => {
                        const td = rowEl.querySelector(`td[data-var-name="${name}"]`)
                        if (td) td.classList.add('trace-table-cell-changed')
                    })
                    if (row.kind === 'print') {
                        const outputTd = rowEl.querySelector('td.trace-table-output')
                        if (outputTd) outputTd.classList.add('trace-table-output-active')
                    }
                }
            }

            const atEnd = step >= tableRows.length - 1
            playBtn.disabled = atEnd
            nextBtn.disabled = atEnd
        }

        function nextStep() {
            if (!stepping) {
                stepping = true
                wrapper.classList.add('trace-table--stepping')
            }
            if (step < tableRows.length - 1) setStep(step + 1)
        }

        function play() {
            if (!stepping) {
                stepping = true
                wrapper.classList.add('trace-table--stepping')
            }
            playBtn.disabled = true
            pauseBtn.disabled = false
            nextBtn.disabled = true
            function loop() {
                if (step < tableRows.length - 1) {
                    nextStep()
                    timer = setTimeout(loop, TRACE_TABLE_CONFIG.autoplayDelayMs)
                } else {
                    pause()
                }
            }
            loop()
        }

        function pause() {
            if (timer) clearTimeout(timer)
            timer = null
            pauseBtn.disabled = true
            playBtn.disabled = step >= tableRows.length - 1
            nextBtn.disabled = step >= tableRows.length - 1
        }

        function reset() {
            pause()
            stepping = false
            wrapper.classList.remove('trace-table--stepping')
            tbody.querySelectorAll('tr').forEach(tr => tr.classList.remove('trace-table-row-revealed'))
            setStep(-1)
        }

        playBtn.addEventListener('click', play)
        pauseBtn.addEventListener('click', pause)
        nextBtn.addEventListener('click', nextStep)
        resetBtn.addEventListener('click', reset)

        if (tableRows.length > 0) {
            setStep(-1)
        } else {
            playBtn.disabled = true
            nextBtn.disabled = true
        }
    }

    function renderError(container, message) {
        const errorDiv = document.createElement('div')
        errorDiv.className = 'trace-table-error'
        errorDiv.textContent = message
        container.appendChild(errorDiv)
    }

    const docsifyTraceTable = function (hook) {
        hook.afterEach(function (html) {
            return html.replace(
                /<pre\b[^>]*\blanguage-python\s+trace\b[^>]*>[\s\S]*?<\/pre>/g,
                (preBlock) => `<div class="trace-table-block">${preBlock}</div>`
            )
        })

        hook.doneEach(function () {
            document.querySelectorAll('.trace-table-block pre code').forEach(codeEl => {
                if (codeEl.dataset.traceProcessed) return
                codeEl.dataset.traceProcessed = 'true'

                const sourceCode = codeEl.textContent
                const { lines, statements } = parseProgram(sourceCode)
                const container = document.createElement('div')
                container.className = 'trace-table-container'

                const pre = codeEl.parentElement
                const renderOptions = getTraceRenderOptions(pre, codeEl)
                const wrapper = pre.parentElement
                wrapper.parentElement.replaceChild(container, wrapper)

                try {
                    const traceProgram = { lines, statements }
                    const { variableOrder, tableRows } = renderOptions.blankTemplate
                        ? buildBlankTemplateTable(traceProgram)
                        : buildTraceTable(runTrace(traceProgram))
                    renderTraceTable(container, lines, variableOrder, tableRows, renderOptions)
                } catch (err) {
                    renderError(container, `Trace Error: ${err.message}`)
                }
            })
        })
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyTraceTable, window.$docsify.plugins || [])
})()
