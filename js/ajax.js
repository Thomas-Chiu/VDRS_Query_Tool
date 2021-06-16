$(function () {
  // go top
  $("#gotop").click(function () {
    jQuery("html,body").animate({ scrollTop: 0 }, 1000);
  });

  $(window).scroll(function () {
    if ($(this).scrollTop() > 200) $("#gotop").fadeIn("fast").show();
    else $("#gotop").stop().fadeOut("fast");
  });

  // dark/light mode
  // $("#btn_toggle").click(function () {
  //   let toggle = true;
  //   if (toggle) {
  //     $("body").removeClass("bg-dark");
  //     $("nav").removeClass("bg-dark");
  //   } else {
  //     $("body").addClass("bg-dark");
  //     $("nav").addClass("bg-dark");
  //   }
  // });

  $("#btn_submit").click(function (e) {
    e.preventDefault();
    const utc8ms = 8 * 60 * 60 * 1000; // UTC+8 ms
    let getData = [];
    let reqData = {};
    let startTimeStr = $("#startDate").val() + "T" + $("#startTime").val();
    let endTimeStr = $("#endDate").val() + "T" + $("#endTime").val();
    // UTC+8
    let startUnixTime = new Date(startTimeStr).getTime();
    let endUnixTime = new Date(endTimeStr).getTime();
    let utc8StartStr = new Date(startUnixTime).toISOString();
    let utc8EndStr = new Date(endUnixTime).toISOString();
    let startDate = utc8StartStr.split("", 10).join("");
    let startTime = utc8StartStr.slice(11, 19);
    let endDate = utc8EndStr.split("", 10).join("");
    let endTime = utc8EndStr.slice(11, 19);

    reqData.busId = $("#busId").val().trim();
    reqData.startDate = startDate;
    reqData.startTime = startTime;
    reqData.endDate = endDate;
    reqData.endTime = endTime;
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
    } else {
      // lock submit button
      $("#btn_submit").attr("disabled", true);
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
      let count = 0;
      let abSpotCount = 0;
      let gpsSignalCount = 0;
      let makeUpCount = 0;
      let expectCount = 0;
      let missCount = 0;
      let unixDateTimeArr = [];
      // jq ajax
      $.ajax({
        async: false,
        type: "post",
        url: "/api/getLog.php",
        data: reqData,
        dataType: "json",
        success: function (res) {
          getData = res;
          console.log(getData);
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
      if (getData.status) alert(getData.message);
      else {
        for (let d of getData) {
          let ioArr = d.io.split("");
          let accOn = false;
          let unixDateTime = new Date(d.date_time).getTime(); // UTC+8
          let unixInsertTime = new Date(d.insert_time).getTime();
          let dateTime = new Date(unixDateTime + utc8ms).toLocaleString();
          let insertTime = new Date(unixInsertTime + utc8ms).toLocaleString();

          $(".list-table").append(`
          <tr class="list-row-${count}">
            <td class="list-col">${d.imei}</td>
            <td class="list-col">${d.bus_id}</td>
            <td class="list-col">${d.imsi}</td>
            <td class="list-col">${d.driver_id}</td>
            <td class="list-col">${dateTime}</td>
            <td class="list-col">${insertTime}</td>
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

          // 比對 AB 點 & 掉包率用
          ioArr[0] === "1" ? (accOn = true) : (accOn = false);
          unixDateTimeArr.push({
            accOn: accOn,
            timeStamp: unixDateTime,
            dateTime: dateTime,
          });

          // function validation
          if (d.gps_signal !== "A") {
            // 定位失效
            $(`.list-row-${count}`)
              .css("background", "tomato")
              .addClass("text-body");
            gpsSignalCount++;
          }
          if (ioArr[0] === "0") {
            // 熄火
            $(`.list-row-${count}`)
              .css("background", "gray")
              .addClass("text-body");
          }
          if (unixInsertTime - unixDateTime > 180000) {
            // 補傳 3min
            $(`.list-row-${count}`)
              .css("background", "lightblue")
              .addClass("text-body");
            makeUpCount++;
          }
          if (
            unixDateTime - unixDateTimeArr[count - 1] > 180000 &&
            ioArr[0] === "1"
          ) {
            // AB 點 3min
            $(`.list-row-${count}`)
              .css("background", "green")
              .addClass("text-body");
            $(`.list-row-${count - 1}`)
              .css("background", "green")
              .addClass("text-body");
            abSpotCount++;
          }
          count++;
          expectCount =
            (unixDateTimeArr[unixDateTimeArr.length - 1].timeStamp -
              unixDateTimeArr[0].timeStamp) /
            1000;
          missCount < 0
            ? (missCount = 0)
            : (missCount = expectCount - count * 30);
        }
        // 封包數/總筆數
        $(".result .col:nth-of-type(1)").html(count + "/" + count * 30);
        // AB 點次數
        $(".result .col:nth-of-type(2)").html(abSpotCount);
        // 定位失效比率
        $(".result .col:nth-of-type(3)").html(
          `${gpsSignalCount} (${((gpsSignalCount / count) * 100).toFixed(2)}%)`
        );
        // 補傳比率
        $(".result .col:nth-of-type(4)").html(
          `${makeUpCount} (${((makeUpCount / count) * 100).toFixed(2)}%)`
        );
        // 掉包率 (掉包筆數 / 預期總筆數)
        $(".result .col:nth-of-type(5)").html(
          `(${((missCount / expectCount) * 100).toFixed(2)}%)`
        );
        // 掉包率明細

        let tempOff = {};
        let tempOn = {};
        for (d of unixDateTimeArr) {
          d.accOn ? (tempOn = d) : (tempOff = d);

          // console.log(tempOff, tempOn);
          // if (
          //   Object.keys(tempOn).length === 0 ||
          //   Object.keys(tempOff).length === 0
          // )
          //   return;

          $(".missCount-list").append(`
            <tr>
              <td>${tempOn.dateTime}</td>
              <td>${tempOff.dateTime}</td>
              <td>3</td>
              <td>4</td>
              <td>5</td>
              <td>6</td>
              <td>7</td>
            </tr>`);
        }

        console.log(tempOff, tempOn);
        console.log(unixDateTimeArr);
        console.log(expectCount, missCount);
      }
    }

    function dataAjax() {
      let count = 0;
      // jq ajax
      $.ajax({
        async: false,
        type: "post",
        url: "/api/getData.php",
        data: reqData,
        dataType: "json",
        success: function (res) {
          getData = res;
          console.log(res);
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
      if (getData.status) alert(getData.message);
      else {
        for (let d of getData) {
          let unixDateTime = new Date(d.date_time).getTime(); // UTC+8
          let unixInsertTime = new Date(d.insert_time).getTime();
          let dateTime = new Date(unixDateTime + utc8ms).toLocaleString();
          let insertTime = new Date(unixInsertTime + utc8ms).toLocaleString();

          $(".list-table").append(`
          <tr class="list-row-${count}">
            <td class="list-col">${d.imei}</td>
            <td class="list-col">${d.bus_id}</td>
            <td class="list-col">${d.imsi}</td>
            <td class="list-col">${dateTime}</td>
            <td class="list-col">${insertTime}</td>
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

          // function validation
          if (d.gps_signal !== "A") {
            // 定位失效
            $(`.list-row-${count}`).css("background", "tomato");
          }
          if (unixInsertTime - unixDateTime > 180000) {
            // 補傳 3min
            $(`.list-row-${count}`).css("background", "lightblue");
          }
          count++;
        }
      }
    }

    function chkAjax() {
      let count = 0;
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
      if (getData.status) alert(getData.message);
      else {
        for (let d of getData) {
          let unixInsertTime = new Date(d.insert_time).getTime();
          let insertTime = new Date(unixInsertTime + utc8ms).toLocaleString();

          $(".list-table").append(`
          <tr class="list-row-${count}">
            <td class="list-col">${d.imei}</td>
            <td class="list-col">${d.bus_id}</td>
            <td class="list-col">${d.imsi}</td>
            <td class="list-col">${insertTime}</td>
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
    }

    $("#btn_submit").attr("disabled", false);
    $(".loader").hide();

    // double click to break down 30s
    $("tr").dblclick(function (e) {
      console.log(e.innerHTML);
      console.log(this.innerHTML);
    });
  });
});
