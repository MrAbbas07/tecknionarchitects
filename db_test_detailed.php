<?php
// Turn on error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>MySQL Connection Test</h2>";

// Database connection parameters
$servername = "localhost";
$username = "root";
$password = ""; // Empty password for XAMPP

echo "<p>Attempting to connect to MySQL with:</p>";
echo "<ul>";
echo "<li>Server: $servername</li>";
echo "<li>Username: $username</li>";
echo "<li>Password: [hidden]</li>";
echo "</ul>";

// Try to connect
try {
    echo "<p>Connecting to MySQL server...</p>";
    $conn = new mysqli($servername, $username, $password);
    
    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    
    echo "<p style='color:green;font-weight:bold;'>Connected to MySQL successfully!</p>";
    
    // Get MySQL server info
    echo "<p>MySQL Server Info: " . $conn->server_info . "</p>";
    
    // Try to create the database
    $dbname = "tecknion_contacts";
    echo "<p>Attempting to create database '$dbname' if it doesn't exist...</p>";
    
    $sql = "CREATE DATABASE IF NOT EXISTS $dbname";
    if ($conn->query($sql) === TRUE) {
        echo "<p style='color:green;'>Database '$dbname' created or already exists.</p>";
        
        // Select the database
        echo "<p>Selecting database '$dbname'...</p>";
        $conn->select_db($dbname);
        
        // Create table
        echo "<p>Attempting to create 'contacts' table if it doesn't exist...</p>";
        $sql = "CREATE TABLE IF NOT EXISTS contacts (
            id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            phone VARCHAR(30),
            subject VARCHAR(255),
            message TEXT NOT NULL,
            date_submitted DATETIME NOT NULL
        )";
        
        if ($conn->query($sql) === TRUE) {
            echo "<p style='color:green;'>Table 'contacts' created or already exists.</p>";
            
            // Try inserting a test record
            echo "<p>Attempting to insert a test record...</p>";
            $sql = "INSERT INTO contacts (name, email, phone, subject, message, date_submitted) 
                    VALUES ('Test User', 'test@example.com', '1234567890', 'Test Subject', 'This is a test message', NOW())";
            
            if ($conn->query($sql) === TRUE) {
                echo "<p style='color:green;'>Test record inserted successfully.</p>";
                
                // Retrieve the test record
                echo "<p>Retrieving test records:</p>";
                $sql = "SELECT * FROM contacts ORDER BY id DESC LIMIT 5";
                $result = $conn->query($sql);
                
                if ($result->num_rows > 0) {
                    echo "<table border='1' cellpadding='5'>";
                    echo "<tr><th>ID</th><th>Name</th><th>Email</th><th>Subject</th><th>Date</th></tr>";
                    
                    while($row = $result->fetch_assoc()) {
                        echo "<tr>";
                        echo "<td>" . $row["id"] . "</td>";
                        echo "<td>" . $row["name"] . "</td>";
                        echo "<td>" . $row["email"] . "</td>";
                        echo "<td>" . $row["subject"] . "</td>";
                        echo "<td>" . $row["date_submitted"] . "</td>";
                        echo "</tr>";
                    }
                    
                    echo "</table>";
                } else {
                    echo "<p>No records found.</p>";
                }
            } else {
                echo "<p style='color:red;'>Error inserting test record: " . $conn->error . "</p>";
            }
        } else {
            echo "<p style='color:red;'>Error creating table: " . $conn->error . "</p>";
        }
    } else {
        echo "<p style='color:red;'>Error creating database: " . $conn->error . "</p>";
    }
    
    // Close connection
    $conn->close();
    echo "<p>Connection closed.</p>";
    
} catch (Exception $e) {
    echo "<p style='color:red;font-weight:bold;'>Error: " . $e->getMessage() . "</p>";
    
    echo "<h3>Troubleshooting Tips:</h3>";
    echo "<ol>";
    echo "<li>Make sure MySQL service is running in XAMPP Control Panel</li>";
    echo "<li>Check if the username and password are correct</li>";
    echo "<li>Try using phpMyAdmin to verify your credentials</li>";
    echo "<li>Check MySQL error log for more details</li>";
    echo "</ol>";
}

// Show PHP and MySQL information
echo "<h3>PHP Information:</h3>";
echo "<p>PHP Version: " . phpversion() . "</p>";
echo "<p>Loaded PHP Extensions: </p>";
echo "<ul>";
$extensions = get_loaded_extensions();
sort($extensions);
foreach ($extensions as $extension) {
    if ($extension == 'mysqli' || $extension == 'mysql' || $extension == 'pdo_mysql') {
        echo "<li style='color:green;font-weight:bold;'>$extension</li>";
    } else {
        echo "<li>$extension</li>";
    }
}
echo "</ul>";
?>