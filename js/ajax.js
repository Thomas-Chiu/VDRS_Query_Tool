$(function () {
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
      const getDuration = (unixDuration) => {
        let days = Math.floor(unixDuration / 60 / 60 / 24);
        let hours = Math.floor(unixDuration / 60 / 60 - 24 * days);
        let minutes = Math.floor(
          unixDuration / 60 - 24 * 60 * days - 60 * hours
        );
        let seconds =
          unixDuration - 24 * 60 * 60 * days - 60 * 60 * hours - 60 * minutes;
        let duration = "";

        if (hours < 10) hours = "0" + hours;
        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;
        unixDuration > 86400
          ? (duration = `${days} 天 ${hours}:${minutes}:${seconds}`)
          : (duration = `${hours}:${minutes}:${seconds}`);
        durationList.unshift(duration); // 放陣列第一個位置方便取得
        return duration;
      };

      const getLostCount = () => {
        // reset lostCount list
        $(".lostCount-list tr").remove();
        for (let d of unixDateTimeArr) {
          // 整理趟次
          if (d.accOn) tempAccOn.push(d);
          if (!d.accOn && tempAccOn.length !== 0) tempAccOff.push(d);
          if (tempAccOn.length !== 0 && tempAccOff.length !== 0) {
            /* 
            lostCountList.push({
              accOn: tempAccOn[0],
              accOff: tempAccOff[0],
              actualReceive: tempAccOn.length * 30,
            });
            */

            // 修正因 JAS208 熄火封包在下次開機才補傳
            lostCountList.push({
              accOn: tempAccOn[0],
              accOff: tempAccOn[tempAccOn.length - 1],
              actualReceive: tempAccOn.length * 30,
            });
            tempAccOn = [];
            tempAccOff = [];
          }
        }
        // 末筆封包當作末趟 ACC OFF
        lostCountList.push({
          accOn: tempAccOn[0],
          accOff: tempAccOn[tempAccOn.length - 1],
          actualReceive: tempAccOn.length * 30,
        });

        console.log(lostCountList);

        for (let d of lostCountList) {
          if (d.accOn == undefined || d.accOff == undefined) continue;
          // 印出趟次
          let unixDuration = (d.accOff.timeStamp - d.accOn.timeStamp) / 1000;
          let expectCount = unixDuration + 30;
          let lostCount = unixDuration - d.actualReceive;
          let lostCountPercentage = ((lostCount / unixDuration) * 100).toFixed(
            2
          );
          // fix -infinity & NaN
          lostCount < 0 ? (lostCount = 0) : (lostCount = lostCount);
          isNaN(lostCountPercentage) || lostCountPercentage < 0
            ? (lostCountPercentage = "0.00")
            : (lostCountPercentage = lostCountPercentage);

          getDuration(unixDuration);
          $(".lostCount-list").append(`
                  <tr>
                    <td>${d.accOn.dateTime}</td>
                    <td>${d.accOff.dateTime}</td>
                    <td>${durationList[0]}</td>
                    <td>${expectCount}</td>
                    <td>${d.actualReceive}</td>
                    <td>${lostCount}</td>
                    <td>${lostCountPercentage}%</td>
                  </tr>
                  `);
          sumUnixDuration += unixDuration;
          sumActualReceive += d.actualReceive;
          sumExpectCount += expectCount;
          sumLostCount += lostCount;
        }
        // 掉包率總計
        $(".lostCount-list").append(`
        <tr>
          <td colspan="2" class="text-right">總計：</td>
          <td>${getDuration(sumUnixDuration)}</td>
          <td>${sumExpectCount}</td>
          <td>${sumActualReceive}</td>
          <td>${sumLostCount}</td>
          <td>${((sumLostCount / sumUnixDuration) * 100).toFixed(2)}%</td>
        </tr>
        `);
      };

      const getStatistic = () => {
        console.log(noSpeedCount);

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
        // ACC ON 無車速比率
        $(".result .col:nth-of-type(5)").html(
          `${noSpeedCount} (${((noSpeedCount / count) * 100).toFixed(2)}%)`
        );
        // 掉包率 (掉包筆數 / 預期總筆數)
        $(".result .col:nth-of-type(6)").html(
          `(${((sumLostCount / sumUnixDuration) * 100).toFixed(2)}%)`
        );
      };
      let count = 0;
      let abSpotCount = 0;
      let gpsSignalCount = 0;
      let makeUpCount = 0;
      let expectCount = 0;
      let lostCount = 0;
      let noSpeedCount = 0;
      let unixDateTimeArr = [];
      let lostCountList = [];
      let tempAccOn = [];
      let tempAccOff = [];
      let durationList = [];
      let sumUnixDuration = 0;
      let sumActualReceive = 0;
      let sumExpectCount = 0;
      let sumLostCount = 0;

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
          <tr id="list-row-${count}">
            <td class="list-col">${d.imei}</td>
            <td class="list-col">${d.bus_id}</td>
            <td class="list-col">${d.imsi}</td>
            <td class="list-col">${d.driver_id}</td>
            <td id="dblclick" class="list-col">${dateTime}</td>
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
            $(`#list-row-${count}`)
              .css("background", "tomato")
              .addClass("text-body");
            gpsSignalCount++;
          }
          if (ioArr[0] === "0") {
            // 熄火
            $(`#list-row-${count}`)
              .css("background", "gray")
              .addClass("text-body");
          }
          if (unixInsertTime - unixDateTime > 180000) {
            // 補傳 3min
            $(`#list-row-${count}`)
              .css("background", "lightblue")
              .addClass("text-body");
            makeUpCount++;
          }
          if (
            count != 0 &&
            ioArr[0] === "1" &&
            unixDateTime - unixDateTimeArr[count - 1].timeStamp > 180000
          ) {
            // AB 點 3min
            $(`#list-row-${count}`)
              .css("background", "green")
              .addClass("text-body");
            $(`#list-row-${count - 1}`)
              .css("background", "green")
              .addClass("text-body");
            abSpotCount++;
          }
          if (ioArr[0] === "1" && d.speed === 0) {
            // ACC ON 無車速
            $(`#list-row-${count}`)
              .css("background", "palevioletred")
              .addClass("text-body");
            noSpeedCount++;
          }
          count++;
          expectCount =
            (unixDateTimeArr[unixDateTimeArr.length - 1].timeStamp -
              unixDateTimeArr[0].timeStamp) /
            1000;
          lostCount < 0
            ? (lostCount = 0)
            : (lostCount = expectCount - count * 30);
        }

        getLostCount();
        getStatistic();
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
          console.log(getData);
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
          // 事件訊息不要取結束字元 #
          let abnormalContent = d.abnormal_content.split("");
          abnormalContent == "#"
            ? (abnormalContent = "－")
            : (abnormalContent = abnormalContent.slice(0, -1).join(""));

          $(".list-table").append(`
          <tr id="list-row-${count}">
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
            <td class="list-col">${abnormalContent}</td>
          </tr>
          `);

          // function validation
          if (d.gps_signal !== "A") {
            // 定位失效
            $(`#list-row-${count}`).css("background", "tomato");
          }
          if (unixInsertTime - unixDateTime > 180000) {
            // 補傳 3min
            $(`#list-row-${count}`).css("background", "lightblue");
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
          console.log(getData);
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
          <tr id="list-row-${count}">
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
      let get30sData = [];
      let thisRowCount = $(this).attr("id").split("-").reverse().shift();
      let thisRowDateTime = getData[thisRowCount].date_time;
      reqData.thisRowDateTime = thisRowDateTime;

      // jq ajax
      $.ajax({
        async: false,
        type: "post",
        url: "/api/get30sLog.php",
        data: reqData,
        dataType: "json",
        success: function (res) {
          // get30sData = res[0].reverse();
          get30sData = res[0];
          console.log(get30sData);
        },
        error: function (err) {
          console.log(err.status + err.responseText);
        },
      });
      // create 30s list
      for (let i = 0; i < get30sData.length; i++) {
        $(`.list-row-${thisRowCount}-${i + 1}s`).remove();

        let prefix = get30sData[i];
        let dateTimeUnix = new Date(prefix.date_time).getTime();
        let insertTimeUnix = new Date(prefix.insert_time).getTime();
        let dateTime = new Date(dateTimeUnix + utc8ms).toLocaleString();
        let insertTime = new Date(insertTimeUnix + utc8ms).toLocaleString();
        let ioArr = prefix.io.split("");

        $(`#list-row-${thisRowCount}`).before(`
        <tr class="list-row-${thisRowCount}-${i + 1}s">
          <td class="list-col">${prefix.imei}</td>
          <td class="list-col">${prefix.bus_id}</td>
          <td class="list-col">${prefix.imsi}</td>
          <td class="list-col">${prefix.driver_id}</td>
          <td class="list-col">${dateTime}</td>
          <td class="list-col">${insertTime}</td>
          <td class="list-col">${prefix.gps_signal}</td>
          <td class="list-col">${prefix.csq}</td>
          <td class="list-col">${prefix.gps}</td>
          <td class="list-col">${prefix.mileage}</td>
          <td class="list-col">${prefix.longitude}</td>
          <td class="list-col">${prefix.latitude}</td>
          <td class="list-col">${prefix.direction}</td>
          <td class="list-col">${prefix.speed}</td>
          <td class="list-col">${prefix.rpm}</td>
          <td class="list-col">${prefix.gps_speed}</td>
          <td class="list-col">${prefix.io}</td>
          <td class="list-col">${prefix.device_status}</td>
        </tr>
        `);
        // 熄火 or 明細
        ioArr[0] === "0"
          ? $(`.list-row-${thisRowCount}-${i + 1}s`)
              .css("background", "gray")
              .addClass("text-body")
          : $(`.list-row-${thisRowCount}-${i + 1}s`)
              .css("background", "lightgoldenrodyellow")
              .addClass("text-body");
      }
    });
  });
});
