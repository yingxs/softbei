
$(function(){

var now_time = new Date();
//alert(now_time);

var year = now_time.getFullYear();
var month = now_time.getMonth()+1;
var day = now_time.getDate();
var week = now_time.getDay();




var month_now = new Date( 5+'/'+1+'/'+2018);
var month_prev = new Date( 4+'/'+1+'/'+2018);


var now_h = $('#date_calendar .month_now h5');
var prev_h = $('#date_calendar .month_prev h5');

var now_month_table = $('#date_calendar .month_now table').ge(0);
var prev_month_table = $('#date_calendar .month_prev table').ge(0);

show_month(month_now,now_month_table,now_h,now_time);
show_month(month_prev,prev_month_table,prev_h,now_time);

});



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
							$(table.tBodies[0].rows[i].cells[j]).html(k++);
						}
					}

				}
			}else{
				for(j=0;j<7;j++){
					if(k<=day_all){
						if(k==day && show_now){
							$(table.tBodies[0].rows[i].cells[j]).html(k++).addClass('now');
						}else{
							$(table.tBodies[0].rows[i].cells[j]).html(k++);
						}
					}
				}
			}
		}

	})();
}



function showTime(time){
	var str = time.getFullYear();
	 str += "-"+ (parseInt(time.getMonth())+1);
	 str += "-"+time.getDate();

	return str;
}