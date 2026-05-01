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

## Buttons-only Mode

Useful where drag support is not wanted.

<drag-drop mode="buttons">

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
