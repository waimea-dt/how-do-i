# Tables

## Basic Table

Hover over any row to see it highlight:

| Name | Age | City | Occupation |
|------|-----|------|------------|
| Alice | 28 | London | Engineer |
| Bob | 34 | Paris | Designer |
| Carol | 42 | Berlin | Manager |
| David | 31 | Madrid | Developer |
| Eve | 29 | Rome | Analyst |


## Highlight Cols

Hover over any row to see it highlight. The City column is highlighted:

| Name  | Age | !! City | Occupation | Name  | Age | !! City | Occupation |
| ----- | --- | ------- | ---------- | ----- | --- | ------- | ---------- |
| Alice | 28  | London  | Engineer   | Alice | 28  | London  | Engineer   |
| Bob   | 34  | Paris   | Designer   | Bob   | 34  | Paris   | Designer   |
| Carol | 42  | Berlin  | Manager    | Carol | 42  | Berlin  | Manager    |
| David | 31  | Madrid  | Developer  | David | 31  | Madrid  | Developer  |
| Eve   | 29  | Rome    | Analyst    | Eve   | 29  | Rome    | Analyst    |


## Highlight Cells

Hover over any row to see it highlight:

| Name | Age | City | Occupation |
|------|-----|------|------------|
| Alice | !! 28 | London | Engineer |
| Bob | 34 | Paris | !! Designer |
| Carol | 42 | Berlin | Manager |
| !! David | 31 | Madrid | Developer |
| Eve | 29 | Rome | Analyst |


## Highlight Cells & Cols

Both column and individual cell highlighting:

| Name | Age | !! City | Occupation |
|------|-----|------|------------|
| !! Alice | 28 | London | Engineer |
| Bob | 34 | Paris | Designer |
| Carol | 42 | !! Berlin | Manager |
| David | 31 | Madrid | !! Developer |
| Eve | 29 | Rome | Analyst |


## Highlight Rows

Row highlighting with !!! in first cell:

| Name | Age | City | Occupation |
|------|-----|------|------------|
| Alice | 28 | London | Engineer |
| !!! Bob | 34 | !! Paris | Designer |
| Carol | 42 | Berlin | Manager |
| !!! David | 31 | Madrid | Developer |
| Eve | 29 | Rome | Analyst |


## All Together

Columns, cells, and rows all highlighted:

| Name | !! Age | City | Occupation |
|------|-----|------|------------|
| Alice | 28 | London | Engineer |
| !!! Bob | 34 | Paris | Designer |
| Carol | 42 | Berlin | Manager |
| David | 31 | Madrid | Developer |
| Eve | 29 | Rome | !! Analyst |
