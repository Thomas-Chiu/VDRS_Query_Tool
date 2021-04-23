<?php
require_once("./dbconfig.php");

// 開啟 MySQL 連線
$connection = mysqli_connect($host, $user, $pass, $dbname);
$res = [];
header("Content-Type: JSON");
mysqli_set_charset($connection, 'utf8');

if ($connection) {
  $sql = 'SELECT * FROM `f_log_data_js2-001` WHERE `csq` = 15';
  $result = mysqli_query($connection, $sql);

  if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
      static $i = 0;
      $log_data = json_decode($row["log_data"]);

      // $res[index][key] = value
      $res[$i]["bus id"] = $row["serial"];
      $res[$i]["imei"] = $row["imei"];
      $res[$i]["imsi"] = $row["imsi"];
      $res[$i]["司機編號"] = $row["driver_id"];
      $res[$i]["原始時間"] = $row["date_time"];
      $res[$i]["接收時間"] = $row["insert_time"];
      $res[$i]["GPS定位"] = $row["gps_signal"];
      $res[$i]["衛星數"] = $row["gps"];
      $res[$i]["csq"] = $row["csq"];
      $res[$i]["里程數"] = trim($row["mile"], 0);
      $res[$i]["經度"] = $log_data[0]->longitude;
      $res[$i]["緯度"] = $log_data[0]->latitude;
      $res[$i]["車速"] = $log_data[0]->speed;
      $res[$i]["轉速"] = $log_data[0]->rpm;
      $res[$i]["GPS車速"] = $log_data[0]->gpsSpeed;
      $res[$i]["io"] = $log_data[0]->io;
      $i++;
    }
    echo (json_encode($res, JSON_PRETTY_PRINT + JSON_UNESCAPED_UNICODE));
  }
} else {
  echo "資料庫連線失敗";
}
