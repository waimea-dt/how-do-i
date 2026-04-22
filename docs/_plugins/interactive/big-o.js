/**
 * docsify-big-o.js - Interactive Big-O algorithm complexity explorer
 *
 * Helps students understand:
 *   - Comparative complexity of real-world algorithms
 *   - How different approaches to the same problem scale differently
 *   - The practical impact of Big-O on algorithm selection
 *
 * Usage in markdown:
 *   <big-o></big-o>
 *   <big-o max="20"></big-o>
 *   <big-o algos="search-linear search-binary sort-bubble" enabled="search-linear"></big-o>
 *   <big-o algos="search sort"></big-o>  <!-- Use category IDs -->
 *   <big-o step="5" max="50"></big-o>
 *   <big-o step="x2" max="1024"></big-o>
 *   <big-o best-worst></big-o>
 *
 * Attributes:
 *   - max: Maximum n shown in the table (default: 20, range: 10–1024)
 *   - algos: Space-separated list of algorithm IDs or category IDs to show (default: all)
 *            Category IDs: array, stack, search, sort, graph, tsp, knap, pack, crypt
 *   - enabled: Space-separated list of algorithm IDs initially enabled (default: search-linear search-binary)
 *   - step: How N increases - number for increment, 'x2'/'x5'/'x10' for multiplication (default: 1)
 *   - best-worst: Show best, average, and worst case complexity columns (default: off)
 */

;(function () {

    // -------------------------------------------------------------------------
    // Algorithm definitions
    // -------------------------------------------------------------------------

    const ALGORITHMS = [
        // Basic - Data Structures
        {
            id: 'array-access',
            name: 'Array: Access by Index',
            category: 'array',
            complexity: 'O(1)',
            fn: n => 1,
            complexityBest: 'O(1)',
            fnBest: n => 1,  // always same
            complexityAvg: 'O(1)',
            fnAvg: n => 1,  // always same
        },
        {
            id: 'array-insert',
            name: 'Array: Insert at Index',
            category: 'array',
            complexity: 'O(n)',
            fn: n => n,  // worst case: insert at start
            complexityBest: 'O(1)',
            fnBest: n => 1,  // insert at end
            complexityAvg: 'O(n/2) → O(n)',
            fnAvg: n => n / 2,  // insert at middle
        },
        {
            id: 'array-sorted',
            name: 'Array: Check if Sorted',
            category: 'array',
            complexity: 'O(n)',
            fn: n => n,  // worst case: fully sorted or last pair wrong
            complexityBest: 'O(1)',
            fnBest: n => 1,  // first two elements wrong
            complexityAvg: 'O(n<em>/2</em>)',
            fnAvg: n => n / 2,  // error in middle
        },
        {
            id: 'array-minmax',
            name: 'Array: Find Min/Max',
            category: 'array',
            complexity: 'O(n)',
            fn: n => n,  // must check every element
            complexityBest: 'O(n)',
            fnBest: n => n,  // always same
            complexityAvg: 'O(n)',
            fnAvg: n => n,  // always same
        },
        {
            id: 'stack-op',
            name: 'Stack: Push/Pop',
            category: 'stack',
            complexity: 'O(1)',
            fn: n => 1,
        },

        // Basic - Searching
        {
            id: 'search-linear',
            name: 'Linear Search',
            category: 'search',
            complexity: 'O(n)',
            fn: n => n,  // worst case
            complexityBest: 'O(1)',
            fnBest: n => 1,
            complexityAvg: 'O(n<em>/2</em>)',
            fnAvg: n => n / 2,
        },
        {
            id: 'search-binary',
            name: 'Binary Search',
            category: 'search',
            complexity: 'O(log n)',
            fn: n => Math.log2(n),  // worst case
            complexityBest: 'O(1)',
            fnBest: n => 1,
            complexityAvg: 'O(log n)',
            fnAvg: n => Math.log2(n),
        },

        // Basic - Sorting
        {
            id: 'sort-bubble',
            name: 'Bubble Sort',
            category: 'sort',
            complexity: 'O(n<sup>2</sup>)',
            fn: n => n * n,  // worst case: fully reversed
            complexityBest: 'O(n)',
            fnBest: n => n,  // already sorted: one pass
            complexityAvg: 'O(n<sup>2</sup><em>/2</em>)',
            fnAvg: n => (n * n) / 2,  // average: ~half of worst
        },
        {
            id: 'sort-merge',
            name: 'Merge Sort',
            category: 'sort',
            complexity: 'O(n log n)',
            fn: n => n * Math.log2(n),  // worst case
            complexityBest: 'O(n log n)',
            fnBest: n => n * Math.log2(n),
            complexityAvg: 'O(n log n)',
            fnAvg: n => n * Math.log2(n),
        },
        {
            id: 'sort-insert',
            name: 'Insertion Sort',
            category: 'sort',
            complexity: 'O(n<sup>2</sup>)',
            fn: n => n * n,  // worst case: fully reversed
            complexityBest: 'O(n)',
            fnBest: n => n,  // already sorted: just comparisons
            complexityAvg: 'O(n<sup>2</sup><em>/2</em>)',
            fnAvg: n => (n * n) / 2,  // average: ~half of worst
        },

        // Graph Algorithms
        {
            id: 'graph-bfs',
            name: 'Breadth-First Search (BFS)',
            category: 'graph',
            complexity: 'O(n)',
            fn: n => n,
        },
        {
            id: 'graph-dfs',
            name: 'Depth-First Search (DFS)',
            category: 'graph',
            complexity: 'O(n)',
            fn: n => n,
        },
        {
            id: 'graph-dijkstra',
            name: 'Dijkstra\'s Shortest Path',
            category: 'graph',
            complexity: 'O(n<sup>2</sup>)',
            fn: n => n * n,
            note: 'Simplification of O((V+E) log V)',
        },

        // Complex Problems - Travelling Salesman
        {
            id: 'tsp-brute',
            name: 'TSP: Brute Force',
            category: 'tsp',
            complexity: 'O(n!)',
            fn: n => {
                // Stirling's approximation for factorial
                return Math.sqrt(2 * Math.PI * n) * Math.pow(n / Math.E, n);
            },
        },
        {
            id: 'tsp-nearest',
            name: 'TSP: Nearest Neighbour',
            category: 'tsp',
            complexity: 'O(n<sup>2</sup>)',
            fn: n => n * n,
        },
        {
            id: 'tsp-2opt',
            name: 'TSP: NN with 2-Opt',
            category: 'tsp',
            complexity: 'O(n<sup>3</sup>)',
            fn: n => n * n * n,
        },

        // Complex Problems - Knapsack
        {
            id: 'knap-brute',
            name: 'Knapsack: Brute Force',
            category: 'knap',
            complexity: 'O(2<sup>n</sup>)',
            fn: n => Math.pow(2, n),
        },
        {
            id: 'knap-dynamic',
            name: 'Knapsack: Dynamic Prog.',
            category: 'knap',
            complexity: 'O(n<sup>2</sup>)',
            fn: n => n * n,
            note: 'Simplification of O(n × W)',
        },
        {
            id: 'knap-greedy',
            name: 'Knapsack: Greedy',
            category: 'knap',
            complexity: 'O(n log n)',
            fn: n => n * Math.log2(n),
        },

        // Complex Problems - Bin Packing
        {
            id: 'pack-brute',
            name: 'Bin Packing: Brute Force',
            category: 'pack',
            complexity: 'O(n!)',
            fn: n => {
                // Stirling's approximation for factorial
                return Math.sqrt(2 * Math.PI * n) * Math.pow(n / Math.E, n);
            },
            note: 'Approximation of O(n<sup>n</sup>)'
        },
        {
            id: 'pack-next-fit',
            name: 'Bin Packing: Next Fit',
            category: 'pack',
            complexity: 'O(n)',
            fn: n => n,
        },
        {
            id: 'pack-best-fit',
            name: 'Bin Packing: Best Fit',
            category: 'pack',
            complexity: 'O(n log n)',
            fn: n => n * Math.log2(n),
        },

        // Cryptography
        {
            id: 'caesar-brute',
            name: 'Caesar: Brute Force',
            category: 'crypt',
            complexity: 'O(1)',
            fn: n => 26,
            note: 'Only 26 possible shifts',
        },
        {
            id: 'vigenere-brute',
            name: 'Vigenère: Brute Force',
            category: 'crypt',
            complexity: 'O(26<sup>n</sup>)',
            fn: n => Math.pow(26, n),
            note: 'N = key length in chars',
        },
        {
            id: 'vigenere-freq',
            name: 'Vigenère: via Freq. Analysis',
            category: 'crypt',
            complexity: 'O(n)',
            fn: n => 26 * n,
            note: 'N = text length in chars',
        },
        {
            id: 'enigma-brute',
            name: 'Enigma 1939: Brute Force',
            category: 'crypt',
            complexity: 'O(2<sup>64</sup>)',
            fn: n => Math.pow(2, 64),
            note: 'Early WWII - Key space is based on selection and position of 3 rotors, and plugboards)',
            show: 64,
        },
        {
            id: 'enigma-late-brute',
            name: 'Enigma 1945: Brute Force',
            category: 'crypt',
            complexity: 'O(2<sup>88</sup>)',
            fn: n => Math.pow(2, 88),
            note: 'Late WWII - Key space is based on selection and position of 4 rotors, and plugboards)',
            show: 88,
        },
        {
            id: 'des-encrypt',
            name: 'DES: Encrypt/Decrypt',
            category: 'crypt',
            complexity: 'O(n)',
            fn: n => n,
            note: 'N = message length in blocks (legitimate use)',
        },
        {
            id: 'des-brute',
            name: 'DES: Brute Force',
            category: 'crypt',
            complexity: 'O(2<sup>56</sup>)',
            fn: n => Math.pow(2, 56),
            note: 'Fixed 56-bit key size, cracked 1998)',
            show: 56,
        },
        {
            id: 'rsa-encrypt',
            name: 'RSA: Encrypt/Decrypt',
            category: 'crypt',
            complexity: 'O(n<sup>2</sup>)',
            fn: n => n * n,
            note: 'N = key size in bits (legitimate use)',
        },
        {
            id: 'rsa-brute',
            name: 'RSA: Brute Force (via Division)',
            category: 'crypt',
            complexity: 'O(2<sup>n</sup>)',
            fn: n => Math.pow(2, n),
            note: 'N = key size in bits',
        },
        {
            id: 'rsa-gnfs',
            name: 'RSA: Brute Force (via GNFS)',
            category: 'crypt',
            complexity: 'O(2<sup>2.5×√n</sup>)',
            fn: n => Math.pow(2, 2.5 * Math.sqrt(n)),
            note: 'N = key size in bits (sub-exponential)',
        },
        {
            id: 'dh-compute',
            name: 'DH: Compute (g<sup>a</sup> mod p)',
            category: 'crypt',
            complexity: 'O(n)',
            fn: n => n,
            note: 'N = exponent size in bits (legitimate use)',
        },
        {
            id: 'dh-brute',
            name: 'DH: Brute Force (Discrete Log)',
            category: 'crypt',
            complexity: 'O(2<sup>n</sup>)',
            fn: n => Math.pow(2, n),
            note: 'N = exponent size in bits',
        },
        {
            id: 'aes-encrypt',
            name: 'AES: Encrypt/Decrypt',
            category: 'crypt',
            complexity: 'O(n)',
            fn: n => n,
            note: 'N = message length in blocks (legitimate use)',
        },
        {
            id: 'aes-brute',
            name: 'AES: Brute Force',
            category: 'crypt',
            complexity: 'O(2<sup>n</sup>)',
            fn: n => Math.pow(2, n),
            note: 'N = key size in bits',
        },
    ];

    // Categories mapping (short ID to full name)
    const CATEGORIES = [
        { id: 'array',  name: 'Arrays / Lists' },
        { id: 'stack',  name: 'Stacks' },
        { id: 'search', name: 'Searching' },
        { id: 'sort',   name: 'Sorting' },
        { id: 'graph',  name: 'Graphs' },
        { id: 'tsp',    name: 'Travelling Salesman' },
        { id: 'knap',   name: 'Knapsack' },
        { id: 'pack',   name: 'Bin Packing' },
        { id: 'crypt',  name: 'Cryptography' },
    ];

    const TRACTABLE_LIMIT = 1e20
    const NEAR_TRACTABLE_LIMIT = 1e15

    // Helper: get category name from ID
    function getCategoryName(categoryId) {
        const category = CATEGORIES.find(c => c.id === categoryId);
        return category ? category.name : categoryId;
    }

    // Group algorithms by category (preserve order)
    function getCategoriesForAlgos(algos) {
        const seen = new Set();
        const categories = [];
        for (const algo of algos) {
            if (!seen.has(algo.category)) {
                categories.push(algo.category);
                seen.add(algo.category);
            }
        }
        return categories;
    }

    // -------------------------------------------------------------------------
    // Generate N values based on step mode
    // -------------------------------------------------------------------------

    function generateNValues(maxN, stepMode) {
        const values = [];

        // Check for multiplication mode (x2, x5, x10, etc.)
        if (stepMode.startsWith('x')) {
            const multiplier = parseInt(stepMode.substring(1), 10);
            if (!isNaN(multiplier) && multiplier > 1) {
                // Multiplication: 1, multiplier, multiplier^2, ...
                for (let n = 1; n <= maxN; n *= multiplier) {
                    values.push(n);
                }
            } else {
                // Invalid multiplier, default to 1
                for (let n = 1; n <= maxN; n++) {
                    values.push(n);
                }
            }
        } else {
            // Numeric step: 1, step, 2*step, 3*step, ...
            const step = parseInt(stepMode, 10);
            if (isNaN(step) || step < 1) {
                // Default to 1 if invalid
                for (let n = 1; n <= maxN; n++) {
                    values.push(n);
                }
            } else if (step === 1) {
                // Special case: step=1 means standard sequence 1, 2, 3, 4...
                for (let n = 1; n <= maxN; n++) {
                    values.push(n);
                }
            } else {
                // step > 1: 1, step, 2*step, 3*step...
                values.push(1);
                for (let n = step; n <= maxN; n += step) {
                    values.push(n);
                }
            }
        }

        return values;
    }

    // -------------------------------------------------------------------------
    // Formatting helpers
    // -------------------------------------------------------------------------

    function fmtEffort(v) {
        if (!isFinite(v)) return '∞';
        if (v >= 1e6) return v.toExponential(1).replace('e+', '<span class="exponent">×10<sup>') + '</sup></span>';
        // if (v >= 1e27) return (v / 1e27).toFixed(0) + 'Oc';
        // if (v >= 1e24) return (v / 1e24).toFixed(0) + 'Sp';
        // if (v >= 1e21) return (v / 1e21).toFixed(0) + 'Sx';
        // if (v >= 1e18) return (v / 1e18).toFixed(0) + 'P';
        // if (v >= 1e15) return (v / 1e15).toFixed(0) + 'Q';
        // if (v >= 1e12) return (v / 1e12).toFixed(0) + 'T';
        // if (v >= 1e9)  return (v / 1e9).toFixed(0)  + 'B';
        // if (v >= 1e6)  return (v / 1e6).toFixed(0)  + 'M';
        // if (v >= 1e3)  return (v / 1e3).toFixed(0)  + 'k';
        return Math.round(v).toLocaleString();
    }

    // -------------------------------------------------------------------------
    // Build DOM
    // -------------------------------------------------------------------------

    function buildUI(maxN, enabledSet, visibleAlgos) {
        const wrapper = document.createElement('div');
        wrapper.className = 'bigo-wrapper';

        // Build category sections with algorithm toggles
        const categories = getCategoriesForAlgos(visibleAlgos);
        let categoriesHTML = '';
        for (const category of categories) {
            const algos = visibleAlgos.filter(a => a.category === category);
            const algoCardsHTML = algos.map(a => `
                <label class="bigo-algo-card${!enabledSet.has(a.id) ? ' is-disabled' : ''}" data-id="${a.id}">
                    <input type="checkbox" class="bigo-toggle" data-id="${a.id}"${enabledSet.has(a.id) ? ' checked' : ''}>
                    <div class="bigo-algo-name">${a.name}</div>
                    <div class="bigo-algo-complexity" ${a.note ? `title="${a.note}"` : ``}>
                        ${a.complexity}
                    </div>
                </label>
            `).join('');

            categoriesHTML += `
                <div class="bigo-category">
                    <h4 class="bigo-category-title">${getCategoryName(category)}</h3>
                    <div class="bigo-category-algos">${algoCardsHTML}</div>
                </div>
            `;
        }

        wrapper.innerHTML = `
            <h3 class="bigo-title">Comparison of Computational Effort</h3>
            <div class="bigo-controls">
                <div class="bigo-categories">${categoriesHTML}</div>
            </div>
            <div class="bigo-table-wrap">
                <table class="bigo-table">
                    <thead>
                        <tr class="bigo-table-header"></tr>
                    </thead>
                    <tbody class="bigo-table-body"></tbody>
                </table>
            </div>
        `;

        return wrapper;
    }

    // -------------------------------------------------------------------------
    // Render table
    // -------------------------------------------------------------------------

    function renderTable(wrapper, nValues, enabled, visibleAlgos, showBestWorst = false) {
        const headerRow = wrapper.querySelector('.bigo-table-header');
        const tbody = wrapper.querySelector('.bigo-table-body');

        // Gather enabled algorithms from visible ones
        const enabledAlgos = visibleAlgos.filter(a => enabled.has(a.id));

        // Build header (N in first column, then algorithm names)
        let headerHTML = '<th class="bigo-th-n">N</th>';
        for (const algo of enabledAlgos) {
            if (showBestWorst && algo.fnBest && algo.fnAvg) {
                // Show three sub-columns: Best, Avg, Worst
                headerHTML += `<th class="bigo-th-algo bigo-th-algo-multi" colspan="3">
                    <div class="bigo-th-algo-name">${algo.name}</div>
                    <div class="bigo-th-algo-subcols">
                        <div class="bigo-th-algo-subcol">
                            <div class="bigo-th-algo-sublabel">Best</div>
                            <div class="bigo-th-algo-complexity">${algo.complexityBest}</div>
                        </div>
                        <div class="bigo-th-algo-subcol">
                            <div class="bigo-th-algo-sublabel">Avg</div>
                            <div class="bigo-th-algo-complexity">${algo.complexityAvg}</div>
                        </div>
                        <div class="bigo-th-algo-subcol">
                            <div class="bigo-th-algo-sublabel">Worst</div>
                            <div class="bigo-th-algo-complexity">${algo.complexity}</div>
                        </div>
                    </div>
                </th>`;
            } else {
                headerHTML += `<th class="bigo-th-algo">
                    <div class="bigo-th-algo-complexity">${algo.complexity}</div>
                    <div class="bigo-th-algo-name">${algo.name}</div>
                </th>`;
            }
        }
        headerRow.innerHTML = headerHTML;

        // Build rows (one per N value)
        let rowsHTML = '';
        for (const n of nValues) {
            let cellsHTML = `<td class="bigo-td-n">${n}</td>`;

            for (const algo of enabledAlgos) {
                // If algorithm has a 'show' value, only display when N matches
                if (algo.show !== undefined && n !== algo.show) {
                    const colspan = (showBestWorst && algo.fnBest && algo.fnAvg) ? 3 : 1;
                    cellsHTML += `<td class="bigo-td-effort" colspan="${colspan}">-</td>`;
                    continue;
                }

                if (showBestWorst && algo.fnBest && algo.fnAvg) {
                    // Show three columns: Best, Avg, Worst
                    const effortBest = algo.fnBest(n);
                    const effortAvg = algo.fnAvg(n);
                    const effortWorst = algo.fn(n);  // fn is worst case

                    for (const effort of [effortBest, effortAvg, effortWorst]) {
                        const formatted = fmtEffort(effort);
                        let classes = 'bigo-td-effort';
                        if (effort >= TRACTABLE_LIMIT) {
                            classes += ' is-huge';
                        } else if (effort >= NEAR_TRACTABLE_LIMIT) {
                            classes += ' is-warning';
                        }
                        cellsHTML += `<td class="${classes}">${formatted}</td>`;
                    }
                } else {
                    // Show single column (worst case only)
                    const effort = algo.fn(n);
                    const formatted = fmtEffort(effort);
                    let classes = 'bigo-td-effort';
                    if (effort >= TRACTABLE_LIMIT) {
                        classes += ' is-huge';
                    } else if (effort >= NEAR_TRACTABLE_LIMIT) {
                        classes += ' is-warning';
                    }
                    cellsHTML += `<td class="${classes}">${formatted}</td>`;
                }
            }

            rowsHTML += `<tr class="bigo-table-row">${cellsHTML}</tr>`;
        }

        tbody.innerHTML = rowsHTML;

        // Add table data attributes for column highlighting
        if (window.processTableAttributes) {
            const table = wrapper.querySelector('.bigo-table');
            if (table) {
                window.processTableAttributes(table);
            }
        }
    }

    // -------------------------------------------------------------------------
    // Plugin entry point
    // -------------------------------------------------------------------------

    function processBigO() {
        document.querySelectorAll('.markdown-section big-o').forEach(el => {
            const rawMax = parseInt(el.getAttribute('max') ?? '20', 10);
            const maxN = Math.max(10, Math.min(1024, isNaN(rawMax) ? 20 : rawMax));

            // Parse step attribute
            const stepAttr = el.getAttribute('step');
            const stepMode = stepAttr || '1';
            const nValues = generateNValues(maxN, stepMode);

            // Parse algos attribute (which algorithms to show)
            // Supports both algorithm IDs and category IDs
            const algosAttr = el.getAttribute('algos');
            let visibleAlgos;
            if (algosAttr) {
                const tokens = algosAttr.trim().split(/\s+/);
                const algoIds = new Set();

                // Expand tokens: if it's a category ID, add all algos from that category
                tokens.forEach(token => {
                    // Check if it's a category ID
                    const category = CATEGORIES.find(c => c.id === token);
                    if (category) {
                        // Add all algorithms from this category
                        ALGORITHMS.filter(a => a.category === token)
                            .forEach(a => algoIds.add(a.id));
                    } else {
                        // Treat as algorithm ID
                        algoIds.add(token);
                    }
                });

                visibleAlgos = ALGORITHMS.filter(a => algoIds.has(a.id));
            } else {
                visibleAlgos = ALGORITHMS;
            }

            // Parse enabled attribute (which algorithms are initially enabled)
            const enabledAttr = el.getAttribute('enabled');
            let enabledIds;
            if (enabledAttr) {
                // Use specified enabled list (only those that are visible)
                enabledIds = new Set(
                    enabledAttr.trim().split(/\s+/).filter(id =>
                        visibleAlgos.some(a => a.id === id)
                    )
                );
            } else if (algosAttr) {
                // If algos specified but enabled not specified, enable all visible algos
                enabledIds = new Set(visibleAlgos.map(a => a.id));
            } else {
                // Default: enable search-linear and search-binary (if visible)
                enabledIds = new Set(
                    ['search-linear', 'search-binary'].filter(id =>
                        visibleAlgos.some(a => a.id === id)
                    )
                );
            }

            // Parse best-worst attribute
            const showBestWorst = el.hasAttribute('best-worst');

            const wrapper = buildUI(maxN, enabledIds, visibleAlgos);
            el.innerHTML = '';
            el.appendChild(wrapper);

            const toggles = wrapper.querySelectorAll('.bigo-toggle');
            const enabled = new Set(enabledIds);

            function redraw() {
                renderTable(wrapper, nValues, enabled, visibleAlgos, showBestWorst);
            }

            toggles.forEach(cb => {
                cb.addEventListener('change', () => {
                    const id = cb.dataset.id;
                    const card = wrapper.querySelector(`.bigo-algo-card[data-id="${id}"]`);
                    if (cb.checked) {
                        enabled.add(id);
                        card?.classList.remove('is-disabled');
                    } else {
                        enabled.delete(id);
                        card?.classList.add('is-disabled');
                    }
                    redraw();
                });
            });

            // Initial render
            redraw();
        });
    }

    // -------------------------------------------------------------------------
    // Docsify hook
    // -------------------------------------------------------------------------

    window.$docsify = window.$docsify ?? {};
    window.$docsify.plugins = [
        ...(window.$docsify.plugins ?? []),
        hook => {
            hook.doneEach(() => processBigO());
        },
    ];

})();
