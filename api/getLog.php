<?php
include_once "../dbconfig.php";
include_once "../models/log.php";

// headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// instantinte db & connect
$database = new Database();
$db = $database->connect();

// instantiate log object
$log = new Log($db);

// query
$result = $log->getLog();

// get row count
$count = $result->rowCount();

// check row count
if ($count > 0) {
  $logs_arr = array();

  while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
    // json to object
    $log_data = json_decode($row["log_data"]);
    $log_item = array(
      "busId" => $row["serial"],
      "imei" => $row["imei"],
      "imsi" => $row["imsi"],
      "driver_id" => $row["driver_id"],
      "date_time" => $row["date_time"],
      "insert_time" => $row["insert_time"],
      "gps_signal" => $row["gps_signal"],
      "gps" => $row["gps"],
      "csq" => $row["csq"],
      "mileage" => trim($row["mile"], 0),
      "longitude" => $log_data[0]->longitude,
      "latitude" => $log_data[0]->latitude,
      "speed" => $log_data[0]->speed,
      "rpm" => $log_data[0]->rpm,
      "gpsSpeed" => $log_data[0]->gpsSpeed,
      "io" => $log_data[0]->io,
    );
    // push to data
    array_push($logs_arr, $log_item);
  }
  // output json
  echo json_encode($logs_arr, JSON_PRETTY_PRINT);
} else {
  // no log
  echo json_encode(
    array("message" => "搜尋無資料")
  );
};
