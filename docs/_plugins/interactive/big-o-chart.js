/**
 * docsify-big-o-chart.js - Interactive Big-O complexity growth visualiser
 *
 * Helps students understand:
 *   - How different complexity classes grow as input size (N) increases
 *   - Why O(N²) and O(2ⁿ) become impractical for large N
 *   - The massive divergence between classes as N grows
 *
 * Usage in markdown:
 *   <big-o-chart></big-o-chart>
 *   <big-o-chart max="50" value="5" enabled="on, nlogn, n2"></big-o-chart>
 *
 * Attributes:
 *   - max: Override maximum N (optional). Auto-calculated as minimum of enabled classes:
 *          O(1), O(N), O(log N), O(N log N) → max 1000
 *          O(N²) → max 100
 *          O(N³) → max 50
 *          O(2ⁿ), O(N!) → max 20
 *   - value: Initial slider position (default: 3, min: 2, max: maxN)
 *   - enabled: Comma-separated list of complexity classes to show (default: all)
 *              Accepts: on/1/const, log, n, nlogn, n2, n3, 2n, nfact
 *
 * X-axis labels auto-space to prevent overlap:
 *   N ≤ 20: step 1, N ≤ 50: step 2, N ≤ 100: step 5, N ≤ 200: step 10,
 *   N ≤ 500: step 20, N ≤ 1000: step 50, N > 1000: step 100
 */

;(function () {

	// -------------------------------------------------------------------------
	// Complexity classes
	// -------------------------------------------------------------------------

	const CLASSES = [
		{
			id:    'o1',
			label: 'O(1)',
			title: 'Constant',
			fn:    () => 1,
			maxN:  10000,
			cssVar: '--bigo-chart-line-color-1',
			aliases: ['o1', '1', 'const'],
		},
		{
			id:    'ologn',
			label: 'O(log N)',
			title: 'Logarithmic',
			fn:    n => Math.log2(n),
			maxN:  10000,
			cssVar: '--bigo-chart-line-color-2',
			aliases: ['ologn', 'logn', 'log', 'log n'],
		},
		{
			id:    'on',
			label: 'O(N)',
			title: 'Linear',
			fn:    n => n,
			maxN:  10000,
			cssVar: '--bigo-chart-line-color-3',
			aliases: ['on', 'n', 'linear'],
		},
		{
			id:    'onlogn',
			label: 'O(N log N)',
			title: 'Linear-Logarithmic',
			fn:    n => n * Math.log2(n),
			maxN:  10000,
			cssVar: '--bigo-chart-line-color-4',
			aliases: ['onlogn', 'nlogn', 'n log n', 'linear-log'],
		},
		{
			id:    'on2',
			label: 'O(N<sup>2</sup>)',
			title: 'Quadratic',
			fn:    n => n * n,
			maxN:  5000,
			cssVar: '--bigo-chart-line-color-5',
			aliases: ['on2', 'n2', 'n^2', 'quadratic'],
		},
		{
			id:    'on3',
			label: 'O(N<sup>3</sup>)',
			title: 'Cubic',
			fn:    n => n * n * n,
			maxN:  1000,
			cssVar: '--bigo-chart-line-color-6',
			aliases: ['on3', 'n3', 'n^3', 'cubic'],
		},
		{
			id:    'o2n',
			label: 'O(2<sup>N</sup>)',
			title: 'Exponential',
			fn:    n => Math.pow(2, n),
			maxN:  25,
			cssVar: '--bigo-chart-line-color-7',
			aliases: ['o2n', '2n', '2^n', 'exp', 'exponential'],
		},
		{
			id:    'ofact',
            label: 'O(N!)',
            title: 'Factorial',
            // Stirling's approximation: n! ≈ √(2πn) · (n/e)ⁿ - smooth & accurate for n ≥ 2
			fn:    n => Math.sqrt(2 * Math.PI * n) * Math.pow(n / Math.E, n),
			maxN:  20,
			cssVar: '--bigo-chart-line-color-8',
			aliases: ['ofact', 'n!', 'factorial'],
		},
	]

	// SVG viewport constants
	const SVG_W   = 480
	const SVG_H   = 360
	const PAD_L   = 48
	const PAD_R   = 16
	const PAD_T   = 16
	const PAD_B   = 44
	const PLOT_W  = SVG_W - PAD_L - PAD_R
	const PLOT_H  = SVG_H - PAD_T - PAD_B

	// -------------------------------------------------------------------------
	// Maths helpers
	// -------------------------------------------------------------------------

	/** Determine X-axis step based on N to prevent label overlap */
	function getXAxisStep(n) {
		if (n <= 10)   return 1
		if (n <= 20)   return 2
		if (n <= 50)   return 5
		if (n <= 100)  return 10
		if (n <= 250)  return 25
		if (n <= 500)  return 50
		if (n <= 1000) return 100
		if (n <= 2500) return 250
		if (n <= 5000) return 500
		return 1000
	}

	/** Pick 4-6 evenly-spaced y tick values given a nice upper bound */
	function yTicks(yMax) {
		const steps = [1, 2, 4, 5, 10, 20, 25, 50, 100, 200, 250, 500,
					   1000, 2000, 2500, 5000, 10000, 20000, 25000, 50000,
					   100000, 200000, 500000, 1000000]
		const ideal = 5
		const raw   = yMax / ideal
		// find first step >= raw
		const step  = steps.find(s => s >= raw) ?? raw
		const ticks = []
		for (let v = 0; v <= yMax; v += step) {
			if (v > yMax) break
			ticks.push(v)
		}
		return ticks
	}

	function fmtY(v, useAbbrev = false) {
		if (useAbbrev) {
			if (v >= 1e9) return (v / 1e9).toFixed(0) + 'B'
			if (v >= 1e6) return (v / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
			if (v >= 1e3) return (v / 1e3).toFixed(1).replace(/\.0$/, '') + 'k'
		}
		return Math.round(v).toLocaleString()
	}

	// -------------------------------------------------------------------------
	// Build DOM
	// -------------------------------------------------------------------------

	function cssColor(el, cssVar) {
		return getComputedStyle(el).getPropertyValue(cssVar).trim()
	}

	function buildUI(maxN, enabledSet, initialValue) {
		const wrapper = document.createElement('div')
		wrapper.className = 'bigo-wrapper'

		// Legend toggles (above chart on small screens, right of chart on wide)
		const legendHTML = CLASSES.map(c => `
			<label class="bigo-legend-item${!enabledSet.has(c.id) ? ' is-disabled' : ''}" data-id="${c.id}">
				<input type="checkbox" class="bigo-toggle" data-id="${c.id}"${enabledSet.has(c.id) ? ' checked' : ''}>
				<span class="bigo-legend-swatch" data-id="${c.id}"></span>
				<span class="bigo-legend-label">${c.label}</span>
				<span class="bigo-legend-title">${c.title}</span>
				<span class="bigo-legend-value" data-id="${c.id}">-</span>
			</label>
		`).join('')

		wrapper.innerHTML = `
			<div class="bigo-chart-wrap">
			    <svg class="bigo-svg no-zoom"
					 viewBox="0 0 ${SVG_W} ${SVG_H}"
					 role="img"
					 aria-label="Big-O complexity growth curves">
					<g class="bigo-grid"></g>
					<g class="bigo-axes"></g>
					<g class="bigo-curves"></g>
					<g class="bigo-marker"></g>
					<g class="bigo-tick-labels"></g>
				</svg>
			</div>
			<div class="bigo-legend">${legendHTML}</div>
			<div class="bigo-controls">
			<span class="bigo-ctrl-label">N =</span>
				<input type="range" class="bigo-slider" min="2" max="${maxN}" value="${initialValue}" step="1">
				<span class="bigo-n-display">${initialValue}</span>
			</div>
		`
		return wrapper
	}

	// -------------------------------------------------------------------------
	// Chart rendering
	// -------------------------------------------------------------------------

	// xMin is always 1 - the plot range is 1..xMax
	function dataToSVG(x, y, xMin, xMax, yMax) {
		const sx = PAD_L + ((x - xMin) / (xMax - xMin)) * PLOT_W
		const sy = PAD_T + PLOT_H - (y / yMax) * PLOT_H
		return [sx, sy]
	}

	function renderChart(wrapper, n, enabled, axisN = null) {
		// axisN: N value to use for axis/grid calculations (defaults to n)
		// Use target N during animation to prevent axis labels from changing
		if (axisN === null) axisN = n
		const svgEl    = wrapper.querySelector('.bigo-svg')
		const gridG    = wrapper.querySelector('.bigo-grid')
		const axesG    = wrapper.querySelector('.bigo-axes')
		const curvesG  = wrapper.querySelector('.bigo-curves')
		const markerG  = wrapper.querySelector('.bigo-marker')
		const ticksG   = wrapper.querySelector('.bigo-tick-labels')

		// Check container width to decide if we should abbreviate values
		const containerWidth = wrapper.offsetWidth
		const useAbbrev = containerWidth < 580

		// ------------------------------------------------------------------
		// 1. Compute y-axis scale from all visible classes at x=n
		// ------------------------------------------------------------------
		const SAMPLES = Math.max(n, 60)  // more points for smoother lines
		let rawYMax = 1

		for (const c of CLASSES) {
			if (!enabled.has(c.id)) continue
			const v = c.fn(n)
			if (isFinite(v) && v > rawYMax) rawYMax = v
		}

		const yMax = Math.max(rawYMax + 1, 1)
		const xMin = 1
		const xMax = n

		// ------------------------------------------------------------------
		// 2. Grid lines + tick labels
		// Use axisN for calculating x-axis steps to prevent overlap during animation
		// ------------------------------------------------------------------
		const ticks = yTicks(yMax)

		let gridHTML      = ''
		let tickLabelHTML = ''

		for (const tv of ticks) {
			const [, sy] = dataToSVG(xMin, tv, xMin, xMax, yMax)
			if (sy < PAD_T - 4 || sy > PAD_T + PLOT_H + 4) continue
			gridHTML += `<line x1="${PAD_L}" y1="${sy.toFixed(1)}" x2="${PAD_L + PLOT_W}" y2="${sy.toFixed(1)}" class="bigo-gridline"/>`
			tickLabelHTML += `<text x="${(PAD_L - 6).toFixed(1)}" y="${sy.toFixed(1)}" class="bigo-tick-y">${fmtY(tv, true)}</text>`
		}

		// X-axis: label at appropriate steps to prevent overlap
		const sy = PAD_T + PLOT_H
		const xStep = getXAxisStep(axisN)

		// Always show 1 (the minimum)
		let [sx] = dataToSVG(1, 0, xMin, xMax, yMax)
		tickLabelHTML += `<text x="${sx.toFixed(1)}" y="${(sy + 14).toFixed(1)}" class="bigo-tick-x">1</text>`

		// Show multiples of xStep (10, 20, 30... or 5, 10, 15... etc.)
		for (let xv = xStep; xv <= axisN; xv += xStep) {
			// Skip this step if it's too close to axisN (to avoid visual overlap)
			const isLastStep = xv + xStep > axisN
			const tooCloseToN = axisN % xStep !== 0 && (axisN - xv < xStep / 2)
			if (isLastStep && tooCloseToN) {
				continue // Will show axisN instead
			}

			[sx] = dataToSVG(xv, 0, xMin, xMax, yMax)
			tickLabelHTML += `<text x="${sx.toFixed(1)}" y="${(sy + 14).toFixed(1)}" class="bigo-tick-x">${xv}</text>`
		}

		// Always show the final N value if it's not 1 and not a multiple of xStep
		if (axisN !== 1 && axisN % xStep !== 0) {
			[sx] = dataToSVG(axisN, 0, xMin, xMax, yMax)
			tickLabelHTML += `<text x="${sx.toFixed(1)}" y="${(sy + 14).toFixed(1)}" class="bigo-tick-x">${axisN}</text>`
		}

		// Chart title (top-left, inside plot area)
		const titleX = PAD_L + 16
		const titleY = PAD_T + 16
		tickLabelHTML += `<text x="${titleX}" y="${titleY}" class="bigo-title" text-anchor="start">Comparison of Algorithmic Complexity</text>`

		// X-axis label (centred below axis)
		const sxMid = PAD_L + PLOT_W / 2
		const xAxisLabelY = sy + 36
		tickLabelHTML += `<text x="${sxMid.toFixed(1)}" y="${xAxisLabelY.toFixed(1)}" class="bigo-axis-label" text-anchor="middle">Size of Input Data, N</text>`

		// Y-axis label (vertical, left of ticks)
		const yAxisLabelX = PAD_L - 38
		const yAxisLabelY = PAD_T + PLOT_H / 2
		tickLabelHTML += `<text x="${yAxisLabelX.toFixed(1)}" y="${yAxisLabelY.toFixed(1)}" class="bigo-axis-label" text-anchor="middle" transform="rotate(-90,${yAxisLabelX.toFixed(1)},${yAxisLabelY.toFixed(1)})">Computational Effort</text>`

		gridG.innerHTML   = gridHTML
		ticksG.innerHTML  = tickLabelHTML

		// ------------------------------------------------------------------
		// 3. Axes
		// ------------------------------------------------------------------
		axesG.innerHTML = `
			<line x1="${PAD_L}" y1="${PAD_T}" x2="${PAD_L}" y2="${PAD_T + PLOT_H}" class="bigo-axis"/>
			<line x1="${PAD_L}" y1="${PAD_T + PLOT_H}" x2="${PAD_L + PLOT_W}" y2="${PAD_T + PLOT_H}" class="bigo-axis"/>
		`

		// ------------------------------------------------------------------
		// 4. Curves
		// ------------------------------------------------------------------
		let curvesHTML = ''
		for (const c of CLASSES) {
			if (!enabled.has(c.id)) continue

			const pts = []
			for (let i = 0; i <= SAMPLES; i++) {
				const xv = xMin + (i / SAMPLES) * (xMax - xMin)
				const yv = c.fn(xv)
				const [sx, sy] = dataToSVG(xv, yv, xMin, xMax, yMax)
				pts.push(`${sx.toFixed(2)},${sy.toFixed(2)}`)
			}

			curvesHTML += `<polyline
				class="bigo-curve"
				data-id="${c.id}"
				points="${pts.join(' ')}"
				fill="none"
				stroke="var(${c.cssVar})"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
				clip-path="url(#bigo-clip)"
			>
				<title>${c.label} - ${c.title}</title>
			</polyline>`
		}
		curvesG.innerHTML = curvesHTML

		// Ensure clip path exists in SVG defs
		let defs = svgEl.querySelector('defs')
		if (!defs) {
			defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
			svgEl.insertBefore(defs, svgEl.firstChild)
		}
		if (!defs.querySelector('#bigo-clip')) {
			defs.innerHTML = `<clipPath id="bigo-clip">
				<rect x="${PAD_L}" y="${PAD_T}" width="${PLOT_W}" height="${PLOT_H}"/>
			</clipPath>`
		}

		// ------------------------------------------------------------------
		// 5. Vertical marker at x = n
		// ------------------------------------------------------------------
		const [sxM] = dataToSVG(n, 0, xMin, xMax, yMax)
		markerG.innerHTML = `<line
			x1="${sxM.toFixed(1)}" y1="${PAD_T}"
			x2="${sxM.toFixed(1)}" y2="${PAD_T + PLOT_H}"
			class="bigo-marker-line"
		/>`

		// ------------------------------------------------------------------
		// 6. Legend values at current n
		// ------------------------------------------------------------------
		for (const c of CLASSES) {
			const valEl = wrapper.querySelector(`.bigo-legend-value[data-id="${c.id}"]`)
			if (!valEl) continue
			if (!enabled.has(c.id)) {
				valEl.textContent = '-'
				continue
			}
			const v = c.fn(n)
			valEl.textContent = isFinite(v) ? fmtY(Math.round(v), useAbbrev) : '∞'
		}
	}

	// -------------------------------------------------------------------------
	// Swatch colours (must wait for DOM/styles to be resolved)
	// -------------------------------------------------------------------------

	function applySwatchColors(wrapper) {
		wrapper.querySelectorAll('.bigo-legend-swatch').forEach(swatch => {
			const cssVar = CLASSES.find(c => c.id === swatch.dataset.id)?.cssVar
			if (cssVar) swatch.style.background = `var(${cssVar})`
		})
	}

	// -------------------------------------------------------------------------
	// Plugin entry point
	// -------------------------------------------------------------------------

	function processBigOChart() {
		document.querySelectorAll('.markdown-section big-o-chart').forEach(el => {
			// Parse enabled attribute (case-insensitive, flexible)
			let enabledAttr = el.getAttribute('enabled')
			let enabledSet
			if (enabledAttr) {
				const tokens = enabledAttr.split(/[\s,]+/).map(s => s.trim().toLowerCase()).filter(Boolean)
				enabledSet = new Set()
				for (const token of tokens) {
					for (const c of CLASSES) {
						if (c.aliases && c.aliases.some(a => a.toLowerCase() === token)) {
							enabledSet.add(c.id)
						}
					}
				}
				// If nothing matched, fall back to all enabled
				if (enabledSet.size === 0) enabledSet = new Set(CLASSES.map(c => c.id))
			} else {
				enabledSet = new Set(CLASSES.map(c => c.id))
			}

			// Get user's max attribute as absolute cap (if provided)
			const userMaxAttr = el.getAttribute('max')
			const userMaxN = userMaxAttr ? parseInt(userMaxAttr, 10) : null
			const absoluteMax = (userMaxN && !isNaN(userMaxN)) ? userMaxN : 1000

			// Calculate max N as the minimum of all enabled classes' maxN values
			let calculatedMaxN = 1000  // Default to highest possible
			for (const classId of enabledSet) {
				const cls = CLASSES.find(c => c.id === classId)
				if (cls && cls.maxN) {
					calculatedMaxN = Math.min(calculatedMaxN, cls.maxN)
				}
			}

			// Apply class max only if it's less than absolute max
			const maxN = Math.max(5, Math.min(absoluteMax, calculatedMaxN))

			// Parse value attribute for initial slider value
			let initialValue = parseInt(el.getAttribute('value') ?? 3, 10)
			if (isNaN(initialValue) || initialValue < 2) initialValue = 2
			if (initialValue > maxN) initialValue = maxN

			const wrapper = buildUI(maxN, enabledSet, initialValue)
			el.innerHTML  = ''
			el.appendChild(wrapper)

			applySwatchColors(wrapper)

			const slider    = wrapper.querySelector('.bigo-slider')
			const nDisplay  = wrapper.querySelector('.bigo-n-display')
			const toggles   = wrapper.querySelectorAll('.bigo-toggle')

			// Track which complexity classes are currently visible
			const enabled = new Set(enabledSet)

			// Function to calculate max N based on currently enabled classes
			// Respects absoluteMax as ceiling
			function calculateMaxN(enabledSet) {
				let calculatedMaxN = 1000  // Default to highest possible
				for (const classId of enabledSet) {
					const cls = CLASSES.find(c => c.id === classId)
					if (cls && cls.maxN) {
						calculatedMaxN = Math.min(calculatedMaxN, cls.maxN)
					}
				}
				// Apply class max only if it's less than absolute max
				return Math.min(absoluteMax, calculatedMaxN)
			}

			let currentMaxN = maxN
			let animating = false;
			let animationFrame = null;
			let currentN = parseInt(slider.value, 10);

			function animateToN(targetN) {
				if (animating) cancelAnimationFrame(animationFrame);
				animating = true;
				const startN = currentN;
				const endN = targetN;
				const duration = 320; // ms
				const step = 0.1;
				const startTime = performance.now();

				function animate(now) {
					const elapsed = now - startTime;
					const t = Math.min(elapsed / duration, 1);
					// Ease in-out
					const ease = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
					const n = startN + (endN - startN) * ease;
					currentN = n;
    				nDisplay.textContent = Math.round(n);
				// Use target endN for axis calculations to prevent label overlap during animation
				renderChart(wrapper, n, enabled, endN);
					if (t < 1) {
						animationFrame = requestAnimationFrame(animate);
					} else {
						currentN = endN;
						nDisplay.textContent = endN;
						renderChart(wrapper, endN, enabled);
						animating = false;
					}
				}
				animationFrame = requestAnimationFrame(animate);
			}

			slider.addEventListener('input', () => {
				const n = parseInt(slider.value, 10);
				animateToN(n);
			});

			// On initial load, set currentN and draw
			currentN = parseInt(slider.value, 10);
			nDisplay.textContent = currentN;
			renderChart(wrapper, currentN, enabled);

			toggles.forEach(cb => {
				cb.addEventListener('change', () => {
					const id   = cb.dataset.id
					const item = wrapper.querySelector(`.bigo-legend-item[data-id="${id}"]`)
					if (cb.checked) {
						enabled.add(id)
						item?.classList.remove('is-disabled')
					} else {
						enabled.delete(id)
						item?.classList.add('is-disabled')
					}

					// Recalculate max N based on currently enabled classes
					const newMaxN = calculateMaxN(enabled)

					// Update slider max if it changed
					if (newMaxN !== currentMaxN) {
						currentMaxN = newMaxN
						slider.max = newMaxN

						// If current N exceeds new max, clamp it
						if (currentN > newMaxN) {
							currentN = newMaxN
							slider.value = newMaxN
							nDisplay.textContent = newMaxN
						}
					}

					// Redraw chart with new enabled set
					renderChart(wrapper, currentN, enabled);
				})
			})

			// Set initial slider value
			slider.value = initialValue

			// Initial draw
			renderChart(wrapper, currentN, enabled);
		})
	}

	// -------------------------------------------------------------------------
	// Docsify hook
	// -------------------------------------------------------------------------

	window.DocsifyUtils.registerPlugin(hook => {
		hook.doneEach(() => processBigOChart())
	}, false)

})()