
$(function(){
	//alert('DOM加载完成');
	//初始化显示地图
	//遮罩画布
	var screen = $('#screen');
	window.screen=screen;
	window.map = null;
	screen.lock().resize(function(){
		//screen.lock();
	}).opacity(30);
	$('#loading').show();

	//初始化
	//init(screen);



	//local的初始化
	init2();
	//加载
	load();



});




function init2(){
	var width =parseInt(getInner().width) ;
	var height = parseInt(getInner().height) ;
	var svg_left =parseInt(getStyle($('#left_bar').ge(0),"width")) ;


	var translate = [(width/2)-(svg_left/2),height/2];
	//滚动条隐藏
	document.body.style.overflow = 'hidden';
	//alert(width+","+height+","+svg_left);
	//alert(svg_left);
	var div = d3.select("#map");
	//定义拖拽
	var zoomer = d3.behavior.zoom().scaleExtent([1, 10]).on("zoom", zoom);
	var svg = div.append("svg").attr('width',width-svg_left).attr('height',height).call(zoomer).style("margin-left",svg_left);
	window.svg = svg;
	var g = svg.append('g').attr("id","g1").style("border","1px solid red");


	//定义地图投影
	var projection = d3.geo.equirectangular().scale(240).translate(translate);
	//定义地理路径生成器
	var path = d3.geo.path().projection(projection);


	d3.json("/d3/map/world-50m.json",function(error,world){
		var w = world;


		var a1 = projection([116.58499908447266,40.080101013183594]);
		var a2 = projection([-73.87259674,40.77719879]);

		var data = [
					{
						id:1,
						qf:["116.58499908447266","40.080101013183594"],
						dd:["-73.87259674","40.77719879"]
					},
					{
						id:2,
						qf:["116.58499908447266","40.080101013183594"],
						dd:["-73.87259674","40.77719879"]
					}
				];


		g.append("path")
			.datum(topojson.feature(world,world.objects.land))
			.attr("class","land")
			.attr("d",path);
		g.append("path")
			.datum(topojson.mesh(world,world.objects.countries))
			.attr("class","boundary")
			.attr("d",path);
//        alert("绘图完成");

//异步请求曲线数据
		ajax({
			method:'get',
			url:'/index.php',
			data:{
				'c':'index',
				'a':'index2'
			},
			success:function(text){
				//var data = JSON.parse(text);
				var data = [
					{
						id:1,
						qf:["116.58499908447266","40.080101013183594"],
						dd:["-73.87259674","40.77719879"]
					},
					{
						id:2,
						qf:["116.58499908447266","40.080101013183594"],
						dd:["-73.87259674","40.77719879"]
					}
				];
				g.selectAll("path.line")
					.data(data)
					.classed("line",true)
					.attr("id",function(d){
						return d.id;
					});

				g.selectAll("path.line")
					.data(data)
					.enter()
					.append("path")
					.classed("line",true)
					.attr("id",function(d){
						return d.id;
					})
					.attr("d",function(d){
						var array = getLine_xy(d.qf, d.dd);
						console.log(array);
						//三等分点1
						g.append("circle")
							.attr("cx",array[1][0])
							.attr("cy",array[1][1])
							.attr("r",5)
							.style("fill","green");
						//三等分点2
						g.append("circle")
							.attr("cx",array[2][0])
							.attr("cy",array[2][1])
							.attr("r",5)
							.style("fill","green");

						//控制点在机场连线上的投影
						g.append("circle")
							.attr("cx",array[3][0])
							.attr("cy",array[3][1])
							.attr("r",5)
							.style("fill","red");

						//控制点1
						g.append("circle")
							.attr("cx",array[4][0])
							.attr("cy",array[4][1])
							.attr("r",5)
							.style("fill","#74FFEC");
						return array[0];

					});


			},
			error:function(state,msg){
				alert(state+"："+msg);
			},
			async:true
		});







		g.append("circle")
			.attr("cx",a1[0])
			.attr("cy",a1[1])
			.attr("r",5)
			.style("fill","red");
		//alert((1238.8501021900693+194.11286546912746)/2);
		//alert(a1[0]+","+a1[1]);

		g.append("circle")
			.attr("cx",a2[0])
			.attr("cy",a2[1])
			.attr("r",5).style("fill","blue");
		g.append("circle")
			.attr("cx",width-40)
			.attr("cy",a1[1]-90)
			.attr("r",5).style("fill","green");
		g.append("circle")
			.attr("cx",width-200)
			.attr("cy",a1[1]-90)
			.attr("r",5).style("fill","yellow");




		g.append("circle")
			.attr("cx",0)
			.attr("cy",a1[1]-90)
			.attr("r",5).style("fill","#000");


		g.append("path")
			.attr("class","line")
			.attr("id","line1")

			//.attr("d","M"+a1[0]+" "+a1[1]+" L"+a2[0]+" "+a2[1]);
			.attr("d","M"+a1[0]+" "+a1[1]+" Q"+(width-200)+" "+(a1[1]-70)+" "+(width-40)+" "+(a1[1]-90)+
					"M"+0+" "+(a1[1]-90)+" Q"+(200)+" "+(a1[1]-90)+" "+a2[0]+" "+a2[1] );
		/*g.append("path")
			.attr("class","line")
			.attr("id","line-bar")
			//.attr("filter","url(#filter)")
			//.attr("d","M"+a1[0]+" "+a1[1]+" L"+a2[0]+" "+a2[1]);
			.attr("d","M"+a1[0]+" "+a1[1]+" Q"+(width-200)+" "+(a1[1]-90)+" "+(width-40)+" "+(a1[1]-90)+
					"M"+10+" "+(a1[1]-90)+" Q"+(200)+" "+(a1[1]-90)+" "+a2[0]+" "+a2[1] );*/

		g.attr("transform", "translate(0,0) scale(1)");


		var length= $("#line1").ge(0).getTotalLength();
		//d3.select("#line1").style("stroke-dasharray","0,"+length).transition().duration(10000).style("stroke-dasharray",length+","+length);
		$("#line1").hover(function(){
			d3.select(this).style("stroke","red");
		},function(){
			d3.select(this).style("stroke","blue");

		});

	});
	function zoom(){

		/*var array = getStyle($("#g1").ge(0),"transform").split(",");
		//console.log(array);
		var scale = parseInt(array[3]);
		var x = parseInt(array[4]);
		var y = parseInt(array[5].replace(")",""));
		console.log("x:"+x+",y:"+y+",scale:"+scale);
		console.log(parseInt(d3.event.scale));


		if(parseInt(d3.event.scale) == scale ){
			if( x>0 || y>0  ){
				g.attr("transform", "translate(0,0) scale(1)");
				console.log("超出");
			}else{
				g.attr("transform", "translate(" + d3.event.translate + ")");
			}

		}else{
			g.attr("transform", "scale(" + d3.event.scale + ")");
		}*/



		//g.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");




		//var box = document.getElementById("g1").getBBox();
		//console.log(d3.event.translate);
		//console.log(g);
		//console.log(box);
	}

	svg.on("click",function(){
		var point = d3.mouse(svg.node());
        //alert(point[0]+","+svgToMatch(point[1]) );
		//var length= $("#line1").ge(0).getTotalLength();
		//
		//d3.select("#line1")
		//	.style("animation","line 5s linear infinite normal")
		//	.style("stroke-dasharray",(length-10)+","+10);


		//var array = getStyle($("#g1").ge(0),"transform").split(",");
		//console.log(array);
		//var scale = array[3];
		//var x = array[4];
		//var y = array[5].replace(")","");
		//console.log("scale"+scale);
		//console.log("x"+x);
		//console.log("y:"+y);
		//alert(g1);

		//g.attr("transform", "translate(0,0) scale(1)");

	});





	$('#loading').animate({
		attr:'o',
		target:0,
		step:50,
		t:1,
		fn:function(){
			$('#loading').hide();
		}
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



	$('#map').animate({
		attr:'o',
		target:100,
		step:10,
		t:10

	});


	$(document).resize(function(){
		var width =parseInt(getInner().width) ;
		var height = parseInt(getInner().height) ;
		var svg_left =parseInt(getStyle($('#left_bar').ge(0),"width")) ;
	    svg.attr('width',width-svg_left).attr('height',height);
	});





}




function init(){
	var url = 'http://webapi.amap.com/loca?key=7a62597821fd492a53bc6b4e81f50ece&v=1.0.4';
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
		leftBox_anim(left_box.menu,10,30,-280,0);
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







//        添加控制按钮
//        map.plugin(["AMap.ToolBar"], function() {
//            map.addControl(new AMap.ToolBar());
//        });

	map.on('click', function(e) {
		alert(e.lnglat.getLng()+','+e.lnglat.getLat());
	});

	map.on('complete', function() {


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









//绘制曲线
function show_line(data,map){
	var linedata = data['lineData'];
	var qf_xy = linedata[1]['qf_city_xy'];
	var qf_x=qf_xy.split(",")[0];
	var qf_y=qf_xy.split(",")[1];

	var mb_xy = linedata[1]['mb_city_xy'];
	var mb_x=mb_xy.split(",")[0];
	var mb_y=mb_xy.split(",")[1];
	var lineArr1 = [//每个弧线段有两种描述方式
		[qf_x,qf_y],//起点
		//第一段弧线控制点，终点
		[5.028266,58.590236,mb_x,mb_y]

	];

	var curve1= new AMap.BezierCurve({
		map: map,
		path: lineArr1,
		bubble: true,
		strokeColor: "#606060", //线颜色
		strokeOpacity: 0.8, //线透明度
		strokeWeight: 1, //线宽
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
			strokeColor: "blue", //线颜色
			strokeOpacity: 0.8, //线透明度
			strokeWeight: 1, //线宽
			cursor:"pointer",
			strokeStyle: "solid" //线样式
		});

	});

}















