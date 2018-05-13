//前台调用
var $ = function (_this){
	return new Base(_this);
};

//基础类库对象
function Base(args){
	//创建一个数组，来保存获取的结点和结点数组
	this.elements=[];

	if(typeof args == 'string'){
		//CSS模拟
		if(args.indexOf(' ') != -1){
			var css = args.split(' ');             //把结点拆开分别保存到数组
			var childElements = [];                     //存放临时结点对象的数组解决被覆盖问题
			var node = [];                              //用来存放父节点
			for(var i=0; i < css.length;i++){
				if(node.length == 0 )
					node.push(document);                //如果没有父节点，就将document放入
				switch (css[i].charAt(0)){
					case '#':
						childElements = [];             //清理掉临时节点，以便父节点失效，子节点有效
						childElements.push(this.getId(css[i].substring(1)));
						node = childElements;           //保存父节点，因为childElement要清理，所以需要创建node数组
						//alert(css[i].substring(1)+"\r\nchildElements:"+childElements+"\r\n"+"node:"+node);
						break;
					case '.':
						childElements = [];
						for(var j=0 ;j<node.length;j++ ){
							var temps = this.getClass(css[i].substring(1),node[j]);
							for(var k = 0; k < temps.length;k++){
								childElements.push(temps[k]);
							}
						}
						node = childElements;
						//alert(css[i]+"\r\nchildElements:"+childElements+"\r\n"+"node:"+node);
						break;
					default :
						childElements = [];
						for(var j=0 ;j<node.length;j++ ){
							var temps = this.getTagName(css[i],node[j]);
							for(var k = 0; k < temps.length;k++){
								childElements.push(temps[k]);
							}
						}
						node = childElements;
						//alert(css[i]+"\r\nchildElements:"+childElements+"\r\n"+"node:"+node);
				}
			}
			this.elements = childElements;
		}else{
			//find模拟
			switch (args.charAt(0)){
				case '#':
					this.elements.push( this.getId(args.substring(1)));
					break;
				case '.':
					this.elements =  this.getClass(args.substring(1));
					break;
				default :
					this.elements =  this.getTagName(args);
			}
		}
	}else if(typeof args == 'object'){
		if(args != undefined) { //_this 是一个对象，区别于typeof返回的带单引号字符串
			this.elements[0] = args;
		}
	}else if(typeof  args == 'function'){
		//this.ready(args);
		addDomLoaded(args);
	}

}

//addDomloaded
Base.prototype.ready = function(fn){
	addDomLoaded(fn);
}

//根据ID获取元素节点
Base.prototype.getId = function(id){
	return document.getElementById(id);
};

//根据标签名获取元素节点
Base.prototype.getTagName = function(tag,parentNode){
	var node = null;
	var temps = [];
	if(parentNode != undefined){
		node = parentNode;
	}else{
		node = document;
	}

	var tags = node.getElementsByTagName(tag);
	for(var i=0;i<tags.length;i++){
		temps.push(tags[i]);
	}

	return temps;
};

//根据CLASS获取结点数组
Base.prototype.getClass = function(className,parentNode){
	var node = null;
	var temps = [];
	if(parentNode != undefined){
		node = parentNode;
	}else{
		node = document;
	}

	var all = node.getElementsByTagName("*");
	for(var i=0;i<all.length;i++){
		if((new RegExp('(\\s|^)'+className+'(\\s|$)')).test(all[i].className)){
			temps.push(all[i]);
		}
	}

	return temps;
};


//设置css选择器子节点
Base.prototype.find = function(str){
	var childElements = [];
	for(var i = 0 ;i<this.elements.length;i++){
		switch (str.charAt(0)){
			case '#':
				childElements.push(this.getId(str.substring(1)));
				break;
			case '.':


				var temps = this.getClass(str.substring(1),this.elements[i]);
				for(var j = 0;j < temps.length;j++){
					childElements.push(temps[j]);
				}


				break;
			default :
				/*
				var tags = this.elements[i].getElementsByTagName(str);
				for(var j=0;j<tags.length;j++){
					childElements.push(tags[j]);
				}*/

				var temps = this.getTagName(str,this.elements[i]);
				for(var j = 0;j < temps.length;j++){
					childElements.push(temps[j]);
				}

		}
	}
	 this.elements = childElements;
	return this;
};

//设置某一个节点的透明度
Base.prototype.opacity = function(num){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.opacity = num/100;
		this.elements[i].style.filter = 'alpha(opacity='+num+')';
	}
	return this;
};


//设置css
Base.prototype.css = function (attr,value){
	for(var i=0;i<this.elements.length;i++){
		if(arguments.length==1){
			return getStyle(this.elements[i],attr);
		}
		this.elements[i].style[attr] = value;
	}
	return this;
};


//触发点击事件
Base.prototype.click = function (fn){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].onclick = fn;
	}
	return this;
};

//设置动画
Base.prototype.animate = function(obj){
	for(var i=0;i<this.elements.length;i++){
		var element = this.elements[i];
		var attr = obj['attr'] == 'x' ? 'left' :obj['attr']== 'y' ? 'top' :
					obj['attr'] == 'w' ? 'width' : obj['attr'] == 'h' ? 'height':
						obj['attr'] == 'o'? 'opacity' : obj['attr'] != undefined ? obj['attr'] : 'left';


		//var attr = obj['attr'] != undefined ? obj['attr'] :'left';                      //可选，默认left
		var start = obj['start'] != undefined ?obj['start'] :
				    attr =='opacity' ? parseFloat(getStyle(element,attr))*100 : parseInt(getStyle(element,attr)) ;    //可选，默认是css中的起始位置
		var t = obj['t'] != undefined ? obj['t'] : 10;                                  //可选，默认是50毫秒执行一次
		var step = obj['step'] != undefined ?obj['step'] :20;                            //可选，每次运行10像素

		var alter = obj['alert'];
		var target = obj['target'];
		var mul = obj['mul'];


		var speed = obj['speed'] != undefined ? obj['speed']:6;
		var type = obj['type']==0 ? 'constant' : obj['type']==1 ? 'buffer' :'buffer';   //可选，0表示匀速，1表示缓冲，默认是缓冲


		if(alter != undefined && target == undefined){
			target = alter +start;
		}else if(alter == undefined && target == undefined && mul == undefined){
			throw  new Error('alter增量或者target目标量必须传一个');
		}



		if(start > target)step*=-1;

		if(attr == 'opacity'){
			element.style.opacity =parseInt(start) / 100;
			element.style.filter = 'alpha(opacity='+start+')';
		}else{
			//element.style[attr] = parseInt(start) +'px';
		}



		if(mul == undefined){
			mul = {};
			mul[attr] = target;
		}


		clearInterval(element.timer);

		element.timer = setInterval(function(){
			/*

			问题1：多个动画执行了多个队列动画，我们要求不管多少动画只执行一个队列动画
			问题2：多个动画数值差别太大，导致动画无法执行到目标值，原因是定时器提前清理掉了

			解决1：不管多少个动画，只提供一次队列动画的机会
			解决2：多个动画按最后一个分动画执行完毕后再清理即可
			 */

			//创建一个布尔值，这个值可以了解多个动画知否全部执行完毕
			var flag = true;//true表示都执行完了

			for(var i in mul) {
				attr = i == 'x' ? 'left' : i == 'y' ? 'top' : i == 'w' ? 'width' : i == 'h' ? 'height' : i == 'o' ? 'opacity' : i != undefined ? i :'left';
				target = mul[i];

				if (type == 'buffer') {
					step = attr == 'opacity' ? (target - parseFloat(getStyle(element, attr)) * 100 ) / speed :
					(target - parseInt(getStyle(element, attr))) / speed;
					step = step > 0 ? Math.ceil(step) : Math.floor(step);
				}

				if (attr == 'opacity') {

					if (step == 0) {
						setOpacity();
					} else if (step > 0 && Math.abs(parseFloat(getStyle(element, attr)) * 100 - target) <= step) {
						setOpacity();
					} else if (step < 0 && (parseFloat(getStyle(element, attr)) * 100 - target) <= Math.abs(step)) {
						setOpacity();
					} else {
						var temp = parseFloat(getStyle(element, attr)) * 100;
						element.style.opacity = parseInt(temp + step) / 100;
						element.style.filter = 'alpha(opacity=' + parseInt(temp + step) + ')';
					}

					if(parseInt(target) != parseInt(parseFloat(getStyle(element,attr))*100)) flag=false;


				} else {
					if (step == 0) {
						setTarget();
					} else if (step > 0 && Math.abs(parseInt(getStyle(element, attr)) - target) <= step) {
						setTarget();
					} else if (step < 0 && (parseInt(getStyle(element, attr)) - target) <= Math.abs(step)) {
						setTarget();
					} else {
						element.style[attr] = parseInt(getStyle(element, attr)) + step + 'px';
					}
					if(parseInt(target) != parseInt(getStyle(element, attr))) flag = false;
				}
				//document.getElementById('test').innerHTML += i+":"+"--"+parseInt(target)+"--"+parseInt(getStyle(element, attr))+'--'+flag+'<br/>';
			}
			//document.getElementById('aaa').innerHTML += getStyle(element,attr)+'<br/>';
			//document.getElementById('aaa').innerHTML += step+'<br/>';

			if(flag){
				clearInterval(element.timer);
				if(obj.fn != undefined) obj.fn();
			}

		},t);

		function setTarget(){
			element.style[attr] = target +'px';

		}

		function setOpacity(){
			element.style.opacity = parseInt(target)/100;
			element.style.filter = 'alpha(opacity='+parseInt(target)+')';
		}

	}
	return this;


};

//设置鼠标移入移出方法
Base.prototype.hover = function(over,out){
	for(var i=0;i<this.elements.length;i++){
		addEvent(this.elements[i],'mouseover',over);
		addEvent(this.elements[i],'mouseout',out);
	}
	return this;
};


//获取某一个节点在整个节点组中是第几个索引
Base.prototype.index = function(){
	var children = this.elements[0].parentNode.children;
	for(var i=0;i<children.length;i++){
		if(this.elements[0] == children[i]) return i;
	}
};


//获取某个节点，并返回Base对象
Base.prototype.eq = function(num){
	var element = this.elements[num];
	this.elements = [];
	this.elements[0] = element;
	return this;
};

//遮罩锁屏功能
Base.prototype.lock = function(){
	for(var i=0;i<this.elements.length;i++){
		fixedScroll.top = getScroll().top;
		fixedScroll.left = getScroll().left;


		this.elements[i].style.width = getInner().width+ getScroll().left +'px';
		this.elements[i].style.height = getInner().height+getScroll().top+'px';

		this.elements[i].style.display = 'block';

		parseFloat(sys.firefox) < 4 ? document.body.style.overflow = 'hidden' : document.documentElement.style.overflow = 'hidden';
		addEvent(this.elements[i],'mousedown',predef);
		addEvent(this.elements[i],'mouseup',predef);
		addEvent(this.elements[i],'selectstart',predef);
		addEvent(window,'scroll',fixedScroll);


	}

	return this;
};

//解除遮罩锁屏
Base.prototype.unlock = function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display = 'none';
		parseFloat(sys.firefox) < 4 ? document.body.style.overflow = 'auto' : document.documentElement.style.overflow = 'auto';
		removeEvent(this.elements[i],'mousedown',predef);
		removeEvent(this.elements[i],'mouseup',predef);
		removeEvent(this.elements[i],'selectstart',predef);
		removeEvent(window,'scroll',fixedScroll);
	}

	return this;
};


//触发浏览器窗口大小改变事件
Base.prototype.resize = function(fn){
	for(var i=0;i<this.elements.length;i++){
		var element = this.elements[i];
		addEvent(window,'resize',function(){
			fn();
			if(element.offsetLeft > getInner().width + getScroll().left - element.offsetWidth){
				element.style.left = getInner().width+getScroll().left- element.offsetWidth+'px';
				if(element.offsetLeft<=0+getScroll().left){
					element.style.left=0+getScroll().left+"px";
				}
			}
			if(element.offsetTop > getInner().height+getScroll().top - element.offsetHeight){
				element.style.top = getInner().height +getScroll().top- element.offsetHeight+'px';
				if(element.offsetTop<=0+getScroll().top){
					element.style.top=0+getScroll().top+"px";
				}
			}
		});

	}
	return this;
};

//设置隐藏
Base.prototype.hide = function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display = 'none';

	}
	return this;
};


//设置显示
Base.prototype.show = function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display = 'block';

	}
	return this;
};

//设置事件发生器
Base.prototype.bind = function(event,fn){
	for(var i=0;i<this.elements.length;i++){
		addEvent(this.elements[i],event,fn);
	}
	return this;
};

//表单字段内容获取
Base.prototype.value = function (str){

	for(var i=0;i<this.elements.length;i++){
		if(arguments.length==0){
			return this.elements[i].value;
		}
		this.elements[i].value = str;
	}
	return this;
};

//设置内容
Base.prototype.html = function (str){

	for(var i=0;i<this.elements.length;i++){
		if(arguments.length==0){
			return this.elements[i].innerHTML;
		}
		this.elements[i].innerHTML = str;
	}
	return this;
};

//获取某一结点的属性
Base.prototype.attr = function(attr,value){
	for(var i=0;i<this.elements.length;i++){
		if(arguments.length==1){
			return this.elements[0].getAttribute(attr);
		}else if(arguments.length==2){
			this.elements[i].setAttribute(attr,value);
		}
	}
	return this;
};
//获取某一个节点对象，并返回这个节点对象
Base.prototype.ge = function(num){
	return  this.elements[num];

};
