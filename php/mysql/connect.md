# Connecting to MySQL via PDO

To connect to a MySQL server using PDO, the following steps are required:

1. Create a **Database Source Name** string, including the database name
2. Create a new **PDO object** using this string and the database username / password

```php
$dsn = 'mysql:host=localhost;charset=utf8mb4;dbname=my_database';
$pdo = new PDO($dsn, 'jsmith', 'secret123');
```

However, it is good practice not not have your username / password written directly within your code. Ideally we should place these data values within an **initialisation (.ini) file** and read these in when needed...

```js
user='jsmith'
pass='secret123'
name='my_database'
```

The code can now read this file and use the values (in this case, the .ini file is called **_db.ini**)...

```php
$db = parse_ini_file( '_db.ini', true );
$dsn = 'mysql:host=localhost;charset=utf8mb4;dbname=' . $db['name'];
$pdo = new PDO($dsn, $db['user'], $db['pass'], $options);
```

There are some other options that should be set, and errors should be handled elegantly for the end-user. Wrapping all this up in a reusable, easy-to-use function...


## A Useful `connectToDB()` Function

This is a really useful function whihc you can include in all of your projects. It makes connecting to a server as simple as creating a **_db.ini** file and calling the function...

```php
function connectToDB() {
    // Parse the  config file
    $db = parse_ini_file( '_db.ini', true );
    // Generate a Databse Source Name string
    $dsn = 'mysql:host=localhost;charset=utf8mb4;dbname=' . $db['name'];
    // Set some useful options (errors as exception, associative arrays)
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];

    // Attempt to connect
    try {
        // Return the newly connected PDO object
        return new PDO($dsn, $db['user'], $db['pass'], $options);
    }
    catch (PDOException $e) {
        // Something went wrong, so inform user
        die('There was an error when connecting to the database');
    }
}
```

This function can then be called whenever you need to connect to the server...

```php
$db = connectToDB();
```




