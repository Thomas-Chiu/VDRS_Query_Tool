<?php
class Log
{
  // db stuff
  private $conn;
  private $devEnv;
  private $table = "f_log_data_";

  // log properties
  public $imei;
  public $busId;
  public $imsi;
  public $driverId;
  public $dateTime;
  public $insertTime;
  public $gpsSignal;
  public $csq;
  public $gps;
  public $milage;
  public $longitude;
  public $latiitude;
  public $direction;
  public $speed;
  public $rpm;
  public $gpsSpeed;
  public $io;
  public $deviceStatus;


  // constructor with db 
  public function __construct($db, $devEnv)
  {
    $this->conn = $db;
    $this->devEnv = $devEnv;
  }

  // get log
  public function getLog()
  {
    // create query
    if ($this->devEnv) {
      $query = "SELECT * FROM `vdrs_v2`.`$this->table$_POST[busId]` WHERE `date_time` BETWEEN '$_POST[startDate] $_POST[startTime]' AND '$_POST[endDate] $_POST[endTime]' ORDER BY `date_time` DESC";
    } else {
      $query = "SELECT * FROM `vdrs_jasslin`.`$this->table$_POST[busId]` WHERE `date_time` BETWEEN '$_POST[startDate] $_POST[startTime]' AND '$_POST[endDate] $_POST[endTime]' ORDER BY `date_time` DESC";
    }

    // prepare statement
    $stmt = $this->conn->prepare($query);

    // execute query
    $stmt->execute();

    return $stmt;
  }
}
