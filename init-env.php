<?php

    function __autoload($class){
        $class_split = split("_", $class);
        $class_path = "backend/lib/";
        for($i=0;$i<count($class_split)-1;$i++){
            $class_path .= $class_split[$i] . "/";
        }
        $class_path .= "class." . $class_split[$i] . ".php";
        require_once($class_path);
    }

    require_once 'config.php';
    
?>