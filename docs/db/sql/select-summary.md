# Getting Summary Information About Records in a Table [GROUP BY]

Summary queries give totals, counts, and averages.

Useful functions:

- `COUNT()`(sql)
- `SUM()`(sql)
- `AVG()`(sql)
- `MIN()`(sql)
- `MAX()`(sql)

## Simple Demo

How many players in each class:

```sql
SELECT class, COUNT(*) AS total_players
FROM players
GROUP BY class
```

Average level in each class:

```sql
SELECT class, AVG(level) AS avg_level
FROM players
GROUP BY class
```

