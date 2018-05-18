<?php

//配置文件操作
function C($name){
	//static $config = null; //保存项目中的设置
	$config = null; //保存项目中的设置
	if(!$config){          //函数首次被调用时载入配置文件
		$config = require COMMON.'config.php';
		//echo COMMON.'config.php'."<br/>";
	}


	//echo isset($config[$name]) ? $config[$name] : '';
	return isset($config[$name]) ? $config[$name] : '';
}


function I($var, $method='post', $type='html', $def=''){
	switch($method){
		case 'get':    $method = $_GET;    break;
		case 'post':   $method = $_POST;   break;
	}
	$value = isset($method[$var]) ? $method[$var] : $def;
	if($type){
	    switch($type){

            case 'string': //字符串 不进行过滤
                $value = is_string($value) ? $value : '';
            break;
            case 'html': //字符串 进行HTML转义 单行文本
                $value = is_string($value) ? toHTML($value) : '';
            break;
            case 'int': //整数
                $value = (int)$value;
            break;
            case 'id': //无符号整数
                $value = max((int)$value, 0);
            break;
            case 'page': //页码
                $value = max((int)$value, 1);
            break;
            case 'float': //浮点数
                $value = (float)$value;
            break;
            case 'bool': //布尔型
                $value = (bool)$value;
            break;
            case 'array': //数组型
                $value = is_array($value) ? $value : [];
            break;
	    }
	}
	return $value;
}


//字符串转HTML
function toHTML($str){
	$str = trim(htmlspecialchars($str, ENT_QUOTES));
	return str_replace(' ', '&nbsp;', $str);
}



//遇到致命错误，输出错误信息并停止运行
function E($msg){
	exit('<pre>'.htmlspecialchars($msg).'</pre>');
}

//Session读写
function session($name, $value='', $type='get'){

	$prefix = C('SESSION_PREFIX');

	isset($_SESSION[$prefix]) || $_SESSION[$prefix] = [];
	switch($type){
		case 'get':
			return isset($_SESSION[$prefix][$name]) ? $_SESSION[$prefix][$name] : '';
		case 'isset':
			return isset($_SESSION[$prefix][$name]);
		case 'save':
			$_SESSION[$prefix][$name] = $value;
		break;
		case 'unset':
			unset($_SESSION[$prefix][$name]);
		break;
	}

}


function show($data){
	echo "<pre>";
	print_r($data);
	echo "</pre>";

}