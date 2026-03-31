// tables.js
// Post-processes all tables to add data attributes for interactive row/column hover effects.
// Adds data-row-num to all rows and data-col-num to all cells.
// Detects !! prefix in headers to mark columns for highlighting.
// Detects !! prefix in cells to mark individual cells for highlighting.
// Detects !!! prefix in first cell to mark entire row for highlighting.
// Wraps tables in a scroll container for horizontal overflow.
//
// This enables CSS :has() selectors to highlight entire columns on hover.
//
// Processed tables get:
//   <div class="table-scroll">
//     <table>
//       <tr data-row-num="0" class="highlight-row">
//         <td data-col-num="1" class="highlight-cell">...</td>
//         <td data-col-num="2" class="highlight-col">...</td>
//       </tr>
//     </table>
//   </div>

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

      // Track which columns should be highlighted
      const highlightColumns = new Set()

      // First pass: check header row for !! markers
      if (rows.length > 0) {
        const headerCells = rows[0].querySelectorAll('th')
        headerCells.forEach((cell, index) => {
          const text = cell.textContent.trim()
          if (text.startsWith('!!')) {
            // Mark this column for highlighting (1-indexed)
            highlightColumns.add(index + 1)
            // Remove the !! prefix from the header text
            cell.textContent = text.substring(2).trim()
          }
        })
      }

      // Second pass: add data attributes and highlight classes
      for (let y = 0; y < rows.length; y++) {
        rows[y].dataset.rowNum = y

        // Add data-col-num to each cell (1-indexed)
        const cells = rows[y].querySelectorAll('td, th')
        if (cells.length === 0) continue

        for (let x = 0; x < cells.length; x++) {
          const colNum = x + 1
          cells[x].dataset.colNum = colNum

          const cellText = cells[x].textContent.trim()

          // Check if first cell has !!! marker for row highlighting
          if (x === 0 && cellText.startsWith('!!!')) {
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

          // Add highlight-col class if this column was marked
          if (highlightColumns.has(colNum)) {
            cells[x].classList.add('highlight-col')
          }
        }
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

  window.$docsify = window.$docsify || {}
  window.$docsify.plugins = [].concat(docsifyTables, window.$docsify.plugins || [])
})()
