/*

  all.js -- Participa Mobile main file.

  Author:  Intergraph Denmark / Mikkel Pedersen 2012.
  
  The contents of this file cannot under any circumstances be reproduced, copied, shared or
  used in _anyway_ way without the accept of Intergrap Denmark.
  
  If this code is in your possession without the accept of Intergraph Denmark, please notify
  us with information about how it got in your possession, from where etc.
  
  By writing to: mikkel.pedersen@intergraph.com

*/

var heading = -1, p, online = false;
var root;
//var childbrowser;
var user_settings = {};
var default_council = {'id': '1', 'name':'Manresa'};
var default_language = {'name':'Espa–ol', 'code':'es-ES'};
var ma_init_data = {};
var last_downloaded_file = null;
var watchID;
var android_version;
var deviceToken = "";
var checkedVersion = false;
var checkedVersionValue = false;
var usingMyvr = true;
var pushNotification;
var gApp = new Array();

gApp.deviceready = false;
gApp.gcmregid = '';

var DEBUG_MODE = true;


// Disabling default behaviour for "touchmove":
function preventBehavior(e){ 
  e.preventDefault(); 
}

document.addEventListener("touchmove", preventBehavior, false);


function onBodyLoad(){
	document.addEventListener("deviceready",onDeviceReady,false);
}

function onBack(){
	if(mf.page.current == 'welcome')
		navigator.app.exitApp();
}

function onResume() {
	if(DEBUG_MODE) console.log("Resuming app");
	deleteDownloadedFile();
}

// Fired when device is ready:
function onDeviceReady(){
    if(DEBUG_MODE) console.log("Device Ready!");
    
    android_version = getAndroidMainVersion();
    
    if(DEBUG_MODE) console.log("Android version is: " + device.version + " main version: " + android_version);
    
    ingrscale.setAppScaling();
    
	document.addEventListener("online", setOnlineStatus, false);
	document.addEventListener("offline", setOnlineStatus, false);
	
	document.addEventListener("pause",function(){
		navigator.geolocation.clearWatch(watchID);
	},false);
			
	document.addEventListener("resume",function(){
		watchID = mf.gps.watch(function(pos){p = pos.coords;},function(){},1000);
	},false);
	
	document.addEventListener("backbutton", function(){
		onBack();
	}, false);
	
	document.addEventListener("resume", onResume, false);
	
	// For use with the childbrowser plugin:
	//root = this;
    //childbrowser = window.plugins.childBrowser;
	
	$(function(){
        $.ajaxSetup({
  			beforeSend: function(request){
				request.setRequestHeader("Accept-Encoding","gzip, deflate");
  			}
		});        
        
        // Disabled for testing:

        mf.gps.get(function(){},function()
        {
        	//navigator.notification.alert($c.maconf.lang.notifications.noGPS.text, function(){}, $c.maconf.lang.notifications.noGPS.title);
        });
        
        watchID = mf.gps.watch(function(pos){p = pos.coords;},function(){},1000);

		navigator.compass.getCurrentHeading(function(){}, function(){}, {});
		
		//resetSettings();	// For testing.
		
		mf.page.show('splash');
	});
	
	
	// Start Notifications
	try
    {
		gApp.DeviceReady = true;

		// Some Unique stuff here,
		// The first Parm is your Google email address that you were authorized to use GCM with
		// the Event Processing rountine (2nd parm) we pass in the String name
		// not a pointer to the routine, under the covers a JavaScript call is made so the name is used
		// to generate the function name to call. I didn't know how to call a JavaScript routine from Java
		// The last two parms are used by Cordova, they are the callback routines if the call is successful or fails
		//
		// CHANGE: your_app_id
		// TO: what ever your GCM authorized senderId is
		//
		window.plugins.GCM.register("592672981028", "GCM_Event", GCM_Success, GCM_Fail );    
    }
    catch (err)
    {
       txt = "There was an error on this page.\n\n";
       txt += "Error description: " + err.message + "\n\n";
       alert(txt);
    }	
	// End Notifications
}

function getAndroidMainVersion(){
	var version = device.version;
	var split = version.split('.');
		
	return split[0];
}


function setOnlineStatus()
{
	online = !online;
}

function accelerometerInit()
{

	var x =0, y=0, z=0
	
	var onSuccess = function(a)
	{
		if(x == parseFloat(a.x).toFixed(1)  && y == parseFloat(a.y).toFixed(1) && z == parseFloat(a.z).toFixed(1))
		{
			var compassSuccess = function(h)
			{
				navigator.accelerometer.clearWatch(wID);
				heading = h.trueHeading;
				
				if(Math.round(x) == 1)
				{

					heading = -90 + heading;
					if(heading < 0)
						heading = 360 + heading;					
				}
				else if(Math.round(x) == -1)
				{
					heading = heading + 90;
					if(heading > 359.99)
						heading = heading - 360;

				}
			};
			
			navigator.compass.getCurrentHeading(compassSuccess, function(){}, {});					
		}
		
		x = parseFloat(a.x).toFixed(1);
		y = parseFloat(a.y).toFixed(1);
		z = parseFloat(a.z).toFixed(1);
		
	
	};
	
	var onError = function()
	{};
	var wID = navigator.accelerometer.watchAcceleration(onSuccess,onError,{frequency:1000})
}


function disconnected(params)
{
	navigator.notification.alert($c.lang.notifications.noConnection.text, function(){mf.loader.hide();mf.page.show('front',{});}, $c.lang.notifications.noConnection.title);	
}


String.prototype.format = function() {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};


// To reset the app saved settings - Only for testing:
function resetSettings(){
	user_settings = null;
	saveSettings();
}

// Start Notifications

function GCM_Event(e)
{

  switch( e.event )
  {
	  case 'registered':
	    // the definition of the e variable is json return defined in GCMReceiver.java
	    // In my case on registered I have EVENT and REGID defined
	    gApp.gcmregid = e.regid;
	    if ( gApp.gcmregid.length > 0 )
	    {
	      	//alert("<li>REGISTERED -> REGID:" + e.regid + "</li>");
	
			// This is where you would code to send the REGID to your server for this device
	       	deviceToken = e.regid;
	       	//storeToken(e.regid);
	       	//getRole(e.regid);

	
	    }
	
	    break;
	
	  case 'message':
	    // the definition of the e variable is json return defined in GCMIntentService.java
	    // In my case on registered I have EVENT, MSG and MSGCNT defined
	
	    // You will NOT receive any messages unless you build a HOST server application to send
	    // Messages to you, This is just here to show you how it might work
	
	    //alert("<li>MESSAGE -> MSG: " + e.message + "</li>");
	
	    //alert("<li>MESSAGE -> MSGCNT: " + e.msgcnt + "</li>");
	
	
	    break;
	
	
	  case 'error':
	
	    //alert("<li>ERROR -> MSG:" + e.msg + "</li>");
	
	    break;
	
	
	
	  default:
	    //alert('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
	    break;
  }
  
}

function GCM_Success(e)
{
	console.log("GCM_Success!");
}

function GCM_Fail(e)
{
	console.log("GCM_Fail!");
}


// End Notifications functions

// Simulate the childbrowser via an iFrame (Android Only!):
function showBrowser(url, title){
//	if(android_version > 2){
//		if(DEBUG_MODE) console.log("Android version is: " + android_version + " using iframe in webview browser...");
//		
//		$('#ib_title_bar').text(title);
//		$('#ib_content_area').html('<iframe src="' + url + '" width="320" height="387" scrolling="auto" frameborder="0" style="width: 320px; height: 387px, overflow: hidden;"></iframe>');
//		$('#ib_content_area').css({'overflow': 'hidden'});
//		//$('#ib_content_area').html('<object data="' + url + '" width="320" height="100%"></object>');
//		$('#ib_bottom_menu').html('<img id="ibclose" src="' + $c.localgraphics.arrowleft + '" height="100%" style="margin-left: 2px;" />');
//		
//		$('#internalbrowser').css({'display': 'inline'});
//		$('#pContent').css({'display': 'none'});
//		
//		$('#ibclose').bind('click', function(){
//			$('#pContent').css({'display': 'inline'});
//			$('#internalbrowser').css({'display': 'none'});
//	    });
//	}
//	else{
//		if(DEBUG_MODE) console.log("Android version is: " + android_version + " using native browser plugin...");
		openNativeBrowser(url, title);
//	}
}


function openNativeBrowser(url, title){
	Cordova.exec(nbSucces, nbFailure, "NativeBrowser", "nativebrowser", [window.ingrscale.app_scale, $('#ib_title_bar').height(), $('#ib_content_area').height(), $('#ib_bottom_menu').height(), title, url]);
}

function nbSucces(err){
	if (err == "goHome")
		preloadCategory();		

	console.log("native browser succes! " + err);
}

function nbFailure(){
	console.log("native browser failed!");
}



function deleteDownloadedFile(){
	if(last_downloaded_file != null){
		if(DEBUG_MODE) console.log("Deleting " + last_downloaded_file); 
	
	    window.resolveLocalFileSystemURI(last_downloaded_file, function(fileEntry){
	    	fileEntry.remove(function(){
	    		if(DEBUG_MODE) console.log("Downloaded file succesfully deleted");
	    	}, function(err){
	    		if(DEBUG_MODE) console.log("Could not delete downloaded file: " + err);
	    	});
	    	
	    }, function(err){
	    	if(DEBUG_MODE) console.log("No such file (downloaded file): " + err);
	    }); 
	}
}


function downloadAndViewPDF(url){
	mf.loader.show($c.lang.productlist.file_downloading);

	function gotFS(fileSystem) {
	    window.fileSystem = fileSystem;
	    
	    fileSystem.root.getDirectory(window.appRootDirName, {
	        create : true,
	        exclusive : false
	    }, dirReady, function(){
	    	if(DEBUG_MODE) console.log("failed to get filesystem");
	    	mf.loader.hide();
	    	navigator.notification.alert($c.lang.productlist.filedownload_failed, function(){}, $c.lang.productlist.filedownload_failed_title);
	    });
	}

	function dirReady(path) {
		path.fullPath = path.fullPath.replace("/null","/");
		console.log("path: " + JSON.stringify(path));
		
		if(DEBUG_MODE)console.log("application dir is ready");
	    
		var fileTransfer = new FileTransfer();
		//var split = url.split("/");
		var timestamp = new Date().getTime();
	    var filePath = path.fullPath + "participa" + timestamp + ".pdf"; /*+ split[split.length - 1];*/
		
		fileTransfer.download(
			encodeURI(url),
		    filePath,
		    function(entry) {
				console.log("entry: " + JSON.stringify(entry));
				
		    	if(DEBUG_MODE) console.log("download complete: " + entry.fullPath);
		        last_downloaded_file = entry.fullPath;
		        navigator.app.loadUrl(last_downloaded_file, { openExternal:true } ); 
		        mf.loader.hide();
		    },
		    function(error) {
		    	if(DEBUG_MODE) console.log("download error source " + error.source + " error target " + error.target + " download error code" + error.code);
		    	mf.loader.hide();
				navigator.notification.alert($c.lang.productlist.filedownload_failed, function(){}, $c.lang.productlist.filedownload_failed_title);	
		    }
		);
	}
	
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, function(){
		mf.loader.hide();
		navigator.notification.alert($c.lang.productlist.filedownload_failed, function(){}, $c.lang.productlist.filedownload_failed_title);
	});

}

function storeToken(token) 
{

    var councilToken = "";
    var languageToken = "";
    
    loadSavedSettings();
    if(typeof(user_settings) != 'undefined' && user_settings != null){
        councilToken = user_settings.council.id;
        languageToken = user_settings.language.name;
    }
    else
    {
        var default_settings = {};
        default_settings.council = default_council;
        default_settings.language = default_language;
        councilToken = default_settings.council.id;
        languageToken = default_settings.language.name;
    }
    
    try
    {
    
    	var xPosition = 0;
    	var yPosition = 0;
    	
    	try
    	{
		    mf.gps.get(function(){},function()
	        {
	          //navigator.notification.alert($c.maconf.lang.notifications.noGPS.text, function(){}, $c.maconf.lang.notifications.noGPS.title);
	        });
		    mf.gps.watch(function(pos){p = pos.coords;},function(){},1000);
		    
		    navigator.compass.getCurrentHeading(function(){}, function(){}, {});

        	xPositon = p.longitude;
        	yPositon = p.latitude;

        }
        catch(e)
        {
        	xPositon = 0;
        	yPositon = 0;
        }
	    
	    if(DEBUG_MODE) console.log("product=Participa&idPlatformApp=2&idCouncil="+councilToken+"&idLanguage="+languageToken+"&idDevice="+token+"&OSDetails="+String(device.version)+"&lastPOSX=" + xPositon + "&lastPOSY=" + yPositon + "");
	    
	    if(DEBUG_MODE)console.log("UUID:" + device.uuid);
	    
	    var xmlhttp=new XMLHttpRequest();
	    xmlhttp.open("POST",$c.settings.service_pushnotifications,false);
	    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	    
	    
	    xmlhttp.send("product=Participa&idPlatformApp=1&idCouncil="+councilToken+"&idLanguage="+languageToken+"&idDevice="+token+"&OSDetails="+String(device.version)+"&lastPOSX=" + xPositon + "&lastPOSY=" + yPositon + "");
	    
    }
    catch(e){
    	//alert("error storetoken: " + e);
    }
    
}

/****************************/
/*   Settings save / load   */
/****************************/
function loadSavedSettings(){
    var storage_value = window.localStorage.getItem($c.settings.saved_settings_key);
	
	if(typeof(storage_value) != 'undefined' && storage_value != null){
		user_settings = JSON.parse(storage_value);
		if(DEBUG_MODE) console.log('Settings Loaded!');
        //if(DEBUG_MODE) console.log('Loaded settings: ' + JSON.stringify(user_settings));
	}
    else{
        user_settings = null;
        if(DEBUG_MODE) console.log('Loaded settings: No settings to load!');
    }
  
}


function saveSettings(){
    window.localStorage.setItem($c.settings.saved_settings_key, JSON.stringify(user_settings));
    if(DEBUG_MODE) console.log('Settings Saved!');
    //if(DEBUG_MODE) console.log('Saved settings: ' + JSON.stringify(user_settings));
}


function updateUserSettings()
{
    try
    {
    	//alert("updateUserSettings: " + devicetoken);
    	storeToken(deviceToken);
    }
    catch(e){}
    //if(DEBUG_MODE) console.log('Saved settings: ' + JSON.stringify(user_settings));
}

function getRole(userDeviceToken)
{
	var roleService = "DES";
    // Get user information
    try
    {
	    var xmlhttp=new XMLHttpRequest();
	    xmlhttp.open("POST",$c.settings.service_device_role,false);
	    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	    
	    if(DEBUG_MODE) console.log("Information response parameters: " + $c.settings.service_device_role + "product=Participa&idPlatformApp=2&idDevice="+userDeviceToken+"");
	    xmlhttp.send("product=Participa&idPlatformApp=1&idDevice="+userDeviceToken+"");
	    
	    var roleInfo = JSON.parse(xmlhttp.responseText);
	    if(DEBUG_MODE) console.log("roleInfo.result: " + roleInfo.result);
	    
	    roleService = (roleInfo.result != "ERROR" ? roleInfo.result: "DES");
	    
    }
    catch(e)
    {
    	
    	roleService = "DES";
    }
    
    	
    $c.settings.service_url_type = roleService;
    

}

function checkVersion()
{
    var result = checkedVersionValue;
    if (checkedVersion == false)
    {
        try
        {
            // Get user information
            var xmlhttp=new XMLHttpRequest();
            xmlhttp.open("POST",$c.settings.service_checkApp,false);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    
            if(DEBUG_MODE) console.log("Information check app parameters: product=Participa&idPlatformApp=1&version="+$c.app.version+"");
            xmlhttp.send("product=Participa&idPlatformApp=1&version="+$c.app.version+"");
            if(DEBUG_MODE) console.log("check app response: " + xmlhttp.responseText);
            var versionInfo = JSON.parse(xmlhttp.responseText);
            result = (versionInfo.result == "OK" ? true: false);
            
            if (result == false)
            {
                var versionMsg = (versionInfo.result == "NEW_VERSION" ? $c.lang.version.newVersion : $c.lang.version.updateVersion)
                if(DEBUG_MODE) console.log("Checked version: " + versionInfo.result);
                mf.loader.hide();
                navigator.notification.alert(versionMsg, function(){window.location="Intergraph.Participa://?participaError=PARTICIPA_ITUNES";}, "Participa Mobile");
            }
        }
        catch(e)
        {
            if(DEBUG_MODE) alert("error"+e);
            result  =false;
        }
    }
    else
    {
        if(DEBUG_MODE) console.log("Check version skipped");
    }
    
    checkedVersion = true;
    checkedVersionValue = result;
    if(DEBUG_MODE) console.log("Resultat check: " + result);
    return result;
}


/********************/
/*   Splash screen  */
/********************/
function splashInit(json)
{    
   if (screen.height == 480)
    {
    //alert("cas 480");
        var link = $("<link>");
        link.attr({
              type: 'text/css',
              rel: 'stylesheet',
              href: 'css/style.css'
              });
        $("head").append( link );
    }
    else
    {
    //alert("cas 500");
        var link = $("<link>");
        link.attr({
                  type: 'text/css',
                  rel: 'stylesheet',
                  href: 'css/style5.css'
                  });
        $("head").append( link );
    }
        
    loadSavedSettings();
    
    // If there is saved settings and they are loaded properly:
    if(typeof(user_settings) != 'undefined' && user_settings != null){
        setTimeout(function(){navigator.splashscreen.hide()},10);
        
        // If there saved application ressources in the saved settings:
        if(typeof(user_settings.appsettings) == 'undefined' || user_settings.appsettings == null){
        	getAppRessources(function(){		// Load the app ressources from service.
				if (checkVersion())
                {
                      preloadWelcome();				// And preload the welcome screen.
                }
             }, true);
        }
        else
        {
            $c.lang = user_settings.appsettings.loaders_and_errors;
            $c.settings.service_url_base = user_settings.service_url;
            //$c.settings.service_url_type = user_settings.service_url_type;
            $c.settings.service_url_currenttype = user_settings.service_url_currenttype;
            
            if (checkVersion())
                preloadWelcome();					// Continue directly to preload welcome screen.
        }
    }
    // If no saved settings:
    else{
    
    	// Set default settings:
        user_settings = {};							
        user_settings.council = default_council;		
        user_settings.language = default_language;
        user_settings.service_url = $c.settings.service_url_base;
        user_settings.service_url_currenttype = $c.settings.service_url_currenttype;  
        user_settings.developedDevice = false;        
        
        mf.loader.show($c.preloaded_errors_loaders[user_settings.language.code].loading_app_settings);
        
        var service_url = $c.settings.service_url_base + 'GetCouncils?$format=json';
    	if(DEBUG_MODE) console.log("Service call: " + service_url);
    	
    	// Calling the service:
    	$.get(service_url, function(response){
           
			if(DEBUG_MODE) console.log("Done! Response: " + JSON.stringify(response));
			if(DEBUG_MODE) console.log("Her5 !!");
			var default_settings = response.d;
			
			user_settings.council.name = default_settings[0].councilName;		
			user_settings.language.code = default_settings[0].defaultCouncilLanguage;
			user_settings.language.name = default_settings[0].defaultconcilLanguageDesc;

    		
			getAppRessources(function(){
                                   
                                   if (checkVersion())
                                   {
                                        // Load the app ressources from service.
                                        setTimeout(function(){navigator.splashscreen.hide()},10);	// Hide splash screen.
                                        mf.page.show('settings', {});								// Show settings
                                   }
                }, true);    		
			
        },'JSON').error(function(msg){
           		if(DEBUG_MODE) console.log("Failed to load councils: " + JSON.stringify(msg));
           		mf.loader.hide();
           		navigator.notification.alert($c.preloaded_errors_loaders[user_settings.language.code].loading_app_settings_failed, function(){
           			navigator.app.exitApp();	// And close the app.
           		}, $c.preloaded_errors_loaders[user_settings.language.code].loading_app_settings_failed_title);
           });

    	
    }

}

// Loads the application ressources:
function getAppRessources(callBack, loadspinner){
	if(loadspinner)
		mf.loader.show($c.preloaded_errors_loaders[user_settings.language.code].loading_app_settings);

	var service_url = $c.settings.service_url_base + 'RESOURCES?$format=json&language=' + user_settings.language.code;
	if(DEBUG_MODE) console.log("Service call: " + service_url);
	
	// Calling the service:
	$.get(service_url, function(response){
	
		//if(DEBUG_MODE) console.log("Done loding app settings! Response: "/* + JSON.stringify(response)*/);
		
		user_settings.appsettings = {};
		
		
		// Convert poor webservice result (not proper json format!!) to usable result:
		for(var i = 0; i < response.d.length; i++){
			user_settings.appsettings[response.d[i].NAME] = response.d[i].VALUE;
		}
		// Convert end.
		
		// Parses the Mobile Alert conf from string to actual json  (not yet in a safe way!!):
		user_settings.appsettings["mobileAlertConf"] = JSON.parse(user_settings.appsettings["mobileAlertConf"]);

		
		// Load service loaders and errors:
		var service_url = $c.settings.service_url_base + "RESOURCES('serviceLoadersAndErrors')?$format=json&language=" + user_settings.language.code;
		if(DEBUG_MODE) console.log("Service call: " + service_url);
		
		// Calling the service:
		$.get(service_url, function(response){
			
			mf.loader.hide();		
			
			// Parses the Loaders and errors from string to actual json  (not yet in a safe way!!):
			try{
				$c.lang = eval("(" + response.d.VALUE + ')');
			}
			catch(err){
				if(DEBUG_MODE) console.log("Error parsing json");
			}
			
			user_settings.appsettings.loaders_and_errors = $c.lang;
			
			// Fires the callback provided for this function.
			setTimeout(callBack, 10);	
			
			},'JSON').error(function(msg){
				if(DEBUG_MODE) console.log("Failed to load appsettings: " + msg);
				mf.loader.hide();
				navigator.notification.alert($c.preloaded_errors_loaders[user_settings.language.code].loading_app_settings_failed, function(){}, $c.preloaded_errors_loaders[user_settings.language.code].loading_app_settings_failed_title);
		});
		
		
		},'JSON').error(function(msg){
			if(DEBUG_MODE) console.log("Failed to load appsettings: " + msg);
			mf.loader.hide();
			navigator.notification.alert($c.preloaded_errors_loaders[user_settings.language.code].loading_app_settings_failed, function(){}, $c.preloaded_errors_loaders[user_settings.language.code].loading_app_settings_failed_title);
	});
}


/**********************/
/*   Settings screen  */
/**********************/
function settingsInit(){
          	
    // Internal function for reapplying the ressources for the settingsscreen layout:
	function reapplySettingsRessources(){
        $('#title_bar').text(user_settings.appsettings.settingsHeaderTitle);
        $('#settings_council').html(user_settings.appsettings.settingsCouncilTitle + ' <span class="right">' + user_settings.council.name + '</span>');
        $('#settings_language').html(user_settings.appsettings.settingsLanguageTitle + ' <span class="right">' + user_settings.language.name + '</span>');
     
        //$('#bottom_menu').html('<img id="home" src="' + $c.localgraphics.home + '" height="100%" style="margin-right: 8px;" />');

$('#bottom_menu').html('<img id="home" src="' + $c.localgraphics.home + '" height="90%" style="margin-right: 2px; padding-top: 2px;" />');
        
        
        $('#settings_token_label').text("Device identifier");
        $('#tokenId').html(deviceToken);
	    $('#tokenId').css({'font-weight':'normal', 'font-size':'8px', 'color':'#2E2E2E', 'margin-top':'10px'});
        $('#settings_role_label').text("App Role");
        
        var typeService = $c.settings.service_url_type;
        //alert(typeService + " current: " + $c.settings.service_url_currenttype);
        if (typeService === 'PRO')
        {
            $('#settings_role_label').css({'visibility':'hidden'});
            $('#settings_role_label').css({'display':'none'});
            $('#settings_role').css({'visibility':'hidden'});
            $('#settings_role').css({'display':'none'});
            
            /*$('#rolebtn').html('<img id="prodbtn" src="' + $c.localgraphics.prdbtn_hover + '" class="button1" height="100%" style="margin-left: 8px;" /><img id="prebtn" src="' + $c.localgraphics.prebtn + '" class="button1" height="100%" style="margin-left: 5px; visibility: hidden;"  /><img id="devbtn" src="' + $c.localgraphics.devbtn + '" class="button1" height="100%" style="margin-left: 5px;  visibility: hidden;" />');*/
        }
        else if (typeService == 'PRE')
        {
            $('#rolebtn').html('<img id="prodbtn" src="' + ($c.settings.service_url_currenttype == "PRO" ? $c.localgraphics.prdbtn_hover : $c.localgraphics.prdbtn) + '" style="margin-left: 8px;width:36px;height:36px;" /><img id="prebtn" src="' + ($c.settings.service_url_currenttype == "PRE" ? $c.localgraphics.prebtn_hover : $c.localgraphics.prebtn) + '" style="margin-left: 5px;width:36px;height:36px;" /><img id="devbtn" src="' + ($c.settings.service_url_currenttype == "DES" ? $c.localgraphics.devbtn_hover : $c.localgraphics.devbtn) + '" style="margin-left: 5px; visibility: hidden; width:36px;height:36px;" />');
        }
        else if (typeService == 'DES')
        {
            $('#rolebtn').html('<img id="prodbtn" src="' + ($c.settings.service_url_currenttype == "PRO" ? $c.localgraphics.prdbtn_hover : $c.localgraphics.prdbtn) + '" style="margin-left: 8px;width:36px;height:36px;" /><img id="prebtn" src="' + ($c.settings.service_url_currenttype == "PRE" ? $c.localgraphics.prebtn_hover : $c.localgraphics.prebtn) + '" style="margin-left: 5px;width:36px;height:36px;" /><img id="devbtn" src="' + ($c.settings.service_url_currenttype == "DES" ? $c.localgraphics.devbtn_hover : $c.localgraphics.devbtn) + '" style="margin-left: 5px;width:36px;height:36px;" />');
        }
        else
        {
            $('#settings_role_label').css({'visibility':'hidden'});
            $('#settings_role_label').css({'display':'none'});
            $('#settings_role').css({'visibility':'hidden'});
            $('#settings_role').css({'display':'none'});
        }
        if(DEBUG_MODE) console.log('reapplySettingsRessources finished!');
    }

	//if(DEBUG_MODE) console.log('home img source: ' +$c.localgraphics.home);
	reapplySettingsRessources();	// Applies the resources.

    
	// Events for the "Home" button:
    $('#home').bind('click',function(){  
	    $('#home').attr('src', $c.localgraphics.home_hover);  	
    	if(DEBUG_MODE) console.log("home clicked!");
       	saveSettings();
       	updateUserSettings();
        preloadWelcome();
    });
    
// Events for the "prodbtn" button:
    $('#prodbtn').bind('click',function(){
                    
        $('#prodbtn').attr('src', $c.localgraphics.prdbtn_hover);
        resetSettings();
        $c.settings.service_url_base = $c.settings.service_url_base_pro;
        $c.settings.service_url_currenttype = "PRO";                     
        mf.page.show('splash');               
    });

	// Events for the "prebtn" button:
    $('#prebtn').bind('click',function(){
                       
       $('#prebtn').attr('src', $c.localgraphics.prebtn_hover);
       resetSettings();
       $c.settings.service_url_base = $c.settings.service_url_base_pre;
       $c.settings.service_url_currenttype = "PRE";
       mf.page.show('splash');
    });

	// Events for the "devbtn" button:
    $('#devbtn').bind('click',function(){
                       
        $('#devbtn').attr('src', $c.localgraphics.devbtn_hover);
        resetSettings();
        $c.settings.service_url_base = $c.settings.service_url_base_dev;
        $c.settings.service_url_currenttype = "DES";
        mf.page.show('splash');
     });
         
    // GPS Switch handling:
    var gpsswitch = false;
    
    $('#gpsswitch').bind('click', function(){
    	if(!gpsswitch){
	    	$('#gpsswitch').removeClass("native_check_off");
	    	$('#gpsswitch').addClass("native_check_on");
	    	gpsswitch = true;
    	}
    	else{
	    	$('#gpsswitch').removeClass("native_check_on");
	    	$('#gpsswitch').addClass("native_check_off");
	    	gpsswitch = false;
    	}
    	
    });


    // Council selection handling:
    $('#settings_council').bind('click',function(){
    	mf.loader.show($c.lang.settings.loading_councils);
    	
    	var service_url = $c.settings.service_url_base + 'GetCouncils?$format=json&language=' + user_settings.language.code;
    	if(DEBUG_MODE) console.log("Service call: " + service_url);
    	
    	// Calling the service:
    	$.get(service_url, function(response){
           
			//if(DEBUG_MODE) console.log("Done! Response: " + JSON.stringify(response));
			
			councils = response.d;				// Councils are in the JSON response 'd' variable.
			
			$('#settingslist').html('');		// Clears the settings list (used for both councils and languages).
			    
			// Populate the council list:
			for(var i = 0; i < councils.length; i++){             
				$('<div />', {'id': 'councillistitem' + i, 'class': 'native_list_item'}).append(councils[i].councilName).appendTo('#settingslist').bind('click', function(){
				
					var id = $(this).attr('id').substr(15);		// The reference on the list (has to be done like this as its dynamically loaded).
					user_settings.council = {'id': councils[id].councilID, 'name': councils[id].councilName};	// Sets the corresponding council id and council name.
					
					// Load the default language.					
                    user_settings.language.code = councils[id].defaultCouncilLanguage;
                    user_settings.language.name = councils[id].defaultconcilLanguageDesc;
                    				
					// Reloads the application ressources as the council has now changed:
					getAppRessources(function(){
						saveSettings();					// Save the new settings.
						reapplySettingsRessources();	// Reapply the ressources.
						$('#mainsettings, #settingslist').css({'-webkit-transition': 'all 0.3s linear', '-webkit-transform': 'translate(0px, 0px)'});	// Slide the screen back to settings.
						
						// For some reason we have to rebind the "home" button:
						$('#home').bind('click',function(){	    	
					    	if(DEBUG_MODE) console.log("home clicked!");
							$('#home').attr('src', $c.localgraphics.home_hover);
					       	saveSettings();
					        preloadWelcome();
					    });
					    
// Events for the "prodbtn" button:
                        $('#prodbtn').bind('click',function(){
                                                        
                            $('#prodbtn').attr('src', $c.localgraphics.prdbtn_hover);
                            resetSettings();
                            $c.settings.service_url_base = $c.settings.service_url_base_pro;
                            $c.settings.service_url_currenttype = "PRO";
                            mf.page.show('splash');
                        });
                                     
                        // Events for the "prebtn" button:
                        $('#prebtn').bind('click',function(){
                                                       
                            $('#prebtn').attr('src', $c.localgraphics.prebtn_hover);
                            resetSettings();
                            $c.settings.service_url_base = $c.settings.service_url_base_pre;
                            $c.settings.service_url_currenttype = "PRE";
                            mf.page.show('splash');
                        });
                                     
                        // Events for the "devbtn" button:
                        $('#devbtn').bind('click',function(){
                                                       
                            $('#devbtn').attr('src', $c.localgraphics.devbtn_hover);
                            resetSettings();
                            $c.settings.service_url_base = $c.settings.service_url_base_dev;
                            $c.settings.service_url_currenttype = "DES";
                            mf.page.show('splash');
                        });
                        					    
					}, false);
				                
				});
           	}
	        
	        mf.loader.hide();
	           		
	        $('#title_bar').text(user_settings.appsettings.councilHeaderTitle);
	        $('#home').attr('src', $c.localgraphics.home);
	        $('#mainsettings, #settingslist').css({'-webkit-transition': 'all 0.3s linear', '-webkit-transform': 'translate(-320px, 0px)'});		// SLides the screen sideways to show the list.	
	           	
        },'JSON').error(function(msg){
           		if(DEBUG_MODE) console.log("Failed to load councils: " + JSON.stringify(msg));
           		mf.loader.hide();
           		navigator.notification.alert($c.preloaded_errors_loaders[user_settings.language.code].loading_app_settings_council_failed, function(){}, $c.preloaded_errors_loaders[user_settings.language.code].loading_app_settings_council_failed_title);
           });
    });
    
    
    // Language selection handling:
    $('#settings_language').bind('click',function(){
    	mf.loader.show($c.lang.settings.loading_languages);
    	
    	var service_url = $c.settings.service_url_base + 'COUNCILS(' + user_settings.council.id + ')/LANGUAGES?$format=json&language=' + user_settings.language.code;
    	if(DEBUG_MODE) console.log("Service call: " + service_url);
    	
    	// Calling the service:
    	$.get(service_url, function(response){
        
       		languages = response.d;				// Languages are in the JSON response 'd' variable.
			
			$('#settingslist').html('');		// Clears the settings list (used for both councils and languages).
                            
       		// Populate the language list:
       		for(var i = 0; i < languages.length; i++){
           		$('<div />', {'id': 'languagelistitem' + i, 'class': 'native_list_item'}).append(languages[i].LANGUAGE).appendTo('#settingslist').bind('click', function(){
                    var id = $(this).attr('id').substr(16);		// The reference on the list (has to be done like this as its dynamically loaded).
                    

                    user_settings.language = {'name': languages[id].LANGUAGE, 'code': languages[id].IDLANGUAGE};	// Sets the corresponding language and language id.
                
                    
                    // Reloads the application ressources as the language has now changed:
                    getAppRessources(function(){
                    	saveSettings();					// Save the new settings.
						reapplySettingsRessources();	// Reapply the ressources.
						$('#mainsettings, #settingslist').css({'-webkit-transition': 'all 0.3s linear', '-webkit-transform': 'translate(0px, 0px)'});	// Slide the screen back to settings.
						
						// For some reason we have to rebind the "home" button:
						$('#home').bind('click',function(){   	 	
					    	if(DEBUG_MODE) console.log("home clicked!");
					       	$('#home').attr('src', $c.localgraphics.home_hover);					       	
					       	saveSettings();
					        preloadWelcome();
					    });
						
						// Events for the "prodbtn" button:
                        $('#prodbtn').bind('click',function(){
                                                        
                            $('#prodbtn').attr('src', $c.localgraphics.prdbtn_hover);
                            resetSettings();
                            $c.settings.service_url_base = $c.settings.service_url_base_pro;
                            $c.settings.service_url_currenttype = "PRO";
                            mf.page.show('splash');
                        });
                                     
                        // Events for the "prebtn" button:
                        $('#prebtn').bind('click',function(){
                                                       
                            $('#prebtn').attr('src', $c.localgraphics.prebtn_hover);
                            resetSettings();
                            $c.settings.service_url_base = $c.settings.service_url_base_pre;
                            $c.settings.service_url_currenttype = "PRE";
                            mf.page.show('splash');
                        });
                                     
                        // Events for the "devbtn" button:
                        $('#devbtn').bind('click',function(){
                                                       
                            $('#devbtn').attr('src', $c.localgraphics.devbtn_hover);
                            resetSettings();
                            $c.settings.service_url_base = $c.settings.service_url_base_dev;
                            $c.settings.service_url_currenttype = "DES";
                            mf.page.show('splash');
                        });
                        						
                    }, false);
                });
           	}
	        
	        mf.loader.hide();
	        	        
	        $('#title_bar').text(user_settings.appsettings.languageHeaderTitle);
	        $('#home').attr('src', $c.localgraphics.home);
	        $('#mainsettings, #settingslist').css({'-webkit-transition': 'all 0.3s linear', '-webkit-transform': 'translate(-320px, 0px)'});	// SLides the screen sideways to show the list.	
	           	
        },'JSON').error(function(msg){
           		if(DEBUG_MODE) console.log("Failed to load languages: " + JSON.stringify(msg));
           		mf.loader.hide();
           		navigator.notification.alert($c.preloaded_errors_loaders[user_settings.language.code].loading_app_settings_languages_failed, function(){}, $c.preloaded_errors_loaders[user_settings.language.code].loading_app_settings_languages_failed_title);
           });
    });
    
}


/**********************/
/*   Welcome screen   */
/**********************/
function preloadWelcome(){

	mf.loader.show($c.lang.welcome.loading_council_info);

	var service_url = $c.settings.service_url_base + 'COUNCILS(' + user_settings.council.id + ')?$format=json&language=' + user_settings.language.code;
    if(DEBUG_MODE) console.log("Service call: " + service_url);
    
    // Calling the service:
    $.get(service_url, function(response){
          
          var welcome_information = response.d;				// Welcome information are in the JSON response 'd' variable.

          //if(DEBUG_MODE) console.log("Done! welcome_information: " + JSON.stringify(welcome_information));

          // The following values is used in the Mobile Alert workflow, but for some reason already attach to this service-response:
          ma_init_data.numberOfTypes = response.d.NUMINCIDENCESTYPES;
	      ma_init_data.wheelImageURL = response.d.IMGWHEELINCIDENCES;
	      ma_init_data.councilID = user_settings.council.id;

          mf.loader.hide();
          mf.page.show('welcome', welcome_information);
          
          
	},'JSON').error(function(msg){
		if(DEBUG_MODE) console.log("Failed to load welcome information: " + JSON.stringify(msg));
		mf.loader.hide();
		//navigator.notification.alert($c.lang.settings.loading_council_info_failed, function(){}, $c.lang.settings.loading_council_info_failed_title);
		navigator.notification.alert($c.preloaded_errors_loaders[user_settings.language.code].loading_app_settings_failed, function(){}, $c.preloaded_errors_loaders[user_settings.language.code].loading_app_settings_failed_title);
	});
    
}


function welcomeInit(welcome_information){
	$('#title_bar').text(welcome_information.TITLE);
	
	var img = new Image();
	
	img.onload = function() {
		if(this.width > this.height)
			$('#welcome_banner').html('<img src="' + welcome_information.BANNER + '" width="100%" />');
		else
			$('#welcome_banner').html('<img src="' + welcome_information.BANNER + '" height="100%" />'); 
  	}
  	
	$('#settings').attr("src", $c.localgraphics.settings ); 
	$('#settings').css({'display':'inline'});
    $('#welcome_title').css({'font-weight':'bold', 'font-size':'17px', 'color':'#2E2E2E'});
    $('#welcome_title').text(welcome_information.WELCOMETXT);
    $('#welcome_text').css({'font-style':'italic', 'font-size':'12px', 'color':'#2E2E2E'});
    $('#welcome_text').text(welcome_information.SUBTITLE);
        
    $('#bottom_menu').html('<img id="start" src="' + $c.localgraphics.arrowright + '" height="100%" style="padding-left: 6px;" />');
    
    $('#start').bind('click', function(){
    	$('#start').attr('src', $c.localgraphics.arrowright_hover);
        preloadCategory();						// To category screen.
    });
	
	$('#settings').bind('click', function(){
       $('#settings').attr("src", $c.localgraphics.settings_hover );
       setTimeout(function(){
           mf.page.show("settings", {});			// To settings screen.
        },100);	
	});
	
	img.src = welcome_information.BANNER;	// Sets the source of the online image to be checked (this also initiates the load).
}


/***********************/
/*   Category screen   */
/***********************/
function preloadCategory(){
	mf.loader.show($c.lang.category.loading_council_themes);
	
	var service_url = $c.settings.service_url_base + 'COUNCILS(' + user_settings.council.id + ')/WHEELCONTROLTHEME?$format=json&language=' + user_settings.language.code;
    if(DEBUG_MODE) console.log("Service call: " + service_url);
    
    // Calling service:
    $.get(service_url, function(response){
          
          var category_setup = response.d[0];				// Themes/categories are in the JSON response 'd' variable index [0] (this is an array for some reason!).
          
          service_url = $c.settings.service_url_base + "COUNCILS(" + user_settings.council.id + ")/THEMES_COUNCIL?$filter=Language eq '" + user_settings.language.code + "'&$select=IDTHEME,NAME&$format=json";
          
          if(DEBUG_MODE) console.log("Service call: " + service_url);
          
          // Calling service:
          $.get(service_url, function(response){
          	  category_setup.categories = response.d;
          	  
          	  var wheelcategories = {};								// For use with the wheel.js setup. 
          
          	  // Prepares the category names for the wheel:
	          for(var i = 0; i < category_setup.categories.length; i++){
		          	wheelcategories['' + i] = category_setup.categories[i].NAME;
	          }

	          category_setup.Categorias = wheelcategories;	// Puts the categories back in to the category_setup object (categories are called "Categories" -.- )

	          mf.loader.hide();
	          
	          mf.page.show('category', category_setup);		// To the category / theme screen.

          },'JSON').error(function(msg){
	          if(DEBUG_MODE) console.log("Failed to load category ids and name information:" + msg);
	          mf.loader.hide();
	          navigator.notification.alert($c.lang.settings.loading_council_themes_failed, function(){}, $c.lang.settings.loading_council_themes_failed_title);
          });
          
      },'JSON').error(function(msg){
          if(DEBUG_MODE) console.log("Failed to load category information:" + msg);
          mf.loader.hide();
          navigator.notification.alert($c.lang.settings.loading_council_themes_failed, function(){}, $c.lang.settings.loading_council_themes_failed_title);
      });
}


function categoryInit(category_setup){
  	$('#title_bar').text(user_settings.appsettings.themeHeaderTitle);
    $('#bottom_menu').html('<img id="back" src="' + $c.localgraphics.arrowleft + '" height="100%" style="margin-left: 2px;" />');
    
    // Back button handling:
    $('#back').bind('click', function(){
    	$('#back').attr('src', $c.localgraphics.arrowleft_hover);
    	preloadWelcome();					// Back to welcome screen (reloads it from scracth).
    });
        
    
	$.get('js/wheel.js', function(data){		// Loading wheel.js.
		$.globalEval(data);
		
		setTimeout(function(){
			wheelStart(category_setup.Categorias, category_setup.numCategories, category_setup.ICON);	// Setup the wheel with the loaded categories.
		},10);
		
		// Wheel ok button handling:
		$('#ok').click(function(){
			//if(DEBUG_MODE) console.log("Theme selected: " + category_setup.Categorias[curr_selected_cat] + " (" + curr_selected_cat + ")");
			
			if(DEBUG_MODE) console.log(JSON.stringify(category_setup.categories[curr_selected_cat].IDTHEME));
			
			preloadProductlist(category_setup.categories[curr_selected_cat].IDTHEME/*curr_selected_cat*/, category_setup.Categorias[curr_selected_cat]);	// To the productlist screen.
		});
	});
              
              
              
	
}


// Sets up the wheel:
function wheelStart(categories, noOfCategories, wheel_image_url){
	if(DEBUG_MODE) console.log("categories: " + categories + " noOfCategories: " + noOfCategories + " wheel_image_url: " + wheel_image_url);

	$('#text').text(categories['0']);		// Show the default value.
	
	// Test:
	//noOfCategories = 12;
	//wheel_image_url = 'images/wheel.png';
	
	
	// Check the online image size (therefore a callback to do whats needed after the image is loaded):
	var img = new Image();
	
	img.onload = function() {
		var height = this.height;
		var width = this.width;
		
		//if(DEBUG_MODE) console.log("Image dimensions: " + width + "," + height);
		
		// The following calculates all dimensions, angles etc. needed for displaying the wheel dynamically, based upon number of categories and the image dimensions:
		var degree_per_slice = (360 / noOfCategories);
		var bg_offset_per_slice = Math.round(width / noOfCategories);
		
		if(DEBUG_MODE) console.log("degree_per_slice: " + degree_per_slice);
		
		for(var i = 0; i < noOfCategories; i++){
			var degree = (i * degree_per_slice) - 1;
			
			var top = 22;
			//var left = 57;
			var origin_x = Math.round(bg_offset_per_slice / 2);
			var left = 160 - origin_x;
			var origin_y = 160 - 22;
			var position = ((bg_offset_per_slice) * i);
			var translate = -100;

			
			$('<li />', {'id': 'li_' + i, 'style': 'width: ' + bg_offset_per_slice + 'px; height: ' + height + 'px; left: ' + left + 'px; top: ' + top + 'px; background: url(' + wheel_image_url + '); -webkit-transform-origin: ' + origin_x + 'px ' + origin_y + 'px; background-position:' + position + 'px 0;  -webkit-transform:rotate3d(0,0,1,' + degree + 'deg) translate3d(0, ' + translate + 'px,0);'}).appendTo('#zodiac');
		}
		
		// Shows the wheel:	
		$('#wheel').show(0,function(){
			var lis, theTransform, matrix;
			lis = document.getElementsByTagName('li');		// Gets all list items from the document.
				 
			for(i=0; i<lis.length; i+=1) {
				theTransform = window.getComputedStyle(lis[i]).webkitTransform;
				matrix = new WebKitCSSMatrix(theTransform).translate(0, 100);
				lis[i].style.webkitTransform = matrix;
			}
		
			wheel.init(categories, noOfCategories);		// Initializes the wheel, with the categories and number of categories.
		});			
  	}
  	
	img.src = wheel_image_url;	// Sets the source of the online image to be checked (this also initiates the load).
}


/**********************/
/*   Product screen   */
/**********************/
function preloadProductlist(themeid, themename){
	ma_init_data.themeid = themeid;
	ma_init_data.themename = themename;

    mf.loader.show($c.lang.productlist.loading_products);

    
    var service_url = $c.settings.service_url_base + 'THEMES_COUNCIL(IDCOUNCIL=' + user_settings.council.id + ',IDTHEME=' + themeid  + ",Language='" + user_settings.language.code + "')/PRODUCT_COUNCIL_THEME?$format=json&language=" + user_settings.language.code;	// themeid + 1 as Absis apparently counts theme from start index = 1
    if(DEBUG_MODE) console.log("Service call: " + service_url);
    
    // Calling service:
    $.get(service_url, function(response){
          var products = response.d;											// Welcome information are in the JSON response 'd' variable.
          
          var theme_products = {'products': products, 'themename': themename};	// Object to parse to the product list.
          
          mf.loader.hide();
          
          mf.page.show('productlist', theme_products);    
          
          },'JSON').error(function(msg){
	          if(DEBUG_MODE) console.log("Failed to load products: " + JSON.stringify(msg));
	          mf.loader.hide();
	          navigator.notification.alert($c.lang.settings.loading_products_failed, function(){}, $c.lang.settings.loading_products_failed_title);
		});
}


function productlistInit(theme_products){
	//if(DEBUG_MODE) console.log("theme_products: " + JSON.stringify(theme_products));

	var products = theme_products.products;
	
	$('#title_bar').text(user_settings.appsettings.productHeaderTitle + ' ' /*': '*/  + theme_products.themename);

    $('#bottom_menu').html('<img id="back" src="' + $c.localgraphics.arrowleft + '" height="100%" style="margin-left: 2px;" /><img id="home" src="' + $c.localgraphics.home + '" height="100%" style="margin-right: 2px; margin-left: 224px; display: none;" />');
    
    $('#back').bind("click", function(){
    	$('#back').attr('src', $c.localgraphics.arrowleft_hover);
    	preloadCategory();
    });
  
    $('#home').bind("click", function(){
    	$('#home').attr('src', $c.localgraphics.home_hover);
		preloadCategory();
	});
	
	// Childbrowser plugin:
    //childbrowser.onClose = function(){};
	
	for(var i = 0; i <= products.length-1; i++){	
        $('<div />', {'id': 'prolistitem' + i, 'class': 'productlist_item'}).append('<img src="' + products[i].PRDICON + '" width="30" height="30" style="float: left;"/><div class="productlist_item_text"><span style="font-weight: bold;">' + products[i].PRDTITLE + '</span><br/>' + products[i].PRDDESCRIPTION + '</div>').appendTo('#prolist').bind('click', function(){
        	

        	var product = products[$(this).attr('id').substr(11)];
        	
        	
        	switch(product.IDBEHAVIOUR){
	        		case 1:{	// 1: webform / url
	        	
		        		if(DEBUG_MODE) console.log("----> product.IDBEHAVIOUR: " + product.IDBEHAVIOUR + " (WEBFORM / URL)");
	        		
		        		if(product.REQUIRESPOSITION == true){
		        			if(DEBUG_MODE) console.log('REQUIRESPOSITION = true');
		        			
		        			var params = {'product': product, 'themeproducts': theme_products, 'showProductView': false};
		        			
		        			mf.page.show('productmapview', params);
			        	}	 
			        	else{
			        		//var params = {'product': product, 'themeproducts': theme_products, 'position': null};
				        	//childbrowser.showWebPage(product.PRDURL/*, product.PRDTITLE*/);    // Else	simply open the childbrowser with url as destination.
				        	//$('#content_area').html('<iframe src="' + product.PRDURL + '" width="100%" height="100%"></iframe>');
				        	showBrowser(product.PRDURL, product.PRDTITLE);
				        	//showBrowser("http://tvtid.tv2.dk/", product.PRDTITLE);
			        	}  
		        		
		        		break;
	        		}
	        		case 2:{	// 2: pdf
	        			if(DEBUG_MODE) console.log("----> product.IDBEHAVIOUR: " + product.IDBEHAVIOUR + " (PDF)");
	        			
	        			if(DEBUG_MODE) console.log("REQUIRESPOSITION: " + product.REQUIRESPOSITION);
	        			
	        			// Bare lige til test:
	        			//product.REQUIRESPOSITION = true;
	        		
		        		if(product.REQUIRESPOSITION == true){
		        			var params = {'product': product, 'themeproducts': theme_products, 'showProductView': true};
		        			
		        			mf.page.show('productmapview', params);
			        	}	 
			        	else{
			        		var params = {'product': product, 'themeproducts': theme_products, 'position': null};
				        	mf.page.show('documentview', params);
			        	}       			
		        		
		        		break;
	        		}
	        		case 3:{	// 3: Mobile Alert
		        		initMobileAlert();
		        		break;
	        		}
	        		default:{
		        		break;
	        		}
	        	
        		}
        });
	}

	// Sets up iScroll for the productlist:
	$('#prolist').css('height', $('#prolist').height());
    myScroll = new iScroll('content_area');
	
}


function productmapviewInit(params){
	var theme_products = params.themeproducts;
	var product = params.product;
	var showProductView = params.showProductView;
	var address_searched = false;
	
	try
	{
		$('#title_bar').text(user_settings.appsettings.consumeTitle);
	
//		$('#bottom_menu').html('<img id="back" src="' + $c.localgraphics.arrowleft + '" height="100%" style="position: relative; float: left; margin-left: 2px;" />' + 
//				        							   '<img id="centermaploc" src="' + $c.localgraphics.target + '" height="80%" style="position: relative; float: left; margin-top: 5px; margin-left: 2px;" />' +
//				        							   '<input id="adressfield" type="text" name="adressfield" style="font-size: 12px; position: relative; float: left; width: 170px; height: 20px; top: 10px; margin-left: 6px; margin-right: 4px;" />' +
//				        							   '<img id="done" src="' + $c.localgraphics.arrowright + '" height="100%" style="position: relative; float: left; margin-left: 2px; margin-right: 2px;" />' +
//				        							   '<img id="addresslookup" src="' + $c.localgraphics.addressbook + '" height="20" width="20" style="position: absolute; z-index: 2000; left: 238px; top: 10px; " />'
//				        							   );
		
//		$('#bottom_menu').html('<img id="back" src="' + $c.localgraphics.arrowleft + '" height="100%" style="position: relative; float: left; margin-left: 2px;" />' + 
//				   '<img id="centermaploc" src="' + $c.localgraphics.target + '" height="80%" style="position: relative; float: left; margin-top: 5px; margin-left: 2px;" />' +
//				   '<input id="adressfield" type="text" name="adressfield" style="font-size: 12px; position: relative; float: left; width: 166px; height: 20px; top: 10px; margin-left: 6px;" />' +				   
//				   '<img id="done" src="' + $c.localgraphics.arrowright + '" height="100%" style="position: relative; float: left; margin-left: 19px;" />' +
//				   '<div style="background-color: #FFFFFF; position: absolute; height: 22px; width: 22px; left: 255px; top: 10px;">' + '<img id="addresslookup" src="' + $c.localgraphics.addressbook + '" height="100%" width="100%" style="" />' + '</<div>'
//				   );
				   
	$('#bottom_menu').html('<img id="back" src="' + $c.localgraphics.arrowleft + '" height="100%" style="position: relative; float: left; margin-left: 2px;" />' + 
			       '<img id="centermaploc" src="' + $c.localgraphics.target + '" height="100%" style="position: relative; float: left; margin-top: 0px; margin-left: 2px;" />' +
			       '<input id="adressfield" type="text" name="adressfield" style="font-size: 12px; position: relative; float: left; width: 153px; height: 20px; top: 10px; margin-left: 6px; margin-right: 4px;" />' +
			       '<img id="done" src="' + $c.localgraphics.arrowright + '" height="100%" style="position: relative; float: left; margin-left: 2px; margin-right: 2px; margin-top: 0px;" />' +
			       '<img id="addresslookup" src="' + $c.localgraphics.addressbook + '" height="20" width="20" style="position: absolute; z-index: 2000; left: 238px; top: 13px; " />'
			       );				   
				        							   
		
		options = {
			//controls:[new OpenLayers.Control.TouchNavigation({'dragPanOptions': {enableKinetic: true}})],
			controls:[new OpenLayers.Control.TouchNavigation({'dragPanOptions': {enableKinetic: true}}), new OpenLayers.Control.PinchZoom()],  
	        buffer:2
		};
		

		var map = new OpenLayers.Map( 'productmap',options);
		
	    
	    layer = new OpenLayers.Layer.OSM( "m",['http://a.tile.openstreetmap.org/${z}/${x}/${y}.png','http://b.tile.openstreetmap.org/${z}/${x}/${y}.png','http://c.tile.openstreetmap.org/${z}/${x}/${y}.png'],{transitionEffect:'resize'});
	    map.addLayer(layer);
	
	    var point = new OpenLayers.LonLat(p.longitude, p.latitude).transform(
	                    new OpenLayers.Projection("EPSG:4326"),
	                    map.getProjectionObject()
	                );
	
		var accuracy = 2000;
		if(p.accuracy > accuracy)
			accuracy = p.accuracy;
			
		
		var poly = OpenLayers.Geometry.Polygon.createRegularPolygon(new OpenLayers.Geometry.Point(point.lon,point.lat), accuracy+(0.5 * accuracy), 20,0);
	  		//map.setOptions({restrictedExtent:poly.getBounds()});
			
		 map.setCenter(point, 17);
		 
		 if(android_version < 3){
			var zoom_out = $('#zoomtools_out');
			var zoom_in = $('#zoomtools_in');
			
			zoom_out.css({'display':'inline'});
			zoom_in.css({'display':'inline'});
			
			zoom_out.bind("click", function(){
				map.zoomOut(map.zoom - 1);
			});
			
			zoom_in.bind("click", function(){
				map.zoomIn(map.zoom + 1);
			});
		 }
    }
    catch(err)
    {
    	if(DEBUG_MODE) console.log(err);
    }
    
   
    
    // Back handling:	   
	$('#back').bind("click", function(){
		$('#back').attr('src', $c.localgraphics.arrowleft_hover);
		setTimeout(function(){
		   mf.page.show('productlist', theme_products);
		},100);	
	});	  
    
	// Center map handling:	   
	$('#centermaploc').bind("click", function(){
		if(DEBUG_MODE) console.log("center map new position");
		
		if(typeof(p) != 'undefined' && p != null){
			var point = new OpenLayers.LonLat(p.longitude, p.latitude).transform(
				new OpenLayers.Projection("EPSG:4326"),
				map.getProjectionObject()
			);
		
			map.setCenter(point, 17);
		}
		else{
			navigator.notification.alert($c.lang.productlist.gps_failed, function(){}, $c.lang.productlist.gps_failed_title);
		}
	});	   
	
	
	// Next / ok handling:
	$('#done').bind("click", function(){

		$('#done').attr('src', $c.localgraphics.arrowright_hover);

		if((typeof(p) != 'undefined' && p != null) || address_searched){
			var lonlat = map.getLonLatFromPixel(new OpenLayers.Pixel(160,193/*208*/)).transform(map.getProjectionObject(),new OpenLayers.Projection("EPSG:4326"));
		
			var pos_from_map = {};
			
			pos_from_map.lat = lonlat.lat;
			pos_from_map.lon = lonlat.lon;
			pos_from_map.accuracy = -2;
			
			var params = {'product': product, 'themeproducts': theme_products, 'position':pos_from_map};
			
			if(DEBUG_MODE) console.log("params.showProductView: " + params.showProductView);
			
			if(showProductView){
				if(DEBUG_MODE) console.log("HER 1!");
				mf.page.show("documentview", params);
			}
			else{
				if(DEBUG_MODE) console.log("HER 2!");
				showBrowser(product.PRDURL, product.PRDTITLE);
				//childbrowser.showWebPage(product.PRDURL + 'x=' + lonlat.lon + '&y=' + lonlat.lat, product.PRDTITLE);
			}
		}
		else{
			navigator.notification.alert($c.lang.productlist.gps_failed, function(){}, $c.lang.productlist.gps_failed_title);
		}
	});
	
	
	$('#addresslookup').bind("click", function(){
		if(DEBUG_MODE) console.log("address lookup!!!");
		
		mf.loader.show($c.lang.productlist.loading_address_lookup);
		
		var service_url = $c.settings.service_address_lookup_base + encodeURIComponent($('#adressfield').val()) + '&format=json';	// themeid + 1 as Absis apparently counts theme from start index = 1
		if(DEBUG_MODE) console.log("Service call: " + service_url);
		
		// Calling service:
		$.get(service_url, function(response){
			if(DEBUG_MODE) console.log(JSON.stringify(response));
		
			if(response.length > 0){
				try{
					var point = new OpenLayers.LonLat(response[0].lon, response[0].lat).transform(
						new OpenLayers.Projection("EPSG:4326"),
						map.getProjectionObject()
					);

					var poly = OpenLayers.Geometry.Polygon.createRegularPolygon(new OpenLayers.Geometry.Point(point.lon,point.lat), accuracy+(0.5 * accuracy), 20,0);
			  		//map.setOptions({restrictedExtent:poly.getBounds()});
			  		
			  		map.setCenter(point, 17);
			  		address_searched = true;
			    }
			    catch(err){
			    	if(DEBUG_MODE) console.log(err);
			    }
			    
			    mf.loader.hide();
			}
			else{
				if(DEBUG_MODE) console.log('Address not found');
				mf.loader.hide();
				navigator.notification.alert($c.lang.productlist.address_lookup_notfound, function(){}, $c.lang.productlist.address_lookup_notfound_title);
			}
		
		},'JSON').error(function(msg){
			if(DEBUG_MODE) console.log("Failed to load products: " + JSON.stringify(msg));
			mf.loader.hide();
		
			navigator.notification.alert($c.lang.productlist.address_lookup_failed, function(){}, $c.lang.productlist.address_lookup_failed_title);
		});
	});

}


function documentviewInit(params){
	var theme_products = params.themeproducts;
	var position = params.position;
	var product = params.product;
	
	if(DEBUG_MODE) console.log("Positon: " + JSON.stringify(position));
	
	$('#title_bar').text(product.PRDTITLE);

	
	if(product.PRDPREVIEWIMAGE_MODE == true){	
		$('#preview').css({'width': '80px', 'margin-right': '198px'});
		$('#preview').html('<img src="' + product.PRDPREVIEWIMAGE + '" height="100%" width="100%" />');
	}
	else{	
		$('#preview').css({'width': '160px', 'margin-right': '118px'});
		$('#preview').html('<img src="' + product.PRDPREVIEWIMAGE + '" height="100%" width="100%" />');
	}
		
	$('#header').text(product.PRDTITLE);
	$('#description').text(product.PRDLONGDESC);

	$('#bottom_menu').html('<img id="back" src="' + $c.localgraphics.arrowleft + '" height="100%" style="position: relative; float: left; margin-left: 2px;" /><img id="home" src="' + $c.localgraphics.home + '" height="100%" style="position: relative; float: left; margin-left: 230px; margin-right: 2px;" />'
			        							   );
			        							   
//	childbrowser.onClose = function(){
//		mf.page.show('productlist', theme_products);
//	};
  		
	// Back button handling:
	$('#back').bind("click", function(){
	
		$('#back').attr('src', $c.localgraphics.arrowleft_hover);
	
		if(product.REQUIRESPOSITION === 'true'){
			if(DEBUG_MODE) console.log('REQUIRESPOSITION = true');
			
			var params = {'product': product, 'themeproducts': theme_products};
			
			mf.page.show('productmapview', params);
    	}	 
    	else{
    		mf.page.show('productlist', theme_products);
    	}
		
	});
	
	// Home button handling:
	$('#home').bind("click", function(){
		$('#home').attr('src', $c.localgraphics.home_hover);
		preloadCategory();
	});
		
	// Download handling:        				
	$('#download').bind("click", function(){

		$('#downloadIcon').attr('src', $c.localgraphics.download_hover);

		setTimeout(function(){
                   
          	$('#downloadIcon').attr('src', $c.localgraphics.download);
    		navigator.notification.confirm($c.lang.productlist.product_document, function onConfirm(btn) {
			if(btn == 1){
    			if(DEBUG_MODE) console.log('yes');
    			
    			//$('#content_area').css({'display':'none'});
    			$('#home').css({'display':'none'});
    			
    			console.log("PDF url: " + product.PRDURL);
    			
    			if(typeof(position) != 'undefined' && position != null){
    				/////// Find på andet childbrowser!!!!"!!!!!!
    				if(product.IDBEHAVIOUR == 2){	// PDF
    					// Download fil og kald pdf reader!
    					downloadAndViewPDF(product.PRDURL + 'x=' + position.lon + '&y=' + position.lat);
    				}
    				else
    					showBrowser(product.PRDURL + 'x=' + position.lon + '&y=' + position.lat, product.PRDTITLE);
    				//$('#content_area').html('<object data="' + product.PRDURL + 'x=' + position.lon + '&y=' + position.lat + '" type="application/pdf" width="1005" height="100%"></object>');
    				//childbrowser.showWebPage(product.PRDURL + 'x=' + position.lon + '&y=' + position.lat, product.PRDTITLE);
    			}
    			else{
    				//$('#content_area').html('<object data="' + product.PRDURL + '" type="application/pdf" width="100%" height="100%"></object>');
    				//childbrowser.showWebPage(product.PRDURL, product.PRDTITLE);
    				if(product.IDBEHAVIOUR == 2){	// PDF
    					// Download fil og kald pdf reader!    	
    					downloadAndViewPDF(product.PRDURL);
    				}
    				else
    					showBrowser(product.PRDURL, product.PRDTITLE);
    			}
    		}
    		else{
    			if(DEBUG_MODE) console.log('no');
    			}
			}, $c.lang.productlist.product_document_title, 'Yes, No');
		},100);
	});
}



/////////////////////////
// Mobile Alert flow:
/////////////////////////
function initMobileAlert(){
	// Loads the Mobile Alert config file (could be the same config but neat to have them separated):
	mf.loader.show($c.lang.productlist.loading_ma_types);
	
	if(DEBUG_MODE) console.log("Initializing Mobile Alert");
	
/*
	// Only for test (simulator):
	if(device.platform === "iPhone Simulator")
		window.$maconf = JSON.parse(user_settings.appsettings.mobileAlertConf);
	else
*/
		window.$maconf = user_settings.appsettings.mobileAlertConf;
		
	
	var service_url = $c.settings.service_url_base + "COUNCILS(" + user_settings.council.id + ")/INCIDENCES_COUNCIL?$filter=Language eq '" + user_settings.language.code + "'&$select=IDINCIDENCE,NAME,NOTIFICATIONSURL&$format=json";

	if(DEBUG_MODE) console.log("Service call: " + service_url);

    // Calling service:
    $.get(service_url, function(response){
          var wheelcategories = {};								// For use with the wheel.js setup. 
          var send_urls = {};
  
      	  // Prepares the category names for the wheel:
          for(var i = 0; i < response.d.length; i++){
	          	wheelcategories['' + i] = response.d[i].NAME;
	          	send_urls['' + i] = response.d[i].NOTIFICATIONSURL;
          }
          
          ma_init_data.types = wheelcategories;
          ma_init_data.sendurls = send_urls;
          
          mf.loader.hide();
          
          mf.gps.get(function(){}, function(){
	          navigator.notification.alert($maconf.lang.notifications.noGPS.text, function(){}, $maconf.lang.notifications.noGPS.title);
		  });
			
		  //mf.gps.watch(function(pos){p = pos.coords;},function(){},1000);
		  mf.gps.watch(function(pos){p = pos.coords;},function(){},1000);
		  navigator.compass.getCurrentHeading(function(){}, function(){}, {});	
			
		  //navigator.compass.getCurrentHeading(function(){}, function(){}, {});
			
          // Start Change to remove the mobile alert front page
		  //mf.page.show('front', {});
          $('.pContent').hide();
          mf.loader.show($maconf.lang.loader.cameraText);
          setTimeout("accelerometerInit();",3000);
          setTimeout("cameraInit();",1000);
          // End Change to remove the mobile alert front page		  
          
          },'JSON').error(function(msg){
	          if(DEBUG_MODE) console.log("Failed to load types for MA: " + JSON.stringify(msg));
	          mf.loader.hide();
	          navigator.notification.alert($c.lang.productlist.loading_ma_products_failed, function(){}, $c.lang.productlist.loading_ma_products_failed_title);
	});
	
}


function frontInit(json)
{
	//setTimeout(function(){cordova.exec(null, null, "SplashScreen", "hide", [])},10);	
	if(DEBUG_MODE) console.log($maconf);
                
    $('#cancelbtn').text($maconf.lang.front.cancelButton);
    $('#startbtn').text($maconf.lang.front.startButton);
    $('#header').text($maconf.lang.front.heading);
    
                
    $('#infoPageLink').bind('click',function(){
        mf.page.show('info',{});
    });
                                   
    $('#startbtn').bind('click',function(){
        $('.pContent').hide();
        mf.loader.show($maconf.lang.loader.cameraText);
        setTimeout("accelerometerInit();",3000);
        setTimeout("cameraInit();",1000);
    });
    
    $('#cancelbtn').bind('click',function(){
    	if(DEBUG_MODE) console.log("blahblah");
    	preloadProductlist(ma_init_data.themeid, ma_init_data.themename);
    	
    });
};


function infoInit(json)
{
        $('#infoText').html($maconf.lang.info.infoText);
        $('#terms').html('<br>' + $maconf.lang.info.infoTermsandcontact);
        $('#infoDiv').css('height',$('#infoDiv').height());
        $('#terms').bind('click',function()
                      {
                      window.location.href = $maconf.lang.info.infoTermsandcontactLink;
                      });
    
        myScroll = new iScroll('wrapper');
    
        $('#btn').text($maconf.lang.front.cancelButton);
		$('#btn').bind('click',function()
		{
			mf.page.show('front',{});
		});
};


function cameraInit()
{
    	setTimeout(function(){mf.loader.hide();},1000);
        var onSuccess = function(imageData) 
		{
            var json = {};
			json.imageFile = imageData;
			json.heading = heading;
            mf.page.show('type',json);
		};

		var onFail =function(message) 
		{
			mf.loader.hide();
			mf.page.show('front',{});
			if(DEBUG_MODE) console.log("Failed initializing camera!");
			// Bare lige til test (kamera failer i simulatoren!):
			
			/*
var json = {};
			json.imageFile = "imagefile-url-blah";
			json.heading = "-1";
            mf.page.show('type',json);
*/

            // Bare lige til test - slut!
		};	
	navigator.camera.getPicture(onSuccess, onFail, { quality: 50, targetWidth: 640, targetHeight: 480, destinationType: navigator.camera.DestinationType.FILE_URI}); 
}


function typeInit(json)
{    

	if(DEBUG_MODE) console.log(JSON.stringify(ma_init_data));

    try{
    	$.get('js/wheel.js', function(data){		// Loading wheel.js.
			$.globalEval(data);
			
			setTimeout(function(){
				wheelStart(ma_init_data.types, ma_init_data.numberOfTypes, ma_init_data.wheelImageURL);	// Setup the wheel with the loaded types.
			},10);
			
			// Wheel ok button handling:
			$('#ok').click(function(){
				//if(DEBUG_MODE) console.log("Theme selected: " + category_setup.Categorias[curr_selected_cat] + " (" + curr_selected_cat + ")");
				json.sendurl = ma_init_data.sendurls['' + curr_selected_cat];
				json.type = $('#text').html();
                mf.page.show('form',json);
			});
		});
		
	}
	catch(err){
		if(DEBUG_MODE) console.log(err);
	}	

}


function formInit(json)
{
	$('#comment').attr('placeholder',$maconf.lang.form.placeholder);
	$('#emailcomment').attr('placeholder',$maconf.lang.form.textEmail);
    $('#emailItemLabel').text(" ");
    
    $('#emailcomment').bind('keypress', function(e) {
        if ((e.keyCode || e.which) == 13) {
           return false;
        }
    });	
	
	$('#btn').text($maconf.lang.form.sendButton);
	
	$('#btn').bind('click',function()
	{
        if(true/*online*/)
        {
        
	        mf.loader.show($maconf.lang.loader.checkingPosition,{bgColor:'rgba(0,0,0,0.5)'});
	        if(DEBUG_MODE) console.log("-------------------------------");
	        if(DEBUG_MODE) console.log(JSON.stringify(ma_init_data));
	        if(DEBUG_MODE) console.log("-------------------------------");
	        var params = new Object();
	        params['council'] = String(ma_init_data.councilID);
			params['type'] = String(json.type);
			params['version'] = String(device.version);
			params['platform'] = String(device.platform);
			params['imageFile'] = json.imageFile;
			params['addresses'] = {};
			params['sendurl'] = json.sendurl;
			params['deviceId'] = deviceToken;
			
			var inputs = $("#form").serializeArray();
			for(var input in inputs)
				params[inputs[input].name] = String(inputs[input].value);
			
			params['heading'] = String("-1");
			if(typeof(json.heading) != 'undefined')
				params['heading'] = String(json.heading);
	
	
			for(var k in p)
				params[k] = String(p[k]);
				
			
			if(DEBUG_MODE) console.log("Params: " + JSON.stringify(params));
			
			
			setTimeout(function()
			{
                if(typeof(params['accuracy']) != 'undefined' && params['accuracy'] != null){					// Hvis GPS ikke har fÃ¥et fix endnu
                       if(parseFloat(params['accuracy']) > 1/*25 */) //checker om vi er lig/under 25 meter.
                       {
                            mf.loader.show($maconf.lang.loader.loadingMap);
                            mf.page.show('map',params);
                       }
                       else{	//Under 25 meters		
                            mf.loader.hide();
                            send(params);
                            }
                }
                else{
                    if(DEBUG_MODE) console.log("intet gps fix!!!!");
                    mf.loader.hide();
                    navigator.notification.alert($maconf.lang.notifications.noGPS.noFix, function(){});
                }
                       
			
			},100);
		}
		else
		{
			disconnected(params);
		}
	});
	
}


function mapInit(json)
{
	$('#mapheader').text($maconf.lang.map.map);
	$('#mapSendButton').text($maconf.lang.map.send);
	
	if(json.addresses.length > 0)
		$('#mapAddressButton').css('display','block');
		
	mf.loader.hide();
	options = {
		/*
controls:[new OpenLayers.Control.TouchNavigation({'dragPanOptions': {enableKinetic: true}})],
        buffer:2
*/
		controls:[new OpenLayers.Control.TouchNavigation({'dragPanOptions': {enableKinetic: true}}), new OpenLayers.Control.PinchZoom()],  
        buffer:2
	};
	
	var map = new OpenLayers.Map( 'map',options);
    

    
    layer = new OpenLayers.Layer.OSM( "m",['http://a.tile.openstreetmap.org/${z}/${x}/${y}.png','http://b.tile.openstreetmap.org/${z}/${x}/${y}.png','http://c.tile.openstreetmap.org/${z}/${x}/${y}.png'],{transitionEffect:'resize'});
    map.addLayer(layer);

    var point = new OpenLayers.LonLat(json.longitude, json.latitude).transform(
                    new OpenLayers.Projection("EPSG:4326"),
                    map.getProjectionObject()
                );

	var accuracy = 500;
	if(json.accuracy > accuracy)
		accuracy = json.accuracy;
		
	try
	{
		var poly = OpenLayers.Geometry.Polygon.createRegularPolygon(new OpenLayers.Geometry.Point(point.lon,point.lat), accuracy+(0.5 * accuracy), 20,0);
  		//map.setOptions({restrictedExtent:poly.getBounds()});
    }
    catch(err)
    {
    	if(DEBUG_MODE) console.log(err);
    }
    map.setCenter(point, 17);
    
    if(android_version < 3){
		var zoom_out = $('#zoomtools_out');
		var zoom_in = $('#zoomtools_in');
		
		zoom_out.css({'display':'inline'});
		zoom_in.css({'display':'inline'});
		
		zoom_out.bind("click", function(){
			map.zoomOut(map.zoom - 1);
		});
		
		zoom_in.bind("click", function(){
			map.zoomIn(map.zoom + 1);
		});
	 }
    
    $('#mapSendButton').bind('click',function()
    {
    		var lonlat = map.getLonLatFromPixel(new OpenLayers.Pixel(160,208)).transform(map.getProjectionObject(),new OpenLayers.Projection("EPSG:4326"));
    		json.longitude = lonlat.lon;
    		json.latitude = lonlat.lat;
    		json.accuracy = -2;
			send(json);
    });
    
}

function send(params)
{
	var imageFile = params['imageFile'];
	var sendurl = params.sendurl;
	
	delete params.imageFile;
	delete params.addresses;
	delete params.sendurl;
    
    var now = new Date();
    
    params.datetime = now.getTime();
    params.timediff = (now.getTimezoneOffset()/-60);
	
    if(DEBUG_MODE) console.log("params: " + JSON.stringify(params));
	
	$('#crosshair').hide();
	mf.loader.show($maconf.lang.loader.sendText,{bgColor:'rgba(0,0,0,0.5)'});
	
	
	var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = "image.jpg";
    options.mimeType = "image/jpeg";
    options.chunkedMode = true;
	options.params = params;
	
	if(DEBUG_MODE) console.log(options);
	
	var ft = new FileTransfer();

	// Bare lige til test:
	setTimeout(function(){mf.page.show('finished', {});}, 1500);
	
	// Disabled sÃ¥ vi ikke lige fÃ¥r send mens vi tester:
	if(DEBUG_MODE) console.log("MA send url: " + sendurl);

	ft.upload(imageFile, sendurl, function(result)
    {
        mf.page.show('finished',{});			
    },
    function(result)
    {
        disconnected();
        
    },options);	

}


function finishedInit(json)
{	
	mf.loader.hide();
	$('#finishedtext').text($maconf.lang.finished.text);
	$('#finishbtn').text($maconf.lang.finished.newButton);

	$('#finishbtn').bind("click", function()
	{
		$.get('conf/conf.js')
		.success(function(result) {
			$.globalEval(result);
			$c.lang = user_settings.appsettings.loaders_and_errors;
			preloadProductlist(ma_init_data.themeid, ma_init_data.themename);
		})
		.error(function(jqXHR, textStatus, errorThrown) {
			if(DEBUG_MODE) console.log('Error loading mobile alert config file');
		});
	});

}

