# Searching Algorithms

When data is stored in a list or database, you often need to find a specific item. **Searching algorithms** are the step-by-step methods computers use to locate an item within a dataset.

The best approach depends on what you know about your data...


## Linear Search

The simplest approach is to check each item **one by one**, starting from the beginning of the list, until you find what you're looking for - or run out of items.

> [!NOTE]
> Linear search works on **any list** - sorted or unsorted. However, it must check every item in the worst case, which makes it slow for large datasets.


This the the linear search algorithm algorithm in pseudo-code...

```pseudo
start
    go to first item in list

    repeat until end of list
        if item is target
            return the item index
        endif

        move to next item
    endrepeat

    return -1 (not found)
end
```

And here it is as a flowchart...

```mermaid
flowchart TD
    %% Define nodes
    start(["Start"])
    init["Go to first item<br>in list"]
    check{"At end?"}
    compare{"Item is<br>target?"}
    loop((Loop))
    found(["Found it!<br>(return index)"])
    next["Next item<br>in list"]
    notfound(["Not found<br>(return -1)"])

    %% Define links
    start --> init --> loop --> compare
    check -- Yes --> notfound
    check -- No --> loop
    compare -- Yes --> found
    compare -- No --> next --> check
```

And this is a runnable Python implementation with print statements to track progress...

```python run
def linear_search(items, target):
    """
    Perform a simple linear search over a given list.
    List can be unsorted. Simply checks each item in turn
    to see if it matches the target
    """

    print(f"Looking for value {target} in list: {items}")

    for index in range(len(items)):     # work through the list
        print(f"  Item {index}: {items[index]}... ", end="")

        if items[index] == target:      # have a match?
            print("Found!\n")
            return index                # pass back its location
        else:
            print("No")

    print("  Not found\n")
    return -1                           # no match, so pass back -1

#----------------------------------------------------
# Testing the algorithm with an unsorted list

items = [99, 13, 37, 67, 33, 12, 28, 78, 42, 17]

linear_search(items, 13)
linear_search(items, 42)
linear_search(items, 67)
linear_search(items, 88)
```

## Binary Search

If your list is **already sorted**, you can do much better. Binary search works by repeatedly **halving the search area** - like looking up a word in a dictionary by opening it in the middle and deciding which half to search.

> [!TIP]
> Binary search is **much faster** than linear search for large **sorted** lists. Searching one million items takes at most 20 steps - compared to up to one million steps with linear search.
> See the Algorithmic Complexity notes in the Computer Science section for more details on this.

Here is the binary search algorithm in pseudo-code...

```pseudo
start
    begin with the whole list

    repeat until no items left to search
        find the list mid-point

        if this is the target
            return the mid-point position

        else if target > mid-point value
            focus on right half of list

        else
            focus on left half of list
    endrepeat

    return -1 (not found)
end
```

And here as a flowchart...

```mermaid
flowchart TD
    %% Define nodes
    start(["Start"])
    init["Begin with full list"]
    loop((Loop))
    check{"Any items left<br>to search?"}
    mid["Find mid-point of<br>remaining items"]
    equal{"Mid-point<br>is target?"}
    direction{"Target ><br>mid-point?"}
    found(["Found it!<br>(return index)"])
    goRight["Go right"]
    goLeft["Go left"]
    loopLower(( ))
    notfound(["Not found<br>(return -1)"])

    %% Define links
    start --> init --> loop --> check
    check -- No --> notfound
    check -- Yes --> mid --> equal
    equal -- Yes ---> found
    equal -- No --> direction
    direction -- Yes --> goRight --> loopLower
    direction -- No --> goLeft --> loopLower
    loopLower --> loop
```

And this is a runnable Python implementation with print statements to track progress...

```python run
def binary_search(items, target):
    """
    Perform a binary search on a given list. The list
    *must* be sorted for this to work. Begin at the
    mid-point, checking value. If target not found,
    reject half, and then repeat for the remaining half
    """

    start = 0
    end = len(items) - 1           # start with full list

    print(f"Looking for value {target} in list: {items}")

    while start <= end:            # loop while value still to check
        mid = (start + end) // 2   # find mid-point

        print(f"  Item {mid}: {items[mid]}... ", end="")

        if items[mid] == target:   # found it?
            print("Found!\n")
            return mid             # yes, so pass back location

        elif target > items[mid]:  # no, so see which half to check next

            start = mid + 1        # reject left half, process right
            print("No, go right: ", end="")
        else:
            end = mid - 1          # reject right half, process left
            print("No, go left:  ", end="")

        print(items[start:end+1])

    print("  Not found\n")
    return -1                      # didn't find target, so pass back -1

#----------------------------------------------------
# Testing the algorithm on a *sorted* list

items = [12, 13, 17, 28, 33, 37, 42, 67, 78, 99]

binary_search(items, 13)
binary_search(items, 42)
binary_search(items, 67)
binary_search(items, 88)
```

