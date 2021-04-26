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
    console.log(reqData);

    // jq ajax
    $.ajax({
      async: false,
      type: "post",
      url: "/api/getLog.php",
      data: reqData,
      dataType: "json",
      success: function (res) {
        getData = res;
      },
      error: function (err) {
        console.log(err.status + err.responseText);
      },
    });

    // create log-row
    for (let i = 0; i < getData.length; i++) {
      $("tbody").append("<tr class='log-row'></tr>");
    }

    // create log-col
    for (let i = 0; i < Object.keys(getData[0]).length; i++) {
      $(".log-row").append(`<td class='log-col-${i}'></td>`);
      for (d in getData[i]) {
        $(`.log-col-0`).html(getData[i].busId);
        $(`.log-col-1`).html(getData[i].imei);
        $(`.log-col-2`).html(getData[i].imsi);
        $(`.log-col-3`).html(getData[i].driver_id);
        $(`.log-col-4`).html(getData[i].date_time);
        $(`.log-col-5`).html(getData[i].insert_time);
        $(`.log-col-6`).html(getData[i].gps_signal);
        $(`.log-col-7`).html(getData[i].gps);
        $(`.log-col-8`).html(getData[i].csq);
        $(`.log-col-9`).html(getData[i].mileage);
        $(`.log-col-10`).html(getData[i].longitude);
        $(`.log-col-11`).html(getData[i].latitude);
        $(`.log-col-12`).html(getData[i].speed);
        $(`.log-col-13`).html(getData[i].rpm);
        $(`.log-col-14`).html(getData[i].gpsSpeed);
        $(`.log-col-15`).html(getData[i].io);
      }
    }
  });
});
