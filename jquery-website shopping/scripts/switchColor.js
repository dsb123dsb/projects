/*衣服颜色切换*/
$(function(){
	$(".color_change ul li img").click(function(){           
		  var imgSrc = $(this).attr("src");
		  var i = imgSrc.lastIndexOf(".");
		  var unit = imgSrc.substring(i);
		  imgSrc = imgSrc.substring(0,i);
		  var imgSrc_small = imgSrc + "_one_small"+ unit;
		  var imgSrc_big = imgSrc + "_one_big"+ unit;
		  $("#smallImg").attr({"src": imgSrc_small  });
		  $("#bigImg").attr({"src": imgSrc_big  });
		  $('div.jqzoom').zoom(
			  	{on:'mouseover'}
			  );//需要从新加载放大效果
		  $("#thickImg").attr("href", imgSrc_big);
		  var alt = $(this).attr("alt");
		  $(".color_change strong").text(alt);
		  var newImgSrc=imgSrc.replace("images/pro_img/","");
		  $("#jnProitem .imgList li").hide();
		  $("#jnProitem ul.imgList").find('.imgList_' + newImgSrc).show();
				
	});
});