<?php

if (!isset($_POST)) exit("Accesso non consentito");


// aggiungere cache

$url="https://api.mapbox.com/geocoding/v5/mapbox.places/%lng%,%lat%.json?access_token=pk.eyJ1IjoiZ2lvcmdpb2N1dHVnbm8iLCJhIjoiY2lvM3pnM2hhMDAxM3U2a245bm1iMHN1ZiJ9.JutrqzHCPQ-3lk9hWKcJog";
$cosa=array("%lat%","%lng%");
$con=array($_POST['lat'],$_POST['lng']);
$url=str_replace($cosa,$con,$url);

$ch = curl_init($url);     
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);         

/* chiamata */									
if (!$result = curl_exec($ch)) {
	$error=curl_error($ch);
}

/* chiusura */
curl_close($ch);

if ($result) {
	echo $result;
	 // contiene info su luogo (https://www.mapbox.com/api-documentation/?language=JavaScript#response-format)		
}else{
	http_response_code(500);
	echo $error;
}

?>