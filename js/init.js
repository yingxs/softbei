
$(function(){
	//alert('DOM加载完成');
	//初始化显示地图
	//遮罩画布
	window.map = null;
	var screen = $('#screen');
	screen.lock().resize(function(){
		if(screen.css("display")=='block'){
			screen.lock();
		}
	}).opacity(30);
	$('#loading').show();

	//初始化
	init2();
	//加载
	load();

});

//初始化页面以及加载地图
function init2(){

	var li_list = $('#left_flat .qf_option .qf_opt li').elements;
	//console.log(li_list);
	(function(){
		for(var i=0 ;i<li_list.length;i++){
			if($(li_list[i]).attr('select')=='select'){

				//查询面板
				$('#left_flat .qf_option  .qf_input').value("出发："+$(li_list[i]).html());
				$('#left_flat .qf_option  .qf_input').attr("key",$(li_list[i]).attr("value"));

				$('#left_flat .qf_option  .dd_input').value("到达："+$(li_list[i]).html());
				$('#left_flat .qf_option  .dd_input').attr("key",$(li_list[i]).attr("value"));

				$('#left_flat .qf_text').attr("placeholder","起飞"+$(li_list[i]).html().replace('按',''));
				$('#left_flat .dd_jc').attr("placeholder","到达"+$(li_list[i]).html().replace('按',''));


				$('#left_flat .td_zz .zz_select').value("经停："+$(li_list[i]).html());
				$('#left_flat .td_zz .zz_select').attr("key",$(li_list[i]).attr("value"));


				$('#left_flat .td_zz .zz_jc').attr("placeholder","经停"+$(li_list[i]).html().replace('按',''));



				//alert("起飞"+$(li_list[i]).html().replace('按',''));
				//过滤面板
				$('#left_flat .filter .filter_qf_td .filter_qf_input').value("出发："+$(li_list[i]).html());
				$('#left_flat .filter .filter_qf_td .filter_qf_input').attr("key",$(li_list[i]).attr("value"));

				$('#left_flat .filter .filter_dd_td .filter_dd_input').value("到达："+$(li_list[i]).html());
				$('#left_flat .filter .filter_dd_td .filter_dd_input').attr("key",$(li_list[i]).attr("value"));

				$('#left_flat .filter .filter_qf_text_td .filter_qf_text').attr("placeholder","起飞"+$(li_list[i]).html().replace('按',''));
				$('#left_flat .filter .filter_dd_text_td .filter_dd_text').attr("placeholder","到达"+$(li_list[i]).html().replace('按',''));

				$('#left_flat .filter .filter_zz_td  .filter_zz_opt').value("经停："+$(li_list[i]).html());
				$('#left_flat .filter .filter_zz_td  .filter_zz_opt').attr("key",$(li_list[i]).attr("value"));

				$('#left_flat .filter .filter_zz_td .filter_zz_text').attr("placeholder","经停"+$(li_list[i]).html().replace('按',''));

			}
		}
	})();


	//获取浏览器可视区的大小以及左边侧栏的宽度
	var width =screen.width-parseInt(getStyle($('#left_bar').ge(0),"width"))  ;
	var height = parseInt(parseInt(getStyle($('#left_bar').ge(0),"height"))) ;
	var svg_left =parseInt(getStyle($('#left_bar').ge(0),"width")) ;
	var translate = [width/2,height/2];
	//滚动条隐藏
	document.body.style.overflow = 'hidden';
	//alert(width+","+height+","+svg_left);
	//alert(svg_left);
	var div = d3.select("#map");
	//定义拖拽
	var zoomer = d3.behavior.zoom().scaleExtent([1, 10]).on("zoom", zoom);
	var svg = div.append("svg").attr('width',width).attr('id',"svg_map").attr('height',height).call(zoomer).style("margin-left",svg_left);
	window.svg = svg;
	var g = svg.append('g').attr("id","g1").style("border","1px solid red");
	var screenscale = d3.scale.linear().domain([1360,1920]).range([212,300]);

	var sacle = screenscale(screen.width);

	//定义地图投影
	var projection = d3.geo.equirectangular().scale(sacle).translate(translate);
	//定义地理路径生成器
	var path = d3.geo.path().projection(projection);

	//地图绘制
	d3.json("/d3/map/world-50m.json",function(error,world){

		g.append("path")
			.datum(topojson.feature(world,world.objects.land))
			.attr("class","land")
			.attr("d",path);
		g.append("path")
			.datum(topojson.mesh(world,world.objects.countries))
			.attr("class","boundary")
			.attr("d",path);
		//地图绘制完成
		svg.append("defs")
			.append("filter")
			.attr("id","f1")
			.attr("x","0")
			.attr("y","0")
			.append("feGaussianBlur")
			.attr('in',"SourceGraphic")
			.attr('stdDeviation',"0.6");
		svg.append("defs")
			.append("filter")
			.attr("id","f2")
			.attr("x","0")
			.attr("y","0")
			.append("feGaussianBlur")
			.attr('in',"SourceGraphic")
			.attr('stdDeviation',"0.8");


		render_city();

		setTimeout(function(){

			//解除锁屏
			$('#screen').animate({
				attr:'o',
				target:0,
				step:30,
				t:10,
				fn:function(){
					$('#screen').unlock();
				}
			});

			//地图出现
			$('#map').animate({
				attr:'o',
				target:100,
				step:30,
				t:10

			});
		},350);



	});


	function zoom(){
		g.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
	}


	svg.on("click",function(){
		var point = d3.mouse(svg.node());
	});

}

//添加事件，调用相应函数
function load(){

	var left_box = {
		menu:$('#left_bar span'),
		search:$('#left_flat span').eq(0),
		filter:$('#left_flat .filter')
	};

	function leftBox_anim(obj,t,step,x,o){
		obj.animate({
			t:t,
			step:step,
			mul:{
				x:x,
				o:o
			}
		});
	}

	//左边标志栏
	$('#left_bar .menu_ul li').hover(function(){
		//鼠标悬停时，判断相应的滑块当前是否显示，若未显示，就显示提示，反之不显示提示信息
		//if($(this).index() == 0 && parseInt( left_box.menu.css('left')) < 0 ){
			leftBox_anim($('#left_bar .diolg_ul li').eq($(this).index()),10,30,10,100);
		//}else if($(this).index() == 1 && parseInt( left_box.search.css('left')) < 0 ){
			leftBox_anim($('#left_bar .diolg_ul li').eq($(this).index()),10,30,10,100);
		//}else if($(this).index() == 2 && parseInt( left_box.filter.css('left')) < 0 ){
			leftBox_anim($('#left_bar .diolg_ul li').eq($(this).index()),10,30,10,100);
		//}else if($(this).index() == 3 && parseInt( left_box.filter.css('left')) < 0 ){
			leftBox_anim($('#left_bar .diolg_ul li').eq($(this).index()),10,30,10,100);
		//}else if($(this).index() == 4 && parseInt( left_box.filter.css('left')) < 0 ){
			leftBox_anim($('#left_bar .diolg_ul li').eq($(this).index()),10,30,10,100);
		//}

	},function(){
		leftBox_anim($('#left_bar .diolg_ul li').eq($(this).index()),10,30,-150,0);

	});

	//点击地图时，隐藏所有侧栏
	$('#map').click(function(){
		leftBox_anim(left_box.menu,10,30,-300,100);
		leftBox_anim(left_box.search,10,30,-380,100);
		leftBox_anim(left_box.filter,10,30,-380,100);

	});

	//左边菜单块
	$('#left_bar .menu_ul li').click(function(){

		if( $(this).index() == 0 && parseInt( left_box.menu.css('left') )<0 ) {
			//隐藏筛选块
			leftBox_anim(left_box.filter,10,30,-380,100);
			//隐藏搜索块
			leftBox_anim(left_box.search,10,30,-380,100);
			//当点击菜单按钮时，显示菜单块
			leftBox_anim(left_box.menu,10,30,0,100);
		}else if($(this).index() == 1 && parseInt( left_box.search.css('left') )<0){
			//显示之前隐藏信息提示框
			leftBox_anim($('#left_bar .diolg_ul li').eq($(this).index()),10,30,-150,0);
			//显示搜索块
			leftBox_anim(left_box.search,10,30,36,100);
			//隐藏筛选块
			leftBox_anim(left_box.filter,10,30,-380,100);
		}else if($(this).index() == 1 && parseInt( left_box.search.css('left') )>0){
			//隐藏搜索块
			leftBox_anim(left_box.search,10,30,-380,100);
		}else if($(this).index() == 2 && parseInt( left_box.filter.css('left') )<0){
			//显示之前隐藏信息提示框
			leftBox_anim($('#left_bar .diolg_ul li').eq($(this).index()),10,30,-150,0);
			//显示筛选块
			leftBox_anim(left_box.filter,10,30,36,100);
			//隐藏搜索块
			leftBox_anim(left_box.search,10,30,-380,100);
		}else if($(this).index() == 2 && parseInt( left_box.filter.css('left') )>0){
			leftBox_anim(left_box.filter,10,30,-380,100);
		}

	});
	$("#left_bar .span_menu ul li").click(function(){
		if( $(this).index() == 0 /*&& parseInt( left_box.menu.css('left') )<0*/ ) {
			//当点击菜单任意选项时，隐藏菜单块
			leftBox_anim(left_box.menu,10,30,-280,100);
			//显示搜索块
			leftBox_anim(left_box.search,10,30,36,100);

		}else if($(this).index() == 1 /*&& parseInt( left_box.search.css('left') )<0*/){
			//当点击菜单任意选项时，隐藏菜单块
			leftBox_anim(left_box.menu,10,30,-280,100);
			//显示搜索块
			leftBox_anim(left_box.filter,10,30,36,100);

		}
	});

	//查询-出发选项显示与隐藏
	$('#left_flat .qf_option .qf_input').bind('focus',show_qf_opt).bind('blur',hide_qf_opt);
	$('#left_flat .qf_option .qf_img_down').click(function(){
		if($('#left_flat .qf_option .qf_opt').css("display")=="block"){
			$('#left_flat .qf_option .qf_input').ge(0).blur();
		}else{
			$('#left_flat .qf_option .qf_input').ge(0).focus();
		}
	});

	//查询-到达选项显示与隐藏
	$('#left_flat .qf_option .dd_input').bind('focus',show_dd_opt).bind('blur',hide_dd_opt);
	$('#left_flat .qf_option .dd_img_down').click(function(){
		if($('#left_flat .qf_option .dd_opt').css("display")=="block"){
			$('#left_flat .qf_option .dd_input').ge(0).blur();
		}else{
			$('#left_flat .qf_option .dd_input').ge(0).focus();
		}

	});


	//查询-经停选项显示与隐藏
	$('#left_flat .td_zz  .zz_select').bind('focus',show_zz_opt).bind('blur',hide_zz_opt);
	//$('#left_flat .td_zz  .zz_img_down').click(function(){
	//	if($('#left_flat .td_zz .zz_opt').css("display")=="block"){
	//		$('#left_flat .td_zz  .zz_select').ge(0).blur();
	//	}else{
	//		$('#left_flat .td_zz  .zz_select').ge(0).focus();
	//	}
    //
	//});


	//查询-选择起飞选项
	$('#left_flat .qf_option .qf_opt li').bind('mousedown',function(){
		var str = $(this).html();
		var key = $(this).attr('value');
		$('#left_flat .qf_option .qf_input').value("出发："+str);
		$('#left_flat .qf_option .qf_input').attr("key",key);
		$('#left_flat .qf_text').attr('placeholder',"起飞"+$(this).html().replace("按",""));
	});

	//查询-选择到达选项
	$('#left_flat .qf_option .dd_opt li').bind('mousedown',function(){
		var str = $(this).html();
		var key = $(this).attr('value');
		$('#left_flat .qf_option .dd_input').value("到达："+str);
		$('#left_flat .qf_option .dd_input').attr("key",key);
		$('#left_flat  .dd_jc').attr('placeholder',"到达"+$(this).html().replace("按",""));

	});


	//查询-选择经停选项
	$('#left_flat .td_zz .zz_opt li').bind('mousedown',function(){
		var str = $(this).html();
		var key = $(this).attr('value');
		$('#left_flat .td_zz .zz_select').value("经停："+str);
		$('#left_flat .td_zz .zz_select').attr("key",key);
		$('#left_flat .td_zz .zz_jc').attr('placeholder',"经停"+$(this).html().replace("按",""));

	});




	//过滤-起飞选项的显示与隐藏
	$('#left_flat .filter .filter_qf_td .filter_qf_input').bind('focus',show_filter_qf_opt).bind('blur',hide_filter_qf_opt);
	$('#left_flat .filter .filter_qf_td .qf_img_down').click(function(){
		if($('#left_flat .filter .filter_qf_td .filter_qf_opt').css("display")=="block"){
			$('#left_flat .filter .filter_qf_td .filter_qf_input').ge(0).blur();
		}else{
			$('#left_flat .filter .filter_qf_td .filter_qf_input').ge(0).focus();
		}
	});

	//过滤-到达选项的显示与隐藏
	$('#left_flat .filter .filter_dd_td .filter_dd_input').bind('focus',show_filter_dd_opt).bind('blur',hide_filter_dd_opt);
	$('#left_flat .filter .filter_dd_td .dd_img_down').click(function(){
		if($('#left_flat .filter .filter_dd_td .filter_dd_opt').css("display")=="block"){
			$('#left_flat .filter .filter_dd_td .filter_dd_input').ge(0).blur();
		}else{
			$('#left_flat .filter .filter_dd_td .filter_dd_input').ge(0).focus();
		}
	});



	//过滤-经停选项的显示与隐藏
	$('#left_flat .filter .filter_zz_td .filter_zz_opt').bind('focus',show_filter_zz_opt).bind('blur',hide_filter_zz_opt);
	$('#left_flat .filter .filter_zz_td .filter_zz_img_down').click(function(){
		if($('#left_flat .filter .filter_zz_td .zz_opt').css("display")=="block"){
			$('#left_flat .filter .filter_zz_td .filter_zz_opt').ge(0).blur();
		}else{
			$('#left_flat .filter .filter_zz_td .filter_zz_opt').ge(0).focus();
		}
	});


	//过滤-选择起飞选项
	$('#left_flat .filter .filter_qf_td .filter_qf_opt li').bind('mousedown',function(){
		var str = $(this).html();
		var key = $(this).attr('value');
		var column = $(this).attr('column');
		$('#left_flat .filter .filter_qf_td .filter_qf_input').value("出发："+str);
		$('#left_flat .filter .filter_qf_td .filter_qf_input').attr("key",key);
		$('#left_flat .filter .filter_qf_td .filter_qf_input').attr("column",column);
		$('#left_flat .filter .filter_qf_text_td .filter_qf_text').attr('placeholder',"起飞"+$(this).html().replace("按",""));
	});

	//过滤-选择到达选项
	$('#left_flat .filter .filter_dd_td .filter_dd_opt li').bind('mousedown',function(){
		var str = $(this).html();
		var key = $(this).attr('value');
		var column = $(this).attr('column');
		$('#left_flat .filter .filter_dd_td .filter_dd_input').value("到达："+str);
		$('#left_flat .filter .filter_dd_td .filter_dd_input').attr("key",key);
		$('#left_flat .filter .filter_dd_td .filter_dd_input').attr("column",column);
		$('#left_flat .filter .filter_dd_text_td .filter_dd_text').attr('placeholder',"到达"+$(this).html().replace("按",""));

	});

	//过滤-选择经停选项
	$('#left_flat .filter .filter_zz_td .zz_opt li').bind('mousedown',function(){
		var str = $(this).html();
		var key = $(this).attr('value');
		var column = $(this).attr('column');
		$('#left_flat .filter .filter_zz_td  .filter_zz_opt').value("经停："+str);
		$('#left_flat .filter .filter_zz_td  .filter_zz_opt').attr("key",key);
		$('#left_flat .filter .filter_zz_td  .filter_zz_opt').attr("column",column);
		$('#left_flat .filter .filter_zz_td  .filter_zz_text').attr('placeholder',"经停"+$(this).html().replace("按",""));

	});



	//查询-起始时间文本框失去焦点后，日历div隐藏
	$('#left_flat .qf_time').bind('blur',search_qf_hide_time);
	function search_qf_hide_time(){
		if( ( parseInt($('#date_calendar').css('width')) > 0) ){
			$('#date_calendar').animate({
				t:30,
				step:10,
				mul:{
					x:0,
					h:0,
					o:0,
					w:0
				}
			});
		}
		validate_time('#left_flat .qf_time');
		addEvent($('#left_flat .qf_time').ge(0),"blur",search_qf_hide_time);
	}

	//查询-起始时间文本框获得焦点后，日历div显示
	$('#left_flat .qf_time').bind('focus',search_qf_show_time);

	function search_qf_show_time(){

		//显示日历div
		$('#date_calendar').attr("type","qf").show().animate({
			t:30,
			step:10,
			mul:{
				x:0,
				h:300,
				o:100,
				w:550
			}
		}).css("top","35px");

		hide_popover("#left_flat .search_time_popover");

		$('#date_calendar').bind('mouseenter',function(){
			//console.log("1");
			removeEvent($('#left_flat .qf_time').ge(0),"blur",search_qf_hide_time);
		});
		$('#date_calendar').bind('mouseleave',search_qf_hide_time);
	}

	//查询-截止时间文本框获得焦点后，日历div平移后显示
	$('#left_flat .dd_time').bind('focus',function(){
		if($('#date_calendar').attr("type","dd").css("display")=='block'){
			$('#date_calendar').show().animate({
				t:30,
				step:10,
				mul:{
					x:190,
					h:300,
					o:100,
					w:550
				}
			}).css("top","35px");
		}

		$('#date_calendar').bind('mouseenter',function(){
			//console.log("1");
			removeEvent($('#left_flat .dd_time').ge(0),"blur",search_dd_hide_time);
		});
		$('#date_calendar').bind('mouseleave',search_dd_hide_time);

	});



	//查询-截止时间文本框失去焦点后，日历div隐藏
	$('#left_flat .dd_time').bind('blur',search_dd_hide_time);

	function search_dd_hide_time(){
		if(( parseInt($('#date_calendar').css('width')) > 0) ){
			$('#date_calendar').animate({
				t:30,
				step:10,
				mul:{
					x:190,
					h:0,
					o:0,
					w:0
				}
			});
		}
		addEvent($('#left_flat .dd_time').ge(0),"blur",search_dd_hide_time);
		validate_time('#left_flat .dd_time');
	}




	//过滤-起始时间文本框获得焦点后，日历div显示
	$('#left_flat .filter .filter_time .filter_qf_time').bind('focus',function(){
		$('#date_calendar').attr("type","f_qf").show().animate({
			t:30,
			step:10,
			mul:{
				x:420,
				h:300,
				o:100,
				w:550
			}
		}).css("top","115px");

		$('#date_calendar').bind('mouseenter',function(){
			//console.log("1");
			removeEvent($('#left_flat .filter .filter_time .filter_qf_time').ge(0),"blur",filter_qf_hide_time);
		});
		$('#date_calendar').bind('mouseleave',filter_qf_hide_time);


	});



	//过滤-起始时间文本框失去焦点后，日历div隐藏
	$('#left_flat .filter .filter_time .filter_qf_time').bind('blur',filter_qf_hide_time);
	function filter_qf_hide_time(){
		if( ( parseInt($('#date_calendar').css('width')) > 0) ){
			$('#date_calendar').animate({
				t:30,
				step:10,
				mul:{
					x:410,
					h:0,
					o:0,
					w:0
				}
			});
		}
		addEvent($('#left_flat .filter .filter_time .filter_qf_time').ge(0),"blur",filter_qf_hide_time);

	}



	//过滤-截止时间文本框获得焦点后，日历div平移后显示
	$('#left_flat .filter .filter_time .filter_dd_time').bind('focus',function(){
		if($('#date_calendar').attr("type","f_dd").css("display")=='block'){
			$('#date_calendar').show().animate({
				t:30,
				step:10,
				mul:{
					x:600,
					h:300,
					o:100,
					w:550
				}
			}).css("top","115px");
		}


		$('#date_calendar').bind('mouseenter',function(){
			//console.log("1");
			removeEvent($('#left_flat .filter .filter_time .filter_dd_time').ge(0),"blur",filter_qf_hide_time);
		});
		$('#date_calendar').bind('mouseleave',filter_qf_hide_time);


	});




	//过滤-截止时间文本框失去焦点后，日历div隐藏
	$('#left_flat .filter .filter_time .filter_dd_time').bind('blur',filter_dd_hide_time);
	function filter_dd_hide_time(){
		if(( parseInt($('#date_calendar').css('width')) > 0) ){
			$('#date_calendar').animate({
				t:30,
				step:10,
				mul:{
					x:600,
					h:0,
					o:0,
					w:0
				}
			});
		}

		addEvent($('#left_flat .filter .filter_time .filter_dd_time').ge(0),"blur",filter_qf_hide_time);

	}

	//鼠标移动到日历div上后，删除失去焦点事件函数，添加鼠标移出事件
	//$('#left_flat #date_calendar').bind('mouseenter',function(e){
	//	removeEvent($('#left_flat .qf_time').ge(0),'blur',hide_calendar);
	//	addEvent($('#left_flat #date_calendar').ge(0),'mouseleave',hide_calendar);
	//});

	//日期选择
	$('#left_flat #date_calendar table td').bind("mousedown",function(){
		if($(this).attr('lang')=='wh'){
			var tr = removeWhiteNode(this).parentNode;
			var tbody = removeWhiteNode(tr).parentNode;
			var table = removeWhiteNode(tbody).parentNode;
			var h = table.previousSibling.previousSibling;
			var str = h.innerHTML+this.innerHTML;
			var exp = /^(\d{4,4})年(\d{1,2})月(\d{1,2})$/;
			var array = exp.exec(str);

			//console.log(array);
			if(array[2].length<2){
				str = str.replace(/^(\d{4,4})[年-](\d{1,2})[月-](\d{1,2})$/,"$1-"+'0'+"$2"+"-$3");
				//console.log(str);
			}
			if(array[3].length<2){
				str = str.replace(/^(\d{4,4})[年-](\d{1,2})[月-](\d{1,2})$/,"$1-"+"$2"+"-0"+"$3");

			}
			if(array[2].length==2 && array[3].length==2){
				str = str.replace("年","-");
				str = str.replace("月","-");
			}

			//console.log(str);

			if($('#date_calendar').attr("type")=="qf"){
				$('#left_flat .qf_time').value(str);
			}else if($('#date_calendar').attr("type")=="dd"){
				$('#left_flat .dd_time').value(str);
			}else if($('#date_calendar').attr("type")=="f_qf"){
				$('#left_flat .filter .filter_time .filter_qf_time').value(str);
			}else if($('#date_calendar').attr("type")=="f_dd"){
				$('#left_flat .filter .filter_time .filter_dd_time').value(str);
			}

		}



	});

	//起飞选项输入框获得焦点
	//$('#left_flat .qf_text').bind('focus',function(){
	//	$('#left_flat .qf_select_info').attr("type","qf");
	//	get_qf_opt();
	//});

	//到达选项输入框获得焦点
	//$('#left_flat .dd_jc').bind('focus',function(){
	//	$('#left_flat .qf_select_info').attr("type","dd");
	//	get_dd_opt();
	//});

	//查询-起飞选项输入框失去焦点
	//$('#left_flat .qf_text').bind('blur',function(){
	//	hide_select_info(false,0);
	//});

	//过滤-起飞选项输入框获得焦点，过滤-起飞选项输入框失去焦点，过滤-起飞选项输入框键入事件,异步查询
	$('#left_flat .filter .filter_qf_text_td .filter_qf_text').bind('focus',function(){
		//console.log("keyup:get_qf_opt2()");
		//p_text,p_input,p_ul,p_context,p_loading
		get_qf_opt2('#left_flat .filter .filter_qf_text_td .filter_qf_text',
			'#left_flat .filter .filter_qf_td .filter_qf_input',
			'#left_flat .filter .filter_qf_text_td .filter_qf_info',
			'#left_flat .filter .filter_qf_text_td .filter_qf_info .context',
			'#left_flat .filter .filter_qf_text_td .filter_qf_info .loading','qf');

	}).bind('blur',function(){

		//console.log("blur");
		//隐藏提示面板
		$("#left_flat .filter .filter_qf_text_td .filter_qf_info").animate({
			attr:'h',
			target:0,
			step:10,
			t:20,
			fn:function(){
				$("#left_flat .filter .filter_qf_text_td .filter_qf_info").hide();
			}
		});
		//hide_select_info(false,0);
	}).bind('keyup',function(e){
		//console.log("keyup:get_qf_opt2()");
		//p_text,p_input,p_ul,p_context,p_loading

		if( e.keyCode!=40 && e.keyCode!=38 && e.keyCode!=13){
			get_qf_opt2('#left_flat .filter .filter_qf_text_td .filter_qf_text',
				'#left_flat .filter .filter_qf_td .filter_qf_input',
				'#left_flat .filter .filter_qf_text_td .filter_qf_info',
				'#left_flat .filter .filter_qf_text_td .filter_qf_info .context',
				'#left_flat .filter .filter_qf_text_td .filter_qf_info .loading','qf');
		}

		if( trim($('#left_flat .filter .filter_qf_text_td .filter_qf_text').value())!='' ){
			keyup_value(e,this,'a',
				$('#left_flat .filter .filter_qf_text_td .filter_qf_info .context li'),
				$('#left_flat .filter .filter_qf_td .filter_qf_input'),
				$('#left_flat .filter .filter_qf_text_td .filter_qf_text'),
				$('#left_flat .filter .filter_qf_text_td .filter_qf_info'));
		}


	});


	//过滤-到达选项输入框获得焦点，过滤-到达选项输入框失去焦点，过滤-到达选项输入框键入事件,异步查询
	$('#left_flat .filter .filter_dd_text_td .filter_dd_text').bind('focus',function(){
		//console.log("keyup:get_qf_opt2()");
		//p_text,p_input,p_ul,p_context,p_loading
		get_qf_opt2('#left_flat .filter .filter_dd_text_td .filter_dd_text',
			'#left_flat .filter .filter_dd_td .filter_dd_input',
			'#left_flat .filter .filter_dd_text_td .filter_dd_info',
			'#left_flat .filter .filter_dd_text_td .filter_dd_info .context',
			'#left_flat .filter .filter_dd_text_td .filter_dd_info .loading','dd');

	}).bind('blur',function(){

		//console.log("blur");
		//隐藏提示面板
		$("#left_flat .filter .filter_dd_text_td .filter_dd_info").animate({
			attr:'h',
			target:0,
			step:10,
			t:20,
			fn:function(){
				$("#left_flat .filter .filter_dd_text_td .filter_dd_info").hide();
			}
		});
		//hide_select_info(false,0);
	}).bind('keyup',function(e){
		//console.log("keyup:get_qf_opt2()");
		//p_text,p_input,p_ul,p_context,p_loading

		if( e.keyCode!=40 && e.keyCode!=38 && e.keyCode!=13 ){
			get_qf_opt2('#left_flat .filter .filter_dd_text_td .filter_dd_text',
				'#left_flat .filter .filter_dd_td .filter_dd_input',
				'#left_flat .filter .filter_dd_text_td .filter_dd_info',
				'#left_flat .filter .filter_dd_text_td .filter_dd_info .context',
				'#left_flat .filter .filter_dd_text_td .filter_dd_info .loading','dd');
		}

		if( trim($('#left_flat .filter .filter_dd_text_td .filter_dd_text').value())!='' ){
			keyup_value(e,this,'a',
				$('#left_flat .filter .filter_dd_text_td .filter_dd_info .context li'),
				$('#left_flat .filter .filter_dd_td .filter_dd_input'),
				$('#left_flat .filter .filter_dd_text_td .filter_dd_text'),
				$('#left_flat .filter .filter_dd_text_td .filter_dd_info'));
		}


	});

	//过滤-经停选项输入框获得焦点，过滤-经停选项输入框失去焦点，过滤-经停选项输入框键入事件,异步查询
	$('#left_flat .filter .filter_zz_td .filter_zz_text').bind('focus',function(){
		//console.log("keyup:get_qf_opt2()");
		//p_text,p_input,p_ul,p_context,p_loading
		get_qf_opt2('#left_flat .filter .filter_zz_td .filter_zz_text',
			'#left_flat .filter .filter_zz_td .filter_zz_opt',
			'#left_flat .filter .filter_zz_td .filter_zz_info',
			'#left_flat .filter .filter_zz_td .filter_zz_info .context',
			'#left_flat .filter .filter_zz_td .filter_zz_info .loading','zz');

	}).bind('blur',function(){

		//console.log("blur");
		//隐藏提示面板
		$("#left_flat .filter .filter_zz_td .filter_zz_info").animate({
			attr:'h',
			target:0,
			step:10,
			t:20,
			fn:function(){
				$("#left_flat .filter .filter_zz_td .filter_zz_info").hide();
			}
		});
		//hide_select_info(false,0);
	}).bind('keyup',function(e){
		//console.log("keyup:get_qf_opt2()");
		//p_text,p_input,p_ul,p_context,p_loading

		if( e.keyCode!=40 && e.keyCode!=38 && e.keyCode!=13 ){
			get_qf_opt2('#left_flat .filter .filter_zz_td .filter_zz_text',
				'#left_flat .filter .filter_zz_td .filter_zz_opt',
				'#left_flat .filter .filter_zz_td .filter_zz_info',
				'#left_flat .filter .filter_zz_td .filter_zz_info .context',
				'#left_flat .filter .filter_zz_td .filter_zz_info .loading','zz');
		}

		if( trim($('#left_flat .filter .filter_zz_td .filter_zz_text').value())!='' ){
			keyup_value(e,this,'a',
				$('#left_flat .filter .filter_dd_text_td .filter_dd_info .context li'),
				$('#left_flat .filter .filter_dd_td .filter_dd_input'),
				$('#left_flat .filter .filter_dd_text_td .filter_dd_text'),
				$('#left_flat .filter .filter_dd_text_td .filter_dd_info'));
		}


	});








	//过滤-航司输入框获得焦点，过滤-航司输入框失去焦点，过滤-航司输入框键入事件,异步查询
	$('#left_flat .filter .filter_company_td .filter_company_text').bind('focus',function(){

		//p_text,p_ul,p_context,p_loading
		filter_get_company('#left_flat .filter .filter_company_td .filter_company_text',
			"#left_flat .filter .filter_company_td .filter_company_info",
			"#left_flat .filter .filter_company_td .filter_company_info .context",
			"#left_flat .filter .filter_company_td .filter_company_info .loading");


	}).bind('blur',function(){

		//console.log("blur");
		//隐藏提示面板
		$("#left_flat .filter .filter_company_td .filter_company_info").animate({
			attr:'h',
			target:0,
			step:10,
			t:20,
			fn:function(){
				$("#left_flat .filter .filter_company_td .filter_company_info").hide();
			}
		});
		//hide_select_info(false,0);
	}).bind('keyup',function(e){


		if( e.keyCode!=40 && e.keyCode!=38 && e.keyCode!=13){
			filter_get_company('#left_flat .filter .filter_company_td .filter_company_text',
				"#left_flat .filter .filter_company_td .filter_company_info",
				"#left_flat .filter .filter_company_td .filter_company_info .context",
				"#left_flat .filter .filter_company_td .filter_company_info .loading");
		}

		if( trim($('#left_flat .filter .filter_company_td .filter_company_text').value())!='' ){
			keyup_value(e,this,'a',
				$('#left_flat .filter .filter_company_td .filter_company_info .context li'),
				null,
				$('#left_flat .filter .filter_company_td .filter_company_text'),
				$('#left_flat .filter .filter_company_td .filter_company_info'));
		}

	});




	//查询-起飞选项输入框获得焦点，查询-起飞选项输入框失去焦点，查询-起飞选项输入框键入事件,异步查询
	$('#left_flat .search_qf_text_td .qf_text').bind('focus',function(){

		//显示侧边注意事项
		show_popover("#left_flat .search_qf_text_td .search_ariport_popover",this);

		//显示提示信息
		get_qf_opt2('#left_flat .search_qf_text_td .qf_text',
			'#left_flat .qf_option .qf_input',
			'#left_flat .search_qf_text_td .search_qf_info',
			'#left_flat .search_qf_text_td .search_qf_info .context',
			'#left_flat .search_qf_text_td .search_qf_info .loading','qf');
	})
		.bind('blur',search_qf_text_blur)
		.bind('keyup',function(e){
		//console.log("keyup:get_qf_opt2()");
		//p_text,p_input,p_ul,p_context,p_loading

			if( e.keyCode!=40 && e.keyCode!=38 && e.keyCode!=13){
				get_qf_opt2('#left_flat .search_qf_text_td .qf_text',
					'#left_flat .qf_option .qf_input',
					'#left_flat .search_qf_text_td .search_qf_info',
					'#left_flat .search_qf_text_td .search_qf_info .context',
					'#left_flat .search_qf_text_td .search_qf_info .loading','qf');
			}

			if( trim($('#left_flat .search_qf_text_td .qf_text').value())!='' ){
				keyup_value(e,this,'a',
					$('#left_flat .search_qf_text_td .search_qf_info .context li'),
					$('#left_flat .qf_option .qf_input'),
					$('#left_flat .search_qf_text_td .qf_text'),
					$('#left_flat .search_qf_text_td .search_qf_info'));
			}

		}).bind('mousedown',function(e){
		if($('#left_flat .search_qf_text_td .search_ariport_popover').css('display')=='block' ){
			removeEvent($('#left_flat .search_dd_text_td .dd_jc').ge(0),"blur",search_dd_text_blur);
			console.log("到达输入框失去焦点函数被删除");
		}
	});


	//查询-目标输入框获得焦点，查询-目标输入框失去焦点，查询-目标输入框键入事件,异步查询
	$('#left_flat .search_dd_text_td .dd_jc').bind('focus',function(){
		//显示侧边注意事项
		show_popover("#left_flat .search_qf_text_td .search_ariport_popover",this);
		//显示提示信息
		get_qf_opt2('#left_flat .search_dd_text_td .dd_jc',
			'#left_flat .qf_option .dd_input',
			'#left_flat .search_dd_text_td .search_dd_info',
			'#left_flat .search_dd_text_td .search_dd_info .context',
			'#left_flat .search_dd_text_td .search_dd_info .loading','dd');

	})
		.bind('blur',search_dd_text_blur)
		.bind('keyup',function(e){

			if( e.keyCode!=40 && e.keyCode!=38 && e.keyCode!=13){
				//显示提示信息
				get_qf_opt2('#left_flat .search_dd_text_td .dd_jc',
					'#left_flat .qf_option .dd_input',
					'#left_flat .search_dd_text_td .search_dd_info',
					'#left_flat .search_dd_text_td .search_dd_info .context',
					'#left_flat .search_dd_text_td .search_dd_info .loading','dd');
			}
			if( trim($('#left_flat .search_dd_text_td .dd_jc').value())!='' ){
				keyup_value(e,this,'a',
					$('#left_flat .search_dd_text_td .search_dd_info .context li'),
					$('#left_flat .qf_option .dd_input'),
					$('#left_flat .search_dd_text_td .dd_jc'),
					$('#left_flat .search_dd_text_td .search_dd_info'));
			}
		}).bind('mousedown',function(e){
		if($('#left_flat .search_qf_text_td .search_ariport_popover').css('display')=='block' ){
			$('#left_flat .search_qf_text_td .qf_text').css("border-bottom","1px solid #ddd");
			removeEvent($('#left_flat .search_qf_text_td .qf_text').ge(0),"blur",search_qf_text_blur);
			console.log("起飞输入框失去焦点函数被删除");
		}
	});


	//查询-经停文本框获得焦点，查询-经停文本框失去焦点，查询-经停文本框键入事件,异步查询
	$('#left_flat .td_zz  .zz_jc').bind('focus',function(){
		//显示侧边注意事项
		show_popover("#left_flat .td_zz .search_zz_popover",this);
		//显示提示信息
		get_qf_opt2('#left_flat .td_zz .zz_jc',
			'#left_flat .td_zz .zz_select',
			'#left_flat .td_zz .search_zz_info',
			'#left_flat .td_zz .search_zz_info .context',
			'#left_flat .td_zz .search_zz_info .loading','zz');

	})
		.bind('blur',search_zz_text_blur)
		.bind('keyup',function(e){

			if( e.keyCode!=40 && e.keyCode!=38 && e.keyCode!=13){
				//显示提示信息
				get_qf_opt2('#left_flat .td_zz .zz_jc',
					'#left_flat .td_zz .zz_select',
					'#left_flat .td_zz .search_zz_info',
					'#left_flat .td_zz .search_zz_info .context',
					'#left_flat .td_zz .search_zz_info .loading','zz');

			}
			if( trim($('#left_flat .td_zz .zz_jc').value())!='' ){
				keyup_value(e,this,'a',
					$('#left_flat .td_zz .search_zz_info .context li'),
					$('#left_flat .td_zz .zz_select'),
					$('#left_flat .td_zz .zz_jc'),
					$('#left_flat .td_zz .search_zz_info'));
			}
		});






	//查询-航司输入框获得焦点，查询-航司输入框失去焦点，查询-航司输入框键入事件,异步查询
	$('#left_flat .airline_company .company_text').bind('focus',function(){

		//显示注意事项面板
		show_popover(" .search_company_popover",this);

		//显示提示面板
		//p_text,p_ul,p_context,p_loading
		filter_get_company('#left_flat .airline_company .company_text',
			"#left_flat .airline_company .search_company_info",
			"#left_flat .airline_company .search_company_info .context",
			"#left_flat .airline_company .search_company_info .loading");

	}).bind('blur',function(){
		//数据验证
		validate_col('#left_flat .airline_company .company_text');
		//隐藏提示面板
		hide_popover("#left_flat .airline_company .search_company_popover");

		//信息面板隐藏
		$("#left_flat .airline_company .search_company_info").animate({
			attr:'h',
			target:0,
			step:10,
			t:20,
			fn:function(){
				$("#left_flat .airline_company .search_company_info").hide();
			}
		});
		//hide_select_info(false,0);
	}).bind('keyup',function(e){
		if( e.keyCode!=40 && e.keyCode!=38 && e.keyCode!=13){
			filter_get_company('#left_flat .airline_company .company_text',
				"#left_flat .airline_company .search_company_info",
				"#left_flat .airline_company .search_company_info .context",
				"#left_flat .airline_company .search_company_info .loading");
		}
		if( trim($('#left_flat .airline_company .company_text').value())!='' ){
			keyup_value(e,this,'c',
				$("#left_flat .airline_company .search_company_info .context li"),
				null,
				$('#left_flat .airline_company .company_text'),
				$("#left_flat .airline_company .search_company_info"));
		}
	});

	//查询
	$('#left_flat .from1_button .submit').click(function(e){
		//console.log(serializeSearch());
		getFlight_data(e,"form");
		//leftBox_anim(left_box.search,10,30,-380,100);
		$('#left_bar').attr("type","search");
	});

	//确认过滤
	$('#left_flat .filter .filter_button .submit').click(function(e){
		//console.log(serializeFilter());
		predef(e);
		filter_data();
		$('#left_bar').attr("type","filter");

		var radio_list = d3.selectAll("#left_flat .filter .filter_checkbox table input");
		radio_list.each(function(){
			this.checked=false;
		});
	});

	//选择只显示筛选的数据
	$('#left_flat .filter .filter_type .hide').click(function(e){
		$('#left_flat .filter .filter_type .show').css("border","1px solid #ddd");
		$('#left_flat .filter .filter_type .hide').css("border","1px solid #739296");
		//筛选结果类型为隐藏不符合要求的数据
		$('#left_flat .filter .filter_type').attr("type","hide");
		switch_filter();
	});

	//选择高亮显示筛选的数据
	$('#left_flat .filter .filter_type .show').click(function(e){
		$('#left_flat .filter .filter_type .hide').css("border","1px solid #ddd");
		$('#left_flat .filter .filter_type .show').css("border","1px solid #739296");
		//筛选结果类型为高亮显示符合要求的数据
		$('#left_flat .filter .filter_type').attr("type","show");
		switch_filter();
	});


	function switch_filter(){
		var screen = $('#screen');
		screen.lock().resize(function(){
			if(screen.css("display")=='block'){
				screen.lock();
			}
		}).opacity(30);
		$('#loading').show();

		setTimeout(function(){
			var radio_list = d3.selectAll("#left_flat .filter .filter_checkbox table input");
			var note = false;
			radio_list.each(function(){
				if(this.checked){
					note=true;
				}
			});
			if(note){
				radio_list.each(function(){
					//国内航班
					if(this.checked && this.value=='on_ch' ){
						filter_data({
							airline_company:"",
							end_time:"",
							filter_type:$('#left_flat .filter .filter_type').attr("type"),
							mb_text:"China",
							mb_type:"3",
							qf_text:"China",
							qf_type:"3",
							start_time:"",
							zz_text:"",
							zz_type:"3"
						});
					}

					//国际航班
					if(this.checked && this.value=='on_world' ){
						filter_data2({
							filter_type:$('#left_flat .filter .filter_type').attr("type"),
							qf_type:"3",
							qf_text:"China",
							mb_type:"3",
							mb_text:"China",
							zz_type:"3",
							zz_text:""
						},'check_fn1');
					}

					//出境航班
					if(this.checked && this.value=='out_ch' ){
						filter_data2({
							filter_type:$('#left_flat .filter .filter_type').attr("type"),
							qf_type:"3",
							qf_text:"China",
							mb_type:"3",
							mb_text:"China",
							zz_type:"3",
							zz_text:""
						},'check_fn2');
					}
					//入境航班
					if(this.checked && this.value=='in_ch' ){
						filter_data2({
							filter_type:$('#left_flat .filter .filter_type').attr("type"),
							qf_type:"3",
							qf_text:"China",
							mb_type:"3",
							mb_text:"China",
							zz_type:"3",
							zz_text:""
						},'check_fn3');
					}
					//港澳台航班
					if(this.checked && this.value=='on_gat' ){
						filter_data2({
							filter_type:$('#left_flat .filter .filter_type').attr("type"),
						},'check_fn4');
					}
					//经停航班
					if(this.checked && this.value=='over' ){
						filter_data2({
							filter_type:$('#left_flat .filter .filter_type').attr("type"),
						},'check_fn5');
					}
					//直飞航班
					if(this.checked && this.value=='no_over' ){
						filter_data2({
							filter_type:$('#left_flat .filter .filter_type').attr("type"),
						},'check_fn6');
					}
				});
			}else{
				filter_data();
				$('#left_bar').attr("type","filter");
			}

			$('#screen').animate({
				attr:'o',
				target:0,
				step:30,
				t:10,
				fn:function(){
					$('#screen').unlock();
				}
			});
		},50);



	}

	$(document).click(function(){
		//统一清理事件
		removeEvent($('#left_flat .search_qf_text_td .qf_text').ge(0),"blur",search_qf_text_blur);
		removeEvent($('#left_flat .search_dd_text_td .dd_jc').ge(0),"blur",search_dd_text_blur);

		//统一添加事件
		$('#left_flat .search_dd_text_td .dd_jc').bind('blur',search_dd_text_blur);
		$('#left_flat .search_qf_text_td .qf_text').bind('blur',search_qf_text_blur);
//		console.log("document恢复起飞输入框的失去焦点函数");
//		console.log("document恢复到达输入框的失去焦点函数");


		//

	});

	//d3.selectAll('#map svg #g1 .line_bg').on('click',function(){
	//	$('#flight_info').animate({
	//		attr:'o',
	//		target:0,
	//		t:10,
	//		step:30,
	//		fn:function(){
	//			$('#flight_info').hide();
	//		}
	//	});
    //
    //
	//	$('#flight_info_plus').show().animate({
	//		t:10,
	//		step:30,
	//		mul:{
	//			y:0,
	//			o:80
	//		}
	//	});
    //
	//});


	d3.select('#flight_info_plus img').on('click',function(){
		d3.select('#flight_info_plus')
			.style("display","block")
			.transition()
			.duration(500)
			.style("bottom","-45rem")
			.style("opacity","0");
	});

	//$(document).click(function(){
	//	var  data = [
	//		{id: "1", value: "0.1949", label: "延误率"},
	//		{id: "2", value: "0.3475", label: "准时率"},
	//		{id: "3", value: "0.4576", label: "提前率"}
	//	];
	//
	//});

	//d3.selectAll('#left_flat .search_qf_text_td .search_qf_info .context li').on("mouseover",function(){
	//	console.log(this);
	//})





	//d3.selectAll('body').on('click',function(){
	//	var li = d3.selectAll('#left_flat .search_qf_text_td .search_qf_info .context li');
	//	console.log(li);
    //
	//});


	$('#left_flat .center').click(function(){

		var qf_type = $('#left_flat .qf_option .qf_input').attr("key"),
			qf_type_t = $('#left_flat .qf_option .qf_input').value(),
			qf_text = $('#left_flat .qf_text').value(),

			dd_type = $('#left_flat .qf_option .dd_input').attr("key"),
			dd_type_t = $('#left_flat .qf_option .dd_input').value(),
			dd_text = $('#left_flat .dd_jc').value(),
			qf_info = $('#left_flat .qf_text').attr("placeholder"),
			dd_info = $('#left_flat .dd_jc').attr("placeholder");



		qf_info = qf_info.replace("起飞","到达");
		dd_info = dd_info.replace("到达","起飞");


		qf_type_t = qf_type_t.replace("起飞","到达");
		dd_type_t = dd_type_t.replace("到达","起飞");



		$('#left_flat .qf_option .qf_input').attr("key",dd_type);
		$('#left_flat .qf_option .qf_input').value(dd_type_t);
		$('#left_flat .qf_text').value(dd_text);
		$('#left_flat .qf_text').attr("placeholder",dd_info);


		$('#left_flat .qf_option .dd_input').attr("key",qf_type);
		$('#left_flat .qf_option .dd_input').value(qf_type_t);
		$('#left_flat .dd_jc').value(qf_text);
		$('#left_flat .dd_jc').attr("placeholder",qf_info);




	});


	$('.other').click(function(e){
		alert("抱歉，该功能尚未完成.");
	});

	//$('.other').click(function(e){
	//	alert("抱歉，该功能尚未完成.");
	//});

	$('#left_flat .h6_other').click(function(){
		$(this).animate({
			attr:'o',
			t:10,
			step:30,
			target:0,
			fn:function(){
				$('#left_flat .h6_other').hide();
				$('#left_flat .jq_search').show().animate({
					t:30,
					step:10,
					mul:{
						o:100,
						y:0
					}
				}).css("top","20px");

			}

		})
	});


	//精确查询
	$('#left_flat .jq_search textarea').bind("focus",function(){
		if($('#left_flat .jq_search_popover').css('display')=='none'){
			$('#left_flat .jq_search_popover').show().animate({
				t:30,
				step:10,
				mul:{
					o:100,
					x:358
				}
			}).css("left","385px");
		}
	}).bind("blur",function(){
		//alert(validate_col2('#left_flat .jq_search textarea'));
		if(validate_col2('#left_flat .jq_search textarea')!=1){
			$('#left_flat .jq_search_popover').animate({
				t:30,
				step:10,
				mul:{
					o:0,
					x:385
				},
				fn:function(){
					$('#left_flat .jq_search_popover').hide();
				}
			});
		}
	});

	$('#left_flat .jq_search .search_button').click(function(){
		if(validate_col2('#left_flat .jq_search textarea')!=1){
			var str = $('#left_flat .jq_search textarea').value();

			ajax({
				method:'get',
				url:"/index.php?c=index&a=jq_search",
				data:{
					str:str
				},
				success : function(text){
					var temp = JSON.parse(text),
						line_data=temp.data.line,
						line_plus_data=temp.data.line_plus,
						num_line = line_data.length,
						num_line_plus = line_plus_data.length,
						num = num_line+num_line_plus;

					//曲线生成模式2，附加背景,生成直飞航线
					show_line_plus(line_data);
					//曲线生成模式2，附加背景,生成经停航线
					show_line_plus2(line_plus_data);

					if(num > 0){
						$('#search_info h6').html("查询成功，共查询到"+num+"个航班；其中直飞航班"+num_line+"个，经停航班"+num_line_plus+"个。");
					}else if(num == 0){
						$('#search_info h6').html("抱歉，未查询到相关数据！");
					}

					$('#search_info').animate({
						t:10,
						step:30,
						mul:{
							y:0,
							o:100
						}
					});

					setTimeout(function(){
						$('#search_info').animate({
							t:30,
							step:10,
							mul:{
								y:-120,
								o:0
							}
						});
					},1500);





				},
				error : function(text){
					alert("error"+text);
				},
				async:true
			});




		}

	});






	var search_radio_input=$('#left_flat .ks_search strong input');

	search_radio_input.click(function(e){

		getFlight_data2(e,this.value);
	});


	var input_list=d3.selectAll('#left_flat .filter_checkbox table input');
	input_list.on("click",function(e){

			var screen = $('#screen');
			screen.lock().resize(function(){
				if(screen.css("display")=='block'){
					screen.lock();
				}
			}).opacity(30);
			$('#loading').show();

			setTimeout(function(){
				input_list.each(function(d,i){
					if(this.checked && this.value=='on_ch' ){
						filter_data({
							airline_company:"",
							end_time:"",
							filter_type:$('#left_flat .filter .filter_type').attr("type"),
							mb_text:"China",
							mb_type:"3",
							qf_text:"China",
							qf_type:"3",
							start_time:"",
							zz_text:"",
							zz_type:"3"
						});
					}

					//国际航班
					if(this.checked && this.value=='on_world' ){
						filter_data2({
							filter_type:$('#left_flat .filter .filter_type').attr("type"),
							qf_type:"3",
							qf_text:"China",
							mb_type:"3",
							mb_text:"China",
							zz_type:"3",
							zz_text:""
						},'check_fn1');
					}

					//出境航班
					if(this.checked && this.value=='out_ch' ){
						filter_data2({
							filter_type:$('#left_flat .filter .filter_type').attr("type"),
							qf_type:"3",
							qf_text:"China",
							mb_type:"3",
							mb_text:"China",
							zz_type:"3",
							zz_text:""
						},'check_fn2');
					}
					//入境航班
					if(this.checked && this.value=='in_ch' ){
						filter_data2({
							filter_type:$('#left_flat .filter .filter_type').attr("type"),
							qf_type:"3",
							qf_text:"China",
							mb_type:"3",
							mb_text:"China",
							zz_type:"3",
							zz_text:""
						},'check_fn3');
					}
					//港澳台航班
					if(this.checked && this.value=='on_gat' ){
						filter_data2({
							filter_type:$('#left_flat .filter .filter_type').attr("type"),
						},'check_fn4');
					}
					//经停航班
					if(this.checked && this.value=='over' ){
						filter_data2({
							filter_type:$('#left_flat .filter .filter_type').attr("type"),
						},'check_fn5');
					}
					//直飞航班
					if(this.checked && this.value=='no_over' ){
						filter_data2({
							filter_type:$('#left_flat .filter .filter_type').attr("type"),
						},'check_fn6');
					}



				});
				$('#screen').animate({
					attr:'o',
					target:0,
					step:30,
					t:10,
					fn:function(){
						$('#screen').unlock();
					}
				});
			},50);




	});


	$('#city_info .close').hover(function(){
		$(this).attr("src","/svg/right_close2.svg")
	},function(){
		$(this).attr("src","/svg/right_close1.svg")
	}).click(function(){
		$('#city_info').animate({
			t:20,
			step:10,
			mul:{
				r:-360,
				o:90
			}
		});
	});


	$("#city_info .info_panel .airport_list").click(function(e){
		$("#city_info .chart_panel .airport_chart .svg_content .loading").show();
		$("#city_info .chart_panel .airport_chart .svg_content").opacity(0);


		var str = $(e.srcElement).html().replace(/.+\(/, "").replace(/\)/, "");
		$('#city_info .chart_panel .airport_chart .chart_title span').html(str);
		$('#city_info .chart_panel .airport_chart').show().animate({
			t:30,
			step:10,
			mul:{
				o:100,
				y:0
			}
		});


		ajax({
			method:'get',
			url:"/index.php?c=index&a=city_info",
			data:{
				airport:$(e.srcElement).html()
			},
			success : function(text){
				var temp = JSON.parse(text);
				console.log(temp);
				render_chart("#city_info .chart_panel .airport_chart .svg_content",300,300,55,temp.enter_num,temp.out_num);
			},
			error : function(text){
				alert("error"+text);
			},
			async:true
		});


		//ajax({
		//	method:'get',
		//	url:"/index.php?c=index&a=city_info",
		//	data:{
		//		airport:$(e.srcElement).html()
		//	},
		//	success : function(text){
		//		var temp = JSON.parse(text);
		//		console.log(temp);
		//		var str = temp.airport_list[0].replace(/.+\(/, "").replace(/\)/, "");
		//		console.log(str);
		//		$('#city_info .info_panel .airport').show().html( str );
        //
		//		$('#city_info .info_panel .on_city').show();
		//		$('#city_info .info_panel .on_city span').html(temp.city);
		//		$('#city_info .info_panel .country').show();
		//		$('#city_info .info_panel .country span').html(temp.country);
		//		$('#city_info .info_panel .airport_name').show();
		//		var string = temp.airport_list[0].replace(/\(.+\)/, "");
		//		$('#city_info .info_panel .airport_name span').html(string);
        //
		//		$('#city_info .info_panel .city').hide();
		//		$('#city_info .info_panel .on_airport').hide();
		//		$('#city_info .info_panel .airport_list').hide();
		//		$('#city_info .chart_panel .city_chart').hide();
		//		$('#city_info .chart_panel .airport_chart .chart_title span').html(str);
		//		$('#city_info .chart_panel .airport_chart').show().animate({
		//			attr:'o',
		//			t:30,
		//			step:10,
		//			target:100
		//		});
        //
        //
		//		render_chart("#city_info .chart_panel .airport_chart .svg_content",300,300,55,temp.enter_num,temp.out_num);
        //
        //
		//	},
		//	error : function(text){
		//		alert("error"+text);
		//	},
		//	async:true
		//});
	});

	$('#history .close').click(function(){
		$('#history').animate({
			t:10,
			step:10,
			mul:{
				y:250,
				o:0
			},
			fn:function(){
				$('#history').hide();
			}
		});
		$('#screen').animate({
			attr:'o',
			target:0,
			step:30,
			t:10,
			fn:function(){
				$('#screen').unlock();
			}
		});
	});

	$('#history').drag($('#history h6').ge(0));

	$("#flight_info_plus .qf_delay_chart").click(function(){
		show_history();
	});

	$("#flight_info_plus .dd_delay_chart").click(function(){
		show_history();
	});


	function show_history(){

		var screen = $('#screen');
		screen.lock().resize(function(){
			if(screen.css("display")=='block'){
				screen.lock();
			}
		}).opacity(30);
		$('#loading').hide();


		$('#history').center(1400,540).show().animate({
			t:30,
			step:10,
			mul:{
				y:202,
				o:100
			}
		}).css("top","300px");

		ajax({
			method:'get',
			url:"/index.php?c=index&a=getHistory",
			data:{
				flight_number:$("#flight_info_plus .flight_info .flight_info_number .flight_number_h").html()
			},
			success : function(text){
				var temp = JSON.parse(text);
				console.log(temp);
				var str = "",clazz;
				temp.forEach(function(d){
					clazz = d.leave_delay=="延误" ? "yw" : d.leave_delay=="提前" ? "tq" : d.leave_delay=="准点" ? "zd" : "other";

					str += "<tr class="+clazz+">" +
						"<td>"+ d.date+"</td>" +
						"<td>"+ d.type+"</td>" +
						"<td>"+ d.qf_ariport+"</td>" +
						"<td>"+ d.mb_ariport+"</td>" +
						"<td>"+ d.qf_zonghe+"</td>" +
						"<td>"+ d.mb_zonghe+"</td>" +
						"<td>"+ d.filght_time+"</td>" +
						"<td>"+ d.leave_delay+"</td>" +
						"</tr>";
				});
				str += "<tr class='info'><td colspan='8'>抱歉，未筛选到相关数据</td></tr>";
				$('#history .panel tbody').html(str);
			},
			error : function(text){
				alert("error"+text);
			},
			async:true
		});


	}



	$('#history .table_radio input').bind("change",function(){
		var type = this.value,j_tr,count=0;
		$('#history table tbody tr').elements.forEach(function(d){
			j_tr = $(d);
			if(type=="gl_yw" && j_tr.attr("class")=="yw"){
				//高亮延误
				j_tr.css("display","table-row").css("background","#fcf8e3");
				count++;
			}else if(type=="gl_zd" && j_tr.attr("class")=="zd"){
				//高亮准点
				j_tr.css("display","table-row").css("background","#dff0d8");
				count++;
			}else if(type=="gl_tq" && j_tr.attr("class")=="tq"){
				//高亮提前
				j_tr.css("display","table-row").css("background","#d9edf7");
				count++;
			}else{
				j_tr.css("display","table-row").css("background","none");
			}

			if( type.indexOf("z_")>-1 ){
				if(type=="z_yw" && j_tr.attr("class")=="yw"){
					//只显示延误
					j_tr.css("display","table-row");
					count++;
				}else if(type=="z_zd" && j_tr.attr("class")=="zd"){
					//只显示准点
					j_tr.css("display","table-row");
					count++;
				}else if(type=="z_tq" && j_tr.attr("class")=="tq"){
					//只显示提前
					j_tr.css("display","table-row");
					count++;
				}else{
					j_tr.hide();
				}
			}



		});

		var str;

		if(count==0 ){
			str = "抱歉，未筛选到相关数据！";
		}else if(count>0 ){
			str = "恭喜！共筛选到"+count+"条数据.";
		}

		if( !(count==0 && type.indexOf("z_")>-1) ){
			$("#history .panel table tbody .info").hide();
			$('#search_info h6').html(str);
			$('#search_info').animate({
				t:10,
				step:30,
				mul:{
					y:0,
					o:100
				}
			});
			setTimeout(function(){
				$('#search_info').animate({
					t:30,
					step:10,
					mul:{
						y:-120,
						o:0
					}
				});
			},1500);
		}else{
			$("#history .panel table tbody .info").css("display","table-row");
		}




	});






}






