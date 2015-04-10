<?php

require_once '../../init-env.php';
if (isset($_GET['id']) && $_GET['id'] != '') {
    $image = Resource_Images::read_image_metadata($_GET['id']);
    echo json_encode($image);
}else if (isset($_POST["submit"])) {
    $formOk = true;

    $path = $_FILES["image"]["tmp_name"];
    $name = $_FILES["image"]["name"];

    if ($_FILES['image']['error'] || !is_uploaded_file($path)) {
        $formOk = false;
    }

    if ($formOk) {
        $content = file_get_contents($path);
        $image = Resource_Images::save_image($name, $content);
        header("location:/editor#/images/" . $image->id);
    }else{
        header("location:/editor#/images");
    }
} else {
    $images = Resource_Images::read_images_metadata();
    echo json_encode($images->getArrayCopy());
}
?>
