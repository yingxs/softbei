


function getLine_xy(qf,dd){
	var width =$('svg').attr("width") ;
	var height = $('svg').attr("height") ;
	var svg_left =parseInt(getStyle($('#left_bar').ge(0),"width")) ;
	var translate = [(width/2)-(svg_left/2)+(35/2),height/2];
	var screenscale = d3.scale.linear().domain([1360,1920]).range([212,300]);
	var sacle = screenscale(screen.width);
	//定义地图投影
	var projection = d3.geo.equirectangular().scale(sacle).translate(translate);
	//定义地理路径生成器
	var path = d3.geo.path().projection(projection);

	var x1 = projection(qf)[0],
		y1 = projection(qf)[1],
		x2 = projection(dd)[0],
		y2 = projection(dd)[1],
		//两个三等分点坐标
		x3 = (x2+2*x1)/ 3,
		y3 = (svgToMatch(y2)+2*svgToMatch(y1))/ 3,
		x4 = (2*x2+x1)/ 3,
		y4 = (2*svgToMatch(y2)+svgToMatch(y1))/ 3,

	    k1 = (svgToMatch(y1)-svgToMatch(y2))/(x1-x2),    //两地连线的直线斜率
	    b1 = svgToMatch(y1) - (k1*x1),


		//控制点投影坐标区间
		xm = x3,
		ym = x3*k1+b1,
		xn = x4,
		yn = x4*k1+b1;

	var xp = (xm+x1)/2;
	var yp = (ym+svgToMatch(y1))/2;
	var xq = (xn+x2)/2;
	var yq = (yn+svgToMatch(y2))/2;


	//贝瑟尔曲线控制点在两地连线上的投影坐标
	//var bezier_x = (RandomNum(xm,xn))*(1),
	//	bezier_y = (k1*bezier_x+b1)*(1);

	//console.log("x1,y1:",projection(qf)[0],projection(qf)[1]);
	//console.log("x2,y2:",projection(dd)[0],projection(dd)[1]);
	//console.log("k1,b1:",k1,b1);

	var bezier_x = RandomNum(xp,xq+1),
		bezier_y = (k1*bezier_x)+b1;
	//console.log("bezier_x,bezier_y:",bezier_x,matchToSvg(bezier_y) );


	var k2 = -1/k1;
	var b2 = bezier_y - k2*bezier_x;




	//计算坐标系中两点之间的距离
	var l = Math.sqrt(((x1-x2)*(x1-x2)) +((y1-y2)*(y1-y2)));



	var line_scale = d3.scale.linear()
		.domain([0,900])
		.range([5,300]);

	var ranNum = line_scale(l);

	var ranNum_x = ranNum-10;
	var ranNum_y = ranNum+10;

	var bezier_cl = RandomNum(ranNum_x,ranNum_y)  ;






	//控制点投影坐标距离控制点距离
	//var bezier_cl = RandomNum(80,200)  ;
	//if(l<80){
	//	bezier_cl = RandomNum(10,20)  ;
	//}
	//
	//if(l>80 && l<90){
	//	bezier_cl = RandomNum(20,30)  ;
	//}
    //
	//if(l>90 && l<150){
	//	bezier_cl = RandomNum(30,50)  ;
	//}
    //
	//if(l>150 && l<250){
	//	bezier_cl = RandomNum(50,80)  ;
	//}





	//var bezier_cl = RandomNum(10,20)  ;
	//console.log("k1:"+k1);
	//console.log("b1:"+b1);
	//console.log("k2:"+k2);
	//console.log("b2:"+b2);
	var cx,cy,cx1,cy1,cx2,cy2;
	//二次方程abc
	var fx_c = bezier_x*bezier_x + (b2 - bezier_y)*(b2 - bezier_y)- (bezier_cl*bezier_cl);
	var fx_a = (1 + k2*k2);
	var fx_b = (2*bezier_x - 2*k2*(b2 - bezier_y));

	var  tmp = Math.sqrt(fx_b*fx_b - 4*fx_a*fx_c);
	//console.log("tmp:"+tmp);
	//前后两个控制点
	cx1 = ( fx_b + tmp )/(2*fx_a);
	cy1 = k2*cx1 + b2;
	cx2 = ( fx_b - tmp)/(2*fx_a);
	cy2 = k2*cx2 + b2;

	//console.log("cx1:"+cx1+",cy1:"+cy1);
	//console.log("cx2:"+cx2+",cy2:"+cy2);
	//console.log("bezier_x:"+bezier_x+"bezier_x:"+bezier_y);
	//console.log("bezier_cl:"+bezier_cl);

	var zf = Math.random();
	//console.log("zf:"+zf);
	if(zf>0.4){
		cx = cx1;
		cy = cy1;
		//console.log("true");
	}else{
		cx = cx2;
		cy = cy2;
		//console.log("false");
	}



	 return  [ "M " + projection(qf)[0]+","+projection(qf)[1]+" Q "+cx+","+matchToSvg(cy)+" "+projection(dd)[0]+","+projection(dd)[1],
		 [projection(qf)[0],projection(qf)[1]],//起飞机场坐标
		 [projection(dd)[0],projection(dd)[1]],//目标机场坐标
		 [xm,matchToSvg(ym)],   //三等分点1 距离x1近
		 [xn,matchToSvg(yn)],   //三等分点2 距离x1近
		 [bezier_x,matchToSvg(bezier_y) ],//曲线控制点在机场连线上的映射
		 [cx,matchToSvg(cy)],    //曲线控制点坐标
		 [xp,matchToSvg(yp)],   //p1 距离x1近
		 [xq,matchToSvg(yq)],   //p2 距离x1近
		 [l],                    //两地间距离
		 [
			 [projection(qf)[0]-5,projection(qf)[1]-5],  // k1
			 [cx,matchToSvg(cy+5)],  // k2
			 [projection(dd)[0],projection(dd)[1]-5],  // k3
			 [projection(dd)[0],projection(dd)[1]+5],  // k4
			 [cx,matchToSvg(cy-5)],  // k5
			 [projection(qf)[0],projection(qf)[1]+5]  // k6
		 ],
		 "M "+
		 (projection(qf)[0]-5) +","+( projection(qf)[1]-5 )+         //k1
		 " Q "+
		 (cx+5) +","+matchToSvg(cy+5)+" "+                       //k2
		 (projection(dd)[0]-5) +","+(projection(dd)[1]-5)+" L" +  //k3
		 (projection(dd)[0]+5) +","+(projection(dd)[1]+5)+        //k4
		" Q "+
		 (cx-5)+","+matchToSvg(cy-5)+" "+                            //k5
		 (projection(qf)[0]+5) +","+(projection(qf)[1]+5)+" Z"
	 ];



	//return ["M " + projection(qf)[0]+","+projection(qf)[1]+" Q "+cx+","+cy+projection(dd)[0]+","+projection(dd)[1]];
}

function getLine_xy_plus(qf,dd){
	//alert(qf+","+dd);
	var width =$('svg').attr("width") ;
	var height = $('svg').attr("height") ;
	//alert(width);
	//alert(height);
	var svg_left =parseInt(getStyle($('#left_bar').ge(0),"width")) ;
	var translate = [(width/2)-(svg_left/2)+(35/2),height/2];
	//定义地图投影
	var projection = d3.geo.equirectangular().scale(240).translate(translate);
	//定义地理路径生成器
	var path = d3.geo.path().projection(projection);

	var x1 = projection(qf)[0],
		y1 = projection(qf)[1],
		x2 = projection(dd)[0],
		y2 = projection(dd)[1],
		right_x = projection([180,62.6])[0],
		right_y = projection([180,62.6])[1],
		left_x = projection([-180,62.6])[0],
		left_y = projection([-180,62.6])[1];

	var xm = (x1+parseInt(right_x))/2,

		ym = y1-RandomNum(70, 120),
		xn = x2/2,
		yn = ym;


	//alert(x1);
	//alert(width);
	//alert(x1+parseInt(width));
	//alert(xm);
	var k1_x=right_x,
		k1_y=ym- 5,

		k2_x=xm-5,
		k2_y=ym-5,

		k3_x=x1-5,
		k3_y=y1,
		k4_x=x1+5,
		k4_y=y1+5,

		k5_x=xm,
		k5_y=ym+5,

		k6_x=right_x,
		k6_y=ym+ 5,

		k7_x = left_x,
		k7_y = yn-5,

		k8_x = xn+5,
		k8_y = yn-5,

		k9_x = x2+5,
		k9_y = y2-5,
		k10_x = x2-5,
		k10_y = y2+5,

		k11_x = xn,
		k11_y = yn+5,

		k12_x = left_x,
		k12_y = yn+5;



	var str = "M "+x1+","+y1+" Q "+xm+","+ym+" "+right_x+","+ym+"M "+left_x+","+ym+"Q "+xn+","+yn+" "+x2+","+y2;

	return [ str,
		[xm,ym],            //右曲线控制点
		[right_x,right_y],  //右边界坐标
		[left_x,left_y],     //左边界坐标
		[xn,yn],             //左曲线控制点
		[
			[k1_x,k1_y], //k1
			[k2_x,k2_y],    //k2
			[k3_x,k3_y],//k3
			[k4_x,k4_y],//k4
			[k5_x,k5_y],//k5
			[k6_x,k6_y],//k6
			[k7_x,k7_y],//k6
			[k8_x,k8_y],//k6
			[k9_x,k9_y],//k6
			[k10_x,k10_y],//k6
			[k11_x,k11_y],//k6
			[k12_x,k12_y]//k6
		],
		" M "+k1_x+","+k1_y+" Q "+k2_x+","+k2_y+ " "+k3_x+","+k3_y+" L "+k4_x+","+k4_y+" Q "+k5_x+","+k5_y+" "+k6_x+","+k6_y+
		" M "+k7_x+","+k7_y+" Q "+k8_x+","+k8_y+ " "+k9_x+","+k9_y+" L "+k10_x+","+k10_y+" Q "+k11_x+","+k11_y+" "+k12_x+","+k12_y

	];


}

function RandomNum(Min, Max) {
	if(Min>Max){
		var temp = Min;
		Min = Max;
		Max = temp;
	}else if(Min == Max){
		Max+=2;
		console.log(Min,Max);
	}

	if(Max-Min<1){
		while(true){
			var x_num = Min+Math.random();
			if(x_num<Max){
				return x_num;
			}
		}

	}

	var Range = Max - Min;
	var Rand = Math.random();
	if((Rand * Range)==0){
		return Min + 1;
	}else if((Rand * Max)==Max)
	{
		index++;
		return Max - 1;
	}else{
		var num = Min + (Rand * Range) - 1;
		return num;
	}
}
function getZF(){
	var zf = Math.random();
	if(zf>0.4){
		return true;
	}else{
		return false;
	}
}


//svg坐标转换成数学中的坐标
function svgToMatch(y){
	var height = $('svg').attr("height");
	return height-y;
}

//数学中的坐标转换成svg的坐标
function matchToSvg(y){
	var height = $('svg').attr("height");
	return height-y;
}


function getPoint(bezier_x,bezier_y){
	// 求直线
	//var k = (560 - 556) / (439 - 1238);
	//var b = 560 - k*439;
	var k2 = (560 - 556) / (439 - 1238);
	var k = -1/k2;
	var b = bezier_y - k*bezier_x;

	//列方程
	var x1,y1,x2,y2;
	var c = bezier_x*bezier_x + (b - bezier_y)*(b- bezier_y) -10*10;
	var a = (1 + k*k);
	var b1 = (2*bezier_x - 2*k*(b - bezier_y));

	var  tmp = Math.sqrt(b1*b1 - 4*a*c);
	x1 = ( b1 + tmp )/(2*a);
	y1 = k*x1 + b;
	x2 = ( b1 - tmp)/(2*a);
	y2 = k*x2 + b;

	console.log("x1:"+x1);
	console.log("y1:"+y1);
	console.log("x2:"+x2);
	console.log("y2:"+y2);


}

//绘制统计饼图
function change(width,height,data,clazz,clazz_len,h) {
	//init

	d3.select(clazz+" ."+clazz_len).remove();
	d3.select(clazz+" .rect_box").remove();
	d3.select(clazz+" h6.title").remove();

	var svg = d3.select(clazz)
		.append("svg")
		.attr("width",width)
		.attr("height",height)
		.classed(clazz_len,true)
		.append("g");

	if(h!="机型统计图"){
		d3.select(clazz).append("div").classed("rect_box",true);
		d3.select(clazz+" .rect_box").append("span").classed("rect",true).classed("yw",true)
			.append("span").classed("yw_text text",true).text("延误率");
		d3.select(clazz+" .rect_box").append("span").classed("rect",true).classed("tq",true)
			.append("span").classed("tq_text text",true).text("提前率");
		d3.select(clazz+" .rect_box").append("span").classed("rect",true).classed("zd",true)
			.append("span").classed("zd_text text",true).text("准点率");
	}

	d3.select(clazz).append("h6").classed("title",true).text(h);

	svg.append("g")
		.attr("class", "slices");
	svg.append("g")
		.attr("class", "labels");
	svg.append("g")
		.attr("class", "lines");

	var radius = Math.min(width, height) / 2;

	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) {
			return d.value;
		});

	var arc = d3.svg.arc()
		.outerRadius(radius * 0.7)
		.innerRadius(radius * 0.4);

	var outerArc = d3.svg.arc()
		.innerRadius(radius * 0.8)
		.outerRadius(radius * 0.8);


	svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	var key = function(d){ return d.data.label; };

	var color = d3.scale.ordinal()
		.domain(["延误率", "准时率", "提前率"])
		.range(["#f79851", "#419641", "#00AFEF"]);



	/* ------- PIE SLICES -------*/
	var slice = svg.select(".slices").selectAll("path.slice")
		.data(pie(data), key);

	//enter
	slice.enter()
		.insert("path")
		.style("fill", function(d) { return color(d.data.label); })
		.attr("class", "slice");

	slice.transition().duration(1000)
		.attrTween("d", function(d) {
			var currentArc = this.__current__; // <-C
			//console.log("this",this.__current__);

			if (!currentArc)
				currentArc = {startAngle: 0,
					endAngle: 0};

			var interpolate = d3.interpolate(
				currentArc, d);

			this.__current__ = interpolate(1);//<-D

			return function (t) {
				return arc(interpolate(t));
			};
		});

	//exit
	slice.exit()
		.remove();

	/* ------- TEXT LABELS -------*/

	var text = svg.select(".labels").selectAll("text")
		.data(pie(data), key);

	//text.enter()
	//	.append("text")
	//	.attr("dy", ".35em")
	//	.text(function(d) {
	//		return d.data.label;
	//	});

	var left ;
		text.enter()
		.append("text")
		.attr("dy", ".35em")
		.text(function (d) {
			if(d.data.value!=0){
				if(h=="机型统计图"){
					return d.data.label+"-"+(d.data.value*100).toFixed(2)+"%";
				}else{
					return (d.data.value*100).toFixed(2)+"%";
				}

			}

		}).style("animation","text_opacitytoone 1.2s ease forwards");

	function midAngle(d){
		return d.startAngle + (d.endAngle - d.startAngle)/2;
	}

	text.transition().duration(1000)
		.attrTween("transform", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
//			console.log("d",d);
//			console.log("this._current",this._current);
//			console.log("interpolate",interpolate);
			return function(t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
				if(d.data.id==3 || d.data.id==1){
					pos[1]=pos[1]-10;
				}
				return "translate("+ pos +")";
			};
		})
		.styleTween("text-anchor", function(d){
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				return midAngle(d2) < Math.PI ? "start":"end";
			};
		});

	text.exit()
		.remove();

	/* ------- SLICE TO TEXT POLYLINES -------*/

	var polyline = svg.select(".lines").selectAll("polyline")
		.data(pie(data), key);

	polyline.enter()
		.append("polyline");

	polyline.transition().duration(1000)
		.attrTween("points", function(d){
			console.log(d);
			if(d.data.value==0){
				return ;
			}
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);

			return function(t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);

				//console.log(d.data.value+":",arc.centroid(d2),outerArc.centroid(d2),pos);
				var p2 = outerArc.centroid(d2);

				//p2[1]=p2[1]-20;
				//
				//pos[1]=pos[1]-20;

				//return [arc.centroid(d2), outerArc.centroid(d2), pos];
				//console.log(d.data.id,p2);
				if(d.data.id==3 || d.data.id==1){
					p2[1]=p2[1]-10;
					pos[1]=pos[1]-10;

				}


				return [arc.centroid(d2), p2, pos];



			};
		});

	polyline.style("animation","line_opacitytoone 1.2s ease forwards");

	polyline.exit()
		.remove();
}

//绘制城市坐标点
function render_city(){

	var width =$('svg').attr("width") ;
	var height = $('svg').attr("height") ;
	var svg_left =parseInt(getStyle($('#left_bar').ge(0),"width")) ;
	var translate = [(width/2)-(svg_left/2)+(35/2),height/2];
	var screenscale = d3.scale.linear().domain([1360,1920]).range([212,300]);
	var sacle = screenscale(screen.width);
	//定义地图投影
	var projection = d3.geo.equirectangular().scale(sacle).translate(translate);

	ajax({
		method:'get',
		url:"/index.php?c=index&a=search_city",
		success : function(text){
			var temp = JSON.parse(text);
			//console.log(typeof temp);
			var num= 0, clazz_num,point;
			d3.select("#map svg g").append("g").classed("g_city",true);
			d3.select("#map svg g").append("g").classed("g_city_text",true);
			temp.forEach(function(obj){
				//console.log(obj.qf_city,obj.qf_longitude,obj.qf_latitude);
				point = projection([obj.qf_latitude,obj.qf_longitude]);

				d3.select("#map svg g g.g_city").append("circle").classed("city"+num,true)
					.attr("cx",point[0])
					.attr("cy",point[1])
					.attr("r",2)
					.on("mouseenter",function(){
						clazz_num = d3.select(this).attr("class").replace("city","");
						d3.select("#map svg g g.g_city_text .city_text_"+clazz_num).style("display","block");

					}).on("mouseout",function(){
						clazz_num = d3.select(this).attr("class").replace("city","");
						d3.select("#map svg g g.g_city_text .city_text_"+clazz_num).style("display","none");

					}).on("click",function(){


						$("#city_info .chart_panel .city_chart .svg_content .loading").show();
						d3.select("#city_info .chart_panel .city_chart .svg_content svg").style("display","none");



						var num = d3.select(this).attr("class").replace("city","");
						//alert(d3.select("#map svg g g.g_city_text .city_text_"+num).text());
						$('#city_info').animate({
							t:20,
							step:10,
							mul:{
								r:0,
								o:90
							},
							fu:function(){

							}
						});

						$('#city_info .chart_panel .airport_chart').animate({
							t:30,
							step:10,
							mul:{
								o:0,
								y:20
							}
						});

						ajax({
							method:'get',
							url:"/index.php?c=index&a=city_info",
							data:{
								city:d3.select("#map svg g g.g_city_text .city_text_"+num).text()
							},
							success : function(text){
								var temp = JSON.parse(text);
								console.log(temp);
								$('#city_info .info_panel .city').html(temp.city);
								$('#city_info .info_panel .country span').html(temp.country);




								var str="";
								temp.airport_list.forEach(function(d){
									str += "<li>"+d+"</li>";
								});
								$('#city_info .info_panel .airport_list').html(str);
								render_chart("#city_info .chart_panel .city_chart .svg_content",300,300,55,temp.enter_num,temp.out_num);


							},
							error : function(text){
								alert("error"+text);
							},
							async:true
						});
					});
				d3.select("#map svg g g.g_city_text").append("text").classed("city_text_"+(num++),true).text(obj.qf_city).attr("transform","translate("+(point[0]-20)+","+(point[1]-5)+")").style("display","none").style("fill","#1da04f");
			});
		},
		error : function(text){
			alert("error"+text);
		},
		async:true
	});

}

//绘制条形统计图
function render_chart(content,width,height,rectPadding,enter_num,out_num){
	d3.select(content+" svg").remove();
	$(content).opacity(100);

	setTimeout(function(){

		//画布大小
		//var width = 200;
		//var height = 200;

		//在 body 里添加一个 SVG 画布
		var svg = d3.select(content)
			.append("svg")
			.attr("width", width)
			.attr("height", height);

		//画布周边的空白
		var padding = {left:30, right:30, top:20, bottom:20};

		//定义一个数组
		//    var dataset = [10, 20, 30, 40, 33, 24, 12, 5];
		var dataset = [out_num, enter_num];

		//x轴的比例尺
		var xScale = d3.scale.ordinal()
			.domain(d3.range(dataset.length))
			.rangeRoundBands([0, width - padding.left - padding.right]);

		console.log(d3.range(dataset.length));

		//x轴的比例尺
		//    var xScale = d3.scale.linear()
		//            .domain([0,3])
		//            .range([0,400]);

		var max = 0;
		if(enter_num > out_num){
			max = enter_num;
		}else{
			max = out_num;
		}
		//y轴的比例尺
		var yScale = d3.scale.linear()
			//.domain([0,(d3.max(dataset))+5])
			.domain([0,max+10])
			//.range([height - padding.top - padding.bottom, 0]);
			.range([height - padding.top - padding.bottom, 0]);

		//定义x轴
		var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient("bottom").tickFormat(function(v){
				if(v==0){
					return "出港";
				}else if(v==1){
					return "入港"
				}
			});


		//定义y轴
		var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("left");

		//矩形之间的空白
		//var rectPadding = 105;

		//添加矩形元素
		var rects = svg.selectAll(".MyRect")
			.data(dataset)
			.enter()
			.append("rect")
			.attr("class","MyRect")
			.attr("transform","translate(" + padding.left + "," + padding.top + ")")
			.attr("x", function(d,i){
				return xScale(i) + rectPadding/2;
			} )
			.attr("width", xScale.rangeBand() - rectPadding )
			.attr("y",function(d){
				var min = yScale.domain()[0];
				return yScale(min);
			})
			.attr("height", function(d){
				return 0;
			})
			.transition()
			.delay(function(d,i){
				return i * 200;
			})
			.duration(2000)
			.ease("bounce")
			.attr("y",function(d){
				return yScale(d);
			})
			.attr("height", function(d){
				return height - padding.top - padding.bottom - yScale(d);
			});


		//添加文字元素
		var texts = svg.selectAll(".MyText")
			.data(dataset)
			.enter()
			.append("text")
			.attr("class","MyText")
			.attr("transform","translate(" + padding.left + "," + (padding.top-25) + ")")
			.attr("x", function(d,i){
				return xScale(i) + rectPadding/2;
			} )
			.attr("dx",function(){
				return (xScale.rangeBand() - rectPadding)/2;
			})
			.attr("dy",function(d){
				return 20;
			})
			.text(function(d){
				return d;
			})
			.attr("y",function(d){
				var min = yScale.domain()[0];
				return yScale(min);
			})
			.transition()
			.delay(function(d,i){
				return i * 200;
			})
			.duration(2000)
			.ease("bounce")
			.attr("y",function(d){
				return yScale(d);
			});

		//添加x轴
		svg.append("g")
			.attr("class","axis")
			.attr("transform","translate(" + padding.left + "," + (height - padding.bottom) + ")")
			.call(xAxis);

		//添加y轴
		svg.append("g")
			.attr("class","axis")
			.attr("transform","translate(" + padding.left + "," + padding.top + ")")
			.call(yAxis);


		$(content+" .loading").hide();
		$(content+" svg").show().css("animation","text_opacitytoone 1.2s ease forwards");
	},500);






}
