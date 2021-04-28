$(function () {
  // go top
  $("#gotop").click(function () {
    jQuery("html,body").animate(
      {
        scrollTop: 0,
      },
      1000
    );
  });

  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $("#gotop").fadeIn("fast").show();
    } else {
      $("#gotop").stop().fadeOut("fast");
    }
  });

  $("#btn_submit").click(function (e) {
    $("#btn_submit").attr("disabled", true);
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
      return;
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
          alert("查無資料");
          console.log(err.status + err.responseText);
        },
      });
      // reset list-table
      $(".list-table tr").remove();
      $("#data_table_head, #chk_table_head").hide();
      $("#log_table_head").show();
      // create list-table
      for (let d of getData) {
        let count = 0;
        $(".list-table").append(`
        <tr class="list-row-${count}">
          <td class="list-col">${d.imei}</td>
          <td class="list-col">${d.bus_id}</td>
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
          <td class="list-col">${d.gps_speed}</td>
          <td class="list-col">${d.io}</td>
          <td class="list-col">${d.device_status}</td>
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
      $("#log_table_head, #chk_table_head").hide();
      $("#data_table_head").show();
      // create list-table
      for (let d of getData) {
        let count = 0;
        $(".list-table").append(`
        <tr class="list-row-${count}">
          <td class="list-col">${d.imei}</td>
          <td class="list-col">${d.bus_id}</td>
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
          <td class="list-col">${d.abnormal_code}</td>
          <td class="list-col">${d.abnormal_content}</td>
        </tr>
        `);
        count++;
      }
    }

    function chkAjax() {
      // jq ajax
      $.ajax({
        async: false,
        type: "post",
        url: "/api/getChk.php",
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
      $("#log_table_head, #data_table_head").hide();
      $("#chk_table_head").show();
      // create list-table
      for (let d of getData) {
        let count = 0;
        $(".list-table").append(`
        <tr class="list-row-${count}">
          <td class="list-col">${d.imei}</td>
          <td class="list-col">${d.bus_id}</td>
          <td class="list-col">${d.imsi}</td>
          <td class="list-col">${d.insert_time}</td>
          <td class="list-col">${d.device_type}</td>
          <td class="list-col">${d.fw_sign}</td>
          <td class="list-col">${d.csq}</td>
          <td class="list-col">${d.gps_signal}</td>
          <td class="list-col">${d.acc}</td>
          <td class="list-col">${d.internet}</td>
          <td class="list-col">${d.ip_port}</td>
          <td class="list-col">${d.dns_port}</td>
          <td class="list-col">${d.send_time}</td>
          <td class="list-col">${d.standby_send_time}</td>
          <td class="list-col">${d.speed_trigger}</td>
          <td class="list-col">${d.speed_gain}</td>
          <td class="list-col">${d.rpm_trigger}</td>
          <td class="list-col">${d.rpm_div}</td>
        </tr>
        `);
        count++;
      }
    }

    $("#btn_submit").attr("disabled", false);
    $(".loader").hide();
  });
});
