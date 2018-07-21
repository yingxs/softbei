
$(function(){
	//alert('DOM加载完成');
	//初始化显示地图
	//遮罩画布
	var screen = $('#screen');
	window.map = null;
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






/*
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
					}
				];

				//g.selectAll("path.line")
				//	.data(data)
				//	.classed("line",true)
				//	.attr("id",function(d){
				//		return d.id;
				//	});

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
						//console.log(array);
						//三等分点1,靠近起飞机场(x1,y1)
						g.append("circle")
							.attr("cx",array[1][0])
							.attr("cy",array[1][1])
							.attr("r",5)
							.style("fill","blue");
						//三等分点2,靠近降落机场(x2,y2)
						g.append("circle")
							.attr("cx",array[2][0])
							.attr("cy",array[2][1])
							.attr("r",5)
							.style("fill","blue");

						//控制点在机场连线上的投影
						g.append("circle")
							.attr("cx",array[3][0])
							.attr("cy",array[3][1])
							.attr("r",5)
							.style("fill","green");

						//控制点1
						g.append("circle")
							.attr("cx",array[4][0])
							.attr("cy",array[4][1])
							.attr("r",5)
							.style("fill","red");

						//p-x1
						g.append("circle")
							.attr("cx",array[5][0])
							.attr("cy",array[5][1])
							.attr("r",5)
							.style("fill","#000");
						//q-x2
						g.append("circle")
							.attr("cx",array[6][0])
							.attr("cy",array[6][1])
							.attr("r",5)
							.style("fill","#000");



						var array2 = getLine_xyPlus(d.qf, d.dd);
						console.log(array2);
						//右曲线控制点
						g.append("circle")
							.attr("cx",array2[1][0])
							.attr("cy",array2[1][1])
							.attr("r",3).style("fill","#000");
						//左曲线控制点
						g.append("circle")
							.attr("cx",array2[4][0])
							.attr("cy",array2[4][1])
							.attr("r",3).style("fill","#000");

						//右边界标志点
						g.append("circle")
							.attr("cx",array2[2][0])
							.attr("cy",array2[2][1])
							.attr("r",3).style("fill","red");

						//左边界标志点
						g.append("circle")
							.attr("cx",array2[3][0])
							.attr("cy",array2[3][1])
							.attr("r",3).style("fill","red");

						//return array2[0];
						return array[0];

					});


			},
			error:function(state,msg){
				alert(state+"："+msg);
			},
			async:true
		});
*/

/*
		var a1 = projection([116.58499908447266,40.080101013183594]);
		var a2 = projection([-73.87259674,40.77719879]);
		//起飞机场坐标
		g.append("circle")
			.attr("cx",a1[0])
			.attr("cy",a1[1])
			.attr("r",4)
			.style("fill","#f76463");
		//降落机场坐标
		g.append("circle")
			.attr("cx",a2[0])
			.attr("cy",a2[1])
			.attr("r",4)
			.style("fill","#f76463");
	*/

/*
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

		g.append("circle")
			.attr("cx",200)
			.attr("cy",a1[1]-90)
			.attr("r",5).style("fill","#000");

		g.append("path")
			.attr("class","line")
			.attr("id","line1")

			//.attr("d","M"+a1[0]+" "+a1[1]+" L"+a2[0]+" "+a2[1]);
			.attr("d","M"+a1[0]+" "+a1[1]+" Q"+(width-200)+" "+(a1[1]-90)+" "+(width-40)+" "+(a1[1]-90)+
					"M"+0+" "+(a1[1]-90)+" Q"+(200)+" "+(a1[1]-90)+" "+a2[0]+" "+a2[1] );
		g.append("path")
			.attr("class","line")
			.attr("id","line-bar")
			//.attr("filter","url(#filter)")
			//.attr("d","M"+a1[0]+" "+a1[1]+" L"+a2[0]+" "+a2[1]);
			.attr("d","M"+a1[0]+" "+a1[1]+" Q"+(width-200)+" "+(a1[1]-90)+" "+(width-40)+" "+(a1[1]-90)+
					"M"+10+" "+(a1[1]-90)+" Q"+(200)+" "+(a1[1]-90)+" "+a2[0]+" "+a2[1] );

		g.attr("transform", "translate(0,0) scale(1)");

		//var length= $("#line1").ge(0).getTotalLength();
		//d3.select("#line1").style("stroke-dasharray","0,"+length).transition().duration(10000).style("stroke-dasharray",length+","+length);
		//$("#line1").hover(function(){
		//	d3.select(this).style("stroke","red");
		//},function(){
		//	d3.select(this).style("stroke","blue");
		//
		//});

*/

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



		g.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");




		//var box = document.getElementById("g1").getBBox();
		//console.log(d3.event.translate);
		//console.log(g);
		//console.log(box);
	}

	/*
	$('#loading').animate({
		attr:'o',
		target:0,
		step:30,
		t:10,
		fn:function(){
			$('#loading').hide();
		}
	});
	*/

	//当窗口大小发生变化时，重新计算svg画布的大小
	//$(document).resize(function(){
     //   //var width =parseInt(getInner().width) ;
     //   //var height = parseInt(getInner().height) ;
     //   //var svg_left =parseInt(getStyle($('#left_bar').ge(0),"width")) ;
	//    //svg.attr('width',width-svg_left).attr('height',height);
	//});

	svg.on("click",function(){
		var point = d3.mouse(svg.node());
		//alert(point[0]+","+svgToMatch(point[1]) );
		//alert(point[0]+","+point[1] );



//		$('#flight_info').animate({
//			t:30,
//			step:10,
//			mul:{
//				left:point[0],
//				top:point[1]
//			}
//		});



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
		getFlight_data(e);
		//leftBox_anim(left_box.search,10,30,-380,100);
		$('#left_bar').attr("type","search");
	});

	//确认过滤
	$('#left_flat .filter .filter_button .submit').click(function(e){
		//console.log(serializeFilter());
		predef(e);
		filter_data();
		$('#left_bar').attr("type","filter");
	});

	//选择只显示筛选的数据
	$('#left_flat .filter .filter_type .hide').click(function(e){
		$('#left_flat .filter .filter_type .show').css("border","1px solid #ddd");
		$('#left_flat .filter .filter_type .hide').css("border","1px solid #739296");
		//筛选结果类型为隐藏不符合要求的数据
		$('#left_flat .filter .filter_type').attr("type","hide");

	});

	//选择高亮显示筛选的数据
	$('#left_flat .filter .filter_type .show').click(function(e){
		$('#left_flat .filter .filter_type .hide').css("border","1px solid #ddd");
		$('#left_flat .filter .filter_type .show').css("border","1px solid #739296");
		//筛选结果类型为高亮显示符合要求的数据
		$('#left_flat .filter .filter_type').attr("type","show");
	});

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

}






