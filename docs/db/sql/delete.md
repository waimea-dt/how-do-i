# Deleting a Record from a Table with SQL

## The DELETE Command

`DELETE`(sql) removes rows from a table. The syntax is:

```sql
DELETE FROM table_name
WHERE criteria
```

> [!WARNING]
> If you skip the `WHERE`(sql) clause, e.g. `DELETE FROM table_name`(sql), **every** record will be deleted! Be careful!


## Example - Deleting a Single Record

Use the **primary key** value (e.g. the id) to identify and remove one specific record:

```sql
DELETE FROM players
WHERE id = 3
```

Only the **single record** with `id = 3`(sql) will be removed.


## Example - Deleting a Set of Records

Specify some **criteria** to remove a set of matching records:

```sql
DELETE FROM players
WHERE rank < 5
```

**Multiple records** that match `rank < 5`(sql) will be removed.


