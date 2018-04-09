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
		
		//MAXIMIZED
		$('.maxbtn').click(function(){
			$(this).parent().parent().toggleClass("maximized");
		});
		
		//CLOSE
		$('.xbtn').click(function(){
			$(this).parent().parent().remove();
		});
