# Rolling Code Plugin Tests

## Default

<rolling-code></rolling-code>

---

## Custom Counter Start

<rolling-code counter="123"></rolling-code>

---

## Narrow Window

<rolling-code counter="123" window="4"></rolling-code>

---

## Small Drift (Still Valid)

<rolling-code counter="123" window="8" drift="2"></rolling-code>

---

## Large Drift (Rejected)

<rolling-code counter="123" window="8" drift="20"></rolling-code>

---

## With Intercept View

<rolling-code counter="250" window="10" intercept></rolling-code>
