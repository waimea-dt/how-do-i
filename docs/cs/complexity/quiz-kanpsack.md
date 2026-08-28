# Quiz: TSP, Knapsack & Approximation

Test your understanding of classic hard problems and how we solve them in practice.

<quiz>

## Hard Problems Quiz

- # In the Travelling Salesperson Problem, what makes finding the best route hard?

    ---

    - [ ] Adding up a route's distance takes too long
    - [x] The number of possible routes grows factorially with the number of cities
    - [ ] Computers can't store city names
    - [ ] There's no way to check if a route is valid

    ---

    - [x] **Correct!** Checking one route is easy (**O(N)**), but trying every route is **O(N!)** - it explodes fast.
    - [ ] **Not quite.** Checking a route is fast - it's the sheer number of possible routes that's the problem.

- # What complexity is the brute-force approach to TSP?

    ---

    - [ ] **O(N)**
    - [ ] **O(N<sup>2</sup>)**
    - [ ] **O(2<sup>N</sup>)**
    - [x] **O(N!)**

    ---

    - [x] **Correct!** Trying every possible ordering of cities is factorial time.
    - [ ] **Not quite.** **O(N!)** is correct - checking every permutation of cities.

- # What is the "nearest neighbour" heuristic for TSP?

    ---

    - [x] Always travel to the closest unvisited city
    - [ ] Always travel to the furthest unvisited city
    - [ ] Visit cities in alphabetical order
    - [ ] Randomly pick the next city each time

    ---

    - [x] **Correct!** It's a fast, simple rule that usually gives a decent (but not always optimal) route.
    - [ ] **Not quite.** Nearest neighbour specifically means choosing the closest unvisited city each step.

- # In the 0/1 Knapsack Problem, what does "0/1" mean?

    ---

    - [x] Each item is either fully taken or not taken at all
    - [ ] There are only 2 items to choose from
    - [ ] The knapsack has zero capacity
    - [ ] Items are worth either 0 or 1 points

    ---

    - [x] **Correct!** You can't take a fraction of an item - it's all or nothing for each one.
    - [ ] **Not quite.** "0/1" refers to the all-or-nothing choice for each item, not item count or value.

- # Why does checking every subset for the Knapsack problem become impractical?

    ---

    - [ ] Because there's no way to calculate the total value
    - [x] Because the number of subsets is **O(2<sup>N</sup>)**
    - [ ] Because knapsacks can only hold 10 items
    - [ ] Because it's impossible to weigh items accurately

    ---

    - [x] **Correct!** Each item is either "in" or "out", giving 2<sup>N</sup> possible subsets to check.
    - [ ] **Not quite.** The issue is the exponential number of subsets, not measuring weight or value.

- # Why can a greedy (value-to-weight ratio) approach fail for Knapsack?

    ---

    - [x] Taking the best ratio first can block a better combination of smaller items
    - [ ] Greedy algorithms are always slower than brute force
    - [ ] Greedy algorithms can't calculate ratios
    - [ ] Greedy only works when there's just one item

    ---

    - [x] **Correct!** Locking in one "good" item early can leave no room for a better overall combination.
    - [ ] **Not quite.** Greedy is fast, not slow - its problem is that it can miss the optimal combination.

- # What's the difference between an "approximation algorithm" and a "heuristic"?

    ---

    - [x] An approximation algorithm has a proven guarantee on how close it gets to optimal; a heuristic doesn't
    - [ ] They are exactly the same thing
    - [ ] A heuristic always finds the perfect answer
    - [ ] An approximation algorithm is always slower than brute force

    ---

    - [x] **Correct!** Approximation algorithms come with a mathematical guarantee, while heuristics are just practical rules of thumb.
    - [ ] **Not quite.** The key difference is the formal guarantee, not speed or correctness.

</quiz>
