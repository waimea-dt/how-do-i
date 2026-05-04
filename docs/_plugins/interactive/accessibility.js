/**
 * docsify-accessibility.js - Accessibility teaching widgets for Docsify.
 *
 * Current mode:
 * - screen-reader: approximates landmark and announcement order checks
 *
 * Authoring pattern:
 * <accessibility mode="screen-reader">
 * ```html
 * <header>...</header>
 * <main>...</main>
 * ```
 * </accessibility>
 */

;(function () {
    const BLOCK_PATTERN = /<accessibility([^>]*)>\s*```html\s*\n([\s\S]*?)\n```\s*<\/accessibility>/g

    const ACCESSIBILITY_CONFIG = {
        iframeCss: `
            :root { color-scheme: light; }

            * { box-sizing: border-box; }

            body {
                font-family: system-ui, sans-serif;
                line-height: 1.4;
                color: #0b1a29;
                background: #89adc7;
            }

            body,
            header, .header,
            nav,    .menu,
            main,   .content,
            footer,
            section,
            article,
            aside,
            form {
                display: block;
                margin: 0;
                padding: 0;

                & > :first-child { margin-top: 0;
                & > :last-child { margin-bottom: 0; }
            }

            header, .header,
            main,   .content,
            footer,
            section,
            article,
            aside,
            form,
            :not(header) > nav, div:has(> button) {
                padding: 1rem;
            }

            section,
            article,
            aside,
            form,
            :not(header) > nav, div:has(> button) {
                border: 1px solid #2c5a88;
                border-radius: 0.25rem;
                margin-bottom: 1rem;
            }

            header, .header {
                border-bottom: 1px solid #2c5a88;
                background-color: #036;

                h1, .big-title, a { color: #fff; }
            }

            h1, .big-title,
            h2, .title,
            h3, h4, h5, h6 {
                margin: 0.25em 0 0.5em;
                font-weight: bold;
            }

            h1, .big-title { font-size: 2.0rem; }
            h2, .title     { font-size: 1.5rem; }
            h3 { font-size: 1.2rem; }
            h4 { font-size: 1.1rem; }
            h5 { font-size: 1.0rem; }
            h6 { font-size: 0.9rem; }

            nav a, .menu a {
                margin-right: 0.75rem;
            }

            :focus-visible {
                outline: 3px solid #0ea5e9;
                outline-offset: 2px;
            }

            img {
                max-height: 5rem;
            }
        `,
        ui: {
            title: 'Screen Reader Simulation',
            subtitle: 'Approximation for teaching only. Not a real screen-reader emulator.',
            htmlTitle: 'HTML',
            previewTitle: 'Rendered preview',
            checklistTitle: 'Screen-reader checklist',
            readerTitle: 'Reader',
            unsupportedMode: 'Unsupported accessibility mode.',
            missingInput: 'Missing accessibility HTML input.',
            noAnnouncements: 'No key announcements detected.',
            readerLabels: {
                banner: 'Landmark: banner',
                navigation: 'Landmark: navigation',
                main: 'Landmark: main',
                heading: 'Heading',
                link: 'Link',
                button: 'Button',
                formControl: 'Form control',
                image: 'Image',
                unlabelledControl: 'unlabelled control',
                missingAlt: 'missing alt text',
                inputDefaults: {
                    submit: 'submit',
                    reset: 'reset',
                    button: 'button',
                    image: 'image submit'
                }
            },
            statuses: {
                pass: 'pass',
                warn: 'warn',
                fail: 'fail'
            }
        },
        checklist: [
            {
                id: 'main',
                label: 'Main content',
                wcagRef: 'WCAG 1.3.1',
                wcagTooltip: 'Info and relationships should be programmatically determinable. Main content should be identifiable with semantic structure such as <main> or role="main".'
            },
            {
                id: 'h1',
                label: 'Top heading',
                wcagRef: 'WCAG 1.3.1',
                wcagTooltip: 'Use clear heading structure so users can understand page purpose and navigate quickly. A single clear top heading helps orientation.'
            },
            {
                id: 'nav',
                label: 'Nav',
                wcagRef: 'WCAG 1.3.1',
                wcagTooltip: 'Navigation regions should be identifiable with semantic structure such as <nav> or role="navigation".'
            },
            {
                id: 'headingLevels',
                label: 'Heading levels',
                wcagRef: 'WCAG 1.3.1',
                wcagTooltip: 'Heading levels should reflect document structure. Large level jumps can make navigation confusing for assistive technology users.'
            },
            {
                id: 'landmarkAmbiguity',
                label: 'No dupe / ambiguous landmarks',
                wcagRef: 'WCAG 2.4.6 / 4.1.2',
                wcagTooltip: 'Landmarks should be named clearly when multiple similar regions exist, so users can distinguish regions in assistive technology landmark lists.'
            },
            {
                id: 'readingOrder',
                label: 'Reading order',
                wcagRef: 'WCAG 1.3.2',
                wcagTooltip: 'Meaningful sequence should be preserved in DOM order so assistive technology announces content in a sensible order.'
            },
            {
                id: 'linkText',
                label: 'Link text',
                wcagRef: 'WCAG 2.4.4',
                wcagTooltip: 'Link purpose should be clear from link text or context. Avoid vague labels like "click here" or "more".'
            },
            {
                id: 'buttonNames',
                label: 'Button names',
                wcagRef: 'WCAG 4.1.2',
                wcagTooltip: 'User interface components need clear accessible names so assistive technology can announce their purpose.'
            },
            {
                id: 'formLabels',
                label: 'Form labels',
                wcagRef: 'WCAG 3.3.2 / 4.1.2',
                wcagTooltip: 'Form controls should have labels or instructions that are programmatically associated and announced by assistive technology.'
            },
            {
                id: 'imageAlt',
                label: 'Image alt',
                wcagRef: 'WCAG 1.1.1',
                wcagTooltip: 'Non-text content needs a text alternative, unless decorative where empty alt text is appropriate.'
            }
        ],
        checklistText: {
            main: {
                pass: 'Main content landmark detected.',
                fail: 'No <main> or role="main" detected.'
            },
            h1: {
                pass: 'Detected top heading: "{heading}".',
                warnMultiple: 'Found {count} top headings. Usually one clear page-level heading is best.',
                fail: 'No top heading (<h1>) detected.'
            },
            nav: {
                pass: 'Navigation landmark detected.',
                fail: 'No <nav> or role="navigation" detected.'
            },
            headingLevels: {
                warnNone: 'No headings found to assess level structure.',
                warnSkip: 'Heading levels appear to skip levels (for example h1 to h3).',
                pass: 'Heading levels follow a sensible structure.'
            },
            landmarkAmbiguity: {
                issueUnnamed: '{type}: multiple regions are unnamed',
                issueRepeated: '{type}: repeated label "{name}"',
                pass: 'No duplicate or ambiguous landmark naming detected.'
            },
            readingOrder: {
                issueNavAfterMain: 'Navigation appears after main content in DOM order',
                issueInteractiveBeforeHeading: 'Interactive controls are announced before the first heading',
                pass: 'DOM reading order appears sensible for assistive technology.'
            },
            linkText: {
                failMissingVisible: '{count} link(s) missing visible text.',
                warnVague: '{count} link(s) use vague text like "click here".',
                pass: 'Link text looks descriptive.',
                warnNone: 'No links found to assess.'
            },
            buttonNames: {
                failMissingName: '{count} button(s) missing an accessible name.',
                pass: 'All buttons appear to have accessible names.',
                warnNone: 'No buttons found to assess.'
            },
            formLabels: {
                failMissingLabel: '{count} form control(s) missing labels.',
                pass: 'All form controls appear labelled.',
                warnNone: 'No form controls found to assess.'
            },
            imageAlt: {
                failMissingAlt: '{count} image(s) missing alt text.',
                pass: 'Image alt text is present.',
                warnNone: 'No images found to assess.'
            }
        }
    }

    const VAGUE_LINK_TEXT = new Set(['click here', 'here', 'read more', 'more', 'link'])

    let pageBlocks = {}
    let blockCounter = 0

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
    }

    function normalizeText(value) {
        return String(value || '').replace(/\s+/g, ' ').trim()
    }

    function formatTemplate(template, values = {}) {
        return String(template || '').replace(/\{(\w+)\}/g, (match, key) => {
            return Object.prototype.hasOwnProperty.call(values, key)
                ? String(values[key])
                : match
        })
    }

    function parseAttributes(rawAttributes) {
        const attrs = {}
        const pattern = /([a-zA-Z_][\w-]*)\s*=\s*"([^"]*)"/g
        let match

        while ((match = pattern.exec(rawAttributes || '')) !== null) {
            attrs[match[1]] = match[2]
        }

        return attrs
    }

    function createIframeDocument(html) {
        return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>${ACCESSIBILITY_CONFIG.iframeCss}</style>
</head>
<body>
${html}
</body>
</html>`
    }

    function findLabelByFor(root, id) {
        if (!id) return null
        const labels = Array.from(root.querySelectorAll('label[for]'))
        return labels.find((label) => label.getAttribute('for') === id) || null
    }

    function getInputLabel(root, inputEl, options = {}) {
        const includePlaceholder = options.includePlaceholder === true

        if (!inputEl) return ''

        const ariaLabel = normalizeText(inputEl.getAttribute('aria-label') || '')
        if (ariaLabel) return ariaLabel

        const labelledBy = normalizeText(inputEl.getAttribute('aria-labelledby') || '')
        if (labelledBy) {
            const ids = labelledBy.split(/\s+/)
            const documentRoot = root.ownerDocument || document
            const labelText = ids
                .map((id) => documentRoot.getElementById(id))
                .filter(Boolean)
                .map((el) => normalizeText(el.textContent))
                .filter(Boolean)
                .join(' ')
            if (labelText) return labelText
        }

        const id = inputEl.getAttribute('id')
        if (id) {
            const explicitLabel = findLabelByFor(root, id)
            if (explicitLabel) {
                const explicitText = normalizeText(explicitLabel.textContent)
                if (explicitText) return explicitText
            }
        }

        const wrappedLabel = inputEl.closest('label')
        if (wrappedLabel) {
            const wrappedText = normalizeText(wrappedLabel.textContent)
            if (wrappedText) return wrappedText
        }

        if (includePlaceholder) {
            return normalizeText(inputEl.getAttribute('placeholder') || '')
        }

        return ''
    }

    function requiresFormLabel(controlEl) {
        if (!controlEl) return false

        const tag = controlEl.tagName.toLowerCase()
        if (tag === 'textarea' || tag === 'select') return true
        if (tag !== 'input') return false

        const inputType = normalizeText(controlEl.getAttribute('type') || 'text').toLowerCase()
        const excludedTypes = new Set(['hidden', 'submit', 'reset', 'button', 'image'])
        return !excludedTypes.has(inputType)
    }

    function getFormControlName(root, controlEl) {
        if (!controlEl) return ''

        const tag = controlEl.tagName.toLowerCase()
        if (tag === 'textarea' || tag === 'select') {
            return getInputLabel(root, controlEl, { includePlaceholder: true })
        }

        if (tag !== 'input') {
            return getInputLabel(root, controlEl, { includePlaceholder: true })
        }

        const inputType = normalizeText(controlEl.getAttribute('type') || 'text').toLowerCase()
        if (inputType === 'submit' || inputType === 'reset' || inputType === 'button' || inputType === 'image') {
            const explicitName = getInputLabel(root, controlEl, { includePlaceholder: true })
            if (explicitName) return explicitName

            const valueText = normalizeText(controlEl.getAttribute('value') || '')
            if (valueText) return valueText

            return ACCESSIBILITY_CONFIG.ui.readerLabels.inputDefaults[inputType] || ACCESSIBILITY_CONFIG.ui.readerLabels.unlabelledControl
        }

        return getInputLabel(root, controlEl, { includePlaceholder: true })
    }

    function analyseScreenReader(html) {
        const parser = new DOMParser()
        const doc = parser.parseFromString(`<!doctype html><html><body>${html}</body></html>`, 'text/html')
        const root = doc.body

        const nav = root.querySelector('nav, [role="navigation"]')
        const main = root.querySelector('main, [role="main"]')
        const h1List = Array.from(root.querySelectorAll('h1'))
        const h1 = h1List[0] || null

        const links = Array.from(root.querySelectorAll('a[href]'))
        const images = Array.from(root.querySelectorAll('img'))
        const inputs = Array.from(root.querySelectorAll('input, textarea, select'))
        const labelledControls = inputs.filter((inputEl) => requiresFormLabel(inputEl))
        const buttons = Array.from(root.querySelectorAll('button, input[type="button"], input[type="submit"], input[type="reset"]'))

        const emptyLinkText = links.filter((link) => !normalizeText(link.textContent))
        const vagueLinks = links.filter((link) => {
            const text = normalizeText(link.textContent).toLowerCase()
            if (!text) return false
            return VAGUE_LINK_TEXT.has(text)
        })
        const missingAlt = images.filter((img) => !normalizeText(img.getAttribute('alt') || ''))
        const missingInputLabels = labelledControls.filter((inputEl) => !normalizeText(getInputLabel(root, inputEl)))
        const unnamedButtons = buttons.filter((button) => {
            const text = normalizeText(button.textContent)
            const ariaLabel = normalizeText(button.getAttribute('aria-label') || '')
            const valueAttr = normalizeText(button.getAttribute('value') || '')
            return !text && !ariaLabel && !valueAttr
        })

        const headingOrder = Array.from(root.querySelectorAll('h1, h2, h3, h4, h5, h6'))
            .map((el) => Number(el.tagName.replace('H', '')))
        let hasHeadingSkip = false
        for (let index = 1; index < headingOrder.length; index += 1) {
            if (headingOrder[index] - headingOrder[index - 1] > 1) {
                hasHeadingSkip = true
                break
            }
        }

        const landmarks = Array.from(root.querySelectorAll('header, nav, main, footer, aside, [role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]'))
            .map((el) => {
                const tag = el.tagName.toLowerCase()
                const role = normalizeText(el.getAttribute('role') || '')
                const type = role || tag
                const ariaLabel = normalizeText(el.getAttribute('aria-label') || '')
                const labelledBy = normalizeText(el.getAttribute('aria-labelledby') || '')
                let labelText = ariaLabel

                if (!labelText && labelledBy) {
                    const ids = labelledBy.split(/\s+/)
                    const documentRoot = root.ownerDocument || document
                    labelText = ids
                        .map((id) => documentRoot.getElementById(id))
                        .filter(Boolean)
                        .map((elRef) => normalizeText(elRef.textContent))
                        .filter(Boolean)
                        .join(' ')
                }

                return {
                    type,
                    label: labelText,
                }
            })

        const landmarkIssues = []
        const landmarksByType = landmarks.reduce((acc, landmark) => {
            if (!acc[landmark.type]) acc[landmark.type] = []
            acc[landmark.type].push(landmark)
            return acc
        }, {})

        Object.keys(landmarksByType).forEach((type) => {
            const entries = landmarksByType[type]
            if (entries.length <= 1) return

            const unnamedCount = entries.filter((entry) => !entry.label).length
            if (unnamedCount > 1) {
                landmarkIssues.push(formatTemplate(
                    ACCESSIBILITY_CONFIG.checklistText.landmarkAmbiguity.issueUnnamed,
                    { type }
                ))
            }

            const namedCount = {}
            entries.forEach((entry) => {
                if (!entry.label) return
                namedCount[entry.label] = (namedCount[entry.label] || 0) + 1
            })
            Object.keys(namedCount).forEach((name) => {
                if (namedCount[name] > 1) {
                    landmarkIssues.push(formatTemplate(
                        ACCESSIBILITY_CONFIG.checklistText.landmarkAmbiguity.issueRepeated,
                        { type, name }
                    ))
                }
            })
        })

        const readingOrderIssues = []
        const firstMainIndex = Array.from(root.querySelectorAll('*')).findIndex((el) => el === main)
        const firstNavIndex = Array.from(root.querySelectorAll('*')).findIndex((el) => el === nav)
        if (firstMainIndex >= 0 && firstNavIndex >= 0 && firstNavIndex > firstMainIndex) {
            readingOrderIssues.push(ACCESSIBILITY_CONFIG.checklistText.readingOrder.issueNavAfterMain)
        }

        const firstHeadingElement = root.querySelector('h1, h2, h3, h4, h5, h6')
        const firstInteractiveElement = root.querySelector('a[href], button, input, select, textarea')
        if (firstHeadingElement && firstInteractiveElement) {
            const allElements = Array.from(root.querySelectorAll('*'))
            const headingIndex = allElements.findIndex((el) => el === firstHeadingElement)
            const interactiveIndex = allElements.findIndex((el) => el === firstInteractiveElement)
            if (interactiveIndex >= 0 && headingIndex >= 0 && interactiveIndex < headingIndex) {
                readingOrderIssues.push(ACCESSIBILITY_CONFIG.checklistText.readingOrder.issueInteractiveBeforeHeading)
            }
        }

        const checks = {
            main: {
                status: main ? ACCESSIBILITY_CONFIG.ui.statuses.pass : ACCESSIBILITY_CONFIG.ui.statuses.fail,
                detail: main
                    ? ACCESSIBILITY_CONFIG.checklistText.main.pass
                    : ACCESSIBILITY_CONFIG.checklistText.main.fail
            },
            h1: {
                status: h1List.length === 1
                    ? ACCESSIBILITY_CONFIG.ui.statuses.pass
                    : (h1List.length > 1 ? ACCESSIBILITY_CONFIG.ui.statuses.warn : ACCESSIBILITY_CONFIG.ui.statuses.fail),
                detail: h1List.length === 1
                    ? formatTemplate(ACCESSIBILITY_CONFIG.checklistText.h1.pass, {
                        heading: normalizeText(h1List[0].textContent)
                    })
                    : (h1List.length > 1
                        ? formatTemplate(ACCESSIBILITY_CONFIG.checklistText.h1.warnMultiple, {
                            count: h1List.length
                        })
                        : ACCESSIBILITY_CONFIG.checklistText.h1.fail)
            },
            nav: {
                status: nav ? ACCESSIBILITY_CONFIG.ui.statuses.pass : ACCESSIBILITY_CONFIG.ui.statuses.fail,
                detail: nav
                    ? ACCESSIBILITY_CONFIG.checklistText.nav.pass
                    : ACCESSIBILITY_CONFIG.checklistText.nav.fail
            },
            headingLevels: {
                status: headingOrder.length === 0
                    ? ACCESSIBILITY_CONFIG.ui.statuses.warn
                    : (hasHeadingSkip ? ACCESSIBILITY_CONFIG.ui.statuses.warn : ACCESSIBILITY_CONFIG.ui.statuses.pass),
                detail: headingOrder.length === 0
                    ? ACCESSIBILITY_CONFIG.checklistText.headingLevels.warnNone
                    : (hasHeadingSkip
                        ? ACCESSIBILITY_CONFIG.checklistText.headingLevels.warnSkip
                        : ACCESSIBILITY_CONFIG.checklistText.headingLevels.pass)
            },
            landmarkAmbiguity: {
                status: landmarkIssues.length ? ACCESSIBILITY_CONFIG.ui.statuses.warn : ACCESSIBILITY_CONFIG.ui.statuses.pass,
                detail: landmarkIssues.length
                    ? landmarkIssues.join('; ')
                    : ACCESSIBILITY_CONFIG.checklistText.landmarkAmbiguity.pass
            },
            readingOrder: {
                status: readingOrderIssues.length
                    ? ACCESSIBILITY_CONFIG.ui.statuses.warn
                    : ACCESSIBILITY_CONFIG.ui.statuses.pass,
                detail: readingOrderIssues.length
                    ? readingOrderIssues.join('; ')
                    : ACCESSIBILITY_CONFIG.checklistText.readingOrder.pass
            },
            linkText: {
                status: emptyLinkText.length
                    ? ACCESSIBILITY_CONFIG.ui.statuses.fail
                    : (vagueLinks.length
                        ? ACCESSIBILITY_CONFIG.ui.statuses.warn
                        : (links.length ? ACCESSIBILITY_CONFIG.ui.statuses.pass : ACCESSIBILITY_CONFIG.ui.statuses.warn)),
                detail: emptyLinkText.length
                    ? formatTemplate(ACCESSIBILITY_CONFIG.checklistText.linkText.failMissingVisible, {
                        count: emptyLinkText.length
                    })
                    : (vagueLinks.length
                        ? formatTemplate(ACCESSIBILITY_CONFIG.checklistText.linkText.warnVague, {
                            count: vagueLinks.length
                        })
                        : (links.length
                            ? ACCESSIBILITY_CONFIG.checklistText.linkText.pass
                            : ACCESSIBILITY_CONFIG.checklistText.linkText.warnNone))
            },
            buttonNames: {
                status: unnamedButtons.length
                    ? ACCESSIBILITY_CONFIG.ui.statuses.fail
                    : (buttons.length ? ACCESSIBILITY_CONFIG.ui.statuses.pass : ACCESSIBILITY_CONFIG.ui.statuses.warn),
                detail: unnamedButtons.length
                    ? formatTemplate(ACCESSIBILITY_CONFIG.checklistText.buttonNames.failMissingName, {
                        count: unnamedButtons.length
                    })
                    : (buttons.length
                        ? ACCESSIBILITY_CONFIG.checklistText.buttonNames.pass
                        : ACCESSIBILITY_CONFIG.checklistText.buttonNames.warnNone)
            },
            formLabels: {
                status: missingInputLabels.length
                    ? ACCESSIBILITY_CONFIG.ui.statuses.fail
                    : (labelledControls.length ? ACCESSIBILITY_CONFIG.ui.statuses.pass : ACCESSIBILITY_CONFIG.ui.statuses.warn),
                detail: missingInputLabels.length
                    ? formatTemplate(ACCESSIBILITY_CONFIG.checklistText.formLabels.failMissingLabel, {
                        count: missingInputLabels.length
                    })
                    : (labelledControls.length
                        ? ACCESSIBILITY_CONFIG.checklistText.formLabels.pass
                        : ACCESSIBILITY_CONFIG.checklistText.formLabels.warnNone)
            },
            imageAlt: {
                status: missingAlt.length
                    ? ACCESSIBILITY_CONFIG.ui.statuses.fail
                    : (images.length ? ACCESSIBILITY_CONFIG.ui.statuses.pass : ACCESSIBILITY_CONFIG.ui.statuses.warn),
                detail: missingAlt.length
                    ? formatTemplate(ACCESSIBILITY_CONFIG.checklistText.imageAlt.failMissingAlt, {
                        count: missingAlt.length
                    })
                    : (images.length
                        ? ACCESSIBILITY_CONFIG.checklistText.imageAlt.pass
                        : ACCESSIBILITY_CONFIG.checklistText.imageAlt.warnNone)
            }
        }

        const checklist = ACCESSIBILITY_CONFIG.checklist.map((item) => ({
            label: item.label,
            wcagRef: item.wcagRef,
            wcagTooltip: item.wcagTooltip,
            status: checks[item.id].status,
            detail: checks[item.id].detail,
        }))

        const announcements = []
        const walker = doc.createTreeWalker(root, NodeFilter.SHOW_ELEMENT)
        let current = walker.currentNode

        while (current) {
            const el = current
            const name = el.tagName.toLowerCase()
            const role = normalizeText(el.getAttribute('role') || '')
            const text = normalizeText(el.textContent)

            if (name === 'header' || role === 'banner') {
                announcements.push(ACCESSIBILITY_CONFIG.ui.readerLabels.banner)
            } else if (name === 'nav' || role === 'navigation') {
                announcements.push(ACCESSIBILITY_CONFIG.ui.readerLabels.navigation)
            } else if (name === 'main' || role === 'main') {
                announcements.push(ACCESSIBILITY_CONFIG.ui.readerLabels.main)
            } else if (/^h[1-6]$/.test(name) && text) {
                announcements.push(`${ACCESSIBILITY_CONFIG.ui.readerLabels.heading} ${name.slice(1)}: ${text}`)
            } else if (name === 'a' && text) {
                announcements.push(`${ACCESSIBILITY_CONFIG.ui.readerLabels.link}: ${text}`)
            } else if (name === 'button') {
                const buttonText = text || normalizeText(el.getAttribute('aria-label') || '')
                if (buttonText) announcements.push(`${ACCESSIBILITY_CONFIG.ui.readerLabels.button}: ${buttonText}`)
            } else if ((name === 'input' || name === 'textarea' || name === 'select')) {
                const label = getFormControlName(root, el)
                const type = normalizeText(el.getAttribute('type') || name)
                announcements.push(`${ACCESSIBILITY_CONFIG.ui.readerLabels.formControl} (${type}): ${label || ACCESSIBILITY_CONFIG.ui.readerLabels.unlabelledControl}`)
            } else if (name === 'img') {
                const alt = normalizeText(el.getAttribute('alt') || '')
                announcements.push(`${ACCESSIBILITY_CONFIG.ui.readerLabels.image}: ${alt || ACCESSIBILITY_CONFIG.ui.readerLabels.missingAlt}`)
            }

            current = walker.nextNode()
        }

        return {
            checklist,
            announcements,
            siteName: h1 ? normalizeText(h1.textContent) : ''
        }
    }

    function renderChecklistItems(checklist) {
        return checklist.map((item) => `
            <li class="accessibility-checklist-item" data-status="${item.status}">
                <p class="accessibility-checklist-title">
                    <span>${escapeHtml(item.label)}</span>
                    <span class="accessibility-checklist-wcag" title="${escapeHtml(item.wcagTooltip)}">${escapeHtml(item.wcagRef)}</span>
                </p>
                <p class="accessibility-checklist-detail">${escapeHtml(item.detail)}</p>
            </li>
        `).join('')
    }

    function renderAnnouncementItems(announcements) {
        if (!announcements.length) {
            return `<li class="accessibility-order-item">${escapeHtml(ACCESSIBILITY_CONFIG.ui.noAnnouncements)}</li>`
        }

        return announcements.map((line) => `
            <li class="accessibility-order-item">${escapeHtml(line)}</li>
        `).join('')
    }

    function hydrateScreenReaderWidget(el, block) {
        const analysis = analyseScreenReader(block.html)
        const srcdoc = createIframeDocument(block.html)
        const escapedSource = escapeHtml(block.html)

        el.innerHTML = `
            <div class="accessibility-wrapper accessibility-screen-reader">
                <div class="accessibility-header">
                    <p class="accessibility-title">${ACCESSIBILITY_CONFIG.ui.title}</p>
                    <p class="accessibility-subtitle">${ACCESSIBILITY_CONFIG.ui.subtitle}</p>
                </div>

                <div class="accessibility-layout">
                    <section class="accessibility-panel accessibility-html-panel">
                        <p class="accessibility-panel-title">${ACCESSIBILITY_CONFIG.ui.htmlTitle}</p>
                        <pre class="accessibility-code-block"><code class="language-html">${escapedSource}</code></pre>
                    </section>

                    <section class="accessibility-panel accessibility-preview-panel">
                        <p class="accessibility-panel-title">${ACCESSIBILITY_CONFIG.ui.previewTitle}</p>
                        <iframe class="accessibility-preview" sandbox srcdoc="${escapeHtml(srcdoc)}" title="Accessibility preview"></iframe>
                    </section>

                    <section class="accessibility-panel accessibility-checklist-panel">
                        <p class="accessibility-panel-title">${ACCESSIBILITY_CONFIG.ui.checklistTitle}</p>
                        <ul class="accessibility-checklist" role="list">
                            ${renderChecklistItems(analysis.checklist)}
                        </ul>
                    </section>

                    <section class="accessibility-panel accessibility-order-panel">
                        <p class="accessibility-panel-title">${ACCESSIBILITY_CONFIG.ui.readerTitle}</p>
                        <ol class="accessibility-order" role="list">
                            ${renderAnnouncementItems(analysis.announcements)}
                        </ol>
                    </section>
                </div>
            </div>
        `

        if (window.Prism) {
            const codeEl = el.querySelector('.accessibility-code-block code')
            if (codeEl) window.Prism.highlightElement(codeEl)
        }
    }

    function processAccessibilityWidgets() {
        const widgets = document.querySelectorAll('.markdown-section accessibility[data-a11y-id]:not(.accessibility-initialized)')

        widgets.forEach((el) => {
            const blockId = el.getAttribute('data-a11y-id') || ''
            const mode = (el.getAttribute('data-a11y-mode') || 'screen-reader').trim().toLowerCase()
            const block = pageBlocks[blockId]

            el.classList.add('accessibility-initialized')

            if (!block || !block.html) {
                el.innerHTML = `<div class="accessibility-error">${escapeHtml(ACCESSIBILITY_CONFIG.ui.missingInput)}</div>`
                return
            }

            if (mode !== 'screen-reader') {
                el.innerHTML = `<div class="accessibility-error">${escapeHtml(ACCESSIBILITY_CONFIG.ui.unsupportedMode)}</div>`
                return
            }

            hydrateScreenReaderWidget(el, block)
        })
    }

    function docsifyAccessibility(hook) {
        hook.beforeEach(function (content) {
            pageBlocks = {}
            blockCounter = 0

            const normalized = String(content || '').replace(/\r\n/g, '\n')

            return normalized.replace(BLOCK_PATTERN, function (match, rawAttributes, rawHtml) {
                blockCounter += 1
                const blockId = `a11y-block-${blockCounter}`
                const attrs = parseAttributes(rawAttributes)
                const mode = (attrs.mode || 'screen-reader').trim().toLowerCase()

                pageBlocks[blockId] = {
                    id: blockId,
                    mode,
                    html: rawHtml.trim()
                }

                return `<accessibility data-a11y-id="${blockId}" data-a11y-mode="${mode}"></accessibility>`
            })
        })

        hook.doneEach(processAccessibilityWidgets)
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyAccessibility, window.$docsify.plugins || [])
})()
