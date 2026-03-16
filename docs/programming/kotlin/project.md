# Project Setup in IntelliJ IDEA with Gradle

Create a new project in IntelliJ IDEA:
- **Kotlin** project
- a recent **JDK** (Java 21 is the current stable version)
- a suitable **save location**
- select **Gradle** as the build system
- select the option to start with some **sample code**

!> You must select **Gradle** as the build system - This is the recommended way to manage Kotlin projects. Gradle is a build automation tool which handles compiling code, managing dependencies, running tests, and packaging applications.

![New IntelliJ project](_assets/new-project.png)

The project structure of a Gradle project is a little different to a simple IntelliJ build project, with Main.kt within the **src → main → kotlin** folder, and a `build.gradle.kts` file controlling the project:

![Gradle folder structure](_assets/gradle-folders.png)

## Gradle Setup File, `build.gradle.kts`

Edit the `build.gradle.kts` file to have the following code:

```kotlin
plugins {
    kotlin("jvm") version "2.3.0"
    application
}

repositories {
    mavenCentral()
}

kotlin {
    jvmToolchain(21)
}

application {
    mainClass = "MainKt"
}

dependencies {
    // this is where you will list external libraries
}
```

Then update Gradle by clicking the sync button that appears at the top-right:

![Gradle sync button](_assets/gradle-sync.png)

?> You can safely delete the `test` folder and its contents from your project (this is for unit-testing, which we won't cover)

