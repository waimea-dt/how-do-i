/**
 * video-embed.js — Converts <videoembed> tags into responsive YouTube iframe embeds.
 *
 * Usage in markdown:
 *   <videoembed id="62xlzGs8LXA">
 *   <videoembed playlist id="PLkUv3HSgBKrViKy1AwpIvThl5nNBiiocu">
 *
 * No closing tag needed! The plugin automatically adds closing tags before parsing.
 *
 * Becomes:
 *   <iframe class="video youtube" src="https://www.youtube.com/embed/62xlzGs8LXA"
 *           title="Video" frameborder="0"
 *           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
 *           referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
 *   </iframe>
 */

;(function () {
  // Step 1: Add closing tags before markdown is parsed
  function addClosingTags(content) {
    // Match <videoembed ...> tags that aren't already closed
    // This regex finds opening tags that aren't followed by </videoembed>
    return content.replace(/<videoembed([^>]*)>(?![\s\S]*?<\/videoembed>)/g, '<videoembed$1></videoembed>')
  }

  // Step 2: Convert properly closed videoembed tags to iframes
  function processVideoEmbeds() {
    const videoEmbeds = document.querySelectorAll('videoembed')

    videoEmbeds.forEach((videoEmbed) => {
      // Get the video ID from the id attribute
      const videoId = videoEmbed.getAttribute('id')
      if (!videoId) return

      // Check if this is a playlist
      const isPlaylist = videoEmbed.hasAttribute('playlist')

      // Create the iframe element
      const iframe = document.createElement('iframe')
      iframe.className = 'video youtube'

      // Set the appropriate URL based on whether it's a playlist or single video
      if (isPlaylist) {
        iframe.src = `https://www.youtube.com/embed/videoseries?list=${videoId}`
        iframe.title = 'Video Playlist'
      } else {
        iframe.src = `https://www.youtube.com/embed/${videoId}`
        iframe.title = 'Video'
      }

      iframe.setAttribute('frameborder', '0')
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share')
      iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin')
      iframe.setAttribute('allowfullscreen', '')

      // Replace the videoembed tag with the iframe
      videoEmbed.parentNode.replaceChild(iframe, videoEmbed)
    })
  }

  var docsifyVideoEmbed = function (hook) {
    // Add closing tags before markdown is parsed
    hook.beforeEach(addClosingTags)
    // Convert to iframes after DOM is ready
    hook.doneEach(processVideoEmbeds)
  }

  window.$docsify = window.$docsify || {}
  window.$docsify.plugins = [].concat(docsifyVideoEmbed, window.$docsify.plugins || [])
})()
