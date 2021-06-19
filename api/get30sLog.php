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
$result = $log->get30sLog();

// get 30s result
$get30s_result = $result->fetch(PDO::FETCH_ASSOC);

// json to object
$log_data = json_decode($get30s_result["log_data"]);
// mileage unit M to KM
$get30s_result["mile"] == "00000000" ? $mileage = 0 : $mileage = round(ltrim($get30s_result["mile"], "0") / 1000, 2);
// null validation
$get30s_result["imei"] == null ? $imei = "－" : $imei = $get30s_result["imei"];
$get30s_result["imsi"] == null ? $imsi = "－" : $imsi = $get30s_result["imsi"];
$get30s_result["driver_id"] == null ? $driver_id = "－" : $driver_id = $get30s_result["driver_id"];
// JAS106 deviceStatus
$get30s_result["imei"] == null || $get30s_result["imsi"] == null ? $device_status = "－" : $device_status = $log_data[0]->deviceStatus;
// date_time & insert_time to timestamp
$date_timestamp = strtotime($get30s_result["date_time"]);
$insert_timestamp = strtotime($get30s_result["insert_time"]);

$logs_arr = array();
// break down 30s log_data
for ($i = 0; $i < 30; $i++) {
  // skip repeated item
  if ($i == 0) continue;
  // lon & lat float unit
  $longitude =  $log_data[$i]->longitude / 1000000;
  $latitude =  $log_data[$i]->latitude / 1000000;
  // date_time & insert_time ++
  $date_timestamp++;
  $insert_timestamp++;
  // timestamp to str
  $date_time = date("Y-m-d H:i:s", $date_timestamp);
  $insert_time = date("Y-m-d H:i:s", $insert_timestamp);

  $log_item = array(
    "imei" => $imei,
    "bus_id" => $get30s_result["serial"],
    "imsi" => $imsi,
    "driver_id" => $driver_id,
    "date_time" => $date_time,
    "insert_time" => $insert_time,
    "gps_signal" => $get30s_result["gps_signal"],
    "csq" => $get30s_result["csq"],
    "gps" => $get30s_result["gps"],
    "mileage" => $mileage,
    "longitude" => $longitude,
    "latitude" => $latitude,
    "direction" => $log_data[$i]->direction,
    "speed" => $log_data[$i]->speed,
    "rpm" => $log_data[$i]->rpm,
    "gps_speed" => $log_data[$i]->gpsSpeed,
    "io" => $log_data[$i]->io,
    "device_status" => $device_status
  );
  // push to data
  array_push($logs_arr, $log_item);
}

// output 30s json
echo json_encode(array($logs_arr));
