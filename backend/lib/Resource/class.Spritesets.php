<?php

class Resource_Spritesets {

    public static function read_spritesets_metadata() {
        $gamedb = Game_Database::getInstance();
        $dbResults = $gamedb->execute("select name from SpriteSets order by name;");
        $images = new ArrayObject();
        $dbRowCount = mysqli_num_rows($dbResults);
        while ($row = mysqli_fetch_array($dbResults, MYSQL_NUM)) {
            $curImage = new Resource_Spriteset($row[0], Resource_Proxy::create_database_read_proxy("select data from SpriteSets where name=':1'", $row[0]));
            $images->append($curImage);
        }
        return $images;
    }

    public static function read_spriteset_metadata($name) {
        $gamedb = Game_Database::getInstance();
        $dbResults = $gamedb->execute("select name from SpriteSets where name=':1' order by name;", $name);
        if ($row = mysqli_fetch_array($dbResults, MYSQL_NUM)) {
            $curImage = new Resource_Spriteset($row[0], Resource_Proxy::create_database_read_proxy("select data from SpriteSets where id=':1'", $row[0]));
            return $curImage;
        }
        throw new Exception("Spriteset with the specified ID does not exist");
    }

    public static function read_spriteset_data($id) {
        if (!isset($id) || $id == '') {
            return null;
        }
        $gamedb = Game_Database::getInstance();
        $dbResults = $gamedb->execute("select data from SpriteSets where name=':1';", $id);
        if ($row = mysqli_fetch_array($dbResults)) {
            return $row[0];
        }
        throw new Exception("SpriteSet not found");
    }

    public static function save_spriteset($spritesetJson) {
        if (!$spritesetJson) {
            throw new Exception("No data submitted");
        }

        $spriteset = json_decode($spritesetJson);
        if (!isset($spriteset->name)) {
            throw new Exception("Submitted spriteset does not have a name");
        }

        $gamedb = Game_Database::getInstance();
        
        if(Resource_Spritesets::spriteset_exists($spriteset->name)){
            $sql = "update SpriteSets set data=':2' where name=':1'";
        }else{
            $sql = "insert into SpriteSets(name,data) values(':1',':2')";
        }
        $gamedb->execute($sql, $spriteset->name, $spritesetJson);
    }

    private static function spriteset_exists($id) {
        try {
            Resource_Spritesets::read_spriteset_metadata($id);
            return true;
        } catch (Exception $ex) {
            return false;
        }
    }

}

?>