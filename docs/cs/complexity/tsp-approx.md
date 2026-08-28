# Approximate Solutions to The Travelling Salesperson Problem

## A Faster (But Imperfect) Approach

Since brute force is only practical for tiny N, we use a **heuristic** instead: the **nearest neighbour** approach - always travel to the closest unvisited city.

- **Time**: **O(N<sup>2</sup>)** - much faster
- **Quality**: typically about 25% longer than the optimal route

See [Approximation Algorithms & Heuristics](approximation.md) for more on this trade-off.




## Nearest Neighbour: A Faster Alternative

Brute force guarantees the optimal solution, but becomes impossible for large problems. **Nearest Neighbour** is a greedy heuristic that's much faster:

1. Start at a city
2. Always visit the nearest unvisited city
3. Return to start when all cities visited

This runs in **O(n²)** time instead of **O(n!)** - meaning 30 cities takes milliseconds instead of billions of years!

The trade-off? The route might not be optimal, but it's usually pretty good (typically 15-25% longer than optimal).

### Try Nearest Neighbour

See how it builds a route by always choosing the nearest city:

<tsp solve="nn" cities="12"></tsp>

Notice:
- **Green highlighted city**: Current position
- **Gray faded cities**: Not yet visited
- **Normal cities**: Already visited
- **Route building in real-time**: Watch the greedy choice at each step

### Larger Problems Are No Problem

With NN, even 30 cities is instant:

<tsp solve="nn" cities="30"></tsp>

For brute force, 30 cities would take longer than the age of the universe. With NN? Less than a second.

### See the progress...

<tsp solve="nn" cities="30" history></tsp>


---

## 2-Opt: Refining the Greedy Solution

**Nearest Neighbour** gives us a quick solution, but can we make it better without brute force?

**2-Opt** is a local search algorithm that starts with the NN solution and iteratively improves it:

1. Start with NN route
2. For each pair of edges in the tour:
   - Try swapping them (reversing the segment between them)
   - If it reduces total distance, keep the swap
3. Repeat until a full pass finds no improvements (local optimum reached)

The algorithm **stops** when it completes a full pass through all edge pairs without finding any improvement. This means it has reached a **local optimum**-no single 2-opt move can improve the solution further.

Key insight: 2-Opt systematically untangles crossing edges. Each swap that improves the tour removes at least one crossing, gradually refining the route.

### Watch 2-Opt in Action

See how it builds an NN route, then refines it by testing edge swaps:

<tsp solve="2opt" cities="15" history></tsp>

Notice:
- **Phase 1 (NN)**: Quick greedy construction
- **Phase 2 (2-Opt)**: Edge swaps highlighted in orange (testing) or red (improving)
- **History**: Shows both NN construction and 2-Opt refinements

### Larger Problems

2-Opt can handle much larger problems than brute force:

<tsp solve="2opt" cities="25" history></tsp>

For 25 cities, brute force would take longer than the age of the universe. 2-Opt? A few seconds.

---

## Comparing Algorithms

### NN vs Brute Force

Let's compare NN and Brute Force head-to-head to see the speed vs. quality trade-off:

<tsp solve="compare-nn" cities="10"></tsp>

The comparison shows:
- **NN distance & time**: How good was the greedy solution? How fast was it?
- **Brute Force distance & time**: The guaranteed optimal solution (but slower)
- **Difference**: How much longer is the NN route compared to optimal?

Try it with 11 or 12 cities-NN finishes instantly, but brute force takes minutes!

<tsp solve="compare-nn" cities="11" history></tsp>

### 2-Opt vs Brute Force

Now let's see how 2-Opt (NN + refinement) compares to the optimal solution:

<tsp solve="compare-2opt" cities="10" history></tsp>

Notice how much closer 2-Opt gets to optimal compared to raw NN! The refinement phase typically gets within a few percent of optimal.

Try larger problems:

<tsp solve="compare-2opt" cities="11" history></tsp>

---

## Key Takeaways

1. **Brute Force** is guaranteed optimal but becomes impossible beyond ~13 cities
2. **Nearest Neighbour** is fast (works for any size) but not guaranteed optimal (typically 15-25% longer)
3. **2-Opt refinement** significantly improves NN routes, often getting within a few percent of optimal
4. For practical problems, heuristics like NN and local search are essential-perfection isn't worth billions of years
5. Understanding algorithmic complexity (factorial vs. polynomial) is crucial for real-world programming

---

**Challenge**: Run the comparisons with different city counts. At what point does 2-Opt become "good enough" given how much faster it is than brute force?




## Key Terms

<flashcards>

- # Travelling Salesperson Problem (TSP)

    ---

    Find the **shortest route** that visits every city once and returns to the start.

- # Why TSP is intractable

    ---

    Checking a route is **O(N)**, but finding the best one (brute force) is **O(N!)**.

- # Nearest neighbour heuristic

    ---

    Always travel to the **closest unvisited city** - fast (**O(N<sup>2</sup>)**), but not always optimal.

</flashcards>

