(function($){

	///////////////
	// CONTENT 1 //
	///////////////

	$.get("/api/content1", function(data){
		$('#firsttitle').html(data[0].title);
		$('#firstsubtitle1').html(data[0].subtitle1);
		$('#firstsubtitle2').html(data[0].subtitle2);
		$('#firstcontent1').html(data[0].content1);
		$('#firstcontent2').html(data[0].content2);
		$('#firstimage1').css("background", "url("+data[0].image1+') no-repeat');
		$('#firstimage1').css("background-size", 'cover');
		$('#firstimage2').css("background", "url("+data[0].image2+') no-repeat');
		$('#firstimage2').css("background-size", 'cover');
	})

	////////////////
	// CONTENT 2 //
	///////////////

	$.get("/api/content2", function(data){
		$('#secondtitle').html(data[0].title);
		$('#secondsubtitle1').html(data[0].subtitle);
		$('#secondcontent1').html(data[0].content);
		$('#secondimage1').html("<img src='"+data[0].image+"' height='70%' width='60%'/>");
	})

})(jQuery);