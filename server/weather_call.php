<?php

// echo file_get_contents("weather.json");exit();

if (!isset($_POST)) exit("Accesso non consentito");

// init cache
$cache=new Memcached();
$cache->addServer("127.0.0.1", 11211);

// approssimo cordinate a 3 cifre decimali
$lng=round($_POST['lng'],3);
$lat=round($_POST['lat'],3);

// controllo risultato in cache
$cache_key="weather_$lng_$lat";
if ($cached=$cache->get($cache_key)) {
	echo $cached;
	write_log("caricati da cache dati meteo coordinate ($lng,$lat)");
	exit();
}

// preparo url darksky
$url="https://api.darksky.net/forecast/44236bd1e16e74455afa4598ad449fa3/%lat%,%lng%?lang=it&units=si&exclude=[flags]";
$cosa=array("%lat%","%lng%");
$con=array($lat,$lng);
$url=str_replace($cosa,$con,$url);

// chiamata cUrl
$ch = curl_init($url);     
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);         								
if (!$result = curl_exec($ch)) {
	$error=curl_error($ch);
}
curl_close($ch);

// echo
if ($result) {
	// salvo in cache
	$cache->set($cache_key,$result,1800);
	echo $result;
	write_log("caricati da darksky e salvati in cache dati meteo coordinate ($lng,$lat)");
}else{
	http_response_code(500);
	echo $error;
	write_log("errore API darksky [$error]");
}

?>
