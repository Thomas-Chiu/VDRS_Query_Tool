<?php
class Database
{
  // db params
  private $host = "localhost";
  private $dbname = "vdrs";
  private $user = "thomas";
  private $pass = "dppss891234";
  private $conn;

  // db connect
  public function connect()
  {
    $this->conn = null;

    try {
      // new PDO('mysql:host=localhost;dbname=test', $user, $pass);
      $this->conn = new PDO("mysql:host=$this->host;dbname=$this->dbname", $this->user, $this->pass);
      $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      // echo "Connection Success";
    } catch (PDOException $e) {
      echo "資料庫連線失敗 $e->getMessage()";
    }
    return $this->conn;
  }
}

$test = new Database;
$test->connect();
