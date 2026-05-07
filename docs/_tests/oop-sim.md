# OOP Simulator Tests

This page demonstrates the oop simulator for teaching OOP concepts with Kotlin.

The simulator shows:
- **Variables**: Local variables that hold either primitive values or references to objects
- **Classes**: Where class defintions/code are stored
- **Heap**: Where actual object instances are stored with their fields

## Example 1: Object Instantiation

```oop-sim
// Step: Define a class
class Person(val name: String, var age: Int) {
    fun sayHello() {
        println("Hello, from $name")
    }
}

// Step: Create an object
val per = Person("Alice", 25)

// Step: Update a field
per.age = 26

// Step: Call method
per.sayHello()
```


## Example 2: Multiple Object Instantiation

```oop-sim
// Step: Define a class
class Person(val name: String, var age: Int) {
    fun sayHello() {
        println("Hello, from $name")
    }

    fun isAdult(): Boolean {
        return age >= 18
    }
}

// Step: Create an object
val per1 = Person("Alice", 25)
// Step: Create an object
val per2 = Person("Bob", 30)

// Step: Call method
per1.sayHello()
// Step: Call method
per2.sayHello()
// Step: Call method
per2.isAdult()
```


## Example 3: Python Object Instantiation

```oop-sim
# Step: Define a class
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def sayHello(self):
        print(f"Hello, from {self.name}")

# Step: Create an object
per = Person("Alice", 25)

# Step: Update a field
per.age = 26

# Step: Call method
per.sayHello()
```

