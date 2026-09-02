# Quiz: The Knapsack Problem

Test your understanding of the 0/1 Knapsack Problem and how we solve it in practice.

<quiz>

## Knapsack Quiz

- # In the 0/1 Knapsack Problem, what does "0/1" mean?

    ---

    - [x] Each item is either fully taken or not taken at all
    - [ ] There are only 2 items to choose from
    - [ ] The knapsack has zero capacity
    - [ ] Items are worth either 0 or 1 points

    ---

    - [x] **Correct!** You can't take a fraction of an item - it's all or nothing for each one.
    - [ ] **Not quite.** Think about what choice you're making for each individual item - not the number of items or their value.

- # Which of these is a real-world example of the Knapsack Problem?

    ---

    - [x] Deciding which cargo to load onto a truck for maximum profit
    - [ ] Alphabetising a list of customer names
    - [ ] Finding the shortest route between two cities
    - [ ] Checking if a hash matches a stolen password

    ---

    - [x] **Correct!** Cargo loading, resource allocation, and memory management are all classic Knapsack-style problems.
    - [ ] **Not quite.** Think about which of these tasks involves choosing a combination of items under a limit.

- # Why does checking every subset for the Knapsack problem become impractical?

    ---

    - [ ] Because there's no way to calculate the total value
    - [x] Because the number of subsets is **O(2<sup>N</sup>)**
    - [ ] Because knapsacks can only hold 10 items
    - [ ] Because it's impossible to weigh items accurately

    ---

    - [x] **Correct!** Each item is either "in" or "out", giving 2<sup>N</sup> possible subsets to check.
    - [ ] **Not quite.** Think about how many different in/out combinations exist for a growing list of items.

- # With 30 items, roughly how many possible subsets must brute force check?

    ---

    - [ ] About 30
    - [ ] About 1,000
    - [x] About 1 billion
    - [ ] Exactly 2

    ---

    - [x] **Correct!** 30 items gives 2<sup>30</sup>, which is roughly 1,073,741,824 possible subsets.
    - [ ] **Not quite.** Think about what doubling the subset count for every single extra item leads to after 30 items.

- # What does a greedy heuristic for Knapsack typically do?

    ---

    - [x] Sorts items by value-to-weight ratio and takes the best ones first
    - [ ] Takes items in a completely random order
    - [ ] Always takes the heaviest item first
    - [ ] Checks every possible subset before deciding

    ---

    - [x] **Correct!** Sorting by value-to-weight ratio and greedily taking the best first is fast, even if not always optimal.
    - [ ] **Not quite.** Think about what single measurement this heuristic uses to rank items before choosing.

- # What is the time complexity of the greedy value-to-weight heuristic?

    ---

    - [ ] **O(2<sup>N</sup>)**
    - [ ] **O(N!)**
    - [x] **O(N log N)**
    - [ ] **O(1)**

    ---

    - [x] **Correct!** Sorting the items dominates the cost, giving **O(N log N)** - far faster than checking every subset.
    - [ ] **Not quite.** Think about what step (sorting the items) dominates the cost of this heuristic.

- # Why can the greedy heuristic fail to find the optimal Knapsack combination?

    ---

    - [x] Taking the best ratio first can block a better combination of smaller items
    - [ ] Greedy algorithms are always slower than brute force
    - [ ] Greedy algorithms can't calculate ratios
    - [ ] Greedy only works when there's just one item

    ---

    - [x] **Correct!** Locking in one "good" item early can leave no room for a better overall combination.
    - [ ] **Not quite.** Think about what happens to the remaining capacity once an early greedy choice has been made.

- # What advantage does dynamic programming have over the greedy heuristic for Knapsack?

    ---

    - [x] It guarantees the exact optimal answer, by remembering overlapping subproblems
    - [ ] It's always faster than the greedy approach
    - [ ] It never needs to consider item weights
    - [ ] It only works when there's a single item

    ---

    - [x] **Correct!** Dynamic programming builds up a table of best-value-so-far, guaranteeing the optimal answer without checking every subset from scratch.
    - [ ] **Not quite.** Think about the trade-off between "always correct" and "always fastest".

- # Why is the 0/1 Knapsack Problem classed as NP-complete?

    ---

    - [x] It's hard to solve optimally, but easy to verify a proposed solution's total value and weight
    - [ ] It has never been solved by any computer
    - [ ] It can only be solved using sorting algorithms
    - [ ] It has no real-world applications

    ---

    - [x] **Correct!** Checking a proposed set of items is fast, even though finding the guaranteed best combination is hard.
    - [ ] **Not quite.** Think about the difference between checking a proposed answer and finding the best one from scratch.

- # Which best summarises the trade-off between brute force, greedy, and dynamic programming for Knapsack?

    ---

    - [ ] All three always give exactly the same answer at exactly the same speed
    - [x] Brute force is optimal but slow, greedy is fast but sometimes wrong, and DP is optimal and faster than brute force
    - [ ] Greedy is always the most accurate of the three
    - [ ] Dynamic programming is the slowest of the three

    ---

    - [x] **Correct!** Each approach makes a different trade-off between speed and guaranteed accuracy.
    - [ ] **Not quite.** Think about which approach guarantees the best answer, and which sacrifices accuracy for speed.

</quiz>
