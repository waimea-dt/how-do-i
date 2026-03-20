# Listening and Responding to User Actions

Swing uses **listeners** to detect user interactions — clicks, key presses, mouse movement, and more. You attach a listener to a component, and Swing calls your code whenever that event happens.

All listeners are wired up in `setupActions()`, and each one calls a dedicated handler function.


## ActionListener — Responding to Clicks

The most common listener is `addActionListener`. It fires when:
- a `JButton` is clicked
- the user presses **Enter** in a `JTextField`

```kotlin
private fun setupActions() {
    submitButton.addActionListener { handleSubmit() }
    nameField.addActionListener { handleSubmit() }    // Enter key in the text field
}

private fun handleSubmit() {
    val name = nameField.text
    resultLabel.text = "Hello, $name!"
}
```

?> Always call a named handler function from the listener (e.g. `handleSubmit()`) rather than putting the logic directly in the lambda. It keeps things readable and makes it easy to call the same handler from multiple places.


## The `updateUI()` Pattern

Rather than updating individual labels or buttons scattered throughout your handler functions, collect all UI updates into a single `updateUI()` method and call it at the end of every handler:

```kotlin
private fun handleSubmit() {
    app.setName(nameField.text)     // Update the app state
    updateUI()                       // Refresh everything in one go
}

private fun updateUI() {
    resultLabel.text = "Hello, ${app.name}!"
    submitButton.isEnabled = app.name.isNotBlank()
}
```

This means you always have one place to look if the UI isn't showing the right thing.


## Mouse Listeners — Any Component

Any Swing component can respond to mouse events using `addMouseListener`. This includes labels, panels, images — not just buttons. You pass in a `MouseAdapter` and override only the events you care about:

| Method | When it fires |
|---|---|
| `mouseClicked` | Mouse button pressed and released on the component |
| `mousePressed` | Mouse button pressed down |
| `mouseReleased` | Mouse button released |
| `mouseEntered` | Mouse cursor moves onto the component |
| `mouseExited` | Mouse cursor moves off the component |

```kotlin
titleLabel.addMouseListener(object : java.awt.event.MouseAdapter() {
    override fun mouseEntered(e: java.awt.event.MouseEvent) {
        titleLabel.text = "👀"
    }
    override fun mouseExited(e: java.awt.event.MouseEvent) {
        titleLabel.text = "My App"
    }
})
```

?> `MouseAdapter` is an abstract class that provides empty implementations of all the mouse methods. You only override the ones you need — if you used the `MouseListener` interface directly, you'd have to implement all of them.


## Putting It Together

Here's the full example from the [elements page](programming/kotlin/gui/elements.md), now with actions wired up:

```kotlin
import com.formdev.flatlaf.FlatDarkLaf
import java.awt.Dimension
import java.awt.event.MouseAdapter
import java.awt.event.MouseEvent
import javax.swing.*

fun main() {
    FlatDarkLaf.setup()
    val window = MainWindow()
    SwingUtilities.invokeLater { window.show() }
}


class MainWindow {
    private val frame = JFrame("My App")
    private val panel = JPanel().apply { layout = null }

    private val titleLabel   = JLabel("What's your name?")
    private val nameField    = JTextField()
    private val submitButton = JButton("Submit")
    private val resultLabel  = JLabel("")

    init {
        setupLayout()
        setupActions()
        setupWindow()
    }

    private fun setupLayout() {
        panel.preferredSize = Dimension(340, 250)

        titleLabel.setBounds(30, 30, 280, 30)
        nameField.setBounds(30, 80, 280, 40)
        submitButton.setBounds(30, 140, 280, 40)
        resultLabel.setBounds(30, 190, 280, 30)

        panel.add(titleLabel)
        panel.add(nameField)
        panel.add(submitButton)
        panel.add(resultLabel)
    }

    private fun setupActions() {
        submitButton.addActionListener { handleSubmit() }   // fires on mouse click
        nameField.addActionListener { handleSubmit() }      // fires on Enter

        submitButton.addMouseListener(object : MouseAdapter() {
            override fun mouseEntered(e: MouseEvent) { handleHoverOn() }
            override fun mouseExited(e: MouseEvent)  { handleHoverOff() }
        })
    }

    private fun handleSubmit() {
        val name = nameField.text.trim()
        resultLabel.text = if (name.isNotBlank()) "Hello, $name!"
                                             else "Type something first!"
    }

    private fun handleHoverOn() {
        submitButton.text = "Go on then..."
    }

    private fun handleHoverOff() {
        submitButton.text = "Submit"
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

Next up: [Styling Your UI](programming/kotlin/gui/styling.md)


