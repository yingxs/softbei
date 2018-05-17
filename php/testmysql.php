<?php
    require './MySQLPDO.class.php';
    $dbConfig = [
    	'db'=>'mysql',
    	'host'=>'127.0.0.1',
    	'port'=>'3308',
    	'user'=>'root',
    	'password'=>'123456',
    	'charset'=>'utf8',
    	'dbname'=>'softbei'
    ] ;

    $db = new MySQLPDO();
    echo '<pre>';
    print_r($db->fetchAll('select city_name_zh from t_city '));

?>