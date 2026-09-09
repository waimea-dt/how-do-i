# Real-World Impact of Intractability

Intractability can have **positive** and **negative** effects in the real-world:

<cards>

### ✅ Intractability is Useful

It **protects systems such as encryption** by making an attack impractical

---

### ❌ Intractability Causes Problems

It **makes systems such as timetables and delivery routes difficult to optimise**, so they must use imperfect but fast solutions.

</cards>


> [!NOTE]
> An **intractable** problem is not impossible to solve. It is a problem that **can be solved in theory, but would take too much time or computing power to solve** for useful input sizes.


## ✅ Systems That Rely on Intractability

### Modern Encryption

Intractable problems keep encryption safe by acting like mathematical 'locks': they are **easy to use in the intended direction, but impractical to reverse without the correct key**. This lets people protect information without making encryption difficult for the intended user.

#### The Foundation: One-Way Functions

- A **one-way function** is easy to calculate but difficult to reverse.
- A **trapdoor one-way function** can be reversed efficiently if you have a piece of secret information, called the **trapdoor**.

Modern digital encryption relies primarily on two types of intractable, one-way functions:

| Function                | ✅ The Easy Direction                                                                                                | ❌ The Hard Direction                                                                                           |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Prime Factorization** | Multiplying two massive prime numbers together to get a giant composite number. A computer does this instantly: O(1) | Taking that giant composite number and figuring out which two prime numbers were multiplied to create it: O(√N) |
| **Discrete Logarithms** | Raising a number to a base power within a modular arithmetic system (like a mathematical clock): O(1)                | Finding the exponent when you only know the base and the final result: O(√N)                                    |


#### Encryption Examples:

- [RSA Encryption](/cs/encryption/rsa.md):
    - Relies on **prime factorisation** for key generation
    - The **private key** provides the trapdoor
- [Diffie-Hellman Key Exchange](/cs/encryption/diffie-hellman.md):
    - Relies on **discrete logarithms** to generate a shared secret


#### The Future Threat: Quantum Computing

The meaning of 'intractable' can change when a better algorithm is discovered. For example, **Shor's algorithm** could let sufficiently powerful quantum computers solve some problems used by current public-key encryption. Cryptographers are therefore developing new forms of **post-quantum cryptography**.


## ❌ Systems That Suffer due to Intractability

Some problems are hard because there are too many possible choices. Businesses, governments, and schools still have to make decisions, even when finding the best answer would take too long.

Since we cannot solve these problems exactly for large N, we use:

- **Approximation algorithms** - find a solution close to the best one
- **Heuristics** - find a useful solution using practical rules

See [Approximation Algorithms & Heuristics](approximation.md) for how this works in practice.

### Real-World Examples

| Real-World Problem                 | Description                                                                                                                                        | Related to...                                           | Complexity       |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ---------------- |
| **Delivery routes**                | Courier companies cannot calculate the *perfect* route for hundreds of daily drop-offs, so they use heuristics that find a *good* route in seconds | [Travelling Salesperson Problem](/cs/complexity/tsp.md) | O(N!)            |
| **Staff rosters and flight crews** | Airlines assigning crews to flights, or hospitals building nurse rosters, face difficult scheduling problems                                       | [Bin Packing](/cs/complexity/bin-packing.md)            | O(N<sup>N</sup>) |
| **Chip design**                    | Arranging millions of components on a circuit board to minimise wiring is intractable at full scale, so engineers use approximations               | [Travelling Salesperson Problem](/cs/complexity/tsp.md) | O(N!) |


#### In Our School

Intractable problems are not just abstract examples - schools run into them every week:


| School Problem      | Description                                                                                                                                                 | Related to...                                           | Complexity       |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ---------------- |
| **Timetabling**     | Fitting every class, teacher, room, and student into a clash-free timetable is intractable, so software uses heuristics to produce a good timetable quickly | **graph colouring**                                     | O(2<sup>N</sup>) |
| **Bus routes**      | Planning school-bus routes across a wide area is intractable, so transport coordinators use practical, heuristic solutions                                  | [Travelling Salesperson Problem](/cs/complexity/tsp.md) | O(N!)            |
| **Subject choices** | Fitting students into limited class lines is intractable, so heuristic solutions are used                                                                   | [Knapsack Problem](/cs/complexity/knapsack.md)          | O(2<sup>N</sup>) |


## Key Terms

<flashcards shuffle>

- # Intractability

    ---

    A problem that is **possible** to solve, but takes too much **time or computing power**.

- # Encryption

    ---

    Uses **intractable problems** to make attacks impractical.

- # Optimisation problems

    ---

    Intractability can make finding the **best solution** take too long.

- # One-way function

    ---

    Easy to calculate, but **difficult to reverse**.

- # Trapdoor function

    ---

    A one-way function that can be reversed with a secret **trapdoor**.

- # Prime factorisation

    ---

    **Multiplication** is easy; finding the original prime factors is hard.

- # Discrete logarithm

    ---

    Finding an unknown **exponent** from a known base and result is difficult.

- # RSA Encryption

    ---

    Uses difficult **prime factorisation**; the private key is the trapdoor.

- # Diffie-Hellman Key Exchange

    ---

    Uses difficult **discrete logarithms** to create a shared secret.

- # Shor's algorithm

    ---

    A quantum algorithm that could make some public-key problems **easy to solve**.

- # Post-quantum cryptography

    ---

    Encryption designed to resist **quantum computer** attacks.

- # Approximation algorithm

    ---

    Finds a solution **close to the best** when an exact answer takes too long.

- # Heuristic

    ---

    A practical method that finds a **useful answer quickly**.

- # Travelling Salesperson Problem

    ---

    Finding the shortest route through many locations; often has **O(N!)** complexity.

- # Graph colouring

    ---

    Assigning colours so connected points have **different colours**; useful for timetabling.

- # Knapsack Problem

    ---

    Choosing the best items within **limited capacity**; similar to subject choices.

- # School applications

    ---

    **Timetables, bus routes, and subject choices** use heuristics because perfect solutions take too long.

</flashcards>
