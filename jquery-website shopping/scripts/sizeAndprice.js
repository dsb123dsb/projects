// 产品尺寸切换
$(function(){
	$(".pro_size li span").click(function(){
		$(this).addClass('cur').parent().siblings().children().removeClass('cur');
		$(this).parents("ul").siblings('strong').text($(this).text());
	});
});
/*数量和价格联动*/
$(function(){
    var $span = $("div.pro_price span");
	var price = $span.text();	
	$("#num_sort").change(function(){//元素值发生改变时触发事件
	    var num = $(this).val();
		var amount = num * price;
		$span.text( amount );
	}).change();
});