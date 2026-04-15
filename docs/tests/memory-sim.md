# Memory Simulator Tests

This page demonstrates the memory simulator for teaching OOP concepts with Kotlin.

The simulator shows:
- **Variables**: Local variables that hold either primitive values or references to objects
- **Heap**: Where actual object instances are stored with their fields

## Example 1: Primitives vs Objects

```memory-sim
// ClassDefs
class Person(val name: String, var age: Int)

// Step: Create a primitive value
val age = 25

// Step: Create an object
val person = Person("Alice", 25)

// Step: Create another primitive
val count = 3
```

## Example 2: Reference Copying

```memory-sim
// ClassDefs
class Person(val name: String, var age: Int)

// Step: Create first Person object
val person1 = Person("Alice", 25)

// Step: Copy the reference
val person2 = person1

// Step: Modify through second reference
person2.age = 26
```

This example demonstrates that `person1` and `person2` are two references pointing to the **same object** in the heap. When we modify `person2.age`, `person1.age` also changes because they reference the same object.

## Example 3: Independent Objects

```memory-sim
// ClassDefs
class Person(val name: String, var age: Int)

// Step: Create first Person
val person1 = Person("Alice", 25)

// Step: Create second Person
val person2 = Person("Bob", 30)

// Step: Modify first person
person1.age = 26

// Step: Modify second person
person2.age = 31
```

This shows two independent objects in the heap. Modifying one does not affect the other.

## Example 4: Null References

```memory-sim
// ClassDefs
class Person(val name: String, var age: Int)

// Step: Create an object
val person = Person("Alice", 25)

// Step: Create a null reference
val nobody = null

// Step: Set existing reference to null
person = null
```

## Example 5: Multiple References

```memory-sim
// ClassDefs
class Person(val name: String, var age: Int)

// Step: Create initial object
val original = Person("Alice", 25)

// Step: Create first copy
val copy1 = original

// Step: Create second copy
val copy2 = original

// Step: Create third copy
val copy3 = copy1

// Step: Modify through any reference
copy2.age = 30
```

This demonstrates that multiple variables can hold references to the same object. All four variables (`original`, `copy1`, `copy2`, `copy3`) point to the same Person object in the heap.

## Example 6: Working with Different Classes

```memory-sim
// ClassDefs
class Student(val name: String, val id: Int, var grade: Int)
class Book(val title: String, val author: String, val year: Int)
class Point(val x: Int, val y: Int)

// Step: Create a Student
val student = Student("Alice", 12345, 95)

// Step: Create a Book
val book = Book("Kotlin Guide", "John Doe", 2024)

// Step: Create a Point
val point = Point(10, 20)

// Step: Modify the student's grade
student.grade = 98
```

## Example 7: Complex Scenario

```memory-sim
// ClassDefs
class Student(val name: String, val id: Int, var grade: Int)

// Step: Create first student
val alice = Student("Alice", 1001, 85)

// Step: Create second student
val bob = Student("Bob", 1002, 90)

// Step: Reference alice
val top = alice

// Step: Update grade through reference
top.grade = 95

// Step: Now reference bob instead
top = bob

// Step: Update bob's grade
top.grade = 92

// Step: Create a primitive counter
val studentCount = 2
```

This complex example shows:
- Creating multiple objects
- Reference variables being reassigned
- Modifying objects through different references
- Mixing primitives and objects

## Example 8: Value vs Reference Types

```memory-sim
// ClassDefs
class Person(val name: String, var age: Int)

// Step: Create a primitive value
val x = 10

// Step: Create another primitive
val y = 20

// Step: Create an object
val person = Person("Alice", 25)

// Step: Copy primitive (value copy)
val z = x

// Step: Modify original
x = 15
```

Key concept: When you copy a primitive (`val z = x`), you get an independent copy of the value. Changing `x` afterwards doesn't affect `z`. But when you copy a reference to an object, both variables point to the same object.

## Example 9: Object References (Composition)

```memory-sim
// ClassDefs
class Person(val name: String, var age: Int)
class Staff(val person: Person, val role: String, var salary: Int)
class Dept(val name: String, val head: Staff, val assist: Staff)

// Step: Create a person
val alice = Person("Alice", 25)

// Step: Create an employee that references the person
val emp1 = Staff(alice, "Manager", 200000)

// Step: Create another person
val bob = Person("Bob", 30)

// Step: Create an employee that references the person
val emp2 = Staff(bob, "Designer", 150000)

// Step: Create a department with a head and assistant
val dept = Dept("Design", emp1, emp2)

// Step: Modify object
emp1.salary = 250000

// Step: Modify nested object
emp2.person.age = 31
```

This example demonstrates **object composition** - objects that contain references to other objects:
- The `Player` object has a `person` field that references the `Person` object
- The `Team` object has a `captain` field that references another `Person` object
- When we modify `player.person.age`, we're modifying the `Person` object through the nested reference
- The heap shows reference arrows (`→ #1`) indicating which objects reference others


## Example 10: Object References (Composition)

```memory-sim
// ClassDefs
class Point(val x: Int, val y: Int)
class Rectangle(val x: Int, val y: Int, val width: Int, val height: Int)
class Circle(val centre: Point, val radius: Int)

// Step: Create a point
val pt1 = Point(3, 2)

// Step: Here is a rect
val rect1 = Rectangle(10, 10, 15, 5)

// Step: And a circle centred on the point
val circ1 = Circle(pt1, 3)
```



## Example 11: Object References (Composition)

```memory-sim
// ClassDefs
class Location(val name: String, var north: Location, var east: Location, var south: Location, var west: Location)

// Step: Create some locations
val hall = Location("Hall")
val path = Location("Path")
val tower = Location("Tower")

// Step: Link them
```

## Example 12: Python — Primitives and Objects

```memory-sim
# ClassDefs
class Person:
    def __init__(self, name, age): pass

# Step: Create a primitive
age = 25

# Step: Create an object
person = Person("Alice", 25)

# Step: Update a field
person.age = 26

# Step: Create a null reference
nobody = None
```

## Example 13: Python — Reference Sharing

```memory-sim
# Multiple objects fro a class
# ClassDefs
class Student:
    def __init__(self, name, id, grade): pass
# test comment
# Step: Create first object
student1 = Student("Alice", 1001, 85)
# Step: Create second object
student2 = Student("Bob", 1002, 90)
# Step: Copy a reference
top = student1
# Step: Modify through the copy
top.grade = 99
# Step: Reassign to other student
top = student2
# test comment
# Step: Both now unreferenced if top moves on
top.grade = 95
```

