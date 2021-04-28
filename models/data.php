<?php
class Data
{
  // db stuff
  private $conn;
  private $devEnv;
  private $table = "f_abnormal_data_2";

  // log properties
  public $imei;
  public $busId;
  public $imsi;
  public $dateTime;
  public $insertTime;
  public $gpsSignal;
  public $longitude;
  public $latiitude;
  public $direction;
  public $speed;
  public $milage;
  public $rpm;
  public $driverId;
  public $csq;
  public $gps;
  public $io;
  public $abnormalCode;
  public $abnormalContent;

  // constructor with db 
  public function __construct($db, $devEnv)
  {
    $this->conn = $db;
    $this->devEnv = $devEnv;
  }

  // get data
  public function getData()
  {
    // create query
    if ($this->devEnv) {
      $query = "SELECT * FROM `vdrs`.`$this->table` WHERE `serial` = '$_POST[busId]' AND `date_time` BETWEEN '$_POST[startDate] $_POST[startTime]' AND '$_POST[endDate] $_POST[endTime]' ORDER BY `date_time` DESC";
    } else {
      $query = "SELECT * FROM `vdrs_jasslin`.`$this->table` WHERE `serial` = '$_POST[busId]' AND `date_time` BETWEEN '$_POST[startDate] $_POST[startTime]' AND '$_POST[endDate] $_POST[endTime]' ORDER BY `date_time` DESC";
    }

    // prepare statement
    $stmt = $this->conn->prepare($query);

    // execute query
    $stmt->execute();

    return $stmt;
  }
}
