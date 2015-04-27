<?php
require_once '../../init-env.php';
header('Content-Type: application/json');
if (isset($_GET['id']) && $_GET['id'] != '') {
    $map = Resource_Maps::read_map_data($_GET['id']);
    echo $map;
} else if ($_SERVER['REQUEST_METHOD'] == "POST") {
    try {
        Resource_Maps::save_map($HTTP_RAW_POST_DATA);
        ?>
        { "success":true, "message":"" }
        <?php
    } catch (Exception $ex) {
        ?>{ "success":false, "message":<?php echo json_encode($ex->getMessage()); ?> }<?php
    }
} else {
    $images = Resource_Maps::read_maps_metadata();
    echo json_encode($images->getArrayCopy());
}
?>
