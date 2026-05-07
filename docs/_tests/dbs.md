# DB Schema Table Demos

## Single Table

### Simple

<db-schema>

| users |       |         |
| ----- | ----- | ------- |
| PK    | id    | INTEGER |
|       | name | TEXT    |
|       | dob   | DATE    |
|       | email | TEXT    |

</db-schema>


### With Details

<db-schema>

| users |       |         |               |
| ----- | ----- | ------- | ------------- |
| PK    | id    | INTEGER | AUTOINCREMENT |
|       | name  | TEXT    | NOT NULL      |
|       | dob   | DATE    | NOT NULL      |
|       | email | TEXT    |               |

</db-schema>


## Two Tables

<db-schema>

| departments |          |      |
| ----------- | -------- | ---- |
| PK          | code     | TEXT |
|             | name     | TEXT |
|             | manager  | TEXT |


| employees |       |         |
| --------- | ----- | ------- |
| PK        | id    | INTEGER |
|           | name  | TEXT    |
|           | dept  | TEXT    |
|           | notes | TEXT    |

</db-schema>


<db-schema>

| departments |          |      |
| ----------- | -------- | ---- |
| PK          | code     | TEXT |
|             | name     | TEXT |
|             | manager  | TEXT |


| employees |       |         |
| --------- | ----- | ------- |
| PK        | id    | INTEGER |
|           | name  | TEXT    |
| FK        | dept  | TEXT    |
|           | notes | TEXT    |

</db-schema>


## Two Tables Reversed

<db-schema>

| employees |       |         |
| --------- | ----- | ------- |
| PK        | id    | INTEGER |
|           | name  | TEXT    |
| FK        | dept  | TEXT    |
|           | notes | TEXT    |


| departments |          |      |
| ----------- | -------- | ---- |
| PK          | code     | TEXT |
|             | name     | TEXT |
|             | manager  | TEXT |

</db-schema>


## Three Tables

<db-schema>

| orders |       |         |
| ------ | ----- | ------- |
| PK     | id    | INTEGER |
|        | date  | DATE    |
|        | name  | TEXT    |
|        | email | TEXT    |

| contains |          |         |
| -------- | -------- | ------- |
| FK PK    | order_id | INTEGER |
| FK PK    | prod_id  | INTEGER |
|          | quantity | INTEGER |

| products |             |         |
| -------- | ----------- | ------- |
| PK       | id          | INTEGER |
|          | name        | TEXT    |
|          | price       | REAL    |
|          | description | TEXT    |

</db-schema>


## Four Tables

<db-schema>

| customers |         |         |
| --------- | ------- | ------- |
| PK        | id      | INTEGER |
|           | name    | TEXT    |
|           | email   | TEXT    |
|           | address | TEXT    |

| orders |           |         |
| ------ | --------- | ------- |
| PK     | id        | INTEGER |
|        | date      | DATE    |
| FK     | cust_id   | INTEGER |
|        | completed | BOOLEAN |

| contains |          |         |
| -------- | -------- | ------- |
| FK PK    | order_id | INTEGER |
| FK PK    | prod_id  | INTEGER |
|          | quantity | INTEGER |

| products |             |         |
| -------- | ----------- | ------- |
| PK       | id          | INTEGER |
|          | name        | TEXT    |
|          | price       | REAL    |
|          | description | TEXT    |

</db-schema>


## Four Tables, No Types

<db-schema>

| customers |         |
| --------- | ------- |
| PK        | id      |
|           | name    |
|           | email   |
|           | address |

| orders |           |
| ------ | --------- |
| PK     | id        |
|        | date      |
| FK     | cust_id   |
|        | completed |

| contains |          |
| -------- | -------- |
| FK PK    | order_id |
| FK PK    | prod_id  |
|          | quantity |

| products |             |
| -------- | ----------- |
| PK       | id          |
|          | name        |
|          | price       |
|          | description |

</db-schema>


## Four Tables, Seq Adjusted

<db-schema>

| customers |         |
| --------- | ------- |
| PK        | id      |
|           | name    |
|           | email   |
|           | address |

| orders |           |
| ------ | --------- |
| PK     | id        |
|        | date      |
| FK     | cust_id   |
|        | completed |

| contains ++ |          |
| -------- | -------- |
| FK PK    | order_id |
| FK PK    | prod_id  |
|          | quantity |

| products -- |             |
| -------- | ----------- |
| PK       | id          |
|          | name        |
|          | price       |
|          | description |

</db-schema>


## Highlight

### Whole table

<db-schema>

| customers !! |         |         |
| ------------ | ------- | ------- |
| PK           | id      | INTEGER |
|              | name    | TEXT    |
|              | email   | TEXT    |
|              | address | TEXT    |

| orders |           |         |
| ------ | --------- | ------- |
| PK     | id        | INTEGER |
|        | date      | DATE    |
| FK     | cust_id   | INTEGER |
|        | completed | BOOLEAN |

</db-schema>


<db-schema>

| customers |         |         |
| --------- | ------- | ------- |
| PK        | id      | INTEGER |
|           | name    | TEXT    |
|           | email   | TEXT    |
|           | address | TEXT    |

| orders !! |           |         |
| --------- | --------- | ------- |
| PK        | id        | INTEGER |
|           | date      | DATE    |
| FK        | cust_id   | INTEGER |
|           | completed | BOOLEAN |

</db-schema>


### Rows

<db-schema>

| users |       |         |
| ----- | ----- | ------- |
| PK    | id    | INTEGER |
|    !!   | name | TEXT    |
|       | dob   | DATE    |
|       | email | TEXT    |

</db-schema>

<db-schema>

| users |       |         |
| ----- | ----- | ------- |
| PK !!   | id    | INTEGER |
|       | name | TEXT    |
|       | dob   | DATE    |
|       | email | TEXT    |

</db-schema>


<db-schema>

| users |       |         |
| ----- | ----- | ------- |
| PK    | id    | INTEGER |
|       | name | TEXT    |
|       | dob   | DATE    |
|  !!     | email | TEXT    |

</db-schema>


<db-schema>

| customers |         |         |
| --------- | ------- | ------- |
| PK  !!    | id      | INTEGER |
|           | name    | TEXT    |
|           | email   | TEXT    |
|           | address | TEXT    |

| orders |           |         |
| ------ | --------- | ------- |
| PK     | id        | INTEGER |
|        | date      | DATE    |
| FK !!  | cust_id   | INTEGER |
|        | completed | BOOLEAN |

</db-schema>



## Data Table

<db-data>

| employees |        |            |                   |
| --------- | ------ | ---------- | ----------------- |
| PK id     | name   | dob        | email             |
| --------- | ------ | ---------- | ----------------- |
| 1         | Dave   | 2000-01-01 | dave@chips.net    |
| 2         | Karen  | 1986-06-02 | karen@angry.nz    |
| 3         | Pierre | 1998-12-24 | pierre@berets.org |

</db-data>


## Data Tables

<db-data>

| employees |        |         |                   |
| --------- | ------ | ------- | ----------------- |
| PK id     | name   | FK dept | notes             |
| --------- | ------ | ------- | ----------------- |
| 1         | Dave   | ENG     | Great at Python   |
| 2         | Karen  | MRK     |                   |
| 3         | Pierre | ENG     | DB architect      |
| 4         | Nigel  | ADM     |                   |
| 5         | Sheila | MRK     |                   |

| departments |                |            |
| ----------- | -------------- | ---------- |
| PK code     | name           | manager    |
| ----------- | -------------- | ---------- |
| ADM         | Administration | Tim Smith  |
| ENG         | Engineering    | Lucy Pivot |
| MRK         | Marketing      | Mandy Hero |

</db-data>


## Highlighting

### Whole Table

<db-data>

| employees |        |         |                   |
| --------- | ------ | ------- | ----------------- |
| PK id     | name   | FK dept | notes             |
| --------- | ------ | ------- | ----------------- |
| 1         | Dave   | ENG     | Great at Python   |
| 2         | Karen  | MRK     |                   |
| 3         | Pierre | ENG     | DB architect      |
| 4         | Nigel  | ADM     |                   |
| 5         | Sheila | MRK     |                   |

| departments !! |                |            |
| -------------- | -------------- | ---------- |
| PK code        | name           | manager    |
| -----------    | -------------- | ---------- |
| ADM            | Administration | Tim Smith  |
| ENG            | Engineering    | Lucy Pivot |
| MRK            | Marketing      | Mandy Hero |

</db-data>


### Record

<db-data>

| employees |        |         |                   |
| --------- | ------ | ------- | ----------------- |
| PK id     | name   | FK dept | notes             |
| --------- | ------ | ------- | ----------------- |
| 1         | Dave   | ENG     | Great at Python   |
| 2         | Karen  | MRK     |                   |
| 3 !!      | Pierre | ENG     | DB architect      |
| 4         | Nigel  | ADM     |                   |
| 5         | Sheila | MRK     |                   |

</db-data>


### Field

<db-data>

| employees |         |         |                 |
| --------- | ------- | ------- | --------------- |
| PK id     | name !! | FK dept | notes           |
| --------- | ------  | ------- | --------------- |
| 1         | Dave    | ENG     | Great at Python |
| 2         | Karen   | MRK     |                 |
| 3         | Pierre  | ENG     | DB architect    |
| 4         | Nigel   | ADM     |                 |
| 5         | Sheila  | MRK     |                 |

</db-data>


<db-data>

| employees |        |            |                 |
| --------- | ------ | ---------- | --------------- |
| PK id     | name   | FK dept !! | notes           |
| --------- | ------ | -------    | --------------- |
| 1         | Dave   | ENG        | Great at Python |
| 2         | Karen  | MRK        |                 |
| 3         | Pierre | ENG        | DB architect    |
| 4         | Nigel  | ADM        |                 |
| 5         | Sheila | MRK        |                 |

</db-data>


### Both

<db-data>

| employees |         |         |                 |
| --------- | ------- | ------- | --------------- |
| PK id     | name !! | FK dept | notes           |
| --------- | ------  | ------- | --------------- |
| 1         | Dave    | ENG     | Great at Python |
| 2         | Karen   | MRK     |                 |
| 3 !!      | Pierre  | ENG     | DB architect    |
| 4         | Nigel   | ADM     |                 |
| 5         | Sheila  | MRK     |                 |

</db-data>


## More Complex

<db-data>

| customers |        |            |                |
| --------- | ------ | ---------- | -------------- |
| PK id     | name   | email      | address        |
| --------- | ------ | ---------- | -------------- |
| 1         | Dave   | dave@...   | 23 High Street |
| 2         | Karen  | kaz@...    | 14A Beat St    |
| 3         | Pierre | pierre@... | 25 La Rue      |
| 4         | Nigel  | beast@...  | 1 The Avenue   |
| 5         | Sheila | lady@...   | 15 Bellevue    |

| orders |            |         |           |
| ------ | ---------- | ------- | --------- |
| PK id  | date       | FK cust_id | completed |
| ------ | ---------- | ------- | --------- |
| 1      | 2025-01-01 | 3       | true      |
| 2      | 2025-02-12 | 1       | true      |
| 3      | 2025-05-10 | 5       | false     |
| 4      | 2025-05-30 | 1       | true      |
| 5      | 2025-06-01 | 2       | false     |

| contains    |            |     |
| ----------- | ---------- | :-: |
| FK order_id | FK prod_id | qty |
| 1           | 223        |  3  |
| 1           | 369        |  1  |
| 2           | 369        |  7  |
| 2           | 333        |  3  |
| 3           | 101        |  6  |
| 3           | 501        |  1  |
| 3           | 402        |  5  |
| 4           | 101        |  1  |
| 5           | 333        |  2  |

| products |          |       |             |
| -------- | -------- | ----: | ----------- |
| PK id    | name     | price | description |
| -------- | -------- | ----- | ----------- |
| 101      | Cat      |    10 | Mangy       |
| 223      | Hat      |    20 | Tall        |
| 333      | Goat     |    50 | Stinks      |
| 369      | Trousers |    45 | Short       |
| 402      | Cheese   |    12 | Delicious   |
| 501      | Pickles  |     8 | Lumpy       |

</db-data>


## More Complex, Sequence Adjusted

<db-data>

| customers |        |            |                |
| --------- | ------ | ---------- | -------------- |
| PK id     | name   | email      | address        |
| --------- | ------ | ---------- | -------------- |
| 1         | Dave   | dave@...   | 23 High Street |
| 2         | Karen  | kaz@...    | 14A Beat St    |
| 3         | Pierre | pierre@... | 25 La Rue      |
| 4         | Nigel  | beast@...  | 1 The Avenue   |
| 5         | Sheila | lady@...   | 15 Bellevue    |

| orders |            |            |           |
| ------ | ---------- | ---------- | --------- |
| PK id  | date       | FK cust_id | completed |
| ------ | ---------- | -------    | --------- |
| 1      | 2025-01-01 | 3          | true      |
| 2      | 2025-02-12 | 1          | true      |
| 3      | 2025-05-10 | 5          | false     |
| 4      | 2025-05-30 | 1          | true      |
| 5      | 2025-06-01 | 2          | false     |

| contains ++ |            |     |
| ----------- | ---------- | :-: |
| FK order_id | FK prod_id | qty |
| 1           | 223        |  3  |
| 1           | 369        |  1  |
| 2           | 369        |  7  |
| 2           | 333        |  3  |
| 3           | 101        |  6  |
| 3           | 501        |  1  |
| 3           | 402        |  5  |
| 4           | 101        |  1  |
| 5           | 333        |  2  |

| products -- |          |       |             |
| ----------- | -------- | ----: | ----------- |
| PK id       | name     | price | description |
| --------    | -------- | ----- | ----------- |
| 101         | Cat      |    10 | Mangy       |
| 223         | Hat      |    20 | Tall        |
| 333         | Goat     |    50 | Stinks      |
| 369         | Trousers |    45 | Short       |
| 402         | Cheese   |    12 | Delicious   |
| 501         | Pickles  |     8 | Lumpy       |

</db-data>


## Relationships

<db-relationship>

- customers
    - one-to-many
- orders
    - many-to-many
- products


</db-relationship>


### With Highlights

<db-relationship>

- customers !!
    - one-to-many
- orders
    - many-to-many
- products

</db-relationship>


<db-relationship>

- customers
    - one-to-many
- orders
    - many-to-many !!
- products

</db-relationship>


<db-relationship>

- customers
    - 1:m
- orders
    - 1:m !!
- contains !!
    - m:1 !!
- products

</db-relationship>


### With Seq Adjustments

<db-relationship>

- customers !!
    - one-to-many
- orders --
    - many-to-many
- products --

</db-relationship>


<db-relationship>

- customers ++
    - one-to-many
- orders ++
    - many-to-many
- products !!

</db-relationship>


<db-relationship>

- customers
    - one-to-many
- orders
    - many-to-many
- products

</db-relationship>


<db-relationship>

- customers
    - 1:m
- orders
    - 1:m
- contains ++
    - m:1
- products --

</db-relationship>


## Combined


Here...

<db-relationship>

- customers
    - one-to-many
- orders
    - many-to-many
- products

</db-relationship>


Problem...

<db-relationship>

- customers
    - one-to-many
- orders
    - many-to-many !!
- products

</db-relationship>


Fix...

<db-relationship>

- customers
    - 1:m
- orders
    - 1:m !!
- contains ++ !!
    - m:1 !!
- products --

</db-relationship>


Giving...

<db-relationship>

- customers
    - 1:m
- orders
    - 1:m
- contains ++
    - m:1
- products --

</db-relationship>

Schema...

<db-schema>

| customers |         |
| --------- | ------- |
| PK        | id      |
|           | name    |
|           | email   |
|           | address |

| orders |           |
| ------ | --------- |
| PK     | id        |
|        | date      |
| FK     | cust_id   |
|        | completed |

| contains ++ |          |
| -------- | -------- |
| FK PK    | order_id |
| FK PK    | prod_id  |
|          | quantity |

| products -- |             |
| -------- | ----------- |
| PK       | id          |
|          | name        |
|          | price       |
|          | description |

</db-schema>


Example Data...

<db-data>

| customers |        |            |                |
| --------- | ------ | ---------- | -------------- |
| PK id     | name   | email      | address        |
| --------- | ------ | ---------- | -------------- |
| 1         | Dave   | dave@...   | 23 High Street |
| 2         | Karen  | kaz@...    | 14A Beat St    |
| 3         | Pierre | pierre@... | 25 La Rue      |
| 4         | Nigel  | beast@...  | 1 The Avenue   |
| 5         | Sheila | lady@...   | 15 Bellevue    |

| orders |            |         |           |
| ------ | ---------- | ------- | --------- |
| PK id  | date       | FK cust_id | completed |
| ------ | ---------- | ------- | --------- |
| 1      | 2025-01-01 | 3       | true      |
| 2      | 2025-02-12 | 1       | true      |
| 3      | 2025-05-10 | 5       | false     |
| 4      | 2025-05-30 | 1       | true      |
| 5      | 2025-06-01 | 2       | false     |

| contains ++ |            |     |
| ----------- | ---------- | :-: |
| FK order_id | FK prod_id | qty |
| 1           | 223        |  3  |
| 1           | 369        |  1  |
| 2           | 369        |  7  |
| 2           | 333        |  3  |
| 3           | 101        |  6  |
| 3           | 501        |  1  |
| 3           | 402        |  5  |
| 4           | 101        |  1  |
| 5           | 333        |  2  |

| products -- |          |       |             |
| ----------- | -------- | ----: | ----------- |
| PK id       | name     | price | description |
| --------    | -------- | ----- | ----------- |
| 101         | Cat      |    10 | Mangy       |
| 223         | Hat      |    20 | Tall        |
| 333  !!       | Goat     |    50 | Stinks      |
| 369         | Trousers |    45 | Short       |
| 402  !!       | Cheese   |    12 | Delicious   |
| 501         | Pickles  |     8 | Lumpy       |

</db-data>

