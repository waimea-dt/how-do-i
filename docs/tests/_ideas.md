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
- Colour coding: Active comparison (yellow), swap (red), sorted (green)

#### approximation-demo.js - Heuristic Quality Evaluator
**Purpose**: Show trade-off between speed and solution quality
**Features**:
- Problem selector: TSP, Knapsack, Bin Packing, Graph Colouring
- Algorithm slider: Optimal → Good Heuristic → Fast Greedy
- Quality meter: % of optimal solution (e.g., "92% optimal in 0.01s vs 100% in 45s")
- Real-world context: "Delivery routes don't need perfection"
- Scaling demo: Show where brute-force becomes impractical (crossover point)

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


---

## In Progress

- [ ] **wifi.js** - WPA2/WPA3 handshake visualiser
- [ ] **rolling-code.js** - Garage door rolling code visualiser
- [ ] **digital-sig.js** - Digital signature visualiser
- [ ] **tls.js** - Simplified TLS handshake visualiser (TLS 1.2/1.3 toggle)


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

---

## Exchange Plugin Design Patterns

**Established with:** `diffie-hellman.js`, `sym-asym.js`
**Shared base:** `exchange-core.css` (common styles), plugin-specific CSS files for unique features

### File Structure

```
docs/
├── _plugins/interactive/
│   ├── diffie-hellman.js       # Plugin-specific logic
│   ├── sym-asym.js              # Plugin-specific logic
│   └── exchange-core.js         # [Future] Shared animation base class
├── _css/interactive/
│   ├── exchange-core.css        # Shared styles for all exchange plugins
│   ├── diffie-hellman.css       # Plugin-specific styles only
│   └── sym-asym.css             # Plugin-specific styles only
```

**Key Principle:** Common patterns go in `exchange-core.css`, plugin-specific features stay in their own CSS

### HTML Structure Pattern

All exchange plugins use this standardized structure:

```html
<custom-element>  <!-- e.g., <diffie-hellman>, <sym-asym> -->
  <div class="exchange-wrapper">
    <div class="exchange-header">
      <div class="exchange-header-content">
        <div class="exchange-title">...</div>
        <div class="exchange-subtitle">...</div>
      </div>
    </div>

    <div class="exchange-grid">  <!-- 3-column responsive grid -->
      <!-- Party 1 (Alice) -->
      <div class="exchange-party exchange-party1">
        <div class="exchange-party-header">
          <div class="exchange-party-name">👩 Alice</div>
        </div>
        <div class="exchange-step">
          <div class="exchange-step-label">Step X: Action</div>
          <div class="exchange-step-content">
            <div class="exchange-result exchange-show">
              <div class="exchange-value-group exchange-value-party1">
                <span class="exchange-var">var</span> =
                <span class="exchange-value" data-alice-value>?</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Exchange Column (Middle - Arrows) -->
      <div class="exchange-column">
        <div class="exchange-column-step">
          <div class="exchange-column-label">Step Y: Send</div>
          <div class="exchange-arrow-grid">
            <div class="exchange-arrow exchange-arrow-right">
              <div class="exchange-value-group">...</div>
              <span class="exchange-arrow-icon">→</span>
            </div>
          </div>
          <!-- Optional Eve intercept -->
          <div class="exchange-eve">
            <div class="exchange-eve-icon">👁️ Eve</div>
            <div class="exchange-eve-text">Can see: ...</div>
          </div>
        </div>
      </div>

      <!-- Party 2 (Bob) -->
      <div class="exchange-party exchange-party2">
        <!-- Similar to Party 1 -->
      </div>
    </div>

    <div class="exchange-footer">
      <div class="exchange-controls">
        <button class="exchange-btn exchange-btn-start">▶ Start</button>
        <button class="exchange-btn exchange-btn-reset">↺ Reset</button>
        <button class="exchange-btn exchange-btn-step">→ Next</button>
      </div>
      <div class="exchange-status" aria-live="polite"></div>
    </div>
  </div>
</custom-element>
```

### CSS Design Token System

**Always use locally scoped CSS variables** in the plugin's root container:

```css
.markdown-section diffie-hellman {
    container-type: inline-size;  /* REQUIRED for responsive @container queries */

    /* Override core tokens if needed */
    --exchange-accent-party1: var(--theme-color);
    --exchange-accent-party2: var(--secondary-color);
    --exchange-accent-shared: var(--color-good);

    /* Plugin-specific tokens */
    --dh-swatch-color: var(--theme-color-5);
    --dh-formula-bg: var(--color-mono-0);
}
```

**Core design tokens** (defined in `exchange-core.css`, can be overridden):

```css
/* Color system */
--exchange-bg:                  var(--color-mono-0);
--exchange-border:              var(--color-mono-4);
--exchange-text-primary:        var(--color-text);
--exchange-text-secondary:      var(--color-mono-6);

/* Party-specific accents */
--exchange-accent-party1:       var(--theme-color);
--exchange-accent-party2:       var(--secondary-color);
--exchange-accent-shared:       var(--color-good);
--exchange-accent-secret:       var(--highlight-color);
--exchange-accent-public:       var(--palette-color-6);

/* Step states */
--exchange-step-active-border:  var(--theme-color);
--exchange-step-active-bg:      color-mix(...);
--exchange-step-complete-bg:    color-mix(...);

/* Spacing */
--exchange-gap-big:             2rem;
--exchange-gap:                 1rem;
--exchange-gap-small:           0.5rem;
--exchange-padding:             1rem;
```

**Always reference theme colors**, never hardcode:
- ✅ `var(--theme-color)`, `var(--color-mono-4)`
- ❌ `#3498db`, `#cccccc`

### Responsive Design with Container Queries

**Use `@container` queries** for plugin-internal responsiveness:

```css
.markdown-section diffie-hellman {
    container-type: inline-size;  /* Makes @container work */
}

.exchange-grid {
    /* Mobile: stacked */
    grid-template-columns: 1fr;
    grid-template-areas:
        "party1"
        "exchange"
        "party2";

    /* Tablet: 2-column */
    @container (min-width: 600px) {
        grid-template-columns: 1fr 1fr;
        grid-template-areas:
            "party1 party2"
            "exchange exchange";
    }

    /* Desktop: 3-column */
    @container (min-width: 1024px) {
        grid-template-columns: 1fr 320px 1fr;
        grid-template-areas: "party1 exchange party2";
    }
}
```

**Why container queries?** Plugins work correctly regardless of page width (sidebar open/closed, embedded contexts)

### JavaScript Architecture

#### Plugin Structure (IIFE Pattern)

```javascript
;(function () {
    // -------------------------------------------------------------------------
    // Configuration
    // -------------------------------------------------------------------------

    const KEY_LEN = 8
    const CONFIG = { /* ... */ }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    function helperFunction() { /* ... */ }

    // -------------------------------------------------------------------------
    // HTML UI Builder
    // -------------------------------------------------------------------------

    function buildUI(param1, param2) {
        const wrapper = document.createElement('div')
        wrapper.className = 'exchange-wrapper'
        wrapper.innerHTML = `...`
        return wrapper
    }

    // -------------------------------------------------------------------------
    // Animation Controller
    // -------------------------------------------------------------------------

    const CSS_CLASSES = {
        ACTIVE: 'exchange-active',
        COMPLETED: 'exchange-completed',
        HIGHLIGHT: 'exchange-highlight',
        ANIMATING: 'exchange-animating',
        SHOW: 'exchange-show',
        PULSE: 'exchange-pulse'
    }

    class PluginAnimation {
        constructor(el, ...params) {
            this.el = el
            this.currentStep = 0
            this.isRunning = false

            // Animation timing
            this.TIMING = {
                BASE: 500,
                get REVEAL() { return this.BASE },
                get STEP() { return this.BASE + 200 },
                get ANIMATE() { return this.STEP + 400 },
                get BETWEEN_STEPS() { return this.ANIMATE + 400 }
            }

            // Cache DOM elements
            this.dom = { /* ... */ }

            // Bind events
            this.startBtn.addEventListener('click', () => this.start())
            this.resetBtn.addEventListener('click', () => this.reset())
            this.stepBtn.addEventListener('click', () => this.nextStep())
        }

        async nextStep() {
            this.currentStep++
            switch (this.currentStep) {
                case 1: await this.step1_Name(); break
                case 2: await this.step2_Name(); break
                // ...
            }
        }

        async step1_Name() {
            this.setStatus('Status message', 'info')

            const stepEl = this.dom.element.closest('.exchange-step')
            this.activateStep(stepEl)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            // Update DOM with animation
            this.dom.element.textContent = value
            this.dom.element.classList.add(CSS_CLASSES.PULSE)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.completeStep(stepEl)
        }

        reset() {
            this.currentStep = 0
            this.isRunning = false

            // Remove all state classes
            this.el.querySelectorAll('.exchange-step').forEach(el => {
                el.classList.remove(CSS_CLASSES.ACTIVE, CSS_CLASSES.COMPLETED)
            })

            // Reset values
            this.resetElementsToDefault('[data-selector]')

            // Restore initial show states
            const initialResults = this.el.querySelectorAll('.exchange-result.exchange-show')
            initialResults.forEach(el => el.classList.add(CSS_CLASSES.SHOW))
        }
    }

    // -------------------------------------------------------------------------
    // Plugin entry point
    // -------------------------------------------------------------------------

    function processPlugin() {
        document.querySelectorAll('.markdown-section custom-element').forEach(el => {
            const param1 = el.getAttribute('param1') || 'default'
            const param2 = el.hasAttribute('param2')

            el.innerHTML = ''
            el.appendChild(buildUI(param1, param2))
            new PluginAnimation(el, param1, param2)
        })
    }

    const docsifyPlugin = function (hook) {
        hook.doneEach(processPlugin)
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyPlugin, window.$docsify.plugins || [])
})()
```

#### State Management Pattern

```javascript
// Step activation states
this.activateStep(stepEl)       // Adds 'exchange-active' class
this.completeStep(stepEl)       // Removes 'active', adds 'exchange-completed'

// Show/hide elements
element.classList.add(CSS_CLASSES.SHOW)     // Animate in (opacity + max-height)
element.classList.remove(CSS_CLASSES.SHOW)  // Animate out

// Pulse highlights (temporary)
element.classList.add(CSS_CLASSES.PULSE)
setTimeout(() => element.classList.remove(CSS_CLASSES.PULSE), 350)

// Persistent highlight
element.classList.add(CSS_CLASSES.HIGHLIGHT)  // Infinite pulse animation
```

#### Animation Timing Pattern

```javascript
this.TIMING = {
    BASE: 500,
    get REVEAL() { return this.BASE },              // Initial reveal delay
    get STEP() { return this.BASE + 200 },          // Between sub-steps
    get ANIMATE() { return this.STEP + 400 },       // Animation duration
    get BETWEEN_STEPS() { return this.ANIMATE + 400 } // Between major steps
}

// Usage in step methods
await this.sleep(this.TIMING.REVEAL)
if (!this.isRunning) return  // ALWAYS check after sleep

await this.sleep(this.TIMING.ANIMATE)
if (!this.isRunning) return
```

**Critical:** Always check `!this.isRunning` after every `sleep()` to allow reset/stop mid-animation

#### DOM Caching Pattern

```javascript
// Cache all frequently accessed elements in constructor
this.dom = {
    alice: {
        key: el.querySelector('[data-alice-key]'),
        value: el.querySelector('[data-alice-value]'),
        result: el.querySelector('[data-alice-result]')
    },
    bob: {
        key: el.querySelector('[data-bob-key]'),
        // ...
    },
    arrows: {
        left: el.querySelector('.exchange-arrow-left'),
        right: el.querySelector('.exchange-arrow-right')
    },
    exchange: {
        eveNote: el.querySelector('.exchange-eve')
    }
}

// Never query selectors in animation loops
```

### Animation Patterns

#### Standard Animation Sequence

```javascript
async stepN_ActionName() {
    // 1. Set status message
    this.setStatus('Describing what happens', 'info')

    // 2. Activate the step container
    const stepEl = this.dom.element.closest('.exchange-step')
    this.activateStep(stepEl)

    // 3. Initial delay
    await this.sleep(this.TIMING.REVEAL)
    if (!this.isRunning) return

    // 4. Update values with pulse animation
    this.dom.element.textContent = newValue
    const resultEl = this.dom.element.closest('.exchange-result')
    resultEl.classList.add(CSS_CLASSES.PULSE)
    setTimeout(() => resultEl.classList.remove(CSS_CLASSES.PULSE), 350)

    // 5. Show the result container
    resultEl.classList.add(CSS_CLASSES.SHOW)

    // 6. Wait before completing
    await this.sleep(this.TIMING.STEP)
    if (!this.isRunning) return

    // 7. Mark step as completed
    this.completeStep(stepEl)
}
```

#### Arrow/Exchange Animation

```javascript
// Show value on arrow
this.dom.arrows.value.textContent = data
this.dom.arrows.left.classList.add(CSS_CLASSES.ANIMATING)

await this.sleep(this.TIMING.ANIMATE)
if (!this.isRunning) return

this.dom.arrows.left.classList.remove(CSS_CLASSES.ANIMATING)

// Receiver gets value
this.dom.receiver.value.textContent = data
const receivedContainer = this.dom.receiver.value.closest('.exchange-received')
receivedContainer.classList.add(CSS_CLASSES.PULSE)
setTimeout(() => receivedContainer.classList.remove(CSS_CLASSES.PULSE), 350)
receivedContainer.classList.add(CSS_CLASSES.SHOW)
```

#### Eve Intercept Pattern

```javascript
// Show Eve's observation (optional intercept mode)
if (this.showIntercept && this.dom.exchange.eveNote) {
    await this.sleep(this.TIMING.STEP)
    if (!this.isRunning) return
    this.dom.exchange.eveNote.classList.add(CSS_CLASSES.SHOW)
    this.dom.exchange.eveNote.classList.add(CSS_CLASSES.HIGHLIGHT)  // Continuous pulse
}
```

### Reset Pattern

```javascript
reset() {
    this.isRunning = false
    this.currentStep = 0

    // Regenerate random values
    this.key = generateKey()
    this.encrypted = encrypt(this.message, this.key)

    // Remove all animation state classes
    this.el.querySelectorAll('.exchange-step, .exchange-column-step, .exchange-eve').forEach(el => {
        el.classList.remove(CSS_CLASSES.ACTIVE, CSS_CLASSES.HIGHLIGHT, CSS_CLASSES.COMPLETED)
    })

    this.el.querySelectorAll('.exchange-received, .exchange-result').forEach(el => {
        el.classList.remove(CSS_CLASSES.SHOW, CSS_CLASSES.HIGHLIGHT)
    })

    this.el.querySelectorAll('.exchange-arrow').forEach(el => {
        el.classList.remove(CSS_CLASSES.ANIMATING)
    })

    // Reset displayed values to '?'
    this.resetElementsToDefault('[data-alice-key], [data-bob-key], [data-alice-value]')

    // Restore initial "show" states (Step 1 values visible from start)
    const initialShownResults = [
        this.dom.alice.initial.closest('.exchange-result'),
        this.dom.bob.initial.closest('.exchange-result')
    ]
    initialShownResults.forEach(result => {
        if (result) result.classList.add(CSS_CLASSES.SHOW)
    })

    this.setStatus('')
    this.updateControls()
}
```

### Naming Conventions

#### CSS Classes
- **Base element:** `exchange-{noun}` (e.g., `exchange-wrapper`, `exchange-grid`)
- **State modifiers:** `exchange-{state}` (e.g., `exchange-active`, `exchange-show`)
- **Party variants:** `exchange-{noun}-party1`, `exchange-{noun}-party2`
- **Plugin-specific:** `{plugin}-{noun}` (e.g., `dh-calc-display`, `sa-operation`)

#### Data Attributes
- Format: `data-{party}-{item}` (e.g., `data-alice-key`, `data-bob-public`)
- Never duplicate selectors: each element has one unique data attribute

#### JavaScript Properties
- Public properties: `this.propertyName`
- Constants: `UPPER_SNAKE_CASE`
- Methods: `camelCase`, step methods use `stepN_ActionName` pattern

### Value Display Patterns

#### Standard Value Group

```html
<div class="exchange-value-group exchange-value-party1">
    <span class="exchange-var">varName</span> =
    <span class="exchange-value" data-selector>?</span>
</div>
```

**Color variants:**
- `exchange-value-party1` - Alice's values (theme color)
- `exchange-value-party2` - Bob's values (secondary color)
- `exchange-value-shared` - Shared secrets (green)
- `exchange-value-success` - Final results (green)

#### Badges

```html
<span class="exchange-badge exchange-public-badge">Public Key</span>
<span class="exchange-badge exchange-secret-badge">Private Key</span>
<span class="exchange-badge exchange-shared-badge">Shared Secret</span>
```

### Received Values Pattern

```html
<div class="exchange-received">
    <span>Received</span>  <!-- Optional label -->
    <div class="exchange-value-group exchange-value-party2">
        <span class="exchange-var">key</span> =
        <span class="exchange-value" data-alice-key>?</span>
    </div>
</div>
```

**Animation:** Starts hidden (opacity: 0, max-height: 0), revealed with `exchange-show` class

### Status Messages

```javascript
this.setStatus('Message text', 'info')     // Blue/neutral
this.setStatus('Success!', 'success')      // Green
this.setStatus('Warning!', 'warning')      // Orange/yellow
this.setStatus('', '')                      // Clear status
```

### Control Button States

```javascript
updateControls() {
    this.startBtn.disabled = this.isRunning
    this.resetBtn.disabled = !this.isRunning && this.currentStep === 0
    this.stepBtn.disabled = this.isRunning || this.currentStep >= this.maxSteps
}
```

### Plugin-Specific Extensions

When a plugin needs unique features:

1. **Add to plugin-specific CSS** (not exchange-core.css)
2. **Use plugin-prefixed classes:** `dh-color-swatch`, `sa-operation`
3. **Define plugin-specific tokens:** `--dh-swatch-color`, `--sa-func-color`
4. **Document in CSS file header** what's plugin-specific

### Accessibility Requirements

- **Semantic HTML:** Use `<button>`, not `<div role="button">`
- **ARIA live region:** `<div class="exchange-status" aria-live="polite">`
- **Keyboard navigation:** All controls must be keyboard-accessible
- **Color contrast:** Meet WCAG AA standards (checked via CSS variables)
- **Focus indicators:** Never remove `:focus` styles

### Performance Guidelines

- **Cache DOM queries** in constructor
- **Use CSS transitions/animations** instead of JS animation loops
- **Debounce rapid interactions** (already handled by `isRunning` flag)
- **Remove event listeners** on destroy (if needed)
- **Avoid layout thrashing:** batch DOM reads, then writes

### Testing Checklist

When building exchange plugins, verify:

- ✅ Works with sidebar open/closed (container queries)
- ✅ Mobile responsive (test at 375px, 768px, 1024px)
- ✅ Reset works mid-animation (check `isRunning` guards)
- ✅ Step button disabled at end
- ✅ All animations smooth (no flashing)
- ✅ Status messages clear and accurate
- ✅ Theme colors applied (no hardcoded colors)
- ✅ Eve intercept shows/hides correctly
- ✅ Values reset to '?' on reset
- ✅ Initial states restore after reset

### Common Pitfalls to Avoid

❌ **Don't:**
- Hardcode colors (`#3498db`) instead of theme variables
- Use `@media` queries (use `@container` instead)
- Query selectors in loops (cache in constructor)
- Forget `if (!this.isRunning) return` after `await sleep()`
- Put common styles in plugin-specific CSS
- Use `var` for variables (use `const`/`let`)
- Forget to remove `exchange-show` class on reset for received values

✅ **Do:**
- Use CSS variables from theme
- Cache all DOM elements
- Check `isRunning` after every async operation
- Keep shared styles in `exchange-core.css`
- Document plugin-specific features in CSS header
- Test responsive behavior with container queries
- Use consistent naming conventions

