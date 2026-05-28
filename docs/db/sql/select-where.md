# Filtering Data with SQL

## The WHERE Clause

`WHERE`(sql) filters rows based on specific **criteria**. The syntax is:

```sql
SELECT field_name, field_name, ...
FROM table_name
WHERE criteria
```

> [!NOTE]
> Without a `WHERE`(sql) clause, SQL returns **all rows** from the table


## Example - Simple Filter

Only return players at rank 10 or higher:

```sql
SELECT name, rank
FROM players
WHERE rank >= 10
```

Only records matching `rank >= 10`(sql) will be returned.


## Example - Multiple Conditions

Return players in the Wizard class at rank 10 or higher:

```sql
SELECT name, rank, class
FROM players
WHERE class = 'Wizard'
  AND rank >= 10
```

> [!TIP]
> Use `AND`(sql) when **all conditions** must be true
> Use `OR`(sql) when **either condition** can be true

