# The Travelling Salesperson Problem

## The Classic Challenge

The **Travelling Salesperson Problem (TSP)** is one of the most famous problems in computer science:

> Given a list of cities and the distances between them, what is the shortest route that visits each city exactly once and returns to the starting point?

## Why Is It Important?

TSP isn't just about salespeople - it appears everywhere:

- **Logistics**: Delivery route optimization (Amazon, UPS, FedEx)
- **Manufacturing**: Drilling circuit boards (minimize tool movement)
- **DNA Sequencing**: Order fragments efficiently
- **Astronomy**: Telescope observation scheduling
- **Microchip design**: Component placement

## The Complexity Problem

TSP is **NP-hard**, which means:
- ✅ Checking if a route is good is easy: **O(N)**
- ❌ Finding the best route is hard: **O(N!)** brute force

## Try It Yourself

<tsp cities="8"></tsp>

Start with 8 cities - watch the algorithm test routes. Try increasing to 10 or 11 to see how quickly it becomes impractical!

## Why So Many Routes?

For N cities, we fix the starting city and check all permutations of the remaining cities. But we can traverse a route in either direction, so:

**Unique routes = (N-1)!/2**

### Growth Is Explosive

| Cities | Routes to Check | Time Estimate* |
|--------|----------------|----------------|
| 5 | 12 | Instant |
| 8 | 2,520 | < 1 second |
| 10 | 181,440 | ~30 seconds |
| 11 | 1,814,400 | ~5 minutes |
| 12 | 19,958,400 | ~55 minutes |
| 13 | 239,500,800 | ~11 hours |
| 15 | 43,589,145,600 | ~3 months |
| 20 | 1.22 × 10<sup>17</sup> | ~320,000 years |
| 25 | 3.1 × 10<sup>23</sup> | Longer than universe's age |

<small>*Actual JavaScript performance on typical hardware</small>

<big-o algos="tsp" max="15"></big-o>

Watch how factorial complexity explodes!

## Brute Force Algorithm

```python
def tsp_brute_force(cities, distances):
    n = len(cities)
    best_route = None
    best_distance = float('inf')

    # Try all permutations (fixing first city)
    for route in permutations(cities[1:]):
        route = [cities[0]] + list(route) + [cities[0]]
        distance = sum(distances[route[i]][route[i+1]]
                      for i in range(n))

        if distance < best_distance:
            best_distance = distance
            best_route = route

    return best_route, best_distance
```

**Time**: **O(N!)** - checks every permutation
**Space**: **O(N)** - stores best route

## Interactive Exploration

### Small Problem (6 cities)
Quick completion:

<tsp cities="6"></tsp>

### Medium Problem (10 cities)
Takes about 30 seconds:

<tsp cities="10"></tsp>

### With History Tracking
See how the algorithm finds improvements:

<tsp cities="9" history></tsp>

Notice how it finds better routes over time, keeping the best one!

## Practical Approaches

Since we can't solve TSP optimally for large instances, we use approximation algorithms:

### 1. Nearest Neighbor Heuristic

**Algorithm**: Start at a city, always go to the nearest unvisited city.

```python
def tsp_nearest_neighbor(cities, distances):
    current = 0
    unvisited = set(range(1, len(cities)))
    route = [current]

    while unvisited:
        nearest = min(unvisited,
                     key=lambda city: distances[current][city])
        route.append(nearest)
        unvisited.remove(nearest)
        current = nearest

    route.append(0)  # Return to start
    return route
```

**Time**: **O(N<sup>2</sup>)** - much faster!
**Quality**: Typically 25% longer than optimal
**When to use**: Quick approximation needed

### 2. 2-Opt Improvement

**Algorithm**: Start with any tour, repeatedly swap pairs of edges if it improves the route.

```python
def tsp_2opt(route, distances):
    improved = True
    while improved:
        improved = False
        for i in range(1, len(route) - 2):
            for j in range(i + 1, len(route)):
                if swap_improves(route, i, j, distances):
                    route[i:j] = reversed(route[i:j])
                    improved = True
    return route
```

**Time**: **O(N<sup>2</sup>)** to **O(N<sup>3</sup>)** depending on iterations
**Quality**: Often within a few % of optimal
**When to use**: When quality matters more than speed

### 3. Genetic Algorithm

**Algorithm**: Evolve a population of routes, keeping the best and mutating them.

**Time**: **O(g · p · N)** where g is generations, p is population size
**Quality**: Good, but unpredictable
**When to use**: Large instances, willing to wait

### 4. Dynamic Programming (Held-Karp)

**Algorithm**: Use dynamic programming with bitmasks to track visited cities.

**Time**: **O(N<sup>2</sup> · 2<sup>N</sup>)** - better than **O(N!)** but still exponential!
**Space**: **O(N · 2<sup>N</sup>)**
**Quality**: Optimal
**When to use**: Up to ~20 cities when you need the optimal solution

## Comparison: Optimal vs Approximate

| Approach | Time | Quality | Usable For |
|----------|------|---------|------------|
| **Brute Force** | **O(N!)** | ✅ Optimal | N ≤ 12 |
| **Held-Karp DP** | **O(N<sup>2</sup> 2<sup>N</sup>)** | ✅ Optimal | N ≤ 20 |
| **Nearest Neighbor** | **O(N<sup>2</sup>)** | ⚠️ ~125% optimal | Any N |
| **2-Opt** | **O(N<sup>2</sup>)** to **O(N<sup>3</sup>)** | ✅ ~102-105% optimal | Any N |
| **Genetic** | **O(g · p · N)** | ✅ ~103-110% optimal | Any N |

## Variations of TSP

### Metric TSP
Distances satisfy triangle inequality: d(A,C) ≤ d(A,B) + d(B,C)

**Approximation**: Christofides algorithm guarantees ≤ 1.5× optimal in **O(N<sup>3</sup>)**

### Asymmetric TSP
Distance from A to B might differ from B to A (one-way streets).

**Harder**: No good approximation guarantees.

### Multiple Salesmen
Multiple routes starting from depot.

**Application**: Fleet optimization

### TSP with Time Windows
Must visit cities within specific time ranges.

**Application**: Delivery scheduling

## Real-World Solutions

### Small Scale (< 15 cities)
Use **exact algorithms** (brute force or Held-Karp) to guarantee optimality.

### Medium Scale (15-100 cities)
Use **2-Opt** or **Simulated Annealing** for near-optimal solutions quickly.

### Large Scale (100-10,000 cities)
Use advanced heuristics like **Lin-Kernighan** or **Concorde TSP solver**.

### Very Large Scale (> 10,000 cities)
Break into smaller regions, solve separately, stitch together.

## Interesting Facts

1. **World Record**: The largest TSP solved exactly had 85,900 cities (all pubs in England)!
2. **Prize**: There was a $10,000 prize for solving certain instances (since awarded)
3. **Approximation Bound**: If P ≠ NP, no polynomial algorithm can guarantee better than 1.5× optimal for metric TSP
4. **Art**: TSP has been used to create continuous-line portraits (TSP Art)

## Visualization of Growth

<big-o algos="tsp-brute" step="5" max="20"></big-o>

See how factorial growth makes brute force impractical beyond tiny inputs!

## Key Takeaways

1. TSP is **NP-hard** - no known polynomial-time optimal algorithm
2. **Brute force** is only practical up to ~12 cities
3. **Heuristics** give good solutions quickly for any size
4. **2-Opt improvement** is a great balance of speed and quality
5. Real-world logistics relies on approximation algorithms
6. Even "bad" approximations (125% of optimal) are often good enough

> [!TIP]
> For practical TSP problems, don't waste time seeking perfection! A 5% suboptimal route found in seconds is better than waiting hours for the optimal route.

## Experiment With Different Sizes

<tsp cities="8" speed="fast"></tsp>

Try adjusting the number of cities to see when brute force becomes impractical for you!
