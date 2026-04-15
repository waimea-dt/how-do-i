/**
 * docsify-memory-sim.js — Interactive memory visualization for teaching OOP concepts
 *
 * Thin plugin built on sim-core. Handles only the memory-sim grid layout and
 * wiring; all parsing, execution, state, and rendering are delegated to SimCore.
 *
 * Panels: Code | Memory (Variables + Heap)
 *
 * Usage in markdown:
 *   ```memory-sim
 *   // ClassDefs
 *   class Person(val name: String, var age: Int)
 *
 *   // Step: Create a primitive
 *   val age = 25
 *   // Step: Create an object
 *   val person = Person("Alice", 25)
 *   // Step: Copy a reference
 *   val person2 = person
 *   // Step: Modify through reference
 *   person2.age = 26
 *   ```
 *
 * Syntax:
 *   - "// ClassDefs" / "# ClassDefs" — class definitions (hidden from code view)
 *   - "// Step:" / "# Step:" — step markers (hidden from code view)
 *   - Regular comments are shown in the code view
 *   - Supports Kotlin (val x = ...) and Python (x = ...)
 *   - Field updates: obj.field = value  (nested paths supported)
 *   - Object args can be primitives or variable references
 */

;(function () {

    // -------------------------------------------------------------------------
    // Code Parser (delegated to SimCore)
    // -------------------------------------------------------------------------

    // Classes array shared across parse + execute; populated from ClassDefs block
    function makeMemoryFieldResolver(classes) {
        return SimCore.makeClassDefResolver(classes)
    }

    const parseValue = SimCore.parseValue

    // -------------------------------------------------------------------------
    // UI Generation
    // -------------------------------------------------------------------------

    function updateUI(container, memory, changes = null) {
        container.querySelector('.sim-variables-list').innerHTML = SimCore.renderVariablesView(memory, changes)
        container.querySelector('.sim-heap-list').innerHTML = SimCore.renderHeapView(memory, changes)

        SimCore.attachReferenceHandlers(container)
        SimCore.updateStepInfo(container, memory)
        SimCore.updateCodeHighlight(container, memory.steps, memory.currentStep, memory.lang)
        SimCore.syncButtonStates(container, memory)
    }

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
            const classes = []
            const fieldResolver = makeMemoryFieldResolver(classes)
            const { steps, displayLines, lang, classes: parsedClasses } = SimCore.parseSimCode(code, fieldResolver)
            classes.push(...parsedClasses)

            const memory = new SimCore.HeapState()
            memory.steps = steps
            memory.lang = lang

            // Create container
            const container = document.createElement('div')
            container.className = 'memory-sim sim-block'

            container.innerHTML = `
                <div class="memory-sim-grid">
                    <div class="memory-sim-code memory-sim-panel sim-panel">
                        ${SimCore.generateCodeView(displayLines, lang)}
                    </div>
                    <div class="memory-sim-memory memory-sim-panel sim-panel">
                        ${SimCore.renderMemoryPanel()}
                    </div>
                    <div class="memory-sim-status sim-status">
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
