$('.frame').mousedown(function(){
			$(".active").removeClass("active");
			$(this).addClass("active");
		});
		$('.frame').not(".maximized").resizable({
			alsoResize: ".active .content",
			minWidth: 200,
			minHeight: 59
		}).draggable({
			handle: ".topbar"
		});
		
		//COLOR CHANGNG
		$('.swatches span').click(function(){
			var color = $(this).attr("class");
			$(this).parent().parent().attr("class", "topbar").addClass(color);
		});
		
		//MAXIMIZED
		$('.maxbtn').click(function(){
			$(this).parent().parent().toggleClass("maximized");
		});
		
		//CLOSE
		$('.xbtn').click(function(){
			$(this).parent().parent().remove();
		});