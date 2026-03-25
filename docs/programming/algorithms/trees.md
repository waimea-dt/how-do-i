# Tree Traversal Algorithms

A **tree** is a data structure made up of **nodes** connected by **edges**, arranged in a hierarchy. The node at the top is called the **root**, and each node can have **child nodes** below it...


```mermaid
flowchart TD
    A((A)) --> B((B))
    A --> C((C))
    B --> D((D))
    B --> E((E))
    C --> F((F))
    E --> G((G))
    E --> H((H))
```

> [!NOTE]
> In a **binary tree**, each node has at most two children - referred to as the **left** and **right** child. The tree above is a binary tree with **root: A**.

There are a number of ways that trees can be **traversed** - that is, visited node by node in a specific order. The two main categories are **depth-first** and **breadth-first**...


| Traversal | Order visited | Data structure used |
|-----------|---------------|---------------------|
| **Depth-first** | Down each branch first | Stack / recursion |
| **Breadth-first** | Level by level | Queue |

> [!TIP]
> Trees are a special kind of graph — with no cycles and a single root. See [Graph Algorithms](programming/algorithms/graphs.md) to see how BFS and DFS work on more general structures.



## Depth-First

Depth-first traversal explores as **far down a branch** as possible before backtracking. There are three common orderings:

| Order          | Visit sequence    | Result for example tree |
| -------------- | ----------------- | ----------------------- |
| **Pre-order**  | Node, Left, Right | A, B, D, E, G, H, C, F  |
| **In-order**   | Left, Node, Right | D, B, G, E, H, A, F, C  |
| **Post-order** | Left, Right, Node | D, G, H, E, B, F, C, A  |

> [!NOTE]
> The algorithm for a depth-first traversal is naturally **[recursive](programming/algorithms/recursion.md)** - each call handles one node, then **calls itself** on the left and right children.

### Pre-Order

At each node:
1. the **node** is visited
2. the **left** branch is followed
3. the **right** branch is followed


```mermaid
flowchart TD
    A(("A: 1")) --> B(("B: 2"))
    A --> C(("C: 7"))
    B --> D(("D: 3"))
    B --> E(("E: 4"))
    C --> F(("F: 8"))
    E --> G(("G: 5"))
    E --> H(("H: 6"))
```

Here is the pre-order algorithm in pseudo-code...

```pseudo
start traverse (node)
    if node is empty then
        return
    endif

    visit node
    call traverse (left subtree)
    call traverse (right subtree)
end
```

And here is is as a flowchart...

```mermaid
flowchart TD
    %% Define nodes
    start(["Traverse (node)"])
    empty{"Node is<br>empty?"}
    visit["Visit node"]
    left[["Traverse (left subtree)"]]
    right[["Traverse (right subtree)"]]
    done([Return])

    %% Define links
    start --> empty
    empty -- Yes --> done
    empty -- No --> visit --> left --> right --> done

    left  -. "recursive<br>call" .-> start
    right -. "recursive<br>call" .-> start
```

This is a runnable Python implementation of the **pre-order** algorithm...


```python setup=example_tree
#---------------------------------------
# Define the tree

class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

# Build the tree
a = Node("A")
b = Node("B")
c = Node("C")
d = Node("D")
e = Node("E")
f = Node("F")
g = Node("G")
h = Node("H")

a.left = b
a.right = c
b.left = d
b.right = e
c.left = f
e.left = g
e.right = h

root = a
```

```python run setup=example_tree
def depth_first_pre_order(node):
    """
    Perform a depth-first, pre-order traversal of a given tree
    """
    if node is None:
        return

    print(f" → {node.value}", end="")   # 1. visit node
    depth_first_pre_order(node.left)    # 2. then go left
    depth_first_pre_order(node.right)   # 3. then go right

#---------------------------------------
# Test the algorithm on the example tree

print("Depth-first, pre-order...")
depth_first_pre_order(root)
```

### In-Order

At each node:
1. the **left** branch is followed
2. the **node** is visited
3. the **right** branch is followed


```mermaid
flowchart TD
    A(("A: 6")) --> B(("B: 2"))
    A --> C(("C: 8"))
    B --> D(("D: 1"))
    B --> E(("E: 4"))
    C --> F(("F: 7"))
    E --> G(("G: 3"))
    E --> H(("H: 5"))
```

This is a runnable Python implementation of the **in-order** algorithm...

```python run setup=example_tree
def depth_first_in_order(node):
    """
    Perform a depth-first, in-order traversal of a given tree
    """
    if node is None:
        return

    depth_first_in_order(node.left)     # 1. go left
    print(f" → {node.value}", end="")   # 2. then visit node
    depth_first_in_order(node.right)    # 3. then go right

#---------------------------------------
# Test the algorithm on the example tree

print("Depth-first, in-order...")
depth_first_in_order(root)
```


### Post-Order

At each node:
1. the **left** branch is followed
2. the **right** branch is followed
3. the **node** is visited


```mermaid
flowchart TD
    A(("A: 8")) --> B(("B: 5"))
    A --> C(("C: 7"))
    B --> D(("D: 1"))
    B --> E(("E: 4"))
    C --> F(("F: 6"))
    E --> G(("G: 2"))
    E --> H(("H: 3"))
```

This is a runnable Python implementation of the **post-order** algorithm...

```python run setup=example_tree
def depth_first_post_order(node):
    """
    Perform a depth-first, post-order traversal of a given tree
    """
    if node is None:
        return

    depth_first_post_order(node.left)   # 1. go left
    depth_first_post_order(node.right)  # 2. then go right
    print(f" → {node.value}", end="")   # 3. then visit node

#---------------------------------------
# Test the algorithm on the example tree

print("Depth-first, post-order...")
depth_first_post_order(root)
```

> [!NOTE]
> The above algorithms are all the same, except for the order of the `print` statement and the recursive calls.


## Breadth-First

Breadth-first traversal (also called **level-order** traversal) visits nodes **level by level**, from top to bottom and left to right.

Using the tree above, the result would be: **A, B, C, D, E, F, G, H**

```mermaid
flowchart TD
    A(("A: 1")) --> B(("B: 2"))
    A --> C(("C: 3"))
    B --> D(("D: 4"))
    B --> E(("E: 5"))
    C --> F(("F: 6"))
    E --> G(("G: 7"))
    E --> H(("H: 8"))
```

> [!NOTE]
> Instead of recursion, breadth-first search uses a **queue** - a structure where items are added to the back and removed from the front (just like a real-life queue of people)...

```pseudo
start
    setup an empty queue
    add root node to the queue

    repeat until queue is empty
        remove node from front of queue
        visit the node

        if node has left branch then
            add left node to queue
        endif

        if node has right branch then
            add right node to queue
        endif
    endrepeat
end
```

```mermaid
flowchart TD
    %% Define nodes
    start([Start])
    queue["Setup an<br>empty queue"]
    init["Add root to queue"]
    loop((Loop))
    check{"Queue<br>empty?"}
    dequeue["Remove node from<br>front of queue"]
    visit["Visit the node"]
    leftExists{"Node<br>has left<br>branch?"}
    addLeft["Add left node<br>to queue"]
    rightExists{"Node<br>has right<br>branch?"}
    addRight["Add right node<br>to queue"]
    loopLower(( ))
    done([Done])

    %% Define links
    start --> queue --> init --> loop --> check
    check -- No --> dequeue --> visit
    visit --> leftExists
    leftExists -- Yes --> addLeft --> rightExists
    leftExists -- No --> rightExists
    rightExists -- Yes --> addRight --> loopLower
    rightExists -- No --> loopLower
    loopLower --> loop
    check -- Yes --> done
```

```python run setup=example_tree
from collections import deque

def breadth_first(root):
    """
    Perform a breadth-first traversal of a given tree
    """

    if root is None:
        print("Done!")
        return

    queue = deque([root])

    while queue:
        node = queue.popleft()              # remove from front

        print(f" → {node.value}", end="")   # visit node

        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)

#---------------------------------------
# Test the algorithm on the example tree

print("Breadth-first...")
breadth_first(root)
```
