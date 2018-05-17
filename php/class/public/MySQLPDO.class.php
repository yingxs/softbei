<?php

    class MySQLPDO{
        protected static $db = null;
        public function __construct(){
            self::$db || self::_connect();
        }

        private function __clone(){}

        //����Ŀ�������(ֻ����һ��)
        private static function _connect(){
            $config = $GLOBALS['db_config'];
            print_r($config);
            //׼��PDO��DNS������Ϣ
            $dsn = "{$config['db']}:host={$config['host']};port={$config['port']};dbname={$config['dbname']};charset={$config['charset']}";
            try {
                self::$db = new PDO($dsn,$config['user'],$config['password']);
            } catch (Exception $e) {
                exit("���ݿ�����ʧ��:".$e->getMessage());
            }
        }
        
        
        public function quert($sql,$data=[]){
            //ͨ��Ԥ����ʽִ��sql
            $stmt = self::$db->prepare($sql);
            is_array(current($data)) || $data = [$data];
            foreach ($data as $v){
                if(false === $stmt->execute($v)){
                    exit("���ݿ����ʧ�ܣ�".implode('-',$stmt->errorInfo()));
                }
            }
            return $stmt;
        }
        
        //ִ��SQL��������Ӱ�������
        public function exec($sql,$data=[]){
            return $this->quert($sql,$data)->rowCount();
        }
        
        //ȡ�����н��
        public function fetchAll($sql,$data=[]){
            return $this->quert($sql,$data)->fetchAll(PDO::FETCH_ASSOC);
        }
        
        //ȡ��һ�н��
        public function fetchRow($sql,$data=[]){
            return $this->quert($sql,$data)->fetch(PDO::FETCH_ASSOC);
        }
        
        //ȡ��һ�н��
        public function fetchColumn($sql,$data=[]){
            return $this->quert($sql,$data)->fetchColumn();
        }
        
        //�����µ�ID
        public function lastInsertId(){
            return self::$db->lastInsertId();
        }
        
        
        
    }

?>