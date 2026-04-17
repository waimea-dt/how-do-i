/**
 * tables.js — Post-processes all tables to add data attributes for interactive row/column hover effects.
 * Adds data-row-num to all rows and data-col-num to all cells.
 *
 * Column numbering is based on TH index (not physical column position):
 * - Each TH gets a data-col-num based on its index (1, 2, 3, ...)
 * - If a TH has colspan="3", ALL cells beneath it get the SAME data-col-num as that TH
 * - This allows column highlighting to work correctly with colspan headers
 *
 * Example:
 *   <th data-col-num="1">N</th>
 *   <th data-col-num="2" colspan="3">Algorithm</th>
 *   <th data-col-num="3">Time</th>
 *
 *   <td data-col-num="1">10</td>
 *   <td data-col-num="2">Best</td>   <!-- All 3 cells get -->
 *   <td data-col-num="2">Avg</td>    <!-- the same col num -->
 *   <td data-col-num="2">Worst</td>  <!-- as their TH -->
 *   <td data-col-num="3">100ms</td>
 *
 * Detects !! prefix in headers to mark columns for highlighting.
 * Detects !! prefix in cells to mark individual cells for highlighting.
 * Detects !!! prefix in first cell to mark entire row for highlighting.
 * Wraps tables in a scroll container for horizontal overflow.
 *
 * Usage in markdown:
 *   | !!Name | Score |
 *   |--------|-------|
 *   | !!!Ada | !!98  |
 *
 * This enables CSS :has() selectors to highlight entire columns on hover.
 *
 * Processed tables get:
 *   <div class="table-scroll">
 *     <table>
 *       <tr data-row-num="0" class="highlight-row">
 *         <td data-col-num="1" class="highlight-cell">...</td>
 *         <td data-col-num="2" class="highlight-col">...</td>
 *       </tr>
 *     </table>
 *   </div>
 */

;(function () {
  function processTables() {
    const tables = document.querySelectorAll('.markdown-section table')

    tables.forEach((table) => {
      // Skip tables already processed by database plugin
      if (table.closest('.database-scroll') || table.classList.contains('db-schema')) {
        return
      }

      // Skip logic tables (they're wrapped by the logic plugin)
      if (table.classList.contains('logic-table') || table.closest('.display-logic')) {
        return
      }

      const rows = table.querySelectorAll('tr')
      if (rows.length === 0) return

      // Track which columns should be highlighted (by TH index)
      const highlightColumns = new Set()

      // Build a mapping from physical column position to TH index
      const colPositionToThIndex = new Map()

      // First pass: process header row
      if (rows.length > 0) {
        const headerCells = rows[0].querySelectorAll('th')
        let physicalCol = 1 // Track physical column position

        headerCells.forEach((cell, thIndex) => {
          const text = cell.textContent.trim()
          const colspan = parseInt(cell.getAttribute('colspan')) || 1
          const thNum = thIndex + 1 // TH index (1-based)

          // Map all physical columns this TH spans to its index
          for (let i = 0; i < colspan; i++) {
            colPositionToThIndex.set(physicalCol + i, thNum)
          }

          // Set data-col-num on the TH itself
          cell.dataset.colNum = thNum

          if (text.startsWith('!!')) {
            // Mark this TH index for highlighting
            highlightColumns.add(thNum)
            // Remove the !! prefix from the header text
            cell.textContent = text.substring(2).trim()
            // Add highlight-col class to the TH itself
            cell.classList.add('highlight-col')
          }

          physicalCol += colspan
        })
      }

      // Second pass: add data attributes to body rows
      for (let y = 1; y < rows.length; y++) {
        rows[y].dataset.rowNum = y

        const cells = rows[y].querySelectorAll('td, th')
        if (cells.length === 0) continue

        let physicalCol = 1 // Track physical column position
        for (let x = 0; x < cells.length; x++) {
          const colspan = parseInt(cells[x].getAttribute('colspan')) || 1

          // Get the TH index this cell belongs to
          const thIndex = colPositionToThIndex.get(physicalCol) || physicalCol
          cells[x].dataset.colNum = thIndex

          const cellText = cells[x].textContent.trim()

          // Check if first cell has !!! marker for row highlighting
          if (physicalCol === 1 && cellText.startsWith('!!!')) {
            // Remove the !!! prefix and add highlight-row class to the row
            cells[x].textContent = cellText.substring(3).trim()
            rows[y].classList.add('highlight-row')
          }
          // Check if this individual cell has !! marker
          else if (cellText.startsWith('!!')) {
            // Remove the !! prefix and add highlight-cell class
            cells[x].textContent = cellText.substring(2).trim()
            cells[x].classList.add('highlight-cell')
          }

          // Add highlight-col class if this TH was marked
          if (highlightColumns.has(thIndex)) {
            cells[x].classList.add('highlight-col')
          }

          physicalCol += colspan
        }
      }

      // Also set data-row-num on header row
      if (rows.length > 0) {
        rows[0].dataset.rowNum = 0
      }

      // Wrap table in scroll container
      const scrollWrapper = document.createElement('div')
      scrollWrapper.classList.add('table-scroll')
      table.parentNode.insertBefore(scrollWrapper, table)
      scrollWrapper.appendChild(table)
    })
  }

  var docsifyTables = function (hook) {
    hook.doneEach(processTables)
  }

  // Expose processTables globally for dynamic table generation
  window.processTableAttributes = function(table) {
    // Skip tables already processed by database plugin
    if (table.closest('.database-scroll') || table.classList.contains('db-schema')) {
      return
    }

    // Skip logic tables
    if (table.classList.contains('logic-table') || table.closest('.display-logic')) {
      return
    }

    const rows = table.querySelectorAll('tr')
    if (rows.length === 0) return

    // Track which columns should be highlighted (by TH index)
    const highlightColumns = new Set()

    // Build a mapping from physical column position to TH index
    const colPositionToThIndex = new Map()

    // First pass: process header row
    if (rows.length > 0) {
      const headerCells = rows[0].querySelectorAll('th')
      let physicalCol = 1 // Track physical column position

      headerCells.forEach((cell, thIndex) => {
        const text = cell.textContent.trim()
        const colspan = parseInt(cell.getAttribute('colspan')) || 1
        const thNum = thIndex + 1 // TH index (1-based)

        // Map all physical columns this TH spans to its index
        for (let i = 0; i < colspan; i++) {
          colPositionToThIndex.set(physicalCol + i, thNum)
        }

        // Set data-col-num on the TH itself
        cell.dataset.colNum = thNum

        if (text.startsWith('!!')) {
          // Mark this TH index for highlighting
          highlightColumns.add(thNum)
          cell.textContent = text.substring(2).trim()
          // Add highlight-col class to the TH itself
          cell.classList.add('highlight-col')
        }

        physicalCol += colspan
      })
    }

    // Second pass: add data attributes to body rows
    for (let y = 1; y < rows.length; y++) {
      rows[y].dataset.rowNum = y

      const cells = rows[y].querySelectorAll('td, th')
      if (cells.length === 0) continue

      let physicalCol = 1 // Track physical column position
      for (let x = 0; x < cells.length; x++) {
        const colspan = parseInt(cells[x].getAttribute('colspan')) || 1

        // Get the TH index this cell belongs to
        const thIndex = colPositionToThIndex.get(physicalCol) || physicalCol
        cells[x].dataset.colNum = thIndex

        const cellText = cells[x].textContent.trim()

        if (physicalCol === 1 && cellText.startsWith('!!!')) {
          cells[x].textContent = cellText.substring(3).trim()
          rows[y].classList.add('highlight-row')
        }
        else if (cellText.startsWith('!!')) {
          cells[x].textContent = cellText.substring(2).trim()
          cells[x].classList.add('highlight-cell')
        }

        // Add highlight-col class if this TH was marked
        if (highlightColumns.has(thIndex)) {
          cells[x].classList.add('highlight-col')
        }

        physicalCol += colspan
      }
    }

    // Also set data-row-num on header row
    if (rows.length > 0) {
      rows[0].dataset.rowNum = 0
    }
  }

  window.$docsify = window.$docsify || {}
  window.$docsify.plugins = [].concat(docsifyTables, window.$docsify.plugins || [])
})()

