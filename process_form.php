<?php
// Database connection parameters
$servername = "localhost";
$username = "root"; // Default MySQL username
$password = "m.s.a.m.2394"; // MySQL password
$dbname = "tecknion_contacts"; // Database name

// Get form data from POST request
$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (!isset($data['name']) || !isset($data['email']) || !isset($data['message'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Sanitize input data
$name = filter_var($data['name'], FILTER_SANITIZE_STRING);
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$phone = isset($data['phone']) ? filter_var($data['phone'], FILTER_SANITIZE_STRING) : '';
$subject = isset($data['subject']) ? filter_var($data['subject'], FILTER_SANITIZE_STRING) : '';
$message = filter_var($data['message'], FILTER_SANITIZE_STRING);
$date_submitted = date('Y-m-d H:i:s');

// Create database connection
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// Create database if it doesn't exist
$sql = "CREATE DATABASE IF NOT EXISTS $dbname";
if (!$conn->query($sql)) {
    echo json_encode(['success' => false, 'message' => 'Error creating database']);
    exit;
}

// Select the database
$conn->select_db($dbname);

// Create table if it doesn't exist
$sql = "CREATE TABLE IF NOT EXISTS contacts (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    date_submitted DATETIME NOT NULL
)";

if (!$conn->query($sql)) {
    echo json_encode(['success' => false, 'message' => 'Error creating table']);
    exit;
}

// Insert data into database
$stmt = $conn->prepare("INSERT INTO contacts (name, email, phone, subject, message, date_submitted) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssss", $name, $email, $phone, $subject, $message, $date_submitted);

$dbSuccess = $stmt->execute();
$stmt->close();

// Send email
$to = "tecknion@gmail.com"; // Replace with your email
$email_subject = "New Contact Form Submission: $subject";

$email_body = "You have received a new message from the Tecknion website contact form.\n\n";
$email_body .= "Name: $name\n";
$email_body .= "Email: $email\n";
$email_body .= "Phone: $phone\n";
$email_body .= "Subject: $subject\n\n";
$email_body .= "Message:\n$message\n";

$headers = "From: $email\n";
$headers .= "Reply-To: $email\n";

$emailSuccess = mail($to, $email_subject, $email_body, $headers);

// Close database connection
$conn->close();

// Return response
if ($dbSuccess && $emailSuccess) {
    echo json_encode(['success' => true, 'message' => 'Form submitted successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error processing form submission']);
}
?>