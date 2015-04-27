<?php

class Resource_Maps {

    public static function read_maps_metadata() {
        $gamedb = Game_Database::getInstance();
        $dbResults = $gamedb->execute("select name from Maps order by name;");
        $images = new ArrayObject();
        $dbRowCount = mysqli_num_rows($dbResults);
        while ($row = mysqli_fetch_array($dbResults, MYSQL_NUM)) {
            $curImage = new Resource_Map($row[0], Resource_Proxy::create_database_read_proxy("select data from Maps where name=':1'", $row[0]));
            $images->append($curImage);
        }
        return $images;
    }

    public static function read_map_metadata($name) {
        $gamedb = Game_Database::getInstance();
        $dbResults = $gamedb->execute("select name from Maps where name=':1' order by name;", $name);
        if ($row = mysqli_fetch_array($dbResults, MYSQL_NUM)) {
            $curImage = new Resource_Map($row[0], Resource_Proxy::create_database_read_proxy("select data from Maps where id=':1'", $row[0]));
            return $curImage;
        }
        throw new Exception("Map with the specified ID does not exist");
    }

    public static function read_map_data($id) {
        if (!isset($id) || $id == '') {
            return null;
        }
        $gamedb = Game_Database::getInstance();
        $dbResults = $gamedb->execute("select data from Maps where name=':1';", $id);
        if ($row = mysqli_fetch_array($dbResults)) {
            return $row[0];
        }
        throw new Exception("Maps not found");
    }

    public static function save_map($mapJson) {
        if (!$mapJson) {
            throw new Exception("No data submitted");
        }

        $map = json_decode($mapJson);
        if (!isset($map->name)) {
            throw new Exception("Submitted map does not have a name");
        }

        $gamedb = Game_Database::getInstance();
        
        if(Resource_Maps::map_exists($map->name)){
            $sql = "update Maps set data=':2' where name=':1'";
        }else{
            $sql = "insert into Maps(name,data) values(':1',':2')";
        }
        $gamedb->execute($sql, $map->name, $mapJson);
    }

    private static function map_exists($id) {
        try {
            Resource_Maps::read_map_metadata($id);
            return true;
        } catch (Exception $ex) {
            return false;
        }
    }

}

?>