# Linking Tables with Foreign Keys

## The FOREIGN KEY Constraint

A **foreign key** links one table to another and ensures **referential integrity**. The syntax is:

```sql
CREATE TABLE table_name (
	field_name TYPE,
	...
	FOREIGN KEY (field_name) REFERENCES other_table(primary_key)
)
```

> [!NOTE]
> Foreign keys prevent data from pointing to rows that do not exist, maintaining data integrity across related tables


## Example - Creating Linked Tables

Create the parent table first:

```sql
CREATE TABLE teams (
	id    INTEGER PRIMARY KEY,
	name  TEXT NOT NULL,
    notes TEXT
)
```

Then create the child table with a **foreign key**:

```sql
CREATE TABLE players (
	id    INTEGER PRIMARY KEY,
	name  TEXT NOT NULL,
    rank  INTEGER DEFAULT 1,
    class TEXT NOT NULL,

	team_id INTEGER,

	FOREIGN KEY (team_id) REFERENCES teams(id)
)
```

Now each `players.team_id`(sql) value must match an existing `teams.id`(sql) value. This prevents **broken links** in your data.

