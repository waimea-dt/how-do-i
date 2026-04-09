/**
 * docsify-cpu-sim.js — Interactive CPU execution simulator for teaching computer architecture
 *
 * Implements the TINY-8 specification: an 8-bit educational CPU architecture.
 * Visualizes the fetch-decode-execute cycle with registers, memory, and assembly code.
 *
 * TINY-8 Architecture:
 *   - Word size: 8-bit (values 0–255)
 *   - Registers: R0, R1, R2 (general purpose)
 *   - Memory: Configurable (default: 108 bytes, addresses 0–107)
 *     - 000–099: .code section (program instructions)
 *     - 100–107: .data section (variables and data, configurable)
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
    // Configuration Constants
    // -------------------------------------------------------------------------

    const NUM_REGISTERS = 3     // Number of general-purpose registers (R0, R1, R2)
    const DATA_MEM_START = 100  // Start address of data memory section
    const DATA_MEM_SIZE = 8     // Number of data memory locations
    const DATA_MEM_END = DATA_MEM_START + DATA_MEM_SIZE - 1  // End address of data memory section (inclusive)

    // Derived patterns based on NUM_REGISTERS
    const MAX_REGISTER_INDEX = NUM_REGISTERS - 1
    const REGISTER_PATTERN = new RegExp(`^R[0-${MAX_REGISTER_INDEX}]$`)
    const REGISTER_PATTERN_I = new RegExp(`^R[0-${MAX_REGISTER_INDEX}]$`, 'i')
    const REGISTER_SYNTAX_PATTERN = new RegExp(`\\b(R[0-${MAX_REGISTER_INDEX}])\\b`)
    const REGISTER_LIST = Array.from({ length: NUM_REGISTERS }, (_, i) => `R${i}`).join(', ')  // e.g., "R0, R1, R2"

    // -------------------------------------------------------------------------
    // CPU State Model
    // -------------------------------------------------------------------------

    class CPUState {
        constructor() {
            // Initialize registers dynamically based on NUM_REGISTERS
            this.registers = {}
            for (let i = 0; i < NUM_REGISTERS; i++) {
                this.registers[`R${i}`] = 0
            }
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
            // Only increment PC if the instruction didn't modify it (e.g., JUMP)
            if (!result.pcModified) {
                this.pc++
            }
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
                    const src = operands[1]   // Register or Immediate
                    const a = this.registers[dest]
                    let b

                    if (typeof src === 'string' && src.match(REGISTER_PATTERN)) {
                        // Source is a register
                        b = this.registers[src]
                    } else {
                        // Source is an immediate value
                        b = src & 0xFF
                    }

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
                    const src = operands[1]   // Register or Immediate
                    const a = this.registers[dest]
                    let b

                    if (typeof src === 'string' && src.match(REGISTER_PATTERN)) {
                        // Source is a register
                        b = this.registers[src]
                    } else {
                        // Source is an immediate value
                        b = src & 0xFF
                    }

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
                    const dest = operands[0]  // Register
                    const src = operands[1]   // Register or Immediate
                    const a = this.registers[dest]
                    let b

                    if (typeof src === 'string' && src.match(REGISTER_PATTERN)) {
                        // Source is a register
                        b = this.registers[src]
                    } else {
                        // Source is an immediate value
                        b = src & 0xFF
                    }

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
                    const dest = operands[0]  // Register
                    const src = operands[1]   // Register or Immediate
                    const a = this.registers[dest]
                    let b

                    if (typeof src === 'string' && src.match(REGISTER_PATTERN)) {
                        // Source is a register
                        b = this.registers[src]
                    } else {
                        // Source is an immediate value
                        b = src & 0xFF
                    }

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
                        highlight: { pc: true },
                        pcModified: true
                    }
                }

                case 'JUMPZ': {
                    if (this.flags.Z === 1) {
                        const addr = this.resolveAddress(operands[0])
                        this.pc = addr
                        return {
                            phase: 'execute',
                            message: `Jumped to ${addr} (Zero flag is set)`,
                            highlight: { pc: true, flags: true },
                            pcModified: true
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
                            highlight: { pc: true, flags: true },
                            pcModified: true
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
                            highlight: { pc: true, flags: true },
                            pcModified: true
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

    const VALID_OPERATIONS = ['LOAD', 'STORE', 'COPY', 'ADD', 'SUB', 'INC', 'DEC', 'AND', 'OR', 'NOT', 'JUMP', 'JUMPZ', 'JUMPN', 'JUMPNZ', 'HALT']

    /**
     * Parse a directive line (.code or .data)
     */
    function parseDirectiveLine(line, section, program, lineIndex) {
        if (line === '.code') {
            program.push({
                op: '.CODE',
                operands: [],
                text: '.code',
                label: null,
                lineNum: lineIndex,
                isExecutable: false,
                isDirective: true
            })
            return 'code'
        }
        if (line === '.data') {
            program.push({
                op: '.DATA',
                operands: [],
                text: '.data',
                label: null,
                lineNum: lineIndex,
                isExecutable: false,
                isDirective: true
            })
            return 'data'
        }
        return null
    }

    /**
     * Parse a data definition line (label: value)
     */
    function parseDataLine(line, displayLineNum, dataAddress, labels, dataValues, program, lineIndex, errors) {
        const dataMatch = line.match(/^(\w+):\s*(-?\d+|0x[0-9a-f]+|0b[01]+)$/i)
        if (dataMatch) {
            const label = dataMatch[1]
            const valueStr = dataMatch[2]
            let value

            // Parse the value
            if (valueStr.match(/^0x/i)) {
                value = parseInt(valueStr, 16)
            } else if (valueStr.match(/^0b/i)) {
                value = parseInt(valueStr.slice(2), 2)
            } else {
                value = parseInt(valueStr, 10)
            }

            // Validate value range
            if (value < -128 || value > 255) {
                errors.push(`Line ${displayLineNum}: Data value ${valueStr} out of range (-128 to 255)`)
            }

            // Check data address limit
            if (dataAddress > DATA_MEM_END) {
                errors.push(`Line ${displayLineNum}: Data section overflow (max address is ${DATA_MEM_END})`)
            }

            value = value & 0xFF
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
            return dataAddress + 1
        } else {
            errors.push(`Line ${displayLineNum}: Invalid data definition format (expected: label: value)`)
            return dataAddress
        }
    }

    /**
     * Parse a code instruction line
     */
    function parseCodeLine(line, originalLine, displayLineNum, lineIndex, labels, pendingLabel, program, errors) {
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
            return { lineIndex, pendingLabel: labelName }
        }

        // Skip if still empty
        if (!line) {
            return { lineIndex, pendingLabel }
        }

        // Parse instruction
        const parts = line.split(/[\s,]+/).filter(p => p)
        if (parts.length === 0) {
            return { lineIndex, pendingLabel }
        }

        const op = parts[0].toUpperCase()

        // Validate operation
        if (!VALID_OPERATIONS.includes(op)) {
            errors.push(`Line ${displayLineNum}: Invalid operation '${parts[0]}' (must be one of: ${VALID_OPERATIONS.join(', ')})`)
        }

        const operandResults = parts.slice(1).map((opStr, idx) => parseOperand(opStr, displayLineNum, idx, errors))
        const operands = operandResults.filter(r => r !== null)

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

        return { lineIndex: lineIndex + 1, pendingLabel: null }
    }

    /**
     * Validate all label references in the program
     */
    function validateLabelReferences(program, labels, errors) {
        for (const instruction of program) {
            if (!instruction.isExecutable) continue

            for (const operand of instruction.operands) {
                // Check memory references
                if (typeof operand === 'object' && operand.type === 'memory') {
                    const addr = operand.value

                    // If it's a label reference
                    if (typeof addr === 'string' && !addr.match(/^\d+$/)) {
                        if (labels[addr] === undefined) {
                            errors.push(`Instruction '${instruction.text}': Undefined label '${addr}'`)
                        }
                    }
                    // If it's a numeric address
                    else if (typeof addr === 'number') {
                        if (addr < DATA_MEM_START || addr > DATA_MEM_END) {
                            errors.push(`Instruction '${instruction.text}': Memory address ${addr} out of data range (${DATA_MEM_START}-${DATA_MEM_END})`)
                        }
                    }
                }
                // Check jump target labels
                else if (typeof operand === 'string' && !operand.match(REGISTER_PATTERN)) {
                    if (labels[operand] === undefined) {
                        errors.push(`Instruction '${instruction.text}': Undefined jump target '${operand}'`)
                    }
                }
            }
        }
    }

    /**
     * Main assembly parser
     */
    function parseAssembly(text) {
        const lines = text.split('\n')
        const program = []
        const labels = {}
        const dataValues = {}  // Store initial data values
        const errors = []
        let lineIndex = 0
        let pendingLabel = null
        let section = 'code'  // Current section: 'code' or 'data'
        let dataAddress = DATA_MEM_START  // Data section starts at configured address

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim()
            const originalLine = line  // Keep original line with comments for display
            const displayLineNum = i + 1  // For error messages (1-indexed)

            // Skip empty lines
            if (!line) continue

            // Remove comments (semicolons) for parsing
            const commentIndex = line.indexOf(';')
            if (commentIndex !== -1) {
                line = line.substring(0, commentIndex).trim()
            }

            // Skip if only a comment
            if (!line) continue

            // Check for section directives
            const newSection = parseDirectiveLine(line, section, program, lineIndex)
            if (newSection) {
                section = newSection
                continue
            }

            // Handle data section
            if (section === 'data') {
                dataAddress = parseDataLine(line, displayLineNum, dataAddress, labels, dataValues, program, lineIndex, errors)
                continue
            }

            // Handle code section
            const result = parseCodeLine(line, originalLine, displayLineNum, lineIndex, labels, pendingLabel, program, errors)
            lineIndex = result.lineIndex
            pendingLabel = result.pendingLabel
        }

        // Validate label references
        validateLabelReferences(program, labels, errors)

        // If there are errors, throw them
        if (errors.length > 0) {
            throw new Error('Assembly errors:\n' + errors.join('\n'))
        }

        return { program, labels, dataValues }
    }

    function parseOperand(operand, lineNum, operandIndex, errors) {
        const originalOperand = operand

        // Memory address with brackets: [addr] or [label]
        const memMatch = operand.match(/^\[(.+)\]$/)
        if (memMatch) {
            const addr = memMatch[1]
            // Check if it's a number or a label (will be resolved later)
            if (addr.match(/^\d+$/)) {
                const numAddr = parseInt(addr)
                if (numAddr < DATA_MEM_START || numAddr > DATA_MEM_END) {
                    errors.push(`Line ${lineNum}: Memory address [${numAddr}] out of data range (${DATA_MEM_START}-${DATA_MEM_END})`)
                }
                return { type: 'memory', value: numAddr }
            }
            return { type: 'memory', value: addr }  // Label to be resolved
        }

        // Register (R0-R{MAX_REGISTER_INDEX})
        if (operand.match(REGISTER_PATTERN_I)) {
            return operand.toUpperCase()
        }

        // Invalid register
        if (operand.match(/^R\d+$/i)) {
            errors.push(`Line ${lineNum}: Invalid register '${operand}' (must be ${REGISTER_LIST})`)
            return null
        }

        // Hexadecimal literal (0xFF)
        if (operand.match(/^0x[0-9a-f]+$/i)) {
            const value = parseInt(operand, 16)
            if (value < 0 || value > 255) {
                errors.push(`Line ${lineNum}: Hexadecimal value ${operand} out of range (0x00 to 0xFF)`)
            }
            return value & 0xFF  // Ensure 8-bit value
        }

        // Binary literal (0b11001100)
        if (operand.match(/^0b[01]+$/i)) {
            const value = parseInt(operand.slice(2), 2)
            if (value < 0 || value > 255) {
                errors.push(`Line ${lineNum}: Binary value ${operand} out of range (0b00000000 to 0b11111111)`)
            }
            return value & 0xFF  // Ensure 8-bit value
        }

        // Decimal literal
        if (operand.match(/^-?\d+$/)) {
            const value = parseInt(operand, 10)
            if (value < -128 || value > 255) {
                errors.push(`Line ${lineNum}: Decimal value ${operand} out of range (-128 to 255)`)
            }
            return value & 0xFF  // Ensure 8-bit value
        }

        // Check for invalid number formats
        if (operand.match(/^0x/i)) {
            errors.push(`Line ${lineNum}: Invalid hexadecimal literal '${operand}' (must contain only 0-9, A-F)`)
            return null
        }
        if (operand.match(/^0b/i)) {
            errors.push(`Line ${lineNum}: Invalid binary literal '${operand}' (must contain only 0 and 1)`)
            return null
        }

        // Otherwise it's a label (for jumps) - will be validated later
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
                    <span class="btn-icon">▶❙</span>
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

    /**
     * Update control registers (PC and IR)
     */
    function updateControlRegisters(cpu, container, highlight) {
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
    }

    /**
     * Update general-purpose registers
     */
    function updateGeneralRegisters(cpu, container, highlight) {
        const regContainer = container.querySelector('.cpu-registers')
        if (!regContainer) return

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

    /**
     * Update CPU flags
     */
    function updateFlagsDisplay(cpu, container, highlight) {
        const flagContainer = container.querySelector('.cpu-flags')
        if (!flagContainer) return

        flagContainer.innerHTML = Object.entries(cpu.flags)
            .map(([name, value]) => `
                <span class="cpu-flag ${value === 1 ? 'active' : ''} ${highlight.flags ? 'highlight' : ''}">
                    ${name}: ${value}
                </span>
            `).join('')
    }

    /**
     * Update memory display
     */
    function updateMemoryDisplay(cpu, container, highlight) {
        const memContainer = container.querySelector('.memory-display')
        if (!memContainer) return

        // Create reverse lookup for labels (address -> label name)
        const addressLabels = {}
        Object.entries(cpu.labels).forEach(([label, addr]) => {
            if (addr >= DATA_MEM_START && addr <= DATA_MEM_END) {
                addressLabels[addr] = label
            }
        })

        memContainer.innerHTML = cpu.memory
            .slice(DATA_MEM_START, DATA_MEM_END + 1)  // Show configured data memory locations
            .map((value, index) => {
                const addr = DATA_MEM_START + index
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

    /**
     * Update code display with execution highlighting
     */
    function updateCodeDisplay(cpu, container) {
        const codeContainer = container.querySelector('.code-display')
        if (!codeContainer) return

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
                    const paddedLabel = instruction.label.substring(0, 6).padStart(6, ' ')
                    labelText = `<span class="hl-name">${escapeHtml(paddedLabel)}</span><span class="hl-punctuation">:</span>`
                    const codeWithoutLabel = instruction.text.replace(new RegExp(`^${instruction.label}:\\s*`), '')
                    formattedCode = highlightAsmSyntax(codeWithoutLabel)
                } else {
                    // No label: empty label column
                    labelText = ''
                    formattedCode = highlightAsmSyntax(instruction.text.trimStart())
                }

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
                        <span class="line-label">${labelText}</span>
                        <span class="line-code">${formattedCode}</span>
                    </div>
                `
            }).join('')
    }

    /**
     * Update phase indicator and cycle count
     */
    function updatePhaseAndCycle(cpu, container) {
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

    /**
     * Main UI update coordinator
     */
    function updateUI(cpu, container, highlight = {}) {
        updateControlRegisters(cpu, container, highlight)
        updateGeneralRegisters(cpu, container, highlight)
        updateFlagsDisplay(cpu, container, highlight)
        updateMemoryDisplay(cpu, container, highlight)
        updateCodeDisplay(cpu, container)
        updatePhaseAndCycle(cpu, container)
    }

    function escapeHtml(text) {
        const div = document.createElement('div')
        div.textContent = text
        return div.innerHTML
    }

    function clearHighlighting(cpu, container) {
        // Keep started flag true to maintain executed state
        // Reset display phase to 'fetch'
        cpu.displayPhase = 'fetch'

        // Convert current line highlighting to executed, keep all as executed
        const codeLines = container.querySelectorAll('.code-line')
        codeLines.forEach(line => {
            line.classList.remove('current-line', 'fetching', 'decoding', 'executing')
            // Add executed class to ensure all lines including the final one are dimmed
            if (!line.classList.contains('non-executable')) {
                line.classList.add('executed')
            }
        })

        // Clear line markers
        const markers = container.querySelectorAll('.line-marker')
        markers.forEach(marker => {
            marker.textContent = ''
        })

        // Clear phase indicators
        const phaseSteps = container.querySelectorAll('.phase-step')
        phaseSteps.forEach(step => {
            step.classList.remove('active')
        })

        // Remove any active highlight from flags
        const flags = container.querySelectorAll('.cpu-flag')
        flags.forEach(flag => {
            flag.classList.remove('active')
        })
    }


    function highlightAsmSyntax(code) {
        if (!code || !code.trim()) return '&nbsp;'

        let result = ''
        let remaining = code

        // Preserve leading whitespace
        const leadingSpaceMatch = code.match(/^(\s*)/)
        if (leadingSpaceMatch && leadingSpaceMatch[1]) {
            result += leadingSpaceMatch[1]
            remaining = code.slice(leadingSpaceMatch[1].length)
        }

        // Check for full-line comment
        if (remaining.trim().startsWith(';')) {
            result += `<span class="hl-comment">${remaining}</span>`
            return result
        }

        // TINY-8 specific patterns
        const patterns = [
            { regex: /;.*$/, type: 'comment' },  // Comments (semicolon to end of line)
            { regex: /^\.[a-z]+\b/i, type: 'directive' },  // Directives (.code, .data)
            { regex: /\b(LOAD|STORE|COPY|ADD|SUB|INC|DEC|AND|OR|NOT|JUMP|JUMPZ|JUMPN|JUMPNZ|HALT)\b/, type: 'operation' },  // TINY-8 operations (case-sensitive)
            { regex: REGISTER_SYNTAX_PATTERN, type: 'register' },  // TINY-8 registers (configurable)
            { regex: /\[/, type: 'bracket-open' },  // Opening bracket
            { regex: /\]/, type: 'bracket-close' },  // Closing bracket
            { regex: /\b0x[0-9a-f]+\b/i, type: 'number' },  // Hexadecimal numbers
            { regex: /\b0b[01]+\b/i, type: 'number' },  // Binary numbers
            { regex: /\b\d+\b/, type: 'number' },  // Decimal numbers
            { regex: /\b[a-zA-Z_]\w*(?=:)/, type: 'label' },  // Labels (word followed by colon)
            { regex: /\b[a-zA-Z_]\w*\b/, type: 'identifier' },  // Identifiers (labels, references)
            { regex: /:/, type: 'label-colon' },  // Colon after label
            { regex: /,/, type: 'punctuation' }  // Comma
        ]

        let pos = 0
        const tokens = []
        let inMemoryRef = false

        while (pos < remaining.length) {
            let matched = false

            for (const { regex, type } of patterns) {
                const tempRegex = new RegExp('^' + regex.source, regex.flags)
                const match = remaining.slice(pos).match(tempRegex)

                if (match) {
                    if (type === 'bracket-open') {
                        inMemoryRef = true
                    } else if (type === 'bracket-close') {
                        inMemoryRef = false
                    }

                    tokens.push({ text: match[0], type, inMemoryRef: inMemoryRef && type !== 'bracket-open' && type !== 'bracket-close' })
                    pos += match[0].length
                    matched = true
                    break
                }
            }

            if (!matched) {
                tokens.push({ text: remaining[pos], type: 'text', inMemoryRef })
                pos++
            }
        }

        // Build result from tokens
        for (const token of tokens) {
            switch (token.type) {
                case 'comment':
                    result += `<span class="hl-comment">${token.text}</span>`
                    break
                case 'directive':
                    result += `<span class="hl-atrule">${token.text}</span>`
                    break
                case 'operation':
                    result += `<span class="hl-keyword">${token.text}</span>`
                    break
                case 'register':
                    result += `<span class="hl-constant">${token.text}</span>`
                    break
                case 'bracket-open':
                case 'bracket-close':
                    result += token.text  // No highlighting for brackets themselves
                    break
                case 'number':
                    if (token.inMemoryRef) {
                        result += `<span class="hl-memory">${token.text}</span>`  // Numeric memory address
                    } else {
                        result += `<span class="hl-number">${token.text}</span>`  // Immediate value
                    }
                    break
                case 'label':
                    result += `<span class="hl-name">${token.text}</span>`
                    break
                case 'identifier':
                    if (token.inMemoryRef) {
                        // Identifier inside brackets (memory reference)
                        result += `<span class="hl-property">${token.text}</span>`
                    } else {
                        // Identifier outside brackets (jump target/label reference)
                        result += `<span class="hl-property">${token.text}</span>`
                    }
                    break
                case 'label-colon':
                    result += `<span class="hl-punctuation">${token.text}</span>`
                    break
                case 'punctuation':
                    result += `<span class="hl-punctuation">${token.text}</span>`
                    break
                case 'text':
                    // Plain text (whitespace, unrecognized characters)
                    result += token.text
                    break
                default:
                    result += token.text
            }
        }

        return result || '&nbsp;'
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
                // Clear highlighting after 1 second
                setTimeout(() => {
                    clearHighlighting(cpu, container)
                }, 1000)
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
                    // Clear highlighting after 1 second
                    setTimeout(() => {
                        clearHighlighting(cpu, container)
                    }, 1000)
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

            try {
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
            } catch (error) {
                // Display assembly errors in a user-friendly format
                const errorDiv = document.createElement('div')
                errorDiv.className = 'cpu-simulator-error'

                const errorTitle = document.createElement('strong')
                errorTitle.className = 'error-title'
                errorTitle.textContent = '⚠️ Assembly Error'

                const errorList = document.createElement('pre')
                errorList.className = 'error-message'
                errorList.textContent = error.message

                errorDiv.appendChild(errorTitle)
                errorDiv.appendChild(errorList)

                // Replace the pre element with the error display
                preElement.parentNode.replaceChild(errorDiv, preElement)
            }
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
