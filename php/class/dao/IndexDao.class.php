<?php
require COMMON.'MySQLPDO.class.php';

class IndexDao extends MySQLPDO{

    //构造方法
    public function __construct(){
        parent::__construct();
    }

    //查询默认选项类型
    public function QueryType(){
        return parent::fetchAll("SELECT `id`,`type`,`default` FROM query_type");
    }

    //查询航班号
    public function queryFlight_code($array){
        $qf_column = parent::fetchColumn("select `column` from `query_type` where `id`=:qf_type",["qf_type"=>$array[0]]);
        $mb_column = parent::fetchColumn("select `column` from `query_type` where `id`=:qf_type",["qf_type"=>$array[2]]);
        $qf_column = "qf_".$qf_column;
        $mb_column = "mb_".$mb_column;
        //show($array);
        //echo $qf_column."<br/>";
        //echo $mb_column."<br/>";

        $array = parent::fetchAll("SELECT `flight_number` FROM `m_flight` WHERE $qf_column LIKE '%$array[1]%' AND $mb_column LIKE '%$array[3]%' ");
        show($array);

    }

    //根据选项类型查询机场/国家/省份
    public function queryName($array){

         $column = parent::fetchColumn("select `column` from `query_type` where `id`=:type",["type"=>$array[0]]);
         if($array[2]=='qf'){
            $column = "qf_".$column;
         }else{
            $column = "mb_".$column;
         }
         //show($array);
         //echo $column;
         $result = parent::fetchAll("SELECT distinct  $column FROM `m_flight` WHERE $column LIKE :text limit 0 ,7"  ,["text"=>'%'.$array[1].'%']);
         $array=[];
         foreach($result as $v){
            foreach($v as $vv){
                $array[] = $vv;
            }
         }
         //show($array);
         echo json_encode($array);

    }




    public function init(){
        $result = parent::fetchAll("select id,qf_city_xy,mb_city_xy from t_flight_info2");
        //显示原始数据
        //show($result);

        //返回数据
        $data = Array(
                    'start'=>'0',           //状态码，0表示成功，1表示失败
                    'msg'=>'',              //信息
                    'lineData'=>[]     //曲线数据
                );

        //echo "<pre>";
        //print_r($result);


        //封装曲线数据
        $array = [];
        foreach($result as $v){
            $array = [];
            foreach($v as $kk=>$vv){
                $array[$kk] =$vv;

            }
            $data['lineData'][]=$array;
        }


        //echo "<pre>";
        //print_r($array);

        //show( $data['lineData']);
        //echo "<br/>";
        //echo json_encode($data);
       // echo "<br/>";

        return $data;
    }


    function show($data){
    	echo "<pre>";
    	print_r($data);
    	echo "</pre>";

    }


}




