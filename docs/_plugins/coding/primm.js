/**
 * docsify-primm.js - PRIMM (Predict, Run, Investigate, Modify, Make) learning widget
 *
 * PRIMM is a five-step code learning pedagogy:
 * 1. Predict - Students predict what code will do
 * 2. Run - Execute the code to verify predictions
 * 3. Investigate - Explore and understand the code
 * 4. Modify - Make changes to understand behavior
 * 5. Make - Create new code from scratch
 *
 * This plugin implements steps 1-2 (Predict and Run):
 * - Display syntax-highlighted code
 * - Allow students to make a prediction
 * - Save prediction (locks further editing)
 * - Run code to see actual output
 *
 * Usage in markdown:
 *   <primm language="python">
 *   a = 10
 *   b = 5
 *   c = a + b
 *   print(c)
 *   </primm>
 *
 * Or with Kotlin:
 *   <primm language="kotlin">
 *   fun main() {
 *       println("Hello")
 *   }
 *   </primm>
 */

(function () {
    const FENCED_BLOCK_REGEX = /```([a-zA-Z0-9_+-]+)?\s*\n([\s\S]*?)\n```/

    const UI_TEXT = {
        title: 'PRIMM: Predict & Run',
        predict: 'What do you predict this code will do?',
        savePrediction: 'Save Prediction',
        statusWaiting: 'Waiting for your prediction...',
        statusSaved: 'Predication saved. Now run the code...',
        statusReflect: 'Was your prediction correct?',
        statusUnavailable: 'Runner unavailable',
    }

    class PrimmWidget {
        constructor(el) {
            this.el = el
            const fallbackLanguage = (el.getAttribute('language') || 'python').toLowerCase()
            const parsedContent = this.parseContent(el, fallbackLanguage)
            this.language = parsedContent.language
            this.code = parsedContent.code
            this.showHeader = el.getAttribute('header') !== 'false'
            this.predictionSaved = false
            this.codeBlockEl = null
            this.predictionInputEl = null
            this.predictionOutputEl = null
            this.savePredictionButtonEl = null
            this.statusEl = null
            this.runnerInitialised = false
            this.runnerOutputObserver = null

            this.render()
            this.bindEvents()
        }

        render() {
            const language = this.language
            const codeId = `primm-code-${Math.random().toString(36).substr(2, 9)}`
            const predictionId = `primm-pred-${Math.random().toString(36).substr(2, 9)}`

            const escapedCode = this.escapeHtml(this.code)

            const html = `
                <div class="primm-wrapper">
                    ${this.showHeader ? `<div class="primm-header"><h3 class="primm-title">${UI_TEXT.title}</h3></div>` : ''}

                    <div class="primm-body">
                        <!-- Code Display Section -->
                        <div class="primm-section primm-code-section">
                            <div class="primm-code-display">
                                <pre id="${codeId}" class="primm-code language-${language}"><code class="language-${language}">${escapedCode}</code></pre>
                            </div>
                        </div>

                        <!-- Prediction Section -->
                        <div class="primm-section primm-prediction-section">
                            <div class="primm-prediction-prompt">
                                <label for="${predictionId}" class="primm-label">${UI_TEXT.predict}</label>
                                <textarea
                                    id="${predictionId}"
                                    class="primm-prediction-input"
                                    placeholder="Type your prediction here..."
                                    spellcheck="false"
                                ></textarea>
                                <pre class="primm-prediction-output" style="display: none;"></pre>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="primm-actions">
                            <button class="primm-btn primm-save-btn btn-save" type="button">
                                <span>${UI_TEXT.savePrediction}</span>
                            </button>
                        </div>

                        <!-- Status -->
                        <p class="primm-status" data-status="waiting">${UI_TEXT.statusWaiting}</p>
                    </div>
                </div>
            `

            this.el.innerHTML = html

            // Cache DOM elements
            this.codeBlockEl = this.el.querySelector('.primm-code')
            this.predictionInputEl = this.el.querySelector('.primm-prediction-input')
            this.predictionOutputEl = this.el.querySelector('.primm-prediction-output')
            this.savePredictionButtonEl = this.el.querySelector('.primm-save-btn')
            this.statusEl = this.el.querySelector('.primm-status')

            // Apply syntax highlighting if Prism is available
            if (window.Prism) {
                setTimeout(() => {
                    Prism.highlightElement(this.codeBlockEl.querySelector('code'))
                }, 0)
            }
        }

        escapeHtml(text) {
            const div = document.createElement('div')
            div.textContent = text
            return div.innerHTML
        }

        getLanguageFromCodeClass(codeEl) {
            if (!codeEl || !codeEl.className) return null

            const classMatch = codeEl.className.match(/(?:^|\s)(?:lang|language)-([a-zA-Z0-9_+-]+)(?:\s|$)/)
            return classMatch ? classMatch[1].toLowerCase() : null
        }

        parseContent(el, fallbackLanguage) {
            const codeEl = el.querySelector('pre code[class*="language-"], pre code[class*="lang-"]')

            if (codeEl) {
                return {
                    language: this.getLanguageFromCodeClass(codeEl) || fallbackLanguage,
                    code: (codeEl.textContent || '').replace(/\r\n?/g, '\n').trim().replace(/^\s+/, ''),
                }
            }

            const normalised = (el.textContent || '').replace(/\r\n?/g, '\n').trim()
            const fencedMatch = normalised.match(FENCED_BLOCK_REGEX)

            if (fencedMatch) {
                const fencedLanguage = (fencedMatch[1] || fallbackLanguage).toLowerCase()
                const fencedCode = (fencedMatch[2] || '').replace(/^\s+/, '')
                return {
                    language: fencedLanguage,
                    code: fencedCode,
                }
            }

            return {
                language: fallbackLanguage,
                code: normalised.replace(/^\s+/, ''),
            }
        }

        bindEvents() {
            this.savePredictionButtonEl.addEventListener('click', () => this.savePrediction())
        }

        setStatus(message, state, showCheck = false) {
            if (!this.statusEl) return

            if (showCheck) {
                this.statusEl.innerHTML = `${SVG_ICONS.check}<span>${this.escapeHtml(message)}</span>`
            } else {
                this.statusEl.textContent = message
            }

            this.statusEl.dataset.status = state
        }

        watchForRunnerOutput(container) {
            if (!container || this.runnerOutputObserver) return

            this.runnerOutputObserver = new MutationObserver(() => {
                const outputNodes = container.querySelectorAll('codapi-output, .output-wrapper, .code-output, .standard-output')
                const hasOutput = Array.from(outputNodes).some((node) => {
                    const text = (node.textContent || '').trim()
                    if (!text) return false

                    if (node.tagName && node.tagName.toLowerCase() === 'codapi-output') {
                        return !node.hasAttribute('hidden')
                    }

                    return true
                })

                if (!hasOutput) return

                this.setStatus(UI_TEXT.statusReflect, 'reflect')
                this.runnerOutputObserver.disconnect()
                this.runnerOutputObserver = null
            })

            this.runnerOutputObserver.observe(container, {
                childList: true,
                subtree: true,
                characterData: true,
                attributes: true,
                attributeFilter: ['hidden'],
            })
        }

        savePrediction() {
            const prediction = this.predictionInputEl.value.trim()

            if (!prediction) {
                alert('Please enter a prediction before saving.')
                return
            }

            this.predictionSaved = true

            // Hide input, show saved prediction text directly
            this.predictionInputEl.style.display = 'none'
            this.predictionOutputEl.style.display = 'block'
            this.predictionOutputEl.textContent = prediction

            // Disable save and hand code block off to existing language runner
            this.savePredictionButtonEl.disabled = true

            if (this.activateLanguageRunner()) {
                this.setStatus(UI_TEXT.statusSaved, 'saved', true)
            } else {
                this.setStatus(UI_TEXT.statusUnavailable, 'unavailable')
            }
        }

        activateLanguageRunner() {
            if (this.runnerInitialised) return true
            if (!this.codeBlockEl) return false

            if (this.language === 'python') {
                return this.activatePythonRunner()
            }

            if (this.language === 'kotlin') {
                return this.activateKotlinRunner()
            }

            return false
        }

        activatePythonRunner() {
            if (!window.docsifyPythonRunner || typeof window.docsifyPythonRunner.init !== 'function') {
                return false
            }

            const codeDisplay = this.el.querySelector('.primm-code-display')
            if (!codeDisplay) return false

            codeDisplay.classList.add('codapi-runner')

            if (!codeDisplay.querySelector('codapi-snippet[sandbox="python"][editor="external"]')) {
                const snippet = document.createElement('codapi-snippet')
                snippet.setAttribute('engine', 'wasi')
                snippet.setAttribute('sandbox', 'python')
                snippet.setAttribute('editor', 'external')
                codeDisplay.appendChild(snippet)
            }

            window.docsifyPythonRunner.init(codeDisplay)
            this.watchForRunnerOutput(codeDisplay)
            this.runnerInitialised = true
            return true
        }

        activateKotlinRunner() {
            if (!window.docsifyKotlinRunner || typeof window.docsifyKotlinRunner.init !== 'function') {
                return false
            }

            const codeSection = this.el.querySelector('.primm-code-section')
            if (!codeSection) return false

            const preprocessor = window.docsifyKotlinRunner.preprocess
            if (typeof preprocessor === 'function') {
                const transformed = preprocessor(this.code)
                this.code = transformed

                const codeEl = this.codeBlockEl ? this.codeBlockEl.querySelector('code') : null
                if (codeEl) {
                    codeEl.textContent = transformed
                    if (window.Prism) {
                        Prism.highlightElement(codeEl)
                    }
                }
            }

            codeSection.classList.add('kotlin-run')
            window.docsifyKotlinRunner.init(codeSection)
            this.watchForRunnerOutput(codeSection)
            this.runnerInitialised = true
            return true
        }

    }

    function processPrimm() {
        const widgets = document.querySelectorAll('.markdown-section primm:not(.primm-initialized)')

        widgets.forEach((el) => {
            el.classList.add('primm-initialized')
            new PrimmWidget(el)
        })
    }

    function docsifyPrimm(hook) {
        hook.doneEach(processPrimm)
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyPrimm, window.$docsify.plugins || [])
})()
