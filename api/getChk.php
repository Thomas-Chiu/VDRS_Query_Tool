<?php
include_once "../conf.php";
include_once "../models/chk.php";

// headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// instantinte db & connect
$database = new Database();
$db = $database->connect();

// instantiate log object
$chk = new Chk($db);

// query
$result = $chk->getChk();

// get row count
$count = $result->rowCount();

// check row count
if ($count > 0) {
  $chks_arr = array();

  while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
    // null validation
    if ($row["imsi"] == null) $imsi = "－";
    else $imsi = $row["imsi"];
    // json to object
    $chk_item = array(
      "imei" => $row["imei"],
      "bus_id" => $row["bus_id"],
      "imsi" => $imsi,
      "insert_time" => $row["insert_time"],
      "device_type" => $row["device_type"],
      "fw_sign" => $row["fw_sign"],
      "csq" => $row["csq"],
      "gps_signal" => $row["gps_signal"],
      "acc" => $row["acc"],
      "internet" => $row["internet"],
      "ip_port" => $row["ip_port"],
      "dns_port" => $row["dns_port"],
      "send_time" => $row["send_time"],
      "standby_send_time" => $row["standby_send_time"],
      "speed_trigger" => $row["speed_trigger"],
      "speed_gain" => $row["speed_gain"],
      "rpm_trigger" => $row["rpm_trigger"],
      "rpm_div" => $row["rpm_div"]
    );
    // push to data
    array_push($chks_arr, $chk_item);
  }
  // output json
  echo json_encode($chks_arr, JSON_PRETTY_PRINT);
} else {
  // no log
  echo json_encode(
    array(
      "status" => 404,
      "message" => "搜尋無資料"
    )
  );
};
