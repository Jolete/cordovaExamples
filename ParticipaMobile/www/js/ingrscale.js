(function(){
	var app_width = 320;			// Change this as needed.
	var app_height = 480;			// Change this as needed.
	
	var ingrscale = {
			app_scale:{},
			setAppScaling:function ()
			{				
				var width = screen.width;
				var height =  screen.height;
				var scale = 1.0;
				var densityDPI = "";
				
				//scale = Math.round((width / app_width) * 100) / 100;
				ingrscale.app_scale = scale;

				console.log("App Scaling: " + scale + " (screen-width: " + width + " )");

				var metatags = document.getElementsByTagName('meta');
				
				//if(width > app_width)
				//	densityDPI = ", target-densityDpi=device-dpi";
				
				var i = 0;
				for(; i < metatags.length; i++) { 
				   if(metatags[i].getAttribute('name') == 'viewport'){
					   metatags[i].setAttribute('content','width=device-width, initial-scale=' + scale + ', minimum-scale=' + scale + ', maximum-scale=' + scale + densityDPI);
				   }
				}
			}
	}
	window.ingrscale = ingrscale;	
})();