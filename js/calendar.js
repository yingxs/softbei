
$(function(){

	var now_time = new Date();
	////var month_now = new Date( 1+'/'+1+'/'+2018);
	////var month_prev = new Date( 4+'/'+1+'/'+2018);

	var month_now = getMonth_now(now_time);
	var month_prev = getMonth_prev(now_time);
	//alert(showTime(getMonth_now(month_now)));
	//alert(showTime(getMonth_prev(month_now)));
	var now_h = $('#date_calendar .month_now h5');
	var prev_h = $('#date_calendar .month_prev h5');

	var now_month_table = $('#date_calendar .month_now table').ge(0);
	var prev_month_table = $('#date_calendar .month_prev table').ge(0);

	show_month(month_now,now_month_table,now_h,now_time);
	show_month(month_prev,prev_month_table,prev_h,now_time);
	$('#date_calendar .calendar_prev').click(function(){
		month_now = calendar_prev(month_now);
	});
	$('#date_calendar .calendar_next').click(function(){
		month_now = calendar_next(month_now);
	});



});





//下一张日历
function calendar_next(now_month){
	var time1 = getMonth_next(now_month);
	var time2 = getMonth_next(time1);
	if( parseInt($('#date_calendar #calendar_plus').css('left')) ==0){
		var now_month_table = $('#date_calendar #calendar_note .month_now table').ge(0);
		var prev_month_table = $('#date_calendar #calendar_note .month_prev table').ge(0);
		var now_h = $('#date_calendar #calendar_note .month_now h5');
		var prev_h = $('#date_calendar #calendar_note .month_prev h5');
		var now_time = new Date();
		show_month(time1,prev_month_table,prev_h,now_time);
		show_month(time2,now_month_table,now_h,now_time);
		$('#date_calendar #calendar_note').animate({
			attr:'x',
			target:0,
			t:30,
			step:10,
			fn:function(){
				$('#date_calendar #calendar_plus').css('left','550px').css('z-index','1');
				$('#date_calendar #calendar_note').css('z-index','0');
			}
		});

	}else{
		var now_month_table = $('#date_calendar #calendar_plus .month_now table').ge(0);
		var prev_month_table = $('#date_calendar #calendar_plus .month_prev table').ge(0);
		var now_h = $('#date_calendar #calendar_plus .month_now h5');
		var prev_h = $('#date_calendar #calendar_plus .month_prev h5');
		var now_time = new Date();
		show_month(time1,prev_month_table,prev_h,now_time);
		show_month(time2,now_month_table,now_h,now_time);
		$('#date_calendar #calendar_plus').animate({
			attr:'x',
			target:0,
			t:30,
			step:10,
			fn:function(){
				$('#date_calendar #calendar_note').css('left','550px').css('z-index','1');
				$('#date_calendar #calendar_plus').css('z-index','0');
			}
		});
	}




	return time2;
}

//上一张日历
function calendar_prev(now_month){
	var time1 = getMonth_prev(now_month);//4
	var time2 = getMonth_prev(time1);    //3
	var time3 = getMonth_prev(time2);    //2

	if( parseInt($('#date_calendar #calendar_plus').css('left')) ==0){
		var now_month_table = $('#date_calendar #calendar_note .month_now table').ge(0);
		var prev_month_table = $('#date_calendar #calendar_note .month_prev table').ge(0);
		var now_h = $('#date_calendar #calendar_note .month_now h5');
		var prev_h = $('#date_calendar #calendar_note .month_prev h5');
		var now_time = new Date();
		show_month(time3,prev_month_table,prev_h,now_time);
		show_month(time2,now_month_table,now_h,now_time);
		$('#date_calendar #calendar_note').animate({
			attr:'x',
			target:0,
			t:30,
			step:10,
			fn:function(){
				$('#date_calendar #calendar_plus').css('left','550px').css('z-index','1');
				$('#date_calendar #calendar_note').css('z-index','0');
			}
		}).css('left','-550px');

	}else{
		var now_month_table = $('#date_calendar #calendar_plus .month_now table').ge(0);
		var prev_month_table = $('#date_calendar #calendar_plus .month_prev table').ge(0);
		var now_h = $('#date_calendar #calendar_plus .month_now h5');
		var prev_h = $('#date_calendar #calendar_plus .month_prev h5');
		var now_time = new Date();
		show_month(time3,prev_month_table,prev_h,now_time);
		show_month(time2,now_month_table,now_h,now_time);
		$('#date_calendar #calendar_plus').animate({
			attr:'x',
			target:0,
			t:30,
			step:10,
			fn:function(){
				$('#date_calendar #calendar_note').css('left','550px').css('z-index','1');
				$('#date_calendar #calendar_plus').css('z-index','0');
			}
		}).css('left','-550px');


	}



	return time2;
}





//获得本月一号的时间对象
function getMonth_now(time){
	var year = time.getFullYear();
	var month = time.getMonth()+1;
	return new Date( month+'/'+1+'/'+year);
}
//获得上月一号的时间对象
function getMonth_prev(time){
	var year = time.getFullYear();
	var month = time.getMonth()+1;
	if(month==1){
		year--;
		month=12;
	}else{
		month--;
	}

	return new Date( month+'/'+1+'/'+year);

}

//获得下月一号的时间对象
function getMonth_next(time){
	var year = time.getFullYear();
	var month = time.getMonth()+1;
	if(month==12){
		year++;
		month=1;
	}else{
		month++;
	}

	return new Date( month+'/'+1+'/'+year);

}

//在表格中写入日历
function show_month(time,table,h,now){

	//alert(now+":"+!now);
	var year = time.getFullYear();
	var month = time.getMonth()+1;
	var _year = now.getFullYear();
	var _month = now.getMonth()+1;
	var day = now.getDate();
	var show_now = false;
	if(year==_year && month==_month){
		show_now = true;
	}
	//alert(show_now);
	var week = time.getDay();
	var flag=false;
	if((year%4==0 && year%100!=0)||year%400==0 ){
		flag=true;
	}

	var big_month=[1,3,5,7,8,10,12];
	var small_month=[4,6,9,11];
	h.html(year+'年'+month+'月');

	(function(){
		for(var i=1;i<7;i++){
			for(var j=0;j<7;j++){
				$(table.tBodies[0].rows[i].cells[j]).html("").removeClass("now");
			}
		}
	})();

	(function(){
		var i, j,k= 1,day_all;
		if(big_month.indexOf(month)!=-1){
			day_all=31;
		}else if(month==2 && flag){
			day_all=29;
		}else if(month==2 && !flag){
			day_all=28;
		}else if(small_month.indexOf(month)!=-1){
			day_all=30;
		}
		//alert('month:'+month+",day:"+day_all);
		for(i=1;i<7;i++){
			if(i==1){
				for(j=week;j<7;j++){
					if(k<=day_all ){
						if(k==day && show_now ){
							$(table.tBodies[0].rows[i].cells[j]).html(k++).addClass('now');
						}else{
							$(table.tBodies[0].rows[i].cells[j]).html(k++).attr('lang','wh');
						}
					}

				}
			}else{
				for(j=0;j<7;j++){
					if(k<=day_all){
						if(k==day && show_now){
							$(table.tBodies[0].rows[i].cells[j]).html(k++).addClass('now');
						}else{
							$(table.tBodies[0].rows[i].cells[j]).html(k++).attr('lang','wh');
						}
					}
				}
			}
		}

	})();





}

//格式化显示日期，测试用
function showTime(time){
	var str = time.getFullYear();
	str += "-"+ (parseInt(time.getMonth())+1);
	str += "-"+time.getDate();

	alert(str) ;
}
