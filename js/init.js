
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
	var li_list = $('#left_flat .qf_option .qf_opt li').elements;
	console.log(li_list);
	(function(){
		for(var i=0 ;i<li_list.length;i++){
			if($(li_list[i]).attr('select')=='select'){
				$('#left_flat .qf_option  .qf_input').value("出发："+$(li_list[i]).html());
				$('#left_flat .qf_option  .qf_input').attr("key",$(li_list[i]).attr("value"));
				$('#left_flat .qf_option  .dd_input').value("到达："+$(li_list[i]).html());
				$('#left_flat .qf_option  .dd_input').attr("key",$(li_list[i]).attr("value"));

				$('#left_flat .qf_text').attr("placeholder","起飞"+$(li_list[i]).html().replace('按',''));
				$('#left_flat .dd_jc').attr("placeholder","到达"+$(li_list[i]).html().replace('按',''));

				//alert("起飞"+$(li_list[i]).html().replace('按',''));
			}
		}
	})();



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
					}/*,
					{
						id:2,
						qf:["116.58499908447266","40.080101013183594"],
						dd:["-73.87259674","40.77719879"]
					}*/
				];
				/*g.selectAll("path.line")
					.data(data)
					.classed("line",true)
					.attr("id",function(d){
						return d.id;
					});*/

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
							.style("fill","blue");
						//三等分点2
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







		//起飞机场坐标
		g.append("circle")
			.attr("cx",a1[0])
			.attr("cy",a1[1])
			.attr("r",4)
			.style("fill","#f76463");
		//alert((1238.8501021900693+194.11286546912746)/2);
		//alert(a1[0]+","+a1[1]);
		//降落机场坐标
		g.append("circle")
			.attr("cx",a2[0])
			.attr("cy",a2[1])
			.attr("r",4)
			.style("fill","#f76463");


		/*g.append("circle")
			.attr("cx",width-40)
			.attr("cy",a1[1]-90)
			.attr("r",5).style("fill","green");*/



		/*g.append("circle")
			.attr("cx",width-200)
			.attr("cy",a1[1]-90)
			.attr("r",5).style("fill","yellow");*/

		/*g.append("circle")
			.attr("cx",0)
			.attr("cy",a1[1]-90)
			.attr("r",5).style("fill","#000");*/

		/*g.append("circle")
			.attr("cx",200)
			.attr("cy",a1[1]-90)
			.attr("r",5).style("fill","#000");*/



		/*g.append("path")
			.attr("class","line")
			.attr("id","line1")

			//.attr("d","M"+a1[0]+" "+a1[1]+" L"+a2[0]+" "+a2[1]);
			.attr("d","M"+a1[0]+" "+a1[1]+" Q"+(width-200)+" "+(a1[1]-90)+" "+(width-40)+" "+(a1[1]-90)+
					"M"+0+" "+(a1[1]-90)+" Q"+(200)+" "+(a1[1]-90)+" "+a2[0]+" "+a2[1] );*/
		/*g.append("path")
			.attr("class","line")
			.attr("id","line-bar")
			//.attr("filter","url(#filter)")
			//.attr("d","M"+a1[0]+" "+a1[1]+" L"+a2[0]+" "+a2[1]);
			.attr("d","M"+a1[0]+" "+a1[1]+" Q"+(width-200)+" "+(a1[1]-90)+" "+(width-40)+" "+(a1[1]-90)+
					"M"+10+" "+(a1[1]-90)+" Q"+(200)+" "+(a1[1]-90)+" "+a2[0]+" "+a2[1] );*/

		g.attr("transform", "translate(0,0) scale(1)");


		//var length= $("#line1").ge(0).getTotalLength();
		//d3.select("#line1").style("stroke-dasharray","0,"+length).transition().duration(10000).style("stroke-dasharray",length+","+length);
		//$("#line1").hover(function(){
		//	d3.select(this).style("stroke","red");
		//},function(){
		//	d3.select(this).style("stroke","blue");
		//
		//});

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
        alert(point[0]+","+svgToMatch(point[1]) );
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

	window.screen.animate({
		attr:'o',
		target:0,
		step:30,
		t:10,
		fn:function(){
			window.screen.unlock();
		}
	});


	//地图出现
	$('#map').animate({
		attr:'o',
		target:100,
		step:30,
		t:10

	});


	$(document).resize(function(){
		var width =parseInt(getInner().width) ;
		var height = parseInt(getInner().height) ;
		var svg_left =parseInt(getStyle($('#left_bar').ge(0),"width")) ;
	    svg.attr('width',width-svg_left).attr('height',height);
	});





}






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

	$('#map').click(function(){
		leftBox_anim(left_box.menu,10,30,-300,100);
		leftBox_anim(left_box.search,10,30,-380,100);
		leftBox_anim(left_box.filter,10,30,-300,100);

	});


	//左边菜单块
	$('#left_bar .menu_ul li').click(function(){

		if( $(this).index() == 0 && parseInt( left_box.menu.css('left') )<0 ) {
			//隐藏筛选块
			leftBox_anim(left_box.filter,10,30,-300,100);
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
			leftBox_anim(left_box.filter,10,30,-300,100);
		}else if($(this).index() == 1 && parseInt( left_box.search.css('left') )>0){
			//隐藏搜索块
			leftBox_anim(left_box.search,10,30,-380,100);
		}else if($(this).index() == 2 && parseInt( left_box.filter.css('left') )<0){
			//显示之前隐藏信息提示框
			leftBox_anim($('#left_bar .diolg_ul li').eq($(this).index()),10,30,-150,0);
			//显示筛选块
			leftBox_anim(left_box.filter,10,30,35,100);
			//隐藏搜索块
			leftBox_anim(left_box.search,10,30,-380,100);
		}else if($(this).index() == 2 && parseInt( left_box.filter.css('left') )>0){
			leftBox_anim(left_box.filter,10,30,-280,100);
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



	//查询出发选项
	$('#left_flat .qf_option .qf_input').bind('focus',show_qf_opt).bind('blur',hide_qf_opt);
	$('#left_flat .qf_option .qf_img_down').click(function(){
		if($('#left_flat .qf_option .qf_opt').css("display")=="block"){
			hide_qf_opt();
		}else{
			show_qf_opt();
		}
	});



	//查询到达选项
	$('#left_flat .qf_option .dd_input').bind('focus',show_dd_opt).bind('blur',hide_dd_opt);
	$('#left_flat .qf_option .dd_img_down').click(function(){
		if($('#left_flat .qf_option .dd_opt').css("display")=="block"){
			hide_dd_opt();
		}else{
			show_dd_opt();
		}

	});


	//起飞选项
	$('#left_flat .qf_option .qf_opt li').bind('mousedown',function(){
		var str = $(this).html();
		var key = $(this).attr('value');
		$('#left_flat .qf_option .qf_input').value("出发："+str);
		$('#left_flat .qf_option .qf_input').attr("key",key);
		$('#left_flat .qf_text').attr('placeholder',"起飞"+$(this).html().replace("按",""));
	});


	//到达选项
	$('#left_flat .qf_option .dd_opt li').bind('mousedown',function(){
		var str = $(this).html();
		var key = $(this).attr('value');
		$('#left_flat .qf_option .dd_input').value("到达："+str);
		$('#left_flat .qf_option .dd_input').attr("key",key);
		$('#left_flat  .dd_jc').attr('placeholder',"到达"+$(this).html().replace("按",""));

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

	//日期选择
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




	//起飞选项输入框获得焦点
	$('#left_flat .qf_text').bind('focus',function(){
		$('#left_flat .qf_select_info').attr("type","qf");
		get_qf_opt();
	});

	//到达选项输入框获得焦点
	$('#left_flat .dd_jc').bind('focus',function(){
		$('#left_flat .qf_select_info').attr("type","dd");
		get_dd_opt();
	});

	//起飞选项输入框失去焦点
	$('#left_flat .qf_text').bind('blur',function(){
		hide_select_info(false,0);
	});

	//到达选项输入框失去焦点
	$('#left_flat .dd_jc').bind('blur',function(){
		hide_select_info(false,190);
	});


	//起飞选项输入框键入事件,异步查询
	$('#left_flat .qf_text').bind('keyup',get_qf_opt);

	//到达选项输入框键入事件,异步查询
	$('#left_flat .dd_jc').bind('keyup',get_dd_opt);


	//航空公司输入框键入事件，异步查询
	$('#left_flat .airline_company .company_text')
		.bind('keyup',get_company)
		.bind("focus",get_company)
		.bind('blur',function(){
			hide_company_info(false,this);
		});


	//查询
	$('#left_flat .from1_button .submit').click(function(e){
		getFlight_data(e);
	});



}


//异步查询航班数据
function getFlight_data(e){
	ajax({
		method:'get',
		url:"/index.php?c=index&a=search",
		data:serializeSearch(),
		success : function(text){
			var data = JSON.parse(text);
			alert(data.length);
		},
		error : function(text){
			alert(text);
		},
		async:true
	});
	predef(e);

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

				console.log(element);
				//存储查询结果的最长值
				var max_lenght = 0;
				//更新
				element.selectAll("li")
					.data(data)
					.text(function(d){
						if(d.length>max_lenght){
							max_lenght = d.length;
						}
						console.log(d+":"+d.length);
						console.log("max_lenght:"+max_lenght);
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
						console.log(d+":"+d.length);
						console.log("max_lenght:"+max_lenght);
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
				alert(text)
			},
			async:true
		});
	}else if($('#left_flat .airline_company .company_text').value()==''){
		hide_company_info(false,this);
	}
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

//显示起飞选项
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

//隐藏起飞选项
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
				alert(text);
			},
			async:true

		});

	}else if ( trim($('#left_flat .qf_text').value())=='' ) {
		hide_select_info(false,0,this);
	}
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
				alert(text);
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
						console.log(result);
						result = result[0];
						console.log(result);
						result = result.replace("(","");
						console.log(result);
						result = result.replace(")","");
						console.log(result);
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
						console.log(result);
						result = result[0];
						console.log(result);
						result = result.replace("(","");
						console.log(result);
						result = result.replace(")","");
						console.log(result);
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
	search["start_time"]=$('#left_flat .qf_time').value();
	search["end_time"]=$('#left_flat .dd_time').value();

	return search;

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
