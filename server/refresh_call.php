<?php

if (!isset($_POST)) die();

$cache=new Memcached();
$cache->addServer("127.0.0.1", 11211);
$cache_key="weather_".$_POST['lng']."_".$_POST['lat'];

echo $cache->delete($cache_key) ? "valore cache cancellato" : "valore cache non cancellato";

?>