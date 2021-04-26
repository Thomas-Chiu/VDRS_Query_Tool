$(function () {
  let getData = [];
  let reqData = {};

  $("#btn_submit").click(function (e) {
    e.preventDefault();

    reqData.busId = $("#busId").val();
    reqData.startDate = $("#startDate").val();
    reqData.startTime = $("#startTime").val();
    reqData.endDate = $("#endDate").val();
    reqData.endTime = $("#endTime").val();

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
        console.log(err.status + err.responseText);
      },
    });

    // create log-table
    for (let d of getData) {
      let count = 0;
      $(".log-table").append(`
      <tr class="log-row-${count}">
        <td class="log-col">${d.busId}</td>
        <td class="log-col">${d.imei}</td>
        <td class="log-col">${d.imsi}</td>
        <td class="log-col">${d.driver_id}</td>
        <td class="log-col">${d.date_time}</td>
        <td class="log-col">${d.insert_time}</td>
        <td class="log-col">${d.gps_signal}</td>
        <td class="log-col">${d.gps}</td>
        <td class="log-col">${d.csq}</td>
        <td class="log-col">${d.mileage}</td>
        <td class="log-col">${d.longitude}</td>
        <td class="log-col">${d.latitude}</td>
        <td class="log-col">${d.speed}</td>
        <td class="log-col">${d.rpm}</td>
        <td class="log-col">${d.gpsSpeed}</td>
        <td class="log-col">${d.io}</td>
      </tr>
      `);
      count++;
    }
  });
});
