<?php
require_once("../dbconfig.php");

// 開啟 MySQL 連線
$connection = mysqli_connect($host, $user, $pass, $dbname);
$res = [];
header("Content-Type: JSON");
mysqli_set_charset($connection, 'utf8');


echo '$_GET["busId"] <br>';
echo '$_GET["startDate"] <br>';
echo '$_GET["startTime"] <br>';
echo '$_GET["endDate"] <br>';
echo '$_GET["endTime"] <br>';


if ($connection) {
  exit();
  $sql = 'SELECT * FROM f_log_data_js2-001 WHERE csq = 15';
  $result = mysqli_query($connection, $sql);

  if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
      static $i = 0;
      $log_data = json_decode($row["log_data"]);

      // $res[index][key] = value
      $res[$i]["busId"] = $row["serial"];
      $res[$i]["imei"] = $row["imei"];
      $res[$i]["imsi"] = $row["imsi"];
      $res[$i]["driverId"] = $row["driver_id"];
      $res[$i]["dateTime"] = $row["date_time"];
      $res[$i]["insertTime"] = $row["insert_time"];
      $res[$i]["gpsSignal"] = $row["gps_signal"];
      $res[$i]["gps"] = $row["gps"];
      $res[$i]["csq"] = $row["csq"];
      $res[$i]["milage"] = trim($row["mile"], 0);
      $res[$i]["longitude"] = $log_data[0]->longitude;
      $res[$i]["latitude"] = $log_data[0]->latitude;
      $res[$i]["speed"] = $log_data[0]->speed;
      $res[$i]["rpm"] = $log_data[0]->rpm;
      $res[$i]["gpsSpeed"] = $log_data[0]->gpsSpeed;
      $res[$i]["io"] = $log_data[0]->io;
      $i++;
    }
    echo (json_encode($res, JSON_PRETTY_PRINT + JSON_UNESCAPED_UNICODE));
  }
} else {
  echo "資料庫連線失敗";
}
