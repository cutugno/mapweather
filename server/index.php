<?php

	if (!isset($_GET)) die();

	$route=array_keys($_GET)[0];

	switch ($route) {
		case "flush":
			require_once "flush_call.php";
			break;

		case "weather":
			require_once "weather_call.php";
			break;

		case "geocode":
			require_once "geocode_call.php";
			break;

		case "token":
			require_once"token_call.php";
			break;

		case "refresh":
			require_once"refresh_call.php";
			break;
	}

	function writelog($content) {
		$handle=fopen("log/mapweather.log","a+");
		fwrite($handle,$content);
		fclose($handle);
	}

?>