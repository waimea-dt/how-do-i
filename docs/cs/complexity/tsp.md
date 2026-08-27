# The Travelling Salesperson Problem

## The Classic Challenge

> Given a list of cities and the distances between them, what is the shortest route that visits each city exactly once and returns to the start?

This is one of the most famous problems in computer science - it shows up in delivery routing, circuit board drilling, and scheduling.

## Why It's Hard

- **Checking** a route's total distance is easy: **O(N)**
- **Finding** the shortest route (brute force) means trying every possible order: **O(N!)**

## Try It Yourself

<tsp cities="8"></tsp>

Start with 8 cities, then try increasing to 10 or 11 - watch how quickly it becomes impractical!

## Why So Many Routes?

For N cities (fixing the start city, and treating each direction as the same route), there are **(N-1)!/2** possible routes.

| Cities | Routes to Check       |
| ------ | ------------------------ |
| 5      | 12                        |
| 8      | 2,520                     |
| 10     | 181,440                   |
| 12     | 19,958,400                |
| 15     | 43,589,145,600             |

<big-o algos="tsp-brute" max="15"></big-o>

## A Faster (But Imperfect) Approach

Since brute force is only practical for tiny N, we use a **heuristic** instead: the **nearest neighbour** approach - always travel to the closest unvisited city.

- **Time**: **O(N<sup>2</sup>)** - much faster
- **Quality**: typically about 25% longer than the optimal route

See [Approximation Algorithms & Heuristics](approximation.md) for more on this trade-off.

## Real-World Uses

- **Logistics**: delivery route planning (courier companies, food delivery)
- **Manufacturing**: minimising tool movement when drilling circuit boards
- **Scheduling**: ordering telescope observations to minimise movement

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

## Experiment With Different Sizes

<tsp cities="10" history></tsp>

Try adjusting the number of cities to see when brute force stops being practical!

