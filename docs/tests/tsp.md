# TSP Visualizer

> Interactive brute-force Travelling Salesman Problem solver

## What is the TSP?

The **Travelling Salesman Problem** asks: given a list of cities, what is the shortest route that visits each city exactly once and returns to the starting point?

This is a classic **NP-hard** problem in computer science. The brute-force approach tests _every possible route_ to find the optimal solution. For N cities, there are **(N-1)! / 2** unique routes to check (we can fix the starting city and ignore direction).

## Why does it grow so fast?

| Cities | Routes to Check | Factorial | Estimated Time* |
|--------|----------------|-----------|-----------------|
| 3      | 1              | 2!        | Instant         |
| 4      | 6              | 3!        | Instant         |
| 5      | 24             | 4!        | Instant         |
| 6      | 120            | 5!        | Instant         |
| 7      | 720            | 6!        | Instant         |
| 8      | 5,040          | 7!        | < 1 second      |
| 9      | 40,320         | 8!        | ~3 seconds      |
| 10     | 362,880        | 9!        | ~30 seconds     |
| 11     | 3,628,800      | 10!       | ~5 minutes      |
| 12     | 39,916,800     | 11!       | ~55 minutes     |
| 13     | 479,001,600    | 12!       | ~11 hours       |
| 14     | 6,227,020,800  | 13!       | ~6 days         |
| 15     | 87,178,291,200 | 14!       | ~3 months       |
| 20     | 1.22 × 10¹⁷    | 19!       | ~320,000 years  |
| 25     | 6.20 × 10²³    | 24!       | Age of universe × 150,000 |
| 30     | 8.84 × 10³⁰    | 29!       | Effectively impossible |

<small>*Times based on actual JavaScript performance on average hardware. Your machine may be faster or slower. Note: For N cities, we fix the first city and check (N-1)! routes.</small>

Notice the **factorial growth**—each additional city multiplies the time by N. Beyond ~13 cities, brute force becomes completely impractical.

## Try it yourself

Use the slider to adjust the number of cities (3–30), then click **Start** to watch the algorithm search for the best route. The default of 8 cities completes in under a second.

<tsp></tsp>

## Different starting points

Start with fewer cities (6) for a faster demonstration:

<tsp cities="6"></tsp>

## Slower Speed

See the progress, slowly:

<tsp cities="8" speed="slow"></tsp>

## High Speed

See the progress, very fast:

<tsp cities="8" speed="fast"></tsp>

## Instant Speed

See the progress, instantly (no animation):

<tsp cities="8" speed="instant"></tsp>

## Tracking improvements

Add the `history` attribute to see how the algorithm finds better routes over time. The history panel shows the 10 most recent improvements (scrollable list of last 100):

<tsp cities="10" history></tsp>

## Larger problems

Try 10 cities to see how the search takes significantly longer:

<tsp cities="11"></tsp>

## Much Larger problems

Try 12 cities to see impractical computation times (warning: takes ~55 minutes on average hardware):

<tsp cities="12"></tsp>

## The Impossibility

Want to try 20 or 30 cities? Go ahead and use the slider—but the "Estimated Remaining" time will show why brute force is fundamentally broken for this problem.

<tsp cities="20"></tsp>

## How it works

1. **Brute Force Algorithm**:
   - Generate all possible permutations of cities
   - Calculate total distance for each route
   - Track the best (shortest) route found
   - Display progress as routes are checked

2. **Visualization**:
   - **Gray dashed lines**: Current route being evaluated
   - **Bright solid lines**: Best route found so far
   - **Thick colored lines**: Final optimal route (when complete)

3. **Performance**:
   - Notice how much slower the algorithm gets with each additional city
   - The "Estimated Remaining" time is calculated from actual runtime and varies by machine
   - For 8 cities, you'll check 5,040 routes (7!)
   - For 10 cities, you'll check 362,880 routes (9!)—taking ~30 seconds
   - For 12 cities, you'll check ~40 million routes (11!)—taking ~55 minutes
   - For 13 cities, you'll check ~479 million routes (12!)—taking ~11 hours

---

## Nearest Neighbour: A Faster Alternative

Brute force guarantees the optimal solution, but becomes impossible for large problems. **Nearest Neighbour** is a greedy heuristic that's much faster:

1. Start at a city
2. Always visit the nearest unvisited city
3. Return to start when all cities visited

This runs in **O(n²)** time instead of **O(n!)** — meaning 30 cities takes milliseconds instead of billions of years!

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

## Comparing Algorithms

Let's compare NN and Brute Force head-to-head to see the speed vs. quality trade-off:

<tsp solve="compare-nn" cities="10"></tsp>

The comparison shows:
- **NN distance & time**: How good was the greedy solution? How fast was it?
- **Brute Force distance & time**: The guaranteed optimal solution (but slower)
- **Difference**: How much longer is the NN route compared to optimal?

Try it with 11 or 12 cities—NN finishes instantly, but brute force takes minutes!

<tsp solve="compare-nn" cities="11" history></tsp>

---

## Key Takeaways

1. **Brute Force** is guaranteed optimal but becomes impossible beyond ~13 cities
2. **Nearest Neighbour** is fast (works for any size) but not guaranteed optimal
3. For practical problems, heuristics like NN are essential—perfection isn't worth billions of years
4. Understanding algorithmic complexity (factorial vs. polynomial) is crucial for real-world programming

---

**Challenge**: Run the comparison with different city counts. At what point does NN become "good enough" given how much faster it is?
