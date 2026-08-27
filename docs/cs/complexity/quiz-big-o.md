# Quiz: What is Complexity? & Big-O

Test your understanding of algorithmic complexity, Big-O notation, and best/worst/average case.

<quiz>

## Complexity & Big-O Quiz

- # What does "N" represent when we talk about algorithmic complexity?

    ---

    - [ ] The number of programming languages available
    - [x] The size of the input data
    - [ ] The speed of the computer running the algorithm
    - [ ] The number of bugs in the code

    ---

    - [x] **Correct!** N is always the size of the input - the number of items, entries, or cities being processed.
    - [ ] **Not quite.** N describes input size, not hardware speed, language choice, or bugs.

- # What does Big-O notation describe?

    ---

    - [ ] The exact number of operations an algorithm performs
    - [x] How an algorithm's effort grows as N grows
    - [ ] How much memory a computer has
    - [ ] The programming language used to write the algorithm

    ---

    - [x] **Correct!** Big-O describes the **growth rate** of effort as N increases, not an exact operation count.
    - [ ] **Not quite.** Big-O ignores exact counts, hardware, and language - it's about growth rate.

- # Which of these is the fastest-growing (worst) complexity?

    ---

    - [ ] **O(log N)**
    - [ ] **O(N)**
    - [ ] **O(N<sup>2</sup>)**
    - [x] **O(N!)**

    ---

    - [x] **Correct!** Factorial time grows faster than any other complexity here - it becomes unusable almost immediately.
    - [ ] **Not quite.** Factorial (**O(N!)**) grows fastest of these options.

- # Which of these complexities are classed as "polynomial time"?

    ---

    - [ ] **O(2<sup>N</sup>)** and **O(N!)**
    - [x] **O(N)** and **O(N<sup>2</sup>)**
    - [ ] Only **O(1)**
    - [ ] None of these are polynomial

    ---

    - [x] **Correct!** **O(N)** and **O(N<sup>2</sup>)** (and any **O(N<sup>k</sup>)**) are polynomial time.
    - [ ] **Not quite.** **O(2<sup>N</sup>)** and **O(N!)** are non-polynomial - polynomial covers **O(N<sup>k</sup>)** style complexities.

- # If an algorithm is **O(N)** and N doubles, what happens to its effort?

    ---

    - [ ] It stays the same
    - [x] It doubles
    - [ ] It quadruples
    - [ ] It adds one extra step

    ---

    - [x] **Correct!** Linear complexity means the effort scales directly with N - double the input, double the work.
    - [ ] **Not quite.** That describes **O(1)**, **O(N<sup>2</sup>)**, or **O(log N)** instead.

- # Which case does an exam question usually mean if it just asks for "the" complexity of an algorithm?

    ---

    - [ ] Best case
    - [ ] Average case
    - [x] Worst case
    - [ ] It could be any of the three, chosen at random

    ---

    - [x] **Correct!** Without more context, "the complexity" usually means the **worst case** - it guarantees performance.
    - [ ] **Not quite.** The worst case is the default unless best/average is specifically asked for.

- # For linear search, what is the worst-case complexity?

    ---

    - [ ] **O(1)**
    - [ ] **O(log N)**
    - [x] **O(N)**
    - [ ] **O(N<sup>2</sup>)**

    ---

    - [x] **Correct!** In the worst case, linear search must check every item - **O(N)**.
    - [ ] **Not quite.** **O(N)** is correct for linear search's worst case - checking every item once.

- # Two algorithms take 1000N and N<sup>2</sup> operations. At what kind of N does the **O(N)** algorithm start winning?

    ---

    - [ ] Only for very small N
    - [x] Once N grows large enough to pass the crossover point
    - [ ] Never - **O(N<sup>2</sup>)** is always faster
    - [ ] It depends only on the programming language used

    ---

    - [x] **Correct!** Past the crossover point, the lower-complexity algorithm always wins, no matter the constants.
    - [ ] **Not quite.** For small N, constants can matter, but for large N, the growth rate always dominates.

</quiz>
