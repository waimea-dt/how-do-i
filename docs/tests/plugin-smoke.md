# Plugin Smoke Tests

Quick sanity page after plugin refactors.

## Coding: Pseudo Highlighter

```pseudo
start
x = 10
if x > 5
    show "ok"
endif
end
```

## Visualisation: Data

```data
show dec 255 as hex-bytes
show hex ff00aa as colour
```

## Graphics: Excalidraw

<excalidraw src="tests/_assets/test.excalidraw" alt="Smoke test diagram"></excalidraw>

## Interactive: Trace Table

```python trace
x = 1
y = 2
x = x + y
print(x)
```
