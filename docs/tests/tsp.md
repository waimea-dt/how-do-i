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
- **Nearest Neighbor**: Always go to the closest unvisited city
- **2-opt**: Iteratively improve a route by swapping edges

These algorithms won't always find the _optimal_ solution, but they find _good_ solutions much faster than brute force—often in polynomial time rather than factorial time.

---

**Challenge**: Try to predict how long 10 cities will take based on 9 cities. Then test your prediction! Notice that each additional city multiplies the time by N.
