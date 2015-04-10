<?php
require_once '../../init-env.php';
header('Content-Type: application/json');
if (isset($_GET['id']) && $_GET['id'] != '') {
    $spriteset = Resource_Spritesets::read_spriteset_data($_GET['id']);
    echo $spriteset;
} else if ($_SERVER['REQUEST_METHOD'] == "POST") {
    try {
        Resource_Spritesets::save_spriteset($HTTP_RAW_POST_DATA);
        ?>
        { "success":true, "message":"" }
        <?php
    } catch (Exception $ex) {
        ?>{ "success":false, "message":<?php echo json_encode($ex->getMessage()); ?> }<?php
    }
} else {
    $images = Resource_Spritesets::read_spritesets_metadata();
    echo json_encode($images->getArrayCopy());
}
?>
