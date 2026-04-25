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

    const SVG_ICONS = {
        status: {
            check: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5"/></svg>',
            warning: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-triangle-alert-icon lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>'
        },
        problem: {
            linearSearch: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search-slash-icon lucide-search-slash"><path d="m13.5 8.5-5 5"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
            binarySearch: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search-code-icon lucide-search-code"><path d="m13 13.5 2-2.5-2-2.5"/><path d="m21 21-4.3-4.3"/><path d="M9 8.5 7 11l2 2.5"/><circle cx="11" cy="11" r="8"/></svg>',
            sorting: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-down-az-icon lucide-arrow-down-a-z"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="M20 8h-5"/><path d="M15 10V6.5a2.5 2.5 0 0 1 5 0V10"/><path d="M15 14h5l-5 6h5"/></svg>',
            palindrome: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right-left-icon lucide-arrow-right-left"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>',
            shortestPath: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-route-icon lucide-route"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>',
            matrixMultiplication: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-x-icon lucide-square-x"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
            factorisation: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-divide-icon lucide-square-divide"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="8" x2="16" y1="12" y2="12"/><line x1="12" x2="12" y1="16" y2="16"/><line x1="12" x2="12" y1="8" y2="8"/></svg>',
            knapsack: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-backpack-icon lucide-backpack"><path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M8 10h8"/><path d="M8 18h8"/><path d="M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>',
            binPacking: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package-icon lucide-package"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/><path d="m7.5 4.27 9 5.15"/></svg>',
            graphColouring: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-palette-icon lucide-palette"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/></svg>',
            travellingSalesman: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-van-icon lucide-van"><path d="M13 6v5a1 1 0 0 0 1 1h6.102a1 1 0 0 1 .712.298l.898.91a1 1 0 0 1 .288.702V17a1 1 0 0 1-1 1h-3"/><path d="M5 18H3a1 1 0 0 1-1-1V8a2 2 0 0 1 2-2h12c1.1 0 2.1.8 2.4 1.8l1.176 4.2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>'
        },
        ui: {
            solving: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calculator-icon lucide-calculator"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>',
            verifying: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-check-big-icon lucide-square-check-big"><path d="M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344"/><path d="m9 11 3 3L22 4"/></svg>'
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
                solvingNote: `${SVG_ICONS.status.check} <strong>Polynomial time</strong> solution - easy for large n`,
                verifyClass: 'pnp-verify-poly',
                verifyNote: `${SVG_ICONS.status.check} <strong>Polynomial time</strong> verification - always fast`
            },
            problems: [
                {
                    id: 'linear-search',
                    name: 'Linear Search',
                    description: 'Scan list of n items from start until target is found',
                    solveTime: 'O(n)',
                    verifyTime: 'O(1)',
                    example: 'Finding a name in an unsorted list',
                    icon: SVG_ICONS.problem.linearSearch,
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
                    icon: SVG_ICONS.problem.binarySearch,
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
                    icon: SVG_ICONS.problem.sorting,
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
                    icon: SVG_ICONS.problem.palindrome,
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
                    icon: SVG_ICONS.problem.shortestPath,
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
                    icon: SVG_ICONS.problem.matrixMultiplication,
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
                solvingNote: `${SVG_ICONS.status.warning} <strong>No known polynomial time</strong> solution`,
                verifyClass: 'pnp-verify-poly',
                verifyNote: `${SVG_ICONS.status.check} <strong>Polynomial time</strong> verification - always fast`
            },
            problems: [
                {
                    id: 'factoring',
                    name: 'Factorisation by Division',
                    description: 'Use division to find a non-trivial factor of number value n',
                    solveTime: 'O(√n)',
                    verifyTime: 'O(log n)',
                    example: 'Try 2, 3, 4... until a divisor is found',
                    icon: SVG_ICONS.problem.factorisation,
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
                solvingNote: `${SVG_ICONS.status.warning} <strong>Exponential time</strong> solution - intractable for large n`,
                verifyClass: 'pnp-verify-poly',
                verifyNote: `${SVG_ICONS.status.check} <strong>Polynomial time</strong> verification - always fast`
            },
            problems: [
                {
                    id: 'knapsack',
                    name: '0/1 Knapsack',
                    description: 'Select out of n items to maximize value within a limit',
                    solveTime: 'O(2ⁿ)',
                    verifyTime: 'O(n)',
                    example: 'Cargo loading',
                    icon: SVG_ICONS.problem.knapsack,
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
                    icon: SVG_ICONS.problem.binPacking,
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
                    icon: SVG_ICONS.problem.graphColouring,
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
                solvingNote: `${SVG_ICONS.status.warning} <strong>Exponential time</strong> solution - intractable for large n`,
                verifyClass: 'pnp-verify-exp',
                verifyNote: `${SVG_ICONS.status.warning} <strong>No known polynomial time</strong> verification`
            },
            problems: [
                {
                    id: 'tsp-opt',
                    name: 'Travelling Salesman - Optimal Route',
                    description: 'Find shortest route that visits every one of n cities',
                    solveTime: 'O(n!)',
                    verifyTime: 'O(n!)',
                    example: 'Delivery route optimization',
                    icon: SVG_ICONS.problem.travellingSalesman,
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
                    option.textContent = p.name
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

                ctx.fillText('P = NP', npCx, npCy + 50)
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

                ctx.shadowColor = 'rgba(0, 0, 0, 0.35)'
                ctx.shadowBlur = 6
                ctx.shadowOffsetX = 0
                ctx.shadowOffsetY = 3

                ctx.fillStyle = color
                ctx.fill()
                ctx.strokeStyle = canvasBgColor
                ctx.lineWidth = 3
                ctx.stroke()

                const svgString = marker.icon
                const img = new Image()
                const svgBlob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'})
                const url = URL.createObjectURL(svgBlob)

                img.onload = () => {
                    ctx.drawImage(img, marker.x - 18, marker.y - 18, 36, 36)
                    URL.revokeObjectURL(url)
                }
                img.src = url
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
                    <div class="pnp-marker-title">${marker.icon} <span>${marker.name}</span></div>
                    <div class="pnp-marker-class">Category: <strong>${marker.category}</strong></div>
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
                            <h4>${problem.icon} <span>${problem.name}</span></h4>
                            <p class="pnp-description">${problem.description}</p>
                            <p class="pnp-example"><strong>Example:</strong> ${problem.example}</p>
                        </div>
                        <div class="pnp-comparison-grid pnp-class-${problemSet.class}">
                            <div class="pnp-comparison-header">
                                <h4 class="pnp-category-title">${problemSet.fullName}</h4>
                                <p class="pnp-category-description">${problemSet.description}</p>
                            </div>
                            <div class="pnp-comparison-card pnp-solving ${solvingClass}">
                                <h5>
                                    ${SVG_ICONS.ui.solving}
                                    Solving
                                </h5>
                                <p>Finding solution from scratch</p>
                                <div class="pnp-time-badge">${problem.solveTime}</div>
                                <p class="pnp-note">${solvingNote}</p>
                            </div>
                            <div class="pnp-comparison-card pnp-verifying ${verifyClass}">
                                <h5>
                                    ${SVG_ICONS.ui.verifying}
                                    Verifying
                                </h5>
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

            const problemSet = PROBLEMS[type]
            const solvingClass = problemSet.verify.solvingClass
            const verifyClass = problemSet.verify.verifyClass

            card.innerHTML = `
                <div class="pnp-problem-icon">${problem.icon}</div>
                <h5 class="pnp-problem-name">${problem.name}</h5>
                <p class="pnp-problem-description">
                    ${problem.description}
                    <span class="pnp-problem-example">(example: ${problem.example})</span>
                </p>
                <div class="pnp-problem-complexity">
                    <div class="pnp-complexity-item ${solvingClass}">
                        <div class="pnp-complexity-label">Solve:</div>
                        <div class="pnp-time-badge">${problem.solveTime}</div>
                    </div>
                    <div class="pnp-complexity-item ${verifyClass}">
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
