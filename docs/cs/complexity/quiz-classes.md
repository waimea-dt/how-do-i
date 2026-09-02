# Quiz: Complexity Classes

Test your understanding of P, NP, NP-complete, HP-Hard and tractability

<quiz>

## Complexity Classes Quiz

- # What does it mean for a problem to be "tractable"?

    ---

    - [x] It can be solved in a reasonable (polynomial) amount of time
    - [ ] It has never been solved by anyone
    - [ ] It can only be solved by quantum computers
    - [ ] It has no correct solution

    ---

    - [x] **Correct!** Tractable problems can be solved efficiently, even as N grows large.
    - [ ] **Not quite.** Think about how long it takes to solve the problem, not who has attempted it or what kind of computer is used.

- # A problem in class P is one that can be...

    ---

    - [x] Solved in polynomial time
    - [ ] Verified in polynomial time, but not necessarily solved quickly
    - [ ] Solved only by guessing randomly
    - [ ] Proven to have no solution

    ---

    - [x] **Correct!** P problems can be **solved** efficiently, not just checked.
    - [ ] **Not quite.** Think about the difference between finding a solution and simply checking one that's already been proposed.

- # A problem in class NP is one that can be...

    ---

    - [ ] Solved instantly on any computer
    - [x] Verified quickly, even if finding a solution is hard
    - [ ] Solved only using brute force
    - [ ] Proven impossible to solve

    ---

    - [x] **Correct!** NP problems may be hard to solve, but a proposed solution can be checked quickly.
    - [ ] **Not quite.** Think about the difference between finding a solution and simply checking one that's already been proposed.

- # What is special about NP-Complete problems?

    ---

    - [x] Solving any one of them efficiently would solve all of them efficiently
    - [ ] They can never be solved by any computer
    - [ ] They are always solved using sorting algorithms
    - [ ] They only exist in theory, never in real life

    ---

    - [x] **Correct!** NP-Complete problems are all equally hard - an efficient solution to one solves them all.
    - [ ] **Not quite.** Think about what all the problems in this class have in common with each other in terms of difficulty.

- # What is the "P vs NP" question asking?

    ---

    - [ ] Whether computers will ever exist
    - [x] Whether every quickly-checkable problem can also be quickly solved
    - [ ] Whether NP problems are always slower than P problems
    - [ ] Whether P is a subset of encryption

    ---

    - [x] **Correct!** It's the unsolved question of whether checking and solving are equally easy for every problem.
    - [ ] **Not quite.** Think about the gap between being able to check an answer and being able to find one.

- # Why does modern encryption rely on **P ≠ NP**?

    ---

    - [x] Because factoring large numbers is believed to be intractable to solve, but easy to verify
    - [ ] Because computers can't multiply large numbers
    - [ ] Because passwords are always 8 characters long
    - [ ] Because P and NP don't apply to encryption

    ---

    - [x] **Correct!** If factoring became easy (P = NP), most current encryption would break.
    - [ ] **Not quite.** Think about what would happen to a "hard to solve, easy to verify" problem if it suddenly became easy to solve too.

- # What does "intractable" mean for a problem?

    ---

    - [ ] It has multiple valid solutions
    - [x] It needs non-polynomial time to solve exactly, making it impractical for large N
    - [ ] It can only be solved with pen and paper
    - [ ] It's a problem nobody has ever attempted

    ---

    - [x] **Correct!** Intractable problems become impractical almost immediately as N grows - which is why approximations and heuristics exist.
    - [ ] **Not quite.** Think about how the required effort changes as the input size grows very large.

- # Which of these is classed as NP-Hard because no efficient exact solution is known?

    ---

    - [ ] Sorting a list of numbers
    - [ ] Searching an unsorted list
    - [x] Finding the optimal route in the Travelling Salesperson Problem
    - [ ] Checking if a number is even or odd

    ---

    - [x] **Correct!** TSP's optimal solution requires checking every route - **O(N!)** - along with Knapsack and Bin-Packing's **O(2<sup>N</sup>)**.
    - [ ] **Not quite.** Think about which of these problems has no known fast way to find the *best* possible answer.

- # Why is the P vs NP question considered so significant?

    ---

    - [ ] It has already been solved, but kept secret
    - [x] It's an unsolved Millennium Prize Problem worth $1,000,000 to whoever proves it
    - [ ] It only matters to mathematicians, not computer scientists
    - [ ] It was solved by quantum computers in 2019

    ---

    - [x] **Correct!** The Clay Mathematics Institute offers $1,000,000 for a proof either way - and the answer would reshape cryptography and optimisation.
    - [ ] **Not quite.** Think about how famous and unresolved this particular question still is.

- # What is true about the relationship between P and NP?

    ---

    - [x] Every problem in P is also in NP
    - [ ] P and NP share no problems in common
    - [ ] Every problem in NP is also in P
    - [ ] NP is a smaller class than P

    ---

    - [x] **Correct!** If you can solve a problem quickly, you can obviously also check a proposed solution quickly - so P is a subset of NP.
    - [ ] **Not quite.** Think about whether being able to *solve* something quickly also means you could *check* an answer quickly.

</quiz>
