# Some Worked Examples

## Searching: Linear vs Binary

**Linear search** checks every item one by one - **O(N)**.

**Binary search** repeatedly halves a **sorted** list - **O(log N)**.

<algo-race type="search" size="100" target="67"></algo-race>

> [!TIP]
> Binary search only works on **sorted** data - sorting first is only worth it if you'll search **many times**, since sorting is 'expensive'.

<big-o algos="search" max="1000000" step="x10"></big-o>

## Sorting: Quadratic vs Log-Linear

**Bubble sort** compares neighbouring pairs repeatedly - **O(N<sup>2</sup>)**.

**Merge sort** splits the list in half, sorts each half, then merges - **O(N log N)**.

<algo-race type="sort" size="100"></algo-race>

<big-o algos="sort-bubble sort-merge" max="1000000" step="x10"></big-o>

> [!NOTE]
> You can never sort by comparing items faster than **O(N log N)** in the worst case - this is the best possible complexity for a general-purpose sort.

## Finding Duplicates in a List

Given 1,000 random numbers, how do we find duplicates?

> 81, 14, 3, 94, 35, 31, 28, 17, 94, 13, 86, 94, 69, 11, 75, 54, 4, 3, 11, 27,
29, 64, 77, 3, 71, 25, 91, 83, 89, 69, 53, 28, 57, 75, 35, 0, 97, 20, 89, 54,
43, 35, 19, 27, 97, 43, 13, 11, 48, 12, 45, 44, 77, 33, 5, 93, 58, 68, 15, 48, etc.


## Possible Approaches

We can take two different approaches to solve this problem...

### Approach 1: Compare every number to every other number

We can loop through every number and then compare it to every other number - so one loop inside another (or 'nested' loops):

```pseudo
for each number:
    for each other number:
        compare the two numbers

        if they're equal:
            output "Found a duplicate:", number
        endif
    endfor
endfor
```

1,000 (values) × 1,000 (checks) = **1,000,000 comparisons**

> [!IMPORTANT]
> This approach has complexity **O(N<sup>2</sup>)**


### Approach 2: Sort first, then compare neighbours

Instead of working through the whole list over and over again, we could first **sort** the list...

> 0, 3, 3, 3, 4, 5, 11, 11, 11, 12, 13, 13, 14, 15, 17, 19, 20, 25, 27, 27,
28, 28, 29, 31, 33, 35, 35, 35, 43, 43, 44, 45, 48, 48, 53, 54, 54, 57, 58, 64,
68, 69, 69, 71, 75, 75, 77, 77, 81, 83, 86, 89, 89, 91, 93, 94, 94, 94, 97, 97, etc.

... and then look for **neighbouring values** that are the same - this way we only need to work through the sorted list **once** after it has been sorted:

```pseudo
// sorting takes approx. 10,000 operations
sort the list

for each number:
    compare to the next one

    if they're equal:
        output "Found a duplicate:", number
    endif
endfor
```

10,000 (sorting) + 1,000 (checks) = **11,000 operations**.

> [!IMPORTANT]
> This approach has complexity **O(N log N)**


### Comparison

The second approach is around **90x faster** for N of 1000, and the gap grows with bigger lists:

<big-o algos="big-o-quadratic big-o-log-linear" max="1000000000" step="x10"></big-o>

Here is a visual comparison of the complexities of the two approaches:

<big-o-chart max="10000" value="10" enabled="on2 onlogn"></big-o-chart>



## Key Takeaways

<flashcards>

- # Linear search complexity

    ---

    **O(N)** - checks every item, works on unsorted data.

- # Binary search complexity

    ---

    **O(log N)** - requires **sorted** data, halves the search space each step.

- # Best possible comparison-sort complexity

    ---

    **O(N log N)** - no comparison-based sort can beat this in the worst case.

- # Sorting before searching for duplicates

    ---

    Sorting (**O(N log N)**) then checking neighbours (**O(N)**) beats comparing every pair (**O(N<sup>2</sup>)**).

</flashcards>


