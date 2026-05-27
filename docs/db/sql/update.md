# Updating Values in Records [UPDATE]

`UPDATE` changes existing rows.

## Simple Demo

Change one player's level:

```sql
UPDATE players
SET level = 20
WHERE id = 2
```

Change multiple player's level:

```sql
UPDATE players
SET level = 20
WHERE class = 'Wizard'
```

Change two columns at once:

```sql
UPDATE players
SET level = 21,
	class = 'Thief'
WHERE id = 2
```

## Important

If you skip `WHERE`, every row is updated.

