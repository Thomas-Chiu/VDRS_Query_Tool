<?php
class Database
{
  // db params
  // private $host = "60.251.157.47";
  private $host = "localhost";
  // private $dbname = "vdrs_jasslin";
  private $dbname = "vdrs_v2";
  // private $user = "vdrs_jasslin";
  private $user = "thomas";
  // private $pass = "13091876";
  private $pass = "dppss891234";
  // private $port = 3307;
  private $port = 3306;
  private $devEnv = true;
  private $conn;

  // db connect
  public function connect()
  {
    $this->conn = null;

    try {
      // new PDO('mysql:host=localhost;dbname=test', $user, $pass);
      $this->conn = new PDO("mysql:host=$this->host;port=$this->port;dbname=$this->dbname", $this->user, $this->pass);
      $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      // echo "Connection Success";
    } catch (PDOException $e) {
      echo "資料庫連線失敗 $e->getMessage()";
    }
    return $this->conn;
  }

  // dev env
  public function environment()
  {
    return $this->devEnv;
  }
}

$test = new Database;
$test->connect();
