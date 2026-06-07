# Dynamic Programming

## The Strategy

**Dynamic Programming (DP)** solves complex problems by breaking them into simpler **overlapping subproblems**, solving each subproblem once, and **storing the results** to avoid redundant work.

Think of it as "smart recursion" - remember what you've already computed!

## The Two Key Properties

A problem is suitable for DP if it has:

### 1. Overlapping Subproblems
The same subproblems are solved multiple times.

### 2. Optimal Substructure
The optimal solution to the problem can be constructed from optimal solutions to subproblems.

## DP vs Other Strategies

| Strategy | Subproblems | Remembers? | Example |
|----------|-------------|------------|---------|
| **Dynamic Programming** | Overlapping | ✅ Yes | Fibonacci, Knapsack |
| **Divide & Conquer** | Independent | ❌ No | Merge Sort, Binary Search |
| **Greedy** | None (makes choice) | ❌ No | Activity Selection |
| **Brute Force** | All possibilities | ❌ No | TSP, Password cracking |

## Classic Example: Fibonacci Numbers

Computing Fibonacci numbers shows DP's power.

### Naive Recursion - **O(2<sup>N</sup>)**

```python
def fib_recursive(n):
    if n <= 1:
        return n
    return fib_recursive(n-1) + fib_recursive(n-2)
```

**Problem**: Recalculates the same values repeatedly!

```
fib(5)
├─ fib(4)
│  ├─ fib(3)
│  │  ├─ fib(2)
│  │  │  ├─ fib(1) → 1
│  │  │  └─ fib(0) → 0
│  │  └─ fib(1) → 1
│  └─ fib(2)  [RECALCULATED!]
│     ├─ fib(1) → 1
│     └─ fib(0) → 0
└─ fib(3)  [RECALCULATED!]
   ├─ fib(2)  [RECALCULATED!]
   │  ├─ fib(1) → 1
   │  └─ fib(0) → 0
   └─ fib(1) → 1
```

`fib(2)` is computed 3 times, `fib(3)` twice, etc.

**Time**: **O(2<sup>N</sup>)** - exponential!

### Top-Down DP (Memoization) - **O(N)**

Store computed results in a memo dictionary:

```python
def fib_memo(n, memo={}):
    if n <= 1:
        return n

    if n in memo:
        return memo[n]  # Already computed!

    memo[n] = fib_memo(n-1, memo) + fib_memo(n-2, memo)
    return memo[n]
```

**Time**: **O(N)** - each fib(i) computed once
**Space**: **O(N)** - memo storage + recursion stack

### Bottom-Up DP (Tabulation) - **O(N)**

Build up from smallest subproblems:

```python
def fib_dp(n):
    if n <= 1:
        return n

    dp = [0] * (n + 1)
    dp[1] = 1

    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]

    return dp[n]
```

**Time**: **O(N)**
**Space**: **O(N)**

### Space-Optimized - **O(1)** space

Only need last two values:

```python
def fib_optimized(n):
    if n <= 1:
        return n

    prev2, prev1 = 0, 1

    for i in range(2, n + 1):
        current = prev1 + prev2
        prev2, prev1 = prev1, current

    return prev1
```

**Time**: **O(N)**
**Space**: **O(1)** - optimal!

### Performance Comparison

| Approach | Time | Space | fib(40) |
|----------|------|-------|---------|
| Naive Recursion | **O(2<sup>N</sup>)** | **O(N)** | ~1 minute |
| Memoization | **O(N)** | **O(N)** | Instant |
| Tabulation | **O(N)** | **O(N)** | Instant |
| Optimized | **O(N)** | **O(1)** | Instant |

---

## The 0/1 Knapsack Problem

DP shines here where greedy fails!

<knapsack solve="dynamic" capacity="25" items="2|3 3|4 4|5 5|8 7|9 9|10"></knapsack>

Watch the DP table fill up as it solves subproblems!

### The DP Approach

```python
def knapsack_dp(items, capacity):
    n = len(items)
    # dp[i][w] = max value using first i items with weight ≤ w
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        weight = items[i-1].weight
        value = items[i-1].value

        for w in range(capacity + 1):
            # Option 1: Don't take item i
            dp[i][w] = dp[i-1][w]

            # Option 2: Take item i (if it fits)
            if weight <= w:
                dp[i][w] = max(dp[i][w],
                              dp[i-1][w - weight] + value)

    return dp[n][capacity]
```

**Time**: **O(N · W)** - pseudo-polynomial
**Space**: **O(N · W)**
**Result**: ✅ Optimal

**Key insight**: Each cell `dp[i][w]` depends on previously computed cells, demonstrating overlapping subproblems!

<knapsack solve="compare-dynamic" capacity="25" items="2|3 3|4 4|5 5|8 7|9 9|10 5|7"></knapsack>

Compare DP (optimal, fast) vs brute force (optimal, slow)!

---

## Longest Common Subsequence

Find the longest subsequence common to two strings (not necessarily contiguous).

**Example**: "ABCDGH" and "AEDFHR" → "ADH" (length 3)

```python
def lcs(X, Y):
    m, n = len(X), len(Y)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if X[i-1] == Y[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])

    return dp[m][n]
```

**Time**: **O(m · N)**
**Applications**: Diff tools, DNA sequence alignment, version control

---

## Edit Distance (Levenshtein Distance)

Minimum number of insertions, deletions, or substitutions to transform one string into another.

**Example**: "kitten" → "sitting" = 3 edits (substitute k→s, substitute e→i, insert g)

```python
def edit_distance(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Base cases
    for i in range(m + 1):
        dp[i][0] = i  # Delete all
    for j in range(n + 1):
        dp[0][j] = j  # Insert all

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1]  # No change needed
            else:
                dp[i][j] = 1 + min(
                    dp[i-1][j],      # Delete
                    dp[i][j-1],      # Insert
                    dp[i-1][j-1]     # Substitute
                )

    return dp[m][n]
```

**Time**: **O(m · N)**
**Applications**: Spell checkers, DNA analysis, plagiarism detection

---

## Coin Change

Minimum number of coins needed to make a target amount.

**Example**: Coins [1, 5, 10, 25], target 30 → answer is 2 (25 + 5)

```python
def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # 0 coins needed for amount 0

    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)

    return dp[amount] if dp[amount] != float('inf') else -1
```

**Time**: **O(N · m)** where N is amount, m is number of coins
**Space**: **O(N)**

---

## Matrix Chain Multiplication

Find the optimal order to multiply a chain of matrices to minimize scalar multiplications.

**Example**: (A<sub>1</sub> × A<sub>2</sub>) × A<sub>3</sub> vs A<sub>1</sub> × (A<sub>2</sub> × A<sub>3</sub>) - different costs!

```python
def matrix_chain_order(dimensions):
    n = len(dimensions) - 1
    dp = [[0] * n for _ in range(n)]

    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = float('inf')

            for k in range(i, j):
                cost = (dp[i][k] + dp[k+1][j] +
                       dimensions[i] * dimensions[k+1] * dimensions[j+1])
                dp[i][j] = min(dp[i][j], cost)

    return dp[0][n-1]
```

**Time**: **O(N<sup>3</sup>)**

---

## The DP Development Process

### Step 1: Define Subproblems
What are the smaller problems? How do they relate?

### Step 2: Find Recurrence Relation
How does the solution to a problem depend on solutions to subproblems?

### Step 3: Identify Base Cases
What are the simplest cases you can solve directly?

### Step 4: Determine Computation Order
Bottom-up or top-down? What order to fill the table?

### Step 5: Optimize Space (Optional)
Can you reduce memory by only keeping needed previous values?

---

## Top-Down (Memoization) vs Bottom-Up (Tabulation)

### Top-Down (Memoization)

**Approach**: Recursive with caching

**Pros**:
- ✅ Natural to write (follows recursive thinking)
- ✅ Only computes needed subproblems
- ✅ Easy to implement from recursive solution

**Cons**:
- ❌ Recursion overhead
- ❌ Stack space usage
- ❌ Can hit recursion limit

### Bottom-Up (Tabulation)

**Approach**: Iterative table filling

**Pros**:
- ✅ No recursion overhead
- ✅ Better cache locality
- ✅ Easier to optimize space

**Cons**:
- ❌ Computes all subproblems (even unnecessary ones)
- ❌ Less intuitive to develop
- ❌ Need to figure out computation order

---

## When to Use Dynamic Programming

### ✅ Use DP When:
- Problem has **overlapping subproblems**
- Problem has **optimal substructure**
- You need **optimal solution**, not just good enough
- Subproblem count is **polynomial**

### ❌ Don't Use DP When:
- Subproblems are **independent** (use divide & conquer)
- **Greedy** gives optimal solution
- Need to explore **all possibilities** (use backtracking)
- Subproblem count is **exponential** (DP won't help much)

---

## DP vs Greedy vs Divide & Conquer

| Problem | Greedy | Divide & Conquer | DP |
|---------|--------|------------------|-----|
| **Activity Selection** | ✅ Optimal | ❌ | ❌ |
| **Fractional Knapsack** | ✅ Optimal | ❌ | ❌ |
| **0/1 Knapsack** | ❌ Wrong | ❌ | ✅ Optimal |
| **Merge Sort** | ❌ | ✅ Optimal | ❌ |
| **Binary Search** | ❌ | ✅ Optimal | ❌ |
| **Fibonacci** | ❌ | ❌ Overlap | ✅ Optimal |
| **Longest Common Subsequence** | ❌ Wrong | ❌ Overlap | ✅ Optimal |

---

## Common DP Patterns

### Pattern 1: 1D Array
State depends on previous elements.

**Examples**: Fibonacci, Coin Change, Climbing Stairs

### Pattern 2: 2D Table
State depends on two parameters.

**Examples**: Knapsack, LCS, Edit Distance

### Pattern 3: Interval DP
Solve for all intervals of increasing size.

**Examples**: Matrix Chain Multiplication, Palindrome problems

### Pattern 4: State Machine DP
Model states and transitions.

**Examples**: Stock trading with cooldown, String matching

---

## Complexity Analysis

### Time Complexity
Usually: **Number of subproblems × Time per subproblem**

**Examples**:
- Fibonacci: **O(N)** subproblems × **O(1)** each = **O(N)**
- Knapsack: **O(N · W)** subproblems × **O(1)** each = **O(N · W)**
- LCS: **O(m · N)** subproblems × **O(1)** each = **O(m · N)**

### Space Complexity
- **Full table**: Size of DP table (e.g., **O(N · W)** for knapsack)
- **Optimized**: Often reducible (e.g., **O(W)** for knapsack)

---

## Interactive Exploration

<knapsack solve="dynamic" capacity="25" items="2|3 3|4 4|5 5|8 7|9 9|10 5|7 9|2"></knapsack>

Watch how DP builds up optimal solutions from subproblems!

<big-o algos="knap-brute knap-dynamic knap-greedy" max="25"></big-o>

Compare complexity: DP is much better than brute force but not quite as fast as greedy (which isn't optimal)!

---

## Key Takeaways

1. **DP** = smart recursion with memory (avoid redundant calculations)
2. Requires **overlapping subproblems** and **optimal substructure**
3. **Top-down** (memoization) vs **Bottom-up** (tabulation)
4. Turns exponential problems into **polynomial** time
5. Often achieves **optimal** solution efficiently
6. Space can often be **optimized** by keeping only necessary values
7. Development takes practice - identify subproblems, find recurrence!

> [!TIP]
> When you see a problem that feels recursive but naive recursion is too slow, think DP! Ask: "Am I solving the same subproblems repeatedly?" If yes, cache those results!

> [!NOTE]
> DP is one of the most powerful algorithmic techniques. It's worth investing time to master - many interview questions and real-world problems use DP!

## Practice Strategy

1. Start with **Fibonacci** (understand memoization)
2. Try **Climbing Stairs** (1D DP)
3. Practice **Knapsack** (2D DP)
4. Attempt **LCS and Edit Distance** (string problems)
5. Challenge yourself with **Matrix Chain** (interval DP)

With practice, you'll develop intuition for recognizing DP problems and constructing solutions!
