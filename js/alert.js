$(function () {
  Swal.fire({
    title: "請選擇要查詢的資料庫",
    showDenyButton: true,
    confirmButtonText: "47 VDRS",
    denyButtonText: "50 燒機",
    confirmButtonColor: "#ffc107",
    denyButtonColor: "#ffc107",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("Saved!", "", "success");
    } else if (result.isDenied) {
      Swal.fire("Changes are not saved", "", "info");
    }
  });
});
