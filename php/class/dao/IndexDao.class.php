<?php
require COMMON.'MySQLPDO.class.php';

class IndexDao extends MySQLPDO{

    //构造方法
    public function __construct(){
        parent::__construct();
    }




    //查询默认选项类型
    public function QueryType(){
        return parent::fetchAll("SELECT `id`,`type`,`default`,`column` FROM query_type");
    }

    //查询直飞航班信息
    public function queryFlight_data($array){
        $qf_column = parent::fetchColumn("select `column` from `query_type` where `id`=:qf_type",["qf_type"=>$array["qf_type"]]);
        $mb_column = parent::fetchColumn("select `column` from `query_type` where `id`=:mb_type",["mb_type"=>$array["mb_type"]]);
        $qf_column = "qf_".$qf_column;
        $mb_column = "mb_".$mb_column;
        //show($array);
        //echo $qf_column."<br/>";
        //echo $mb_column."<br/>";
        $sql = "SELECT  `flight_number`,`airline_company` ,`qf_airport` ,`qf_city`,`qf_country`, `mb_airport`,`mb_city`,`mb_country`,`qf_longitude`, `qf_latitude`, `mb_longitude`, `mb_latitude`, `leave_downtime` ,`come_downtime` FROM `m_flight` WHERE 1=1 ";
        $param = [];
        if($array["qf_text"]!='' && $array["qf_text"]!=null ){
            $sql.= " AND $qf_column LIKE :qf_text ";
            $param["qf_text"] = '%'.$array["qf_text"].'%';
        }

        if($array["mb_text"]!='' && $array["mb_text"]!=null ){
            $sql.= " AND $mb_column LIKE :mb_text ";
            $param["mb_text"] = '%'.$array["mb_text"].'%';
        }

        if($array["company"]!='' && $array["company"]!=null ){
            $sql.= " AND airline_company LIKE :company ";
            $param["company"] = '%'.$array["company"].'%';
        }
        //show($param);


        //echo "我的：".$sql."<br/>";
        //echo "正确： SELECT `flight_number` FROM `m_flight` WHERE $qf_column LIKE %".$array["qf_text"]."%  AND $mb_column LIKE %".$array["mb_text"]."%  AND airline_company LIKE %".$array["company"]."% ";
        $result = parent::fetchAll($sql,$param);
        //$array=[];
        //foreach($result as $v){
        //   foreach($v as $vv){
        //       $array[] = $vv;
        //   }
        //}



        for($j=0;$j<3;$j++){
            $a[$j]=$result[$j];
        }

        return $a;
    }



     //查询经停航班信息
    public function queryFlight_data_plus($array){
        $qf_column = parent::fetchColumn("select `column` from `query_type` where `id`=:qf_type",["qf_type"=>$array["qf_type"]]);
        $mb_column = parent::fetchColumn("select `column` from `query_type` where `id`=:mb_type",["mb_type"=>$array["mb_type"]]);
        $zz_column = parent::fetchColumn("select `column` from `query_type` where `id`=:zz_type",["zz_type"=>$array["zz_type"]]);
        $qf_column = "qf_".$qf_column;
        $mb_column = "mb_".$mb_column;
        $zz_column = "zz_".$zz_column;


        $sql = "SELECT  `flight_number`,`airline_company` ,`qf_airport` ,`qf_city`,`qf_country`, `mb_airport`,`mb_city`,`mb_country`,`zz_airport`,`zz_city`,`zz_country`,`qf_longitude`, `qf_latitude`, `mb_longitude`, `mb_latitude`,`zz_longitude`, `zz_latitude`, `leave_downtime` ,`come_downtime` FROM `m_flight_stop_over` WHERE 1=1 ";
        $param = [];
        if($array["qf_text"]!='' && $array["qf_text"]!=null ){
            $sql.= " AND $qf_column LIKE :qf_text ";
            $param["qf_text"] = '%'.$array["qf_text"].'%';
        }

        if($array["mb_text"]!='' && $array["mb_text"]!=null ){
            $sql.= " AND $mb_column LIKE :mb_text ";
            $param["mb_text"] = '%'.$array["mb_text"].'%';
        }

        if($array["zz_text"]!='' && $array["zz_text"]!=null ){
            $sql.= " AND $zz_column LIKE :zz_text ";
            $param["zz_text"] = '%'.$array["zz_text"].'%';
        }

        if($array["company"]!='' && $array["company"]!=null ){
            $sql.= " AND airline_company LIKE :company ";
            $param["company"] = '%'.$array["company"].'%';
        }

        //show($param);


        //echo "我的：".$sql."<br/>";
        //echo "正确： SELECT `flight_number` FROM `m_flight` WHERE $qf_column LIKE %".$array["qf_text"]."%  AND $mb_column LIKE %".$array["mb_text"]."%  AND airline_company LIKE %".$array["company"]."% ";
        $result = parent::fetchAll($sql,$param);
        //$array=[];
        //foreach($result as $v){
        //   foreach($v as $vv){
        //       $array[] = $vv;
        //   }
        //}


        for($j=0;$j<1;$j++){
            $a[$j]=$result[$j];
        }

        return $a;

        //return $result;
        //echo json_encode($result);
        //show($result);
    }



    //根据选项类型查询机场/国家/省份
    public function queryName($array){
         //show($array);
         $column = parent::fetchColumn("select `column` from `query_type` where `id`=:type",["type"=>$array[0]]);
         if($array[2]=='qf'){
            $column = "qf_".$column;
         }else if($array[2]=='zz'){
            $column = "zz_".$column;
         }else{
            $column = "mb_".$column;
         }

        //echo $column."<br/>";

         //show($array);
         //echo $column;
         if($array[2]=='zz'){
             $result = parent::fetchAll("SELECT distinct  $column FROM `m_flight_stop_over` WHERE $column LIKE :text limit 0 ,7"  ,["text"=>'%'.$array[1].'%']);

         }else{
             $result = parent::fetchAll("SELECT distinct  $column FROM `m_flight` WHERE $column LIKE :text limit 0 ,7"  ,["text"=>'%'.$array[1].'%']);

         }
         $array=[];
         foreach($result as $v){
            foreach($v as $vv){
                $array[] = $vv;
            }
         }
         //show($array);
         //sleep(1);
         echo json_encode($array);

    }

    //查询航空公司
    public function queryCompanye($text){

        $result = parent::fetchAll("select distinct airline_company from `m_flight` WHERE  airline_company LIKE :text limit 0,7",["text"=>'%'.$text.'%']);
        //show($result);
        $array=[];
        foreach($result as $v){
           foreach($v as $vv){
                $array[] = $vv;
           }
        }
        //sleep(2);
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

    //根据航班查询指定时间区间内的延误时长
    function getdelay($flight_number,$start_time,$end_time){
        $flight_number = strtolower($flight_number);
        $table_name = "t_".$flight_number;
        $sql = "SELECT `leave_delay`,`arrive_delay` FROM  $table_name  WHERE 1=1 ";
        if( $start_time != ''){
            $sql .= " AND `date_standard` >= :start_time ";
        }
        if( $end_time != ''){
            $sql .= " AND `date_standard` <= :end_time ";
        }

//      echo $sql;

        $result = parent::fetchAll($sql,["start_time"=>$start_time,"end_time"=>$end_time]);

        //show($result);

        return $result;

    }


    function show($data){
    	echo "<pre>";
    	print_r($data);
    	echo "</pre>";

    }


}




