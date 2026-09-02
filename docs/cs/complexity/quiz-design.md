# Quiz: Algorithmic Design

Test your understanding of algorithmic design and optimisation

<quiz>

## Algorithmic Design and Optimisation Quiz

- # A greedy algorithm makes its decisions by...

    ---

    - [ ] Trying every possible option before choosing
    - [x] Picking the best choice available right now, without looking back
    - [ ] Randomly guessing an answer
    - [ ] Remembering every previous subproblem's answer

    ---

    - [x] **Correct!** Greedy algorithms commit to the locally best choice at each step and never backtrack.
    - [ ] **Not quite.** Think about whether this strategy looks ahead, remembers past work, or just commits immediately.

- # Dynamic programming is most useful when a problem has...

    ---

    - [ ] Completely independent subproblems
    - [x] Overlapping subproblems that would otherwise be recalculated
    - [ ] No subproblems at all
    - [ ] Only one possible solution

    ---

    - [x] **Correct!** DP saves time by remembering answers to subproblems that show up again and again.
    - [ ] **Not quite.** Think about what kind of repeated work dynamic programming is designed to avoid.

- # What does a "divide and conquer" strategy do?

    ---

    - [ ] Solves the whole problem in one single pass
    - [x] Splits the problem into smaller pieces, solves each, then combines the results
    - [ ] Picks the best local option at every step
    - [ ] Remembers answers to avoid recalculating them

    ---

    - [x] **Correct!** Merge sort is a classic example - splitting, sorting each half, then merging back together in **O(N log N)**.
    - [ ] **Not quite.** Think about what happens to the problem itself, before any solving takes place.

- # When does a greedy strategy tend to fail?

    ---

    - [x] When the locally best choice blocks a better overall combination
    - [ ] When there's only one possible choice available
    - [ ] When the problem has no subproblems
    - [ ] Greedy algorithms never fail

    ---

    - [x] **Correct!** Committing to one "good" choice early can rule out a better combination later on - as seen in the Knapsack problem.
    - [ ] **Not quite.** Think about what "never looking back" could cost you later in the process.

- # Compared to a greedy approach, dynamic programming is usually...

    ---

    - [ ] Faster, but less accurate
    - [x] Slower, but guaranteed optimal
    - [ ] Identical in speed and accuracy
    - [ ] Only usable for sorting problems

    ---

    - [x] **Correct!** DP explores overlapping subproblems thoroughly, trading some speed for a guaranteed best answer.
    - [ ] **Not quite.** Think about the trade-off between "always correct" and "always fast".

- # What does "optimising an algorithm" usually mean in practice?

    ---

    - [ ] Tidying up variable names and comments
    - [x] Choosing a better strategy that improves the algorithm's complexity class
    - [ ] Running the same code on a faster computer
    - [ ] Making the code shorter, regardless of speed

    ---

    - [x] **Correct!** Moving from, say, **O(N<sup>2</sup>)** to **O(N log N)** matters far more than cosmetic code changes or faster hardware.
    - [ ] **Not quite.** Think about what would actually change how an algorithm's effort scales with N.

- # What guarantee does an "approximation algorithm" provide?

    ---

    - [ ] No guarantee at all - it's just a rule of thumb
    - [x] A proven bound on how close it gets to the optimal answer
    - [ ] That it always finds the exact optimal answer
    - [ ] That it runs in constant time

    ---

    - [x] **Correct!** Approximation algorithms come with a mathematical guarantee, such as "never more than 25% worse than optimal".
    - [ ] **Not quite.** Think about what separates a formally provable guarantee from a practical rule of thumb.

- # What is a "heuristic"?

    ---

    - [x] A practical rule of thumb that usually works well, with no formal guarantee
    - [ ] An algorithm proven to always find the optimal answer
    - [ ] A method that only works on sorted data
    - [ ] A synonym for "brute force"

    ---

    - [x] **Correct!** Heuristics are practical shortcuts - fast and usually good, but without a mathematical promise.
    - [ ] **Not quite.** Think about whether this approach comes with a proof, or just a track record of working well.

- # How does the nearest neighbour heuristic typically perform on the Travelling Salesperson Problem?

    ---

    - [ ] It always finds the exact optimal route
    - [x] It runs in **O(N<sup>2</sup>)** and is typically around 15-25% longer than optimal
    - [ ] It runs in **O(N!)**, just like brute force
    - [ ] It never produces a valid route

    ---

    - [x] **Correct!** Nearest neighbour trades a small amount of route quality for a massive speed advantage over brute force.
    - [ ] **Not quite.** Think about the trade-off this heuristic makes between speed and how close it gets to the perfect route.

- # Why can a greedy, value-to-weight heuristic miss the optimal Knapsack combination?

    ---

    - [x] Taking the best ratio first can leave no room for a better combination of other items
    - [ ] It runs too slowly to ever finish
    - [ ] It can only be used when there's just one item
    - [ ] It ignores the weight limit completely

    ---

    - [x] **Correct!** Locking in one high-ratio item early can block a combination of smaller items that would have been worth more overall.
    - [ ] **Not quite.** Think about what happens once an early greedy choice has used up the available capacity.

</quiz>
