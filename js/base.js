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
Base.prototype.value = function(str){

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
//添加Class
Base.prototype.addClass = function(className){
	for(var i=0 ; i<this.elements.length ; i++){
		if(!hasClass(this.elements[i],className)){
			this.elements[i].className += ' '+className;
		}
	}
	return this;
};
//移除class
Base.prototype.removeClass = function(className){
	for(var i=0 ; i<this.elements.length ; i++){
		if(hasClass(this.elements[i],className)){
			this.elements[i].className = this.elements[i].className.replace(new RegExp('(\\s|^)'+className+'(\\s|$)'),'');
		}
	}
	return this;
};


//移除空白节点
function removeWhiteNode(node){
	for(var i=0;i<node.childNodes.length;i++){
		if(node.childNodes[i].nodeType === 3 && /^\s+$/.test(node.childNodes[i].nodeValue) ){
			node.childNodes[i].parentNode.removeChild(node.childNodes[i]);
		}
	}
	return node;
}



//查询面板起飞文本框失去焦点
function search_qf_text_blur(){

	//数据验证
	validate_col('#left_flat .search_qf_text_td .qf_text');

	//隐藏侧边注意事项
	hide_popover("#left_flat .search_qf_text_td .search_ariport_popover");

	//隐藏提示面板
	$("#left_flat .search_qf_text_td .search_qf_info").animate({
		attr:'h',
		target:0,
		step:10,
		t:20,
		fn:function(){
			$("#left_flat .search_qf_text_td .search_qf_info").hide();
		}
	});

	//hide_select_info(false,0);
}
//查询面板到达文本框失去焦点
function search_dd_text_blur(){

	//数据验证
	validate_col('#left_flat .search_dd_text_td .dd_jc');

	//隐藏侧边注意事项
	hide_popover("#left_flat .search_qf_text_td .search_ariport_popover");

	//隐藏提示面板
	$("#left_flat .search_dd_text_td .search_dd_info").animate({
		attr:'h',
		target:0,
		step:10,
		t:20,
		fn:function(){
			$("#left_flat .search_dd_text_td .search_dd_info").hide();
		}
	});
	//hide_select_info(false,0);
}

//显示侧面注意事项面板
function show_popover(clazz,that){

	if( (trim($(that).value())=='') || ($(that).css("border-bottom-width")=='1.5px') ){
		//显示侧边注意事项
		if($(clazz).css("display")=='none'){
			$(clazz).show().animate({
				t:30,
				step:10,
				mul:{
					o:100,
					x:345
				}
			}).css("left","385px");
		}
	}


}

//隐藏侧面注意事项面板
function hide_popover(clazz){

	//统一清理事件
	//removeEvent($('#left_flat .search_qf_text_td .qf_text').ge(0),"blur",search_qf_text_blur);
	//removeEvent($('#left_flat .search_dd_text_td .dd_jc').ge(0),"blur",search_dd_text_blur);

	//统一添加事件
	//$('#left_flat .search_dd_text_td .dd_jc').bind('blur',search_dd_text_blur);
	//$('#left_flat .search_qf_text_td .qf_text').bind('blur',search_qf_text_blur);
	//console.log("恢复起飞输入框的失去焦点函数");
	//console.log("恢复到达输入框的失去焦点函数");

	$(clazz).animate({
		t:30,
		step:10,
		mul:{
			o:0,
			x:425
		},
		fn:function(){
			$(clazz).hide();
		}
	});
}

//数据过滤
function Filter_data(){

	var element = d3.select('#svg_map g');
	var line_list = element.selectAll("path.line");
	var filter = serializeFilter();
	console.log(line_list[0]);
	for(var i = 0 ;i<line_list[0].length;i++){
		d3.select(line_list[0][i]).style(function(d){
			console.log(d);
			//只显示筛选后的数据
			if(filter.filter_type=='hide'){

			}else if(filter.filter_type=='show'){

			}
		});
	}
	//console.log(line_list);

}



//异步查询航班数据
function getFlight_data(e){
	predef(e);
	console(validate_search());
	//ajax({
	//	method:'get',
	//	url:"/index.php?c=index&a=search",
	//	data:serializeSearch(),
	//	success : function(text){
	//		var temp = JSON.parse(text);
	//		//console.log(data);
	//		var data=[];
	//		//data[0] = temp[0];
	//		//data[1] = temp[1];
	//		(function(){
	//			for(var i = 0;i<20 ;i++){
	//				data[i]=temp[i];
	//			}
	//		})();
	//
	//		//曲线生成模式1，无附加背景
	//		//show_line(data);
	//
	//		//曲线生成模式2，附加背景
	//		show_line_plus(data);
	//
	//		/*
	//		 var index = 0;
	//
	//		 //console.log(array);
	//		 //更新
	//		 var array_data=[] ;
	//		 d3.select('#svg_map g')
	//		 .selectAll("path.line")
	//		 .data(data)
	//		 .attr("d",function(d){
	//		 //console.log("update:");
	//		 //console.log(d);
	//		 array_data = getLine_xy([d.qf_latitude,d.qf_longitude],[d.mb_latitude,d.mb_longitude]);
	//
	//		 array[index++].len = array_data[9][0];
	//		 console.log(array_data);
	//
	//
	//
	//
	//
	//		 ////kx1,ky1
	//		 //d3.select("svg g").append("circle")
	//		 //	.attr("cx",array_data[10][0][0])
	//		 //	.attr("cy",array_data[10][0][1])
	//		 //	.attr("r",5)
	//		 //	.style("fill","red");
	//		 ////kx2,ky2
	//		 //d3.select("svg g").append("circle")
	//		 //	.attr("cx",array_data[10][1][0])
	//		 //	.attr("cy",array_data[10][1][1])
	//		 //	.attr("r",5)
	//		 //	.style("fill","blue");
	//		 ////kx3,ky3
	//		 //d3.select("svg g").append("circle")
	//		 //	.attr("cx",array_data[10][2][0])
	//		 //	.attr("cy",array_data[10][2][1])
	//		 //	.attr("r",5)
	//		 //	.style("fill","red");
	//		 ////kx4,ky4
	//		 //d3.select("svg g").append("circle")
	//		 //	.attr("cx",array_data[10][3][0])
	//		 //	.attr("cy",array_data[10][3][1])
	//		 //	.attr("r",5)
	//		 //	.style("fill","red");
	//		 //
	//		 ////kx5,ky5
	//		 //d3.select("svg g").append("circle")
	//		 //	.attr("cx",array_data[10][4][0])
	//		 //	.attr("cy",array_data[10][4][1])
	//		 //	.attr("r",5)
	//		 //	.style("fill","red");
	//		 ////kx6,ky6
	//		 //d3.select("svg g").append("circle")
	//		 //	.attr("cx",array_data[10][5][0])
	//		 //	.attr("cy",array_data[10][5][1])
	//		 //	.attr("r",5)
	//		 //	.style("fill","red");
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//		 d3.select('#svg_map g')
	//		 .append("path")
	//		 .classed("line_bg",true)
	//		 .attr("d",function(){
	//		 return array_data[11];
	//		 }).on();
	//
	//		 return array_data[0];
	//
	//		 })
	//		 .attr("len", function(d){
	//		 return d.len;
	//		 })
	//		 .on('mouseenter',function(){
	//		 //console.log("进1");
	//		 }).on('mouseout',function(){
	//		 //console.log("出1");
	//		 });
	//		 //enter
	//		 d3.select('#svg_map g')
	//		 .selectAll("path.line")
	//		 .data(array)
	//		 .enter()
	//		 .append("path")
	//		 .classed("line",true)
	//		 .attr("d",function(d){
	//		 //console.log("enter:");
	//		 //console.log(d);
	//		 array_data = getLine_xy([d.qf_latitude,d.qf_longitude],[d.mb_latitude,d.mb_longitude]);
	//		 array[index++].len = array_data[9][0];
	//		 console.log(array_data);
	//
	//
	//
	//
	//		 ////k1
	//		 //d3.select("svg g").append("circle")
	//		 //	.attr("cx",array_data[10][0][0])
	//		 //	.attr("cy",array_data[10][0][1])
	//		 //	.attr("r",5)
	//		 //	.style("fill","red");
	//		 ////k6
	//		 //d3.select("svg g").append("circle")
	//		 //	.attr("cx",array_data[10][1][0])
	//		 //	.attr("cy",array_data[10][1][1])
	//		 //	.attr("r",5)
	//		 //	.style("fill","red");
	//		 ////k3
	//		 //d3.select("svg g").append("circle")
	//		 //	.attr("cx",array_data[10][2][0])
	//		 //	.attr("cy",array_data[10][2][1])
	//		 //	.attr("r",5)
	//		 //	.style("fill","red");
	//		 ////k4
	//		 //d3.select("svg g").append("circle")
	//		 //	.attr("cx",array_data[10][3][0])
	//		 //	.attr("cy",array_data[10][3][1])
	//		 //	.attr("r",5)
	//		 //	.style("fill","red");
	//		 //
	//		 ////k5
	//		 //d3.select("svg g").append("circle")
	//		 //	.attr("cx",array_data[10][4][0])
	//		 //	.attr("cy",array_data[10][4][1])
	//		 //	.attr("r",5)
	//		 //	.style("fill","red");
	//		 ////k2
	//		 //d3.select("svg g").append("circle")
	//		 //	.attr("cx",array_data[10][5][0])
	//		 //	.attr("cy",array_data[10][5][1])
	//		 //	.attr("r",5)
	//		 //	.style("fill","blue");
	//
	//
	//
	//
	//
	//
	//
	//		 d3.select('#svg_map g')
	//		 .append("path")
	//		 .classed("line_bg",true)
	//		 .attr("d",function(){
	//		 return array_data[11];
	//		 }).on('mouseenter',function(d){
	//
	//
	//
	//		 //console.log("进2");
	//		 //console.log(this);
	//		 //console.log(d);
	//		 var point = d3.mouse(svg.node());
	//		 //alert(point[0]+","+svgToMatch(point[1]) );
	//		 //alert(point[0]+","+point[1] );
	//		 //console.log(d);
	//
	//
	//		 //鼠标移入，更新信息面板
	//		 $('#flight_info .flight_code span').html(d.flight_number);
	//		 $('#flight_info .flight_company span').html(d.airline_company);
	//		 $('#flight_info .flight_qf_jc span').html(d.qf_airport);
	//		 $('#flight_info .flight_mb_jc span').html(d.mb_airport);
	//		 $('#flight_info .flight_qf_time span').html(d.leave_downtime);
	//		 $('#flight_info .flight_dd_time span').html(d.come_downtime);
	//
	//		 //鼠标移入，信息面板出现
	//		 $('#flight_info').animate({
	//		 t:30,
	//		 step:10,
	//		 mul:{
	//		 left:point[0],
	//		 top:point[1]+20,
	//		 o:100
	//		 }
	//		 }).show();
	//
	//
	//
	//
	//		 //鼠标移入，线条颜色高亮
	//		 d3.select('.line').attr("filter","url(#f1)").style("cursor","crosshair").transition().duration(300).style("stroke","#F0705D").style("stroke-width","2px");
	//
	//
	//		 }).on('mouseout',function(){
	//		 //d3.select(this).style("stroke","#75baff");
	//
	//		 //鼠标移出，线条颜色恢复
	//		 d3.select('.line').attr("filter",false).style("cursor","pointer").transition().duration(300).style("stroke","#75baff").style("stroke-width","1px");
	//		 //console.log("出2");
	//
	//		 //鼠标移出，信息面板隐藏
	//		 $('#flight_info').animate({
	//		 attr:'o',
	//		 target:0,
	//		 t:30,
	//		 step:10
	//		 }).hide();
	//		 });
	//
	//
	//
	//
	//
	//
	//
	//
	//		 return array_data[0];
	//		 })
	//		 .attr("len", function(d){
	//		 return d.len;
	//		 })
	//		 .on('mouseenter',function(d){
	//		 //console.log("进2");
	//		 //console.log(this);
	//		 //console.log(d);
	//		 var point = d3.mouse(svg.node());
	//		 //alert(point[0]+","+svgToMatch(point[1]) );
	//		 //alert(point[0]+","+point[1] );
	//		 //console.log(d);
	//
	//
	//		 //鼠标移入，更新信息面板
	//		 $('#flight_info .flight_code span').html(d.flight_number);
	//		 $('#flight_info .flight_company span').html(d.airline_company);
	//		 $('#flight_info .flight_qf_jc span').html(d.qf_airport);
	//		 $('#flight_info .flight_mb_jc span').html(d.mb_airport);
	//		 $('#flight_info .flight_qf_time span').html(d.leave_downtime);
	//		 $('#flight_info .flight_dd_time span').html(d.come_downtime);
	//
	//		 //鼠标移入，信息面板出现
	//		 $('#flight_info').animate({
	//		 t:30,
	//		 step:10,
	//		 mul:{
	//		 left:point[0],
	//		 top:point[1]+20,
	//		 o:100
	//		 }
	//		 }).show();
	//
	//		 //鼠标移入，线条颜色高亮
	//		 d3.select(this).attr("filter","url(#f1)").style("cursor","crosshair").transition().duration(300).style("stroke","#F0705D").style("stroke-width","2px");
	//
	//
	//		 }).on('mouseout',function(){
	//		 //d3.select(this).style("stroke","#75baff");
	//
	//		 //鼠标移出，线条颜色恢复
	//		 d3.select(this).attr("filter",false).style("cursor","pointer").transition().duration(300).style("stroke","#75baff").style("stroke-width","1px");
	//		 //console.log("出2");
	//
	//		 //鼠标移出，信息面板隐藏
	//		 $('#flight_info').animate({
	//		 attr:'o',
	//		 target:0,
	//		 t:30,
	//		 step:10
	//		 }).hide();
	//		 });
	//
	//
	//
	//		 //exit
	//		 d3.select('#svg_map g')
	//		 .selectAll("path.line")
	//		 .data(array)
	//		 .exit()
	//		 .remove();
	//
	//		 console.log(array);
	//
	//		 */
	//		//alert(data.length);
	//	},
	//	error : function(text){
	//		alert("error"+text);
	//	},
	//	async:true
	//});


}
//曲线生成模式1，无附加背景(速度快，数据量大时使用，交互性差)
function show_line(data){

	var index = 0;
	//更新
	var array=[];
	d3.select('#svg_map g')
		.selectAll("path.line")
		.data(data)
		.attr("d",function(d){

			/*
			 //直连式
			 //对两点之间进行相关计算，返回数组
			 array = getLine_xy([d.qf_latitude,d.qf_longitude],[d.mb_latitude,d.mb_longitude]);
			 //将计算后的两地之间的坐标距离存入要进行绑定的数组
			 //data[index++].len = array[9][0];
			 //console.log(data);
			 return array[0];
			 */

			//断开式
			array = getLine_xy_plus([d.qf_latitude,d.qf_longitude],[d.mb_latitude,d.mb_longitude]);
			return array[0];

		})
		.attr("len", function(d){
			//显示两点之间的直线坐标距离
			return d.len;
		}).on('mouseenter',function(d){ show_flight_info(d,this); } ).on('mouseout',function(d){ hide_flight_info(this) });


	//enter
	index = 0;
	d3.select('#svg_map g')
		.selectAll("path.line")
		.data(data)
		.enter()
		.append("path")
		.classed("line",true)
		.attr("d",function(d){
			/*
			 //直连式
			 //对两点之间进行相关计算，返回数组
			 array = getLine_xy([d.qf_latitude,d.qf_longitude],[d.mb_latitude,d.mb_longitude]);
			 //将计算后的两地之间的坐标距离存入要进行绑定的数组
			 data[index++].len = array[9][0];
			 //console.log(data);
			 return array[0];
			 */

			//断开式
			array = getLine_xy_plus([d.qf_latitude,d.qf_longitude],[d.mb_latitude,d.mb_longitude]);
			return array[0];
		})
		.attr("len", function(d){ return d.len; } )
		.on('mouseenter',function(d){ show_flight_info(d,this); } ).on('mouseout',function(d){ hide_flight_info(this) });

	//exit
	d3.select('#svg_map g')
		.selectAll("path.line")
		.data(data)
		.exit()
		.remove();

}

//曲线生成模式2,有附加背景(速度较慢，数据量小时使用，交互性好)
function show_line_plus(data){

	//清空多余背景
	d3.selectAll('#svg_map g .line_bg').remove();
	//生成曲线
	var index = 0;
	//曲线update
	var array=[];
	d3.select('#svg_map g')
		.selectAll("path.line")
		.data(data)
		.attr("id",function(d){
			return "line_"+d.flight_number;
		})
		.attr("d",function(d){

			//直接连接式
			//对两点之间进行相关计算，返回数组
			array = getLine_xy([d.qf_latitude,d.qf_longitude],[d.mb_latitude,d.mb_longitude]);
			//将计算后的两地之间的坐标距离存入要进行绑定的数组
			data[index++].len = array[9][0];
			//console.log(data);
			show_line_bg(d,array[11],d.flight_number);
			return array[0];

			/*
			 //断开式
			 array = getLine_xy_plus([d.qf_latitude,d.qf_longitude],[d.mb_latitude,d.mb_longitude]);
			 console.log(array);
			 show_line_bg(d,array[6], d.flight_number);
			 return array[0];
			 */

		})
		.attr("len", function(d){
			//显示两点之间的直线坐标距离
			return d.len;
		});

	//曲线enter
	index = 0;
	d3.select('#svg_map g')
		.selectAll("path.line")
		.data(data)
		.enter()
		.append("path")
		.classed("line",true)
		.attr("id",function(d){
			return "line_"+d.flight_number;
		})
		.attr("d",function(d){

			//计算两地之间的相关数据
			array = getLine_xy([d.qf_latitude,d.qf_longitude],[d.mb_latitude,d.mb_longitude]);
			//将两点之间的直线坐标距离存储在要绑定的数组里
			data[index++].len = array[9][0];
			show_line_bg(d,array[11],d.flight_number);
			return array[0];

			/*
			 //断开式
			 array = getLine_xy_plus([d.qf_latitude,d.qf_longitude],[d.mb_latitude,d.mb_longitude]);
			 console.log(array);
			 show_line_bg(d,array[6], d.flight_number);
			 return array[0];
			 */

		})
		.attr("len", function(d){ return d.len; } );

	//曲线exit
	d3.select('#svg_map g')
		.selectAll("path.line")
		.data(data)
		.exit()
		.remove();

	//console.log(data);
	//console.log(array);


	function show_line_bg(data,path,flight_number){

		var line_id;
		d3.select('#svg_map g')
			.append("path")
			.datum(data)
			.classed("line_bg",true)
			.attr("id",function(){
				return "line_bg_"+flight_number;
			})
			.attr("d",function(){
				return path;
			}).on("mouseenter",function(d){
				line_id =  d3.select(this).attr("id").replace("line_bg_","line_");

				//d3.select(line_id).
				show_flight_info(d,'#svg_map g #'+line_id);
				//console.log(typeof line_id);
				//alert(d3.select(this).attr("id")+","+line_id);
			}).on("mouseout",function(){
				line_id =  d3.select(this).attr("id").replace("line_bg_","line_");
				hide_flight_info('#svg_map g #'+line_id);
			});

	}

}

//异步查询航空公司
function get_company(){
	if($('#left_flat .airline_company .company_text').value()!=''){
		var type = $('#left_flat .airline_company .airline_company_info').attr("type");
		var text = $('#left_flat .airline_company .company_text').value();

		//查询航空公司
		ajax({
			method:'get',
			url:"/index.php?c=index&a=searchInfo",
			data:{
				"type":type,
				"text":text
			},
			success:function(text){
				var data = JSON.parse(text);
				//什么结果也没有查到时，隐藏窗口

				var element =  d3.select("#left_flat .airline_company .airline_company_info .context");
				if($('#left_flat .airline_company .airline_company_info').css("display")=='block'){
					$('#left_flat .airline_company .airline_company_info').show().css("height","auto").css("left","0px");
				}else{
					$('#left_flat ..airline_company .airline_company_info').show().css("height","auto").css("left","0px").animate({
						attr:'o',
						target:'100',
						t:30,
						step:10
					}).opacity(0);
				}

				//console.log(element);
				//存储查询结果的最长值
				var max_lenght = 0;
				//更新
				element.selectAll("li")
					.data(data)
					.text(function(d){
						if(d.length>max_lenght){
							max_lenght = d.length;
						}
						//console.log(d+":"+d.length);
						//console.log("max_lenght:"+max_lenght);
						return d;

					}).on('mousedown',function(){
						//hide_select_info(true,0,this);
						hide_company_info(true,this);
					});
				//进入
				element.selectAll("li")
					.data(data)
					.enter()
					.append("li")
					.text(function(d){
						if(d.length>max_lenght){
							max_lenght = d.length;
						}
						//console.log(d+":"+d.length);
						//console.log("max_lenght:"+max_lenght);
						return d;
					}).on('mousedown',function(){
						//hide_select_info(true,0,this);
						hide_company_info(true,this);
					});

				//退出
				element.selectAll("li")
					.data(data)
					.exit()
					.remove();

			},
			error:function(text){
				alert("error"+text)
			},
			async:true
		});
	}else if($('#left_flat .airline_company .company_text').value()==''){
		hide_company_info(false,this);
	}
}

//过滤面板查询航司
function filter_get_company(p_text,p_ul,p_context,p_loading){
	if( trim($(p_text).value())!='' ){
		var text = $(p_text).value();

		//查询开始前，显示加载中动画，隐藏内容区，隐藏注意事项提示
		if($(p_text).css("border-bottom-width")=='1.5px'){
			show_popover("#left_flat .airline_company .search_company_popover",p_text);
		}else{
			hide_popover("#left_flat .airline_company .search_company_popover");
		}

		$(p_ul).show().opacity(100).css("height","auto");
		$(p_context).hide();
		$(p_loading+" .ing").show();
		$(p_loading+" .trim").hide();
		$(p_loading).show().animate({
			attr:'o',
			target:100,
			step:10,
			t:30
		}).opacity(0);


		ajax({
			method:'get',
			url:"/index.php?c=index&a=searchInfo",
			data:{
				"type":"company",
				"text":text
			},
			success : function(text){
				//查询成功，隐藏加载中动画,显示内容区
				$(p_loading).hide();
				$(p_context).show();


				//提示框内容节点
				var element =  d3.select(p_context);

				var data = JSON.parse(text);

				//当查询结果为空时
				if(data.length==0){

					if( $(p_ul).css("display")=='block' ){
						$(p_ul).css("display","block").css("height","25px");
						$(p_loading).css("display","block");
						$(p_loading+" .ing").css("display","none");
						$(p_loading+" .trim").css("display","block");
					}

				}


				//更新
				element.selectAll("li")
					.data(data)
					.text(function(d){
						return d;
					}).on('mousedown',function(){

						var text = trim($(this).html());
						$(p_text).value( text );

						$(p_ul).animate({
							attr:'o',
							target:0,
							step:10,
							t:20,
							fn:function(){
								$(p_ul).hide();
							}
						});

						//hide_select_info(true,0,this);
						//hide_select_info(true,0,this);
					});

				//进入
				element.selectAll("li")
					.data(data)
					.enter()
					.append("li")
					.text(function(d){
						return d;
					}).on('mousedown',function(){

						var text = trim($(this).html());
						$(p_text).value( text );

						$(p_ul).animate({
							attr:'o',
							target:0,
							step:10,
							t:20,
							fn:function(){
								$(p_ul).hide();
							}
						});

						//hide_select_info(true,0,this);
					});

				//退出
				element.selectAll("li")
					.data(data)
					.exit()
					.remove();

			},
			error : function(text){
				alert("error"+text);
			},
			async:true
		});
	}else if( trim($(p_text).value())=='' ) {
		//console.log(trim($(p_text).value())=='');
		//隐藏提示面板
		$(p_ul).animate({
			attr:'o',
			target:0,
			step:10,
			t:20,
			fn:function(){
				$(p_ul).hide();
			}
		});

	}
}

//航班信息面板显示
function show_flight_info(d,that){
	var point = d3.mouse(svg.node());
	//console.log(d);
	//鼠标移入，更新信息面板
	$('#flight_info .flight_city span').html(d.qf_city + "-" + d.mb_city);
	$('#flight_info .flight_code span').html(d.flight_number);
	$('#flight_info .flight_company span').html(d.airline_company);
	$('#flight_info .flight_qf_jc span').html(d.qf_airport);
	$('#flight_info .flight_mb_jc span').html(d.mb_airport);
	$('#flight_info .flight_qf_time span').html(d.leave_downtime);
	$('#flight_info .flight_dd_time span').html(d.come_downtime);

	//鼠标移入，信息面板出现
	$('#flight_info').animate({
		t:30,
		step:10,
		mul:{
			left:point[0],
			top:point[1]+20,
			o:100
		}
	}).show();

	//console.log(typeof that);
	//console.log(that);

	//鼠标移入，线条颜色高亮
	d3.select(that).attr("filter","url(#f1)").style("cursor","crosshair").transition().duration(300).style("stroke","#F0705D").style("stroke-width","2px");
}

//航班信息面板隐藏
function hide_flight_info(that){
	//鼠标移出，线条颜色恢复
	d3.select(that).attr("filter",false).style("cursor","pointer").transition().duration(300).style("stroke","#75baff").style("stroke-width","1px");
	//console.log("出2");
	//鼠标移出，信息面板隐藏
	$('#flight_info').animate({
		attr:'o',
		target:0,
		t:20,
		step:20,
		fn:function(){
			$('#flight_info').hide();
		}
	});
}

//隐藏航空公司提示框
function hide_company_info(bool,that){

	if(bool){
		var text = trim($(that).html());
		$('#left_flat .airline_company .company_text').value(text);
	}
	$('#left_flat .airline_company .airline_company_info').animate({
		attr:'h',
		t:30,
		step:10,
		target:0,
		fn:function(){
			$('#left_flat .airline_company .airline_company_info').hide();
		}
	});

}

//显示查询-起飞选项
function show_qf_opt(){

	$('#left_flat .qf_option .qf_opt').animate({
		t:30,
		step:10,
		mul:{
			h:104,
			o:100
		}
	}).show();
	$('#left_flat .qf_option .qf_img_down').attr('src','svg/select_up.svg');

}

//显示过滤-起飞选项
function show_filter_qf_opt(){

	$('#left_flat .filter .filter_qf_td .filter_qf_opt').animate({
		t:30,
		step:10,
		mul:{
			h:104,
			o:100
		}
	}).show();
	$('#left_flat .filter .filter_qf_td .qf_img_down').attr('src','svg/select_up.svg');

}

//隐藏过滤-起飞选项
function hide_filter_qf_opt(){

	$('#left_flat .filter .filter_qf_td .filter_qf_opt').animate({
		t:30,
		step:10,
		mul:{
			h:0,
			o:0
		},
		fn:function(){
			$('#left_flat .filter .filter_qf_td .filter_qf_opt').hide();
			$('#left_flat .filter .filter_qf_td .qf_img_down').attr('src','svg/select_down.svg');
		}
	});
}

//隐藏过滤-到达选项
function hide_filter_dd_opt(){

	$('#left_flat .filter .filter_dd_td .filter_dd_opt').animate({
		t:30,
		step:10,
		mul:{
			h:0,
			o:0
		},
		fn:function(){
			$('#left_flat .filter .filter_dd_td .filter_dd_opt').hide();
			$('#left_flat .filter .filter_dd_td .qf_img_down').attr('src','svg/select_down.svg');
		}
	});
}

//显示过滤-到达选项
function show_filter_dd_opt(){

	$('#left_flat .filter .filter_dd_td .filter_dd_opt').animate({
		t:30,
		step:10,
		mul:{
			h:104,
			o:100
		}
	}).show();
	$('#left_flat .filter .filter_dd_td .qf_img_down').attr('src','svg/select_up.svg');

}

//隐藏查询-起飞选项
function hide_qf_opt(){
	$('#left_flat .qf_option .qf_opt').animate({
		t:30,
		step:10,
		mul:{
			h:0,
			o:0
		},
		fn:function(){
			$('#left_flat .qf_option .qf_opt').hide();
			$('#left_flat .qf_option .qf_img_down').attr('src','svg/select_down.svg');
		}
	});
}

//显示到达选项
function show_dd_opt(){


	$('#left_flat qf_option .dd_opt').show();
	$('#left_flat qf_option .dd_opt').animate({
		t:30,
		step:10,
		mul:{
			h:104,
			o:100
		}
	});
	$('#left_flat qf_option .dd_img_down').attr('src','svg/select_up.svg');
}

//隐藏到达选项
function hide_dd_opt(){
	$('#left_flat qf_option .dd_opt').animate({
		t:30,
		step:10,
		mul:{
			h:0,
			o:0
		},
		fn:function(){
			$('#left_flat qf_option .dd_opt').hide();
			$('#left_flat qf_option .dd_img_down').attr('src','svg/select_down.svg');
		}
	});
}

//根据起飞选项类型查询机场/国家
function get_qf_opt(){
	if( trim($('#left_flat .qf_text').value())!='' ){
		var type = $('#left_flat .qf_option .qf_input').attr("key");
		var text = $('#left_flat .qf_text').value();

		//根据起飞选项类型查询机场/国家
		ajax({
			method:'get',
			url:"/index.php?c=index&a=searchInfo",
			data:{
				"type":type,
				"text":text,
				"state":"qf"
			},
			success : function(text){
				(function(){
					var data = JSON.parse(text);
					//什么结果也没有查到时，隐藏窗口
					if(data.length==0){
						hide_select_info(false,0,this);
					}
					var element =  d3.select("#left_flat .qf_select_info .context");
					if($('#left_flat .qf_select_info').css("display")=='block'){
						$('#left_flat .qf_select_info').show().css("height","auto").css("left","0px");
					}else{
						$('#left_flat .qf_select_info').show().css("height","auto").css("left","0px").animate({
							attr:'o',
							target:'100',
							t:30,
							step:10
						}).opacity(0);
					}

					//存储查询结果的最长值
					var max_lenght = 0;

					//更新
					element.selectAll("li")
						.data(data)
						.text(function(d){
							if(d.length>max_lenght){
								max_lenght = d.length;
							}
							//console.log(d+":"+d.length);
							//console.log("max_lenght:"+max_lenght);
							return d;

						}).on('mousedown',function(){
							hide_select_info(true,0,this);
						});
					//进入
					element.selectAll("li")
						.data(data)
						.enter()
						.append("li")
						.text(function(d){
							if(d.length>max_lenght){
								max_lenght = d.length;
							}
							//console.log(d+":"+d.length);
							//console.log("max_lenght:"+max_lenght);
							return d;
						}).on('mousedown',function(){
							hide_select_info(true,0,this);
						});

					//退出
					element.selectAll("li")
						.data(data)
						.exit()
						.remove();

					//当查询结果最长长度小于等于17，提示框的宽度是15rem,反之为33rem
					if(max_lenght<=17){
						$('#left_flat .qf_select_info').css("width","15rem");
					}else{
						$('#left_flat .qf_select_info').css("width","33rem");
					}
				})();
			},
			error : function(text){
				alert("error"+text);
			},
			async:true

		});

	}else if ( trim($('#left_flat .qf_text').value())=='' ) {
		hide_select_info(false,0,this);
	}
}
//根据起飞选项类型查询机场/国家
function get_qf_opt2(p_text,p_input,p_ul,p_context,p_loading,state){
	//search_qf_text_blur();

	//if( /(.*[^A-Z]+.*)/g.test(trim($(p_text).value())) ){
	//	var a = /(.*[^A-Z]+.*)/g.exec(trim($(p_text).value()));
	//	//var a = trim($(p_text).value()).match(/([^A-Z\/]+)+/);
	//	console.log(a);
	//}

	if( trim($(p_text).value())!='' ){
		//var val = trim($(p_text).value());
		//var reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>?~！@#￥……&*（）——|{}【】‘；：”“'。，a-z、0-9？+-]");
		//var rs = "";
		//(function(){
		//	for (var i = 0, l = val.length; i < val.length; i++) {
		//		rs = rs + val.substr(i, 1).replace(reg, '');
		//	}
		//
		//})();
		//
		//console.log(rs);
		//$(p_text).value(rs);




		//console.log("get_qf_opt2");
		var type = $(p_input).attr("key");
		var text = $(p_text).value();

		//查询开始前，显示加载中动画，隐藏内容区,隐藏注意事项面板
		if($(p_text).css("border-bottom-width")!='1.5px'){
			hide_popover("#left_flat .search_qf_text_td .search_ariport_popover");
		}

		$(p_ul).css("width","15rem").show().opacity(100).css("height","auto");
		$(p_context).hide();
		$(p_loading+" .ing").show();
		$(p_loading+" .trim").hide();
		$(p_loading).show().animate({
			attr:'o',
			target:100,
			step:10,
			t:30
		}).opacity(0);


		ajax({
			method:'get',
			url:"/index.php?c=index&a=searchInfo",
			data:{
				"type":type,
				"text":text,
				"state":state
			},
			success : function(text){
				//查询成功，隐藏加载中动画,显示内容区
				$(p_loading).hide();
				$(p_context).show();


				//提示框内容节点
				var element =  d3.select(p_context);

				var data = JSON.parse(text);

				//当查询结果为空时
				if(data.length==0){
					//当父面板还没有隐藏的时候，显示信息
					if($(p_ul).css("display")=='block'){
						$(p_ul).css("display","block").css("height","25px");
						$(p_loading).css("display","block");
						$(p_loading+" .ing").css("display","none");
						$(p_loading+" .trim").css("display","block");
					}


				}

				//存储查询结果的最长值
				var max_lenght = 0;

				//更新
				element.selectAll("li")
					.data(data)
					.text(function(d){
						if(d.length>max_lenght){
							max_lenght = d.length;
						}
						//console.log(d+":"+d.length);
						//console.log("max_lenght:"+max_lenght);
						return d;

					}).on('mousedown',function(){
						//hide_select_info(true,0,this);
						var text = trim($(this).html());
						var key = $(p_input).value();
						if(key.indexOf("机场") > -1){
							var result = /\([A-Z\/]+\)/i.exec(text);
							if(result!=null){
								//console.log(result);
								result = result[0];
								//console.log(result);
								result = result.replace("(","");
								//console.log(result);
								result = result.replace(")","");
								//console.log(result);
								$(p_text).value( result );
							}else{
								$(p_text).value( text );
							}

						}else{
							$(p_text).value( text );
						}

						$(p_ul).animate({
							attr:'o',
							target:0,
							step:10,
							t:20,
							fn:function(){
								$(p_ul).hide();
							}
						});

					});

				//进入
				element.selectAll("li")
					.data(data)
					.enter()
					.append("li")
					.text(function(d){
						if(d.length>max_lenght){
							max_lenght = d.length;
						}
						//console.log(d+":"+d.length);
						//console.log("max_lenght:"+max_lenght);
						return d;
					}).on('mousedown',function(){


						var text = trim($(this).html());
						var key = $(p_input).value();
						if(key.indexOf("机场") > -1){
							var result = /\([A-Z\/]+\)/i.exec(text);
							if(result!=null){
								//console.log(result);
								result = result[0];
								//console.log(result);
								result = result.replace("(","");
								//console.log(result);
								result = result.replace(")","");
								//console.log(result);
								$(p_text).value( result );
							}else{
								$(p_text).value( text );
							}

						}else{
							$(p_text).value( text );
						}

						$(p_ul).animate({
							attr:'o',
							target:0,
							step:10,
							t:20,
							fn:function(){
								$(p_ul).hide();
							}
						});



						//hide_select_info(true,0,this);

					});

				//退出
				element.selectAll("li")
					.data(data)
					.exit()
					.remove();

				//当查询结果最长长度小于等于17，提示框的宽度是15rem,反之为33rem
				if(max_lenght<=17){
					$(p_ul).css("width","15rem");
				}else{
					$(p_ul).css("width","33rem");
				}

				//console.log(max_lenght);
				//alert("error"+text);
			},
			error : function(text){
				alert("error"+text);
			},
			async:true
		});
	}else if( trim($(p_text).value())=='' ) {
		//console.log(trim($(p_text).value())=='');

		//隐藏提示面板
		$(p_ul).animate({
			attr:'o',
			target:0,
			step:10,
			t:20,
			fn:function(){
				$(p_ul).hide();

			}
		});

	}

	//console.log(serializeFilter());
}

//根据到达选项类型查询机场/国家
function get_dd_opt(){
	if( trim($('#left_flat .dd_jc').value())!='' ){
		var type = $('#left_flat .qf_option .dd_input').attr("key");
		var text = $('#left_flat .dd_jc').value();

		//根据起飞选项类型查询机场/国家
		ajax({
			method:'get',
			url:"/index.php?c=index&a=searchInfo",
			data:{
				"type":type,
				"text":text,
				"state":"dd"
			},
			success : function(text){
				(function(){
					var data = JSON.parse(text);
					//什么结果也没有查到时，隐藏窗口
					if(data.length==0){
						hide_select_info(false,0,this);
					}
					var element =  d3.select("#left_flat .qf_select_info .context");
					if($('#left_flat .qf_select_info').css("display")=='block'){
						$('#left_flat .qf_select_info').show().css("height","auto").css("left","190px");
					}else{
						$('#left_flat .qf_select_info').show().css("height","auto").css("left","190px").animate({
							attr:'o',
							target:'100',
							t:30,
							step:10
						}).opacity(0);
					}

					//存储查询结果的最长值
					var max_lenght = 0;

					//更新
					element.selectAll("li")
						.data(data)
						.text(function(d){
							if(d.length>max_lenght){
								max_lenght = d.length;
							}
							//console.log(d+":"+d.length);
							//console.log("max_lenght:"+max_lenght);
							return d;
						}).on('mousedown',function(){
							hide_select_info(true,190,this);
						});

					//进入
					element.selectAll("li")
						.data(data)
						.enter()
						.append("li")
						.text(function(d){
							if(d.length>max_lenght){
								max_lenght = d.length;
							}
							//console.log(d+":"+d.length);
							//console.log("max_lenght:"+max_lenght);
							return d;
						}).on('mousedown',function(){
							hide_select_info(true,190,this);
						});
					//退出
					element.selectAll("li")
						.data(data)
						.exit()
						.remove();

					//当查询结果最长长度小于等于17，提示框的宽度是15rem,反之为33rem
					if(max_lenght<=17){
						$('#left_flat .qf_select_info').css("width","15rem");
					}else{
						$('#left_flat .qf_select_info').css("width","33rem");
					}

				})();
			},
			error : function(text){
				alert("error"+text);
			},
			async:true

		});

	}else if ( trim($('#left_flat .dd_jc').value())=='' ) {
		hide_select_info(false,190,this);
	}
}

//隐藏机场/国家查询提示框
function hide_select_info(bool,left,that){
	if($('#left_flat .qf_select_info').attr("type")=='qf'){
		//alert("qf:"+left);
		if(bool){
			(function(){
				var text = trim($(that).html());
				var key = $('#left_flat .qf_option .qf_input').value();
				if(key.indexOf("机场") > -1){
					var result = /\([A-Z\/]+\)/i.exec(text);
					if(result!=null){
						//console.log(result);
						result = result[0];
						//console.log(result);
						result = result.replace("(","");
						//console.log(result);
						result = result.replace(")","");
						//console.log(result);
						$('#left_flat .qf_text').value( result );
					}else{
						$('#left_flat .qf_text').value( text );
					}

				}else{
					$('#left_flat .qf_text').value( text );
				}
			})();


		}

		$('#left_flat .qf_select_info').animate({
			attr:'h',
			t:30,
			step:10,
			target:0,
			fn:function(){
				$('#left_flat .qf_select_info').hide();
			}
		}).css("left",left);

	}else if($('#left_flat .qf_select_info').attr("type")=='dd'){
		//alert("dd:"+left);

		if(bool){
			(function(){
				var text = trim($(that).html());
				var key = $('#left_flat .qf_option .dd_input').value();
				if(key.indexOf("机场") > -1){
					var result = /\([A-Z\/]+\)/i.exec(text);
					if(result!=null){
						//console.log(result);
						result = result[0];
						//console.log(result);
						result = result.replace("(","");
						//console.log(result);
						result = result.replace(")","");
						//console.log(result);
						$('#left_flat .dd_jc').value( result );
					}else{
						$('#left_flat .dd_jc').value(text );
					}
				}else{
					$('#left_flat .dd_jc').value(text );
				}

			})();






		}
		$('#left_flat .qf_select_info').animate({
			attr:'h',
			t:30,
			step:10,
			target:0,
			fn:function(){
				$('#left_flat .qf_select_info').hide();
			}
		}).css("left",left);

	}
}

//搜索表单系列化
function serializeSearch(){
	var search = {};
	search["qf_type"]=$('#left_flat .qf_option .qf_input').attr("key");
	search["qf_text"]=$('#left_flat .qf_text').value();
	search["dd_type"]=$('#left_flat .qf_option .dd_input').attr("key");
	search["dd_text"]=$('#left_flat .dd_jc').value();
	search["company"]=$('#left_flat .airline_company .company_text').value();
	if($('#left_flat .qf_time').value()!=''){
		search["start_time"]=$('#left_flat .qf_time').value()+" 00:00:00";
	}else{
		search["start_time"]=$('#left_flat .qf_time').value();
	}

	if($('#left_flat .dd_time').value()!=''){
		search["end_time"]=$('#left_flat .dd_time').value()+" 00:00:00";
	}else{
		search["end_time"]=$('#left_flat .dd_time').value();
	}



	return search;

}

//过滤表单序列化
function serializeFilter(){
	var filter = {};
	filter["filter_type"]=$('#left_flat .filter .filter_type').attr("type");
	filter["qf_type"]=$('#left_flat .filter .filter_qf_td .filter_qf_input').attr("key");
	filter["qf_text"]=$('#left_flat .filter .filter_qf_text_td .filter_qf_text').value();
	filter["dd_type"]=$('#left_flat .filter .filter_dd_td .filter_dd_input').attr("key");
	filter["dd_text"]=$('#left_flat .filter .filter_dd_text_td .filter_dd_text').value();
	filter["start_time"]=$('#left_flat .filter .filter_time .filter_qf_time').value();
	filter["end_time"]=$('#left_flat .filter .filter_time .filter_dd_time').value();

	return filter;
}

//隐藏日历div
function hide_calendar(){
	$('#date_calendar').animate({
		t:30,
		step:10,
		mul:{
			h:0,
			o:0,
			w:0
		},
		fn:function(){
			$('#date_calendar').hide();
		}
	});
	addEvent($('#left_flat .qf_time').ge(0),'blur',hide_calendar);
}

//起飞时间文本框下显示日历div
function show_calendar(){

	if($('#date_calendar').css('display')=='block'){
		//$('#date_calendar').show().css('left','0px').css('width','0px').css('height','0px').opacity(0);
		//.log("block1");
		$('#date_calendar').animate({
			t:30,
			step:10,
			mul:{
				x:0,
				h:300,
				o:100,
				w:550
			}
		});


	}else{
		$('#date_calendar').show().animate({
			t:30,
			step:10,
			mul:{
				x:0,
				h:300,
				o:100,
				w:550
			}
		});

	}

}

//表单数据验证s
function validate_search(){
	var flag = [false,""];
	var result_qf,result_dd;

	result_qf = validate_col('#left_flat .search_qf_text_td .qf_text');
	result_dd = validate_col('#left_flat .search_dd_text_td .dd_jc');
	if( result_qf == 0 && result_dd == 0 ){
		flag[0] = true;
		flag[1] = "";
		return flag;
	}else if(result_qf == 1 || result_dd == 1 ){
		flag[0] = false;
		flag[1] = "起飞和到达地理信息不能含特殊字符和数字,长度不能超过50!";
		return flag;
	}else if(result_qf == 2 && result_dd == 2 ){
		flag[0] = false;
		flag[1] = "起飞和到达地理信息至少有一项不为空!";
		return flag;
	}

	//
	result_qf = validate_time('#left_flat .qf_time');
	result_dd = validate_time('#left_flat .dd_time');

	if( result_qf == 0 && result_dd == 0 ){
		flag[0] = true;
		flag[1] = "";
		return flag;
	}else if(result_qf == 1 || result_dd == 1 ){
		flag[0] = false;
		flag[1] = "起飞和到达地理信息不能含特殊字符和数字,长度不能超过50!";
		return flag;
	}else if(result_qf == 2 || result_dd == 2 ){
		flag[0] = false;
		flag[1] = "起始日期和截止日期均不能为空!";
		return flag;
	}

	result_qf = validate_col('#left_flat .airline_company .company_text');
	if(result_qf == 0 || result_qf == 2){
		flag[0] = true;
		flag[1] = "";
		return flag;
	}else{
		flag[0] = false;
		flag[1] = "航空公司名称不能含特殊字符和数字,长度不能超过50!";
		return flag;
	}




}

//验证单列数据
function validate_col(clazz){
	var obj = $(clazz);
	if(trim( obj.value() )!=''){
		var reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>?~！@#￥……&*（）——|{}【】‘；：”“'。，、0-9？+-]");
		var str = trim(obj.value() );
		var flag = reg.test(str);
		console.log(str.length);
		if(flag || str.length>=50){
			obj.css("border-bottom","1.5px dashed #ebccd1");
			return 1;   //含非法字符或过长
			//show_popover("#left_flat .search_qf_text_td .search_ariport_popover",obj.ge(0));
		}else{
			obj.css("border-bottom","1px solid #ddd");
			return 0;   //合法
		}
		console.log("起飞文本框失去焦点数据验证"+flag);
	}else{
		obj.css("border-bottom","1px solid #ddd");
		return 2;       //为空
	}
}

//验证时间
function validate_time(clazz){
	var obj = $(clazz);

	if(trim( obj.value() )!=''){
		var reg = /^(\d{4,4})[-](\d{2,2})[-](\d{2,2})$/;
		var str = trim(obj.value() );
		var flag = reg.test(str);
		if(flag){
			obj.css("border-bottom","1px solid #ddd");

		}else{
			obj.css("border-bottom","1.5px dashed #ebccd1");
			//show_popover("#left_flat  .search_time_popover",obj.ge(0));
			return false;
		}
	}else{
		console.log("时间为空");
		obj.css("border-bottom","1px solid #ddd");
		return false;
	}




	//
	//if(trim( obj.value() )!=''){
	//	var reg = new RegExp("");
	//	var flag = reg.test(trim(obj.value() ));
	//	if(flag){
	//		obj.css("border-bottom","1.5px dashed #ebccd1");
	//		show_popover("#left_flat .search_qf_text_td .search_ariport_popover",obj.ge(0));
	//	}else{
	//		obj.css("border-bottom","1px solid #ddd");
	//	}
	//	console.log("起飞文本框失去焦点数据验证"+flag);
	//}else{
	//	obj.css("border-bottom","1px solid #ddd");
	//}
}




