<?php
include_once "../conf.php";
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
    // mileage unit M to KM
    if ($row["mile"] == "00000000") $mileage = 0;
    else $mileage = round(ltrim($row["mile"], "0") / 1000, 2);
    // null validation
    if ($row["imei"] == null) $imei = "－";
    if ($row["imsi"] == null) $imsi = "－";
    else {
      $imei = $row["imei"];
      $imsi = $row["imsi"];
    }

    $data_item = array(
      "imei" => $imei,
      "bus_id" => $row["serial"],
      "imsi" => $imsi,
      "date_time" => $row["date_time"],
      "insert_time" => $row["insert_time"],
      "gps_signal" => $row["gps_signal"],
      "longitude" => $row["longitude"],
      "latitude" => $row["latitude"],
      "direction" => $row["direction"],
      "speed" => $row["speed"],
      "mileage" => $mileage,
      "rpm" => $row["rpm"],
      "driver_id" => $row["driver_id"],
      "csq" => $row["csq"],
      "gps" => $row["gps"],
      "io" => $row["io_signal"],
      "abnormal_code" => $row["abnormal_code"],
      "abnormal_content" => $row["abnormal_content"]
    );
    // push to data
    array_push($datas_arr, $data_item);
  }
  // output json
  echo json_encode($datas_arr, JSON_PRETTY_PRINT);
} else {
  // no log
  echo json_encode(
    array(
      "status" => 404,
      "message" => "搜尋無資料"
    )
  );
};