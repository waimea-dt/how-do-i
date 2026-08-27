# Real-World Comparison of Complexity

## The Problem

Let's find duplicates in a list of 1,000 numbers:

> 81, 14, 3, 94, 35, 31, 28, 17, 94, 13, 86, 94, 69, 11, 75, 54, 4, 3, 11, 27,
29, 64, 77, 3, 71, 25, 91, 83, 89, 69, 53, 28, 57, 75, 35, 0, 97, 20, 89, 54,
43, 35, 19, 27, 97, 43, 13, 11, 48, 12, 45, 44, 77, 33, 5, 93, 58, 68, 15, 48, etc.

How would you go about doing this?


## Possible Approaches

We can take two different approaches to solve this problem...

### Approach 1: Compare every number to every other number

We can loop through every number and then compare it to every other number - so one loop inside another:

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

So, how many operations or actions did we need to do?

1,000 (values) × 1,000 (checks) = **1,000,000 comparisons** - Ouch!

> [!NOTE]
> The complexity of this algorithm is: **O(N<sup>2</sup>)**


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

So, how many operations or actions did we need to do?

10,000 (sorting) + 1,000 (checks) = **11,000 operations** - Better!

> [!NOTE]
> The complexity of this algorithm is: **O(N log N)**


### Comparison

The second approach is **90× faster** - and the difference gets even bigger with larger lists.

Here is a visual comparison of the work required for each approach, or rather a comparison of their complexity:

<big-o-chart max="1000" value="10" enabled="on2 onlogn"></big-o-chart>


