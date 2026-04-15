/**
 * docsify-oop-sim.js — Interactive OOP visualization showing class definitions,
 * object instantiation, field updates, and method calls.
 *
 * Thin plugin built on sim-core. Handles only the oop-sim grid layout and
 * wiring; all parsing, execution, state, and rendering are delegated to SimCore.
 *
 * Panels: Code | Classes | Memory (Variables + Heap)
 *
 * Usage in markdown:
 *   ```oop-sim
 *   // Step: Define a class
 *   class Person(val name: String, var age: Int) {
 *       fun greet() {
 *           println("Hi from $name")
 *       }
 *   }
 *
 *   // Step: Create an object
 *   val person = Person("Alice", 25)
 *   // Step: Update a field
 *   person.age = 26
 *   // Step: Call a method
 *   person.greet()
 *   ```
 *
 * Syntax:
 *   - "// ClassDefs" / "# ClassDefs" — pre-declare classes (hidden from code view)
 *   - "// Step:" / "# Step:" — step markers (hidden from code view)
 *   - Regular comments are shown in the code view
 *   - Supports Kotlin and Python syntax
 *   - Inline class blocks (with methods) are parsed as a step and registered on execution
 *   - Field update: name.field = value  (nested paths supported)
 *   - Method call:  name.method()  — highlights the method in the Classes panel
 *   - Constructor highlighted as "init" (Kotlin) / "__init__" (Python) on instantiation
 */

;(function () {

    // -------------------------------------------------------------------------
    // UI Rendering
    // -------------------------------------------------------------------------

    function updateUI(container, state, changes = null) {
        clearTimeout(container._flashHighlightTimer)
        SimCore.cancelFlashCleanup(container)

        container.querySelector('.sim-classes-list').innerHTML  = SimCore.renderClassesView(state.classes)
        container.querySelector('.sim-variables-list').innerHTML = SimCore.renderVariablesView(state, changes)
        container.querySelector('.sim-heap-list').innerHTML      = SimCore.renderHeapView(state, changes)

        SimCore.applyPendingHighlight(container, state)
        SimCore.updateStepInfo(container, state)
        SimCore.updateCodeHighlight(container, state.steps, state.currentStep)
        SimCore.syncButtonStates(container, state)
        SimCore.attachReferenceHandlers(container)
    }

    // -------------------------------------------------------------------------
    // Plugin Initialization
    // -------------------------------------------------------------------------

    function processOopSims() {
        document.querySelectorAll('pre[data-lang="oop-sim"]:not(.processed)').forEach(block => {
            block.classList.add('processed')

            const code = block.textContent
            const state = new SimCore.HeapState()

            // Field resolver reads class defs from state.classes (populated at parse time)
            const fieldResolver = SimCore.makeClassDefResolver(() => state.classes)
            const { steps, displayLines, lang, classes } = SimCore.parseSimCode(code, fieldResolver)

            // Seed state with classes found in ClassDefs block (or inline class defs)
            classes.forEach(c => state.defineClass(c))
            state.lang = lang
            state.steps = steps

            const container = document.createElement('div')
            container.className = 'oop-sim sim-block'

            container.innerHTML = `
                <div class="oop-sim-grid">
                    <div class="oop-sim-code oop-sim-panel sim-panel">
                        ${SimCore.generateCodeView(displayLines, lang)}
                    </div>
                    <div class="oop-sim-classes oop-sim-panel sim-panel">
                        ${SimCore.renderClassesPanel()}
                    </div>
                    <div class="oop-sim-memory oop-sim-panel sim-panel">
                        ${SimCore.renderMemoryPanel()}
                    </div>
                    <div class="oop-sim-status sim-status">
                        <div class="step-info">Ready to execute</div>
                    </div>
                    <div class="oop-sim-controls sim-controls">
                        ${SimCore.renderControls()}
                    </div>
                </div>
            `

            block.parentNode.insertBefore(container, block)
            block.style.display = 'none'

            SimCore.setupControls(container, state, updateUI)
            updateUI(container, state, null)
        })
    }

    // -------------------------------------------------------------------------
    // Docsify Plugin
    // -------------------------------------------------------------------------

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(
        hook => hook.doneEach(() => processOopSims()),
        window.$docsify.plugins || []
    )

})()
