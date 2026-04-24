/**
 * docsify-p-np.js - P, NP, and NP-Complete Complexity Class Visualizer
 *
 * Interactive visualization demonstrating:
 *   - P (Polynomial Time): Problems solvable efficiently
 *   - NP (Nondeterministic Polynomial): Solutions verifiable efficiently
 *   - NP-Complete: Hardest problems in NP
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

    const PROBLEMS = {
        p: [
            {
                id: 'linear-search',
                name: 'Linear Search',
                description: 'Scan list from start until target is found',
                solveTime: 'O(N)',
                verifyTime: 'O(1)',
                example: 'Finding a name in an unsorted list',
                icon: '🔎',
                marker: {
                    standard: { x: 190, y: 460 },
                    collapse: { x: 170, y: 415 }
                }
            },
            {
                id: 'binary-search',
                name: 'Binary Search',
                description: 'Find an item in a sorted list',
                solveTime: 'O(log N)',
                verifyTime: 'O(1)',
                example: 'Searching in phone book',
                icon: '🔍',
                marker: {
                    standard: { x: 250, y: 460 },
                    collapse: { x: 245, y: 415 }
                }
            },
            {
                id: 'sorting',
                name: 'Sorting',
                description: 'Sort a list of N numbers',
                solveTime: 'O(N log N)',
                verifyTime: 'O(N)',
                example: 'Merge Sort, Quick Sort',
                icon: '↕️',
                marker: {
                    standard: { x: 310, y: 460 },
                    collapse: { x: 320, y: 415 }
                }
            },
            {
                id: 'palindrome',
                name: 'Palindrome Check',
                description: 'Check if string reads same forwards/backwards',
                solveTime: 'O(N)',
                verifyTime: 'O(N)',
                example: 'racecar, level',
                icon: '↔️',
                marker: {
                    standard: { x: 205, y: 515 },
                    collapse: { x: 170, y: 470 }
                }
            },
            {
                id: 'shortest-path',
                name: 'Shortest Path',
                description: 'Find shortest route between two nodes',
                solveTime: 'O(N²)',
                verifyTime: 'O(N)',
                example: 'Dijkstra\'s Algorithm',
                icon: '🗺️',
                marker: {
                    standard: { x: 250, y: 525 },
                    collapse: { x: 245, y: 470 }
                }
            },
            {
                id: 'matrix-mult',
                name: 'Matrix Multiplication',
                description: 'Multiply two N×N matrices',
                solveTime: 'O(N³)',
                verifyTime: 'O(N²)',
                example: 'Graphics transformations',
                icon: '⊗',
                marker: {
                    standard: { x: 295, y: 515 },
                    collapse: { x: 320, y: 470 }
                }
            },
        ],
        np: [
            {
                id: 'factoring',
                name: 'Factorisation by Division',
                description: 'Naive trial division to find a non-trivial factor',
                solveTime: 'O(√N) by value',
                verifyTime: 'O(log N)',
                example: 'Try 2, 3, 4... until a divisor is found',
                icon: '🔢',
                marker: {
                    standard: { x: 85, y: 400 },
                    collapse: { x: 90, y: 395 }
                }
            }
        ],
        npComplete: [
            {
                id: 'tsp',
                name: 'Travelling Salesman',
                description: 'Find shortest route visiting all cities',
                solveTime: 'O((N-1)!)',
                verifyTime: 'O(N)',
                example: 'Delivery route optimization',
                icon: '🚚',
                marker: {
                    standard: { x: 200, y: 265 },
                    collapse: { x: 215, y: 260 }
                }
            },
            {
                id: 'knapsack',
                name: '0/1 Knapsack',
                description: 'Select items to maximize value within weight limit',
                solveTime: 'O(2ⁿ)',
                verifyTime: 'O(N)',
                example: 'Cargo loading',
                icon: '🎒',
                marker: {
                    standard: { x: 265, y: 255 },
                    collapse: { x: 275, y: 260 }
                }
            },
            {
                id: 'bin-packing',
                name: 'Bin Packing',
                description: 'Pack items into minimum number of bins',
                solveTime: 'O(2ⁿ)',
                verifyTime: 'O(N)',
                example: 'Shipping container allocation',
                icon: '📦',
                marker: {
                    standard: { x: 195, y: 320 },
                    collapse: { x: 215, y: 310 }
                }
            },
            {
                id: 'graph-colouring',
                name: 'Graph Colouring',
                description: 'Colour graph nodes so adjacent nodes differ',
                solveTime: 'O(Kⁿ)',
                verifyTime: 'O(N²)',
                example: 'Timetable scheduling',
                icon: '🎨',
                marker: {
                    standard: { x: 275, y: 310 },
                    collapse: { x: 275, y: 310 }
                }
            },
        ]
    }

    class PNPVisualizer {
        constructor(element, mode, collapse, markers) {
            this.element = element
            this.mode = mode || 'venn'
            this.collapse = Boolean(collapse)
            this.markers = Boolean(markers)
            this.selectedProblem = null
            this.init()
        }

        init() {
            this.render()
            this.attachEventListeners()
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
            } else if (this.mode === 'verify') {
                content.appendChild(this.renderVerificationComparison())
            } else if (this.mode === 'problems') {
                content.appendChild(this.renderProblemsExplorer())
            }

            wrapper.appendChild(content)
            this.element.appendChild(wrapper)
        }

        renderHeader() {
            const header = document.createElement('div')
            header.className = 'pnp-header'

            const title = document.createElement('h3')
            title.className = 'pnp-title'
            title.textContent = 'P, NP, and NP-Complete'

            const subtitle = document.createElement('p')
            subtitle.className = 'pnp-subtitle'

            if (this.mode === 'venn') {
                subtitle.textContent = 'Exploring computational complexity classes'
            } else if (this.mode === 'verify') {
                subtitle.textContent = 'Verification vs Solving: The key distinction'
            } else if (this.mode === 'problems') {
                subtitle.textContent = 'Real-world problems in each complexity class'
            }

            header.appendChild(title)
            header.appendChild(subtitle)

            return header
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

            const controls = document.createElement('div')
            controls.className = 'pnp-controls'

            const toggleBtn = document.createElement('button')
            toggleBtn.className = 'pnp-btn pnp-btn-toggle'
            toggleBtn.textContent = this.collapse ? 'Show P ≠ NP (standard view)' : 'Show P = NP (collapsed view)'
            toggleBtn.addEventListener('click', () => {
                this.collapse = !this.collapse
                this.element.innerHTML = ''
                this.render()
                this.attachEventListeners()
            })
            controls.appendChild(toggleBtn)

            const legend = document.createElement('div')
            legend.className = 'pnp-legend'
            legend.innerHTML = `
                <div class="pnp-legend-item">
                    <span class="pnp-legend-color pnp-legend-p"></span>
                    <span><strong>P</strong> - Polynomial Time (efficient to solve)</span>
                </div>
                <div class="pnp-legend-item">
                    <span class="pnp-legend-color pnp-legend-np"></span>
                    <span><strong>NP</strong> - Nondeterministic Polynomial (efficient to verify)</span>
                </div>
                <div class="pnp-legend-item">
                    <span class="pnp-legend-color pnp-legend-npc"></span>
                    <span><strong>NP-Complete</strong> - Hardest problems in NP</span>
                </div>
                <div class="pnp-legend-item">
                    <span class="pnp-legend-color pnp-legend-nph"></span>
                    <span><strong>NP-Hard</strong> - At least as hard as NP-Complete (may be outside NP)</span>
                </div>
            `
            controls.appendChild(legend)

            const explanation = document.createElement('div')
            explanation.className = 'pnp-explanation'
            explanation.innerHTML = this.collapse
                ? `<p><strong>P = NP collapsed view:</strong> If P = NP, all problems that can be verified quickly can also be solved quickly. This would revolutionize cryptography, optimization, and many other fields-but it's probably not true!</p>`
                : `<p><strong>The million-dollar question:</strong> Does P = NP? We know P ⊆ NP (every problem we can solve quickly, we can verify quickly). Also, <strong>NP-Complete = NP ∩ NP-Hard</strong>, shown as the overlap region. Most computer scientists believe P ≠ NP.</p>`

            controls.appendChild(explanation)

            container.appendChild(controls)

            return container
        }

        drawVennDiagram(canvas, markerCard) {
            const ctx = canvas.getContext('2d')
            const w = canvas.width
            const h = canvas.height

            const styles = getComputedStyle(this.element)
            const colorP = resolveCssVarColor(this.element, styles, '--pnp-color-p', '#4CAF50')
            const colorNP = resolveCssVarColor(this.element, styles, '--pnp-color-np', '#2196F3')
            const colorNPC = resolveCssVarColor(this.element, styles, '--pnp-color-npc', '#F44336')
            const colorNPH = resolveCssVarColor(this.element, styles, '--pnp-color-nph', '#607D8B')
            const colorBg = resolveCssVarColor(this.element, styles, '--pnp-bg-canvas', '#000000')
            const colorText = resolveCssVarColor(this.element, styles, '--color-text', '#eeeeee')

            ctx.fillStyle = colorBg
            ctx.fillRect(0, 0, w, h)

            if (this.collapse) {
                const hardCx = 250
                const hardCy = 200
                const hardR = 240
                const npCx = 250
                const npCy = 400
                const npR = 240

                // NPH
                ctx.fillStyle = withAlpha(colorNPH, 0.15)
                ctx.strokeStyle = colorNPH
                ctx.lineWidth = 3
                ctx.beginPath()
                ctx.ellipse(hardCx, hardCy - hardR, hardR, hardR * 1.5, 0, 0, Math.PI)
                ctx.fill()
                ctx.stroke()

                // P
                ctx.fillStyle = withAlpha(colorP, 0.4)
                ctx.strokeStyle = colorP
                ctx.lineWidth = 3
                ctx.beginPath()
                ctx.arc(npCx, npCy, npR, 0, Math.PI * 2)
                ctx.fill()
                ctx.stroke()

                // NPC
                ctx.save()
                ctx.beginPath()
                ctx.arc(npCx, npCy, npR, 0, Math.PI * 2)
                ctx.clip()
                ctx.beginPath()
                ctx.ellipse(hardCx, hardCy - hardR, hardR, hardR * 1.5, 0, 0, Math.PI)
                ctx.fillStyle = withAlpha(colorNPC, 0.6)
                ctx.fill()
                ctx.restore()

                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'

                ctx.fillStyle = colorText
                ctx.font = 'bold 30px system-ui, sans-serif'

                ctx.fillText('P = NP', npCx, npCy + 80)
                ctx.fillText('NP-Hard', hardCx, hardCy - 80)
                ctx.fillText('NP-Complete', npCx, npCy - 160)
            }
            else {
                const hardCx = 250
                const hardCy = 200
                const hardR = 240
                const npCx = 250
                const npCy = 400
                const npR = 240
                const pCx = 250
                const pCy = 500
                const pR = 120

                // NPH
                ctx.fillStyle = withAlpha(colorNPH, 0.15)
                ctx.strokeStyle = colorNPH
                ctx.lineWidth = 3
                ctx.beginPath()
                ctx.ellipse(hardCx, hardCy - hardR, hardR, hardR * 1.5, 0, 0, Math.PI)
                ctx.fill()
                ctx.stroke()

                // NP
                ctx.fillStyle = withAlpha(colorNP, 0.4)
                ctx.strokeStyle = colorNP
                ctx.lineWidth = 3
                ctx.beginPath()
                ctx.arc(npCx, npCy, npR, 0, Math.PI * 2)
                ctx.fill()
                ctx.stroke()

                // NPC
                ctx.save()
                ctx.beginPath()
                ctx.arc(npCx, npCy, npR, 0, Math.PI * 2)
                ctx.clip()
                ctx.beginPath()
                ctx.ellipse(hardCx, hardCy - hardR, hardR, hardR * 1.5, 0, 0, Math.PI)
                ctx.fillStyle = withAlpha(colorNPC, 0.6)
                ctx.fill()
                ctx.restore()

                // P
                ctx.fillStyle = withAlpha(colorP, 0.4)
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
                ctx.fillText('NP', npCx - 160, npCy)
                ctx.fillText('P', pCx, pCy)
                ctx.fillText('NP-Hard', hardCx, hardCy - 80)
                ctx.fillText('NP-Complete', npCx, npCy - 160)
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
                radius: 25
            })

            const pMarkers = PROBLEMS.p.map(problem => decorate(problem, 'P', 'p'))
            const npMarkers = PROBLEMS.np.map(problem => decorate(problem, 'NP', 'np'))
            const npcMarkers = PROBLEMS.npComplete.map(problem => decorate(problem, 'NP-Complete', 'npc'))

            return [...pMarkers, ...npMarkers, ...npcMarkers]
        }

        drawVennMarkers(ctx, markers, canvasBgColor) {
            const styles = getComputedStyle(this.element)
            const markerColors = {
                p: resolveCssVarColor(this.element, styles, '--pnp-color-p', '#4CAF50'),
                np: resolveCssVarColor(this.element, styles, '--pnp-color-np', '#2196F3'),
                npc: resolveCssVarColor(this.element, styles, '--pnp-color-npc', '#F44336')
            }
            const markerIconColor = resolveCssVarColor(this.element, styles, '--color-text', '#ffffff')

            markers.forEach(marker => {
                const color = markerColors[marker.className] || markerColors.np

                ctx.beginPath()
                ctx.arc(marker.x, marker.y, marker.radius + 3, 0, Math.PI * 2)
                ctx.fillStyle = withAlpha(canvasBgColor, 0.65)
                ctx.fill()

                ctx.beginPath()
                ctx.arc(marker.x, marker.y, marker.radius, 0, Math.PI * 2)
                ctx.fillStyle = withAlpha(color, 0.95)
                ctx.fill()
                ctx.strokeStyle = color
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
                    <p><strong>Solve:</strong> ${marker.solveTime} | <strong>Verify:</strong> ${marker.verifyTime}</p>
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

            const selector = document.createElement('div')
            selector.className = 'pnp-problem-selector'

            const label = document.createElement('label')
            label.textContent = 'Select problem:'
            label.className = 'pnp-label'

            const select = document.createElement('select')
            select.className = 'pnp-select'

            const pGroup = document.createElement('optgroup')
            pGroup.label = 'P (Polynomial Time)'
            PROBLEMS.p.forEach(p => {
                const option = document.createElement('option')
                option.value = `p-${p.id}`
                option.textContent = `${p.icon} ${p.name}`
                pGroup.appendChild(option)
            })
            select.appendChild(pGroup)

            const npGroup = document.createElement('optgroup')
            npGroup.label = 'NP'
            PROBLEMS.np.forEach(p => {
                const option = document.createElement('option')
                option.value = `np-${p.id}`
                option.textContent = `${p.icon} ${p.name}`
                npGroup.appendChild(option)
            })
            select.appendChild(npGroup)

            const npcGroup = document.createElement('optgroup')
            npcGroup.label = 'NP-Complete'
            PROBLEMS.npComplete.forEach(p => {
                const option = document.createElement('option')
                option.value = `npc-${p.id}`
                option.textContent = `${p.icon} ${p.name}`
                npcGroup.appendChild(option)
            })
            select.appendChild(npcGroup)

            select.value = 'npc-tsp'
            selector.appendChild(label)
            selector.appendChild(select)
            container.appendChild(selector)

            const comparison = document.createElement('div')
            comparison.className = 'pnp-comparison'
            container.appendChild(comparison)

            const updateComparison = () => {
                const separatorIndex = select.value.indexOf('-')
                const type = separatorIndex === -1 ? select.value : select.value.slice(0, separatorIndex)
                const id = separatorIndex === -1 ? '' : select.value.slice(separatorIndex + 1)
                const problemList = type === 'p'
                    ? PROBLEMS.p
                    : (type === 'np' ? PROBLEMS.np : PROBLEMS.npComplete)
                const problem = problemList.find(p => p.id === id)
                const solvingClass = type === 'p'
                    ? 'pnp-solving-poly'
                    : (type === 'np' ? 'pnp-solving-unknown' : 'pnp-solving-exp')
                const solvingNote = type === 'p'
                    ? '✓ <strong>Polynomial time</strong> - efficient for large inputs'
                    : (type === 'np'
                        ? '⚠ <strong>No known polynomial-time</strong> - may still be hard in practice'
                        : '⏰ <strong>Exponential time</strong> - impractical for large inputs')

                if (problem) {
                    comparison.innerHTML = `
                        <div class="pnp-problem-details">
                            <h4>${problem.icon} ${problem.name}</h4>
                            <p class="pnp-description">${problem.description}</p>
                        </div>
                        <div class="pnp-comparison-grid">
                            <div class="pnp-comparison-card pnp-solving ${solvingClass}">
                                <h5>⚙️ Solving</h5>
                                <div class="pnp-time-badge">${problem.solveTime}</div>
                                <p>Finding solution from scratch</p>
                                <p class="pnp-note">${solvingNote}</p>
                            </div>
                            <div class="pnp-comparison-card pnp-verifying">
                                <h5>✓ Verifying</h5>
                                <div class="pnp-time-badge">${problem.verifyTime}</div>
                                <p>Checking given solution is correct</p>
                                <p class="pnp-note">✓ <strong>Polynomial time</strong> - always fast</p>
                            </div>
                        </div>
                        <div class="pnp-example">
                            <strong>Example:</strong> ${problem.example}
                        </div>
                    `
                }
            }

            select.addEventListener('change', updateComparison)
            updateComparison()

            const insight = document.createElement('div')
            insight.className = 'pnp-insight'
            insight.innerHTML = `
                <h4>🔑 Key Insight</h4>
                <p>For <strong>NP-Complete</strong> problems: verifying solution is <em>much faster</em> than finding it.</p>
                <p>For <strong>P</strong> problems: solving already fast (verification often faster).</p>
                <p>For some <strong>NP</strong> problems like factorisation: verification fast, but polynomial-time classical solving algorithm unknown.</p>
                <p>This is why NP problems matter: we can check answers quickly but cannot always find them quickly (unless P = NP).</p>
            `
            container.appendChild(insight)

            return container
        }

        renderProblemsExplorer() {
            const container = document.createElement('div')
            container.className = 'pnp-problems-container'

            const tabs = document.createElement('div')
            tabs.className = 'pnp-tabs'

            const tabButtons = [
                { id: 'p', label: 'P Problems', color: 'p' },
                { id: 'np', label: 'NP Problems', color: 'np' },
                { id: 'npc', label: 'NP-Complete', color: 'npc' }
            ]

            const tabContent = document.createElement('div')
            tabContent.className = 'pnp-tab-content'

            const showTab = (tabId) => {
                tabs.querySelectorAll('.pnp-tab-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.tab === tabId)
                })

                tabContent.innerHTML = ''
                let problemList
                if (tabId === 'p') {
                    problemList = PROBLEMS.p
                } else if (tabId === 'np') {
                    problemList = PROBLEMS.np
                } else {
                    problemList = PROBLEMS.npComplete
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
                btn.className = `pnp-tab-btn pnp-tab-${tab.color}`
                btn.textContent = tab.label
                btn.dataset.tab = tab.id
                btn.addEventListener('click', () => showTab(tab.id))
                tabs.appendChild(btn)
            })

            container.appendChild(tabs)
            container.appendChild(tabContent)

            showTab('p')

            return container
        }

        createProblemCard(problem, type) {
            const card = document.createElement('div')
            card.className = `pnp-problem-card pnp-problem-${type}`

            card.innerHTML = `
                <div class="pnp-problem-icon">${problem.icon}</div>
                <h5 class="pnp-problem-name">${problem.name}</h5>
                <p class="pnp-problem-description">${problem.description}</p>
                <div class="pnp-problem-complexity">
                    <div class="pnp-complexity-item">
                        <span class="pnp-complexity-label">Solve:</span>
                        <code>${problem.solveTime}</code>
                    </div>
                    <div class="pnp-complexity-item">
                        <span class="pnp-complexity-label">Verify:</span>
                        <code>${problem.verifyTime}</code>
                    </div>
                </div>
                <div class="pnp-problem-example">
                    <strong>Example:</strong> ${problem.example}
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
