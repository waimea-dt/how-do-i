# Sorting Data with SQL

## The ORDER BY Clause

`ORDER BY`(sql) sorts query results. The syntax is:

```sql
SELECT field_name, field_name, ...
FROM table_name
ORDER BY field_name ASC|DESC
```

> [!TIP]
> Use `ASC`(sql) for **ascending** order (smallest to largest) or `DESC`(sql) for **descending** order (largest to smallest)


## Example - Ascending Order

Sort by level from smallest to largest:

```sql
SELECT name, level
FROM players
ORDER BY level ASC
```

Results are sorted in **ascending** order by the `level`(sql) field.


## Example - Descending Order

Sort by level from largest to smallest:

```sql
SELECT name, level
FROM players
ORDER BY level DESC
```

Results are sorted in **descending** order by the `level`(sql) field.


## Example - Multiple Sort Columns

Sort by multiple columns:

```sql
SELECT name, level, class
FROM players
ORDER BY class ASC, level DESC
```

Results are first sorted by `class`(sql) in ascending order, then by `level`(sql) in descending order within each class.

