<?php


$dbConnection = new mysqli('localhost','root','','autocomplete');

if($dbConnection->connect_errno > 0){
	    die('Unable to connect to database [' . $dbConnection->connect_error . ']');
}

$keyword = $_GET['keyword'];

$sql = 'SELECT  * FROM items WHERE item_title like "%'.$keyword.'%"';

$query = $dbConnection->query($sql);

$results = array();

while($row = $query->fetch_assoc()){
    $results[] = $row['item_title'];
}

echo json_encode($results);