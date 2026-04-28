/**
 * docsify-algo-race.js - Algorithm Race Visualizer
 *
 * Side-by-side visualization comparing algorithm efficiency:
 *   - Linear Search vs Binary Search (or Logarithmic)
 *   - Compact wrapped grid display
 *   - Visual search states with color coding
 *   - Simple 1...N array values
 *
 * Usage in markdown:
 *   <algo-race></algo-race>
 *   <algo-race size="64"></algo-race>
 */

;(function () {

	const UI_TEXT = {
		title: 'Algorithm Race',
		subtitle: 'Linear vs Binary Search',
		sizeLabel: 'Array Size (N)',
		targetLabel: 'Target',
		startButton: 'Start',
		resetButton: 'Reset',
		randomButton: 'Random',
		accessLabel: 'Access',
		compareLabel: 'Compare',
		swapLabel: 'Swap',
		totalLabel: 'Total Cost',
		searching: 'Searching...',
		found: 'Found!',
		linearTitle: 'Linear Search, O(n)',
		binaryTitle: 'Binary Search, O(log n)',

		legendCell:       'Value',
		legendTarget:     'Target',
		legendInspecting: 'Checking',
		legendChecked:    'No Match',
		legendRejected:   'Rejected',
		legendFound:      'Found',
	}

	const SVG_ICONS = {
		race: '<svg class="no-zoom" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>',
		play: '<svg class="no-zoom" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>',
		reset: '<svg class="no-zoom" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>',
        shuffle: '<svg class="no-zoom" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shuffle-icon lucide-shuffle"><path d="m18 14 4 4-4 4"/><path d="m18 2 4 4-4 4"/><path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22"/><path d="M2 6h1.972a4 4 0 0 1 3.6 2.2"/><path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45"/></svg>',
	}

	function getLinearStepDelay(arraySize) {
		return Math.max(20, Math.floor(2000 / arraySize))
	}

	function getBinaryStepDelay(arraySize) {
		return Math.max(20, Math.floor(2000 / Math.log(arraySize)))
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

	// -------------------------------------------------------------------------
	// State management
	// -------------------------------------------------------------------------

	class AlgoRaceState {
		constructor(size, target, array) {
			this.size = size
			this.target = target
			this.array = array
			this.isRunning = false
			this.isComplete = false

			// Algorithm states with operation counts
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
		}

		initGenerators() {
			this.linear.generator = linearSearch(this.array, this.target)
			this.binary.generator = binarySearch(this.array, this.target)
		}

		reset() {
			this.isRunning = false
			this.isComplete = false

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
		}
	}

	// -------------------------------------------------------------------------
	// Rendering
	// -------------------------------------------------------------------------

	let instanceCounter = 0

	function buildUI(initialSize, instanceId) {
		const wrapper = document.createElement('div')
		wrapper.className = 'ar-wrapper'

		// Generate simple 1...N array
		const array = generateSimpleArray(initialSize)
		// Pick a random target that usually gives enough binary search steps
		const actualTarget = pickRandomTargetWithMinBinarySteps(array, 5)

		// Calculate cell size based on N (smaller for larger N)
		const cellSize = Math.max(0.5, 1.5 / Math.sqrt(initialSize / 16))
		wrapper.style.setProperty('--ar-cell-size', `${cellSize}rem`)

		wrapper.innerHTML = `
			<div class="ar-header">
				<div class="ar-header-text">
					<h3 class="ar-title">${SVG_ICONS.race} ${UI_TEXT.title}</h3>
					<p class="ar-subtitle">${UI_TEXT.subtitle}</p>
				</div>
			</div>

			<div class="ar-content">
				<!-- Controls -->
				<div class="ar-controls">
					<div class="ar-control-group">
						<div class="ar-control-row">
							<label class="ar-label">${UI_TEXT.sizeLabel}</label>
							<div class="ar-slider-group">
								<input type="range" class="ar-slider" id="ar-size-slider-${instanceId}"
								min="16" max="256" step="16" value="${initialSize}">
								<span class="ar-slider-value" id="ar-size-value-${instanceId}">${initialSize}</span>
							</div>
						</div>

						<div class="ar-control-row">
							<label class="ar-label">${UI_TEXT.targetLabel}</label>
							<div class="ar-target-group">
								<input type="number" class="ar-target-input" id="ar-target-input-${instanceId}"
									min="1" max="${initialSize}" value="${actualTarget}">
								<button class="ar-btn ar-btn-small" id="ar-random-btn-${instanceId}" title="${UI_TEXT.randomButton}">
									${SVG_ICONS.shuffle}
								</button>
							</div>
						</div>
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
					<div class="ar-legend-item is-value">
						<div class="ar-legend-swatch"></div>
						<span>${UI_TEXT.legendCell}</span>
					</div>
					<div class="ar-legend-item is-target">
						<div class="ar-legend-swatch"></div>
						<span>${UI_TEXT.legendTarget}</span>
					</div>
					<div class="ar-legend-item is-inspecting">
						<div class="ar-legend-swatch"></div>
						<span>${UI_TEXT.legendInspecting}</span>
					</div>
                    <div class="ar-legend-item is-checked">
					    <div class="ar-legend-swatch"></div>
                        <span>${UI_TEXT.legendChecked}</span>
                    </div>
                    <div class="ar-legend-item is-found">
						<div class="ar-legend-swatch"></div>
						<span>${UI_TEXT.legendFound}</span>
					</div>
					<div class="ar-legend-item is-rejected">
						<div class="ar-legend-swatch"></div>
						<span>${UI_TEXT.legendRejected}</span>
					</div>
				</div>

				<!-- Race tracks -->
				<div class="ar-race-container">
					<!-- Linear Search Track -->
					<div class="ar-track is-linear">
						<div class="ar-track-header">
							<h4 class="ar-track-title">${UI_TEXT.linearTitle}</h4>
							<div class="ar-track-stats">
							<div class="ar-stat-row">
								<span class="ar-stat-label">${UI_TEXT.accessLabel}:</span>
							<span class="ar-stat-value" id="ar-linear-${instanceId}-accesses">0</span>
						</div>
						<div class="ar-stat-row">
							<span class="ar-stat-label">${UI_TEXT.compareLabel}:</span>
							<span class="ar-stat-value" id="ar-linear-${instanceId}-compares">0</span>
						</div>
						<div class="ar-stat-row ar-stat-total">
							<span class="ar-stat-label">${UI_TEXT.totalLabel}:</span>
							<span class="ar-stat-value" id="ar-linear-${instanceId}-total">0</span>
						</div>
							<span class="ar-track-status" id="ar-linear-${instanceId}-status"></span>
							</div>
						</div>
						<div class="ar-grid" id="ar-linear-grid-${instanceId}"></div>
					</div>

					<!-- Binary Search Track -->
					<div class="ar-track is-binary">
						<div class="ar-track-header">
							<h4 class="ar-track-title">${UI_TEXT.binaryTitle}</h4>
							<div class="ar-track-stats">
							<div class="ar-stat-row">
								<span class="ar-stat-label">${UI_TEXT.accessLabel}:</span>
							<span class="ar-stat-value" id="ar-binary-${instanceId}-accesses">0</span>
						</div>
						<div class="ar-stat-row">
							<span class="ar-stat-label">${UI_TEXT.compareLabel}:</span>
							<span class="ar-stat-value" id="ar-binary-${instanceId}-compares">0</span>
						</div>
						<div class="ar-stat-row ar-stat-total">
							<span class="ar-stat-label">${UI_TEXT.totalLabel}:</span>
							<span class="ar-stat-value" id="ar-binary-${instanceId}-total">0</span>
						</div>
							<span class="ar-track-status" id="ar-binary-${instanceId}-status"></span>
							</div>
						</div>
						<div class="ar-grid" id="ar-binary-grid-${instanceId}"></div>
					</div>
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

	function renderGrid(container, array, targetValue, state) {
		container.innerHTML = ''
		array.forEach((value, index) => {
			const cell = document.createElement('div')
			cell.className = 'ar-cell'

			// Determine cell state
			const isTarget = value === targetValue
			const isCurrentlyInspecting = index === state.currentIndex && !state.found
			const isChecked = state.checked.has(index)
			const isRejected = state.eliminated.has(index)
			const isFound = state.found && index === state.currentIndex

			// Apply classes based on state (priority order matters)
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
			} else if (isRejected) {
				cell.classList.add('is-rejected')
			} else if (isTarget) {
				cell.classList.add('is-target')
			}

			container.appendChild(cell)
		})
	}

	function updateStats(prefix, state) {
		const accesses = document.getElementById(`${prefix}-accesses`)
		const compares = document.getElementById(`${prefix}-compares`)
		const total = document.getElementById(`${prefix}-total`)
		const status = document.getElementById(`${prefix}-status`)

		if (accesses) accesses.textContent = state.accesses
		if (compares) compares.textContent = state.compares
		if (total) total.textContent = state.accesses + state.compares + state.swaps

		if (status) {
			if (state.found && state.complete) {
				status.textContent = UI_TEXT.found
				status.classList.add('is-found')
			} else if ((state.accesses + state.compares) > 0 && !state.complete) {
				status.textContent = UI_TEXT.searching
				status.classList.remove('is-found')
			} else {
				status.textContent = ''
				status.classList.remove('is-found')
			}
		}
	}

	// -------------------------------------------------------------------------
	// Animation controller
	// -------------------------------------------------------------------------

	async function runRace(state, array, targetValue, instanceId) {
		state.initGenerators()
		const linearStepDelay = getLinearStepDelay(array.length)
		const binaryStepDelay = getBinaryStepDelay(array.length)

		// Phase 1: run linear search to completion
		const linearTrack = document.getElementById(`ar-linear-grid-${instanceId}`).closest('.ar-track')
		if (linearTrack) linearTrack.classList.add('is-running')

		while (state.isRunning && !state.linear.complete) {
			const result = state.linear.generator.next()
			if (!result.done && result.value) {
				const step = result.value
				state.linear.currentIndex = step.inspectIndex
				state.linear.currentOperation = step.operation

				if (step.operation === 'access') {
					state.linear.accesses++
				} else if (step.operation === 'compare') {
					state.linear.compares++
				} else if (step.operation === 'swap') {
					state.linear.swaps++
				}

				if (step.found) {
					state.linear.found = true
					state.linear.complete = true
				}

				;(step.checked || []).forEach(i => state.linear.checked.add(i))
				;(step.eliminated || []).forEach(i => state.linear.eliminated.add(i))
			} else {
				state.linear.complete = true
			}

			renderGrid(
				document.getElementById(`ar-linear-grid-${instanceId}`),
				array,
				targetValue,
				state.linear
			)
			updateStats(`ar-linear-${instanceId}`, state.linear)

			await sleep(linearStepDelay)
		}

		if (linearTrack) linearTrack.classList.remove('is-running')

		if (!state.isRunning) return

		await sleep(2000)

		if (!state.isRunning) return

		// Phase 2: run binary search to completion
		const binaryTrack = document.getElementById(`ar-binary-grid-${instanceId}`).closest('.ar-track')
		if (binaryTrack) binaryTrack.classList.add('is-running')
		while (state.isRunning && !state.binary.complete) {
			const result = state.binary.generator.next()
			if (!result.done && result.value) {
				const step = result.value
				state.binary.currentIndex = step.inspectIndex
				state.binary.currentOperation = step.operation

				if (step.operation === 'access') {
					state.binary.accesses++
				} else if (step.operation === 'compare') {
					state.binary.compares++
				} else if (step.operation === 'swap') {
					state.binary.swaps++
				}

				if (step.found) {
					state.binary.found = true
					state.binary.complete = true
				}

				;(step.checked || []).forEach(i => state.binary.checked.add(i))
				;(step.eliminated || []).forEach(i => state.binary.eliminated.add(i))
				if (step.activeRange) {
					state.binary.activeRange = step.activeRange
				}
			} else {
				state.binary.complete = true
			}

			renderGrid(
				document.getElementById(`ar-binary-grid-${instanceId}`),
				array,
				targetValue,
				state.binary
			)
			updateStats(`ar-binary-${instanceId}`, state.binary)

			await sleep(binaryStepDelay)
		}

		if (binaryTrack) binaryTrack.classList.remove('is-running')

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
			this.instanceId = instanceCounter++
			this.init()
		}

		init() {
			const initialSize = parseInt(this.element.getAttribute('size')) || 64

			const { wrapper, array, target, instanceId } = buildUI(initialSize, this.instanceId)
			this.wrapper = wrapper
			this.array = array
			this.target = target
			this.state = new AlgoRaceState(initialSize, target, array)

			this.element.appendChild(wrapper)

			// Render initial grids
			this.renderBothGrids()

			this.attachEventListeners()
		}

		renderBothGrids() {
			renderGrid(
				document.getElementById(`ar-linear-grid-${this.instanceId}`),
				this.array,
				this.target,
				this.state.linear
			)
			renderGrid(
				document.getElementById(`ar-binary-grid-${this.instanceId}`),
				this.array,
				this.target,
				this.state.binary
			)
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
					this.randomTarget()
			})
		}

		// Target input
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

		// Random button
		const randomBtn = document.getElementById(`ar-random-btn-${this.instanceId}`)
		if (randomBtn) {
			randomBtn.addEventListener('click', () => {
				this.randomTarget()
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
	}

	updateSize(size) {
		this.array = generateSimpleArray(size)

		// Adjust target to be in valid range
		if (this.target > size) {
			this.target = size
		}

		this.state = new AlgoRaceState(size, this.target, this.array)

		// Update cell size based on N
		const cellSize = Math.max(0.75, 1.5 / Math.sqrt(size / 16))
		if (this.wrapper) {
			this.wrapper.style.setProperty('--ar-cell-size', `${cellSize}rem`)
		}

		// Update target input max
		const targetInput = document.getElementById(`ar-target-input-${this.instanceId}`)
		if (targetInput) {
			targetInput.max = size
			targetInput.value = this.target
		}

		this.renderBothGrids()
		this.updateAllStats()
	}

	randomTarget() {
		this.target = pickRandomTargetWithMinBinarySteps(this.array, 5)
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
		this.state.target = this.target
		this.renderBothGrids()
		this.updateAllStats()

		const startBtn = document.getElementById(`ar-start-btn-${this.instanceId}`)
		if (startBtn) startBtn.disabled = true

		await runRace(this.state, this.array, this.target, this.instanceId)

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
		updateStats(`ar-linear-${this.instanceId}`, this.state.linear)
		updateStats(`ar-binary-${this.instanceId}`, this.state.binary)
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
