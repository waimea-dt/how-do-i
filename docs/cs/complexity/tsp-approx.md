# Approximate Solutions to The TSP

## A Faster (But Imperfect) Approach

Since a brute-force solution to the TSP is only practical for tiny N, we instead try to get an **approximate** solution using a **heuristic** approach.

> [!TIP]
> See [Approximation Algorithms & Heuristics](/cs/complexity/approximation.md) for more on this trade-off.


## A Greedy Heuristic: Nearest Neighbour

'Nearest Neighbour' is a **greedy heuristic** that's very fast to calculate, providing a **tractable** solution to the TSP.

- Complexity: **O(N<sup>2</sup>)** - much faster that O(N!)
- Quality: typically **about 25% longer** than the optimal route

### The Algorithm

```pseudo
start
    go to the starting city

    repeat until all cities have been visited
        visit the nearest, unvisited city
    endrepeat
end
```


### See NN in Action

See how the algorithm builds a route very quickly by always choosing the nearest city:

<tsp solve="nn" cities="20"></tsp>

> [!NOTE]
> A brute-force solution for 20 cities would take years to computer, whilst NN takes **milliseconds**. However, the solution is **far from optimal**.


## Refining the Greedy Solution: 2-Opt

Nearest Neighbour gives us a quick solution, but it is far from optimal. We can improve the NN solution using a **refinement** algorithm: **2-Opt** is a local search algorithm that starts with the NN solution and iteratively improves it:

- Complexity: **O(N<sup>3</sup>)** (typical) to **O(N<sup>4</sup>)** (worst) - still tractable
- Quality: typically **about 5% longer** than the optimal route

### The Algorithm

```pseudo
start
    generate a nearest-neighbour route

    repeat until no further improvement is made
        loop through each edge
            loop through every other edge
                delete both edges
                reconnect the ends but swapped

                if the route is now shorter
                    keep the swap
                else
                    swap the edges back
                end if
            next
        next
    endrepeat
end
```

> [!NOTE]
> The algorithm stops when **no swaps** were made in the previous pass - the solution has reached a **local optimum**

### Watch 2-Opt in Action

See how we first build an NN route, then refine it by testing edge swaps. 2-Opt systematically '**untangles**' any crossing edges...

<tsp solve="2opt" cities="20" history></tsp>


## Comparing Algorithms

### Brute-Force vs NN

Let's compare NN and Brute-Force head-to-head to see the speed vs. quality trade-off:

<tsp solve="compare-nn" cities="10" history></tsp>

### Brute-Force vs 2-Opt

Now let's see how 2-Opt (NN + refinement) compares to the optimal solution:

<tsp solve="compare-2opt" cities="10" history></tsp>

> [!NOTE]
> Notice how much closer 2-Opt gets to optimal compared to raw NN. The refinement phase typically gets within a few percent of optimal.

---

## Key Takeaways

1. **Brute Force** is guaranteed optimal but becomes impossible beyond ~13 cities
2. **Nearest Neighbour** is very fast (works for any size) but not guaranteed optimal (typically 15-25% longer)
3. **2-Opt refinement** significantly improves NN routes, often getting within a few percent of optimal
4. For practical problems, heuristics like NN and 2-Opt search are essential to give **usable approximate solutions** - perfection isn't worth billions of years of computation


## Key Terms

<flashcards shuffle>

- # Heuristic

    ---

    An **approximate problem-solving method**, used to find 'good enough' solutions

- # **Greedy** Heuristic

    ---

    A strategy that builds a solution **step-by-step**, making choices that **look best at that moment**

- # Nearest Neighbour

    ---

    A **greedy heuristic** to the TSP that always looks ahead, picking the **nearest, unvisited city** each time

- # Nearest Neighbour's Quality

    ---

    NN is typically around **25% longer than optimal**

- # 2-Opt

    ---

    A refinement algorithm that starts from a **nearest-neighbour** route and repeatedly **swaps pairs of edges** to shorten it.

- # 2-Opt's stopping point

    ---

    A **local optimum** - reached once a full pass finds no swap that shortens the route further.

- # 2-Opt's Quality

    ---

    2-Opt typically gets **within a few percent of optimal**

- # Practical brute-force limit for TSP

    ---

    Around **13 cities** - beyond that, brute-force takes many millennia to run.

</flashcards>

