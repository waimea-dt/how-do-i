# Plugin Ideas

## Ideas

### Cipher Stepper
**Purpose**: Step through classical encryption to build intuition before modern crypto
**Features**:
- Caesar cipher: character-by-character shifting with key highlighted
- Vigenère cipher: repeating key shown aligned above plaintext
- Frequency analysis panel showing letter distribution
- Encrypt and decrypt modes

### Diffie-Hellman Visualizer
**Purpose**: Explain public-key exchange using the colour-mixing metaphor
**Features**:
- Stepped Alice/Bob protocol with colour swatches for public/private values
- Actual modular arithmetic shown at each stage (gᵃ mod p, gᵇ mod p, etc.)
- "Eavesdropper can see" vs "kept secret" visual separation

### Algorithm Race
**Purpose**: Show algorithmic complexity through direct comparison
**Features**:
- Run two algorithms side-by-side (e.g. linear vs binary search, bubble vs merge sort)
- Live operation counter for each
- Input-size slider to scale the problem

### Algorithm Visualizer
**Purpose**: Step-through visualization of common algorithms
**Features**:
- Sorting algorithms (bubble, merge, quick, insertion)
- Binary search visualization
- Stack/queue/heap operations with animations
- Linked list operations with pointer movements
- Tree traversals (in-order, pre-order, post-order)

### Color Scheme Designer
**Purpose**: Teach color theory for UI/UX design (extends existing color work)
**Features**:
- Accessibility checker (WCAG contrast ratios)
- HSL/RGB/HEX live converters
- Complementary/analogous color suggestions
- Color palette generation

### Syntax Error Detective
**Purpose**: Help beginners understand and fix common errors
**Features**:
- Common error pattern highlighter
- Beginner-friendly fix suggestions
- "Learn from mistakes" teaching moments
- Links to glossary terms for concepts

### Code Snippets Collection
**Purpose**: Searchable library of common programming patterns
**Features**:
- Searchable common patterns library
- One-click copy button
- Tags/categories by topic
- Student-submitted examples
- Language filters

---

## Completed

- ✅ **memory-sim.js** - Kotlin/Python OOP memory visualization with stack/heap
- ✅ **oop-sim.js** - Class definitions, instantiation, field updates and method calls
- ✅ **cpu-sim.js** - TINY-8 CPU simulator with fetch-decode-execute cycle visualization
- ✅ **python-test.js** - Code coverage heat map for TDD education with AST-based instrumentation
- ✅ **Binary Calculator** - Binary arithmetic, bit operations, two's complement
- ✅ **Hashing Demo** - Live SHA-256, copy, salt (tri-state), history, binary view; rainbow table attack demo
- ✅ **big-o.js** - Algorithm complexity comparison table with best/avg/worst case analysis, category filtering, and growth rate visualization
- ✅ **tsp.js** - TSP tractability explorer with brute-force, nearest neighbour, and 2-opt algorithms; factorial growth visualization; heuristic vs optimal comparison modes

---

## Implementation Notes

When building new plugins:
- Follow existing patterns from memory-sim.js and cpu-sim.js
- Use nested CSS with theme color variables
- Implement step-by-step controls (Next, Reset, Run)
- Add syntax highlighting for code display
- Include comprehensive error validation
- Auto-clear highlights after completion (with 1s delay)
- Keep executed code dimmed for visual history

