# Changing the Mouse Cursor

By default, Swing uses the standard arrow cursor everywhere. You can change the cursor for any component to give users a visual hint about what they can do — a hand over a clickable element, a crosshair over a draw area, and so on.


## Setting a Cursor

Use `cursor` with `Cursor.getPredefinedCursor()`, passing one of the cursor type constants:

```kotlin
import java.awt.Cursor

cookieButton.cursor = Cursor.getPredefinedCursor(Cursor.HAND_CURSOR)
```

Set this in `setupStyles()` alongside fonts and colours.


## Available Cursor Types

| Constant | Looks like | Typical use |
|---|---|---|
| `Cursor.DEFAULT_CURSOR` | Arrow | Default — most components |
| `Cursor.HAND_CURSOR` | Hand / pointer | Clickable buttons, links |
| `Cursor.CROSSHAIR_CURSOR` | Crosshair | Drawing or selection areas |
| `Cursor.TEXT_CURSOR` | I-beam | Text input fields |
| `Cursor.WAIT_CURSOR` | Spinner / hourglass | Loading or busy state |
| `Cursor.MOVE_CURSOR` | Four-way arrow | Draggable elements |
| `Cursor.N_RESIZE_CURSOR` | Resize arrows | Resize handles (N S E W, etc.) |


## Setting the Cursor for the Whole Window

To change the cursor across the entire window (e.g. to a wait cursor while loading), set it on the content panel:

```kotlin
panel.cursor = Cursor.getPredefinedCursor(Cursor.WAIT_CURSOR)
```

Restore it afterwards:

```kotlin
panel.cursor = Cursor.getPredefinedCursor(Cursor.DEFAULT_CURSOR)
```


## Example — Styled Cursor in setupStyles()

```kotlin
private fun setupStyles() {
    // Show a hand cursor when hovering over clickable elements
    cookieButton.cursor  = Cursor.getPredefinedCursor(Cursor.HAND_CURSOR)
    shopButton.cursor    = Cursor.getPredefinedCursor(Cursor.HAND_CURSOR)

    // Show a crosshair over the game canvas
    gamePanel.cursor     = Cursor.getPredefinedCursor(Cursor.CROSSHAIR_CURSOR)
}
```

?> Cursor changes are purely cosmetic — they don't affect how events work. A label with a `HAND_CURSOR` doesn't automatically become clickable; you still need to add a listener.

