/**
 * img-notes.js - Renders <img-notes> blocks as image annotations with tooltips.
 *
 * Usage in markdown:
 *   <img-notes src="tests/_assets/ui-demo.png">
 *   - Header [58, 12, 32, 18]
 *
 *       Markdown note body here.
 *
 *   - CTA [58, 76, 24, 11]
 *
 *       Another note.
 *   </img-notes>
 */

;(function () {
    const DEFAULT_ALT = 'Annotated image'
    const HOTSPOT_EVENTS_ACTIVATE = ['mouseenter', 'focus', 'click']
    const HOTSPOT_EVENTS_DEACTIVATE = ['mouseleave', 'blur']

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
    }

    function createBodyContainer() {
        return document.createElement('div')
    }

    function parseColourIndex(value) {
        const colour = parseInt(value, 10)
        return colour >= 1 && colour <= 10 ? colour : null
    }

    function clampPercentage(value) {
        const numeric = Number(value)
        if (!Number.isFinite(numeric)) return 0
        return Math.max(0, Math.min(100, numeric))
    }

    function renderRawBodyWarning(rawText) {
        const escaped = escapeHtml(String(rawText || '').trim())
        return `
            <div class="img-notes-body-warning">
                <p><strong>Note body markdown was not rendered by Docsify in this block.</strong></p>
                <p>Fix note formatting or structure so the body is parsed to HTML.</p>
                <pre><code>${escaped}</code></pre>
            </div>
        `
    }

    function parseHeader(text) {
        const match = String(text || '').trim().match(/^(?:[-*+]\s+)?(.+?)\s+\[\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\]$/)
        if (!match) return null

        return {
            title: match[1].trim(),
            x: clampPercentage(match[2]),
            y: clampPercentage(match[3]),
            w: clampPercentage(match[4]),
            h: clampPercentage(match[5]),
        }
    }

    function buildNote(meta, bodyContainer) {
        const firstElement = bodyContainer.firstElementChild
        const looksLikeRawMarkdownCodeBlock = bodyContainer.children.length === 1
            && firstElement
            && firstElement.tagName === 'PRE'
            && /(?:\*\*|^\s*[-*+]\s+|\[[^\]]+\]\([^)]+\))/m.test(firstElement.textContent)

        const rawText = bodyContainer.textContent.trim()
        const hasRawText = rawText.length > 0
        const hasRenderedBody = bodyContainer.children.length > 0 && !looksLikeRawMarkdownCodeBlock

        const bodyHtml = hasRenderedBody
            ? bodyContainer.innerHTML.trim()
            : (hasRawText ? renderRawBodyWarning(rawText) : '')

        return {
            ...meta,
            bodyHtml,
        }
    }

    function parseListItemNote(item, showLabel) {
        const headerBlock = Array.from(item.children).find(child => child.tagName !== 'UL' && child.tagName !== 'OL')
        const headerMeta = parseHeader(headerBlock ? headerBlock.textContent : item.textContent)
        if (!headerMeta) return null

        const bodyContainer = document.createElement('div')
        Array.from(item.childNodes).forEach((child) => {
            if (headerBlock && child === headerBlock) return
            bodyContainer.appendChild(child.cloneNode(true))
        })

        return { ...buildNote(headerMeta, bodyContainer), showLabel: !!showLabel }
    }

    function parseNotesFromDom(el) {
        const notes = []
        let currentMeta = null
        let currentBody = null

        function startCurrent(meta) {
            currentMeta = meta
            currentBody = createBodyContainer()
        }

        function commitCurrent() {
            if (!currentMeta || !currentBody) return
            notes.push(buildNote(currentMeta, currentBody))
            currentMeta = null
            currentBody = null
        }

        Array.from(el.childNodes).forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const headerMeta = parseHeader(node.textContent)
                if (headerMeta) {
                    commitCurrent()
                    startCurrent(headerMeta)
                }
                return
            }

            if (node.nodeType !== Node.ELEMENT_NODE) return

            const child = node

            if (child.tagName === 'IMG') return

            if (child.tagName === 'UL' || child.tagName === 'OL') {
                const showLabel = child.tagName === 'OL'
                const listItems = Array.from(child.children).filter(item => item.tagName === 'LI')
                const parsedListNotes = listItems.map(item => parseListItemNote(item, showLabel))
                const hasOnlyNoteItems = listItems.length > 0 && parsedListNotes.every(Boolean)

                if (hasOnlyNoteItems) {
                    commitCurrent()
                    notes.push(...parsedListNotes)
                    return
                }

                if (currentBody) {
                    currentBody.appendChild(child.cloneNode(true))
                }
                return
            }

            const headerMeta = parseHeader(child.textContent)
            if (headerMeta) {
                commitCurrent()
                startCurrent(headerMeta)
                return
            }

            if (currentBody) {
                currentBody.appendChild(child.cloneNode(true))
            }
        })

        commitCurrent()
        return notes
    }

    class ImgNotesWidget {
        constructor(el) {
            this.el = el
            const imgEl = el.querySelector('img')
            this.src = imgEl ? (imgEl.getAttribute('src') || '') : ''
            this.alt = imgEl ? (imgEl.getAttribute('alt') || DEFAULT_ALT) : DEFAULT_ALT

            const colour = parseColourIndex(el.getAttribute('colour'))
            if (colour !== null) {
                el.style.setProperty('--img-notes-accent', `var(--palette-color-${colour})`)
            }

            this.notes = parseNotesFromDom(el)
            this.activeIndex = -1

            this.render()
        }

        setActiveNote(index) {
            this.activeIndex = index
            this.updateHotspotStates(index)

            const note = this.notes[index]
            if (!note) return

            this.currentTitle.textContent = note.title
            this.currentBody.innerHTML = note.bodyHtml || '<p>No note content.</p>'
            this.tooltip.hidden = false
            this.positionTooltip(index)
        }

        clearActiveNote() {
            this.activeIndex = -1
            this.updateHotspotStates(-1)
            this.tooltip.hidden = true
        }

        updateHotspotStates(activeIndex) {
            this.hotspots.forEach((hotspot, hotspotIndex) => {
                const isActive = hotspotIndex === activeIndex
                hotspot.classList.toggle('is-active', isActive)
                hotspot.setAttribute('aria-pressed', isActive ? 'true' : 'false')
            })
        }

        positionTooltip(index) {
            const hotspot = this.hotspots[index]
            if (!hotspot) return

            const stageRect = this.stage.getBoundingClientRect()
            const hotspotRect = hotspot.getBoundingClientRect()

            // Make tooltip measurable before deciding final position.
            this.tooltip.style.left = '0px'
            this.tooltip.style.top = '0px'
            this.tooltip.classList.remove('is-left')

            const tooltipRect = this.tooltip.getBoundingClientRect()
            const gutter = 12
            const availableRight = stageRect.right - hotspotRect.right - gutter
            const availableLeft = hotspotRect.left - stageRect.left - gutter
            const shouldPlaceLeft = availableRight < tooltipRect.width && availableLeft > availableRight

            let left = shouldPlaceLeft
                ? hotspotRect.left - stageRect.left - tooltipRect.width - gutter
                : hotspotRect.right - stageRect.left + gutter
            let top = hotspotRect.top - stageRect.top

            if (left < gutter) left = gutter
            if (left + tooltipRect.width > stageRect.width - gutter) {
                left = stageRect.width - tooltipRect.width - gutter
            }

            if (top + tooltipRect.height > stageRect.height - gutter) {
                top = stageRect.height - tooltipRect.height - gutter
            }

            if (top < gutter) top = gutter

            this.tooltip.style.left = `${Math.round(left)}px`
            this.tooltip.style.top = `${Math.round(top)}px`
            this.tooltip.classList.toggle('is-left', shouldPlaceLeft)
        }

        render() {
            if (!this.src) {
                this.el.innerHTML = '<div class="img-notes-error">img-notes needs an image element with a src attribute.</div>'
                return
            }

            if (!this.notes.length) {
                this.el.innerHTML = '<div class="img-notes-error">img-notes needs at least one note.</div>'
                return
            }

            const hotspotHtml = this.notes.map((note, index) => `
                <button
                    class="img-notes-hotspot ${index === 0 ? 'is-active' : ''}"
                    type="button"
                    data-index="${index}"
                    aria-label="Show note: ${escapeHtml(note.title)}"
                    aria-pressed="${index === 0 ? 'true' : 'false'}"
                    style="left:${note.x}%;top:${note.y}%;width:${note.w}%;height:${note.h}%;"
                >
                    ${note.showLabel ? `<span class="img-notes-hotspot-label">${index + 1}</span>` : ''}
                </button>
            `).join('')

            this.el.innerHTML = `
                <figure class="img-notes-stage">
                    <img class="img-notes-image" src="${escapeHtml(this.src)}" alt="${escapeHtml(this.alt)}">
                    <div class="img-notes-hotspots" aria-hidden="false">
                        ${hotspotHtml}
                    </div>
                    <div class="img-notes-tooltip" hidden>
                        <div class="img-notes-tooltip-header">
                            <h3 class="img-notes-current-title"></h3>
                        </div>
                        <div class="img-notes-current-body"></div>
                    </div>
                </figure>
            `

            this.stage = this.el.querySelector('.img-notes-stage')
            this.hotspots = Array.from(this.el.querySelectorAll('.img-notes-hotspot'))
            this.tooltip = this.el.querySelector('.img-notes-tooltip')
            this.currentTitle = this.el.querySelector('.img-notes-current-title')
            this.currentBody = this.el.querySelector('.img-notes-current-body')

            this.bindEvents()
        }

        bindEvents() {
            const activate = (event) => {
                const button = event.currentTarget
                const index = Number(button.getAttribute('data-index'))
                this.setActiveNote(index)
            }

            const deactivate = () => {
                this.clearActiveNote()
            }

            this.hotspots.forEach((hotspot) => {
                HOTSPOT_EVENTS_ACTIVATE.forEach((eventName) => {
                    hotspot.addEventListener(eventName, activate)
                })
                HOTSPOT_EVENTS_DEACTIVATE.forEach((eventName) => {
                    hotspot.addEventListener(eventName, deactivate)
                })
            })

            this.stage.addEventListener('mouseleave', deactivate)
            window.addEventListener('resize', () => {
                if (this.activeIndex >= 0) this.positionTooltip(this.activeIndex)
            })
        }
    }

    function processImgNotes() {
        document.querySelectorAll('.markdown-section img-notes:not(.img-notes-initialized)').forEach((el) => {
            el.classList.add('img-notes-initialized')

            new ImgNotesWidget(el)
        })
    }

    function docsifyImgNotes(hook) {
        hook.doneEach(processImgNotes)
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyImgNotes, window.$docsify.plugins || [])
})()