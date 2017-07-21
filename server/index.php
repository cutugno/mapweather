<?php

	function write_log($content) {
		$userip=$_SERVER['REMOTE_ADDR'];
		$ts=date("Y-m-d H:i:s");

		$handle=fopen("log/mapweather.log","a+");
		$content="$userip | $ts | $content\n";
		fwrite($handle,$content);
		fclose($handle);
	}

	if (!isset($_GET)) exit("Accesso non consentito");

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
			phpinfo();
			break;
	}

?>