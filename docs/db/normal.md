# Database Normalisation

Database normalisation is the process of organising database tables so that there is **no unnecessary repetition of data**, and everything is in appropriate tables.

> [!TIP]
> There are formal rules to follow for this, but for simple datasets, common-sense will be enough!

## Un-Normalised Table

This table of data is not normalised...

<db-data>

| students |          |           |            |       |            |            |
| -------- | -------- | --------- | ---------- | ----- | ---------- | ---------- |
| PK num   | forename | surname   | dob        | house | house_name | house_dean |
| -----    | -------- | --------  | ---------- | ----- | -----      | ---------- |
| 17034    | Dave     | McPickle  | 2001-01-01 | Ru    | Rutherford | SDW        |
| 17037    | Karen    | Cheeto    | 2005-06-02 | Co    | Cooper     | LGT        |
| 17041    | Pierre   | Fromage   | 2003-12-24 | Ru    | Rutherford | SDW        |
| 17067    | Nigel    | Pullet    | 2004-01-07 | Ca    | Carrington | KTY        |
| 17078    | Helen    | Clark     | 2003-07-15 | Hi    | Hillary    | MRQ        |
| 17079    | Geoff    | Trousers  | 2005-06-18 | Ca    | Carrington | KTY        |
| 17088    | Jenny    | Gingernut | 2002-12-23 | Ru    | Rutherford | SDW        |
| 17092    | Tui      | Davies    | 2005-09-14 | Ng    | Ngata      | CFQ        |

</db-data>

You can see that the house information is **repeated over and over again**...

<db-data>

| students |          |           |            |       |               |            |
| -------- | -------- | --------- | ---------- | ----- | ------------- | ---------- |
| PK num   | forename | surname   | dob        | house | house_name    | house_dean |
| -----    | -------- | --------  | ---------- | ----- | -----         | ---------- |
| 17034    | Dave     | McPickle  | 2001-01-01 | Ru !! | Rutherford !! | SDW !!     |
| 17037    | Karen    | Cheeto    | 2005-06-02 | Co    | Cooper        | LGT        |
| 17041    | Pierre   | Fromage   | 2003-12-24 | Ru !! | Rutherford !! | SDW !!     |
| 17067    | Nigel    | Pullet    | 2004-01-07 | Ca    | Carrington    | KTY        |
| 17078    | Helen    | Clark     | 2003-07-15 | Hi    | Hillary       | MRQ        |
| 17079    | Geoff    | Trousers  | 2005-06-18 | Ca    | Carrington    | KTY        |
| 17088    | Jenny    | Gingernut | 2002-12-23 | Ru !! | Rutherford !! | SDW  !!    |
| 17092    | Tui      | Davies    | 2005-09-14 | Ng    | Ngata         | CFQ        |

</db-data>

This can make things difficult to manage:
- The **database is bigger** than it needs to be - requires extra storage needed and means transferring the data is slow
- **Updating values is a problem** - e.g. if the dean for Rutherford house changes, lots of repeated values need to be changed which can be time-consuming and mistakes can occur

What we want is for the house information to be stored **once, and only once**: no wasted space, and easy to update.


## Normalised Tables

If we extract all of the **data that relates to houses** into its **own table**, we get these two tables...

<db-data>

| students |          |           |            |           |
| -------- | -------- | --------- | ---------- | --------- |
| PK num   | forename | surname   | dob        | house !!! |
| -----    | -------- | --------  | ---------- | -----     |
| 17034    | Dave     | McPickle  | 2001-01-01 | Ru        |
| 17037    | Karen    | Cheeto    | 2005-06-02 | Co        |
| 17041    | Pierre   | Fromage   | 2003-12-24 | Ru        |
| 17067    | Nigel    | Pullet    | 2004-01-07 | Ca        |
| 17078    | Helen    | Clark     | 2003-07-15 | Hi        |
| 17079    | Geoff    | Trousers  | 2005-06-18 | Ca        |
| 17088    | Jenny    | Gingernut | 2002-12-23 | Ru        |
| 17092    | Tui      | Davies    | 2005-09-14 | Ng        |


| houses !!! |            |      |
| ---------- | ---------- | ---- |
| PK code    | name       | dean |
| -----      | -----      | ---- |
| Ca         | Carrington | KTY  |
| Co         | Cooper     | LGT  |
| Hi         | Hillary    | MRQ  |
| Ng         | Ngata      | CFQ  |
| Ru         | Rutherford | SDW  |
| Sh         | Sheppard   | HJE  |

</db-data>

> [!IMPORTANT]
> We have to leave behind the house code in the students table so we still know which house students are in - this is an example of a **foreign key** (see below)

Now, **every item of data is only stored once** - it takes up minimal room, and is easy to update.


## Foreign Keys and Table Relationships

To find out who a student's dean is we use the house code to **link** to the houses table, where the information can be found...


<db-data>

| students |          |           |            |       |
| -------- | -------- | --------- | ---------- | ----- |
| PK num   | forename | surname   | dob        | house |
| -----    | -------- | --------  | ---------- | ----- |
| 17034    | Dave     | McPickle  | 2001-01-01 | Ru !! |
| 17037    | Karen    | Cheeto    | 2005-06-02 | Co    |
| 17041    | Pierre   | Fromage   | 2003-12-24 | Ru !! |
| 17067    | Nigel    | Pullet    | 2004-01-07 | Ca    |
| 17078    | Helen    | Clark     | 2003-07-15 | Hi    |
| 17079    | Geoff    | Trousers  | 2005-06-18 | Ca    |
| 17088    | Jenny    | Gingernut | 2002-12-23 | Ru !! |
| 17092    | Tui      | Davies    | 2005-09-14 | Ng    |


| houses  |            |      |
| ------- | ---------- | ---- |
| PK code | name       | dean |
| -----   | -----      | ---- |
| Ca      | Carrington | KTY  |
| Co      | Cooper     | LGT  |
| Hi      | Hillary    | MRQ  |
| Ng      | Ngata      | CFQ  |
| Ru !!!  | Rutherford | SDW  |
| Sh      | Sheppard   | HJE  |

</db-data>

This connection from one table to another is called a **relationship**, and the house code in the student table that links to the houses table is called a **foreign key**...

<db-data>

| students |          |           |            |              |
| -------- | -------- | --------- | ---------- | ------------ |
| PK num   | forename | surname   | dob        | FK house !!! |
| -----    | -------- | --------  | ---------- | -----        |
| 17034    | Dave     | McPickle  | 2001-01-01 | Ru           |
| 17037    | Karen    | Cheeto    | 2005-06-02 | Co           |
| 17041    | Pierre   | Fromage   | 2003-12-24 | Ru           |
| 17067    | Nigel    | Pullet    | 2004-01-07 | Ca           |
| 17078    | Helen    | Clark     | 2003-07-15 | Hi           |
| 17079    | Geoff    | Trousers  | 2005-06-18 | Ca           |
| 17088    | Jenny    | Gingernut | 2002-12-23 | Ru           |
| 17092    | Tui      | Davies    | 2005-09-14 | Ng           |


| houses      |            |      |
| ----------- | ---------- | ---- |
| PK code !!! | name       | dean |
| -----       | -----      | ---- |
| Ca          | Carrington | KTY  |
| Co          | Cooper     | LGT  |
| Hi          | Hillary    | MRQ  |
| Ru          | Rutherford | SDW  |

</db-data>

This is now the schema (structure) of a our database...

<db-schema>

| students |          |         |
| -------- | -------- | ------- |
| PK       | num      | INTEGER |
|          | forename | TEXT    |
|          | surname  | TEXT    |
|          | dob      | DATE    |
| FK !!!   | house    | TEXT    |

| houses |      |      |
| ------ | ---- | ---- |
| PK !!! | code | TEXT |
|        | name | TEXT |
|        | dean | TEXT |

</db-schema>

In this case, the relationship is a **one-to-many** relationship - one house has many students, and each student belongs to one house...

<db-relationship>

- students
    - many-to-one !!
- houses

</db-relationship>

