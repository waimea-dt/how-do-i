# Algorithm Race

Visualise how different search algorithms perform on the same data.

## Default Race

Linear Search vs Binary Search on an array of 20 items.

<algo-race type="search"></algo-race>

## Larger Problem

Race with 100 items to see the difference grow.

<algo-race type="search" size="100"></algo-race>

## Maximum Size

Test with 200 items to see the dramatic efficiency difference.

<algo-race type="search" size="200" target="67"></algo-race>

### Tag Size Clamping

Tag-defined sizes are clamped into the supported 20 to 500 range.

<algo-race type="search" size="10"></algo-race>

<algo-race type="sort" size="600"></algo-race>

## Small Array

Even with small arrays, binary search is more efficient.

<algo-race type="search" size="20"></algo-race>

---

## Sorting Algorithms

Compare the efficiency of different sorting algorithms.

### Default Sort Race

Bubble Sort vs Merge Sort on an array of 60 items.

<algo-race type="sort" size="60"></algo-race>

### Larger Problem

Race with 100 items to see the O(n²) vs O(n log n) difference.

<algo-race type="sort" size="100"></algo-race>

### Maximum Size

Test with 200 items to see the dramatic efficiency difference between Bubble Sort and Merge Sort.

<algo-race type="sort" size="200"></algo-race>

---

## Header Customisation

### Custom Title (Search)

<algo-race type="search" title="Search Race"></algo-race>

### Custom Title and Subtitle (Sort)

<algo-race type="sort" title="Sorting Challenge" sub-title="Which algorithm reaches the finish line first?"></algo-race>

### No Header

<algo-race type="search" header="false"></algo-race>

### Small Array

Even with small arrays (30 items), Merge Sort is more efficient than Bubble Sort.

<algo-race type="sort" size="30"></algo-race>
