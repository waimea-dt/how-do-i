# Memory Simulator Tests

This page demonstrates the memory simulator for teaching OOP concepts with Kotlin.

The simulator shows:
- **Variables**: Local variables that hold either primitive values or references to objects
- **Heap**: Where actual object instances are stored with their fields

## Example 1: Primitives vs Objects

```memory-sim
// Step: Create a primitive value
val age = 25

// Step: Create an object
val person = Person("Alice", 25)

// Step: Create another primitive
val count = 3
```

## Example 2: Reference Copying

```memory-sim
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
// Step: Create an object
val person = Person("Alice", 25)

// Step: Create a null reference
val nobody = null

// Step: Set existing reference to null
person = null
```

## Example 5: Multiple References

```memory-sim
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
// Step: Create first student
val alice = Student("Alice", 1001, 85)

// Step: Create second student
val bob = Student("Bob", 1002, 90)

// Step: Reference alice
val topStudent = alice

// Step: Update grade through reference
topStudent.grade = 95

// Step: Now reference bob instead
topStudent = bob

// Step: Update bob's grade
topStudent.grade = 92

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
