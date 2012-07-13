(function($) {
	$.sheetbox = function(url,data,options) {
		$.sheetbox.defaultOptions = {
			layout: 'top',
			speed: 500,
			closeButton: false,
			closeOnSelfClick: true,
			closeOnSelfOver: false,
			force: false,
			onShow: false,
			onShown: false,
			onClose: false,
			onClosed: false,
			buttons: false,
			modal: false,
			width: 300,
			height:300
	    };

        options = $.extend($.sheetbox.defaultOptions, options);

        $(".sheetbox_"+options.layout).remove();
        var template = $('<div class="sheetbox" style="position:fixed;"></div>');
        $(template).addClass('sheetbox_'+ options.layout);
        $("body").append($(template));

        if(options.layout == 'top'){
            $(template).css("top",(0-options.height)+"px");
            $(template).css("left","0px");
            $(template).css("height",options.height+"px");
            $(template).css("width","100%");
            $(template).animate({top:0},options.speed);
        }else if(options.layout == 'bottom'){
            $(template).css("bottom",(0-options.height)+"px");
            $(template).css("left","0px");
            $(template).css("height",options.height+"px");
            $(template).css("width","100%");
            $(template).animate({bottom:0},options.speed);
        }if(options.layout == 'left'){
            $(template).css("left",(0-options.width)+"px");
            $(template).css("top","0px");
            $(template).css("height","100%");
            $(template).css("width",options.width+"px");
            $(template).animate({left:0},options.speed);
        }if(options.layout == 'right'){
            $(template).css("right",(0-options.width)+"px");
            $(template).css("top","0px");
            $(template).css("height","100%");
            $(template).css("width",options.width+"px");
            $(template).animate({right:0},options.speed);
        }
        
        var onShow = null;
        if(options.onShow)
        	onShow = options.onShow;

        var onShown = null;
        if(options.onShown)
        	onShown = options.onShown;

        $.post(url,data,function(data){
        	onShow();
            $(template).html(data);
	        if(options.layout == 'top'){
	            $(template).animate({top:0},options.speed,onShown);
	        }else if(options.layout == 'bottom'){
	            $(template).animate({bottom:0},options.speed,onShown);
	        }if(options.layout == 'left'){
	            $(template).animate({left:0},options.speed,onShown);
	        }if(options.layout == 'right'){
	            $(template).animate({right:0},options.speed,onShown);
	        }
        },'html');
	};

	$.sheetbox.close = function(layout) {
        $(".sheetbox_"+layout).animate({opacity:0,display:'none'},function(){$(this).remove();});
	};
})(jQuery);