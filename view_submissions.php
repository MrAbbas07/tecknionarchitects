<?php
// Database connection parameters for XAMPP
$servername = "localhost";
$username = "root";
$password = "m.s.a.m.2394";
$dbname = "tecknion_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if database exists
$result = $conn->query("SHOW DATABASES LIKE '$dbname'");
if ($result->num_rows == 0) {
    die("Database does not exist yet. No form submissions have been received.");
}

// Select database
$conn->select_db($dbname);

// Check if table exists
$result = $conn->query("SHOW TABLES LIKE 'contacts'");
if ($result->num_rows == 0) {
    die("Contacts table does not exist yet. No form submissions have been received.");
}

// Get submissions
$sql = "SELECT * FROM contacts ORDER BY date_submitted DESC";
$result = $conn->query($sql);

// Password protection (simple)
$password = "tecknion2025"; // Change this to your desired password
$authenticated = false;

if (isset($_POST['password']) && $_POST['password'] === $password) {
    $authenticated = true;
} elseif (isset($_POST['password']) && $_POST['password'] !== $password) {
    $error = "Incorrect password";
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tecknion - Form Submissions</title>
    <link rel="stylesheet" href="home.css">
    <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body {
            font-family: 'EB Garamond', serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 50px auto;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        h1 {
            color: #2c3e50;
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #eee;
            padding-bottom: 15px;
        }
        
        .login-form {
            max-width: 400px;
            margin: 100px auto;
            padding: 30px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        .login-form h2 {
            margin-bottom: 20px;
            color: #2c3e50;
        }
        
        .login-form input[type="password"] {
            width: 100%;
            padding: 12px;
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
            box-sizing: border-box;
        }
        
        .login-form button {
            width: 100%;
            padding: 12px;
            background: #2c3e50;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            margin-top: 10px;
        }
        
        .login-form button:hover {
            background: #34495e;
        }
        
        .error {
            color: #e74c3c;
            margin: 10px 0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        
        th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        
        th {
            background-color: #2c3e50;
            color: white;
            font-weight: 500;
        }
        
        tr:hover {
            background-color: #f9f9f9;
        }
        
        .message-cell {
            max-width: 300px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .view-message {
            color: #3498db;
            cursor: pointer;
            text-decoration: underline;
        }
        
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
        }
        
        .modal-content {
            background-color: white;
            margin: 10% auto;
            padding: 20px;
            width: 70%;
            max-width: 700px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        
        .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }
        
        .close:hover {
            color: black;
        }
        
        .modal-message {
            margin-top: 20px;
            line-height: 1.6;
            white-space: pre-wrap;
        }
        
        .no-data {
            text-align: center;
            padding: 30px;
            color: #7f8c8d;
            font-style: italic;
        }
        
        .back-link {
            display: inline-block;
            margin-top: 20px;
            color: #2c3e50;
            text-decoration: none;
        }
        
        .back-link:hover {
            text-decoration: underline;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 15px;
                margin: 20px;
            }
            
            th, td {
                padding: 8px 10px;
                font-size: 14px;
            }
            
            .message-cell {
                max-width: 150px;
            }
            
            .modal-content {
                width: 90%;
                margin: 20% auto;
            }
        }
    </style>
</head>
<body>
    <?php if (!$authenticated): ?>
    <div class="login-form">
        <h2>Admin Login</h2>
        <form method="post">
            <?php if (isset($error)): ?>
                <div class="error"><?php echo $error; ?></div>
            <?php endif; ?>
            <input type="password" name="password" placeholder="Enter password" required>
            <button type="submit">Login</button>
        </form>
        <a href="home.html" class="back-link"><i class="fas fa-arrow-left"></i> Back to Website</a>
    </div>
    <?php else: ?>
    <div class="container">
        <h1>Form Submissions</h1>
        
        <?php if ($result->num_rows > 0): ?>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Date Submitted</th>
                </tr>
            </thead>
            <tbody>
                <?php while($row = $result->fetch_assoc()): ?>
                <tr>
                    <td><?php echo $row["id"]; ?></td>
                    <td><?php echo htmlspecialchars($row["name"]); ?></td>
                    <td><?php echo htmlspecialchars($row["email"]); ?></td>
                    <td><?php echo htmlspecialchars($row["phone"]); ?></td>
                    <td><?php echo htmlspecialchars($row["subject"]); ?></td>
                    <td class="message-cell">
                        <span class="view-message" onclick="showMessage('<?php echo htmlspecialchars(addslashes($row['message'])); ?>', '<?php echo htmlspecialchars(addslashes($row['name'])); ?>')">
                            <?php echo htmlspecialchars(substr($row["message"], 0, 50)) . (strlen($row["message"]) > 50 ? "..." : ""); ?>
                        </span>
                    </td>
                    <td><?php echo $row["date_submitted"]; ?></td>
                </tr>
                <?php endwhile; ?>
            </tbody>
        </table>
        <?php else: ?>
        <div class="no-data">No form submissions found.</div>
        <?php endif; ?>
        
        <a href="home.html" class="back-link"><i class="fas fa-arrow-left"></i> Back to Website</a>
    </div>
    
    <div id="messageModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2 id="modalTitle">Message from <span id="senderName"></span></h2>
            <div id="modalMessage" class="modal-message"></div>
        </div>
    </div>
    
    <script>
        function showMessage(message, name) {
            document.getElementById('senderName').textContent = name;
            document.getElementById('modalMessage').textContent = message.replace(/\\'/g, "'");
            document.getElementById('messageModal').style.display = 'block';
        }
        
        function closeModal() {
            document.getElementById('messageModal').style.display = 'none';
        }
        
        // Close modal when clicking outside of it
        window.onclick = function(event) {
            const modal = document.getElementById('messageModal');
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
    </script>
    <?php endif; ?>
</body>
</html>
<?php
// Close connection
$conn->close();
?>