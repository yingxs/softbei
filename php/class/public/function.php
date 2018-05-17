<?php

//�����ļ�����
function C($name){
	//static $config = null; //������Ŀ�е�����
	$config = null; //������Ŀ�е�����
	if(!$config){          //�����״α�����ʱ���������ļ�
		$config = require COMMON.'config.php';
		echo COMMON.'config.php'."<br/>";
	}
	echo isset($config[$name]) ? $config[$name] : '';
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

            case 'string': //�ַ��� �����й���
                $value = is_string($value) ? $value : '';
            break;
            case 'html': //�ַ��� ����HTMLת�� �����ı�
                $value = is_string($value) ? toHTML($value) : '';
            break;
            case 'int': //����
                $value = (int)$value;
            break;
            case 'id': //�޷�������
                $value = max((int)$value, 0);
            break;
            case 'page': //ҳ��
                $value = max((int)$value, 1);
            break;
            case 'float': //������
                $value = (float)$value;
            break;
            case 'bool': //������
                $value = (bool)$value;
            break;
            case 'array': //������
                $value = is_array($value) ? $value : [];
            break;
	    }
	}
	return $value;
}


//�ַ���תHTML
function toHTML($str){
	$str = trim(htmlspecialchars($str, ENT_QUOTES));
	return str_replace(' ', '&nbsp;', $str);
}

//��������
function token_get(){
	if(session('token', '', 'isset')){
		$token = session('token');
	}else{
		$token = md5(microtime(true));
		session('token', $token, 'save');
	}
	return $token;
}

//��֤����
function token_check($token=''){
	if(!$token){ //�Զ�ȡ��token
		$token = I('token', 'get', 'string');
	}
	return token_get() == $token;
}

//���������������������Ϣ��ֹͣ����
function E($msg){
	exit('<pre>'.htmlspecialchars($msg).'</pre>');
}

//Session��д
function session($name, $value='', $type='get'){
echo "session1<br/>";
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
echo "session2<br/>";
}