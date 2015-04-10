<?php

class Game_Database extends DataAccess_DBConnection {

    private static $instance = null;

    public static function getInstance() {
        if (null === self::$instance) {
            self::$instance = new Game_Database();
        }
        return self::$instance;
    }

    private function __clone() {
        
    }

    private function __wakeup() {
        
    }

    public function __construct() {
        if (!self::$instance) {
            parent::__construct(DB_USER, DB_PASSWORD, DB_NAME, DB_HOST);
            self::$instance = $this;
            return self::$instance;
        } else {
            return self::$instance;
        }
    }

}

?>