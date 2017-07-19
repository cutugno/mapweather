<?php

	if (!isset($_GET)) die();

	$route=array_keys($_GET)[0];

	echo $route;

?>