
$(function(){
	//alert('DOM加载完成');
	//初始化显示地图
	//遮罩画布
	var screen = $('#screen');
	window.screen=screen;
	screen.lock().resize(function(){
		screen.lock();
	}).opacity(30);
	init(screen);
	load();

	function getScreen(){
		return screen;
	}

});


function init(){
	var url = 'http://webapi.amap.com/maps?v=1.4.6&key=7a62597821fd492a53bc6b4e81f50ece&callback=onApiLoaded';
	var jsapi = document.createElement('script');
	jsapi.charset = 'utf-8';
	jsapi.src = url;
	document.head.appendChild(jsapi);

}

function load(){

	//左边标志栏
	$('#left_bar .menu_ul li').hover(function(){
		$('#left_bar .diolg_ul li').eq($(this).index()).animate({
			t:30,
			step:10,
			mul:{
				x:10,
				o:100
			}
		});
	},function(){
		$('#left_bar .diolg_ul li').eq($(this).index()).animate({
			t:30,
			step:10,
			mul:{
				x:-150,
				o:0
			}
		});
	});

}

function onApiLoaded(){



	var map = new AMap.Map('map', {
		center: [117.000923, 36.675807],
		zoom: 2,
		mapStyle:'amap://styles/80e8a8b8a906b27a1fd674f29f31aabc'
	});

//        添加控制按钮
//        map.plugin(["AMap.ToolBar"], function() {
//            map.addControl(new AMap.ToolBar());
//        });

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




















