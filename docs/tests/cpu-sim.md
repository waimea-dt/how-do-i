# TINY-8 CPU Simulator

Interactive CPU execution simulator implementing the TINY-8 specification: an 8-bit educational CPU architecture.

**Architecture:**
- **Word size:** 8-bit (values 0–255)
- **Registers:** R0, R1, R2, R3 (general purpose)
- **Memory:** 256 bytes (addresses 0–255)
  - 0–127: `.code` section (program instructions)
  - 128–255: `.data` section (variables and data)
- **Flags:** Z (Zero), N (Negative)

**Addressing Modes:**
- **Immediate:** `5` - literal value
- **Direct:** `[addr]` or `[label]` - value stored at memory address
- **Register:** `R0` - value in register

**Assembly Format:**
- Labels followed by colon (`:`), max 6 characters
- Instructions indented by 8 spaces (or label + colon takes first 7 chars)
- Comments begin with semicolon (`;`)
- `.code` and `.data` directives separate sections

Example:
```
.code
        LOAD  R0, 5         ; semicolons for comments
loop:   DEC   R0            ; labels end with colon
        JUMPNZ loop
        HALT

.data
count:  0                   ; named memory location
result: 0
```

## Simple Addition

This example demonstrates basic arithmetic and storing results to memory.

```cpu-sim
.code
        LOAD  R0, 5
        LOAD  R1, 3
        ADD   R0, R1
        STORE R0, [result]
        HALT

.data
result: 0
```

The program:
1. Loads 5 into R0
2. Loads 3 into R1
3. Adds R1 to R0 (result: 8)
4. Stores R0 to memory location `result` (address 128)
5. Halts execution

---

## Counter with Loop

This example demonstrates loops using labels and conditional jumps.

```cpu-sim
.code
        LOAD   R0, 0
        LOAD   R1, 5
loopit: ADD    R0, R1
        DEC    R1
        JUMPNZ loopit
        STORE  R0, [sum]
        HALT

.data
sum:    0
```

The program:
1. Initializes R0 to 0 (accumulator)
2. Initializes R1 to 5 (counter)
3. Adds R1 to R0
4. Decrements R1
5. Jumps back to `loop` if R1 is not zero
6. Stores final result (sum of 5+4+3+2+1 = 15) to memory
7. Result: 15

---

## Bitwise Logic Operations

This example demonstrates the AND, OR, and NOT instructions.

```cpu-sim
.code
        LOAD  R0, 0b11111000
        LOAD  R1, 0b00011111
        AND   R0, R1         ; 00011000 (24)
        STORE R0, [and]

        LOAD  R0, 0b11100000
        LOAD  R1, 0b00000111
        OR    R0, R1         ; 11100111 (231)
        STORE R0, [or]

        LOAD  R0, 0b11000011
        NOT   R0             ; 00111100 (60)
        STORE R0, [not]
        HALT

.data
and:    0
or:     0
not:    0
```

The program demonstrates bitwise operations:
- AND: 240 & 15 = 0
- OR: 240 | 15 = 255
- NOT: ~15 = 240

---

## Data Movement

This example shows various ways to move data between registers and memory.

```cpu-sim
.code
        LOAD  R0, 42
        COPY  R1, R0
        COPY  R2, R1
        STORE R2, [value1]

        LOAD  R3, 0b00111001
        ADD   R3, 0x0A
        STORE R3, [value2]

        LOAD  R0, [value2]
        ADD   R0, R3
        STORE R0, [104]
        STORE R0, [sum]
        HALT

.data
value1: 0
value2: 0
sum:    0
```

The program demonstrates:
- LOAD immediate into register
- COPY between registers
- STORE register to memory
- LOAD from memory to register
- Arithmetic with values from memory

---

## Conditional Execution

This example uses JUMPZ to implement conditional branching.

```cpu-sim
.code
        LOAD  R0, 5
        LOAD  R1, 5
        SUB   R0, R1        ; R0 = 0, sets Z flag
        JUMPZ equal
        LOAD  R2, 1         ; Not equal path
        JUMP  done
equal:  LOAD  R2, 0         ; Equal path
done:   STORE R2, [result]
        HALT

.data
result: 0
```

The program compares R0 and R1 by subtracting them. If equal, the Zero flag is set and we jump to the `equal` label.

---

## Increment and Decrement

This example demonstrates the INC and DEC instructions.

```cpu-sim
.code
        LOAD  R0, 10
        INC   R0            ; R0 = 11
        INC   R0            ; R0 = 12
        STORE R0, [val1]

        LOAD  R1, 5
        DEC   R1            ; R1 = 4
        DEC   R1            ; R1 = 3
        STORE R1, [val2]
        HALT

.data
val1:   0
val2:   0
```

---

## Negative

This example demonstrates the INC and DEC instructions.

```cpu-sim
.code
        LOAD  R0, 126
        INC   R0            ; R0 = 127
        INC   R0            ; R0 = 128 (-128)
        STORE R0, [val1]

        LOAD  R1, 1
        DEC   R1            ; R1 = 0
        DEC   R1            ; R1 = -1 (255)
        STORE R1, [val2]
        HALT

.data
val1:   0
val2:   0
```

---

## TINY-8 Instruction Set

### Data Movement
- `LOAD Rx, value` - Load immediate value or from memory: `LOAD R0, 42` or `LOAD R0, [addr]`
- `STORE Rx, [addr]` - Store register value to memory: `STORE R0, [result]`
- `COPY Rx, Ry` - Copy value from one register to another: `COPY R0, R1`

### Arithmetic
- `ADD Rx, Ry` - Add Ry to Rx, store in Rx: `ADD R0, R1`
- `SUB Rx, Ry` - Subtract Ry from Rx, store in Rx: `SUB R0, R1`
- `INC Rx` - Increment Rx by 1: `INC R0`
- `DEC Rx` - Decrement Rx by 1: `DEC R0`

### Logic (Bitwise)
- `AND Rx, Ry` - Bitwise AND: `AND R0, R1`
- `OR Rx, Ry` - Bitwise OR: `OR R0, R1`
- `NOT Rx` - Bitwise NOT (invert all bits): `NOT R0`

### Control Flow
- `JUMP label` - Unconditional jump: `JUMP loop`
- `JUMPZ label` - Jump if Zero flag is set: `JUMPZ done`
- `JUMPN label` - Jump if Negative flag is set: `JUMPN error`
- `JUMPNZ label` - Jump if Zero flag is NOT set: `JUMPNZ loop`

### System
- `HALT` - Stop execution

### Flags
Set automatically after arithmetic and logic instructions:
- **Z (Zero):** Set if result equals 0
- **N (Negative):** Set if result > 127 (8-bit signed negative)

**Flags:**
- **Z (Zero):** Set to 1 when result equals zero
- **N (Negative):** Set to 1 when result is negative

### Control Flow
- `JMP label` - Unconditional jump to label/address
- `JZ label` - Jump if Zero flag is set
- `JNZ label` - Jump if Zero flag is clear

### System
- `HALT` - Stop program execution
- `NOP` - No operation

### Comments
Lines starting with `;` or `#` are treated as comments.

### Labels
Define labels with `name:` at the start of a line. Reference them in jump instructions.

---

## Features

- **Three-Phase Cycle**: Watch the CPU fetch, decode, and execute each instruction
- **Step-by-Step**: Execute one phase at a time to understand the process
- **Run Mode**: Auto-execute with adjustable speed (slow/normal/fast)
- **Visual Highlights**: See which registers and memory locations change
- **Flag Visualization**: Observe how Z and N flags update based on operations
- **Labels**: Write more readable programs with symbolic addresses
- **Comments**: Document your assembly code

**Configuration:**
- 4 general-purpose registers (A, B, C, D)
- 16 bytes of memory (0x1000 to 0x100F)
- 2 status flags (Z, N)
- Program Counter (PC) and Instruction Register (IR)

---

## Educational Uses

### Understanding CPU Architecture
Students can see how:
- Program Counter (PC) tracks the current instruction
- Instruction Register (IR) holds the instruction being executed
- Registers store intermediate values
- Memory holds program data
- Flags indicate computation results

### Algorithm Implementation
Practice implementing:
- Loops with counters
- Conditional logic
- Arithmetic operations
- Data structure access patterns

### Debugging Assembly
Step through programs to:
- Find logic errors
- Verify calculations
- Understand execution flow
- Trace variable values
