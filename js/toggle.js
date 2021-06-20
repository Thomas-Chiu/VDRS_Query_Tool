$(function () {
  // go top
  $("#gotop").click(function () {
    jQuery("html,body").animate({ scrollTop: 0 }, 1000);
  });

  $(window).scroll(function () {
    if ($(this).scrollTop() > 200) $("#gotop").fadeIn("fast").show();
    else $("#gotop").stop().fadeOut("fast");
  });

  // dark/light theme
  $("#btn_toggle").click(function () {
    $("body, .modal-content").toggleClass("bg-dark");
    $("body, .modal-content").addClass("bg-light");
    $("nav").toggleClass("navbar-dark");
    $("nav").addClass("navbar-light");
    $("thead").toggleClass("thead-light");
    $("thead").addClass("thead-dark");
    $("input[type='reset']").toggleClass("btn-outline-warning");
    $("input[type='reset']").addClass("btn-outline-secondary");
    $("tbody").toggleClass("text-white");
    $(".statistic .row").toggleClass("border-secondary");
    $(".navbar-nav, .container, .modal-title").toggleClass("text-white-50");
    $("#btn_toggle .bi").toggleClass("bi-toggle-on");

    // if (toggleLight) {
    //   $("body").removeClass("bg-dark");
    //   $("nav").removeClass("bg-dark").addClass("text-");
    // } else {
    //   $("body").addClass("bg-dark");
    //   $("nav").addClass("bg-dark");
    // }
  });
});
