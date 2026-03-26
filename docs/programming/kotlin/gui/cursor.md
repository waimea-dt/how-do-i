# Changing the Mouse Cursor

By default, Swing uses the standard arrow cursor everywhere. You can change the cursor for any component to give users a visual hint about what they can do - a hand over a clickable element, a crosshair over a draw area, and so on.


## Setting a Cursor

Use `cursor`(kotlin) with `Cursor.getPredefinedCursor()`(kotlin), passing one of the cursor type constants:

```kotlin
import java.awt.Cursor

cookieButton.cursor = Cursor.getPredefinedCursor(Cursor.HAND_CURSOR)
```

Set this in `setupStyles()`(kotlin) alongside fonts and colours.


## Available Cursor Types

| Constant | Looks like | Typical use |
|---|---|---|
| `Cursor.DEFAULT_CURSOR`(kotlin) | Arrow | Default - most components |
| `Cursor.HAND_CURSOR`(kotlin) | Hand / pointer | Clickable buttons, links |
| `Cursor.CROSSHAIR_CURSOR`(kotlin) | Crosshair | Drawing or selection areas |
| `Cursor.TEXT_CURSOR`(kotlin) | I-beam | Text input fields |
| `Cursor.WAIT_CURSOR`(kotlin) | Spinner / hourglass | Loading or busy state |
| `Cursor.MOVE_CURSOR`(kotlin) | Four-way arrow | Draggable elements |
| `Cursor.N_RESIZE_CURSOR`(kotlin) | Resize arrows | Resize handles (N S E W, etc.) |


## Cursor for the Whole Window

To change the cursor across the entire window (e.g. to a wait cursor while loading), set it on the content panel:

```kotlin
panel.cursor = Cursor.getPredefinedCursor(Cursor.WAIT_CURSOR)
```

Restore it afterwards:

```kotlin
panel.cursor = Cursor.getPredefinedCursor(Cursor.DEFAULT_CURSOR)
```


## Example: Styled Cursor

```kotlin
private fun setupStyles() {
    // Show a hand cursor when hovering over clickable elements
    cookieButton.cursor  = Cursor.getPredefinedCursor(Cursor.HAND_CURSOR)
    shopButton.cursor    = Cursor.getPredefinedCursor(Cursor.HAND_CURSOR)

    // Show a crosshair over the game canvas
    gamePanel.cursor     = Cursor.getPredefinedCursor(Cursor.CROSSHAIR_CURSOR)
}
```

> [!NOTE]
> Cursor changes are purely cosmetic - they don't affect how events work. A label with a `HAND_CURSOR`(kotlin) doesn't automatically become clickable; you still need to add a listener.

