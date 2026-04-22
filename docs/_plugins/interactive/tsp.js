/**
 * docsify-tsp.js - Travelling Salesman Problem visualizer
 *
 * Demonstrates TSP solving algorithms with interactive visualization:
 *   - Brute Force: Tests all (N-1)! permutations to find optimal solution
 *   - Nearest Neighbour: Greedy heuristic that's fast but not guaranteed optimal
 *   - 2-Opt: Local search optimization starting from NN solution
 *   - Algorithm comparison to demonstrate speed vs. quality trade-offs
 *
 * Usage in markdown:
 *   <tsp></tsp>
 *   <tsp cities="6"></tsp>
 *   <tsp cities="8" speed="fast"></tsp>
 *   <tsp solve="nn" cities="15"></tsp>
 *   <tsp solve="2opt" cities="15" history></tsp>
 *   <tsp solve="compare-nn" cities="10" history></tsp>
 *   <tsp solve="compare-2opt" cities="10" history></tsp>
 *
 * Attributes:
 *   - cities: Initial number of cities (default: 8, range: 3–30)
 *   - solve: Algorithm to use (default: brute)
 *     - brute: Brute force search testing all permutations (guaranteed optimal)
 *     - nn: Nearest neighbour greedy heuristic (fast approximation)
 *     - 2opt: 2-Opt local search (NN followed by iterative edge swapping)
 *     - compare-nn: Compare NN with brute force
 *     - compare-2opt: Compare 2-Opt with brute force
 *   - history: If present, shows a history panel tracking best route improvements
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
    const ANIMATION_DURATION_MS = 5000;
    const INSTANT_MODE_YIELD_FREQUENCY = 10000;
    const NN_DELAY_MS = (n) => Math.floor(ANIMATION_DURATION_MS / n);
    const TWO_OPT_DELAY_MS = (n) => Math.floor(ANIMATION_DURATION_MS / (n * 4));

    // -------------------------------------------------------------------------
    // TSP Solver Base Class
    // -------------------------------------------------------------------------

    class TSPSolverBase {
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
            total += this.distance(route[route.length - 1], route[0]);
            return total;
        }

        stop() {
            this.running = false;
        }
    }

    // -------------------------------------------------------------------------
    // TSP Solver - Brute Force
    // -------------------------------------------------------------------------

    class TSPBruteForceSolver extends TSPSolverBase {
        constructor(cities, onProgress, onComplete, callbackFrequency = 1) {
            super();
            this.cities = cities;
            this.onProgress = onProgress;
            this.onComplete = onComplete;
            this.callbackFrequency = callbackFrequency;
            this.running = false;
            this.bestRoute = null;
            this.bestDistance = Infinity;
            this.routesChecked = 0;
            this.totalRoutes = factorial(cities.length - 1);
            this.startTime = null;
            this.actualComputeTime = 0;
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
            this.actualComputeTime = 0;

            // Fix first city, permute the rest
            const firstCity = this.cities[0];
            const remainingCities = this.cities.slice(1);

            for (const perm of this.generatePermutations(remainingCities)) {
                if (!this.running) break;

                const computeStart = Date.now();
                const route = [firstCity, ...perm];
                const distance = this.routeDistance(route);

                if (distance < this.bestDistance) {
                    this.bestDistance = distance;
                    this.bestRoute = route.slice();
                }

                this.routesChecked++;
                this.actualComputeTime += Date.now() - computeStart;

                // Report progress at specified frequency
                if (this.routesChecked % this.callbackFrequency === 0 || this.routesChecked === this.totalRoutes) {
                    await this.onProgress({
                        route: route,
                        distance: distance,
                        bestRoute: this.bestRoute,
                        bestDistance: this.bestDistance,
                        routesChecked: this.routesChecked,
                        totalRoutes: this.totalRoutes,
                        elapsedTime: Date.now() - this.startTime,
                        actualComputeTime: this.actualComputeTime
                    });
                }
            }

            if (this.running) {
                this.onComplete({
                    bestRoute: this.bestRoute,
                    bestDistance: this.bestDistance,
                    routesChecked: this.routesChecked,
                    totalRoutes: this.totalRoutes,
                    elapsedTime: Date.now() - this.startTime,
                    actualComputeTime: this.actualComputeTime
                });
            }

            this.running = false;
        }
    }

    // -------------------------------------------------------------------------
    // TSP Solver - Nearest Neighbour (Greedy Heuristic)
    // -------------------------------------------------------------------------

    class TSPNearestNeighbourSolver extends TSPSolverBase {
        constructor(cities, onProgress, onComplete) {
            super();
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
                elapsedTime: Date.now() - this.startTime,
                actualComputeTime: this.actualComputeTime
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
                    elapsedTime: Date.now() - this.startTime,
                    actualComputeTime: this.actualComputeTime
                });
            }

            // Add return to start
            if (this.running && this.route.length === this.cities.length) {
                const computeStart = Date.now();
                this.totalDistance += this.distance(this.route[this.route.length - 1], this.route[0]);
                this.actualComputeTime += Date.now() - computeStart;

                // Show final progress with complete route including return to start
                await this.onProgress({
                    currentCity: this.route[0], // Back to start
                    route: [...this.route],
                    visited: new Set(this.visited),
                    unvisited: [],
                    citiesVisited: this.route.length,
                    totalCities: this.cities.length,
                    partialDistance: this.totalDistance,
                    elapsedTime: Date.now() - this.startTime,
                    actualComputeTime: this.actualComputeTime,
                    showReturnEdge: true // Signal to show the complete loop
                });

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
    }

    // -------------------------------------------------------------------------
    // TSP Solver - 2-Opt Local Search
    // -------------------------------------------------------------------------

    class TSP2OptSolver extends TSPSolverBase {
        constructor(initialRoute, onProgress, onComplete) {
            super();
            this.route = [...initialRoute];
            this.onProgress = onProgress;
            this.onComplete = onComplete;
            this.running = false;
            this.startTime = null;
            this.actualComputeTime = 0;
            this.swapsPerformed = 0;
        }

        // Reverse a segment of the route (2-opt swap)
        // Reverses the tour segment from position i+1 to k (inclusive)
        twoOptSwap(route, i, k) {
            const newRoute = [
                ...route.slice(0, i + 1),
                ...route.slice(i + 1, k + 1).reverse(),
                ...route.slice(k + 1)
            ];
            return newRoute;
        }

        async start() {
            this.running = true;
            this.startTime = Date.now();
            this.actualComputeTime = 0;
            this.swapsPerformed = 0;

            let improved = true;
            let totalComparisons = 0;

            // Continue until no improvements found (local optimum reached)
            while (improved && this.running) {
                improved = false;

                // Try all possible pairs of edges
                for (let i = 0; i < this.route.length - 1; i++) {
                    for (let k = i + 1; k < this.route.length; k++) {
                        if (!this.running) break;

                        totalComparisons++;
                        const computeStart = Date.now();

                        // Calculate distance of current edges
                        // Edge 1: route[i] -> route[i+1]
                        // Edge 2: route[k] -> route[(k+1) % n]
                        const n = this.route.length;
                        const currentDist =
                            this.distance(this.route[i], this.route[i + 1]) +
                            this.distance(this.route[k], this.route[(k + 1) % n]);

                        // Calculate distance of new edges after reversing segment
                        // New Edge 1: route[i] -> route[k]
                        // New Edge 2: route[i+1] -> route[(k+1) % n]
                        const newDist =
                            this.distance(this.route[i], this.route[k]) +
                            this.distance(this.route[i + 1], this.route[(k + 1) % n]);

                        this.actualComputeTime += Date.now() - computeStart;

                        // Show progress for this comparison
                        await this.onProgress({
                            route: [...this.route],
                            distance: this.routeDistance(this.route),
                            swapEdges: [
                                [this.route[i], this.route[i + 1]],
                                [this.route[k], this.route[(k + 1) % n]]
                            ],
                            comparing: true,
                            willSwap: newDist < currentDist,
                            swapsPerformed: this.swapsPerformed,
                            totalComparisons,
                            elapsedTime: Date.now() - this.startTime,
                            actualComputeTime: this.actualComputeTime
                        });

                        const computeStart2 = Date.now();

                        // If swapping improves the tour, do it
                        if (newDist < currentDist) {
                            this.route = this.twoOptSwap(this.route, i, k);
                            improved = true;
                            this.swapsPerformed++;

                            this.actualComputeTime += Date.now() - computeStart2;

                            // Show the improved route
                            await this.onProgress({
                                route: [...this.route],
                                distance: this.routeDistance(this.route),
                                swapEdges: null,
                                comparing: false,
                                willSwap: false,
                                swapsPerformed: this.swapsPerformed,
                                totalComparisons,
                                elapsedTime: Date.now() - this.startTime,
                                actualComputeTime: this.actualComputeTime
                            });
                        } else {
                            this.actualComputeTime += Date.now() - computeStart2;
                        }
                    }
                    if (!this.running) break;
                }
            }

            if (this.running) {
                this.onComplete({
                    route: this.route,
                    distance: this.routeDistance(this.route),
                    swapsPerformed: this.swapsPerformed,
                    elapsedTime: Date.now() - this.startTime,
                    actualComputeTime: this.actualComputeTime
                });
            }

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
        if (ms == null || isNaN(ms)) return '< 1 ms';

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

    function setUIRunning(elements) {
        const { startBtn, stopBtn, slider, resetBtn } = elements;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        slider.disabled = true;
        resetBtn.disabled = true;
    }

    function setUIComplete(elements) {
        const { startBtn, stopBtn, slider, resetBtn } = elements;
        startBtn.disabled = false;
        stopBtn.disabled = true;
        slider.disabled = false;
        resetBtn.disabled = false;
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
                title: 'Travelling Salesman Problem: Comparing NN to Brute Force',
                subtitle: 'Nearest Neighbour (fast heuristic) vs. Brute Force (guaranteed optimal)'
            },
            '2opt': {
                title: 'Travelling Salesman Problem: 2-Opt Local Search',
                subtitle: 'Iteratively swap edge pairs to find local optimum (may not be globally optimal)'
            },
            'compare-2opt': {
                title: 'Travelling Salesman Problem: Comparing NN/2-Opt to Brute Force',
                subtitle: '2-Opt (fast, finds local optimum) vs. Brute Force (slow, guaranteed global optimum)'
            }
        };

        const { title, subtitle } = titles[solverMode] || titles['brute'];

        // Customize progress label based on solver mode
        const progressLabel = (solverMode === 'nn' || solverMode === '2opt') ? 'Progress' : 'Progress';
        const metricLabel = solverMode === 'brute' ? 'Routes to check:' : 'Total cities:';
        const timeLabel = (solverMode === 'brute' || solverMode === 'nn' || solverMode === '2opt' || solverMode === 'compare-nn' || solverMode === 'compare-2opt') ? 'Compute Time' : 'Elapsed';

        const historyHTML = showHistory ? `
                <div class="tsp-history">
                    <pre class="tsp-history-list"></pre>
                </div>` : '';

        const comparisonHTML = (solverMode === 'compare-nn' || solverMode === 'compare-2opt') ? `
                <div class="tsp-comparison">
                    <div class="tsp-comparison-title">Algorithm Comparison</div>
                    <div class="tsp-comparison-grid">
                        <div class="tsp-comparison-item">
                            <div class="tsp-comparison-label">${solverMode === 'compare-2opt' ? '2-Opt (NN + refinement)' : 'Nearest Neighbour'}</div>
                            <div class="tsp-comparison-distance tsp-nn-distance">-</div>
                            <div class="tsp-comparison-time tsp-nn-time">-</div>
                        </div>
                        <div class="tsp-comparison-item">
                            <div class="tsp-comparison-label">Brute Force</div>
                            <div class="tsp-comparison-distance tsp-brute-distance">-</div>
                            <div class="tsp-comparison-time tsp-brute-time">-</div>
                        </div>
                        <div class="tsp-comparison-item tsp-comparison-summary">
                            <div class="tsp-comparison-label">Difference</div>
                            <div class="tsp-comparison-diff">-</div>
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
                        <div class="tsp-stat-value tsp-best-value">-</div>
                    </div>
                    <div class="tsp-stat">
                        <div class="tsp-stat-label">${timeLabel}</div>
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
            highlightRoute = null, // 'nn' or 'brute' for hover states
            // 2-opt specific options
            swapEdges = null, // Array of two edges being considered for swapping
            willSwap = false // Whether this swap will improve the route
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
        const twoOptTestingColor = styles.getPropertyValue('--tsp-canvas-2opt-testing').trim();
        const twoOptSwappingColor = styles.getPropertyValue('--tsp-canvas-2opt-swapping').trim();
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
            ctx.strokeStyle = routeComparisonNNColor;
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
            ctx.strokeStyle = routeExploringColor;
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
            ctx.strokeStyle = routeBuildingColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i < partialRoute.length; i++) {
                const city = partialRoute[i];
                if (i === 0) ctx.moveTo(city.x, city.y);
                else ctx.lineTo(city.x, city.y);
            }
            ctx.stroke();
        }

        // Draw best route found so far (brute force mode or 2-opt mode)
        if (bestRoute) {
            ctx.globalAlpha = nnHighlighted ? 0.3 : 1;
            // Use pink (NN color) for 2-opt routes, otherwise use standard colors
            if (swapEdges) {
                // 2-opt mode: use same color as NN routes
                ctx.strokeStyle = routeComparisonNNColor;
                ctx.lineWidth = 2.5;
            } else {
                // Brute force mode: use standard colors
                ctx.strokeStyle = isComplete ? routeBestColor : routeSearchingColor;
                ctx.lineWidth = isComplete ? 3.5 : 2;
            }
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
            ctx.strokeStyle = routeComparisonNNColor;
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

        // Draw 2-opt swap edges being considered
        if (swapEdges && swapEdges.length === 2) {
            // Highlight the two edges being compared (thicker for visibility)
            ctx.lineWidth = 5;
            ctx.strokeStyle = willSwap ? twoOptSwappingColor : twoOptTestingColor;
            ctx.globalAlpha = 0.8;

            // Draw first edge
            ctx.beginPath();
            ctx.moveTo(swapEdges[0][0].x, swapEdges[0][0].y);
            ctx.lineTo(swapEdges[0][1].x, swapEdges[0][1].y);
            ctx.stroke();

            // Draw second edge
            ctx.beginPath();
            ctx.moveTo(swapEdges[1][0].x, swapEdges[1][0].y);
            ctx.lineTo(swapEdges[1][1].x, swapEdges[1][1].y);
            ctx.stroke();

            ctx.globalAlpha = 1;

            // Draw circles at the swap points
            [swapEdges[0][0], swapEdges[0][1], swapEdges[1][0], swapEdges[1][1]].forEach(city => {
                ctx.fillStyle = willSwap ? twoOptSwappingColor : twoOptTestingColor;
                ctx.beginPath();
                ctx.arc(city.x, city.y, 8, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        // Draw cities with state-based colouring
        cities.forEach((city, i) => {
            let fillColor = cityColor;
            let labelColor = cityLabelColor;
            let radius = 10;

            // NN mode: color based on visited/unvisited/current state
            if (visited !== null) {
                if (currentCity && city.id === currentCity.id) {
                    fillColor = cityCurrentColor;
                    labelColor = cityCurrentLabelColor;
                    radius = 12; // Slightly larger
                } else if (visited.has(city.id)) {
                    fillColor = cityVisitedColor;
                } else {
                    fillColor = cityUnvisitedColor;
                    labelColor = cityLabelColor;
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
    // Utility functions
    // -------------------------------------------------------------------------

    function getOptimalUpdateFrequency(totalRoutes) {
        if (totalRoutes > 1e7) return 100000;
        if (totalRoutes > 1e6) return 10000;
        if (totalRoutes > 1e5) return 1000;
        if (totalRoutes > 1e4) return 100;
        if (totalRoutes > 1e3) return 10;
        return 1;
    }

    function formatRoute(route, isComplete = false) {
        const cityClass = isComplete ? 'tsp-history-city-final' : 'tsp-history-city';
        return route.map(city => `<span class="${cityClass}">${city.id}</span>`).join('→');
    }

    // -------------------------------------------------------------------------
    // TSPWidget class
    // -------------------------------------------------------------------------

    class TSPWidget {
        constructor(el) {
            // Parse configuration
            this.initialCities = parseInt(el.getAttribute('cities') ?? `${DEFAULT_CITIES}`, 10);
            this.showHistory = el.hasAttribute('history');
            const speedAttr = el.getAttribute('speed') || 'normal';
            const solveAttr = el.getAttribute('solve') || 'brute';

            // Normalize solve attribute
            this.solverMode = ['brute', 'nn', 'compare-nn', '2opt', 'compare-2opt'].includes(solveAttr) ? solveAttr : 'brute';

            // Map speed attribute to delay and update frequency
            const speedConfig = {
                'instant': { delay: 0,  updateEvery: 0 },
                'slow':    { delay: 50, updateEvery: 1 }
            };
            this.speed = speedConfig[speedAttr] || { delay: 0, updateEvery: 'auto' };

            // Build UI
            this.wrapper = buildUI(Math.max(MIN_CITIES, Math.min(MAX_CITIES, this.initialCities)), this.showHistory, this.solverMode);
            el.innerHTML = '';
            el.appendChild(this.wrapper);

            // Get DOM references
            this.canvas = this.wrapper.querySelector('.tsp-canvas');
            this.slider = this.wrapper.querySelector('.tsp-slider');
            this.citiesValue = this.wrapper.querySelector('.tsp-cities-value');
            this.factorialValue = this.wrapper.querySelector('.tsp-factorial-value');
            this.startBtn = this.wrapper.querySelector('.tsp-btn-start');
            this.stopBtn = this.wrapper.querySelector('.tsp-btn-stop');
            this.resetBtn = this.wrapper.querySelector('.tsp-btn-reset');
            this.statusEl = this.wrapper.querySelector('.tsp-status');
            this.progressValue = this.wrapper.querySelector('.tsp-progress-value');
            this.bestValue = this.wrapper.querySelector('.tsp-best-value');
            this.elapsedValue = this.wrapper.querySelector('.tsp-elapsed-value');
            this.remainingValue = this.wrapper.querySelector('.tsp-remaining-value');
            this.historyList = this.showHistory ? this.wrapper.querySelector('.tsp-history-list') : null;

            // State
            this.cities = [];
            this.solver = null;
            this.routeHistory = [];
            this.isInitializing = true;
            this.uiElements = {
                startBtn: this.startBtn,
                stopBtn: this.stopBtn,
                slider: this.slider,
                resetBtn: this.resetBtn
            };

            //Initialize
            this.initialize();
        }

        initialize() {
            // Set canvas size
            setTimeout(() => {
                const rect = this.canvas.parentElement.getBoundingClientRect();
                const width = rect.width > 0 ? rect.width : 800;
                this.canvas.width = width;
                this.canvas.height = 400;

                // Initialize UI
                this.slider.value = this.initialCities;
                this.citiesValue.textContent = this.initialCities;
                this.updateMetric(this.initialCities);
                this.resetCities();
                this.isInitializing = false;
            }, 100);

            this.setupEventListeners();
            this.setupResizeObserver();
        }

        // History management methods
        addToHistory(distance, route) {
            if (!this.showHistory) return;
            this.routeHistory.unshift({ distance, route: [...route] });
            if (this.routeHistory.length > 100) {
                this.routeHistory.length = 100;
            }
            this.updateHistoryDisplay();
        }

        addHistoryMessage(message) {
            if (!this.showHistory) return;
            this.routeHistory.unshift({ message });
            if (this.routeHistory.length > 100) {
                this.routeHistory.length = 100;
            }
            this.updateHistoryDisplay();
        }

        updateHistoryDisplay(isComplete = false) {
            if (!this.showHistory || !this.historyList) return;

            const displayCount = Math.min(10, this.routeHistory.length);
            const lines = [];

            for (let i = 0; i < displayCount; i++) {
                const entry = this.routeHistory[i];

                if (entry.message) {
                    lines.push(`<div class="tsp-history-row tsp-history-message">${entry.message}</div>`);
                    continue;
                }

                const nextEntry = i < displayCount - 1 ? this.routeHistory[i + 1] : null;
                const isFirst = i === 0;
                const preamble = `${isComplete && isFirst ? 'Best route: ' : 'Best so far:'}`;
                const distance = `<span class="tsp-history-distance">${entry.distance.toFixed(1)}</span>`;
                const route = formatRoute(entry.route, isComplete && isFirst);
                const diff = !isComplete && nextEntry && !nextEntry.message && entry.distance < nextEntry.distance ?
                    `  <span class="tsp-history-diff">(${(nextEntry.distance - entry.distance).toFixed(1)} shorter)</span>` : '';

                lines.push(`<div class="tsp-history-row ${isFirst ? 'tsp-current-best' : ''}">${preamble}  ${route}  ${distance}${diff}</div>`);
            }

            this.historyList.innerHTML = lines.join('');
        }

        clearHistory() {
            if (!this.showHistory) return;
            this.routeHistory = [];
            if (this.historyList) {
                this.historyList.innerHTML = '';
            }
        }

        // Callback creator methods
        createNNProgressCallback(prefix = '', showIn2OptColor = false) {
            return async (progress) => {
                const label = prefix ? `${prefix}: ` : '';
                this.progressValue.textContent = `${label}${progress.citiesVisited} / ${progress.totalCities}`;
                this.bestValue.textContent = progress.partialDistance > 0 ? progress.partialDistance.toFixed(1) : '-';
                this.elapsedValue.textContent = formatTime(progress.actualComputeTime);
                this.remainingValue.textContent = '-';

                if (progress.partialDistance > 0) {
                    this.addToHistory(progress.partialDistance, progress.route);
                }

                if (progress.showReturnEdge) {
                    drawCanvas(this.canvas, this.cities, {
                        bestRoute: progress.route,
                        swapEdges: showIn2OptColor,
                        isComplete: false
                    });
                } else {
                    drawCanvas(this.canvas, this.cities, {
                        partialRoute: progress.route,
                        visited: progress.visited,
                        unvisited: progress.unvisited,
                        currentCity: progress.currentCity,
                        isComplete: false
                    });
                }

                await new Promise(resolve => setTimeout(resolve, NN_DELAY_MS(this.cities.length)));
            };
        }

        createNNCompleteCallback(message) {
            return (result) => {
                this.progressValue.textContent = message || `${result.citiesVisited} / ${result.totalCities}`;
                this.bestValue.textContent = result.distance.toFixed(1);
                this.elapsedValue.textContent = formatTime(result.actualComputeTime);
                this.remainingValue.textContent = '0 s';
                this.statusEl.textContent = `Complete! Route distance: ${result.distance.toFixed(1)}`;
                drawCanvas(this.canvas, this.cities, { bestRoute: result.route, isComplete: true });
                this.updateHistoryDisplay(true);
                setUIComplete(this.uiElements);
            };
        }

        createBruteForceProgressCallback(options = {}) {
            const {
                comparisonNNRoute = null,
                highlightedRouteGetter = () => null,
                isInstant = false
            } = options;

            let lastBestDistance = Infinity;

            return async (progress) => {
                if (isInstant) {
                    await new Promise(resolve => setTimeout(resolve, 0));
                    return;
                }

                this.progressValue.innerHTML = `${formatNumber(progress.routesChecked)} / ${formatNumber(progress.totalRoutes)}`;
                this.bestValue.textContent = progress.bestDistance.toFixed(1);
                this.elapsedValue.textContent = formatTime(progress.actualComputeTime);
                this.remainingValue.textContent = estimateRemainingTime(progress.routesChecked, progress.totalRoutes, progress.elapsedTime);

                if (progress.bestDistance < lastBestDistance) {
                    lastBestDistance = progress.bestDistance;
                    this.addToHistory(progress.bestDistance, progress.bestRoute);
                }

                drawCanvas(this.canvas, this.cities, {
                    currentRoute: progress.route,
                    bestRoute: progress.bestRoute,
                    comparisonNNRoute,
                    isComplete: false,
                    highlightRoute: highlightedRouteGetter()
                });

                if (this.speed.delay > 0) {
                    await new Promise(resolve => setTimeout(resolve, this.speed.delay));
                } else {
                    await new Promise(resolve => setTimeout(resolve, 0));
                }
            };
        }

        setupComparisonHover(redrawFn) {
            let highlightedRoute = null;
            const nnItem = this.wrapper.querySelector('.tsp-comparison-item:has(.tsp-nn-distance)');
            const bruteItem = this.wrapper.querySelector('.tsp-comparison-item:has(.tsp-brute-distance)');

            const attachHover = (item, route) => {
                if (!item) return;
                item.addEventListener('mouseenter', () => {
                    highlightedRoute = route;
                    if (redrawFn) redrawFn(highlightedRoute);
                });
                item.addEventListener('mouseleave', () => {
                    highlightedRoute = null;
                    if (redrawFn) redrawFn(null);
                });
                item.style.cursor = 'pointer';
            };

            attachHover(nnItem, 'nn');
            attachHover(bruteItem, 'brute');

            return {
                nnItem,
                bruteItem,
                getHighlightedRoute: () => highlightedRoute,
                setHighlightedRoute: (route) => { highlightedRoute = route; }
            };
        }

        // UI helper methods
        updateMetric(n) {
            if (this.solverMode === 'brute' || this.solverMode === 'compare-nn' || this.solverMode === 'compare-2opt') {
                const f = factorial(n - 1);
                this.factorialValue.innerHTML = formatNumber(f, false);
            } else {
                this.factorialValue.textContent = n.toString();
            }
        }

        resetCities() {
            const n = parseInt(this.slider.value, 10);
            this.cities = generateCities(n, this.canvas.width, this.canvas.height);
            drawCanvas(this.canvas, this.cities, {});
            this.bestValue.textContent = '-';
            this.progressValue.textContent = '0 / 0';
            this.elapsedValue.textContent = '0 s';
            this.remainingValue.textContent = '...';
            this.statusEl.textContent = 'Ready';
            this.clearHistory();

            if (this.solverMode === 'compare-nn' || this.solverMode === 'compare-2opt') {
                const nnDistance = this.wrapper.querySelector('.tsp-nn-distance');
                const nnTime = this.wrapper.querySelector('.tsp-nn-time');
                const bruteDistance = this.wrapper.querySelector('.tsp-brute-distance');
                const bruteTime = this.wrapper.querySelector('.tsp-brute-time');
                const diff = this.wrapper.querySelector('.tsp-comparison-diff');
                if (nnDistance) nnDistance.textContent = '-';
                if (nnTime) nnTime.textContent = '-';
                if (bruteDistance) bruteDistance.textContent = '-';
                if (bruteTime) bruteTime.textContent = '-';
                if (diff) diff.textContent = '-';
            }
        }

        setupResizeObserver() {
            let resizeTimeout;
            const resizeObserver = new ResizeObserver(() => {
                if (this.isInitializing) return;
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    const rect = this.canvas.parentElement.getBoundingClientRect();
                    const oldWidth = this.canvas.width;
                    const oldHeight = this.canvas.height;

                    this.canvas.width = rect.width;
                    this.canvas.height = 400;

                    if (this.cities.length > 0 && (oldWidth !== this.canvas.width || oldHeight !== this.canvas.height)) {
                        const scaleX = this.canvas.width / oldWidth;
                        const scaleY = this.canvas.height / oldHeight;

                        this.cities.forEach(city => {
                            city.x *= scaleX;
                            city.y *= scaleY;
                        });

                        if (this.solver && this.solver.bestRoute) {
                            const isComplete = this.solver && !this.solver.running;
                            drawCanvas(this.canvas, this.cities, { bestRoute: this.solver.bestRoute, isComplete });
                        } else {
                            drawCanvas(this.canvas, this.cities, {});
                        }
                    }
                }, 100);
            });

            resizeObserver.observe(this.canvas.parentElement);
        }

        setupEventListeners() {
            this.slider.addEventListener('input', () => {
                const n = parseInt(this.slider.value, 10);
                this.citiesValue.textContent = n;
                this.updateMetric(n);
            });

            this.slider.addEventListener('change', () => this.resetCities());
            this.resetBtn.addEventListener('click', () => this.resetCities());

            this.startBtn.addEventListener('click', async () => {
                if (this.solver && this.solver.running) return;

                setUIRunning(this.uiElements);
                this.clearHistory();
                drawCanvas(this.canvas, this.cities, {});

                if (this.solverMode === 'nn') {
                    await this.runNearestNeighbour();
                } else if (this.solverMode === 'compare-nn') {
                    await this.runComparison();
                } else if (this.solverMode === '2opt') {
                    await this.run2Opt();
                } else if (this.solverMode === 'compare-2opt') {
                    await this.runComparison2Opt();
                } else {
                    await this.runBruteForce();
                }
            });

            this.stopBtn.addEventListener('click', () => {
                if (this.solver) {
                    this.solver.stop();
                    this.statusEl.textContent = 'Stopped';
                    setUIComplete(this.uiElements);
                }
            });
        }

        // Solver runner methods
        async runNearestNeighbour() {
            this.statusEl.textContent = 'Building route...';
            this.addHistoryMessage('Starting Nearest Neighbour search...');

            this.solver = new TSPNearestNeighbourSolver(
                this.cities,
                this.createNNProgressCallback(),
                this.createNNCompleteCallback()
            );

            this.progressValue.textContent = '0 / ' + this.cities.length;
            this.bestValue.textContent = '-';
            this.elapsedValue.textContent = '0 s';
            this.remainingValue.textContent = '-';

            await new Promise(resolve => setTimeout(resolve, 0));
            await this.solver.start();
        }

        async runBruteForce() {
            this.statusEl.textContent = 'Searching...';
            this.addHistoryMessage('Starting Brute Force search...');

            const tempSolver = new TSPBruteForceSolver(this.cities, null, null);
            const updateEvery = this.speed.updateEvery === 'auto' ? getOptimalUpdateFrequency(tempSolver.totalRoutes) : this.speed.updateEvery;
            const callbackFrequency = updateEvery === 0 ? INSTANT_MODE_YIELD_FREQUENCY : updateEvery;
            const isInstant = updateEvery === 0;

            this.solver = new TSPBruteForceSolver(
                this.cities,
                this.createBruteForceProgressCallback({ isInstant }),
                (result) => {
                    this.progressValue.innerHTML = `${formatNumber(result.totalRoutes)} / ${formatNumber(result.totalRoutes)}`;
                    this.bestValue.textContent = result.bestDistance.toFixed(1);
                    this.elapsedValue.textContent = formatTime(result.actualComputeTime);
                    this.remainingValue.textContent = '0 s';
                    this.statusEl.textContent = `Complete! Best route: ${result.bestDistance.toFixed(1)}`;
                    drawCanvas(this.canvas, this.cities, { bestRoute: result.bestRoute, isComplete: true });
                    this.updateHistoryDisplay(true);
                    setUIComplete(this.uiElements);
                },
                callbackFrequency
            );

            this.progressValue.innerHTML = `0 / ${formatNumber(this.solver.totalRoutes)}`;
            this.bestValue.textContent = '-';
            this.elapsedValue.textContent = '0 s';
            this.remainingValue.textContent = '...';

            await new Promise(resolve => setTimeout(resolve, 0));
            await this.solver.start();
        }

        async runComparison() {
            this.statusEl.textContent = 'Running Nearest Neighbour...';
            this.addHistoryMessage('Starting Nearest Neighbour search...');

            const nnDistance = this.wrapper.querySelector('.tsp-nn-distance');
            const nnTime = this.wrapper.querySelector('.tsp-nn-time');
            const bruteDistance = this.wrapper.querySelector('.tsp-brute-distance');
            const bruteTime = this.wrapper.querySelector('.tsp-brute-time');
            const diff = this.wrapper.querySelector('.tsp-comparison-diff');

            this.solver = new TSPNearestNeighbourSolver(
                this.cities,
                this.createNNProgressCallback('NN'),
                (result) => {
                    if (nnDistance) nnDistance.textContent = result.distance.toFixed(1);
                    if (nnTime) nnTime.textContent = `${formatTime(result.actualComputeTime)} (${result.citiesVisited} cities)`;
                    drawCanvas(this.canvas, this.cities, { bestRoute: result.route, comparisonNNRoute: result.route, isComplete: false });
                }
            );

            await this.solver.start();
            const nnResult = this.solver;

            this.statusEl.textContent = 'NN complete!';
            await new Promise(resolve => setTimeout(resolve, 1500));

            this.statusEl.textContent = 'Starting Brute Force search...';
            this.addHistoryMessage('Starting Brute Force search...');
            await new Promise(resolve => setTimeout(resolve, 1000));

            this.statusEl.textContent = 'Running Brute Force...';

            const tempSolver2 = new TSPBruteForceSolver(this.cities, null, null);
            const updateEvery = this.speed.updateEvery === 'auto' ? getOptimalUpdateFrequency(tempSolver2.totalRoutes) : this.speed.updateEvery;
            const callbackFrequency = updateEvery === 0 ? INSTANT_MODE_YIELD_FREQUENCY : updateEvery;
            const isInstant = updateEvery === 0;

            const hoverState = this.setupComparisonHover((highlightRoute) => {
                if (this.solver && this.solver.route) {
                    drawCanvas(this.canvas, this.cities, {
                        currentRoute: this.solver.route,
                        bestRoute: this.solver.bestRoute,
                        comparisonNNRoute: nnResult.route,
                        isComplete: false,
                        highlightRoute
                    });
                }
            });

            this.solver = new TSPBruteForceSolver(
                this.cities,
                this.createBruteForceProgressCallback({
                    comparisonNNRoute: nnResult.route,
                    highlightedRouteGetter: hoverState.getHighlightedRoute,
                    isInstant
                }),
                (result) => {
                    if (bruteDistance) bruteDistance.textContent = result.bestDistance.toFixed(1);
                    if (bruteTime) bruteTime.textContent = `${formatTime(result.actualComputeTime)} (${formatNumber(result.totalRoutes, false)} routes)`;

                    if (nnResult && diff) {
                        const absDiff = Math.abs(nnResult.totalDistance - result.bestDistance);
                        const pct = ((nnResult.totalDistance / result.bestDistance - 1) * 100).toFixed(1);
                        let diffHtml = `NN was <span style="color: var(--highlight-color)">${absDiff.toFixed(1)}</span> longer (+${pct}%)`;

                        if (absDiff < 0.01) {
                            // Perfect match - show both messages!
                            diffHtml += `<div class="tsp-comparison-optimal">Heuristic = Optimal!</div>`;
                        }

                        diff.innerHTML = diffHtml;
                    }

                    this.progressValue.innerHTML = `${formatNumber(result.totalRoutes)} / ${formatNumber(result.totalRoutes)}`;
                    this.bestValue.textContent = result.bestDistance.toFixed(1);
                    this.elapsedValue.textContent = formatTime(result.actualComputeTime);
                    this.remainingValue.textContent = '0 s';
                    this.statusEl.textContent = `Complete! Optimal: ${result.bestDistance.toFixed(1)}, NN: ${nnResult.totalDistance.toFixed(1)}`;

                    const redrawComparison = (highlightRoute = null) => {
                        drawCanvas(this.canvas, this.cities, {
                            bestRoute: result.bestRoute,
                            comparisonNNRoute: nnResult.route,
                            isComplete: true,
                            comparisonComplete: true,
                            highlightRoute
                        });
                    };

                    if (hoverState.nnItem) {
                        hoverState.nnItem.replaceWith(hoverState.nnItem.cloneNode(true));
                        const newNnItem = this.wrapper.querySelector('.tsp-comparison-item:has(.tsp-nn-distance)');
                        newNnItem.addEventListener('mouseenter', () => redrawComparison('nn'));
                        newNnItem.addEventListener('mouseleave', () => redrawComparison());
                        newNnItem.style.cursor = 'pointer';
                    }

                    if (hoverState.bruteItem) {
                        hoverState.bruteItem.replaceWith(hoverState.bruteItem.cloneNode(true));
                        const newBruteItem = this.wrapper.querySelector('.tsp-comparison-item:has(.tsp-brute-distance)');
                        newBruteItem.addEventListener('mouseenter', () => redrawComparison('brute'));
                        newBruteItem.addEventListener('mouseleave', () => redrawComparison());
                        newBruteItem.style.cursor = 'pointer';
                    }

                    redrawComparison();
                    this.updateHistoryDisplay(true);
                    setUIComplete(this.uiElements);
                },
                callbackFrequency
            );

            this.progressValue.innerHTML = `0 / ${formatNumber(this.solver.totalRoutes)}`;
            this.bestValue.textContent = '-';
            this.elapsedValue.textContent = '0 s';
            this.remainingValue.textContent = '...';

            await new Promise(resolve => setTimeout(resolve, 0));
            await this.solver.start();
        }

        async run2Opt() {
            this.statusEl.textContent = 'Building initial route...';
            this.addHistoryMessage('Starting Nearest Neighbour search...');

            let nnSolver = new TSPNearestNeighbourSolver(this.cities, this.createNNProgressCallback(), () => {});
            await nnSolver.start();
            const nnResult = nnSolver.route;
            const nnDistance = nnSolver.totalDistance;

            this.addHistoryMessage('Starting 2-Opt refinement...');
            await new Promise(resolve => setTimeout(resolve, 1000));

            this.statusEl.textContent = 'Refining with 2-Opt...';
            let lastDistance = nnDistance;

            this.solver = new TSP2OptSolver(
                nnResult,
                async (progress) => {
                    this.progressValue.textContent = `2-Opt: ${progress.swapsPerformed} swaps, ${progress.totalComparisons} comparisons`;
                    this.bestValue.textContent = progress.distance.toFixed(1);
                    this.elapsedValue.textContent = formatTime(progress.actualComputeTime);
                    this.remainingValue.textContent = '-';

                    if (progress.distance < lastDistance && !progress.comparing) {
                        lastDistance = progress.distance;
                        this.addToHistory(progress.distance, progress.route);
                    }

                    drawCanvas(this.canvas, this.cities, {
                        bestRoute: progress.route,
                        swapEdges: progress.swapEdges,
                        willSwap: progress.willSwap,
                        isComplete: false
                    });

                    await new Promise(resolve => setTimeout(resolve, TWO_OPT_DELAY_MS(this.cities.length)));
                },
                (result) => {
                    this.progressValue.textContent = `Complete: ${result.swapsPerformed} swaps`;
                    this.bestValue.textContent = result.distance.toFixed(1);
                    this.elapsedValue.textContent = formatTime(result.actualComputeTime);
                    this.remainingValue.textContent = '0 s';
                    const improvement = ((nnDistance - result.distance) / nnDistance * 100).toFixed(1);
                    this.statusEl.textContent = `Complete! Distance: ${result.distance.toFixed(1)} (${improvement}% better than NN)`;
                    drawCanvas(this.canvas, this.cities, { bestRoute: result.route, isComplete: true });
                    this.updateHistoryDisplay(true);
                    setUIComplete(this.uiElements);
                }
            );

            await this.solver.start();
        }

        async runComparison2Opt() {
            this.statusEl.textContent = 'Running 2-Opt algorithm...';
            this.addHistoryMessage('Starting Nearest Neighbour search...');

            const nnDistance = this.wrapper.querySelector('.tsp-nn-distance');
            const nnTime = this.wrapper.querySelector('.tsp-nn-time');
            const bruteDistance = this.wrapper.querySelector('.tsp-brute-distance');
            const bruteTime = this.wrapper.querySelector('.tsp-brute-time');
            const diff = this.wrapper.querySelector('.tsp-comparison-diff');

            let nnSolver = new TSPNearestNeighbourSolver(this.cities, this.createNNProgressCallback('NN', true), () => {});
            await nnSolver.start();
            const nnResult = nnSolver.route;
            const nnDistanceValue = nnSolver.totalDistance;

            this.addHistoryMessage('Starting 2-Opt refinement...');
            await new Promise(resolve => setTimeout(resolve, 1000));

            let twoOptResult = null;
            let lastDistance = nnDistanceValue;
            const hoverState = this.setupComparisonHover((highlightRoute) => {
                if (this.solver && this.solver.route) {
                    drawCanvas(this.canvas, this.cities, {
                        bestRoute: this.solver.route,
                        swapEdges: true,
                        isComplete: false,
                        highlightRoute
                    });
                }
            });

            this.solver = new TSP2OptSolver(
                nnResult,
                async (progress) => {
                    this.progressValue.textContent = `2-Opt: ${progress.swapsPerformed} swaps`;
                    this.bestValue.textContent = progress.distance.toFixed(1);
                    this.elapsedValue.textContent = formatTime(progress.actualComputeTime);

                    if (progress.distance < lastDistance && !progress.comparing) {
                        lastDistance = progress.distance;
                        this.addToHistory(progress.distance, progress.route);
                    }

                    drawCanvas(this.canvas, this.cities, {
                        bestRoute: progress.route,
                        swapEdges: progress.swapEdges,
                        willSwap: progress.willSwap,
                        highlightRoute: hoverState.getHighlightedRoute()
                    });

                    await new Promise(resolve => setTimeout(resolve, TWO_OPT_DELAY_MS(this.cities.length)));
                },
                (result) => {
                    twoOptResult = result;
                    if (nnDistance) nnDistance.textContent = result.distance.toFixed(1);
                    if (nnTime) nnTime.textContent = `${formatTime(result.actualComputeTime)} (${result.swapsPerformed} swaps)`;
                    drawCanvas(this.canvas, this.cities, { bestRoute: result.route, comparisonNNRoute: result.route, isComplete: false });
                }
            );

            await this.solver.start();

            this.statusEl.textContent = '2-Opt complete!';
            await new Promise(resolve => setTimeout(resolve, 1500));

            this.statusEl.textContent = 'Starting Brute Force search...';
            this.addHistoryMessage('Starting Brute Force search...');
            await new Promise(resolve => setTimeout(resolve, 1000));

            this.statusEl.textContent = 'Running Brute Force...';

            const tempSolver2 = new TSPBruteForceSolver(this.cities, null, null);
            const updateEvery = this.speed.updateEvery === 'auto' ? getOptimalUpdateFrequency(tempSolver2.totalRoutes) : this.speed.updateEvery;
            const callbackFrequency = updateEvery === 0 ? INSTANT_MODE_YIELD_FREQUENCY : updateEvery;
            const isInstant = updateEvery === 0;

            this.solver = new TSPBruteForceSolver(
                this.cities,
                this.createBruteForceProgressCallback({
                    comparisonNNRoute: twoOptResult.route,
                    highlightedRouteGetter: hoverState.getHighlightedRoute,
                    isInstant
                }),
                (result) => {
                    if (bruteDistance) bruteDistance.textContent = result.bestDistance.toFixed(1);
                    if (bruteTime) bruteTime.textContent = `${formatTime(result.actualComputeTime)} (${formatNumber(result.totalRoutes, false)} routes)`;

                    if (twoOptResult && diff) {
                        const absDiff = Math.abs(twoOptResult.distance - result.bestDistance);
                        const pct = ((twoOptResult.distance / result.bestDistance - 1) * 100).toFixed(1);
                        let diffHtml = `2-Opt was <span style="color: var(--highlight-color)">${absDiff.toFixed(1)}</span> longer (+${pct}%)`;

                        if (absDiff < 0.01) {
                            // Perfect match - show both messages!
                            diffHtml += `<div class="tsp-comparison-optimal">Heuristic = Optimal!</div>`;
                        }

                        diff.innerHTML = diffHtml;
                    }

                    this.progressValue.innerHTML = `${formatNumber(result.totalRoutes)} / ${formatNumber(result.totalRoutes)}`;
                    this.bestValue.textContent = result.bestDistance.toFixed(1);
                    this.elapsedValue.textContent = formatTime(result.actualComputeTime);
                    this.remainingValue.textContent = '0 s';
                    this.statusEl.textContent = `Complete! Optimal: ${result.bestDistance.toFixed(1)}, 2-Opt: ${twoOptResult.distance.toFixed(1)}`;

                    const redrawComparison = (highlightRoute = null) => {
                        drawCanvas(this.canvas, this.cities, {
                            bestRoute: result.bestRoute,
                            comparisonNNRoute: twoOptResult.route,
                            isComplete: true,
                            comparisonComplete: true,
                            highlightRoute
                        });
                    };

                    if (hoverState.nnItem) {
                        hoverState.nnItem.replaceWith(hoverState.nnItem.cloneNode(true));
                        const newNnItem = this.wrapper.querySelector('.tsp-comparison-item:has(.tsp-nn-distance)');
                        newNnItem.addEventListener('mouseenter', () => redrawComparison('nn'));
                        newNnItem.addEventListener('mouseleave', () => redrawComparison());
                        newNnItem.style.cursor = 'pointer';
                    }

                    if (hoverState.bruteItem) {
                        hoverState.bruteItem.replaceWith(hoverState.bruteItem.cloneNode(true));
                        const newBruteItem = this.wrapper.querySelector('.tsp-comparison-item:has(.tsp-brute-distance)');
                        newBruteItem.addEventListener('mouseenter', () => redrawComparison('brute'));
                        newBruteItem.addEventListener('mouseleave', () => redrawComparison());
                        newBruteItem.style.cursor = 'pointer';
                    }

                    redrawComparison();
                    this.updateHistoryDisplay(true);
                    setUIComplete(this.uiElements);
                },
                callbackFrequency
            );

            this.progressValue.innerHTML = `0 / ${formatNumber(this.solver.totalRoutes)}`;
            this.bestValue.textContent = '-';
            this.elapsedValue.textContent = '0 s';
            this.remainingValue.textContent = '...';

            await new Promise(resolve => setTimeout(resolve, 0));
            await this.solver.start();
        }
    }

    // -------------------------------------------------------------------------
    // Plugin entry point
    // -------------------------------------------------------------------------

    function processTSP() {
        document.querySelectorAll('.markdown-section tsp').forEach(el => {
            new TSPWidget(el);
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
