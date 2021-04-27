$(function () {
  $("#btn_submit").click(function (e) {
    e.preventDefault();
    let getData = [];
    let reqData = {};

    reqData.busId = $("#busId").val();
    reqData.startDate = $("#startDate").val();
    reqData.startTime = $("#startTime").val();
    reqData.endDate = $("#endDate").val();
    reqData.endTime = $("#endTime").val();
    reqData.queryType = $("input[name=queryType]:checked").val();

    // input validation
    if (
      !reqData.busId ||
      !reqData.startDate ||
      !reqData.startTime ||
      !reqData.endDate ||
      !reqData.endTime ||
      !reqData.queryType
    ) {
      alert("請輸入 BUS ID、起始時間和結束時間");
    }
    // thead validation
    if (reqData.queryType == "data") {
      $("data_table_head").show("slow");
    }

    switch (reqData.queryType) {
      case "log":
        logAjax();
        break;
      case "data":
        dataAjax();
        break;
      case "chk":
        chkAjax();
        break;
    }

    function logAjax() {
      // jq ajax
      $.ajax({
        async: false,
        type: "post",
        url: "/api/getLog.php",
        data: reqData,
        dataType: "json",
        success: function (res) {
          getData = res;
          console.log(res[0]);
        },
        error: function (err) {
          console.log(err.status + err.responseText);
        },
      });

      // reset list-table
      $(".list-table tr").remove();

      // create list-table
      for (let d of getData) {
        let count = 0;
        $(".list-table").append(`
        <tr class="list-row-${count}">
          <td class="list-col">${d.imei}</td>
          <td class="list-col">${d.busId}</td>
          <td class="list-col">${d.imsi}</td>
          <td class="list-col">${d.driver_id}</td>
          <td class="list-col">${d.date_time}</td>
          <td class="list-col">${d.insert_time}</td>
          <td class="list-col">${d.gps_signal}</td>
          <td class="list-col">${d.csq}</td>
          <td class="list-col">${d.gps}</td>
          <td class="list-col">${d.mileage}</td>
          <td class="list-col">${d.longitude}</td>
          <td class="list-col">${d.latitude}</td>
          <td class="list-col">${d.direction}</td>
          <td class="list-col">${d.speed}</td>
          <td class="list-col">${d.rpm}</td>
          <td class="list-col">${d.gpsSpeed}</td>
          <td class="list-col">${d.io}</td>
          <td class="list-col">${d.deviceStatus}</td>
        </tr>
        `);
        count++;
      }
    }

    function dataAjax() {
      // jq ajax
      $.ajax({
        async: false,
        type: "post",
        url: "/api/getData.php",
        data: reqData,
        dataType: "json",
        success: function (res) {
          getData = res;
          console.log(res[0]);
        },
        error: function (err) {
          console.log(err.status + err.responseText);
        },
      });

      // reset list-table
      $(".list-table tr").remove();

      // create list-table
      for (let d of getData) {
        let count = 0;
        $(".list-table").append(`
        <tr class="list-row-${count}">
          <td class="list-col">${d.imei}</td>
          <td class="list-col">${d.busId}</td>
          <td class="list-col">${d.imsi}</td>
          <td class="list-col">${d.date_time}</td>
          <td class="list-col">${d.insert_time}</td>
          <td class="list-col">${d.gps_signal}</td>
          <td class="list-col">${d.longitude}</td>
          <td class="list-col">${d.latitude}</td>
          <td class="list-col">${d.direction}</td>
          <td class="list-col">${d.speed}</td>
          <td class="list-col">${d.mileage}</td>
          <td class="list-col">${d.rpm}</td>
          <td class="list-col">${d.driver_id}</td>
          <td class="list-col">${d.csq}</td>
          <td class="list-col">${d.gps}</td>
          <td class="list-col">${d.io}</td>
          <td class="list-col">${d.abnormalCode}</td>
          <td class="list-col">${d.abnormalContent}</td>
        </tr>
        `);
        count++;
      }
    }
  });
});
