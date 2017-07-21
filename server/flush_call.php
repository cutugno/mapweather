<?php

$cache=new Memcached();
$cache->addServer("127.0.0.1", 11211);
echo $cache->flush() ? "Cache svuotata" : "Cache non svuotata";
write_log("cache svuotata");

?>