# Updating Records in a Table with SQL

## The UPDATE Command

`UPDATE`(sql) changes existing rows in a table. The syntax is:

```sql
UPDATE table_name
SET field_name = value
WHERE criteria
```

> [!WARNING]
> If you skip the `WHERE`(sql) clause, e.g. `UPDATE table_name SET field = value`(sql), **every** record will be updated! Be careful!


## Example - Updating a Single Record

Use the **primary key** value (e.g. the id) to identify and update one specific record:

```sql
UPDATE players
SET rank = 20
WHERE id = 2
```

Only the **single record** with `id = 2`(sql) will be changed.


## Example - Updating Multiple Records

Specify some **criteria** to update a set of matching records:

```sql
UPDATE players
SET rank = 20
WHERE class = 'Wizard'
```

**Multiple records** that match `class = 'Wizard'`(sql) will be updated.


## Example - Updating Multiple Fields

Change two columns at once in a single record:

```sql
UPDATE players
SET rank = 21,
	class = 'Thief'
WHERE id = 2
```

Both `rank`(sql) and `class`(sql) fields are updated for the record with `id = 2`(sql).

