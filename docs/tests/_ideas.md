# Ideas and Things To Do

## Things to Do

- [ ] Mobile table char alignment still off
- [ ] Calc animate="on/off" attribute
- [ ] Tidy up the data views - borders, etc.
- [ ] Python code indent highlighting added to Python snippets
- [ ] Code runner fake input... should this be shown?


## Plugin Ideas

### NCEA Level 3: Complexity & Tractability

#### growth-race.js - Polynomial vs Exponential Showdown
**Purpose**: Animate growth rates at different input sizes
**Features**:
- Racing bars: O(n) vs O(n²) vs O(2ⁿ) vs O(n!) grow simultaneously
- Input slider: n = 5 → 10 → 15 (watch factorial explode)
- Time equivalents: "1ms → 1 hour → 13 years" for n=20
- Crossing point finder: When does O(n²) beat O(n log n)?
- Interactive legend: Click complexity → highlight corresponding curve

#### knapsack-solver.js - 0/1 Knapsack with Algorithms
**Purpose**: Compare brute-force vs dynamic programming vs greedy heuristic
**Features**:
- Item builder: Add items (weight, value) with visual icons
- Three solvers:
  - Brute-force: Show all 2ⁿ combinations (tree visualization)
  - Dynamic programming: DP table fill animation
  - Greedy heuristic: Value/weight ratio (fast but approximate)
- Comparison table: Solution quality + time taken + operations counted
- Highlight NP-complete: Brute-force explodes beyond ~20 items

#### p-np-demo.js - Complexity Class Visualizer
**Purpose**: Illustrate P, NP, NP-complete relationships
**Features**:
- Venn diagram animation: P ⊆ NP, NP-complete boundary
- Problem cards: Drag problems into correct class (sorting → P, TSP → NP-complete)
- Reduction demo: Show how solving one NP-complete problem solves all
- Verification vs solving: "Check solution in O(n²) but find it in O(2ⁿ)"
- P=NP toggle: "What if P=NP?" (show diagram collapse)

#### sorting-race.js - Algorithm Head-to-Head Visualizer
**Purpose**: Watch multiple sorting algorithms compete on same data
**Features**:
- Multi-track view: 4 algorithms sort simultaneously
- Operation counters: Comparisons + swaps per algorithm
- Input scenarios: Random, sorted, reverse, nearly-sorted
- Best/Avg/Worst annotations: Highlight when each case occurs
- Speed control: Slow-mo to see bubble sort's inefficiency
- Color coding: Active comparison (yellow), swap (red), sorted (green)

#### approximation-demo.js - Heuristic Quality Evaluator
**Purpose**: Show trade-off between speed and solution quality
**Features**:
- Problem selector: TSP, Knapsack, Bin Packing, Graph Coloring
- Algorithm slider: Optimal → Good Heuristic → Fast Greedy
- Quality meter: % of optimal solution (e.g., "92% optimal in 0.01s vs 100% in 45s")
- Real-world context: "Delivery routes don't need perfection"
- Scaling demo: Show where brute-force becomes impractical (crossover point)

### NCEA Level 2: Encryption

#### sym-asym.js - Side-by-Side Encryption Comparison
**Purpose**: Visually contrast symmetric vs asymmetric encryption flows
**Features**:
- Dual-mode view: Toggle between symmetric (AES) and asymmetric (RSA)
- Message flow animation: Alice → Bob with key icons
- Key visualization: Single shared key vs public/private key pair
- Performance counter: Show encryption speed difference
- Interceptor view: What Eve can/cannot decrypt

#### vpn-tunnel.js - VPN Encryption Visualizer
**Purpose**: Show how VPNs encrypt traffic through "tunnels"
**Features**:
- 3-stage animation: Device → VPN Server → Internet
- Packet visualization: Plain text → Encrypted → Plain text
- ISP view toggle: Show what ISP sees (encrypted blob) vs what website sees
- School scenario: "Student laptop → School VPN → YouTube" pathway
- Attack surface comparison: With/without VPN

#### wifi-handshake.js - WPA2/WPA3 4-Way Handshake
**Purpose**: Demonstrate how Wi-Fi encryption is established
**Features**:
- Step-by-step animation: Device ↔ Router (4 messages)
- Key derivation tree: PSK → PMK → PTK visualization
- WPA2 vs WPA3 comparison mode: Show SAE (Simultaneous Authentication of Equals) improvement
- School network context: "Guest" vs "Staff-WPA3-Enterprise" scenarios
- Attack resistance: Why WPA3 blocks offline dictionary attacks

#### password-manager.js - Master Password + Vault Demo
**Purpose**: Show how password managers encrypt/decrypt credentials
**Features**:
- Master password entry: Trigger key derivation (PBKDF2 animation)
- Vault visualization: Show encrypted blob → decrypted credentials
- Auto-generate password: Entropy meter (weak → strong animation)
- Compare storage: Plain text file vs encrypted vault
- Breach scenario: What attackers get (encrypted vault vs plain passwords)

#### digital-signature.js - Message Signing & Verification
**Purpose**: Visualize how signatures prove authenticity
**Features**:
- Sign mode: Alice hashes message → encrypts with private key → signature
- Verify mode: Bob decrypts signature with Alice's public key → compares hash
- Tampering demo: Change 1 character → signature verification fails
- Trust chain: Show how certificates chain up to root CA
- Real-world use: Code signing, email signatures

### NCEA Level 1: Human-Computer Interfaces (HCI)

#### heuristic-checker.js - Nielsen's 10 Heuristics Interactive Evaluator
**Purpose**: Teach students to identify and apply Nielsen's usability heuristics
**Features**:
- Upload/paste screenshots of interfaces (or use pre-loaded examples)
- Heuristic checklist: 10 heuristics with expandable explanations
- Annotation mode: Click interface → tag with heuristic violation/success
- Severity rating: Minor/Major/Critical for each issue found
- Report generator: Export findings with screenshots + explanations
- Example gallery: Good vs bad implementations for each heuristic

#### interface-compare.js - Side-by-Side Usability Comparison
**Purpose**: Compare usability of two interfaces performing the same task
**Features**:
- Dual-frame view: Display two interfaces side-by-side (e.g., mobile vs desktop, old vs new design)
- Task scenario: "Book a flight" or "Find product" walkthrough
- Click counter: Track steps required for each interface
- Heuristic scorecard: Rate each interface against Nielsen's 10 heuristics
- Consistency checker: Highlight internal/external consistency issues
- Winner determination: Auto-calculate which interface scores better

#### accessibility-audit.js - WCAG/Accessibility Principle Demonstrator
**Purpose**: Show how accessibility principles affect real users
**Features**:
- Simulation modes:
  - Color blindness filters (protanopia, deuteranopia, tritanopia)
  - Screen reader mode (show tab order + alt text)
  - Low vision (blur/zoom)
  - Motor impairment (large click targets)
- Contrast checker: WCAG AA/AAA compliance for text/background
- Keyboard navigation test: Can you complete task without mouse?
- Alt text inspector: Show missing/poor image descriptions
- Before/after toggle: Inaccessible → accessible versions

#### consistency-inspector.js - Internal & External Consistency Visualizer
**Purpose**: Identify consistency patterns (or violations) in interfaces
**Features**:
- Internal consistency scan: Highlight inconsistent button styles, fonts, spacing within one interface
- External consistency examples: Show how interfaces follow platform conventions (iOS vs Android vs Web)
- Pattern library: Common UI patterns (navigation, forms, buttons)
- Violation highlighter: Red boxes around inconsistent elements
- Fix suggestions: "This button uses Arial while others use Roboto"
- Platform comparison: Show same app on different OS with native patterns

#### cognitive-load.js - Short-Term Memory & Learnability Demo
**Purpose**: Demonstrate how interface design affects memory load
**Features**:
- Miller's Law simulator: Show 7±2 item limit with menu examples
- Recognition vs recall: Quiz mode comparing "select from list" vs "type from memory"
- Progressive disclosure: Show layered vs overwhelming interfaces
- Chunking demonstration: Phone numbers formatted vs unformatted
- Learning curve graph: Plot time-to-task over multiple attempts
- Memory game: Test recall after brief interface exposure

#### response-time.js - System Response Time Impact Visualizer
**Purpose**: Show how response delays affect user experience
**Features**:
- Simulated loading delays: 0.1s / 1s / 3s / 10s button response
- User perception scale: "Instant" → "Noticeable" → "Frustrating" → "Abandoned"
- Spinner/progress bars: Compare feedback mechanisms
- Task completion race: Same task with fast vs slow responses
- Mobile vs Wi-Fi: Simulate network conditions
- Abandonment meter: Show when users give up (based on research)

#### effort-evaluator.js - Commensurate Effort Principle Demo
**Purpose**: Evaluate if task difficulty matches interface complexity
**Features**:
- Task complexity slider: Simple → Medium → Complex tasks
- Step counter: How many actions to complete task?
- Fitt's Law demo: Target size + distance = time to click
- Form optimization: Compare 1-page vs multi-step forms
- Undo/redo analysis: How easy to recover from mistakes?
- Efficiency comparison: Expert shortcuts vs beginner paths

#### te-reo-interface.js - Mātāpono Māori & Te Reo Māori Usability
**Purpose**: Evaluate cultural and linguistic appropriateness in interfaces
**Features**:
- Macron checker: Highlight missing macrons in te reo Māori text
- Spell-check demo: Show interfaces with/without te reo support
- Whakapapa/pepeha forms: Examples supporting iwi, hapū, waka, maunga, awa
- Tikanga alignment: Interface patterns supporting kanohi ki te kanohi, whanaungatanga
- Before/after comparison: Generic form → culturally responsive form
- Cultural audit checklist: Does interface support mātauranga Māori expression?

#### heuristic-violations.js - "Spot the Usability Issues" Game
**Purpose**: Gamified learning of Nielsen's heuristics through bad examples
**Features**:
- Mock interfaces: Deliberately flawed designs (missing feedback, inconsistent buttons, poor error messages)
- Click-to-identify: Students click violations → select which heuristic is broken
- Timer + scoring: Speed and accuracy points
- Difficulty levels: 3 issues → 7 issues → 10 issues
- Explanation mode: Show why each violation matters with real-world impact
- Leaderboard: Class competition mode

#### improvement-suggester.js - Interface Redesign Proposal Tool
**Purpose**: Apply usability principles to suggest concrete improvements
**Features**:
- Before/after editor: Upload interface → annotate problems → sketch improvements
- Principle linking: Connect each suggestion to specific heuristic/principle
- Priority ranker: Critical vs nice-to-have improvements
- Implementation notes: "Change button color to #007AFF for better contrast"
- Export report: PDF with screenshots, issues, and suggested fixes
- Peer review mode: Share proposals for class feedback

### General / Other

#### Garage Door Rolling Codes Visualiser
**Purpose**: Explain how rolling codes prevent replay attacks
**Features**:
- Simulate code TX / RX
- Simulate code replay and failure
- Simulate missed RXs (codes out of step)

#### Algorithm Race
**Purpose**: Show algorithmic complexity through direct comparison
**Features**:
- Run two algorithms side-by-side (e.g. linear vs binary search, bubble vs merge sort)
- Live operation counter for each
- Input-size slider to scale the problem

#### Algorithm Visualizer
**Purpose**: Step-through visualization of common algorithms
**Features**:
- Sorting algorithms (bubble, merge, quick, insertion)
- Binary search visualization
- Stack/queue/heap operations with animations
- Linked list operations with pointer movements
- Tree traversals (in-order, pre-order, post-order)


---

## In Progress



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
- [x] **modulus.js** - Modular arithmetic clock visualization with animated pointer rotation; interactive sliders for value and modulus; dynamic equation display with animated reveal; smooth sweep animations with configurable timing
- [x] **diffie-hellman.js** - Diffie-Hellman key exchange visualizer with step-by-step animation; dual mode (numeric/colour mixing); Alice/Bob parallel calculations; public exchange visualization; eavesdropper perspective; shared secret highlighting; multiplicative colour blending for paint-like analogy; configurable p, g, and base colour parameters
- [x] **sym-asym.js** - Side-by-side encryption comparison with dual mode (symmetric/asymmetric); message flow animation from Alice to Bob; key visualization (shared key vs public/private pair); Eve's eavesdropper perspective showing what can/cannot be decrypted; step-by-step encryption/decryption process; performance comparison display; customizable message attribute

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

