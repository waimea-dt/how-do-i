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

Only return players at level 10 or higher:

```sql
SELECT name, level
FROM players
WHERE level >= 10
```

Only records matching `level >= 10`(sql) will be returned.


## Example - Multiple Conditions

Return players in the Wizard class at level 10 or higher:

```sql
SELECT name, level, class
FROM players
WHERE class = 'Wizard'
  AND level >= 10
```

> [!TIP]
> Use `AND`(sql) when **all conditions** must be true
> Use `OR`(sql) when **either condition** can be true

