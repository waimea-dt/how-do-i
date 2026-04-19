# Ideas and Things To Do

## Things to Do

- [ ] Mobile table char alignment still off
- [ ] Big-O alignment of keys / values
- [ ] Calc animate="on/off" attrib
- [ ] Tidy up the data views - borders, etc.
- [ ] Python code indent highlighting added to Python snippets
- [ ] Code runner fake input... should this be shown?


## Plugin Ideas

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

### Completed Plugins

- [x] **memory-sim.js** - Kotlin/Python OOP memory visualization with stack/heap
- [x] **oop-sim.js** - Class definitions, instantiation, field updates and method calls
- [x] **cpu-sim.js** - TINY-8 CPU simulator with fetch-decode-execute cycle visualization
- [x] **python-test.js** - Code coverage heat map for TDD education with AST-based instrumentation
- [x] **Binary Calculator** - Binary arithmetic, bit operations, two's complement
- [x] **Hashing Demo** - Live SHA-256, copy, salt (tri-state), history, binary view; rainbow table attack demo
- [x] **big-o.js** - Algorithm complexity comparison table with best/avg/worst case analysis, category filtering, and growth rate visualization
- [x] **tsp.js** - TSP tractability explorer with brute-force, nearest neighbour, and 2-opt algorithms; factorial growth visualization; heuristic vs optimal comparison modes
- [x] **sub-cypher.js** - Substitution cipher visualization with Caesar and Vigenère ciphers; instant cursor-based highlighting; frequency analysis integration; keystream display with shift values

### Completed Maintenance

- [x] Fix the Mac screen view... Worth it?
- [x] Computer screens - font size too big on mobile
- [x] Request sequence on mobile... Better to use scrolling?
- [x] Swipe on flash cards?
- [x] Video embedding
- [x] Scrolling on codeapi editor and output
- [x] Kotlin runner code font is not monospace (mobile only?) and also for codeapi
- [x] Mobile sidebar tab is small
- [x] Codeapi output box chars is broken
- [x] Images on captions and speech tests missing
- [x] Video grid thumbs too big on mobile (stick to 2 cols min)
- [x] Borders of sequence steps bolder

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

