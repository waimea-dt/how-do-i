# The Kotlin Programming Languagess

**Kotlin** is a modern programming language created by JetBrains - the same company that makes IntelliJ IDEA. It was designed to be cleaner and safer than Java, while running on the same range of platforms (Windows, Mac, iOS, Android, Linux, all using the JVM - the Java Virtual Machine).

![Kotlin Logo](_assets/kotlin-logo.jpg)

### Why Kotlin?

- **Concise** - less code to write than in many languages to get the same result
- **Safe** - catches common errors (like null pointer crashes) before your code even runs
- **Interoperable** - works seamlessly alongside Java code and libraries (there are 1000s)
- **Versatile** - used for Android apps, desktop apps, server-side code, and more

?> Kotlin is the official language for **Android** development along with great front-end libraries like **Jetpack Compose**. Kotlin is taught in many schools and universities as a first language for object-oriented programming.
![Kotlin and Android](_assets/kotlin-android.png)


### What Can You Build?

- **Console programs** - text-based programs that run in a terminal
- **Desktop GUIs** - windowed apps using Swing or Compose
- **Android apps** - the language of choice for mobile development
- **Web back-ends** - server-side apps using frameworks like Ktor

?> This guide focuses on **console programs** first to learn the fundamentals, then moves on to **desktop GUIs** using Swing.


### Getting Started

Use the sidebar to navigate the topics. If you're new to Kotlin, start with **Kotlin Basics** and work through the pages in order.


### Hello World!

Here is 'Hello, World' in Kotlin...

```kotlin run
fun main() {
    println("Hello, World!")
}
```

Pretty clean and simple!

For comparison, here it is in other common c-like languages...

**Java**

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

**C++**

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```

**C#**

```csharp
using System;

namespace HelloWorldApp
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello, World!");
        }
    }
}
```

