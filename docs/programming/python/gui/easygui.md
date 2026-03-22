# The EasyGUI Library

**EasyGUI** is a library for displaying simple dialogue boxes in Python - message prompts, input boxes, choice menus, and file pickers - without needing to build a full GUI application.

## Background

EasyGUI was created to give Python beginners a way to add graphical interaction to their programs without learning a complete GUI framework. Instead of building windows and layouts, you simply call a function and a dialogue box appears.

It uses Python's built-in `tkinter`(python) library under the hood, so no extra dependencies are needed beyond installing EasyGUI itself.

> [!NOTE]
> EasyGUI is best suited for simple scripts where you want to prompt the user or display a result graphically. For full applications with buttons, menus, and a persistent window, a framework like `tkinter`(python) or PyQt would be more appropriate.


## How It Works

EasyGUI takes a **function-at-a-time** approach - each function call shows one dialogue box and returns the user's response:

```python
import easygui

name = easygui.enterbox("What is your name?")
easygui.msgbox(f"Hello, {name}!")
```

There's no window to set up, no event loop to start - just call a function, get a result, move on. This makes it very easy to add simple GUI interaction to any Python script.


## The Basic Building Blocks

EasyGUI provides a set of ready-made dialogue functions:

| Function | What it shows |
|----------|---------------|
| `msgbox(msg)`(python) | A message with an OK button |
| `enterbox(msg)`(python) | A text input prompt, returns the entered string |
| `integerbox(msg)`(python) | A number input prompt, returns an integer |
| `buttonbox(msg, choices=[...])`(python) | A message with custom buttons, returns the chosen label |
| `choicebox(msg, choices=[...])`(python) | A scrollable list to pick from, returns chosen item |
| `ynbox(msg)`(python) | A Yes / No prompt, returns `True`(python) or `False`(python) |
| `ccbox(msg)`(python) | A Continue / Cancel prompt, returns `True`(python) or `False`(python) |
| `fileopenbox()`(python) | A file picker, returns the selected file path |
| `filesavebox()`(python) | A save-file picker, returns the chosen path |


## A Minimal Example

Here's a simple program that asks for a name and displays a greeting:

```python
import easygui

name = easygui.enterbox("What is your name?", "Greeting")
easygui.msgbox(f"Hello, {name}! Welcome.", "Greeting")
```

- The first argument is the **message** shown in the box
- The second argument (optional) is the **title** shown in the title bar
- `enterbox`(python) returns whatever the user typed as a string, or `None`(python) if they cancelled


## Getting a Choice from the User

Use `buttonbox` for a small fixed set of options, or `choicebox` for a longer list:

```python
import easygui

colour = easygui.buttonbox(
    "Pick a colour:",
    "Colour Chooser",
    choices=["Red", "Green", "Blue"]
)

easygui.msgbox(f"You chose: {colour}")
```

```python
import easygui

countries = ["France", "Germany", "Japan", "Brazil", "Australia"]

choice = easygui.choicebox("Choose a country:", "Countries", choices=countries)

easygui.msgbox(f"You chose: {choice}")
```

- Both functions return the selected option as a string, or `None`(python) if the user closed the box


## Handling Cancellation

If a user closes a dialogue or clicks Cancel, EasyGUI returns `None`. Always check for this before using the result:

```python
import easygui

name = easygui.enterbox("What is your name?")

if name is None:
    easygui.msgbox("No name entered.")
else:
    easygui.msgbox(f"Hello, {name}!")
```

> [!IMPORTANT]
> Code in this section needs to run in a local Python environment with `easygui` installed (`pip install easygui`). It won't run in an online playground.

