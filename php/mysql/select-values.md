# SELECT Queries Using Supplied Data Values

When data is supplied that needs to be part of the SELECT query, the PHP code looks a little different to a [simple SELECT query](php/mysql/connect.md).

In this case, you need to do the following...

1. Connect to the MySQL server (e.g. using [connectToDB()](php/mysql/prepared.md))
2. Prepare the query, using [prepared statements](php/mysql/prepared.md)
3. Execute the query on the server, **passing in the data values**
4. Fetch any matching records (as an associative array)
5. Handle any errors (exceptions)
5. Do something with the data!


## Example 1 - Finding a Specific User

In this example we want to find a specific user record, so we need to pass in the required user ID.

The SQL we need would be:

```sql
SELECT forename, surname
  FROM people
 WHERE id = userID
```

This PHP code will run this query on the server...

```php
// Get the required user ID from the URL
$id = $_GET['id'];

// Connect to the database
$db = connectToDB();

// Setup a query to get all company info
$query = 'SELECT forename, surname
            FROM people
           WHERE id = ?';

// Attempt to run the query
try {
    $stmt = $db->prepare($query);
    $stmt->execute([$id]);         // Pass in the data value
    $person = $stmt->fetch();
}
catch (PDOException $e) {
    die('There was an error getting data from the database');
}

// Display the retrieved record
echo $person['forename'] . ' ' . $person['surname'];
```

?> Note that we don't need a loop here to go through a set of records - There should only be a single matching record


## Example 2 - Finding a Group of Users

In this example we want to find a all users who work at a given company and who live in a given city...

The SQL we need would be:

```sql
SELECT forename, surname
  FROM people
 WHERE company = companyID
   AND city    = cityName
```

This PHP code will run this query on the server...

```php
// Get the required data from the URL
$companyID = $_GET['company'];
$city = $_GET['city'];

// Connect to the database
$db = connectToDB();

// Setup a query to get all company info
$query = 'SELECT forename, surname
            FROM people
           WHERE company = ?
             AND city    = ?';

// Attempt to run the query
try {
    $stmt = $db->prepare($query);
    $stmt->execute([$companyID, $city]); // Pass in both data values
    $people = $stmt->fetch();
}
catch (PDOException $e) {
    die('There was an error getting data from the database');
}

// Display the retrieved records
foreach($people as $person) {
    echo $person['forename'] . ' ' . $person['surname'];
}
```


## Example 3 - Searching Users' Names

In this example we want to find any users whose names match a given search string.

The SQL we need would be:

```sql
SELECT forename, surname
  FROM people
 WHERE forename LIKE %search%
    OR surname  LIKE %search%
```

This PHP code will run this query on the server...

```php
// Get the search term from the URL, set to blank if missing
$search = $_GET['search'] ?? '';
// Add in wildcards
$search = '%' . $search . '%';

// Connect to the database
$db = connectToDB();

// Setup a query to get all company info
$query = 'SELECT forename, surname
            FROM people
           WHERE forename LIKE ?
              OR surname  LIKE ?';

// Attempt to run the query
try {
    $stmt = $db->prepare($query);
    $stmt->execute([$search, $search]);  // Pass in search term twice
    $people = $stmt->fetch();
}
catch (PDOException $e) {
    die('There was an error getting data from the database');
}

// Display the retrieved records
foreach($people as $person) {
    echo $person['forename'] . ' ' . $person['surname'];
}
```

?> Note that the search term, `$search`, is passed in twice to be used for both of the `?` markers, once for the forename, and once for the surname

