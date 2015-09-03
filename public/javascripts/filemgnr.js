(function($){

	$(".filemanager").on("click",'.trash', function(e){
		var file = $(this).get(0).id;
		var confirm = window.confirm('Are you sure you want to delete ' + file + ' ?');
		if(confirm == true){

			file = '/api/filedeletion/' + file;

			$.ajax({
					type: 'POST',
					url: file ,
				})

			location.reload(true);

		}

		
	});
})(jQuery);

