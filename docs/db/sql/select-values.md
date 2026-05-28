# Using Parameters in SQL Queries

## Parameterised Queries

When values come from users, use **placeholders** (`?`) and **parameters** instead of putting user text directly into SQL queries. The syntax is:

```sql
SELECT field_name, field_name, ...
FROM table_name
WHERE field_name = ?
```

> [!IMPORTANT]
> Always use parameterised queries with user-supplied data to prevent **SQL injection attacks**. Never concatenate user input directly into SQL strings!


## Example - Single Parameter

Find one player by their id:

```sql
SELECT name, rank
FROM players
WHERE id = ?
```

Parameters: `3`

The `?`(sql) placeholder is replaced with the value `3` safely.


## Example - Multiple Parameters

Filter by two values:

```sql
SELECT name, rank
FROM players
WHERE class = ?
  AND rank >= ?
```

Parameters: `'Wizard'` and `10`

Parameters must be supplied in the **correct order** to match the `?`(sql) placeholders.


## Example - Wildcards

Search using pattern matching with `%` and `LIKE`(sql):

```sql
SELECT name, rank
FROM players
WHERE name LIKE ?
```

Parameters: `'A%'`

The `LIKE`(sql) operator allows **pattern matching** with `%` as a wildcard:
- `A%` means that the data must start with `A`, but can be followed by anything
- `%N` means that the data can start with anything, but must end with `N`
- `%S%` means that anything can be at the start/end of the data, but it must contain `S`

> [!TIP]
> This is great for search queries - the search term is placed between wildcards:
> `search_param = f"%{search_term}%"`(python)

