<?php
include_once "../dbconfig.php";
include_once "../models/data.php";

// headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// instantinte db & connect
$database = new Database();
$db = $database->connect();

// instantiate log object
$data = new Data($db);

// query
$result = $data->getData();

// get row count
$count = $result->rowCount();

// check row count
if ($count > 0) {
  $datas_arr = array();

  while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
    // json to object
    // $log_data = json_decode($row["log_data"]);
    $data_item = array(
      "imei" => $row["imei"],
      "busId" => $row["serial"],
      "imsi" => $row["imsi"],
      "date_time" => $row["date_time"],
      "insert_time" => $row["insert_time"],
      "gps_signal" => $row["gps_signal"],
      "longitude" => $row["longitude"],
      "latitude" => $row["latitude"],
      "direction" => $row["direction"],
      "speed" => $row["speed"],
      "mileage" => $row["mile"],
      "rpm" => $row["rpm"],
      "driver_id" => $row["driver_id"],
      "csq" => $row["csq"],
      "gps" => $row["gps"],
      "io" => $row["io"],
      "abnormalCode" => $row["abnormalCode"],
      "abnormalContent" => $row["abnormalContent"],
    );
    // push to data
    array_push($datas_arr, $data_item);
  }
  // output json
  echo json_encode($datas_arr, JSON_PRETTY_PRINT);
} else {
  // no log
  echo json_encode(
    array("message" => "搜尋無資料")
  );
};
