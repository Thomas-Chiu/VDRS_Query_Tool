<?php
class Log
{
  // db stuff
  private $conn;
  private $table = "f_log_data_";

  // log properties
  public $busId;
  public $imei;
  public $imsi;
  public $driverId;
  public $dateTime;
  public $insertTime;
  public $gpsSignal;
  public $gps;
  public $csq;
  public $milage;
  public $longitude;
  public $latiitude;
  public $speed;
  public $rpm;
  public $gpsSpeed;
  public $io;


  // constructor with db 
  public function __construct($db)
  {
    $this->conn = $db;
  }

  // get log
  public function getLog()
  {
    // create query
    // $query = 'SELECT * FROM `vdrs.f_log_data_js2-001` ORDER BY `date_time` DESC LIMIT 0, 10';
    // $query = 'SELECT * FROM' .  ' `vdrs`.`' . $this->table . $_POST["busId"] . '` WHERE `date_time` BETWEEN ' . $_POST["startDate"]  . $_POST["startTime"]  . 'AND ' . $_POST["endDate"]  . $_POST["endTime"] . 'ORDER BY `date_time` DESC LIMIT 0, 50';
    $query = "SELECT * FROM `vdrs`.`$this->table$_POST[busId]` WHERE `date_time` BETWEEN '$_POST[startDate] $_POST[startTime]' AND '$_POST[endDate] $_POST[endTime]' ORDER BY `date_time` DESC";

    // prepare statement
    $stmt = $this->conn->prepare($query);

    // execute query
    $stmt->execute();

    return $stmt;
  }
}
