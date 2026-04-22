/**
 * docsify-erd.js - Interactive SQLite ERD Generator
 *
 * Generates Entity-Relationship Diagrams from SQLite CREATE TABLE statements.
 * Supports live editing with CodeMirror and SVG diagram output.
 *
 * Usage in markdown:
 *   <erd>
 *   ```sql
 *   CREATE TABLE authors (
 *       author_id INTEGER PRIMARY KEY,
 *       name TEXT NOT NULL
 *   );
 *
 *   CREATE TABLE books (
 *       book_id INTEGER PRIMARY KEY,
 *       title TEXT NOT NULL,
 *       author_id INTEGER,
 *       FOREIGN KEY (author_id) REFERENCES authors (author_id)
 *   );
 *   ```
 *   </erd>
 *
 * Features:
 *   - Live SQL editing with CodeMirror
 *   - Automatic ERD generation with debounced updates
 *   - Shows table fields with types
 *   - Highlights primary keys
 *   - Displays foreign key relationships
 *   - SVG output for easy copying/screenshot
 */

;(function () {

    // -------------------------------------------------------------------------
    // Constants
    // -------------------------------------------------------------------------
    const DEBOUNCE_DELAY = 500 // ms
    const TABLE_WIDTH = 250
    const TABLE_PADDING = 10
    const ROW_HEIGHT = 28
    const HEADER_HEIGHT = 36
    const TABLE_SPACING_X = 120
    const TABLE_SPACING_Y = 40

    // -------------------------------------------------------------------------
    // SQL Parser
    // -------------------------------------------------------------------------

    /**
     * Parse CREATE TABLE statements into structured data
     */
    function parseSQLTables(sql) {
        const tables = []

        // Match CREATE TABLE statements (semicolon optional, handles nested parentheses)
        const tableRegex = /CREATE\s+TABLE\s+(\w+)\s*\(((?:[^()]|\([^)]*\))*)\)\s*;?/gi
        let match

        while ((match = tableRegex.exec(sql)) !== null) {
            const tableName = match[1]
            const tableBody = match[2]

            const table = {
                name: tableName,
                fields: [],
                primaryKeys: [],
                foreignKeys: []
            }

            // Split by comma (but not within parentheses)
            const lines = splitByComma(tableBody)

            for (const line of lines) {
                const trimmed = line.trim()

                // Check for FOREIGN KEY constraint
                const fkMatch = trimmed.match(/FOREIGN\s+KEY\s*\((\w+)\)\s*REFERENCES\s+(\w+)\s*\((\w+)\)/i)
                if (fkMatch) {
                    table.foreignKeys.push({
                        field: fkMatch[1],
                        referencesTable: fkMatch[2],
                        referencesField: fkMatch[3]
                    })
                    continue
                }

                // Check for PRIMARY KEY constraint (single or composite)
                const pkMatch = trimmed.match(/PRIMARY\s+KEY\s*\(([^)]+)\)/i)
                if (pkMatch) {
                    // Split by comma to handle composite keys
                    const pkFields = pkMatch[1].split(',').map(f => f.trim())
                    table.primaryKeys.push(...pkFields)
                    continue
                }

                // Parse field definition
                const fieldMatch = trimmed.match(/^(\w+)\s+([A-Z]+(?:\([^)]+\))?)(.*)/i)
                if (fieldMatch) {
                    const fieldName = fieldMatch[1]
                    const fieldType = fieldMatch[2]
                    const constraints = fieldMatch[3]

                    const isPrimaryKey = /PRIMARY\s+KEY/i.test(constraints)
                    const isNotNull = /NOT\s+NULL/i.test(constraints)

                    table.fields.push({
                        name: fieldName,
                        type: fieldType,
                        isPrimaryKey: isPrimaryKey,
                        isNotNull: isNotNull
                    })

                    if (isPrimaryKey && !table.primaryKeys.includes(fieldName)) {
                        table.primaryKeys.push(fieldName)
                    }
                }
            }

            // Second pass: mark fields as primary keys based on table-level PRIMARY KEY constraints
            // Also mark primary keys and NOT NULL fields
            table.fields.forEach(field => {
                if (table.primaryKeys.includes(field.name)) {
                    field.isPrimaryKey = true
                    field.isNotNull = true // PKs are always NOT NULL
                }
            })

            tables.push(table)
        }

        return tables
    }

    /**
     * Split string by comma, respecting parentheses
     */
    function splitByComma(str) {
        const result = []
        let current = ''
        let depth = 0

        for (let i = 0; i < str.length; i++) {
            const char = str[i]
            if (char === '(') {
                depth++
                current += char
            } else if (char === ')') {
                depth--
                current += char
            } else if (char === ',' && depth === 0) {
                result.push(current)
                current = ''
            } else {
                current += char
            }
        }

        if (current.trim()) {
            result.push(current)
        }

        return result
    }

    // -------------------------------------------------------------------------
    // ERD Renderer
    // -------------------------------------------------------------------------

    /**
     * Calculate table positions using a simple grid layout
     */
    function calculateLayout(tables) {
        const positions = []
        const cols = 2 // Always use 2 columns to prevent arrow overlap
        const rowHeights = [] // Track max height per row

        // First pass: calculate table heights and track max per row
        tables.forEach((table, index) => {
            const row = Math.floor(index / cols)
            const tableHeight = HEADER_HEIGHT + TABLE_PADDING + (table.fields.length * ROW_HEIGHT) + TABLE_PADDING

            if (!rowHeights[row]) {
                rowHeights[row] = 0
            }
            rowHeights[row] = Math.max(rowHeights[row], tableHeight)
        })

        // Second pass: position tables using accumulated row heights
        tables.forEach((table, index) => {
            const col = index % cols
            const row = Math.floor(index / cols)
            const tableHeight = HEADER_HEIGHT + TABLE_PADDING + (table.fields.length * ROW_HEIGHT) + TABLE_PADDING

            // Calculate Y position based on accumulated row heights
            let yPos = 50
            for (let r = 0; r < row; r++) {
                yPos += rowHeights[r] + TABLE_SPACING_Y
            }

            positions.push({
                table: table,
                x: col * (TABLE_WIDTH + TABLE_SPACING_X) + 50,
                y: yPos,
                width: TABLE_WIDTH,
                height: tableHeight,
                col: col,
                row: row,
                index: index
            })
        })

        return { positions, cols }
    }

    /**
     * Render ERD as SVG
     */
    function renderERD(tables) {
        if (tables.length === 0) {
            return '<div class="erd-empty">No tables found. Add CREATE TABLE statements to generate an ERD.</div>'
        }

        /**
         * Helper: Create S-curve path with bezier corners
         */
        function createCurvePath(fromX, fromY, toX, toY, cornerX, exitDir, vertOffset = 0, isCrossColumn = false) {
            const MAX_CORNER_RADIUS = 10

            const adjustedFromY = fromY + vertOffset
            const adjustedToY = toY + vertOffset
            const verticalDistance = Math.abs(adjustedToY - adjustedFromY)

            // Adapt corner radius based on vertical distance
            // If distance < 2*radius, use half the distance to prevent overlap
            const CORNER_RADIUS = verticalDistance < (2 * MAX_CORNER_RADIUS)
                ? verticalDistance / 2
                : MAX_CORNER_RADIUS

            const goingDown = adjustedToY > adjustedFromY
            const r = goingDown ? CORNER_RADIUS : -CORNER_RADIUS

            // exitDir: 'left' or 'right' - which side the curve starts from
            // For same-column: both corners offset the same direction (U-curve)
            // For cross-column: corners offset opposite directions (S-curve)
            const exitOffset = exitDir === 'right' ? -CORNER_RADIUS : CORNER_RADIUS
            const entryOffset = isCrossColumn ? -exitOffset : exitOffset

            return `M ${fromX} ${adjustedFromY}
                    L ${cornerX + exitOffset} ${adjustedFromY}
                    Q ${cornerX} ${adjustedFromY}, ${cornerX} ${adjustedFromY + r}
                    L ${cornerX} ${adjustedToY - r}
                    Q ${cornerX} ${adjustedToY}, ${cornerX + entryOffset} ${adjustedToY}
                    L ${toX} ${adjustedToY}`
        }

        const { positions, cols } = calculateLayout(tables)

        // Calculate SVG dimensions
        const maxX = Math.max(...positions.map(p => p.x + p.width)) + 50
        const maxY = Math.max(...positions.map(p => p.y + p.height)) + 50

        // Create SVG
        let svg = `<svg class="erd-diagram" viewBox="0 0 ${maxX} ${maxY}" xmlns="http://www.w3.org/2000/svg">`

        // Add definitions for markers
        svg += `
            <defs>
                <marker id="fk-arrow" viewBox="0 0 10 10" refX="9" refY="5"
                    markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--erd-fk-color)" />
                </marker>
            </defs>
        `

        // Track connection counts for each side of each table (for layered routing)
        const linkCounters = new Map()
        positions.forEach(pos => {
            linkCounters.set(pos.table.name, { left: 0, right: 0 })
        })

        // Global counters for cross-column links to prevent overlap
        const globalCrossColumn = {
            leftToRight: 0,  // Left column → Right column
            rightToLeft: 0   // Right column → Left column
        }

        // Draw relationships (foreign keys) first so they appear behind tables
        positions.forEach(pos => {
            pos.table.foreignKeys.forEach(fk => {
                // Find the referenced table position
                const refPos = positions.find(p => p.table.name === fk.referencesTable)
                if (!refPos) return

                // Find field positions
                const fromFieldIndex = pos.table.fields.findIndex(f => f.name === fk.field)
                const toFieldIndex = refPos.table.fields.findIndex(f => f.name === fk.referencesField)

                if (fromFieldIndex === -1 || toFieldIndex === -1) return

                // Calculate field Y positions
                const fromFieldY = pos.y + HEADER_HEIGHT + TABLE_PADDING + (fromFieldIndex * ROW_HEIGHT) + (ROW_HEIGHT / 2)
                const toFieldY = refPos.y + HEADER_HEIGHT + TABLE_PADDING + (toFieldIndex * ROW_HEIGHT) + (ROW_HEIGHT / 2)

                // Determine relationship routing based on table positions
                const sameColumn = pos.col === refPos.col
                const isToLeft = refPos.col < pos.col
                const isToRight = refPos.col > pos.col

                const BASE_OFFSET = 30
                const OFFSET_INCREMENT = 10
                let pathD

                if (sameColumn) {
                    // Tables in same column (vertically aligned)
                    const isRightColumn = pos.col >= Math.floor(cols / 2)
                    const side = isRightColumn ? 'right' : 'left'
                    const index = linkCounters.get(pos.table.name)[side]
                    linkCounters.get(pos.table.name)[side]++

                    const offset = BASE_OFFSET + (index * OFFSET_INCREMENT)
                    const fromX = isRightColumn ? pos.x + pos.width : pos.x
                    const toX = isRightColumn ? refPos.x + refPos.width : refPos.x
                    const baseX = isRightColumn ? Math.max(fromX, toX) : Math.min(fromX, toX)
                    const cornerX = isRightColumn ? baseX + offset : baseX - offset

                    pathD = createCurvePath(fromX, fromFieldY, toX, toFieldY, cornerX, side)

                } else if (isToLeft) {
                    // Referenced table is to the left (right column → left column)
                    const index = globalCrossColumn.rightToLeft
                    globalCrossColumn.rightToLeft++

                    const offset = BASE_OFFSET + (index * OFFSET_INCREMENT)
                    const fromX = pos.x
                    const toX = refPos.x + refPos.width
                    const cornerX = fromX - offset

                    pathD = createCurvePath(fromX, fromFieldY, toX, toFieldY, cornerX, 'left', -4, true)

                } else if (isToRight) {
                    // Referenced table is to the right (left column → right column)
                    const index = globalCrossColumn.leftToRight
                    globalCrossColumn.leftToRight++

                    const offset = BASE_OFFSET + (index * OFFSET_INCREMENT)
                    const fromX = pos.x + pos.width
                    const toX = refPos.x
                    const cornerX = fromX + offset

                    pathD = createCurvePath(fromX, fromFieldY, toX, toFieldY, cornerX, 'right', 4, true)
                }

                svg += `
                    <path class="erd-relationship"
                        d="${pathD}"
                        fill="none"
                        stroke="var(--erd-fk-color)"
                        stroke-width="2"
                        marker-end="url(#fk-arrow)" />
                `
            })
        })

        // Draw tables
        positions.forEach((pos, index) => {
            svg += renderTable(pos, index)
        })

        svg += '</svg>'

        return svg
    }

    /**
     * Render a single table
     */
    function renderTable(pos, index) {
        const { table, x, y, width, height } = pos

        // Cycle through colors 1-10
        const colorIndex = (index % 10) + 1

        let html = `
            <g class="erd-table" data-color="${colorIndex}" transform="translate(${x}, ${y})">
                <!-- Table container -->
                <rect class="erd-table-bg" x="0" y="0" width="${width}" height="${height}" rx="8" />

                <!-- Table header -->
                <rect class="erd-table-header" x="0" y="0" width="${width}" height="${HEADER_HEIGHT}" rx="8" />
                <rect class="erd-table-header-fill" x="0" y="${HEADER_HEIGHT - 8}" width="${width}" height="8" />
                <text class="erd-table-name" x="${width / 2}" y="${HEADER_HEIGHT / 2 + 1}"
                    text-anchor="middle" dominant-baseline="middle">
                    ${escapeHtml(table.name)}
                </text>

                <!-- Table fields -->
        `

        table.fields.forEach((field, index) => {
            const fieldY = HEADER_HEIGHT + TABLE_PADDING + (index * ROW_HEIGHT)
            const isPK = field.isPrimaryKey
            const isFK = table.foreignKeys.some(fk => fk.field === field.name)

            // Determine icon - show both if field is PK and FK
            let icon = ''
            let fieldNameX = 38 // Default position

            if (isPK && isFK) {
                icon = '🔑🔗' // Both icons for composite PK that's also FK
                fieldNameX = 60 // Extra space for both icons
            } else if (isPK) {
                icon = '🔑'
            } else if (isFK) {
                icon = '🔗'
            }

            html += `
                <g class="erd-field ${isPK ? 'is-pk' : ''} ${isFK ? 'is-fk' : ''}"
                    transform="translate(0, ${fieldY})">
                    <rect class="erd-field-bg" x="2" y="0" width="${width - 4}" height="${ROW_HEIGHT}" />

                    ${icon ? `<text class="erd-field-icon" x="12" y="${ROW_HEIGHT / 2 + 1}"
                        dominant-baseline="middle">${icon}</text>` : ''}

                    <text class="erd-field-name" x="${fieldNameX}" y="${ROW_HEIGHT / 2 + 1}"
                        dominant-baseline="middle">
                        ${escapeHtml(field.name)}
                    </text>

                    <text class="erd-field-type" x="${width - 12}" y="${ROW_HEIGHT / 2 + 1}"
                        text-anchor="end" dominant-baseline="middle"
                        ${field.isNotNull ? 'text-decoration="underline"' : ''}>
                        ${escapeHtml(field.type)}
                    </text>
                </g>
            `
        })

        html += `
            </g>
        `

        return html
    }

    /**
     * Escape HTML special characters
     */
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }
        return text.replace(/[&<>"']/g, m => map[m])
    }

    // -------------------------------------------------------------------------
    // Component Builder
    // -------------------------------------------------------------------------

    class ERDComponent {
        constructor(element, initialSQL) {
            this.element = element
            this.sql = initialSQL
            this.editor = null
            this.debounceTimer = null
            this.cachedCSS = null // Cache fetched CSS
            this.render()
            this.initializeEditor()
            this.updateDiagram()
        }

        render() {
            this.element.innerHTML = `
                <div class="erd-wrapper">
                    <div class="erd-header">
                        <div class="erd-header-text">
                            <h3 class="erd-title">Entity-Relationship Diagram</h3>
                            <p class="erd-subtitle">Edit SQL to update diagram</p>
                        </div>
                        <div class="erd-controls">
                            <button class="erd-btn erd-save-svg-btn" title="Save as SVG">
                                Save SVG
                            </button>
                            <button class="erd-btn erd-save-png-btn" title="Save as PNG">
                                Save PNG
                            </button>
                        </div>
                    </div>

                    <div class="erd-content">
                        <div class="erd-editor-section">
                            <div class="erd-editor-label">SQL Schema</div>
                            <textarea class="erd-editor"></textarea>
                        </div>

                        <div class="erd-diagram-section">
                            <div class="erd-diagram-label">Diagram</div>
                            <div class="erd-diagram-container"></div>
                        </div>
                    </div>
                </div>
            `

            // Setup save buttons
            const saveSvgBtn = this.element.querySelector('.erd-save-svg-btn')
            const savePngBtn = this.element.querySelector('.erd-save-png-btn')
            saveSvgBtn.addEventListener('click', () => this.saveSVG())
            savePngBtn.addEventListener('click', () => this.savePNG())
        }

        initializeEditor() {
            const textarea = this.element.querySelector('.erd-editor')

            this.editor = CodeMirror.fromTextArea(textarea, {
                mode: 'text/x-sqlite',
                theme: 'material-darker',
                lineNumbers: false,
                lineWrapping: false,
                tabSize: 4,
                indentUnit: 4,
                indentWithTabs: false,
                matchBrackets: true,
                autoCloseBrackets: true,
                styleActiveLine: true
            })

            this.editor.setValue(this.sql)

            // Listen for changes with debouncing
            this.editor.on('change', () => {
                clearTimeout(this.debounceTimer)
                this.debounceTimer = setTimeout(() => {
                    this.sql = this.editor.getValue()
                    this.updateDiagram()
                }, DEBOUNCE_DELAY)
            })
        }

        updateDiagram() {
            const tables = parseSQLTables(this.sql)
            const diagramHTML = renderERD(tables)

            const container = this.element.querySelector('.erd-diagram-container')
            container.innerHTML = diagramHTML
        }

        async fetchERDCSS() {
            if (this.cachedCSS) return this.cachedCSS

            try {
                const response = await fetch('_css/interactive/erd.css')
                const cssText = await response.text()

                // Extract SVG-relevant CSS between export markers
                const startMarker = '/* ========== SVG Export Styles - Start ========== */'
                const endMarker = '/* ========== SVG Export Styles - End ========== */'

                const startIndex = cssText.indexOf(startMarker)
                const endIndex = cssText.indexOf(endMarker)

                if (startIndex !== -1 && endIndex !== -1) {
                    let extractedCSS = cssText.substring(startIndex + startMarker.length, endIndex).trim()

                    // Extract .erd-table block and flatten it
                    const tableBlockRegex = /\.erd-table\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/
                    const tableBlockMatch = extractedCSS.match(tableBlockRegex)

                    if (tableBlockMatch) {
                        const tableBlockContent = tableBlockMatch[1]
                        // Extract individual data-color rules
                        const dataColorRules = tableBlockContent.match(/&\[data-color="(\d+)"\]\s*\{[^}]+\}/g)

                        if (dataColorRules) {
                            // Convert & references to full selectors
                            const flattenedRules = dataColorRules
                                .map(rule => rule.replace(/&\[data-color=/g, '.erd-table[data-color='))
                                .join('\n    ')

                            // Replace the entire .erd-table block with flattened rules
                            extractedCSS = extractedCSS.replace(tableBlockRegex, flattenedRules)
                        }
                    }

                    // Remove transition properties (not needed in static export)
                    extractedCSS = extractedCSS.replace(/\s*transition:[^;]+;/g, '')
                    // Clean up comments
                    extractedCSS = extractedCSS.replace(/\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g, '')
                    // Clean up extra whitespace
                    extractedCSS = extractedCSS.replace(/\n\s*\n/g, '\n')

                    this.cachedCSS = extractedCSS
                    return extractedCSS
                }
            } catch (error) {
                console.warn('Could not fetch ERD CSS', error)
            }

            // Return null if fetch fails
            return null
        }

        async embedStyles(svg) {
            // Clone the SVG to avoid modifying the original
            const svgClone = svg.cloneNode(true)

            // Get computed styles and extract CSS custom properties
            // Walk up the tree to collect all inherited custom properties
            const customProps = {}
            let element = svg

            while (element) {
                const computedStyle = getComputedStyle(element)

                // Collect all CSS custom properties from this element
                for (let i = 0; i < computedStyle.length; i++) {
                    const propName = computedStyle[i]
                    if (propName.startsWith('--') && !customProps[propName]) {
                        const value = computedStyle.getPropertyValue(propName).trim()
                        customProps[propName] = value
                    }
                }

                // Move up to parent element
                element = element.parentElement
            }

            // Resolve variable references in collected properties
            // Some variables reference other variables (e.g., --erd-table-bg: var(--color-mono-0))
            // We need to resolve these to actual color values
            const resolveVar = (value, depth = 0) => {
                if (depth > 10) return value // Prevent infinite recursion
                const varMatch = value.match(/var\((--[^,)]+)(?:,\s*([^)]+))?\)/)
                if (varMatch) {
                    const varName = varMatch[1]
                    const fallback = varMatch[2] || ''
                    const resolvedValue = customProps[varName] || fallback
                    const newValue = value.replace(varMatch[0], resolvedValue)
                    return resolveVar(newValue, depth + 1)
                }
                return value
            }

            // Resolve all variables
            Object.keys(customProps).forEach(key => {
                customProps[key] = resolveVar(customProps[key])
            })

            // Fetch the actual CSS rules
            const erdCSS = await this.fetchERDCSS()

            if (!erdCSS) {
                console.warn('ERD CSS could not be loaded - exports may have incorrect styling')
            }

            // Create style element with embedded CSS
            const styleElement = document.createElementNS('http://www.w3.org/2000/svg', 'style')

            // Build CSS rules - apply custom properties to svg element for better compatibility
            let cssRules = `svg {\n    font-family: system-ui, sans-serif;\n`
            Object.entries(customProps).forEach(([name, value]) => {
                cssRules += `    ${name}: ${value};\n`
            })
            cssRules += '}\n\n'

            if (erdCSS) {
                cssRules += erdCSS
            }

            styleElement.textContent = cssRules

            // Insert style as first child of SVG
            svgClone.insertBefore(styleElement, svgClone.firstChild)

            return svgClone
        }

        generateFilename(extension) {
            // Get table names from the current diagram
            const sql = this.editor.getValue()
            const tables = parseSQLTables(sql)
            const tableNames = tables.map(t => t.name.toLowerCase()).sort()

            if (tableNames.length === 0) {
                return `erd-diagram.${extension}`
            }

            // Generate filename: erd_table1_table2_table3.ext
            return `erd_${tableNames.join('_')}.${extension}`
        }

        async saveSVG() {
            const svg = this.element.querySelector('.erd-diagram')
            if (!svg) return

            // Embed styles in SVG
            const svgClone = await this.embedStyles(svg)

            // Create a serialized version of the SVG
            const serializer = new XMLSerializer()
            const svgString = serializer.serializeToString(svgClone)

            // Create blob and download
            const blob = new Blob([svgString], { type: 'image/svg+xml' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = this.generateFilename('svg')
            a.click()
            URL.revokeObjectURL(url)

            // Visual feedback
            const btn = this.element.querySelector('.erd-save-svg-btn')
            const originalText = btn.textContent
            btn.textContent = 'Saved!'
            setTimeout(() => {
                btn.textContent = originalText
            }, 2000)
        }

        async savePNG() {
            const svg = this.element.querySelector('.erd-diagram')
            if (!svg) return

            // Embed styles in SVG for proper rendering
            const svgClone = await this.embedStyles(svg)

            // Get SVG dimensions from viewBox (not getBBox which only gets content bounds)
            const viewBox = svg.getAttribute('viewBox').split(' ').map(Number)
            const width = viewBox[2]   // viewBox format: "x y width height"
            const height = viewBox[3]

            // Create canvas
            const canvas = document.createElement('canvas')
            const scale = 2 // 2x for better quality
            canvas.width = width * scale
            canvas.height = height * scale
            const ctx = canvas.getContext('2d')
            ctx.scale(scale, scale)

            // Transparent background (no fill needed)

            // Create image from styled SVG
            const serializer = new XMLSerializer()
            const svgString = serializer.serializeToString(svgClone)
            const img = new Image()
            const blob = new Blob([svgString], { type: 'image/svg+xml' })
            const url = URL.createObjectURL(blob)

            img.onload = () => {
                ctx.drawImage(img, 0, 0, width, height)
                URL.revokeObjectURL(url)

                // Convert canvas to PNG and download
                canvas.toBlob((pngBlob) => {
                    const pngUrl = URL.createObjectURL(pngBlob)
                    const a = document.createElement('a')
                    a.href = pngUrl
                    a.download = this.generateFilename('png')
                    a.click()
                    URL.revokeObjectURL(pngUrl)

                    // Visual feedback
                    const btn = this.element.querySelector('.erd-save-png-btn')
                    const originalText = btn.textContent
                    btn.textContent = 'Saved!'
                    setTimeout(() => {
                        btn.textContent = originalText
                    }, 2000)
                })
            }

            img.src = url
        }
    }

    // -------------------------------------------------------------------------
    // Docsify Plugin
    // -------------------------------------------------------------------------

    let elementCounter = 0
    const erdData = new Map()

    /**
     * Preprocess markdown to extract ERD content before Docsify parses it
     */
    function preprocessMarkdown(content) {
        return content.replace(/<erd>([\s\S]*?)<\/erd>/g, (match, innerContent) => {
            const id = `erd-placeholder-${elementCounter++}`

            // Extract SQL from code block if present
            let sql = innerContent.trim()
            const codeBlockMatch = sql.match(/```sql\s*([\s\S]*?)```/)
            if (codeBlockMatch) {
                sql = codeBlockMatch[1].trim()
            }

            erdData.set(id, sql)
            return `<erd data-id="${id}"></erd>`
        })
    }

    /**
     * Process ERD elements after Docsify renders the page
     */
    function processERD() {
        document.querySelectorAll('.markdown-section erd:not(.erd-initialized)').forEach((el, index) => {
            el.classList.add('erd-initialized')

            // Get SQL from stored data if available
            const dataId = el.getAttribute('data-id')
            let sql = ''
            if (dataId && erdData.has(dataId)) {
                sql = erdData.get(dataId)
                erdData.delete(dataId)
            } else {
                // Fallback to extracting from element content
                const preElement = el.querySelector('pre code')
                if (preElement) {
                    sql = preElement.textContent.trim()
                } else {
                    sql = el.textContent.trim()
                }
            }

            // Create component
            new ERDComponent(el, sql)
        })
    }

    function docsifyERD(hook, vm) {
        hook.beforeEach(preprocessMarkdown)
        hook.doneEach(processERD)
    }

    // Register plugin
    if (window.$docsify) {
        window.$docsify.plugins = [].concat(
            docsifyERD,
            window.$docsify.plugins || []
        )
    }

})();
