# Adding Records to a Table with SQL

## The INSERT Command

`INSERT`(sql) adds new rows to a table. The syntax is:

```sql
INSERT INTO table_name (field_name, field_name, ...)
VALUES (data_value, data_value, ...)
```

> [!TIP]
> Always list the column names to ensure your values go into the correct fields


## Example - Adding a Single Record

Add one row to the players table:

```sql
INSERT INTO players (id, name, level, class)
VALUES (1, 'PixelKnight', 12, 'Brute')
```

This creates **one new record** with the specified values.


## Example - Adding Multiple Records

Add multiple rows at once:

```sql
INSERT INTO players (id, name, level, class)
VALUES
	(2, 'CodeNinja', 9,  'Wizard'),
	(3, 'BugHunter', 15, 'Thief')
```

This creates **multiple records** in a single `INSERT`(sql) statement.
