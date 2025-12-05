<?php
header("Content-Type: application/xml");
error_reporting(E_ALL);
ini_set('display_errors', 1);

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data) {
    echo "<response><status>error</status><message>No data received</message></response>";
    exit;
}

/* -------------------------
   XAMPP LOCALHOST DATABASE
-------------------------- */
$servername = "sql112.infinityfree.com";
$username   = "if0_40485900";
$password   = "PFNS65oXelCB";
$dbname     = "if0_40485900_dreamfit";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo "<response><status>error</status><message>".htmlspecialchars($conn->connect_error)."</message></response>";
    exit;
}

$dob_mysql = date("Y-m-d", strtotime($data["dob"]));

$stmt = $conn->prepare("
    INSERT INTO users
    (user_email, age, weight, height, workouts_per_week, activity_level, goal, sex, date_of_birth, country)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
        age=VALUES(age),
        weight=VALUES(weight),
        height=VALUES(height),
        workouts_per_week=VALUES(workouts_per_week),
        activity_level=VALUES(activity_level),
        goal=VALUES(goal),
        sex=VALUES(sex),
        date_of_birth=VALUES(date_of_birth),
        country=VALUES(country)
");

$stmt->bind_param(
    "siddisssss",
    $data["email"],
    $data["age"],
    $data["weight"],
    $data["height"],
    $data["workouts"],
    $data["activity"],
    $data["goal"],
    $data["sex"],
    $dob_mysql,
    $data["country"]
);

if ($stmt->execute()) {
    echo "<response><status>success</status><message>User added/updated</message></response>";
} else {
    echo "<response><status>error</status><message>".htmlspecialchars($stmt->error)."</message></response>";
}

$stmt->close();
$conn->close();
?>