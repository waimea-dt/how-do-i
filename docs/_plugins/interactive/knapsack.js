/**
 * docsify-knapsack.js - 0/1 Knapsack Problem Visualizer
 *
 * Visualizes three approaches to the 0/1 knapsack problem:
 *   - Brute Force: Exhaustive search through all subsets
 *   - Dynamic Programming: Builds optimal solution table
 *   - Greedy: Quick heuristic based on value/weight ratio
 *
 * Usage in markdown:
 *   <knapsack></knapsack>
 *   <knapsack capacity="10" items="2|3 3|4 4|5 5|8"></knapsack>
 *   <knapsack solve="dynamic" capacity="12"></knapsack>
 *   <knapsack solve="greedy" capacity="10" items="6|30 3|14 4|16 2|9"></knapsack>
 *   <knapsack solve="compare-dynamic" capacity="16"></knapsack>
 *   <knapsack solve="compare-greedy" capacity="10"></knapsack>
 */

;(function () {

    const { sleep, parsePositiveInt } = window.DocsifyUtils

    // =========================================================================
    // Configuration & Constants
    // =========================================================================

    const CONFIG = {
        DEFAULT_CAPACITY: 14,
        MIN_CAPACITY: 4,
        MAX_CAPACITY: 60,
        DEFAULT_ITEMS: '2|3 3|4 4|5 5|8 7|9 8|11',
        DEFAULT_GENERATED_ITEMS: 6,
        MIN_GENERATED_ITEMS: 3,
        MAX_GENERATED_ITEMS: 30,
        MIN_TILE_PX: 24,
        FALLBACK_TRACK_WIDTH: 400
    }

    const SOLVER_CONFIG = {
        brute: {
            title: 'Knapsack Solver: Brute Force, O(2<sup>n</sup>)',
            subtitle: 'Checks every subset. Perfect answer, explosive growth.',
            workLabel: 'Combinations to Check',
            calculateWork: (n, capacity) => Math.pow(2, n),
            formatWork: (work) => work >= 1000000 ? `${(work / 1000000).toFixed(1)}M` : formatNumber(work),
            primarySolver: 'brute',
            dependsOnCapacity: false,
            isComparison: false
        },
        dynamic: {
            title: 'Knapsack Solver: Dynamic Programming, O(n<sup>2</sup>)',
            subtitle: 'Builds an exact answer by filling a value table.',
            workLabel: 'Solutions to Check',
            calculateWork: (n, capacity) => n * capacity,
            formatWork: (work) => formatNumber(work),
            primarySolver: 'dynamic',
            dependsOnCapacity: true,
            isComparison: false
        },
        greedy: {
            title: 'Knapsack Solver: Greedy Ratio Heuristic, O(n log n)',
            subtitle: 'Picks by value per unit of weight. Fast, but not always best.',
            workLabel: 'Sorted Items to Pack',
            calculateWork: (n, capacity) => n,
            formatWork: (work) => work.toString(),
            primarySolver: 'greedy',
            dependsOnCapacity: false,
            isComparison: false
        },
        'compare-dynamic': {
            title: 'Knapsack Solver: Brute Force vs. Dynamic Programming',
            subtitle: 'Same optimal answer, different amount of work.',
            workLabel: 'Solutions to Check',
            calculateWork: (n, capacity) => n * capacity,
            formatWork: (work) => formatNumber(work),
            primarySolver: 'dynamic',
            dependsOnCapacity: true,
            isComparison: true
        },
        'compare-greedy': {
            title: 'Knapsack Solver: Brute Force vs. Greedy Heuristic',
            subtitle: 'Fast heuristic against guaranteed optimal search.',
            workLabel: 'Sorted Items to Pack',
            calculateWork: (n, capacity) => n,
            formatWork: (work) => work.toString(),
            primarySolver: 'greedy',
            dependsOnCapacity: false,
            isComparison: true
        }
    }

    const SPEED_PROFILES = {
        slow: {
            bruteDelay: 250,
            bruteUpdateMultiplier: 0,
            dynamicDelay: 250,
            greedyDelay: 250,
            instant: false
        },
        normal: {
            bruteDelay: 0,
            bruteUpdateMultiplier: 1,
            dynamicDelay: 0,
            greedyDelay: 0,
            instant: false
        },
        fast: {
            bruteDelay: 0,
            bruteUpdateMultiplier: 20,
            dynamicDelay: 0,
            greedyDelay: 0,
            instant: false
        },
        instant: {
            bruteDelay: 0,
            bruteUpdateMultiplier: 10000,
            dynamicDelay: 0,
            greedyDelay: 0,
            instant: true
        }
    }

    // =========================================================================
    // Utility Functions - General
    // =========================================================================

    function normaliseSolve(value) {
        const allowed = ['brute', 'dynamic', 'greedy', 'compare-dynamic', 'compare-greedy']
        return allowed.includes(value) ? value : 'brute'
    }

    function normaliseSpeed(value) {
        const allowed = ['slow', 'normal', 'fast', 'instant']
        return allowed.includes(value) ? value : 'normal'
    }

    function getSpeedProfile(speed) {
        return SPEED_PROFILES[speed] || SPEED_PROFILES.normal
    }

    function getItemLabel(index) {
        // A-Z for first 26 items
        if (index < 26) {
            return String.fromCharCode(65 + index)
        }
        // Greek letters for items 27-30
        const greekLetters = ['α', 'β', 'γ', 'δ']
        if (index < 30) {
            return greekLetters[index - 26]
        }
        // Wrap back to A for items beyond 30
        return String.fromCharCode(65 + (index % 26))
    }

    // =========================================================================
    // Utility Functions - Formatting
    // =========================================================================

    function formatNumber(value) {
        return Number(value || 0).toLocaleString()
    }

    function formatTime(ms) {
        if (!Number.isFinite(ms) || ms <= 0) return '< 1 ms'
        if (ms < 1000) return `${Math.round(ms)} ms`
        if (ms < 60000) return `${(ms / 1000).toFixed(1)} s`
        return `${(ms / 60000).toFixed(1)} mins`
    }

    function formatRatio(value) {
        return Number.isFinite(value) ? value.toFixed(2) : '0.00'
    }

    function describeSelection(result) {
        if (!result || result.selected.length === 0) return 'No items selected'
        const labels = result.selected.map(item => item.label).join(', ')
        return `${labels} | weight ${result.weight} | value ${result.value}`
    }

    // =========================================================================
    // Utility Functions - Items & Results
    // =========================================================================

    function parseItems(itemsAttr) {
        if (!itemsAttr || !itemsAttr.trim()) return []

        return itemsAttr
            .trim()
            .split(/\s+/)
            .map(token => token.split('|'))
            .map(([weight, value]) => ({
                weight: parseInt(weight, 10),
                value: parseInt(value, 10)
            }))
            .filter(item => Number.isFinite(item.weight) && item.weight > 0 && Number.isFinite(item.value) && item.value >= 0)
    }

    function enrichItems(items) {
        return items.map((item, index) => {
            const label = getItemLabel(index)
            return {
                id: index,
                label: label,
                name: `Item ${label}`,
                weight: item.weight,
                value: item.value,
                ratio: item.weight > 0 ? item.value / item.weight : 0
            }
        })
    }

    function generateItems(capacity, count = CONFIG.DEFAULT_GENERATED_ITEMS) {
        const items = []
        const maxWeight = Math.max(2, Math.floor(capacity * 0.45))

        for (let index = 0; index < count; index++) {
            const weight = 1 + Math.floor(Math.random() * maxWeight)
            const valueFloor = Math.max(2, Math.round(weight * (1.4 + Math.random() * 2.6)))
            const value = valueFloor + Math.floor(Math.random() * Math.max(3, Math.round(capacity * 0.15)))
            items.push({ weight, value })
        }

        return items
    }

    function cloneResult(result) {
        return {
            selected: [...(result?.selected || [])],
            weight: result?.weight || 0,
            value: result?.value || 0
        }
    }

    function createEmptyResult() {
        return { selected: [], weight: 0, value: 0 }
    }

    function scoreItems(items) {
        return items.reduce((acc, item) => {
            acc.weight += item.weight
            acc.value += item.value
            return acc
        }, { selected: [...items], weight: 0, value: 0 })
    }

    function isBetterResult(candidate, currentBest) {
        if (!candidate) return false
        if (!currentBest) return true
        if (candidate.value !== currentBest.value) return candidate.value > currentBest.value
        if (candidate.weight !== currentBest.weight) return candidate.weight < currentBest.weight
        return candidate.selected.length < currentBest.selected.length
    }

    // =========================================================================
    // Algorithm Configuration
    // =========================================================================

    function getBruteUpdateFrequency(total) {
        if (total > 625000) return 128
        if (total > 125000) return 64
        if (total > 25000) return 32
        if (total > 5000) return 16
        if (total > 1000) return 8
        if (total > 200) return 4
        if (total > 40) return 2
        return 1
    }

    function getDynamicUpdateFrequency(totalSteps) {
        if (totalSteps > 800) return 12
        if (totalSteps > 300) return 6
        if (totalSteps > 120) return 3
        return 1
    }

    // =========================================================================
    // UI Builder
    // =========================================================================

    function buildUI(capacity, items, solverMode, usesFixedItems, speed, showHistory) {
        const config = SOLVER_CONFIG[solverMode] || SOLVER_CONFIG.brute
        const showComparison = config.isComparison

        const wrapper = document.createElement('div')
        wrapper.className = 'knapsack-wrapper'
        wrapper.dataset.solverMode = solverMode

        wrapper.innerHTML = `
            <div class="knapsack-header">
                <h3 class="knapsack-title">${config.title}</h3>
                <p class="knapsack-subtitle">${config.subtitle}</p>
            </div>
            <div class="knapsack-content">
                <div class="knapsack-control-group">
                    <label class="knapsack-capacity-label">Backpack Capacity</label>
                    <div class="knapsack-capacity-inputs">
                        <input class="knapsack-capacity-range" type="range" min="${CONFIG.MIN_CAPACITY}" max="${CONFIG.MAX_CAPACITY}" value="${capacity}">
                        <input class="knapsack-capacity-number" type="number" min="${CONFIG.MIN_CAPACITY}" max="${CONFIG.MAX_CAPACITY}" step="1" value="${capacity}">
                    </div>
                    <label class="knapsack-items-label">Items Available (N)</label>
                    <div class="knapsack-items-inputs">
                        <input class="knapsack-items-range" type="range" min="${CONFIG.MIN_GENERATED_ITEMS}" max="${CONFIG.MAX_GENERATED_ITEMS}" value="${items.length}" ${usesFixedItems ? 'disabled' : ''}>
                        <input class="knapsack-items-number" type="number" min="${CONFIG.MIN_GENERATED_ITEMS}" max="${CONFIG.MAX_GENERATED_ITEMS}" step="1" value="${items.length}" ${usesFixedItems ? 'disabled' : ''}>
                    </div>
                    <span class="knapsack-combo-label knapsack-combinations-label">${config.workLabel}</span>
                    <span class="knapsack-combo-value knapsack-combinations-value">${config.formatWork(config.calculateWork(items.length, capacity))}</span>
                </div>

                <div class="knapsack-button-group">
                    <button class="knapsack-btn knapsack-btn-start btn-go">Start</button>
                    <button class="knapsack-btn knapsack-btn-stop btn-stop" disabled>Stop</button>
                    <button class="knapsack-btn knapsack-btn-secondary knapsack-btn-reset btn-reset">Reset</button>
                    <button class="knapsack-btn knapsack-btn-secondary knapsack-btn-randomise btn-shuffle" ${usesFixedItems ? 'disabled title="Uses fixed items from markdown"' : ''}></button>
                </div>

                <div class="knapsack-visualization">
                    <div class="knapsack-sacks">
                        <div class="knapsack-sack-card">
                            <div class="knapsack-sack-header">
                                <span>Best bag</span>
                                <span class="knapsack-sack-summary knapsack-best-summary">0 / ${capacity} weight | 0 value</span>
                            </div>
                            <div class="knapsack-sack-track knapsack-best-track"></div>
                        </div>
                        <div class="knapsack-sack-card">
                            <div class="knapsack-sack-header">
                                <span>Current bag</span>
                                <span class="knapsack-sack-summary knapsack-candidate-summary">0 / ${capacity} weight | 0 value</span>
                            </div>
                            <div class="knapsack-sack-track knapsack-candidate-track"></div>
                        </div>
                    </div>
                </div>

                <div class="knapsack-inventory">
                    <div class="knapsack-panel-title">Items to Select from</div>
                    <div class="knapsack-item-list"></div>
                </div>

                <div class="knapsack-stats">
                    <div class="knapsack-stat knapsack-stat-progress">
                        <div class="knapsack-stat-label">Progress</div>
                        <div class="knapsack-stat-value knapsack-progress-value">0 / 0</div>
                        <div class="knapsack-stat-status knapsack-progress-status">Ready</div>
                    </div>
                    <div class="knapsack-stat">
                        <div class="knapsack-stat-label">Compute time</div>
                        <div class="knapsack-stat-value knapsack-time-value">0 ms</div>
                    </div>
                    <div class="knapsack-stat">
                        <div class="knapsack-stat-label">Best value</div>
                        <div class="knapsack-stat-value knapsack-best-value">0</div>
                    </div>
                    <div class="knapsack-stat">
                        <div class="knapsack-stat-label">Best weight</div>
                        <div class="knapsack-stat-value knapsack-weight-value">0 / ${capacity}</div>
                    </div>
                </div>


                <div class="knapsack-comparison" ${showComparison ? '' : 'hidden'}>
                    <div class="knapsack-panel-title">Algorithm comparison</div>
                    <div class="knapsack-comparison-grid">
                        <div class="knapsack-comparison-item">
                            <div class="knapsack-comparison-label knapsack-left-label">Primary</div>
                            <div class="knapsack-comparison-value knapsack-left-value">-</div>
                            <div class="knapsack-comparison-meta knapsack-left-meta">-</div>
                        </div>
                        <div class="knapsack-comparison-item">
                            <div class="knapsack-comparison-label">Brute force</div>
                            <div class="knapsack-comparison-value knapsack-right-value">-</div>
                            <div class="knapsack-comparison-meta knapsack-right-meta">-</div>
                        </div>
                        <div class="knapsack-comparison-item is-summary">
                            <div class="knapsack-comparison-label">Difference</div>
                            <div class="knapsack-comparison-value knapsack-summary-value">-</div>
                            <div class="knapsack-comparison-meta knapsack-summary-meta">-</div>
                        </div>
                    </div>
                </div>

                <div class="knapsack-history" style="${showHistory ? '' : 'display:none;'}">
                    <div class="knapsack-panel-title">History</div>
                    <div class="knapsack-history-list"></div>
                </div>
            </div>
        `

        return wrapper
    }

    // =========================================================================
    // Solver Classes
    // =========================================================================

    class KnapsackSolverBase {
        stop() {
            this.running = false
        }
    }

    class KnapsackBruteForceSolver extends KnapsackSolverBase {
        constructor(items, capacity, onProgress, onComplete, updateMultiplier = 1) {
            super()
            this.items = items
            this.capacity = capacity
            this.onProgress = onProgress
            this.onComplete = onComplete
            this.total = 2 ** items.length
            if (!updateMultiplier || updateMultiplier === 0) {
                this.updateEvery = 1
            } else {
                this.updateEvery = Math.max(1, getBruteUpdateFrequency(this.total) * updateMultiplier)
            }
            this.running = false
        }

        async start() {
            this.running = true
            const startedAt = Date.now()
            let checked = 0
            let best = createEmptyResult()
            let bestMask = 0
            let actualComputeTime = 0


            // Detect instant mode by large updateEvery (10,000 or more)
            const isInstant = this.updateEvery >= 10000

            for (let mask = 0; mask < this.total; mask++) {
                if (!this.running) break

                const computeStartedAt = Date.now()

                const selected = []
                let weight = 0
                let value = 0

                for (let index = 0; index < this.items.length; index++) {
                    if ((mask & (1 << index)) !== 0) {
                        const item = this.items[index]
                        selected.push(item)
                        weight += item.weight
                        value += item.value
                    }
                }

                const current = { selected, weight, value }
                const feasible = weight <= this.capacity
                const improved = feasible && isBetterResult(current, best)

                if (improved) {
                    best = cloneResult(current)
                    bestMask = mask
                }

                actualComputeTime += Date.now() - computeStartedAt

                checked++

                if (improved || checked === this.total || checked % this.updateEvery === 0) {
                    await this.onProgress({
                        mask,
                        checked,
                        total: this.total,
                        current,
                        best: cloneResult(best),
                        feasible,
                        improved,
                        elapsedTime: Date.now() - startedAt,
                        actualComputeTime
                    })
                    // Yield to event loop in instant mode to keep UI responsive
                    if (isInstant) {
                        await sleep(0)
                    }
                }
            }

            if (this.running) {
                this.onComplete({
                    best: cloneResult(best),
                    bestMask,
                    checked,
                    total: this.total,
                    operations: checked,
                    elapsedTime: Date.now() - startedAt,
                    actualComputeTime
                })
            }

            this.running = false
        }
    }

    class KnapsackDynamicSolver extends KnapsackSolverBase {
        constructor(items, capacity, onProgress, onComplete) {
            super()
            this.items = items
            this.capacity = capacity
            this.onProgress = onProgress
            this.onComplete = onComplete
            this.running = false
            this.dp = []
            this.keep = []
        }

        reconstruct(row, capacity) {
            const selected = []
            let currentCapacity = capacity

            for (let itemIndex = row; itemIndex > 0; itemIndex--) {
                if (this.keep[itemIndex][currentCapacity]) {
                    const item = this.items[itemIndex - 1]
                    selected.push(item)
                    currentCapacity -= item.weight
                }
            }

            selected.reverse()
            return scoreItems(selected)
        }

        async start() {
            this.running = true
            const startedAt = Date.now()
            const rows = this.items.length + 1
            const cols = this.capacity + 1
            const totalOperations = this.items.length * this.capacity
            const updateEvery = getDynamicUpdateFrequency(totalOperations)

            this.dp = Array.from({ length: rows }, () => Array(cols).fill(0))
            this.keep = Array.from({ length: rows }, () => Array(cols).fill(false))

            let operations = 0
            let best = createEmptyResult()
            let actualComputeTime = 0

            for (let row = 1; row < rows; row++) {
                const item = this.items[row - 1]

                for (let col = 0; col < cols; col++) {
                    if (!this.running) break

                    const computeStartedAt = Date.now()

                    const skipValue = this.dp[row - 1][col]
                    const canTake = item.weight <= col
                    const takeValue = canTake ? item.value + this.dp[row - 1][col - item.weight] : Number.NEGATIVE_INFINITY

                    if (takeValue > skipValue) {
                        this.dp[row][col] = takeValue
                        this.keep[row][col] = true
                    } else {
                        this.dp[row][col] = skipValue
                    }

                    operations++
                    const currentBest = this.reconstruct(row, this.capacity)
                    if (isBetterResult(currentBest, best)) {
                        best = cloneResult(currentBest)
                    }

                    actualComputeTime += Date.now() - computeStartedAt

                    if (operations === totalOperations || operations % updateEvery === 0 || col === cols - 1) {
                        await this.onProgress({
                            row,
                            col,
                            currentItem: item,
                            operations,
                            totalOperations,
                            table: this.dp,
                            best: cloneResult(best),
                            elapsedTime: Date.now() - startedAt,
                            actualComputeTime
                        })
                    }
                }
            }

            if (this.running) {
                const finalBest = this.reconstruct(this.items.length, this.capacity)
                this.onComplete({
                    best: cloneResult(finalBest),
                    operations,
                    totalOperations,
                    table: this.dp,
                    elapsedTime: Date.now() - startedAt,
                    actualComputeTime
                })
            }

            this.running = false
        }
    }

    class KnapsackGreedySolver extends KnapsackSolverBase {
        constructor(items, capacity, onProgress, onComplete) {
            super()
            this.capacity = capacity
            this.items = [...items].sort((left, right) => {
                if (right.ratio !== left.ratio) return right.ratio - left.ratio
                if (right.value !== left.value) return right.value - left.value
                return left.weight - right.weight
            })
            this.onProgress = onProgress
            this.onComplete = onComplete
            this.running = false
        }

        async start() {
            this.running = true
            const startedAt = Date.now()
            const selected = []
            const rejectedIds = new Set()
            let best = createEmptyResult()
            let actualComputeTime = 0

            for (let index = 0; index < this.items.length; index++) {
                if (!this.running) break

                const computeStartedAt = Date.now()

                const item = this.items[index]
                const nextWeight = best.weight + item.weight
                const take = nextWeight <= this.capacity

                if (take) {
                    selected.push(item)
                    best = scoreItems(selected)
                } else {
                    rejectedIds.add(item.id)
                }

                actualComputeTime += Date.now() - computeStartedAt

                await this.onProgress({
                    step: index + 1,
                    totalSteps: this.items.length,
                    currentItem: item,
                    decision: take ? 'take' : 'skip',
                    best: cloneResult(best),
                    rankedItems: this.items,
                    rejectedIds: new Set(rejectedIds),
                    elapsedTime: Date.now() - startedAt,
                    actualComputeTime
                })
            }

            if (this.running) {
                this.onComplete({
                    best: cloneResult(best),
                    operations: this.items.length,
                    totalOperations: this.items.length,
                    rankedItems: this.items,
                    rejectedIds,
                    elapsedTime: Date.now() - startedAt,
                    actualComputeTime
                })
            }

            this.running = false
        }
    }

    // =========================================================================
    // Main Widget Class
    // =========================================================================

    class KnapsackWidget {
        constructor(el) {
            this.el = el
            this.capacity = Math.max(CONFIG.MIN_CAPACITY, Math.min(CONFIG.MAX_CAPACITY, parsePositiveInt(el.getAttribute('capacity'), CONFIG.DEFAULT_CAPACITY)))
            this.solveMode = normaliseSolve(el.getAttribute('solve') || 'brute')
            this.speed = normaliseSpeed(el.getAttribute('speed') || 'normal')
            this.speedProfile = getSpeedProfile(this.speed)
            this.usesFixedItems = el.hasAttribute('items')
            this.showHistory = el.hasAttribute('history')

            const parsedItems = this.usesFixedItems
                ? parseItems(el.getAttribute('items'))
                : parseItems(CONFIG.DEFAULT_ITEMS)

            const fallbackItems = parsedItems.length > 0 ? parsedItems : generateItems(this.capacity)
            this.initialItems = enrichItems(fallbackItems)
            if (!this.usesFixedItems && !el.hasAttribute('items')) {
                this.initialItems = enrichItems(generateItems(this.capacity, CONFIG.DEFAULT_GENERATED_ITEMS))
            }

            this.itemCount = this.initialItems.length
            this.items = this.initialItems.map(item => ({ ...item }))
            this.wrapper = buildUI(this.capacity, this.items, this.solveMode, this.usesFixedItems, this.speed, this.showHistory)
            this.el.innerHTML = ''
            this.el.appendChild(this.wrapper)

            this.startBtn = this.wrapper.querySelector('.knapsack-btn-start')
            this.stopBtn = this.wrapper.querySelector('.knapsack-btn-stop')
            this.resetBtn = this.wrapper.querySelector('.knapsack-btn-reset')
            this.randomiseBtn = this.wrapper.querySelector('.knapsack-btn-randomise')
            this.capacityValueEl = this.wrapper.querySelector('.knapsack-capacity-value')
            this.capacityRange = this.wrapper.querySelector('.knapsack-capacity-range')
            this.capacityNumber = this.wrapper.querySelector('.knapsack-capacity-number')
            this.itemsControl = this.wrapper.querySelector('.knapsack-items-control')
            this.itemsRange = this.wrapper.querySelector('.knapsack-items-range')
            this.itemsNumber = this.wrapper.querySelector('.knapsack-items-number')
            this.combinationsLabel = this.wrapper.querySelector('.knapsack-combinations-label')
            this.combinationsValue = this.wrapper.querySelector('.knapsack-combinations-value')
            this.progressStatus = this.wrapper.querySelector('.knapsack-progress-status')
            this.candidateTrack = this.wrapper.querySelector('.knapsack-candidate-track')
            this.bestTrack = this.wrapper.querySelector('.knapsack-best-track')
            this.candidateSummary = this.wrapper.querySelector('.knapsack-candidate-summary')
            this.bestSummary = this.wrapper.querySelector('.knapsack-best-summary')
            this.itemList = this.wrapper.querySelector('.knapsack-item-list')
            this.progressValue = this.wrapper.querySelector('.knapsack-progress-value')
            this.bestValue = this.wrapper.querySelector('.knapsack-best-value')
            this.weightValue = this.wrapper.querySelector('.knapsack-weight-value')
            this.timeValue = this.wrapper.querySelector('.knapsack-time-value')
            this.historyList = this.wrapper.querySelector('.knapsack-history-list')
            this.comparison = this.wrapper.querySelector('.knapsack-comparison')
            this.leftLabel = this.wrapper.querySelector('.knapsack-left-label')
            this.leftValue = this.wrapper.querySelector('.knapsack-left-value')
            this.leftMeta = this.wrapper.querySelector('.knapsack-left-meta')
            this.rightValue = this.wrapper.querySelector('.knapsack-right-value')
            this.rightMeta = this.wrapper.querySelector('.knapsack-right-meta')
            this.summaryValue = this.wrapper.querySelector('.knapsack-summary-value')
            this.summaryMeta = this.wrapper.querySelector('.knapsack-summary-meta')

            this.solver = null
            this.bestResult = createEmptyResult()
            this.candidateResult = createEmptyResult()
            this.history = []
            this.currentDetailState = null
            this.inventoryState = {}
            this.stopRequested = false

            this.setupEventListeners()
            this.resetView()
        }

        setupEventListeners() {
            this.startBtn.addEventListener('click', async () => {
                if (this.solver && this.solver.running) return
                this.resetView()
                await this.run()
            })

            this.stopBtn.addEventListener('click', () => this.stop())
            this.resetBtn.addEventListener('click', () => this.resetView())

            this.randomiseBtn.addEventListener('click', () => {
                if (this.usesFixedItems) return
                this.items = enrichItems(generateItems(this.capacity, this.itemCount))
                this.initialItems = this.items.map(item => ({ ...item }))
                this.resetView()
            })

            // Item count controls (only for generated items)
            if (this.itemsRange && this.itemsNumber) {
                this.itemsRange.addEventListener('input', () => {
                    this.syncItemControls(this.itemsRange.value)
                })

                this.itemsNumber.addEventListener('input', () => {
                    this.syncItemControls(this.itemsNumber.value)
                })

                const applyItemCountChange = () => {
                    if (this.solver && this.solver.running) return

                    const nextItemCount = this.readItemCountFromControls()
                    if (nextItemCount === this.itemCount) {
                    this.progressStatus.textContent = 'Item count unchanged.'
                        return
                    }

                    this.itemCount = nextItemCount
                    this.syncItemControls(this.itemCount)
                    this.items = enrichItems(generateItems(this.capacity, this.itemCount))
                    this.initialItems = this.items.map(item => ({ ...item }))
                    this.resetView()
                    this.progressStatus.textContent = `Item count updated to ${this.itemCount}.`
                }

                this.itemsRange.addEventListener('change', applyItemCountChange)
                this.itemsNumber.addEventListener('change', applyItemCountChange)
            }

            this.capacityRange.addEventListener('input', () => {
                this.syncCapacityControls(this.capacityRange.value)
            })

            this.capacityNumber.addEventListener('input', () => {
                this.syncCapacityControls(this.capacityNumber.value)
            })

            const applyCapacityChange = () => {
                if (this.solver && this.solver.running) return

                const nextCapacity = this.readCapacityFromControls()
                if (nextCapacity === this.capacity) {
                    this.progressStatus.textContent = 'Capacity unchanged.'
                    return
                }

                this.capacity = nextCapacity
                this.syncCapacityControls(this.capacity)
                this.resetView()
                this.progressStatus.textContent = `Capacity updated to ${this.capacity}.`
            }

            this.capacityRange.addEventListener('change', applyCapacityChange)
            this.capacityNumber.addEventListener('change', applyCapacityChange)
        }

        setButtons(isRunning) {
            this.startBtn.disabled = isRunning
            this.stopBtn.disabled = !isRunning
            this.resetBtn.disabled = isRunning
            this.randomiseBtn.disabled = isRunning || this.usesFixedItems
            this.capacityRange.disabled = isRunning
            this.capacityNumber.disabled = isRunning

            if (this.itemsRange && this.itemsNumber) {
                this.itemsRange.disabled = isRunning || this.usesFixedItems
                this.itemsNumber.disabled = isRunning || this.usesFixedItems
            }
        }

        syncCapacityControls(value) {
            const safe = Math.max(CONFIG.MIN_CAPACITY, Math.min(CONFIG.MAX_CAPACITY, parsePositiveInt(value, this.capacity)))
            this.capacityRange.value = `${safe}`
            this.capacityNumber.value = `${safe}`

            this.weightValue.textContent = `${formatNumber(this.bestResult.weight)} / ${formatNumber(safe)}`
            this.renderTracks()

            // Update combinations display for modes that depend on capacity
            const solverConfig = SOLVER_CONFIG[this.solveMode] || SOLVER_CONFIG.brute
            if (solverConfig.dependsOnCapacity) {
                this.updateCombinationsDisplay(this.itemCount)
            }
        }

        readCapacityFromControls() {
            return Math.max(CONFIG.MIN_CAPACITY, Math.min(CONFIG.MAX_CAPACITY, parsePositiveInt(this.capacityNumber.value, this.capacity)))
        }

        syncItemControls(value) {
            if (!this.itemsRange || !this.itemsNumber) return
            const safe = Math.max(CONFIG.MIN_GENERATED_ITEMS, Math.min(CONFIG.MAX_GENERATED_ITEMS, parsePositiveInt(value, this.itemCount)))
            // --- ResizeObserver to refresh inventory tile widths on track resize ---
            if (window.ResizeObserver && this.bestTrack) {
                this._trackResizeObserver = new ResizeObserver(() => {
                    this.renderInventory()
                })
                this._trackResizeObserver.observe(this.bestTrack)
            }
            this.itemsRange.value = `${safe}`
            this.itemsNumber.value = `${safe}`
            this.updateCombinationsDisplay(safe)
        }

        readItemCountFromControls() {
            if (!this.itemsNumber) return this.itemCount
            return Math.max(CONFIG.MIN_GENERATED_ITEMS, Math.min(CONFIG.MAX_GENERATED_ITEMS, parsePositiveInt(this.itemsNumber.value, this.itemCount)))
        }

        updateCombinationsDisplay(n) {
            const solverConfig = SOLVER_CONFIG[this.solveMode] || SOLVER_CONFIG.brute

            this.combinationsLabel.textContent = solverConfig.workLabel
            const work = solverConfig.calculateWork(n, this.capacity)
            this.combinationsValue.textContent = solverConfig.formatWork(work)
        }

        stop() {
            this.stopRequested = true
            if (this.solver && this.solver.running) {
                this.solver.stop()
            }
            this.setButtons(false)
            this.progressStatus.textContent = 'Stopped'
        }

        addHistory(message) {
            if (!this.showHistory) return;
            this.history.unshift(message)
            this.history = this.history.slice(0, 24)
            this.historyList.innerHTML = this.history
                .map(entry => `<div class="knapsack-history-row">${entry}</div>`)
                .join('')
        }

        resetComparison() {
            if (!this.comparison) return
            this.leftLabel.textContent = this.solveMode === 'compare-dynamic' ? 'Dynamic programming' : 'Greedy'
            this.leftValue.textContent = '-'
            this.leftMeta.textContent = '-'
            this.rightValue.textContent = '-'
            this.rightMeta.textContent = '-'
            this.summaryValue.textContent = '-'
            this.summaryMeta.textContent = '-'
        }

        resetView() {
            if (this.solver && this.solver.running) {
                this.solver.stop()
            }

            this.bestResult = createEmptyResult()
            this.candidateResult = createEmptyResult()
            this.history = []
            this.currentDetailState = null
            this.inventoryState = {}
            this.historyList.innerHTML = ''
            this.syncCapacityControls(this.capacity)
            this.itemCount = this.items.length
            this.syncItemControls(this.itemCount)
            this.updateCombinationsDisplay(this.itemCount)
            this.progressStatus.textContent = 'Ready'
            this.progressValue.textContent = '0 / 0'
            this.bestValue.textContent = '0'
            this.weightValue.textContent = `0 / ${this.capacity}`
            this.timeValue.textContent = '0 ms'
            this.resetComparison()
            this.renderTracks()
            this.renderInventory()
            this.setButtons(false)
        }

        updateStats(progress, best, time) {
            this.progressValue.textContent = progress
            this.bestValue.textContent = formatNumber(best.value)
            this.weightValue.textContent = `${formatNumber(best.weight)} / ${formatNumber(this.capacity)}`
            this.timeValue.textContent = formatTime(time)
        }

        renderTracks(currentItemId = null, currentIsOverweight = false) {
            this.renderTrack(this.candidateTrack, this.candidateSummary, this.candidateResult, currentItemId, currentIsOverweight)
            this.renderTrack(this.bestTrack, this.bestSummary, this.bestResult)
        }

        renderTrack(track, summary, result, currentItemId = null, isOverweight = false) {
            const maxItemValue = Math.max(...this.items.map(item => item.value), 1)
            // Sort selected items by descending value
            const selected = (result?.selected || []).slice().sort((a, b) => b.value - a.value)
            const usedWeight = result?.weight || 0
            const value = result?.value || 0
            const remaining = Math.max(0, this.capacity - usedWeight)
            const overflow = Math.max(0, usedWeight - this.capacity)

            summary.textContent = `${formatNumber(usedWeight)} / ${formatNumber(this.capacity)} weight | ${formatNumber(value)} value`
            track.classList.toggle('is-overweight', isOverweight || overflow > 0)

            if (selected.length === 0) {
                track.innerHTML = `<div class="knapsack-empty-space" style="flex: 1 1 auto;">Empty bag</div>`
                return
            }

            const parts = selected.map(item => {
                const width = (item.weight / this.capacity) * 100
                return `
                    <div
                        class="knapsack-slice ${item.id === currentItemId ? 'is-current' : ''}"
                        style="--slice-width: ${width}; --slice-value: ${item.value}; --slice-max-value: ${maxItemValue};"
                        title="${item.name}: w${item.weight} · v${item.value} · r${formatRatio(item.ratio)}">
                        <div class="knapsack-slice-name">${item.label}</div>
                    </div>
                `
            })

            if (remaining > 0) {
                parts.push(`<div class="knapsack-free-space" style="flex: 0 0 ${(remaining / this.capacity) * 100}%">${remaining} free</div>`)
            }

            if (overflow > 0) {
                parts.push(`<div class="knapsack-overflow-space" style="flex: 0 0 ${(overflow / this.capacity) * 100}%">+${overflow}</div>`)
            }

            track.innerHTML = parts.join('')
        }

        renderInventory(extraState = {}) {
            this.inventoryState = {
                ...this.inventoryState,
                ...extraState
            }

            const {
                candidateIds = new Set(),
                bestIds = new Set(this.bestResult.selected.map(item => item.id)),
                rejectedIds = new Set(),
                currentId = null,
                orderMap = new Map(),
                decisions = new Map()
            } = this.inventoryState

            const maxItemValue = Math.max(...this.items.map(item => item.value), 1)
            const capacity = this.capacity

            // Get track width for proportional tile sizing
            let trackWidth = CONFIG.FALLBACK_TRACK_WIDTH
            if (this.bestTrack && this.bestTrack.offsetWidth) {
                trackWidth = this.bestTrack.offsetWidth
            } else if (this.candidateTrack && this.candidateTrack.offsetWidth) {
                trackWidth = this.candidateTrack.offsetWidth
            }

            const MIN_TILE_PX = CONFIG.MIN_TILE_PX
            const MAX_TILE_PX = Math.max(44, trackWidth)

            this.itemList.innerHTML = this.items.map(item => {
                const isBest = bestIds.has(item.id)
                const isCandidate = candidateIds.has(item.id)
                const isRejected = rejectedIds.has(item.id)
                const isCurrent = currentId === item.id
                const order = orderMap.get(item.id)
                const decision = decisions.get(item.id)

                const indicators = []
                if (isBest) indicators.push('★')
                if (isCandidate) indicators.push('●')
                if (isCurrent) indicators.push('◆')
                if (order != null) indicators.push(`${order + 1}`)

                const classes = [
                    'knapsack-item-tile',
                    isBest && 'is-best',
                    isCandidate && 'is-candidate',
                    isCurrent && 'is-current',
                    isRejected && 'is-rejected',
                    decision === 'take' && 'is-take',
                    decision === 'skip' && 'is-skip'
                ].filter(Boolean).join(' ')

                // Width proportional to weight/capacity * trackWidth
                let tileWidth = Math.round((item.weight / capacity) * trackWidth)
                if (!Number.isFinite(tileWidth) || tileWidth < MIN_TILE_PX) tileWidth = MIN_TILE_PX
                if (tileWidth > trackWidth) tileWidth = trackWidth

                const title = `${item.name}: w${item.weight} · v${item.value} · r${formatRatio(item.ratio)}`

                const text = tileWidth < 50
                    ? `<div class="knapsack-item-tile-label">${item.label}</div>`
                    : `<div class="knapsack-item-tile-label">${item.label}</div><div class="knapsack-item-tile-stats"><span>w<strong>${item.weight}</strong></span><span>v<strong>${item.value}</strong></span><span>r<strong>${formatRatio(item.ratio)}</strong></span></div>`

                return `
                    <div
                        class="${classes}" title="${title}" style="--slice-value: ${item.value}; --slice-max-value: ${maxItemValue}; width: ${tileWidth}px;">
                        ${text}
                        ${indicators.length > 0 ? `<div class="knapsack-item-tile-indicator">${indicators.join(' ')}</div>` : ''}
                    </div>
                `
            }).join('')
        }





        updateComparisonPrimary(label, result, operations, elapsedTime) {
            this.leftLabel.textContent = label
            this.leftValue.textContent = `v${result.value} | w${result.weight}`
            this.leftMeta.textContent = `${formatNumber(operations)} ops | ${formatTime(elapsedTime)}`
        }

        updateComparisonBrute(result, operations, elapsedTime) {
            this.rightValue.textContent = `v${result.value} | w${result.weight}`
            this.rightMeta.textContent = `${formatNumber(operations)} ops | ${formatTime(elapsedTime)}`
        }

        updateComparisonSummary(primaryLabel, primaryResult, primaryOps, primaryTime, bruteResult, bruteOps, bruteTime) {
            const valueDiff = bruteResult.value - primaryResult.value
            const opRatio = primaryOps > 0 ? bruteOps / primaryOps : 0
            const timeRatio = primaryTime > 0 ? bruteTime / primaryTime : 0
            const hasMeaningfulTimeGap = primaryTime >= 1 && bruteTime >= 1 && Number.isFinite(timeRatio) && timeRatio >= 0.1

            if (valueDiff === 0) {
                this.summaryValue.textContent = 'Same best value'
                this.summaryMeta.textContent = `${primaryLabel} reached optimal. ${opRatio.toFixed(1)}x fewer brute-force states.`
                return
            }

            const pct = bruteResult.value > 0 ? ((valueDiff / bruteResult.value) * 100).toFixed(1) : '0.0'
            this.summaryValue.textContent = `${valueDiff} value short`
            this.summaryMeta.textContent = hasMeaningfulTimeGap
                ? `${primaryLabel} was ${pct}% below optimal. Brute force took ${timeRatio.toFixed(1)}x as long.`
                : `${primaryLabel} was ${pct}% below optimal. Brute force checked ${opRatio.toFixed(1)}x more states.`
        }

        async run() {
            this.stopRequested = false

            this.bestResult = createEmptyResult()
            this.candidateResult = createEmptyResult()
            this.history = []
            this.historyList.innerHTML = ''
            this.resetComparison()
            this.renderTracks()
            this.renderInventory({
                candidateIds: new Set(),
                bestIds: new Set(),
                rejectedIds: new Set(),
                currentId: null,
                orderMap: new Map(),
                decisions: new Map()
            })

            this.setButtons(true)

            try {
                if (this.solveMode === 'dynamic') {
                    await this.runDynamic()
                } else if (this.solveMode === 'greedy') {
                    await this.runGreedy()
                } else if (this.solveMode === 'compare-dynamic') {
                    await this.runCompareDynamic()
                } else if (this.solveMode === 'compare-greedy') {
                    await this.runCompareGreedy()
                } else {
                    await this.runBruteForce()
                }
            } finally {
                this.setButtons(false)
            }
        }

        async runBruteForce() {
            let lastBestValue = -1
            let finalResult = null

            // For instant mode, yield every 10k, no visualization
            const isInstant = this.speedProfile.instant === true
            const updateMultiplier = isInstant ? 10000 : this.speedProfile.bruteUpdateMultiplier


            this.solver = new KnapsackBruteForceSolver(
                this.items,
                this.capacity,
                async progress => {
                    if (!isInstant) {
                        this.candidateResult = cloneResult(progress.current)
                        this.bestResult = cloneResult(progress.best)
                        const lastItem = progress.current.selected.length > 0
                            ? progress.current.selected[progress.current.selected.length - 1]
                            : null;
                        this.renderTracks(lastItem ? lastItem.id : null, !progress.feasible)
                        this.renderInventory({
                            candidateIds: new Set(progress.current.selected.map(item => item.id)),
                            bestIds: new Set(progress.best.selected.map(item => item.id)),
                            rejectedIds: progress.feasible ? new Set() : new Set(progress.current.selected.map(item => item.id)),
                            currentId: null,
                            orderMap: new Map(),
                            decisions: new Map()
                        })
                    }

                    this.updateStats(`${formatNumber(progress.checked)} / ${formatNumber(progress.total)}`, progress.best, progress.actualComputeTime)
                    this.progressStatus.textContent = progress.feasible
                        ? `Checking subset ${formatNumber(progress.checked)} of ${formatNumber(progress.total)}`
                        : `Subset ${formatNumber(progress.checked)} is overweight`

                    if (progress.improved && progress.best.value > lastBestValue) {
                        lastBestValue = progress.best.value
                        this.addHistory(`New best: <strong>${describeSelection(progress.best)}</strong>`)
                    }

                    if (!isInstant) {
                        await sleep(this.speedProfile.bruteDelay)
                    }
                },
                result => {
                    finalResult = result
                    this.bestResult = cloneResult(result.best)
                    // Clear candidate (current) bag and stats
                    this.candidateResult = createEmptyResult()
                    // Always render the final best bag and inventory at the end
                    this.renderTracks()
                    this.renderInventory({
                        candidateIds: new Set(result.best.selected.map(item => item.id)),
                        bestIds: new Set(result.best.selected.map(item => item.id)),
                        rejectedIds: new Set(),
                        currentId: null
                    })
                    this.updateStats(`${formatNumber(result.total)} / ${formatNumber(result.total)}`, result.best, result.actualComputeTime)
                    this.progressStatus.textContent = `Complete. Best bag value ${result.best.value}.`
                    this.addHistory(`Complete: <strong>${describeSelection(result.best)}</strong>`)
                    this.setButtons(false)
                },
                updateMultiplier
            )

            await this.solver.start()
            return this.stopRequested ? null : finalResult
        }

        async runDynamic() {
            let lastBestValue = -1
            let finalResult = null

            this.solver = new KnapsackDynamicSolver(
                this.items,
                this.capacity,
                async progress => {
                    this.bestResult = cloneResult(progress.best)
                    this.candidateResult = cloneResult(progress.best)
                    this.renderTracks(progress.currentItem.id)
                    // this.renderDynamicDetail(progress)
                    this.updateStats(`${formatNumber(progress.operations)} / ${formatNumber(progress.totalOperations)}`, progress.best, progress.actualComputeTime)
                    this.progressStatus.textContent = `Filling row ${progress.row}, capacity ${progress.col}`

                    if (progress.best.value > lastBestValue) {
                        lastBestValue = progress.best.value
                        this.addHistory(`Table improved: <strong>${describeSelection(progress.best)}</strong>`)
                    }

                    const dynamicDelay = progress.totalOperations <= 300 ? this.speedProfile.dynamicDelay : Math.floor(this.speedProfile.dynamicDelay / 2)
                    await sleep(dynamicDelay)
                },
                result => {
                    finalResult = result
                    this.bestResult = cloneResult(result.best)
                    // Clear candidate (current) bag and stats
                    this.candidateResult = createEmptyResult()
                    this.renderTracks()
                    this.renderInventory({
                        currentId: null,
                        candidateIds: new Set(result.best.selected.map(item => item.id)),
                        bestIds: new Set(result.best.selected.map(item => item.id))
                    })
                    // this.renderDynamicDetail({
                    //     row: this.items.length,
                    //     col: this.capacity,
                    //     currentItem: this.items[this.items.length - 1],
                    //     table: result.table,
                    //     best: result.best
                    // })
                    this.updateStats(`${formatNumber(result.totalOperations)} / ${formatNumber(result.totalOperations)}`, result.best, result.actualComputeTime)
                    this.progressStatus.textContent = `Complete. Optimal value ${result.best.value}.`
                    this.addHistory(`Complete: <strong>${describeSelection(result.best)}</strong>`)
                    this.setButtons(false)
                }
            )

            await this.solver.start()
            return this.stopRequested ? null : finalResult
        }

        async runGreedy() {
            let finalResult = null

            this.solver = new KnapsackGreedySolver(
                this.items,
                this.capacity,
                async progress => {
                    this.bestResult = cloneResult(progress.best)
                    this.candidateResult = cloneResult(progress.best)
                    this.renderTracks(progress.currentItem.id)
                    // this.renderGreedyDetail(progress)
                    this.updateStats(`${formatNumber(progress.step)} / ${formatNumber(progress.totalSteps)}`, progress.best, progress.actualComputeTime)
                    this.progressStatus.textContent = progress.decision === 'take'
                        ? `Taking ${progress.currentItem.name}`
                        : `Skipping ${progress.currentItem.name}`
                    this.addHistory(`${progress.decision === 'take' ? 'Take' : 'Skip'} <strong>${progress.currentItem.label}</strong> -> ${describeSelection(progress.best)}`)
                    await sleep(this.speedProfile.greedyDelay)
                },
                result => {
                    finalResult = result
                    this.bestResult = cloneResult(result.best)
                    // Clear candidate (current) bag and stats
                    this.candidateResult = createEmptyResult()
                    this.renderTracks()
                    this.renderInventory({
                        candidateIds: new Set(result.best.selected.map(item => item.id)),
                        bestIds: new Set(result.best.selected.map(item => item.id)),
                        rejectedIds: result.rejectedIds,
                        currentId: null,
                        orderMap: new Map(result.rankedItems.map((item, index) => [item.id, index])),
                        decisions: new Map(result.rankedItems.map(item => {
                            if (result.best.selected.some(selected => selected.id === item.id)) return [item.id, 'take']
                            if (result.rejectedIds.has(item.id)) return [item.id, 'skip']
                            return [item.id, null]
                        }))
                    })
                    this.updateStats(`${formatNumber(result.totalOperations)} / ${formatNumber(result.totalOperations)}`, result.best, result.actualComputeTime)
                    this.progressStatus.textContent = `Complete. Greedy value ${result.best.value}.`
                    this.addHistory(`Complete: <strong>${describeSelection(result.best)}</strong>`)
                    this.setButtons(false)
                }
            )

            await this.solver.start()
            return this.stopRequested ? null : finalResult
        }

        async runCompareDynamic() {
            const dynamicPhase = await this.runDynamic()
            if (!dynamicPhase || this.stopRequested) {
                this.setButtons(false)
                return
            }

            const dynamicResult = cloneResult(dynamicPhase.best)
            const dynamicOperations = dynamicPhase.totalOperations
            const dynamicTime = dynamicPhase.actualComputeTime

            this.updateComparisonPrimary('Dynamic programming', dynamicResult, dynamicOperations, dynamicTime)
            this.addHistory('Starting brute force for comparison')

            const brutePhase = await this.runBruteForce()
            if (!brutePhase || this.stopRequested) {
                this.setButtons(false)
                return
            }

            const bruteResult = cloneResult(brutePhase.best)
            const bruteOperations = brutePhase.operations
            const bruteTime = brutePhase.actualComputeTime

            this.updateComparisonPrimary('Dynamic programming', dynamicResult, dynamicOperations, dynamicTime)
            this.updateComparisonBrute(bruteResult, bruteOperations, bruteTime)
            this.updateComparisonSummary('Dynamic programming', dynamicResult, dynamicOperations, dynamicTime, bruteResult, bruteOperations, bruteTime)
            this.summaryMeta.textContent = `Dynamic table used ${formatNumber(dynamicOperations)} states. Brute force checked ${formatNumber(bruteOperations)} subsets.`
            this.progressStatus.textContent = 'Comparison complete. Dynamic matched optimal with fewer states.'
            this.setButtons(false)
        }

        async runCompareGreedy() {
            const greedyPhase = await this.runGreedy()
            if (!greedyPhase || this.stopRequested) {
                this.setButtons(false)
                return
            }

            const greedyResult = cloneResult(greedyPhase.best)
            const greedyOperations = greedyPhase.operations
            const greedyTime = greedyPhase.actualComputeTime

            this.updateComparisonPrimary('Greedy', greedyResult, greedyOperations, greedyTime)
            this.addHistory('Starting brute force for comparison')

            const brutePhase = await this.runBruteForce()
            if (!brutePhase || this.stopRequested) {
                this.setButtons(false)
                return
            }

            const bruteResult = cloneResult(brutePhase.best)
            const bruteOperations = brutePhase.operations
            const bruteTime = brutePhase.actualComputeTime

            this.updateComparisonBrute(bruteResult, bruteOperations, bruteTime)
            this.updateComparisonSummary('Greedy', greedyResult, greedyOperations, greedyTime, bruteResult, bruteOperations, bruteTime)
            this.progressStatus.textContent = 'Comparison complete. Greedy speed against optimal quality.'
            this.setButtons(false)
        }
    }

    function processKnapsack() {
        document.querySelectorAll('.markdown-section knapsack').forEach(el => {
            new KnapsackWidget(el)
        })
    }

    const docsifyKnapsack = function (hook) {
        hook.doneEach(processKnapsack)
    }

    window.DocsifyUtils.registerPlugin(docsifyKnapsack)
})()
