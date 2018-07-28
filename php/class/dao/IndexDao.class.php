<?php
	
require COMMON.'MySQLPDO.class.php';

set_time_limit(0);

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
            //echo $sql;
            $result = parent::fetchRow($sql);
            $city_array[] = $result;
        }
        return $city_array;

    }

    
    public function  get_num($param,$type,$qf_mb){
        
//         $sql = " SELECT flight_number FROM `m_flight` WHERE {$qf_mb}_{$type}=\"$param\" UNION SELECT flight_number  FROM `m_flight_stop_over` WHERE {$qf_mb}_{$type}=\"$param\"  ";
        $sql = " SELECT flight_number FROM `m_flight` WHERE {$qf_mb}_{$type}=\"$param\"   ";
        
//         echo "$sql<br/>";
        
        
        //echo $sql;
        $result = parent::fetchAll($sql);
        
        $code_array=[];
        foreach($result as $v){
            foreach($v as $vv){
                $code_array[] =  $vv;
            }
        }
//         echo "直飞航班：<br>";
//         show($code_array);
        
        
       
        $sum_line=0;
        $count = 0;
        
        if(sizeof($code_array)>0){
            $sql = "SELECT COUNT(*) FROM t_".$code_array[0];
            $count++;
            
            for($i=1;$i<sizeof($code_array);$i++){
                $sql .= " UNION ALL SELECT COUNT(*) FROM t_".$code_array[$i];
                $count++;
            }
            
            $result = parent::fetchAll($sql);
            
            $array_c=[];
            foreach($result as $v){
                foreach($v as $vv){
                    $sum_line += $vv;
                    $array_c[]=$vv;
                }
            }
//             echo "$count<br/>";
//             echo "$sql<br/>";
//             show($array_c);
            
        }
        
        $sql = " SELECT flight_number FROM `m_flight_stop_over` WHERE {$qf_mb}_{$type}=\"$param\"  ";
        
        $result = parent::fetchAll($sql);
        
        $code_array=[];
        foreach($result as $v){
            foreach($v as $vv){
                $code_array[] =  $vv;
            }
        }
        
// //         echo "经停航班：<br>";
// //         show($code_array);
        
        $sum_line_plus=0;
        
        if(sizeof($code_array)>0){
            $sql = "SELECT COUNT(*) FROM t_".$code_array[0];
            
            for($i=1;$i<sizeof($code_array);$i++){
                $sql .= " UNION SELECT COUNT(*) FROM t_".$code_array[$i];
            }
            
            $result = parent::fetchAll($sql);
            
            foreach($result as $v){
                foreach($v as $vv){
                    $sum_line_plus += ($vv/2);
                }
            }
        }
        
        
        
        $sql = " SELECT flight_number FROM `m_flight_stop_over` WHERE zz_{$type}=\"$param\"  ";
        
        $result = parent::fetchAll($sql);
        
        $code_array=[];
        foreach($result as $v){
            foreach($v as $vv){
                $code_array[] =  $vv;
            }
        }
        
        
        if(sizeof($code_array)>0){
            $sql = "SELECT COUNT(*) FROM t_".$code_array[0];
            
            for($i=1;$i<sizeof($code_array);$i++){
                $sql .= " UNION SELECT COUNT(*) FROM t_".$code_array[$i];
            }
            
            $result = parent::fetchAll($sql);
            
            foreach($result as $v){
                foreach($v as $vv){
                    $sum_line_plus += ($vv/2);
                    $sum_line += ($vv/2);
                }
            }
        }
        
//         echo "sum_line:$sum_line<br/>";        
//         echo "sum_line_plus:$sum_line_plus<br/>";        
//         echo "sum_line:$sum_line<br/>";
//         echo "sum_line_plus:$sum_line_plus<br/>";
        return  $sum_line + $sum_line_plus;
    }
    
    //统计某个城市相关信息
    public function QueryParamInfo($param,$type){
        $sql = "SELECT qf_city,qf_country,qf_airport FROM `m_flight` WHERE qf_{$type} = \"$param\" ".
            " UNION SELECT mb_city,mb_country,mb_airport FROM `m_flight` WHERE mb_{$type} = \"$param\" ".
            " UNION SELECT qf_city,qf_country,qf_airport FROM `m_flight_stop_over` WHERE qf_{$type} = \"$param\" ".
            " UNION SELECT mb_city,mb_country,mb_airport FROM `m_flight_stop_over` WHERE mb_{$type} = \"$param\"   ";
        //echo $sql;
        $result = parent::fetchAll($sql);
        
        

        $array = [
            "city"=>"",
            "country"=>"",
            "airport_list"=>[],
            "enter_num"=>0,
            "out_num"=>0
        ];

        foreach($result as $v){
            $array["city"]=$v["qf_city"];
            $array["country"]=$v["qf_country"];
            $array["airport_list"][]=$v["qf_airport"];
        }

        //show($array);
//         echo "入港<br/>";
        $array["enter_num"] = $this->get_num($param,$type,"mb");
//         echo "出港<br/>";
        $array["out_num"] = $this->get_num($param,$type,"qf");
            

//         show($array);
        return $array;
    }
    
    public function testTable(){
        $sql = "SELECT `id`,`flight_number` FROM `m_flight_copy_copy`  ";
        $result = parent::fetchAll($sql);
        
        $sql = "SHOW TABLES LIKE 't_%'  ";
        $result2 = parent::fetchAll($sql);
        
        $table_array=[];
        $j=1;
        foreach($result2 as $v){
        	$table_array[$j++]=$v["Tables_in_fliht_data (t_%)"];
        }
        
        
        $sum=0;
        
        foreach($result as $v){
        	//echo strtolower("t_".$v["flight_number"])."<br/>";
        	$flag = array_search( strtolower("t_".$v["flight_number"]),$table_array);
	        if($flag){
	//      	echo "存在";
	
	        }else{
	      	echo $v['flight_number']."不存在<br/>";
	      	parent::exec( "delete from  m_flight_copy_copy where id=".$v["id"]);
			$sum++;
	        }
        }
        
        show($table_array);
        echo $sum;
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
        $sql = "SELECT `leave_delay`,`arrive_delay`,`filght_time` FROM  $table_name  WHERE 1=1 ";
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
    
    
    //查询机型种类以及所占比例
    function query_type($flight_number){
        
        $sql = "SELECT `type` FROM  `t_".$flight_number;
        $result = parent::fetchAll($sql);
        $data=[];
        $sum = 0;
        foreach ($result as $v){
            foreach ($v as $vv){
                $sum++;
                if(array_key_exists($vv,$data)){
                    $data[$vv]++;
                }else{
                    $data[$vv]=1;
                }
            }
        }
//         show($data);
       foreach ($data as $k=>$v){
           $data[$k] =  round($v/$sum,4);
       }
       $s = 0;
       foreach ($data as $v){
           $s += $v;
       }
       
//        show($data);
//        echo "$s<br/>";
       
       
        
        return $data;
    }
    
    //查询指定航班的历史记录
    function query_History($flight_number){
        $sql = "SELECT `date`,`type`,`qf_ariport`,`mb_ariport`,`qf_zonghe`,`mb_zonghe`,`filght_time`,`leave_delay`    FROM  `t_".$flight_number;
        $result = parent::fetchAll($sql);
        
        return $result;
    }
    
    //去重
    function quchong(){
    	$result = parent::fetchAll("SELECT `id`,`flight_number` FROM m_flight_copy_copy  ORDER BY flight_number ASC");
    	//show($result);
    	$num = 0;
    	for($i = 1 ; $i<sizeof($result) ; $i++){
    		
    		if($result[$i]["flight_number"]==$result[$i-1]["flight_number"]){
    			$num += parent::exec("delete from  m_flight_copy_copy where id=".$result[$i]["id"]);
    		}
    		
    	}
    	echo $num;
    	
    }
    
    function fenbiao(){
    	
    	$sum = 0;
    	$count = 0;
    	for($id=1;$id<=4255;$id+=2){
    		$result = parent::fetchRow("SELECT `id`,flight_number,airline_company,qf_airport,qf_longitude,qf_latitude,qf_city,qf_country,mb_airport,mb_longitude,mb_latitude,mb_city,mb_country,leave_downtime,come_downtime FROM m_flight WHERE id=".$id);
    		
    		$id =  $result['id'];
	    	$flight_number = $result['flight_number'];
	    	$airline_company = $result['airline_company'];
	    	$qf_airport = $result['qf_airport'];
	    	$qf_longitude = $result['qf_longitude'];
	    	$qf_latitude = $result['qf_latitude'];
	    	$qf_city =  $result['qf_city'];
	    	$qf_country = $result['qf_country'];
	    	$mb_airport = $result['mb_airport'];
	    	$mb_longitude = $result['mb_longitude'];
	    	$mb_latitude = $result['mb_latitude'];
	    	$mb_city = $result['mb_city'];
	    	$mb_country = $result['mb_country'];
	    	$leave_downtime = $result['leave_downtime'];
	    	$come_downtime = $result['come_downtime'];
	    	
    		$sql = "insert into m_flight_1000 (id,flight_number,airline_company,qf_airport,qf_longitude,qf_latitude,qf_city,qf_country,mb_airport,mb_longitude,mb_latitude,mb_city,mb_country,leave_downtime,come_downtime) values ($id,'$flight_number','$airline_company',\"$qf_airport\",'$qf_longitude','$qf_latitude',\"$qf_city\",\"$qf_country\",\"$mb_airport\",'$mb_longitude','$mb_latitude',\"$mb_city\",\"$mb_country\",'$leave_downtime','$come_downtime')";
    		$sum++;
//  		$sum += parent::exec($sql);
    		$count++;
    		
//  		echo $id."<br/>";
    		if($id>=4252) {
    			break;
    			echo "<br/>强行终止4249+<br/>";	
    		}
    		
    	}
    	
    	echo "sum:".$sum;
		
    	
    	
    }



    function show($data){
    	echo "<pre>";
    	print_r($data);
    	echo "</pre>";

    }


}



