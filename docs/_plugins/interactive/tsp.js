/**
 * docsify-tsp.js — Travelling Salesman Problem visualizer
 *
 * Demonstrates TSP solving algorithms with interactive visualization:
 *   - Brute Force: Tests all (N-1)! permutations to find optimal solution
 *   - Nearest Neighbour: Greedy heuristic that's fast but not guaranteed optimal
 *   - Algorithm comparison to demonstrate speed vs. quality trade-offs
 *
 * Usage in markdown:
 *   <tsp></tsp>
 *   <tsp cities="6"></tsp>
 *   <tsp cities="8" speed="fast"></tsp>
 *   <tsp solve="nn" cities="15"></tsp>
 *   <tsp solve="compare-nn" cities="10" history></tsp>
 *
 * Attributes:
 *   - cities: Initial number of cities (default: 8, range: 3–30)
 *   - solve: Algorithm to use (default: brute)
 *     - brute: Brute force search testing all permutations (guaranteed optimal)
 *     - nn: Nearest neighbour greedy heuristic (fast approximation)
 *     - compare-nn: Run both algorithms and show comparison
 *   - history: If present, shows a history panel tracking best route improvements (brute force only)
 *   - speed: Animation speed (default: normal)
 *     - slow: Updates every route/city with 50ms delay (very visual)
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
    // TSP Solver - Nearest Neighbour (Greedy Heuristic)
    // -------------------------------------------------------------------------

    class TSPNearestNeighbourSolver {
        constructor(cities, onProgress, onComplete) {
            this.cities = cities;
            this.onProgress = onProgress;
            this.onComplete = onComplete;
            this.running = false;
            this.route = [];
            this.totalDistance = 0;
            this.visited = new Set();
            this.currentCity = null;
            this.startTime = null;
            this.actualComputeTime = 0; // Track time without animation delays
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

        findNearestUnvisited(fromCity) {
            let nearest = null;
            let minDist = Infinity;

            for (const city of this.cities) {
                if (!this.visited.has(city.id)) {
                    const dist = this.distance(fromCity, city);
                    if (dist < minDist) {
                        minDist = dist;
                        nearest = city;
                    }
                }
            }

            return { city: nearest, distance: minDist };
        }

        async start() {
            this.running = true;
            this.startTime = Date.now();
            this.route = [];
            this.visited = new Set();
            this.totalDistance = 0;
            this.actualComputeTime = 0;

            // Start at first city
            this.currentCity = this.cities[0];
            this.route.push(this.currentCity);
            this.visited.add(this.currentCity.id);

            // Initial progress callback
            await this.onProgress({
                currentCity: this.currentCity,
                route: [...this.route],
                visited: new Set(this.visited),
                unvisited: this.cities.filter(c => !this.visited.has(c.id)),
                citiesVisited: this.route.length,
                totalCities: this.cities.length,
                partialDistance: 0,
                elapsedTime: Date.now() - this.startTime
            });

            // Visit remaining cities
            while (this.visited.size < this.cities.length && this.running) {
                const computeStart = Date.now();
                const { city: nearest, distance: dist } = this.findNearestUnvisited(this.currentCity);
                this.actualComputeTime += Date.now() - computeStart;

                if (!nearest) break;

                this.totalDistance += dist;
                this.currentCity = nearest;
                this.route.push(this.currentCity);
                this.visited.add(this.currentCity.id);

                // Progress callback after each city
                await this.onProgress({
                    currentCity: this.currentCity,
                    route: [...this.route],
                    visited: new Set(this.visited),
                    unvisited: this.cities.filter(c => !this.visited.has(c.id)),
                    citiesVisited: this.route.length,
                    totalCities: this.cities.length,
                    partialDistance: this.totalDistance,
                    elapsedTime: Date.now() - this.startTime
                });
            }

            // Add return to start
            if (this.running && this.route.length === this.cities.length) {
                const computeStart = Date.now();
                this.totalDistance += this.distance(this.route[this.route.length - 1], this.route[0]);
                this.actualComputeTime += Date.now() - computeStart;

                this.onComplete({
                    route: this.route,
                    distance: this.totalDistance,
                    citiesVisited: this.cities.length,
                    totalCities: this.cities.length,
                    elapsedTime: Date.now() - this.startTime,
                    actualComputeTime: this.actualComputeTime
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

        if (ms === 0) return '< 1 ms';
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

    function buildUI(initialCities = DEFAULT_CITIES, showHistory = false, solverMode = 'brute') {
        const wrapper = document.createElement('div');
        wrapper.className = 'tsp-wrapper';
        wrapper.dataset.solverMode = solverMode;

        // Customize title/subtitle based on solver mode
        const titles = {
            'brute': {
                title: 'Travelling Salesman Problem: Brute Force',
                subtitle: 'Finding the shortest route through all cities by testing every possibility'
            },
            'nn': {
                title: 'Travelling Salesman Problem: Nearest Neighbour',
                subtitle: 'Greedy heuristic: always visit the nearest unvisited city'
            },
            'compare-nn': {
                title: 'Travelling Salesman Problem: Comparing Algorithms',
                subtitle: 'Nearest Neighbour (fast heuristic) vs. Brute Force (guaranteed optimal)'
            }
        };

        const { title, subtitle } = titles[solverMode] || titles['brute'];

        // Customize progress label based on solver mode
        const progressLabel = solverMode === 'nn' ? 'Cities Visited' : 'Progress';
        const metricLabel = solverMode === 'brute' ? 'Routes to check:' : 'Total cities:';

        const historyHTML = showHistory ? `
                <div class="tsp-history">
                    <pre class="tsp-history-list"></pre>
                </div>` : '';

        const comparisonHTML = solverMode === 'compare-nn' ? `
                <div class="tsp-comparison">
                    <div class="tsp-comparison-title">Algorithm Comparison</div>
                    <div class="tsp-comparison-grid">
                        <div class="tsp-comparison-item">
                            <div class="tsp-comparison-label">Nearest Neighbour</div>
                            <div class="tsp-comparison-distance tsp-nn-distance">—</div>
                            <div class="tsp-comparison-time tsp-nn-time">—</div>
                        </div>
                        <div class="tsp-comparison-item">
                            <div class="tsp-comparison-label">Brute Force</div>
                            <div class="tsp-comparison-distance tsp-brute-distance">—</div>
                            <div class="tsp-comparison-time tsp-brute-time">—</div>
                        </div>
                        <div class="tsp-comparison-item tsp-comparison-summary">
                            <div class="tsp-comparison-label">Difference</div>
                            <div class="tsp-comparison-diff">—</div>
                        </div>
                    </div>
                </div>` : '';

        wrapper.innerHTML = `
            <div class="tsp-header">
                <h3 class="tsp-title">${title}</h3>
                <p class="tsp-subtitle">${subtitle}</p>
            </div>
            <div class="tsp-content">
                <div class="tsp-control-group">
                    <label class="tsp-label">
                        Cities: <span class="tsp-cities-value">${initialCities}</span>
                    </label>
                    <input type="range" class="tsp-slider" min="${MIN_CITIES}" max="${MAX_CITIES}" value="${initialCities}">
                    <div class="tsp-factorial"><span class="tsp-metric-label">${metricLabel}</span> <span class="tsp-factorial-value">...</span></div>
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
                        <div class="tsp-stat-label">${progressLabel}</div>
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
                ${comparisonHTML}
                ${historyHTML}
            </div>
        `;

        return wrapper;
    }

    // -------------------------------------------------------------------------
    // Canvas rendering
    // -------------------------------------------------------------------------

    function drawCanvas(canvas, cities, options = {}) {
        const {
            currentRoute = null,
            bestRoute = null,
            isComplete = false,
            // NN-specific options
            partialRoute = null,
            visited = null,
            unvisited = null,
            currentCity = null,
            // Comparison mode options
            comparisonNNRoute = null,
            comparisonComplete = false,
            highlightRoute = null // 'nn' or 'brute' for hover states
        } = options;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Get computed colors from TSP CSS variables
        const styles = getComputedStyle(canvas.closest('.markdown-section tsp'));
        const routeExploringColor = styles.getPropertyValue('--tsp-canvas-route-exploring').trim();
        const routeBestColor = styles.getPropertyValue('--tsp-canvas-route-best').trim();
        const routeSearchingColor = styles.getPropertyValue('--tsp-canvas-route-searching').trim();
        const routeBuildingColor = styles.getPropertyValue('--tsp-canvas-route-building').trim();
        const routeComparisonNNColor = styles.getPropertyValue('--tsp-canvas-route-comparison-nn').trim();
        const cityColor = styles.getPropertyValue('--tsp-canvas-city').trim();
        const cityLabelColor = styles.getPropertyValue('--tsp-canvas-city-label').trim();
        const cityVisitedColor = styles.getPropertyValue('--tsp-canvas-city-visited').trim();
        const cityUnvisitedColor = styles.getPropertyValue('--tsp-canvas-city-unvisited').trim();
        const cityCurrentColor = styles.getPropertyValue('--tsp-canvas-city-current').trim();
        const cityCurrentLabelColor = styles.getPropertyValue('--tsp-canvas-city-current-label').trim();

        // Clear
        ctx.clearRect(0, 0, width, height);

        // Determine opacity and line order based on highlight state
        const nnHighlighted = highlightRoute === 'nn';
        const bruteHighlighted = highlightRoute === 'brute';

        // Draw comparison NN route (if in comparison mode)
        if (comparisonNNRoute && !nnHighlighted) {
            // Draw NN first (behind) unless highlighted
            ctx.globalAlpha = bruteHighlighted ? 0.3 : 1;
            ctx.strokeStyle = routeComparisonNNColor || '#ff6b9d';
            ctx.lineWidth = 2.5;
            // Solid line when comparison is complete, dashed during brute force
            if (comparisonComplete) {
                ctx.setLineDash([]);
            } else {
                ctx.setLineDash([8, 4]);
            }
            ctx.beginPath();
            for (let i = 0; i < comparisonNNRoute.length; i++) {
                const city = comparisonNNRoute[i];
                if (i === 0) ctx.moveTo(city.x, city.y);
                else ctx.lineTo(city.x, city.y);
            }
            ctx.lineTo(comparisonNNRoute[0].x, comparisonNNRoute[0].y);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.globalAlpha = 1;
        }

        // Draw route being explored (faint) - brute force mode
        if (currentRoute && !isComplete && !partialRoute) {
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

        // Draw partial route being built (NN mode)
        if (partialRoute && partialRoute.length > 1) {
            ctx.strokeStyle = routeBuildingColor || routeSearchingColor || '#d8dd47';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i < partialRoute.length; i++) {
                const city = partialRoute[i];
                if (i === 0) ctx.moveTo(city.x, city.y);
                else ctx.lineTo(city.x, city.y);
            }
            ctx.stroke();
        }

        // Draw best route found so far (brute force mode)
        if (bestRoute) {
            ctx.globalAlpha = nnHighlighted ? 0.3 : 1;
            ctx.strokeStyle = isComplete ? (routeBestColor || '#68bef8') : (routeSearchingColor || '#d8dd47');
            ctx.lineWidth = isComplete ? 3.5 : 2;
            ctx.beginPath();
            for (let i = 0; i < bestRoute.length; i++) {
                const city = bestRoute[i];
                if (i === 0) ctx.moveTo(city.x, city.y);
                else ctx.lineTo(city.x, city.y);
            }
            ctx.lineTo(bestRoute[0].x, bestRoute[0].y);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }

        // Draw NN route on top if highlighted
        if (comparisonNNRoute && nnHighlighted) {
            ctx.strokeStyle = routeComparisonNNColor || '#ff6b9d';
            ctx.lineWidth = 2.5;
            ctx.setLineDash([]);
            ctx.beginPath();
            for (let i = 0; i < comparisonNNRoute.length; i++) {
                const city = comparisonNNRoute[i];
                if (i === 0) ctx.moveTo(city.x, city.y);
                else ctx.lineTo(city.x, city.y);
            }
            ctx.lineTo(comparisonNNRoute[0].x, comparisonNNRoute[0].y);
            ctx.stroke();
        }

        // Draw cities with state-based colouring
        cities.forEach((city, i) => {
            let fillColor = cityColor;
            let labelColor = cityLabelColor;
            let radius = 10;

            // NN mode: color based on visited/unvisited/current state
            if (visited !== null) {
                if (currentCity && city.id === currentCity.id) {
                    fillColor = cityCurrentColor || '#68bef8';
                    labelColor = cityCurrentLabelColor || '#000';
                    radius = 12; // Slightly larger
                } else if (visited.has(city.id)) {
                    fillColor = cityVisitedColor || cityColor;
                } else {
                    fillColor = cityUnvisitedColor || '#666';
                    labelColor = '#999';
                }
            }

            // City circle
            ctx.fillStyle = fillColor;
            ctx.beginPath();
            ctx.arc(city.x, city.y, radius, 0, Math.PI * 2);
            ctx.fill();

            // City label
            ctx.fillStyle = labelColor;
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
            const solveAttr = el.getAttribute('solve') || 'brute';

            // Normalize solve attribute
            const solverMode = ['brute', 'nn', 'compare-nn'].includes(solveAttr) ? solveAttr : 'brute';

            // Map speed attribute to delay and update frequency
            const speedConfig = {
                'instant': { delay: 0,  updateEvery: 0 },      // No UI updates, yields every 10k routes
                'fast':    { delay: 0,  updateEvery: 1000 },   // Update every 1000 routes
                'normal':  { delay: 0,  updateEvery: 100 },    // Update every 100 routes (default)
                'slow':    { delay: 50, updateEvery: 1 }       // Update every route with 50ms delay
            };
            const speed = speedConfig[speedAttr] || speedConfig['normal'];

            const wrapper = buildUI(Math.max(MIN_CITIES, Math.min(MAX_CITIES, initialCities)), showHistory, solverMode);

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
                return route.map(city => `<span class="${cityClass}">${city.id}</span>`).join('→');
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

            function addHistoryMessage(message) {
                if (!showHistory) return;

                // Add message entry to beginning of array
                routeHistory.unshift({ message });

                // Keep only last 100
                if (routeHistory.length > 100) {
                    routeHistory.length = 100;
                }

                // Update display
                updateHistoryDisplay();
            }

            function updateHistoryDisplay(isComplete = false) {
                if (!showHistory || !historyList) return;

                const displayCount = Math.min(10, routeHistory.length);
                const lines = [];

                for (let i = 0; i < displayCount; i++) {
                    const entry = routeHistory[i];

                    // Handle message entries
                    if (entry.message) {
                        lines.push(`<div class="tsp-history-row tsp-history-message">${entry.message}</div>`);
                        continue;
                    }

                    // Handle route entries
                    const nextEntry = i < displayCount - 1 ? routeHistory[i + 1] : null

                    const isFirst = i === 0
                    const preamble = `${isComplete && isFirst ? 'Best route: ' : 'Best so far:'}`;
                    const distance = `<span class="tsp-history-distance">${entry.distance.toFixed(1)}</span>`;
                    const route = formatRoute(entry.route, isComplete && isFirst);
                    // Only show diff if distance decreased (brute force), not if it increased (NN building route)
                    const diff = !isComplete && nextEntry && !nextEntry.message && entry.distance < nextEntry.distance ? `  <span class="tsp-history-diff">(${(nextEntry.distance - entry.distance).toFixed(1)} shorter)</span>` : ''

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

            function updateMetric(n) {
                if (solverMode === 'brute' || solverMode === 'compare-nn') {
                    const f = factorial(n - 1);
                    factorialValue.innerHTML = formatNumber(f, false);
                } else {
                    factorialValue.textContent = n.toString();
                }
            }

            function resetCities() {
                const n = parseInt(slider.value, 10);
                cities = generateCities(n, canvas.width, canvas.height);
                drawCanvas(canvas, cities, {});
                bestValue.textContent = '—';
                progressValue.textContent = '0 / 0';
                elapsedValue.textContent = '0 s';
                remainingValue.textContent = '...';
                statusEl.textContent = 'Ready';
                clearHistory();

                // Reset comparison if in compare mode
                if (solverMode === 'compare-nn') {
                    const nnDistance = wrapper.querySelector('.tsp-nn-distance');
                    const nnTime = wrapper.querySelector('.tsp-nn-time');
                    const bruteDistance = wrapper.querySelector('.tsp-brute-distance');
                    const bruteTime = wrapper.querySelector('.tsp-brute-time');
                    const diff = wrapper.querySelector('.tsp-comparison-diff');
                    if (nnDistance) nnDistance.textContent = '—';
                    if (nnTime) nnTime.textContent = '—';
                    if (bruteDistance) bruteDistance.textContent = '—';
                    if (bruteTime) bruteTime.textContent = '—';
                    if (diff) diff.textContent = '—';
                }
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
                updateMetric(initialCities);
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
                            drawCanvas(canvas, cities, { bestRoute: solver.bestRoute, isComplete });
                        } else {
                            drawCanvas(canvas, cities, {});
                        }
                    }
                }, 100); // Debounce resize events
            });

            resizeObserver.observe(canvas.parentElement);

            // Event: Slider change
            slider.addEventListener('input', () => {
                const n = parseInt(slider.value, 10);
                citiesValue.textContent = n;
                updateMetric(n);
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
                clearHistory();

                // Clear previous route visualization
                drawCanvas(canvas, cities, {});

                // Execute based on solver mode
                if (solverMode === 'nn') {
                    await runNearestNeighbour();
                } else if (solverMode === 'compare-nn') {
                    await runComparison();
                } else {
                    await runBruteForce();
                }
            });

            // Run Nearest Neighbour solver
            async function runNearestNeighbour() {
                statusEl.textContent = 'Building route...';
                addHistoryMessage('Starting Nearest Neighbour search...');

                solver = new TSPNearestNeighbourSolver(
                    cities,
                    async (progress) => {
                        // Update stats
                        progressValue.textContent = `${progress.citiesVisited} / ${progress.totalCities}`;
                        bestValue.textContent = progress.partialDistance > 0 ? progress.partialDistance.toFixed(1) : '—';
                        elapsedValue.textContent = formatTime(progress.elapsedTime);
                        remainingValue.textContent = '—';

                        // Add to history
                        if (progress.partialDistance > 0) {
                            addToHistory(progress.partialDistance, progress.route);
                        }

                        // Draw NN visualization
                        drawCanvas(canvas, cities, {
                            partialRoute: progress.route,
                            visited: progress.visited,
                            unvisited: progress.unvisited,
                            currentCity: progress.currentCity,
                            isComplete: false
                        });

                        // Dynamic delay based on N cities (total ~5s animation)
                        const nnDelay = Math.floor(5000 / cities.length);
                        await new Promise(resolve => setTimeout(resolve, nnDelay));
                    },
                    (result) => {
                        // Complete
                        progressValue.textContent = `${result.citiesVisited} / ${result.totalCities}`;
                        bestValue.textContent = result.distance.toFixed(1);
                        elapsedValue.textContent = formatTime(result.elapsedTime);
                        remainingValue.textContent = '0 s';
                        statusEl.textContent = `Complete! Route distance: ${result.distance.toFixed(1)}`;

                        // Draw final route
                        drawCanvas(canvas, cities, { bestRoute: result.route, isComplete: true });

                        updateHistoryDisplay(true);
                        startBtn.disabled = false;
                        stopBtn.disabled = true;
                        slider.disabled = false;
                        resetBtn.disabled = false;
                    }
                );

                // Initialize stats
                progressValue.textContent = '0 / ' + cities.length;
                bestValue.textContent = '—';
                elapsedValue.textContent = '0 s';
                remainingValue.textContent = '—';

                await new Promise(resolve => setTimeout(resolve, 0));
                await solver.start();
            }

            // Run Brute Force solver
            async function runBruteForce() {
                statusEl.textContent = 'Searching...';
                addHistoryMessage('Starting Brute Force search...');

                const callbackFrequency = speed.updateEvery === 0 ? 10000 : speed.updateEvery;
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
                        drawCanvas(canvas, cities, { currentRoute: progress.route, bestRoute: progress.bestRoute, isComplete: false });

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
                        drawCanvas(canvas, cities, { bestRoute: result.bestRoute, isComplete: true });
                        updateHistoryDisplay(true);
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

                await new Promise(resolve => setTimeout(resolve, 0));
                await solver.start();
            }

            // Run comparison: NN first, then Brute Force
            async function runComparison() {
                statusEl.textContent = 'Running Nearest Neighbour...';
                addHistoryMessage('Starting Nearest Neighbour search...');

                // Get DOM references for comparison
                const nnDistance = wrapper.querySelector('.tsp-nn-distance');
                const nnTime = wrapper.querySelector('.tsp-nn-time');
                const bruteDistance = wrapper.querySelector('.tsp-brute-distance');
                const bruteTime = wrapper.querySelector('.tsp-brute-time');
                const diff = wrapper.querySelector('.tsp-comparison-diff');

                let nnResult = null;

                // Run NN first with visible animation
                solver = new TSPNearestNeighbourSolver(
                    cities,
                    async (progress) => {
                        // Update stats during NN phase
                        progressValue.textContent = `${progress.citiesVisited} / ${progress.totalCities}`;
                        bestValue.textContent = progress.partialDistance > 0 ? progress.partialDistance.toFixed(1) : '—';
                        elapsedValue.textContent = formatTime(progress.elapsedTime);
                        remainingValue.textContent = '—';

                        // Add to history
                        if (progress.partialDistance > 0) {
                            addToHistory(progress.partialDistance, progress.route);
                        }

                        // Draw NN visualization
                        drawCanvas(canvas, cities, {
                            partialRoute: progress.route,
                            visited: progress.visited,
                            unvisited: progress.unvisited,
                            currentCity: progress.currentCity,
                            isComplete: false
                        });

                        // Dynamic delay based on N cities (total ~5s animation)
                        const nnDelay = Math.floor(5000 / cities.length);
                        await new Promise(resolve => setTimeout(resolve, nnDelay));
                    },
                    (result) => {
                        nnResult = result;
                        // Update comparison stats with actual compute time
                        if (nnDistance) nnDistance.textContent = result.distance.toFixed(1);
                        if (nnTime) nnTime.textContent = `${formatTime(result.actualComputeTime)} (${result.citiesVisited} steps)`;

                        // Draw NN result
                        drawCanvas(canvas, cities, { bestRoute: result.route, isComplete: false });
                    }
                );

                await solver.start();

                // Pause and show NN completion status
                statusEl.textContent = 'Nearest Neighbour complete!';
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Set up hover interactions for comparison stats
                let highlightedRoute = null;
                const nnItem = wrapper.querySelector('.tsp-comparison-item:has(.tsp-nn-distance)');
                const bruteItem = wrapper.querySelector('.tsp-comparison-item:has(.tsp-brute-distance)');

                if (nnItem) {
                    nnItem.addEventListener('mouseenter', () => { highlightedRoute = 'nn'; });
                    nnItem.addEventListener('mouseleave', () => { highlightedRoute = null; });
                    nnItem.style.cursor = 'pointer';
                }

                if (bruteItem) {
                    bruteItem.addEventListener('mouseenter', () => { highlightedRoute = 'brute'; });
                    bruteItem.addEventListener('mouseleave', () => { highlightedRoute = null; });
                    bruteItem.style.cursor = 'pointer';
                }

                // Announce brute force starting
                statusEl.textContent = 'Starting Brute Force search...';
                addHistoryMessage('Starting Brute Force search...');
                await new Promise(resolve => setTimeout(resolve, 1000));

                statusEl.textContent = 'Running Brute Force...';

                const callbackFrequency = speed.updateEvery === 0 ? 10000 : speed.updateEvery;
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

                        // Draw current state (keep NN route visible, with hover highlight)
                        drawCanvas(canvas, cities, {
                            currentRoute: progress.route,
                            bestRoute: progress.bestRoute,
                            comparisonNNRoute: nnResult.route,
                            isComplete: false,
                            highlightRoute: highlightedRoute
                        });

                        // Yield to browser
                        if (speed.delay > 0) {
                            await new Promise(resolve => setTimeout(resolve, speed.delay));
                        } else {
                            await new Promise(resolve => setTimeout(resolve, 0));
                        }
                    },
                    (result) => {
                        // Complete - update comparison
                        if (bruteDistance) bruteDistance.textContent = result.bestDistance.toFixed(1);
                        if (bruteTime) bruteTime.textContent = `${formatTime(result.elapsedTime)} (${formatNumber(result.totalRoutes, false)} routes)`;

                        // Calculate difference
                        if (nnResult && diff) {
                            const pct = ((nnResult.distance / result.bestDistance - 1) * 100).toFixed(1);
                            const absDiff = (nnResult.distance - result.bestDistance).toFixed(1);
                            diff.innerHTML = `NN was <span style="color: var(--highlight-color)">${absDiff}</span> longer (+${pct}%)`;
                        }

                        progressValue.innerHTML = `${formatNumber(result.totalRoutes)} / ${formatNumber(result.totalRoutes)}`;
                        bestValue.textContent = result.bestDistance.toFixed(1);
                        elapsedValue.textContent = formatTime(result.elapsedTime);
                        remainingValue.textContent = '0 s';
                        statusEl.textContent = `Complete! Optimal: ${result.bestDistance.toFixed(1)}, NN: ${nnResult.distance.toFixed(1)}`;

                        // Draw final comparison with both routes
                        const redrawComparison = (highlightRoute = null) => {
                            drawCanvas(canvas, cities, {
                                bestRoute: result.bestRoute,
                                comparisonNNRoute: nnResult.route,
                                isComplete: true,
                                comparisonComplete: true,
                                highlightRoute
                            });
                        };

                        // Update hover handlers for final view (redraw on hover)
                        if (nnItem) {
                            nnItem.replaceWith(nnItem.cloneNode(true));
                            const newNnItem = wrapper.querySelector('.tsp-comparison-item:has(.tsp-nn-distance)');
                            newNnItem.addEventListener('mouseenter', () => redrawComparison('nn'));
                            newNnItem.addEventListener('mouseleave', () => redrawComparison());
                            newNnItem.style.cursor = 'pointer';
                        }

                        if (bruteItem) {
                            bruteItem.replaceWith(bruteItem.cloneNode(true));
                            const newBruteItem = wrapper.querySelector('.tsp-comparison-item:has(.tsp-brute-distance)');
                            newBruteItem.addEventListener('mouseenter', () => redrawComparison('brute'));
                            newBruteItem.addEventListener('mouseleave', () => redrawComparison());
                            newBruteItem.style.cursor = 'pointer';
                        }

                        redrawComparison();

                        updateHistoryDisplay(true);
                        startBtn.disabled = false;
                        stopBtn.disabled = true;
                        slider.disabled = false;
                        resetBtn.disabled = false;
                    },
                    callbackFrequency
                );

                // Reset stats display
                progressValue.innerHTML = `0 / ${formatNumber(solver.totalRoutes)}`;
                bestValue.textContent = '—';
                elapsedValue.textContent = '0 s';
                remainingValue.textContent = '...';

                await new Promise(resolve => setTimeout(resolve, 0));
                await solver.start();
            }

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
