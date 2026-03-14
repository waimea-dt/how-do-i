# Creating Classes in Python

## Defining a Class

Use the `class` keyword followed by the class name:

```python
class Wizard:
    pass    # 'pass' is a placeholder for an empty class body
```

Class names should:
- Start with an **uppercase letter**
- Use **PascalCase** for multiple words (each word capitalised)

✓ Well-named classes...

```python
class Wizard
class BankAccount
class PlayerCharacter
```

✗ Badly-named classes...

```python
class wizard           # Lowercase start
class bankAccount      # camelCase (that's for variables and functions)
class bank_account     # Underscores
```


## The Constructor: `__init__`

The **constructor** is a special method called `__init__` that runs automatically when an object is created. This is where you define the object's **attributes** - the data it holds.

Every method in a class (including `__init__`) must have **`self`** as its first parameter. `self` refers to the object being created or used.

```python
class Wizard:

    def __init__(self, name, mana):
        self.name = name    # create an attribute called 'name'
        self.mana = mana    # create an attribute called 'mana'
```

The values are passed in when you create the object:

```python
class Wizard:

    def __init__(self, name, mana):
        self.name = name
        self.mana = mana


my_wizard = Wizard("Gandalf", 100)

print(my_wizard.name)    # Gandalf
print(my_wizard.mana)    # 100
```

?> `self` is just a convention - it could technically be any name - but you should always use `self`. It's one of Python's strongest conventions and every Python programmer will expect it.


## Internal Attributes

You can also define attributes inside `__init__` that aren't passed in - they just have a default value:

```python
class Wizard:

    def __init__(self, name, mana):
        self.name       = name
        self.mana       = mana
        self.level      = 1       # all wizards start at level 1
        self.spells_cast = 0      # starts at zero


my_wizard = Wizard("Gandalf", 100)
my_wizard.level = 5               # update the attribute

print(f"{my_wizard.name} is level {my_wizard.level}!")
```


## Validation in `__init__`

`__init__` is also a good place to **validate** data when an object is created:

```python
class Wizard:

    def __init__(self, name, mana):
        if mana < 0:
            raise ValueError("Mana cannot be negative!")

        self.name = name
        self.mana = mana


gandalf = Wizard("Gandalf", 100)   # fine
broken  = Wizard("Oops",    -10)   # raises ValueError
```

?> Validating data in `__init__` ensures that an invalid object can never be created in the first place - this is much safer than checking values later in your code.


## Methods

Methods are **functions** that belong to a class - they define what an object can **do**. Like `__init__`, every method takes `self` as its first parameter:

```python
class Wizard:

    def __init__(self, name, mana):
        self.name        = name
        self.mana        = mana
        self.spells_cast = 0

    def cast_spell(self, spell):
        self.spells_cast += 1
        self.mana -= 10
        print(f"{self.name} casts {spell}! (mana left: {self.mana})")

    def describe(self):
        print(f"{self.name} has cast {self.spells_cast} spell(s) and has {self.mana} mana remaining")


my_wizard = Wizard("Gandalf", 100)

my_wizard.cast_spell("Fireball")
my_wizard.cast_spell("Ice Storm")

my_wizard.describe()
```

Methods can accept parameters and return values, exactly like regular functions:

```python
class Rectangle:

    def __init__(self, width, height):
        self.width  = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)


room = Rectangle(4.5, 6.0)

print(f"Area:      {room.area()} m²")
print(f"Perimeter: {room.perimeter()} m")
```


## "Private" Attributes and Methods

Python doesn't enforce access control the way some languages do, but the convention is to prefix internal attributes and methods with a **single underscore** `_` to signal they are private:

```python
class Account:

    def __init__(self, owner):
        self.owner    = owner
        self._balance = 0       # _ signals: don't access this directly

    def deposit(self, amount):
        print(f"{self.owner} depositing {amount}...")
        self._balance += amount
        print(f"Balance: {self._balance}")

    def withdraw(self, amount):
        print(f"{self.owner} withdrawing {amount}...")

        if amount > self._balance:
            print("Insufficient funds!")
            return

        self._balance -= amount
        print(f"Balance: {self._balance}")


account = Account("Alice")

account.deposit(500)
account.withdraw(120)
```

?> The `_` prefix is a convention, not a lock - Python will still let you access `account._balance` directly. But any programmer who sees `_balance` knows they shouldn't touch it from outside the class.


## `__str__`: Readable Printing

By default, printing an object shows a memory address like `<Wizard object at 0x7f...>`. Define a `__str__` method to control what gets printed instead:

```python
class Wizard:

    def __init__(self, name, mana):
        self.name = name
        self.mana = mana

    def __str__(self):
        return f"Wizard({self.name}, mana={self.mana})"


gandalf = Wizard("Gandalf", 100)
print(gandalf)    # Wizard(Gandalf, mana=100)
```

?> `__str__` is one of Python's **dunder methods** (double-underscore methods). They let you define how objects behave with built-in operations like `print()`, `len()`, `+`, and `==`.
