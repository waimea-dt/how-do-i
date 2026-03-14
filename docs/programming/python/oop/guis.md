# OOP and GUIs

Object-Oriented Programming and Graphical User Interfaces (GUIs) are a natural fit - in fact, GUIs are one of the main reasons OOP became so popular.

## A GUI is Already Made of Objects

Look at any app window. What do you see?

- A **window**
- **Buttons**
- **Text fields**
- **Labels**
- **Menus**

Each of these is a distinct *thing* with its own appearance and behaviour. A button knows its label, its size, its position, and what happens when you click it. A text field stores whatever the user has typed.

These map perfectly onto **objects** - each UI component is an instance of a class.

```
Class: Button     →  Button: Submit
                  →  Button: Cancel
                  →  Button: Help

Class: TextField  →  TextField: username
                  →  TextField: password
```

Even libraries like **EasyGUI** follow this pattern - `enterbox`, `buttonbox`, and `msgbox` are all wrappers around window objects created behind the scenes.


## Components React to Events

GUI components don't just sit there - they **respond to events**: a click, a keypress, a mouse hover. Each object handles its own events internally, exactly like encapsulation describes.

You don't write one giant block of code that watches for every possible click on every possible button. Instead, you define **handler functions** that each component calls when something happens:

```python
import tkinter as tk

def on_click():
    print("Button clicked!")

window = tk.Tk()
button = tk.Button(window, text="Click me", command=on_click)
button.pack()
window.mainloop()
```

?> This is encapsulation in action - the button object owns its own behaviour. The calling code just says *"when clicked, call this function"* - it doesn't need to know how the button detects the click internally.


## Components Are Arranged as a Hierarchy

A GUI is also naturally **hierarchical** - objects contain other objects:

```
Tk (root window)
  └── Frame (container)
        ├── Label ("Enter your name:")
        ├── Entry (input box)
        └── Button ("OK")
```

This is exactly the *objects as attributes* pattern - a frame holds a list of components, the root window holds the frame, and so on.


## Building Your Own GUI Components as Classes

When building larger GUI applications, it's common to define your own classes that extend built-in components. This is where OOP really shines - you group the widget, its data, and its behaviour together in one class:

```python
import tkinter as tk

class GreeterApp:

    def __init__(self, window):
        self.window = window
        window.title("Greeter")

        self.entry  = tk.Entry(window)
        self.button = tk.Button(window, text="Greet", command=self.greet)
        self.label  = tk.Label(window, text="")

        self.entry.pack()
        self.button.pack()
        self.label.pack()

    def greet(self):
        name = self.entry.get()
        self.label.config(text=f"Hello, {name}!")


root = tk.Tk()
app  = GreeterApp(root)
root.mainloop()
```

?> When you start building GUIs in Python, you'll find that almost every component is an object, and organising your code into classes makes it dramatically easier to manage. OOP isn't just useful for GUIs - it's the natural way to build them.
