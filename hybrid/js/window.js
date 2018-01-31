
$('.window').mousedown(function(){
			$(".active").removeClass("active").removeClass("ui-resizable").removeClass("ui-draggable");
			$(this).addClass("active").addClass("ui-resizable").addClass("ui-draggable");
		});
		$('.window').not(".maximized").resizable({
			alsoResize: ".active .content",
			minWidth: 200,
			minHeight: 59,
			maxHeight:$("#windowSpace").height(),
			maxWidth:$("#windowSpace").width()
		}).draggable({
			handle: ".topbar",
			containment: "#windowSpace"
		});
	
		//MAXIMIZED
		$('.maxbtn').click(function(){
			$(this).parent().parent().toggleClass("maximized");
		});
		
		//CLOSE
		$('.xbtn').click(function(){
			$(this).parent().parent().remove();
});
