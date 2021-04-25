$(document).ready(function () {
  // jq ajax
  $.ajax({
    type: "get",
    url: "/api/getLog.php",
    // data: "data",
    dataType: "json",
    success: function (res) {
      console.log(res);
    },
    error: function (err) {
      console.log(err);
    },
  });
});
