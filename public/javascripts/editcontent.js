(function($){

	//////////////
	// UPDATE ///
	/////////////

    $.fn.classes = function (callback) {
        var classes = [];
        $.each(this, function (i, v) {
            var splitClassName = v.className.split(/\s+/);
            for (var j in splitClassName) {
                var className = splitClassName[j];
                if (-1 === classes.indexOf(className)) {
                    classes.push(className);
                }
            }
        });
        if ('function' === typeof callback) {
            for (var i in classes) {
                callback(classes[i]);
            }
        }
        return classes;
    };

	$('.fa-pencil').on("click", function(e){
		var toEdit = $(this).classes()[0];
		var string = $(this).classes()[1];
		var original = $('#' + toEdit).text();
		var number = $(this).parent().parent().classes()[0];
		var html = "";

		if(string.substring(0,5) == "image"){
				html += '<form id="upload" enctype="multipart/form-data" action="/api/upload/image/'+number+'/'+string+'" method="post">'
				html +=	'<input type="file" name="fileupload" />'
				html += '<input type="submit" value="Update Image" name="submit" /></form>'
			}
		else{
			html = '<form action="/api/update/content' + number +'/' + string + '" method="post">';
			html += '<textarea rows="4" cols="100" name="'+string+'">' + original + "</textarea>";
			html += '<input type="submit" value="Edit"></form>'
		}
		$('#' + toEdit).html(html);
	});





	///////////////
	// CONTENT 1 //
	///////////////

	$.get("/api/content1", function(data){
		$('#firsttitle').html(data[0].title);
		$('#firstsubtitle1').html(data[0].subtitle1);
		$('#firstsubtitle2').html(data[0].subtitle2);
		$('#firstcontent1').html(data[0].content1);
		$('#firstcontent2').html(data[0].content2);
		$('#firstimage1').html(data[0].image1);
		$('#firstimage2').html(data[0].image2);
	})

	////////////////
	// CONTENT 2 //
	///////////////

	$.get("/api/content2", function(data){
		$('#secondtitle').html(data[0].title);
		$('#secondsubtitle1').html(data[0].subtitle);
		$('#secondcontent1').html(data[0].content);
		$('#secondimage1').html(data[0].image);
	})

})(jQuery);