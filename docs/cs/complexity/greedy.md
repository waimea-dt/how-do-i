# Greedy Algorithms

## The Strategy

A **greedy algorithm** makes the **locally optimal choice** at each step, hoping to find a **global optimum**.

Think of it as being "greedy" - always taking what looks best right now, without considering future consequences.

## The Greedy Choice Property

A problem has the **greedy choice property** if:
- A globally optimal solution can be arrived at by making locally optimal choices
- You don't need to reconsider earlier choices

**Key insight**: Not all problems have this property! When they do, greedy is amazingly efficient. When they don't, greedy can be arbitrarily wrong.

## When Greedy Works

### Activity Selection Problem ✅

**Problem**: Given activities with start and end times, select the maximum number of non-overlapping activities.

```python
def activity_selection(activities):
    # Sort by end time
    activities.sort(key=lambda x: x.end)

    selected = [activities[0]]
    last_end = activities[0].end

    for activity in activities[1:]:
        if activity.start >= last_end:
            selected.append(activity)
            last_end = activity.end

    return selected
```

**Greedy choice**: Always pick the activity that ends earliest
**Why it works**: Ending early leaves maximum room for future activities
**Complexity**: **O(N log N)** for sorting
**Result**: ✅ Optimal

---

### Fractional Knapsack ✅

**Problem**: You can take fractions of items (unlike 0/1 knapsack).

```python
def fractional_knapsack(items, capacity):
    # Sort by value per unit weight
    items.sort(key=lambda x: x.value / x.weight, reverse=True)

    total_value = 0
    remaining = capacity

    for item in items:
        if item.weight <= remaining:
            # Take whole item
            total_value += item.value
            remaining -= item.weight
        else:
            # Take fraction of item
            fraction = remaining / item.weight
            total_value += item.value * fraction
            break

    return total_value
```

**Greedy choice**: Take items with highest value-to-weight ratio
**Why it works**: Fractional property means locally optimal = globally optimal
**Complexity**: **O(N log N)**
**Result**: ✅ Optimal

---

### Minimum Spanning Tree (Kruskal's) ✅

**Problem**: Connect all nodes in a graph with minimum total edge weight.

```python
def kruskal_mst(edges, n_nodes):
    edges.sort(key=lambda x: x.weight)
    mst = []
    union_find = UnionFind(n_nodes)

    for edge in edges:
        if not union_find.connected(edge.u, edge.v):
            mst.append(edge)
            union_find.union(edge.u, edge.v)

    return mst
```

**Greedy choice**: Always add the cheapest edge that doesn't create a cycle
**Why it works**: Proven by cut property
**Complexity**: **O(E log E)**
**Result**: ✅ Optimal

---

### Huffman Coding ✅

**Problem**: Compress text by assigning shorter codes to frequent characters.

```python
def huffman_coding(frequencies):
    heap = [Node(char, freq) for char, freq in frequencies.items()]
    heapify(heap)

    while len(heap) > 1:
        left = heappop(heap)
        right = heappop(heap)
        parent = Node(None, left.freq + right.freq)
        parent.left = left
        parent.right = right
        heappush(heap, parent)

    return heap[0]  # Root of Huffman tree
```

**Greedy choice**: Merge the two lowest-frequency nodes
**Why it works**: Optimal prefix-free code property
**Complexity**: **O(N log N)**
**Result**: ✅ Optimal

---

## When Greedy Fails

### 0/1 Knapsack ❌

**Problem**: Can only take whole items, not fractions.

<knapsack solve="greedy" capacity="25" items="2|3 3|4 4|5 5|8 7|9 9|10"></knapsack>

**Greedy choice**: Take items by value-to-weight ratio
**Why it fails**: Can't take fractions, so locally optimal ≠ globally optimal
**Result**: ❌ Can be arbitrarily bad

**Example where greedy fails:**

| Item | Weight | Value | Ratio |
|------|--------|-------|-------|
| A | 10 | 10 | 1.0 |
| B | 5 | 5 | 1.0 |
| C | 5 | 5 | 1.0 |

Capacity = 10

- **Greedy**: Takes A (value 10)
- **Optimal**: Takes B + C (value 10)

Wait, same result? Try this:

| Item | Weight | Value | Ratio |
|------|--------|-------|-------|
| A | 50 | 60 | 1.2 |
| B | 20 | 20 | 1.0 |
| C | 30 | 30 | 1.0 |

Capacity = 50

- **Greedy**: Takes A (value 60)
- **Optimal**: Takes B + C (value 50)

Still OK? One more:

| Item | Weight | Value | Ratio |
|------|--------|-------|-------|
| A | 10 | 19 | 1.9 |
| B | 9 | 18 | 2.0 |
| C | 9 | 18 | 2.0 |

Capacity = 18

- **Greedy**: Takes B + C (can't fit both! Takes B only, value 18)
- **Optimal**: Takes A + one item (A fits with remainder 8, value 19)

The greedy by ratio can miss the best solution!

<knapsack solve="compare-greedy" capacity="25" items="2|3 3|4 4|5 5|8 7|9 9|10 5|7 9|2 2|10"></knapsack>

See how greedy makes a tempting early choice but misses a better combination!

---

### Traveling Salesman ❌

**Problem**: Find the shortest route visiting all cities.

**Greedy choice**: Always go to the nearest unvisited city (Nearest Neighbor)

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

**Why it fails**: Nearest neighbor can trap you in suboptimal paths
**Result**: ❌ Typically 25% longer than optimal

---

### Coin Change (Certain Systems) ❌

**Problem**: Make change using fewest coins.

For US coins (1, 5, 10, 25 cents), greedy works:
- To make 30¢: 25¢ + 5¢ = 2 coins ✅

But for arbitrary denominations (1, 3, 4 cents), greedy fails:
- To make 6¢:
  - **Greedy**: 4¢ + 1¢ + 1¢ = 3 coins ❌
  - **Optimal**: 3¢ + 3¢ = 2 coins ✅

---

## Proving Greedy Is Correct

To prove a greedy algorithm is optimal, show:

### 1. Greedy Choice Property
Prove that making the locally optimal choice leads to a globally optimal solution.

### 2. Optimal Substructure
After making the greedy choice, the remaining problem is a smaller instance of the same problem.

### Example: Activity Selection

**Greedy Choice**: Select activity that ends first.

**Proof**:
1. Let A be set of activities, a<sub>1</sub> the one ending earliest
2. Let S be any optimal solution
3. If a<sub>1</sub> ∈ S, we're done
4. If a<sub>1</sub> ∉ S, let a<sub>k</sub> be first activity in S
5. Since a<sub>1</sub> ends before a<sub>k</sub>, we can replace a<sub>k</sub> with a<sub>1</sub> and still have a valid solution
6. Therefore, there's an optimal solution starting with a<sub>1</sub>

**Optimal Substructure**: After picking a<sub>1</sub>, we solve the same problem for remaining compatible activities.

---

## Greedy vs Other Strategies

| Strategy | Decision Making | Backtracking? | Example |
|----------|----------------|---------------|---------|
| **Greedy** | Local optimum | ❌ Never | Activity Selection |
| **Dynamic Programming** | Global optimum | ❌ Never (memoized) | Knapsack |
| **Backtracking** | Try all paths | ✅ Yes, when stuck | N-Queens |
| **Branch & Bound** | Prune bad paths | ✅ Yes, intelligently | TSP exact |

## Common Greedy Patterns

### Pattern 1: Sort First
Many greedy algorithms start by sorting.

**Examples**: Activity selection (by end time), Fractional knapsack (by ratio)

### Pattern 2: Priority Queue
Use a heap to always get the locally optimal choice.

**Examples**: Dijkstra's algorithm, Huffman coding, Prim's MST

### Pattern 3: Exchange Argument
Prove that swapping greedy choice with any other choice is no worse.

**Examples**: Activity selection, Job scheduling

## Advantages of Greedy

### ✅ Speed
Usually **O(n log n)** or better - very fast!

### ✅ Simplicity
Easy to understand and implement.

### ✅ Space Efficiency
No need to store subproblem solutions (unlike DP).

## Disadvantages of Greedy

### ❌ Limited Applicability
Only works when greedy choice property holds.

### ❌ Hard to Verify
Proving correctness can be tricky.

### ❌ No Guarantee
May give arbitrarily bad results if problem doesn't have greedy property.

## How to Recognize Greedy Problems

Look for:
1. **Optimization** problem (find best solution)
2. **Obvious greedy choice** (clear "best" at each step)
3. **No need to reconsider** past decisions
4. **Can prove** greedy choice leads to optimal solution

## Decision Tree

```
Does your problem need an optimal solution?
├─ Yes
│  ├─ Can you prove greedy choice property?
│  │  ├─ Yes → Use Greedy! (e.g., Activity Selection)
│  │  └─ No → Consider Dynamic Programming
│  └─ Are there overlapping subproblems?
│     ├─ Yes → Dynamic Programming
│     └─ No → Divide and Conquer
└─ No
   └─ Greedy might work as a heuristic!
```

## Greedy as Approximation

Even when greedy isn't optimal, it can be a good **approximation algorithm**:

| Problem | Greedy Result | Optimal |
|---------|---------------|---------|
| **Vertex Cover** | 2× optimal | Optimal |
| **Set Cover** | **O(log n)**× optimal | Optimal |
| **TSP (Metric)** | ~125% optimal | Optimal |
| **Knapsack** | Can be arbitrarily bad | Optimal |

Sometimes "good enough" is... good enough!

## Key Takeaways

1. **Greedy** makes locally optimal choices without backtracking
2. When it works, it's **fast** (**O(n log n)** often) and **simple**
3. Only optimal when problem has **greedy choice property**
4. Proving correctness requires **careful analysis**
5. Can be useful as **fast approximation** even when not optimal
6. **Test examples** to check if greedy might fail

> [!TIP]
> When you see "maximum/minimum number of..." or "optimize by always choosing best...", think greedy! But always verify with examples that it actually works before trusting it.

> [!WARNING]
> Greedy is seductive because it's simple, but it can be completely wrong! Always prove or extensively test that your greedy approach is correct for your specific problem.

## Interactive Examples

See greedy succeed (fractional) vs fail (0/1):

<knapsack solve="compare-greedy" capacity="25" items="2|3 3|4 4|5 5|8 7|9 9|10 5|7"></knapsack>

The greedy approach is fast but not always optimal!
