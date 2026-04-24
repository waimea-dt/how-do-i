/**
 * docsify-p-np.js - P, NP, NP-Complete, and NP-Hard Complexity Class Visualizer
 *
 * Interactive visualization demonstrating:
 *   - P (Polynomial Time): Problems solvable efficiently
 *   - NP (Nondeterministic Polynomial): Solutions verifiable efficiently
 *   - NP-Complete: Hardest problems in NP
 *   - NP-Hard: At least as hard as NP-Complete (may be outside NP)
 *   - Verification vs Solving time comparison
 *   - Real-world problem examples in each category
 *
 * Usage in markdown:
 *   <p-np></p-np>
 *   <p-np markers></p-np>
 *   <p-np collapse></p-np>
 *   <p-np collapse markers></p-np>
 *   <p-np mode="venn"></p-np>
 *   <p-np mode="verify"></p-np>
 *   <p-np mode="problems"></p-np>
 *
 * Attributes:
 *   - mode: Visualization mode (default: venn)
 *     - venn: Venn diagram showing P ⊆ NP with NP-Complete boundary
 *     - verify: Verification vs solving comparison for specific problems
 *     - problems: Interactive problem cards to explore examples
 *   - collapse: Show P=NP collapsed view when attribute is present
 *   - markers: Show hoverable problem markers when attribute is present
 */

(function () {
    let colorProbeContext = null

    function resolveCssVarColor(element, styles, varName, fallback) {
        const raw = styles.getPropertyValue(varName).trim() || fallback
        const probe = document.createElement('span')
        probe.style.color = fallback
        probe.style.color = raw
        element.appendChild(probe)
        const resolved = getComputedStyle(probe).color || fallback
        probe.remove()
        return resolved
    }

    function withAlpha(color, alpha) {
        const clamped = Math.max(0, Math.min(1, alpha))

        if (!colorProbeContext) {
            const probeCanvas = document.createElement('canvas')
            probeCanvas.width = 1
            probeCanvas.height = 1
            colorProbeContext = probeCanvas.getContext('2d')
        }

        if (!colorProbeContext) {
            return color
        }

        colorProbeContext.clearRect(0, 0, 1, 1)
        colorProbeContext.fillStyle = 'rgba(0, 0, 0, 0)'
        colorProbeContext.fillRect(0, 0, 1, 1)
        colorProbeContext.fillStyle = color
        colorProbeContext.fillRect(0, 0, 1, 1)

        const [r, g, b, a] = colorProbeContext.getImageData(0, 0, 1, 1).data
        const combinedAlpha = Math.max(0, Math.min(1, (a / 255) * clamped))
        return `rgba(${r}, ${g}, ${b}, ${combinedAlpha})`
    }

    const UI_TEXT = {
        title: 'P, NP, NP-Complete, and NP-Hard',
        subtitleByMode: {
            venn: 'Complexity classes visualization',
            verify: 'Verification vs Solving times',
            problems: 'Problem examples by complexity class'
        },
        toggle: {
            standard: 'Show P = NP (collapsed view)',
            collapsed: 'Show P ≠ NP (standard view)'
        },
        verify: {
            selectLabel: 'Select problem:'
        }
    }

    const PROBLEMS = {
        p: {
            shortName: "P",
            fullName: "P - Polynomial Time",
            class: "p",
            description: "<strong>Easy to solve</strong>, and part of NP, so <strong>easy to verify</strong>",
            tabLabel: 'P Problems',
            tabOrder: 1,
            legendOrder: 2,
            defaultProblemId: 'linear-search',
            verify: {
                solvingClass: 'pnp-solving-poly',
                solvingNote: '✓ <strong>Polynomial time</strong> solution - easy for large n',
                verifyClass: 'pnp-verify-poly',
                verifyNote: '✓ <strong>Polynomial time</strong> verification - always fast'
            },
            problems: [
                {
                    id: 'linear-search',
                    name: 'Linear Search',
                    description: 'Scan list of n items from start until target is found',
                    solveTime: 'O(n)',
                    verifyTime: 'O(1)',
                    example: 'Finding a name in an unsorted list',
                    icon: '🔎',
                    marker: {
                        standard: { x: 185, y: 465 },
                        collapse: { x: 95, y: 410 }
                    }
                },
                {
                    id: 'binary-search',
                    name: 'Binary Search',
                    description: 'Find an item in a sorted list of n items',
                    solveTime: 'O(log n)',
                    verifyTime: 'O(1)',
                    example: 'Searching in phone book',
                    icon: '🔍',
                    marker: {
                        standard: { x: 250, y: 430 },
                        collapse: { x: 115, y: 485 }
                    }
                },
                {
                    id: 'sorting',
                    name: 'Sorting',
                    description: 'Sort a list of n items',
                    solveTime: 'O(n log n)',
                    verifyTime: 'O(n)',
                    example: 'Merge Sort, Quick Sort',
                    icon: '↕️',
                    marker: {
                        standard: { x: 315, y: 465 },
                        collapse: { x: 385, y: 485 }
                    }
                },
                {
                    id: 'palindrome',
                    name: 'Palindrome Check',
                    description: 'Check if string of length n reads same forwards and backwards',
                    solveTime: 'O(n)',
                    verifyTime: 'O(n)',
                    example: 'racecar, level',
                    icon: '↔️',
                    marker: {
                        standard: { x: 185, y: 535 },
                        collapse: { x: 175, y: 535 }
                    }
                },
                {
                    id: 'shortest-path',
                    name: 'Shortest Path',
                    description: 'Find shortest route between two nodes in a graph of n nodes',
                    solveTime: 'O(n²)',
                    verifyTime: 'O(n)',
                    example: 'Dijkstra\'s Algorithm',
                    icon: '🗺️',
                    marker: {
                        standard: { x: 250, y: 570 },
                        collapse: { x: 250, y: 555 }
                    }
                },
                {
                    id: 'matrix-mult',
                    name: 'Matrix Multiplication',
                    description: 'Multiply two n×n matrices',
                    solveTime: 'O(n³)',
                    verifyTime: 'O(n²)',
                    example: 'Graphics transformations',
                    icon: '⊗',
                    marker: {
                        standard: { x: 315, y: 535 },
                        collapse: { x: 325, y: 535 }
                    }
                },
            ],
        },
        np: {
            shortName: "NP",
            fullName: "NP - Non-deterministic Polynomial Time",
            class: "np",
            description: "<strong>Easy to verify</strong>",
            tabLabel: 'NP Problems',
            tabOrder: 2,
            legendOrder: 1,
            verify: {
                solvingClass: 'pnp-solving-unknown',
                solvingNote: '⚠ <strong>No known polynomial time</strong> solution',
                verifyClass: 'pnp-verify-poly',
                verifyNote: '✓ <strong>Polynomial time</strong> verification - always fast'
            },
            problems: [
                {
                    id: 'factoring',
                    name: 'Factorisation by Division',
                    description: 'Use division to find a non-trivial factor of number value n',
                    solveTime: 'O(√n)',
                    verifyTime: 'O(log n)',
                    example: 'Try 2, 3, 4... until a divisor is found',
                    icon: '🔢',
                    marker: {
                        standard: { x: 415, y: 380 },
                        collapse: { x: 405, y: 410 }
                    }
                }
            ],
        },
        npc: {
            shortName: "NP-Complete",
            fullName: "NP-Complete - Hardest problems in NP",
            class: "npc",
            description: "<strong>Hard to solve</strong>, but part of NP, so <strong>easy to verify</strong>",
            tabLabel: 'NP-Complete',
            tabOrder: 3,
            legendOrder: 3,
            verify: {
                solvingClass: 'pnp-solving-exp',
                solvingNote: '⏰ <strong>Exponential time</strong> solution - intractable for large n',
                verifyClass: 'pnp-verify-poly',
                verifyNote: '✓ <strong>Polynomial time</strong> verification - always fast'
            },
            problems: [
                {
                    id: 'knapsack',
                    name: '0/1 Knapsack',
                    description: 'Select out of n items to maximize value within a limit',
                    solveTime: 'O(2ⁿ)',
                    verifyTime: 'O(n)',
                    example: 'Cargo loading',
                    icon: '🎒',
                    marker: {
                        standard: { x: 210, y: 205 },
                        collapse: { x: 210, y: 205 }
                    }
                },
                {
                    id: 'bin-packing',
                    name: 'Bin Packing',
                    description: 'Pack n items into minimum number of bins',
                    solveTime: 'O(2ⁿ)',
                    verifyTime: 'O(n)',
                    example: 'Shipping container allocation',
                    icon: '📦',
                    marker: {
                        standard: { x: 290, y: 205 },
                        collapse: { x: 290, y: 205 }
                    }
                },
                {
                    id: 'graph-colouring',
                    name: 'Graph Colouring',
                    description: 'Colour graph of n nodes so adjacent nodes differ',
                    solveTime: 'O(kⁿ)',
                    verifyTime: 'O(n²)',
                    example: 'Timetable scheduling',
                    icon: '🎨',
                    marker: {
                        standard: { x: 250, y: 315 },
                        collapse: { x: 250, y: 315 }
                    }
                },
            ],
        },
        nph: {
            shortName: "NP-Hard",
            fullName: "NP-Hard - Hard problems",
            class: "nph",
            description: "<strong>Hard to solve</strong> and <strong>if outside of NP, hard to verify</strong>",
            tabLabel: 'NP-Hard',
            tabOrder: 4,
            legendOrder: 4,
            verify: {
                solvingClass: 'pnp-solving-exp',
                solvingNote: '⏰ <strong>Exponential time</strong> solution - intractable for large n',
                verifyClass: 'pnp-verify-exp',
                verifyNote: '⚠ <strong>No known polynomial time</strong> verification'
            },
            problems: [
                {
                    id: 'tsp-opt',
                    name: 'Travelling Salesman - Optimal Route',
                    description: 'Find shortest route that visits every one of n cities',
                    solveTime: 'O(n!)',
                    verifyTime: 'O(n!)',
                    example: 'Delivery route optimization',
                    icon: '🚚',
                    marker: {
                        standard: { x: 410, y: 110 },
                        collapse: { x: 410, y: 110 }
                    }
                },
            ],
        },
    }

    class PNPVisualizer {
        constructor(element, mode, collapse, markers) {
            this.element = element
            this.mode = mode || 'venn'
            this.collapse = Boolean(collapse)
            this.markers = Boolean(markers)
            this.init()
        }

        init() {
            this.render()
            this.attachEventListeners()
        }

        rerender() {
            this.element.innerHTML = ''
            this.render()
            this.attachEventListeners()
        }

        getProblemSetsBy(orderKey) {
            return Object.values(PROBLEMS)
                .sort((a, b) => (a[orderKey] || 0) - (b[orderKey] || 0))
        }

        getDefaultProblemValue(problemSets, selectElement) {
            const defaultSet = problemSets.find(problemSet => problemSet.defaultProblemId)
            if (defaultSet) {
                return `${defaultSet.class}-${defaultSet.defaultProblemId}`
            }

            const firstOption = selectElement.querySelector('option')
            return firstOption ? firstOption.value : ''
        }

        createCategoryHeader(problemSet) {
            const categoryHeader = document.createElement('div')
            categoryHeader.className = `pnp-category-header pnp-class-${problemSet.class}`
            categoryHeader.innerHTML = `
                <h4 class="pnp-category-title">${problemSet.fullName}</h4>
                <p class="pnp-category-description">${problemSet.description}</p>
            `
            return categoryHeader
        }

        render() {
            const wrapper = document.createElement('div')
            wrapper.className = 'pnp-wrapper'

            const header = this.renderHeader()
            wrapper.appendChild(header)

            const content = document.createElement('div')
            content.className = 'pnp-content'

            if (this.mode === 'venn') {
                content.appendChild(this.renderVennDiagram())
                // Add toggle to header for venn mode
                const toggleBtn = this.createToggleButton()
                const headerToggle = document.createElement('div')
                headerToggle.className = 'pnp-header-toggle'
                headerToggle.appendChild(toggleBtn)
                header.appendChild(headerToggle)
            } else if (this.mode === 'verify') {
                const verifyContent = this.renderVerificationComparison()
                content.appendChild(verifyContent)
                // Add selector to header for verify mode
                const selectorEl = this.createProblemSelector()
                const headerSelector = document.createElement('div')
                headerSelector.className = 'pnp-header-selector'
                headerSelector.appendChild(selectorEl)
                header.appendChild(headerSelector)
                // Store reference to selector for comparison updates
                this.verifySelect = selectorEl.querySelector('.pnp-select')
                this.verifySelect.addEventListener('change', () => verifyContent.updateComparisonFn.call(this))
                verifyContent.updateComparisonFn.call(this)
            } else if (this.mode === 'problems') {
                const problemsExplorer = this.renderProblemsExplorer()
                content.appendChild(problemsExplorer.container)

                const headerTabs = document.createElement('div')
                headerTabs.className = 'pnp-header-tabs'
                headerTabs.appendChild(problemsExplorer.tabs)
                header.appendChild(headerTabs)

                problemsExplorer.showTab(problemsExplorer.defaultTabId)
            }

            wrapper.appendChild(content)
            this.element.appendChild(wrapper)
        }

        renderHeader() {
            const header = document.createElement('div')
            header.className = 'pnp-header'

            const headerText = document.createElement('div')
            headerText.className = 'pnp-header-text'

            const title = document.createElement('h3')
            title.className = 'pnp-title'
            title.textContent = UI_TEXT.title

            const subtitle = document.createElement('p')
            subtitle.className = 'pnp-subtitle'
            subtitle.textContent = UI_TEXT.subtitleByMode[this.mode] || UI_TEXT.subtitleByMode.venn

            headerText.appendChild(title)
            headerText.appendChild(subtitle)
            header.appendChild(headerText)

            return header
        }

        createProblemSelector() {
            const selector = document.createElement('div')
            selector.className = 'pnp-problem-selector'

            const label = document.createElement('label')
            label.textContent = UI_TEXT.verify.selectLabel
            label.className = 'pnp-label'

            const select = document.createElement('select')
            select.className = 'pnp-select'

            const orderedSets = this.getProblemSetsBy('tabOrder')

            orderedSets.forEach(problemSet => {
                const pGroup = document.createElement('optgroup')
                pGroup.label = problemSet.fullName
                problemSet.problems.forEach(p => {
                    const option = document.createElement('option')
                    option.value = `${problemSet.class}-${p.id}`
                    option.textContent = `${p.icon} ${p.name}`
                    pGroup.appendChild(option)
                })
                select.appendChild(pGroup)
            })

            select.value = this.getDefaultProblemValue(orderedSets, select)

            selector.appendChild(label)
            selector.appendChild(select)

            return selector
        }

        createToggleButton() {
            const toggleBtn = document.createElement('button')
            toggleBtn.className = 'pnp-btn pnp-btn-toggle'
            toggleBtn.textContent = this.collapse ? UI_TEXT.toggle.collapsed : UI_TEXT.toggle.standard
            toggleBtn.addEventListener('click', () => {
                this.collapse = !this.collapse
                this.rerender()
            })
            return toggleBtn
        }

        renderVennDiagram() {
            const container = document.createElement('div')
            container.className = 'pnp-venn-container'

            const wrapper = document.createElement('div')
            wrapper.className = 'pnp-venn-wrapper'

            const canvas = document.createElement('canvas')
            canvas.className = 'pnp-venn-canvas'
            canvas.width = 500
            canvas.height = 650

            const markerCard = this.markers ? document.createElement('div') : null
            if (markerCard) {
                markerCard.className = 'pnp-marker-card'
                markerCard.setAttribute('aria-hidden', 'true')
            }

            wrapper.appendChild(canvas)
            if (markerCard) {
                wrapper.appendChild(markerCard)
            }
            container.appendChild(wrapper)

            requestAnimationFrame(() => this.drawVennDiagram(canvas, markerCard))

            const legend = document.createElement('div')
            legend.className = 'pnp-legend'
            const legendSets = this.getProblemSetsBy('legendOrder')
            legend.innerHTML = legendSets
                .map(problemSet => {
                    return `
                        <div class="pnp-legend-item pnp-class-${problemSet.class}">
                            <span class="pnp-legend-color"></span>
                            <div>
                                <p class="pnp-legend-title">${problemSet.fullName}</p>
                                <p>${problemSet.description}</p>
                            </div>
                        </div>
                    `
                })
                .join('')

            container.appendChild(legend)

            return container
        }

        drawVennDiagram(canvas, markerCard) {
            const ctx = canvas.getContext('2d')
            const w = canvas.width
            const h = canvas.height

            const styles = getComputedStyle(this.element)
            const colorP = resolveCssVarColor(this.element, styles, '--pnp-color-p', '#4CAF50')
            const colorNP = resolveCssVarColor(this.element, styles, '--pnp-color-np', '#2196F3')
            const colorNPC = resolveCssVarColor(this.element, styles, '--pnp-color-npc', '#f436f4')
            const colorNPH = resolveCssVarColor(this.element, styles, '--pnp-color-nph', '#F44336')
            const colorBg = resolveCssVarColor(this.element, styles, '--pnp-bg-canvas', '#000000')
            const colorText = resolveCssVarColor(this.element, styles, '--color-text', '#eeeeee')

            ctx.fillStyle = colorBg
            ctx.fillRect(0, 0, w, h)

            if (!this.collapse) {
                const hardCx = 250
                const hardCy = 240
                const hardR = 250
                const npCx = 250
                const npCy = 400
                const npR = 240
                const pCx = 250
                const pCy = 500
                const pR = 120

                // NPH
                ctx.fillStyle = withAlpha(colorNPH, 0.5)
                ctx.strokeStyle = colorNPH
                ctx.lineWidth = 3
                ctx.beginPath()
                ctx.ellipse(hardCx, hardCy - hardR, hardR, hardR * 1.5, 0, 0, Math.PI)
                ctx.fill()
                ctx.stroke()

                // NP
                ctx.fillStyle = withAlpha(colorNP, 0.7)
                ctx.strokeStyle = colorNP
                ctx.lineWidth = 3
                ctx.beginPath()
                ctx.arc(npCx, npCy, npR, 0, Math.PI * 2)
                ctx.fill()
                ctx.stroke()

                // NPC
                ctx.save()
                ctx.beginPath()
                ctx.arc(npCx, npCy + 1, npR, 0, Math.PI * 2)
                ctx.clip()
                ctx.beginPath()
                ctx.ellipse(hardCx, hardCy - hardR, hardR, hardR * 1.5, 0, 0, Math.PI)
                ctx.fillStyle = withAlpha(colorNPC, 0.8)
                ctx.strokeStyle = colorNPH
                ctx.lineWidth = 3
                ctx.fill()
                ctx.stroke()
                ctx.restore()

                // P
                ctx.fillStyle = withAlpha(colorP, 0.7)
                ctx.strokeStyle = colorP
                ctx.lineWidth = 3
                ctx.beginPath()
                ctx.arc(pCx, pCy, pR, 0, Math.PI * 2)
                ctx.fill()
                ctx.stroke()

                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'

                ctx.fillStyle = colorText
                ctx.font = 'bold 30px system-ui, sans-serif'
                ctx.fillText(PROBLEMS.np.shortName, npCx - 160, npCy)
                ctx.fillText(PROBLEMS.p.shortName, pCx, pCy)
                ctx.fillText(PROBLEMS.nph.shortName, hardCx, hardCy - 150)
                ctx.fillText(PROBLEMS.npc.shortName, npCx, npCy - 140)
            }
            else {
                const hardCx = 250
                const hardCy = 240
                const hardR = 250
                const npCx = 250
                const npCy = 400
                const npR = 240

                // NPH
                ctx.fillStyle = withAlpha(colorNPH, 0.5)
                ctx.strokeStyle = colorNPH
                ctx.lineWidth = 3
                ctx.beginPath()
                ctx.ellipse(hardCx, hardCy - hardR, hardR, hardR * 1.5, 0, 0, Math.PI)
                ctx.fill()
                ctx.stroke()

                // P
                ctx.fillStyle = withAlpha(colorP, 0.7)
                ctx.strokeStyle = colorP
                ctx.lineWidth = 3
                ctx.beginPath()
                ctx.arc(npCx, npCy, npR, 0, Math.PI * 2)
                ctx.fill()
                ctx.stroke()

                // NPC
                ctx.save()
                ctx.beginPath()
                ctx.arc(npCx, npCy + 1, npR, 0, Math.PI * 2)
                ctx.clip()
                ctx.beginPath()
                ctx.ellipse(hardCx, hardCy - hardR, hardR, hardR * 1.5, 0, 0, Math.PI)
                ctx.fillStyle = withAlpha(colorNPC, 0.8)
                ctx.strokeStyle = colorNPH
                ctx.lineWidth = 3
                ctx.fill()
                ctx.stroke()
                ctx.restore()

                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'

                ctx.fillStyle = colorText
                ctx.font = 'bold 30px system-ui, sans-serif'

                ctx.fillText('P = NP', npCx, npCy + 60)
                ctx.fillText(PROBLEMS.nph.shortName, hardCx, hardCy - 150)
                ctx.fillText(PROBLEMS.npc.shortName, npCx, npCy - 140)
            }

            if (this.markers && markerCard) {
                const markers = this.getVennMarkers(this.collapse)
                this.drawVennMarkers(ctx, markers, colorBg)
                this.attachVennMarkerInteractions(canvas, markerCard, markers)
            }
        }

        getVennMarkers(collapseView) {
            const decorate = (problem, category, className) => ({
                ...problem,
                ...(collapseView ? problem.marker.collapse : problem.marker.standard),
                category,
                className,
                radius: 26
            })

            const pMarkers   = PROBLEMS.p.problems.map(problem => decorate(problem, PROBLEMS.p.shortName, PROBLEMS.p.class))
            const npMarkers  = PROBLEMS.np.problems.map(problem => decorate(problem, PROBLEMS.np.shortName, PROBLEMS.np.class))
            const npcMarkers = PROBLEMS.npc.problems.map(problem => decorate(problem, PROBLEMS.npc.shortName, PROBLEMS.npc.class))
            const nphMarkers = PROBLEMS.nph.problems.map(problem => decorate(problem, PROBLEMS.nph.shortName, PROBLEMS.nph.class))

            return [...pMarkers, ...npMarkers, ...npcMarkers, ...nphMarkers]
        }

        drawVennMarkers(ctx, markers, canvasBgColor) {
            const styles = getComputedStyle(this.element)
            const markerColors = {
                p: resolveCssVarColor(this.element, styles, '--pnp-color-p', '#4CAF50'),
                np: resolveCssVarColor(this.element, styles, '--pnp-color-np', '#2196F3'),
                npc: resolveCssVarColor(this.element, styles, '--pnp-color-npc', '#F44336'),
                nph: resolveCssVarColor(this.element, styles, '--pnp-color-nph', '#607D8B')
            }
            const markerIconColor = resolveCssVarColor(this.element, styles, '--color-text', '#ffffff')

            markers.forEach(marker => {
                const color = markerColors[marker.className] || markerColors.np

                ctx.beginPath()
                ctx.arc(marker.x, marker.y, marker.radius, 0, Math.PI * 2)
                ctx.fillStyle = color
                ctx.fill()
                ctx.strokeStyle = canvasBgColor
                ctx.lineWidth = 2
                ctx.stroke()

                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                ctx.fillStyle = markerIconColor
                ctx.font = '30px system-ui, sans-serif'
                ctx.fillText(marker.icon, marker.x, marker.y + 1)
            })
        }

        attachVennMarkerInteractions(canvas, markerCard, markers) {
            const wrapper = canvas.parentElement
            if (!wrapper) {
                return
            }

            const placeCard = (event) => {
                const wrapperRect = wrapper.getBoundingClientRect()
                const cardRect = markerCard.getBoundingClientRect()
                const padding = 12
                const pointerGap = 14

                let left = event.clientX - wrapperRect.left - (cardRect.width / 2)
                let top = event.clientY - wrapperRect.top - cardRect.height - pointerGap

                if (left + cardRect.width > wrapperRect.width - padding) {
                    left = wrapperRect.width - cardRect.width - padding
                }

                markerCard.style.left = `${Math.max(padding, left)}px`
                markerCard.style.top = `${Math.max(padding, top)}px`
            }

            const toCanvasPoint = (event) => {
                const rect = canvas.getBoundingClientRect()
                const scaleX = canvas.width / rect.width
                const scaleY = canvas.height / rect.height

                return {
                    x: (event.clientX - rect.left) * scaleX,
                    y: (event.clientY - rect.top) * scaleY
                }
            }

            const findMarker = (point) => markers.find(marker => {
                const dx = point.x - marker.x
                const dy = point.y - marker.y
                return Math.hypot(dx, dy) <= marker.radius + 3
            })

            const showCard = (marker, event) => {
                markerCard.innerHTML = `
                    <div class="pnp-marker-title">${marker.icon} ${marker.name}</div>
                    <div class="pnp-marker-class">${marker.category}</div>
                    <p>${marker.description}</p>
                    <p>Solve: <strong>${marker.solveTime}</strong> | Verify: <strong>${marker.verifyTime}</strong></p>
                `
                markerCard.classList.add('is-visible')
                markerCard.setAttribute('aria-hidden', 'false')
                placeCard(event)
            }

            const hideCard = () => {
                markerCard.classList.remove('is-visible')
                markerCard.setAttribute('aria-hidden', 'true')
            }

            canvas.addEventListener('mousemove', (event) => {
                const marker = findMarker(toCanvasPoint(event))
                canvas.style.cursor = marker ? 'pointer' : 'default'

                if (!marker) {
                    hideCard()
                    return
                }

                showCard(marker, event)
            })

            canvas.addEventListener('mouseleave', () => {
                canvas.style.cursor = 'default'
                hideCard()
            })
        }

        renderVerificationComparison() {
            const container = document.createElement('div')
            container.className = 'pnp-verify-container'

            const comparison = document.createElement('div')
            comparison.className = 'pnp-comparison'
            container.appendChild(comparison)

            const updateComparison = () => {
                const select = this.verifySelect
                if (!select) return

                const separatorIndex = select.value.indexOf('-')
                const type = separatorIndex === -1 ? select.value : select.value.slice(0, separatorIndex)
                const id = separatorIndex === -1 ? '' : select.value.slice(separatorIndex + 1)
                const problemSet = PROBLEMS[type]
                const problem = problemSet ? problemSet.problems.find(p => p.id === id) : null

                if (problem) {
                    const solvingClass = problemSet.verify.solvingClass
                    const solvingNote = problemSet.verify.solvingNote
                    const verifyClass = problemSet.verify.verifyClass
                    const verifyNote = problemSet.verify.verifyNote

                    comparison.className = `pnp-comparison pnp-class-${problemSet.class}`

                    comparison.innerHTML = `
                        <div class="pnp-problem-details pnp-class-${problemSet.class}">
                            <h4><span>${problem.icon}</span> <span>${problem.name}</span></h4>
                            <p class="pnp-description">${problem.description}</p>
                            <p class="pnp-example"><strong>Example:</strong> ${problem.example}</p>
                        </div>
                        <div class="pnp-comparison-grid pnp-class-${problemSet.class}">
                            <div class="pnp-comparison-header">
                                <h4 class="pnp-category-title">${problemSet.fullName}</h4>
                                <p class="pnp-category-description">${problemSet.description}</p>
                            </div>
                            <div class="pnp-comparison-card pnp-solving ${solvingClass}">
                                <h5>⚙️ Solving</h5>
                                <p>Finding solution from scratch</p>
                                <div class="pnp-time-badge">${problem.solveTime}</div>
                                <p class="pnp-note">${solvingNote}</p>
                            </div>
                            <div class="pnp-comparison-card pnp-verifying ${verifyClass}">
                                <h5>✓ Verifying</h5>
                                <p>Checking given solution is correct</p>
                                <div class="pnp-time-badge">${problem.verifyTime}</div>
                                <p class="pnp-note">${verifyNote}</p>
                            </div>
                        </div>
                    `
                }
            }

            // Store update function to be called after selector is created
            container.updateComparisonFn = updateComparison

            return container
        }

        renderProblemsExplorer() {
            const container = document.createElement('div')
            container.className = 'pnp-problems-container'

            const tabs = document.createElement('div')
            tabs.className = 'pnp-tabs'

            const tabButtons = this.getProblemSetsBy('tabOrder')
                .map(problemSet => ({
                    id: problemSet.class,
                    label: problemSet.tabLabel,
                    color: problemSet.class
                }))

            const tabContent = document.createElement('div')
            tabContent.className = 'pnp-tab-content'

            const showTab = (tabId) => {
                tabs.querySelectorAll('.pnp-tab-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.tab === tabId)
                })

                tabContent.innerHTML = ''
                const problemSet = PROBLEMS[tabId]
                const problemList = problemSet ? problemSet.problems : []

                if (problemSet) {
                    tabContent.appendChild(this.createCategoryHeader(problemSet))
                }

                const grid = document.createElement('div')
                grid.className = 'pnp-problems-grid'

                problemList.forEach(problem => {
                    const card = this.createProblemCard(problem, tabId)
                    grid.appendChild(card)
                })

                tabContent.appendChild(grid)
            }

            tabButtons.forEach(tab => {
                const btn = document.createElement('button')
                btn.className = `pnp-tab-btn pnp-class-${tab.color}`
                btn.textContent = tab.label
                btn.dataset.tab = tab.id
                btn.addEventListener('click', () => showTab(tab.id))
                tabs.appendChild(btn)
            })

            container.appendChild(tabContent)

            return {
                container,
                tabs,
                showTab,
                defaultTabId: tabButtons[0] ? tabButtons[0].id : 'p'
            }
        }

        createProblemCard(problem, type) {
            const card = document.createElement('div')
            card.className = `pnp-problem-card pnp-class-${type}`

            card.innerHTML = `
                <div class="pnp-problem-icon">${problem.icon}</div>
                <h5 class="pnp-problem-name">${problem.name}</h5>
                <p class="pnp-problem-description">
                    ${problem.description}
                    <span class="pnp-problem-example">(example: ${problem.example})</span>
                </p>
                <div class="pnp-problem-complexity">
                    <div class="pnp-complexity-item">
                        <div class="pnp-complexity-label">Solve:</div>
                        <div class="pnp-time-badge">${problem.solveTime}</div>
                    </div>
                    <div class="pnp-complexity-item">
                        <div class="pnp-complexity-label">Verify:</div>
                        <div class="pnp-time-badge">${problem.verifyTime}</div>
                    </div>
                </div>
            `

            return card
        }

        attachEventListeners() {
        }
    }

    function pnpPlugin(hook, vm) {
        hook.afterEach(function (html, next) {
            next(html)
        })

        hook.doneEach(function () {
            const pnpElements = document.querySelectorAll('p-np')
            pnpElements.forEach(element => {
                if (!element.dataset.initialized) {
                    const mode = element.getAttribute('mode') || 'venn'
                    const collapse = element.hasAttribute('collapse')
                    const markers = element.hasAttribute('markers')
                    new PNPVisualizer(element, mode, collapse, markers)
                    element.dataset.initialized = 'true'
                }
            })
        })
    }

    if (window.$docsify) {
        window.$docsify.plugins = [].concat(pnpPlugin, window.$docsify.plugins || [])
    }
})()
