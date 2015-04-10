<?php

class DataAccess_DBConnection {
	private $dbuser;
	private $dbpassword;
	private $dbname;
	private $dbhost;
        
        private $dbHandle;
    
    
    public function __construct($dbuser, $dbpassword, $dbname, $dbhost) {
        $this->dbhost = $dbhost;
        $this->dbname = $dbname;
        $this->dbuser = $dbuser;
        $this->dbpassword = $dbpassword;
        
        $this->db_connect();
    }
    
    public function db_connect(){
        $this->dbHandle = mysqli_init();
        mysqli_real_connect($this->dbHandle, $this->dbhost, $this->dbuser,$this->dbpassword, $this->dbname);
        if($this->dbHandle->connect_errno){
            throw new Exception('Could not connect to database');
        }
    }
    
    private function executeInternal($query){
        if($this->dbHandle==NULL){
            $this->db_connect();
        }
        mysqli_ping($this->dbHandle);
        $results = mysqli_query( $this->dbHandle, $query );
        if(mysqli_errno($this->dbHandle)){
            throw new Exception('Error executing ' . $query . ' because ' . mysqli_error($this->dbHandle));
        }
        return $results;
    }
    
    public function execute($query, ...$param){
        $safeQuery = $query;
        for($i=0;$i< count($param);$i++){
            $safeQuery = str_replace(":" .($i+1), $this->escapeData($param[$i]), $safeQuery);
        }
        
        return $this->executeInternal($safeQuery);
    }
    
    public function getLastInsertId(){
        return $this->dbHandle->insert_id;
    }
    
    public function escapeData($data){
        return mysqli_real_escape_string($this->dbHandle,$data);
    }

    public function toString(){
        return "Connection to {$this->dbhost}, {$this->dbuser}, {$this->dbname}";
    }
    
}
?>