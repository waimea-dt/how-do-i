# Quiz: The Bin Packing Problem

Test your understanding of the Bin Packing Problem and how we solve it in practice.

<quiz>

## Bin Packing Quiz

- # What is the goal of the Bin Packing Problem?

    ---

    - [x] Pack every item into the fewest possible bins without exceeding any bin's capacity
    - [ ] Pack as many bins as possible with a single item each
    - [ ] Find the single largest item in the collection
    - [ ] Sort the items from smallest to largest

    ---

    - [x] **Correct!** The goal is to minimise the number of bins used, while respecting each bin's fixed capacity.
    - [ ] **Not quite.** Think about what's being minimised - the number of bins, not the number or order of items.

- # Which of these is a real-world example of Bin Packing?

    ---

    - [x] Loading the fewest possible delivery trucks with a set of packages
    - [ ] Finding the shortest route between delivery addresses
    - [ ] Alphabetising a list of customer names
    - [ ] Checking whether a password has been leaked

    ---

    - [x] **Correct!** Loading trucks, memory allocation, and packing virtual machines onto servers are all Bin Packing problems.
    - [ ] **Not quite.** Think about which of these tasks involves fitting a set of items into a limited number of fixed-size containers.

- # Why is guaranteeing the fewest possible bins so hard?

    ---

    - [ ] Calculating one item's size takes too long
    - [x] Brute force must try every possible way of arranging items into bins
    - [ ] Computers can't store item sizes accurately
    - [ ] There's no way to check whether a packing is valid

    ---

    - [x] **Correct!** Checking a single packing is fast - it's the sheer number of possible arrangements that explodes.
    - [ ] **Not quite.** Think about how many different ways there are to group items into bins, not how hard it is to check just one grouping.

- # What is the complexity of the brute-force approach to Bin Packing?

    ---

    - [ ] **O(N)**
    - [ ] **O(N log N)**
    - [ ] **O(2<sup>N</sup>)**
    - [x] **O(N<sup>N</sup>)**

    ---

    - [x] **Correct!** Trying every possible assignment of items to bins is even worse than the Knapsack problem's **O(2<sup>N</sup>)**.
    - [ ] **Not quite.** Think about how many different bins each item could potentially be assigned to.

- # What does the Next Fit heuristic do?

    ---

    - [x] Packs items in order, opening a new bin whenever the current item doesn't fit the current one
    - [ ] Checks every open bin and picks the one with the least remaining space
    - [ ] Sorts all items by size before packing any of them
    - [ ] Tries every possible arrangement before choosing the best one

    ---

    - [x] **Correct!** Next Fit only ever looks at the single bin currently being filled - once it moves on, it never returns to an earlier bin.
    - [ ] **Not quite.** Think about how many bins this heuristic actually considers at each step.

- # What is the time complexity of the Next Fit heuristic?

    ---

    - [x] **O(N)**
    - [ ] **O(N log N)**
    - [ ] **O(2<sup>N</sup>)**
    - [ ] **O(N<sup>N</sup>)**

    ---

    - [x] **Correct!** Next Fit makes a single pass through the items, giving linear time.
    - [ ] **Not quite.** Think about how many times each item needs to be looked at with this heuristic.

- # What does the Best Fit heuristic do differently from Next Fit?

    ---

    - [x] It checks all currently open bins and places the item in the one with the least remaining space that still fits
    - [ ] It always opens a brand new bin for every item
    - [ ] It ignores bin capacity entirely
    - [ ] It only works if there is exactly one bin

    ---

    - [x] **Correct!** By considering every open bin, Best Fit can reuse space that Next Fit would have skipped past.
    - [ ] **Not quite.** Think about how many of the currently open bins get checked before placing each item.

- # What is the time complexity of the Best Fit heuristic?

    ---

    - [ ] **O(N)**
    - [x] **O(N log N)**
    - [ ] **O(2<sup>N</sup>)**
    - [ ] **O(N<sup>N</sup>)**

    ---

    - [x] **Correct!** Best Fit is still fast, just slightly slower than Next Fit due to comparing against open bins.
    - [ ] **Not quite.** Think about how this heuristic's speed compares to Next Fit's simple single pass.

- # Why can Best Fit still fail to find the truly optimal packing?

    ---

    - [x] It only ever makes the locally best choice for each item, without reconsidering earlier decisions
    - [ ] It doesn't actually check bin capacity before placing items
    - [ ] It's slower than brute force in every case
    - [ ] It can only be used with exactly two bins

    ---

    - [x] **Correct!** Like other heuristics, Best Fit commits to a choice for each item as it goes, which can still waste space overall.
    - [ ] **Not quite.** Think about whether this heuristic ever looks back and changes an earlier placement decision.

- # Why is Bin Packing classed as NP-hard?

    ---

    - [x] It's easy to check whether a packing is valid, but hard to guarantee it uses the fewest bins possible
    - [ ] It has never been solved by any computer
    - [ ] It can only be solved using sorting algorithms
    - [ ] It has no real-world applications

    ---

    - [x] **Correct!** Verifying a proposed packing is quick, but proving no better packing exists requires checking a huge number of arrangements.
    - [ ] **Not quite.** Think about the difference between checking a proposed packing and proving it's the very best one possible.

</quiz>
