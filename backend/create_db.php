<?php
try {
    $pdo = new PDO('mysql:host=127.0.0.1;port=3306', 'root', 'rensith2001');
    $pdo->exec("CREATE DATABASE IF NOT EXISTS vehicle_renting_system");
    echo "Database 'vehicle_renting_system' created successfully!\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
