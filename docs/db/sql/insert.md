# Creating / Adding Records to a Table [INSERT]

`INSERT` adds new rows to a table.

## Simple Demo

Add one row:

```sql
INSERT INTO players (id, name, level, class)
VALUES (1, 'PixelKnight', 12, 'Brute')
```

Add many rows at once:

```sql
INSERT INTO players (id, name, level, class)
VALUES
	(2, 'CodeNinja', 9,  'Wizard'),
	(3, 'BugHunter', 15, 'Thief')
```

List columns so your values go into the right places.
