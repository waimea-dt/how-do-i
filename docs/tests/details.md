# Details

Native `<details>` / `<summary>` tests for single panels, grouped panels, default-open states, and mixed content.

## Single

<details>
<summary>Open single example</summary>

This is a single details block with plain paragraph content.

</details>

## Groups

<details>
<summary>Group item one</summary>

This first item checks spacing between stacked details blocks.

</details>

<details>
<summary>Group item two</summary>

This second item uses a short list.

- Keyboard
- Mouse
- Monitor

</details>

<details>
<summary>Group item three</summary>

This third item uses emphasis and inline code like `print("hello")`.

</details>

## Groups Linked

<details name="linked">
<summary>Group item one</summary>

This first item checks spacing between stacked details blocks.

</details>

<details name="linked">
<summary>Group item two</summary>

This second item uses a short list.

- Keyboard
- Mouse
- Monitor

</details>

<details name="linked">
<summary>Group item three</summary>

This third item uses emphasis and inline code like `print("hello")`.

</details>

## Default Opened

<details open>
<summary>Opened by default</summary>

This panel starts open using the native `open` attribute.

</details>

<details open>
<summary>Opened with longer content</summary>

When pages load, this should already be expanded.

1. Check initial spacing
2. Check summary styling
3. Check collapsed state after clicking

</details>

## Mixed Content

<details>
<summary>Paragraphs, list, quote, code</summary>

Students can tuck away hints, worked answers, or extra reading inside one block.

> Hidden detail: computers are very fast at following instructions and very bad at guessing what you meant.

- Bullet one
- Bullet two
- Bullet three

```python
score = 7
if score > 5:
    print("Level cleared")
```

</details>

<details open>
<summary>Table inside details</summary>

| State | Result |
| --- | --- |
| Closed | Content hidden |
| Open | Content visible |

</details>