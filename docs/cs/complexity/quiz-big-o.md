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
    - [ ] **Not quite.** Think about what changes when you give an algorithm a bigger or smaller amount of data to work with.

- # What does Big-O notation describe?

    ---

    - [ ] The exact number of operations an algorithm performs
    - [x] How an algorithm's effort grows as N grows
    - [ ] How much memory a computer has
    - [ ] The programming language used to write the algorithm

    ---

    - [x] **Correct!** Big-O describes the **growth rate** of effort as N increases, not an exact operation count.
    - [ ] **Not quite.** Big-O is about how effort scales as input size changes, not any single fixed number.

- # Which of these is the fastest-growing (worst) complexity?

    ---

    - [ ] **O(log N)**
    - [ ] **O(N)**
    - [ ] **O(N<sup>2</sup>)**
    - [x] **O(N!)**

    ---

    - [x] **Correct!** Factorial time grows faster than any other complexity here - it becomes unusable almost immediately.
    - [ ] **Not quite.** Think about which of these notations involves multiplying together every number up to N.

- # Which of these complexities are classed as "polynomial time"?

    ---

    - [ ] **O(2<sup>N</sup>)** and **O(N!)**
    - [x] **O(N)** and **O(N<sup>2</sup>)**
    - [ ] Only **O(1)**
    - [ ] None of these are polynomial

    ---

    - [x] **Correct!** **O(N)** and **O(N<sup>2</sup>)** (and any **O(N<sup>k</sup>)**) are polynomial time.
    - [ ] **Not quite.** Polynomial time covers a whole family of complexities, not just one, and excludes the fastest-growing ones.

- # If an algorithm is **O(N)** and N doubles, what happens to its effort?

    ---

    - [ ] It stays the same
    - [x] It doubles
    - [ ] It quadruples
    - [ ] It adds one extra step

    ---

    - [x] **Correct!** Linear complexity means the effort scales directly with N - double the input, double the work.
    - [ ] **Not quite.** Think about what "linear" means for the relationship between input size and effort.

- # Which case does an exam question usually mean if it just asks for "the" complexity of an algorithm?

    ---

    - [ ] Best case
    - [ ] Average case
    - [x] Worst case
    - [ ] It could be any of the three, chosen at random

    ---

    - [x] **Correct!** Without more context, "the complexity" usually means the **worst case** - it guarantees performance.
    - [ ] **Not quite.** Think about which case gives you a guarantee, no matter how unlucky the input is.

- # For linear search, what is the worst-case complexity?

    ---

    - [ ] **O(1)**
    - [ ] **O(log N)**
    - [x] **O(N)**
    - [ ] **O(N<sup>2</sup>)**

    ---

    - [x] **Correct!** In the worst case, linear search must check every item - **O(N)**.
    - [ ] **Not quite.** Think about how many items linear search might have to check if the target is last, or missing entirely.

- # Two algorithms take 1000N and N<sup>2</sup> operations. At what kind of N does the **O(N)** algorithm start winning?

    ---

    - [ ] Only for very small N
    - [x] Once N grows large enough to pass the crossover point
    - [ ] Never - **O(N<sup>2</sup>)** is always faster
    - [ ] It depends only on the programming language used

    ---

    - [x] **Correct!** Past the crossover point, the lower-complexity algorithm always wins, no matter the constants.
    - [ ] **Not quite.** Think about what happens to each algorithm's operation count as N keeps growing larger and larger.

- # Why does binary search need to run on sorted data?

    ---

    - [ ] It doesn't - it works just as well on unsorted data
    - [x] It repeatedly halves the search space by comparing to a middle value, which only works if order is guaranteed
    - [ ] Sorting makes the data smaller
    - [ ] Binary search never actually looks at the data's order

    ---

    - [x] **Correct!** Binary search relies on knowing which half of the list to eliminate next, which only makes sense if the data is in order.
    - [ ] **Not quite.** Think about how binary search decides which half of the list to eliminate at each step.

- # What is the best possible worst-case complexity for a general-purpose, comparison-based sort?

    ---

    - [ ] **O(N)**
    - [x] **O(N log N)**
    - [ ] **O(N<sup>2</sup>)**
    - [ ] **O(2<sup>N</sup>)**

    ---

    - [x] **Correct!** No comparison-based sorting algorithm can beat this in the worst case - it's the theoretical limit.
    - [ ] **Not quite.** Think about the complexity of efficient sorts like merge sort, and how it compares to slower ones like bubble sort.

</quiz>
