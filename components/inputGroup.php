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
  <div class="container text-white-50">
    <div class="row">
      <div class="col-md-3">
        <h6>BUS ID</h6>
        <input id="busId" type="text" name="busId" placeholder="車牌號碼" required>
        <!-- <input id="busId" type="text" name="busId" value="BUS-208" required> -->
      </div>
      <div class="col">
        <h6>起始時間</h6>
        <!-- <input id="startDate" name="startDate" type="date" value="<?php echo today() ?>" required> -->
        <input id="startDate" name="startDate" type="date" value="2021-04-25" required>
        <input id="startTime" name="startTime" type="time" step="1" value=00:00:00 required>
      </div>
      <div class="col">
        <h6>結束時間</h6>
        <!-- <input id="endDate" name="endDate" type="date" value="<?php echo today() ?>" required> -->
        <input id="endDate" name="endDate" type="date" value="2021-04-25" required>
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

<div class="container text-white-50">
  <div class="row">
    <div class="col statistic">
      <h6>數據統計</h6>
      <div class="row">
        <div class="col">封包數/總筆數</div>
        <div class="col">AB 點次數</div>
        <div class="col">定位 V (包數/比率)</div>
        <div class="col">補傳 (包數/比率)</div>
        <div class="col">掉包率</div>
      </div>
      <div class="row result">
        <div class="col">0</div>
        <div class="col">0</div>
        <div class="col">0</div>
        <div class="col">0</div>
        <div class="col badge badge-warning" data-toggle="modal" data-target="#lostCount_table">0</div>
      </div>
    </div>
    <div class="col status">
      <h6>異常狀態</h6>
      <span class="box">AB 點 (3min)</span>
      <span class="box">定位 V</span>
      <span class="box">補傳 (3min)</span>
      <span class="box">熄火</span>
    </div>
  </div>
</div>

<!-- Modal -->
<div id="lostCount_table" class="modal fade">
  <div class="modal-dialog modal-xl">
    <div class="modal-content bg-dark">
      <div class="modal-header">
        <h5 class="modal-title text-white-50">LOG 掉包率資訊</h5>
      </div>
      <div class="modal-body">
        <table class="table table-sm table-bordered table-hover">
          <thead id="lostCount_table_head" class="thead-light text-center sticky-top">
            <tr>
              <th scope="col">ACC ON</th>
              <th scope="col">ACC OFF</th>
              <th scope="col">區段時間</th>
              <th scope="col">預計收到筆數</th>
              <th scope="col">實際收到筆數</th>
              <th scope="col">差異筆數</th>
              <th scope="col">資料遺失率</th>
            </tr>
          </thead>
          <tbody class="text-center text-white lostCount-list">

          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>