# Getting Summary Data with SQL

## The GROUP BY Clause

Summary queries use **aggregate functions** to calculate totals, counts, and averages. The syntax is:

```sql
SELECT field_name, FUNCTION(field_name)
FROM table_name
GROUP BY field_name
```

> [!TIP]
> Common aggregate functions include `COUNT()`(sql), `SUM()`(sql), `AVG()`(sql), `MIN()`(sql), and `MAX()`(sql)


## Example - Count Records

Count how many players are in each class:

```sql
SELECT class, COUNT(*) AS total_players
FROM players
GROUP BY class
```

The `COUNT(*)`(sql) function counts the **number of records** in each group.


## Example - Calculate Average

Calculate the average rank in each class:

```sql
SELECT class, AVG(rank) AS avg_rank
FROM players
GROUP BY class
```

The `AVG()`(sql) function calculates the **average value** of the `rank`(sql) field for each group.

