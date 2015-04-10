<?php
require_once '../init-env.php';

header('Content-Type: image/png');
echo Resource_Images::read_image_data($_GET['id']);
exit();

?>