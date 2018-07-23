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



        //for($j=0;$j<3;$j++){
         //   $a[$j]=$result[$j];
        //}
        //return $a;

        return $result;


    }

    //查询直飞航班表中的城市及其经纬坐标
    public function query_city(){
        $sql = "SELECT `qf_city`  FROM `m_flight`  UNION SELECT `mb_city` FROM `m_flight`  UNION SELECT  `qf_city`  FROM `m_flight_stop_over`   UNION  SELECT `mb_city` FROM `m_flight_stop_over` ";
        $result = parent::fetchAll($sql);
        //show($result);
        $array = [];
        foreach($result as $v){
            foreach($v as $vv){
                $array[]=$vv;
            }
        }

        $city_array = [];
        foreach($array as $v){
            $sql = "SELECT `qf_city` ,`qf_longitude` ,`qf_latitude` FROM `m_flight` WHERE qf_city=\"$v\"  UNION SELECT `mb_city` ,`mb_longitude` ,`mb_latitude` FROM `m_flight`  WHERE mb_city=\"$v\"   UNION SELECT  `qf_city` ,`qf_longitude` ,`qf_latitude` FROM `m_flight_stop_over`  WHERE qf_city=\"$v\"    UNION  SELECT `mb_city`,`mb_longitude` ,`mb_latitude` FROM `m_flight_stop_over`  WHERE mb_city=\"$v\" ";
            $result = parent::fetchRow($sql);
            $city_array[] = $result;
        }
        return $city_array;

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


        //for($j=0;$j<1;$j++){
          //  $a[$j]=$result[$j];
        //}

        return $result;

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

    //快速查询直飞航班信息
    function ks_queryFlight_data($type){
        $sql = "SELECT  `flight_number`,`airline_company` ,`qf_airport` ,`qf_city`,`qf_country`, `mb_airport`,`mb_city`,`mb_country`,`qf_longitude`, `qf_latitude`, `mb_longitude`, `mb_latitude`, `leave_downtime` ,`come_downtime` FROM `m_flight` WHERE  ";
        switch ($type){
            //国内直飞航班
            case "on_ch" : $sql .= " qf_country= 'China' AND mb_country= 'China' ";break;
            //国际航班
            case "on_world" : $sql .= " qf_country <> 'China' OR mb_country <> 'China' ";break;
            //出境航班
            case "out_ch" : $sql .= " qf_country = 'China' AND mb_country <> 'China' ";break;
            //入境航班
            case "in_ch" : $sql .= " qf_country <> 'China' AND mb_country = 'China' ";break;
            //直飞航班
            case "no_over" : $sql .= " 1=1 ";break;
            //经停航班
            case "over" : $sql .= " 1=2 ";break;
            //港澳台航班
            case "on_gat" : $sql .= " qf_city = 'Hong Kong' OR qf_city = 'Taiwan' OR qf_city = 'Macao' OR  mb_city = 'Hong Kong' OR mb_city = 'Taiwan' OR mb_city = 'Macao'  ";break;
        }
        $result = parent::fetchAll($sql);
        return $result;

    }

     //快速查询经停航班信息
        function ks_queryFlight_data_plus($type){
             $sql = "SELECT  `flight_number`,`airline_company` ,`qf_airport` ,`qf_city`,`qf_country`, `mb_airport`,`mb_city`,`mb_country`,`zz_airport`,`zz_city`,`zz_country`,`qf_longitude`, `qf_latitude`, `mb_longitude`, `mb_latitude`,`zz_longitude`, `zz_latitude`, `leave_downtime` ,`come_downtime` FROM `m_flight_stop_over` WHERE  ";
            switch ($type){
                //国内航班
                case "on_ch" : $sql .= " qf_country= 'China'       AND      mb_country= 'China' ";break;
                 //国际航班
                case "on_world" : $sql .= " qf_country <> 'China'   OR      mb_country <> 'China' ";break;
                //出境航班
                case "out_ch" : $sql .= " qf_country = 'China'      AND     mb_country <> 'China' ";break;
                //入境航班
                case "in_ch" : $sql .= " qf_country <> 'China'      AND     mb_country = 'China' ";break;
                 //直飞航班
                case "no_over" : $sql .= " 1=2 ";break;
                 //经停航班
                case "over" : $sql .= " 1=1 ";break;
                //港澳台航班
                case "on_gat" : $sql .= " qf_city = 'Hong Kong' OR qf_city = 'Taiwan' OR qf_city = 'Macao' OR  mb_city = 'Hong Kong' OR mb_city = 'Taiwan' OR mb_city = 'Macao' OR  zz_city = 'Hong Kong' OR zz_city = 'Taiwan' OR zz_city = 'Macao'  ";break;
            }
            $result = parent::fetchAll($sql);
            return $result;
        }


    //精确查询直飞航班信息
    function jq_queryFlight_data($str){
        $sql = "SELECT  `flight_number`,`airline_company` ,`qf_airport` ,`qf_city`,`qf_country`, `mb_airport`,`mb_city`,`mb_country`,`qf_longitude`, `qf_latitude`, `mb_longitude`, `mb_latitude`, `leave_downtime` ,`come_downtime` FROM `m_flight` WHERE  $str";

        //echo $sql."<br/>";
        $result = parent::fetchAll($sql);

        return $result;

    }
    //快速查询经停航班信息
    function jq_queryFlight_data_plus($str){
        $sql = "SELECT  `flight_number`,`airline_company` ,`qf_airport` ,`qf_city`,`qf_country`, `mb_airport`,`mb_city`,`mb_country`,`zz_airport`,`zz_city`,`zz_country`,`qf_longitude`, `qf_latitude`, `mb_longitude`, `mb_latitude`,`zz_longitude`, `zz_latitude`, `leave_downtime` ,`come_downtime` FROM `m_flight_stop_over` WHERE  $str";
        //echo $sql."<br/>";
        $result = parent::fetchAll($sql);
        return $result;

    }



    function show($data){
    	echo "<pre>";
    	print_r($data);
    	echo "</pre>";

    }


}




