<?php
class Resource_Image{
    public $id;
    public $name;
    private $dataProxy;
    
    public function __construct($id, $name, $dataProxy) {
        $this->id = $id;
        $this->name = $name;
        $this->dataProxy = $dataProxy;
    }
    function getId() {
        return $this->id;
    }

    function getName() {
        return $this->name;
    }

    function getData(){
        return $this->dataProxy->get();
    }
}
?>