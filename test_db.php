<?php
// Database connection parameters
$servername = "localhost";
$username = "root";
$password = "m.s.a.m.2394"; // Try with empty password for XAMPP

// Create connection
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "Connected to MySQL successfully!";

// Try to create the database
$dbname = "tecknion_contacts";
$sql = "CREATE DATABASE IF NOT EXISTS $dbname";

if ($conn->query($sql) === TRUE) {
    echo "<br>Database '$dbname' created or already exists.";
    
    // Select the database
    $conn->select_db($dbname);
    
    // Create table
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
        echo "<br>Table 'contacts' created or already exists.";
    } else {
        echo "<br>Error creating table: " . $conn->error;
    }
} else {
    echo "<br>Error creating database: " . $conn->error;
}

// Close connection
$conn->close();
?>