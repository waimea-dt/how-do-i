/**
 * docsify-tsp.js — Travelling Salesman Problem visualizer
 *
 * Demonstrates the computational complexity of brute-force TSP by:
 *   - Randomly placing N cities on a canvas
 *   - Testing all possible routes (N! permutations)
 *   - Animating the search process
 *   - Showing progress stats and time predictions
 *
 * Future: Will be extended with greedy heuristics (nearest neighbor, 2-opt)
 *
 * Usage in markdown:
 *   <tsp></tsp>
 *   <tsp cities="6"></tsp>
 *   <tsp cities="8" speed="fast"></tsp>
 *
 * Attributes:
 *   - cities: Initial number of cities (default: 8, range: 3–30)
 *   - history: If present, shows a history panel tracking best route improvements
 *   - speed: Animation speed (default: normal)
 *     - slow: Updates every route with 50ms delay (very visual)
 *     - normal: Updates every 100 routes, no delay (default)
 *     - fast: Updates every 1000 routes, no delay (faster completion)
 *     - instant: No visualization, yields every 10k routes (Stop button works)
 */

;(function () {

    // -------------------------------------------------------------------------
    // Configuration
    // -------------------------------------------------------------------------

    const DEFAULT_CITIES = 8;
    const MIN_CITIES = 3;
    const MAX_CITIES = 30;

    // Note: Timing is based on actual elapsed time and varies by machine performance.
    // Progress updates occur every 100 routes, yielding to the browser to keep UI responsive.
    // On average hardware, expect ~18,000 routes/second for typical city configurations.

    // -------------------------------------------------------------------------
    // TSP Solver - Brute Force
    // -------------------------------------------------------------------------

    class TSPBruteForceSolver {
        constructor(cities, onProgress, onComplete, callbackFrequency = 1) {
            this.cities = cities;
            this.onProgress = onProgress;
            this.onComplete = onComplete;
            this.callbackFrequency = callbackFrequency; // How often to call progress callback
            this.running = false;
            this.bestRoute = null;
            this.bestDistance = Infinity;
            this.routesChecked = 0;
            this.totalRoutes = this.factorial(cities.length - 1); // Fix first city
            this.startTime = null;
        }

        factorial(n) {
            if (n <= 1) return 1;
            return n * this.factorial(n - 1);
        }

        distance(city1, city2) {
            const dx = city1.x - city2.x;
            const dy = city1.y - city2.y;
            return Math.sqrt(dx * dx + dy * dy);
        }

        routeDistance(route) {
            let total = 0;
            for (let i = 0; i < route.length - 1; i++) {
                total += this.distance(route[i], route[i + 1]);
            }
            // Return to start
            total += this.distance(route[route.length - 1], route[0]);
            return total;
        }

        // Generate permutations using Heap's algorithm
        *generatePermutations(arr) {
            const n = arr.length;
            const c = new Array(n).fill(0);

            yield arr.slice();

            let i = 0;
            while (i < n) {
                if (c[i] < i) {
                    const k = i % 2 === 0 ? 0 : c[i];
                    [arr[k], arr[i]] = [arr[i], arr[k]];
                    yield arr.slice();
                    c[i]++;
                    i = 0;
                } else {
                    c[i] = 0;
                    i++;
                }
            }
        }

        async start() {
            this.running = true;
            this.startTime = Date.now();
            this.routesChecked = 0;
            this.bestRoute = null;
            this.bestDistance = Infinity;

            // Fix first city, permute the rest
            const firstCity = this.cities[0];
            const remainingCities = this.cities.slice(1);

            for (const perm of this.generatePermutations(remainingCities)) {
                if (!this.running) break;

                const route = [firstCity, ...perm];
                const distance = this.routeDistance(route);

                if (distance < this.bestDistance) {
                    this.bestDistance = distance;
                    this.bestRoute = route.slice();
                }

                this.routesChecked++;

                // Report progress at specified frequency
                if (this.routesChecked % this.callbackFrequency === 0 || this.routesChecked === this.totalRoutes) {
                    await this.onProgress({
                        route: route,
                        distance: distance,
                        bestRoute: this.bestRoute,
                        bestDistance: this.bestDistance,
                        routesChecked: this.routesChecked,
                        totalRoutes: this.totalRoutes,
                        elapsedTime: Date.now() - this.startTime
                    });
                }
            }

            if (this.running) {
                this.onComplete({
                    bestRoute: this.bestRoute,
                    bestDistance: this.bestDistance,
                    routesChecked: this.routesChecked,
                    totalRoutes: this.totalRoutes,
                    elapsedTime: Date.now() - this.startTime
                });
            }

            this.running = false;
        }

        stop() {
            this.running = false;
        }
    }

    // -------------------------------------------------------------------------
    // City generation
    // -------------------------------------------------------------------------

    function generateCities(n, width, height) {
        const cities = [];
        const minDistance = 60; // Minimum distance between cities
        const margin = 40; // Margin from edges
        const maxAttempts = 100;

        for (let i = 0; i < n; i++) {
            let attempts = 0;
            let city;

            do {
                city = {
                    x: margin + Math.random() * (width - 2 * margin),
                    y: margin + Math.random() * (height - 2 * margin),
                    id: i
                };
                attempts++;
            } while (attempts < maxAttempts && cities.some(c => {
                const dx = c.x - city.x;
                const dy = c.y - city.y;
                return Math.sqrt(dx * dx + dy * dy) < minDistance;
            }));

            cities.push(city);
        }

        return cities;
    }

    // -------------------------------------------------------------------------
    // UI Components
    // -------------------------------------------------------------------------

    function factorial(n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }

    function formatNumber(num, useSci=true) {
        if (!useSci || num < 1e9) {
            return num.toLocaleString();
        }
        // Use scientific notation for large numbers
        const exp = Math.floor(Math.log10(num));
        const mantissa = num / Math.pow(10, exp);
        return `${mantissa.toFixed(3)}×10<sup>${exp}</sup>`;
    }

    function formatTime(ms) {
        const seconds = ms / 1000;
        const minutes = seconds / 60;
        const hours = minutes / 60;
        const days = hours / 24;
        const weeks = days / 7;
        const months = days / 30.44; // Average month length
        const years = days / 365.25; // Account for leap years

        if (ms < 1000) return `${ms.toFixed(0)} ms`;
        if (seconds < 60) return `${seconds.toFixed(1)} s`;
        if (minutes < 60) return `${minutes.toFixed(1)} mins`;
        if (hours < 24) return `${hours.toFixed(1)} hours`;
        if (days < 7) return `${days.toFixed(1)} days`;
        if (weeks < 4) return `${weeks.toFixed(1)} weeks`;
        if (months < 12) return `${months.toFixed(1)} months`;
        return `${years.toFixed(1)} years`;
    }

    function estimateRemainingTime(routesChecked, totalRoutes, elapsedTime) {
        if (routesChecked === 0) return '...';
        const avgTimePerRoute = elapsedTime / routesChecked;
        const remainingRoutes = totalRoutes - routesChecked;
        return formatTime(avgTimePerRoute * remainingRoutes);
    }

    function buildUI(initialCities = DEFAULT_CITIES, showHistory = false) {
        const wrapper = document.createElement('div');
        wrapper.className = 'tsp-wrapper';

        const historyHTML = showHistory ? `
                <div class="tsp-history">
                    <pre class="tsp-history-list"></pre>
                </div>` : '';

        wrapper.innerHTML = `
            <div class="tsp-header">
                <h3 class="tsp-title">Travelling Salesman Problem: Brute Force</h3>
                <p class="tsp-subtitle">Finding the shortest route through all cities by testing every possibility</p>
            </div>
            <div class="tsp-content">
                <div class="tsp-control-group">
                    <label class="tsp-label">
                        Cities: <span class="tsp-cities-value">${initialCities}</span>
                    </label>
                    <input type="range" class="tsp-slider" min="${MIN_CITIES}" max="${MAX_CITIES}" value="${initialCities}">
                    <div class="tsp-factorial">Routes to check: <span class="tsp-factorial-value">...</span></div>
                </div>
                <div class="tsp-button-group">
                    <button class="tsp-btn tsp-btn-start">Start</button>
                    <button class="tsp-btn tsp-btn-stop" disabled>Stop</button>
                    <button class="tsp-btn tsp-btn-reset">Reset</button>
                </div>
                <div class="tsp-visualization">
                    <canvas class="tsp-canvas"></canvas>
                    <div class="tsp-status">Ready</div>
                </div>
                <div class="tsp-stats">
                    <div class="tsp-stat">
                        <div class="tsp-stat-label">Progress</div>
                        <div class="tsp-stat-value tsp-progress-value">0 / 0</div>
                    </div>
                    <div class="tsp-stat">
                        <div class="tsp-stat-label">Current Best</div>
                        <div class="tsp-stat-value tsp-best-value">—</div>
                    </div>
                    <div class="tsp-stat">
                        <div class="tsp-stat-label">Elapsed</div>
                        <div class="tsp-stat-value tsp-elapsed-value">0s</div>
                    </div>
                    <div class="tsp-stat">
                        <div class="tsp-stat-label">Estimated Remaining</div>
                        <div class="tsp-stat-value tsp-remaining-value">...</div>
                    </div>
                </div>
                ${historyHTML}
            </div>
        `;

        return wrapper;
    }

    // -------------------------------------------------------------------------
    // Canvas rendering
    // -------------------------------------------------------------------------

    function drawCanvas(canvas, cities, currentRoute = null, bestRoute = null, isComplete = false) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Get computed colors from TSP CSS variables
        const styles = getComputedStyle(canvas.closest('.markdown-section tsp'));
        const routeExploringColor = styles.getPropertyValue('--tsp-canvas-route-exploring').trim();
        const routeBestColor = styles.getPropertyValue('--tsp-canvas-route-best').trim();
        const routeSearchingColor = styles.getPropertyValue('--tsp-canvas-route-searching').trim();
        const cityColor = styles.getPropertyValue('--tsp-canvas-city').trim();
        const cityLabelColor = styles.getPropertyValue('--tsp-canvas-city-label').trim();

        // Clear
        ctx.clearRect(0, 0, width, height);

        // Draw route being explored (faint)
        if (currentRoute && !isComplete) {
            ctx.strokeStyle = routeExploringColor || '#666';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            for (let i = 0; i < currentRoute.length; i++) {
                const city = currentRoute[i];
                if (i === 0) ctx.moveTo(city.x, city.y);
                else ctx.lineTo(city.x, city.y);
            }
            ctx.lineTo(currentRoute[0].x, currentRoute[0].y);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Draw best route found so far
        if (bestRoute) {
            ctx.strokeStyle = isComplete ? (routeBestColor || '#68bef8') : (routeSearchingColor || '#d8dd47');
            ctx.lineWidth = isComplete ? 3 : 2;
            ctx.beginPath();
            for (let i = 0; i < bestRoute.length; i++) {
                const city = bestRoute[i];
                if (i === 0) ctx.moveTo(city.x, city.y);
                else ctx.lineTo(city.x, city.y);
            }
            ctx.lineTo(bestRoute[0].x, bestRoute[0].y);
            ctx.stroke();
        }

        // Draw cities
        cities.forEach((city, i) => {
            // City circle
            ctx.fillStyle = cityColor;
            ctx.beginPath();
            ctx.arc(city.x, city.y, 10, 0, Math.PI * 2);
            ctx.fill();

            // City label
            ctx.fillStyle = cityLabelColor;
            ctx.font = '700 15px system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(i, city.x, city.y);
        });
    }

    // -------------------------------------------------------------------------
    // Plugin entry point
    // -------------------------------------------------------------------------

    function processTSP() {
        document.querySelectorAll('.markdown-section tsp').forEach(el => {
            const initialCities = parseInt(el.getAttribute('cities') ?? `${DEFAULT_CITIES}`, 10);
            const showHistory = el.hasAttribute('history');
            const speedAttr = el.getAttribute('speed') || 'normal';

            // Map speed attribute to delay and update frequency
            const speedConfig = {
                'instant': { delay: 0,  updateEvery: 0 },      // No UI updates, yields every 10k routes
                'fast':    { delay: 0,  updateEvery: 1000 },   // Update every 1000 routes
                'normal':  { delay: 0,  updateEvery: 100 },    // Update every 100 routes (default)
                'slow':    { delay: 50, updateEvery: 1 }       // Update every route with 50ms delay
            };
            const speed = speedConfig[speedAttr] || speedConfig['normal'];

            const wrapper = buildUI(Math.max(MIN_CITIES, Math.min(MAX_CITIES, initialCities)), showHistory);

            el.innerHTML = '';
            el.appendChild(wrapper);

            // Get DOM references
            const canvas = wrapper.querySelector('.tsp-canvas');
            const slider = wrapper.querySelector('.tsp-slider');
            const citiesValue = wrapper.querySelector('.tsp-cities-value');
            const factorialValue = wrapper.querySelector('.tsp-factorial-value');
            const startBtn = wrapper.querySelector('.tsp-btn-start');
            const stopBtn = wrapper.querySelector('.tsp-btn-stop');
            const resetBtn = wrapper.querySelector('.tsp-btn-reset');
            const statusEl = wrapper.querySelector('.tsp-status');
            const progressValue = wrapper.querySelector('.tsp-progress-value');
            const bestValue = wrapper.querySelector('.tsp-best-value');
            const elapsedValue = wrapper.querySelector('.tsp-elapsed-value');
            const remainingValue = wrapper.querySelector('.tsp-remaining-value');
            const historyList = showHistory ? wrapper.querySelector('.tsp-history-list') : null;

            // State
            let cities = [];
            let solver = null;
            let routeHistory = []; // Store last 100 best routes
            let isInitializing = true; // Prevent resize observer during initialization

            // Format a route for display with highlighting
            function formatRoute(route, isComplete = false) {
                const cityClass = isComplete ? 'tsp-history-city-final' : 'tsp-history-city';
                return route.map(city => `<span class="${cityClass}">${city.id}</span>`).join(' → ');
            }

            function addToHistory(distance, route) {
                if (!showHistory) return;

                // Add to beginning of array
                routeHistory.unshift({ distance, route: [...route] });

                // Keep only last 100
                if (routeHistory.length > 100) {
                    routeHistory.length = 100;
                }

                // Update display (show only first 10)
                updateHistoryDisplay();
            }

            function updateHistoryDisplay(isComplete = false) {
                if (!showHistory || !historyList) return;

                const displayCount = Math.min(10, routeHistory.length);
                const lines = [];

                for (let i = 0; i < displayCount; i++) {
                    const entry = routeHistory[i];
                    const nextEntry = i < displayCount - 1 ? routeHistory[i + 1] : null

                    const isFirst = i === 0
                    const preamble = `${isComplete && isFirst ? 'Best route: ' : 'Best so far:'}`;
                    const distance = `<span class="tsp-history-distance">${entry.distance.toFixed(1)}</span>`;
                    const route = formatRoute(entry.route, isComplete && isFirst);
                    const diff = !isComplete && nextEntry ? `  <span class="tsp-history-diff">(${(nextEntry.distance - entry.distance).toFixed(1)} shorter)</span>` : ''

                    lines.push(`<div class="tsp-history-row ${isFirst ? 'tsp-current-best' : ''}">${preamble}  ${route}  ${distance}${diff}</div>`);
                }

                historyList.innerHTML = lines.join('');
            }

            function clearHistory() {
                if (!showHistory) return;
                routeHistory = [];
                if (historyList) {
                    historyList.innerHTML = '';
                }
            }

            function updateFactorial(n) {
                const f = factorial(n - 1);
                factorialValue.innerHTML = formatNumber(f, false);
            }

            function resetCities() {
                const n = parseInt(slider.value, 10);
                cities = generateCities(n, canvas.width, canvas.height);
                drawCanvas(canvas, cities);
                bestValue.textContent = '—';
                progressValue.textContent = '0 / 0';
                elapsedValue.textContent = '0 s';
                remainingValue.textContent = '...';
                statusEl.textContent = 'Ready';
                clearHistory();
            }

            // Initialize after DOM layout (using setTimeout to ensure layout is complete)
            setTimeout(() => {
                // Set canvas size
                const rect = canvas.parentElement.getBoundingClientRect();
                const width = rect.width > 0 ? rect.width : 800; // Ensure minimum width
                canvas.width = width;
                canvas.height = 400;

                // Initialize UI
                slider.value = initialCities;
                citiesValue.textContent = initialCities;
                updateFactorial(initialCities);
                resetCities();
                isInitializing = false;
            }, 100); // Small delay to ensure layout is complete

            // Handle canvas resize
            let resizeTimeout;
            const resizeObserver = new ResizeObserver(() => {
                if (isInitializing) return;
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    const rect = canvas.parentElement.getBoundingClientRect();
                    const oldWidth = canvas.width;
                    const oldHeight = canvas.height;

                    canvas.width = rect.width;
                    canvas.height = 400;

                    // If dimensions changed and we have cities, scale their positions
                    if (cities.length > 0 && (oldWidth !== canvas.width || oldHeight !== canvas.height)) {
                        const scaleX = canvas.width / oldWidth;
                        const scaleY = canvas.height / oldHeight;

                        cities.forEach(city => {
                            city.x *= scaleX;
                            city.y *= scaleY;
                        });

                        // Redraw with current best route if solver has found one
                        if (solver && solver.bestRoute) {
                            const isComplete = solver && !solver.running;
                            drawCanvas(canvas, cities, null, solver.bestRoute, isComplete);
                        } else {
                            drawCanvas(canvas, cities);
                        }
                    }
                }, 100); // Debounce resize events
            });

            resizeObserver.observe(canvas.parentElement);

            // Event: Slider change
            slider.addEventListener('input', () => {
                const n = parseInt(slider.value, 10);
                citiesValue.textContent = n;
                updateFactorial(n);
            });

            slider.addEventListener('change', resetCities);

            // Event: Reset
            resetBtn.addEventListener('click', resetCities);

            // Event: Start
            startBtn.addEventListener('click', async () => {
                if (solver && solver.running) return;

                // Update UI state immediately
                startBtn.disabled = true;
                stopBtn.disabled = false;
                slider.disabled = true;
                resetBtn.disabled = true;
                statusEl.textContent = 'Searching...';
                clearHistory();

                // Clear previous route visualization
                drawCanvas(canvas, cities);

                // Determine callback frequency based on speed mode
                const callbackFrequency = speed.updateEvery === 0 ? 10000 : speed.updateEvery;

                // Create solver to get total routes
                let lastBestDistance = Infinity;

                solver = new TSPBruteForceSolver(
                    cities,
                    async (progress) => {
                        // For instant mode, just yield to browser without UI updates
                        const isInstant = speed.updateEvery === 0;
                        if (isInstant) {
                            await new Promise(resolve => setTimeout(resolve, 0));
                            return;
                        }

                        // Update stats
                        progressValue.innerHTML = `${formatNumber(progress.routesChecked)} / ${formatNumber(progress.totalRoutes)}`;
                        bestValue.textContent = progress.bestDistance.toFixed(1);
                        elapsedValue.textContent = formatTime(progress.elapsedTime);
                        remainingValue.textContent = estimateRemainingTime(progress.routesChecked, progress.totalRoutes, progress.elapsedTime);

                        // Add to history if new best found
                        if (progress.bestDistance < lastBestDistance) {
                            lastBestDistance = progress.bestDistance;
                            addToHistory(progress.bestDistance, progress.bestRoute);
                        }

                        // Draw current state
                        drawCanvas(canvas, cities, progress.route, progress.bestRoute, false);

                        // Yield to browser
                        if (speed.delay > 0) {
                            await new Promise(resolve => setTimeout(resolve, speed.delay));
                        } else {
                            await new Promise(resolve => setTimeout(resolve, 0));
                        }
                    },
                    (result) => {
                        // Complete - update final stats
                        progressValue.innerHTML = `${formatNumber(result.totalRoutes)} / ${formatNumber(result.totalRoutes)}`;
                        bestValue.textContent = result.bestDistance.toFixed(1);
                        elapsedValue.textContent = formatTime(result.elapsedTime);
                        remainingValue.textContent = '0 s';
                        statusEl.textContent = `Complete! Best route: ${result.bestDistance.toFixed(1)}`;
                        drawCanvas(canvas, cities, null, result.bestRoute, true);
                        updateHistoryDisplay(true); // Update with final highlighting
                        startBtn.disabled = false;
                        stopBtn.disabled = true;
                        slider.disabled = false;
                        resetBtn.disabled = false;
                    },
                    callbackFrequency
                );

                // Reset stats display with correct total
                progressValue.innerHTML = `0 / ${formatNumber(solver.totalRoutes)}`;
                bestValue.textContent = '—';
                elapsedValue.textContent = '0 s';
                remainingValue.textContent = '...';

                // Give browser time to paint UI updates before starting computation
                await new Promise(resolve => setTimeout(resolve, 0));

                await solver.start();
            });

            // Event: Stop
            stopBtn.addEventListener('click', () => {
                if (solver) {
                    solver.stop();
                    statusEl.textContent = 'Stopped';
                    startBtn.disabled = false;
                    stopBtn.disabled = true;
                    slider.disabled = false;
                    resetBtn.disabled = false;
                }
            });
        });
    }

    // -------------------------------------------------------------------------
    // Docsify hook
    // -------------------------------------------------------------------------

    var docsifyTSP = function (hook) {
        hook.doneEach(processTSP);
    };

    window.$docsify = window.$docsify || {};
    window.$docsify.plugins = [].concat(docsifyTSP, window.$docsify.plugins || []);
})();
