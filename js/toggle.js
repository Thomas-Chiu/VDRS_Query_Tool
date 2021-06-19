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
});
