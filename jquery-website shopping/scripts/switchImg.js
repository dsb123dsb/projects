/*点击左侧产品小图片切换大图*/
$(function(){
	$("#jnProitem ul li img").bind("click",function(){ 
		  var imgSrc = $(this).attr("src");
		  var i = imgSrc.lastIndexOf(".");
		  var unit = imgSrc.substring(i);
		  imgSrc = imgSrc.substring(0,i);
		  var imgSrc_small = imgSrc + "_small"+ unit;
		  var imgSrc_big = imgSrc + "_big"+ unit;
		  $("#smallImg").attr({"src": imgSrc_small});
		  $("#bigImg").attr({"src": imgSrc_big  });
		  $('div.jqzoom').zoom(
			  	{on:'mouseover'}
			  );//需要从新加载放大效果
		  $("#thickImg").attr("href", imgSrc_big);
	});
});