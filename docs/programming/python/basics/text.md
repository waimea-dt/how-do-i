# Working with Text

In Python, text is stored in a `str` (string). Strings can use **single** or **double** quotes - both work the same way:

```python
name = "Jimmy"
city = 'London'
```

?> Pick one style and stick with it. Double quotes are more common and are recommended.


## String Concatenation

Combine strings with `+`:

```python
forename = "Jimmy"
surname  = "Tickles"
full_name = forename + " " + surname
print(full_name)
```

?> Prefer **f-strings** over `+` for mixing variables and text - they are cleaner and less error-prone.


## f-Strings (String Formatting)

The easiest way to mix variables and text is with an **f-string** - put `f` before the opening quote, then use `{ }` to embed variables or expressions:

```python
name  = "Steve"
score = 4200

print(f"Player: {name}")
print(f"Score:  {score}")
print(f"Double score: {score * 2}")
```

?> f-strings work with any expression inside `{ }` - calculations, function calls, comparisons, anything.


## String Length

`len()` returns the number of characters in a string:

```python
name = "Bartholomew"
print(len(name))    # 11
```


## Accessing Characters

Individual characters can be accessed by **index** (starting from `0`) using square brackets:

```python
word = "Python"
print(word[0])    # 'P'  - first character
print(word[-1])   # 'n'  - last character (negative index counts from the end)
```


## Slicing Strings

Use `[start:end]` to extract a portion of a string. `end` is not included:

```python
language = "Python"
print(language[0:3])    # 'Pyt' - characters 0, 1, 2
print(language[2:5])    # 'tho'
print(language[:3])     # 'Pyt' - from the start
print(language[3:])     # 'hon' - to the end
```


## Searching Strings

Check whether a string **contains** a substring using `in` and `not in`:

```python
sentence = "The quick brown fox"
print("fox" in sentence)       # True
print("cat" not in sentence)   # True
```

`.startswith()` and `.endswith()` check the beginning or end:

```python
filename = "report_2026.pdf"
print(filename.startswith("report"))   # True
print(filename.endswith(".pdf"))       # True
```

`.find()` returns the index of the first match, or `-1` if not found:

```python
sentence = "the cat sat on the mat"
print(sentence.find("at"))    # 5 - index of first match
print(sentence.find("dog"))   # -1 - not found
```


## Changing Case

```python
text = "Hello, World!"
print(text.upper())      # HELLO, WORLD!
print(text.lower())      # hello, world!
```


## Trimming Whitespace

`.strip()` removes leading and trailing whitespace - useful when processing user input:

```python
user_input = "   hello   "
print(user_input.strip())        # "hello"
print(user_input.lstrip())       # "hello   " - leading only
print(user_input.rstrip())       # "   hello" - trailing only
```


## Replacing Text

`.replace()` substitutes all occurrences of a value:

```python
text = "I like cats. Cats are great."
print(text.replace("cats", "dogs"))
print(text.replace("Cats", "Dogs"))
```


## Splitting Strings

`.split()` divides a string into a list at each occurrence of a separator:

```python
csv = "red,green,blue,yellow"
colours = csv.split(",")
print(colours)       # ['red', 'green', 'blue', 'yellow']
print(colours[1])    # 'green'
```


## Useful String Methods Summary

| Method | What it does |
|--------|-------------|
| `len(s)` | Number of characters |
| `s.upper()` | All uppercase |
| `s.lower()` | All lowercase |
| `s.strip()` | Remove surrounding whitespace |
| `s.replace(a, b)` | Replace `a` with `b` |
| `s.split(sep)` | Split into a list |
| `s.find(sub)` | Index of first match, or `-1` |
| `s.startswith(sub)` | `True` if starts with `sub` |
| `s.endswith(sub)` | `True` if ends with `sub` |
