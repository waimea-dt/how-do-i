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




