<?php

if (!isset($_POST)) exit("Accesso non consentito");


$file="mapbox.tok";
echo file_get_contents($file);

?>