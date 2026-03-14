# Working with Text

## String Concatenation

Strings can be combined using the **concatenation** operator, `+`...

```kotlin run
val forename = "Jimmy"
val surname  = "Tickles"
val fullName = forename + " " + surname
println(fullName)
```

There is also a short form if a string needs some text appending to the end, `+=`...

```kotlin run
var message = "Hello, there!"
message += " You are awesome!"
println(message)
```

?> Prefer **string templates** over `+` for combining variables and text - they are easier to read and less error-prone.


## String Templates

The easiest way to mix variables and text is with **string templates** - prefix a variable name with `$` inside a string:

```kotlin run
val name = "Steve"
val score = 4200

println("Player: $name")
println("Score:  $score")
```

For **expressions** (any code that produces a value), wrap in `${ }`:

```kotlin run
val name  = "Carrot"
val price = 12.5
val qty   = 3

println("Total: ${price * qty}")
println("Name length: ${name.length} characters")
```

?> Use `${ }` whenever you need more than just a plain variable name - calculations, function calls, property access, etc.



## String Length

`.length` returns the number of characters in a string:

```kotlin run
val name = "Bartholomew"
println(name.length)
```


## Accessing Characters

Individual characters can be accessed by **index** (starting from `0`) using square brackets:

```kotlin run
val word = "Kotlin"
println(word[0])    // first character, 'K'
println(word[5])    // last character, 'n'
```

Or with named methods:

```kotlin run
val word = "Kotlin"
println(word.first())   // first character
println(word.last())    // last character
```


## Sub-Strings

`.take(n)` and `.drop(n)` let you extract parts of a string:

```kotlin run
val language = "Kotlin"
println(language.take(3))    // first 3 characters, 'Kot'
println(language.drop(4))    // everything except first 4, 'in'
```

`.substring(start, end)` extracts part of a string, from start up to (but not including) end:

```kotlin run
val language = "Kotlin"
println(language.substring(2, 5))   // characters from index 2 to 4, 'tli'
```


## Searching Strings

Check whether a string **contains** a substring using `in` and `!in`:

```kotlin run
val sentence = "The quick brown fox"
println("fox" in sentence)      // true
println("cat" !in sentence)     // true
```

`.contains()` does the same thing (and supports ignoring case):

```kotlin run
val sentence = "The Quick Brown Fox"
println(sentence.contains("quick"))
println(sentence.contains("quick", ignoreCase = true))
```

`.startsWith()` and `.endsWith()` check the beginning or end:

```kotlin run
val filename = "report_2026.pdf"
println(filename.startsWith("report"))
println(filename.endsWith(".pdf"))
```

`.indexOf()` returns the index of the first match, or `-1` if not found:

```kotlin run
val sentence = "the cat sat on the mat"
println(sentence.indexOf("at"))     // index of first match
println(sentence.indexOf("dog"))    // -1 - not found
```


## Changing Case

```kotlin run
val text = "Hello, World!"
println(text.uppercase())
println(text.lowercase())
```


## Trimming Whitespace

`.trim()` removes leading and trailing whitespace - useful when processing user input:

```kotlin run
val input = "   hello   "
println(input.trim())
println(input.trimStart())   // leading only
println(input.trimEnd())     // trailing only
```


## Replacing Text

`.replace()` substitutes all occurrences of a value:

```kotlin run
val text = "I like cats. Cats are great."
println(text.replace("cats", "dogs"))               // case-sensitive
println(text.replace("cats", "dogs", ignoreCase = true))
```


## Splitting Strings

`.split()` divides a string into a list at each occurrence of a separator:

```kotlin run
val csv = "red,green,blue,yellow"
val colours = csv.split(",")
println(colours)           // Whole list
println(colours[1])        // Second item, 'green'
```


## Working with Chars

A `Char` holds a single character and uses **single quotes**:

```kotlin run
val letter: Char = 'K'
println(letter)                    // 'K'
println(letter.isLetter())         // true
println(letter.isDigit())          // false
println(letter.isUpperCase())      // true
println(letter.lowercaseChar())    // converted to 'k'
```

Check whether a `Char` is **contained in** a string using `in`:

```kotlin run
val vowels = "aeiou"
println('e' in vowels)    // true
println('z' in vowels)    // false
```

A string can be iterated character by character using a `for` loop:

```kotlin run
val word = "Kotlin"
for (letter in word) {
    print("$letter ")        // 'K', 'o', 't', etc.
}
```


## Useful String Methods Summary

| Method | What it does |
|--------|-------------|
| `s.length` | Number of characters |
| `s.uppercase()` | All uppercase |
| `s.lowercase()` | All lowercase |
| `s.trim()` | Remove surrounding whitespace |
| `s.replace(a, b)` | Replace `a` with `b` |
| `s.split(sep)` | Split into a list |
| `s.indexOf(sub)` | Index of first match, or `-1` |
| `s.contains(sub)` | `true` if `sub` is found |
| `s.startsWith(sub)` | `true` if starts with `sub` |
| `s.endsWith(sub)` | `true` if ends with `sub` |
| `s.take(n)` | First `n` characters |
| `s.drop(n)` | Everything after the first `n` characters |
| `s.first()` | First character |
| `s.last()` | Last character |
