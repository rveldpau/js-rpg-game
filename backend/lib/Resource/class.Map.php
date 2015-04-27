<?php

class Resource_Map {

    public $name;
    private $dataProxy;

    public function __construct($name, $dataProxy) {
        $this->name = $name;
        $this->dataProxy = $dataProxy;
    }

    function getName() {
        return $this->name;
    }

    function getData() {
        return $this->dataProxy->get();
    }

}

?>