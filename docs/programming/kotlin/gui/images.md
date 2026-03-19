# Adding Images to Your UI

Swing uses `ImageIcon` to display images. You can put one on a `JLabel` or a `JButton` — both support icons out of the box.


## Where to Put Image Files

Images should go in your project's `resources` folder, which gets bundled into the final build. In a Gradle project this is:

```
src/
└── main/
    └── resources/
        └── images/
            ├── player.png
            └── background.png
```

?> Use PNG for images that need transparency, and JPG for photos. Avoid GIF unless you need animation.


## Loading an Image

Load images using `ClassLoader.getSystemResource()`, which finds files from the resources folder regardless of where the app is run from. Wrap it in `ImageIcon`:

```kotlin
val icon = ImageIcon(ClassLoader.getSystemResource("images/player.png"))
```

!> Don't use a plain file path like `ImageIcon("src/main/resources/images/player.png")` — this breaks when the app is packaged into a JAR. Always use `ClassLoader`.


## Scaling Images

The image you load will be its original size. To display it at a different size, scale it using `getScaledInstance()`:

```kotlin
val icon = ImageIcon(ClassLoader.getSystemResource("images/player.png"))
val scaled = ImageIcon(icon.image.getScaledInstance(120, 120, java.awt.Image.SCALE_SMOOTH))
```

`SCALE_SMOOTH` produces the best quality result. The alternative `SCALE_FAST` is quicker but lower quality.

Since you'll do this a lot, it's worth adding a small extension function at the top of your file:

```kotlin
fun ImageIcon.scaled(width: Int, height: Int): ImageIcon =
    ImageIcon(image.getScaledInstance(width, height, java.awt.Image.SCALE_SMOOTH))
```

Then scaling becomes a one-liner:

```kotlin
val icon = ImageIcon(ClassLoader.getSystemResource("images/player.png")).scaled(120, 120)
```


## Declaring Icons at Class Level

Load icons as class-level properties so they're created once at startup, not every time the UI updates. Recreating `ImageIcon` objects repeatedly is slow:

```kotlin
class MainWindow {
    private val playerIcon = ImageIcon(ClassLoader.getSystemResource("images/player.png")).scaled(120, 120)
    private val playerIconHit = ImageIcon(ClassLoader.getSystemResource("images/player-hit.png")).scaled(120, 120)
    // ...
}
```


## Images on a JLabel

Set the `icon` property on a `JLabel`. You can have an icon alongside text, or just the icon on its own:

```kotlin
// Icon only
val avatarLabel = JLabel(playerIcon)

// Icon with text below it
val avatarLabel = JLabel("Player One", playerIcon, SwingConstants.CENTER)
avatarLabel.horizontalTextPosition = SwingConstants.CENTER
avatarLabel.verticalTextPosition   = SwingConstants.BOTTOM
```

Swap the icon at any time — useful for animation or state changes:

```kotlin
avatarLabel.icon = playerIconHit    // Switch to the "hit" frame
avatarLabel.icon = playerIcon       // Switch back
```


## Images on a JButton

`JButton` also has an `icon` property. This is handy for image buttons — a cookie to click, a card to flip, and so on. You can show text on top of the image by setting the text position:

```kotlin
val cookieButton = JButton(cookieIcon)

// Or: icon with text overlaid on top
cookieButton.icon = cookieIcon
cookieButton.text = "×3"
cookieButton.verticalTextPosition   = SwingConstants.CENTER
cookieButton.horizontalTextPosition = SwingConstants.CENTER
```

To make the button look like just the image (no border or background):

```kotlin
cookieButton.isBorderPainted      = false
cookieButton.isFocusPainted       = false
cookieButton.isContentAreaFilled  = false
```


## Putting It Together

```kotlin
import com.formdev.flatlaf.FlatDarkLaf
import java.awt.Font
import java.awt.Image
import javax.swing.*

fun ImageIcon.scaled(width: Int, height: Int): ImageIcon =
    ImageIcon(image.getScaledInstance(width, height, Image.SCALE_SMOOTH))


fun main() {
    FlatDarkLaf.setup()
    val window = MainWindow()
    SwingUtilities.invokeLater { window.show() }
}


class MainWindow {
    private val frame = JFrame("Image Demo")
    private val panel = JPanel().apply { layout = null }

    private val trophyIcon = ImageIcon(ClassLoader.getSystemResource("images/trophy.png")).scaled(80, 80)
    private val coinIcon   = ImageIcon(ClassLoader.getSystemResource("images/coin.png")).scaled(120, 120)

    private val trophyLabel = JLabel("Top Score!", trophyIcon, SwingConstants.LEFT)
    private val coinButton  = JButton(coinIcon)

    init {
        setupLayout()
        setupStyles()
        setupWindow()
    }

    private fun setupLayout() {
        panel.preferredSize = java.awt.Dimension(300, 280)

        trophyLabel.setBounds(30, 20, 240, 80)
        coinButton.setBounds(90, 130, 120, 120)

        panel.add(trophyLabel)
        panel.add(coinButton)
    }

    private fun setupStyles() {
        trophyLabel.font                = Font(Font.SANS_SERIF, Font.BOLD, 22)
        trophyLabel.horizontalTextPosition = SwingConstants.RIGHT

        coinButton.isBorderPainted     = false
        coinButton.isFocusPainted      = false
        coinButton.isContentAreaFilled = false
    }

    private fun setupWindow() {
        frame.isResizable = false
        frame.defaultCloseOperation = JFrame.EXIT_ON_CLOSE
        frame.contentPane = panel
        frame.pack()
        frame.setLocationRelativeTo(null)
    }

    fun show() { frame.isVisible = true }
}
```
