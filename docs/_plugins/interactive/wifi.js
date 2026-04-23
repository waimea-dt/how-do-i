/**
 * docsify-wifi.js — Interactive Wi-Fi Authentication Handshake Visualiser
 *
 * Helps students understand:
 *   - How a device authenticates to a Wi-Fi network
 *   - The role of the password, nonces, and session key derivation
 *   - How WPA2 differs from WPA3 (SAE / Simultaneous Authentication of Equals)
 *   - Why an eavesdropper can capture packets but cannot decrypt traffic
 *
 * Usage in markdown:
 *   <wifi></wifi>
 *   <wifi security="wpa2"></wifi>
 *   <wifi security="wpa3"></wifi>
 *   <wifi ssid="SchoolWiFi"></wifi>
 *   <wifi intercept></wifi>
 *
 * Attributes:
 *   - security: 'wpa2' (default) or 'wpa3'
 *   - ssid:     Network name (default: 'SchoolWiFi')
 *   - intercept: Show an attacker capturing packets
 *
 * Animation sequence (WPA2 — 4-Way Handshake):
 *   1. Device knows the password; Router knows the password
 *   2. Router sends a random challenge (ANonce) to Device
 *   3. Device generates its own random value (SNonce) and derives the Session Key (PTK)
 *   4. Device sends SNonce + a MIC (message integrity code) to Router
 *   5. Router derives the same Session Key (PTK) and verifies the MIC
 *   6. Router confirms: sends GTK (group key) + MIC to Device
 *   7. Device acknowledges — encrypted session begins!
 *
 * Animation sequence (WPA3 — SAE Dragonfly Handshake):
 *   1. Device and Router both know the password
 *   2. Device sends a Commit message (public value derived from password)
 *   3. Router sends its own Commit message (public value)
 *   4. Device sends a Confirm message (proves knowledge without revealing password)
 *   5. Router sends its Confirm message
 *   6. Both sides independently derive the same Session Key (PMK)
 *   7. Encrypted session begins — password never transmitted!
 */

;(function () {

    // -------------------------------------------------------------------------
    // Configuration
    // -------------------------------------------------------------------------

    const NONCE_LEN  = 4   // hex chars per nonce segment
    const KEY_LEN    = 4   // hex chars per key segment
    const MIC_LEN    = 4   // hex chars per MIC segment

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    function randomHex(segLen, segments = 2) {
        const chars = 'ABCDEF0123456789'
        return Array.from({ length: segments }, () =>
            Array.from({ length: segLen }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
        ).join(' ')
    }

    /**
     * Derive a visually unique session key from two nonces + password.
     * Not real crypto — just for visualisation.
     */
    function deriveKey(nonce1, nonce2, password) {
        const combined = nonce1 + nonce2 + password
        let result = ''
        for (let offset = 0; offset < 4; offset++) {
            let hash = offset * 0x9e3779b9
            for (let i = 0; i < combined.length; i++) {
                hash = ((hash << 5) - hash) + combined.charCodeAt(i) + offset * i
                hash = hash | 0
            }
            result += Math.abs(hash).toString(16).toUpperCase().padStart(8, '0').slice(-4)
        }
        return result.match(/.{1,4}/g).join(' ')
    }

    // -------------------------------------------------------------------------
    // HTML UI Builder
    // -------------------------------------------------------------------------

    function buildUI(security, ssid, showIntercept) {
        const isWPA3 = security === 'wpa3'

        const titleText   = isWPA3 ? `WPA3 Handshake — ${ssid}` : `WPA2 Handshake — ${ssid}`
        const subtitleText = isWPA3
            ? 'SAE (Dragonfly): password is never sent — both sides prove knowledge simultaneously'
            : '4-Way Handshake: both sides prove they know the password without ever sending it'

        const wrapper = document.createElement('div')
        wrapper.className = 'exchange-wrapper'

        wrapper.innerHTML = `
            <div class="exchange-header">
                <div class="exchange-header-content">
                    <div class="exchange-title">${titleText}</div>
                    <div class="exchange-subtitle">${subtitleText}</div>
                </div>
                <div class="wifi-network-info">
                    <div class="wifi-ssid-icon">📶</div>
                    <div class="wifi-ssid-name">${ssid}</div>
                    <div class="wifi-security-badge ${isWPA3 ? 'wifi-badge-wpa3' : 'wifi-badge-wpa2'}">${security.toUpperCase()}</div>
                </div>
            </div>

            <div class="exchange-grid">

                <!-- Device (Alice role) -->
                <div class="exchange-party exchange-party1">
                    <div class="exchange-party-header">
                        <div class="exchange-party-name">💻 Device</div>
                    </div>

                    <!-- Step 1: Device knows the password -->
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 1</span>: Knows the password</div>
                        <div class="exchange-step-content">
                            <div class="exchange-result exchange-show">
                                <div class="exchange-value-group exchange-value-party1">
                                    <span class="exchange-var">pwd</span> = <span class="exchange-value" data-device-pwd>••••••••</span>
                                </div>
                                <span class="exchange-badge exchange-secret-badge">Secret</span>
                            </div>
                        </div>
                    </div>

                    ${isWPA3 ? `
                    <!-- WPA3 Step 3: Device sends Commit -->
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 3</span>: Sends Commit message</div>
                        <div class="exchange-step-content">
                            <div class="wifi-formula">
                                <span class="wifi-func">commit</span>(<span class="exchange-var">pwd</span>) → <span class="exchange-var">D<sub>commit</sub></span>
                            </div>
                            <div class="exchange-result" data-device-commit-result>
                                <div class="exchange-value-group exchange-value-party1">
                                    <span class="exchange-var">D<sub>c</sub></span> = <span class="exchange-value" data-device-commit>?</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- WPA3 Step 5: Device sends Confirm -->
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 5</span>: Sends Confirm message</div>
                        <div class="exchange-step-content">
                            <div class="wifi-formula">
                                <span class="wifi-func">confirm</span>(<span class="exchange-var">D<sub>c</sub></span>, <span class="exchange-var">R<sub>c</sub></span>) → <span class="exchange-var">D<sub>conf</sub></span>
                            </div>
                            <div class="exchange-result" data-device-confirm-result>
                                <div class="exchange-value-group exchange-value-party1">
                                    <span class="exchange-var">D<sub>cf</sub></span> = <span class="exchange-value" data-device-confirm>?</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- WPA3 Step 7: Device derives Session Key -->
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 7</span>: Derives session key</div>
                        <div class="exchange-step-content">
                            <div class="wifi-formula">
                                <span class="wifi-func">KDF</span>(<span class="exchange-var">pwd</span>, <span class="exchange-var">D<sub>c</sub></span>, <span class="exchange-var">R<sub>c</sub></span>) → <span class="exchange-var">PMK</span>
                            </div>
                            <div class="exchange-result" data-device-key-result>
                                <div class="exchange-value-group exchange-value-shared">
                                    <span class="exchange-var">PMK</span> = <span class="exchange-value wifi-key" data-device-key>?</span>
                                </div>
                                <span class="exchange-badge exchange-shared-badge">Session Key</span>
                            </div>
                        </div>
                    </div>

                    ` : `
                    <!-- WPA2 Step 3: Device generates SNonce and derives PTK -->
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 3</span>: Generates SNonce, derives key</div>
                        <div class="exchange-step-content">
                            <div class="exchange-result" data-device-snonce-result>
                                <div class="exchange-value-group exchange-value-party1">
                                    <span class="exchange-var">SNonce</span> = <span class="exchange-value" data-device-snonce>?</span>
                                </div>
                            </div>
                            <div class="wifi-formula">
                                <span class="wifi-func">PTK</span> = <span class="wifi-func">PRF</span>(<span class="exchange-var">pwd</span>, <span class="exchange-var">ANonce</span>, <span class="exchange-var">SNonce</span>)
                            </div>
                            <div class="exchange-result" data-device-key-result>
                                <div class="exchange-value-group exchange-value-shared">
                                    <span class="exchange-var">PTK</span> = <span class="exchange-value wifi-key" data-device-key>?</span>
                                </div>
                                <span class="exchange-badge exchange-shared-badge">Session Key</span>
                            </div>
                        </div>
                    </div>

                    <!-- WPA2 Step 6: Device verifies and sends ACK -->
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 6</span>: Verifies Router MIC, sends ACK</div>
                        <div class="exchange-step-content">
                            <div class="exchange-result" data-device-ack-result>
                                <div class="exchange-value-group exchange-value-party1">
                                    <span class="exchange-var">ACK</span> = <span class="exchange-value" data-device-ack>✓ Verified</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    `}

                </div>

                <!-- Exchange Column (Middle) -->
                <div class="exchange-column">

                    ${isWPA3 ? `
                    <!-- WPA3: Device → Router Commit -->
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 3</span>: Device Commit →</div>
                        <div class="exchange-arrow-grid">
                            <div class="exchange-arrow-group">
                                <div class="exchange-arrow exchange-arrow-right">
                                    <div class="exchange-value-group exchange-value-party1">
                                        <span class="exchange-var">D<sub>c</sub></span> = <span class="exchange-value" data-arrow-device-commit>?</span>
                                    </div>
                                    <span class="exchange-arrow-icon">→</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- WPA3: Router → Device Commit -->
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 4</span>: ← Router Commit</div>
                        <div class="exchange-arrow-grid">
                            <div class="exchange-arrow-group">
                                <div class="exchange-arrow exchange-arrow-left">
                                    <div class="exchange-value-group exchange-value-party2">
                                        <span class="exchange-var">R<sub>c</sub></span> = <span class="exchange-value" data-arrow-router-commit>?</span>
                                    </div>
                                    <span class="exchange-arrow-icon">←</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- WPA3: Device → Router Confirm -->
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 5</span>: Device Confirm →</div>
                        <div class="exchange-arrow-grid">
                            <div class="exchange-arrow-group">
                                <div class="exchange-arrow exchange-arrow-right">
                                    <div class="exchange-value-group exchange-value-party1">
                                        <span class="exchange-var">D<sub>cf</sub></span> = <span class="exchange-value" data-arrow-device-confirm>?</span>
                                    </div>
                                    <span class="exchange-arrow-icon">→</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- WPA3: Router → Device Confirm -->
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 6</span>: ← Router Confirm</div>
                        <div class="exchange-arrow-grid">
                            <div class="exchange-arrow-group">
                                <div class="exchange-arrow exchange-arrow-left">
                                    <div class="exchange-value-group exchange-value-party2">
                                        <span class="exchange-var">R<sub>cf</sub></span> = <span class="exchange-value" data-arrow-router-confirm>?</span>
                                    </div>
                                    <span class="exchange-arrow-icon">←</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    ${showIntercept ? `
                    <div class="exchange-eve">
                        <div class="exchange-eve-icon">👁️ Attacker captures packets</div>
                        <div class="exchange-eve-text">Can see: Commit &amp; Confirm messages</div>
                        <div class="exchange-eve-text">Cannot see: Password, Session Key</div>
                        <div class="exchange-eve-problem">🔒 SAE commits are useless without the password — offline cracking is impossible!</div>
                    </div>
                    ` : ''}

                    ` : `
                    <!-- WPA2: Router → Device ANonce (Message 1) -->
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 2</span>: ← Router sends ANonce</div>
                        <div class="exchange-arrow-grid">
                            <div class="exchange-arrow-group">
                                <div class="exchange-arrow exchange-arrow-left">
                                    <div class="exchange-value-group exchange-value-party2">
                                        <span class="exchange-var">ANonce</span> = <span class="exchange-value" data-arrow-anonce>?</span>
                                    </div>
                                    <span class="exchange-arrow-icon">←</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- WPA2: Device → Router SNonce + MIC (Message 2) -->
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 4</span>: Device sends SNonce + MIC →</div>
                        <div class="exchange-arrow-grid">
                            <div class="exchange-arrow-group">
                                <div class="exchange-arrow exchange-arrow-right">
                                    <div class="exchange-value-group exchange-value-party1">
                                        <span class="exchange-var">SNonce</span> = <span class="exchange-value" data-arrow-snonce>?</span>
                                    </div>
                                    <span class="exchange-arrow-icon">→</span>
                                </div>
                            </div>
                            <div class="exchange-arrow-group">
                                <div class="exchange-arrow exchange-arrow-right">
                                    <div class="exchange-value-group exchange-value-party1">
                                        <span class="exchange-var">MIC</span> = <span class="exchange-value" data-arrow-mic1>?</span>
                                    </div>
                                    <span class="exchange-arrow-icon">→</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- WPA2: Router → Device GTK + MIC (Message 3) -->
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 5</span>: ← Router sends GTK + MIC</div>
                        <div class="exchange-arrow-grid">
                            <div class="exchange-arrow-group">
                                <div class="exchange-arrow exchange-arrow-left">
                                    <div class="exchange-value-group exchange-value-party2">
                                        <span class="exchange-var">GTK</span> = <span class="exchange-value" data-arrow-gtk>?</span>
                                    </div>
                                    <span class="exchange-arrow-icon">←</span>
                                </div>
                            </div>
                            <div class="exchange-arrow-group">
                                <div class="exchange-arrow exchange-arrow-left">
                                    <div class="exchange-value-group exchange-value-party2">
                                        <span class="exchange-var">MIC</span> = <span class="exchange-value" data-arrow-mic2>?</span>
                                    </div>
                                    <span class="exchange-arrow-icon">←</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- WPA2: Device → Router ACK (Message 4) -->
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 6</span>: Device sends ACK →</div>
                        <div class="exchange-arrow-grid">
                            <div class="exchange-arrow-group">
                                <div class="exchange-arrow exchange-arrow-right">
                                    <div class="exchange-value-group exchange-value-party1">
                                        <span class="exchange-var">ACK</span> = <span class="exchange-value" data-arrow-ack>✓</span>
                                    </div>
                                    <span class="exchange-arrow-icon">→</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    ${showIntercept ? `
                    <div class="exchange-eve">
                        <div class="exchange-eve-icon">👁️ Attacker captures packets</div>
                        <div class="exchange-eve-text">Can see: ANonce, SNonce, MIC values</div>
                        <div class="exchange-eve-text">Cannot see: Password, PTK session key</div>
                        <div class="exchange-eve-problem">⚠️ WPA2 handshake can be captured then attacked offline — a strong password is essential!</div>
                    </div>
                    ` : ''}
                    `}

                </div>

                <!-- Router (Bob role) -->
                <div class="exchange-party exchange-party2">
                    <div class="exchange-party-header">
                        <div class="exchange-party-name">📡 Router</div>
                    </div>

                    <!-- Step 1: Router knows the password -->
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 1</span>: Knows the password</div>
                        <div class="exchange-step-content">
                            <div class="exchange-result exchange-show">
                                <div class="exchange-value-group exchange-value-party2">
                                    <span class="exchange-var">pwd</span> = <span class="exchange-value" data-router-pwd>••••••••</span>
                                </div>
                                <span class="exchange-badge exchange-secret-badge">Secret</span>
                            </div>
                        </div>
                    </div>

                    ${isWPA3 ? `
                    <!-- WPA3 Step 4: Router sends Commit -->
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 4</span>: Sends Commit message</div>
                        <div class="exchange-step-content">
                            <div class="wifi-formula">
                                <span class="wifi-func">commit</span>(<span class="exchange-var">pwd</span>) → <span class="exchange-var">R<sub>commit</sub></span>
                            </div>
                            <div class="exchange-result" data-router-commit-result>
                                <div class="exchange-value-group exchange-value-party2">
                                    <span class="exchange-var">R<sub>c</sub></span> = <span class="exchange-value" data-router-commit>?</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- WPA3 Step 6: Router sends Confirm -->
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 6</span>: Sends Confirm message</div>
                        <div class="exchange-step-content">
                            <div class="wifi-formula">
                                <span class="wifi-func">confirm</span>(<span class="exchange-var">R<sub>c</sub></span>, <span class="exchange-var">D<sub>c</sub></span>) → <span class="exchange-var">R<sub>conf</sub></span>
                            </div>
                            <div class="exchange-result" data-router-confirm-result>
                                <div class="exchange-value-group exchange-value-party2">
                                    <span class="exchange-var">R<sub>cf</sub></span> = <span class="exchange-value" data-router-confirm>?</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- WPA3 Step 7: Router derives Session Key -->
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 7</span>: Derives session key</div>
                        <div class="exchange-step-content">
                            <div class="wifi-formula">
                                <span class="wifi-func">KDF</span>(<span class="exchange-var">pwd</span>, <span class="exchange-var">D<sub>c</sub></span>, <span class="exchange-var">R<sub>c</sub></span>) → <span class="exchange-var">PMK</span>
                            </div>
                            <div class="exchange-result" data-router-key-result>
                                <div class="exchange-value-group exchange-value-shared">
                                    <span class="exchange-var">PMK</span> = <span class="exchange-value wifi-key" data-router-key>?</span>
                                </div>
                                <span class="exchange-badge exchange-shared-badge">Session Key</span>
                            </div>
                        </div>
                    </div>

                    ` : `
                    <!-- WPA2 Step 2: Router generates ANonce -->
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 2</span>: Generates ANonce</div>
                        <div class="exchange-step-content">
                            <div class="exchange-result" data-router-anonce-result>
                                <div class="exchange-value-group exchange-value-party2">
                                    <span class="exchange-var">ANonce</span> = <span class="exchange-value" data-router-anonce>?</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- WPA2 Step 5: Router derives PTK, verifies MIC -->
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 5</span>: Derives key, verifies MIC</div>
                        <div class="exchange-step-content">
                            <div class="wifi-formula">
                                <span class="wifi-func">PTK</span> = <span class="wifi-func">PRF</span>(<span class="exchange-var">pwd</span>, <span class="exchange-var">ANonce</span>, <span class="exchange-var">SNonce</span>)
                            </div>
                            <div class="exchange-result" data-router-key-result>
                                <div class="exchange-value-group exchange-value-shared">
                                    <span class="exchange-var">PTK</span> = <span class="exchange-value wifi-key" data-router-key>?</span>
                                </div>
                                <span class="exchange-badge exchange-shared-badge">Session Key</span>
                            </div>
                            <div class="exchange-result" data-router-verify-result>
                                <div class="exchange-value-group exchange-value-shared">
                                    <span class="exchange-var">MIC</span> = <span class="exchange-value" data-router-verify>✓ Verified</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    `}

                </div>

            </div>

            <!-- Session established banner -->
            <div class="wifi-session-banner" data-session-banner>
                <span class="wifi-session-icon">🔒</span>
                <span class="wifi-session-text">Encrypted session established — all traffic is now protected</span>
            </div>

            <div class="exchange-footer">
                <div class="exchange-controls">
                    <button class="exchange-btn exchange-btn-start">
                        <span class="btn-icon">▶</span>
                        <span class="btn-text">Start</span>
                    </button>
                    <button class="exchange-btn exchange-btn-reset">
                        <span class="btn-icon">↺</span>
                        <span class="btn-text">Reset</span>
                    </button>
                    <button class="exchange-btn exchange-btn-step">
                        <span class="btn-icon">→</span>
                        <span class="btn-text">Next</span>
                    </button>
                </div>
                <div class="exchange-status" aria-live="polite"></div>
            </div>
        `
        return wrapper
    }

    // -------------------------------------------------------------------------
    // Animation Controller
    // -------------------------------------------------------------------------

    const CSS_CLASSES = window.ExchangeCore.CSS_CLASSES

    class WiFiAnimation extends window.ExchangeAnimation {
        constructor(el, security, ssid, showIntercept) {
            const timing = {
                BASE: 500,
                get REVEAL() { return this.BASE },
                get STEP() { return this.BASE + 200 },
                get ANIMATE() { return this.STEP + 400 },
                get BETWEEN_STEPS() { return this.ANIMATE + 400 }
            }
            super(el, { timing })

            this.security     = security
            this.ssid         = ssid
            this.showIntercept = showIntercept

            this.regenerateValues()
        }

        get isWPA3() { return this.security === 'wpa3' }

        getMaxSteps() { return this.isWPA3 ? 7 : 7 }

        async executeStep(n) {
            if (this.isWPA3) {
                switch (n) {
                    case 1: await this.wpa3_step1_KnowPassword(); break
                    case 2: await this.wpa3_step2_DeviceCommit(); break
                    case 3: await this.wpa3_step3_SendDeviceCommit(); break
                    case 4: await this.wpa3_step4_RouterCommit(); break
                    case 5: await this.wpa3_step5_DeviceConfirm(); break
                    case 6: await this.wpa3_step6_RouterConfirm(); break
                    case 7: await this.wpa3_step7_DeriveKeys(); break
                }
            } else {
                switch (n) {
                    case 1: await this.wpa2_step1_KnowPassword(); break
                    case 2: await this.wpa2_step2_RouterANonce(); break
                    case 3: await this.wpa2_step3_DeviceSNonce(); break
                    case 4: await this.wpa2_step4_DeviceSendsMIC(); break
                    case 5: await this.wpa2_step5_RouterDerivesKey(); break
                    case 6: await this.wpa2_step6_RouterSendsGTK(); break
                    case 7: await this.wpa2_step7_DeviceACK(); break
                }
            }
        }

        resetState() {
            this.regenerateValues()
        }

        setupDOM() {
            const q = (s) => this.el.querySelector(s)
            const isWPA3 = this.isWPA3

            this.dom = {
                device: {
                    pwd:           q('[data-device-pwd]'),
                    snonce:        q('[data-device-snonce]'),
                    snonceResult:  q('[data-device-snonce-result]'),
                    key:           q('[data-device-key]'),
                    keyResult:     q('[data-device-key-result]'),
                    ackResult:     q('[data-device-ack-result]'),
                    commit:        q('[data-device-commit]'),
                    commitResult:  q('[data-device-commit-result]'),
                    confirm:       q('[data-device-confirm]'),
                    confirmResult: q('[data-device-confirm-result]'),
                },
                router: {
                    pwd:           q('[data-router-pwd]'),
                    anonce:        q('[data-router-anonce]'),
                    anonceResult:  q('[data-router-anonce-result]'),
                    key:           q('[data-router-key]'),
                    keyResult:     q('[data-router-key-result]'),
                    verifyResult:  q('[data-router-verify-result]'),
                    commit:        q('[data-router-commit]'),
                    commitResult:  q('[data-router-commit-result]'),
                    confirm:       q('[data-router-confirm]'),
                    confirmResult: q('[data-router-confirm-result]'),
                },
                arrows: {
                    anonce:        q('[data-arrow-anonce]'),
                    snonce:        q('[data-arrow-snonce]'),
                    mic1:          q('[data-arrow-mic1]'),
                    gtk:           q('[data-arrow-gtk]'),
                    mic2:          q('[data-arrow-mic2]'),
                    deviceCommit:  q('[data-arrow-device-commit]'),
                    routerCommit:  q('[data-arrow-router-commit]'),
                    deviceConfirm: q('[data-arrow-device-confirm]'),
                    routerConfirm: q('[data-arrow-router-confirm]'),
                    left:          this.el.querySelectorAll('.exchange-arrow-left'),
                    right:         this.el.querySelectorAll('.exchange-arrow-right'),
                },
                exchangeSteps:  this.el.querySelectorAll('.exchange-column .exchange-step'),
                sessionBanner:  q('[data-session-banner]'),
                eveNote:        q('.exchange-eve'),
            }
        }

        resetUI() {
            const selectors = [
                '[data-device-snonce]', '[data-device-key]', '[data-device-commit]', '[data-device-confirm]',
                '[data-router-anonce]', '[data-router-key]', '[data-router-commit]', '[data-router-confirm]',
                '[data-arrow-anonce]', '[data-arrow-snonce]', '[data-arrow-mic1]', '[data-arrow-gtk]', '[data-arrow-mic2]',
                '[data-arrow-device-commit]', '[data-arrow-router-commit]', '[data-arrow-device-confirm]', '[data-arrow-router-confirm]',
            ]
            this.resetElementsToDefault(selectors.join(', '))

            // Restore initial show states (Step 1 password steps)
            this.el.querySelectorAll('.exchange-step').forEach(el => {
                if (el.querySelector('[data-device-pwd], [data-router-pwd]')) {
                    el.querySelector('.exchange-result')?.classList.add(CSS_CLASSES.SHOW)
                }
            })

            if (this.dom.sessionBanner) {
                this.dom.sessionBanner.classList.remove(CSS_CLASSES.SHOW)
            }
        }

        regenerateValues() {
            this.anonce   = randomHex(NONCE_LEN, 2)
            this.snonce   = randomHex(NONCE_LEN, 2)
            this.mic1     = randomHex(MIC_LEN, 2)
            this.mic2     = randomHex(MIC_LEN, 2)
            this.gtk      = randomHex(KEY_LEN, 2)
            this.sessionKey = deriveKey(this.anonce, this.snonce, this.ssid)
            // WPA3 commit / confirm values
            this.deviceCommit  = randomHex(NONCE_LEN, 2)
            this.routerCommit  = randomHex(NONCE_LEN, 2)
            this.deviceConfirm = randomHex(MIC_LEN, 2)
            this.routerConfirm = randomHex(MIC_LEN, 2)
            this.wpa3Key = deriveKey(this.deviceCommit, this.routerCommit, this.ssid)
        }

        // -------------------------------------------------------------------------
        // Helpers
        // -------------------------------------------------------------------------

        /** Show an arrow, optionally with a value, and animate it */
        async showArrow(arrowEl, valueEl, value) {
            if (valueEl) valueEl.textContent = value ?? valueEl.textContent
            arrowEl.classList.add(CSS_CLASSES.SHOW, CSS_CLASSES.PULSE)
            arrowEl.classList.add(CSS_CLASSES.ANIMATE)
            await this.sleep(this.TIMING.ANIMATE)
        }

        /** Show multiple arrows in sequence for multi-value steps */
        async showArrowSequence(arrowEls) {
            for (const arrowEl of arrowEls) {
                await this.showArrow(arrowEl, null, null)
                if (!this.isRunning) return
            }
        }

        /** Reveal a result container with a value */
        revealResult(resultEl, valueEl, value) {
            if (valueEl && value !== undefined) valueEl.textContent = value
            if (resultEl) {
                resultEl.classList.add(CSS_CLASSES.PULSE)
                resultEl.classList.add(CSS_CLASSES.SHOW)
            }
        }

        // -------------------------------------------------------------------------
        // WPA2 Steps
        // -------------------------------------------------------------------------

        async wpa2_step1_KnowPassword() {
            this.setStatus(`Both Device and Router already know the Wi-Fi password for "${this.ssid}"`, 'info')

            const deviceStep = this.dom.device.pwd.closest('.exchange-step')
            const routerStep = this.dom.router.pwd.closest('.exchange-step')
            this.activateStep(deviceStep)
            this.activateStep(routerStep)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            this.dom.device.pwd.closest('.exchange-result').classList.add(CSS_CLASSES.PULSE)
            this.dom.router.pwd.closest('.exchange-result').classList.add(CSS_CLASSES.PULSE)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.completeStep(deviceStep)
            this.completeStep(routerStep)
        }

        async wpa2_step2_RouterANonce() {
            this.setStatus('Router generates a random ANonce and sends it to the Device (Message 1)', 'info')

            const routerStep    = this.dom.router.anonce.closest('.exchange-step')
            const exchangeStep  = this.dom.exchangeSteps[0]
            this.activateStep(routerStep)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            this.revealResult(this.dom.router.anonceResult, this.dom.router.anonce, this.anonce)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.completeStep(routerStep)
            this.activateStep(exchangeStep)

            // Animate arrow from Router → Device
            const arrowEl = exchangeStep.querySelector('.exchange-arrow-left')
            if (this.dom.arrows.anonce) this.dom.arrows.anonce.textContent = this.anonce
            await this.showArrow(arrowEl, null, null)
            if (!this.isRunning) return

            this.completeStep(exchangeStep)
        }

        async wpa2_step3_DeviceSNonce() {
            this.setStatus('Device generates its own random SNonce and derives the session key (PTK) using the password, ANonce and SNonce', 'info')

            const deviceStep = this.dom.device.snonce.closest('.exchange-step')
            this.activateStep(deviceStep)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            this.revealResult(this.dom.device.snonceResult, this.dom.device.snonce, this.snonce)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.revealResult(this.dom.device.keyResult, this.dom.device.key, this.sessionKey)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.completeStep(deviceStep)
        }

        async wpa2_step4_DeviceSendsMIC() {
            this.setStatus('Device sends SNonce + a MIC (Message Integrity Code, computed with PTK) to the Router (Message 2)', 'info')

            const exchangeStep = this.dom.exchangeSteps[1]
            this.activateStep(exchangeStep)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            const arrowEls = exchangeStep.querySelectorAll('.exchange-arrow-right')
            if (this.dom.arrows.snonce) this.dom.arrows.snonce.textContent = this.snonce
            if (this.dom.arrows.mic1) this.dom.arrows.mic1.textContent = this.mic1
            await this.showArrowSequence(arrowEls)
            if (!this.isRunning) return

            this.completeStep(exchangeStep)
        }

        async wpa2_step5_RouterDerivesKey() {
            this.setStatus('Router derives the same PTK (using the password, ANonce and SNonce), then verifies the MIC — confirming the Device knows the password', 'info')

            const routerStep = this.dom.router.key.closest('.exchange-step')
            this.activateStep(routerStep)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            this.revealResult(this.dom.router.keyResult, this.dom.router.key, this.sessionKey)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.revealResult(this.dom.router.verifyResult, null, null)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.completeStep(routerStep)
        }

        async wpa2_step6_RouterSendsGTK() {
            this.setStatus('Router sends the GTK (Group Temporal Key for broadcast traffic) + its own MIC, encrypted with PTK (Message 3)', 'info')

            const exchangeStep = this.dom.exchangeSteps[2]
            this.activateStep(exchangeStep)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            const arrowEls = exchangeStep.querySelectorAll('.exchange-arrow-left')
            if (this.dom.arrows.gtk)  this.dom.arrows.gtk.textContent  = this.gtk
            if (this.dom.arrows.mic2) this.dom.arrows.mic2.textContent = this.mic2
            await this.showArrowSequence(arrowEls)
            if (!this.isRunning) return

            this.completeStep(exchangeStep)
        }

        async wpa2_step7_DeviceACK() {
            this.setStatus('Device installs the keys and sends an ACK (Message 4) — handshake complete, session is encrypted!', 'success')

            const deviceStep   = this.dom.device.ackResult?.closest('.exchange-step')
            const exchangeStep = this.dom.exchangeSteps[3]
            this.activateStep(deviceStep)
            this.activateStep(exchangeStep)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            this.revealResult(this.dom.device.ackResult, null, null)

            const arrowEl = exchangeStep.querySelector('.exchange-arrow-right')
            await this.showArrow(arrowEl, null, null)
            if (!this.isRunning) return

            if (this.showIntercept && this.dom.eveNote) {
                this.dom.eveNote.classList.add(CSS_CLASSES.SHOW)
            }

            if (this.dom.sessionBanner) {
                this.dom.sessionBanner.classList.add(CSS_CLASSES.SHOW)
            }

            this.completeStep(deviceStep)
            this.completeStep(exchangeStep)

            this.setStatus('✨ 4-Way Handshake complete! The password was never sent — both sides proved they knew it.', 'success')
        }

        // -------------------------------------------------------------------------
        // WPA3 Steps
        // -------------------------------------------------------------------------

        async wpa3_step1_KnowPassword() {
            this.setStatus(`Both Device and Router already know the Wi-Fi password for "${this.ssid}"`, 'info')

            const deviceStep = this.dom.device.pwd.closest('.exchange-step')
            const routerStep = this.dom.router.pwd.closest('.exchange-step')
            this.activateStep(deviceStep)
            this.activateStep(routerStep)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            this.dom.device.pwd.closest('.exchange-result').classList.add(CSS_CLASSES.PULSE)
            this.dom.router.pwd.closest('.exchange-result').classList.add(CSS_CLASSES.PULSE)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.completeStep(deviceStep)
            this.completeStep(routerStep)
        }

        async wpa3_step2_DeviceCommit() {
            this.setStatus('WPA3 SAE: Device computes a Commit value — a public number derived from the password using elliptic curve maths', 'info')

            const deviceStep = this.dom.device.commit.closest('.exchange-step')
            this.activateStep(deviceStep)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            this.revealResult(this.dom.device.commitResult, this.dom.device.commit, this.deviceCommit)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.completeStep(deviceStep)
        }

        async wpa3_step3_SendDeviceCommit() {
            this.setStatus('Device sends its Commit message to the Router', 'info')

            const exchangeStep = this.dom.exchangeSteps[0]
            this.activateStep(exchangeStep)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            const arrowEl = exchangeStep.querySelector('.exchange-arrow-right')
            if (this.dom.arrows.deviceCommit) this.dom.arrows.deviceCommit.textContent = this.deviceCommit
            await this.showArrow(arrowEl, null, null)
            if (!this.isRunning) return

            this.completeStep(exchangeStep)
        }

        async wpa3_step4_RouterCommit() {
            this.setStatus('Router computes its own Commit value and sends it back — both sides exchange commits simultaneously', 'info')

            const routerStep   = this.dom.router.commit.closest('.exchange-step')
            const exchangeStep = this.dom.exchangeSteps[1]
            this.activateStep(routerStep)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            this.revealResult(this.dom.router.commitResult, this.dom.router.commit, this.routerCommit)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.completeStep(routerStep)
            this.activateStep(exchangeStep)

            const arrowEl = exchangeStep.querySelector('.exchange-arrow-left')
            if (this.dom.arrows.routerCommit) this.dom.arrows.routerCommit.textContent = this.routerCommit
            await this.showArrow(arrowEl, null, null)
            if (!this.isRunning) return

            this.completeStep(exchangeStep)
        }

        async wpa3_step5_DeviceConfirm() {
            this.setStatus('Device sends a Confirm message — proves it knows the password without revealing it', 'info')

            const deviceStep   = this.dom.device.confirm.closest('.exchange-step')
            const exchangeStep = this.dom.exchangeSteps[2]
            this.activateStep(deviceStep)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            this.revealResult(this.dom.device.confirmResult, this.dom.device.confirm, this.deviceConfirm)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.completeStep(deviceStep)
            this.activateStep(exchangeStep)

            const arrowEl = exchangeStep.querySelector('.exchange-arrow-right')
            if (this.dom.arrows.deviceConfirm) this.dom.arrows.deviceConfirm.textContent = this.deviceConfirm
            await this.showArrow(arrowEl, null, null)
            if (!this.isRunning) return

            this.completeStep(exchangeStep)
        }

        async wpa3_step6_RouterConfirm() {
            this.setStatus('Router sends its Confirm message — mutual authentication complete', 'info')

            const routerStep   = this.dom.router.confirm.closest('.exchange-step')
            const exchangeStep = this.dom.exchangeSteps[3]
            this.activateStep(routerStep)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            this.revealResult(this.dom.router.confirmResult, this.dom.router.confirm, this.routerConfirm)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.completeStep(routerStep)
            this.activateStep(exchangeStep)

            const arrowEl = exchangeStep.querySelector('.exchange-arrow-left')
            if (this.dom.arrows.routerConfirm) this.dom.arrows.routerConfirm.textContent = this.routerConfirm
            await this.showArrow(arrowEl, null, null)
            if (!this.isRunning) return

            if (this.showIntercept && this.dom.eveNote) {
                this.dom.eveNote.classList.add(CSS_CLASSES.SHOW)
            }

            this.completeStep(exchangeStep)
        }

        async wpa3_step7_DeriveKeys() {
            this.setStatus('Both sides independently derive the same PMK (session key) from the password and exchanged commit values — session is secure!', 'info')

            const deviceStep = this.dom.device.key.closest('.exchange-step')
            const routerStep = this.dom.router.key.closest('.exchange-step')
            this.activateStep(deviceStep)
            this.activateStep(routerStep)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            this.revealResult(this.dom.device.keyResult, this.dom.device.key, this.wpa3Key)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.revealResult(this.dom.router.keyResult, this.dom.router.key, this.wpa3Key)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            if (this.dom.sessionBanner) {
                this.dom.sessionBanner.classList.add(CSS_CLASSES.SHOW)
            }

            this.completeStep(deviceStep)
            this.completeStep(routerStep)

            this.setStatus('✨ SAE Handshake complete! The password was never transmitted — even captured packets cannot be cracked.', 'success')
        }
    }

    // -------------------------------------------------------------------------
    // Plugin Entry Point
    // -------------------------------------------------------------------------

    function processWiFi() {
        document.querySelectorAll('.markdown-section wifi').forEach(el => {
            const security     = (el.getAttribute('security') || 'wpa2').toLowerCase()
            const ssid         = el.getAttribute('ssid') || 'SchoolWiFi'
            const showIntercept = el.hasAttribute('intercept')

            if (security !== 'wpa2' && security !== 'wpa3') {
                el.innerHTML = '<div class="exchange-error">Error: security must be "wpa2" or "wpa3"</div>'
                return
            }

            el.innerHTML = ''
            el.appendChild(buildUI(security, ssid, showIntercept))
            new WiFiAnimation(el, security, ssid, showIntercept)
        })
    }

    const docsifyWiFi = function (hook) {
        hook.doneEach(processWiFi)
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyWiFi, window.$docsify.plugins || [])

})()
