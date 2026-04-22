/**
 * requests.js - Renders <requests>...</requests> blocks as request/response sequence diagrams.
 *
 * Usage in markdown:
 *   <requests>
 *   - Left: Client Name
 *       Optional description
 *   - Right: Server Name
 *   - Requests:
 *       1. L ---> R : Message
 *       2. L <--- R : Response
 *       3. L i)   R : Left info note
 *       4. L   (i R : Right info note
 *   </requests>
 *
 *   <requests>
 *   - Left: Client Name
 *   - Middle: Server Name (optional, for 3-party diagrams)
 *   - Right: Server Name
 *   - Requests:
 *       1. L ---> M      R : Three-party message (L to M)
 *       2. L      M ---> R : Three-party message (M to R)
 *   </requests>
 *
 * Format (all parties shown on each line, arrow position indicates communication):
 *   Two-party:
 *     L ---> R : Message (L sends to R)
 *     L <--- R : Response (R sends to L)
 *     L i)   R : Info from left (L is thinking)
 *     L   (i R : Info from right (R is thinking)
 *
 *   Three-party:
 *     L ---> M      R : Message (L to M, R not involved)
 *     L      M ---> R : Message (M to R, L not involved)
 *     L <--- M      R : Response (M to L, R not involved)
 *     L      M <--- R : Response (R to M, L not involved)
 *     L   (i M      R : Info from M
 *     L      M   (i R : Info from R
 *
 * Attributes:
 *   animated="true" - Enable fade in/out animation
 */

;(function () {
  const LEFT_MARKER = 'Left: '
  const RIGHT_MARKER = 'Right: '
  const MIDDLE_MARKER = 'Middle: '
  const REQUEST_MARKER = 'Requests:'

  function processRequests() {
    const requestBlocks = document.querySelectorAll('.markdown-section requests')

    requestBlocks.forEach((requestBlock) => {
      // Find the UL element inside
      const list = requestBlock.querySelector('ul')
      if (!list) return

      const items = Array.from(list.children)
      if (items.length === 0) return

      let leftItem = null
      let middleItem = null
      let rightItem = null
      let requestList = null

      // Extract endpoint items and request list
      for (const item of items) {
        const firstChild = item.children[0]
        if (!firstChild) continue

        const itemText = firstChild.textContent.trim()

        if (itemText.startsWith(LEFT_MARKER)) leftItem = item
        else if (itemText.startsWith(MIDDLE_MARKER)) middleItem = item
        else if (itemText.startsWith(RIGHT_MARKER)) rightItem = item
        else if (itemText.startsWith(REQUEST_MARKER)) {
          // Check for nested OL
          const nestedList = item.querySelector('ol')
          if (nestedList) requestList = nestedList
        }
      }

      // Validate required parts
      if (!leftItem || !rightItem || !requestList) return

      // Extract endpoint data
      const leftName = leftItem.children[0].textContent.trim().slice(LEFT_MARKER.length)
      const rightName = rightItem.children[0].textContent.trim().slice(RIGHT_MARKER.length)
      const middleName = middleItem ? middleItem.children[0].textContent.trim().slice(MIDDLE_MARKER.length) : null

      // Extract descriptions - collect all elements after the first child
      // This handles multi-line descriptions properly
      const getDescElements = (item) => {
        if (!item) return []

        const descElements = []
        const children = Array.from(item.children)

        // Skip the first child (contains the label like "Left: Customer")
        // and process all remaining children
        for (let i = 1; i < children.length; i++) {
          descElements.push(...extractIconAndText(children[i]))
        }

        return descElements
      }

      // Helper function to extract icon and text from an element
      // Handles the case where text is nested inside icon elements
      const extractIconAndText = (element) => {
        const result = []

        if (element.tagName === 'I' && element.getAttribute('data-lucide')) {
          // Clone just the icon (without deep cloning the text content)
          const iconClone = element.cloneNode(false)
          for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i]
            iconClone.setAttribute(attr.name, attr.value)
          }
          result.push(iconClone)

          // Extract text content after the icon if it exists
          const textContent = element.textContent.trim()
          if (textContent) {
            const textPara = document.createElement('p')
            textPara.innerHTML = textContent
            result.push(textPara)
          }
        } else {
          // For normal elements, check if they contain icons with text
          const clone = element.cloneNode(true)
          const nestedIcons = clone.querySelectorAll('i[data-lucide]')

          if (nestedIcons.length > 0) {
            // If there are nested icons with text, process them
            nestedIcons.forEach(icon => {
              const textContent = icon.textContent.trim()
              if (textContent) {
                // Keep the icon but move text after it
                const textNode = document.createTextNode(textContent)
                icon.parentNode.insertBefore(textNode, icon.nextSibling)
                icon.textContent = '' // Clear text from icon
              }
            })
          }

          result.push(clone)
        }

        return result
      }

      const leftDesc = getDescElements(leftItem)
      const rightDesc = getDescElements(rightItem)
      const middleDesc = middleItem ? getDescElements(middleItem) : []

      // Create request lists
      const requestListLeft = document.createElement('ol')
      const requestListRight = document.createElement('ol')

      let requestNum = 1

      // Process each request item
      const requestItems = Array.from(requestList.children)
      for (const requestItem of requestItems) {
        const text = requestItem.textContent.trim()

        // Parse the new format: "L ---> M      R : Message"
        // All parties are shown on each line, arrow position indicates communication
        // Split by colon to separate direction from message
        const colonIdx = text.indexOf(':')
        if (colonIdx === -1) continue

        const directionPart = text.slice(0, colonIdx).trim()
        const messagePart = text.slice(colonIdx + 1).trim()

        // Determine the type of message based on the arrows/markers
        let direction = null
        let between = null // 'LR', 'LM', or 'MR'

        // Find arrow position to determine which parties are communicating
        const rightArrowIdx = directionPart.indexOf('--->')
        const leftArrowIdx = directionPart.indexOf('<---')
        const leftInfoIdx = directionPart.indexOf('i)')
        const rightInfoIdx = directionPart.indexOf('(i')

        if (rightArrowIdx !== -1) {
          // Right arrow: --->
          direction = 'left-to-right'
          const beforeArrow = directionPart.slice(0, rightArrowIdx).trim()
          const afterArrow = directionPart.slice(rightArrowIdx + 4).trim()

          // Determine parties based on what's immediately before and after arrow
          if (beforeArrow.endsWith('L') && afterArrow.startsWith('M')) {
            between = 'LM'
          } else if (beforeArrow.endsWith('M') && afterArrow.startsWith('R')) {
            between = 'MR'
          } else if (beforeArrow.endsWith('L') && afterArrow.startsWith('R')) {
            between = 'LR'
          }
        } else if (leftArrowIdx !== -1) {
          // Left arrow: <---
          direction = 'right-to-left'
          const beforeArrow = directionPart.slice(0, leftArrowIdx).trim()
          const afterArrow = directionPart.slice(leftArrowIdx + 4).trim()

          // For left arrows, the parties are reversed (arrow points left)
          if (beforeArrow.endsWith('L') && afterArrow.startsWith('M')) {
            between = 'LM'
          } else if (beforeArrow.endsWith('M') && afterArrow.startsWith('R')) {
            between = 'MR'
          } else if (beforeArrow.endsWith('L') && afterArrow.startsWith('R')) {
            between = 'LR'
          }
        } else if (leftInfoIdx !== -1) {
          // Left info: i)
          direction = 'info-left'
          const beforeInfo = directionPart.slice(0, leftInfoIdx).trim()
          const afterInfo = directionPart.slice(leftInfoIdx + 2).trim()

          if (beforeInfo.endsWith('L') && afterInfo.startsWith('M')) {
            between = 'LM'
          } else if (beforeInfo.endsWith('M') && afterInfo.startsWith('R')) {
            between = 'MR'
          } else if (beforeInfo.endsWith('L') && afterInfo.startsWith('R')) {
            between = 'LR'
          }
        } else if (rightInfoIdx !== -1) {
          // Right info: (i
          direction = 'info-right'
          const beforeInfo = directionPart.slice(0, rightInfoIdx).trim()
          const afterInfo = directionPart.slice(rightInfoIdx + 2).trim()

          if (beforeInfo.endsWith('L') && afterInfo.startsWith('M')) {
            between = 'LM'
          } else if (beforeInfo.endsWith('M') && afterInfo.startsWith('R')) {
            between = 'MR'
          } else if (beforeInfo.endsWith('L') && afterInfo.startsWith('R')) {
            between = 'LR'
          }
        }

        if (!direction || !between) continue

        // Create list item
        const item = document.createElement('li')
        item.classList.add('message', direction)

        // Add number span (only shown in 3-column mode)
        const numberSpan = document.createElement('span')
        numberSpan.classList.add('number')
        numberSpan.textContent = requestNum++
        item.appendChild(numberSpan)

        item.appendChild(document.createTextNode(' '))

        // Add message content - extract from HTML after the colon
        const messageHTML = requestItem.innerHTML
        const colonIdxHTML = messageHTML.indexOf(':')
        if (colonIdxHTML !== -1) {
          const messageContentHTML = messageHTML.slice(colonIdxHTML + 1).trim()
          const tempDiv = document.createElement('div')
          tempDiv.innerHTML = messageContentHTML

          // Process the content to extract icons and text properly
          const span = document.createElement('span')
          Array.from(tempDiv.childNodes).forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const extracted = extractIconAndText(node)
              extracted.forEach(el => span.appendChild(el))
            } else {
              span.appendChild(node.cloneNode(true))
            }
          })

          item.appendChild(span)
        } else {
          item.appendChild(document.createTextNode(messagePart))
        }

        // Create dummy item for spacing
        const dummy = document.createElement('li')
        dummy.classList.add('message', 'dummy')
        dummy.innerHTML = '&nbsp;'

        // Add to appropriate list
        if (between === 'LR' || between === 'LM') {
          requestListLeft.appendChild(item)
          requestListRight.appendChild(dummy.cloneNode(true))
        } else {
          requestListLeft.appendChild(dummy.cloneNode(true))
          requestListRight.appendChild(item)
        }
      }

      // Build the sequence container
      const sequence = document.createElement('div')
      sequence.classList.add('request-sequence')

      const animatedAttr = requestBlock.getAttribute('animated')
      if (animatedAttr === 'true') {
        sequence.classList.add('animated')
      }

      // Create endpoint elements
      const leftEndPoint = document.createElement('div')
      leftEndPoint.classList.add('end-point', 'left')
      leftEndPoint.innerHTML = `<h4>${leftName}</h4>`
      leftDesc.forEach(el => leftEndPoint.appendChild(el.cloneNode(true)))

      const rightEndPoint = document.createElement('div')
      rightEndPoint.classList.add('end-point', 'right')
      rightEndPoint.innerHTML = `<h4>${rightName}</h4>`
      rightDesc.forEach(el => rightEndPoint.appendChild(el.cloneNode(true)))

      requestListLeft.classList.add('requests')
      requestListRight.classList.add('requests', 'right')

      // Assemble the sequence
      sequence.appendChild(leftEndPoint)
      sequence.appendChild(requestListLeft)

      if (middleItem) {
        requestListLeft.classList.add('left')

        const middleEndPoint = document.createElement('div')
        middleEndPoint.classList.add('end-point', 'middle')
        middleEndPoint.innerHTML = `<h4>${middleName}</h4>`
        middleDesc.forEach(el => middleEndPoint.appendChild(el.cloneNode(true)))

        sequence.appendChild(middleEndPoint)
        sequence.appendChild(requestListRight)
      }

      sequence.appendChild(rightEndPoint)

      // Replace the requests tag with the formatted sequence
      requestBlock.parentNode.replaceChild(sequence, requestBlock)
    })
  }

  var docsifyRequests = function (hook) {
    hook.doneEach(function () {
      processRequests()
    })
  }

  window.$docsify = window.$docsify || {}
  window.$docsify.plugins = [].concat(docsifyRequests, window.$docsify.plugins || [])
})()

