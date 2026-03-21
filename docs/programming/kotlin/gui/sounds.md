# Adding Sounds to Your UI

Swing doesn't have a dedicated sound API, but the Java standard library includes `javax.sound.sampled` which handles WAV audio. It's a bit verbose, but it works well for playing short sound effects.

> [!IMPORTANT]
> Only **WAV** files are supported out of the box. For MP3 support you'd need a third-party library. For simple click sounds and effects, WAV is fine.


## Where to Put Sound Files

Like images, sounds go in your project's `resources` folder:

```
src/
└── main/
    └── resources/
        └── sounds/
            ├── click.wav
            ├── boom.wav
            └── powerup.wav
```


## Playing a Single Sound

To play a WAV file, open an `AudioInputStream` from the file, get a `Clip`, open it, and start it. Auto-close the clip when it finishes using a `LineListener`:

```kotlin
import javax.sound.sampled.AudioSystem
import javax.sound.sampled.LineEvent

fun playSound(name: String) {
    val stream = AudioSystem.getAudioInputStream(
        ClassLoader.getSystemResourceAsStream("sounds/$name")
    )
    AudioSystem.getClip().apply {
        open(stream)
        start()
        addLineListener { if (it.type == LineEvent.Type.STOP) close() }
    }
}
```

The `addLineListener` call ensures the clip releases its resources as soon as it finishes playing - without this, you'll leak audio resources every time a sound plays.


## Preloading Sounds

Loading a file from disk takes a small amount of time. If you do it on the fly when a button is clicked, you may get a noticeable delay before the sound plays. The fix is to **preload** all your sounds at startup by reading them into memory as `ByteArray`s:

```kotlin
private val clickSound: ByteArray =
    ClassLoader.getSystemResourceAsStream("sounds/click.wav")!!.readBytes()
```

Then play from memory rather than from disk:

```kotlin
fun playSound(bytes: ByteArray) {
    val stream = AudioSystem.getAudioInputStream(bytes.inputStream())
    AudioSystem.getClip().apply {
        open(stream)
        start()
        addLineListener { if (it.type == LineEvent.Type.STOP) close() }
    }
}
```


## Preloading Multiple Sounds

If you have several sound effects, preload them all into a list at class level:

```kotlin
private val soundEffects: List<ByteArray> = listOf("click.wav", "boom.wav", "powerup.wav")
    .map { name -> ClassLoader.getSystemResourceAsStream("sounds/$name")!!.readBytes() }
```

You can then play a specific one by index, or pick one at random:

```kotlin
playSound(soundEffects[0])          // Always play "click.wav"
playSound(soundEffects.random())    // Play a random effect
```


## Putting It Together

```kotlin
import com.formdev.flatlaf.FlatDarkLaf
import java.awt.Font
import javax.sound.sampled.AudioSystem
import javax.sound.sampled.LineEvent
import javax.swing.*

fun main() {
    FlatDarkLaf.setup()
    val window = MainWindow()
    SwingUtilities.invokeLater { window.show() }
}


class MainWindow {
    private val frame = JFrame("Sound Demo")
    private val panel = JPanel().apply { layout = null }

    private val clickSound   = ClassLoader.getSystemResourceAsStream("sounds/click.wav")!!.readBytes()
    private val successSound = ClassLoader.getSystemResourceAsStream("sounds/success.wav")!!.readBytes()

    private val clickButton   = JButton("Click me!")
    private val successButton = JButton("Success!")

    init {
        setupLayout()
        setupStyles()
        setupActions()
        setupWindow()
    }

    private fun setupLayout() {
        panel.preferredSize = java.awt.Dimension(300, 160)

        clickButton.setBounds(30, 40, 240, 40)
        successButton.setBounds(30, 100, 240, 40)

        panel.add(clickButton)
        panel.add(successButton)
    }

    private fun setupStyles() {
        clickButton.font   = Font(Font.SANS_SERIF, Font.PLAIN, 18)
        successButton.font = Font(Font.SANS_SERIF, Font.PLAIN, 18)
    }

    private fun setupActions() {
        clickButton.addActionListener   { playSound(clickSound) }
        successButton.addActionListener { playSound(successSound) }
    }

    private fun playSound(bytes: ByteArray) {
        val stream = AudioSystem.getAudioInputStream(bytes.inputStream())
        AudioSystem.getClip().apply {
            open(stream)
            start()
            addLineListener { if (it.type == LineEvent.Type.STOP) close() }
        }
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

