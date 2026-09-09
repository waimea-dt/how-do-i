# Algorithmic Complexity

## What is 'Complexity'?

A **complex** problem is one where a **large amount of time / effort** is required to solve it.

**Algorithmic complexity** measures how the amount of work an **algorithm** does changes as **the size of the input data (N) increases**.


## An Example - One in a Hundred

Imagine your friend has picked a random number from 1 to 100, and you have to guess what it is. You could:

1. **Check every number one-by-one**: "Is it 1?", "No!", "Is it 2?", "No!", "Is it 3?", "No!", etc.
2. **Make a mid-way guess, then go higher/lower**: "Is it 50?", "No, higher", "Is it 75?", "No, lower", "Is it 62?", etc.

Which approach is better? That's exactly what the study of **algorithmic complexity** helps us answer.

When guessing your friend's number, imagine you can make 1 guess every 2 seconds:
- Checking 100 numbers one-by-one? That's likely to take a few minutes.
- Mid-way guessing and higher/lower? Will take a maximum of 7 guesses - 14 seconds!

### Try It Out Yourself

See the two algorithms running side-by-side:

<algo-race type="search" size="100" target="67"></algo-race>

> [!TIP]
> Try doubling N to 200. You should see that the second algorithm only needs one more step on average.

## Measuring Complexity

The second algorithm above (its correct name is a 'Binary Search') require less effort to solve, so we say it has a lower complexity than the first. In fact, we can name the complexity of each algorithm:
- Checking one-by-one - the effort increases linearly as N increases: **Linear** complexity
- Binary search - the effort goes up by just one as N doubles: **Logarithmic** complexity

Here is a chart with these two complexities highlighted:

<big-o-chart max="1000" value="5" enabled="on ologn"></big-o-chart>

> [!TIP]
> Use the slider above to see how the effort required for the two different complexities changes as **N** (the input size) grows. Notice the growing difference between **Linear, O(N)** and **Logarithmic, O(log N)**

## Understanding N

When we discuss algorithms, **N** represents the **size of the input data**:

| Task                  | What is N?              | Example                                       |
| --------------------- | ----------------------- | --------------------------------------------- |
| Sorting a list        | Number of **items**     | N = 100 for a list of 100 numbers             |
| Searching for a name  | Number of **entries**   | N = 1,000 for a phonebook with 1,000 contacts |
| Finding shortest path | Number of **locations** | N = 50 cities to visit                        |
| Breaking encryption   | **Key length** in bits  | N = 256 for AES-256                           |


## Computational 'Effort'

When we talk about an algorithm's **complexity**, we're measuring its **computational effort**. But what do we mean by 'effort'?

For a computer algorithm, we might measure
- How many steps / operations does it take - this is **Time Complexity**
- How much memory does it need - this is **Space Complexity**

> [!NOTE]
> In a computer, every step / operation takes time, so **more steps = more time**. This is why measuring steps / operations is called **time** complexity.


## Why is Complexity Interesting?

Some problems are *so complex*, they can't be solved in a **reasonable** amount of time.

> [!NOTE]
> 'Reasonable' means that it is possible to actually calculate a solution with **today's computers**, *and* that the solution is ready in a time that is actually **useful** to us) - No use calculating a driving route home if the calculation takes 27 years!

However, sometimes we *really need* a solution to these 'impossible' problems, and in some interesting cases, we *really don't* want solutions. This is what makes this topic interesting!

## Key Terms

<flashcards>

- # Algorithmic complexity

    ---

    Measures how an algorithm's **effort** changes as the **input size (N)** increases.

- # What N represents

    ---

    The **size of the input** - e.g. items in a list, entries in a phonebook, or cities on a route.

- # Time complexity

    ---

    Measures the number of **steps/operations** an algorithm takes - more steps means more time.

- # Space complexity

    ---

    Measures how much **memory** an algorithm needs, rather than how much time it takes.

</flashcards>

