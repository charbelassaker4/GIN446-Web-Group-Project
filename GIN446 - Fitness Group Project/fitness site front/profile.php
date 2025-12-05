<?php
header("Content-Type: text/xml");
error_reporting(0);

// ================= DATABASE =================
$servername = "sql112.infinityfree.com";
$username   = "if0_40485900";
$password   = "PFNS65oXelCB";
$dbname     = "if0_40485900_dreamfit";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo "<response><status>error</status><message>DB connection failed</message></response>";
    exit;
}

// =========================
// GET REQUEST — Load Profile
// =========================
if ($_SERVER["REQUEST_METHOD"] === "GET") {

    if (!isset($_GET["email"])) {
        echo "<response><status>error</status><message>No email provided</message></response>";
        exit;
    }

    $email = $_GET["email"];

    $stmt = $conn->prepare("SELECT age, weight, height, workouts_per_week,
                                   activity_level, goal, sex, date_of_birth, country
                            FROM users
                            WHERE user_email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    echo "<?xml version='1.0' encoding='UTF-8'?>";
    echo "<response>";

    if ($row = $result->fetch_assoc()) {
        echo "<user>";
        echo "<age>" . $row["age"] . "</age>";
        echo "<weight>" . $row["weight"] . "</weight>";
        echo "<height>" . $row["height"] . "</height>";
        echo "<workouts_per_week>" . $row["workouts_per_week"] . "</workouts_per_week>";
        echo "<activity_level>" . $row["activity_level"] . "</activity_level>";
        echo "<goal>" . $row["goal"] . "</goal>";
        echo "<sex>" . $row["sex"] . "</sex>";
        echo "<date_of_birth>" . $row["date_of_birth"] . "</date_of_birth>";
        echo "<country>" . $row["country"] . "</country>";
        echo "</user>";
    } else {
        echo "<status>error</status><message>User not found</message>";
    }

    echo "</response>";
    exit;
}

// =========================
// POST REQUEST — Update Profile
// =========================
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $json = file_get_contents("php://input");
    $data = json_decode($json, true);

    if (!isset($data["email"])) {
        echo "<response><status>error</status><message>No email provided</message></response>";
        exit;
    }

    $stmt = $conn->prepare("
        UPDATE users SET
            age = ?, weight = ?, height = ?, workouts_per_week = ?,
            activity_level = ?, goal = ?, sex = ?, date_of_birth = ?, country = ?
        WHERE user_email = ?
    ");

    $stmt->bind_param(
        "dddiisssss",
        $data["age"],
        $data["weight"],
        $data["height"],
        $data["workouts"],
        $data["activity"],
        $data["goal"],
        $data["sex"],
        $data["dob"],
        $data["country"],
        $data["email"]
    );

    if ($stmt->execute()) {
        echo "<response><status>success</status><message>Profile updated</message></response>";
    } else {
        echo "<response><status>error</status><message>DB update failed</message></response>";
    }

    exit;
}

?>
