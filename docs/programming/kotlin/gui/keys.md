# Responding to Key Presses

Adding a `KeyListener`(kotlin) to a button or label only works if that component currently has **focus** - the thing that determines which element receives keyboard input. In a game or interactive app, you usually want keys to work regardless of what's focused.

There are two good ways to do this in Swing.


## Approach 1: KeyboardFocusManager (recommended)

`KeyboardFocusManager`(kotlin) sits at the top of Swing's event pipeline. Adding a `KeyEventDispatcher`(kotlin) to it means you see **every key event** in the app before any component does.

```kotlin
import java.awt.KeyboardFocusManager
import java.awt.event.KeyEvent

private fun setupActions() {
    KeyboardFocusManager.getCurrentKeyboardFocusManager()
        .addKeyEventDispatcher { e ->
            if (e.id == KeyEvent.KEY_PRESSED) {
                handleKeyPress(e.keyCode)
            }
            false   // Return false to let the event continue to other components
        }
}

private fun handleKeyPress(keyCode: Int) {
    when (keyCode) {
        KeyEvent.VK_W, KeyEvent.VK_UP    -> movePlayer(0, -1)
        KeyEvent.VK_S, KeyEvent.VK_DOWN  -> movePlayer(0, 1)
        KeyEvent.VK_A, KeyEvent.VK_LEFT  -> movePlayer(-1, 0)
        KeyEvent.VK_D, KeyEvent.VK_RIGHT -> movePlayer(1, 0)
    }
}
```

> [!NOTE]
> Returning `false`(kotlin) from the dispatcher lets the event carry on to whichever component normally would have received it. Return `true`(kotlin) to consume it (i.e. stop it going anywhere else) - useful if you don't want WASD keys typing into a text field.


## Key Codes

Use the constants on `KeyEvent`(kotlin) to identify keys - don't compare against character literals, as key codes represent physical keys rather than characters:

| Key | Constant |
|---|---|
| W A S D | `VK_W`(kotlin) `VK_A`(kotlin) `VK_S`(kotlin) `VK_D`(kotlin) |
| Arrow keys | `VK_UP`(kotlin) `VK_DOWN`(kotlin) `VK_LEFT`(kotlin) `VK_RIGHT`(kotlin) |
| Space | `VK_SPACE`(kotlin) |
| Enter | `VK_ENTER`(kotlin) |
| Escape | `VK_ESCAPE`(kotlin) |
| 0–9 | `VK_0`(kotlin) … `VK_9`(kotlin) |
| F1–F12 | `VK_F1`(kotlin) … `VK_F12`(kotlin) |

Check for modifier keys (Shift, Ctrl, etc.) using the event's modifier flags:

```kotlin
if (e.isShiftDown) { /* shift was held */ }
if (e.isControlDown) { /* ctrl was held */ }
```


## Approach 2: Key Bindings (window-scoped)

Swing's **key bindings** system lets you attach an action to a key on a specific component, but with the `WHEN_IN_FOCUSED_WINDOW`(kotlin) condition it fires whenever the **window** is focused - regardless of which element is selected. It's a good fit for a small number of specific shortcuts.

```kotlin
import javax.swing.AbstractAction
import javax.swing.KeyStroke

private fun setupActions() {
    // Bind the Escape key to close/pause the app
    val escapeAction = object : AbstractAction() {
        override fun actionPerformed(e: java.awt.event.ActionEvent) {
            handleEscape()
        }
    }

    panel.getInputMap(JComponent.WHEN_IN_FOCUSED_WINDOW)
        .put(KeyStroke.getKeyStroke(KeyEvent.VK_ESCAPE, 0), "escape")
    panel.actionMap.put("escape", escapeAction)
}
```

Use `WHEN_IN_FOCUSED_WINDOW`(kotlin) rather than `WHEN_FOCUSED`(kotlin) - the latter only fires if the panel itself has focus, which defeats the purpose.

> [!TIP]
> Key bindings are better for hotkeys (Escape, F5, Ctrl+Z). For continuous directional input like WASD, `KeyboardFocusManager`(kotlin) is simpler to work with.


## Tracking Held Keys

`KEY_PRESSED`(kotlin) fires once when a key goes down, then repeats after a short delay. For smooth game movement, track which keys are *currently held* using a set, updating it on both press and release:

```kotlin
private val heldKeys = mutableSetOf<Int>()

private fun setupActions() {
    KeyboardFocusManager.getCurrentKeyboardFocusManager()
        .addKeyEventDispatcher { e ->
            when (e.id) {
                KeyEvent.KEY_PRESSED  -> heldKeys.add(e.keyCode)
                KeyEvent.KEY_RELEASED -> heldKeys.remove(e.keyCode)
            }
            false
        }
}

private fun gameLoop() {
    // Called on a timer (see the Timers page)
    val dx = when {
        KeyEvent.VK_A in heldKeys -> -1
        KeyEvent.VK_D in heldKeys ->  1
        else -> 0
    }
    val dy = when {
        KeyEvent.VK_W in heldKeys -> -1
        KeyEvent.VK_S in heldKeys ->  1
        else -> 0
    }
    movePlayer(dx, dy)
}
```

See the [timers page](programming/kotlin/gui/timers.md) for how to set up a game loop timer that calls `gameLoop()`(kotlin) repeatedly.

