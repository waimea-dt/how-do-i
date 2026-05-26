# Database Terminology

## Tables

Databases contain **tables** of data, arranged into rows and columns. For example, here is a table of student data...

| num   | forename | surname  | dob        | house |
| ----- | -------- | -------- | ---------- | ----- |
| 17034 | Dave     | McPickle | 2001-01-01 | Ru    |
| 17037 | Karen    | Cheeto   | 2005-06-02 | Co    |
| 17041 | Pierre   | Fromage  | 2003-12-24 | Ru    |


## Records

Each row of data in the table is known a **record** - data connected with one person / thing. For example, this is the record for Karen Cheeto, student number 17037...

| num       | forename | surname  | dob        | house |
| --------- | -------- | -------- | ---------- | ----- |
| 17034     | Dave     | McPickle | 2001-01-01 | Ru    |
| 17037 !!! | Karen    | Cheeto   | 2005-06-02 | Co    |
| 17041     | Pierre   | Fromage  | 2003-12-24 | Ru    |


## Fields

The columns in the table are known a **fields**, and each has a **fieldname** at the top. For example, this is the forename column / field...

| num   | forename !! | surname  | dob        | house |
| ----- | ----------- | -------- | ---------- | ----- |
| 17034 | Dave        | McPickle | 2001-01-01 | Ru    |
| 17037 | Karen       | Cheeto   | 2005-06-02 | Co    |
| 17041 | Pierre      | Fromage  | 2003-12-24 | Ru    |


## Data Type

Each field contains a particular type of data: forename is **TEXT**, num is **INTEGER**, etc. This is called the **data type** of the field.


## Primary Key Field

Every record in a table needs to have a value that **uniquely identifies** it. These field containing these values is called the **primary key** field. In the student table, the primary key is the student number - every student has a unique number...

| num !! | forename | surname  | dob        | house |
| ------ | -------- | -------- | ---------- | ----- |
| 17034  | Dave     | McPickle | 2001-01-01 | Ru    |
| 17037  | Karen    | Cheeto   | 2005-06-02 | Co    |
| 17041  | Pierre   | Fromage  | 2003-12-24 | Ru    |


## Foreign Keys

Sometimes values in one table **link** to records in another table. These values are known as **foreign keys** since they link to the primary key of an other table.

For example, here is a table of houses. The code is the primary key of the table...

<db-data>

| houses     |            |      |
| ---------- | ---------- | ---- |
| PK code !! | name       | dean |
| -------    | ---------- | ---- |
| Ca         | Carrington | KTY  |
| Co         | Cooper     | LGT  |
| Hi         | Hillary    | MRQ  |
| Ru         | Rutherford | SDW  |

</db-data>

When these codes are used in the students table, they are foreign keys, and link back to a record in this table...

<db-data>

| students |          |          |            |             |
| -------- | -------- | -------- | ---------- | ----------- |
| num      | forename | surname  | dob        | FK house !! |
| -----    | -------- | -------- | ---------- | ----------- |
| 17034    | Dave     | McPickle | 2001-01-01 | Ru          |
| 17037    | Karen    | Cheeto   | 2005-06-02 | Co          |
| 17041    | Pierre   | Fromage  | 2003-12-24 | Ru          |

</db-data>


## Schema

The schema of a database is the definition of the database structure - the fields, the data types, the primary key, etc. For example, here is the schema of the students table...

<db-schema>

| students |          |         |               |
| -------- | -------- | ------- | ------------- |
| PK       | num      | INTEGER | AUTOINCREMENT |
|          | forename | TEXT    | NOT NULL      |
|          | surname  | TEXT    | NOT NULL      |
|          | dob      | DATE    | NOT NULL      |
| FK       | house    | TEXT    | NOT NULL      |

</db-schema>

> [!NOTE]
> In this example, all fields are **required** so they are set to **NOT NULL**.


## Relationships

When a **foreign key** is one table **links** to another, this creates a **relationship**..

<db-schema>

| houses |      |      |                  |
| ------ | ---- | ---- | ---------------- |
| PK     | code | TEXT | NOT NULL, UNIQUE |
|        | name | TEXT | NOT NULL         |
|        | dean | TEXT | NOT NULL         |

| students |          |         |               |
| -------- | -------- | ------- | ------------- |
| PK       | num      | INTEGER | AUTOINCREMENT |
|          | forename | TEXT    | NOT NULL      |
|          | surname  | TEXT    | NOT NULL      |
|          | dob      | DATE    | NOT NULL      |
| FK       | house    | TEXT    | NOT NULL      |

</db-schema>

In this case, the relationship is a **one-to-many** relationship - one house has many students, and each student belongs to one house...

<db-relationship>

- houses
    - one-to-many
- students

</db-relationship>

