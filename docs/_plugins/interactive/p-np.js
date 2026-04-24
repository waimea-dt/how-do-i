/**
 * docsify-p-np.js - P, NP, and NP-Complete Complexity Class Visualizer
 *
 * Interactive visualization demonstrating:
 *   - P (Polynomial Time): Problems solvable efficiently
 *   - NP (Nondeterministic Polynomial): Solutions verifiable efficiently
 *   - NP-Complete: Hardest problems in NP
 *   - Verification vs Solving time comparison
 *   - Real-world problem examples in each category
 *
 * Usage in markdown:
 *   <p-np></p-np>
 *   <p-np mode="venn"></p-np>
 *   <p-np mode="verify"></p-np>
 *   <p-np mode="problems"></p-np>
 *   <p-np collapse="true"></p-np>
 *
 * Attributes:
 *   - mode: Visualization mode (default: venn)
 *     - venn: Venn diagram showing P ⊆ NP with NP-Complete boundary
 *     - verify: Verification vs solving comparison for specific problems
 *     - problems: Interactive problem cards to explore examples
 *   - collapse: Show P=NP collapsed view (default: false)
 */

;(function () {

    // -------------------------------------------------------------------------
    // Configuration & Problem Database
    // -------------------------------------------------------------------------

    const PROBLEMS = {
        p: [
            {
                id: 'sorting',
                name: 'Sorting',
                description: 'Sort a list of N numbers',
                solveTime: 'O(N log N)',
                verifyTime: 'O(N)',
                example: 'Merge Sort, Quick Sort',
                icon: '↕️'
            },
            {
                id: 'binary-search',
                name: 'Binary Search',
                description: 'Find an item in a sorted list',
                solveTime: 'O(log N)',
                verifyTime: 'O(1)',
                example: 'Searching in phone book',
                icon: '🔍'
            },
            {
                id: 'linear-search',
                name: 'Linear Search',
                description: 'Scan list from start until target is found',
                solveTime: 'O(N)',
                verifyTime: 'O(1)',
                example: 'Finding a name in an unsorted list',
                icon: '🔎'
            },
            {
                id: 'shortest-path',
                name: 'Shortest Path',
                description: 'Find shortest route between two nodes',
                solveTime: 'O(N²)',
                verifyTime: 'O(N)',
                example: 'Dijkstra\'s Algorithm',
                icon: '🗺️'
            },
            {
                id: 'matrix-mult',
                name: 'Matrix Multiplication',
                description: 'Multiply two N×N matrices',
                solveTime: 'O(N³)',
                verifyTime: 'O(N²)',
                example: 'Graphics transformations',
                icon: '⊗'
            },
            {
                id: 'palindrome',
                name: 'Palindrome Check',
                description: 'Check if string reads same forwards/backwards',
                solveTime: 'O(N)',
                verifyTime: 'O(N)',
                example: 'racecar, level',
                icon: '↔️'
            }
        ],
        np: [
            {
                id: 'factoring',
                name: 'Factorisation by Division',
                description: 'Naive trial division to find a non-trivial factor',
                solveTime: 'O(√N) by value',
                verifyTime: 'O(log N)',
                example: 'Try 2, 3, 4... until a divisor is found',
                icon: '🔢'
            }
        ],
        npComplete: [
            {
                id: 'tsp',
                name: 'Travelling Salesman',
                description: 'Find shortest route visiting all cities',
                solveTime: 'O((N-1)!)',
                verifyTime: 'O(N)',
                example: 'Delivery route optimization',
                icon: '🚚'
            },
            {
                id: 'knapsack',
                name: '0/1 Knapsack',
                description: 'Select items to maximize value within weight limit',
                solveTime: 'O(2ⁿ)',
                verifyTime: 'O(N)',
                example: 'Cargo loading',
                icon: '🎒'
            },
            {
                id: 'graph-colouring',
                name: 'Graph Colouring',
                description: 'Colour graph nodes so adjacent nodes differ',
                solveTime: 'O(Kⁿ)',
                verifyTime: 'O(N²)',
                example: 'Timetable scheduling',
                icon: '🎨'
            },
            {
                id: 'bin-packing',
                name: 'Bin Packing',
                description: 'Pack items into minimum number of bins',
                solveTime: 'O(2ⁿ)',
                verifyTime: 'O(N)',
                example: 'Shipping container allocation',
                icon: '📦'
            }
        ]
    };

    // -------------------------------------------------------------------------
    // P-NP Visualizer Component
    // -------------------------------------------------------------------------

    class PNPVisualizer {
        constructor(element, mode, collapse) {
            this.element = element;
            this.mode = mode || 'venn';
            this.collapse = collapse === 'true' || collapse === true;
            this.selectedProblem = null;
            this.init();
        }

        init() {
            this.render();
            this.attachEventListeners();
        }

        render() {
            const wrapper = document.createElement('div');
            wrapper.className = 'pnp-wrapper';

            // Header
            const header = this.renderHeader();
            wrapper.appendChild(header);

            // Content based on mode
            const content = document.createElement('div');
            content.className = 'pnp-content';

            if (this.mode === 'venn') {
                content.appendChild(this.renderVennDiagram());
            } else if (this.mode === 'verify') {
                content.appendChild(this.renderVerificationComparison());
            } else if (this.mode === 'problems') {
                content.appendChild(this.renderProblemsExplorer());
            }

            wrapper.appendChild(content);
            this.element.appendChild(wrapper);
        }

        renderHeader() {
            const header = document.createElement('div');
            header.className = 'pnp-header';

            const title = document.createElement('h3');
            title.className = 'pnp-title';
            title.textContent = 'P, NP, and NP-Complete';

            const subtitle = document.createElement('p');
            subtitle.className = 'pnp-subtitle';

            if (this.mode === 'venn') {
                subtitle.textContent = 'Exploring computational complexity classes';
            } else if (this.mode === 'verify') {
                subtitle.textContent = 'Verification vs Solving: The key distinction';
            } else if (this.mode === 'problems') {
                subtitle.textContent = 'Real-world problems in each complexity class';
            }

            header.appendChild(title);
            header.appendChild(subtitle);

            return header;
        }

        renderVennDiagram() {
            const container = document.createElement('div');
            container.className = 'pnp-venn-container';

            const wrapper = document.createElement('div');
            wrapper.className = 'pnp-venn-wrapper';

            // Canvas for Venn diagram
            const canvas = document.createElement('canvas');
            canvas.className = 'pnp-venn-canvas';
            canvas.width = 500;
            canvas.height = 800;

            wrapper.appendChild(canvas);
            container.appendChild(wrapper);

            // Draw Venn diagram
            requestAnimationFrame(() => this.drawVennDiagram(canvas));

            // Mode toggle
            const controls = document.createElement('div');
            controls.className = 'pnp-controls';

            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'pnp-btn pnp-btn-toggle';
            toggleBtn.textContent = this.collapse ? 'Show P ≠ NP (standard view)' : 'Show P = NP (collapsed view)';
            toggleBtn.addEventListener('click', () => {
                this.collapse = !this.collapse;
                this.element.innerHTML = '';
                this.render();
                this.attachEventListeners();
            });
            controls.appendChild(toggleBtn);

            // Legend
            const legend = document.createElement('div');
            legend.className = 'pnp-legend';
            legend.innerHTML = `
                <div class="pnp-legend-item">
                    <span class="pnp-legend-color pnp-legend-p"></span>
                    <span><strong>P</strong> - Polynomial Time (efficient to solve)</span>
                </div>
                <div class="pnp-legend-item">
                    <span class="pnp-legend-color pnp-legend-np"></span>
                    <span><strong>NP</strong> - Nondeterministic Polynomial (efficient to verify)</span>
                </div>
                <div class="pnp-legend-item">
                    <span class="pnp-legend-color pnp-legend-npc"></span>
                    <span><strong>NP-Complete</strong> - Hardest problems in NP</span>
                </div>
                <div class="pnp-legend-item">
                    <span class="pnp-legend-color pnp-legend-nph"></span>
                    <span><strong>NP-Hard</strong> - At least as hard as NP-Complete (may be outside NP)</span>
                </div>
            `;
            controls.appendChild(legend);

            container.appendChild(controls);

            // Explanation
            const explanation = document.createElement('div');
            explanation.className = 'pnp-explanation';
            explanation.innerHTML = this.collapse
                ? `<p><strong>P = NP collapsed view:</strong> If P = NP, all problems that can be verified quickly can also be solved quickly. This would revolutionize cryptography, optimization, and many other fields—but it's probably not true!</p>`
                : `<p><strong>The million-dollar question:</strong> Does P = NP? We know P ⊆ NP (every problem we can solve quickly, we can verify quickly). Also, <strong>NP-Complete = NP ∩ NP-Hard</strong>, shown as the overlap region. Most computer scientists believe P ≠ NP.</p>`;
            container.appendChild(explanation);

            return container;
        }

        drawVennDiagram(canvas) {
            const ctx = canvas.getContext('2d');
            const w = canvas.width;
            const h = canvas.height;

            // Get CSS colors
            const styles = getComputedStyle(this.element);
            const colorP = styles.getPropertyValue('--pnp-color-p').trim() || '#4CAF50';
            const colorNP = styles.getPropertyValue('--pnp-color-np').trim() || '#2196F3';
            const colorNPC = styles.getPropertyValue('--pnp-color-npc').trim() || '#F44336';
            const colorNPH = styles.getPropertyValue('--pnp-color-nph').trim() || '#607D8B';
            const colorBg = styles.getPropertyValue('--pnp-bg-canvas').trim() || '#000';
            const colorText = styles.getPropertyValue('--color-text').trim() || '#eee';

            // Clear canvas
            ctx.fillStyle = colorBg;
            ctx.fillRect(0, 0, w, h);

            if (this.collapse) {
                // P = NP view: NP/P circle overlaps with NP-Hard; overlap is NP-Complete
                const npCx = 300;
                const npCy = 250;
                const npR = 175;
                const hardCx = 510;
                const hardCy = 250;
                const hardR = 190;

                // NP-Hard
                ctx.fillStyle = colorNPH + '24';
                ctx.strokeStyle = colorNPH;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(hardCx, hardCy, hardR, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                // NP (= P)
                ctx.fillStyle = colorP + '40';
                ctx.strokeStyle = colorP;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(npCx, npCy, npR, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                // NP-Complete overlap region
                ctx.save();
                ctx.beginPath();
                ctx.arc(npCx, npCy, npR, 0, Math.PI * 2);
                ctx.clip();
                ctx.beginPath();
                ctx.arc(hardCx, hardCy, hardR, 0, Math.PI * 2);
                ctx.fillStyle = colorNPC + '55';
                ctx.fill();
                ctx.restore();

                // Labels
                ctx.fillStyle = colorText;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                ctx.font = 'bold 30px system-ui, sans-serif';
                ctx.fillText('P = NP', npCx - 20, npCy);

                ctx.font = 'bold 30px system-ui, sans-serif';
                ctx.fillText('NP-Hard', hardCx + 70, hardCy - 120);

                ctx.fillStyle = colorNPC;
                ctx.font = 'bold 15px system-ui, sans-serif';
                ctx.fillText('NP-Complete', 430, 250);

            } else {
                // Standard view: NP and NP-Hard overlap, NP-Complete is the overlap region
                const hardCx = 250;
                const hardCy = 250;
                const hardR = 240;
                const npCx = 250;
                const npCy = 550;
                const npR = 240;
                const pCx = 250;
                const pCy = 650;
                const pR = 120;

                // NP
                ctx.fillStyle = colorNP + '26';
                ctx.strokeStyle = colorNP;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(npCx, npCy, npR, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                // NP-Hard
                ctx.fillStyle = colorNPH + '24';
                ctx.strokeStyle = colorNPH;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(hardCx, hardCy, hardR, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                // NP-Complete overlap region = NP ∩ NP-Hard
                ctx.save();
                ctx.beginPath();
                ctx.arc(npCx, npCy, npR, 0, Math.PI * 2);
                ctx.clip();
                ctx.beginPath();
                ctx.arc(hardCx, hardCy, hardR, 0, Math.PI * 2);
                ctx.fillStyle = colorNPC + '55';
                ctx.fill();
                ctx.restore();

                // P region inside NP
                ctx.fillStyle = colorP + '40';
                ctx.strokeStyle = colorP;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(pCx, pCy, pR, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                // Labels
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                ctx.fillStyle = colorText;
                ctx.font = 'bold 30px system-ui, sans-serif';
                ctx.fillText('NP', npCx - 160, npCy);
                ctx.fillText('P', pCx, pCy);
                ctx.fillText('NP-Hard', hardCx, hardCy - 80);
                ctx.fillText('NP-Complete', npCx, npCy - 140);
            }
        }

        renderVerificationComparison() {
            const container = document.createElement('div');
            container.className = 'pnp-verify-container';

            // Problem selector
            const selector = document.createElement('div');
            selector.className = 'pnp-problem-selector';

            const label = document.createElement('label');
            label.textContent = 'Select a problem:';
            label.className = 'pnp-label';

            const select = document.createElement('select');
            select.className = 'pnp-select';

            // Add P problems
            const pGroup = document.createElement('optgroup');
            pGroup.label = 'P (Polynomial Time)';
            PROBLEMS.p.forEach(p => {
                const option = document.createElement('option');
                option.value = `p-${p.id}`;
                option.textContent = `${p.icon} ${p.name}`;
                pGroup.appendChild(option);
            });
            select.appendChild(pGroup);

            // Add NP-Complete problems
            const npGroup = document.createElement('optgroup');
            npGroup.label = 'NP';
            PROBLEMS.np.forEach(p => {
                const option = document.createElement('option');
                option.value = `np-${p.id}`;
                option.textContent = `${p.icon} ${p.name}`;
                npGroup.appendChild(option);
            });
            select.appendChild(npGroup);

            // Add NP-Complete problems
            const npcGroup = document.createElement('optgroup');
            npcGroup.label = 'NP-Complete';
            PROBLEMS.npComplete.forEach(p => {
                const option = document.createElement('option');
                option.value = `npc-${p.id}`;
                option.textContent = `${p.icon} ${p.name}`;
                npcGroup.appendChild(option);
            });
            select.appendChild(npcGroup);

            select.value = 'npc-tsp'; // Default to TSP
            selector.appendChild(label);
            selector.appendChild(select);
            container.appendChild(selector);

            // Comparison display
            const comparison = document.createElement('div');
            comparison.className = 'pnp-comparison';
            container.appendChild(comparison);

            const updateComparison = () => {
                const [type, id] = select.value.split('-');
                const problemList = type === 'p'
                    ? PROBLEMS.p
                    : (type === 'np' ? PROBLEMS.np : PROBLEMS.npComplete);
                const problem = problemList.find(p => p.id === id);
                const solvingClass = type === 'p'
                    ? 'pnp-solving-poly'
                    : (type === 'np' ? 'pnp-solving-unknown' : 'pnp-solving-exp');
                const solvingNote = type === 'p'
                    ? '✓ <strong>Polynomial time</strong> - efficient for large inputs'
                    : (type === 'np'
                        ? '⚠ <strong>No known polynomial-time</strong> - may still be hard in practice'
                        : '⏰ <strong>Exponential time</strong> - impractical for large inputs');

                if (problem) {
                    comparison.innerHTML = `
                        <div class="pnp-problem-details">
                            <h4>${problem.icon} ${problem.name}</h4>
                            <p class="pnp-description">${problem.description}</p>
                        </div>
                        <div class="pnp-comparison-grid">
                            <div class="pnp-comparison-card pnp-solving ${solvingClass}">
                                <h5>⚙️ Solving</h5>
                                <div class="pnp-time-badge">${problem.solveTime}</div>
                                <p>Finding the solution from scratch</p>
                                <p class="pnp-note">${solvingNote}</p>
                            </div>
                            <div class="pnp-comparison-card pnp-verifying">
                                <h5>✓ Verifying</h5>
                                <div class="pnp-time-badge">${problem.verifyTime}</div>
                                <p>Checking if a given solution is correct</p>
                                <p class="pnp-note">✓ <strong>Polynomial time</strong> - always fast</p>
                            </div>
                        </div>
                        <div class="pnp-example">
                            <strong>Example:</strong> ${problem.example}
                        </div>
                    `;
                }
            };

            select.addEventListener('change', updateComparison);
            updateComparison(); // Initial render

            // Key insight box
            const insight = document.createElement('div');
            insight.className = 'pnp-insight';
            insight.innerHTML = `
                <h4>🔑 Key Insight</h4>
                <p>For <strong>NP-Complete</strong> problems: verifying a solution is <em>much faster</em> than finding it!</p>
                <p>For <strong>P</strong> problems: solving is already fast (though verification is often even faster).</p>
                <p>For some <strong>NP</strong> problems like factorisation: verification is fast, but we do not know a polynomial-time classical solving algorithm.</p>
                <p>This is why NP problems are so interesting—we can check answers quickly but can't find them quickly (unless P = NP).</p>
            `;
            container.appendChild(insight);

            return container;
        }

        renderProblemsExplorer() {
            const container = document.createElement('div');
            container.className = 'pnp-problems-container';

            // Tabs for different complexity classes
            const tabs = document.createElement('div');
            tabs.className = 'pnp-tabs';

            const tabButtons = [
                { id: 'p', label: 'P Problems', color: 'p' },
                { id: 'np', label: 'NP Problems', color: 'np' },
                { id: 'npc', label: 'NP-Complete', color: 'npc' }
            ];

            const tabContent = document.createElement('div');
            tabContent.className = 'pnp-tab-content';

            const showTab = (tabId) => {
                // Update button states
                tabs.querySelectorAll('.pnp-tab-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.tab === tabId);
                });

                // Render content
                tabContent.innerHTML = '';
                let problemList;
                if (tabId === 'p') {
                    problemList = PROBLEMS.p;
                } else if (tabId === 'np') {
                    problemList = PROBLEMS.np;
                } else {
                    problemList = PROBLEMS.npComplete;
                }

                const grid = document.createElement('div');
                grid.className = 'pnp-problems-grid';

                problemList.forEach(problem => {
                    const card = this.createProblemCard(problem, tabId);
                    grid.appendChild(card);
                });

                tabContent.appendChild(grid);
            };

            tabButtons.forEach(tab => {
                const btn = document.createElement('button');
                btn.className = `pnp-tab-btn pnp-tab-${tab.color}`;
                btn.textContent = tab.label;
                btn.dataset.tab = tab.id;
                btn.addEventListener('click', () => showTab(tab.id));
                tabs.appendChild(btn);
            });

            container.appendChild(tabs);
            container.appendChild(tabContent);

            // Show first tab by default
            showTab('p');

            return container;
        }

        createProblemCard(problem, type) {
            const card = document.createElement('div');
            card.className = `pnp-problem-card pnp-problem-${type}`;

            card.innerHTML = `
                <div class="pnp-problem-icon">${problem.icon}</div>
                <h5 class="pnp-problem-name">${problem.name}</h5>
                <p class="pnp-problem-description">${problem.description}</p>
                <div class="pnp-problem-complexity">
                    <div class="pnp-complexity-item">
                        <span class="pnp-complexity-label">Solve:</span>
                        <code>${problem.solveTime}</code>
                    </div>
                    <div class="pnp-complexity-item">
                        <span class="pnp-complexity-label">Verify:</span>
                        <code>${problem.verifyTime}</code>
                    </div>
                </div>
                <div class="pnp-problem-example">
                    <strong>Example:</strong> ${problem.example}
                </div>
            `;

            return card;
        }

        attachEventListeners() {
            // Any additional event listeners if needed
        }
    }

    // -------------------------------------------------------------------------
    // Docsify Plugin Registration
    // -------------------------------------------------------------------------

    function pnpPlugin(hook, vm) {
        hook.afterEach(function (html, next) {
            next(html);
        });

        hook.doneEach(function () {
            const pnpElements = document.querySelectorAll('p-np');
            pnpElements.forEach(element => {
                if (!element.dataset.initialized) {
                    const mode = element.getAttribute('mode') || 'venn';
                    const collapse = element.getAttribute('collapse') || 'false';
                    new PNPVisualizer(element, mode, collapse);
                    element.dataset.initialized = 'true';
                }
            });
        });
    }

    // Register plugin
    if (window.$docsify) {
        window.$docsify.plugins = [].concat(pnpPlugin, window.$docsify.plugins || []);
    }

})();
