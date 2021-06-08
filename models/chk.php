<?php
class Chk
{
  // db stuff
  private $conn;
  private $devEnv;
  private $table = "f_chk_data";

  // log properties
  public $imei;
  public $busId;
  public $imsi;
  public $deviceType;
  public $fwSign;
  public $insertTime;
  public $csq;
  public $gpsSignal;
  public $acc;
  public $internet;
  public $ipPort;
  public $dnsPort;
  public $sendTime;
  public $standbySendTime;
  public $speedTrigger;
  public $speedGain;
  public $rpmTrigger;
  public $rpmDiv;

  // constructor with db 
  public function __construct($db, $devEnv)
  {
    $this->conn = $db;
    $this->devEnv = $devEnv;
  }

  // get data
  public function getChk()
  {
    // create query
    if ($this->devEnv) {
      $query = "SELECT * FROM `vdrs`.`$this->table` WHERE `bus_id` = '$_POST[busId]' AND `insert_time` BETWEEN '$_POST[startDate] $_POST[startTime]' AND '$_POST[endDate] $_POST[endTime]' ORDER BY `insert_time` DESC";
    } else {
      $query = "SELECT * FROM `vdrs_jasslin`.`$this->table` WHERE `bus_id` = '$_POST[busId]' AND `insert_time` BETWEEN '$_POST[startDate] $_POST[startTime]' AND '$_POST[endDate] $_POST[endTime]' ORDER BY `insert_time` DESC";
    }

    // prepare statement
    $stmt = $this->conn->prepare($query);

    // execute query
    $stmt->execute();

    return $stmt;
  }
}
