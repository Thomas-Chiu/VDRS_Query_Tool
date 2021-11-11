<?php
class Log
{
  // db stuff
  private $conn;
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
  public function __construct($db)
  {
    $this->conn = $db;
  }

  // get log
  public function getLog()
  {
    // create query
    $query = "SELECT * FROM `vdrs_jasslin`.`$this->table$_POST[busId]` WHERE `date_time` BETWEEN '$_POST[startDate] $_POST[startTime]' AND '$_POST[endDate] $_POST[endTime]' ORDER BY `date_time`";

    // prepare statement
    $stmt = $this->conn->prepare($query);

    // execute query
    $stmt->execute();

    return $stmt;
  }

  // get 30s log
  public function get30sLog()
  {
    // create query
    $query = "SELECT * FROM `vdrs_jasslin`.`$this->table$_POST[busId]` WHERE `date_time` = '$_POST[thisRowDateTime]'";

    // prepare statement
    $stmt = $this->conn->prepare($query);

    // execute query
    $stmt->execute();

    return $stmt;
  }
}