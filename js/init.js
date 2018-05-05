
$(function(){
	alert('DOM加载完成');
	//初始化显示地图
	init();

	$('')
});


function init(){
	var url = 'http://webapi.amap.com/maps?v=1.4.6&key=7a62597821fd492a53bc6b4e81f50ece&callback=onApiLoaded';
	var jsapi = document.createElement('script');
	jsapi.charset = 'utf-8';
	jsapi.src = url;
	document.head.appendChild(jsapi);

}

function onApiLoaded(){
	var map = new AMap.Map('map', {
		center: [117.000923, 36.675807],
		zoom: 2,
	});

//        添加控制按钮
//        map.plugin(["AMap.ToolBar"], function() {
//            map.addControl(new AMap.ToolBar());
//        });

	map.on('complete', function() {
		alert('地图加载完成');
		$('#map').animate({
			attr:'o',
			target:100,
			step:10,
			t:10
		});

//        document.getElementById('tip').innerHTML = "地图图块加载完毕！当前地图中心点为：" + map.getCenter();
	});


}




















