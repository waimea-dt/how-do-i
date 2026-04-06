/**
 * docsify-cpu-sim.js — Interactive CPU execution simulator for teaching computer architecture
 *
 * Implements the TINY-8 specification: an 8-bit educational CPU architecture.
 * Visualizes the fetch-decode-execute cycle with registers, memory, and assembly code.
 *
 * TINY-8 Architecture:
 *   - Word size: 8-bit (values 0–255)
 *   - Registers: R0, R1, R2, R3 (general purpose)
 *   - Memory: 110 bytes (addresses 0–109)
 *     - 000–099: .code section (program instructions)
 *     - 100–109: .data section (variables and data)
 *   - Flags: Z (Zero), N (Negative)
 *   - Control: PC (Program Counter), IR (Instruction Register)
 *
 * Usage in markdown:
 *   ```cpu-sim
 *   .code
 *           LOAD  R0, 5
 *   loop:   DEC   R0
 *           JUMPNZ loop
 *           HALT
 *   .data
 *   result: 0
 *   ```
 *
 * Assembly format:
 *   - Labels: max 8 chars, followed by colon
 *   - Code indented by 10 spaces (or label:__ takes first 10 chars)
 *   - Comments start with semicolon (;)
 *
 * Optional data attributes on code fence:
 *   - data-speed: "slow", "normal" (default), "fast"
 */

;(function () {

    // -------------------------------------------------------------------------
    // CPU State Model
    // -------------------------------------------------------------------------

    class CPUState {
        constructor() {
            this.registers = { R0: 0, R1: 0, R2: 0, R3: 0 }
            this.pc = 0
            this.ir = null
            this.currentInstructionAddr = 0  // Address of instruction currently in IR
            this.memory = new Array(256).fill(0)  // 256 bytes: 0-127 code, 128-255 data
            this.flags = { Z: 0, N: 0 }
            this.program = []
            this.running = false
            this.cycle = 0
            this.phase = 'fetch' // fetch | decode | execute (what to do NEXT)
            this.displayPhase = 'fetch' // What phase we're currently displaying (what we just did)
            this.started = false  // Whether execution has begun
            this.labels = {}  // Maps label names to memory addresses
        }

        reset() {
            Object.keys(this.registers).forEach(r => this.registers[r] = 0)
            this.pc = 0
            this.ir = null
            this.currentInstructionAddr = 0
            this.cycle = 0
            this.phase = 'fetch'
            this.displayPhase = 'fetch'
            this.started = false
            this.memory.fill(0)
            this.flags = { Z: 0, N: 0 }
            this.running = false
        }

        step() {
            // Remember what phase we're executing (for display)
            this.displayPhase = this.phase
            this.started = true

            if (this.phase === 'fetch') {
                return this.fetch()
            } else if (this.phase === 'decode') {
                return this.decode()
            } else if (this.phase === 'execute') {
                return this.execute()
            }
        }

        fetch() {
            // Find the program index for the current PC (instruction address)
            const programIndex = this.program.findIndex(instruction =>
                instruction.isExecutable && instruction.lineNum === this.pc
            )

            if (programIndex === -1) {
                return { done: true, message: 'Program complete' }
            }

            this.ir = this.program[programIndex]
            this.currentInstructionAddr = programIndex
            this.phase = 'decode'
            return {
                phase: 'fetch',
                message: `Fetched instruction from address ${this.pc}: ${this.ir.text}`,
                highlight: { pc: true, ir: true }
            }
        }

        decode() {
            this.phase = 'execute'
            return {
                phase: 'decode',
                message: `Decoding instruction: ${this.ir.op} ${this.ir.operands.join(', ')}`,
                highlight: { ir: true }
            }
        }

        execute() {
            const instruction = this.ir
            const result = this.executeInstruction(instruction)
            this.pc++
            this.cycle++
            this.phase = 'fetch'
            return result
        }

        executeInstruction(instruction) {
            const { op, operands } = instruction

            switch (op) {
                // Data Movement
                case 'LOAD': {
                    const dest = operands[0]  // Register
                    const src = operands[1]   // Immediate or [memory]
                    let value

                    if (typeof src === 'object' && src.type === 'memory') {
                        // Load from memory: LOAD R0, [addr]
                        const addr = this.resolveAddress(src.value)
                        value = this.memory[addr]
                        this.registers[dest] = value & 0xFF
                        return {
                            phase: 'execute',
                            message: `Loaded value ${value} from memory[${addr}] into ${dest}`,
                            highlight: { register: dest, memory: addr }
                        }
                    } else {
                        // Load immediate: LOAD R0, 42
                        value = src & 0xFF
                        this.registers[dest] = value
                        return {
                            phase: 'execute',
                            message: `Loaded value ${value} into register ${dest}`,
                            highlight: { register: dest }
                        }
                    }
                }

                case 'STORE': {
                    const src = operands[0]  // Register
                    const dest = operands[1] // [memory]
                    const addr = this.resolveAddress(dest.value)
                    const value = this.registers[src]
                    this.memory[addr] = value & 0xFF
                    return {
                        phase: 'execute',
                        message: `Stored ${src} (value: ${value}) to memory[${addr}]`,
                        highlight: { register: src, memory: addr }
                    }
                }

                case 'COPY': {
                    const dest = operands[0]  // Register
                    const src = operands[1]   // Register
                    const value = this.registers[src]
                    this.registers[dest] = value & 0xFF
                    return {
                        phase: 'execute',
                        message: `Copied ${src} (value: ${value}) to ${dest}`,
                        highlight: { register: dest }
                    }
                }

                // Arithmetic
                case 'ADD': {
                    const dest = operands[0]  // Register
                    const src = operands[1]   // Register
                    const a = this.registers[dest]
                    const b = this.registers[src]
                    const sum = (a + b) & 0xFF
                    this.registers[dest] = sum
                    this.updateFlags(sum)
                    return {
                        phase: 'execute',
                        message: `Added ${src} (${b}) to ${dest} (${a}) = ${sum}`,
                        highlight: { register: dest, flags: true }
                    }
                }

                case 'SUB': {
                    const dest = operands[0]  // Register
                    const src = operands[1]   // Register
                    const a = this.registers[dest]
                    const b = this.registers[src]
                    let diff = a - b
                    // Handle negative values (8-bit wraparound)
                    if (diff < 0) diff = 256 + diff
                    diff = diff & 0xFF
                    this.registers[dest] = diff
                    this.updateFlags(diff)
                    return {
                        phase: 'execute',
                        message: `Subtracted ${src} (${b}) from ${dest} (${a}) = ${diff}`,
                        highlight: { register: dest, flags: true }
                    }
                }

                case 'INC': {
                    const reg = operands[0]
                    const value = (this.registers[reg] + 1) & 0xFF
                    this.registers[reg] = value
                    this.updateFlags(value)
                    return {
                        phase: 'execute',
                        message: `Incremented ${reg} to ${value}`,
                        highlight: { register: reg, flags: true }
                    }
                }

                case 'DEC': {
                    const reg = operands[0]
                    let value = this.registers[reg] - 1
                    if (value < 0) value = 255
                    value = value & 0xFF
                    this.registers[reg] = value
                    this.updateFlags(value)
                    return {
                        phase: 'execute',
                        message: `Decremented ${reg} to ${value}`,
                        highlight: { register: reg, flags: true }
                    }
                }

                // Logic
                case 'AND': {
                    const dest = operands[0]
                    const src = operands[1]
                    const a = this.registers[dest]
                    const b = this.registers[src]
                    const result = (a & b) & 0xFF
                    this.registers[dest] = result
                    this.updateFlags(result)
                    return {
                        phase: 'execute',
                        message: `AND ${dest} (${a}) with ${src} (${b}) = ${result}`,
                        highlight: { register: dest, flags: true }
                    }
                }

                case 'OR': {
                    const dest = operands[0]
                    const src = operands[1]
                    const a = this.registers[dest]
                    const b = this.registers[src]
                    const result = (a | b) & 0xFF
                    this.registers[dest] = result
                    this.updateFlags(result)
                    return {
                        phase: 'execute',
                        message: `OR ${dest} (${a}) with ${src} (${b}) = ${result}`,
                        highlight: { register: dest, flags: true }
                    }
                }

                case 'NOT': {
                    const reg = operands[0]
                    const value = this.registers[reg]
                    const result = (~value) & 0xFF
                    this.registers[reg] = result
                    this.updateFlags(result)
                    return {
                        phase: 'execute',
                        message: `NOT ${reg} (${value}) = ${result}`,
                        highlight: { register: reg, flags: true }
                    }
                }

                // Control Flow
                case 'JUMP': {
                    const addr = this.resolveAddress(operands[0])
                    this.pc = addr
                    return {
                        phase: 'execute',
                        message: `Jumped to address ${addr}`,
                        highlight: { pc: true }
                    }
                }

                case 'JUMPZ': {
                    if (this.flags.Z === 1) {
                        const addr = this.resolveAddress(operands[0])
                        this.pc = addr
                        return {
                            phase: 'execute',
                            message: `Jumped to ${addr} (Zero flag is set)`,
                            highlight: { pc: true, flags: true }
                        }
                    }
                    return {
                        phase: 'execute',
                        message: `No jump (Zero flag is not set)`,
                        highlight: { flags: true }
                    }
                }

                case 'JUMPN': {
                    if (this.flags.N === 1) {
                        const addr = this.resolveAddress(operands[0])
                        this.pc = addr
                        return {
                            phase: 'execute',
                            message: `Jumped to ${addr} (Negative flag is set)`,
                            highlight: { pc: true, flags: true }
                        }
                    }
                    return {
                        phase: 'execute',
                        message: `No jump (Negative flag is not set)`,
                        highlight: { flags: true }
                    }
                }

                case 'JUMPNZ': {
                    if (this.flags.Z === 0) {
                        const addr = this.resolveAddress(operands[0])
                        this.pc = addr
                        return {
                            phase: 'execute',
                            message: `Jumped to ${addr} (Zero flag is clear)`,
                            highlight: { pc: true, flags: true }
                        }
                    }
                    return {
                        phase: 'execute',
                        message: `No jump (Zero flag is set)`,
                        highlight: { flags: true }
                    }
                }

                // System
                case 'HALT': {
                    this.running = false
                    return {
                        phase: 'execute',
                        message: 'Program halted',
                        done: true
                    }
                }

                default:
                    return {
                        phase: 'execute',
                        message: `Unknown instruction: ${op}`,
                        error: true
                    }
            }
        }

        updateFlags(value) {
            this.flags.Z = (value === 0) ? 1 : 0
            this.flags.N = (value > 127) ? 1 : 0  // 8-bit negative is > 127
        }

        resolveAddress(operand) {
            // Check if it's a label
            if (this.labels[operand] !== undefined) {
                return this.labels[operand]
            }
            // Otherwise treat as numeric value (0-255)
            const addr = typeof operand === 'number' ? operand : parseInt(operand)
            return addr & 0xFF  // Ensure 8-bit address
        }
    }

    // -------------------------------------------------------------------------
    // Assembly Parser
    // -------------------------------------------------------------------------

    function parseAssembly(text) {
        const lines = text.split('\n')
        const program = []
        const labels = {}
        const dataValues = {}  // Store initial data values
        let lineIndex = 0
        let pendingLabel = null
        let section = 'code'  // Current section: 'code' or 'data'
        let dataAddress = 100  // Data section starts at address 100

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim()
            const originalLine = line  // Keep original line with comments for display

            // Skip empty lines
            if (!line) {
                continue
            }

            // Remove comments (semicolons) for parsing
            const commentIndex = line.indexOf(';')
            if (commentIndex !== -1) {
                line = line.substring(0, commentIndex).trim()
            }

            // Skip if only a comment
            if (!line) {
                continue
            }

            // Check for section directives
            if (line === '.code') {
                section = 'code'
                program.push({
                    op: '.CODE',
                    operands: [],
                    text: '.code',
                    label: null,
                    lineNum: lineIndex,
                    isExecutable: false,
                    isDirective: true
                })
                continue
            }
            if (line === '.data') {
                section = 'data'
                program.push({
                    op: '.DATA',
                    operands: [],
                    text: '.data',
                    label: null,
                    lineNum: lineIndex,
                    isExecutable: false,
                    isDirective: true
                })
                continue
            }

            // Handle data section
            if (section === 'data') {
                // Format: label: value
                const dataMatch = line.match(/^(\w+):\s*(-?\d+)$/)
                if (dataMatch) {
                    const label = dataMatch[1]
                    const value = parseInt(dataMatch[2]) & 0xFF
                    labels[label] = dataAddress
                    dataValues[dataAddress] = value
                    // Add to program as non-executable line
                    program.push({
                        op: 'DATA',
                        operands: [],
                        text: line,
                        label: label,
                        lineNum: lineIndex,
                        memoryAddress: dataAddress,
                        isExecutable: false
                    })
                    dataAddress++
                }
                continue
            }

            // Handle code section
            let labelName = null
            let displayText = originalLine  // Use original line with comments for display

            // Check for label (ends with colon, may be inline or standalone)
            const labelMatch = line.match(/^(\w+):/)
            if (labelMatch) {
                labelName = labelMatch[1]
                line = line.substring(labelMatch[0].length).trim()
                // displayText already has the full original line with label and comment
                if (line) {
                    labels[labelName] = lineIndex  // Inline label - set address now
                }
            }

            // If label is on its own line, save it for the next instruction
            if (!line && labelName) {
                pendingLabel = labelName
                continue
            }

            // Skip if still empty
            if (!line) {
                continue
            }

            // Parse instruction
            const parts = line.split(/[\s,]+/).filter(p => p)
            if (parts.length === 0) continue

            const op = parts[0].toUpperCase()
            const operands = parts.slice(1).map(parseOperand)

            // If we have a pending label, attach it and update display text
            if (pendingLabel) {
                labelName = pendingLabel
                displayText = `${pendingLabel}: ${displayText}`
                labels[pendingLabel] = lineIndex  // Set label address to this instruction
                pendingLabel = null
            }

            program.push({
                op,
                operands,
                text: displayText,
                label: labelName,
                lineNum: lineIndex,
                isExecutable: true
            })

            lineIndex++
        }

        return { program, labels, dataValues }
    }

    function parseOperand(operand) {
        // Memory address with brackets: [addr] or [label]
        const memMatch = operand.match(/^\[(.+)\]$/)
        if (memMatch) {
            const addr = memMatch[1]
            // Check if it's a number or a label (will be resolved later)
            if (addr.match(/^\d+$/)) {
                return { type: 'memory', value: parseInt(addr) }
            }
            return { type: 'memory', value: addr }  // Label to be resolved
        }

        // Register (R0, R1, R2, R3)
        if (operand.match(/^R[0-3]$/i)) {
            return operand.toUpperCase()
        }

        // Decimal literal
        if (operand.match(/^-?\d+$/)) {
            const value = parseInt(operand, 10)
            return value & 0xFF  // Ensure 8-bit value
        }

        // Otherwise it's a label (for jumps)
        return operand
    }

    // -------------------------------------------------------------------------
    // UI Generation
    // -------------------------------------------------------------------------

    function createCpuUI(cpu) {
        const wrapper = document.createElement('div')
        wrapper.className = 'cpu-simulator'

        wrapper.innerHTML = `
            <div class="cpu-sim-grid">
                <div class="cpu-sim-panel cpu-sim-state">
                    <div class="cpu-sim-section">
                        <h4>Control Unit</h4>
                        <div class="cpu-control">
                            <div class="control-register pc-register">
                                <span class="reg-label">PC</span>
                                <span class="reg-value" data-reg="pc">000</span>
                            </div>
                            <div class="control-register ir-register">
                                <span class="reg-label">IR</span>
                                <span class="reg-value" data-reg="ir">—</span>
                            </div>
                        </div>
                    </div>

                    <div class="cpu-sim-section">
                        <h4>Registers</h4>
                        <div class="cpu-registers"></div>
                    </div>

                    <div class="cpu-sim-section">
                        <h4>Flags</h4>
                        <div class="cpu-flags"></div>
                    </div>
                </div>

                <div class="cpu-sim-panel cpu-sim-memory">
                    <h4>Data Memory</h4>
                    <div class="memory-display"></div>
                </div>

                <div class="cpu-sim-panel cpu-sim-code">
                    <h4>Program</h4>
                    <div class="code-display"></div>
                </div>

                <div class="cpu-sim-status">
                <div class="status-top">
                    <div class="status-phase">
                        <span class="phase-label">Phase:</span>
                        <span class="phase-indicator">
                            <span class="phase-step fetch">Fetch</span>
                            <span class="phase-arrow">→</span>
                            <span class="phase-step decode">Decode</span>
                            <span class="phase-arrow">→</span>
                            <span class="phase-step execute">Execute</span>
                        </span>
                    </div>
                    <div class="status-cycle">
                        <span>Cycle: <strong class="stat-cycle">0</strong></span>
                    </div>
                </div>
                <div class="status-message">Ready to execute</div>
                </div>

                <div class="cpu-sim-controls">
                <button class="cpu-btn cpu-btn-run" title="Run continuously">
                    <span class="btn-icon">▶</span>
                    <span class="btn-text">Run</span>
                </button>
                <button class="cpu-btn cpu-btn-step" title="Execute one phase">
                    <span class="btn-icon">▶|</span>
                    <span class="btn-text">Step</span>
                </button>
                <button class="cpu-btn cpu-btn-reset" title="Reset CPU to initial state">
                    <span class="btn-icon">⟲</span>
                    <span class="btn-text">Reset</span>
                </button>
                <div class="cpu-speed-control">
                    <label for="speed-select">Speed:</label>
                    <select class="cpu-speed-select" id="speed-select">
                        <option value="2000">Slow (2s)</option>
                        <option value="1000" selected>Normal (1s)</option>
                        <option value="500">Fast (0.5s)</option>
                        <option value="200">Very Fast</option>
                    </select>
                </div>
            </div>
        </div>
        `

        return wrapper
    }

    function updateUI(cpu, container, highlight = {}) {
        // Update PC (12-bit address as 3-digit hex)
        const pcValue = container.querySelector('[data-reg="pc"]')
        if (pcValue) {
            pcValue.textContent = cpu.pc.toString().toUpperCase().padStart(3, '0')
            pcValue.parentElement.classList.toggle('highlight', !!highlight.pc)
        }

        // Update IR
        const irValue = container.querySelector('[data-reg="ir"]')
        if (irValue) {
            if (cpu.ir) {
                // Format operands for display
                const formattedOps = cpu.ir.operands.map(op => {
                    if (typeof op === 'object' && op.type === 'memory') {
                        return `[${op.value}]`
                    }
                    return op
                })
                irValue.textContent = `${cpu.ir.op} ${formattedOps.join(', ')}`
            } else {
                irValue.textContent = '—'
            }
            irValue.parentElement.classList.toggle('highlight', !!highlight.ir)
        }

        // Update registers
        const regContainer = container.querySelector('.cpu-registers')
        if (regContainer) {
            regContainer.innerHTML = Object.entries(cpu.registers)
                .map(([name, value]) => {
                    // Calculate signed value for display (8-bit two's complement)
                    const hexDisplay = value.toString(16).toUpperCase().padStart(2, '0')
                    const binDisplay = value.toString(2).padStart(8, '0')
                    const signedValue = value > 127 ? value - 256 : null
                    const signedDisplay = signedValue !== null ? `${signedValue}` : ''

                    return `
                        <div class="cpu-register ${highlight.register === name ? 'highlight' : ''}">
                            <span class="reg-label">${name}</span>
                            <span class="reg-value">${value.toString().padStart(3, '0')}</span>
                            <span class="reg-alt-value">${hexDisplay}<sub>16</sub> ${binDisplay}<sub>2</sub> ${signedDisplay}</span>
                        </div>
                    `
                }).join('')
        }

        // Update flags
        const flagContainer = container.querySelector('.cpu-flags')
        if (flagContainer) {
            flagContainer.innerHTML = Object.entries(cpu.flags)
                .map(([name, value]) => `
                    <span class="cpu-flag ${value === 1 ? 'active' : ''} ${highlight.flags ? 'highlight' : ''}">
                        ${name}: ${value}
                    </span>
                `).join('')
        }

        // Update memory (addresses 100-109)
        const memContainer = container.querySelector('.memory-display')
        if (memContainer) {
            // Create reverse lookup for labels (address -> label name)
            const addressLabels = {}
            Object.entries(cpu.labels).forEach(([label, addr]) => {
                if (addr >= 100 && addr < 110) {
                    addressLabels[addr] = label
                }
            })

            memContainer.innerHTML = cpu.memory
                .slice(100, 110)  // Show 10 memory locations
                .map((value, index) => {
                    const addr = 100 + index
                    const label = addressLabels[addr] || ''
                    return `
                        <div class="memory-cell ${highlight.memory === addr ? 'highlight' : ''}">
                            <span class="mem-addr">${addr.toString().padStart(3, '0')}</span>
                            <span class="mem-value">${value.toString().padStart(3, '0')}</span>
                            ${label ? `<span class="mem-label">${label.substring(0, 6)}</span>` : '<span class="mem-label"></span>'}
                        </div>
                    `
                }).join('')
        }

        // Update code display
        const codeContainer = container.querySelector('.code-display')
        if (codeContainer) {
            codeContainer.innerHTML = cpu.program
                .map((instruction, idx) => {
                    let className = 'code-line'
                    let marker = ''

                    // Non-executable lines (directives and data) don't get highlighting
                    if (instruction.isExecutable === false) {
                        className += ' non-executable'
                        if (instruction.isDirective) {
                            className += ' directive'
                        }
                    } else {
                        if (cpu.started && instruction.lineNum === cpu.pc && cpu.displayPhase === 'fetch') {
                            className += ' current-line fetching'
                            marker = '→'
                        } else if (cpu.started && idx === cpu.currentInstructionAddr && cpu.displayPhase === 'decode') {
                            className += ' current-line decoding'
                            marker = '?'
                        } else if (cpu.started && idx === cpu.currentInstructionAddr && cpu.displayPhase === 'execute') {
                            className += ' current-line executing'
                            marker = '▶'
                        } else if (cpu.started && instruction.lineNum < cpu.pc) {
                            className += ' executed'
                        }
                    }

                    // Format the code text and label separately
                    let labelText = ''
                    let formattedCode = ''

                    if (instruction.label) {
                        // Label in its own column, code without label
                        labelText = instruction.label.substring(0, 6).padStart(6, ' ') + ':'
                        const codeWithoutLabel = instruction.text.replace(new RegExp(`^${instruction.label}:\\s*`), '')
                        formattedCode = codeWithoutLabel
                    } else {
                        // No label: empty label column
                        labelText = ''
                        formattedCode = instruction.text.trimStart()
                    }

                    // Escape HTML
                    formattedCode = escapeHtml(formattedCode)

                    // Highlight comments
                    formattedCode = formattedCode.replace(
                        /(;.*)$/,
                        '<span class="code-comment">$1</span>'
                    )

                    // Determine what to show in the line number column
                    let lineNumDisplay = ''
                    if (instruction.isDirective) {
                        // Directives (.code, .data) don't show line numbers
                        lineNumDisplay = ''
                    } else if (instruction.memoryAddress !== undefined) {
                        // Data definitions show their memory address
                        lineNumDisplay = instruction.memoryAddress.toString().padStart(3, '0')
                    } else {
                        // Regular code shows instruction address
                        lineNumDisplay = instruction.lineNum.toString().padStart(3, '0')
                    }

                    return `
                        <div class="${className}">
                            <span class="line-marker">${marker}</span>
                            <span class="line-num">${lineNumDisplay}</span>
                            <span class="line-label">${escapeHtml(labelText)}</span>
                            <span class="line-code">${formattedCode}</span>
                        </div>
                    `
                }).join('')
        }

        // Update phase indicator
        const phaseSteps = container.querySelectorAll('.phase-step')
        phaseSteps.forEach(step => {
            step.classList.remove('active')
        })
        if (cpu.started) {
            const currentPhase = container.querySelector(`.phase-step.${cpu.displayPhase}`)
            if (currentPhase) {
                currentPhase.classList.add('active')
            }
        }

        // Update cycle count
        const cycleCount = container.querySelector('.stat-cycle')
        if (cycleCount) {
            cycleCount.textContent = cpu.cycle
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div')
        div.textContent = text
        return div.innerHTML
    }

    // -------------------------------------------------------------------------
    // Control Logic
    // -------------------------------------------------------------------------

    function setupControls(cpu, container, options) {
        let runInterval = null
        let speed = parseInt(options.speed || 1000)

        const btnReset = container.querySelector('.cpu-btn-reset')
        const btnStep = container.querySelector('.cpu-btn-step')
        const btnRun = container.querySelector('.cpu-btn-run')
        const speedSelect = container.querySelector('.cpu-speed-select')
        const statusMessage = container.querySelector('.status-message')

        function stopRunning() {
            if (runInterval) {
                clearInterval(runInterval)
                runInterval = null
            }
            btnRun.querySelector('.btn-text').textContent = 'Run'
            btnRun.querySelector('.btn-icon').textContent = '▶'
            btnRun.classList.remove('running')
        }

        btnReset.addEventListener('click', () => {
            stopRunning()
            cpu.reset()
            updateUI(cpu, container)
            statusMessage.textContent = 'CPU reset to initial state'
            btnStep.disabled = false
            btnRun.disabled = false
        })

        btnStep.addEventListener('click', () => {
            stopRunning()
            const result = cpu.step()
            updateUI(cpu, container, result.highlight || {})
            statusMessage.textContent = result.message || 'Step executed'

            if (result.done) {
                btnStep.disabled = true
                btnRun.disabled = true
            }
        })

        btnRun.addEventListener('click', () => {
            if (runInterval) {
                stopRunning()
                return
            }

            btnRun.querySelector('.btn-text').textContent = 'Pause'
            btnRun.querySelector('.btn-icon').textContent = '⏸'
            btnRun.classList.add('running')

            runInterval = setInterval(() => {
                const result = cpu.step()
                updateUI(cpu, container, result.highlight || {})
                statusMessage.textContent = result.message || 'Running...'

                if (result.done) {
                    stopRunning()
                    btnStep.disabled = true
                    btnRun.disabled = true
                    statusMessage.textContent = result.message || 'Program complete'
                }
            }, speed)
        })

        speedSelect.addEventListener('change', (e) => {
            speed = parseInt(e.target.value)
            if (runInterval) {
                stopRunning()
                btnRun.click() // Restart with new speed
            }
        })
    }

    // -------------------------------------------------------------------------
    // Main Plugin Function
    // -------------------------------------------------------------------------

    function processCPUSimulators() {
        // Look for code blocks with cpu-sim language identifier
        const codeBlocks = document.querySelectorAll('pre[data-lang="cpu-sim"]:not(.processed)')

        codeBlocks.forEach((element, index) => {
            const preElement = element
            const codeElement = element.querySelector('code')

            // Mark as processed
            preElement.classList.add('processed')
            if (codeElement) codeElement.classList.add('processed')

            // Get the code content
            const code = codeElement ? codeElement.textContent.trim() : preElement.textContent.trim()

            // Speed can be set with a data attribute or default to normal
            const speed = preElement.getAttribute('data-speed') || 'normal'

            const speedMap = {
                'slow': 2000,
                'normal': 1000,
                'fast': 500
            }

            const cpu = new CPUState()

            const { program, labels, dataValues } = parseAssembly(code)

            cpu.program = program
            cpu.labels = labels

            // Initialize data memory with values from .data section
            if (dataValues) {
                Object.entries(dataValues).forEach(([addr, value]) => {
                    cpu.memory[addr] = value
                })
            }

            const ui = createCpuUI(cpu)

            // Replace the pre element with the simulator UI
            preElement.parentNode.replaceChild(ui, preElement)

            updateUI(cpu, ui)
            setupControls(cpu, ui, { speed: speedMap[speed] || 1000 })
        })
    }

    // -------------------------------------------------------------------------
    // Register Docsify Plugin
    // -------------------------------------------------------------------------

    if (window.$docsify) {
        window.$docsify.plugins = (window.$docsify.plugins || []).concat(
            function (hook) {
                hook.doneEach(function () {
                    processCPUSimulators()
                })
            }
        )
    }

})()
