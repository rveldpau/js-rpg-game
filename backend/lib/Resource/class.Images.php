<?php

class Resource_Images {

    public static function read_images_metadata() {
        $gamedb = Game_Database::getInstance();
        $dbResults = $gamedb->execute("select id, name from Images order by name;");
        $images = new ArrayObject();
        $dbRowCount = mysqli_num_rows($dbResults);
        while ($row = mysqli_fetch_array($dbResults, MYSQL_NUM)) {
            $curImage = new Resource_Image($row[0], $row[1], Resource_Proxy::create_database_read_proxy("select data from Images where id=:1",$row[0]));
            $images->append($curImage);
        }
        return $images;
    }
    
    public static function read_image_metadata($id) {
        $gamedb = Game_Database::getInstance();
        $dbResults = $gamedb->execute("select id, name from Images where id=:1 order by name;",$id);
        if ($row = mysqli_fetch_array($dbResults, MYSQL_NUM)) {
            $curImage = new Resource_Image($row[0], $row[1], Resource_Proxy::create_database_read_proxy("select data from Images where id=:1",$row[0]));
            return $curImage;
        }
        return null;
    }

    public static function read_image_data($id) {
        if(!isset($id) || $id==''){
            return null;
        }
        $gamedb = Game_Database::getInstance();
        $dbResults = $gamedb->execute("select data from Images where id=:1;",$id);
        if ($row = mysqli_fetch_array($dbResults)) {
            return $row[0];
        }
        throw new Exception("Image not found");
    }

    public static function save_image($name, $content) {
        if (!$name) {
            return null;
        }

        $gamedb = Game_Database::getInstance();
        $sql = "insert into Images(name,data) values(':1',':2')";
        $gamedb->execute($sql,$name,$content);
        $id = $gamedb->getLastInsertId();
        return Resource_Images::read_image_metadata($id);
    }

}

?>