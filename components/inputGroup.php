<?php
function today()
{
  $year = date("Y");
  $month = date("m");
  $day = date("d");
  return $year . "-" . $month . "-" . $day;
}
?>

<form action="" method="post">
  <div class="container bg-dark text-white-50">
    <div class="row">
      <div class="col-md-3">
        <h6>BUS ID</h6>
        <input id="busId" type="text" name="busId" placeholder="車牌號碼" required>
      </div>
      <div class="col">
        <h6>起始時間</h6>
        <input id="startDate" name="startDate" type="date" value="<?php echo today() ?>" required>
        <input id="startTime" name="startTime" type="time" step="1" value=00:00:00 required>
      </div>
      <div class="col">
        <h6>結束時間</h6>
        <input id="endDate" name="endDate" type="date" value="<?php echo today() ?>" required>
        <input id="endTime" name="endTime" type="time" step="1" value=23:59:59 required>
      </div>
      <div class="col">
        <h6>查詢</h6>
        <input id="btn_submit" type="submit" value="送出" class="btn btn-warning">
        <input type="reset" value="取消" class="btn btn-outline-warning">
      </div>
    </div>
  </div>
</form>