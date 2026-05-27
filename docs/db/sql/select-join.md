# Selecting Data from Multiple Tables [JOIN]

`JOIN` combines rows from two tables using related columns.

## Simple Demo

Tables:

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

The `ON` line tells SQL how rows are matched - the foreign / primary key connection.

### Alias for Similar Fieldnames

In this example, both tables have `name` fields. To differentiate them, give each one a unique alas:

```sql
SELECT
    players.name AS p_name,
    teams.name   AS t_name
FROM players
JOIN teams ON players.team_id = teams.id
```


