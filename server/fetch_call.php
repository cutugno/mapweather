<?php

$cache=new Memcached();
$cache->addServer("127.0.0.1", 11211);
echo "Contenuto cache: <br />";
var_dump ($cache->fetchAll());

?>