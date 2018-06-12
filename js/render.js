


function getLine_xy(qf,dd){
	var width =$('svg').attr("width") ;
	var height = $('svg').attr("height") ;
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
	var bezier_x = (RandomNum(xp,xq))*(1),
		bezier_y = (k1*bezier_x+b1)*(1);

	var k2 = -1/k1;
	var b2 = bezier_y - k2*bezier_x;




	//计算坐标系中两点之间的距离
	var l = Math.sqrt(((x1-x2)*(x1-x2)) +((y1-y2)*(y1-y2)));





	//控制点投影坐标距离控制点距离
	var bezier_cl = RandomNum(80,200)  ;
	if(l<80){
		bezier_cl = RandomNum(10,20)  ;
	}





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
		 [l]                    //两地间距离
	 ];



	//return ["M " + projection(qf)[0]+","+projection(qf)[1]+" Q "+cx+","+cy+projection(dd)[0]+","+projection(dd)[1]];
}


function getLine_xyPlus(qf,dd){
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



	var str = "M "+x1+","+y1+" Q "+xm+","+ym+" "+right_x+","+ym+"M "+left_x+","+ym+"Q "+xn+","+yn+" "+x2+","+y2;

	return [ str,
		[xm,ym],            //右曲线控制点
		[right_x,right_y],  //右边界坐标
		[left_x,left_y],     //左边界坐标
		[xn,yn],             //左曲线控制点
	];


}








function RandomNum(Min, Max) {
	if(Min>Max){
		var temp = Min;
			Min = Max;
			Max = temp;
	}else if(Min == Max){
		console.log("Min==Max");
	}
	var Range = Max - Min;
	var Rand = Math.random();
	if(Math.round(Rand * Range)==0){
		return Min + 1;
	}else if(Math.round(Rand * Max)==Max)
	{
		//index++;
		return Max - 1;
	}else{
		var num = Min + Math.round(Rand * Range) - 1;
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


function svgToMatch(y){
	var height = $('svg').attr("height");
	return height-y;


}


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



