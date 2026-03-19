# Creating a Window in Swing

The [Swing intro page](programming/kotlin/gui/swing.md) showed the absolute bare minimum to get a window on screen. That's fine for a quick test, but a real app needs a bit more thought — choosing the right size, centering it on screen, making sure it closes properly, and keeping the code organised.

This page shows how to structure a window the right way, ready for content to be added.


## The Window Class Pattern

Rather than writing everything inside `main()`, it's better to wrap the window in its own class. This keeps things tidy and makes it easy to pass data in or call methods on the window later.

```kotlin
import com.formdev.flatlaf.FlatDarkLaf
import javax.swing.*

fun main() {
    FlatDarkLaf.setup()                     // Apply the theme before creating any windows

    val window = MainWindow()               // Create the window object
    SwingUtilities.invokeLater { window.show() }    // Show it on the UI thread
}


class MainWindow {
    private val frame = JFrame("My App")
    private val panel = JPanel().apply { layout = null }

    init {
        setupWindow()
    }

    private fun setupWindow() {
        frame.isResizable = false                           // Fixed size — no resizing
        frame.defaultCloseOperation = JFrame.EXIT_ON_CLOSE  // Quit when closed
        frame.contentPane = panel                           // Use our panel as the content
        frame.pack()
        frame.setLocationRelativeTo(null)                   // Centre on screen
    }

    fun show() {
        frame.isVisible = true
    }
}
```

?> `SwingUtilities.invokeLater` makes sure the window is created on the correct thread. Swing is not thread-safe, so all UI work should happen on the **Event Dispatch Thread (EDT)**. This one line handles that for you.


## Key Window Settings

Here's what each setting in `setupWindow()` does and why it matters:

| Setting | What it does |
|---|---|
| `frame.isResizable = false` | Prevents the user from dragging the window edges to resize it |
| `frame.defaultCloseOperation = JFrame.EXIT_ON_CLOSE` | Exits the program when the window is closed (rather than just hiding it) |
| `frame.contentPane = panel` | Replaces the default content area with your own `JPanel` |
| `frame.pack()` | Sizes the window to fit its contents (uses `panel.preferredSize`) |
| `frame.setLocationRelativeTo(null)` | Centres the window on the screen |


## Setting the Window Size

With a null-layout panel, you control the exact size using `preferredSize`. Call `frame.pack()` after setting this and it will size the window to match:

```kotlin
private fun setupLayout() {
    panel.preferredSize = java.awt.Dimension(400, 300)  // width x height in pixels
}
```

?> Always call `pack()` *after* setting `preferredSize`, and `setLocationRelativeTo(null)` *after* `pack()` — otherwise it won't have the correct size to centre from.


## The Null Layout

By default, Swing panels use a **layout manager** that automatically positions and sizes components for you. For these projects, we turn that off with `layout = null` so we can place everything exactly where we want it using coordinates:

```kotlin
private val panel = JPanel().apply { layout = null }
```

Once the layout is null, every component you add needs its position and size set manually using `setBounds(x, y, width, height)`. You'll see this in action on the [adding elements](programming/kotlin/gui/elements.md) page.


## A Complete Starter Window

Here's the full pattern — with `setupLayout()` stubbed in ready for content, and a background colour set on the panel:

```kotlin
import com.formdev.flatlaf.FlatDarkLaf
import java.awt.Color
import java.awt.Font
import javax.swing.*

fun main() {
    FlatDarkLaf.setup()

    val window = MainWindow()
    SwingUtilities.invokeLater { window.show() }
}


class MainWindow {
    private val frame = JFrame("My App")
    private val panel = JPanel().apply { layout = null }

    init {
        setupLayout()
        setupWindow()
    }

    private fun setupLayout() {
        panel.preferredSize = java.awt.Dimension(400, 300)
        panel.background = Color(0x1e1e2e)
    }

    private fun setupWindow() {
        frame.isResizable = false
        frame.defaultCloseOperation = JFrame.EXIT_ON_CLOSE
        frame.contentPane = panel
        frame.pack()
        frame.setLocationRelativeTo(null)
    }

    fun show() {
        frame.isVisible = true
    }
}
```

This gives you a clean, centred, correctly-sized window with a custom background colour — ready to have components added to it.

?> The `init` block calls setup methods in order: layout first, then window configuration. This order matters — `setupWindow()` needs the panel to already have its `preferredSize` set before `pack()` is called.

Next up: [Adding UI Elements](programming/kotlin/gui/elements.md)
