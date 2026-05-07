# SimCore Tests

Tests for the `SimCore` shared library (`sim-core.js`). Each section verifies a specific utility.
Results are shown in the browser console (open DevTools > Console).

Run these tests by navigating to this page - they execute automatically.

---

## 1. `parseValue`

```sim-core-test
parseValue
```

---

## 2. `escapeHtml`

```sim-core-test
escapeHtml
```

---

## 3. `renderVariable`

```sim-core-test
renderVariable
```

---

## 4. `renderField`

```sim-core-test
renderField
```

---

## 5. `snapshot` + `getChanges`

```sim-core-test
getChanges
```

---

## 6. `highlightSyntax`

```sim-core-test
highlightSyntax
```

---

## 7. `parseSteps`

```sim-core-test
parseSteps
```

---

## 8. `generateCodeView`

```sim-core-test
generateCodeView
```

---

## Test Summary

<div id="sim-core-test-summary"></div>

<script>
// ============================================================
// SimCore Test Runner
// ============================================================
// Runs after the page loads. Results go to the console and
// to the #sim-core-test-summary element.
(function () {
    const results = []
    let passed = 0
    let failed = 0

    function assert(name, actual, expected) {
        const ok = JSON.stringify(actual) === JSON.stringify(expected)
        results.push({ name, ok, actual, expected })
        if (ok) {
            passed++
            console.log(`%c✓ ${name}`, 'color: #4caf50')
        } else {
            failed++
            console.error(`✗ ${name}`)
            console.error('  Expected:', expected)
            console.error('  Actual:  ', actual)
        }
    }

    function assertContains(name, actual, substring) {
        const ok = typeof actual === 'string' && actual.includes(substring)
        results.push({ name, ok, actual, expected: `contains "${substring}"` })
        if (ok) {
            passed++
            console.log(`%c✓ ${name}`, 'color: #4caf50')
        } else {
            failed++
            console.error(`✗ ${name}`)
            console.error('  Expected to contain:', substring)
            console.error('  Actual:', actual)
        }
    }

    function assertNotContains(name, actual, substring) {
        const ok = typeof actual === 'string' && !actual.includes(substring)
        results.push({ name, ok, actual, expected: `not contains "${substring}"` })
        if (ok) {
            passed++
            console.log(`%c✓ ${name}`, 'color: #4caf50')
        } else {
            failed++
            console.error(`✗ ${name}`)
            console.error('  Expected NOT to contain:', substring)
            console.error('  Actual:', actual)
        }
    }

    function runTests() {
        if (!window.SimCore) {
            console.error('SimCore not found - is sim-core.js loaded?')
            return
        }

        const { parseValue, escapeHtml, renderVariable, renderField,
                snapshot, getChanges, highlightSyntax, parseSteps, generateCodeView } = SimCore

        // ---- 1. parseValue --------------------------------------------------
        console.group('1. parseValue')
        assert('string literal',         parseValue('"hello"'),   'hello')
        assert('integer',                parseValue('42'),         42)
        assert('negative integer',       parseValue('-5'),         -5)
        assert('float',                  parseValue('3.14'),       3.14)
        assert('true',                   parseValue('true'),       true)
        assert('false',                  parseValue('false'),      false)
        assert('bare word passthrough',  parseValue('Alice'),      'Alice')
        assert('trims whitespace',       parseValue('  7  '),      7)
        console.groupEnd()

        // ---- 2. escapeHtml --------------------------------------------------
        console.group('2. escapeHtml')
        assert('no special chars',   escapeHtml('hello'),             'hello')
        assert('& escaped',          escapeHtml('a & b'),             'a &amp; b')
        assert('< escaped',          escapeHtml('<script>'),          '&lt;script&gt;')
        assert('> escaped',          escapeHtml('a > b'),             'a &gt; b')
        assert('" escaped',          escapeHtml('"quoted"'),          '&quot;quoted&quot;')
        assert('number coerced',     escapeHtml(42),                  '42')
        console.groupEnd()

        // ---- 3. renderVariable ----------------------------------------------
        console.group('3. renderVariable')
        const primitiveVar = { name: 'age', type: 'primitive', value: 25 }
        const refVar       = { name: 'p',   type: 'reference', objectId: 1 }
        const nullVar      = { name: 'x',   type: 'null' }
        const getObj = id => id === 1 ? { className: 'Person' } : null

        assertContains('primitive - var-name',       renderVariable(primitiveVar, false),        'age')
        assertContains('primitive - value-primitive',renderVariable(primitiveVar, false),        'value-primitive')
        assertContains('primitive - value 25',       renderVariable(primitiveVar, false),        '25')
        assertContains('reference - var-name',       renderVariable(refVar, false, getObj),      'p')
        assertContains('reference - sim-ref',        renderVariable(refVar, false, getObj),      'sim-ref')
        assertContains('reference - #1',             renderVariable(refVar, false, getObj),      '#1')
        assertContains('reference - class name',     renderVariable(refVar, false, getObj),      'Person')
        assertContains('null - value-null',          renderVariable(nullVar, false),             'value-null')
        assertContains('flash class when changed',   renderVariable(primitiveVar, true),         'flash')
        assertNotContains('no flash when unchanged', renderVariable(primitiveVar, false),        'flash')
        console.groupEnd()

        // ---- 4. renderField -------------------------------------------------
        console.group('4. renderField')
        assertContains('key displayed',          renderField('name', 'Alice', false),                'name')
        assertContains('string value displayed', renderField('name', 'Alice', false),                'Alice')
        assertContains('null field',             renderField('x', null, false),                      'value-null')
        assertContains('ref field - field-ref',  renderField('p', { $ref: 2 }, false, getObj),       'field-ref')
        assertContains('ref field - #2',         renderField('p', { $ref: 2 }, false, getObj),       '#2')
        assertContains('flash on changed field', renderField('name', 'Alice', true),                 'flash')
        console.groupEnd()

        // ---- 5. snapshot + getChanges ---------------------------------------
        console.group('5. snapshot + getChanges')
        const state1 = {
            stack: [{ name: 'age', type: 'primitive', value: 25 }],
            heap: []
        }
        const snap1 = snapshot(state1)
        assert('snapshot copies stack', snap1.stack[0].value, 25)
        assert('snapshot is independent', (() => {
            state1.stack[0].value = 99
            return snap1.stack[0].value  // should still be 25
        })(), 25)
        state1.stack[0].value = 25  // restore

        const state2 = {
            stack: [
                { name: 'age', type: 'primitive', value: 26 },          // changed
                { name: 'p',   type: 'reference', objectId: 1 }         // new
            ],
            heap: [
                { id: 1, className: 'Person', fields: { name: 'Alice', score: 10 } }  // new
            ]
        }
        const changes = getChanges(state2, snap1)
        assert('changed variable detected',   changes.stackVariables.has('age'),  true)
        assert('new variable detected',       changes.stackVariables.has('p'),    true)
        assert('new ref flashes object',      changes.flashedObjects.has(1),      true)
        assert('new object flashed',          changes.flashedObjects.has(1),      true)
        assert('new object fields tracked',   changes.objectFields.has(1),        true)
        assert('no changes on identical',     (() => {
            const s = snapshot(state2)
            const c = getChanges(state2, s)
            return c.stackVariables.size
        })(), 0)
        console.groupEnd()

        // ---- 6. highlightSyntax (Kotlin) ------------------------------------
        console.group('6. highlightSyntax – Kotlin')
        assertContains('val keyword',       highlightSyntax('val age = 25'),              'hl-keyword')
        assertContains('class name',        highlightSyntax('val p = Person()'),          'hl-class')
        assertContains('number',            highlightSyntax('val x = 42'),                'hl-number')
        assertContains('string',            highlightSyntax('val s = "hi"'),              'hl-string')
        assertContains('comment',           highlightSyntax('// Step: test'),             'hl-comment')
        assertContains('empty line = nbsp', highlightSyntax(''),                          '&nbsp;')
        assertContains('null keyword',      highlightSyntax('val x = null'),              'hl-keyword')
        console.groupEnd()

        // ---- 6b. highlightSyntax (Python) -----------------------------------
        console.group('6b. highlightSyntax – Python')
        assertContains('py def keyword',    highlightSyntax('def greet(name):', 'python'), 'hl-keyword')
        assertContains('py None keyword',   highlightSyntax('x = None', 'python'),         'hl-keyword')
        assertContains('py True keyword',   highlightSyntax('flag = True', 'python'),      'hl-keyword')
        assertContains('py class name',     highlightSyntax('p = Person()', 'python'),     'hl-class')
        assertContains('py number',         highlightSyntax('x = 42', 'python'),           'hl-number')
        assertContains('py dbl string',     highlightSyntax('s = "hi"', 'python'),         'hl-string')
        assertContains('py sgl string',     highlightSyntax("s = 'hi'", 'python'),         'hl-string')
        assertContains('py hash comment',   highlightSyntax('# Step: test', 'python'),     'hl-comment')
        assertContains('py decorator',      highlightSyntax('@staticmethod', 'python'),    'hl-class')
        assertContains('py empty = nbsp',   highlightSyntax('', 'python'),                 '&nbsp;')
        assertNotContains('py no // comment', highlightSyntax('// not a comment', 'python'), 'hl-comment')
        assertNotContains('kt no # comment',  highlightSyntax('# not a comment', 'kotlin'), 'hl-comment')
        console.groupEnd()

        // ---- 7. parseSteps -------------------------------------------------
        console.group('7. parseSteps')
        const code = `
// Step: First step
val age = 25

// Step: Second step
val p = Person("Alice", 25)
`
        let execLog = []
        const { steps, allLines } = parseSteps(code, (line, state) => execLog.push(line))
        assert('two steps parsed',                    steps.length,          2)
        assert('first description',                   steps[0].description,  'First step')
        assert('second description',                  steps[1].description,  'Second step')
        assert('first step start line',               steps[0].startLineNum, 2)
        assert('allLines includes all source lines',  allLines.length > 0,   true)
        // Execute a step and verify the line executer is called
        steps[0].execute({})
        assert('step execute calls executeLineFn',    execLog[0],            'val age = 25')
        console.groupEnd()

        // ---- 8. generateCodeView -------------------------------------------
        console.group('8. generateCodeView')
        const html = generateCodeView(['val age = 25', 'val p = Person("Alice", 25)'])
        assertContains('generates pre.code-listing',  html, 'code-listing')
        assertContains('generates code-line divs',    html, 'code-line')
        assertContains('data-line attributes',        html, 'data-line="0"')
        assertContains('second line present',         html, 'data-line="1"')
        console.groupEnd()

        // ---- Summary --------------------------------------------------------
        console.log(`\n%cSimCore Tests: ${passed} passed, ${failed} failed`,
            `font-weight: bold; color: ${failed === 0 ? '#4caf50' : '#f44336'}`)

        // Render summary into page
        const summaryEl = document.getElementById('sim-core-test-summary')
        if (summaryEl) {
            const rows = results.map(r => `
                <tr>
                    <td>${r.ok ? '✓' : '✗'}</td>
                    <td>${r.name}</td>
                    <td class="${r.ok ? 'test-pass' : 'test-fail'}">${r.ok ? 'pass' : 'FAIL'}</td>
                </tr>
            `).join('')

            summaryEl.innerHTML = `
                <p class="${failed === 0 ? 'test-all-pass' : 'test-has-fail'}">
                    <strong>${passed} passed</strong>, <strong>${failed} failed</strong>
                    - open the browser console for detailed output.
                </p>
                <table class="test-results-table">
                    <thead><tr><th></th><th>Test</th><th>Result</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            `
        }
    }

    // Script runs during Docsify's executeScript pass - defer one tick so the
    // DOM is fully injected before we try to find #sim-core-test-summary.
    setTimeout(runTests, 0)
})()
</script>

<style>
#sim-core-test-summary {
    margin-top: 1rem;
}

.test-all-pass {
    color: var(--color-success, #4caf50);
}

.test-has-fail {
    color: var(--color-attention, #f44336);
}

.test-results-table {
    width: 100%;
    border-collapse: collapse;
    font-family: var(--font-family-mono);
    font-size: 0.9em;
}

.test-results-table th,
.test-results-table td {
    padding: 0.3em 0.6em;
    border: 1px solid var(--border-color);
    text-align: left;
}

.test-results-table th {
    background: var(--color-mono-1);
    font-weight: 600;
}

.test-results-table td:first-child {
    width: 2em;
    text-align: center;
}

.test-pass {
    color: var(--color-success, #4caf50);
    font-weight: bold;
}

.test-fail {
    color: var(--color-attention, #f44336);
    font-weight: bold;
}
</style>
