# Ideas and Things To Do

## Things to Do

- [ ] Mobile table char alignment still off
- [ ] Calc animate="on/off" attrib
- [ ] Tidy up the data views - borders, etc.
- [ ] Python code indent highlighting added to Python snippets
- [ ] Code runner fake input... should this be shown?


## Plugin Ideas

### Garage Door Rolling Codes Visualiser
**Purpose**: Explain how rolling codes prevent replay attacks
**Features**:
- Simulate code TX / RX
- Simulate code replay and failure
- Simulate missed RXs (codes out of step)

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


---

## Completed

### Completed Plugins

- [x] **erd.js** - Interactive SQLite ERD generator with live editing, auto-layout, and relationship visualization
- [x] **memory-sim.js** - Kotlin/Python OOP memory visualization with stack/heap
- [x] **oop-sim.js** - Class definitions, instantiation, field updates and method calls
- [x] **cpu-sim.js** - TINY-8 CPU simulator with fetch-decode-execute cycle visualization
- [x] **python-test.js** - Code coverage heat map for TDD education with AST-based instrumentation
- [x] **Binary Calculator** - Binary arithmetic, bit operations, two's complement
- [x] **Hashing Demo** - Live SHA-256, copy, salt (tri-state), history, binary view; rainbow table attack demo
- [x] **big-o.js** - Algorithm complexity comparison table with best/avg/worst case analysis, category filtering, and growth rate visualization
- [x] **tsp.js** - TSP tractability explorer with brute-force, nearest neighbour, and 2-opt algorithms; factorial growth visualization; heuristic vs optimal comparison modes
- [x] **sub-cypher.js** - Substitution cipher visualization with Caesar and Vigenère ciphers; instant cursor-based highlighting; frequency analysis integration; keystream display with shift values
- [x] **diffie-hellman.js** - Diffie-Hellman key exchange visualizer with step-by-step animation; Alice/Bob parallel calculations; public exchange visualization; eavesdropper perspective; shared secret highlighting; configurable p and g parameters

### Completed Maintenance

- [x] Big-O alignment of keys / values
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

