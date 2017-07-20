<?php

$cache=new Memcached();
$cache->addServer("127.0.0.1", 11211);
if ($cache->flush()) {
	echo "Cache flushed";
}else{
	echo "Cache not flushed";
}

?>