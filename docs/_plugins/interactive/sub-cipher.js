/**
 * docsify-sub-cipher.js - Interactive substitution cipher visualizer
 *
 * Visualizes Caesar and Vigenère ciphers with instant cursor-based highlighting.
 * Supports bidirectional encryption/decryption with live updates and frequency analysis.
 *
 * Usage in markdown:
 *   <sub-cipher>HELLO WORLD</sub-cipher>
 *   <sub-cipher scheme="caesar" key="3">ATTACK AT DAWN</sub-cipher>
 *   <sub-cipher scheme="vigenere" key="SECRET">MESSAGE</sub-cipher>
 *   <sub-cipher scheme="caesar" key="13" frequency>ROT13 EXAMPLE</sub-cipher>
 *   <sub-cipher scheme="caesar" key="-3" decrypt>DWWDFN DW GDZQ</sub-cipher>
 *
 * Attributes:
 *   - scheme: "caesar" (default) or "vigenere"
 *   - key: Shift amount for Caesar (e.g., "3") or keystream for Vigenère (e.g., "SECRET")
 *   - frequency: If present, show letter frequency charts for plaintext and ciphertext
 *   - decrypt: If present, the top box/row is relabelled "Ciphertext" (green) and the
 *     bottom box/row "Plaintext" (blue). The text in the tag still fills the top box and
 *     the key is still applied top-to-bottom as normal - only the labels/colours flip.
 *
 * Features:
 *   - Instant grid highlighting based on cursor position in text inputs
 *   - Vigenère cipher shows full keystream with highlighted active character
 *   - Supports negative shifts for Caesar cipher (-26 to +26)
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
    // Cipher Logic
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
     * Caesar cipher encryption
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
     * Caesar cipher decryption
     */
    function caesarDecrypt(ciphertext, shift) {
        shift = parseInt(shift) || 0;
        return caesarEncrypt(ciphertext, -shift);
    }

    /**
     * Vigenère cipher encryption
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
     * Vigenère cipher decryption
     */
    function vigenereDecrypt(ciphertext, keystream) {
        keystream = sanitizeText(keystream).replace(/ /g, ''); // Remove spaces from keystream
        if (!keystream) keystream = 'A';

        let keyPos = 0;
        return ciphertext.split('').map((char) => {
            if (char === ' ') return ' '; // Preserve spaces, don't advance key position
            const charIndex = letterToIndex(char);
            const keyIndex = letterToIndex(keystream[keyPos % keystream.length]);
            keyPos++;
            return indexToLetter(charIndex - keyIndex);
        }).join('');
    }

    // -------------------------------------------------------------------------
    // Substitution Cipher State
    // -------------------------------------------------------------------------

    class SubCipherState {
        constructor(scheme, key, plaintext, showFrequency, isDecrypt) {
            this.scheme = scheme || 'caesar';
            this.key = key || (this.scheme === 'caesar' ? DEFAULT_CAESAR_KEY : DEFAULT_VIGENERE_KEY);
            this.plaintext = sanitizeText(plaintext || '');
            this.ciphertext = '';
            this.showFrequency = showFrequency;
            this.isDecrypt = isDecrypt;
            this.plaintextSort = 'az'; // Sort mode for plaintext frequency chart
            this.ciphertextSort = 'az'; // Sort mode for ciphertext frequency chart
            this.updateCiphertext();
        }

        updateCiphertext() {
            if (this.scheme === 'caesar') {
                this.ciphertext = caesarEncrypt(this.plaintext, this.key);
            } else {
                // Vigenère keystream letters are encrypt shifts; decrypt mode needs them negated.
                this.ciphertext = this.isDecrypt ? vigenereDecrypt(this.plaintext, this.key) : vigenereEncrypt(this.plaintext, this.key);
            }
        }

        updatePlaintext() {
            if (this.scheme === 'caesar') {
                this.plaintext = caesarDecrypt(this.ciphertext, this.key);
            } else {
                this.plaintext = this.isDecrypt ? vigenereEncrypt(this.ciphertext, this.key) : vigenereDecrypt(this.ciphertext, this.key);
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
                const shift = letterToIndex(keyChar);
                return this.isDecrypt ? -shift : shift;
            }
        }
    }

    // -------------------------------------------------------------------------
    // Substitution Grid Generator
    // -------------------------------------------------------------------------

    /**
     * Generate Caesar substitution grid (2 rows: top row always the identity alphabet,
     * bottom row always shifted by the key. In decrypt mode only the labels/colours flip.)
     */
    function generateCaesarGrid(shift, isDecrypt) {
        shift = parseInt(shift) || 0;
        shift = ((shift % 26) + 26) % 26; // Normalize to 0-25

        const topLabel = isDecrypt ? 'Cipher:' : 'Plain:';
        const bottomLabel = isDecrypt ? 'Plain:' : 'Cipher:';
        const swapClass = isDecrypt ? ' sub-cipher-grid-row-swapped' : '';

        let topRow = `<div class="sub-cipher-grid-row sub-cipher-grid-row-header${swapClass}">`;
        topRow += `<div class="sub-cipher-grid-label">${topLabel}</div>`;
        for (let i = 0; i < 26; i++) {
            topRow += `<div class="sub-cipher-grid-cell" data-plain="${ALPHABET[i]}">${ALPHABET[i]}</div>`;
        }
        topRow += '</div>';

        let bottomRow = `<div class="sub-cipher-grid-row sub-cipher-grid-row-cipher${swapClass}">`;
        bottomRow += `<div class="sub-cipher-grid-label">${bottomLabel}</div>`;
        for (let i = 0; i < 26; i++) {
            const cipherIndex = ((i + shift) % 26 + 26) % 26;
            bottomRow += `<div class="sub-cipher-grid-cell" data-cipher="${ALPHABET[cipherIndex]}" data-plain="${ALPHABET[i]}">${ALPHABET[cipherIndex]}</div>`;
        }
        bottomRow += '</div>';

        return `<div class="sub-cipher-grid sub-cipher-grid-caesar">${topRow}${bottomRow}</div>`;
    }

    /**
     * Generate Vigenère substitution grid showing full keystream with highlighted active char
     */
    function generateVigenereGrid(keystream, currentPosition = 0, isDecrypt) {
        keystream = sanitizeText(keystream).replace(/ /g, '');
        if (!keystream) keystream = 'A';

        const activeKeyIndex = currentPosition % keystream.length;
        const currentKeyChar = keystream[activeKeyIndex];
        // Keystream letters are encrypt shifts; decrypt mode applies them negated.
        const rawShift = letterToIndex(currentKeyChar);
        const currentShift = isDecrypt ? -rawShift : rawShift;

        let gridHTML = '<div class="sub-cipher-grid sub-cipher-grid-vigenere">';

        // Show full keystream with highlighted active character
        gridHTML += '<div class="sub-cipher-grid-header">';
        gridHTML += '<div class="sub-cipher-grid-keystream">';
        gridHTML += '<span class="sub-cipher-grid-keystream-label">Keystream: </span>';
        for (let i = 0; i < keystream.length; i++) {
            const isActive = i === activeKeyIndex;
            gridHTML += `<span class="sub-cipher-grid-keystream-char${isActive ? ' sub-cipher-grid-keystream-char-active' : ''}">${keystream[i]}</span>`;
        }
        gridHTML += `<span class="sub-cipher-grid-keystream-shift">(shift ${currentShift})</span>`;
        gridHTML += '</div>';
        gridHTML += '</div>';

        const topLabel = isDecrypt ? 'Cipher:' : 'Plain:';
        const bottomLabel = isDecrypt ? 'Plain:' : 'Cipher:';
        const swapClass = isDecrypt ? ' sub-cipher-grid-row-swapped' : '';

        let topRow = `<div class="sub-cipher-grid-row sub-cipher-grid-row-header${swapClass}">`;
        topRow += `<div class="sub-cipher-grid-label">${topLabel}</div>`;
        for (let i = 0; i < 26; i++) {
            topRow += `<div class="sub-cipher-grid-cell" data-plain="${ALPHABET[i]}">${ALPHABET[i]}</div>`;
        }
        topRow += '</div>';

        let bottomRow = `<div class="sub-cipher-grid-row sub-cipher-grid-row-cipher${swapClass}">`;
        bottomRow += `<div class="sub-cipher-grid-label">${bottomLabel}</div>`;
        for (let i = 0; i < 26; i++) {
            const cipherIndex = ((i + currentShift) % 26 + 26) % 26;
            bottomRow += `<div class="sub-cipher-grid-cell" data-cipher="${ALPHABET[cipherIndex]}" data-plain="${ALPHABET[i]}">${ALPHABET[cipherIndex]}</div>`;
        }
        bottomRow += '</div>';

        gridHTML += topRow + bottomRow;

        gridHTML += '</div>';
        return gridHTML;
    }

    // -------------------------------------------------------------------------
    // Substitution Cipher Visualizer
    // -------------------------------------------------------------------------

    class SubCipherVisualizer {
        constructor(container, scheme, key, plaintext, showFrequency, isDecrypt) {
            this.container = container;
            this.state = new SubCipherState(scheme, key, plaintext, showFrequency, isDecrypt);
            this.currentCursorPosition = 0;
            this.isDecrypt = isDecrypt;

            this.render();
            this.attachEventListeners();
            this.updateGrid();
            this.updateFrequencyCharts();
        }

        render() {
            this.container.innerHTML = '';

            const wrapper = document.createElement('div');
            wrapper.className = 'sub-cipher-wrapper';

            const schemeTitle = this.state.scheme === 'caesar' ? 'Caesar Cipher' : 'Vigenère Cipher';
            const titleHTML = this.isDecrypt
                ? `${schemeTitle} <span class="sub-cipher-title-decrypt">Decrypt</span>`
                : schemeTitle;

            // Decrypt mode only swaps the labels/colours - the top box always holds the tag's text
            const topLabel = this.isDecrypt ? 'Ciphertext' : 'Plaintext';
            const bottomLabel = this.isDecrypt ? 'Plaintext' : 'Ciphertext';
            const swapClass = this.isDecrypt ? ' sub-cipher-role-swapped' : '';

            const plaintextBlock = `
                <div class="sub-cipher-io">
                    <div class="sub-cipher-input-section">
                        <label class="sub-cipher-section-title">${topLabel}</label>
                        <textarea class="sub-cipher-textarea sub-cipher-plaintext${swapClass}" placeholder="Enter ${topLabel.toLowerCase()}...">${this.state.plaintext}</textarea>
                    </div>

                    ${this.state.showFrequency ? `
                        <div class="sub-cipher-frequency-chart">
                            <div class="sub-cipher-frequency-plaintext${swapClass}"></div>
                        </div>
                    ` : ''}
                </div>`;

            const ciphertextBlock = `
                <div class="sub-cipher-io">
                    <div class="sub-cipher-input-section">
                        <label class="sub-cipher-section-title">${bottomLabel}</label>
                        <textarea class="sub-cipher-textarea sub-cipher-ciphertext${swapClass}" placeholder="${bottomLabel} will appear here...">${this.state.ciphertext}</textarea>
                    </div>

                    ${this.state.showFrequency ? `
                        <div class="sub-cipher-frequency-chart">
                            <div class="sub-cipher-frequency-ciphertext${swapClass}"></div>
                        </div>
                    ` : ''}
                </div>`;

            wrapper.innerHTML = `
                <div class="sub-cipher-header">
                    <div class="sub-cipher-header-text">
                        <h3 class="sub-cipher-title">${titleHTML}</h3>
                        <p class="sub-cipher-subtitle">Interactive substitution cipher with ${this.state.scheme === 'caesar' ? 'simple shift' : 'repeating keystream'}</p>
                    </div>
                    <div class="sub-cipher-controls">
                        <div class="sub-cipher-control-group">
                            <label class="sub-cipher-label">
                                ${this.state.scheme === 'caesar' ? 'Shift:' : 'Keystream:'}
                            </label>
                            ${this.state.scheme === 'caesar'
                                ? `<input type="number" class="sub-cipher-key-input sub-cipher-key-number" value="${this.state.key}" min="-26" max="26" />`
                                : `<input type="text" class="sub-cipher-key-input sub-cipher-key-text" value="${this.state.key}" placeholder="Enter key..." />`
                            }
                        </div>
                    </div>
                </div>
                <div class="sub-cipher-content">
                    ${plaintextBlock}

                    <div class="sub-cipher-grid-container">
                        <h4 class="sub-cipher-section-title">Substitution Grid</h4>
                        <div class="sub-cipher-grid-wrapper"></div>
                    </div>

                    ${ciphertextBlock}
                </div>
            `;

            this.container.appendChild(wrapper);
        }

        attachEventListeners() {
            // Plaintext input
            const plaintextArea = this.container.querySelector('.sub-cipher-plaintext');
            plaintextArea.addEventListener('input', (e) => {
                const cursorPos = e.target.selectionStart;
                const newText = sanitizeText(e.target.value);
                e.target.value = newText;
                this.state.plaintext = newText;
                this.state.updateCiphertext();
                this.updateCiphertext();
                this.updateFrequencyCharts();
                this.updateHighlighting(cursorPos, 'plaintext');
            });

            plaintextArea.addEventListener('click', (e) => {
                this.updateHighlighting(e.target.selectionStart, 'plaintext');
            });

            plaintextArea.addEventListener('keyup', (e) => {
                this.updateHighlighting(e.target.selectionStart, 'plaintext');
            });

            // Ciphertext input
            const ciphertextArea = this.container.querySelector('.sub-cipher-ciphertext');
            ciphertextArea.addEventListener('input', (e) => {
                const cursorPos = e.target.selectionStart;
                const newText = sanitizeText(e.target.value);
                e.target.value = newText;
                this.state.ciphertext = newText;
                this.state.updatePlaintext();
                this.updatePlaintext();
                this.updateFrequencyCharts();
                this.updateHighlighting(cursorPos, 'ciphertext');
            });

            ciphertextArea.addEventListener('click', (e) => {
                this.updateHighlighting(e.target.selectionStart, 'ciphertext');
            });

            ciphertextArea.addEventListener('keyup', (e) => {
                this.updateHighlighting(e.target.selectionStart, 'ciphertext');
            });

            // Key input
            const keyInput = this.container.querySelector('.sub-cipher-key-input');
            keyInput.addEventListener('input', (e) => {
                if (this.state.scheme === 'caesar') {
                    this.state.key = parseInt(e.target.value) || 0;
                } else {
                    const sanitized = sanitizeText(e.target.value);
                    e.target.value = sanitized;
                    this.state.key = sanitized || 'A';
                }
                this.state.updateCiphertext();
                this.updateCiphertext();
                this.updateGrid();
                this.updateFrequencyCharts();
                this.updateHighlighting(this.currentCursorPosition);
            });
        }

        updatePlaintext() {
            const plaintextArea = this.container.querySelector('.sub-cipher-plaintext');
            plaintextArea.value = this.state.plaintext;
        }

        updateCiphertext() {
            const ciphertextArea = this.container.querySelector('.sub-cipher-ciphertext');
            ciphertextArea.value = this.state.ciphertext;
        }

        updateGrid() {
            const gridWrapper = this.container.querySelector('.sub-cipher-grid-wrapper');
            if (this.state.scheme === 'caesar') {
                gridWrapper.innerHTML = generateCaesarGrid(this.state.key, this.isDecrypt);
            } else {
                const keyPos = this.state.getKeyPositionForTextIndex(this.currentCursorPosition);
                gridWrapper.innerHTML = generateVigenereGrid(this.state.key, keyPos, this.isDecrypt);
            }
        }

        updateFrequencyCharts() {
            if (!this.state.showFrequency || !window.FrequencyChart) return;

            const plaintextContainer = this.container.querySelector('.sub-cipher-frequency-plaintext');
            const ciphertextContainer = this.container.querySelector('.sub-cipher-frequency-ciphertext');

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

            if (ciphertextContainer) {
                window.FrequencyChart.renderChart(
                    ciphertextContainer,
                    this.state.ciphertext,
                    this.state.ciphertextSort,
                    150,
                    (newSort) => {
                        this.state.ciphertextSort = newSort;
                        this.updateFrequencyCharts();
                    }
                );
            }
        }

        updateHighlighting(cursorPos, source = 'plaintext') {
            this.currentCursorPosition = Math.max(0, cursorPos - 1);

            // Clear previous highlights
            this.clearHighlights();

            const text = source === 'plaintext' ? this.state.plaintext : this.state.ciphertext;
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
            const ciphertextChar = source === 'ciphertext' ? char : this.state.ciphertext[this.currentCursorPosition];

            const gridCells = this.container.querySelectorAll('.sub-cipher-grid-cell');
            gridCells.forEach(cell => {
                const plain = cell.getAttribute('data-plain');
                const cipher = cell.getAttribute('data-cipher');

                if (plain === plaintextChar || cipher === ciphertextChar) {
                    cell.classList.add('sub-cipher-grid-cell-highlight');
                }
            });
        }

        clearHighlights() {
            const gridCells = this.container.querySelectorAll('.sub-cipher-grid-cell');
            gridCells.forEach(cell => {
                cell.classList.remove('sub-cipher-grid-cell-highlight');
            });
        }
    }

    // -------------------------------------------------------------------------
    // Plugin Registration
    // -------------------------------------------------------------------------

    const subCipherData = new Map();
    let elementCounter = 0;

    function preprocessMarkdown(content) {
        return content.replace(/<sub-cipher([^>]*)>([\s\S]*?)<\/sub-cipher>/g, (match, attrs, text) => {
            const id = `sub-cipher-placeholder-${elementCounter++}`;
            subCipherData.set(id, {
                text: text.trim(),
                attrs: attrs.trim()
            });
            return `<sub-cipher data-id="${id}"${attrs}></sub-cipher>`;
        });
    }

    function processSubCipher() {
        document.querySelectorAll('.markdown-section sub-cipher:not(.sub-cipher-initialized)').forEach(el => {
            el.classList.add('sub-cipher-initialized');

            // Get text from stored data if available
            const dataId = el.getAttribute('data-id');
            let text = '';
            if (dataId && subCipherData.has(dataId)) {
                text = subCipherData.get(dataId).text;
                subCipherData.delete(dataId);
            } else {
                text = el.textContent.trim();
            }

            const scheme = el.getAttribute('scheme') || 'caesar';
            const key = el.getAttribute('key') || (scheme === 'caesar' ? DEFAULT_CAESAR_KEY : DEFAULT_VIGENERE_KEY);
            const showFrequency = el.hasAttribute('frequency');
            const isDecrypt = el.hasAttribute('decrypt');

            new SubCipherVisualizer(el, scheme, key, text, showFrequency, isDecrypt);
        });
    }

    // -------------------------------------------------------------------------
    // Docsify Plugin Export
    // -------------------------------------------------------------------------

    var docsifySubCipher = function (hook) {
        hook.beforeEach(preprocessMarkdown);
        hook.doneEach(processSubCipher);
    };

    window.DocsifyUtils.registerPlugin(docsifySubCipher)

})();
