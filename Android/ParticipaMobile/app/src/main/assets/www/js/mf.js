(function(){
	var mf = {
		page:
		{
			current:'splash',
			show:function(n,o)
			{
				mf.page.current = n;
				$('#maincontainer').fadeOut(100,
					function(){
						$('#maincontainer').load('pages/' + n + '.html',
							function () {
								$('#maincontainer').fadeIn(200,
									function()
									{
										/*setTimeout(function()
										{
											if($('#maincontainer').html() == '')
												mf.page.show(n,o);
										},50);*/
										
										if(DEBUG_MODE)console.log('page.show: ' + n);
										window[n + 'Init'](o);
									}
								);
							},'html'
						);
					}
				);
			}

		},
		loader:
		{
			show:function(txt,o)
			{
				if(typeof(txt) == 'undefined' && txt == null)
					txt = '';
				
				if(typeof(o) != 'undefined' && typeof(o.bgColor) != 'undefined')
				{
					$('.loader').css('background',o.bgColor);
				}
							

				var marginLeftLoader = ($('#content_area').width() / 2) - 110;
				var marginTopLoader = ($('#content_area').height() / 2) - 50;
				$('.loader').css('left',marginLeftLoader + 'px');
				$('.loader').css('top',marginTopLoader + 'px');

					
				$('#loaderText').html(txt);
				$('.disableDiv').show(0);	
			},
			hide:function()
			{
				$('#loaderText').html('');
				$('.disableDiv').hide(0);		
			}
		},
		extend:function(o){
			for(var i in o){
				mf[i] = o[i];
			}
		},
		preload:function(obj)
		{
			switch(typeof(obj))
			{
				case 'object':
					for(var i in obj)
					{
						_preload(obj[i]);
					}
					break;
				case 'string':
					_preload(obj);
					break;
				default:
					console.log(typeof(obj));
					break;
				
			}
			
			function _preload(path)
			{
				var img = new Image();
				img.src = path;
			}
		},
		gps:
        {
            get:function(sCB,eCB)
            {
                navigator.geolocation.getCurrentPosition(sCB,eCB,{enableHighAccuracy:true,maximumAge:1000,timeout:1000});
            },
            watch:function(sCB,eCB,interval)
            {
                var watchId = navigator.geolocation.watchPosition(sCB,eCB,{enableHighAccuracy:true,maximumAge:interval-1,timeout:1000,frequency:interval});
            	return watchId;
            },
            stop:function()
            {
                navigator.geolocation.stop();
            }
        
        },
		
		
	
	}
	window.mf =  mf;
})();