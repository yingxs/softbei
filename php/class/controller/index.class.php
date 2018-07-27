<?php
require DAO.'IndexDao.class.php';
class Index {

    private $_data=[];


    //访问首页
    public function indexAction(){
        //设置页面标题
        $this->title="航班数据可视化";
        //取出所有航班数据
        //$dao = new IndexDao();

        //取出查询类型
        $dao = new IndexDao();
        $this->_data['query_type'] = $dao->QueryType();
        //show($this->_data['query_type']);
        $this->display('index');

    }

    //查询计算延误率，准点率，提前率
    public function getdelayInfoAction(){
        $flight_number = I('flight_number','get','string','');
        $start_time = I('start_time','get','string','');
        $end_time = I('end_time','get','string','');


        $dao = new IndexDao();
        $result = $dao->getdelay($flight_number,$start_time,$end_time);
        
        //查询该航班的机型种类
        $dao->query_type($flight_number);
        
        //起飞时
        $leave_delay=[
                'before'=>[],     //提前
                'on'=>[],         //准时
                'after'=>[],      //延误
        ];
        
        //到达时
        $arrive_delay=[
                'before'=>[],     //提前
                'on'=>[],         //准时
                'after'=>[],      //延误
        ];

        $time_lenth = 0;
        $time_count = 0;
        
        foreach($result as $v){
            if($v["leave_delay"]<-15){//延误
                $leave_delay['after'][]=$v["leave_delay"];
            }else if($v["leave_delay"]>15){//提前
                $leave_delay['before'][]=$v["leave_delay"];
            }else if($v["leave_delay"]<=15 && $v["leave_delay"]>=-15 ){//准时
                $leave_delay['on'][]=$v["leave_delay"];
            }

            if($v["arrive_delay"]<-15){//延误
                $arrive_delay['after'][]=$v["arrive_delay"];
            }else if($v["arrive_delay"]>15){//提前
                $arrive_delay['before'][]=$v["arrive_delay"];
            }else if($v["arrive_delay"]<=15 && $v["arrive_delay"]>=-15 ){//准时
                $arrive_delay['on'][]=$v["arrive_delay"];
            }
            
            $time = explode(":",$v['filght_time']);
            $hour = $time[0];
            $min  = $time[1];
            
            $time_lenth += (($hour*60)+$min);
            $time_count++;
        }

        $sum_qf = 0;$i=0;
        foreach($leave_delay['after'] as $v){
            $sum_qf+=$v;
            $i++;
        }

        @$num_after_qf = sizeof($leave_delay['after']) / sizeof($result);
        @$num_on_qf = sizeof($leave_delay['on']) / sizeof($result);
        @$num_before_qf = sizeof($leave_delay['before']) / sizeof($result);

        @$num_after_dd = sizeof($arrive_delay['after']) / (sizeof($arrive_delay['after'])+sizeof($arrive_delay['on'])+sizeof($arrive_delay['before']));
        @$num_on_dd = sizeof($arrive_delay['on']) / (sizeof($arrive_delay['after'])+sizeof($arrive_delay['on'])+sizeof($arrive_delay['before']));
        @$num_before_dd = sizeof($arrive_delay['before']) / (sizeof($arrive_delay['after'])+sizeof($arrive_delay['on'])+sizeof($arrive_delay['before']));


        $sum_dd = 0;$j=0;
        foreach($arrive_delay['after'] as $v){
            $sum_dd += $v;
            $j++;
        }
        
        
        $type_array=$dao->query_type($flight_number);
        
        $type = [];
        
        $m = 1;
        foreach ($type_array as $k=>$v){
            $type[]=[
                "id"=>$m,
                "value"=>$v,
                "label"=>$k
            ];
        }
        

        $data = [
            "leave_delay"=>[
                "delay"=>[
                    ["id"=>"1","value"=> @round($num_after_qf,4),"label"=>"延误率"],
                    ["id"=>"2","value"=> @round($num_on_qf,4),"label"=>"准时率"],
                    ["id"=>"3","value"=> @round($num_before_qf,4),"label"=>"提前率"]
                ],
                "len"=>@round(($sum_qf/$i)*-1,2)
            ],
            "arrive_delay"=>[
                "delay"=>[
                	["id"=>"1","value" => @sprintf("%.4f", $num_after_dd ),"label"=>"延误率"],
                	["id"=>"2","value" => @sprintf("%.4f", $num_on_dd ),"label"=>"准时率"],
                	["id"=>"3","value" => @sprintf("%.4f", $num_before_dd ),"label"=>"提前率"]
                ],
                "len"=>@round(($sum_dd/$j)*-1,2)
            ],
            "type_info"=>$type,
            "avg_time"=>@round((($time_lenth/$time_count)/60),2) 
        ];
        
//         show($data);

        echo json_encode($data);

//      show($leave_delay);


    }

    //获取航班历史记录
    public function getHistoryAction(){
        $flight_number = I('flight_number','get','string','');
        $dao = new IndexDao();
        $result = $dao->query_History($flight_number);
        
        for($i=0 ; $i<sizeof($result);$i++){
            if( $result[$i]["leave_delay"]<-15 ){
                $result[$i]["leave_delay"]="延误";
            }else if( $result[$i]["leave_delay"]>15 ){
                $result[$i]["leave_delay"]="提前";
            }else if( $result[$i]["leave_delay"]<=15 && $result[$i]["leave_delay"]>=-15 ){
                $result[$i]["leave_delay"]="准点";
            }
        }
        
        echo json_encode($result);
    }
    
    
    //搜索航班信息
    public function searchAction(){
        $qf_type = I('qf_type','get','string','');
        $qf_text = I('qf_text','get','string','');
        $mb_type = I('dd_type','get','string','');
        $mb_text = I('dd_text','get','string','');
        $zz_type = I('zz_type','get','string','');
        $zz_text = I('zz_text','get','string','');
        $company = I('company','get','string','');
        $start_time = I('start_time','get','string','');
        $end_time = I('end_time','get','string','');

        $dao = new IndexDao();

        $data = [
            "state" => 0,
            "message" => "数据查询成功！",
            "data" => []
        ];

        if(trim($zz_text) == '' ||  $zz_text == null ){
            //查询直飞航班信息
            $return1 = $dao->queryFlight_data([
                "qf_type"=>$qf_type,
                "qf_text"=>$qf_text,
                "mb_type"=>$mb_type,
                "mb_text"=>$mb_text,
                "company"=>$company,
                "start_time"=>$start_time,
                "end_time"=>$end_time
            ]);
            $data['data']['line']=$return1;
        }



        //查询经停航班信息
        $return2 = $dao->queryFlight_data_plus([
            "qf_type"=>$qf_type,
            "qf_text"=>$qf_text,
            "mb_type"=>$mb_type,
            "mb_text"=>$mb_text,
            "zz_type"=>$zz_type,
            "zz_text"=>$zz_text,
            "company"=>$company,
            "start_time"=>$start_time,
            "end_time"=>$end_time
        ]);


        $data['data']['line_plus']=$return2;

        echo json_encode($data);



    }

    //快速查询
    public function ks_searchAction(){
        $type = I('type','get','string','');
        $dao = new IndexDao();

        $data = [
            "state" => 0,
            "message" => "数据查询成功！",
            "data" => []
        ];

        //快速查询直飞航班数据
        $result1 = $dao->ks_queryFlight_data($type);
        //快速查询经停航班数据
        $result2 = $dao->ks_queryFlight_data_plus($type);

        $data['data']['line']=$result1;
        $data['data']['line_plus']=$result2;

        echo json_encode($data);
    }


    //精确查询
    public function jq_searchAction(){
        $str = I('str','get','string','');
        $dao = new IndexDao();

        $data = [
            "state" => 0,
            "message" => "数据查询成功！",
            "data" => []
        ];
        //cca985,cca981,cca107,,CBJ5595,
        $str = strtoupper($str);
        $array = explode(",",$str);
        $str = '';
        $flag = false;
        foreach($array as $v){
            if( strlen($v) > 0 ){
                if(!$flag){
                    $str .= ' flight_number='."'$v'";
                    $flag=true;
                }else{
                    $str .= ' OR flight_number='."'$v'";
                }
            }
        }


        //show($array);
        //show($str);

        //精确查询直飞航班数据
        $result1 = $dao->jq_queryFlight_data($str);
        //精确查询经停航班数据
        $result2 = $dao->jq_queryFlight_data_plus($str);

        $data['data']['line']=$result1;
        $data['data']['line_plus']=$result2;

        //show( $data['data'] );
        echo json_encode($data);
    }

    //查询城市
    public function search_cityAction(){
         $dao = new IndexDao();
        $result = $dao->query_city();

        echo json_encode($result);
    }

    //统计某个城市相关信息
    public function city_infoAction(){
         $city = I('city','get','string','');
         $country = I('country','get','string','');
         $airport = I('airport','get','string','');
        $type="";
        if($city!=''){
            $type="city";
            $param = $city;
        }else if($country!=''){
            $type="country";
            $param = $country;
        }else if($airport!=''){
            $type="airport";
            $param = $airport;
        }

        $dao = new IndexDao();
        
        $result = $dao->QueryParamInfo($param,$type);
    
//         show($result);
       echo json_encode($result);
    }
    
    
    public function testTableAction(){
        $dao = new IndexDao();
        $dao->testTable();
    }
    


    //查询机场/城市/国家
    public function searchInfoAction(){
            $type = I('type','get','string','');
            $text = I('text','get','string','');
            $state = I('state','get','string','');



            $dao = new IndexDao();

            if($type=="company"){
                $name = $dao->queryCompanye($text);
            }else{
                $name = $dao->queryName([$type,$text,$state]);
            }




        }

    public function testAction(){
        //获取查询条件






    }

    public function index2Action(){
        //取出所有航班数据
        $dao = new IndexDao();
        $this->data = $dao->init();
        echo json_encode($this->data);
    }



    //查看session
    public function sessionAction(){
        echo "<pre>";
        print_r($_SESSION);
    }


    //清空session
    public function sessionAction2(){
        $_SESSION=[];
        echo "<pre>";
        print_r($_SESSION);
    }
    //去重复
    public function quchongAction(){
    
     	$dao = new IndexDao();

        $dao->quchong();
    }

    public function display($file){
        //echo VIEW.$file.".html";
        require VIEW.$file.".html";

    }


    function show($data){
    	echo "<pre>";
    	print_r($data);
    	echo "</pre>";

    }

}

