# Selecting Data and Ordering / Sorting it [ORDER BY]

`ORDER BY`(sql) sorts results.

## Simple Demo

Sort by level (small to large):

```sql
SELECT name, level
FROM players
ORDER BY level ASC
```

Sort by level (large to small):

```sql
SELECT name, level
FROM players
ORDER BY level DESC
```

You can also sort by more than one column:

```sql
SELECT name, level, class
FROM players
ORDER BY class ASC, level DESC
```

