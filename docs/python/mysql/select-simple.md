# Simple SELECT Query

To query the database server, you need to do the following...

1. **Connect** to the MySQL server (e.g. using [connectToDB()](php/mysql/connect.md))
2. Prepare the query, using [prepared statements](php/mysql/prepared.md)
3. **Execute** the query on the server
4. **Fetch** any matching records (as an associative array)
5. Handle any **errors** (exceptions)
5. Do something with the data!


A simple SQL SELECT query might be something like...

```sql
SELECT forename, surname
  FROM people
```

This PHP code will run this query on the server...

```php
// Connect to the database
$db = connectToDB();

// Setup a query to get all company info
$query = 'SELECT forename, surname
            FROM people';

// Attempt to run the query
try {
    $stmt = $db->prepare($query);
    $stmt->execute();
    $people = $stmt->fetchAll();
}
catch (PDOException $e) {
    die('There was an error getting data from the database');
}

// Display the retrieved records
foreach($people as $person) {
    echo $person['forename'] . ' ' . $person['surname'];
}
```

