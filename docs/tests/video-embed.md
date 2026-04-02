# Video Embeds

This page demonstrates the YouTube video embed functionality.

## Basic Video Embed

Add a YouTube video using the `<videoembed>` tag with the video ID:

<videoembed id="62xlzGs8LXA">

## Multiple Videos

You can embed multiple videos on the same page:

<videoembed id="jNQXAC9IVRw">

## Playlist Embed

Embed an entire YouTube playlist using the `playlist` attribute:

<videoembed playlist id="PLkUv3HSgBKrViKy1AwpIvThl5nNBiiocu">


## Playlist Grid

<videoembed playlist-grid id="62xlzGs8LXA,U5GZeMm5nhI,Mt3QerTMITg,NXIu-B52WPU,nZa-Vqu-_fU,V-pACEENHBw,7DfexfHzT-w,iHBgNGnTiK4,-QD0J8EfYqw,P_oSLBZABGA">


## Features

The video embed plugin:
- ✅ Creates responsive YouTube iframes
- ✅ Supports both single videos and playlists
- ✅ Supports playlist grids with interactive thumbnails
- ✅ Uses 16:9 aspect ratio
- ✅ Styled with border, shadow, and rounded corners from theme
- ✅ Maximum width of 40rem, centered (single videos)
- ✅ Full width on smaller screens
- ✅ Includes all necessary YouTube iframe attributes for proper embedding
- ✅ Fetches video titles automatically for playlist grids

## Usage

### Single Video

```markdown
<videoembed id="VIDEO_ID_HERE">
```

No closing tag needed! The plugin automatically preserves any content after the tag.

Replace `VIDEO_ID_HERE` with the YouTube video ID (the part after `watch?v=` in the URL).

For example:
- URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- Video ID: `dQw4w9WgXcQ`
- Usage: `<videoembed id="dQw4w9WgXcQ">`

### Playlist

```markdown
<videoembed playlist id="PLAYLIST_ID_HERE">
```

Replace `PLAYLIST_ID_HERE` with the YouTube playlist ID (the part after `list=` in the URL).

For example:
- URL: `https://www.youtube.com/playlist?list=PLkUv3HSgBKrViKy1AwpIvThl5nNBiiocu`
- Playlist ID: `PLkUv3HSgBKrViKy1AwpIvThl5nNBiiocu`
- Usage: `<videoembed playlist id="PLkUv3HSgBKrViKy1AwpIvThl5nNBiiocu">`

### Playlist Grid

```markdown
<videoembed playlist-grid id="VIDEO_ID1,VIDEO_ID2,VIDEO_ID3">
```

Creates an interactive grid of video thumbnails with titles, and a shared player. Clicking any thumbnail loads that video in the player.

Replace the `id` value with a comma-separated list of YouTube video IDs.

For example:
- Usage: `<videoembed playlist-grid id="62xlzGs8LXA,U5GZeMm5nhI,Mt3QerTMITg">`

The plugin automatically:
- Fetches video titles from YouTube's oembed API
- Displays thumbnails in a responsive grid
- Highlights the currently playing video
- Autoplays videos when thumbnails are clicked
