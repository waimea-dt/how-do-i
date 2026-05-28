# What is Structured Query Language (SQL)?

SQL is the language used to work with data in relational databases. A database is usually a set of linked tables. SQL lets you:

- Create/add data
- Read/find data
- Update data
- Delete data

## SQL History

During the 1970s, as computer databases got bigger, people needed one standard way to ask questions like:

- "Show all Year 11 students"
- "Find orders over £50"
- "Count how many users signed up this week"

SQL was created so these requests could be written clearly and run efficiently, no matter how much data exists.

## Ease of Use

SQL is intended to be easy to use. It reads a bit like English:

- `SELECT` means choose data
- `FROM` means which table
- `WHERE` means condition/filter

Once you learn a few core keywords, you can do a lot very quickly.

## Quick Example

```sql
SELECT name, email
FROM users
WHERE year_group = 11
ORDER BY name;
```

This means: "Get each user's name and email from the `users` table, but only where the year group is 11, then sort alphabetically by name."

SQL is used everywhere: apps, websites, games, online shops, and school systems.


## SQLite

SQLite is a lightweight database engine that uses standard SQL.

![SQLite logo](_assets/sqlite-logo.svg)

Unlike bigger database systems, SQLite stores everything in **one file** (for example, `school.db`) and does not need a separate database server running. That makes it great for small projects, mobile and desktop apps, and prototypes and testing. You still write normal SQL queries, for example:

```sql
SELECT title, author
FROM books
WHERE in_stock = 1;
```

So SQLite is a quick way to use SQL without lots of setup.



