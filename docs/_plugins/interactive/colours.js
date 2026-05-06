/**
 * docsify-colours.js - Interactive Colour Scheme Designer
 *
 * Interactive tool for exploring colour combinations and website design.
 * Select a primary colour and see:
 *   - Auto-generated complementary/contrasting accent colour
 *   - Lighter and darker shades of both colours
 *   - Live preview on a fake website mockup
 *
 * Usage in markdown:
 *   <colours></colours>
 *
 * The preview website uses only:
 *   - Black, white, and shades of grey
 *   - Primary colour and its shades
 *   - Accent colour for highlights and calls-to-action
 */

(function () {
    const { hexToRgb, rgbToHex } = window.DocsifyUtils

    const UI_TEXT = {
        title: 'Colour Scheme Designer',
        subtitle: 'Create harmonious colour palettes for websites',
        primaryLabel: 'Primary Colour',
        accentLabel: 'Accent Colour',
        shadesTitle: 'Colour Shades',
        previewTitle: 'Website Preview',
        lighterLabel: 'Lighter',
        darkerLabel: 'Darker',
        randomButton: 'Random Colour',
        copyHint: 'Click shade to copy',
        accentLinked: 'Auto-generated complementary',
        accentUnlinked: 'Custom accent colour',
        accentEnabled: 'Use accent colour',
        accentDisabled: 'Primary only',
        darkMode: 'Dark mode',
        lightMode: 'Light mode',
    }

    const SVG_ICONS = {
        palette: '<svg class="no-zoom" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-palette-icon lucide-palette"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/></svg>',
        random: '<svg class="no-zoom" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shuffle-icon lucide-shuffle"><path d="m18 14 4 4-4 4"/><path d="m18 2 4 4-4 4"/><path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22"/><path d="M2 6h1.972a4 4 0 0 1 3.6 2.2"/><path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45"/></svg>',
        moon: '<svg class="no-zoom" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon-icon lucide-moon"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>',
        sun: '<svg class="no-zoom" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun-icon lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
        crosshair: '<svg class="no-zoom" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-crosshair-icon lucide-crosshair"><circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="6" y2="2"/><line x1="12" x2="12" y1="22" y2="18"/></svg>',
        swap: '<svg class="no-zoom" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right-left-icon lucide-arrow-right-left"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>',
    }

    /**
     * Convert RGB to HSL colour space
     */
    function rgbToHsl(r, g, b) {
        r /= 255
        g /= 255
        b /= 255

        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        let h, s
        const l = (max + min) / 2

        if (max === min) {
            h = s = 0
        } else {
            const d = max - min
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

            switch (max) {
                case r:
                    h = ((g - b) / d + (g < b ? 6 : 0)) / 6
                    break
                case g:
                    h = ((b - r) / d + 2) / 6
                    break
                case b:
                    h = ((r - g) / d + 4) / 6
                    break
            }
        }

        return { h: h * 360, s: s * 100, l: l * 100 }
    }

    /**
     * Convert HSL to RGB colour space
     */
    function hslToRgb(h, s, l) {
        h /= 360
        s /= 100
        l /= 100

        let r, g, b

        if (s === 0) {
            r = g = b = l
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1
                if (t > 1) t -= 1
                if (t < 1 / 6) return p + (q - p) * 6 * t
                if (t < 1 / 2) return q
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
                return p
            }

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s
            const p = 2 * l - q

            r = hue2rgb(p, q, h + 1 / 3)
            g = hue2rgb(p, q, h)
            b = hue2rgb(p, q, h - 1 / 3)
        }

        return { r: r * 255, g: g * 255, b: b * 255 }
    }

    /**
     * Generate complementary (opposite on colour wheel) accent colour
     */
    function generateComplementaryColour(hex) {
        const rgb = hexToRgb(hex)
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)

        // Rotate hue by 180 degrees for complementary
        let newHue = (hsl.h + 180) % 360

        // Adjust saturation and lightness for better contrast
        let newSaturation = Math.min(100, hsl.s * 1.1)
        let newLightness = hsl.l > 50 ? hsl.l * 0.6 : hsl.l * 1.4
        newLightness = Math.max(30, Math.min(70, newLightness))

        const newRgb = hslToRgb(newHue, newSaturation, newLightness)
        return rgbToHex(newRgb.r, newRgb.g, newRgb.b)
    }

    /**
     * Generate lighter and darker shades of a colour
     */
    function generateShades(hex) {
        const rgb = hexToRgb(hex)
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)

        const shades = {
            base: hex,
            lighter: [],
            darker: []
        }

        // Generate 3 lighter shades
        const maxLightness = 95 // Maximum to avoid pure white

        // If the base colour is already too light, lighter shades should just be the base colour
        if (hsl.l >= maxLightness) {
            for (let i = 0; i < 3; i++) {
                shades.lighter.push(hex)
            }
        } else {
            for (let i = 1; i <= 3; i++) {
                const lightness = Math.min(maxLightness, hsl.l + (i * 15))
                const newRgb = hslToRgb(hsl.h, hsl.s * 0.9, lightness)
                shades.lighter.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
            }
        }

        // Generate 3 darker shades with better distribution
        // Use smaller, non-linear steps to avoid bunching up at black
        const darkerSteps = [0.3, 0.55, 0.75] // Proportional steps
        const minLightness = 12 // Higher minimum to avoid near-black colours

        // If the base colour is already too dark, darker shades should just be the base colour
        if (hsl.l <= minLightness) {
            for (let i = 0; i < 3; i++) {
                shades.darker.push(hex)
            }
        } else {
            for (let i = 0; i < 3; i++) {
                const availableRange = hsl.l - minLightness
                const reduction = availableRange * darkerSteps[i]
                const lightness = Math.max(minLightness, hsl.l - reduction)
                const newRgb = hslToRgb(hsl.h, Math.min(100, hsl.s * 1.1), lightness)
                shades.darker.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
            }
        }

        return shades
    }

    /**
     * Calculate relative luminance for contrast checking
     */
    function getLuminance(hex) {
        const rgb = hexToRgb(hex)
        const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
            val /= 255
            return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
        })
        return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    /**
     * Get contrast ratio between two colours
     */
    function getContrastRatio(hex1, hex2) {
        const lum1 = getLuminance(hex1)
        const lum2 = getLuminance(hex2)
        const lighter = Math.max(lum1, lum2)
        const darker = Math.min(lum1, lum2)
        return (lighter + 0.05) / (darker + 0.05)
    }

    /**
     * Determine if text should be light or dark on given background
     */
    function getTextColourForBackground(bgHex) {
        const whiteContrast = getContrastRatio(bgHex, '#ffffff')
        const blackContrast = getContrastRatio(bgHex, '#000000')
        return whiteContrast > blackContrast ? '#ffffff' : '#000000'
    }

    /**
     * Generate a random appealing colour
     */
    function generateRandomColour() {
        // Generate colours with good saturation and medium lightness
        const hue = Math.floor(Math.random() * 360)
        const saturation = 60 + Math.floor(Math.random() * 30) // 60-90%
        const lightness = 45 + Math.floor(Math.random() * 20) // 45-65%

        const rgb = hslToRgb(hue, saturation, lightness)
        return rgbToHex(rgb.r, rgb.g, rgb.b)
    }

    /**
     * Copy text to clipboard
     */
    async function copyToClipboard(text, icon) {
        try {
            await navigator.clipboard.writeText(text)
            icon.classList.add('btn-check')
            setTimeout(() => {
                icon.classList.remove('btn-check')
            }, 1500)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    /**
     * Normalize color to uppercase hex format
     */
    function normalizeColor(color) {
        // If already hex, return uppercase
        if (color.startsWith('#')) {
            return color.toUpperCase()
        }
        // If rgb format, convert to hex
        const rgb = color.match(/\d+/g)
        if (rgb && rgb.length >= 3) {
            const r = parseInt(rgb[0])
            const g = parseInt(rgb[1])
            const b = parseInt(rgb[2])
            return rgbToHex(r, g, b).toUpperCase()
        }
        return color
    }

    class ColourPickerVisualizer {
        constructor(element) {
            this.element = element
            this.primaryColour = '#1c71d8'
            this.accentColour = generateComplementaryColour(this.primaryColour)
            this.accentLinked = true
            this.accentEnabled = true
            this.darkMode = false
            this.init()
        }

        init() {
            this.render()
            this.attachEventListeners()
        }

        updateColours(newPrimary) {
            this.primaryColour = newPrimary
            if (this.accentLinked) {
                this.accentColour = generateComplementaryColour(newPrimary)
            }
            this.rerender()
        }

        updateAccent(newAccent) {
            this.accentColour = newAccent
            this.rerender()
        }

        toggleAccentLink() {
            this.accentLinked = !this.accentLinked
            if (this.accentLinked) {
                this.accentColour = generateComplementaryColour(this.primaryColour)
            }
            this.rerender()
        }

        toggleAccentEnabled() {
            this.accentEnabled = !this.accentEnabled
            this.rerender()
        }

        toggleDarkMode() {
            this.darkMode = !this.darkMode
            this.rerender()
        }

        swapColours() {
            const temp = this.primaryColour
            this.primaryColour = this.accentColour
            this.accentColour = temp
            this.rerender()
        }

        rerender() {
            const wrapper = this.query('.cp-wrapper')
            if (wrapper) {
                const scrollTop = wrapper.scrollTop

                // Save focus state before destroying DOM
                let focusedInputId = null
                let cursorPos = 0
                const activeElement = document.activeElement

                if (activeElement && activeElement.classList.contains('cp-hex-input')) {
                    focusedInputId = activeElement.id
                    cursorPos = activeElement.selectionStart
                }

                this.element.innerHTML = ''
                this.render()
                this.attachEventListeners()

                const newWrapper = this.query('.cp-wrapper')
                if (newWrapper) {
                    newWrapper.scrollTop = scrollTop
                }

                // Restore focus if we had a focused hex input
                if (focusedInputId) {
                    const targetInput = this.query(`#${focusedInputId}`)
                    if (targetInput) {
                        targetInput.focus()
                        targetInput.setSelectionRange(cursorPos, cursorPos)
                    }
                }
            }
        }

        render() {
            const wrapper = document.createElement('div')
            wrapper.className = 'cp-wrapper'

            // Header
            const header = this.renderHeader()
            wrapper.appendChild(header)

            // Content container
            const content = document.createElement('div')
            content.className = 'cp-content'

            // Colour picker section
            const pickerSection = this.renderColourPicker()
            content.appendChild(pickerSection)

            // Shades section
            const shadesSection = this.renderShades()
            content.appendChild(shadesSection)

            // Preview section
            const previewSection = this.renderPreview()
            content.appendChild(previewSection)

            wrapper.appendChild(content)
            this.element.appendChild(wrapper)
        }

        renderHeader() {
            const header = document.createElement('div')
            header.className = 'cp-header'

            header.innerHTML = `
                <div class="cp-header-text">
                    <h3 class="cp-title">${SVG_ICONS.palette} ${UI_TEXT.title}</h3>
                    <p class="cp-subtitle">${UI_TEXT.subtitle}</p>
                </div>
            `

            return header
        }

        renderColourPicker() {
            const section = document.createElement('div')
            section.className = 'cp-picker-section'

            section.innerHTML = `
                <div class="cp-colour-controls">
                    <div class="cp-colour-group">
                        <label class="cp-label">${UI_TEXT.primaryLabel}</label>
                        <div class="cp-colour-combined-input">
                            <input type="color" class="cp-colour-swatch" id="cp-primary-input" value="${this.primaryColour}">
                            <input type="text" class="cp-hex-input" id="cp-primary-hex" value="${this.primaryColour}" maxlength="7" placeholder="#000000">
                            <button class="cp-btn cp-btn-icon btn-shuffle" id="cp-random-btn" title="${UI_TEXT.randomButton}"></button>
                            <button class="cp-btn cp-btn-icon btn-swap" id="cp-swap-btn" title="Swap primary and accent" ${!this.accentEnabled ? 'disabled' : ''}></button>
                        </div>
                    </div>

                    <div class="cp-colour-group">
                        <label class="cp-label">${UI_TEXT.accentLabel}</label>
                        <div class="cp-accent-controls">
                            <button class="cp-toggle-btn btn-check ${this.accentEnabled ? 'active' : ''}" id="cp-accent-toggle"></button>
                            <button class="cp-toggle-btn ${this.accentLinked ? 'active' : ''}" id="cp-accent-link-btn" ${!this.accentEnabled ? 'disabled' : ''}>
                                <span class="cp-link-icon ${this.accentLinked ? 'btn-link' : 'btn-unlink'}"></span>
                            </button>
                            <div class="cp-colour-combined-input ${this.accentLinked && this.accentEnabled ? 'cp-linked' : ''}">
                                <input type="color" class="cp-colour-swatch" id="cp-accent-input" value="${this.accentColour}" ${this.accentLinked || !this.accentEnabled ? 'disabled' : ''}>
                                <input type="text" class="cp-hex-input" id="cp-accent-hex" value="${this.accentColour}" maxlength="7" placeholder="#000000" ${!this.accentEnabled ? 'disabled' : ''} ${this.accentLinked ? 'readonly' : ''}>
                            </div>
                        </div>
                    </div>
                </div>
            `

            return section
        }

        renderShades() {
            const section = document.createElement('div')
            section.className = 'cp-shades-section'

            const primaryShades = generateShades(this.primaryColour)
            const accentShades = this.accentEnabled ? generateShades(this.accentColour) : null

            section.innerHTML = `
                <div class="cp-shades-grid">
                    ${this.renderShadeColumn('Primary Shades', this.primaryColour, primaryShades, false)}
                    ${this.accentEnabled ? this.renderShadeColumn('Accent Shades', this.accentColour, accentShades, true) : ''}
                </div>
            `

            return section
        }

        renderShadeColumn(label, baseColour, shades, isAccent = false) {
            const renderShade = (colour, label) => {
                const textColour = getTextColourForBackground(colour)
                return `
                    <div class="cp-shade" style="background-color: ${colour}; color: ${textColour}">
                        <span class="cp-shade-label">${label}</span>
                        <span class="cp-shade-hex">${colour}</span>
                        <span class="cp-copy-icon btn-copy" data-colour="${colour}"></span>
                        <span class="cp-set-primary-icon" data-colour="${colour}" data-is-accent="${isAccent}">
                            ${SVG_ICONS.crosshair}
                        </span>
                    </div>
                `
            }

            // For accent, only show 1 lighter and 1 darker
            const lighterShades = isAccent ? [shades.lighter[0]] : shades.lighter
            const darkerShades = isAccent ? [shades.darker[1]] : shades.darker

            return `
                <div class="cp-shade-column">
                    <div class="cp-shade-column-label">${label}</div>
                    <div class="cp-shade-strip">
                        ${lighterShades.reverse().map((colour, i) => renderShade(colour, isAccent ? `${UI_TEXT.lighterLabel}` : `${UI_TEXT.lighterLabel} ${lighterShades.length-i}`)).join('')}
                        ${renderShade(baseColour, 'Base')}
                        ${darkerShades.map((colour, i) => renderShade(colour, isAccent ? `${UI_TEXT.darkerLabel}` : `${UI_TEXT.darkerLabel} ${i+1}`)).join('')}
                    </div>
                </div>
            `
        }

        renderPreview() {
            const section = document.createElement('div')
            section.className = 'cp-preview-section'

            const primaryShades = generateShades(this.primaryColour)
            const accentShades = this.accentEnabled ? generateShades(this.accentColour) : null

            // Dark mode: use darker shades for backgrounds, lighter for accents
            // Light mode: use lighter shades for backgrounds, darker for accents
            let headerBg, navBg, heroBg, heroBg2, contentBg, cardBg, cardBorder, footerBg
            let buttonBg, badgeColour, linkColour, cardHeadingColour
            let textOnContent, textOnCard

            if (this.darkMode) {
                // Dark mode backgrounds
                headerBg = primaryShades.darker[2]
                navBg = primaryShades.darker[1]
                heroBg = primaryShades.darker[0]
                heroBg2 = this.primaryColour
                contentBg = '#1a1a1a'
                cardBg = '#2a2a2a'
                cardBorder = primaryShades.darker[1]
                footerBg = primaryShades.darker[2]

                // Text colors for dark mode
                textOnContent = '#e0e0e0'
                textOnCard = '#e0e0e0'
                cardHeadingColour = primaryShades.lighter[1]

                // Use accent or primary lighter for interactive elements
                if (this.accentEnabled) {
                    buttonBg = this.accentColour
                    badgeColour = this.accentColour
                    linkColour = accentShades.lighter[0]
                } else {
                    buttonBg = primaryShades.lighter[0]
                    badgeColour = primaryShades.lighter[1]
                    linkColour = primaryShades.lighter[0]
                }
            } else {
                // Light mode backgrounds
                headerBg = primaryShades.darker[2]
                navBg = primaryShades.darker[1]
                heroBg = primaryShades.lighter[1]
                heroBg2 = primaryShades.lighter[0]
                contentBg = '#f0f0f0'
                cardBg = '#ffffff'
                cardBorder = primaryShades.lighter[1]
                footerBg = primaryShades.darker[2]

                // Text colors for light mode
                textOnContent = '#1a1a1a'
                textOnCard = '#1a1a1a'
                cardHeadingColour = primaryShades.darker[1]

                // Use accent or primary darker for interactive elements
                if (this.accentEnabled) {
                    buttonBg = this.accentColour
                    badgeColour = this.accentColour
                    linkColour = accentShades.darker[1]
                } else {
                    buttonBg = this.primaryColour
                    badgeColour = primaryShades.darker[0]
                    linkColour = primaryShades.darker[0]
                }
            }

            section.innerHTML = `
                <div class="cp-section-header">
                    <h4 class="cp-section-title">${UI_TEXT.previewTitle}</h4>
                    <button class="cp-toggle-btn" id="cp-dark-mode-btn">
                        ${this.darkMode ? SVG_ICONS.moon : SVG_ICONS.sun}
                        <span>${this.darkMode ? UI_TEXT.darkMode : UI_TEXT.lightMode}</span>
                    </button>
                </div>
                <div class="cp-preview-container">
                    <div class="cp-website-mockup" style="background-color: ${contentBg};">
                        <!-- Header -->
                        <div class="cp-mockup-header cp-color-preview" style="background-color: ${headerBg};" data-color-source="${headerBg}">
                            <div class="cp-mockup-logo" style="color: ${getTextColourForBackground(headerBg)};">
                                GameDev Studio
                            </div>
                            <div class="cp-mockup-nav cp-color-preview" style="background-color: ${navBg};" data-color-source="${navBg}">
                                <span style="color: ${getTextColourForBackground(navBg)};">Home</span>
                                <span style="color: ${getTextColourForBackground(navBg)};">Projects</span>
                                <span style="color: ${getTextColourForBackground(navBg)};">About</span>
                                <span style="color: ${getTextColourForBackground(navBg)};">Contact</span>
                            </div>
                        </div>

                        <!-- Hero section -->
                        <div class="cp-mockup-hero cp-color-preview" style="background: linear-gradient(135deg, ${heroBg} 0%, ${heroBg2} 100%);" data-color-source="${heroBg}">
                            <h1 style="color: ${getTextColourForBackground(heroBg)};">Build Epic Games</h1>
                            <p style="color: ${getTextColourForBackground(heroBg)};">Create immersive worlds with our powerful game engine</p>
                            <button class="cp-mockup-btn cp-color-preview" style="background-color: ${buttonBg}; color: ${getTextColourForBackground(buttonBg)};" data-color-source="${buttonBg}">
                                Start Creating
                            </button>
                        </div>

                        <!-- Content area -->
                        <div class="cp-mockup-content" style="background-color: ${contentBg};">
                            <div class="cp-mockup-card" style="background-color: ${cardBg}; border-color: ${cardBorder}; color: ${textOnCard};">
                                <div class="cp-mockup-card-badge cp-color-preview" style="background-color: ${badgeColour}; color: ${getTextColourForBackground(badgeColour)};" data-color-source="${badgeColour}">
                                    NEW
                                </div>
                                <h3 class="cp-color-preview" style="color: ${cardHeadingColour};" data-color-source="${cardHeadingColour}">Physics Engine 2.0</h3>
                                <p>Realistic physics simulation with improved performance and accuracy.</p>
                                <span class="cp-color-preview" style="color: ${linkColour}; cursor: pointer; text-decoration: underline;" data-color-source="${linkColour}">Learn more →</span>
                            </div>

                            <div class="cp-mockup-card" style="background-color: ${cardBg}; border-color: ${cardBorder}; color: ${textOnCard};">
                                <div class="cp-mockup-card-badge cp-color-preview" style="background-color: ${badgeColour}; color: ${getTextColourForBackground(badgeColour)};" data-color-source="${badgeColour}">
                                    POPULAR
                                </div>
                                <h3 class="cp-color-preview" style="color: ${cardHeadingColour};" data-color-source="${cardHeadingColour}">Visual Scripting</h3>
                                <p>Build game logic without writing code using intuitive node-based editor.</p>
                                <span class="cp-color-preview" style="color: ${linkColour}; cursor: pointer; text-decoration: underline;" data-color-source="${linkColour}">Learn more →</span>
                            </div>

                            <div class="cp-mockup-card" style="background-color: ${cardBg}; border-color: ${cardBorder}; color: ${textOnCard};">
                                <h3 class="cp-color-preview" style="color: ${cardHeadingColour};" data-color-source="${cardHeadingColour}">Asset Marketplace</h3>
                                <p>Thousands of ready-to-use 3D models, textures, and sound effects.</p>
                                <span class="cp-color-preview" style="color: ${linkColour}; cursor: pointer; text-decoration: underline;" data-color-source="${linkColour}">Learn more →</span>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div class="cp-mockup-footer cp-color-preview" style="background-color: ${footerBg}; color: ${getTextColourForBackground(footerBg)};" data-color-source="${footerBg}">                            <div class="cp-mockup-footer-section">
                                <strong>Resources</strong>
                                <span>Documentation</span>
                                <span>Tutorials</span>
                                <span>Community</span>
                            </div>
                            <div class="cp-mockup-footer-section">
                                <strong>Company</strong>
                                <span>About Us</span>
                                <span>Careers</span>
                                <span>Contact</span>
                            </div>
                            <div class="cp-mockup-footer-section">
                                <strong>Legal</strong>
                                <span>Privacy Policy</span>
                                <span>Terms of Service</span>
                            </div>
                        </div>
                    </div>
                </div>
            `

            return section
        }

        // Helper methods for DOM queries
        query(selector) {
            return this.element.querySelector(selector)
        }

        queryAll(selector) {
            return this.element.querySelectorAll(selector)
        }

        // Setup hex input with paste, input, and blur handlers
        setupHexInputHandlers(hexInput, colorInput, updateCallback, getCurrentColor) {
            if (!hexInput) return

            // Handle paste events - accept both #RRGGBB and RRGGBB
            hexInput.addEventListener('paste', (e) => {
                e.preventDefault()
                let pastedText = (e.clipboardData || window.clipboardData).getData('text').trim()

                // Add # if not present
                if (!pastedText.startsWith('#')) {
                    pastedText = '#' + pastedText
                }

                // Validate and update
                if (/^#[0-9A-Fa-f]{6}$/.test(pastedText)) {
                    const upperHex = pastedText.toUpperCase()
                    e.target.value = upperHex
                    if (colorInput) colorInput.value = upperHex
                    updateCallback(upperHex)
                }
            })

            // Handle input - ensure # stays at start, update live when valid
            hexInput.addEventListener('input', (e) => {
                let value = e.target.value

                // Always ensure it starts with #
                if (!value.startsWith('#')) {
                    value = '#' + value.replace(/^#+/, '')
                }

                // Only allow valid hex characters after #
                const hexPart = value.slice(1).toUpperCase().replace(/[^0-9A-F]/g, '')
                value = '#' + hexPart

                // Update input if we had to clean it
                if (value !== e.target.value) {
                    const cursorPos = e.target.selectionStart
                    e.target.value = value
                    // Restore cursor position, but not before the #
                    e.target.setSelectionRange(Math.max(1, cursorPos), Math.max(1, cursorPos))
                }

                // Update color if we have 6 valid hex characters
                if (/^#[0-9A-F]{6}$/.test(value)) {
                    if (colorInput) colorInput.value = value
                    updateCallback(value)
                }
            })

            // Validate on blur
            hexInput.addEventListener('blur', (e) => {
                const hex = e.target.value.trim()
                if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
                    e.target.value = getCurrentColor()
                    if (colorInput) colorInput.value = getCurrentColor()
                }
            })
        }

        attachEventListeners() {
            // Primary colour inputs
            const primaryColourInput = this.query('#cp-primary-input')
            const primaryHexInput = this.query('#cp-primary-hex')

            if (primaryColourInput) {
                primaryColourInput.addEventListener('input', (e) => {
                    this.updateColours(e.target.value)
                    if (primaryHexInput) primaryHexInput.value = e.target.value
                })
            }

            // Setup hex input handlers for primary colour
            this.setupHexInputHandlers(
                primaryHexInput,
                primaryColourInput,
                (hex) => this.updateColours(hex),
                () => this.primaryColour
            )

            // Accent colour inputs (if not linked)
            const accentColourInput = this.query('#cp-accent-input')
            const accentHexInput = this.query('#cp-accent-hex')

            if (accentColourInput && !this.accentLinked) {
                accentColourInput.addEventListener('input', (e) => {
                    this.updateAccent(e.target.value)
                    if (accentHexInput) accentHexInput.value = e.target.value
                })
            }

            // Setup hex input handlers for accent colour (only if not linked)
            if (!this.accentLinked) {
                this.setupHexInputHandlers(
                    accentHexInput,
                    accentColourInput,
                    (hex) => this.updateAccent(hex),
                    () => this.accentColour
                )
            }

            // Random button
            const randomBtn = this.query('#cp-random-btn')
            if (randomBtn) {
                randomBtn.addEventListener('click', () => {
                    const randomColour = generateRandomColour()
                    this.updateColours(randomColour)
                })
            }

            // Accent link toggle
            const accentLinkBtn = this.query('#cp-accent-link-btn')
            if (accentLinkBtn) {
                accentLinkBtn.addEventListener('click', () => {
                    this.toggleAccentLink()
                })
            }

            // Accent enable toggle
            const accentToggleBtn = this.query('#cp-accent-toggle')
            if (accentToggleBtn) {
                accentToggleBtn.addEventListener('click', () => {
                    this.toggleAccentEnabled()
                })
            }

            // Dark mode toggle
            const darkModeBtn = this.query('#cp-dark-mode-btn')
            if (darkModeBtn) {
                darkModeBtn.addEventListener('click', () => {
                    this.toggleDarkMode()
                })
            }

            // Swap colours button
            const swapBtn = this.query('#cp-swap-btn')
            if (swapBtn) {
                swapBtn.addEventListener('click', () => {
                    this.swapColours()
                })
            }

            // Make shades clickable for copying and setting as primary
            const shades = this.queryAll('.cp-shade')
            shades.forEach(shade => {
                const copyIcon = shade.querySelector('.cp-copy-icon')
                const setPrimaryIcon = shade.querySelector('.cp-set-primary-icon')
                const colour = copyIcon ? copyIcon.dataset.colour : null

                if (!colour) return

                // Copy to clipboard when clicking copy icon
                if (copyIcon) {
                    copyIcon.addEventListener('click', (e) => {
                        e.stopPropagation()
                        copyToClipboard(colour, copyIcon)
                    })
                }

                // Set as primary/accent color when clicking crosshair icon
                if (setPrimaryIcon) {
                    setPrimaryIcon.addEventListener('click', (e) => {
                        e.stopPropagation()
                        const isAccent = setPrimaryIcon.dataset.isAccent === 'true'

                        if (isAccent) {
                            // Set as accent color and unlink if currently linked
                            if (this.accentLinked) {
                                this.accentLinked = false
                            }
                            this.updateAccent(colour)
                        } else {
                            // Set as primary color
                            this.updateColours(colour)
                        }
                    })
                }

                // Default: copy to clipboard when clicking shade
                shade.style.cursor = 'pointer'
                shade.addEventListener('click', () => {
                    if (copyIcon) {
                        copyToClipboard(colour, copyIcon)
                    }
                })
            })

            // Color preview hover effect - highlight corresponding shades
            // Use mouseover/mouseout (which bubble) to handle nested elements properly
            const previewContainer = this.query('.cp-preview-container')
            let currentHighlightedColor = null

            if (previewContainer) {
                previewContainer.addEventListener('mouseover', (e) => {
                    // Find the closest .cp-color-preview element (handles nested elements)
                    const previewEl = e.target.closest('.cp-color-preview')
                    if (!previewEl) return

                    const colorSource = previewEl.dataset.colorSource
                    if (!colorSource) return

                    // Only update if we're hovering a different color
                    if (colorSource === currentHighlightedColor) return
                    currentHighlightedColor = colorSource

                    // Clear all previous highlights first
                    const allShades = this.queryAll('.cp-shade')
                    allShades.forEach(shade => {
                        shade.classList.remove('cp-shade-highlighted')
                    })

                    // Find first shade that matches this color and highlight it
                    for (const shade of allShades) {
                        const shadeColor = shade.style.backgroundColor
                        // Normalize colors for comparison
                        if (shadeColor && this.colorsMatch(shadeColor, colorSource)) {
                            shade.classList.add('cp-shade-highlighted')
                            break // Only highlight the first match
                        }
                    }
                })

                previewContainer.addEventListener('mouseout', (e) => {
                    // Only clear if we're actually leaving the preview container
                    const relatedTarget = e.relatedTarget
                    if (!relatedTarget || !previewContainer.contains(relatedTarget)) {
                        currentHighlightedColor = null
                        const allShades = this.queryAll('.cp-shade')
                        allShades.forEach(shade => {
                            shade.classList.remove('cp-shade-highlighted')
                        })
                    }
                })
            }
        }

        colorsMatch(color1, color2) {
            return normalizeColor(color1) === normalizeColor(color2)
        }
    }

    function colourPickerPlugin(hook, vm) {
        hook.afterEach(function (html, next) {
            next(html)
        })

        hook.doneEach(function () {
            const elements = document.querySelectorAll('colours')
            elements.forEach(element => {
                if (!element.dataset.initialized) {
                    new ColourPickerVisualizer(element)
                    element.dataset.initialized = 'true'
                }
            })
        })
    }

    if (window.$docsify) {
    window.DocsifyUtils.registerPlugin(colourPickerPlugin)
})()
