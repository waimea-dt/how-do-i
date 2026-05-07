/**
 * docsify-drag-drop.js - Reorder challenge widget for Docsify
 *
 * Usage in markdown:
 *   <drag-drop>
 *   1. First item
 *   2. Second item
 *   3. Third item
 *   </drag-drop>
 *
 * Attributes:
 *   - almost: Percentage threshold for "almost" feedback (default: 60)
 *   - shuffle: "true" or "false" (default: true, initial render only)
 *   - mode: "code" updates UI for code-specific reorder problems
 *   - header: "true" or "false" (default: true)
 *   - title: custom header title text
 *   - sub-title: custom header subtitle text
 */

;(function () {
    const { clamp, parseBoolean, shuffleArray } = window.DocsifyUtils
     const DEFAULT_ALMOST_THRESHOLD = 60
    const MAX_SHUFFLE_ATTEMPTS = 20
    const FEEDBACK_LABELS = {
        correct: 'correct',
        almost: 'almost',
        nope: 'nope'
    }

    const UI_TEXT = {
        title: 'Reorder Challenge',
        subtitle: 'Put items back into correct order, then check if they are correct.',
        buttons: {
            submit: 'Check',
            help: 'Help',
            reshuffle: 'Reshuffle'
        },
        aria: {
            dragHandle: 'Drag to reorder',
            moveUp: 'Move item up',
            moveDown: 'Move item down'
        },
        errors: {
            notEnoughItems: 'Error: drag-drop needs an ordered list with at least two items.',
            listLengthMismatch: 'Error: when using a separator, both ordered lists must have the same number of items.'
        },
        feedback: {
            initialStatus: 'Drag the items into the correct order...',
            initialStatusTwoList: 'Drag the items in the right list so that they match the items in the left list...',
            initialStatusCode: 'Drag the lines of code into the correct order...',
            initialStatusCodeTwoList: 'Drag the notes in the right list so that they match the lines of code...',
            correct: 'Correct! All items are in the correct position',
            almost: 'Almost...',
            nope: 'Not even close!',
            positionSuffix: 'items are in the correct position.'
        }
    }

    const SVG_ICONS = {
        controls: {
            up: '<svg class="no-zoom" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',
            down: '<svg class="no-zoom" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
            drag: '<svg class="no-zoom" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>'
        }
    }

    function parseThreshold(value) {
        const parsed = parseInt(value ?? '', 10)
        if (!Number.isFinite(parsed)) return DEFAULT_ALMOST_THRESHOLD
        return clamp(parsed, 1, 99)
    }

    function isInOriginalOrder(items) {
        return items.every((item, index) => item.originalIndex === index)
    }

    function getItemsFromOl(sourceOl, idPrefix = 'item') {
        if (!sourceOl) return []

        return Array.from(sourceOl.children)
            .filter((child) => child.tagName === 'LI')
            .map((itemEl, index) => ({
                id: `${idPrefix}-${index + 1}`,
                originalIndex: index,
                html: itemEl.innerHTML,
            }))
    }

    function getTopLevelWidgetLists(el) {
        const children = Array.from(el.children)
        const hrIndex = children.findIndex((child) => child.tagName === 'HR')

        if (hrIndex < 0) {
            const firstOl = children.find((child) => child.tagName === 'OL') || el.querySelector('ol')
            return {
                referenceItems: [],
                draggableItems: getItemsFromOl(firstOl, 'item')
            }
        }

        let referenceOl = null
        let draggableOl = null

        for (let index = 0; index < children.length; index++) {
            const child = children[index]
            if (child.tagName !== 'OL') continue

            if (index < hrIndex) {
                referenceOl = child
            }

            if (index > hrIndex && !draggableOl) {
                draggableOl = child
            }
        }

        if (!referenceOl || !draggableOl) {
            const fallbackOl = referenceOl || draggableOl || children.find((child) => child.tagName === 'OL') || el.querySelector('ol')
            return {
                referenceItems: [],
                draggableItems: getItemsFromOl(fallbackOl, 'item')
            }
        }

        return {
            referenceItems: getItemsFromOl(referenceOl, 'reference'),
            draggableItems: getItemsFromOl(draggableOl, 'item')
        }
    }

    function scoreOrder(currentItems) {
        if (currentItems.length === 0) {
            return { percentage: 0, correctCount: 0, total: 0 }
        }

        const correctCount = currentItems.reduce((count, item, currentIndex) => {
            return count + (item.originalIndex === currentIndex ? 1 : 0)
        }, 0)

        const percentage = Math.round((correctCount / currentItems.length) * 100)
        return {
            percentage,
            correctCount,
            total: currentItems.length,
        }
    }

    function getFeedbackType(score, almostThreshold) {
        if (score.percentage === 100) return FEEDBACK_LABELS.correct
        if (score.percentage >= almostThreshold) return FEEDBACK_LABELS.almost
        return FEEDBACK_LABELS.nope
    }

    function getFeedbackText(feedbackType, score) {
        if (feedbackType === FEEDBACK_LABELS.correct) {
            return `<span>${UI_TEXT.feedback.correct}</span>`
        }
        if (feedbackType === FEEDBACK_LABELS.almost) {
            return `<span>${UI_TEXT.feedback.almost}</span> <span><strong>${score.correctCount}/${score.total}</strong> ${UI_TEXT.feedback.positionSuffix}</span>`
        }
        return `<span>${UI_TEXT.feedback.nope}</span> <span>Only <strong>${score.correctCount}/${score.total}</strong> ${UI_TEXT.feedback.positionSuffix}</span>`
    }

    function createListItemHtml(item, index, total) {
        const atTop = index === 0
        const atBottom = index === total - 1

        return `
            <div class="drag-drop-item" role="listitem" data-id="${item.id}" data-original-index="${item.originalIndex}">
                <div class="drag-drop-item-shell">
                    <button class="drag-drop-drag-handle" aria-label="${UI_TEXT.aria.dragHandle}" title="${UI_TEXT.aria.dragHandle}">${SVG_ICONS.controls.drag}</button>
                    <div class="drag-drop-item-content">${item.html}</div>
                    <div class="drag-drop-item-controls">
                        <button class="drag-drop-move-btn drag-drop-move-up" ${atTop ? 'disabled' : ''} aria-label="${UI_TEXT.aria.moveUp}">${SVG_ICONS.controls.up}</button>
                        <button class="drag-drop-move-btn drag-drop-move-down" ${atBottom ? 'disabled' : ''} aria-label="${UI_TEXT.aria.moveDown}">${SVG_ICONS.controls.down}</button>
                    </div>
                </div>
            </div>
        `
    }

    class DragDropWidget {
        constructor(el) {
            this.el = el
            this.almostThreshold = parseThreshold(el.getAttribute('almost'))
            this.shouldShuffleInitially = parseBoolean(el.getAttribute('shuffle'), true)
            this.showHeader = parseBoolean(el.getAttribute('header'), true)
            this.mode = (el.getAttribute('mode') || '').trim().toLowerCase()
            this.customTitle = el.getAttribute('title')
            if (this.customTitle != null) {
                this.el.removeAttribute('title')
            }
            this.customSubtitle = el.getAttribute('sub-title') ?? el.getAttribute('subtitle')
            this.hasInitialised = false

            const parsedLists = getTopLevelWidgetLists(el)
            this.referenceItems = parsedLists.referenceItems
            this.originalItems = parsedLists.draggableItems
            this.currentItems = []

            this.sortable = null

            this.render()
            this.resetItems()
            this.bindEvents()
            this.setupDragAndDrop()
        }

        get dragEnabled() {
            return typeof window.Sortable !== 'undefined'
        }

        get hasReferenceList() {
            return this.referenceItems.length > 0
        }

        resetItems() {
            let source = this.originalItems.slice()
            const shouldShuffleNow = this.hasInitialised || this.shouldShuffleInitially

            if (shouldShuffleNow) {
                let attempts = 0
                do {
                    source = shuffleArray(this.originalItems)
                    attempts += 1
                } while (source.length > 1 && isInOriginalOrder(source) && attempts < MAX_SHUFFLE_ATTEMPTS)

                if (source.length > 1 && isInOriginalOrder(source)) {
                    ;[source[0], source[1]] = [source[1], source[0]]
                }
            }

            this.currentItems = source.slice()
            this.renderList()
            this.clearPlacementHelp()
            this.clearFeedback()
            this.hasInitialised = true
        }

        render() {
            if (this.originalItems.length < 2) {
                this.el.innerHTML = `<div class="drag-drop-error">${UI_TEXT.errors.notEnoughItems}</div>`
                return
            }

            if (this.hasReferenceList && this.referenceItems.length !== this.originalItems.length) {
                this.el.innerHTML = `<div class="drag-drop-error">${UI_TEXT.errors.listLengthMismatch}</div>`
                return
            }

            const listAreaClass = this.hasReferenceList
                ? 'drag-drop-list-area drag-drop-list-area-has-reference'
                : 'drag-drop-list-area'

            const referencePanelHtml = this.hasReferenceList
                ? '<div class="drag-drop-reference-list" role="list"></div>'
                : ''

            const wrapperClass = this.mode === 'code'
                ? 'drag-drop-wrapper drag-drop-code'
                : 'drag-drop-wrapper'

            const hasCustomTitle = this.customTitle != null
            const titleText = hasCustomTitle ? this.customTitle : UI_TEXT.title
            const subtitleText = this.customSubtitle != null
                ? this.customSubtitle
                : (hasCustomTitle ? '' : UI_TEXT.subtitle)
            const subtitleHtml = subtitleText
                ? `<p class="drag-drop-subtitle">${subtitleText}</p>`
                : ''

            const headerHtml = this.showHeader
                ? `<div class="drag-drop-header">
                        <p class="drag-drop-title">${titleText}</p>
                        ${subtitleHtml}
                    </div>`
                : ''

            this.el.innerHTML = `
                <div class="${wrapperClass}">
                    ${headerHtml}

                    <div class="drag-drop-body">
                        <div class="${listAreaClass}">
                            ${referencePanelHtml}
                            <div class="drag-drop-list" role="list" aria-live="polite"></div>
                        </div>

                        <div class="drag-drop-actions">
                            <button class="drag-drop-btn drag-drop-submit btn-check"><span>${UI_TEXT.buttons.submit}</span></button>
                            <button class="drag-drop-btn drag-drop-help btn-info" aria-label="${UI_TEXT.buttons.help}" title="${UI_TEXT.buttons.help}"></button>
                            <button class="drag-drop-btn drag-drop-reset btn-reset btn-shuffle" aria-label="${UI_TEXT.buttons.reshuffle}" title="${UI_TEXT.buttons.reshuffle}"></button>
                        </div>

                        <p class="drag-drop-feedback" aria-live="polite"></p>
                    </div>
                </div>
            `

            this.listEl = this.el.querySelector('.drag-drop-list')
            this.referenceListEl = this.el.querySelector('.drag-drop-reference-list')
            this.submitBtn = this.el.querySelector('.drag-drop-submit')
            this.helpBtn = this.el.querySelector('.drag-drop-help')
            this.resetBtn = this.el.querySelector('.drag-drop-reset')
            this.feedbackEl = this.el.querySelector('.drag-drop-feedback')

            this.renderReferenceList()
        }

        renderReferenceList() {
            if (!this.referenceListEl || !this.hasReferenceList) return

            this.referenceListEl.innerHTML = this.referenceItems
                .map((item) => `<div class="drag-drop-reference-item" role="listitem">${item.html}</div>`)
                .join('')
        }

        renderList() {
            if (!this.listEl) return

            this.listEl.innerHTML = this.currentItems
                .map((item, index) => createListItemHtml(item, index, this.currentItems.length))
                .join('')

            this.syncCurrentItemsFromDom()
        }

        syncCurrentItemsFromDom() {
            const itemEls = Array.from(this.listEl.querySelectorAll('.drag-drop-item'))

            this.currentItems = itemEls.map((itemEl) => {
                const originalIndex = parseInt(itemEl.getAttribute('data-original-index') || '', 10)
                const id = itemEl.getAttribute('data-id') || ''
                const existing = this.originalItems.find(item => item.id === id)
                return {
                    id,
                    originalIndex,
                    html: existing ? existing.html : itemEl.querySelector('.drag-drop-item-content')?.innerHTML || '',
                }
            })

            this.updateMoveButtonState()
        }

        updateMoveButtonState() {
            const itemEls = Array.from(this.listEl.querySelectorAll('.drag-drop-item'))
            itemEls.forEach((itemEl, index) => {
                const upBtn = itemEl.querySelector('.drag-drop-move-up')
                const downBtn = itemEl.querySelector('.drag-drop-move-down')
                if (upBtn) upBtn.disabled = index === 0
                if (downBtn) downBtn.disabled = index === itemEls.length - 1
            })
        }

        moveItem(itemEl, direction) {
            if (!itemEl) return

            if (direction === 'up' && itemEl.previousElementSibling) {
                this.listEl.insertBefore(itemEl, itemEl.previousElementSibling)
            }

            if (direction === 'down' && itemEl.nextElementSibling) {
                this.listEl.insertBefore(itemEl.nextElementSibling, itemEl)
            }

            this.syncCurrentItemsFromDom()
            this.clearPlacementHelp()
            this.clearFeedback()
        }

        showPlacementHelp() {
            if (!this.listEl) return

            this.syncCurrentItemsFromDom()

            const itemEls = Array.from(this.listEl.querySelectorAll('.drag-drop-item'))
            itemEls.forEach((itemEl, currentIndex) => {
                const originalIndex = parseInt(itemEl.getAttribute('data-original-index') || '', 10)
                const isCorrect = originalIndex === currentIndex

                itemEl.classList.toggle('drag-drop-item-correct-place', isCorrect)
                itemEl.classList.toggle('drag-drop-item-wrong-place', !isCorrect)
            })
        }

        clearPlacementHelp() {
            if (!this.listEl) return

            this.listEl.querySelectorAll('.drag-drop-item').forEach((itemEl) => {
                itemEl.classList.remove('drag-drop-item-correct-place', 'drag-drop-item-wrong-place')
            })
        }

        setupDragAndDrop() {
            if (!this.dragEnabled || !this.listEl) return

            this.sortable = window.Sortable.create(this.listEl, {
                animation: 150,
                handle: '.drag-drop-drag-handle',
                ghostClass: 'drag-drop-ghost',
                dragClass: 'drag-drop-dragging',
                onEnd: () => {
                    this.syncCurrentItemsFromDom()
                    this.clearPlacementHelp()
                    this.clearFeedback()
                },
            })
        }

        submitOrder() {
            this.syncCurrentItemsFromDom()
            const score = scoreOrder(this.currentItems)
            const feedbackType = getFeedbackType(score, this.almostThreshold)
            const feedbackText = getFeedbackText(feedbackType, score)

            this.feedbackEl.innerHTML = feedbackText
            this.feedbackEl.dataset.result = feedbackType
        }

        clearFeedback() {
            if (!this.feedbackEl) return
            const isCodeMode = this.mode === 'code'
            const statusMessage = this.hasReferenceList
                ? (isCodeMode ? UI_TEXT.feedback.initialStatusCodeTwoList : UI_TEXT.feedback.initialStatusTwoList)
                : (isCodeMode ? UI_TEXT.feedback.initialStatusCode : UI_TEXT.feedback.initialStatus)
            this.feedbackEl.textContent = statusMessage
            this.feedbackEl.dataset.result = ''
        }

        bindEvents() {
            if (!this.listEl) return

            this.submitBtn.addEventListener('click', () => this.submitOrder())
            this.helpBtn.addEventListener('click', () => this.showPlacementHelp())
            this.resetBtn.addEventListener('click', () => this.resetItems())

            this.listEl.addEventListener('click', (event) => {
                const target = event.target
                if (!(target instanceof HTMLElement)) return

                const itemEl = target.closest('.drag-drop-item')
                if (!itemEl) return

                if (target.classList.contains('drag-drop-move-up')) {
                    this.moveItem(itemEl, 'up')
                }

                if (target.classList.contains('drag-drop-move-down')) {
                    this.moveItem(itemEl, 'down')
                }
            })
        }
    }

    function processDragDrop() {
        const widgets = document.querySelectorAll('.markdown-section drag-drop:not(.drag-drop-initialized)')

        widgets.forEach((el) => {
            el.classList.add('drag-drop-initialized')
            new DragDropWidget(el)
        })
    }

    function docsifyDragDrop(hook) {
        hook.doneEach(processDragDrop)
    }

    window.DocsifyUtils.registerPlugin(docsifyDragDrop)
})()
