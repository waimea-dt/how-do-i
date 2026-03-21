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

## Components React to Events

GUI components don't just sit there - they **respond to events**: a click, a keypress, a mouse hover. Each object handles its own events internally, exactly like encapsulation describes.

You don't write one giant block of code that watches for every possible click on every possible button. Instead, each button object manages its own click behaviour:

```kotlin
val submitButton = JButton("Submit")

submitButton.addActionListener {
    println("Form submitted!")   // this button handles its own click
}
```

> [!NOTE]
> This is encapsulation in action - the button object owns its own behaviour. Outside code just says *"when clicked, do this"* - it doesn't need to know how the button detects the click internally.


## Components Are Arranged as a Hierarchy

A GUI is also naturally **hierarchical** - objects contain other objects:

```
JFrame (window)
  └── JPanel (container)
        ├── JLabel ("Enter your name:")
        ├── JTextField (input box)
        └── JButton ("OK")
```

This is exactly the *objects as properties* pattern - a panel holds a list of components, a frame holds a panel, and so on.

> [!NOTE]
> When you start building GUIs in Kotlin, you'll find that almost everything you create is a class, and almost every class you use is a component object. OOP isn't just useful for GUIs - it's the only practical way to build them.

