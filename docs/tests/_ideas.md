# Plugin Ideas & Roadmap

This document tracks potential plugin implementations for the dt-notes educational platform.

## Completed Plugins

- ✅ **memory-sim.js** - Kotlin OOP memory visualization with stack/heap and garbage collection
- ✅ **cpu-sim.js** - TINY-8 CPU simulator with fetch-decode-execute cycle visualization

---

## High Priority

### 1. Algorithm Visualizer
**Purpose**: Step-through visualization of common algorithms
**Features**:
- Sorting algorithms (bubble, merge, quick, insertion)
- Binary search visualization
- Stack/queue/heap operations with animations
- Linked list operations with pointer movements
- Tree traversals (in-order, pre-order, post-order)

**Usage Example**:
```markdown
<algo type="bubble-sort">
[64, 34, 25, 12, 22, 11, 90]
</algo>
```

### 2. C-Style Memory Diagram
**Purpose**: Visualize low-level memory concepts (different from Kotlin memory-sim)
**Features**:
- Stack vs heap visualization for C/C++ style memory
- Pointer relationships & dereferencing
- Array memory layout
- String storage diagrams
- Pass-by-value vs pass-by-reference

**Usage Example**:
```markdown
<memory>
int x = 5;
int* ptr = &x;
int arr[3] = {1, 2, 3};
</memory>
```

---

## Medium Priority

### 3. Performance Profiler
**Purpose**: Teach algorithm complexity and performance analysis
**Features**:
- Big-O notation visualizations
- Time/space complexity comparisons
- Growth rate graphs (O(1) vs O(n) vs O(n²))
- Performance metrics display

**Usage Example**:
```markdown
<profile lang="python">
def slow_method(): ...
def optimized(): ...
</profile>
```

### 4. Recursion Tree Visualizer
**Purpose**: Help students understand recursive function calls
**Features**:
- Call stack visualization
- Tree of recursive calls
- Memoization benefits demonstration
- Base case highlighting
- Overlay actual execution order

**Usage Example**:
```markdown
<recursion>
fibonacci(5)
</recursion>
```

### 5. Code Coverage Heat Map
**Purpose**: Teaching TDD and testing concepts
**Features**:
- Show which lines of code are tested
- Visual representation of test coverage
- Highlight untested code paths
- Integration with testing frameworks

---

## Nice to Have

### 6. Color Scheme Designer
**Purpose**: Teach color theory for UI/UX design (extends existing color work)
**Features**:
- Accessibility checker (WCAG contrast ratios)
- HSL/RGB/HEX live converters
- Complementary/analogous color suggestions
- Color palette generation

### 7. Syntax Error Detective
**Purpose**: Help beginners understand and fix common errors
**Features**:
- Common error pattern highlighter
- Beginner-friendly fix suggestions
- "Learn from mistakes" teaching moments
- Links to glossary terms for concepts

### 8. Binary Calculator
**Purpose**: Teach binary arithmetic and bit operations
**Features**:
- Interactive binary arithmetic (+, -, ×, ÷)
- Bit shifting demonstrations (<<, >>)
- Two's complement visualization
- Bitwise operations (AND, OR, XOR, NOT)
- Binary/decimal/hex conversion with steps shown

**Usage Example**:
```markdown
<binary-calc>
10110101 + 11001100
</binary-calc>
```

### 9. Code Snippets Collection
**Purpose**: Searchable library of common programming patterns
**Features**:
- Searchable common patterns library
- One-click copy button
- Tags/categories by topic
- Student-submitted examples
- Language filters

---

## Top 3 Recommendations

Based on CS/programming education focus:

1. **Algorithm Visualizer** - Core to understanding how algorithms work step-by-step
2. **Recursion Tree Visualizer** - Helps students grasp one of the most challenging concepts
3. **Binary Calculator** - Essential for low-level computing concepts and bit manipulation

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
