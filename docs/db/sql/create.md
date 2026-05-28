# Creating a Table with SQL

## The CREATE TABLE Command

`CREATE TABLE`(sql) is used to make a new table. The syntax is:

```sql
CREATE TABLE table_name (
	field_name TYPE ATTRIBUTES,
	field_name TYPE ATTRIBUTES,
	field_name TYPE ATTRIBUTES
)
```

> [!TIP]
> Use `CREATE TABLE IF NOT EXISTS table_name (...)`(sql) to avoid an error if the table you are creating might already exist


## Example - Players Table

Create a table to store player data:

```sql
CREATE TABLE players (
	id    INTEGER PRIMARY KEY,
	name  TEXT    NOT NULL,
	level INTEGER DEFAULT 1,
	class TEXT    NOT NULL
)
```

Here, `id` is the **primary key** - it is a **unique** value that identifies each record.


