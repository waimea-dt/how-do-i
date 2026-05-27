# Creating a Table [CREATE TABLE]

`CREATE TABLE`(sql) is used to make a new table.

## Simple Demo

Create a table to store players:

```sql
CREATE TABLE players (
	id    INTEGER PRIMARY KEY,
	name  TEXT NOT NULL,
	level INTEGER DEFAULT 1,
	class TEXT NOT NULL
)
```

`id` is the unique key for each row.


## Useful Extra

Use `IF NOT EXISTS` to avoid an error if table already exists:

```sql
CREATE TABLE IF NOT EXISTS players (
	id    INTEGER PRIMARY KEY,
	name  TEXT NOT NULL,
	level INTEGER DEFAULT 1,
	class TEXT NOT NULL
)
```

