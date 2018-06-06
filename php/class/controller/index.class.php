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
        $this->display('index');

    }


    public function searchAction(){
        $qf_type = I('qf_type','get','string','');
        $qf_text = I('qf_text','get','string','');
        $dd_type = I('dd_type','get','string','');
        $dd_text = I('dd_text','get','string','');
        $start_time = I('start_time','get','string','');
        $end_time = I('end_time','get','string','');

        $dao = new IndexDao();
        $flight_code = $dao->queryFlight_code([$qf_type,$qf_text,$dd_type,$dd_text]);
        //show($flight_code);



        //echo $qf_type."<br/>";
        //echo $qf_text."<br/>";
        //echo $dd_type."<br/>";
        //echo $dd_text."<br/>";
        //echo $start_time."<br/>";
        //echo $end_time."<br/>";

        //exit("完成");
    }

    public function searchInfoAction(){
            $type = I('type','get','string','');
            $text = I('text','get','string','');
            $state = I('state','get','string','');

            $dao = new IndexDao();
            $name = $dao->queryName([$type,$text,$state]);



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

    public function display($file){
        //echo VIEW.$file.".html";
        require VIEW.$file.".html";

    }
}

