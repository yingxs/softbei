<?php
require COMMON.'MySQLPDO.class.php';

class IndexDao extends MySQLPDO{

    //构造方法
    public function __construct(){
        parent::__construct();
    }

    public function init(){
        $result = parent::fetchAll("select id,qf_city_xy,mb_city_xy from t_flight_info2");
        //显示原始数据
        //show($result);

        //返回数据
        $data = Array(
                    'start'=>'0',           //状态码，0表示成功，1表示失败
                    'msg'=>'',              //信息
                    'lineData'=>array()     //曲线数据
                );


        //封装曲线数据
        foreach($result as $v){
            $id=0;
            foreach($v as $kk=>$vv){
                if($kk=='id'){
                    $data['lineData'][$vv] = Array();
                    $id = $vv;
                }else{
                     $data['lineData'][$id][$kk]=$vv;
                }
            }
        }

        //show( $data['lineData']);
        //echo json_encode($data);

        return $data;
    }


}




