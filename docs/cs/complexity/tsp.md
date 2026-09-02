# The Travelling Salesperson Problem

## The Classic Challenge

The **Travelling Salesperson Problem** asks: given a list of cities, what is the **shortest route that visits each city** exactly once and returns to the starting point?

This is one of the most famous problems in computer science.

> [!ATTENTION]
> This is the **optimal solution** version of the TSP: *"What is the **shortest** route?"* In all these notes, it will always be this version that is discussed.
>
> You may come across videos, notes, etc. that discuss the **decision** version of the TSP: *"Is there a route that is **shorter than X**, yes/no?"* This is a quite different problem and not covered here.

## Real-World Applications of the TSP

- **Logistics**: delivery route planning (courier companies, food delivery)
- **Manufacturing**: minimising tool movement when drilling circuit boards
- **Scheduling**: ordering telescope observations to minimise movement


## Why It's Hard

The TSP is **NP-hard**. To find the optimal solution requires a **brute-force** approach: we need to test _every possible route_. For N cities, there are **(N-1)!/2** unique routes to check (we can fix the starting city and ignore direction) - giving a complexity of **O(N!)**.

<big-o algos="tsp-brute" max="25" step=5></big-o>

> [!NOTE]
> With a complexity of **O(N!)** then effort required to solve the TSP **explodes** at relatively low values of N.

### Try It Yourself

<tsp cities="8" history></tsp>

Start with 8 cities, then try increasing to 15 or 20 - watch how quickly it becomes impractical!


## TSP Brute-Force Algorithm

The only solution to the TSP is a **brute-force algorithm**:

```pseudo
start
    // permutations for a list = N!
    generate all possible permutations of cities

    best route = None
    shortest distance = Infinity

    loop through each route permutation
        calculate total distance for the route

        if distance < shortest distance
            best route = this route
            shortest distance = distance
        endif
    next route

    display best route and shortest distance
end
```

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

