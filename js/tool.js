
//浏览器检测
(function(){
	window.sys = {};                                             //让外部可以访问，保存浏览器信息的对象
	var ua = navigator.userAgent.toLocaleLowerCase();            //获取浏览器信息字符串
	var s;                                                      //浏览器信息数组，浏览器名称+版本
	//alert(ua);
	//IE浏览器
	if( (/msie ([\d.]+)/).test(ua) || (/rv:([\d.]+)/).test(ua)){
		if( ua.match(/msie ([\d.]+)/) != null ){
			sys.ie = ua.match(/msie ([\d.]+)/)[1];
		}else if( ua.match(/rv:([\d.]+)/) && (/\.net/).test(ua )){
			sys.ie = ua.match(/rv:([\d.]+)/)[1];
		}
	}

	//firefox
	if( (/firefox\/([\d.]+)/).test(ua)){
		sys.firefox = ua.match(/firefox\/([\d.]+)/)[1];
	}

	//chrmoe
	if( (/chrome\/([\d.]+) safari\/([\d.]+)$/).test(ua)){
		sys.chrome = ua.match(/chrome\/([\d.]+).*safari/)[1];
	}

	//safari
	if( (/version\/([\d.]+).*safari/).test(ua)){
		sys.safari = ua.match(/version\/([\d.]+).*safari/)[1];
	}

	//opera
	if( (/chrome\/([\d.]+).*safari\/([\d.]+).*opr\/([\d.]+)/).test(ua)){
		sys.opera = ua.match(/chrome\/([\d.]+).*safari\/([\d.]+).*opr\/([\d.]+)/)[3];
	}

	if(/webkit/.test(ua)){
		sys.webkit = ua.match(/webkit\/([\d.]+)/)[1];
	}

})();

//DOM加载
function addDomLoaded(fn){
	var isReady = false;
	var timer = null;
	function doReady(){
		if(timer) clearInterval(timer);
		if(isReady) return;
		isReady = true;
		fn();
	}

	//Opear8,webkit引擎浏览器525之前，Firefox2
	if( (sys.opera && sys.opera<9) || (sys.firefox && sys.firefox<3) || (sys.webkit && sys.webkit < 525)){
		/*
		 //这种方法，目前在主流浏览器判断的都是complete，类似于onload，即图片加载后在加载
		 //用于非主流浏览器向下兼容即可
		 timer = setInterval(function(){
		 if(/loaded|complete/.test(document.readyState)){    //loaded是部分加载，有可能只是DOM加载完毕，complete是全部加载完毕
		 doReady();
		 }
		 },1);
		 */

		//这种方法可以在图片加载之前执行
		timer = setInterval(function(){
			if(document && document.getElementById && document.getElementsByName && document.body){
				doReady();
			}
		},1);
	}else if(document.addEventListener){    //W3C
		addEvent(document,'DOMContentLoaded',function(){
			fn();
			removeEvent(document,'DOMContentLoaded',arguments.callee);
		},1);
	}else if(sys.ie && sys.ie<9){
		timer = setInterval(function(){
			try{
				document.documentElement.doScroll('left');
				doReady();
			}catch(e){

			}
		},1);

	}
}


//为每个事件分配一个计数器
addEvent.ID = 1;
//跨浏览器事件绑定
function addEvent(obj,type,fn){
	if(typeof obj.addEventListener != 'undefined'){
		obj.addEventListener(type,fn,false);
	}else {
		//创建一个存放事件的哈希表(散列表)
		if(!obj.events) obj.events = {};

		//第一次绑定事件时执行
		if(!obj.events[type]){
			//创建一个存放事件处理函数的数组
			obj.events[type]=[];

			//把第一次的事件处理函数先储存到第一个位置上
			obj.events[type][0] = fn;
		}else{
			//同一个注册函数进行屏蔽
			if(addEvent.equal(obj.events[type],fn)) return false;
			//从第二次事件绑定开始我们用事件计数器来存储
			obj.events[type][addEvent.ID++] = fn;
		}


		//绑定事件处理函数
		obj['on'+type] = addEvent.exec;


	}
}

addEvent.exec = function(event){
	var e = event || addEvent.fixEvent(window.event);
	var es = this.events[e.type];
	for(var i in es){
		es[i].call(this,e);
	}
};


//同一个注册函数进行屏蔽
addEvent.equal = function(es,fn){
	for(var i in es){
		if(es[i] == fn)return true;
	}
	return false;
};

//把IE常用的Event对象配对到W3C中去
addEvent.fixEvent = function(event){
	event.preventDefault = addEvent.fixEvent.preventDefault;
	event.stopPropagation =addEvent.fixEvent.stopPropagation;
	event.target = event.srcElement;
	return event;
};

//IE阻止默认行为
addEvent.fixEvent.preventDefault = function(){
	this.returnValue = false;
};

//IE取消冒泡
addEvent.fixEvent.stopPropagation = function(){
	this.cancelBubble = true;
};


//跨浏览器删除事件
function removeEvent(obj,type,fn){
	if(typeof obj.removeEventListener != 'undefined'){
		obj.removeEventListener(type,fn,false);
	}else if(typeof obj.detachEvent != 'undefined'){
		if(obj.events){
			for(var i in obj.events[type]){
				if(obj.events[type][i] == fn){
					delete obj.events[type][i];
				}
			}
		}
	}
}

//跨浏览器获取style
function getStyle(element,attr){
	var value;
	if(typeof window.getComputedStyle != 'undefined'){      //W3C
		value = window.getComputedStyle(element,null)[attr];
	}else if(typeof element.currentStyle != 'undefined' ){  //IE
		value = element.currentStyle[attr];
	}
	return value;

}


//跨浏览器获取滚动条位置
function getScroll(){
	return {
		top : document.documentElement.scrollTop || document.body.scrollTop,
		left : document.documentElement.scrollLeft || document.body.scrollLeft
	};
}

//滚动条固定
function fixedScroll(){
	window.scrollTo(fixedScroll.top,fixedScroll.left);

}

//跨浏览器获取innerText
function getInnerText(element){
	return (typeof element.textContent=='string') ? element.textContent : element.innerText;
}

//跨浏览器获取视口大小
function getInner(){

	if(typeof window.innerWidth != 'undefined'){
		return {
			width : window.innerWidth,
			height : window.innerHeight
		};
	}else{
		return {
			width : document.documentElement.clientWidth,
			height : document.documentElement.clientHeight
		};
	}
}


//阻止默认行为
function predef(e){
	e.preventDefault();
}

//判断class是否存在
function hasClass(element,className){
	return element.className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'));
}

//删除前后的空格
function trim(str){
	return str.replace(/(^\s*)|(\s*$)/g,'');

}

