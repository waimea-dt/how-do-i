# Filtering Records when Selecting [WHERE]

`WHERE` filters rows.

Without `WHERE`, SQL returns all rows.

## Simple Demo

Only players at level 10 or higher:

```sql
SELECT name, level
FROM players
WHERE level >= 10
```

Players in Wizard class at level 10 or higher:

```sql
SELECT name, level, house
FROM players
WHERE class = 'Wizard'
  AND level >= 10
```

Use `AND` when all conditions must be true.
Use `OR` when either condition can be true.

