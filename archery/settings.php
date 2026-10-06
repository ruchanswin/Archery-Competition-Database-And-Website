<?php
$servername = "feenix-mariadb.swin.edu.au";
$username = "cos20031_24";
$password = "h4fXAys2a7";
$dbname = "cos20031_24_db";

// Create a connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "Connected successfully";

// Close the connection
$conn->close();
?>