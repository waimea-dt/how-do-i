/**
 * docsify-big-o-chart.js - Interactive Big-O complexity growth visualiser
 *
 * Helps students understand:
 *   - How different complexity classes grow as input size (n) increases
 *   - Why O(n²) and O(2ⁿ) become impractical for large n
 *   - The massive divergence between classes as n grows
 *
 * Usage in markdown:
 *   <big-o-chart></big-o-chart>
 *   <big-o-chart max="15"></big-o-chart>
 *
 * Attributes:
 *   - max: Maximum n shown on the slider (default: 10, range: 5–20)
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
			cssVar: '--bigo-chart-line-color-1',
			aliases: ['o1', '1', 'const'],
		},
		{
			id:    'ologn',
			label: 'O(log n)',
			title: 'Logarithmic',
			fn:    n => Math.log2(n),
			cssVar: '--bigo-chart-line-color-2',
			aliases: ['ologn', 'logn', 'log', 'log n'],
		},
		{
			id:    'on',
			label: 'O(n)',
			title: 'Linear',
			fn:    n => n,
			cssVar: '--bigo-chart-line-color-3',
			aliases: ['on', 'n', 'linear'],
		},
		{
			id:    'onlogn',
			label: 'O(n log n)',
			title: 'Linear-Logarithmic',
			fn:    n => n * Math.log2(n),
			cssVar: '--bigo-chart-line-color-4',
			aliases: ['onlogn', 'nlogn', 'n log n', 'linear-log'],
		},
		{
			id:    'on2',
			label: 'O(n²)',
			title: 'Quadratic',
			fn:    n => n * n,
			cssVar: '--bigo-chart-line-color-5',
			aliases: ['on2', 'n2', 'n^2', 'quadratic'],
		},
		{
			id:    'on3',
			label: 'O(n³)',
			title: 'Cubic',
			fn:    n => n * n * n,
			cssVar: '--bigo-chart-line-color-6',
			aliases: ['on3', 'n3', 'n^3', 'cubic'],
		},
		{
			id:    'o2n',
			label: 'O(2ⁿ)',
			title: 'Exponential',
			fn:    n => Math.pow(2, n),
			cssVar: '--bigo-chart-line-color-7',
			aliases: ['o2n', '2n', '2^n', 'exp', 'exponential'],
		},
		{
			id:    'ofact',
			label: 'O(n!)',
			title: 'Factorial',
			// Stirling's approximation: n! ≈ √(2πn) · (n/e)ⁿ - smooth & accurate for n ≥ 2
			fn:    n => Math.sqrt(2 * Math.PI * n) * Math.pow(n / Math.E, n),
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

	function niceMax(rawMax) {
		if (rawMax <= 0) return 1
		const magnitude = Math.pow(10, Math.floor(Math.log10(rawMax)))
		const normalised = rawMax / magnitude
		let nice
		if      (normalised <= 1)   nice = 1
		else if (normalised <= 2)   nice = 2
		else if (normalised <= 5)   nice = 5
		else if (normalised <= 10)  nice = 10
		else                        nice = 20
		return nice * magnitude
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

	function fmtY(v) {
		if (v >= 1e9) return (v / 1e9).toFixed(0) + 'B'
		if (v >= 1e6) return (v / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
		if (v >= 1e3) return (v / 1e3).toFixed(1).replace(/\.0$/, '') + 'k'
		return Math.round(v).toString()
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
				<svg class="bigo-svg"
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
				<span class="bigo-ctrl-label">n =</span>
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

	function renderChart(wrapper, n, enabled) {
		const svgEl    = wrapper.querySelector('.bigo-svg')
		const gridG    = wrapper.querySelector('.bigo-grid')
		const axesG    = wrapper.querySelector('.bigo-axes')
		const curvesG  = wrapper.querySelector('.bigo-curves')
		const markerG  = wrapper.querySelector('.bigo-marker')
		const ticksG   = wrapper.querySelector('.bigo-tick-labels')

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
		// ------------------------------------------------------------------
		const ticks = yTicks(yMax)

		let gridHTML      = ''
		let tickLabelHTML = ''

		for (const tv of ticks) {
			const [, sy] = dataToSVG(xMin, tv, xMin, xMax, yMax)
			if (sy < PAD_T - 4 || sy > PAD_T + PLOT_H + 4) continue
			gridHTML += `<line x1="${PAD_L}" y1="${sy.toFixed(1)}" x2="${PAD_L + PLOT_W}" y2="${sy.toFixed(1)}" class="bigo-gridline"/>`
			tickLabelHTML += `<text x="${(PAD_L - 6).toFixed(1)}" y="${sy.toFixed(1)}" class="bigo-tick-y">${fmtY(tv)}</text>`
		}

		// X-axis: label every integer from 1 to n
		const sy = PAD_T + PLOT_H
		for (let xv = xMin; xv <= n; xv++) {
			const [sx] = dataToSVG(xv, 0, xMin, xMax, yMax)
			tickLabelHTML += `<text x="${sx.toFixed(1)}" y="${(sy + 14).toFixed(1)}" class="bigo-tick-x">${xv}</text>`
		}

		// Chart title (top-left, inside plot area)
		const titleX = PAD_L + 16
		const titleY = PAD_T + 16
		tickLabelHTML += `<text x="${titleX}" y="${titleY}" class="bigo-title" text-anchor="start">Comparison of Algorithmic Complexity</text>`

		// X-axis label (centered below axis)
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
			valEl.textContent = isFinite(v) ? fmtY(Math.round(v)) : '∞'
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
			const rawMax = parseInt(el.getAttribute('max') ?? '15', 10)
			const maxN   = Math.max(5, Math.min(20, isNaN(rawMax) ? 15 : rawMax))

			// Parse enabled attribute (case-insensitive, flexible)
			let enabledAttr = el.getAttribute('enabled')
			let enabledSet
			if (enabledAttr) {
				const tokens = enabledAttr.split(/[,]+/).map(s => s.trim().toLowerCase()).filter(Boolean)
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
					nDisplay.textContent = n.toFixed(1).replace(/\.0$/, '');
					renderChart(wrapper, n, enabled);
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

	window.$docsify = window.$docsify ?? {}
	window.$docsify.plugins = [
		...(window.$docsify.plugins ?? []),
		hook => {
			hook.doneEach(() => processBigOChart())
		},
	]

})()