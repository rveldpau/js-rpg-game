<?php
class Resource_Proxy{
    private $loadFunction;
    function __construct($loadFunction){
        $this->loadFunction = $loadFunction;
    }
    
    public function get(){
        return $this->loadFunction();
    }
    
    public static function create_database_read_proxy($sql,...$params) {
        $proxy = new Resource_Proxy(function() {
            $result = $gamedb->execute($sql,$params);
            return $result[0];
        });
        return $proxy;
    }
    
    public static function create_file_read_proxy($file) {
        $proxy = new Resource_Proxy(function(){
            return file_get_contents($file);
        });
        return $proxy;
    }
    
    public static function create_memory_read_proxy($data) {
        $proxy = new Resource_Proxy(function(){
            return $data;
        });
        return $proxy;
    }
}
?>