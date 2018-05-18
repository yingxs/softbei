
$(function(){
	//alert('DOM加载完成');
	//初始化显示地图
	//遮罩画布
	var screen = $('#screen');
	window.screen=screen;
	window.map = null;
	screen.lock().resize(function(){
		screen.lock();
	}).opacity(30);

	//初始化
	init(screen);
	//加载
	load();




	function getScreen(){
		return screen;
	}






});


function init(){
	var url = 'http://webapi.amap.com/maps?v=1.4.5&key=7a62597821fd492a53bc6b4e81f50ece&plugin=AMap.BezierCurveEditor&callback=onApiLoaded';
	var jsapi = document.createElement('script');
	jsapi.charset = 'utf-8';
	jsapi.src = url;
	document.head.appendChild(jsapi);

}

function load(){

	var left_box = {
		menu:$('#left_bar span'),
		search:$('#left_flat span').eq(0),
		filter:$('#left_flat span').eq(1)
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

	$('#map').click(function(){
		leftBox_anim(left_box.menu,10,30,-155,0);
		leftBox_anim(left_box.search,10,30,-380,0);
		leftBox_anim(left_box.filter,10,30,-100,0);

	});


	//左边菜单块
	$('#left_bar .menu_ul li').click(function(){

		if( $(this).index() == 0 && parseInt( left_box.menu.css('left') )<0 ) {
			//当点击菜单按钮时，显示菜单块
			leftBox_anim(left_box.menu,10,30,0,100);
		}else if($(this).index() == 1 && parseInt( left_box.search.css('left') )<0){
			//显示之前隐藏信息提示框
			leftBox_anim($('#left_bar .diolg_ul li').eq($(this).index()),10,30,-150,0);
			//显示搜索块
			leftBox_anim(left_box.search,10,30,36,100);
			//隐藏筛选块
			leftBox_anim(left_box.filter,10,30,-100,0);
		}else if($(this).index() == 1 && parseInt( left_box.search.css('left') )>0){
			//隐藏搜索块
			leftBox_anim(left_box.search,10,30,-380,100);
		}else if($(this).index() == 2 && parseInt( left_box.filter.css('left') )<0){
			//显示之前隐藏信息提示框
			leftBox_anim($('#left_bar .diolg_ul li').eq($(this).index()),10,30,-150,0);
			//显示筛选块
			leftBox_anim(left_box.filter,10,30,35,100);
			//隐藏搜索块
			leftBox_anim(left_box.search,10,30,-380,0);
		}else if($(this).index() == 2 && parseInt( left_box.filter.css('left') )>0){
			leftBox_anim(left_box.filter,10,30,-100,0);
		}

	});

	//查询出发选项
	$('#left_flat qf_option .qf_input').bind('focus',function(){
		$('#left_flat qf_option .qf_opt').show();
		$('#left_flat qf_option .qf_opt').animate({
			t:30,
			step:10,
			mul:{
				h:104,
				o:100
			}
		});
		$('#left_flat qf_option .qf_img_down').attr('src','svg/select_up.svg');

	}).bind('blur',function(){
		$('#left_flat qf_option .qf_opt').animate({
			t:30,
			step:10,
			mul:{
				h:0,
				o:0
			},
			fn:function(){
				$('#left_flat qf_option .qf_opt').hide();
				$('#left_flat qf_option .qf_img_down').attr('src','svg/select_down.svg');
			}
		});

	});

	//查询到达选项
	$('#left_flat qf_option .dd_input').bind('focus',function(){
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

	}).bind('blur',function(){
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
	});

	//起飞选项
	$('#left_flat .qf_option .qf_opt li').bind('mousedown',function(){
		var str = $(this).html();
		var value = $(this).attr('value');
		$('#left_flat .qf_option .qf_input').value("出发："+str);
		var array=["机场","省/市","区域","国家"];
		$('#left_flat .qf_text').attr('placeholder',"起飞"+array[value]).attr('key',value);

	});
	//到达选项
	$('#left_flat .qf_option .dd_opt li').bind('mousedown',function(){
		var str = $(this).html();
		var value = $(this).attr('value');
		$('#left_flat .qf_option .dd_input').value("到达："+str);
		var array=["机场","省/市","区域","国家"];
		$('#left_flat  .dd_jc').attr('placeholder',"到达"+array[value]).attr('key',value);
	});


	//中转选项
	$('#left_flat .td_zz .zz_select').bind('focus',function(){
		$('#left_flat .td_zz .zz_opt').show();
		$('#left_flat .td_zz .zz_opt').animate({
			t:30,
			step:10,
			mul:{
				h:104,
				o:100
			}
		});
		$('#left_flat .td_zz .zz_img_down').attr('src','svg/select_up.svg');
	}).bind('blur',function(){
		$('#left_flat .td_zz .zz_opt').animate({
			t:30,
			step:10,
			mul:{
				h:0,
				o:0
			},
			fn:function(){
				$('#left_flat .td_zz .zz_opt').hide();
				$('#left_flat .td_zz .zz_img_down').attr('src','svg/select_down.svg');
			}
		});
	});
	$('#left_flat .td_zz .zz_opt li').bind('mousedown',function(){
		var value = $(this).attr('value');
		//alert(value);
		var array=["机场","省/市","区域","国家"];
		$('#left_flat .td_zz .zz_jc').attr('key',value).attr('placeholder',"中转"+array[value]);

	});



	//起飞时间文本框获得焦点或点击后，日历div显示
	$('#left_flat .qf_time').bind('focus',show_calendar1).click(show_calendar1);

	//起飞时间文本框获得焦点或点击后，日历div隐藏
	$('#left_flat .qf_time').bind('blur',hide_calendar);

	//鼠标移动到日历div上后，删除失去焦点事件函数，添加鼠标移出事件
	$('#left_flat #date_calendar').bind('mouseenter',function(e){
		removeEvent($('#left_flat .qf_time').ge(0),'blur',hide_calendar);
		addEvent($('#left_flat #date_calendar').ge(0),'mouseleave',hide_calendar);
	});

	//到达时间文本框获得焦点或点击后，日历div显示
	$('#left_flat .dd_time').bind('focus',show_calendar2).click(show_calendar2);
	//到达时间文本框获得焦点或点击后，日历div隐藏
	$('#left_flat .dd_time').bind('blur',hide_calendar);

	$('#left_flat #date_calendar table td').click(function(e){
		if($(this).attr('lang')=='wh'){
			var tr = removeWhiteNode(this).parentNode;
			var tbody = removeWhiteNode(tr).parentNode;
			var table = removeWhiteNode(tbody).parentNode;
			var h = table.previousSibling.previousSibling;
			var str = h.innerHTML+this.innerHTML;
			 str = str.replace("年","/");
			 str = str.replace("月","/");


			if(parseInt($('#date_calendar').css('left'))<=0){
				$('#left_flat .qf_time').value(str);
			}else{
				$('#left_flat .dd_time').value(str);
			}

		}
	});


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
function show_calendar1(){

	if($('#date_calendar').css('display')=='block'){
		//$('#date_calendar').show().css('left','0px').css('width','0px').css('height','0px').opacity(0);
		console.log("block1");
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

		console.log("block2");

	}else{
		console.log("none1");
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
		console.log("none2");

	}

}

//到达时间文本框下显示日历div
function show_calendar2(){
	if($('#date_calendar').css('display')=='block'){
		//$('#date_calendar').show().css('left','180px').css('width','0px').css('height','0px').opacity(0);
		$('#date_calendar').animate({
			t:30,
			step:10,
			mul:{
				x:180,
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
				h:300,
				o:100,
				w:550
			}
		}).css('left','180px');
	}
}



function onApiLoaded(){



	 map = new AMap.Map('map', {
		center: [117.000923, 36.675807],
		zoom: 2,
		mapStyle:'amap://styles/80e8a8b8a906b27a1fd674f29f31aabc'
	});

//        添加控制按钮
//        map.plugin(["AMap.ToolBar"], function() {
//            map.addControl(new AMap.ToolBar());
//        });

	map.on('click', function(e) {
		alert(e.lnglat.getLng()+','+e.lnglat.getLat());
	});

	map.on('complete', function() {
		//异步请求曲线数据
		ajax({
			method:'get',
			url:'/index.php',
			data:{
				'c':'index',
				'a':'index2'
			},
			success:function(text){
				var data = JSON.parse(text);
				show_line(data,window.map);
				//alert(data);

			},
			error:function(state,msg){
				alert(state+"："+msg);
			},
			async:true
		});


		window.screen.animate({
			attr:'o',
			target:0,
			step:30,
			t:10,
			fn:function(){
				window.screen.unlock();
			}
		});

		$('#loading').animate({
			attr:'o',
			target:0,
			step:30,
			t:10,
			fn:function(){
				$('#loading').hide();
			}
		});

		//alert('地图加载完成');
		$('#map').animate({
			attr:'o',
			target:100,
			step:10,
			t:10

		});





//        document.getElementById('tip').innerHTML = "地图图块加载完毕！当前地图中心点为：" + map.getCenter();
	});


}




//异步请求航线数据





//绘制曲线
function show_line(data,map){

	var lineArr1 = [//每个弧线段有两种描述方式
		[2.166515,23.493206],//起点
		//第一段弧线控制点，终点
		[ 52.439953,37.657499,104.11964,34.678151]

	];

	var curve1= new AMap.BezierCurve({
		map: map,
		path: lineArr1,
		bubble: true,
		strokeColor: "red", //线颜色
		strokeOpacity: 1, //线透明度
		strokeWeight: 3, //线宽
		cursor:"pointer",
		strokeStyle: "solid" //线样式
	});

	curve1.on('mouseover',function(){
		curve1.setOptions({
			map: map,
			path: lineArr1,            // 设置线覆盖物路径
			strokeColor: '#000000',   // 线颜色
			strokeOpacity: 1,         // 线透明度
			strokeWeight: 2,          // 线宽
			strokeStyle: 'solid'     // 线样式
		});

	});
	curve1.on('mouseout',function(){
		curve1.setOptions({
			map: map,
			path: lineArr1,
			bubble: true,
			strokeColor: "red", //线颜色
			strokeOpacity: 1, //线透明度
			strokeWeight: 3, //线宽
			cursor:"pointer",
			strokeStyle: "solid" //线样式
		});

	});

}















