/**
 * video-embed.js — Converts <videoembed> tags into responsive YouTube iframe embeds.
 *
 * Usage in markdown:
 *   <videoembed id="62xlzGs8LXA">
 *   <videoembed playlist id="PLkUv3HSgBKrViKy1AwpIvThl5nNBiiocu">
 *   <videoembed playlist-grid id="VIDEO_ID1,VIDEO_ID2,VIDEO_ID3">
 *
 * No closing tag needed! The plugin automatically adds closing tags before parsing.
 *
 * Becomes:
 *   Single video - <iframe class="video youtube" src="https://www.youtube.com/embed/62xlzGs8LXA"...>
 *   Playlist - <iframe class="video youtube" src="https://www.youtube.com/embed/videoseries?list=...">
 *   Playlist Grid - Interactive grid of thumbnails with a shared player
 */

;(function () {
  // Step 1: Add closing tags before markdown is parsed
  function addClosingTags(content) {
    // Match <videoembed ...> tags that aren't already closed
    // This regex finds opening tags that aren't followed by </videoembed>
    return content.replace(/<videoembed([^>]*)>(?![\s\S]*?<\/videoembed>)/g, '<videoembed$1></videoembed>')
  }

  // Step 2: Convert properly closed videoembed tags to iframes
  async function processVideoEmbeds() {
    const videoEmbeds = document.querySelectorAll('videoembed')

    for (const videoEmbed of videoEmbeds) {
      // Get the video ID from the id attribute
      const videoId = videoEmbed.getAttribute('id')
      if (!videoId) continue

      // Check what type of embed this is
      const isPlaylist = videoEmbed.hasAttribute('playlist')
      const isPlaylistGrid = videoEmbed.hasAttribute('playlist-grid')

      if (isPlaylistGrid) {
        await processPlaylistGrid(videoEmbed, videoId)
      } else {
        processSingleOrPlaylist(videoEmbed, videoId, isPlaylist)
      }
    }
  }

  // Process single video or playlist embed
  function processSingleOrPlaylist(videoEmbed, videoId, isPlaylist) {
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
  }

  // Process playlist-grid embed
  async function processPlaylistGrid(videoEmbed, videoIds) {
    const ids = videoIds.split(',').map(id => id.trim()).filter(id => id)
    if (ids.length === 0) return

    // Create container
    const container = document.createElement('div')
    container.className = 'playlist-grid-container'

    // Create iframe for playing videos
    const iframe = document.createElement('iframe')
    iframe.className = 'video youtube playlist-grid-player'
    iframe.src = `https://www.youtube.com/embed/${ids[0]}`
    iframe.title = 'Video Player'
    iframe.setAttribute('frameborder', '0')
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share')
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin')
    iframe.setAttribute('allowfullscreen', '')

    // Create grid for thumbnails
    const grid = document.createElement('div')
    grid.className = 'playlist-grid'

    // Fetch video info and create thumbnails
    for (const id of ids) {
      const item = document.createElement('div')
      item.className = 'playlist-grid-item'
      item.dataset.videoId = id

      // Create thumbnail
      const thumbnail = document.createElement('img')
      thumbnail.src = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
      thumbnail.alt = 'Video thumbnail'
      thumbnail.className = 'playlist-grid-thumbnail'
      thumbnail.loading = 'lazy'

      // Create title (fetch from oembed)
      const title = document.createElement('div')
      title.className = 'playlist-grid-title'
      title.textContent = 'Loading...'

      // Add click handler to load video
      item.addEventListener('click', () => {
        iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1`

        // Update active state
        grid.querySelectorAll('.playlist-grid-item').forEach(el => el.classList.remove('active'))
        item.classList.add('active')
      })

      item.appendChild(thumbnail)
      item.appendChild(title)
      grid.appendChild(item)

      // Fetch video title asynchronously
      fetchVideoTitle(id).then(videoTitle => {
        if (videoTitle) {
          title.textContent = videoTitle
        } else {
          title.textContent = id
        }
      })
    }

    // Mark first item as active
    grid.firstChild?.classList.add('active')

    // Assemble container
    container.appendChild(iframe)
    container.appendChild(grid)

    // Replace the videoembed tag
    videoEmbed.parentNode.replaceChild(container, videoEmbed)
  }

  // Fetch video title from YouTube oembed API
  async function fetchVideoTitle(videoId) {
    try {
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
      if (response.ok) {
        const data = await response.json()
        return data.title
      }
    } catch (error) {
      console.warn(`Failed to fetch title for video ${videoId}:`, error)
    }
    return null
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
