# Drag Drop Reorder

Use this plugin for ordering tasks, process steps, timelines, and Parsons problems.

## Default Usage

Items are shuffled first. Learner reorders them and submits.

<drag-drop>

1. Gather requirements

2. Design data model

3. Implement core logic

4. Write tests

5. Refactor and document

</drag-drop>

## Multi-line Content

List items can contain full markdown blocks.

<drag-drop>

1. **Start** with input validation.

    - Check type
    - Check range
    - Return early on invalid data

2. Run the main algorithm.

    ```js
    const result = solve(data)
    ```

3. Format and return output.

    Include any notes needed for user display.

</drag-drop>

## Reference + Draggable Lists

Use `---` to split into two ordered lists.
Left list is fixed reference content. Right list is draggable content to match.

<drag-drop>

1.
    ```python
    print("Starting...")
    ```
2.
    ```python
    name = input("What is your name? ")
    ```

3.
    ```python
    print(f"Hello, {name}!")
    ```

---

1. Show Start-up message
2. Ask user for their name
3. Output greeting using the name

</drag-drop>

## Code Mode

Useful where drag support is not wanted.

<drag-drop mode="code">

1.
    ```python
    print("Starting...")
    ```
2.
    ```python
    name = input("What is your name? ")
    ```

3.
    ```python
    print(f"Hello, {name}!")
    ```

</drag-drop>

## Code Mode - Reference + Draggable Lists

<drag-drop mode="code">

1.
    ```python
    print("Starting...")
    ```
2.
    ```python
    name = input("What is your name? ")
    ```

3.
    ```python
    print(f"Hello, {name}!")
    ```

---

1. Show Start-up message
2. Ask user for their name
3. Output greeting using the name

</drag-drop>

## No Header

<drag-drop mode="code" header="false">

1.
    ```python
    print("Starting...")
    ```
2.
    ```python
    name = input("What is your name? ")
    ```

3.
    ```python
    print(f"Hello, {name}!")
    ```

---

1. Show Start-up message
2. Ask user for their name
3. Output greeting using the name

</drag-drop>

## Custom Header

<drag-drop mode="code" title="Get Them Sorted">

1.
    ```python
    name = input("What is your name? ")
    ```
2.
    ```python
    print(f"Hello, {name}!")
    ```
    
</drag-drop>

## Custom Header with Sub-Title

<drag-drop mode="code" title="Get Them Sorted" sub-title="Yeah, big dog!">

1.
    ```python
    name = input("What is your name? ")
    ```
2.
    ```python
    print(f"Hello, {name}!")
    ```

</drag-drop>

## No Shuffle

<drag-drop shuffle="false">

1. Step 1
2. Step 2
3. Step 3

</drag-drop>

## Custom Almost Threshold

`almost="60"` means 60% or higher is almost.

<drag-drop almost="60">

1. Parse tokens
2. Build AST
3. Optimise AST
4. Generate bytecode
5. Run VM

</drag-drop>

## Syntax

```html
<drag-drop almost="70" shuffle="true">

1. Item one content in markdown

    Item body can span lines.

2. Item two content in markdown

3. Item three content in markdown

</drag-drop>
```
