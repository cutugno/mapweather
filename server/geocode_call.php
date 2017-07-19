<?php

if (!isset($_POST)) exit("Accesso non consentito");

// init cache
$cache=new Memcached();
$cache->addServer("127.0.0.1", 11211);
$cache_key="geocode_".$_POST['lng']."_".$_POST['lat'];

// controllo risultato in cache
if ($cached=$cache->get($cache_key)) {
	echo $cached;
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
	 // contiene info su luogo (https://www.mapbox.com/api-documentation/?language=JavaScript#response-format)		
}else{
	http_response_code(500);
	echo $error;
}

?>