# Deleting a Record from a Table [DELETE]

`DELETE` removes rows from a table.

## Simple Demo

Remove one player by id:

```sql
DELETE FROM players
WHERE id = 3
```

Only the row with `id = 3` is removed.


## Important

If you skip `WHERE`, every row is deleted:

```sql
DELETE FROM players
```