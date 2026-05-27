# Defining Foreign Keys [FOREIGN KEY]

A foreign key links one table to another.

It stops data from pointing to rows that do not exist.

## Simple Demo

Create teams first:

```sql
CREATE TABLE teams (
	id    INTEGER PRIMARY KEY,
	name  TEXT NOT NULL,
    notes TEXT
)
```

Then create players with a foreign key:

```sql
CREATE TABLE players (
	id      INTEGER PRIMARY KEY,
	name    TEXT NOT NULL,
    level   INTEGER DEFAULT 1,
    class   TEXT NOT NULL,

	team_id INTEGER,

	FOREIGN KEY (class_id) REFERENCES classes(id)
)
```

Now each `players.team_id` must match a real `teams.id`.


## Why This Helps

Without foreign keys, you can end up with broken links in your data.

