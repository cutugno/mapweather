$("#logo").hover(
  function() {
	$(this).removeClass().addClass("counter-spin");
  }, function() {
	$(this).removeClass().addClass("spin");
  }
);