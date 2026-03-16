# Saving and Loading App Data

## Saving Simple Data Values

If you are simply saving some **individual values**:

```kotlin
import java.io.File

val dataFile = "data/app-data.txt"

var name: String = "Nobody"
var level: Int = 0

fun saveData() {
    val file = File(dataFile)
    file.parentFile?.mkdirs()          // Create save folder if needed

    file.writeText("$name\n$level\n")  // Save values, one per line
}

fun loadData() {
    val file = File(dataFile)
    if (!file.exists()) return         // Bail out if no save file

    val lines = file.readLines()
    name  = lines[0]                   // Read the data values back
    level = lines[1].toInt()
}
```

Your `app-data.txt` save file will look something like:

```
Dave
42
```


## Saving a String List

If you are saving data from a **single `String` list**:

```kotlin
import java.io.File

val dataFile = "data/app-data.txt"

var names = mutableListOf<String>()

fun saveData() {
    val file = File(dataFile)
    file.parentFile?.mkdirs()                   // Create save folder if needed

    file.writeText(names.joinToString("\n"))   // Save values, one per line
}

fun loadData() {
    val file = File(dataFile)
    if (!file.exists()) return         // Bail out if no save file

    names.clear()
    names.addAll(file.readLines())     // Read lines in the file directly into list
}
```

Your `app-data.txt` save file will look something like:

```
Dave
Jenny
Kevin
Sally
```


## Saving an Int List

For a **single `Int` list** you need to convert values read in:

```kotlin
var scores = mutableListOf<Int>()

fun loadData() {
    val file = File(dataFile)
    if (!file.exists()) return

    scores.clear()
    scores.addAll(file.readLines(),map { it.toInt() })   // Read lines and convert
}
```

Your `app-data.txt` save file will look something like:

```
23
42
67
0
99
```

## Saving Multiple Lists Together

If you are saving more data from **multiple lists**:

```kotlin
import java.io.File

val dataFile = "data/app-data.txt"

var names = mutableListOf<String>()
var scores = mutableListOf<Int>()

fun saveData() {
    val file = File(dataFile)
    file.parentFile?.mkdirs()         // Create save folder if needed

    var lines = ""
    var itemCount = names.size
    for (i in 0..<itemCount) {
        lines += "${name[i]},"        // Add values, comma-separated
        lines += "${score[i]}\n"      // ... with a final newline
    }

    file.writeText(lines)             // Save the file
}

fun loadData() {
    val file = File(dataFile)
    if (!file.exists()) return        // Bail out if no save file

    val lines = file.readLines()      // Read all lines in the file

    names.clear()
    scores.clear()
    for (line in lines) {
        val items = lines.split(",")  // Extract the comma-separated items
        names.add(items[0])           // Read each line back into list
        scores.add(items[1].toInt())
    }
}
```

Your `app-data.txt` save file will look something like:

```
Dave,42
Jenny,67
Kevin,0
Sally,99
```

## Saving Complex Data (e.g. App Object)

If your data is **more complex** still, involving **`App` classes**, you will need to **serialise** your data and save it as a JSON file. There are libraries to help with this such as Google's Gson, or JetBrains's KotlinX Serializable.

Add the **Gson library** to your Gradle dependencies in `build.gradle.kts`

```kotlin
dependencies {
    implementation("com.google.code.gson:gson:2.10.1")
}
```
?> See the [Project Setup page](programming/kotlin/project.md) for details about working with Gradle


The `saveData()` and `loadData()` methods should be placed within the App/Game class:

```kotlin
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import java.io.File

val dataFile = "data/app-data.json"               // Structured JSON data format

data class Player(val name: String, val score: Int = 0)
data class Level(val number: Int, val name: String)

class App {
    var currentPlayer = Player("Test Player")     // Lots of complex properties
    var currentLevel = Level(1, "Tutorial")
    val unlockedLevels = mutableListOf<Level>()
    val topPlayers = mutableListOf<Player>()
    var highScore: Int = 0

    fun saveData() {
        val file = File(dataFile)
        file.parentFile?.mkdirs()                // Create save folder if needed

        file.writeText(gson.toJson(this))        // Write the app data as JSON
    }

    companion object {
        val gson: Gson? = GsonBuilder().setPrettyPrinting().create()

        fun loadData(): App? {
            val file = File(dataFile)
            if (!file.exists()) return null      // Bail out if missing save file

            val loadedApp = gson.fromJson(       // Load the JSON from the file
                file.readText(),
                App::class.java
            )
            return loadedApp                     // Pass back App object or null
        }
    }

    fun checkHighScore() {
        if (currentPlayer.score > highScore) {
            highScore = currentPlayer.score      // App data has been updated, so...
            saveData()                           // ... save the data
        }
    }
}


fun main() {
    val app = App.load() ?: App()   // Load existing save, or fallback fresh App

    app.saveData()                  // App data can be saved before app exit
}
```

Your `app-data.json` save file will look something like:

```json
{
  "currentPlayer": {
    "name": "Test Player",
    "score": 0
  },
  "currentLevel": {
    "number": 1,
    "name": "Tutorial"
  },
  "unlockedLevels": [
    {
      "number": 1,
      "name": "Tutorial"
    },
    {
      "number": 2,
      "name": "The Forest"
    }
  ],
  "topPlayers": [
    "Dana",
    "Jimmy"
  ],
  "highScore": 12345
}
```

