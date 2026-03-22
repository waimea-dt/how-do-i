# Using Timers

Swing's `Timer`(kotlin) class lets you run code on a regular interval - without blocking the UI or spawning threads manually. It fires on the Event Dispatch Thread, so it's safe to update UI components directly from a timer callback.

Common uses:
- A **game loop** that moves things and redraws the screen every tick
- A **countdown** that updates a label every second
- A **one-shot delay** that triggers something after a pause


## The Basics

Create a `Timer`(kotlin) with a delay in milliseconds and a listener. Wire the listener in `setupActions()`(kotlin) using a named handler, just like a button:

```kotlin
private val tickTimer = Timer(100, null)    // fires every 100ms

private fun setupActions() {
    tickTimer.addActionListener { handleTick() }
}

private fun handleTick() {
    // Called every 100ms while the timer is running
}
```

Control the timer with:

| Method | What it does |
|---|---|
| `tickTimer.start()`(kotlin) | Start firing |
| `tickTimer.stop()`(kotlin) | Stop firing |
| `tickTimer.restart()`(kotlin) | Reset and start again from zero |
| `tickTimer.isRunning`(kotlin) | `true`(kotlin) if currently running |

> [!TIP]
> Declare the timer at class level (not inside a function) so you can start and stop it from anywhere in the class.


## Regular Events - Game Loop

For a game loop, start the timer when the game begins and let it run. Each tick, update the game state and then call `updateUI()`(kotlin):

```kotlin
private val gameTimer = Timer(50, null)     // ~20 ticks per second

init {
    setupLayout()
    setupStyles()
    setupActions()
    setupWindow()
}

private fun setupActions() {
    startButton.addActionListener { handleStart() }
    gameTimer.addActionListener { handleTick() }
}

private fun handleStart() {
    game.reset()
    gameTimer.start()
    updateUI()
}

private fun handleTick() {
    game.update()           // Advance the game state
    updateUI()              // Reflect it on screen

    if (game.isOver()) {
        gameTimer.stop()
    }
}
```


## Countdown Timer

A countdown keeps track of remaining time and decrements it each second. When it hits zero, stop the timer and react:

```kotlin
private var secondsLeft = 30
private val countdownTimer = Timer(1000, null)  // fires every 1 second

private fun setupActions() {
    startButton.addActionListener { handleStart() }
    countdownTimer.addActionListener { handleCountdownTick() }
}

private fun handleStart() {
    secondsLeft = 30
    countdownTimer.start()
    updateUI()
}

private fun handleCountdownTick() {
    secondsLeft--
    updateUI()

    if (secondsLeft <= 0) {
        countdownTimer.stop()
        handleTimeUp()
    }
}

private fun handleTimeUp() {
    timerLabel.text = "Time's up!"
    // disable buttons, show game over screen, etc.
}

private fun updateUI() {
    timerLabel.text = "Time: $secondsLeft"
}
```


## One-Shot Delay

To run something once after a delay (rather than repeatedly), set `Timer.isRepeats = false`(kotlin). The timer fires once and stops automatically:

```kotlin
private val feedbackTimer = Timer(1500, null).apply { isRepeats = false }

private fun setupActions() {
    submitButton.addActionListener { handleSubmit() }
    feedbackTimer.addActionListener { clearFeedback() }
}

private fun handleSubmit() {
    feedbackLabel.text = "Saved!"
    feedbackTimer.restart()     // Show for 1.5s, then clear
}

private fun clearFeedback() {
    feedbackLabel.text = ""
}
```

> [!TIP]
> Use `restart()`(kotlin) rather than `start()`(kotlin) for one-shot timers - it resets the delay each time, so rapid clicks don't cause the feedback to disappear too soon.




