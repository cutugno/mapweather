// sole che cambia rotazione
$("#logo").hover(
  function() {
	$(this).removeClass().addClass("counter-spin");
  }, function() {
	$(this).removeClass().addClass("spin");
  }
);

// rotazione tasto refresh
$("#refresh_weather").hover(
  function() {
	$("#refresh_weather i").addClass("fa-spin");
  }, function() {
	$("#refresh_weather i").removeClass("fa-spin");
  }
);