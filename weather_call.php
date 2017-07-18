<?php

if (!isset($_POST)) exit("Accesso non consentito");


// aggiungere cache

$url="https://api.darksky.net/forecast/44236bd1e16e74455afa4598ad449fa3/%lat%,%lng%?lang=it&units=si&exclude=[flags]";
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
}else{
	http_response_code(500);
	echo $error;
}

?>
