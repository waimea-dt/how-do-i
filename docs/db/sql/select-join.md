# Combining Data from Multiple Tables with SQL

## The JOIN Clause

`JOIN`(sql) combines rows from two tables using related columns. The syntax is:

```sql
SELECT table1.field, table2.field, ...
FROM table1
JOIN table2 ON table1.foreign_key = table2.primary_key
```

> [!NOTE]
> The `ON`(sql) clause specifies how rows are matched - typically using the **foreign key** / **primary key** connection


## Example - Simple Join

Given these tables:

- `players(id, name, level, notes, team_id)`
- `teams(id, name, notes)`

Get each player with their team name:

```sql
SELECT
    players.name,
    teams.name
FROM players
JOIN teams ON players.team_id = teams.id
```

This combines data from both tables where `players.team_id`(sql) matches `teams.id`(sql).


## Example - Using Column Aliases

When both tables have fields with the same name (like `name`), use **aliases** to differentiate them:

```sql
SELECT
    players.name AS p_name,
    teams.name   AS t_name
FROM players
JOIN teams ON players.team_id = teams.id
```

The `AS`(sql) keyword creates an **alias** for each column in the results.


