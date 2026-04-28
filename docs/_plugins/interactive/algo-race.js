/**
 * docsify-algo-race.js - Algorithm Race Visualizer
 *
 * Side-by-side visualization comparing algorithm efficiency:
 *   - Linear Search vs Binary Search
 *   - Live operation counters (inspects, compares)
 *   - Visual array state with highlighted operations
 *   - Adjustable problem size
 *
 * Usage in markdown:
 *   <algo-race></algo-race>
 *   <algo-race size="16"></algo-race>
 *   <algo-race target="42"></algo-race>
 */

;(function () {

	const UI_TEXT = {
		title: 'Algorithm Race',
		subtitle: 'Watch algorithms compete on the same problem',
		sizeLabel: 'Array Size',
		targetLabel: 'Target Value',
		startButton: 'Race',
		resetButton: 'Reset',
		randomButton: 'Random Target',
		inspectsStat: 'Inspects',
		comparesStat: 'Compares',
		totalStat: 'Total Cost',
		searching: 'Searching...',
		found: 'Found',
		winner: 'Winner',
		tie: 'Tie',
		linearTitle: 'Linear Search',
		linearDesc: 'Check each item until target found',
		binaryTitle: 'Binary Search',
		binaryDesc: 'Divide and conquer on sorted array',
		legendInspect: 'Inspecting',
		legendCompare: 'Comparing',
		legendFound: 'Found',
		legendEliminated: 'Eliminated',
	}

	const SVG_ICONS = {
		race: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap-icon lucide-zap"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>',
		play: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play-icon lucide-play"><polygon points="6 3 20 12 6 21 6 3"/></svg>',
		reset: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rotate-ccw-icon lucide-rotate-ccw"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>',
		shuffle: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shuffle-icon lucide-shuffle"><path d="m18 14 4 4-4 4"/><path d="m18 2 4 4-4 4"/><path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22"/><path d="M2 6h1.972a4 4 0 0 1 3.6 2.2"/><path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45"/></svg>',
		trophy: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trophy-icon lucide-trophy"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
		linear: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right-icon lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
		binary: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-git-branch-icon lucide-git-branch"><line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>',
	}

	// Animation speed (milliseconds)
	const STEP_DELAY = 600

	// -------------------------------------------------------------------------
	// Algorithm implementations
	// -------------------------------------------------------------------------

	/**
	 * Linear Search - returns array of step objects
	 * Each step: { inspectIndex, compareValue, found, eliminated }
	 */
	function* linearSearch(array, target) {
		for (let i = 0; i < array.length; i++) {
			yield {
				inspectIndex: i,
				compareValue: array[i],
				found: array[i] === target,
				eliminated: []
			}
			if (array[i] === target) {
				return
			}
		}
	}

	/**
	 * Binary Search - returns array of step objects
	 * Each step: { inspectIndex, compareValue, found, eliminated, rangeStart, rangeEnd }
	 */
	function* binarySearch(array, target) {
		let left = 0
		let right = array.length - 1

		while (left <= right) {
			const mid = Math.floor((left + right) / 2)
			const midValue = array[mid]

			yield {
				inspectIndex: mid,
				compareValue: midValue,
				found: midValue === target,
				eliminated: [],
				rangeStart: left,
				rangeEnd: right
			}

			if (midValue === target) {
				return
			} else if (midValue < target) {
				// Eliminate left half
				const eliminated = []
				for (let i = left; i <= mid; i++) {
					eliminated.push(i)
				}
				left = mid + 1
				yield {
					inspectIndex: mid,
					compareValue: midValue,
					found: false,
					eliminated,
					rangeStart: left,
					rangeEnd: right
				}
			} else {
				// Eliminate right half
				const eliminated = []
				for (let i = mid; i <= right; i++) {
					eliminated.push(i)
				}
				right = mid - 1
				yield {
					inspectIndex: mid,
					compareValue: midValue,
					found: false,
					eliminated,
					rangeStart: left,
					rangeEnd: right
				}
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

			// Algorithm states
			this.linear = {
				generator: null,
				inspects: 0,
				compares: 0,
				currentIndex: -1,
				eliminated: new Set(),
				found: false,
				complete: false
			}

			this.binary = {
				generator: null,
				inspects: 0,
				compares: 0,
				currentIndex: -1,
				eliminated: new Set(),
				rangeStart: 0,
				rangeEnd: size - 1,
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
				inspects: 0,
				compares: 0,
				currentIndex: -1,
				eliminated: new Set(),
				found: false,
				complete: false
			}

			this.binary = {
				generator: null,
				inspects: 0,
				compares: 0,
				currentIndex: -1,
				eliminated: new Set(),
				rangeStart: 0,
				rangeEnd: this.size - 1,
				found: false,
				complete: false
			}
		}
	}

	// -------------------------------------------------------------------------
	// Rendering
	// -------------------------------------------------------------------------

	function buildUI(initialSize, initialTarget) {
		const wrapper = document.createElement('div')
		wrapper.className = 'ar-wrapper'

		// Generate sorted array
		const array = generateSortedArray(initialSize)
		const actualTarget = initialTarget || array[Math.floor(array.length / 2) + 2]

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
					<div class="ar-control-row">
						<span class="ar-label">${UI_TEXT.sizeLabel}</span>
						<div class="ar-slider-container">
							<input type="range" class="ar-slider" id="ar-size-slider" min="8" max="64" step="4" value="${initialSize}">
							<span class="ar-slider-value" id="ar-size-value">${initialSize}</span>
						</div>
					</div>

					<div class="ar-control-row">
						<span class="ar-label">${UI_TEXT.targetLabel}</span>
						<div class="ar-slider-container">
							<input type="range" class="ar-slider" id="ar-target-slider" min="${array[0]}" max="${array[array.length - 1]}" value="${actualTarget}">
							<span class="ar-slider-value" id="ar-target-value">${actualTarget}</span>
						</div>
					</div>

					<div class="ar-control-row">
						<div class="ar-buttons">
							<button class="ar-btn" id="ar-start-btn">
								${SVG_ICONS.play}
								<span>${UI_TEXT.startButton}</span>
							</button>
							<button class="ar-btn" id="ar-reset-btn">
								${SVG_ICONS.reset}
								<span>${UI_TEXT.resetButton}</span>
							</button>
							<button class="ar-btn" id="ar-random-btn">
								${SVG_ICONS.shuffle}
								<span>${UI_TEXT.randomButton}</span>
							</button>
						</div>
					</div>
				</div>

				<!-- Legend -->
				<div class="ar-legend">
					<div class="ar-legend-item is-inspect">
						<div class="ar-legend-swatch"></div>
						<span>${UI_TEXT.legendInspect}</span>
					</div>
					<div class="ar-legend-item is-compare">
						<div class="ar-legend-swatch"></div>
						<span>${UI_TEXT.legendCompare}</span>
					</div>
					<div class="ar-legend-item is-found">
						<div class="ar-legend-swatch"></div>
						<span>${UI_TEXT.legendFound}</span>
					</div>
					<div class="ar-legend-item is-eliminated">
						<div class="ar-legend-swatch"></div>
						<span>${UI_TEXT.legendEliminated}</span>
					</div>
				</div>

				<!-- Race tracks -->
				<div class="ar-race-container">
					<!-- Linear Search Track -->
					<div class="ar-track is-algo-1" id="ar-linear-track">
						<div class="ar-track-header">
							<h4 class="ar-track-title">
								${SVG_ICONS.linear}
								<span>${UI_TEXT.linearTitle}</span>
							</h4>
							<div class="ar-track-status" id="ar-linear-status">${UI_TEXT.linearDesc}</div>
						</div>
						<div class="ar-array" id="ar-linear-array"></div>
						<div class="ar-stats">
							<div class="ar-stat is-inspects">
								<div class="ar-stat-label">${UI_TEXT.inspectsStat}</div>
								<div class="ar-stat-value" id="ar-linear-inspects">0</div>
							</div>
							<div class="ar-stat is-compares">
								<div class="ar-stat-label">${UI_TEXT.comparesStat}</div>
								<div class="ar-stat-value" id="ar-linear-compares">0</div>
							</div>
							<div class="ar-stat is-total">
								<div class="ar-stat-label">${UI_TEXT.totalStat}</div>
								<div class="ar-stat-value" id="ar-linear-total">0</div>
							</div>
						</div>
					</div>

					<!-- Binary Search Track -->
					<div class="ar-track is-algo-2" id="ar-binary-track">
						<div class="ar-track-header">
							<h4 class="ar-track-title">
								${SVG_ICONS.binary}
								<span>${UI_TEXT.binaryTitle}</span>
							</h4>
							<div class="ar-track-status" id="ar-binary-status">${UI_TEXT.binaryDesc}</div>
						</div>
						<div class="ar-array" id="ar-binary-array"></div>
						<div class="ar-stats">
							<div class="ar-stat is-inspects">
								<div class="ar-stat-label">${UI_TEXT.inspectsStat}</div>
								<div class="ar-stat-value" id="ar-binary-inspects">0</div>
							</div>
							<div class="ar-stat is-compares">
								<div class="ar-stat-label">${UI_TEXT.comparesStat}</div>
								<div class="ar-stat-value" id="ar-binary-compares">0</div>
							</div>
							<div class="ar-stat is-total">
								<div class="ar-stat-label">${UI_TEXT.totalStat}</div>
								<div class="ar-stat-value" id="ar-binary-total">0</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Summary (hidden until complete) -->
				<div class="ar-summary" id="ar-summary" style="display: none;">
					<div class="ar-summary-item is-algo-1">
						<div class="ar-summary-label">${UI_TEXT.linearTitle}</div>
						<div class="ar-summary-value" id="ar-summary-linear">0</div>
					</div>
					<div class="ar-summary-item is-algo-2">
						<div class="ar-summary-label">${UI_TEXT.binaryTitle}</div>
						<div class="ar-summary-value" id="ar-summary-binary">0</div>
					</div>
					<div class="ar-summary-winner" id="ar-summary-winner" style="display: none;">
						${SVG_ICONS.trophy}
						<span></span>
					</div>
				</div>
			</div>
		`

		return { wrapper, array, target: actualTarget }
	}

	function generateSortedArray(size) {
		const array = []
		let value = Math.floor(Math.random() * 10) + 1
		for (let i = 0; i < size; i++) {
			array.push(value)
			value += Math.floor(Math.random() * 5) + 1
		}
		return array
	}

	function renderArray(container, array, state) {
		container.innerHTML = ''
		array.forEach((value, index) => {
			const cell = document.createElement('div')
			cell.className = 'ar-cell'
			cell.textContent = value

			if (state.found && index === state.currentIndex) {
				cell.classList.add('is-found')
			} else if (index === state.currentIndex) {
				cell.classList.add('is-inspecting')
			} else if (state.eliminated.has(index)) {
				cell.classList.add('is-eliminated')
			} else if (state.rangeStart !== undefined && state.rangeEnd !== undefined) {
				if (index >= state.rangeStart && index <= state.rangeEnd) {
					cell.classList.add('is-in-range')
				} else {
					cell.classList.add('is-eliminated')
				}
			}

			container.appendChild(cell)
		})
	}

	function updateStats(prefix, state) {
		const inspects = document.getElementById(`${prefix}-inspects`)
		const compares = document.getElementById(`${prefix}-compares`)
		const total = document.getElementById(`${prefix}-total`)
		const status = document.getElementById(`${prefix}-status`)

		if (inspects) inspects.textContent = state.inspects
		if (compares) compares.textContent = state.compares
		if (total) total.textContent = state.inspects + state.compares

		if (status) {
			if (state.complete) {
				if (state.found) {
					status.textContent = `✓ ${UI_TEXT.found}`
					status.classList.add('is-complete')
				} else {
					status.textContent = 'Not found'
				}
			} else if (state.inspects > 0) {
				status.textContent = UI_TEXT.searching
			}
		}
	}

	function showSummary(linearState, binaryState) {
		const summary = document.getElementById('ar-summary')
		const linearTotal = document.getElementById('ar-summary-linear')
		const binaryTotal = document.getElementById('ar-summary-binary')
		const winner = document.getElementById('ar-summary-winner')

		if (!summary || !linearTotal || !binaryTotal || !winner) return

		const linearCost = linearState.inspects + linearState.compares
		const binaryCost = binaryState.inspects + binaryState.compares

		linearTotal.textContent = linearCost
		binaryTotal.textContent = binaryCost

		summary.style.display = 'flex'

		if (binaryCost < linearCost) {
			winner.style.display = 'flex'
			winner.querySelector('span').textContent = `${UI_TEXT.binaryTitle} ${UI_TEXT.winner}!`
		} else if (linearCost < binaryCost) {
			winner.style.display = 'flex'
			winner.querySelector('span').textContent = `${UI_TEXT.linearTitle} ${UI_TEXT.winner}!`
		} else {
			winner.style.display = 'flex'
			winner.querySelector('span').textContent = UI_TEXT.tie
		}
	}

	// -------------------------------------------------------------------------
	// Animation controller
	// -------------------------------------------------------------------------

	async function runRace(state, array) {
		state.initGenerators()

		while (!state.linear.complete || !state.binary.complete) {
			// Step linear search
			if (!state.linear.complete) {
				const result = state.linear.generator.next()
				if (!result.done && result.value) {
					const step = result.value
					state.linear.currentIndex = step.inspectIndex
					state.linear.inspects++
					state.linear.compares++
					if (step.found) {
						state.linear.found = true
						state.linear.complete = true
					}
					step.eliminated.forEach(i => state.linear.eliminated.add(i))
				} else {
					state.linear.complete = true
				}

				renderArray(
					document.getElementById('ar-linear-array'),
					array,
					state.linear
				)
				updateStats('ar-linear', state.linear)
			}

			// Step binary search
			if (!state.binary.complete) {
				const result = state.binary.generator.next()
				if (!result.done && result.value) {
					const step = result.value
					state.binary.currentIndex = step.inspectIndex
					state.binary.inspects++
					state.binary.compares++
					if (step.found) {
						state.binary.found = true
						state.binary.complete = true
					}
					step.eliminated.forEach(i => state.binary.eliminated.add(i))
					if (step.rangeStart !== undefined) {
						state.binary.rangeStart = step.rangeStart
						state.binary.rangeEnd = step.rangeEnd
					}
				} else {
					state.binary.complete = true
				}

				renderArray(
					document.getElementById('ar-binary-array'),
					array,
					state.binary
				)
				updateStats('ar-binary', state.binary)
			}

			await sleep(STEP_DELAY)
		}

		state.isComplete = true
		showSummary(state.linear, state.binary)
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
			this.state = null
			this.array = null
			this.init()
		}

		init() {
			const initialSize = parseInt(this.element.getAttribute('size')) || 16
			const initialTarget = parseInt(this.element.getAttribute('target')) || null

			const { wrapper, array, target } = buildUI(initialSize, initialTarget)
			this.array = array
			this.state = new AlgoRaceState(initialSize, target, array)

			this.element.appendChild(wrapper)

			// Render initial arrays
			this.renderBothArrays()

			this.attachEventListeners()
		}

		renderBothArrays() {
			renderArray(
				document.getElementById('ar-linear-array'),
				this.array,
				this.state.linear
			)
			renderArray(
				document.getElementById('ar-binary-array'),
				this.array,
				this.state.binary
			)
		}

		attachEventListeners() {
			// Size slider
			const sizeSlider = document.getElementById('ar-size-slider')
			const sizeValue = document.getElementById('ar-size-value')
			if (sizeSlider && sizeValue) {
				sizeSlider.addEventListener('input', (e) => {
					const size = parseInt(e.target.value)
					sizeValue.textContent = size
					this.updateSize(size)
				})
			}

			// Target slider
			const targetSlider = document.getElementById('ar-target-slider')
			const targetValue = document.getElementById('ar-target-value')
			if (targetSlider && targetValue) {
				targetSlider.addEventListener('input', (e) => {
					const target = parseInt(e.target.value)
					targetValue.textContent = target
					this.state.target = target
				})
			}

			// Start button
			const startBtn = document.getElementById('ar-start-btn')
			if (startBtn) {
				startBtn.addEventListener('click', () => {
					if (!this.state.isRunning) {
						this.startRace()
					}
				})
			}

			// Reset button
			const resetBtn = document.getElementById('ar-reset-btn')
			if (resetBtn) {
				resetBtn.addEventListener('click', () => {
					this.reset()
				})
			}

			// Random button
			const randomBtn = document.getElementById('ar-random-btn')
			if (randomBtn) {
				randomBtn.addEventListener('click', () => {
					this.randomTarget()
				})
			}
		}

		updateSize(size) {
			this.array = generateSortedArray(size)
			this.state = new AlgoRaceState(size, this.state.target, this.array)

			// Update target slider range
			const targetSlider = document.getElementById('ar-target-slider')
			if (targetSlider) {
				targetSlider.min = this.array[0]
				targetSlider.max = this.array[this.array.length - 1]
				// Clamp current target
				if (this.state.target < this.array[0]) {
					this.state.target = this.array[0]
				} else if (this.state.target > this.array[this.array.length - 1]) {
					this.state.target = this.array[this.array.length - 1]
				}
				targetSlider.value = this.state.target
				const targetValue = document.getElementById('ar-target-value')
				if (targetValue) targetValue.textContent = this.state.target
			}

			this.renderBothArrays()
			this.updateAllStats()
			this.hideSummary()
		}

		randomTarget() {
			const targetIndex = Math.floor(Math.random() * this.array.length)
			this.state.target = this.array[targetIndex]

			const targetSlider = document.getElementById('ar-target-slider')
			const targetValue = document.getElementById('ar-target-value')
			if (targetSlider) targetSlider.value = this.state.target
			if (targetValue) targetValue.textContent = this.state.target
		}

		async startRace() {
			if (this.state.isRunning) return

			this.state.reset()
			this.state.isRunning = true
			this.renderBothArrays()
			this.updateAllStats()
			this.hideSummary()

			const startBtn = document.getElementById('ar-start-btn')
			if (startBtn) startBtn.disabled = true

			await runRace(this.state, this.array)

			if (startBtn) startBtn.disabled = false
			this.state.isRunning = false
		}

		reset() {
			this.state.reset()
			this.renderBothArrays()
			this.updateAllStats()
			this.hideSummary()
		}

		updateAllStats() {
			updateStats('ar-linear', this.state.linear)
			updateStats('ar-binary', this.state.binary)
		}

		hideSummary() {
			const summary = document.getElementById('ar-summary')
			if (summary) summary.style.display = 'none'
		}
	}

	// -------------------------------------------------------------------------
	// Docsify plugin hook
	// -------------------------------------------------------------------------

	function algoRacePlugin(hook, vm) {
		hook.doneEach(function () {
			const elements = document.querySelectorAll('.markdown-section algo-race')
			elements.forEach(element => {
				if (!element.dataset.initialized) {
					new AlgoRaceVisualizer(element)
					element.dataset.initialized = 'true'
				}
			})
		})
	}

	if (window.$docsify) {
		window.$docsify.plugins = [].concat(algoRacePlugin, window.$docsify.plugins || [])
	}

})()
