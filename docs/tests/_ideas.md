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

### Growth Curve Plotter
**Purpose**: Build intuition for Big-O growth rates
**Features**:
- Overlaid curves for O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ)
- Draggable input-size slider watching lines diverge
- Highlight which class a given algorithm falls into

### Tractability Explorer
**Purpose**: Demonstrate the combinatorial explosion of intractable problems
**Features**:
- TSP brute-force for small n (≤8 cities), counting routes tried
- Show n! growth alongside the live search
- Contrast with a greedy heuristic running in O(n²)

### Algorithm Visualizer
**Purpose**: Step-through visualization of common algorithms
**Features**:
- Sorting algorithms (bubble, merge, quick, insertion)
- Binary search visualization
- Stack/queue/heap operations with animations
- Linked list operations with pointer movements
- Tree traversals (in-order, pre-order, post-order)

### Performance Profiler
**Purpose**: Teach algorithm complexity and performance analysis
**Features**:
- Big-O notation visualizations
- Time/space complexity comparisons
- Growth rate graphs (O(1) vs O(n) vs O(n²))
- Performance metrics display

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

