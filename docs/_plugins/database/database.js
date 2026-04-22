/**
 * docsify-database.js - Renders schema, data, and relationship visualizations for database notes.
 *
 * This plugin transforms custom database markdown/HTML wrapper blocks into richer
 * interactive markup used by the database CSS components.
 *
 * Usage in markdown:
 *   <db-schema>
 *   | users | PK id | name |
 *   </db-schema>
 *
 *   <db-data>
 *   | id | name |
 *   | 1  | Sam  |
 *   </db-data>
 */

(function () {

    // -------------------------------------------------------------------------
    // Constants
    // -------------------------------------------------------------------------

    const DB_KEY_LABELS = {
        PK: 'PK',
        FK: 'FK'
    }

    const DB_MARKERS = {
        HIGHLIGHT:  '!!',
        SKIP_ONE:   '++',
        PREV_ONE:   '--'
    }

    const DB_RELATIONSHIP_TYPES = {
        ONE_TO_MANY:    ['one-to-many',  '1:m'],
        MANY_TO_MANY:   ['many-to-many', 'm:m'],
        MANY_TO_ONE:    ['many-to-one',  'm:1'],
        ONE_TO_ONE:     ['one-to-one',   '1:1']
    }

    const KEY_ICON = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M280-240q-100 0-170-70T40-480q0-100 70-170t170-70q81 0 141.5 45.5T506-560h414v160h-80v160H680v-160H506q-24 69-84.5 114.5T280-240Zm0-160q33 0 56.5-23.5T360-480q0-33-23.5-56.5T280-560q-33 0-56.5 23.5T200-480q0 33 23.5 56.5T280-400Z"/>
        </svg>`

    // -------------------------------------------------------------------------
    // Utility Functions
    // -------------------------------------------------------------------------

    function createIcon(type) {
        return `<span class="icon ${type}">${KEY_ICON}</span>`
    }

    function parseTableName(name, index) {
        let tableNum = index + 1  // default
        let highlightClass = null
        let cleanName = name

        // Check for highlight marker
        if (cleanName.includes(DB_MARKERS.HIGHLIGHT)) {
            highlightClass = 'focus'
            cleanName = cleanName.replace(DB_MARKERS.HIGHLIGHT, '').trim()
        }

        // Check for sequence adjustment markers
        if (cleanName.includes(DB_MARKERS.SKIP_ONE)) {
            cleanName = cleanName.replace(DB_MARKERS.SKIP_ONE, '').trim()
            tableNum = index + 2
        }
        else if (cleanName.includes(DB_MARKERS.PREV_ONE)) {
            cleanName = cleanName.replace(DB_MARKERS.PREV_ONE, '').trim()
            tableNum = index
        }

        return { cleanName, tableNum, highlightClass }
    }

    function validateSchemaTable(table) {
        const headRow = table.querySelector('thead tr')
        if (!headRow) {
            console.warn('Schema table missing thead tr:', table)
            return false
        }
        const bodyRows = table.querySelectorAll('tbody tr')
        if (bodyRows.length === 0) {
            console.warn('Schema table has no body rows:', table)
            return false
        }
        const numCols = headRow.querySelectorAll('th').length
        if (numCols < 2 || numCols > 4) {
            console.warn('Schema table has invalid column count:', numCols, table)
            return false
        }
        return true
    }

    function validateDataTable(table) {
        const headRow = table.querySelector('thead tr')
        if (!headRow) {
            console.warn('Data table missing thead tr:', table)
            return false
        }
        const dataRows = table.querySelectorAll('tbody tr')
        if (dataRows.length < 3) {
            console.warn('Data table has insufficient rows:', dataRows.length, table)
            return false
        }
        return true
    }

    // -------------------------------------------------------------------------
    // Schema Tables Processing
    // -------------------------------------------------------------------------

    function formatSchemaTables(element) {
        const tables = Array.from(element.querySelectorAll('table'))
        if (tables.length === 0) return

        // Validate all tables
        const validTables = tables.filter(validateSchemaTable)
        if (validTables.length === 0) return

        // Create wrapper
        const wrapper = document.createElement('div')
        wrapper.classList.add('db-schema-wrapper')

        // Add tables and links
        const links = []
        validTables.forEach((table, i) => {
            if (i > 0) {
                const linkContainer = document.createElement('div')
                linkContainer.classList.add('db-schema-link')
                linkContainer.innerHTML = '<span class="link-left"></span><span class="link-middle"></span><span class="link-right"></span>'
                links.push(linkContainer)
                wrapper.append(linkContainer)
            }
            wrapper.append(table)
        })

        // Process tables
        processSchemaTablesContent(validTables, links)

        // Create scroll wrapper
        const scrollWrapper = document.createElement('div')
        scrollWrapper.classList.add('database-scroll')
        scrollWrapper.append(wrapper)

        // Replace element with scroll wrapper
        element.replaceWith(scrollWrapper)
    }

    function processSchemaTablesContent(tables, links) {
        const PK_ICON = createIcon('primary')
        const FK_ICON = createIcon('foreign')
        let linkIndex = 0

        tables.forEach((table, i) => {
            table.classList.add('db-schema')

            const headRow = table.querySelector('thead tr')
            const bodyRows = table.querySelectorAll('tbody tr')
            const numCols = headRow.querySelectorAll('th').length
            const name = headRow.querySelector('th').textContent

            const { cleanName, tableNum, highlightClass } = parseTableName(name, i)
            table.dataset.tableNum = tableNum
            table.dataset.name = cleanName
            if (highlightClass) table.classList.add(highlightClass)

            // Merge header row
            headRow.innerHTML = `<th colspan="${numCols}">${cleanName}</th>`

            // Add row numbers to body rows
            bodyRows.forEach((row, rowIdx) => {
                row.dataset.rowNum = rowIdx + 1
            })

            // Process keys and highlights in body rows
            for (const row of bodyRows) {
                const cells = row.querySelectorAll('td')
                if (cells.length === 0) continue

                const keyCell = cells[0]
                let isHighlighted = false

                // Check for highlight marker
                if (keyCell.textContent.includes(DB_MARKERS.HIGHLIGHT)) {
                    isHighlighted = true
                    cells.forEach(cell => cell.classList.add('focus-row'))
                }

                // Process PK
                if (keyCell.textContent.includes(DB_KEY_LABELS.PK)) {
                    row.classList.add('primary-key')
                    keyCell.innerHTML = keyCell.innerHTML.replace(DB_KEY_LABELS.PK, PK_ICON)
                }

                // Process FK
                if (keyCell.textContent.includes(DB_KEY_LABELS.FK)) {
                    row.classList.add('foreign-key')
                    keyCell.innerHTML = keyCell.innerHTML.replace(DB_KEY_LABELS.FK, FK_ICON)

                    // Set the link height and styling
                    const link = links[linkIndex]
                    if (link) {
                        link.style.setProperty('--schema-link-rows', row.dataset.rowNum - 1)
                        link.classList.add((i > linkIndex) ? 'fk-right' : 'fk-left')

                        // If FK row is highlighted, highlight the link too
                        if (isHighlighted) {
                            link.classList.add('focus')
                        }

                        linkIndex++
                    }
                }

                // Remove highlight marker from text
                if (isHighlighted) {
                    keyCell.innerHTML = keyCell.innerHTML.replace(DB_MARKERS.HIGHLIGHT, '')
                }
            }
        })
    }

    // -------------------------------------------------------------------------
    // Data Tables Processing
    // -------------------------------------------------------------------------

    function formatDataTables(element) {
        const tables = Array.from(element.querySelectorAll('table'))
        if (tables.length === 0) return

        // Validate all tables
        const validTables = tables.filter(validateDataTable)
        if (validTables.length === 0) return

        // Create wrapper
        const wrapper = document.createElement('div')
        wrapper.classList.add('db-data-wrapper')

        // Add tables to wrapper
        validTables.forEach(table => wrapper.append(table))

        // Process tables
        processDataTablesContent(validTables)

        // Create scroll wrapper
        const scrollWrapper = document.createElement('div')
        scrollWrapper.classList.add('database-scroll')
        scrollWrapper.append(wrapper)

        // Replace element with scroll wrapper
        element.replaceWith(scrollWrapper)
    }

    function processDataTablesContent(tables) {
        const PK_ICON = createIcon('primary')
        const FK_ICON = createIcon('foreign')

        tables.forEach((table, i) => {
            table.classList.add('db-data')

            const headRow = table.querySelector('thead tr')
            let bodyRows = table.querySelectorAll('tbody tr')
            const numCols = headRow.querySelectorAll('th').length
            const name = headRow.querySelector('th').textContent.trim().toLowerCase()

            const { cleanName, tableNum, highlightClass } = parseTableName(name, i)
            table.dataset.tableNum = tableNum
            table.dataset.name = cleanName
            if (highlightClass) table.classList.add(highlightClass)

            // Merge header row
            headRow.innerHTML = `<th colspan="${numCols}">${cleanName}</th>`

            // Remove divider row and move fieldname row
            bodyRows[1].remove()
            const fieldnameRow = bodyRows[0]
            headRow.after(fieldnameRow)
            fieldnameRow.dataset.rowNum = '1'

            // Add column numbers to fieldname cells
            const fieldnames = fieldnameRow.querySelectorAll('td')
            fieldnames.forEach((cell, idx) => {
                cell.dataset.colNum = idx + 1
            })

            // Get the remaining rows and add numbers
            bodyRows = table.querySelectorAll('tbody tr')
            bodyRows.forEach((row, idx) => {
                row.dataset.rowNum = idx + 2
                const cells = row.querySelectorAll('td')
                cells.forEach((cell, cellIdx) => {
                    cell.dataset.colNum = cellIdx + 1
                })
            })

            // Process keys and highlights
            processKeys(table, fieldnames, PK_ICON, FK_ICON)
            processHighlights(table, fieldnames, bodyRows)
        })
    }

    function processKeys(table, fieldnames, PK_ICON, FK_ICON) {
        for (const fieldname of fieldnames) {
            if (fieldname.textContent.includes(DB_KEY_LABELS.PK)) {
                const pkCol = fieldname.dataset.colNum
                const primaryData = table.querySelectorAll(`td[data-col-num="${pkCol}"]`)
                primaryData.forEach(cell => cell.classList.add('primary-key'))
                fieldname.innerHTML = fieldname.innerHTML.replace(DB_KEY_LABELS.PK, PK_ICON)
            }
            if (fieldname.textContent.includes(DB_KEY_LABELS.FK)) {
                const fkCol = fieldname.dataset.colNum
                const foreignData = table.querySelectorAll(`td[data-col-num="${fkCol}"]`)
                foreignData.forEach(cell => cell.classList.add('foreign-key'))
                fieldname.innerHTML = fieldname.innerHTML.replace(DB_KEY_LABELS.FK, FK_ICON)
            }
        }
    }

    function processHighlights(table, fieldnames, bodyRows) {
        // Process highlighted columns
        for (const fieldname of fieldnames) {
            if (fieldname.textContent.includes(DB_MARKERS.HIGHLIGHT)) {
                const highCol = fieldname.dataset.colNum
                const highData = table.querySelectorAll(`td[data-col-num="${highCol}"]`)
                highData.forEach(cell => cell.classList.add('focus-col'))
                fieldname.innerHTML = fieldname.innerHTML.replace(DB_MARKERS.HIGHLIGHT, '')
            }
        }

        // Process highlighted rows
        for (const row of bodyRows) {
            const firstCell = row.children[0]
            if (firstCell && firstCell.textContent.includes(DB_MARKERS.HIGHLIGHT)) {
                const highData = row.querySelectorAll('td')
                highData.forEach(cell => cell.classList.add('focus-row'))
                firstCell.innerHTML = firstCell.innerHTML.replace(DB_MARKERS.HIGHLIGHT, '')
            }
        }
    }

    // -------------------------------------------------------------------------
    // Relationship Processing
    // -------------------------------------------------------------------------

    function formatRelationships(element) {
        const list = element.querySelector('ul')
        if (!list) return

        const items = Array.from(list.children)
        if (items.length === 0) return

        const dbRelationshipBlock = createRelationshipDiagram(items)

        // Create scroll wrapper
        const scrollWrapper = document.createElement('div')
        scrollWrapper.classList.add('database-scroll')
        scrollWrapper.append(dbRelationshipBlock)

        // Replace element with scroll wrapper
        element.replaceWith(scrollWrapper)
    }

    function createRelationshipDiagram(items) {
        const dbRelationshipBlock = document.createElement('div')
        dbRelationshipBlock.classList.add('db-relationship')

        items.forEach((item, i) => {
            // Create table block
            const tableBlock = createTableBlock(item, i)
            dbRelationshipBlock.append(tableBlock)

            // Create relationship block if relationships exist
            const relBlock = createRelationshipBlock(item)
            if (relBlock) {
                dbRelationshipBlock.append(relBlock)
            }
        })

        return dbRelationshipBlock
    }

    function createTableBlock(item, index) {
        const tableBlock = document.createElement('div')
        tableBlock.classList.add('table')

        const name = item.childNodes[0].textContent.trim()
        const { cleanName, tableNum, highlightClass } = parseTableName(name, index)

        tableBlock.dataset.tableNum = tableNum
        tableBlock.dataset.name = cleanName
        if (highlightClass) tableBlock.classList.add(highlightClass)

        tableBlock.innerHTML = cleanName
        return tableBlock
    }

    function createRelationshipBlock(item) {
        const relList = item.querySelector('ul')
        if (!relList) return null

        const relItems = relList.querySelectorAll('li')
        if (relItems.length === 0) return null

        const relBlock = document.createElement('div')
        relBlock.classList.add('relationship')

        const relDesc = relItems[0].textContent.trim().toLowerCase().split(' ')
        const relationship = relDesc[0] // e.g. 'one-to-many', 'many-to-one', etc.

        // Add relationship type class
        for (const [type, options] of Object.entries(DB_RELATIONSHIP_TYPES)) {
            if (options.includes(relationship)) {
                relBlock.classList.add(type.toLowerCase().replaceAll('_', '-'))
                break
            }
        }

        // Add focus class if highlighted
        if (relDesc.length > 1 && relDesc[1] === DB_MARKERS.HIGHLIGHT) {
            relBlock.classList.add('focus')
        }

        return relBlock
    }

    // -------------------------------------------------------------------------
    // Main Processing Function
    // -------------------------------------------------------------------------

    function processDBs() {
        // Process schema tables
        const schemaBlocks = document.querySelectorAll('db-schema')
        schemaBlocks.forEach(block => formatSchemaTables(block))

        // Process data tables
        const dataBlocks = document.querySelectorAll('db-data')
        dataBlocks.forEach(block => formatDataTables(block))

        // Process relationships
        const relBlocks = document.querySelectorAll('db-relationship')
        relBlocks.forEach(block => formatRelationships(block))
    }

    // -------------------------------------------------------------------------
    // Docsify Plugin
    // -------------------------------------------------------------------------

    var docsifyDatabase = function (hook) {
        hook.doneEach(function () {
            processDBs()
        })
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyDatabase, window.$docsify.plugins || [])
})()

