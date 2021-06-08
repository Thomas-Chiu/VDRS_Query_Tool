<?php
include_once "../dbconfig.php";
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
    // JAS106 condition
    if (
      $row["imei"] == null ||
      $row["imsi"] == null ||
      $row["driver_id"] == null ||
      $log_data[0]->deviceStatus == "undefined"
    ) {
      $log_item = array(
        "imei" => "－",
        "bus_id" => $row["serial"],
        "imsi" => "－",
        "driver_id" => "－",
        "date_time" => $row["date_time"],
        "insert_time" => $row["insert_time"],
        "gps_signal" => $row["gps_signal"],
        "csq" => $row["csq"],
        "gps" => $row["gps"],
        "mileage" => $row["mile"],
        "longitude" => $log_data[0]->longitude,
        "latitude" => $log_data[0]->latitude,
        "direction" => $log_data[0]->direction,
        "speed" => $log_data[0]->speed,
        "rpm" => $log_data[0]->rpm,
        "gps_speed" => $log_data[0]->gpsSpeed,
        "io" => $log_data[0]->io,
        "device_status" => "－"
      );
    }
    // break down 30s log_data
    // for ($i = 0; $i < 30; $i++) {

    //   $log_item = array(
    //     "imei" => $row["imei"],
    //     "bus_id" => $row["serial"],
    //     "imsi" => $row["imsi"],
    //     "driver_id" => $row["driver_id"],
    //     // "date_time" => $row["date_time"],
    //     "date_time" => $i,
    //     "insert_time" => $row["insert_time"],
    //     "gps_signal" => $row["gps_signal"],
    //     "csq" => $row["csq"],
    //     "gps" => $row["gps"],
    //     "mileage" => $row["mile"],
    //     "longitude" => $log_data[$i]->longitude,
    //     "latitude" => $log_data[$i]->latitude,
    //     "direction" => $log_data[$i]->direction,
    //     "speed" => $log_data[$i]->speed,
    //     "rpm" => $log_data[$i]->rpm,
    //     "gps_speed" => $log_data[$i]->gpsSpeed,
    //     "io" => $log_data[$i]->io,
    //     "device_status" => $log_data[$i]->deviceStatus
    //   );
    //   array_push($logs_arr, $log_item);
    // }

    else {
      $log_item = array(
        "imei" => $row["imei"],
        "bus_id" => $row["serial"],
        "imsi" => $row["imsi"],
        "driver_id" => $row["driver_id"],
        "date_time" => $row["date_time"],
        "insert_time" => $row["insert_time"],
        "gps_signal" => $row["gps_signal"],
        "csq" => $row["csq"],
        "gps" => $row["gps"],
        "mileage" => $row["mile"],
        "longitude" => $log_data[0]->longitude,
        "latitude" => $log_data[0]->latitude,
        "direction" => $log_data[0]->direction,
        "speed" => $log_data[0]->speed,
        "rpm" => $log_data[0]->rpm,
        "gps_speed" => $log_data[0]->gpsSpeed,
        "io" => $log_data[0]->io,
        "device_status" => $log_data[0]->deviceStatus
      );
    }
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
