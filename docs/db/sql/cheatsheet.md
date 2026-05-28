# SQL Cheatsheet

## CREATE TABLE

```sql
CREATE TABLE players (
	id    INTEGER PRIMARY KEY,
	name  TEXT    NOT NULL,
	level INTEGER DEFAULT 1,
	class TEXT    NOT NULL
)
```

**Common types:** `INTEGER`(sql), `TEXT`(sql), `REAL`(sql), `BLOB`(sql)

**Common constraints:** `PRIMARY KEY`(sql), `NOT NULL`(sql), `DEFAULT value`(sql), `UNIQUE`(sql)

> [!TIP]
> Use `CREATE TABLE IF NOT EXISTS table_name (...)`(sql) to avoid an error if the table already exists


## INSERT

**Add a single record:**

```sql
INSERT INTO players (id, name, level, class)
VALUES (1, 'PixelKnight', 12, 'Brute')
```

**Add multiple records at once:**

```sql
INSERT INTO players (id, name, level, class)
VALUES
	(2, 'CodeNinja', 9,  'Wizard'),
	(3, 'BugHunter', 15, 'Thief')
```

> [!TIP]
> Always list the column names to ensure values go into the correct fields


## SELECT

**Select all columns:**

```sql
SELECT *
FROM players
```

**Select specific columns:**

```sql
SELECT name, level
FROM players
```

**Select with column aliases:**

```sql
SELECT name AS player_name,
       level AS player_level
FROM players
```


## WHERE

**Filter with simple condition:**

```sql
SELECT name, level
FROM players
WHERE level >= 10
```

**Multiple conditions with AND / OR:**

```sql
SELECT name, level, class
FROM players
WHERE class = 'Wizard'
  AND level >= 10
```

```sql
SELECT name
FROM players
WHERE class = 'Wizard'
   OR class = 'Thief'
```

**Comparison operators:**

```sql
=      -- equal to
!=     -- not equal to
IS     -- equal to     (same as =, often used with NULL checks)
IS NOT -- not equal to (same as !=, often used with NULL checks)
>      -- greater than
>=     -- greater than or equal to
<      -- less than
<=     -- less than or equal to
```

```sql
SELECT name
FROM players
WHERE class IS 'Wizard'      -- same as: WHERE class = 'Wizard'
```

**Pattern matching with LIKE:**

```sql
SELECT name
FROM players
WHERE name LIKE '%code%'     -- contains "code"
```

```sql
%      -- matches any sequence of characters
_      -- matches exactly one character
```

**Check for NULL values:**

```sql
SELECT name
FROM players
WHERE notes IS NULL          -- field has no value
```

```sql
SELECT name
FROM players
WHERE notes IS NOT NULL      -- field has a value
```

**Range checking with IN:**

```sql
SELECT name, class
FROM players
WHERE class IN ('Wizard', 'Thief', 'Brute')
```

**Range checking with BETWEEN:**

```sql
SELECT name, level
FROM players
WHERE level BETWEEN 10 AND 20     -- 10 ≤ level ≤ 20
```


## ORDER BY

**Sort ascending (smallest to largest):**

```sql
SELECT name, level
FROM players
ORDER BY level ASC
```

**Sort descending (largest to smallest):**

```sql
SELECT name, level
FROM players
ORDER BY level DESC
```

**Sort by multiple columns:**

```sql
SELECT name, level, class
FROM players
ORDER BY class ASC, level DESC    -- class A-Z, then level within each class
```


## LIMIT

**Limit number of results:**

```sql
SELECT name, level
FROM players
ORDER BY level DESC
LIMIT 5                           -- top 5 highest levels
```

**Pagination with OFFSET:**

```sql
SELECT name, level
FROM players
ORDER BY level DESC
LIMIT 10 OFFSET 20                -- skip first 20, get next 10
```


## JOIN

**Join two tables:**

```sql
SELECT players.name,
       teams.name
FROM players
JOIN teams ON players.team_id = teams.id
```

**Join with column aliases:**

```sql
SELECT players.name AS player_name,
       teams.name   AS team_name
FROM players
JOIN teams ON players.team_id = teams.id
```

**Types of joins:**

```sql
JOIN         -- inner join - only matching rows
LEFT JOIN    -- all rows from left table + matching from right (NULL if no match)
RIGHT JOIN   -- all rows from right table + matching from left (NULL if no match)
```


## UPDATE

**Update a single record:**

```sql
UPDATE players
SET level = 20
WHERE id = 2
```

**Update multiple records:**

```sql
UPDATE players
SET level = 20
WHERE class = 'Wizard'
```

**Update multiple columns:**

```sql
UPDATE players
SET level = 21,
    class = 'Thief'
WHERE id = 2
```

> [!WARNING]
> Without a `WHERE`(sql) clause, **every** record will be updated!


## DELETE

**Delete a single record:**

```sql
DELETE FROM players
WHERE id = 3
```

**Delete multiple records:**

```sql
DELETE FROM players
WHERE level < 5
```

> [!WARNING]
> Without a `WHERE`(sql) clause, **every** record will be deleted!


## GROUP BY - Aggregates

**Count records:**

```sql
SELECT class, COUNT(*) AS total_players
FROM players
GROUP BY class
```

**Aggregate functions:**

```sql
COUNT(*)      -- count all rows
COUNT(field)  -- count non-NULL values in field
SUM(field)    -- total of numeric field
AVG(field)    -- average of numeric field
MIN(field)    -- smallest value
MAX(field)    -- largest value
```

**Multiple aggregates:**

```sql
SELECT class,
       COUNT(*)   AS total,
       AVG(level) AS avg_level,
       MAX(level) AS max_level
FROM players
GROUP BY class
```

**Filter aggregated results with HAVING:**

```sql
SELECT class, COUNT(*) AS total
FROM players
GROUP BY class
HAVING COUNT(*) > 5               -- filter groups (use HAVING, not WHERE)
```


## Parameters (Prepared Statements)

**Single parameter:**

```sql
SELECT name, level
FROM players
WHERE id = ?
```

> [!IMPORTANT]
> Always use `?`(sql) placeholders with parameters for user-supplied data to prevent **SQL injection attacks**. Never concatenate user input directly into SQL!

**Multiple parameters:**

```sql
SELECT name, level
FROM players
WHERE class = ?
  AND level >= ?
```

**Parameters are supplied separately in code:**

```python
sql = "SELECT * FROM players WHERE class = ? AND level >= ?"
params = ('Wizard', 10)           # values in correct order
records = db.execute(sql, params)
```

**Pattern matching with parameters:**

```sql
SELECT name, level
FROM players
WHERE name LIKE ?                 -- parameter: '%code%'
```


## Foreign Keys

**Create parent table first:**

```sql
CREATE TABLE teams (
	id    INTEGER PRIMARY KEY,
	name  TEXT NOT NULL,
	notes TEXT
)
```

**Create child table with foreign key:**

```sql
CREATE TABLE players (
	id      INTEGER PRIMARY KEY,
	name    TEXT NOT NULL,
	level   INTEGER DEFAULT 1,
	class   TEXT NOT NULL,
	team_id INTEGER,

	FOREIGN KEY (team_id) REFERENCES teams(id)
)
```

> [!NOTE]
> Foreign keys ensure `players.team_id`(sql) must match an existing `teams.id`(sql), preventing broken links in your data


## Useful Functions

**Text functions:**

```sql
UPPER(text)              -- convert to uppercase
LOWER(text)              -- convert to lowercase
LENGTH(text)             -- number of characters
TRIM(text)               -- remove leading/trailing spaces
SUBSTR(text, start, len) -- extract substring
```

**Math functions:**

```sql
ABS(number)              -- absolute value
ROUND(number, decimals)  -- round to decimal places
MIN(a, b)                -- smallest value
MAX(a, b)                -- largest value
```

**Date/Time functions (SQLite):**

```sql
DATE('now')              -- current date → '2026-05-28'
TIME('now')              -- current time → '14:30:45'
DATETIME('now')          -- current datetime → '2026-05-28 14:30:45'
```


## Common Query Patterns

**Find duplicate records:**

```sql
SELECT name, COUNT(*) AS duplicates
FROM players
GROUP BY name
HAVING COUNT(*) > 1
```

**Get top N results:**

```sql
SELECT name, level
FROM players
ORDER BY level DESC
LIMIT 10                          -- top 10
```

**Get distinct values (remove duplicates):**

```sql
SELECT DISTINCT class
FROM players
```

**Count all records:**

```sql
SELECT COUNT(*) AS total
FROM players
```

**Search across multiple fields:**

```sql
SELECT name, class
FROM players
WHERE name LIKE '%knight%'
   OR class LIKE '%knight%'
```

**Combine with multiple tables:**

```sql
SELECT players.name AS player_name,
       teams.name   AS team_name,
       classes.name AS class_name
FROM players
JOIN teams   ON players.team_id  = teams.id
JOIN classes ON players.class_id = classes.id
```

## DROP TABLE

**Delete a table and all its data:**

```sql
DROP TABLE players
```

**Delete only if it exists:**

```sql
DROP TABLE IF EXISTS players
```

> [!WARNING]
> `DROP TABLE`(sql) **permanently deletes** the table and **all its data**. This cannot be undone!

