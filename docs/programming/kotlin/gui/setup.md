# Setting up a Swing/FlatLAF GUI Project

Follow the [Project Setup](programming/kotlin/project.md) to create a new Kotlin project that uses Gradle as the build system.

## Adding the FlatLAF Libraries via Gradle

The FlatLAF library is a third-party library and needs to be added via the Gradle build system. Add the following dependencies to your `build.gradle.kts`:

```kotlin
dependencies {
    implementation("com.formdev:flatlaf:3.6.2")
    implementation("com.formdev:flatlaf-intellij-themes:3.6.2")
}
```

> [!IMPORTANT]
> Make sure to update/sync your Gradle config by clicking the sync pop-up button

## Testing Your Config

Add the following code to your `Main.kt`:

```kotlin
import com.formdev.flatlaf.intellijthemes.FlatSolarizedDarkIJTheme
import java.awt.Font
import javax.swing.*

fun main() {
    FlatSolarizedDarkIJTheme.setup()

    val frame = JFrame("TESTING...")
    val panel = JPanel()

    frame.defaultCloseOperation = JFrame.EXIT_ON_CLOSE
    frame.setSize(500, 150)
    frame.setLocationRelativeTo(null)
    frame.contentPane = panel

    val message = JLabel("Hello, World!")
    message.font = Font(Font.SANS_SERIF, Font.BOLD, 48)

    panel.add(message)

    frame.isVisible = true
}
```

When you run your program, you should see an app window appear in the centre of your screen, using the FlatLAF look-and-feel and the Solarized Dark theme:

![FlatLAF Demo](_assets/demo.png)
