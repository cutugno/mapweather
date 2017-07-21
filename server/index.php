<?php

	if (!isset($_GET)) die();

	$route=array_keys($_GET)[0];

	switch ($route) {
		case "flush": // svuoto cache
			require_once "flush_call.php";
			break;

		case "weather": // chiamo servizio meteo darksky
			require_once "weather_call.php";
			break;

		case "geocode": // chiamo geocoding mapbox
			require_once "geocode_call.php";
			break;

		case "token": // leggo token mapbox da file
			require_once "token_call.php";
			break;

		case "refresh": // aggiorno meteo
			require_once "refresh_call.php";
			break;

		case "info": // phpinfo
			require_once "fetch_call.php";
			phpinfo();
			break;
	}

	function writelog($content) {
		$handle=fopen("log/mapweather.log","a+");
		fwrite($handle,$content);
		fclose($handle);
	}

?>