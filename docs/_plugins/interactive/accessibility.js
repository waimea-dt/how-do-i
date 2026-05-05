/**
 * docsify-accessibility.js - Accessibility teaching widgets for Docsify.
 *
 * Modes:
 * - screen-reader: landmark and announcement order checks
 * - low-vision: dual preview scaffold with simulation controls
 * - colour-blind: dual preview scaffold with simulation controls
 * - motor-impairment: dual preview scaffold with simulation controls
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

    const ACCESSIBILITY_IFRAME_CSS = `
            :root {
                color-scheme: light;

                --preview-page-bg: #eee;
                --preview-text: #111;

                --preview-header-bg: #666;
                --preview-header-text: #fff;

                --preview-accent: #369;
                --preview-high: #69c;

                --preview-link: #69c;
            }

            * { box-sizing: border-box; }

            body {
                font-family: system-ui, sans-serif;
                line-height: 1.4;
                color: var(--preview-text);
                background: var(--preview-page-bg);
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

                & > :first-child { margin-top: 0; }
                & > :last-child { margin-bottom: 0; }
            }

            header, .header,
            main,   .content,
            footer,
            section,
            article,
            aside,
            form,
            :not(:is(header, .header)) > nav, div:has(> button) {
                padding: 1rem;
            }

            section,
            article,
            aside,
            form,
            :not(:is(header, .header)) > nav, div:has(> button) {
                border: 1px solid var(--preview-accent);
                border-radius: 0.25rem;
                margin-bottom: 1rem;
            }

            header, .header {
                border-bottom: 1px solid var(--preview-accent);
                background-color: var(--preview-header-bg);

                h1, .big-title, a { color: var(--preview-header-text); }
            }

            h1, .big-title,
            h2, .title,
            h3, .small-title,
            h4, h5, h6 {
                margin: 0.25em 0 0.5em;
                font-weight: bold;
            }

            h1, .big-title   { font-size: 2.0rem; }
            h2, .title       { font-size: 1.5rem; }
            h3, .small-title { font-size: 1.2rem; }
            h4 { font-size: 1.1rem; }
            h5 { font-size: 1.0rem; }
            h6 { font-size: 0.9rem; }

            nav a, .menu a {
                margin-right: 0.75rem;
            }

            :focus-visible {
                outline: 3px solid var(--preview-high);
                outline-offset: 2px;
            }

            img {
                display: block;
                max-height: 6rem;
                margin: 1rem auto;
            }

            input, button, textarea { font: inherit; }

            label, input, button, nav a, a { margin-inline: 0.25rem; }

            a {
                cursor: pointer;
                color: var(--preview-link);

                &:active {
                    pointer-events: none;
                }
            }

        `

    const ACCESSIBILITY_IFRAME_THEME_CSS = {
            blue: `
                :root {
                    color-scheme: light;

                    --preview-page-bg: #c2d7e6;
                    --preview-text: #111;

                    --preview-header-bg: #183b5e;
                    --preview-header-text: #fff;

                    --preview-accent: #2263a4;
                    --preview-high: #0169d2;

                    --preview-link: #0169d2;
                }
            `,
            red: `
                :root {
                    color-scheme: light;

                    --preview-page-bg: #e7c6ca;
                    --preview-text: #111;

                    --preview-header-bg: #5a1f29;
                    --preview-header-text: #fff;

                    --preview-accent: #6f2831;
                    --preview-high: #be2439;

                    --preview-link: #be2439;
                }
            `,
            lowcontrast: `
                :root {
                    color-scheme: dark;

                    --preview-page-bg: blue;
                    --preview-text: green;

                    --preview-header-bg: darkblue;
                    --preview-header-text: darkgreen;

                    --preview-accent: darkblue;
                    --preview-high: red;

                    --preview-link: red;
                }
            `,
    }

    const ACCESSIBILITY_UI = {
            title: 'Screen Reader Simulation',
            subtitle: 'Approximation only - Not a real screen-reader emulator.',
            htmlTitle: 'HTML Code',
            previewTitle: 'Rendered Preview',
            simulationTitle: 'Simulated View',
            checklistTitle: 'Screen-Reader Checklist',
            readerTitle: 'Screen-Reader Dialogue',
            lowVisionTitle: 'Low Vision Simulation',
            colourBlindTitle: 'Colour Blindness Simulation',
            motorImpairmentTitle: 'Motor Impairment Simulation',
            unsupportedMode: 'Unsupported accessibility mode.',
            missingInput: 'Missing accessibility HTML input.',
            noAnnouncements: 'No key announcements detected.',
            modeControls: {
                lowVision: {
                    blur: 'Blur strength',
                    tunnelVision: 'Enable tunnel vision'
                },
                colourBlind: {
                    filter: 'Colour filter',
                    options: {
                        protanopia: 'Protanopia',
                        deuteranopia: 'Deuteranopia',
                        tritanopia: 'Tritanopia',
                        achromatopsia: 'Achromatopsia'
                    }
                },
                motorImpairment: {
                    targetHighlight: 'Highlight click targets',
                    shakyCursor: 'Enable shaky cursor'
                }
            },
            readerLabels: {
                banner: 'Landmark: Banner',
                navigation: 'Landmark: Navigation',
                main: 'Landmark: Main Content',
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
    }

    const ACCESSIBILITY_CHECKLIST = [
            {
                id: 'main',
                label: 'Main content',
                wcagRef: 'WCAG 1.3.1',
                wcagTooltip: 'Info and relationships should be programmatically determinable. Main content should be identifiable with semantic structure such as <main> or role="main".'
            },
            {
                id: 'h1',
                label: 'Top Heading',
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
                label: 'Heading Levels',
                wcagRef: 'WCAG 1.3.1',
                wcagTooltip: 'Heading levels should reflect document structure. Large level jumps can make navigation confusing for assistive technology users.'
            },
            {
                id: 'landmarkAmbiguity',
                label: 'No Duplicate / Ambiguous Landmarks',
                wcagRef: 'WCAG 4.1.2',
                wcagTooltip: 'Landmarks should be named clearly when multiple similar regions exist, so users can distinguish regions in assistive technology landmark lists.'
            },
            {
                id: 'readingOrder',
                label: 'Reading Order',
                wcagRef: 'WCAG 1.3.2',
                wcagTooltip: 'Meaningful sequence should be preserved in DOM order so assistive technology announces content in a sensible order.'
            },
            {
                id: 'linkText',
                label: 'Link Text',
                wcagRef: 'WCAG 2.4.4',
                wcagTooltip: 'Link purpose should be clear from link text or context. Avoid vague labels like "click here" or "more".'
            },
            {
                id: 'buttonNames',
                label: 'Button Names',
                wcagRef: 'WCAG 4.1.2',
                wcagTooltip: 'User interface components need clear accessible names so assistive technology can announce their purpose.'
            },
            {
                id: 'formLabels',
                label: 'Form Labels',
                wcagRef: 'WCAG 3.3.2',
                wcagTooltip: 'Form controls should have labels or instructions that are programmatically associated and announced by assistive technology.'
            },
            {
                id: 'imageAlt',
                label: 'Image Alt Text',
                wcagRef: 'WCAG 1.1.1',
                wcagTooltip: 'Non-text content needs a text alternative, unless decorative where empty alt text is appropriate.'
            }
    ]

    const ACCESSIBILITY_CHECKLIST_TEXT = {
            main: {
                pass: 'Main content landmark detected.',
                fail: 'No <main> or role="main" detected.'
            },
            h1: {
                pass: 'Detected top heading: "{heading}".',
                warnFirstNotH1: 'First heading is <h{level}>. Top heading should be <h1>.',
                warnMultiple: 'Found {count} top headings. Just use one clear <h1> heading.',
                fail: 'No top heading (<h1>) detected.'
            },
            nav: {
                pass: 'Navigation landmark detected.',
                fail: 'No <nav> or role="navigation" detected.'
            },
            headingLevels: {
                warnNone: 'No headings found to assess level structure.',
                warnSkip: 'Heading levels jump by 2 or more (for example h1 to h3).',
                pass: 'Heading levels follow a sensible structure.'
            },
            landmarkAmbiguity: {
                issueUnnamed: '{type}: multiple regions are unnamed',
                issueRepeated: '{type}: repeated label "{name}"',
                pass: 'No duplicate or ambiguous landmark naming detected.'
            },
            readingOrder: {
                issueNavAfterMain: 'Navigation appears after main content in the page order',
                issueInteractiveBeforeHeading: 'Navigation announced before the first heading',
                pass: 'Reading order appears sensible for assistive technology.'
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

    const ACCESSIBILITY_TTS = {
        rate: 2,           // 0.1 to 10, default 1
        pitch: 0.7,          // 0 to 2, default 1
        volume: 1          // 0 to 1, default 1
    }

    const ACCESSIBILITY_CONFIG = {
        iframeCss: ACCESSIBILITY_IFRAME_CSS,
        iframeThemeCss: ACCESSIBILITY_IFRAME_THEME_CSS,
        ui: ACCESSIBILITY_UI,
        checklist: ACCESSIBILITY_CHECKLIST,
        checklistText: ACCESSIBILITY_CHECKLIST_TEXT,
        tts: ACCESSIBILITY_TTS,
    }

    const ACCESSIBILITY_SUPPORTED_MODES = new Set([
        'screen-reader',
        'low-vision',
        'colour-blind',
        'motor-impairment'
    ])

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

    function parseBooleanAttribute(value, defaultValue = true) {
        if (value == null) return defaultValue
        const normalized = normalizeText(value).toLowerCase()
        if (!normalized) return defaultValue
        if (normalized === 'false' || normalized === '0' || normalized === 'no' || normalized === 'off') {
            return false
        }
        if (normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on') {
            return true
        }
        return defaultValue
    }

    function parseThemeAttribute(value, defaultTheme = 'blue') {
        const normalized = normalizeText(value).toLowerCase()
        if (!normalized) return defaultTheme
        return normalized
    }

    function parseModeAttribute(value, defaultMode = 'screen-reader') {
        const normalized = normalizeText(value).toLowerCase()
        if (!normalized) return defaultMode
        if (ACCESSIBILITY_SUPPORTED_MODES.has(normalized)) return normalized
        return defaultMode
    }

    function createIframeDocument(html, theme = 'blue', extraCss = '') {
        const themeCss = ACCESSIBILITY_CONFIG.iframeThemeCss[theme] || ''
        const allCss = extraCss ? `${ACCESSIBILITY_CONFIG.iframeCss}\n\n${themeCss}\n\n${extraCss}` : `${ACCESSIBILITY_CONFIG.iframeCss}\n\n${themeCss}`
        return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>${allCss}</style>
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

        const headingElements = Array.from(root.querySelectorAll('h1, h2, h3, h4, h5, h6'))
        const headingOrder = headingElements
            .map((el) => Number(el.tagName.replace('H', '')))
        const firstHeadingLevel = headingOrder.length ? headingOrder[0] : null
        const firstHeadingIsH1 = firstHeadingLevel === 1
        let hasHeadingSkip = false
        for (let index = 1; index < headingOrder.length; index += 1) {
            if (Math.abs(headingOrder[index] - headingOrder[index - 1]) > 1) {
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
                status: h1List.length === 0
                    ? ACCESSIBILITY_CONFIG.ui.statuses.fail
                    : (!firstHeadingIsH1 || h1List.length > 1
                        ? ACCESSIBILITY_CONFIG.ui.statuses.warn
                        : ACCESSIBILITY_CONFIG.ui.statuses.pass),
                detail: h1List.length === 0
                    ? ACCESSIBILITY_CONFIG.checklistText.h1.fail
                    : (!firstHeadingIsH1
                        ? formatTemplate(ACCESSIBILITY_CONFIG.checklistText.h1.warnFirstNotH1, {
                            level: firstHeadingLevel
                        })
                        : (h1List.length > 1
                            ? formatTemplate(ACCESSIBILITY_CONFIG.checklistText.h1.warnMultiple, {
                                count: h1List.length
                            })
                            : formatTemplate(ACCESSIBILITY_CONFIG.checklistText.h1.pass, {
                                heading: normalizeText(h1List[0].textContent)
                            })))
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
        const getChecklistIcon = (status) => {
            if (status === ACCESSIBILITY_CONFIG.ui.statuses.pass) {
                return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/><path d="M7 10v12"/></svg>'
            }

            if (status === ACCESSIBILITY_CONFIG.ui.statuses.warn) {
                return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>'
            }

            return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>'
        }

        return checklist.map((item) => `
            <li class="accessibility-checklist-item" data-status="${item.status}">
                <span class="accessibility-checklist-icon" aria-hidden="true">${getChecklistIcon(item.status)}</span>
                <div class="accessibility-checklist-content">
                    <p class="accessibility-checklist-title">
                        <span>${escapeHtml(item.label)}</span>
                        <span class="accessibility-checklist-wcag" title="${escapeHtml(item.wcagTooltip)}">${escapeHtml(item.wcagRef)}</span>
                    </p>
                    <p class="accessibility-checklist-detail">${escapeHtml(item.detail)}</p>
                </div>
            </li>
        `).join('')
    }

    function renderAnnouncementItems(announcements) {
        if (!announcements.length) {
            return `<li class="accessibility-order-item">${escapeHtml(ACCESSIBILITY_CONFIG.ui.noAnnouncements)}</li>`
        }

        return announcements.map((line, index) => `
            <li class="accessibility-order-item" data-announcement-index="${index}">${escapeHtml(line)}</li>
        `).join('')
    }

    function renderSourcePanel(html) {
        return `
            <section class="accessibility-panel accessibility-panel--source accessibility-html-panel">
                <p class="accessibility-panel-title">${ACCESSIBILITY_CONFIG.ui.htmlTitle}</p>
                <pre class="accessibility-code-block"><code class="language-html">${escapeHtml(html)}</code></pre>
            </section>
        `
    }

    function renderPrimaryPreviewPanel(srcdoc) {
        return `
            <section class="accessibility-panel accessibility-panel--primary-preview accessibility-preview-panel">
                <p class="accessibility-panel-title">${ACCESSIBILITY_CONFIG.ui.previewTitle}</p>
                <iframe class="accessibility-preview" sandbox srcdoc="${escapeHtml(srcdoc)}" title="Accessibility preview"></iframe>
            </section>
        `
    }

    function renderSecondaryPreviewPanel(title, srcdoc, modeClass, controlsHtml) {
        return `
            <section class="accessibility-panel accessibility-panel--secondary-preview accessibility-simulation-panel">
                <p class="accessibility-panel-title">${escapeHtml(title)}</p>
                <div class="accessibility-simulation-controls" data-a11y-mode-controls="${escapeHtml(modeClass)}">
                    ${controlsHtml}
                </div>
                <div class="accessibility-iframe-wrap">
                    <iframe class="accessibility-preview accessibility-preview--simulated ${escapeHtml(modeClass)}" sandbox="allow-same-origin" srcdoc="${escapeHtml(srcdoc)}" title="Accessibility simulation preview"></iframe>
                </div>
            </section>
        `
    }

    function renderLowVisionControls() {
        return `
            <div class="accessibility-simulation-control accessibility-simulation-control--range">
                <label>${ACCESSIBILITY_CONFIG.ui.modeControls.lowVision.blur}</label>
                <input type="range" min="0" max="12" value="2" step="1">
            </div>
            <label class="accessibility-simulation-control accessibility-simulation-control--checkbox">
                <input type="checkbox">
                <span>${ACCESSIBILITY_CONFIG.ui.modeControls.lowVision.tunnelVision}</span>
            </label>
        `
    }

    function renderColourBlindControls() {
        const options = ACCESSIBILITY_CONFIG.ui.modeControls.colourBlind.options
        return `
            <div class="accessibility-simulation-control accessibility-simulation-control--select">
                <label>${ACCESSIBILITY_CONFIG.ui.modeControls.colourBlind.filter}</label>
                <select>
                    <option value="none">None</option>
                    <option value="protanopia">${escapeHtml(options.protanopia)}</option>
                    <option value="deuteranopia">${escapeHtml(options.deuteranopia)}</option>
                    <option value="tritanopia">${escapeHtml(options.tritanopia)}</option>
                    <option value="achromatopsia">${escapeHtml(options.achromatopsia)}</option>
                </select>
            </div>
        `
    }

    function renderMotorImpairmentControls() {
        return `
            <label class="accessibility-simulation-control accessibility-simulation-control--checkbox">
                <input type="checkbox" checked>
                <span>${ACCESSIBILITY_CONFIG.ui.modeControls.motorImpairment.targetHighlight}</span>
            </label>
            <label class="accessibility-simulation-control accessibility-simulation-control--checkbox">
                <input type="checkbox" checked>
                <span>${ACCESSIBILITY_CONFIG.ui.modeControls.motorImpairment.shakyCursor}</span>
            </label>
        `
    }

    function renderHeaderPanel(title, subtitle, isEnabled) {
        if (!isEnabled) return ''
        return `
            <div class="accessibility-header">
                <p class="accessibility-title">${escapeHtml(title)}</p>
                <p class="accessibility-subtitle">${escapeHtml(subtitle)}</p>
            </div>
        `
    }

    function getSimulationModeMeta(mode) {
        if (mode === 'low-vision') {
            return {
                title: ACCESSIBILITY_CONFIG.ui.lowVisionTitle,
                controls: renderLowVisionControls(),
                modeClass: 'accessibility-sim--low-vision'
            }
        }

        if (mode === 'colour-blind') {
            return {
                title: ACCESSIBILITY_CONFIG.ui.colourBlindTitle,
                controls: renderColourBlindControls(),
                modeClass: 'accessibility-sim--colour-blind'
            }
        }

        return {
            title: ACCESSIBILITY_CONFIG.ui.motorImpairmentTitle,
            controls: renderMotorImpairmentControls(),
            modeClass: 'accessibility-sim--motor-impairment'
        }
    }

    function hydrateScreenReaderWidget(el, block) {
        const auditEnabled = block.audit !== false
        const headerEnabled = block.header !== false
        const theme = block.theme || 'blue'
        const analysis = auditEnabled
            ? analyseScreenReader(block.html)
            : { checklist: [], announcements: [] }
        const srcdoc = createIframeDocument(block.html, theme)
        const headerPanel = renderHeaderPanel(ACCESSIBILITY_CONFIG.ui.title, ACCESSIBILITY_CONFIG.ui.subtitle, headerEnabled)
        const layoutClass = auditEnabled
            ? 'accessibility-layout accessibility-layout--screen-reader'
            : 'accessibility-layout accessibility-layout--screen-reader accessibility-layout--screen-reader-no-audit'
        const auditPanels = auditEnabled
            ? `
                    <section class="accessibility-panel accessibility-panel--analysis accessibility-checklist-panel">
                        <p class="accessibility-panel-title">${ACCESSIBILITY_CONFIG.ui.checklistTitle}</p>
                        <ul class="accessibility-checklist" role="list">
                            ${renderChecklistItems(analysis.checklist)}
                        </ul>
                    </section>

                    <section class="accessibility-panel accessibility-panel--reader accessibility-order-panel">
                        <p class="accessibility-panel-title">${ACCESSIBILITY_CONFIG.ui.readerTitle}</p>
                        <ol class="accessibility-order" role="list">
                            ${renderAnnouncementItems(analysis.announcements)}
                        </ol>
                        <button class="accessibility-order-speak-btn" data-announcements="${escapeHtml(JSON.stringify(analysis.announcements))}" title="Speak all items" aria-label="Speak all announcements">🔊 Speak</button>
                    </section>
            `
            : ''

        el.innerHTML = `
            <div class="accessibility-wrapper accessibility-screen-reader">
${headerPanel}

                <div class="${layoutClass}">
                    ${renderSourcePanel(block.html)}
                    ${renderPrimaryPreviewPanel(srcdoc)}
${auditPanels}
                </div>
            </div>
        `

        if (window.Prism) {
            const codeEl = el.querySelector('.accessibility-code-block code')
            if (codeEl) window.Prism.highlightElement(codeEl)
        }

        el.addEventListener('click', (event) => {
            if (event.target.classList.contains('accessibility-order-speak-btn')) {
                const button = event.target
                const announcementsJson = button.getAttribute('data-announcements')
                if (announcementsJson && window.speechSynthesis) {
                    try {
                        const items = Array.from(el.querySelectorAll('.accessibility-order-item[data-announcement-index]'))
                        const clearHighlight = () => {
                            items.forEach((item) => item.classList.remove('is-speaking'))
                        }

                        if (button.dataset.ttsState === 'playing') {
                            button.dataset.ttsState = 'idle'
                            window.speechSynthesis.cancel()
                            clearHighlight()
                            button.textContent = '🔊 Speak'
                        } else {
                            const announcements = JSON.parse(announcementsJson)
                            if (!announcements.length) {
                                return
                            }

                            button.dataset.ttsState = 'playing'
                            window.speechSynthesis.cancel()
                            button.textContent = '⏹ Stop'
                            clearHighlight()

                            const separator = '. '
                            const lineStartOffsets = []
                            let offset = 0
                            announcements.forEach((line) => {
                                lineStartOffsets.push(offset)
                                offset += line.length + separator.length
                            })

                            const fullText = announcements.join(separator)
                            const utterance = new SpeechSynthesisUtterance(fullText)
                            utterance.rate = ACCESSIBILITY_CONFIG.tts.rate
                            utterance.pitch = ACCESSIBILITY_CONFIG.tts.pitch
                            utterance.volume = ACCESSIBILITY_CONFIG.tts.volume

                            let lastIndex = -1
                            const setActiveLine = (index) => {
                                if (index === lastIndex || index < 0 || index >= items.length) {
                                    return
                                }
                                clearHighlight()
                                items[index].classList.add('is-speaking')
                                lastIndex = index
                            }

                            utterance.onstart = () => {
                                if (button.dataset.ttsState !== 'playing') return
                                setActiveLine(0)
                            }

                            utterance.onboundary = (boundaryEvent) => {
                                if (button.dataset.ttsState !== 'playing') return
                                if (typeof boundaryEvent.charIndex !== 'number') return

                                let activeIndex = 0
                                while (
                                    activeIndex + 1 < lineStartOffsets.length
                                    && boundaryEvent.charIndex >= lineStartOffsets[activeIndex + 1]
                                ) {
                                    activeIndex += 1
                                }

                                setActiveLine(activeIndex)
                            }

                            utterance.onend = () => {
                                if (button.dataset.ttsState !== 'playing') {
                                    return
                                }
                                button.dataset.ttsState = 'idle'
                                clearHighlight()
                                button.textContent = '🔊 Speak'
                            }

                            utterance.onerror = () => {
                                button.dataset.ttsState = 'idle'
                                window.speechSynthesis.cancel()
                                clearHighlight()
                                button.textContent = '🔊 Speak'
                            }

                            window.speechSynthesis.speak(utterance)
                        }
                    } catch (e) {
                        if (window.speechSynthesis) {
                            window.speechSynthesis.cancel()
                        }
                        const items = Array.from(el.querySelectorAll('.accessibility-order-item[data-announcement-index]'))
                        items.forEach((item) => item.classList.remove('is-speaking'))
                        button.dataset.ttsState = 'idle'
                        button.textContent = '🔊 Speak'
                        console.error('Failed to parse announcements for TTS:', e)
                    }
                }
            }
        })
    }

    function hydrateLowVisionControls(simIframe, simPanel, controls) {
        const blurRange = controls.querySelector('input[type="range"]')
        const tunnelCheckbox = controls.querySelector('input[type="checkbox"]')

        simIframe.style.filter = `blur(${blurRange.value}px)`

        blurRange.addEventListener('input', () => {
            simIframe.style.filter = `blur(${blurRange.value}px)`
        })

        const overlay = document.createElement('div')
        overlay.className = 'accessibility-tunnel-vision-overlay'
            const iframeWrap = simPanel.querySelector('.accessibility-iframe-wrap')
            iframeWrap.appendChild(overlay)

        // Transparent hit-area that sits over the iframe to capture mousemove
        // events that would otherwise be swallowed by the iframe document.
        const mouseCapture = document.createElement('div')
        mouseCapture.className = 'accessibility-tunnel-vision-capture'
            iframeWrap.appendChild(mouseCapture)

        const updateOverlayPosition = (e) => {
                const rect = iframeWrap.getBoundingClientRect()
            const x = ((e.clientX - rect.left) / rect.width) * 100
            const y = ((e.clientY - rect.top) / rect.height) * 100
            overlay.style.background = `radial-gradient(ellipse 25% 30% at ${x}% ${y}%, transparent 0%, transparent 50%, rgba(0,0,0,0.92) 80%)`
        }

        tunnelCheckbox.addEventListener('change', () => {
            if (tunnelCheckbox.checked) {
                overlay.classList.add('is-active')
                mouseCapture.classList.add('is-active')
            } else {
                overlay.classList.remove('is-active')
                mouseCapture.classList.remove('is-active')
            }
        })

            iframeWrap.addEventListener('mousemove', updateOverlayPosition)
        mouseCapture.addEventListener('mousemove', updateOverlayPosition)
    }

    const CB_FILTER_MATRICES = {
        protanopia:    '0.567 0.433 0     0 0  0.558 0.442 0     0 0  0     0.242 0.758 0 0  0 0 0 1 0',
        deuteranopia:  '0.625 0.375 0     0 0  0.7   0.3   0     0 0  0     0.3   0.7   0 0  0 0 0 1 0',
        tritanopia:    '0.95  0.05  0     0 0  0     0.433 0.567 0 0  0     0.475 0.525 0 0  0 0 0 1 0',
        achromatopsia: '0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0 0 0 1 0',
    }

    function hydrateColourBlindControls(el, simIframe, simPanel, controls) {
        const select = controls.querySelector('select')
        const widgetId = el.getAttribute('data-a11y-id') || ('cb-' + Date.now())
        const filterId = `cb-filter-${widgetId}`

        const svgNS = 'http://www.w3.org/2000/svg'
        const svg = document.createElementNS(svgNS, 'svg')
        svg.setAttribute('aria-hidden', 'true')
        svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none'
        const defs = document.createElementNS(svgNS, 'defs')
        const filter = document.createElementNS(svgNS, 'filter')
        filter.setAttribute('id', filterId)
        const feColorMatrix = document.createElementNS(svgNS, 'feColorMatrix')
        feColorMatrix.setAttribute('type', 'matrix')
        feColorMatrix.setAttribute('values', CB_FILTER_MATRICES.protanopia)
        filter.appendChild(feColorMatrix)
        defs.appendChild(filter)
        svg.appendChild(defs)
        simPanel.appendChild(svg)

        select.addEventListener('change', () => {
            const type = select.value
            if (!type || type === 'none') {
                simIframe.style.filter = ''
            } else {
                feColorMatrix.setAttribute('values', CB_FILTER_MATRICES[type] || CB_FILTER_MATRICES.protanopia)
                simIframe.style.filter = `url(#${filterId})`
            }
        })
    }

    const MOTOR_TARGET_CSS = `
        a, button, input, select, textarea, [role="button"], [tabindex] {
            outline: 3px solid #e74c3c !important;
            outline-offset: 1px !important;
        }

        .a11y-motor-hover-target {
            outline-color: #e74c3c !important;
            background-color: #ff08 !important;
            box-shadow: inset 0 0 0 4px #ff0c !important;
        }
    `

    function hydrateMotorImpairmentControls(el, simIframe, simPanel, controls, block, theme) {
        const checkboxes = Array.from(controls.querySelectorAll('input[type="checkbox"]'))
        const targetCheckbox = checkboxes[0]
        const shakyCheckbox = checkboxes[1]
        const iframeWrap = simPanel.querySelector('.accessibility-iframe-wrap')

        const buildSrcdoc = (highlight) => createIframeDocument(block.html, theme, highlight ? MOTOR_TARGET_CSS : '')
        simIframe.srcdoc = buildSrcdoc(true)

        targetCheckbox.addEventListener('change', () => {
            simIframe.srcdoc = buildSrcdoc(targetCheckbox.checked)
            hoveredTarget = null
        })

        const mouseCapture = document.createElement('div')
        mouseCapture.className = 'accessibility-motor-capture'
        iframeWrap.appendChild(mouseCapture)

        const cursor = document.createElement('div')
        cursor.className = 'accessibility-fake-cursor'
        cursor.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M4 3l16 10-7 1.5-3.5 6.5z" fill="white" stroke="black" stroke-width="1.5" stroke-linejoin="round"/></svg>'
        iframeWrap.appendChild(cursor)

        let cursorX = 0
        let cursorY = 0
        let rafId = null
        let phase = 0
        let isHovering = false
        let jumpX = 0
        let jumpY = 0
        let simulatedX = 0
        let simulatedY = 0
        let velocityX = 0
        let velocityY = 0
        let hoveredTarget = null
        const amplitude = 12
        const cursorHotspotX = 20
        const cursorHotspotY = 13

        const clearHoveredTarget = () => {
            if (!hoveredTarget) return
            hoveredTarget.classList.remove('a11y-motor-hover-target')
            hoveredTarget = null
        }

        const updateHoveredTarget = (simX, simY) => {
            if (!targetCheckbox.checked) {
                clearHoveredTarget()
                return
            }

            try {
                const wrapRect = iframeWrap.getBoundingClientRect()
                const iframeRect = simIframe.getBoundingClientRect()

                const relativeX = simX - (iframeRect.left - wrapRect.left)
                const relativeY = simY - (iframeRect.top - wrapRect.top)

                // Move into the iframe content viewport (exclude iframe border).
                const localX = relativeX - simIframe.clientLeft
                const localY = relativeY - simIframe.clientTop

                if (localX < 0 || localY < 0 || localX > simIframe.clientWidth || localY > simIframe.clientHeight) {
                    clearHoveredTarget()
                    return
                }

                const frameDoc = simIframe.contentDocument
                if (!frameDoc || !frameDoc.elementFromPoint) {
                    clearHoveredTarget()
                    return
                }

                const elAtPoint = frameDoc.elementFromPoint(localX, localY)
                const interactiveEl = elAtPoint
                    ? elAtPoint.closest('a, button, input, select, textarea, [role="button"], [tabindex]')
                    : null

                if (interactiveEl === hoveredTarget) return

                clearHoveredTarget()
                if (interactiveEl) {
                    hoveredTarget = interactiveEl
                    hoveredTarget.classList.add('a11y-motor-hover-target')
                }
            } catch (e) {
                clearHoveredTarget()
            }
        }

        const setShakyModeEnabled = (enabled) => {
            mouseCapture.classList.toggle('is-active', enabled)

            if (!enabled) {
                isHovering = false
                cursor.style.display = 'none'
                clearHoveredTarget()
                if (rafId) {
                    cancelAnimationFrame(rafId)
                    rafId = null
                }
            }
        }

        const animateCursor = () => {
            phase += 0.12

            if (Math.random() < 0.03) {
                jumpX = (Math.random() - 0.5) * 50
                jumpY = (Math.random() - 0.5) * 50
            }

            jumpX *= 0.5
            jumpY *= 0.5

            // Drift model: fake cursor chases the real cursor with lag + inertia.
            const chaseX = (cursorX - simulatedX) * 0.06
            const chaseY = (cursorY - simulatedY) * 0.06
            const weaveX = Math.sin(phase * 1.3) * amplitude + (Math.random() - 0.5) * amplitude * 0.3
            const weaveY = Math.cos(phase * 0.9) * amplitude * 0.6 + (Math.random() - 0.5) * amplitude * 0.3

            velocityX = (velocityX + chaseX + weaveX * 0.08 + jumpX * 0.15) * 0.88
            velocityY = (velocityY + chaseY + weaveY * 0.08 + jumpY * 0.15) * 0.88

            simulatedX += velocityX
            simulatedY += velocityY

            const wrapRect = iframeWrap.getBoundingClientRect()
            const minX = -8
            const minY = -8
            const maxX = wrapRect.width - 8
            const maxY = wrapRect.height - 8
            if (simulatedX < minX) {
                simulatedX = minX
                velocityX *= -0.25
            } else if (simulatedX > maxX) {
                simulatedX = maxX
                velocityX *= -0.25
            }

            if (simulatedY < minY) {
                simulatedY = minY
                velocityY *= -0.25
            } else if (simulatedY > maxY) {
                simulatedY = maxY
                velocityY *= -0.25
            }

            cursor.style.transform = `translate(${simulatedX}px, ${simulatedY}px)`
            updateHoveredTarget(simulatedX + cursorHotspotX, simulatedY + cursorHotspotY)
            rafId = requestAnimationFrame(animateCursor)
        }

        mouseCapture.addEventListener('mouseenter', () => {
            isHovering = true
            cursor.style.display = 'block'
            if (shakyCheckbox.checked) {
                if (rafId) cancelAnimationFrame(rafId)
                rafId = requestAnimationFrame(animateCursor)
            }
        })

        mouseCapture.addEventListener('mouseleave', () => {
            isHovering = false
            cursor.style.display = 'none'
            clearHoveredTarget()
            if (rafId) {
                cancelAnimationFrame(rafId)
                rafId = null
            }
        })

        mouseCapture.addEventListener('mousemove', (e) => {
            if (!isHovering) {
                isHovering = true
                cursor.style.display = 'block'
                if (shakyCheckbox.checked && !rafId) {
                    rafId = requestAnimationFrame(animateCursor)
                }
            }

            const rect = iframeWrap.getBoundingClientRect()
            cursorX = e.clientX - rect.left
            cursorY = e.clientY - rect.top
            if (!shakyCheckbox.checked) {
                simulatedX = cursorX
                simulatedY = cursorY
                velocityX = 0
                velocityY = 0
                cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`
                updateHoveredTarget(cursorX + cursorHotspotX, cursorY + cursorHotspotY)
            }
        })

        shakyCheckbox.addEventListener('change', () => {
            setShakyModeEnabled(shakyCheckbox.checked)

            if (shakyCheckbox.checked && isHovering) {
                simulatedX = cursorX
                simulatedY = cursorY
                velocityX = 0
                velocityY = 0
                if (rafId) cancelAnimationFrame(rafId)
                rafId = requestAnimationFrame(animateCursor)
            } else {
                updateHoveredTarget(cursorX + cursorHotspotX, cursorY + cursorHotspotY)
            }
        })

        setShakyModeEnabled(shakyCheckbox.checked)
    }

    function hydrateSimulationWidget(el, block, mode) {
        const headerEnabled = block.header !== false
        const theme = block.theme || 'blue'
        const srcdoc = createIframeDocument(block.html, theme)
        const modeMeta = getSimulationModeMeta(mode)
        const headerPanel = renderHeaderPanel(modeMeta.title, ACCESSIBILITY_CONFIG.ui.subtitle, headerEnabled)
        const layoutClass = 'accessibility-layout accessibility-layout--dual-preview'

        el.innerHTML = `
            <div class="accessibility-wrapper accessibility-wrapper--${escapeHtml(mode)}">
${headerPanel}

                <div class="${layoutClass}">
                    ${renderPrimaryPreviewPanel(srcdoc)}
                    ${renderSecondaryPreviewPanel(ACCESSIBILITY_CONFIG.ui.simulationTitle, srcdoc, modeMeta.modeClass, modeMeta.controls)}
                </div>
            </div>
        `

        const simIframe = el.querySelector('.accessibility-preview--simulated')
        const controls = el.querySelector('.accessibility-simulation-controls')
        const simPanel = el.querySelector('.accessibility-panel--secondary-preview')

        if (mode === 'low-vision') {
            hydrateLowVisionControls(simIframe, simPanel, controls)
        } else if (mode === 'colour-blind') {
            hydrateColourBlindControls(el, simIframe, simPanel, controls)
        } else if (mode === 'motor-impairment') {
            hydrateMotorImpairmentControls(el, simIframe, simPanel, controls, block, theme)
        }
    }

    function processAccessibilityWidgets() {
        const widgets = document.querySelectorAll('.markdown-section accessibility[data-a11y-id]:not(.accessibility-initialized)')

        widgets.forEach((el) => {
            const blockId = el.getAttribute('data-a11y-id') || ''
            const mode = parseModeAttribute(el.getAttribute('data-a11y-mode'), 'screen-reader')
            const block = pageBlocks[blockId]

            el.classList.add('accessibility-initialized')

            if (!block || !block.html) {
                el.innerHTML = `<div class="accessibility-error">${escapeHtml(ACCESSIBILITY_CONFIG.ui.missingInput)}</div>`
                return
            }

            if (!ACCESSIBILITY_SUPPORTED_MODES.has(mode)) {
                el.innerHTML = `<div class="accessibility-error">${escapeHtml(ACCESSIBILITY_CONFIG.ui.unsupportedMode)}</div>`
                return
            }

            if (mode === 'screen-reader') {
                hydrateScreenReaderWidget(el, block)
                return
            }

            hydrateSimulationWidget(el, block, mode)
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
                const mode = parseModeAttribute(attrs.mode, 'screen-reader')

                pageBlocks[blockId] = {
                    id: blockId,
                    mode,
                    audit: parseBooleanAttribute(attrs.audit, true),
                    header: parseBooleanAttribute(attrs.header, true),
                    theme: parseThemeAttribute(attrs.theme, 'blue'),
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
