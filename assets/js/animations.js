// sole che cambia rotazione
$("#logo").mouseenter(function() {
   $(this).removeClass().addClass("counter-spin");
});
$("#logo").mouseleave(function() {
	 $(this).removeClass().addClass("spin");
});

// rotazione tasto refresh
$("body").on("mouseenter","#refresh_weather", function() {
   $("#refresh_weather i").addClass("fa-spin");
});
$("body").on("mouseleave","#refresh_weather", function() {
	 $("#refresh_weather i").removeClass("fa-spin");
});