<?php
include_once "../config.php";
include_once "../models/log.php";

// headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// instantinte db & connect
$database = new Database();
$db = $database->connect();
$devEnv = $database->environment();

// instantiate log object
$log = new Log($db, $devEnv);

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
    // 20211110 改取最後一秒做代表
    $log_data_length = count($log_data);
    // lon & lat float unit
    $longitude =  $log_data[$log_data_length - 1]->longitude / 1000000;
    $latitude =  $log_data[$log_data_length - 1]->latitude / 1000000;
    // mileage unit M to KM
    $row["mile"] == "00000000" ? $mileage = 0 : $mileage = round(ltrim($row["mile"], "0") / 1000, 2);
    // null validation
    $row["imei"] == null ? $imei = "－" : $imei = $row["imei"];
    $row["imsi"] == null ? $imsi = "－" : $imsi = $row["imsi"];
    $row["driver_id"] == null ? $driver_id = "－" : $driver_id = $row["driver_id"];
    // JAS106 deviceStatus
    $row["imei"] == null || $row["imsi"] == null ? $device_status = "－" : $device_status = $log_data[$log_data_length - 1]->deviceStatus;

    $log_item = array(
      "imei" => $imei,
      "bus_id" => $row["serial"],
      "imsi" => $imsi,
      "driver_id" => $driver_id,
      "date_time" => $row["date_time"],
      "insert_time" => $row["insert_time"],
      "gps_signal" => $row["gps_signal"],
      "csq" => $row["csq"],
      "gps" => $row["gps"],
      "mileage" => $mileage,
      "longitude" => $longitude,
      "latitude" => $latitude,
      "direction" => $log_data[$log_data_length - 1]->direction,
      "speed" => $log_data[$log_data_length - 1]->speed,
      "rpm" => $log_data[$log_data_length - 1]->rpm,
      "gps_speed" => $log_data[$log_data_length - 1]->gpsSpeed,
      "io" => $log_data[$log_data_length - 1]->io,
      "device_status" => $device_status
    );
    // push to data
    array_push($logs_arr, $log_item);
  }
  // output json
  echo json_encode($logs_arr, JSON_PRETTY_PRINT);
} else {
  // no log
  echo json_encode(
    array(
      "status" => 404,
      "message" => "搜尋無資料"
    )
  );
};