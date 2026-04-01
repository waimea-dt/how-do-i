# Video Embeds

This page demonstrates the YouTube video embed functionality.

## Basic Video Embed

Add a YouTube video using the `<videoembed>` tag with the video ID:

<videoembed id="62xlzGs8LXA">

## Multiple Videos

You can embed multiple videos on the same page:

### Example 1: Rickroll Classic

<videoembed id="dQw4w9WgXcQ">

### Example 2: Another Video

<videoembed id="jNQXAC9IVRw">

## Playlist Embed

Embed an entire YouTube playlist using the `playlist` attribute:

<videoembed playlist id="PLkUv3HSgBKrViKy1AwpIvThl5nNBiiocu">

## Features

The video embed plugin:
- ✅ Creates responsive YouTube iframes
- ✅ Supports both single videos and playlists
- ✅ Uses 16:9 aspect ratio
- ✅ Styled with border, shadow, and rounded corners from theme
- ✅ Maximum width of 40rem, centered
- ✅ Full width on smaller screens
- ✅ Includes all necessary YouTube iframe attributes for proper embedding

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
