<?php


class Base{



    //启动项目
    public static function run(){
        self::_init();     //初始化
        self::_extend();     //扩展
        self::_dispatch();  //请求分发
    }

    private static function _init(){
        define('DS', DIRECTORY_SEPARATOR); //路径分隔符
        define('ROOT', getcwd().DS);        //项目根目录
        define('PATH', ROOT."php".DS."class".DS."controller".DS);      //控制器类路径
        define('VIEW', ROOT."php".DS."view".DS);      //控制器类路径
        define('COMMON', ROOT."php".DS."class".DS."public".DS);        //公共访问
        define('DAO', ROOT."php".DS."class".DS."dao".DS);        //公共访问

        //载入函数库
        require COMMON.'function.php';

        //echo "<br/>";
       // echo " ".ROOT."<br/>";
       // echo PATH."<br/>";
       // echo COMMON."<br/>";
        //echo VIEW."<br/>";
        //echo DAO."<br/>";

        list($c,$a) = self::_getParams();
        define('CONTROLLER',strtolower($c));
        define('ACTION',strtolower($a));
        //echo "控制器：".CONTROLLER."<br/>";
        //echo "动  作：".ACTION."<br/>";

    }


    //参数获取
    private static function _getParams(){
        //获取URL的参数
        $c=I('c','get','string','index');
        $a=I('a','get','string','index');

        foreach([$c,$a] as $v){
            preg_match('/^[A-Za-z]\w{0,20}$/', $v) || E('请求参数包含特殊字符！');
        }

        return [$c,$a];

    }

    //扩展方法
    private static function _extend(){
        //开启session
        isset($_SESSION) || session_start();

    }


    private static function _dispatch(){
        $c = CONTROLLER;
        $a = ACTION."Action";

        $controller = new $c();
        $controller->$a();

    }



}

    //自动加载类
    function __autoload($className){
        //echo PATH.strtolower($className).".class.php";
        require PATH.strtolower($className).".class.php";

    }