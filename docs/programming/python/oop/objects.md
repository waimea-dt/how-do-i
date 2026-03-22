# Instantiating Objects from Classes in Python

**Instantiation** is just the process of creating an object from a class. The class is the blueprint - the object is the real thing.

## Creating an Object

To create an object, write the class name followed by `()`, passing in any values the constructor expects:

```python
gandalf = Wizard("Gandalf", 100)
```

The values in `()` are passed into `__init__` as arguments (after `self`, which Python fills in automatically).

```python
class Wizard:

    def __init__(self, name, mana):
        self.name = name
        self.mana = mana


gandalf = Wizard("Gandalf", 100)
merlin  = Wizard("Merlin",   80)

print(gandalf.name)    # Gandalf
print(merlin.mana)     # 80
```

Each object you create is **completely independent** - changing the attributes of one doesn't affect the other.


## Updating Attributes

You can update an object's attributes at any time using `.`:

```python
class Wizard:

    def __init__(self, name, mana):
        self.name = name
        self.mana = mana


gandalf = Wizard("Gandalf", 100)

print(f"Mana before: {gandalf.mana}")
gandalf.mana -= 30
print(f"Mana after:  {gandalf.mana}")
```

> [!NOTE]
> In Python, all attributes are mutable by default. If you want to prevent direct changes from outside the class, use the `_`(python) naming convention and provide methods to control access - see the [Creating Classes](programming/python/oop/classes.md) page.


## Creating Multiple Objects

You can create as many objects as you like from the same class - for example, a whole party of adventurers:

```python
class Hero:

    def __init__(self, name, role, health):
        self.name   = name
        self.role   = role
        self.health = health


party = [
    Hero("Aria",    "Ranger",  90),
    Hero("Borin",   "Warrior", 120),
    Hero("Sylvara", "Wizard",  70)
]

for hero in party:
    print(f"{hero.name} ({hero.role}) - HP: {hero.health}")
```


## Objects as Attributes

An object's attributes don't have to be simple values like `int` or `str` - they can hold references to **other objects** too.

This is how you model real relationships: a `Hero` carries a `Weapon`, a `Dungeon` contains a `Monster`, and so on.

```python
class Weapon:

    def __init__(self, name, damage):
        self.name   = name
        self.damage = damage


class Hero:

    def __init__(self, name, weapon):
        self.name   = name
        self.weapon = weapon

    def attack(self, target):
        print(f"{self.name} attacks {target} with {self.weapon.name} for {self.weapon.damage} damage!")


sword = Weapon("Excalibur", 45)
hero  = Hero("Arthur", sword)

hero.attack("Dragon")
```

Notice that `weapon` is an attribute of `Hero`, and it holds a reference to a full `Weapon` object - so `hero.weapon.name` and `hero.weapon.damage` both work.


## Building Up a Scene

Objects referencing other objects lets you build up a whole scene naturally:

```python
class Spell:

    def __init__(self, name, mana_cost, damage):
        self.name      = name
        self.mana_cost = mana_cost
        self.damage    = damage


class Wizard:

    def __init__(self, name, mana):
        self.name = name
        self.mana = mana

    def cast(self, spell, target):
        if self.mana < spell.mana_cost:
            print(f"{self.name} doesn't have enough mana to cast {spell.name}!")
        else:
            self.mana -= spell.mana_cost
            print(f"{self.name} casts {spell.name} on {target} for {spell.damage} damage! (mana left: {self.mana})")


fireball  = Spell("Fireball",  20, 50)
ice_storm = Spell("Ice Storm", 35, 80)

gandalf = Wizard("Gandalf", 60)

gandalf.cast(fireball,  "Orc")
gandalf.cast(ice_storm, "Dragon")
gandalf.cast(ice_storm, "Troll")    # not enough mana
```

> [!TIP]
> The `Wizard`(python) doesn't store the spell data itself - it just receives a `Spell`(python) object and uses it. This keeps each class small and focused on its own job.
