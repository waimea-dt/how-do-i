/**
 * knapsack.js - 0/1 knapsack solver visualiser
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

    const DEFAULT_CAPACITY = 14
    const MIN_CAPACITY = 4
    const MAX_CAPACITY = 60
    const DEFAULT_ITEMS = '2|3 3|4 4|5 5|8 7|9 8|11'
    const DEFAULT_GENERATED_ITEMS = 6
    const MAX_BRUTE_ITEMS = 18
    const SMALL_TREE_MAX_ITEMS = 8

    function sleep(ms = 0) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    function parsePositiveInt(value, fallback) {
        const parsed = parseInt(value ?? '', 10)
        return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
    }

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

    function normaliseSolve(value) {
        const allowed = ['brute', 'dynamic', 'greedy', 'compare-dynamic', 'compare-greedy']
        return allowed.includes(value) ? value : 'brute'
    }

    function normaliseSpeed(value) {
        const allowed = ['slow', 'normal', 'fast', 'instant']
        return allowed.includes(value) ? value : 'normal'
    }

    function getSpeedProfile(speed) {
        const profiles = {
            slow: {
                bruteDelay: 30,
                bruteUpdateMultiplier: 1,
                dynamicDelay: 140,
                greedyDelay: 520
            },
            normal: {
                bruteDelay: 0,
                bruteUpdateMultiplier: 1,
                dynamicDelay: 70,
                greedyDelay: 320
            },
            fast: {
                bruteDelay: 0,
                bruteUpdateMultiplier: 4,
                dynamicDelay: 0,
                greedyDelay: 140
            },
            instant: {
                bruteDelay: 0,
                bruteUpdateMultiplier: 16,
                dynamicDelay: 0,
                greedyDelay: 0
            }
        }

        return profiles[speed] || profiles.normal
    }

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
        return items.map((item, index) => ({
            id: index,
            label: String.fromCharCode(65 + (index % 26)),
            name: `Item ${String.fromCharCode(65 + (index % 26))}`,
            weight: item.weight,
            value: item.value,
            ratio: item.weight > 0 ? item.value / item.weight : 0
        }))
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

    function generateItems(capacity, count = DEFAULT_GENERATED_ITEMS) {
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

    function getBruteUpdateFrequency(total) {
        if (total > 200000) return 2048
        if (total > 40000) return 512
        if (total > 10000) return 128
        if (total > 2000) return 32
        if (total > 400) return 8
        return 1
    }

    function getDynamicUpdateFrequency(totalSteps) {
        if (totalSteps > 800) return 12
        if (totalSteps > 300) return 6
        if (totalSteps > 120) return 3
        return 1
    }

    function describeSelection(result) {
        if (!result || result.selected.length === 0) return 'No items selected'
        const labels = result.selected.map(item => item.label).join(', ')
        return `${labels} | weight ${result.weight} | value ${result.value}`
    }

    function getItemColour(item, maxValue) {
        const strength = maxValue > 0 ? item.value / maxValue : 0
        const hue = 190 - Math.round(strength * 28)
        const saturation = 68 + Math.round(strength * 10)
        const lightness = 62 - Math.round(strength * 22)
        return `hsl(${hue} ${saturation}% ${lightness}%)`
    }

    function buildUI(capacity, items, solverMode, usesFixedItems, speed) {
        const titles = {
            brute: {
                title: 'Knapsack Solver: Brute Force',
                subtitle: 'Checks every subset. Perfect answer, explosive growth.'
            },
            dynamic: {
                title: 'Knapsack Solver: Dynamic Programming',
                subtitle: 'Builds an exact answer by filling a value table.'
            },
            greedy: {
                title: 'Knapsack Solver: Greedy Ratio Heuristic',
                subtitle: 'Picks by value per unit of weight. Fast, but not always best.'
            },
            'compare-dynamic': {
                title: 'Knapsack Solver: Dynamic vs. Brute Force',
                subtitle: 'Same optimal answer, different amount of work.'
            },
            'compare-greedy': {
                title: 'Knapsack Solver: Greedy vs. Brute Force',
                subtitle: 'Fast heuristic against guaranteed optimal search.'
            }
        }

        const copy = titles[solverMode] || titles.brute
        const showComparison = solverMode.startsWith('compare-')

        const wrapper = document.createElement('div')
        wrapper.className = 'knapsack-wrapper'
        wrapper.dataset.solverMode = solverMode

        wrapper.innerHTML = `
            <div class="knapsack-header">
                <h3 class="knapsack-title">${copy.title}</h3>
                <p class="knapsack-subtitle">${copy.subtitle}</p>
            </div>
            <div class="knapsack-content">
                <div class="knapsack-control-group">
                    <div class="knapsack-pill">
                        <span class="knapsack-pill-label">Capacity</span>
                        <span class="knapsack-pill-value knapsack-capacity-value">${capacity}</span>
                    </div>
                    <div class="knapsack-pill">
                        <span class="knapsack-pill-label">Items</span>
                        <span class="knapsack-pill-value knapsack-items-count">${items.length}</span>
                    </div>
                    <div class="knapsack-pill">
                        <span class="knapsack-pill-label">Mode</span>
                        <span class="knapsack-pill-value">${solverMode}</span>
                    </div>
                    <div class="knapsack-pill">
                        <span class="knapsack-pill-label">Speed</span>
                        <span class="knapsack-pill-value knapsack-speed-value">${speed}</span>
                    </div>
                    <div class="knapsack-capacity-control">
                        <label class="knapsack-capacity-label">Adjust capacity</label>
                        <div class="knapsack-capacity-inputs">
                            <input class="knapsack-capacity-range" type="range" min="${MIN_CAPACITY}" max="${MAX_CAPACITY}" value="${capacity}">
                            <input class="knapsack-capacity-number" type="number" min="${MIN_CAPACITY}" max="${MAX_CAPACITY}" step="1" value="${capacity}">
                        </div>
                    </div>
                </div>

                <div class="knapsack-button-group">
                    <button class="knapsack-btn knapsack-btn-start">Start</button>
                    <button class="knapsack-btn knapsack-btn-stop" disabled>Stop</button>
                    <button class="knapsack-btn knapsack-btn-secondary knapsack-btn-reset">Reset</button>
                    <button class="knapsack-btn knapsack-btn-secondary knapsack-btn-randomise" ${usesFixedItems ? 'disabled title="Uses fixed items from markdown"' : ''}>Randomise</button>
                </div>

                <div class="knapsack-visualization">
                    <div class="knapsack-status">Ready</div>
                    <div class="knapsack-sacks">
                        <div class="knapsack-sack-card">
                            <div class="knapsack-sack-header">
                                <span>Current bag</span>
                                <span class="knapsack-sack-summary knapsack-candidate-summary">0 / ${capacity} weight | 0 value</span>
                            </div>
                            <div class="knapsack-sack-track knapsack-candidate-track"></div>
                        </div>
                        <div class="knapsack-sack-card">
                            <div class="knapsack-sack-header">
                                <span>Best bag</span>
                                <span class="knapsack-sack-summary knapsack-best-summary">0 / ${capacity} weight | 0 value</span>
                            </div>
                            <div class="knapsack-sack-track knapsack-best-track"></div>
                        </div>
                    </div>
                    <div class="knapsack-legend">Slice width = weight. Deeper slice colour = higher value.</div>
                </div>

                <div class="knapsack-inventory">
                    <div class="knapsack-panel-title">Items</div>
                    <div class="knapsack-editor-toolbar">
                        <button class="knapsack-btn knapsack-btn-secondary knapsack-btn-editor-add">Add item</button>
                        <button class="knapsack-btn knapsack-btn-secondary knapsack-btn-editor-apply">Apply edits</button>
                    </div>
                    <div class="knapsack-editor-wrap">
                        <table class="knapsack-editor-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Weight</th>
                                    <th>Value</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody class="knapsack-editor-body"></tbody>
                        </table>
                    </div>
                    <div class="knapsack-item-list"></div>
                </div>

                <div class="knapsack-stats">
                    <div class="knapsack-stat">
                        <div class="knapsack-stat-label">Progress</div>
                        <div class="knapsack-stat-value knapsack-progress-value">0 / 0</div>
                    </div>
                    <div class="knapsack-stat">
                        <div class="knapsack-stat-label">Best value</div>
                        <div class="knapsack-stat-value knapsack-best-value">0</div>
                    </div>
                    <div class="knapsack-stat">
                        <div class="knapsack-stat-label">Best weight</div>
                        <div class="knapsack-stat-value knapsack-weight-value">0 / ${capacity}</div>
                    </div>
                    <div class="knapsack-stat">
                        <div class="knapsack-stat-label">Compute time</div>
                        <div class="knapsack-stat-value knapsack-time-value">0 ms</div>
                    </div>
                </div>

                <div class="knapsack-detail">
                    <div class="knapsack-panel-title knapsack-detail-title">Solver view</div>
                    <div class="knapsack-detail-body"></div>
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

                <div class="knapsack-history">
                    <div class="knapsack-panel-title">History</div>
                    <div class="knapsack-history-list"></div>
                </div>
            </div>
        `

        return wrapper
    }

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
            this.updateEvery = Math.max(1, getBruteUpdateFrequency(this.total) * updateMultiplier)
            this.running = false
        }

        async start() {
            this.running = true
            const startedAt = Date.now()
            let checked = 0
            let best = createEmptyResult()
            let bestMask = 0
            let actualComputeTime = 0

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

    class KnapsackWidget {
        constructor(el) {
            this.el = el
            this.capacity = Math.max(MIN_CAPACITY, Math.min(MAX_CAPACITY, parsePositiveInt(el.getAttribute('capacity'), DEFAULT_CAPACITY)))
            this.solveMode = normaliseSolve(el.getAttribute('solve') || 'brute')
            this.speed = normaliseSpeed(el.getAttribute('speed') || 'normal')
            this.speedProfile = getSpeedProfile(this.speed)
            this.usesFixedItems = el.hasAttribute('items')

            const parsedItems = this.usesFixedItems
                ? parseItems(el.getAttribute('items'))
                : parseItems(DEFAULT_ITEMS)

            const fallbackItems = parsedItems.length > 0 ? parsedItems : generateItems(this.capacity)
            this.initialItems = enrichItems(fallbackItems)
            if (!this.usesFixedItems && !el.hasAttribute('items')) {
                this.initialItems = enrichItems(generateItems(this.capacity, DEFAULT_GENERATED_ITEMS))
            }

            this.items = this.initialItems.map(item => ({ ...item }))
            this.wrapper = buildUI(this.capacity, this.items, this.solveMode, this.usesFixedItems, this.speed)
            this.el.innerHTML = ''
            this.el.appendChild(this.wrapper)

            this.startBtn = this.wrapper.querySelector('.knapsack-btn-start')
            this.stopBtn = this.wrapper.querySelector('.knapsack-btn-stop')
            this.resetBtn = this.wrapper.querySelector('.knapsack-btn-reset')
            this.randomiseBtn = this.wrapper.querySelector('.knapsack-btn-randomise')
            this.editorAddBtn = this.wrapper.querySelector('.knapsack-btn-editor-add')
            this.editorApplyBtn = this.wrapper.querySelector('.knapsack-btn-editor-apply')
            this.capacityValueEl = this.wrapper.querySelector('.knapsack-capacity-value')
            this.capacityRange = this.wrapper.querySelector('.knapsack-capacity-range')
            this.capacityNumber = this.wrapper.querySelector('.knapsack-capacity-number')
            this.statusEl = this.wrapper.querySelector('.knapsack-status')
            this.candidateTrack = this.wrapper.querySelector('.knapsack-candidate-track')
            this.bestTrack = this.wrapper.querySelector('.knapsack-best-track')
            this.candidateSummary = this.wrapper.querySelector('.knapsack-candidate-summary')
            this.bestSummary = this.wrapper.querySelector('.knapsack-best-summary')
            this.itemsCountEl = this.wrapper.querySelector('.knapsack-items-count')
            this.itemList = this.wrapper.querySelector('.knapsack-item-list')
            this.editorBody = this.wrapper.querySelector('.knapsack-editor-body')
            this.progressValue = this.wrapper.querySelector('.knapsack-progress-value')
            this.bestValue = this.wrapper.querySelector('.knapsack-best-value')
            this.weightValue = this.wrapper.querySelector('.knapsack-weight-value')
            this.timeValue = this.wrapper.querySelector('.knapsack-time-value')
            this.detailTitle = this.wrapper.querySelector('.knapsack-detail-title')
            this.detailBody = this.wrapper.querySelector('.knapsack-detail-body')
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
                await this.run()
            })

            this.stopBtn.addEventListener('click', () => this.stop())
            this.resetBtn.addEventListener('click', () => this.resetView())

            this.randomiseBtn.addEventListener('click', () => {
                if (this.usesFixedItems) return
                this.items = enrichItems(generateItems(this.capacity, this.items.length || DEFAULT_GENERATED_ITEMS))
                this.initialItems = this.items.map(item => ({ ...item }))
                this.resetView()
            })

            this.editorAddBtn.addEventListener('click', () => {
                if (this.solver && this.solver.running) return
                this.addEditorRow()
            })

            this.editorApplyBtn.addEventListener('click', () => {
                if (this.solver && this.solver.running) return
                this.applyItemEdits()
            })

            this.editorBody.addEventListener('click', (event) => {
                const button = event.target.closest('.knapsack-editor-remove')
                if (!button) return
                if (this.solver && this.solver.running) return

                const row = button.closest('tr')
                if (!row) return

                row.remove()
                if (this.editorBody.children.length === 0) {
                    this.addEditorRow()
                }
            })

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
                    this.statusEl.textContent = 'Capacity unchanged.'
                    return
                }

                this.capacity = nextCapacity
                this.syncCapacityControls(this.capacity)
                this.resetView()
                this.statusEl.textContent = `Capacity updated to ${this.capacity}.`
            }

            this.capacityRange.addEventListener('change', applyCapacityChange)
            this.capacityNumber.addEventListener('change', applyCapacityChange)
        }

        setButtons(isRunning) {
            this.startBtn.disabled = isRunning
            this.stopBtn.disabled = !isRunning
            this.resetBtn.disabled = isRunning
            this.randomiseBtn.disabled = isRunning || this.usesFixedItems
            this.editorAddBtn.disabled = isRunning
            this.editorApplyBtn.disabled = isRunning
            this.capacityRange.disabled = isRunning
            this.capacityNumber.disabled = isRunning

            this.editorBody.querySelectorAll('input, button').forEach(control => {
                control.disabled = isRunning
            })
        }

        syncCapacityControls(value) {
            const safe = Math.max(MIN_CAPACITY, Math.min(MAX_CAPACITY, parsePositiveInt(value, this.capacity)))
            this.capacityRange.value = `${safe}`
            this.capacityNumber.value = `${safe}`
            this.capacityValueEl.textContent = `${safe}`

            this.weightValue.textContent = `${formatNumber(this.bestResult.weight)} / ${formatNumber(safe)}`
            this.renderTracks()
        }

        readCapacityFromControls() {
            return Math.max(MIN_CAPACITY, Math.min(MAX_CAPACITY, parsePositiveInt(this.capacityNumber.value, this.capacity)))
        }

        makeEditorRow(label, weight, value) {
            return `
                <tr>
                    <td>${label}</td>
                    <td><input class="knapsack-editor-input knapsack-editor-weight" type="number" min="1" step="1" value="${weight}"></td>
                    <td><input class="knapsack-editor-input knapsack-editor-value" type="number" min="0" step="1" value="${value}"></td>
                    <td><button class="knapsack-btn knapsack-btn-secondary knapsack-editor-remove" type="button">Remove</button></td>
                </tr>
            `
        }

        renderEditor() {
            this.editorBody.innerHTML = this.items
                .map(item => this.makeEditorRow(item.label, item.weight, item.value))
                .join('')
        }

        addEditorRow(weight = 1, value = 1) {
            const nextLabel = String.fromCharCode(65 + (this.editorBody.children.length % 26))
            this.editorBody.insertAdjacentHTML('beforeend', this.makeEditorRow(nextLabel, weight, value))
        }

        applyItemEdits() {
            const rows = [...this.editorBody.querySelectorAll('tr')]
            const rawItems = rows.map(row => {
                const weightInput = row.querySelector('.knapsack-editor-weight')
                const valueInput = row.querySelector('.knapsack-editor-value')
                return {
                    weight: parsePositiveInt(weightInput?.value, 0),
                    value: parseInt(valueInput?.value ?? '', 10)
                }
            }).filter(item => Number.isFinite(item.weight) && item.weight > 0 && Number.isFinite(item.value) && item.value >= 0)

            if (rawItems.length === 0) {
                this.statusEl.textContent = 'Add at least one valid item before applying edits.'
                return
            }

            this.items = enrichItems(rawItems)
            this.initialItems = this.items.map(item => ({ ...item }))
            this.resetView()
            this.statusEl.textContent = `Applied ${this.items.length} item${this.items.length === 1 ? '' : 's'}.`
        }

        stop() {
            this.stopRequested = true
            if (this.solver && this.solver.running) {
                this.solver.stop()
            }
            this.setButtons(false)
            this.statusEl.textContent = 'Stopped'
        }

        addHistory(message) {
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
            this.itemsCountEl.textContent = this.items.length
            this.statusEl.textContent = 'Ready'
            this.progressValue.textContent = '0 / 0'
            this.bestValue.textContent = '0'
            this.weightValue.textContent = `0 / ${this.capacity}`
            this.timeValue.textContent = '0 ms'
            this.detailTitle.textContent = 'Solver view'
            this.detailBody.innerHTML = '<div class="knapsack-note-grid"><div class="knapsack-note"><strong>Bag</strong>Start the solver to fill the bag.</div><div class="knapsack-note"><strong>Items</strong>Watch slices grow as the solver picks items.</div><div class="knapsack-note"><strong>View</strong>Mode-specific detail appears here.</div></div>'
            this.resetComparison()
            this.renderTracks()
            this.renderEditor()
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
            const selected = result?.selected || []
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
                const width = Math.max(6, (item.weight / this.capacity) * 100)
                const text = width < 12
                    ? `<span class="knapsack-slice-text">${item.label}</span>`
                    : `<span class="knapsack-slice-text"><span>${item.label}</span><span class="knapsack-slice-meta">v${item.value} · w${item.weight}</span></span>`

                return `
                    <div
                        class="knapsack-slice ${item.id === currentItemId ? 'is-current' : ''}"
                        style="flex: 0 0 ${width}%; background: ${getItemColour(item, maxItemValue)};"
                        title="${item.name}: weight ${item.weight}, value ${item.value}">
                        ${text}
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

            this.itemList.innerHTML = this.items.map(item => {
                const badges = []
                const isBest = bestIds.has(item.id)
                const isCandidate = candidateIds.has(item.id)
                const isRejected = rejectedIds.has(item.id)
                const isCurrent = currentId === item.id
                const order = orderMap.get(item.id)
                const decision = decisions.get(item.id)

                if (isBest) badges.push('<span class="knapsack-badge knapsack-badge-best">Best bag</span>')
                if (isCandidate) badges.push('<span class="knapsack-badge knapsack-badge-candidate">Current bag</span>')
                if (isCurrent) badges.push('<span class="knapsack-badge knapsack-badge-current">Now</span>')
                if (order != null) badges.push(`<span class="knapsack-badge knapsack-badge-order">#${order + 1}</span>`)
                if (decision === 'take') badges.push('<span class="knapsack-badge knapsack-badge-take">Take</span>')
                if (decision === 'skip') badges.push('<span class="knapsack-badge knapsack-badge-skip">Skip</span>')
                if (isRejected) badges.push('<span class="knapsack-badge knapsack-badge-overweight">Rejected</span>')

                return `
                    <div class="knapsack-item-card ${isBest ? 'is-best' : ''} ${isCandidate ? 'is-candidate' : ''} ${isCurrent ? 'is-current' : ''} ${isRejected ? 'is-rejected' : ''}">
                        <div class="knapsack-item-label" style="background: ${getItemColour(item, maxItemValue)};">${item.label}</div>
                        <div class="knapsack-item-name">${item.name}</div>
                        <div class="knapsack-item-stats">
                            <div class="knapsack-item-stat"><span class="knapsack-item-stat-label">Weight</span><span class="knapsack-item-stat-value">${item.weight}</span></div>
                            <div class="knapsack-item-stat"><span class="knapsack-item-stat-label">Value</span><span class="knapsack-item-stat-value">${item.value}</span></div>
                            <div class="knapsack-item-stat"><span class="knapsack-item-stat-label">Ratio</span><span class="knapsack-item-stat-value">${formatRatio(item.ratio)}</span></div>
                        </div>
                        <div class="knapsack-item-badges">${badges.join('')}</div>
                    </div>
                `
            }).join('')
        }

        renderBruteDetail(progress) {
            const bits = this.items.map((item, index) => {
                const isOn = (progress.mask & (1 << index)) !== 0
                const chipClass = !progress.feasible && isOn ? 'is-over' : isOn ? 'is-on' : ''
                return `<span class="knapsack-bit-chip ${chipClass}">${item.label}: ${isOn ? '1' : '0'}</span>`
            }).join('')

            const treeHtml = this.items.length <= SMALL_TREE_MAX_ITEMS
                ? this.renderCompactTree(progress.mask)
                : `<div class="knapsack-note"><strong>Tree view</strong>Compact tree shown for ${SMALL_TREE_MAX_ITEMS} items or fewer.</div>`

            this.detailTitle.textContent = 'Search state'
            this.detailBody.innerHTML = `
                <div class="knapsack-brute-grid">
                    <div class="knapsack-note-grid">
                        <div class="knapsack-note"><strong>Subset</strong>${formatNumber(progress.checked)} of ${formatNumber(progress.total)}</div>
                        <div class="knapsack-note"><strong>Current</strong>${progress.feasible ? describeSelection(progress.current) : `Overweight: ${progress.current.weight} / ${this.capacity}`}</div>
                        <div class="knapsack-note"><strong>Best so far</strong>${describeSelection(progress.best)}</div>
                    </div>
                    <div class="knapsack-chip-row">${bits}</div>
                    ${treeHtml}
                </div>
            `
        }

        renderCompactTree(mask) {
            const levels = Math.min(this.items.length, 4)
            const levelRows = []

            for (let level = 0; level <= levels; level++) {
                const prefixMask = mask & ((1 << level) - 1)
                const nodes = []

                for (let node = 0; node < (1 << level); node++) {
                    let weight = 0
                    let value = 0

                    for (let bit = 0; bit < level; bit++) {
                        if ((node & (1 << bit)) !== 0) {
                            weight += this.items[bit].weight
                            value += this.items[bit].value
                        }
                    }

                    const onPath = node === prefixMask
                    const over = weight > this.capacity
                    const decisionText = level === 0
                        ? 'start'
                        : this.items.slice(0, level).map((item, idx) => `${item.label}${(node & (1 << idx)) !== 0 ? '1' : '0'}`).join(' ')

                    nodes.push(`
                        <div class="knapsack-tree-node ${onPath ? 'is-path' : ''} ${over ? 'is-over' : ''}">
                            <div class="knapsack-tree-decisions">${decisionText}</div>
                            <div class="knapsack-tree-stats">w${weight} · v${value}</div>
                        </div>
                    `)
                }

                levelRows.push(`
                    <div class="knapsack-tree-level">
                        <div class="knapsack-tree-level-label">Depth ${level}</div>
                        <div class="knapsack-tree-level-nodes">${nodes.join('')}</div>
                    </div>
                `)
            }

            const extraDepth = this.items.length - levels
            const tail = extraDepth > 0
                ? `<div class="knapsack-tree-tail">Showing first ${levels} levels. Remaining depth: ${extraDepth}.</div>`
                : ''

            return `<div class="knapsack-tree"><div class="knapsack-tree-title">Compact decision tree</div>${levelRows.join('')}${tail}</div>`
        }

        renderGreedyDetail(progress) {
            const orderMap = new Map(progress.rankedItems.map((item, index) => [item.id, index]))
            const decisionMap = new Map(progress.rankedItems.map(item => {
                if (progress.best.selected.some(selected => selected.id === item.id)) return [item.id, 'take']
                if (progress.rejectedIds.has(item.id)) return [item.id, 'skip']
                return [item.id, null]
            }))

            this.detailTitle.textContent = 'Greedy order'
            this.detailBody.innerHTML = `
                <div class="knapsack-greedy-list">
                    ${progress.rankedItems.map((item, index) => {
                        const decision = decisionMap.get(item.id)
                        const label = decision === 'take' ? 'Take' : decision === 'skip' ? 'Skip' : 'Waiting'
                        return `
                            <div class="knapsack-greedy-row ${progress.currentItem.id === item.id ? 'is-current' : ''}">
                                <div class="knapsack-greedy-order">${index + 1}</div>
                                <div>
                                    <div><strong>${item.name}</strong></div>
                                    <div class="knapsack-greedy-meta">ratio ${formatRatio(item.ratio)} | value ${item.value} | weight ${item.weight}</div>
                                </div>
                                <div class="knapsack-greedy-decision ${decision === 'take' ? 'is-take' : decision === 'skip' ? 'is-skip' : ''}">${label}</div>
                            </div>
                        `
                    }).join('')}
                </div>
            `

            this.renderInventory({
                orderMap,
                decisions: decisionMap,
                currentId: progress.currentItem.id,
                candidateIds: new Set(progress.best.selected.map(item => item.id)),
                bestIds: new Set(progress.best.selected.map(item => item.id)),
                rejectedIds: progress.rejectedIds
            })
        }

        renderDynamicDetail(progress) {
            const rows = this.items.length + 1
            const cols = this.capacity + 1
            const tableHtml = []

            tableHtml.push('<div class="knapsack-dp-wrap"><table class="knapsack-dp-table"><thead><tr><th>Item</th>')
            for (let col = 0; col < cols; col++) {
                tableHtml.push(`<th>${col}</th>`)
            }
            tableHtml.push('</tr></thead><tbody>')

            for (let row = 0; row < rows; row++) {
                const rowLabel = row === 0 ? '0 items' : this.items[row - 1].label
                tableHtml.push(`<tr><td>${rowLabel}</td>`)

                for (let col = 0; col < cols; col++) {
                    const classes = []
                    if (row === progress.row) classes.push('is-row-active')
                    if (col === progress.col) classes.push('is-col-active')
                    if (row === progress.row && col === progress.col) classes.push('is-active')
                    if (row === rows - 1 && col === cols - 1) classes.push('is-best')
                    tableHtml.push(`<td class="${classes.join(' ')}">${progress.table[row][col]}</td>`)
                }

                tableHtml.push('</tr>')
            }

            tableHtml.push('</tbody></table></div>')

            this.detailTitle.textContent = 'DP table'
            this.detailBody.innerHTML = tableHtml.join('')
            this.renderInventory({
                currentId: progress.currentItem.id,
                candidateIds: new Set(progress.best.selected.map(item => item.id)),
                bestIds: new Set(progress.best.selected.map(item => item.id))
            })
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
            if ((this.solveMode === 'brute' || this.solveMode.startsWith('compare-')) && this.items.length > MAX_BRUTE_ITEMS) {
                this.statusEl.textContent = `Too many items for brute force (${this.items.length}). Keep it at ${MAX_BRUTE_ITEMS} or fewer.`
                return
            }

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
                if (!this.solver || !this.solver.running) {
                    this.setButtons(false)
                }
            }
        }

        async runBruteForce() {
            let lastBestValue = -1
            let finalResult = null

            this.solver = new KnapsackBruteForceSolver(
                this.items,
                this.capacity,
                async progress => {
                    this.candidateResult = cloneResult(progress.current)
                    this.bestResult = cloneResult(progress.best)
                    this.renderTracks(null, !progress.feasible)
                    this.renderInventory({
                        candidateIds: new Set(progress.current.selected.map(item => item.id)),
                        bestIds: new Set(progress.best.selected.map(item => item.id)),
                        rejectedIds: progress.feasible ? new Set() : new Set(progress.current.selected.map(item => item.id)),
                        currentId: null,
                        orderMap: new Map(),
                        decisions: new Map()
                    })
                    this.renderBruteDetail(progress)
                    this.updateStats(`${formatNumber(progress.checked)} / ${formatNumber(progress.total)}`, progress.best, progress.actualComputeTime)
                    this.statusEl.textContent = progress.feasible
                        ? `Checking subset ${formatNumber(progress.checked)} of ${formatNumber(progress.total)}`
                        : `Subset ${formatNumber(progress.checked)} is overweight`

                    if (progress.improved && progress.best.value > lastBestValue) {
                        lastBestValue = progress.best.value
                        this.addHistory(`New best: <strong>${describeSelection(progress.best)}</strong>`)
                    }

                    await sleep(this.speedProfile.bruteDelay)
                },
                result => {
                    finalResult = result
                    this.bestResult = cloneResult(result.best)
                    this.candidateResult = cloneResult(result.best)
                    this.renderTracks()
                    this.renderInventory({
                        candidateIds: new Set(result.best.selected.map(item => item.id)),
                        bestIds: new Set(result.best.selected.map(item => item.id)),
                        rejectedIds: new Set(),
                        currentId: null
                    })
                    this.updateStats(`${formatNumber(result.total)} / ${formatNumber(result.total)}`, result.best, result.actualComputeTime)
                    this.renderBruteDetail({
                        mask: result.bestMask,
                        checked: result.total,
                        total: result.total,
                        current: result.best,
                        best: result.best,
                        feasible: true
                    })
                    this.statusEl.textContent = `Complete. Best bag value ${result.best.value}.`
                    this.addHistory(`Complete: <strong>${describeSelection(result.best)}</strong>`)
                },
                this.speedProfile.bruteUpdateMultiplier
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
                    this.renderDynamicDetail(progress)
                    this.updateStats(`${formatNumber(progress.operations)} / ${formatNumber(progress.totalOperations)}`, progress.best, progress.actualComputeTime)
                    this.statusEl.textContent = `Filling row ${progress.row}, capacity ${progress.col}`

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
                    this.candidateResult = cloneResult(result.best)
                    this.renderTracks()
                    this.renderInventory({
                        currentId: null,
                        candidateIds: new Set(result.best.selected.map(item => item.id)),
                        bestIds: new Set(result.best.selected.map(item => item.id))
                    })
                    this.renderDynamicDetail({
                        row: this.items.length,
                        col: this.capacity,
                        currentItem: this.items[this.items.length - 1],
                        table: result.table,
                        best: result.best
                    })
                    this.updateStats(`${formatNumber(result.totalOperations)} / ${formatNumber(result.totalOperations)}`, result.best, result.actualComputeTime)
                    this.statusEl.textContent = `Complete. Optimal value ${result.best.value}.`
                    this.addHistory(`Complete: <strong>${describeSelection(result.best)}</strong>`)
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
                    this.renderGreedyDetail(progress)
                    this.updateStats(`${formatNumber(progress.step)} / ${formatNumber(progress.totalSteps)}`, progress.best, progress.actualComputeTime)
                    this.statusEl.textContent = progress.decision === 'take'
                        ? `Taking ${progress.currentItem.name}`
                        : `Skipping ${progress.currentItem.name}`
                    this.addHistory(`${progress.decision === 'take' ? 'Take' : 'Skip'} <strong>${progress.currentItem.label}</strong> -> ${describeSelection(progress.best)}`)
                    await sleep(this.speedProfile.greedyDelay)
                },
                result => {
                    finalResult = result
                    this.bestResult = cloneResult(result.best)
                    this.candidateResult = cloneResult(result.best)
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
                    this.statusEl.textContent = `Complete. Greedy value ${result.best.value}.`
                    this.addHistory(`Complete: <strong>${describeSelection(result.best)}</strong>`)
                }
            )

            await this.solver.start()
            return this.stopRequested ? null : finalResult
        }

        async runCompareDynamic() {
            const dynamicPhase = await this.runDynamic()
            if (!dynamicPhase || this.stopRequested) return

            const dynamicResult = cloneResult(dynamicPhase.best)
            const dynamicOperations = dynamicPhase.totalOperations
            const dynamicTime = dynamicPhase.actualComputeTime

            this.updateComparisonPrimary('Dynamic programming', dynamicResult, dynamicOperations, dynamicTime)
            this.addHistory('Starting brute force for comparison')

            const brutePhase = await this.runBruteForce()
            if (!brutePhase || this.stopRequested) return

            const bruteResult = cloneResult(brutePhase.best)
            const bruteOperations = brutePhase.operations
            const bruteTime = brutePhase.actualComputeTime

            this.updateComparisonPrimary('Dynamic programming', dynamicResult, dynamicOperations, dynamicTime)
            this.updateComparisonBrute(bruteResult, bruteOperations, bruteTime)
            this.updateComparisonSummary('Dynamic programming', dynamicResult, dynamicOperations, dynamicTime, bruteResult, bruteOperations, bruteTime)
            this.summaryMeta.textContent = `Dynamic table used ${formatNumber(dynamicOperations)} states. Brute force checked ${formatNumber(bruteOperations)} subsets.`
            this.statusEl.textContent = 'Comparison complete. Dynamic matched optimal with fewer states.'
        }

        async runCompareGreedy() {
            const greedyPhase = await this.runGreedy()
            if (!greedyPhase || this.stopRequested) return

            const greedyResult = cloneResult(greedyPhase.best)
            const greedyOperations = greedyPhase.operations
            const greedyTime = greedyPhase.actualComputeTime

            this.updateComparisonPrimary('Greedy', greedyResult, greedyOperations, greedyTime)
            this.addHistory('Starting brute force for comparison')

            const brutePhase = await this.runBruteForce()
            if (!brutePhase || this.stopRequested) return

            const bruteResult = cloneResult(brutePhase.best)
            const bruteOperations = brutePhase.operations
            const bruteTime = brutePhase.actualComputeTime

            this.updateComparisonBrute(bruteResult, bruteOperations, bruteTime)
            this.updateComparisonSummary('Greedy', greedyResult, greedyOperations, greedyTime, bruteResult, bruteOperations, bruteTime)
            this.statusEl.textContent = 'Comparison complete. Greedy speed against optimal quality.'
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

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyKnapsack, window.$docsify.plugins || [])
})()