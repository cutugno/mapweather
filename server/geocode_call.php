<?php

if (!isset($_POST)) exit("Accesso non consentito");

// init cache
$cache=new Memcached();
$cache->addServer("127.0.0.1", 11211);

// approssimo cordinate a 4 cifre decimali
$lng=round($_POST['lng'],4);
$lat=round($_POST['lat'],4);

// controllo risultato in cache
$cache_key="geocode_$lng_$lat";
if ($cached=$cache->get($cache_key)) {
	echo $cached;
	write_log("caricati da cache dati geocode coordinate ($lng,$lat)");
	exit();
}

// preparo url mapbox
$url="https://api.mapbox.com/geocoding/v5/mapbox.places/%lng%,%lat%.json?access_token=pk.eyJ1IjoiZ2lvcmdpb2N1dHVnbm8iLCJhIjoiY2lvM3pnM2hhMDAxM3U2a245bm1iMHN1ZiJ9.JutrqzHCPQ-3lk9hWKcJog";
$cosa=array("%lat%","%lng%");
$con=array($_POST['lat'],$_POST['lng']);
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
	write_log("caricati da mapbox e salvati in cache dati geocode coordinate ($lng,$lat)");
	 // contiene info su luogo (https://www.mapbox.com/api-documentation/?language=JavaScript#response-format)		
}else{
	http_response_code(500);
	echo $error;
	write_log("errore API mapbox [$error]");
}

?>