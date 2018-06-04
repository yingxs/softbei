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

    public function testAction(){
        //取出查询类型
        $dao = new IndexDao();
        $this->_data['query_type'] = $dao->QueryType();
        show($this->_data);

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

