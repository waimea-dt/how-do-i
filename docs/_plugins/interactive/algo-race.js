/**
 * docsify-algo-race.js - Algorithm Race Visualizer
 *
 * Side-by-side visualization comparing algorithm efficiency:
 *   - Search Mode: Linear Search vs Binary Search
 *   - Sort Mode: Bubble Sort vs Merge Sort
 *   - Compact wrapped grid display with color coding
 *   - Simple 1...N array values
 *
 * Usage in markdown:
 *   <algo-race type="search"></algo-race>
 *   <algo-race type="search" size="100" target="25"></algo-race>
 *   <algo-race type="sort"></algo-race>
 *   <algo-race type="sort" size="100"></algo-race>
 */

;(function () {

    const UI_TEXT = {
        // Search mode
        searchTitle: 'Algorithm Race',
        searchSubtitle: 'Linear vs Binary Search',
        linearTitle: 'Linear Search',
        linearCategory: 'O(n)',
        binaryTitle: 'Binary Search',
        binaryCategory: 'O(log n)',
        targetLabel: 'Target Value to Find',
        searching: 'Searching...',
        found: 'Found!',
        notFound: 'Value Not Found',
        unsortedWarning: '⚠️ Unsorted - Invalid!',

        // Sort mode
        sortTitle: 'Sort Algorithm Race',
        sortSubtitle: 'Bubble Sort vs Merge Sort',
        bubbleTitle: 'Bubble Sort',
        bubbleCategory: 'O(n²)',
        mergeTitle: 'Merge Sort',
        mergeCategory: 'O(n log n)',
        sorting: 'Sorting...',
        sorted: 'Sorted!',

        // Common
        sizeLabel: 'Array of Values',
        startButton: 'Start',
        resetButton: 'Reset',
        randomButton: 'Random',
        shuffleButton: 'Shuffle',
        sortButton: 'Sort',
        accessLabel: 'Accessed',
        compareLabel: 'Compared',
        swapLabel: 'Swapped',
        totalLabel: 'Total Cost',

        // Search legend
        legendCellSearch:     'Unchecked',
        legendTarget:         'Target',
        legendInspecting:     'Checking',
        legendChecked:        'Checked',
        legendRejected:       'Rejected',
        legendFound:          'Found',

        // Sort legend
        legendCellSort:       'Unsorted',
        legendComparing:      'Comparing',
        legendSwapping:       'Swapping',
        legendMerging:        'Merging',
        legendSorted:         'Sorted',
    }

    const SVG_ICONS = {
        race: '<svg class="no-zoom" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>',
        play: '<svg class="no-zoom" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>',
        reset: '<svg class="no-zoom" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>',
        shuffle: '<svg class="no-zoom" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shuffle-icon lucide-shuffle"><path d="m18 14 4 4-4 4"/><path d="m18 2 4 4-4 4"/><path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22"/><path d="M2 6h1.972a4 4 0 0 1 3.6 2.2"/><path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45"/></svg>',
        sort: '<svg class="no-zoom" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/></svg>',
    }

    function getLinearStepDelay(arraySize) {
        return Math.max(20, Math.floor(2000 / arraySize))
    }

    function getBinaryStepDelay(arraySize) {
        return Math.max(20, Math.floor(2000 / Math.log(arraySize)))
    }

    function getBubbleStepDelay(arraySize) {
        // Bubble sort has O(n²) operations
        // Delay must scale aggressively (inversely with n) to keep total time reasonable
        return Math.max(1, Math.floor(10 / Math.sqrt(arraySize)))
    }

    function getMergeStepDelay(arraySize) {
        // Merge sort has O(n log n) operations
        // Less aggressive scaling needed since it's more efficient
        return Math.max(2, Math.floor(100 / Math.log(arraySize)))
    }

    function shuffleArray(array) {
        // Fisher-Yates shuffle algorithm
        const shuffled = [...array]
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        return shuffled
    }

    function isSorted(array) {
        for (let i = 1; i < array.length; i++) {
            if (array[i] < array[i - 1]) {
                return false
            }
        }
        return true
    }

    // -------------------------------------------------------------------------
    // Algorithm implementations
    // -------------------------------------------------------------------------

    /**
     * Linear Search - yields step objects for animation
     * Each step: { operation, inspectIndex, found, eliminated }
     * Operations: 'access' (read value), 'compare' (with target)
     */
    function* linearSearch(array, target) {
        for (let i = 0; i < array.length; i++) {
            // Access operation
            yield {
                operation: 'access',
                inspectIndex: i,
                found: false,
                checked: [],
                eliminated: []
            }

            // Compare operation
            const found = array[i] === target
            yield {
                operation: 'compare',
                inspectIndex: i,
                found: found,
                checked: found ? [] : [i],
                eliminated: []
            }

            if (found) {
                return
            }
        }
    }

    /**
     * Binary Search - yields step objects for animation
     * Each step: { operation, inspectIndex, found, eliminated, activeRange }
     * Operations: 'access' (read value), 'compare' (with target)
     */
    function* binarySearch(array, target) {
        let left = 0
        let right = array.length - 1

        while (left <= right) {
            const mid = Math.floor((left + right) / 2)

            // Access operation
            yield {
                operation: 'access',
                inspectIndex: mid,
                found: false,
                checked: [],
                eliminated: [],
                activeRange: { left, right }
            }

            const midValue = array[mid]

            // Compare operation
            const found = midValue === target
            let eliminated = []

            if (found) {
                yield {
                    operation: 'compare',
                    inspectIndex: mid,
                    found: true,
                    checked: [],
                    eliminated: [],
                    activeRange: { left, right }
                }
                return
            }

            // Determine which half to eliminate (mid goes to checked, rest to eliminated)
            if (midValue < target) {
                // Eliminate left half; mid was directly checked
                for (let i = left; i < mid; i++) {
                    eliminated.push(i)
                }
                left = mid + 1
            } else {
                // Eliminate right half; mid was directly checked
                for (let i = mid + 1; i <= right; i++) {
                    eliminated.push(i)
                }
                right = mid - 1
            }

            yield {
                operation: 'compare',
                inspectIndex: mid,
                found: false,
                checked: [mid],
                eliminated: eliminated,
                activeRange: { left, right }
            }
        }
    }

    /**
     * Bubble Sort - yields step objects for animation
     * Each step: { operation, indices, sorted, array }
     * Operations: 'compare' (comparing two elements), 'swap' (swapping elements)
     */
    function* bubbleSort(array) {
        const arr = [...array]
        const n = arr.length
        const sortedIndices = new Set()

        for (let i = 0; i < n - 1; i++) {
            let swapped = false

            for (let j = 0; j < n - i - 1; j++) {
                // Compare operation
                yield {
                    operation: 'compare',
                    indices: [j, j + 1],
                    sorted: Array.from(sortedIndices),
                    array: [...arr]
                }

                // Swap if needed
                if (arr[j] > arr[j + 1]) {
                    ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
                    swapped = true

                    yield {
                        operation: 'swap',
                        indices: [j, j + 1],
                        sorted: Array.from(sortedIndices),
                        array: [...arr]
                    }
                }
            }

            // After each pass, the last element is in its sorted position
            sortedIndices.add(n - i - 1)

            // If no swaps occurred, array is sorted
            if (!swapped) break
        }

        // Mark all remaining elements as sorted
        for (let i = 0; i < n; i++) {
            sortedIndices.add(i)
        }

        yield {
            operation: 'complete',
            indices: [],
            sorted: Array.from(sortedIndices),
            array: [...arr]
        }
    }

    /**
     * Merge Sort - yields step objects for animation
     * Each step: { operation, indices, sorted, merging, array }
     * Operations: 'compare' (comparing elements), 'merge' (merging subarrays)
     */
    function* mergeSort(array) {
        const arr = [...array]
        const n = arr.length
        const sortedIndices = new Set()

        // Generator wrapper to yield from recursive function
        function* mergeSortHelper(start, end) {
            if (start >= end) return

            const mid = Math.floor((start + end) / 2)

            // Sort left and right halves
            yield* mergeSortHelper(start, mid)
            yield* mergeSortHelper(mid + 1, end)

            // Merge the sorted halves
            yield* merge(start, mid, end)
        }

        function* merge(start, mid, end) {
            const left = arr.slice(start, mid + 1)
            const right = arr.slice(mid + 1, end + 1)
            let i = 0, j = 0, k = start

            while (i < left.length && j < right.length) {
                // Compare elements from left and right
                yield {
                    operation: 'compare',
                    indices: [start + i, mid + 1 + j],
                    merging: Array.from({ length: end - start + 1 }, (_, idx) => start + idx),
                    sorted: Array.from(sortedIndices),
                    array: [...arr]
                }

                if (left[i] <= right[j]) {
                    arr[k] = left[i]
                    i++
                } else {
                    arr[k] = right[j]
                    j++
                }

                yield {
                    operation: 'merge',
                    indices: [k],
                    merging: Array.from({ length: end - start + 1 }, (_, idx) => start + idx),
                    sorted: Array.from(sortedIndices),
                    array: [...arr]
                }
                k++
            }

            // Copy remaining elements
            while (i < left.length) {
                arr[k] = left[i]
                yield {
                    operation: 'merge',
                    indices: [k],
                    merging: Array.from({ length: end - start + 1 }, (_, idx) => start + idx),
                    sorted: Array.from(sortedIndices),
                    array: [...arr]
                }
                i++
                k++
            }

            while (j < right.length) {
                arr[k] = right[j]
                yield {
                    operation: 'merge',
                    indices: [k],
                    merging: Array.from({ length: end - start + 1 }, (_, idx) => start + idx),
                    sorted: Array.from(sortedIndices),
                    array: [...arr]
                }
                j++
                k++
            }

            // Don't mark as sorted yet - only at the very end
            // This makes it clearer that elements aren't in final position until complete
        }

        yield* mergeSortHelper(0, n - 1)

        // Final state - all sorted
        for (let i = 0; i < n; i++) {
            sortedIndices.add(i)
        }

        yield {
            operation: 'complete',
            indices: [],
            sorted: Array.from(sortedIndices),
            array: [...arr]
        }
    }

    // -------------------------------------------------------------------------
    // State management
    // -------------------------------------------------------------------------

    class AlgoRaceState {
        constructor(mode, size, target, array, sorted = true) {
            this.mode = mode // 'search' or 'sort'
            this.size = size
            this.target = target
            this.array = array
            this.isSorted = sorted
            this.isRunning = false
            this.isComplete = false

            if (mode === 'search') {
                // Search mode: linear and binary
                this.linear = {
                    generator: null,
                    accesses: 0,
                    compares: 0,
                    swaps: 0,
                    currentIndex: -1,
                    currentOperation: null,
                    checked: new Set(),
                    eliminated: new Set(),
                    found: false,
                    complete: false
                }

                this.binary = {
                    generator: null,
                    accesses: 0,
                    compares: 0,
                    swaps: 0,
                    currentIndex: -1,
                    currentOperation: null,
                    checked: new Set(),
                    eliminated: new Set(),
                    activeRange: null,
                    found: false,
                    complete: false
                }
            } else if (mode === 'sort') {
                // Sort mode: bubble and merge
                this.bubble = {
                    generator: null,
                    accesses: 0,
                    compares: 0,
                    swaps: 0,
                    currentIndices: [],
                    currentOperation: null,
                    sorted: new Set(),
                    complete: false,
                    array: [...array]
                }

                this.merge = {
                    generator: null,
                    accesses: 0,
                    compares: 0,
                    swaps: 0,
                    currentIndices: [],
                    currentOperation: null,
                    sorted: new Set(),
                    merging: [],
                    complete: false,
                    array: [...array]
                }
            }
        }

        initGenerators() {
            if (this.mode === 'search') {
                this.linear.generator = linearSearch(this.array, this.target)
                this.binary.generator = binarySearch(this.array, this.target)
            } else if (this.mode === 'sort') {
                this.bubble.generator = bubbleSort(this.array)
                this.merge.generator = mergeSort(this.array)
            }
        }

        reset() {
            this.isRunning = false
            this.isComplete = false

            if (this.mode === 'search') {
                this.linear = {
                    generator: null,
                    accesses: 0,
                    compares: 0,
                    swaps: 0,
                    currentIndex: -1,
                    currentOperation: null,
                    checked: new Set(),
                    eliminated: new Set(),
                    found: false,
                    complete: false
                }

                this.binary = {
                    generator: null,
                    accesses: 0,
                    compares: 0,
                    swaps: 0,
                    currentIndex: -1,
                    currentOperation: null,
                    checked: new Set(),
                    eliminated: new Set(),
                    activeRange: null,
                    found: false,
                    complete: false
                }
            } else if (this.mode === 'sort') {
                this.bubble = {
                    generator: null,
                    accesses: 0,
                    compares: 0,
                    swaps: 0,
                    currentIndices: [],
                    currentOperation: null,
                    sorted: new Set(),
                    complete: false,
                    array: [...this.array]
                }

                this.merge = {
                    generator: null,
                    accesses: 0,
                    compares: 0,
                    swaps: 0,
                    currentIndices: [],
                    currentOperation: null,
                    sorted: new Set(),
                    merging: [],
                    complete: false,
                    array: [...this.array]
                }
            }
        }
    }

    // -------------------------------------------------------------------------
    // HTML Generation Helpers
    // -------------------------------------------------------------------------

    function createStatsRowHTML(label, id, isTotal = false) {
        const cssClass = isTotal ? 'ar-stat-row ar-stat-total' : 'ar-stat-row'
        return `
            <div class="${cssClass}">
                <span class="ar-stat-label">${label}:</span>
                <span class="ar-stat-value" id="${id}">0</span>
            </div>`
    }

    function createTrackHTML(title, category, cssClass, instanceId, prefix, mode) {
        const statsHTML = mode === 'search'
            ? `${createStatsRowHTML(UI_TEXT.accessLabel, `ar-${prefix}-${instanceId}-accesses`)}
               ${createStatsRowHTML(UI_TEXT.compareLabel, `ar-${prefix}-${instanceId}-compares`)}`
            : `${createStatsRowHTML(UI_TEXT.compareLabel, `ar-${prefix}-${instanceId}-compares`)}
               ${createStatsRowHTML(UI_TEXT.swapLabel, `ar-${prefix}-${instanceId}-swaps`)}`

        return `
            <div class="ar-track ${cssClass}">
                <div class="ar-track-header">
                    <div class="ar-track-title-group">
                        <h4 class="ar-track-title">${title}</h4>
                        <span class="ar-track-category">${category}</span>
                        <span class="ar-track-status" id="ar-${prefix}-${instanceId}-status"></span>
                    </div>
                    <div class="ar-track-stats">
                        ${statsHTML}
                        ${createStatsRowHTML(UI_TEXT.totalLabel, `ar-${prefix}-${instanceId}-total`, true)}
                    </div>
                </div>
                <div class="ar-grid" id="ar-${prefix}-grid-${instanceId}"></div>
            </div>`
    }

    function createLegendItemHTML(cssClass, text) {
        return `
            <div class="ar-legend-item ${cssClass}">
                <div class="ar-legend-swatch"></div>
                <span>${text}</span>
            </div>`
    }

    // -------------------------------------------------------------------------
    // Rendering
    // -------------------------------------------------------------------------

    let instanceCounter = 0

    function buildUI(mode, initialSize, instanceId, initialTarget) {
        const wrapper = document.createElement('div')
        wrapper.className = 'ar-wrapper'

        // Generate array based on mode
        // Search mode: sorted (so binary search works)
        // Sort mode: shuffled (so we can see the sorting in action)
        const baseArray = generateSimpleArray(initialSize)
        const array = mode === 'sort' ? shuffleArray(baseArray) : baseArray

        // For search mode, pick a good target
        const actualTarget = mode === 'search'
            ? (initialTarget || pickRandomTargetWithMinBinarySteps(array, 5))
            : null

        // Mode-specific titles
        const title = mode === 'sort' ? UI_TEXT.sortTitle : UI_TEXT.searchTitle
        const subtitle = mode === 'sort' ? UI_TEXT.sortSubtitle : UI_TEXT.searchSubtitle

        // Target input row (only for search mode)
        const targetRowHTML = mode === 'search' ? `
            <div class="ar-control-row">
                <label class="ar-label">${UI_TEXT.targetLabel}</label>
                <div class="ar-target-group">
                    <input type="number" class="ar-target-input" id="ar-target-input-${instanceId}"
                        min="1" max="${initialSize}" value="${actualTarget}">
                    <button class="ar-btn ar-btn-small" id="ar-random-btn-${instanceId}" title="${UI_TEXT.randomButton}">
                        ${SVG_ICONS.shuffle}
                    </button>
                </div>
            </div>` : ''

        // Sort button (initially hidden since both modes start sorted)
        const sortButtonHTML = `
            <button class="ar-btn ar-btn-small" id="ar-sort-btn-${instanceId}" style="display: none;">
                ${SVG_ICONS.sort}
                <span>${UI_TEXT.sortButton}</span>
            </button>`

        // Legend based on mode
        const legendHTML = mode === 'search' ? `
            ${createLegendItemHTML('is-target', UI_TEXT.legendTarget)}
            ${createLegendItemHTML('is-inspecting', UI_TEXT.legendInspecting)}
            ${createLegendItemHTML('is-checked', UI_TEXT.legendChecked)}
            ${createLegendItemHTML('is-found', UI_TEXT.legendFound)}
            ${createLegendItemHTML('is-value', UI_TEXT.legendCellSearch)}
            ${createLegendItemHTML('is-rejected', UI_TEXT.legendRejected)}` : `
            ${createLegendItemHTML('is-value', UI_TEXT.legendCellSort)}
            ${createLegendItemHTML('is-comparing', UI_TEXT.legendComparing)}
            ${createLegendItemHTML('is-swapping', UI_TEXT.legendSwapping)}
            ${createLegendItemHTML('is-merging', UI_TEXT.legendMerging)}
            ${createLegendItemHTML('is-sorted', UI_TEXT.legendSorted)}`

        // Tracks based on mode
        const tracksHTML = mode === 'search' ? `
            ${createTrackHTML(UI_TEXT.linearTitle, UI_TEXT.linearCategory, 'is-linear', instanceId, 'linear', mode)}
            ${createTrackHTML(UI_TEXT.binaryTitle, UI_TEXT.binaryCategory, 'is-binary', instanceId, 'binary', mode)}` : `
            ${createTrackHTML(UI_TEXT.bubbleTitle, UI_TEXT.bubbleCategory, 'is-bubble', instanceId, 'bubble', mode)}
            ${createTrackHTML(UI_TEXT.mergeTitle, UI_TEXT.mergeCategory, 'is-merge', instanceId, 'merge', mode)}`

        wrapper.innerHTML = `
            <div class="ar-header">
                <div class="ar-header-text">
                    <h3 class="ar-title">${SVG_ICONS.race} ${title}</h3>
                    <p class="ar-subtitle">${subtitle}</p>
                </div>
            </div>

            <div class="ar-content">
                <!-- Controls -->
                <div class="ar-controls">
                    <div class="ar-control-group">
                        <div class="ar-control-row">
                            <label class="ar-label">${UI_TEXT.sizeLabel}</label>
                            <div class="ar-slider-group">
                                <label>N</label>
                                <input type="range" class="ar-slider" id="ar-size-slider-${instanceId}"
                                    min="20" max="200" step="10" value="${initialSize}">
                                <span class="ar-slider-value" id="ar-size-value-${instanceId}">${initialSize}</span>
                                ${sortButtonHTML}
                                <button class="ar-btn ar-btn-small" id="ar-shuffle-btn-${instanceId}">
                                    ${SVG_ICONS.shuffle}
                                    <span>${UI_TEXT.shuffleButton}</span>
                                </button>
                            </div>
                        </div>

                        ${targetRowHTML}
                    </div>
                </div>

                <!-- Buttons -->
                <div class="ar-button-group">
                    <button class="ar-btn ar-btn-primary" id="ar-start-btn-${instanceId}">
                        ${SVG_ICONS.play}
                        <span>${UI_TEXT.startButton}</span>
                    </button>
                    <button class="ar-btn" id="ar-reset-btn-${instanceId}">
                        ${SVG_ICONS.reset}
                        <span>${UI_TEXT.resetButton}</span>
                    </button>
                </div>

                <!-- Legend -->
                <div class="ar-legend">
                    ${legendHTML}
                </div>

                <!-- Race tracks -->
                <div class="ar-race-container">
                    ${tracksHTML}
                </div>
            </div>
        `

        return { wrapper, array, target: actualTarget, instanceId }
    }

    function generateSimpleArray(size) {
        const array = []
        for (let i = 1; i <= size; i++) {
            array.push(i)
        }
        return array
    }

    function countBinarySearchComparisons(array, target) {
        let left = 0
        let right = array.length - 1
        let comparisons = 0

        while (left <= right) {
            const mid = Math.floor((left + right) / 2)
            comparisons++

            if (array[mid] === target) {
                break
            }

            if (array[mid] < target) {
                left = mid + 1
            } else {
                right = mid - 1
            }
        }

        return comparisons
    }

    function pickRandomTargetWithMinBinarySteps(array, minSteps) {
        const scoredValues = array.map(value => ({
            value,
            steps: countBinarySearchComparisons(array, value)
        }))

        const preferred = scoredValues.filter(item => item.steps >= minSteps)

        // If preferred set is too small, widen to near-maximum step values
        if (preferred.length < 3) {
            const maxSteps = Math.max(...scoredValues.map(item => item.steps))
            const widened = scoredValues.filter(item => item.steps >= maxSteps - 1)
            return widened[Math.floor(Math.random() * widened.length)].value
        }

        return preferred[Math.floor(Math.random() * preferred.length)].value
    }

    function renderGrid(container, mode, array, targetValue, state) {
        container.innerHTML = ''
        // Use the algorithm's current array state if available (for sort mode)
        const displayArray = state.array || array

        displayArray.forEach((value, index) => {
            const cell = document.createElement('div')
            cell.className = 'ar-cell'
            cell.textContent = value

            if (mode === 'search') {
                // Search mode visualization
                const isTarget = value === targetValue
                const isCurrentlyInspecting = index === state.currentIndex && !state.found
                const isChecked = state.checked.has(index)
                const isRejected = state.eliminated.has(index)
                const isFound = state.found && index === state.currentIndex

                // Apply classes based on state (priority order matters)
                // Note: isTarget checked before isRejected so targets remain visible even when rejected
                if (isFound) {
                    cell.classList.add('is-found')
                } else if (isCurrentlyInspecting) {
                    cell.classList.add('is-inspecting')
                    // Add operation-specific class
                    if (state.currentOperation) {
                        cell.classList.add(`is-${state.currentOperation}`)
                    }
                } else if (isChecked) {
                    cell.classList.add('is-checked')
                } else if (isTarget) {
                    // Check target before rejected so it stays visible
                    cell.classList.add('is-target')
                } else if (isRejected) {
                    cell.classList.add('is-rejected')
                }
            } else if (mode === 'sort') {
                // Sort mode visualization
                const isComparing = state.currentOperation === 'compare' && state.currentIndices.includes(index)
                const isSwapping = state.currentOperation === 'swap' && state.currentIndices.includes(index)
                const isMerging = state.merging && state.merging.includes(index) && !isComparing && !isSwapping
                const isSorted = state.sorted && state.sorted.has(index)

                // Apply classes based on state (priority order matters)
                // Sorted takes highest priority, then active operations, then merging
                if (isSorted && !isSwapping && !isComparing) {
                    cell.classList.add('is-sorted')
                } else if (isSwapping) {
                    cell.classList.add('is-swapping')
                } else if (isComparing) {
                    cell.classList.add('is-comparing')
                } else if (isMerging) {
                    cell.classList.add('is-merging')
                }
            }

            container.appendChild(cell)
        })
    }

    function updateStats(prefix, state, mode, isSorted = true) {
        if (mode === 'search') {
            const accesses = document.getElementById(`${prefix}-accesses`)
            const compares = document.getElementById(`${prefix}-compares`)
            const total = document.getElementById(`${prefix}-total`)
            const status = document.getElementById(`${prefix}-status`)

            if (accesses) accesses.textContent = state.accesses
            if (compares) compares.textContent = state.compares
            if (total) total.textContent = state.accesses + state.compares + state.swaps

            if (status) {
                // Priority order: completion states first, then warnings
                if (state.found && state.complete) {
                    // Search completed and found target
                    status.textContent = UI_TEXT.found
                    status.classList.add('is-found')
                    status.style.color = ''
                } else if (!state.found && state.complete) {
                    // Search completed but target not found
                    status.textContent = UI_TEXT.notFound
                    status.classList.remove('is-found')
                    status.classList.add('warning')
                } else if (prefix.includes('binary') && !isSorted) {
                    // Show unsorted warning for binary search (before running)
                    status.textContent = UI_TEXT.unsortedWarning
                    status.classList.remove('is-found')
                    status.classList.add('warning')
                } else if ((state.accesses + state.compares) > 0 && !state.complete) {
                    // Search in progress
                    status.textContent = UI_TEXT.searching
                    status.classList.remove('is-found')
                    status.style.color = ''
                } else {
                    status.textContent = ''
                    status.classList.remove('is-found')
                    status.style.color = ''
                }
            }
        } else if (mode === 'sort') {
            const compares = document.getElementById(`${prefix}-compares`)
            const swaps = document.getElementById(`${prefix}-swaps`)
            const total = document.getElementById(`${prefix}-total`)
            const status = document.getElementById(`${prefix}-status`)

            if (compares) compares.textContent = state.compares
            if (swaps) swaps.textContent = state.swaps
            if (total) total.textContent = state.compares + state.swaps

            if (status) {
                if (state.complete) {
                    status.textContent = UI_TEXT.sorted
                    status.classList.add('is-found')
                } else if ((state.compares + state.swaps) > 0) {
                    status.textContent = UI_TEXT.sorting
                    status.classList.remove('is-found')
                } else {
                    status.textContent = ''
                    status.classList.remove('is-found')
                }
            }
        }
    }

    // -------------------------------------------------------------------------
    // Animation controller
    // -------------------------------------------------------------------------

    /**
     * Execute search phase
     */
    async function executeSearchPhase(algorithmState, gridId, array, targetValue, stepDelay, trackSelector, statsPrefix, shouldContinue, isSorted) {
        const track = document.querySelector(trackSelector)
        if (track) track.classList.add('is-running')

        while (shouldContinue() && !algorithmState.complete) {
            const result = algorithmState.generator.next()

            if (!result.done && result.value) {
                const step = result.value
                algorithmState.currentIndex = step.inspectIndex
                algorithmState.currentOperation = step.operation

                if (step.operation === 'access') algorithmState.accesses++
                else if (step.operation === 'compare') algorithmState.compares++

                if (step.found) {
                    algorithmState.found = true
                    algorithmState.complete = true
                }

                ;(step.checked || []).forEach(i => algorithmState.checked.add(i))
                ;(step.eliminated || []).forEach(i => algorithmState.eliminated.add(i))

                if (step.activeRange) algorithmState.activeRange = step.activeRange
            } else {
                algorithmState.complete = true
            }

            renderGrid(document.getElementById(gridId), 'search', array, targetValue, algorithmState)
            updateStats(statsPrefix, algorithmState, 'search', isSorted)

            await sleep(stepDelay)
        }

        if (track) track.classList.remove('is-running')
    }

    /**
     * Execute sort phase
     */
    async function executeSortPhase(algorithmState, gridId, stepDelay, trackSelector, statsPrefix, shouldContinue) {
        const track = document.querySelector(trackSelector)
        if (track) track.classList.add('is-running')

        while (shouldContinue() && !algorithmState.complete) {
            const result = algorithmState.generator.next()

            if (!result.done && result.value) {
                const step = result.value
                algorithmState.currentOperation = step.operation
                algorithmState.currentIndices = step.indices || []

                if (step.operation === 'compare') algorithmState.compares++
                else if (step.operation === 'swap' || step.operation === 'merge') algorithmState.swaps++

                if (step.sorted) algorithmState.sorted = new Set(step.sorted)
                if (step.merging) algorithmState.merging = step.merging
                if (step.array) algorithmState.array = step.array
                if (step.operation === 'complete') algorithmState.complete = true
            } else {
                algorithmState.complete = true
            }

            renderGrid(document.getElementById(gridId), 'sort', null, null, algorithmState)
            updateStats(statsPrefix, algorithmState, 'sort')

            await sleep(stepDelay)
        }

        if (track) track.classList.remove('is-running')
    }

    async function runSearchRace(state, array, targetValue, instanceId) {
        state.initGenerators()
        const linearStepDelay = getLinearStepDelay(array.length)
        const binaryStepDelay = getBinaryStepDelay(array.length)

        await executeSearchPhase(state.linear, `ar-linear-grid-${instanceId}`, array, targetValue,
            linearStepDelay, `.ar-track.is-linear`, `ar-linear-${instanceId}`, () => state.isRunning, state.isSorted)

        if (!state.isRunning) return
        await sleep(2000)
        if (!state.isRunning) return

        await executeSearchPhase(state.binary, `ar-binary-grid-${instanceId}`, array, targetValue,
            binaryStepDelay, `.ar-track.is-binary`, `ar-binary-${instanceId}`, () => state.isRunning, state.isSorted)

        state.isComplete = true
    }

    async function runSortRace(state, instanceId) {
        state.initGenerators()
        const bubbleStepDelay = getBubbleStepDelay(state.array.length)
        const mergeStepDelay = getMergeStepDelay(state.array.length)

        await executeSortPhase(state.bubble, `ar-bubble-grid-${instanceId}`,
            bubbleStepDelay, `.ar-track.is-bubble`, `ar-bubble-${instanceId}`, () => state.isRunning)

        if (!state.isRunning) return
        await sleep(2000)
        if (!state.isRunning) return

        await executeSortPhase(state.merge, `ar-merge-grid-${instanceId}`,
            mergeStepDelay, `.ar-track.is-merge`, `ar-merge-${instanceId}`, () => state.isRunning)

        state.isComplete = true
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    // -------------------------------------------------------------------------
    // Initialization
    // -------------------------------------------------------------------------

    class AlgoRaceVisualizer {
        constructor(element) {
            this.element = element
            this.wrapper = null
            this.state = null
            this.array = null
            this.target = null
            this.mode = null
            this.instanceId = instanceCounter++
            this.init()
        }

        init() {
            const initialSize = parseInt(this.element.getAttribute('size')) || 20
            const initialTarget = parseInt(this.element.getAttribute('target')) || null
            const mode = this.element.getAttribute('type') || 'search'
            this.mode = mode

            const { wrapper, array, target, instanceId } = buildUI(mode, initialSize, this.instanceId, initialTarget)
            this.wrapper = wrapper
            this.array = array
            this.target = target
            this.state = new AlgoRaceState(mode, initialSize, target, array, mode === 'search') // Search sorted, sort unsorted

            this.element.appendChild(wrapper)

            // Render initial grids
            this.renderBothGrids()

            // Set initial button visibility based on mode
            // Search mode: starts sorted (show shuffle button)
            // Sort mode: starts shuffled (show sort button)
            this.toggleShuffleSortButtons(this.mode === 'search')

            this.attachEventListeners()
        }

        renderBothGrids() {
            if (this.mode === 'search') {
                renderGrid(
                    document.getElementById(`ar-linear-grid-${this.instanceId}`),
                    'search',
                    this.array,
                    this.target,
                    this.state.linear
                )
                renderGrid(
                    document.getElementById(`ar-binary-grid-${this.instanceId}`),
                    'search',
                    this.array,
                    this.target,
                    this.state.binary
                )
            } else if (this.mode === 'sort') {
                renderGrid(
                    document.getElementById(`ar-bubble-grid-${this.instanceId}`),
                    'sort',
                    null,
                    null,
                    this.state.bubble
                )
                renderGrid(
                    document.getElementById(`ar-merge-grid-${this.instanceId}`),
                    'sort',
                    null,
                    null,
                    this.state.merge
                )
            }
        }

        attachEventListeners() {
            // Size slider
            const sizeSlider = document.getElementById(`ar-size-slider-${this.instanceId}`)
            const sizeValue = document.getElementById(`ar-size-value-${this.instanceId}`)
            if (sizeSlider && sizeValue) {
                sizeSlider.addEventListener('input', (e) => {
                    const size = parseInt(e.target.value)
                    sizeValue.textContent = size
                    this.updateSize(size)
                    if (this.mode === 'search') {
                        this.randomTarget()
                    }
                })
            }

            // Target input (search mode only)
            if (this.mode === 'search') {
                const targetInput = document.getElementById(`ar-target-input-${this.instanceId}`)
                if (targetInput) {
                    targetInput.addEventListener('change', (e) => {
                    let target = parseInt(e.target.value)
                    // Clamp to valid range
                    if (target < 1) target = 1
                    if (target > this.array.length) target = this.array.length
                    targetInput.value = target
                    this.target = target
                    this.state.target = target

                    // Reset the UI state when target changes
                    this.state.reset()
                    this.renderBothGrids()
                    this.updateAllStats()

                    // Re-enable start button
                    const startBtn = document.getElementById(`ar-start-btn-${this.instanceId}`)
                    if (startBtn) startBtn.disabled = false
                })
            }

            // Random button (search mode only)
            const randomBtn = document.getElementById(`ar-random-btn-${this.instanceId}`)
            if (randomBtn) {
                randomBtn.addEventListener('click', () => {
                    this.randomTarget()
                })
            }
        }

        // Sort button (both modes)
        const sortBtn = document.getElementById(`ar-sort-btn-${this.instanceId}`)
        if (sortBtn) {
            sortBtn.addEventListener('click', () => {
                this.sortArray()
            })
        }

        // Start button
        const startBtn = document.getElementById(`ar-start-btn-${this.instanceId}`)
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                if (!this.state.isRunning) {
                    this.startRace()
                }
            })
        }

        // Reset button
        const resetBtn = document.getElementById(`ar-reset-btn-${this.instanceId}`)
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.reset()
            })
        }

        // Shuffle button
        const shuffleBtn = document.getElementById(`ar-shuffle-btn-${this.instanceId}`)
        if (shuffleBtn) {
            shuffleBtn.addEventListener('click', () => {
                this.shuffleArray()
            })
        }
    }

    updateSize(size) {
        const baseArray = generateSimpleArray(size)
        // Search mode stays sorted, sort mode stays shuffled
        this.array = this.mode === 'sort' ? shuffleArray(baseArray) : baseArray

        if (this.mode === 'search') {
            // Adjust target to be in valid range
            if (this.target > size) {
                this.target = size
            }

            this.state = new AlgoRaceState('search', size, this.target, this.array, true)

            // Update target input max
            const targetInput = document.getElementById(`ar-target-input-${this.instanceId}`)
            if (targetInput) {
                targetInput.max = size
                targetInput.value = this.target
            }
        } else if (this.mode === 'sort') {
            this.state = new AlgoRaceState('sort', size, null, this.array, false)
        }

        // Maintain mode-specific button visibility (search=sorted, sort=unsorted)
        this.toggleShuffleSortButtons(this.mode === 'search')

        this.renderBothGrids()
        this.updateAllStats()
    }

    randomTarget() {
        if (this.mode !== 'search') return

        // If sorted, pick a target that gives interesting binary search steps
        // If unsorted, just pick any random value from the array
        if (this.state.isSorted) {
            this.target = pickRandomTargetWithMinBinarySteps(this.array, 5)
        } else {
            this.target = this.array[Math.floor(Math.random() * this.array.length)]
        }

        this.state.target = this.target

        const targetInput = document.getElementById(`ar-target-input-${this.instanceId}`)
        if (targetInput) targetInput.value = this.target

        // Reset the UI state
        this.state.reset()
        this.renderBothGrids()
        this.updateAllStats()

        // Re-enable start button
        const startBtn = document.getElementById(`ar-start-btn-${this.instanceId}`)
        if (startBtn) startBtn.disabled = false
    }

    async startRace() {
        if (this.state.isRunning) return

        this.state.reset()
        this.state.isRunning = true
        if (this.mode === 'search') {
            this.state.target = this.target
        }
        this.renderBothGrids()
        this.updateAllStats()

        const startBtn = document.getElementById(`ar-start-btn-${this.instanceId}`)
        if (startBtn) startBtn.disabled = true

        if (this.mode === 'search') {
            await runSearchRace(this.state, this.array, this.target, this.instanceId)
        } else if (this.mode === 'sort') {
            await runSortRace(this.state, this.instanceId)
        }

        if (startBtn) startBtn.disabled = false
        this.state.isRunning = false
    }

    reset() {
        this.state.reset()
        this.renderBothGrids()
        this.updateAllStats()

        // Re-enable start button
        const startBtn = document.getElementById(`ar-start-btn-${this.instanceId}`)
        if (startBtn) startBtn.disabled = false
    }

    updateAllStats() {
        if (this.mode === 'search') {
            updateStats(`ar-linear-${this.instanceId}`, this.state.linear, 'search', this.state.isSorted)
            updateStats(`ar-binary-${this.instanceId}`, this.state.binary, 'search', this.state.isSorted)
        } else if (this.mode === 'sort') {
            updateStats(`ar-bubble-${this.instanceId}`, this.state.bubble, 'sort')
            updateStats(`ar-merge-${this.instanceId}`, this.state.merge, 'sort')
        }
    }

    shuffleArray() {
        this.array = shuffleArray(this.array)
        this.state.array = this.array

        if (this.mode === 'search') {
            this.state.isSorted = false
        } else if (this.mode === 'sort') {
            // For sort mode, update both algorithm states with the new shuffled array
            this.state.bubble.array = [...this.array]
            this.state.merge.array = [...this.array]
            this.state.isSorted = false
        }

        // Show sort button, hide shuffle button
        this.toggleShuffleSortButtons(false)

        // Reset the UI state
        this.state.reset()
        this.renderBothGrids()
        this.updateAllStats()

        // Re-enable start button
        const startBtn = document.getElementById(`ar-start-btn-${this.instanceId}`)
        if (startBtn) startBtn.disabled = false
    }

    sortArray() {
        this.array = [...this.array].sort((a, b) => a - b)
        this.state.array = this.array
        this.state.isSorted = true

        if (this.mode === 'sort') {
            // For sort mode, update both algorithm states with the sorted array
            this.state.bubble.array = [...this.array]
            this.state.merge.array = [...this.array]
        }

        // Reset the UI state
        this.state.reset()
        this.renderBothGrids()
        this.updateAllStats()

        // Hide sort button, show shuffle button
        this.toggleShuffleSortButtons(true)

        // Re-enable start button
        const startBtn = document.getElementById(`ar-start-btn-${this.instanceId}`)
        if (startBtn) startBtn.disabled = false
    }

    toggleShuffleSortButtons(sorted) {
        const shuffleBtn = document.getElementById(`ar-shuffle-btn-${this.instanceId}`)
        const sortBtn = document.getElementById(`ar-sort-btn-${this.instanceId}`)

        if (shuffleBtn) shuffleBtn.style.display = sorted ? '' : 'none'
        if (sortBtn) sortBtn.style.display = sorted ? 'none' : ''
    }
}

// -------------------------------------------------------------------------
// Plugin registration
// -------------------------------------------------------------------------

if (window.$docsify) {
        window.$docsify.plugins = window.$docsify.plugins || []
        window.$docsify.plugins.push(function (hook, vm) {
            hook.doneEach(function () {
                const elements = document.querySelectorAll('algo-race')
                elements.forEach(el => new AlgoRaceVisualizer(el))
            })
        })
    }

})()
