# Commenting Your Kotlin Code

Kotlin has two ways to add comments:

- **Inline comments** - a short note on a single line
- **Block comments** - a longer note spanning multiple lines

## Inline Comments `//`

Inline comments begin with a **double-slash**, `//`. Kotlin ignores everything after `//` until the end of the line.

```kotlin
// This is an inline comment

val name = "Steve"  // This is also an inline comment
// val school = "Waimea College"
```

> [!TIP]
> The final line shows **commenting out** code - useful for temporarily disabling a line without deleting it. In VS Code, <kbd>Ctrl</kbd> + <kbd>/</kbd> toggles a comment on/off for the current line.


## Block Comments `/* ... */`

Block comments begin with `/*` and end with `*/`. Everything between the markers is ignored, even across multiple lines.

```kotlin
/* This is a block comment */

/* This is a longer block comment that
   spans multiple lines. All of this
   is ignored by Kotlin. */
```


## What to Comment - and What Not To

Good comments explain the **why**, not the **what**. If the code itself clearly shows *what* it does, a comment restating that adds no value.

**Aim to write self-documenting code** - choose clear, descriptive names so the code speaks for itself:

✗ Comment explaining *what* (unnecessary - the code already says this)...

```kotlin
// Add 1 to score
score++

// Loop through players
for (player in players) {
    // Print the player
    println(player.name)
}
```

✓ Comment explaining *why* (useful - context the code can't provide)...

```kotlin
score += bonusPoints * 2    // Double points during fever mode

// Show the current player ranking
for (player in players) {
    println(player.name)
}
```

> [!TIP]
> A function or variable with a **good name often needs no comment** at all: `calculateTax(income)` is self-explanatory. Reach for a comment when the *reason* behind the code isn't obvious from reading it.


## KDoc Comments `/** ... */`

The `/**` style is used to document functions and classes. These are called **KDoc** comments and can be read by tools and IDEs to generate documentation automatically.

```kotlin
/**
 * Calculates the final score after applying a multiplier.
 *
 * @param base The raw score before bonuses.
 * @param multiplier The bonus multiplier to apply.
 * @return The final calculated score.
 */
fun calculateScore(base: Int, multiplier: Double): Int {
    return (base * multiplier).toInt()
}
```

> [!TIP]
> KDoc comments should be placed before every `fun`, `class`, or public property.
