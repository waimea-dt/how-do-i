# The Knapsack Problem

## The Problem

You have a **knapsack** (backpack) with a maximum weight capacity, and a collection of items, each with a **weight** and a **value**. Which items should you pack to **maximize total value** without exceeding the weight limit?

### Real-World Examples

- **Resource allocation**: Which projects to fund with limited budget?
- **Cargo loading**: What to load on a truck/ship for maximum profit?
- **Investment**: Which stocks to buy with limited capital?
- **Memory management**: Which processes to load into limited RAM?
- **Ad selection**: Which ads to show in limited space for maximum revenue?

## The 0/1 Constraint

In the **0/1 Knapsack Problem**, each item can be used **once or not at all** - you can't take half an item or multiple copies.

This makes it **NP-complete**!

## Try It Yourself

<knapsack capacity="25" items="2|3 3|4 4|5 5|8 7|9 9|10"></knapsack>

Watch the brute force approach test every subset of items to find the optimal combination!

## The Complexity Challenge

### Why It's Hard

For N items, there are 2<sup>N</sup> possible subsets to check:
- Item 1: take it or leave it (2 choices)
- Item 2: take it or leave it (2 choices)
- Item 3: take it or leave it (2 choices)
- ...
- Total: 2 × 2 × 2 × ... = 2<sup>N</sup> combinations

### Growth Rate

| Items | Subsets | Time Estimate |
|-------|---------|---------------|
| 10 | 1,024 | Instant |
| 15 | 32,768 | Instant |
| 20 | 1,048,576 | ~1 second |
| 25 | 33,554,432 | ~30 seconds |
| 30 | 1,073,741,824 | ~17 minutes |
| 40 | ~1.1 × 10<sup>12</sup> | ~1 year |

<big-o algos="knap" max="30"></big-o>

Watch how exponential growth makes brute force impractical!

## Brute Force Approach

Try every possible subset and keep the best valid one:

```python
def knapsack_brute_force(items, capacity):
    n = len(items)
    best_value = 0
    best_items = []

    # Try all 2^n subsets
    for subset in range(2**n):
        weight = 0
        value = 0
        included = []

        for i in range(n):
            # Check if item i is in this subset
            if subset & (1 << i):
                weight += items[i].weight
                value += items[i].value
                included.append(i)

        # If valid and better, keep it
        if weight <= capacity and value > best_value:
            best_value = value
            best_items = included

    return best_items, best_value
```

**Time**: **O(2<sup>N</sup> · N)** - exponential!
**Space**: **O(N)** - store best solution
**Quality**: ✅ Optimal

<knapsack speed="slow" capacity="25" items="2|3 3|4 4|5 5|8 7|9"></knapsack>

Watch the search tree explore different subsets!

## Dynamic Programming Solution

We can solve it optimally in **pseudo-polynomial time** using dynamic programming:

```python
def knapsack_dp(items, capacity):
    n = len(items)
    # dp[i][w] = max value using first i items with weight ≤ w
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        weight_i = items[i-1].weight
        value_i = items[i-1].value

        for w in range(capacity + 1):
            # Option 1: Don't take item i
            dp[i][w] = dp[i-1][w]

            # Option 2: Take item i (if it fits)
            if weight_i <= w:
                dp[i][w] = max(dp[i][w],
                              dp[i-1][w - weight_i] + value_i)

    return dp[n][capacity]
```

**Time**: **O(N · W)** where W is capacity
**Space**: **O(N · W)**
**Quality**: ✅ Optimal

### Why "Pseudo-Polynomial"?

The complexity depends on the **value** of the capacity W, not just the number of items N. If W is huge (e.g., 2<sup>100</sup>), this becomes exponential in the input size!

But for practical problems where W is reasonable, DP is much better than brute force.

<knapsack solve="dynamic" capacity="25" items="2|3 3|4 4|5 5|8 7|9 9|10"></knapsack>

Watch the table fill up as DP computes optimal values for each subproblem!

## Greedy Approximation

A fast heuristic: sort items by **value-to-weight ratio** and take the best ratios first.

```python
def knapsack_greedy(items, capacity):
    # Sort by value per unit weight
    sorted_items = sorted(items,
                         key=lambda x: x.value / x.weight,
                         reverse=True)

    total_weight = 0
    total_value = 0
    included = []

    for item in sorted_items:
        if total_weight + item.weight <= capacity:
            included.append(item)
            total_weight += item.weight
            total_value += item.value

    return included, total_value
```

**Time**: **O(N log N)** for sorting
**Space**: **O(N)**
**Quality**: ⚠️ Can be arbitrarily bad!

<knapsack solve="greedy" capacity="25" items="2|3 3|4 4|5 5|8 7|9 9|10"></knapsack>

Fast but might miss the optimal solution!

## Comparing Approaches

<knapsack solve="compare-greedy" capacity="25" items="2|3 3|4 4|5 5|8 7|9 9|10 5|7 9|2"></knapsack>

See how greedy makes a tempting early choice but brute force finds a better combination!

### When Greedy Fails

**Example**: Capacity = 10

| Item | Weight | Value | Ratio |
|------|--------|-------|-------|
| A | 6 | 6 | 1.0 |
| B | 5 | 5 | 1.0 |
| C | 5 | 5 | 1.0 |

Greedy takes A (weight 6, value 6) and can't fit anything else.
Optimal takes B + C (weight 10, value 10)!

Greedy got only **60%** of optimal value.

## Dynamic Programming vs Brute Force

<knapsack solve="compare-dynamic" capacity="25" items="2|3 3|4 4|5 5|8 7|9 9|10 5|7 9|2 2|10"></knapsack>

Both find the optimal solution, but DP is much faster!

## Variants of Knapsack

### Fractional Knapsack
You **can** take fractions of items (like gold dust).

**Complexity**: **O(N log N)** - just use greedy by ratio!
**Not NP-complete**: Greedy is optimal

### Unbounded Knapsack
You have **unlimited copies** of each item.

**Complexity**: **O(n · W)** with DP
**Example**: Coin change problem

### Multiple Knapsacks
Multiple bags with different capacities.

**Complexity**: NP-hard, even more difficult

### Multidimensional Knapsack
Items have multiple constraints (weight, volume, etc.).

**Complexity**: Harder to approximate

## Practical Approaches by Problem Size

| Items | Capacity | Best Approach |
|-------|----------|---------------|
| < 20 | Any | Brute force or DP |
| 20-1000 | < 10,000 | Dynamic Programming |
| 20-1000 | > 10,000 | Greedy or branch-and-bound |
| > 1000 | Any | Greedy, genetic algorithms |

## Real-World Optimization

In practice, we often use:

### 1. Branch and Bound
Explore subsets intelligently, pruning branches that can't be optimal.

**Quality**: ✅ Optimal
**Speed**: Much faster than brute force for many instances

### 2. FPTAS (Fully Polynomial-Time Approximation Scheme)
Get within (1 + ε) of optimal in polynomial time.

**Time**: **O(n<sup>3</sup> / ε)**
**Quality**: Arbitrarily close to optimal

### 3. Genetic Algorithms
Evolve solutions over generations.

**Quality**: Usually good
**Speed**: Depends on parameters

## Key Insights

### The Greedy Trap
The knapsack problem shows why greedy algorithms don't always work! Locally optimal choices (best ratio) don't guarantee globally optimal solutions.

### The DP Breakthrough
Dynamic programming turns an exponential problem into pseudo-polynomial time by remembering solutions to subproblems.

### The Practical Reality
For most real applications, **"good enough" is good enough**. A 95% optimal solution found instantly beats a 100% optimal solution that takes hours.

## Interactive Exploration

Try different scenarios:

### Fast animation:
<knapsack speed="fast" capacity="25" items="2|3 3|4 4|5 5|8 7|9"></knapsack>

### Instant result:
<knapsack speed="instant" capacity="25" items="2|3 3|4 4|5 5|8"></knapsack>

## Key Takeaways

1. **0/1 Knapsack** is NP-complete - no known polynomial algorithm
2. **Brute force** tries all 2<sup>n</sup> subsets - only practical for tiny n
3. **Dynamic Programming** is optimal and efficient for reasonable capacities
4. **Greedy** is fast but can be arbitrarily wrong
5. Real applications use DP for small/medium instances, approximations for large
6. The problem illustrates the power and limitations of different algorithmic strategies

> [!TIP]
> For knapsack problems: Use DP if n · W is tractable. Use greedy as a quick baseline. Consider branch-and-bound or approximation algorithms for large instances where quality matters.

## Complexity Comparison

<big-o algos="knap-brute knap-dynamic knap-greedy" max="25"></big-o>

See how DP and greedy scale much better than brute force!
