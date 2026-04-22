/**
 * docsify-sequence.js - Renders <sequence>...</sequence> blocks as horizontal or vertical step sequences.
 *
 * Attributes:
 *   - direction: "horizontal" (default) or "vertical"
 *   - animated: "true" to enable animation effects
 *
 * Usage in markdown:
 *   <sequence direction="horizontal">
 *   1. Step one content
 *   2. Step two content
 *   3. Step three content
 *   </sequence>
 */

;(function () {
  function processSequences() {
    const sequenceBlocks = document.querySelectorAll('.markdown-section sequence')

    sequenceBlocks.forEach((sequenceBlock) => {
      // Find the OL element inside the sequence tag
      const seqList = sequenceBlock.querySelector('ol')
      if (!seqList) return

      // Get attributes before we move things around
      const dirAttr = sequenceBlock.getAttribute('direction')
      const direction = (dirAttr && dirAttr.startsWith('vertical')) ? 'vertical' : 'horizontal'
      const animatedAttr = sequenceBlock.getAttribute('animated')

      // Add classes to the OL
      seqList.classList.add('sequence')
      seqList.classList.add(direction)
      if (animatedAttr === 'true') {
        seqList.classList.add('animated')
      }

      // Add sequence-item class to each list item
      for (const seqItem of seqList.children) {
        seqItem.classList.add('sequence-item')
      }

      // Replace the sequence tag with the formatted OL
      sequenceBlock.parentNode.replaceChild(seqList, sequenceBlock)
    })
  }

  var docsifySequence = function (hook) {
    hook.doneEach(function () {
      processSequences()
    })
  }

  window.$docsify = window.$docsify || {}
  window.$docsify.plugins = [].concat(docsifySequence, window.$docsify.plugins || [])
})()

