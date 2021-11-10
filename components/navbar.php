<nav class="navbar navbar-expand-md navbar-dark">
  <a class="navbar-brand" href="../index.php">燒機查詢工具</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#nav_menu">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div id="nav_menu" class="navbar-collapse collapse">
    <ul class="navbar-nav m-auto text-white-50">
      <li class="custom-control custom-radio custom-control-inline">
        <input type="radio" id="log" name="queryType" value="log" class="custom-control-input" checked>
        <label class="custom-control-label" for="log">LOG</label>
      </li>
      <li class="custom-control custom-radio custom-control-inline">
        <input type="radio" id="data" name="queryType" value="data" class="custom-control-input">
        <label class="custom-control-label" for="data">DATA</label>
      </li>
      <li class="custom-control custom-radio custom-control-inline">
        <input type="radio" id="chk" name="queryType" value="chk" class="custom-control-input">
        <label class="custom-control-label" for="chk">CHK</label>
      </li>
      <li id="btn_toggle">
        <i class="bi bi-toggle-off"></i>
        <span> 淺色模式 </span>
      </li>
    </ul>
  </div>
</nav>