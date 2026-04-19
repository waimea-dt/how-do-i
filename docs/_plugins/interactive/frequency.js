/**
 * docsify-frequency.js — Text frequency analysis visualizer
 *
 * Analyzes letter frequency in text with interactive bar chart visualization
 * displaying case-insensitive letter counts with alphabetical or frequency-based sorting.
 *
 * Usage in markdown:
 *   <frequency>Your text here</frequency>
 *   <frequency sort="az">Text to analyze</frequency>
 *   <frequency sort="freq">Most common letters first</frequency>
 *
 * Attributes:
 *   - sort: Sort order for the bar chart (default: az)
 *     - az: Alphabetical order (A-Z)
 *     - freq: Frequency order (high to low)
 *
 * Reusable API (available globally):
 *   window.FrequencyChart.analyze(text)
 *     - Returns { frequencies, total, unique, maxCount }
 *   window.FrequencyChart.generateChartHTML(text, sortMode = 'az')
 *     - Returns HTML string for the frequency chart
 *
 * Customization:
 *   Override --frequency-accent CSS variable to change bar/count colors
 *   Default: var(--theme-color)
 */

;(function () {

    // -------------------------------------------------------------------------
    // Configuration
    // -------------------------------------------------------------------------

    const DEFAULT_SORT = 'az';
    const LETTER_REGEX = /[a-z]/gi;

    // -------------------------------------------------------------------------
    // Frequency Analyzer
    // -------------------------------------------------------------------------

    class FrequencyAnalyzer {
        constructor(text) {
            this.text = text;
            this.frequencies = {};
            this.total = 0;
            this.analyze();
        }

        analyze() {
            // Reset
            this.frequencies = {};
            this.total = 0;

            // Count letters (case-insensitive)
            const letters = this.text.match(LETTER_REGEX) || [];
            letters.forEach(letter => {
                const lowerLetter = letter.toLowerCase();
                this.frequencies[lowerLetter] = (this.frequencies[lowerLetter] || 0) + 1;
                this.total++;
            });
        }

        getSortedData(sortMode) {
            // Create array of all letters a-z with counts
            const data = [];
            for (let i = 0; i < 26; i++) {
                const letter = String.fromCharCode(97 + i); // 'a' = 97
                const count = this.frequencies[letter] || 0;
                data.push({ letter: letter.toUpperCase(), count: count });
            }

            // Sort based on mode
            if (sortMode === 'freq') {
                // Sort by frequency (high to low), then alphabetically as tiebreaker
                data.sort((a, b) => {
                    if (b.count !== a.count) {
                        return b.count - a.count;
                    }
                    return a.letter.localeCompare(b.letter);
                });
            }
            // 'az' mode is already sorted

            return data;
        }

        getMaxCount() {
            return Math.max(...Object.values(this.frequencies), 1);
        }
    }

    // -------------------------------------------------------------------------
    // Reusable Chart Generation Functions
    // -------------------------------------------------------------------------

    /**
     * Generate HTML for a frequency chart
     * @param {string} text - Text to analyze
     * @param {string} sortMode - 'az' or 'freq'
     * @returns {string} HTML string for the chart
     */
    function generateChartHTML(text, sortMode = 'az') {
        const analyzer = new FrequencyAnalyzer(text);
        const data = analyzer.getSortedData(sortMode);
        const maxCount = analyzer.getMaxCount();

        let chartHTML = '';
        data.forEach(item => {
            const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
            const hasCount = item.count > 0;

            chartHTML += `
                <div class="frequency-bar-container ${hasCount ? 'has-count' : ''}">
                    <div class="frequency-bar-track">
                        <div class="frequency-bar-count">${item.count}</div>
                        <div class="frequency-bar-fill" style="height: ${percentage}%"></div>
                    </div>
                    <div class="frequency-bar-label">${item.letter}</div>
                </div>
            `;
        });

        return chartHTML;
    }

    /**
     * Analyze text and return frequency data
     * @param {string} text - Text to analyze
     * @returns {object} Analysis results { frequencies, total, unique, maxCount }
     */
    function analyzeText(text) {
        const analyzer = new FrequencyAnalyzer(text);
        return {
            frequencies: analyzer.frequencies,
            total: analyzer.total,
            unique: Object.keys(analyzer.frequencies).length,
            maxCount: analyzer.getMaxCount()
        };
    }

    // -------------------------------------------------------------------------
    // Export to Global Scope
    // -------------------------------------------------------------------------

    window.FrequencyChart = {
        analyze: analyzeText,
        generateChartHTML: generateChartHTML,
        FrequencyAnalyzer: FrequencyAnalyzer
    };

    // -------------------------------------------------------------------------
    // Frequency Visualizer
    // -------------------------------------------------------------------------

    class FrequencyVisualizer {
        constructor(container, initialText, initialSort) {
            this.container = container;
            this.currentSort = initialSort || DEFAULT_SORT;
            this.analyzer = new FrequencyAnalyzer(initialText);

            this.render();
            this.attachEventListeners();
            this.updateChart();
        }

        render() {
            // Clear the container first
            this.container.innerHTML = '';

            // Create wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'frequency-wrapper';
            wrapper.innerHTML = `
                <div class="frequency-header">
                    <h3 class="frequency-title">Letter Frequency Analysis</h3>
                    <p class="frequency-subtitle">Counting the number of times each letter appears in a block of text.</p>
                </div>
                <div class="frequency-content">
                    <div class="frequency-input-section">
                        <textarea class="frequency-textarea" rows="8" placeholder="Enter text to analyze...">${this.analyzer.text}</textarea>
                        <div class="frequency-stats">
                            <div class="frequency-stat">
                                <span class="frequency-stat-label">Total Letters:</span>
                                <span class="frequency-stat-value frequency-total">0</span>
                            </div>
                            <div class="frequency-stat">
                                <span class="frequency-stat-label">Unique Letters:</span>
                                <span class="frequency-stat-value frequency-unique">0</span>
                            </div>
                        </div>
                    </div>
                    <div class="frequency-chart">
                        <div class="frequency-bars"></div>
                        <div class="frequency-controls">
                            <label class="frequency-toggle">
                                <span class="frequency-toggle-label">Sort:</span>
                                <button class="frequency-toggle-btn frequency-sort-az ${this.currentSort === 'az' ? 'active' : ''}" data-sort="az">A-Z</button>
                                <button class="frequency-toggle-btn frequency-sort-freq ${this.currentSort === 'freq' ? 'active' : ''}" data-sort="freq">Frequency</button>
                            </label>
                        </div>
                    </div>
                </div>
            `;

            // Append wrapper to container
            this.container.appendChild(wrapper);
        }

        attachEventListeners() {
            // Text input
            const textarea = this.container.querySelector('.frequency-textarea');
            textarea.addEventListener('input', (e) => {
                this.analyzer = new FrequencyAnalyzer(e.target.value);
                this.updateChart();
            });

            // Sort buttons
            const sortButtons = this.container.querySelectorAll('.frequency-toggle-btn');
            sortButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const newSort = e.target.dataset.sort;
                    if (newSort !== this.currentSort) {
                        this.currentSort = newSort;
                        sortButtons.forEach(b => b.classList.remove('active'));
                        e.target.classList.add('active');
                        this.updateChart();
                    }
                });
            });
        }

        updateChart() {
            const chartContainer = this.container.querySelector('.frequency-bars');

            // Update stats
            this.container.querySelector('.frequency-total').textContent = this.analyzer.total;
            this.container.querySelector('.frequency-unique').textContent =
                Object.keys(this.analyzer.frequencies).length;

            // Use the reusable chart generator
            chartContainer.innerHTML = generateChartHTML(this.analyzer.text, this.currentSort);
        }
    }

    // -------------------------------------------------------------------------
    // Plugin Registration
    // -------------------------------------------------------------------------

    // Store frequency element data before markdown processing
    const frequencyData = new Map();
    let elementCounter = 0;

    function preprocessMarkdown(content) {
        // Match <frequency> elements and extract their content
        return content.replace(/<frequency([^>]*)>([\s\S]*?)<\/frequency>/g, (match, attrs, text) => {
            const id = `frequency-placeholder-${elementCounter++}`;
            frequencyData.set(id, {
                text: text.trim(),
                attrs: attrs.trim()
            });
            // Replace with a placeholder that won't be affected by markdown parsing
            return `<frequency data-id="${id}"${attrs}></frequency>`;
        });
    }

    function processFrequency() {
        document.querySelectorAll('.markdown-section frequency:not(.frequency-initialized)').forEach(el => {
            el.classList.add('frequency-initialized');

            // Get text from stored data if available, otherwise from element
            const dataId = el.getAttribute('data-id');
            let text = '';
            if (dataId && frequencyData.has(dataId)) {
                text = frequencyData.get(dataId).text;
                frequencyData.delete(dataId); // Clean up
            } else {
                text = el.textContent.trim();
            }

            const sort = el.getAttribute('sort') || DEFAULT_SORT;
            new FrequencyVisualizer(el, text, sort);
        });
    }

    // -------------------------------------------------------------------------
    // Docsify Plugin Export
    // -------------------------------------------------------------------------

    var docsifyFrequency = function (hook) {
        hook.beforeEach(preprocessMarkdown);
        hook.doneEach(processFrequency);
    };

    window.$docsify = window.$docsify || {};
    window.$docsify.plugins = [].concat(docsifyFrequency, window.$docsify.plugins || []);

})();
