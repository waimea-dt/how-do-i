/**
 * docsify-sub-cypher.js — Interactive substitution cypher visualizer
 *
 * Visualizes Caesar and Vigenere cyphers with instant cursor-based highlighting.
 * Supports bidirectional encryption/decryption with live updates and frequency analysis.
 *
 * Usage in markdown:
 *   <sub-cypher>HELLO WORLD</sub-cypher>
 *   <sub-cypher scheme="caesar" key="3">ATTACK AT DAWN</sub-cypher>
 *   <sub-cypher scheme="vigenere" key="SECRET">MESSAGE</sub-cypher>
 *   <sub-cypher scheme="caesar" key="13" frequency>ROT13 EXAMPLE</sub-cypher>
 *
 * Attributes:
 *   - scheme: "caesar" (default) or "vigenere"
 *   - key: Shift amount for Caesar (e.g., "3") or keystream for Vigenere (e.g., "SECRET")
 *   - frequency: If present, show letter frequency charts for plaintext and cyphertext
 *
 * Features:
 *   - Instant grid highlighting based on cursor position in text inputs
 *   - Vigenere cypher shows full keystream with highlighted active character
 *   - Supports negative shifts for Caesar cypher (-26 to +26)
 *
 * Text is uppercase letters and spaces only. Other punctuation is removed.
 */

;(function () {

    // -------------------------------------------------------------------------
    // Constants
    // -------------------------------------------------------------------------
    const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const DEFAULT_CAESAR_KEY = 3;
    const DEFAULT_VIGENERE_KEY = 'KEY';

    // -------------------------------------------------------------------------
    // Cypher Logic
    // -------------------------------------------------------------------------

    /**
     * Sanitize text to uppercase letters and spaces only
     */
    function sanitizeText(text) {
        return text.toUpperCase().replace(/[^A-Z ]/g, '');
    }

    /**
     * Get letter index (A=0, B=1, ..., Z=25)
     */
    function letterToIndex(letter) {
        return letter.charCodeAt(0) - 65;
    }

    /**
     * Get letter from index
     */
    function indexToLetter(index) {
        return ALPHABET[((index % 26) + 26) % 26];
    }

    /**
     * Caesar cypher encryption
     */
    function caesarEncrypt(plaintext, shift) {
        shift = parseInt(shift) || 0;
        return plaintext.split('').map(char => {
            if (char === ' ') return ' '; // Preserve spaces
            const index = letterToIndex(char);
            return indexToLetter(index + shift);
        }).join('');
    }

    /**
     * Caesar cypher decryption
     */
    function caesarDecrypt(cyphertext, shift) {
        shift = parseInt(shift) || 0;
        return caesarEncrypt(cyphertext, -shift);
    }

    /**
     * Vigenere cypher encryption
     */
    function vigenereEncrypt(plaintext, keystream) {
        keystream = sanitizeText(keystream).replace(/ /g, ''); // Remove spaces from keystream
        if (!keystream) keystream = 'A';

        let keyPos = 0;
        return plaintext.split('').map((char) => {
            if (char === ' ') return ' '; // Preserve spaces, don't advance key position
            const charIndex = letterToIndex(char);
            const keyIndex = letterToIndex(keystream[keyPos % keystream.length]);
            keyPos++;
            return indexToLetter(charIndex + keyIndex);
        }).join('');
    }

    /**
     * Vigenere cypher decryption
     */
    function vigenereDecrypt(cyphertext, keystream) {
        keystream = sanitizeText(keystream).replace(/ /g, ''); // Remove spaces from keystream
        if (!keystream) keystream = 'A';

        let keyPos = 0;
        return cyphertext.split('').map((char) => {
            if (char === ' ') return ' '; // Preserve spaces, don't advance key position
            const charIndex = letterToIndex(char);
            const keyIndex = letterToIndex(keystream[keyPos % keystream.length]);
            keyPos++;
            return indexToLetter(charIndex - keyIndex);
        }).join('');
    }

    // -------------------------------------------------------------------------
    // Substitution Cypher State
    // -------------------------------------------------------------------------

    class SubCypherState {
        constructor(scheme, key, plaintext, showFrequency) {
            this.scheme = scheme || 'caesar';
            this.key = key || (this.scheme === 'caesar' ? DEFAULT_CAESAR_KEY : DEFAULT_VIGENERE_KEY);
            this.plaintext = sanitizeText(plaintext || '');
            this.cyphertext = '';
            this.showFrequency = showFrequency;
            this.plaintextSort = 'az'; // Sort mode for plaintext frequency chart
            this.cyphertextSort = 'az'; // Sort mode for cyphertext frequency chart
            this.updateCyphertext();
        }

        updateCyphertext() {
            if (this.scheme === 'caesar') {
                this.cyphertext = caesarEncrypt(this.plaintext, this.key);
            } else {
                this.cyphertext = vigenereEncrypt(this.plaintext, this.key);
            }
        }

        updatePlaintext() {
            if (this.scheme === 'caesar') {
                this.plaintext = caesarDecrypt(this.cyphertext, this.key);
            } else {
                this.plaintext = vigenereDecrypt(this.cyphertext, this.key);
            }
        }

        getKeyPositionForTextIndex(textIndex) {
            // Convert text index to key position (skipping spaces)
            let keyPos = 0;
            for (let i = 0; i < textIndex && i < this.plaintext.length; i++) {
                if (this.plaintext[i] !== ' ') {
                    keyPos++;
                }
            }
            return keyPos;
        }

        getShiftForPosition(position) {
            if (this.scheme === 'caesar') {
                return parseInt(this.key) || 0;
            } else {
                const keystream = sanitizeText(this.key).replace(/ /g, '');
                if (!keystream) return 0;
                const keyChar = keystream[position % keystream.length];
                return letterToIndex(keyChar);
            }
        }
    }

    // -------------------------------------------------------------------------
    // Substitution Grid Generator
    // -------------------------------------------------------------------------

    /**
     * Generate Caesar substitution grid (2 rows: plaintext and cyphertext)
     */
    function generateCaesarGrid(shift) {
        shift = parseInt(shift) || 0;
        shift = ((shift % 26) + 26) % 26; // Normalize to 0-25

        let gridHTML = '<div class="sub-cypher-grid sub-cypher-grid-caesar">';

        // Header row (plaintext)
        gridHTML += '<div class="sub-cypher-grid-row sub-cypher-grid-row-header">';
        gridHTML += '<div class="sub-cypher-grid-label">Plain:</div>';
        for (let i = 0; i < 26; i++) {
            gridHTML += `<div class="sub-cypher-grid-cell" data-plain="${ALPHABET[i]}">${ALPHABET[i]}</div>`;
        }
        gridHTML += '</div>';

        // Cyphertext row
        gridHTML += '<div class="sub-cypher-grid-row sub-cypher-grid-row-cypher">';
        gridHTML += '<div class="sub-cypher-grid-label">Cypher:</div>';
        for (let i = 0; i < 26; i++) {
            const cypherIndex = ((i + shift) % 26 + 26) % 26;
            gridHTML += `<div class="sub-cypher-grid-cell" data-cypher="${ALPHABET[cypherIndex]}" data-plain="${ALPHABET[i]}">${ALPHABET[cypherIndex]}</div>`;
        }
        gridHTML += '</div>';

        gridHTML += '</div>';
        return gridHTML;
    }

    /**
     * Generate Vigenere substitution grid showing full keystream with highlighted active char
     */
    function generateVigenereGrid(keystream, currentPosition = 0) {
        keystream = sanitizeText(keystream).replace(/ /g, '');
        if (!keystream) keystream = 'A';

        const activeKeyIndex = currentPosition % keystream.length;
        const currentKeyChar = keystream[activeKeyIndex];
        const currentShift = letterToIndex(currentKeyChar);

        let gridHTML = '<div class="sub-cypher-grid sub-cypher-grid-vigenere">';

        // Show full keystream with highlighted active character
        gridHTML += '<div class="sub-cypher-grid-header">';
        gridHTML += '<div class="sub-cypher-grid-keystream">';
        gridHTML += '<span class="sub-cypher-grid-keystream-label">Keystream: </span>';
        for (let i = 0; i < keystream.length; i++) {
            const isActive = i === activeKeyIndex;
            gridHTML += `<span class="sub-cypher-grid-keystream-char${isActive ? ' sub-cypher-grid-keystream-char-active' : ''}">${keystream[i]}</span>`;
        }
        gridHTML += `<span class="sub-cypher-grid-keystream-shift">(shift ${currentShift})</span>`;
        gridHTML += '</div>';
        gridHTML += '</div>';

        // Header row (plaintext)
        gridHTML += '<div class="sub-cypher-grid-row sub-cypher-grid-row-header">';
        gridHTML += '<div class="sub-cypher-grid-label">Plain:</div>';
        for (let i = 0; i < 26; i++) {
            gridHTML += `<div class="sub-cypher-grid-cell" data-plain="${ALPHABET[i]}">${ALPHABET[i]}</div>`;
        }
        gridHTML += '</div>';

        // Current key row
        gridHTML += '<div class="sub-cypher-grid-row sub-cypher-grid-row-cypher">';
        gridHTML += '<div class="sub-cypher-grid-label">Cypher:</div>';
        for (let i = 0; i < 26; i++) {
            const cypherIndex = (i + currentShift) % 26;
            gridHTML += `<div class="sub-cypher-grid-cell" data-cypher="${ALPHABET[cypherIndex]}" data-plain="${ALPHABET[i]}">${ALPHABET[cypherIndex]}</div>`;
        }
        gridHTML += '</div>';

        gridHTML += '</div>';
        return gridHTML;
    }

    // -------------------------------------------------------------------------
    // Substitution Cypher Visualizer
    // -------------------------------------------------------------------------

    class SubCypherVisualizer {
        constructor(container, scheme, key, plaintext, showFrequency) {
            this.container = container;
            this.state = new SubCypherState(scheme, key, plaintext, showFrequency);
            this.currentCursorPosition = 0;

            this.render();
            this.attachEventListeners();
            this.updateGrid();
            this.updateFrequencyCharts();
        }

        render() {
            this.container.innerHTML = '';

            const wrapper = document.createElement('div');
            wrapper.className = 'sub-cypher-wrapper';

            const schemeTitle = this.state.scheme === 'caesar' ? 'Caesar Cypher' : 'Vigenère Cypher';

            wrapper.innerHTML = `
                <div class="sub-cypher-header">
                    <div class="sub-cypher-header-text">
                        <h3 class="sub-cypher-title">${schemeTitle}</h3>
                        <p class="sub-cypher-subtitle">Interactive substitution cypher with ${this.state.scheme === 'caesar' ? 'fixed shift' : 'repeating keystream'}</p>
                    </div>
                    <div class="sub-cypher-controls">
                        <div class="sub-cypher-control-group">
                            <label class="sub-cypher-label">
                                ${this.state.scheme === 'caesar' ? 'Shift:' : 'Keystream:'}
                            </label>
                            ${this.state.scheme === 'caesar'
                                ? `<input type="number" class="sub-cypher-key-input sub-cypher-key-number" value="${this.state.key}" min="-26" max="26" />`
                                : `<input type="text" class="sub-cypher-key-input sub-cypher-key-text" value="${this.state.key}" placeholder="Enter key..." />`
                            }
                        </div>
                    </div>
                </div>
                <div class="sub-cypher-content">
                    <div class="sub-cypher-io">
                        <div class="sub-cypher-input-section">
                            <label class="sub-cypher-section-title">Plaintext</label>
                            <textarea class="sub-cypher-textarea sub-cypher-plaintext" placeholder="Enter plaintext...">${this.state.plaintext}</textarea>
                        </div>

                        ${this.state.showFrequency ? `
                            <div class="sub-cypher-frequency-chart">
                                <div class="sub-cypher-frequency-plaintext"></div>
                            </div>
                        ` : ''}
                    </div>

                    <div class="sub-cypher-grid-container">
                        <h4 class="sub-cypher-section-title">Substitution Grid</h4>
                        <div class="sub-cypher-grid-wrapper"></div>
                    </div>

                    <div class="sub-cypher-io">
                        <div class="sub-cypher-input-section">
                            <label class="sub-cypher-section-title">Cyphertext</label>
                            <textarea class="sub-cypher-textarea sub-cypher-cyphertext" placeholder="Cyphertext will appear here...">${this.state.cyphertext}</textarea>
                        </div>

                        ${this.state.showFrequency ? `
                            <div class="sub-cypher-frequency-chart">
                                <div class="sub-cypher-frequency-cyphertext"></div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;

            this.container.appendChild(wrapper);
        }

        attachEventListeners() {
            // Plaintext input
            const plaintextArea = this.container.querySelector('.sub-cypher-plaintext');
            plaintextArea.addEventListener('input', (e) => {
                const cursorPos = e.target.selectionStart;
                const newText = sanitizeText(e.target.value);
                e.target.value = newText;
                this.state.plaintext = newText;
                this.state.updateCyphertext();
                this.updateCyphertext();
                this.updateFrequencyCharts();
                this.updateHighlighting(cursorPos, 'plaintext');
            });

            plaintextArea.addEventListener('click', (e) => {
                this.updateHighlighting(e.target.selectionStart, 'plaintext');
            });

            plaintextArea.addEventListener('keyup', (e) => {
                this.updateHighlighting(e.target.selectionStart, 'plaintext');
            });

            // Cyphertext input
            const cyphertextArea = this.container.querySelector('.sub-cypher-cyphertext');
            cyphertextArea.addEventListener('input', (e) => {
                const cursorPos = e.target.selectionStart;
                const newText = sanitizeText(e.target.value);
                e.target.value = newText;
                this.state.cyphertext = newText;
                this.state.updatePlaintext();
                this.updatePlaintext();
                this.updateFrequencyCharts();
                this.updateHighlighting(cursorPos, 'cyphertext');
            });

            cyphertextArea.addEventListener('click', (e) => {
                this.updateHighlighting(e.target.selectionStart, 'cyphertext');
            });

            cyphertextArea.addEventListener('keyup', (e) => {
                this.updateHighlighting(e.target.selectionStart, 'cyphertext');
            });

            // Key input
            const keyInput = this.container.querySelector('.sub-cypher-key-input');
            keyInput.addEventListener('input', (e) => {
                if (this.state.scheme === 'caesar') {
                    this.state.key = parseInt(e.target.value) || 0;
                } else {
                    const sanitized = sanitizeText(e.target.value);
                    e.target.value = sanitized;
                    this.state.key = sanitized || 'A';
                }
                this.state.updateCyphertext();
                this.updateCyphertext();
                this.updateGrid();
                this.updateFrequencyCharts();
                this.updateHighlighting(this.currentCursorPosition);
            });
        }

        updatePlaintext() {
            const plaintextArea = this.container.querySelector('.sub-cypher-plaintext');
            plaintextArea.value = this.state.plaintext;
        }

        updateCyphertext() {
            const cyphertextArea = this.container.querySelector('.sub-cypher-cyphertext');
            cyphertextArea.value = this.state.cyphertext;
        }

        updateGrid() {
            const gridWrapper = this.container.querySelector('.sub-cypher-grid-wrapper');
            if (this.state.scheme === 'caesar') {
                gridWrapper.innerHTML = generateCaesarGrid(this.state.key);
            } else {
                const keyPos = this.state.getKeyPositionForTextIndex(this.currentCursorPosition);
                gridWrapper.innerHTML = generateVigenereGrid(this.state.key, keyPos);
            }
        }

        updateFrequencyCharts() {
            if (!this.state.showFrequency || !window.FrequencyChart) return;

            const plaintextContainer = this.container.querySelector('.sub-cypher-frequency-plaintext');
            const cyphertextContainer = this.container.querySelector('.sub-cypher-frequency-cyphertext');

            if (plaintextContainer) {
                window.FrequencyChart.renderChart(
                    plaintextContainer,
                    this.state.plaintext,
                    this.state.plaintextSort,
                    150,
                    (newSort) => {
                        this.state.plaintextSort = newSort;
                        this.updateFrequencyCharts();
                    }
                );
            }

            if (cyphertextContainer) {
                window.FrequencyChart.renderChart(
                    cyphertextContainer,
                    this.state.cyphertext,
                    this.state.cyphertextSort,
                    150,
                    (newSort) => {
                        this.state.cyphertextSort = newSort;
                        this.updateFrequencyCharts();
                    }
                );
            }
        }

        updateHighlighting(cursorPos, source = 'plaintext') {
            this.currentCursorPosition = Math.max(0, cursorPos - 1);

            // Clear previous highlights
            this.clearHighlights();

            const text = source === 'plaintext' ? this.state.plaintext : this.state.cyphertext;
            if (!text || this.currentCursorPosition < 0 || this.currentCursorPosition >= text.length) {
                return;
            }

            const char = text[this.currentCursorPosition];
            if (char === ' ') return; // Don't highlight spaces

            // Update grid for vigenere to show correct keystream position
            if (this.state.scheme === 'vigenere') {
                this.updateGrid();
            }

            // Highlight the corresponding character in the grid
            const plaintextChar = source === 'plaintext' ? char : this.state.plaintext[this.currentCursorPosition];
            const cyphertextChar = source === 'cyphertext' ? char : this.state.cyphertext[this.currentCursorPosition];

            const gridCells = this.container.querySelectorAll('.sub-cypher-grid-cell');
            gridCells.forEach(cell => {
                const plain = cell.getAttribute('data-plain');
                const cypher = cell.getAttribute('data-cypher');

                if (plain === plaintextChar || cypher === cyphertextChar) {
                    cell.classList.add('sub-cypher-grid-cell-highlight');
                }
            });
        }

        clearHighlights() {
            const gridCells = this.container.querySelectorAll('.sub-cypher-grid-cell');
            gridCells.forEach(cell => {
                cell.classList.remove('sub-cypher-grid-cell-highlight');
            });
        }
    }

    // -------------------------------------------------------------------------
    // Plugin Registration
    // -------------------------------------------------------------------------

    const subCypherData = new Map();
    let elementCounter = 0;

    function preprocessMarkdown(content) {
        return content.replace(/<sub-cypher([^>]*)>([\s\S]*?)<\/sub-cypher>/g, (match, attrs, text) => {
            const id = `sub-cypher-placeholder-${elementCounter++}`;
            subCypherData.set(id, {
                text: text.trim(),
                attrs: attrs.trim()
            });
            return `<sub-cypher data-id="${id}"${attrs}></sub-cypher>`;
        });
    }

    function processSubCypher() {
        document.querySelectorAll('.markdown-section sub-cypher:not(.sub-cypher-initialized)').forEach(el => {
            el.classList.add('sub-cypher-initialized');

            // Get text from stored data if available
            const dataId = el.getAttribute('data-id');
            let text = '';
            if (dataId && subCypherData.has(dataId)) {
                text = subCypherData.get(dataId).text;
                subCypherData.delete(dataId);
            } else {
                text = el.textContent.trim();
            }

            const scheme = el.getAttribute('scheme') || 'caesar';
            const key = el.getAttribute('key') || (scheme === 'caesar' ? DEFAULT_CAESAR_KEY : DEFAULT_VIGENERE_KEY);
            const showFrequency = el.hasAttribute('frequency');

            new SubCypherVisualizer(el, scheme, key, text, showFrequency);
        });
    }

    // -------------------------------------------------------------------------
    // Docsify Plugin Export
    // -------------------------------------------------------------------------

    var docsifySubCypher = function (hook) {
        hook.beforeEach(preprocessMarkdown);
        hook.doneEach(processSubCypher);
    };

    window.$docsify = window.$docsify || {};
    window.$docsify.plugins = [].concat(docsifySubCypher, window.$docsify.plugins || []);

})();
