<?php
class Log
{
  // db stuff
  private $conn;
  private $table = 'f_log_data_';

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
    // $query = 'SELECT * FROM' . $this->table . $_GET["busId"] . '
    //           WHERE date_time BETWEEN ' . $_GET["startDate"]  . $_GET["startTime"] . '
    //           AND' . $_GET["endDate"]  . $_GET["endTime"] . '
    //           ORDER BY date_time DESC';

    $query = 'SELECT * FROM `vdrs`.`f_log_data_js2-001` ORDER BY `date_time` DESC LIMIT 0, 1000';

    // prepare statement
    $stmt = $this->conn->prepare($query);

    // execute query
    $stmt->execute();

    return $stmt;
  }
}
