<?php

    class MySQLPDO{
        protected static $db = null;
        public function __construct(){
            self::$db || self::_connect();
        }

        private function __clone(){}

        //连接目标服务器(只构造一次)
        private static function _connect(){

            $config = C('DB_CONFIG');
            //print_r($config);
            //准备PDO的DNS连接信息
            $dsn = "{$config['db']}:host={$config['host']};port={$config['port']};dbname={$config['dbname']};charset={$config['charset']}";
            try {
                self::$db = new PDO($dsn,$config['user'],$config['password']);
            } catch (Exception $e) {
                //echo iconv('gbk', 'utf-8', $e->getMessage());
                exit("数据库连接失败:".iconv('gbk', 'utf-8', $e->getMessage()));
            }
        }
        
        
        public function quert($sql,$data=[]){
            //通过预处理方式执行sql
            $stmt = self::$db->prepare($sql);
            is_array(current($data)) || $data = [$data];
            foreach ($data as $v){
                if(false === $stmt->execute($v)){
                    exit("数据库操作失败：".implode('-',$stmt->errorInfo()));
                }
            }
            return $stmt;
        }
        
        //执行SQL，返回受影响的行数
        public function exec($sql,$data=[]){
            return $this->quert($sql,$data)->rowCount();
        }
        
        //取得所有结果
        public function fetchAll($sql,$data=[]){
            return $this->quert($sql,$data)->fetchAll(PDO::FETCH_ASSOC);
        }
        
        //取得一行结果
        public function fetchRow($sql,$data=[]){
            return $this->quert($sql,$data)->fetch(PDO::FETCH_ASSOC);
        }
        
        //取得一列结果
        public function fetchColumn($sql,$data=[]){
            return $this->quert($sql,$data)->fetchColumn();
        }
        
        //最后更新的ID
        public function lastInsertId(){
            return self::$db->lastInsertId();
        }
        
        
        
    }

?>