
$(function(){

var now_time = new Date();
//alert(now_time);

var year = now_time.getFullYear();
var month = now_time.getMonth()+1;
var day = now_time.getDate();
var week = now_time.getDay();
var month_prev = new Date( (month-1)+'/'+2+'/'+year);


$('#date_calendar .month_now h5').html(year+'年'+month+'月');
var prev_moth = $('#date_calendar .month_now table').ge(0);

	//alert(prev_moth.tBodies[0].rows.length);
$(prev_moth.tBodies[0].rows[0].cells[0]).css('border','1px solid red');


$('#date_calendar .month_prev h5').html(year+'年'+(month-1)+'月');







//alert( showTime(month_prev));
//alert( month_prev.getDay());


});















function showTime(time){
	var str = time.getFullYear();
	 str += "-"+ (parseInt(time.getMonth())+1);
	 str += "-"+time.getDate();

	return str;
}