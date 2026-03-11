# Prepared Statements

Prepared statements are a way to avoid a common source of SQL server exploits (as in the server being hacked): [SQL injection](php/mysql/injection.md) attacks.

When users supply data (e.g. via a form), you have no control over what this data might contain. You need to be very cautious!

## Using Prepared Statements

### Don't Do This!

```php
// Get the data from the form
$name = $_POST['name'];
// Build the query
$query = 'SELECT * FROM users WHERE name = "' . $name . '"';
// Run the query on the server, getting back a PDO statement
$stmt = $db->query($query);
// Get the matching record
$user = $stmt->ftech();
```

!> Here, the user supplied data in `$name` has been **concatenated directly** into the query. This opens up the posibility of **SQL injection**.

### Do This Instead

```php
// Get the data from the form
$name = $_POST['name'];
// Define the query
$query = 'SELECT * FROM users WHERE name = ?';
// Prepare the query, geting back a PDO prepared statement
$stmt = $db->prepare($query);
// Use the prepared statement to run the query, passing in the data
$stmt->execute([$name]);
// Get the matching record
$user = $stmt->fetch();
```

Here, `?` markers have been placed in the SQL query where the data should go.

The actual data in `$name` is only passed in when the query is executed, and is done in such a way that any attempted SQL injection won't work.


## Working with Multiple Data Values

If several items of data need to be included in the query, simply add multiple `?` markers and supply all of the data values when executing the query...

```php
// Get the data from the form
$name = $_POST['name'];
$dob  = $_POST['dob'];
$city = $_POST['city'];

// Define the query
$query = 'INSERT INTO users (name, dob, city) VALUES (?, ?, ?)';
// Prepare the query, geting back a PDO prepared statement
$stmt = $db->prepare($query);
// Use the prepared statement to run the query, passing in the data
$stmt->execute([$name, $dob, $city]);
```

?> It is important that you supply the data values in the **correct order** to match the `?` markers

