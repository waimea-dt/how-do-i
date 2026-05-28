# Reading Data from a Table with SQL

## The SELECT Command

`SELECT`(sql) reads data from a table. The syntax is:

```sql
SELECT field_name, field_name, ...
FROM table_name
```

> [!TIP]
> Use `SELECT *`(sql) to retrieve all columns, but specify individual column names for better performance and readability


## Example - Selecting All Columns

Get all columns from all rows:

```sql
SELECT *
FROM players
```

The `*`(sql) means **all columns** will be returned.


## Example - Selecting Specific Columns

Get specific columns only:

```sql
SELECT name, level
FROM players
```

Only the `name`(sql) and `level`(sql) columns are returned. Selecting fewer columns can make results easier to read and improves query performance.

