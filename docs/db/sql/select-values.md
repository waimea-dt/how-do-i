# SELECT Queries Using Supplied Data Values

When values come from users, use placeholders (`?`) and parameters.

This is safer than putting user text straight into SQL.

## Demo 1: Find One Player

```sql
SELECT name, level
FROM players
WHERE id = ?
```

Parameter example: `(3,)`


## Demo 2: Filter by Two Values

```sql
SELECT name, level
FROM players
WHERE class = ?
  AND level >= ?
```

Parameter example: `('Wizard', 10)`


## Demo 3: Search by Text

```sql
SELECT name, level
FROM players
WHERE name LIKE ? OR class LIKE ?
```

Parameter example: `('%code%', '%code%')`

