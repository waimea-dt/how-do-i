# Ideas and Things To Do

## Things to Do

- [ ] Mobile table char alignment still off
- [ ] Calc animate="on/off" attribute
- [ ] Tidy up the data views - borders, etc.
- [ ] Python code indent highlighting added to Python snippets
- [ ] Code runner fake input... should this be shown?

---

## In Progress

- [ ] **wifi.js** - WPA2/WPA3 handshake visualiser
- [ ] **rolling-code.js** - Garage door rolling code visualiser
- [ ] **digital-sig.js** - Digital signature visualiser
- [ ] **tls.js** - Simplified TLS handshake visualiser (TLS 1.2/1.3 toggle)

---


## Plugin Ideas

### General T&L Plugins

#### primm.js - Predict Run Investigate Modify Make
**Purpose**: Teach coding without the fear!
**Features**:
- Code check, prediction, run
- Investigate via drag-drop labelling and trace table

#### confidence-check.js - Confidence vs Correctness Tracker
**Purpose**: Build better learner calibration by comparing confidence with actual performance
**Features**:
- Confidence prompt before answer reveal (e.g. 1-5)
- Correctness check after submission
- Confidence vs correctness history chart
- "Overconfident" and "underconfident" markers
- Session summary for reflection

#### two-stage-quiz.js - Try, Hint, Retry Quiz Flow
**Purpose**: Support formative assessment with feedback between attempts
**Features**:
- Stage 1 solo attempt
- Stage 2 guided retry with hint
- Scoring model that rewards improvement
- Per-question feedback history
- Teacher option to enable peer-discuss step

#### misconception-bank.js - Common Wrong Ideas Explorer
**Purpose**: Surface misconceptions and explain why they are tempting
**Features**:
- Link each question to common misconceptions
- Wrong-answer specific feedback paths
- "Why this is a common mistake" explanation blocks
- Suggested remediation mini-tasks
- Topic presets for complexity, recursion, SQL, networking

#### worked-example-fader.js - Gradual Scaffolding Practice
**Purpose**: Move students from fully guided examples to independent solving
**Features**:
- Full worked solution on first pass
- Progressive hiding of key steps on repeats
- Fill-the-gap prompts for missing steps
- Toggle for teacher-controlled fade level
- Auto-reset for revision sessions

#### parsons-builder.js - Code Reordering Challenge
**Purpose**: Practice program logic without full-code typing burden
**Features**:
- Jumbled code blocks with drag-drop order
- Optional distractor lines
- Multi-level difficulty modes
- Instant structural validation
- Replay with hints on incorrect placement

#### error-diagnosis-lab.js - Bug Hunt + Fix Reasoning
**Purpose**: Teach debugging process and error classification
**Features**:
- Present buggy snippet plus output/logs
- Student identifies error type and location
- Fix proposal input and model answer reveal
- Debug strategy checklist
- Mistake patterns by topic

#### trace-table.js - Program State Tracer
**Purpose**: Strengthen tracing skills for loops, recursion, and algorithms
**Features**:
- Auto-generate trace table scaffold from code
- Predict-first mode before reveal
- Step-by-step state progression playback
- Compare learner trace vs model trace
- Exportable trace summary

#### predict-then-run.js - Mental Model First Runner
**Purpose**: Force prediction before execution to deepen understanding
**Features**:
- Prediction prompts for output/time/memory
- Run and compare view
- Delta explanation for wrong predictions
- Quick retry with modified inputs
- Confidence capture integration

#### spaced-review.js - Embedded Revision Scheduler
**Purpose**: Turn content blocks into long-term memory review prompts
**Features**:
- Mark sections as review cards
- Spaced repetition intervals (SM-2 style)
- Daily/weekly review queue
- Streak and due-card indicators
- Topic-based revision filters

#### objective-map.js - Learning Objective Coverage Tracker
**Purpose**: Connect activities explicitly to achievement objectives
**Features**:
- Tag sections/questions to objectives
- Coverage heatmap by page/topic
- Mastery checkpoint prompts
- Gaps report for unassessed objectives
- Teacher view for planning adjustments

#### prerequisite-gate.js - Just-in-Time Readiness Check
**Purpose**: Catch missing prior knowledge before new content
**Features**:
- Lightweight pre-check quiz blocks
- Soft gate with refresher path recommendations
- Retry after targeted revision
- Pass criteria per objective
- Analytics for common prerequisite gaps

#### concept-contrast.js - Similar-But-Different Comparator
**Purpose**: Improve discrimination between commonly confused concepts
**Features**:
- Side-by-side concept cards
- "Choose the right concept" micro-questions
- Contrast prompts (what is same/different)
- Example and non-example pairs
- Topic packs (DFS/BFS, TCP/UDP, stack/heap)

#### rubric-short-answer.js - Guided Explanation Writer
**Purpose**: Improve quality of written reasoning with visible criteria
**Features**:
- Short-answer response box with rubric checklist
- Live criteria coverage indicators
- Self-assessment before reveal
- Model answer comparison panel
- Teacher-editable rubric templates

#### socratic-tutor.js - Scoped Questioning Assistant
**Purpose**: Provide guided help without direct answer dumping
**Features**:
- Topic-scoped prompt context per block
- Hint-first questioning flow
- Progressive clues rather than full answers
- "Show thinking steps" prompts
- Teacher control over strictness level

#### class-insights.js - Aggregate Learning Signals Dashboard
**Purpose**: Help teacher identify friction points quickly
**Features**:
- Aggregated anonymous misconception counts
- Retry and hint usage trends
- Confidence gap summaries
- Hardest-question leaderboard
- Exportable intervention notes

#### exam-mode.js - Learning vs Assessment Toggle
**Purpose**: Reuse same content for practice and test conditions
**Features**:
- Hide hints/reveals in assessment mode
- Optional timers and lock-after-submit
- Randomised question/item order
- Reduced UI cues for exam realism
- Attempt policy controls

#### attention-reset.js - 90-Second Cognitive Break Tasks
**Purpose**: Improve focus and retention between dense sections
**Features**:
- Micro retrieval prompts between topics
- Sort/label/one-minute challenge templates
- Auto-insert cadence control
- Low-stakes completion tracking
- Teacher-curated reset banks

#### accessibility-coach.js - Readability & Access Checker
**Purpose**: Improve inclusivity and clarity across notes/activities
**Features**:
- Detect low contrast and dense text blocks
- Alt-text and structure checks
- Reading-level estimates for content chunks
- Quick-fix suggestions inline
- Accessibility score per page



### NCEA Level 3: Complexity & Tractability

#### growth-race.js - Polynomial vs Exponential Showdown
**Purpose**: Animate growth rates at different input sizes
**Features**:
- Racing bars: O(n) vs O(n²) vs O(2ⁿ) vs O(n!) grow simultaneously
- Input slider: n = 5 → 10 → 15 (watch factorial explode)
- Time equivalents: "1ms → 1 hour → 13 years" for n=20
- Crossing point finder: When does O(n²) beat O(n log n)?
- Interactive legend: Click complexity → highlight corresponding curve

#### approximation-demo.js - Heuristic Quality Evaluator
**Purpose**: Show trade-off between speed and solution quality
**Features**:
- Problem selector: TSP, Knapsack, Bin Packing, Graph Colouring
- Algorithm slider: Optimal → Good Heuristic → Fast Greedy
- Quality meter: % of optimal solution (e.g., "92% optimal in 0.01s vs 100% in 45s")
- Real-world context: "Delivery routes don't need perfection"
- Scaling demo: Show where brute-force becomes impractical (crossover point)

---

### NCEA Level 2: Encryption

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


---

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
  - Colour blindness filters (protanopia, deuteranopia, tritanopia)
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
- [x] **diffie-hellman.js** - Diffie-Hellman key exchange visualizer with step-by-step animation; dual mode (numeric/colour mixing)
- [x] **p-np-demo.js** - Complexity Class Visualizer with venn diagram animation: P ⊆ NP, NP-complete boundary, P=NP toggle: "What if P=NP?" (show diagram collapse)
- [x] **sym-asym.js** - Side-by-Side Encryption Comparison to contrast symmetric vs asymmetric encryption flows
- [x] **sorting-race.js** - Algorithm head-to-head visualiser
- [x] **algo-race.js** - Algorithm race comparison visualiser
- [x] **algorithm-visualiser.js** - Step-through algorithm visualiser
- [x] **knapsack** - Explore and compare algos
- [x] **bin-packing** - Explore and compare algos



### Completed Maintenance

- [x] Drag-drop - add a code mode - collapsed gaps, borders, etc.
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


