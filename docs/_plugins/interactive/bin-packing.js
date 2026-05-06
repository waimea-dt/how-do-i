/**
 * docsify-bin-packing.js - 1D Bin Packing Problem Visualizer
 *
 * Visualizes three approaches to the 1D bin packing problem:
 *   - Brute Force: Exhaustive search for minimum bins (default)
 *   - Next Fit: Sequential packing, open new bin when item doesn't fit
 *   - Best Fit: Place item in bin with least remaining space that fits
 *
 * Usage in markdown:
 *   <bin-packing></bin-packing>
 *   <bin-packing capacity="10"></bin-packing>
 *   <bin-packing capacity="10" items="3 5 8 3 5 9"></bin-packing>
 *   <bin-packing method="next-fit" capacity="15"></bin-packing>
 *   <bin-packing method="best-fit" capacity="12" items="4 8 1 4 2 1"></bin-packing>
 *   <bin-packing method="compare-next-fit" capacity="10"></bin-packing>
 *   <bin-packing method="compare-best-fit" capacity="10"></bin-packing>
 */

;(function () {

    const { sleep, parsePositiveInt } = window.DocsifyUtils

    // =========================================================================
    // Configuration & Constants
    // =========================================================================

    const CONFIG = {
        DEFAULT_CAPACITY: 10,
        MIN_CAPACITY: 5,
        MAX_CAPACITY: 50,
        DEFAULT_ITEMS: '3 5 8 3 5 9',
        DEFAULT_GENERATED_ITEMS: 5,
        MIN_GENERATED_ITEMS: 1,
        MAX_GENERATED_ITEMS: 20,
        MIN_SLICE_HEIGHT: 8,
        FALLBACK_BIN_HEIGHT: 220
    }

    const METHOD_CONFIG = {
        brute: {
            title: 'Bin Packing: Brute Force, O(n<sup>n</sup>)',
            subtitle: 'Checks all assignments with no pruning. Perfect answer, extremely slow.',
            workLabel: 'Assignments to Try',
            calculateWork: (n, capacity) => {
                if (n <= 1) return 1n
                // Use BigInt for n^n (grows even faster than factorial!)
                const bigN = BigInt(n)
                return bigN ** bigN
            },
            formatWork: (work) => typeof work === 'bigint' ? work.toLocaleString() : formatNumber(work),
            primaryMethod: 'brute',
            dependsOnCapacity: false,
            isComparison: false
        },
        'next-fit': {
            title: 'Bin Packing: Next Fit, O(n)',
            subtitle: 'Pack sequentially. Opens new bin when item doesn\'t fit current bin.',
            workLabel: 'Items to Process',
            calculateWork: (n, capacity) => n,
            formatWork: (work) => work.toString(),
            primaryMethod: 'next-fit',
            dependsOnCapacity: false,
            isComparison: false
        },
        'best-fit': {
            title: 'Bin Packing: Best Fit, O(n<sup>2</sup>)',
            subtitle: 'Place each item in bin with least remaining space that fits.',
            workLabel: 'Placement Checks',
            calculateWork: (n, capacity) => Math.floor(n * n / 2),
            formatWork: (work) => formatNumber(work),
            primaryMethod: 'best-fit',
            dependsOnCapacity: false,
            isComparison: false
        },
        'compare-next-fit': {
            title: 'Bin Packing: Brute Force vs. Next Fit',
            subtitle: 'Optimal solution compared to fast sequential heuristic.',
            workLabel: 'Items to Process',
            calculateWork: (n, capacity) => n,
            formatWork: (work) => work.toString(),
            primaryMethod: 'next-fit',
            dependsOnCapacity: false,
            isComparison: true
        },
        'compare-best-fit': {
            title: 'Bin Packing: Brute Force vs. Best Fit',
            subtitle: 'Optimal solution compared to smart placement heuristic.',
            workLabel: 'Placement Checks',
            calculateWork: (n, capacity) => Math.floor(n * n / 2),
            formatWork: (work) => formatNumber(work),
            primaryMethod: 'best-fit',
            dependsOnCapacity: false,
            isComparison: true
        }
    }

    const SPEED_PROFILES = {
        slow: {
            bruteDelay: 250,
            heuristicDelay: 250,
            instant: false
        },
        normal: {
            bruteDelay: 0,
            heuristicDelay: 0,
            instant: false
        },
        fast: {
            bruteDelay: 0,
            heuristicDelay: 0,
            instant: false
        },
        instant: {
            bruteDelay: 0,
            heuristicDelay: 0,
            instant: true
        }
    }

    // =========================================================================
    // Utility Functions - General
    // =========================================================================

    function normaliseMethod(value) {
        const allowed = ['brute', 'next-fit', 'best-fit', 'compare-next-fit', 'compare-best-fit']
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

    function formatNumber(value, useSci = true) {
        const num = Number(value || 0)
        if (!useSci || num < 1e9) {
            return num.toLocaleString()
        }
        // Use scientific notation for large numbers
        const exp = Math.floor(Math.log10(num))
        const mantissa = num / Math.pow(10, exp)
        return `${mantissa.toFixed(3)}×10<sup>${exp}</sup>`
    }

    function formatTime(ms) {
        if (ms == null || isNaN(ms)) return '< 1 ms'

        const seconds = ms / 1000
        const minutes = seconds / 60
        const hours = minutes / 60
        const days = hours / 24
        const weeks = days / 7
        const months = days / 30.44 // Average month length
        const years = days / 365.25 // Account for leap years

        if (ms === 0) return '< 1 ms'
        if (ms < 1000) return `${ms.toFixed(0)} ms`
        if (seconds < 60) return `${seconds.toFixed(1)} s`
        if (minutes < 60) return `${minutes.toFixed(1)} mins`
        if (hours < 24) return `${hours.toFixed(1)} hours`
        if (days < 7) return `${days.toFixed(1)} days`
        if (weeks < 4) return `${weeks.toFixed(1)} weeks`
        if (months < 12) return `${months.toFixed(1)} months`
        return `${Number(years.toFixed(1)).toLocaleString()} years`
    }

    function estimateRemainingTime(checked, total, elapsedTime) {
        if (checked === 0) return '...'
        if (checked >= total) return '0 s'
        const avgTimePerCheck = elapsedTime / checked
        const remainingChecks = total - checked
        return formatTime(avgTimePerCheck * remainingChecks)
    }

    function describePacking(bins) {
        if (!bins || bins.length === 0) return 'No bins used'
        const binCount = bins.length
        const itemCount = bins.reduce((sum, bin) => sum + bin.items.length, 0)
        return `${binCount} bin${binCount !== 1 ? 's' : ''} | ${itemCount} item${itemCount !== 1 ? 's' : ''}`
    }

    // =========================================================================
    // Utility Functions - Items
    // =========================================================================

    function parseItems(itemsString) {
        if (!itemsString) return null

        return itemsString
            .trim()
            .split(/\s+/)
            .map(part => {
                const size = parseFloat(part)
                return { size }
            })
            .filter(item => Number.isFinite(item.size) && item.size > 0)
    }

    function enrichItems(items) {
        return items.map((item, index) => {
            const label = getItemLabel(index)
            return {
                id: index,
                label: label,
                name: `Item ${label}`,
                size: item.size
            }
        })
    }

    function generateItems(capacity, count = CONFIG.DEFAULT_GENERATED_ITEMS) {
        const items = []
        const maxSize = Math.max(2, Math.floor(capacity * 0.7))

        for (let index = 0; index < count; index++) {
            const size = 1 + Math.floor(Math.random() * maxSize)
            items.push({ size })
        }

        return enrichItems(items)
    }

    // =========================================================================
    // Utility Functions - Bins
    // =========================================================================

    function createEmptyBin(capacity) {
        return {
            items: [],
            used: 0,
            remaining: capacity
        }
    }

    function cloneBins(bins) {
        return bins.map(bin => ({
            items: [...bin.items],
            used: bin.used,
            remaining: bin.remaining
        }))
    }

    function canFit(bin, item, capacity) {
        return bin.used + item.size <= capacity
    }

    function addItemToBin(bin, item, capacity) {
        bin.items.push(item)
        bin.used += item.size
        bin.remaining = capacity - bin.used
    }

    function calculateTotalWaste(bins, capacity) {
        return bins.reduce((sum, bin) => sum + bin.remaining, 0)
    }

    // =========================================================================
    // UI Builder
    // =========================================================================

    function buildUI(capacity, items, method, usesFixedItems, speed) {
        const config = METHOD_CONFIG[method] || METHOD_CONFIG.brute
        const showComparison = config.isComparison

        const wrapper = document.createElement('div')
        wrapper.className = 'bin-packing-wrapper'
        wrapper.dataset.method = method

        wrapper.innerHTML = `
            <div class="bin-packing-header">
                <h3 class="bin-packing-title">${config.title}</h3>
                <p class="bin-packing-subtitle">${config.subtitle}</p>
            </div>
            <div class="bin-packing-content">
                <div class="bin-packing-control-group">
                    <label class="bin-packing-capacity-label">Bin Capacity</label>
                    <div class="bin-packing-capacity-inputs">
                        <input class="bin-packing-capacity-range" type="range" min="${CONFIG.MIN_CAPACITY}" max="${CONFIG.MAX_CAPACITY}" value="${capacity}">
                        <input class="bin-packing-capacity-number" type="number" min="${CONFIG.MIN_CAPACITY}" max="${CONFIG.MAX_CAPACITY}" step="1" value="${capacity}">
                    </div>
                    <label class="bin-packing-items-label">Items to Pack (N)</label>
                    <div class="bin-packing-items-inputs">
                        <input class="bin-packing-items-range" type="range" min="${CONFIG.MIN_GENERATED_ITEMS}" max="${CONFIG.MAX_GENERATED_ITEMS}" value="${items.length}" ${usesFixedItems ? 'disabled' : ''}>
                        <input class="bin-packing-items-number" type="number" min="${CONFIG.MIN_GENERATED_ITEMS}" max="${CONFIG.MAX_GENERATED_ITEMS}" step="1" value="${items.length}" ${usesFixedItems ? 'disabled' : ''}>
                    </div>
                    <span class="bin-packing-combo-label bin-packing-work-label">${config.workLabel}</span>
                    <span class="bin-packing-combo-value bin-packing-work-value">${config.formatWork(config.calculateWork(items.length, capacity))}</span>
                </div>

                <div class="bin-packing-button-group">
                    <button class="bin-packing-btn bin-packing-btn-start btn-go">Start</button>
                    <button class="bin-packing-btn bin-packing-btn-stop btn-stop" disabled>Stop</button>
                    <button class="bin-packing-btn bin-packing-btn-secondary bin-packing-btn-reset btn-reset">Reset</button>
                    <button class="bin-packing-btn bin-packing-btn-secondary bin-packing-btn-randomise btn-shuffle" ${usesFixedItems ? 'disabled title="Uses fixed items from markdown"' : ''}></button>
                </div>

                <div class="bin-packing-visualization">
                    <div class="bin-packing-bins"></div>
                </div>

                <div class="bin-packing-inventory">
                    <div class="bin-packing-panel-title">Items to Pack</div>
                    <div class="bin-packing-item-list"></div>
                </div>

                <div class="bin-packing-stats">
                    <div class="bin-packing-stat bin-packing-stat-progress">
                        <div class="bin-packing-stat-label">Progress</div>
                        <div class="bin-packing-stat-value bin-packing-progress-value">0 / 0</div>
                        <div class="bin-packing-stat-status bin-packing-progress-status">Ready</div>
                    </div>
                    <div class="bin-packing-stat">
                        <div class="bin-packing-stat-label">Compute time</div>
                        <div class="bin-packing-stat-value bin-packing-time-value">0 ms</div>
                    </div>
                    <div class="bin-packing-stat">
                        <div class="bin-packing-stat-label">Estimated Remaining</div>
                        <div class="bin-packing-stat-value bin-packing-remaining-value">...</div>
                    </div>
                    <div class="bin-packing-stat">
                        <div class="bin-packing-stat-label">Bins used</div>
                        <div class="bin-packing-stat-value bin-packing-bins-value">0</div>
                    </div>
                    <div class="bin-packing-stat">
                        <div class="bin-packing-stat-label">Wasted space</div>
                        <div class="bin-packing-stat-value bin-packing-waste-value">0</div>
                    </div>
                </div>

                <div class="bin-packing-comparison" ${showComparison ? '' : 'hidden'}>
                    <div class="bin-packing-panel-title">Algorithm comparison</div>
                    <div class="bin-packing-comparison-grid">
                        <div class="bin-packing-comparison-item">
                            <div class="bin-packing-comparison-label bin-packing-left-label">Primary</div>
                            <div class="bin-packing-comparison-value bin-packing-left-value">-</div>
                            <div class="bin-packing-comparison-meta bin-packing-left-meta">-</div>
                        </div>
                        <div class="bin-packing-comparison-item">
                            <div class="bin-packing-comparison-label">Brute force</div>
                            <div class="bin-packing-comparison-value bin-packing-right-value">-</div>
                            <div class="bin-packing-comparison-meta bin-packing-right-meta">-</div>
                        </div>
                        <div class="bin-packing-comparison-item is-summary">
                            <div class="bin-packing-comparison-label">Difference</div>
                            <div class="bin-packing-comparison-value bin-packing-summary-value">-</div>
                            <div class="bin-packing-comparison-meta bin-packing-summary-meta">-</div>
                        </div>
                    </div>
                </div>
            </div>
        `

        return wrapper
    }

    // =========================================================================
    // Solver Classes
    // =========================================================================

    class BinPackingSolverBase {
        stop() {
            this.running = false
        }
    }

    class BruteForceSolver extends BinPackingSolverBase {
        constructor(items, capacity, onProgress, onComplete, speedProfile) {
            super()
            this.items = items
            this.capacity = capacity
            this.onProgress = onProgress
            this.onComplete = onComplete
            this.speedProfile = speedProfile
            this.running = false
        }

        async start() {
            this.running = true
            const startedAt = Date.now()
            let actualComputeTime = 0

            // Exhaustive assignment count: each of n items can go into any of n bins.
            const n = this.items.length
            const expectedTotal = Number(METHOD_CONFIG.brute.calculateWork(n, this.capacity))
            const workingBins = Array.from({ length: n }, () => createEmptyBin(this.capacity))

            const state = {
                checked: 0,
                expectedTotal: expectedTotal
            }
            let bestBins = null
            let bestBinCount = Infinity

            // Exhaustive brute force: recurse through every item-to-bin assignment.
            actualComputeTime = await this.exhaustiveAssign(workingBins, 0, startedAt, state, actualComputeTime, candidateBins => {
                if (candidateBins.length < bestBinCount) {
                    bestBinCount = candidateBins.length
                    bestBins = cloneBins(candidateBins)
                }
            })

            const waste = bestBins ? calculateTotalWaste(bestBins, this.capacity) : 0

            this.onComplete({
                bins: bestBins || [],
                binCount: bestBins ? bestBins.length : 0,
                waste,
                time: actualComputeTime,
                checked: state.checked,
                total: state.expectedTotal
            })
        }

        isValidPacking(bins) {
            for (const bin of bins) {
                if (bin.used > this.capacity) return false
            }
            return true
        }

        getUsedBins(bins) {
            return bins.filter(bin => bin.items.length > 0)
        }

        async exhaustiveAssign(bins, itemIndex, startedAt, state, actualComputeTime, onSolution) {
            if (!this.running) return actualComputeTime

            if (itemIndex >= this.items.length) {
                state.checked++

                const computeStart = Date.now()
                if (this.isValidPacking(bins)) {
                    onSolution(this.getUsedBins(bins))
                }
                actualComputeTime += Date.now() - computeStart

                if (state.checked % 1000 === 0 || state.checked < 100) {
                    const shownBins = cloneBins(this.getUsedBins(bins)).map(bin => ({
                        ...bin,
                        remaining: Math.max(0, bin.remaining)
                    }))
                    await this.onProgress({
                        bins: shownBins,
                        binCount: shownBins.length,
                        waste: shownBins.length > 0 ? calculateTotalWaste(shownBins, this.capacity) : 0,
                        time: actualComputeTime,
                        elapsedTime: Date.now() - startedAt,
                        checked: state.checked,
                        total: state.expectedTotal
                    })
                    if (!this.speedProfile.instant) {
                        await sleep(this.speedProfile.bruteDelay)
                    }
                }

                return actualComputeTime
            }

            const computeStart = Date.now()
            const item = this.items[itemIndex]
            actualComputeTime += Date.now() - computeStart

            // Try assigning item to every bin index (no fit-pruning).
            for (let binIndex = 0; binIndex < bins.length; binIndex++) {
                if (!this.running) return actualComputeTime

                const bin = bins[binIndex]
                const computeStart2 = Date.now()
                addItemToBin(bin, item, this.capacity)
                actualComputeTime += Date.now() - computeStart2

                actualComputeTime = await this.exhaustiveAssign(bins, itemIndex + 1, startedAt, state, actualComputeTime, onSolution)

                // Backtrack
                const computeStart3 = Date.now()
                bin.items.pop()
                bin.used -= item.size
                bin.remaining = this.capacity - bin.used
                actualComputeTime += Date.now() - computeStart3
            }

            return actualComputeTime
        }
    }

    class NextFitSolver extends BinPackingSolverBase {
        constructor(items, capacity, onProgress, onComplete, speedProfile) {
            super()
            this.items = items
            this.capacity = capacity
            this.onProgress = onProgress
            this.onComplete = onComplete
            this.speedProfile = speedProfile
            this.running = false
        }

        async start() {
            this.running = true
            const startedAt = Date.now()
            let actualComputeTime = 0
            const bins = []
            let currentBin = null

            for (let i = 0; i < this.items.length; i++) {
                if (!this.running) break

                const computeStart = Date.now()
                const item = this.items[i]

                // If no current bin or item doesn't fit, create new bin
                if (!currentBin || !canFit(currentBin, item, this.capacity)) {
                    currentBin = createEmptyBin(this.capacity)
                    bins.push(currentBin)
                }

                addItemToBin(currentBin, item, this.capacity)
                actualComputeTime += Date.now() - computeStart

                await this.onProgress({
                    bins: cloneBins(bins),
                    binCount: bins.length,
                    waste: calculateTotalWaste(bins, this.capacity),
                    time: actualComputeTime,
                    elapsedTime: Date.now() - startedAt,
                    checked: i + 1,
                    total: this.items.length,
                    currentItem: item
                })

                if (!this.speedProfile.instant) {
                    await sleep(this.speedProfile.heuristicDelay)
                }
            }

            this.onComplete({
                bins,
                binCount: bins.length,
                waste: calculateTotalWaste(bins, this.capacity),
                time: actualComputeTime,
                checked: this.items.length,
                total: this.items.length
            })
        }
    }

    class BestFitSolver extends BinPackingSolverBase {
        constructor(items, capacity, onProgress, onComplete, speedProfile) {
            super()
            this.items = items
            this.capacity = capacity
            this.onProgress = onProgress
            this.onComplete = onComplete
            this.speedProfile = speedProfile
            this.running = false
        }

        async start() {
            this.running = true
            const startedAt = Date.now()
            let actualComputeTime = 0
            const bins = []
            let checksPerformed = 0
            const totalChecks = Math.floor(this.items.length * this.items.length / 2)

            for (let i = 0; i < this.items.length; i++) {
                if (!this.running) break

                const computeStart = Date.now()
                const item = this.items[i]
                let bestBinIndex = -1
                let bestRemaining = Infinity

                // Find best fitting bin (least remaining space after placing)
                for (let binIndex = 0; binIndex < bins.length; binIndex++) {
                    checksPerformed++
                    const bin = bins[binIndex]
                    if (canFit(bin, item, this.capacity)) {
                        const remainingAfter = bin.remaining - item.size
                        if (remainingAfter < bestRemaining) {
                            bestRemaining = remainingAfter
                            bestBinIndex = binIndex
                        }
                    }
                }

                // Place in best bin or create new one
                if (bestBinIndex >= 0) {
                    addItemToBin(bins[bestBinIndex], item, this.capacity)
                } else {
                    const newBin = createEmptyBin(this.capacity)
                    addItemToBin(newBin, item, this.capacity)
                    bins.push(newBin)
                }

                actualComputeTime += Date.now() - computeStart

                await this.onProgress({
                    bins: cloneBins(bins),
                    binCount: bins.length,
                    waste: calculateTotalWaste(bins, this.capacity),
                    time: actualComputeTime,
                    elapsedTime: Date.now() - startedAt,
                    checked: i + 1,
                    total: this.items.length,
                    currentItem: item
                })

                if (!this.speedProfile.instant) {
                    await sleep(this.speedProfile.heuristicDelay)
                }
            }

            this.onComplete({
                bins,
                binCount: bins.length,
                waste: calculateTotalWaste(bins, this.capacity),
                time: actualComputeTime,
                checked: this.items.length,
                total: this.items.length
            })
        }
    }

    // =========================================================================
    // Widget Class
    // =========================================================================

    class BinPackingWidget {
        constructor(element) {
            this.element = element
            this.capacity = parsePositiveInt(element.getAttribute('capacity'), CONFIG.DEFAULT_CAPACITY)
            this.capacity = Math.max(CONFIG.MIN_CAPACITY, Math.min(CONFIG.MAX_CAPACITY, this.capacity))

            const itemsAttr = element.getAttribute('items')
            const parsedItems = parseItems(itemsAttr)
            this.usesFixedItems = parsedItems !== null
            this.items = parsedItems ? enrichItems(parsedItems) : generateItems(this.capacity, CONFIG.DEFAULT_GENERATED_ITEMS)
            this.itemCount = this.items.length

            this.method = normaliseMethod(element.getAttribute('method'))
            this.speed = normaliseSpeed(element.getAttribute('speed') || 'normal')
            this.speedProfile = getSpeedProfile(this.speed)

            this.solver = null
            this.stopRequested = false
            this.bestBins = []
            this.currentBins = []

            this.initializeUI()
            this.attachEventListeners()
            this.renderInventory()
            this.renderBins()
        }

        initializeUI() {
            const ui = buildUI(this.capacity, this.items, this.method, this.usesFixedItems, this.speed)
            this.element.appendChild(ui)

            // Cache DOM references
            this.wrapper = ui
            this.capacityRange = ui.querySelector('.bin-packing-capacity-range')
            this.capacityNumber = ui.querySelector('.bin-packing-capacity-number')
            this.itemsRange = ui.querySelector('.bin-packing-items-range')
            this.itemsNumber = ui.querySelector('.bin-packing-items-number')
            this.workLabel = ui.querySelector('.bin-packing-work-label')
            this.workValue = ui.querySelector('.bin-packing-work-value')
            this.btnStart = ui.querySelector('.bin-packing-btn-start')
            this.btnStop = ui.querySelector('.bin-packing-btn-stop')
            this.btnReset = ui.querySelector('.bin-packing-btn-reset')
            this.btnRandomise = ui.querySelector('.bin-packing-btn-randomise')
            this.itemList = ui.querySelector('.bin-packing-item-list')
            this.binsContainer = ui.querySelector('.bin-packing-bins')
            this.progressValue = ui.querySelector('.bin-packing-progress-value')
            this.progressStatus = ui.querySelector('.bin-packing-progress-status')
            this.timeValue = ui.querySelector('.bin-packing-time-value')
            this.remainingValue = ui.querySelector('.bin-packing-remaining-value')
            this.binsValue = ui.querySelector('.bin-packing-bins-value')
            this.wasteValue = ui.querySelector('.bin-packing-waste-value')
            this.comparison = ui.querySelector('.bin-packing-comparison')
            this.leftLabel = ui.querySelector('.bin-packing-left-label')
            this.leftValue = ui.querySelector('.bin-packing-left-value')
            this.leftMeta = ui.querySelector('.bin-packing-left-meta')
            this.rightValue = ui.querySelector('.bin-packing-right-value')
            this.rightMeta = ui.querySelector('.bin-packing-right-meta')
            this.summaryValue = ui.querySelector('.bin-packing-summary-value')
            this.summaryMeta = ui.querySelector('.bin-packing-summary-meta')
        }

        attachEventListeners() {
            this.capacityRange.addEventListener('input', () => {
                this.syncCapacityControls(parseInt(this.capacityRange.value, 10))
            })
            this.capacityNumber.addEventListener('input', () => {
                this.syncCapacityControls(parseInt(this.capacityNumber.value, 10))
            })

            // Item count controls - input updates display only
            this.itemsRange.addEventListener('input', () => {
                this.syncItemControls(parseInt(this.itemsRange.value, 10))
            })
            this.itemsNumber.addEventListener('input', () => {
                this.syncItemControls(parseInt(this.itemsNumber.value, 10))
            })

            // Item count controls - change actually regenerates items
            const applyItemCountChange = () => {
                if (this.usesFixedItems) return

                const newCount = parseInt(this.itemsRange.value, 10)
                if (newCount === this.items.length) return

                this.itemCount = newCount
                this.items = generateItems(this.capacity, this.itemCount)
                this.renderInventory()
                this.renderBins()
            }

            this.itemsRange.addEventListener('change', applyItemCountChange)
            this.itemsNumber.addEventListener('change', applyItemCountChange)

            this.btnStart.addEventListener('click', () => this.run())
            this.btnStop.addEventListener('click', () => this.stop())
            this.btnReset.addEventListener('click', () => this.reset())
            this.btnRandomise.addEventListener('click', () => this.randomise())

            // Handle window resize to update item tile heights
            window.addEventListener('resize', () => {
                this.renderInventory()
            })
        }

        syncCapacityControls(value) {
            const clamped = Math.max(CONFIG.MIN_CAPACITY, Math.min(CONFIG.MAX_CAPACITY, value))
            this.capacity = clamped
            this.capacityRange.value = clamped
            this.capacityNumber.value = clamped
            // Re-render inventory tiles to match new capacity proportions
            this.renderInventory()
        }

        syncItemControls(value) {
            const clamped = Math.max(CONFIG.MIN_GENERATED_ITEMS, Math.min(CONFIG.MAX_GENERATED_ITEMS, value))
            this.itemCount = clamped
            this.itemsRange.value = clamped
            this.itemsNumber.value = clamped
            this.updateWorkDisplay(clamped)
        }

        updateWorkDisplay(n) {
            const methodConfig = METHOD_CONFIG[this.method] || METHOD_CONFIG.brute
            this.workLabel.textContent = methodConfig.workLabel
            const work = methodConfig.calculateWork(n, this.capacity)
            this.workValue.textContent = methodConfig.formatWork(work)
        }

        setButtons(isRunning) {
            this.btnStart.disabled = isRunning
            this.btnStop.disabled = !isRunning
            this.btnReset.disabled = isRunning
            this.btnRandomise.disabled = isRunning || this.usesFixedItems
            this.capacityRange.disabled = isRunning
            this.capacityNumber.disabled = isRunning
            this.itemsRange.disabled = isRunning || this.usesFixedItems
            this.itemsNumber.disabled = isRunning || this.usesFixedItems
        }

        renderInventory() {
            const items = this.items
            const maxItemSize = Math.max(...items.map(item => item.size), 1)

            // Get actual bin height from DOM for proportional sizing
            let binHeight = CONFIG.FALLBACK_BIN_HEIGHT
            const firstBin = this.binsContainer.querySelector('.bin-packing-bin-track')
            if (firstBin && firstBin.offsetHeight) {
                binHeight = firstBin.offsetHeight
            }

            const tiles = items.map(item => {
                const height = Math.max(CONFIG.MIN_SLICE_HEIGHT, (item.size / this.capacity) * binHeight)
                return `
                    <div class="bin-packing-item-tile" data-id="${item.id}" style="--slice-size: ${item.size}; --slice-max-size: ${maxItemSize}; height: ${height}px; min-height: ${height}px;" title="${item.name}: ${item.size}">
                        <div class="bin-packing-item-tile-label">${item.label}</div>
                        <div class="bin-packing-item-tile-size">${item.size}</div>
                    </div>
                `
            }).join('')

            this.itemList.innerHTML = tiles
        }

        renderBins(bins = null) {
            if (!bins || bins.length === 0) {
                this.binsContainer.innerHTML = '<div class="bin-packing-empty">No bins created yet</div>'
                // Re-render inventory with fallback height
                this.renderInventory()
                return
            }

            const binHeight = CONFIG.FALLBACK_BIN_HEIGHT
            const maxItemSize = Math.max(...this.items.map(item => item.size), 1)
            const html = bins.map((bin, binIndex) => {
                const overflow = Math.max(0, bin.used - this.capacity)
                const hasOverflow = overflow > 0
                const slices = bin.items.map(item => {
                    const sliceHeight = (item.size / this.capacity) * binHeight
                    return `
                        <div class="bin-packing-slice" style="--slice-size: ${item.size}; --slice-max-size: ${maxItemSize}; height: ${sliceHeight}px;" data-id="${item.id}">
                            <span class="bin-packing-slice-text">${item.label}</span>
                            <span class="bin-packing-slice-size">${item.size}</span>
                        </div>
                    `
                }).join('')

                const isEmpty = bin.items.length === 0
                const remainingHeight = Math.max(0, (bin.remaining / this.capacity) * binHeight)
                const hasRemainingSpace = remainingHeight > 0.5
                const summary = `${bin.used} / ${this.capacity}`

                return `
                    <div class="bin-packing-bin ${hasOverflow ? 'is-overflow' : ''}">
                        <div class="bin-packing-bin-header">
                            <span class="bin-packing-bin-label">Bin ${binIndex + 1}</span>
                            <span class="bin-packing-bin-summary">${summary}</span>
                        </div>
                        <div class="bin-packing-bin-track" style="height: ${binHeight}px;">
                            ${slices}
                            ${!isEmpty && !hasOverflow && hasRemainingSpace ? `<div class="bin-packing-remaining" style="height: ${remainingHeight}px;"></div>` : ''}
                        </div>
                    </div>
                `
            }).join('')

            this.binsContainer.innerHTML = html

            // Re-render inventory with updated bin height
            this.renderInventory()
        }

        updateStats(state) {
            this.progressValue.innerHTML = `${formatNumber(state.checked)} / ${formatNumber(state.total || state.checked)}`
            this.progressStatus.textContent = state.status || 'Running...'
            this.progressStatus.classList.toggle('is-error', state.isError === true)
            this.timeValue.textContent = formatTime(state.time)
            this.remainingValue.textContent = state.remaining || '...'
            this.binsValue.textContent = state.binCount.toString()
            this.wasteValue.textContent = state.waste.toString()
        }

        reset() {
            this.stopRequested = false
            this.bestBins = []
            this.currentBins = []

            if (!this.usesFixedItems && this.itemCount !== this.items.length) {
                this.items = generateItems(this.capacity, this.itemCount)
            }

            this.renderInventory()
            this.renderBins()

            this.progressValue.innerHTML = '0 / 0'
            this.progressStatus.textContent = 'Ready'
            this.progressStatus.classList.remove('is-error')
            this.timeValue.textContent = '0 ms'
            this.remainingValue.textContent = '...'
            this.binsValue.textContent = '0'
            this.wasteValue.textContent = '0'
            this.resetComparison()
        }

        randomise() {
            if (this.usesFixedItems) return
            this.items = generateItems(this.capacity, this.itemCount)
            this.renderInventory()
            this.renderBins()
        }

        resetComparison() {
            if (!this.comparison || this.comparison.hidden) return
            const methodConfig = METHOD_CONFIG[this.method]
            const primaryLabel = methodConfig.primaryMethod === 'next-fit' ? 'Next Fit' : 'Best Fit'
            this.leftLabel.textContent = primaryLabel
            this.leftValue.textContent = '-'
            this.leftMeta.textContent = '-'
            this.rightValue.textContent = '-'
            this.rightMeta.textContent = '-'
            this.summaryValue.textContent = '-'
            this.summaryMeta.textContent = '-'
        }

        hasValidSolution(bins) {
            if (!bins || bins.length === 0) return false
            const totalItemsPacked = bins.reduce((sum, bin) => sum + bin.items.length, 0)
            if (totalItemsPacked !== this.items.length) return false
            return bins.every(bin => bin.used <= this.capacity)
        }

        async run() {
            this.stopRequested = false
            this.bestBins = []
            this.currentBins = []
            this.resetComparison()
            this.renderBins()

            this.setButtons(true)

            const methodConfig = METHOD_CONFIG[this.method]

            if (methodConfig.isComparison) {
                await this.runComparison()
            } else {
                await this.runSingle()
            }

            this.setButtons(false)
        }

        async runSingle() {
            const methodConfig = METHOD_CONFIG[this.method]
            const primaryMethod = methodConfig.primaryMethod

            const onProgress = async (state) => {
                this.currentBins = state.bins
                this.renderBins(state.bins)
                const total = state.total >= 0 ? state.total : this.items.length
                this.updateStats({
                    checked: state.checked,
                    total: total,
                    status: 'Running...',
                    time: state.time,
                    remaining: estimateRemainingTime(state.checked, total, state.elapsedTime),
                    binCount: state.binCount,
                    waste: state.waste
                })
            }

            const onComplete = (result) => {
                this.bestBins = result.bins
                this.renderBins(result.bins)
                const total = result.total >= 0 ? result.total : this.items.length
                const noSolutionFound = !this.hasValidSolution(result.bins)
                this.updateStats({
                    checked: result.checked,
                    total: total,
                    status: noSolutionFound ? 'No Solution Found!' : 'Complete',
                    isError: noSolutionFound,
                    time: result.time,
                    remaining: noSolutionFound ? '...' : '0 s',
                    binCount: result.binCount,
                    waste: result.waste
                })
            }

            if (primaryMethod === 'brute') {
                this.solver = new BruteForceSolver(this.items, this.capacity, onProgress, onComplete, this.speedProfile)
            } else if (primaryMethod === 'next-fit') {
                this.solver = new NextFitSolver(this.items, this.capacity, onProgress, onComplete, this.speedProfile)
            } else if (primaryMethod === 'best-fit') {
                this.solver = new BestFitSolver(this.items, this.capacity, onProgress, onComplete, this.speedProfile)
            }

            await this.solver.start()
        }

        async runComparison() {
            const methodConfig = METHOD_CONFIG[this.method]
            const primaryMethod = methodConfig.primaryMethod

            let primaryResult = null
            let bruteResult = null

            // Run primary method
            await new Promise(resolve => {
                const onProgress = async (state) => {
                    this.currentBins = state.bins
                    this.renderBins(state.bins)
                    const total = state.total >= 0 ? state.total : this.items.length
                    this.updateStats({
                        checked: state.checked,
                        total: total,
                        status: `Running ${primaryMethod}...`,
                        time: state.time,
                        remaining: estimateRemainingTime(state.checked, total, state.elapsedTime),
                        binCount: state.binCount,
                        waste: state.waste
                    })
                }

                const onComplete = (result) => {
                    primaryResult = result
                    resolve()
                }

                if (primaryMethod === 'next-fit') {
                    this.solver = new NextFitSolver(this.items, this.capacity, onProgress, onComplete, this.speedProfile)
                } else if (primaryMethod === 'best-fit') {
                    this.solver = new BestFitSolver(this.items, this.capacity, onProgress, onComplete, this.speedProfile)
                }

                this.solver.start()
            })

            if (this.stopRequested) return

            // Run brute force
            await new Promise(resolve => {
                const onProgress = async (state) => {
                    const total = state.total >= 0 ? state.total : this.items.length
                    this.updateStats({
                        checked: state.checked,
                        total: total,
                        status: 'Running brute force...',
                        time: state.time,
                        remaining: estimateRemainingTime(state.checked, total, state.elapsedTime),
                        binCount: state.binCount,
                        waste: state.waste
                    })
                }

                const onComplete = (result) => {
                    bruteResult = result
                    resolve()
                }

                this.solver = new BruteForceSolver(this.items, this.capacity, onProgress, onComplete, this.speedProfile)
                this.solver.start()
            })

            // Show comparison results
            this.renderBins(bruteResult.bins)
            const total = bruteResult.total >= 0 ? bruteResult.total : this.items.length
            const noSolutionFound = !this.hasValidSolution(bruteResult.bins)
            this.updateStats({
                checked: bruteResult.checked,
                total,
                status: noSolutionFound ? 'No Solution Found!' : 'Complete',
                isError: noSolutionFound,
                time: bruteResult.time,
                remaining: noSolutionFound ? '...' : '0 s',
                binCount: bruteResult.binCount,
                waste: bruteResult.waste
            })
            this.displayComparison(primaryResult, bruteResult, primaryMethod)
        }

        displayComparison(primaryResult, bruteResult, primaryMethod) {
            const primaryLabel = primaryMethod === 'next-fit' ? 'Next Fit' : 'Best Fit'
            this.leftLabel.textContent = primaryLabel
            this.leftValue.textContent = `${primaryResult.binCount} bins`
            this.leftMeta.textContent = formatTime(primaryResult.time)

            this.rightValue.textContent = `${bruteResult.binCount} bins`
            this.rightMeta.textContent = formatTime(bruteResult.time)

            const binDiff = primaryResult.binCount - bruteResult.binCount
            if (binDiff === 0) {
                this.summaryValue.textContent = 'Same result ✓'
                this.summaryValue.className = 'bin-packing-comparison-value bin-packing-summary-value is-equal'
            } else {
                this.summaryValue.textContent = `+${binDiff} extra bin${binDiff !== 1 ? 's' : ''}`
                this.summaryValue.className = 'bin-packing-comparison-value bin-packing-summary-value is-different'
            }

            const timeDiff = primaryResult.time - bruteResult.time
            const timeLabel = timeDiff > 0 ? `${formatTime(Math.abs(timeDiff))} slower` : `${formatTime(Math.abs(timeDiff))} faster`
            this.summaryMeta.textContent = timeLabel
        }

        stop() {
            this.stopRequested = true
            if (this.solver) {
                this.solver.stop()
            }
            this.setButtons(false)
            this.progressStatus.textContent = 'Stopped'
        }
    }

    // =========================================================================
    // Plugin Registration
    // =========================================================================

    function plugin(hook, vm) {
        hook.doneEach(() => {
            const elements = document.querySelectorAll('bin-packing')
            elements.forEach(element => {
                if (!element.classList.contains('bin-packing-initialized')) {
                    element.classList.add('bin-packing-initialized')
                    new BinPackingWidget(element)
                }
            })
        })
    }

    if (typeof window !== 'undefined') {
        window.DocsifyUtils.registerPlugin(plugin)
    }

})()
