# HTML Tables

Use tables for data, not general layout.

## Basic table

```html
<table>
    <caption>Term 2 Results</caption>
    <thead>
        <tr>
            <th>Student</th>
            <th>Project</th>
            <th>Grade</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Ari</td>
            <td>Portfolio Site</td>
            <td>Merit</td>
        </tr>
    </tbody>
</table>
```

## Good practice

- Use `<th>` for headings
- Include `<caption>` to describe table
- Keep data aligned with column meaning
- Do not use table for page structure
