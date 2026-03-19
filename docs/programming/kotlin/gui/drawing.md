# Drawing and Custom Graphics

Swing's standard components (buttons, labels, etc.) cover most UI needs, but for games or custom visuals you often need to draw things directly — shapes, lines, grids, sprites. You do this by overriding `paintComponent()` on a `JPanel`.


## The Drawing Panel

Create a subclass of `JPanel` and override `paintComponent(g: Graphics)`. Swing calls this method automatically whenever the panel needs to be redrawn.

```kotlin
import java.awt.*
import javax.swing.*

class DrawingPanel : JPanel() {
    override fun paintComponent(g: Graphics) {
        super.paintComponent(g)        // Always call first to clear panel

        g.color = Color.RED
        g.fillRect(50, 50, 100, 80)    // Draw a filled rectangle
    }
}
```

!> Always call `super.paintComponent(g)` as the **first line**. It clears the previous frame. Skipping it causes old drawings to pile up on screen.

Use this panel as the content pane, exactly like a regular `JPanel`:

```kotlin
private val canvas = DrawingPanel()

private fun setupWindow() {
    frame.contentPane = canvas
    // ...
}
```


## The Graphics Object

`g: Graphics` is your drawing tool. Every draw call goes through it:

```kotlin
g.color = Color(0x89b4fa)           // Set the current colour (used by all draws below)

// Rectangles
g.fillRect(x, y, width, height)     // Filled rectangle
g.drawRect(x, y, width, height)     // Outline only

// Ovals and circles (use equal width/height for a circle)
g.fillOval(x, y, width, height)     // Filled oval
g.drawOval(x, y, width, height)     // Outline only

// Lines
g.drawLine(x1, y1, x2, y2)

// Text
g.font = Font(Font.SANS_SERIF, Font.BOLD, 24)
g.drawString("Hello!", x, y)        // x, y is the bottom-left of the text
```

?> All coordinates are in pixels from the top-left corner of the panel. X increases right, Y increases down.


## Using Graphics2D for More Control

Cast `g` to `Graphics2D` to unlock smoother rendering and stroke control:

```kotlin
override fun paintComponent(g: Graphics) {
    super.paintComponent(g)
    val g2 = g as Graphics2D

    // Anti-aliasing — smoother edges on shapes and text
    g2.setRenderingHint(
        RenderingHints.KEY_ANTIALIASING,
        RenderingHints.VALUE_ANTIALIAS_ON
    )

    // Draw a thick rounded rectangle
    g2.color = Color(0xf38ba8)
    g2.stroke = BasicStroke(4f)                     // 4-pixel thick outline
    g2.drawRoundRect(40, 40, 200, 120, 20, 20)      // Last two args: corner radius
}
```


## Triggering a Redraw

Swing won't redraw the panel automatically when your data changes. Call `repaint()` to tell Swing to call `paintComponent()` again:

```kotlin
private fun handleTick() {
    game.update()
    canvas.repaint()        // Triggers a fresh paint
}
```

Typically you call `repaint()` at the end of every game loop tick.


## Passing Data to the Panel

The drawing panel needs access to game state to know what to draw. Pass it in via the constructor:

```kotlin
class DrawingPanel(val game: Game) : JPanel() {
    override fun paintComponent(g: Graphics) {
        super.paintComponent(g)
        val g2 = g as Graphics2D
        g2.setRenderingHint(
            RenderingHints.KEY_ANTIALIASING,
            RenderingHints.VALUE_ANTIALIAS_ON
        )

        // Draw the player
        g2.color = Color(0xa6e3a1)
        g2.fillOval(game.playerX, game.playerY, 40, 40)

        // Draw the score
        g2.color = Color.WHITE
        g2.font = Font(Font.SANS_SERIF, Font.BOLD, 20)
        g2.drawString("Score: ${game.score}", 10, 25)
    }
}
```

In `MainWindow`, create the panel with the game object:

```kotlin
class MainWindow(val game: Game) {
    private val frame  = JFrame("Space Dodger")
    private val canvas = DrawingPanel(game)
    // ...
}
```


## Putting It Together

```kotlin
import com.formdev.flatlaf.FlatDarkLaf
import java.awt.*
import javax.swing.*

fun main() {
    FlatDarkLaf.setup()
    val game   = Game()
    val window = MainWindow(game)
    SwingUtilities.invokeLater { window.show() }
}


class Game {
    var x = 100
    var y = 100
    val size = 40

    fun moveRight() { x += 8 }
    fun moveLeft()  { x -= 8 }
    fun moveDown()  { y += 8 }
    fun moveUp()    { y -= 8 }
}


class DrawingPanel(val game: Game) : JPanel() {
    override fun paintComponent(g: Graphics) {
        super.paintComponent(g)
        val g2 = g as Graphics2D
        g2.setRenderingHint(
            RenderingHints.KEY_ANTIALIASING,
            RenderingHints.VALUE_ANTIALIAS_ON
        )

        background = Color(0x1e1e2e)

        g2.color = Color(0x89b4fa)
        g2.fillOval(game.x, game.y, game.size, game.size)
    }
}


class MainWindow(val game: Game) {
    private val frame  = JFrame("Drawing Demo")
    private val canvas = DrawingPanel(game)

    init {
        setupActions()
        setupWindow()
    }

    private fun setupActions() {
        KeyboardFocusManager.getCurrentKeyboardFocusManager()
            .addKeyEventDispatcher { e ->
                if (e.id == KeyEvent.KEY_PRESSED) {
                    when (e.keyCode) {
                        KeyEvent.VK_RIGHT -> game.moveRight()
                        KeyEvent.VK_LEFT  -> game.moveLeft()
                        KeyEvent.VK_DOWN  -> game.moveDown()
                        KeyEvent.VK_UP    -> game.moveUp()
                    }
                    canvas.repaint()
                }
                false
            }
    }

    private fun setupWindow() {
        canvas.preferredSize = Dimension(400, 400)
        frame.isResizable = false
        frame.defaultCloseOperation = JFrame.EXIT_ON_CLOSE
        frame.contentPane = canvas
        frame.pack()
        frame.setLocationRelativeTo(null)
    }

    fun show() { frame.isVisible = true }
}
```

