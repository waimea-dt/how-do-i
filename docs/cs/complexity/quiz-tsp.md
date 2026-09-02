# Quiz: The Travelling Salesperson Problem

Test your understanding of the TSP, why it's hard, and how we solve it approximately in practice.

<quiz>

## Travelling Salesperson Quiz

- # What does the Travelling Salesperson Problem ask you to find?

    ---

    - [ ] The single closest city to a starting point
    - [x] The shortest route that visits every city once and returns to the start
    - [ ] The fastest way to sort a list of cities alphabetically
    - [ ] Any route at all, regardless of length

    ---

    - [x] **Correct!** TSP is about finding the shortest possible route that visits every city exactly once before returning home.
    - [ ] **Not quite.** Think about what makes a route "the best" one, not just "a" valid one.

- # Why is finding the optimal TSP route so hard?

    ---

    - [ ] Calculating a single route's total distance takes too long
    - [x] The number of possible routes grows factorially as cities are added
    - [ ] Computers can't store city coordinates
    - [ ] There's no way to check whether a route is valid

    ---

    - [x] **Correct!** Checking one route is fast, but the sheer number of possible routes explodes as more cities are added.
    - [ ] **Not quite.** Think about how many different orderings of cities exist, not how hard it is to measure just one of them.

- # What is the complexity of the brute-force approach to TSP?

    ---

    - [ ] **O(N)**
    - [ ] **O(N<sup>2</sup>)**
    - [ ] **O(2<sup>N</sup>)**
    - [x] **O(N!)**

    ---

    - [x] **Correct!** Brute force must check every possible ordering of cities - factorial time.
    - [ ] **Not quite.** Think about how many different orderings exist for a list of N cities.

- # Which of these is a real-world application of TSP-style problems?

    ---

    - [x] Planning delivery routes for a courier company
    - [ ] Alphabetising a list of customer names
    - [ ] Checking whether a password has been leaked
    - [ ] Compressing an image file

    ---

    - [x] **Correct!** Delivery routing, circuit board drilling, and telescope scheduling all involve finding an efficient order to visit many points.
    - [ ] **Not quite.** Think about which of these tasks involves visiting many locations in the best possible order.

- # What does the "nearest neighbour" heuristic do?

    ---

    - [x] Always travels to the closest unvisited city next
    - [ ] Always travels to the furthest unvisited city next
    - [ ] Visits cities in alphabetical order
    - [ ] Picks the next city completely at random

    ---

    - [x] **Correct!** It's a simple, fast rule: always head to whichever unvisited city is closest.
    - [ ] **Not quite.** Think about which single, simple rule this heuristic follows at every step.

- # How does nearest neighbour's route quality typically compare to the optimal route?

    ---

    - [ ] It always finds the exact optimal route
    - [x] It's typically around 15-25% longer than optimal, but runs in **O(N<sup>2</sup>)**
    - [ ] It's usually shorter than the optimal route
    - [ ] It performs worse than checking routes at random

    ---

    - [x] **Correct!** Nearest neighbour trades some route quality for a huge speed advantage over brute force.
    - [ ] **Not quite.** Think about the trade-off this heuristic makes between being fast and being perfect.

- # What does the 2-Opt algorithm do to an initial nearest-neighbour route?

    ---

    - [ ] Deletes it and starts again from brute force
    - [x] Iteratively swaps pairs of edges to reduce the total distance
    - [ ] Sorts the cities alphabetically instead
    - [ ] Doubles the number of cities visited

    ---

    - [x] **Correct!** 2-Opt looks for edge swaps that shorten the route, repeatedly refining the nearest-neighbour starting point.
    - [ ] **Not quite.** Think about what small, repeated change 2-Opt makes to try to shorten an existing route.

- # When does the 2-Opt algorithm stop improving a route?

    ---

    - [ ] After exactly one swap, regardless of the result
    - [x] Once a full pass finds no swap that improves the route (a local optimum)
    - [ ] As soon as it matches the brute-force optimal route
    - [ ] After a fixed number of cities have been visited

    ---

    - [x] **Correct!** 2-Opt keeps swapping edges until no single swap can shorten the route any further.
    - [ ] **Not quite.** Think about what condition would mean there's nothing left to improve.

- # How does 2-Opt's route quality typically compare to nearest neighbour alone?

    ---

    - [ ] 2-Opt is always worse than nearest neighbour
    - [x] 2-Opt typically gets within a few percent of the optimal route - closer than nearest neighbour alone
    - [ ] They always produce exactly the same route
    - [ ] 2-Opt is only usable for fewer than 5 cities

    ---

    - [x] **Correct!** By refining the nearest-neighbour route, 2-Opt closes much of the gap to the optimal solution.
    - [ ] **Not quite.** Think about what refining an existing route, rather than starting fresh, might achieve.

- # Roughly how many cities can brute-force TSP still handle in practical time?

    ---

    - [x] Around 13 cities
    - [ ] Around 1,000 cities
    - [ ] Around 1,000,000 cities
    - [ ] Any number of cities

    ---

    - [x] **Correct!** Beyond around 13 cities, brute force quickly takes longer than the age of the universe to complete.
    - [ ] **Not quite.** Think about how quickly **O(N!)** explodes, even for relatively small numbers of cities.

</quiz>
