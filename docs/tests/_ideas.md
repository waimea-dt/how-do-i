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

## Completed

### Completed Plugins

- [x] **accessibility.js** - Accessibility teaching widget with screen-reader, low-vision, colour-blind, motor-impairment, and contrast audit modes
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
- [x] **trace-table.js** - Program state tracer with executable code-to-table playback, blank worksheet mode, and Python/Kotlin support
- [x] **parsons-builder.js** - Covered by drag-drop plugin support for code-ordering puzzle workflows
- [x] **primm.js** - Allows students to predict output of a code block, then run it to see for real
- [x] **excalidraw.js** - Rendering of excalidraw JSON files as SVGs


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


