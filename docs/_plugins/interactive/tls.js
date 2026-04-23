/**
 * tls.js — Simplified TLS Handshake Visualiser
 *
 * Demonstrates hybrid encryption in TLS:
 *   - Asymmetric crypto to establish shared secret
 *   - Symmetric session key for fast encrypted data transfer
 *
 * Usage:
 *   <tls></tls>
 *   <tls domain="school.nz"></tls>
 *   <tls version="1.2"></tls>
 *   <tls intercept></tls>
 *
 * Attributes:
 *   - domain:    Server name shown in certificate (default: "school.portal.nz")
 *   - version:   TLS version mode: "1.2" or "1.3" (default: "1.3")
 *   - intercept: Show attacker view in exchange column
 */

;(function () {

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    function randomHex(length) {
        const chars = 'ABCDEF0123456789'
        let out = ''
        for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)]
        return out
    }

    function formatHex(str) {
        return str.match(/.{1,4}/g).join(' ')
    }

    function deriveSessionKey(clientRandom, serverRandom, premaster) {
        // Visual teaching hash only; not real TLS key derivation.
        const input = `${clientRandom}:${serverRandom}:${premaster}`
        let h = 0x811c9dc5
        for (let i = 0; i < input.length; i++) {
            h ^= input.charCodeAt(i)
            h = (h * 0x01000193) >>> 0
        }
        return formatHex(h.toString(16).toUpperCase().padStart(8, '0'))
    }

    function visualEncrypt(plain, key) {
        const input = `${plain}|${key}`
        let out = ''
        for (let offset = 0; offset < 4; offset++) {
            let h = offset * 0x9e3779b9
            for (let i = 0; i < input.length; i++) {
                h = ((h << 5) - h) + input.charCodeAt(i) + (offset * i)
                h |= 0
            }
            out += Math.abs(h).toString(16).toUpperCase().padStart(8, '0').slice(-8)
        }
        return out.match(/.{1,4}/g).join(' ')
    }

    // -------------------------------------------------------------------------
    // UI
    // -------------------------------------------------------------------------

    function normaliseVersion(value) {
        return value === '1.2' ? '1.2' : '1.3'
    }

    function buildUI(domain, showIntercept, tlsVersion) {
        const wrapper = document.createElement('div')
        wrapper.className = 'exchange-wrapper'

        const isTls13 = tlsVersion === '1.3'
        const modeText = isTls13 ? 'TLS 1.3 (ECDHE)' : 'TLS 1.2 (RSA key exchange)'
        const step2Label = isTls13
            ? 'ServerHello + certificate + key share'
            : 'ServerHello + certificate'
        const step3Label = isTls13
            ? 'Validate certificate & create key share'
            : 'Validate certificate & create premaster'
        const step4WireLabel = isTls13
            ? 'Send client key share'
            : 'Send encrypted premaster'
        const step4ServerLabel = isTls13
            ? 'Compute shared handshake secret'
            : 'Decrypt premaster'
        const secretVar = isTls13 ? 'handshakeSecret' : 'premaster'
        const wireVar = isTls13 ? 'clientKeyShare' : 'encPremaster'

        wrapper.innerHTML = `
            <div class="exchange-header">
                <div class="exchange-header-content">
                    <div class="exchange-title">Simplified TLS Handshake</div>
                    <div class="exchange-subtitle">Asymmetric setup first, then symmetric encryption for fast secure data.</div>
                </div>
                <div class="tls-meta">
                    <span class="tls-chip">Domain: <strong>${domain}</strong></span>
                    <span class="tls-chip">Mode: <strong>${modeText}</strong></span>
                    <div class="tls-toggle" role="group" aria-label="TLS version">
                        <button class="tls-toggle-btn ${tlsVersion === '1.2' ? 'is-active' : ''}" type="button" data-tls-version="1.2">TLS 1.2</button>
                        <button class="tls-toggle-btn ${tlsVersion === '1.3' ? 'is-active' : ''}" type="button" data-tls-version="1.3">TLS 1.3</button>
                    </div>
                </div>
            </div>

            <div class="exchange-grid">

                <div class="exchange-party exchange-party1">
                    <div class="exchange-party-header">
                        <div class="exchange-party-name">💻 Client (Browser)</div>
                    </div>

                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 1</span>: ClientHello</div>
                        <div class="exchange-step-content">
                            <div class="exchange-result" data-client-random-result>
                                <div class="exchange-value-group exchange-value-party1">
                                    <span class="exchange-var">clientRandom</span> = <span class="exchange-value tls-code" data-client-random>?</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 3</span>: ${step3Label}</div>
                        <div class="exchange-step-content">
                            <div class="exchange-result" data-cert-check-result>
                                <div class="exchange-value-group exchange-value-success">
                                    <span class="exchange-var">certificate</span> = <span class="exchange-value" data-cert-check>?</span>
                                </div>
                            </div>
                            <div class="exchange-result" data-premaster-result>
                                <div class="exchange-value-group exchange-value-party1">
                                    <span class="exchange-var">${secretVar}</span> = <span class="exchange-value tls-code" data-premaster>?</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 5</span>: Derive session key</div>
                        <div class="exchange-step-content">
                            <div class="exchange-result" data-client-session-result>
                                <div class="exchange-value-group exchange-value-shared">
                                    <span class="exchange-var">sessionKey</span> = <span class="exchange-value tls-code" data-client-session>?</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 6</span>: Encrypt request data</div>
                        <div class="exchange-step-content">
                            <div class="exchange-result exchange-show">
                                <div class="exchange-value-group exchange-value-party1">
                                    <span class="exchange-var">request</span> = <span class="exchange-value" data-client-request>GET /grades</span>
                                </div>
                            </div>
                            <div class="exchange-result" data-client-cipher-result>
                                <div class="exchange-value-group exchange-value-party1">
                                    <span class="exchange-var">cipher</span> = <span class="exchange-value tls-code" data-client-cipher>?</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="exchange-column">
                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 2</span>: ${step2Label}</div>
                        <div class="exchange-arrow-grid">
                            <div class="exchange-arrow-group">
                                <div class="exchange-arrow exchange-arrow-left">
                                    <div class="exchange-value-group exchange-value-party2">
                                        <span class="exchange-var">serverRandom</span> = <span class="exchange-value tls-code" data-arrow-server-random>?</span>
                                    </div>
                                    <span class="exchange-arrow-icon">←</span>
                                </div>
                            </div>
                            <div class="exchange-arrow-group">
                                <div class="exchange-arrow exchange-arrow-left">
                                    <div class="exchange-value-group exchange-value-party2">
                                        <span class="exchange-var">cert</span> = <span class="exchange-value" data-arrow-cert>?</span>
                                    </div>
                                    <span class="exchange-arrow-icon">←</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 4</span>: ${step4WireLabel}</div>
                        <div class="exchange-arrow-grid">
                            <div class="exchange-arrow-group">
                                <div class="exchange-arrow exchange-arrow-right">
                                    <div class="exchange-value-group exchange-value-party1">
                                        <span class="exchange-var">${wireVar}</span> = <span class="exchange-value tls-code" data-arrow-premaster>?</span>
                                    </div>
                                    <span class="exchange-arrow-icon">→</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 6</span>: Encrypted application data</div>
                        <div class="exchange-arrow-grid">
                            <div class="exchange-arrow-group">
                                <div class="exchange-arrow exchange-arrow-right">
                                    <div class="exchange-value-group exchange-value-party1">
                                        <span class="exchange-var">requestCipher</span> = <span class="exchange-value tls-code" data-arrow-request-cipher>?</span>
                                    </div>
                                    <span class="exchange-arrow-icon">→</span>
                                </div>
                            </div>
                            <div class="exchange-arrow-group">
                                <div class="exchange-arrow exchange-arrow-left">
                                    <div class="exchange-value-group exchange-value-party2">
                                        <span class="exchange-var">responseCipher</span> = <span class="exchange-value tls-code" data-arrow-response-cipher>?</span>
                                    </div>
                                    <span class="exchange-arrow-icon">←</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    ${showIntercept ? `
                    <div class="exchange-eve">
                        <div class="exchange-eve-icon">👁️ Interceptor</div>
                        <div class="exchange-eve-text">Can see: hello messages, certificate, encrypted blobs</div>
                        <div class="exchange-eve-problem">Cannot derive session key or read app data</div>
                    </div>
                    ` : ''}
                </div>

                <div class="exchange-party exchange-party2">
                    <div class="exchange-party-header">
                        <div class="exchange-party-name">🖥️ Server</div>
                    </div>

                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 2</span>: ServerHello values</div>
                        <div class="exchange-step-content">
                            <div class="exchange-result exchange-show" data-server-random-result>
                                <div class="exchange-value-group exchange-value-party2">
                                    <span class="exchange-var">serverRandom</span> = <span class="exchange-value tls-code" data-server-random>?</span>
                                </div>
                            </div>
                            <div class="exchange-result exchange-show" data-server-cert-result>
                                <div class="exchange-value-group exchange-value-party2">
                                    <span class="exchange-var">certificate</span> = <span class="exchange-value" data-server-cert>?</span>
                                </div>
                                <span class="exchange-badge exchange-public-badge">Contains server public key</span>
                            </div>
                        </div>
                    </div>

                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 4</span>: ${step4ServerLabel}</div>
                        <div class="exchange-step-content">
                            <div class="exchange-result" data-server-premaster-result>
                                <div class="exchange-value-group exchange-value-party2">
                                    <span class="exchange-var">${secretVar}</span> = <span class="exchange-value tls-code" data-server-premaster>?</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 5</span>: Derive session key</div>
                        <div class="exchange-step-content">
                            <div class="exchange-result" data-server-session-result>
                                <div class="exchange-value-group exchange-value-shared">
                                    <span class="exchange-var">sessionKey</span> = <span class="exchange-value tls-code" data-server-session>?</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="exchange-step">
                        <div class="exchange-step-label"><span class="exchange-step-label-num">Step 7</span>: Decrypt and respond securely</div>
                        <div class="exchange-step-content">
                            <div class="exchange-result" data-server-plain-result>
                                <div class="exchange-value-group exchange-value-success">
                                    <span class="exchange-var">requestPlain</span> = <span class="exchange-value" data-server-plain>?</span>
                                </div>
                            </div>
                            <div class="exchange-result exchange-show">
                                <div class="exchange-value-group exchange-value-party2">
                                    <span class="exchange-var">response</span> = <span class="exchange-value" data-server-response>200 OK</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="exchange-footer">
                <div class="exchange-controls">
                    <button class="exchange-btn exchange-btn-start"><span class="btn-icon">▶</span><span class="btn-text">Start</span></button>
                    <button class="exchange-btn exchange-btn-reset"><span class="btn-icon">↺</span><span class="btn-text">Reset</span></button>
                    <button class="exchange-btn exchange-btn-step"><span class="btn-icon">→</span><span class="btn-text">Next</span></button>
                </div>
                <div class="exchange-status" aria-live="polite"></div>
            </div>
        `

        return wrapper
    }

    // -------------------------------------------------------------------------
    // Animation
    // -------------------------------------------------------------------------

    const CSS_CLASSES = window.ExchangeCore.CSS_CLASSES

    class TlsAnimation extends window.ExchangeAnimation {
        constructor(el, domain, showIntercept, tlsVersion, onVersionChange) {
            const timing = {
                BASE: 500,
                get REVEAL() { return this.BASE },
                get STEP() { return this.BASE + 220 },
                get ANIMATE() { return this.STEP + 320 },
                get BETWEEN_STEPS() { return this.ANIMATE + 360 }
            }
            super(el, { timing })

            this.domain = domain
            this.showIntercept = showIntercept
            this.tlsVersion = normaliseVersion(tlsVersion)
            this.onVersionChange = onVersionChange
            this.regenerateState()
        }

        getMaxSteps() {
            return 7
        }

        async executeStep(stepNumber) {
            switch (stepNumber) {
                case 1: await this.step1_clientHello(); break
                case 2: await this.step2_serverHello(); break
                case 3: await this.step3_validateAndGenerate(); break
                case 4: await this.step4_sendPremaster(); break
                case 5: await this.step5_deriveSession(); break
                case 6: await this.step6_encryptData(); break
                case 7: await this.step7_decryptAndFinish(); break
            }
        }

        resetState() {
            this.regenerateState()
        }

        setupDOM() {
            const q = (s) => this.el.querySelector(s)

            this.dom = {
                client: {
                    random: q('[data-client-random]'),
                    certCheck: q('[data-cert-check]'),
                    premaster: q('[data-premaster]'),
                    session: q('[data-client-session]'),
                    cipher: q('[data-client-cipher]'),
                    randomResult: q('[data-client-random-result]'),
                    certCheckResult: q('[data-cert-check-result]'),
                    premasterResult: q('[data-premaster-result]'),
                    sessionResult: q('[data-client-session-result]'),
                    cipherResult: q('[data-client-cipher-result]')
                },
                server: {
                    random: q('[data-server-random]'),
                    cert: q('[data-server-cert]'),
                    premaster: q('[data-server-premaster]'),
                    session: q('[data-server-session]'),
                    plain: q('[data-server-plain]'),
                    randomResult: q('[data-server-random-result]'),
                    certResult: q('[data-server-cert-result]'),
                    premasterResult: q('[data-server-premaster-result]'),
                    sessionResult: q('[data-server-session-result]'),
                    plainResult: q('[data-server-plain-result]')
                },
                arrows: {
                    serverRandom: q('[data-arrow-server-random]'),
                    cert: q('[data-arrow-cert]'),
                    premaster: q('[data-arrow-premaster]'),
                    requestCipher: q('[data-arrow-request-cipher]'),
                    responseCipher: q('[data-arrow-response-cipher]')
                },
                exchangeSteps: this.el.querySelectorAll('.exchange-column .exchange-step'),
                eveNote: q('.exchange-eve'),
                versionBtns: Array.from(this.el.querySelectorAll('[data-tls-version]'))
            }

            this.dom.versionBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const nextVersion = normaliseVersion(btn.getAttribute('data-tls-version'))
                    if (nextVersion === this.tlsVersion) return
                    this.isRunning = false
                    if (this.onVersionChange) this.onVersionChange(nextVersion)
                })
            })
        }

        resetUI() {
            this.resetElementsToDefault([
                '[data-client-random]',
                '[data-cert-check]',
                '[data-premaster]',
                '[data-client-session]',
                '[data-client-cipher]',
                '[data-server-random]',
                '[data-server-cert]',
                '[data-server-premaster]',
                '[data-server-session]',
                '[data-server-plain]',
                '[data-arrow-server-random]',
                '[data-arrow-cert]',
                '[data-arrow-premaster]',
                '[data-arrow-request-cipher]',
                '[data-arrow-response-cipher]'
            ].join(', '))

            this.el.querySelectorAll('[data-server-random-result], [data-server-cert-result]').forEach(el => {
                el.classList.add(CSS_CLASSES.SHOW)
            })

            if (this.dom.eveNote) {
                this.dom.eveNote.classList.remove(CSS_CLASSES.SHOW, CSS_CLASSES.HIGHLIGHT)
            }
        }

        regenerateState() {
            const isTls13 = this.tlsVersion === '1.3'
            this.clientRandom = formatHex(randomHex(8))
            this.serverRandom = formatHex(randomHex(8))
            this.premaster = formatHex(randomHex(8))
            this.serverCert = `CN=${this.domain}`
            this.encryptedPremaster = isTls13
                ? `KSHARE ${this.premaster}`
                : visualEncrypt(this.premaster, 'SERVER_PUB')
            this.sessionKey = deriveSessionKey(this.clientRandom, this.serverRandom, this.premaster)
            this.requestPlain = 'GET /grades'
            this.requestCipher = visualEncrypt(this.requestPlain, this.sessionKey)
            this.responseCipher = visualEncrypt('200 OK', this.sessionKey)
        }

        revealResult(resultEl, valueEl, value) {
            if (valueEl && value !== undefined) valueEl.textContent = value
            if (resultEl) {
                resultEl.classList.add(CSS_CLASSES.SHOW)
                resultEl.classList.add(CSS_CLASSES.PULSE)
            }
        }

        async showArrow(stepEl, valueEl, value) {
            if (valueEl) valueEl.textContent = value
            const arrowEl = valueEl?.closest('.exchange-arrow') || stepEl.querySelector('.exchange-arrow')
            if (!arrowEl) return
            arrowEl.classList.add(CSS_CLASSES.SHOW, CSS_CLASSES.PULSE, CSS_CLASSES.ANIMATE)
            await this.sleep(this.TIMING.ANIMATE)
        }

        async step1_clientHello() {
            this.setStatus('Client starts TLS handshake by sending ClientHello with fresh random value.', 'info')

            const stepEl = this.dom.client.random.closest('.exchange-step')
            this.activateStep(stepEl)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            this.revealResult(this.dom.client.randomResult, this.dom.client.random, this.clientRandom)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.completeStep(stepEl)
        }

        async step2_serverHello() {
            const isTls13 = this.tlsVersion === '1.3'
            this.setStatus(
                isTls13
                    ? 'Server responds with ServerHello, certificate, and key share values.'
                    : 'Server responds with ServerHello, certificate, and public key information.',
                'info'
            )

            const exchangeStep = this.dom.exchangeSteps[0]
            const serverStep = this.dom.server.random.closest('.exchange-step')
            this.activateStep(exchangeStep)
            this.activateStep(serverStep)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            this.dom.server.random.textContent = this.serverRandom
            this.dom.server.cert.textContent = this.serverCert
            await this.showArrow(exchangeStep, this.dom.arrows.serverRandom, this.serverRandom)
            if (!this.isRunning) return

            await this.showArrow(exchangeStep, this.dom.arrows.cert, this.serverCert)
            if (!this.isRunning) return

            this.completeStep(exchangeStep)
            this.completeStep(serverStep)
        }

        async step3_validateAndGenerate() {
            this.setStatus(
                this.tlsVersion === '1.3'
                    ? 'Client validates certificate, then creates ephemeral key share secret.'
                    : 'Client validates server certificate, then creates premaster secret.',
                'info'
            )

            const stepEl = this.dom.client.certCheck.closest('.exchange-step')
            this.activateStep(stepEl)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            this.revealResult(this.dom.client.certCheckResult, this.dom.client.certCheck, 'Valid ✓')

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.revealResult(this.dom.client.premasterResult, this.dom.client.premaster, this.premaster)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.completeStep(stepEl)
        }

        async step4_sendPremaster() {
            this.setStatus(
                this.tlsVersion === '1.3'
                    ? 'Client sends key share material. Both sides can now compute same handshake secret.'
                    : 'Client encrypts premaster with server public key and sends it.',
                'info'
            )

            const exchangeStep = this.dom.exchangeSteps[1]
            const serverStep = this.dom.server.premaster.closest('.exchange-step')
            this.activateStep(exchangeStep)
            this.activateStep(serverStep)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            await this.showArrow(exchangeStep, this.dom.arrows.premaster, this.encryptedPremaster)
            if (!this.isRunning) return

            this.revealResult(this.dom.server.premasterResult, this.dom.server.premaster, this.premaster)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.completeStep(exchangeStep)
            this.completeStep(serverStep)
        }

        async step5_deriveSession() {
            this.setStatus('Both sides derive same session key from randoms + premaster.', 'success')

            const clientStep = this.dom.client.session.closest('.exchange-step')
            const serverStep = this.dom.server.session.closest('.exchange-step')
            this.activateStep(clientStep)
            this.activateStep(serverStep)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            this.revealResult(this.dom.client.sessionResult, this.dom.client.session, this.sessionKey)
            this.revealResult(this.dom.server.sessionResult, this.dom.server.session, this.sessionKey)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.completeStep(clientStep)
            this.completeStep(serverStep)
        }

        async step6_encryptData() {
            this.setStatus('Now TLS switches to fast symmetric encryption for application data.', 'info')

            const clientStep = this.dom.client.cipher.closest('.exchange-step')
            const exchangeStep = this.dom.exchangeSteps[2]
            this.activateStep(clientStep)
            this.activateStep(exchangeStep)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            this.revealResult(this.dom.client.cipherResult, this.dom.client.cipher, this.requestCipher)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            await this.showArrow(exchangeStep, this.dom.arrows.requestCipher, this.requestCipher)
            if (!this.isRunning) return

            await this.showArrow(exchangeStep, this.dom.arrows.responseCipher, this.responseCipher)
            if (!this.isRunning) return

            if (this.showIntercept && this.dom.eveNote) {
                this.dom.eveNote.classList.add(CSS_CLASSES.SHOW, CSS_CLASSES.HIGHLIGHT)
            }

            this.completeStep(clientStep)
            this.completeStep(exchangeStep)
        }

        async step7_decryptAndFinish() {
            this.setStatus('Server decrypts request with session key and returns secure response. TLS channel established.', 'success')

            const stepEl = this.dom.server.plain.closest('.exchange-step')
            this.activateStep(stepEl)

            await this.sleep(this.TIMING.REVEAL)
            if (!this.isRunning) return

            this.revealResult(this.dom.server.plainResult, this.dom.server.plain, this.requestPlain)

            await this.sleep(this.TIMING.STEP)
            if (!this.isRunning) return

            this.completeStep(stepEl)
        }
    }

    // -------------------------------------------------------------------------
    // Entry point
    // -------------------------------------------------------------------------

    function processPlugin() {
        const mountTls = (el) => {
            const domain = el.getAttribute('domain') || 'school.portal.nz'
            const showIntercept = el.hasAttribute('intercept')
            const tlsVersion = normaliseVersion(el.getAttribute('version') || '1.3')

            el.innerHTML = ''
            el.appendChild(buildUI(domain, showIntercept, tlsVersion))
            new TlsAnimation(el, domain, showIntercept, tlsVersion, (nextVersion) => {
                el.setAttribute('version', nextVersion)
                mountTls(el)
            })
        }

        document.querySelectorAll('.markdown-section tls').forEach(el => {
            mountTls(el)
        })
    }

    const docsifyPlugin = function (hook) {
        hook.doneEach(processPlugin)
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyPlugin, window.$docsify.plugins || [])
})()
