var heading = -1, p, online = false;
var root;
var childbrowser;
var childMapbrowser;
var user_settings = {};
var default_council = {'id': '1', 'name':'Manresa'};
var default_language = {'name':'Español', 'code':'es-ES'};
var ma_init_data = {};
var deviceIdentifier = null;
var deviceToken = "";
var checkedVersion = false;
var checkedVersionValue = false;
var firstLoad = true;
var usingMyvr = true;
var participaId = 1;
var canalsChanged = false;

var DEBUG_MODE = true;

// Gestion de errores.
//window.location="Intergraph.Participa://?participaError=PARTICIPA_ERROR";

// Disabling default behaviour for "touchmove":
function preventBehavior(e){ 
  e.preventDefault(); 
};
document.addEventListener("touchmove", preventBehavior, false);


function onBodyLoad(){
	document.addEventListener("deviceready",onDeviceReady,false);
    document.addEventListener("resume", onResume, false);
}

function onResume() {
    // Clear the badge number - if a new notification is received it will have a number set on it for the badge
    //setBadge(0);
    getPending(); // Get pending since we were reopened and may have been launched from a push notification
}

function checkInstallNewVersion()
{
    try
    {
        if(DEBUG_MODE) console.log("checkInstallNewVersion");
        
        var reset = false;
        var storage_value = window.localStorage.getItem($c.settings.saved_settings_key);
        
        if(typeof(storage_value) != 'undefined' && storage_value != null)
        {
            if(DEBUG_MODE) console.log("processing storage_value");
            user_settings = JSON.parse(storage_value);
            
            if (user_settings != null)
            {
                if(DEBUG_MODE) console.log("comparing versions. file version: " + user_settings.version + " app version: " + $c.app.version);
                if (user_settings.version != $c.app.version)
                {
                    if(DEBUG_MODE) console.log("RESET SETTINGS DIFERENT VERSION");
                    try
                    {
                        var test = user_settings.service_url;
                        test = user_settings.service_url_currenttype;
                        test = user_settings.service_checkApp;
                        test = user_settings.service_pushnotifications;
                        test = user_settings.service_device_role;
                        test = user_settings.council.id;
                        test = user_settings.language.name;
                        test = user_settings.appsettings.loaders_and_errors;
                        test = user_settings.service_generateGUID;
                        test = user_settings.service_logRegister;
                        test = user_settings.service_getPropertiesIdToken;
                        test = user_settings.deviceIdentifier;
                    }
                    catch(e)
                    {
                        if(DEBUG_MODE) console.log("RESET SETTINGS VERSION");
                        resetSettings();
                        reset = true;
                    }
                }
            }
        }
        else
        {
            if(DEBUG_MODE) console.log("processing storage_value to NULL");
            user_settings = null;
        }
        
    }
    catch(e)
    {
        if(DEBUG_MODE) console.log("RESET SETTINGS VERSION");
        resetSettings();
    }
    
}

function checkInstallNewVersion_test()
{
    try
    {
        if(DEBUG_MODE) console.log("checkInstallNewVersion");
        
        var reset = false;
        window.requestFileSystem(window.LocalFileSystem.PERSISTENT,
             0,
             function (fileSystem)
             {
                fileSystem.root.getFile($c.settings.saved_file_settings, {create: false},
                                     function (fileEntry) {
                                     var reader = new FileReader();
                                     reader.onloadend = function(evt)
                                     {
                                        storage_value = evt.target.result;
                                     
                                        if(typeof(storage_value) != 'undefined' && storage_value != null)
                                        {
                                            var user_settings_check = JSON.parse(storage_value);
                                            if(DEBUG_MODE) console.log('Settings Loaded!');
                                        
                                            if (user_settings_check != null)
                                            {
                                                if(DEBUG_MODE) console.log("comparing versions. file version: " + user_settings_check.version + " app version: " + $c.app.version);
                                                if (user_settings_check.version != $c.app.version)
                                                {
                                                    if(DEBUG_MODE) console.log("RESET SETTINGS DIFERENT VERSION");
                                                    try
                                                    {
                                                        if ($c.app.version == "1.1.0.5")
                                                        {
                                                            if(DEBUG_MODE) console.log("RESET SETTINGS VERSION");
                                                            //resetSettings();
                                                            reset = true;
                                                        }
                                                        else
                                                        {
                                                            var test = user_settings_check.service_url;
                                                            test = user_settings_check.service_url_currenttype;
                                                            test = user_settings_check.service_checkApp;
                                                            test = user_settings_check.service_pushnotifications;
                                                            test = user_settings_check.service_device_role;
                                                            test = user_settings_check.council.id;
                                                            test = user_settings_check.language.name;
                                                            test = user_settings_check.appsettings.loaders_and_errors;
                                                            test = user_settings_check.service_generateGUID;
                                                            test = user_settings_check.service_logRegister;
                                                            test = user_settings_check.service_getPropertiesIdToken;
                                                            test = user_settings_check.deviceIdentifier;
                                                        }
                                                    }
                                                    catch(e)
                                                    {
                                                        if(DEBUG_MODE) console.log("RESET SETTINGS VERSION");
                                                        //resetSettings();
                                                        reset = true;
                                                    }
                                                }
                                            }
                                        
                                        }
                                        else{
                                            user_settings_check = null;
                                            if(DEBUG_MODE) console.log('Loaded settings: No settings to load!');
                                        }
                                     
                                     
                                        //loadElements();
                                     
                                     };
                                        
                                     reader.readAsText(fileEntry);
                                     
                            },
                            failR);
             },
             failR);
        
        
      /*  var storage_value = window.localStorage.getItem($c.settings.saved_settings_key);
        
        if(typeof(storage_value) != 'undefined' && storage_value != null)
        {
            if(DEBUG_MODE) console.log("processing storage_value");
            user_settings = JSON.parse(storage_value);
            
            if (user_settings != null)
            {
                if(DEBUG_MODE) console.log("comparing versions. file version: " + user_settings.version + " app version: " + $c.app.version);
                if (user_settings.version != $c.app.version)
                {
                    if(DEBUG_MODE) console.log("RESET SETTINGS DIFERENT VERSION");
                    try
                    {
                        if ($c.app.version == "1.1.0.5")
                        {
                            if(DEBUG_MODE) console.log("RESET SETTINGS VERSION");
                            resetSettings();
                            reset = true;
                        }
                        else
                        {
                        var test = user_settings.service_url;
                        test = user_settings.service_url_currenttype;
                        test = user_settings.service_checkApp;
                        test = user_settings.service_pushnotifications;
                        test = user_settings.service_device_role;
                        test = user_settings.council.id;
                        test = user_settings.language.name;
                        test = user_settings.appsettings.loaders_and_errors;
                        test = user_settings.service_generateGUID;
                        test = user_settings.service_logRegister;
                        test = user_settings.service_getPropertiesIdToken;
                        test = user_settings.deviceIdentifier;
                        }
                    }
                    catch(e)
                    {
                        if(DEBUG_MODE) console.log("RESET SETTINGS VERSION");
                        resetSettings();
                        reset = true;
                    }
                }
            }
        }
        else
        {
            if(DEBUG_MODE) console.log("processing storage_value to NULL");
            user_settings = null;
        }*/
        
    }
    catch(e)
    {
        if(DEBUG_MODE) console.log("RESET SETTINGS VERSION");
        resetSettings();
    }
    
}


// ************************************************
// Start Functions to read/write the settings txt

// Error loading settings
function failLoadSettings(error) {
    console.log(error.code);
}

function failR(error) {
    console.log(error.code);
    loadElements();
}

function gotFS(fileSystem) {
    fileSystem.root.getFile($c.settings.saved_file_settings, {create: true, exclusive: false}, gotFileEntry, fail);
}

function gotFileEntry(fileEntry) {
    fileEntry.createWriter(gotFileWriter, fail);
}

function gotFileWriter(writer) {
    writer.write(JSON.stringify(user_settings));
}

function fail(error) {
    console.log(error.code);
}

function loadInitSettings(){
    
    var storage_value = null;
    
    try
    {
        window.requestFileSystem(window.LocalFileSystem.PERSISTENT,
                                 0,
                                 function (fileSystem)
                                 {
                                    fileSystem.root.getFile($c.settings.saved_file_settings, {create: false},
                                                         function (fileEntry) {
                                                         var reader = new FileReader();
                                                         reader.onloadend = function(evt)
                                                         {
                                                            storage_value = evt.target.result;
                                                         
                                                            if(typeof(storage_value) != 'undefined' && storage_value != null)
                                                            {
                                                                user_settings = JSON.parse(storage_value);
                                                                if(DEBUG_MODE) console.log('Settings Loaded!');
                                                            }
                                                            else{
                                                                user_settings = null;
                                                                if(DEBUG_MODE) console.log('Loaded settings: No settings to load!');
                                                            }
                                                         
                                                         
                                                            loadElements();
                                                         
                                                         };
                                                            
                                                         reader.readAsText(fileEntry);
                                                         
                                                },
                                                failR);
                                 },
                                 failR);
        
        
    }
    catch(e)
    {
    }
    
}


// End Functions to read/write the settings txt
// ************************************************

function loadElements()
{
    
    if (parseFloat(window.device.version) >= 7.0)
        document.body.style.marginTop = "20px";
    
    if(DEBUG_MODE) console.log("Device Ready!");
	document.addEventListener("online", setOnlineStatus, false);
	document.addEventListener("offline", setOnlineStatus, false);
    
	// For use with the childbrowser plugin:
	root = this;
    childbrowser = window.plugins.childBrowser;
    childMapbrowser = window.plugins.childMapBrowser;
	
	/*$(function(){
      $.ajaxSetup({
                  beforeSend: function(request){
                  request.setRequestHeader("Accept-Encoding","gzip, deflate");
                  }
                  });
      
      // Disabled for testing:
      try
      {
        mf.gps.get(function(){},function()
        {
                   //navigator.notification.alert($c.maconf.lang.notifications.noGPS.text, function(){}, $c.maconf.lang.notifications.noGPS.title);
        });
      
        mf.gps.watch(function(pos){p = pos.coords;},function(){},1000);
      
        navigator.compass.getCurrentHeading(function(){}, function(){}, {});
      
      }
      catch(e){}
      
    });
    */
    
    // Retrieve Device identifier
    if (user_settings != null)
        if (user_settings.deviceIdentifier != null)
            if (user_settings.deviceIdentifier != "")
                deviceIdentifier = user_settings.deviceIdentifier;
    
    if (deviceIdentifier == null)
        getDeviceId();
    
    //deviceIdentifier = "abe69af7-e752-4b00-86e7-adbde820e520";
    
    var role = getRole(deviceIdentifier);
    
    // for send log is necesary to know the role.
    sendLog("Identificador: " + deviceIdentifier + " - funcion: onDeviceReady - mensaje: Init aplicación");
    sendLog("Identificador: " + deviceIdentifier + " - funcion: onDeviceReady - mensaje: Recuperando role: " + role);
    
    sendLog("Identificador: " + deviceIdentifier + " - funcion: onDeviceReady - mensaje: Init variables");
    startVariables();
    
    sendLog("Identificador: " + deviceIdentifier + " - funcion: onDeviceReady - mensaje: Init splash");
    mf.page.show('splash');
    
    sendLog("Identificador: " + deviceIdentifier + " - funcion: onDeviceReady - mensaje: Init Notifications");
    

    /*
    try
    {
        DGGeofencing.initCallbackForRegionMonitoring(new Array(), processRegionMonitorCallback, function(error) {
                                                     alert("Geofencing init error");
                                                     });

         var params = ["1", "41.659", "2.689", "5", "3"];
         DGGeofencing.startMonitoringRegion(params, function(result) {}, function(error) {
         alert("failed to add region");
         });
    }
    catch(e)
    {
        alert("error geofencing: "+ e);
    }
    */
    

    //End GeoFencing
    
    // Start Push Notifications
    
    // Register Device
    registerPushNotifications();
    
    // This will cause to fire when app is active already
    document.addEventListener('push-notification', function(event) {
                              console.log('RECEIVED NOTIFICATION! Push-notification! ' + event);
                              //app.myLog.value+=JSON.stringify(['\nPush notification received!', event]);
                              // Could pop an alert here if app is open and you still wanted to see your alert
                              //navigator.notification.alert("Received notification - fired Push Event " + JSON.stringify(['push-//notification!', event]));
                              });
    document.removeEventListener('deviceready', this.deviceready, false);
    
    // End Push Notifications
    

    
}

// Fired when device is ready:
function onDeviceReady(){
    
    checkInstallNewVersion();
    loadInitSettings();
}

// Start Geofencing functions

function processRegionMonitorCallback(result)
{
	var callbacktype = result.callbacktype;
    //alert("callback type: "+ callbacktype);
	if (callbacktype == "initmonitor") {
		
		console.log("initmonitor");
		
	} else if (callbacktype == "locationupdate") {// monitor for region with id fid removed
		
		var fid = result.regionId;
		
		var new_timestamp = result.new_timestamp;
		var new_speed = result.new_speed;
		var new_course = result.new_course;
		var new_verticalAccuracy = result.new_verticalAccuracy;
		var new_horizontalAccuracy = result.new_horizontalAccuracy;
		var new_altitude = result.new_altitude;
		var new_latitude = result.new_latitude;
		var new_longitude = result.new_longitude;
        
		var old_timestamp = result.old_timestamp;
		var old_speed = result.old_speed;
		var old_course = result.old_course;
		var old_verticalAccuracy = result.old_verticalAccuracy;
		var old_horizontalAccuracy = result.old_horizontalAccuracy;
		var old_altitude = result.old_altitude;
		var old_latitude = result.old_latitude;
		var old_longitude = result.old_longitude;
        
		//alert("Location Update Event: " + event);
        
	} else if (callbacktype == "monitorremoved") {// monitor for region with id fid removed
		
        //alert("monitor for region with id fid removed");
		/*var fid = result.regionId;
		console.log("monitorremoved: " + fid);
		var regions = Region.all().filter("fid", '=', fid);
		regions.list(null, function(results) {
                     $(results).each(function(index, item) {
                                     if (fid == item.fid) {
                                     persistence.remove(item);
                                     persistence.flush(function() {
                                                       var regions = Region.all(); // Returns QueryCollection of all Projects in Database
                                                       regions.list(null, function(results) {
                                                                    var list = $("#mainPage").find(".lstMyRegions");
                                                                    //Empty current list
                                                                    list.empty();
                                                                    //Use template to create items & add to list
                                                                    $("#regionItem").tmpl(results).appendTo(list);
                                                                    //Call the listview jQuery UI Widget after adding
                                                                    //items to the list allowing correct rendering
                                                                    list.listview("refresh");
                                                                    });
                                                       $.mobile.hidePageLoadingMsg();
                                                       });
                                     }
                                     });
                     });*/
        
	} else if (callbacktype == "monitorfail") {// monitor for region with id fid failed
        
		var fid = result.regionId;
		//alert("monitorfail");
        
	} else if (callbacktype == "monitorstart") { // monitor for region with id fid succeeded
		
		//alert("monitorstart");
		var region = new Region();
		region.fid = currentLocation.id;
		region.name = currentLocation.name;
		region.accuracy = 0;
		region.radius = 15;
		region.address = currentLocation.location.address;
		region.latitude = currentLocation.location.lat;
		region.longitude = currentLocation.location.lng;
		var here = confirm('Are you already at ' + currentLocation.name + '?');
		if (here) {
			region.currentlyHere = "yes";
		} else {
			region.currentlyHere = "no";
		}
		persistence.add(region);
		persistence.flush(function() {
                          console.log("persistence flush success");
                          //$.mobile.changePage("#mainPage");
                          //$.mobile.hidePageLoadingMsg();
                          });
		
	} else { // enter or exit region processing
		

		var fid = result.regionId;
		var status = callbacktype;
                alert("enter or exit region processing. fid:" + fid + " status: " + status);
		var regions = Region.all().filter("fid", '=', fid);
		regions.list(null, function(results) {
                     $(results).each(function(index, item) {
                                     if (fid == item.fid) {
                                     if (status == "enter") {
                                     item.currentlyHere = "yes";
                                
                                     } else {
                                     item.currentlyHere = "no";
                                     }
                                     }
                                     });
                     });
		persistence.flush(function() {
                          var regions = Region.all(); // Returns QueryCollection of all Projects in Database
                          regions.list(null, function(results) {
                                       //var list = $("#mainPage").find(".lstMyRegions");
                                       //Empty current list
                                       //list.empty();
                                       //Use template to create items & add to list
                                       //$("#regionItem").tmpl(results).appendTo(list);
                                       //Call the listview jQuery UI Widget after adding
                                       //items to the list allowing correct rendering
                                       //list.listview("refresh");
                                       });
                          });
	}
	
}

// End Geofencing functions

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

// Start Push Notifation functions

function registerPushNotifications() {
    var pushNotification = window.plugins.pushNotification;
    pushNotification.registerDevice({alert:true, badge:true, sound:true}, function(status) {
       if(DEBUG_MODE) console.log(JSON.stringify(['registerDevice status: ', status]));
       deviceToken = status.deviceToken;
    });
}

// Function to get the GPS Coords
function getGPSCoord()
{
    var gpsCoords = null;
    
    try
    {
        mf.gps.get(function(){},function()
        {
        });
        mf.gps.watch(function(pos){gpsCoords = pos.coords;},function(){},1000);
        
        // SI navigator.compass.getCurrentHeading(function(){}, function(){}, {});
    }
    catch(e)
    {
        gpsCoords = null;
    }
    
    return gpsCoords;
}

function startVariables(id) {
    
	if(DEBUG_MODE) console.log("startVariables");
	sendLog("Identificador: " + deviceIdentifier + " - funcion: startVariables - mensaje: Init");
	
    var councilToken = "";
    var languageToken = "";
    
	if(DEBUG_MODE) console.log("startVariables SAVED SETTINGS");
	sendLog("Identificador: " + deviceIdentifier + " - funcion: startVariables - mensaje: loadSavedSettings");
    
    if(typeof(user_settings) != 'undefined' && user_settings != null){
        
		if(DEBUG_MODE) console.log("startVariables SET USER SETTINGS");
		sendLog("Identificador: " + deviceIdentifier + " - funcion: startVariables - mensaje: set user settings");
        
        councilToken = user_settings.council.id;
        languageToken = user_settings.language.name;
        try
        {
            $c.settings.service_url_base = user_settings.service_url;
            $c.settings.service_url_currenttype = user_settings.service_url_currenttype;
            $c.settings.service_checkApp = user_settings.service_checkApp;
            $c.settings.service_pushnotifications = user_settings.service_pushnotifications;
            $c.settings.service_device_role = user_settings.service_device_role;
            $c.settings.service_generateGUID = user_settings.service_generateGUID;
            $c.settings.service_logRegister = user_settings.service_logRegister;
            $c.settings.service_getPropertiesIdToken = user_settings.service_getPropertiesIdToken;
            $c.settings.service_getCategories = user_settings.service_getCategories;
            $c.settings.service_setCategories = user_settings.service_setCategories;
            $c.settings.service_notifications = user_settings.service_notifications;
            $c.settings.service_saveReadNotifications = user_settings.service_saveReadNotifications;
            $c.settings.service_saveRemoveNotifications = user_settings.service_saveRemoveNotifications;
            $c.settings.service_readNumNotifications = user_settings.service_readNumNotifications;
        }
        catch(e)
        {
            if(DEBUG_MODE) console.log("startVariablesDEFAULT CATCH ERROR");
			sendLog("Identificador: " + deviceIdentifier + " - funcion: startVariables - mensaje: default catch error");
            
            var default_settings = {};
            default_settings.council = default_council;
            default_settings.language = default_language;
            
            councilToken = default_settings.council.id;
            languageToken = default_settings.language.name;
            $c.settings.service_url_base = $c.settings.service_url_base_pro;
            $c.settings.service_url_currenttype = "PRO";
            $c.settings.service_checkApp = $c.settings.service_checkApp_pro;
            $c.settings.service_pushnotifications = $c.settings.service_pushnotifications_pro;
            $c.settings.service_device_role = $c.settings.service_device_role_pro;
            $c.settings.service_generateGUID = user_settings.service_generateGUID_pro;
            $c.settings.service_logRegister = user_settings.service_logRegister_pro;
            $c.settings.service_getPropertiesIdToken = user_settings.service_getPropertiesIdToken_pro;
            $c.settings.service_getCategories = user_settings.service_getCategories_pro;
            $c.settings.service_setCategories = user_settings.service_setCategories_pro;
            $c.settings.service_notifications = user_settings.service_notifications_pro;
            $c.settings.service_saveReadNotifications = user_settings.service_saveReadNotifications_pro;
            $c.settings.service_saveRemoveNotifications = user_settings.service_saveRemoveNotifications_pro;
            $c.settings.service_readNumNotifications = user_settings.service_readNumNotifications_pro;
        }
        
    }
    else
    {
        if(DEBUG_MODE) console.log("startVariables DEFAULT");
		sendLog("Identificador: " + deviceIdentifier + " - funcion: startVariables - mensaje: By Default");
        
        var default_settings = {};
        default_settings.council = default_council;
        default_settings.language = default_language;
        councilToken = default_settings.council.id;
        languageToken = default_settings.language.name;
    }
    
    
    
}

function storeToken(deviceId, token) {
    
	if(DEBUG_MODE) console.log("START STORE TOKEN");
	sendLog("Identificador: " + deviceIdentifier + " - funcion: storeToken - mensaje: Init. DeviceId: " + deviceId + " tokenId: " + token);
	
    var councilToken = "";
    var languageToken = "";
    
    try
    {
		if(DEBUG_MODE) console.log("STORE TOKEN GET USER PROPERTIES");
    	councilToken = user_settings.council.id;
    	languageToken = user_settings.language.name;
        
    	if(DEBUG_MODE) console.log("STORE TOKEN SEND PUSH NOTIFICATIONS");
        
	  	var x = 0;
	    var y = 0;
        
	    var xmlhttp=new XMLHttpRequest();
	    xmlhttp.open("POST",$c.settings.service_pushnotifications,true);
	    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        
	    xmlhttp.send("product=Participa&idPlatformApp=1&idCouncil="+councilToken+"&idLanguage="+languageToken+"&idDevice="+deviceId+"&idToken="+token+"&OSDetails="+String(device.version)+"&lastPOSX=" + x + "&lastPOSY=" + y + "");

		console.log($c.settings.service_pushnotifications + "Identificador: " + deviceIdentifier + " - funcion: storeToken - mensaje: Save user properties: " + "product=Participa&idPlatformApp=1&idCouncil="+councilToken+"&idLanguage="+languageToken+"&idDevice="+deviceId+"&idToken="+token+"&OSDetails="+String(device.version)+"&lastPOSX=" + x + "&lastPOSY=" + y + "");
		sendLog($c.settings.service_pushnotifications + "Identificador: " + deviceIdentifier + " - funcion: storeToken - mensaje: Save user properties: " + "product=Participa&idPlatformApp=1&idCouncil="+councilToken+"&idLanguage="+languageToken+"&idDevice="+deviceId+"&idToken="+token+"&OSDetails="+String(device.version)+"&lastPOSX=" + x + "&lastPOSY=" + y + "");
	    
	    firstLoad = false;
	    
    }
    catch(e){
    	if(DEBUG_MODE) console.log("STORE TOKEN ERROR. MESSAGE:" + e);
		sendLog("Identificador: " + deviceIdentifier + " - funcion: storeToken - mensaje: Error save properties. Error message: " + e);
    	firstLoad = true;
    }
    
}


/*function storeTokenOld(token) {

    var councilToken = "";
    var languageToken = "";
    
    loadSavedSettings();
    if(typeof(user_settings) != 'undefined' && user_settings != null){
        councilToken = user_settings.council.id;
        languageToken = user_settings.language.name;
        try
        {
            $c.settings.service_url_base = user_settings.service_url;
            $c.settings.service_url_currenttype = user_settings.service_url_currenttype;
            $c.settings.service_checkApp = user_settings.service_checkApp;
            $c.settings.service_pushnotifications = user_settings.service_pushnotifications;
            $c.settings.service_device_role = user_settings.service_device_role;
        }
        catch(e)
        {
            if(DEBUG_MODE) console.log("STORE TOKEN DEFAULT CATCH ERROR");

            var default_settings = {};
            default_settings.council = default_council;
            default_settings.language = default_language;
            
            councilToken = default_settings.council.id;
            languageToken = default_settings.language.name;
            $c.settings.service_url_base = $c.settings.service_url_base_pro;
            $c.settings.service_url_currenttype = "PRO";
            $c.settings.service_checkApp = user_settings.service_checkApp_pro;
            $c.settings.service_pushnotifications = user_settings.service_pushnotifications_pro;
            $c.settings.service_device_role = user_settings.service_device_role_pro;
        }
        
    }
    else
    {
        if(DEBUG_MODE) console.log("STORE TOKEN DEFAULT");

        var default_settings = {};
        default_settings.council = default_council;
        default_settings.language = default_language;
        councilToken = default_settings.council.id;
        languageToken = default_settings.language.name;
    }
    
    try
    {
    
    mf.gps.get(function(){},function()
               {
               //navigator.notification.alert($c.maconf.lang.notifications.noGPS.text, function(){}, $c.maconf.lang.notifications.noGPS.title);
               });
    mf.gps.watch(function(pos){p = pos.coords;},function(){},1000);
    
    navigator.compass.getCurrentHeading(function(){}, function(){}, {});
    
    if(DEBUG_MODE) console.log($c.settings.service_pushnotifications + "product=Participa&idPlatformApp=1&idCouncil="+councilToken+"&idLanguage="+languageToken+"&idDevice="+token+"&OSDetails="+String(device.version)+"&lastPOSX=" + p.longitude + "&lastPOSY=" + p.latitude + "");
    
    if(DEBUG_MODE)console.log("UUID:" + device.uuid);
    
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.open("POST",$c.settings.service_pushnotifications,false);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    
    
    xmlhttp.send("product=Participa&idPlatformApp=1&idCouncil="+councilToken+"&idLanguage="+languageToken+"&idDevice="+token+"&OSDetails="+String(device.version)+"&lastPOSX=" + p.longitude + "&lastPOSY=" + p.latitude + "");
    
    }
    catch(e){
    }
    
}
 */

function setBadge(num) {
    var pushNotification = window.plugins.pushNotification;
    if(DEBUG_MODE) console.log("Clear badge... \n");
    pushNotification.setApplicationIconBadgeNumber(num);
}

function receiveStatus() {
    var pushNotification = window.plugins.pushNotification;
    pushNotification.getRemoteNotificationStatus(function(status) {
                                                 console.log(JSON.stringify(['Registration check - getRemoteNotificationStatus', status]));
                                                 });
}

function getPending() {
    var pushNotification = window.plugins.pushNotification;
    pushNotification.getPendingNotifications(function(notifications) {
                                             console.log(JSON.stringify(['getPendingNotifications', notifications]));
                                             });
}

// End Push Notifications functions

/****************************/
/*   Settings save / load   */
/****************************/
function loadSavedSettings(){
    
    var storage_value = null;
    
    try
    {
        window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0,
                             function (fileSystem) {
                             fileSystem.root.getFile($c.settings.saved_file_settings, {create: false},
                                                     function (fileEntry) {
                                                     var reader = new FileReader();
                                                     reader.onloadend = function(evt)
                                                     {
                                                        storage_value = evt.target.result;
                                                     
                                                        //var storage_value = window.localStorage.getItem($c.settings.saved_settings_key);
                                                        //alert("load save settings " + storage_value);
                                                        if(typeof(storage_value) != 'undefined' && storage_value != null)
                                                        {
                                                            user_settings = JSON.parse(storage_value);
                                                            //alert("load save settings. user_settings: " + JSON.stringify(user_settings));
                                                            if(DEBUG_MODE) console.log('Settings Loaded!');
                                                        }
                                                        else
                                                        {
                                                            //alert("load save settings null");
                                                            user_settings = null;
                                                            if(DEBUG_MODE) console.log('Loaded settings: No settings to load!');
                                                        }

                                                     
                                                     
                                                     };
                                                     reader.readAsText(fileEntry);
                                                     },
                                                     failLoadSettings);
                             },
                             failLoadSettings);
    
    }
    catch(e)
    {
    }
  
}


function saveSettings(){
    
    try
    {
        window.localStorage.setItem($c.settings.saved_settings_key, JSON.stringify(user_settings));
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
        if(DEBUG_MODE) console.log('Settings Saved!');
        
    }
    catch(e)
    {
    }
}

function updateUserSettings()
{
    try
    {
        storeToken(deviceIdentifier,deviceToken);
    }
    catch(e)
    {
    }
}

function sendLog(message)
{
	// Get user information
    try
    {
        var typeService = $c.settings.service_url_type;
        if ((typeService === 'PRE') || (typeService === 'DES'))
        {
        	var xmlhttp=new XMLHttpRequest();
        	xmlhttp.open("POST",$c.settings.service_logRegister,true);
        	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            
        	if(DEBUG_MODE) console.log("Information log: " + $c.settings.service_logRegister + "idDevice=" + deviceIdentifier + "versionApp=" + String(device.version) + "&errorMessagee="+message+"");
        	xmlhttp.send("idDevice=" + deviceIdentifier + "&versionApp=" + String(device.version) + "&errorMessage=" + message + "");
    	}
    }
    catch(e)
    {
        if(DEBUG_MODE) console.log("Error enviant log");
    }
}

function getDeviceId()
{
	// Get user information
    try
    {
        var xmlhttp=new XMLHttpRequest();
        xmlhttp.open("POST",$c.settings.service_generateGUID,false);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        
        if(DEBUG_MODE) console.log("Information getDeviceId: " + $c.settings.service_generateGUID);
        xmlhttp.send("");
        
        var deviceId = JSON.parse(xmlhttp.responseText);
        if(DEBUG_MODE) console.log("deviceId: " + deviceId.guid);
        deviceIdentifier = deviceId.guid;
    }
    catch(e)
    {
        deviceIdentifier = null;
    }

}


function getRole(userDeviceToken)
{
    // Get user information
    try
    {
        var xmlhttp=new XMLHttpRequest();
        xmlhttp.open("POST",$c.settings.service_device_role,false);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        
        if(DEBUG_MODE) console.log("Information response parameters: " + $c.settings.service_device_role + "product=Participa&idPlatformApp=1&idDevice="+userDeviceToken+"");
        xmlhttp.send("product=Participa&idPlatformApp=1&idDevice="+userDeviceToken+"");
        
        var roleInfo = JSON.parse(xmlhttp.responseText);
        if(DEBUG_MODE) console.log("roleInfo.result: " + roleInfo.result);
        $c.settings.service_url_type = roleInfo.result; //'DES'; //roleInfo.result;
    }
    catch(e)
    {
        $c.settings.service_url_type = 'PRO';
        if(DEBUG_MODE) console.log("Error getting Role Information response parameters: " + $c.settings.service_device_role + "product=Participa&idPlatformApp=1&idDevice="+userDeviceToken+"");
        sendLog("Identificador: " + userDeviceToken + " - funcion: getRole - mensaje: Error getRole. Error message: " + e);
    }
    
    return $c.settings.service_url_type;
}

/*
function getRoleOld(userDeviceToken)
{

    try
    {
        var xmlhttp=new XMLHttpRequest();
        xmlhttp.open("POST",$c.settings.service_device_role,false);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    
        if(DEBUG_MODE) console.log("Information response parameters: " + $c.settings.service_device_role + "product=Participa&idPlatformApp=1&idDevice="+userDeviceToken+"");
        xmlhttp.send("product=Participa&idPlatformApp=1&idDevice="+userDeviceToken+"");
    
        var roleInfo = JSON.parse(xmlhttp.responseText);
        if(DEBUG_MODE) console.log("roleInfo.result: " + roleInfo.result);
        $c.settings.service_url_type = roleInfo.result;
    }
    catch(e)
    {
        $c.settings.service_url_type = 'PRO';
    }
}
*/

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
    
            if(DEBUG_MODE) console.log("Information check app parameters:" + $c.settings.service_checkApp + "product=Participa&idPlatformApp=1&version="+$c.app.version+"");
            xmlhttp.send("product=Participa&idPlatformApp=1&version="+$c.app.version+"");
            if(DEBUG_MODE) console.log("check app response: " + xmlhttp.responseText);
            var versionInfo = JSON.parse(xmlhttp.responseText);
            result = (versionInfo.result == "OK" ? true: false);
            
            if (result == false)
            {
                var versionMsg = "Existe una nueva versión. Por favor actualice la aplicación";
                mf.loader.hide();
                navigator.notification.alert(versionMsg, function(){window.location="Intergraph.Participa://?participaError=PARTICIPA_ITUNES";}, "Participa Mobile");
            }
        }
        catch(e)
        {
            //if(DEBUG_MODE) alert("error"+e);
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
    sendLog("Identificador: " + deviceIdentifier + " - funcion: splashInit - mensaje: screen.height --> " + screen.height);
    sendLog("Identificador: " + deviceIdentifier + " - funcion: splashInit - mensaje: screen.width --> " + screen.width);
    
    if (screen.height == 480)
    {
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
        var link = $("<link>");
        link.attr({
                  type: 'text/css',
                  rel: 'stylesheet',
                  href: 'css/style5.css'
                  });
        $("head").append( link );
    }

    // If there is saved settings and they are loaded properly:
    if(typeof(user_settings) != 'undefined' && user_settings != null)
    {
        setTimeout(function(){navigator.splashscreen.hide()},10);
        
        // If there saved application ressources in the saved settings:
        if(typeof(user_settings.appsettings) == 'undefined' || user_settings.appsettings == null)
        {
                getAppRessources(function(){		// Load the app ressources from service.
                                 
                                 if (checkVersion())
                                 {
                                    preloadWelcome();				// And preload the welcome screen.
                                 }
                                 }, true);
        }
        else{
                $c.lang = user_settings.appsettings.loaders_and_errors;

                try
                {
                    $c.settings.service_url_base = user_settings.service_url;
                    $c.settings.service_url_currenttype = user_settings.service_url_currenttype;
                    $c.settings.service_checkApp = user_settings.service_checkApp;
                    $c.settings.service_pushnotifications = user_settings.service_pushnotifications;
                    $c.settings.service_device_role = user_settings.service_device_role;
                    $c.settings.service_generateGUID = user_settings.service_generateGUID;
                    $c.settings.service_logRegister = user_settings.service_logRegister;
                    $c.settings.service_getPropertiesIdToken = user_settings.service_getPropertiesIdToken;
                    $c.settings.service_getCategories = user_settings.service_getCategories;
                    $c.settings.service_setCategories = user_settings.service_setCategories;
                    $c.settings.service_notifications = user_settings.service_notifications;
                    $c.settings.service_saveReadNotifications = user_settings.service_saveReadNotifications;
                    $c.settings.service_saveRemoveNotifications = user_settings.service_saveRemoveNotifications;
                    $c.settings.service_readNumNotifications = user_settings.service_readNumNotifications;
                }
                catch(e)
                {
                    user_settings.council = default_council;
                    user_settings.language = default_language;
                    user_settings.service_url = $c.settings.service_url_base_pro;
                    user_settings.version = $c.app.version;
                    $c.settings.service_url_base = $c.settings.service_url_base_pro;
                    $c.settings.service_url_currenttype = "PRO";
                    $c.settings.service_checkApp = user_settings.service_checkApp_pro;
                    $c.settings.service_pushnotifications = user_settings.service_pushnotifications_pro;
                    $c.settings.service_device_role = user_settings.service_device_role_pro;
                    $c.settings.service_generateGUID = user_settings.service_generateGUID_pro;
                    $c.settings.service_logRegister = user_settings.service_logRegister_pro;
                    $c.settings.service_getPropertiesIdToken = user_settings.service_getPropertiesIdToken_pro;
                    $c.settings.service_getCategories = user_settings.service_getCategories_pro;
                    $c.settings.service_setCategories = user_settings.service_setCategories_pro;
                    $c.settings.service_notifications = user_settings.service_notifications_pro;
                    $c.settings.service_saveReadNotifications = user_settings.service_saveReadNotifications_pro;
                    $c.settings.service_saveRemoveNotifications = user_settings.service_saveRemoveNotifications_pro;
                    $c.settings.service_readNumNotifications = user_settings.service_readNumNotifications_pro;
                }
            
                if (checkVersion())
                    preloadWelcome();					// Continue directly to preload welcome screen.
        }
    }
    // If no saved settings:
    else{
        // Set default settings:
        user_settings = {};
        user_settings.deviceIdentifier = deviceIdentifier;
        user_settings.council = default_council;		
        user_settings.language = default_language;
        user_settings.service_url = $c.settings.service_url_base;
        user_settings.version = $c.app.version;
        user_settings.service_url_currenttype = $c.settings.service_url_currenttype;
        user_settings.service_checkApp = $c.settings.service_checkApp;
        user_settings.service_pushnotifications = $c.settings.service_pushnotifications;
        user_settings.service_device_role = $c.settings.service_device_role;
        user_settings.service_generateGUID = $c.settings.service_generateGUID;
        user_settings.service_logRegister = $c.settings.service_logRegister;
        user_settings.service_getPropertiesIdToken = $c.settings.service_getPropertiesIdToken;
        user_settings.service_getCategories = $c.settings.service_getCategories;
        user_settings.service_setCategories = $c.settings.service_setCategories;
        user_settings.service_notifications = $c.settings.service_notifications;
        user_settings.service_saveReadNotifications = $c.settings.service_saveReadNotifications;
        user_settings.service_saveRemoveNotifications = $c.settings.service_saveRemoveNotifications;
        user_settings.service_readNumNotifications = $c.settings.service_readNumNotifications;
        
        mf.loader.show($c.preloaded_errors_loaders[user_settings.language.code].loading_app_settings);
        
        // Get Council information
        var service_url = $c.settings.service_url_base + 'GetCouncils?$format=json';
        if(DEBUG_MODE) console.log("Service call: " + service_url);
    	
        // Calling the service:
        $.get(service_url, function(response){
           
                //if(DEBUG_MODE) console.log("Done! Response: " + JSON.stringify(response));
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
            navigator.notification.alert($c.preloaded_errors_loaders[user_settings.language.code].loading_app_settings_failed, function(){}, $c.preloaded_errors_loaders[user_settings.language.code].loading_app_settings_failed_title);
            window.location="Intergraph.Participa://?participaError=PARTICIPA_ERROR";
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
    
    var categoryHasChange = false;
    // Internal function for reapplying the ressources for the settingsscreen layout:
	function reapplySettingsRessources(){
        $('#title_bar_txt').text(user_settings.appsettings.settingsHeaderTitle);
        $('#settings_council').html(user_settings.appsettings.settingsCouncilTitle + ' <span class="right">' + user_settings.council.name + '</span>');
        $('#settings_language').html(user_settings.appsettings.settingsLanguageTitle + ' <span class="right">' + user_settings.language.name + '</span>');
        $('#settings_categories').html(user_settings.appsettings.categoryHeaderTitle + ' <span class="right"></span>');
            
        //$('#bottom_menu').html('<img id="home" src="' + $c.localgraphics.home + '"  height="100%" style="margin-right: 8px;" />');
        $('#bottom_menu').html('<img id="home" src="' + $c.localgraphics.home + '" height="90%" style="margin-right: 2px; padding-top: 2px;" />');
        
        
        $('#settings_token_label').text("Device identifier");
        $('#tokenId').html(deviceIdentifier);
	    $('#tokenId').css({'font-weight':'normal', 'font-size':'8px', 'color':'#2E2E2E', 'margin-top':'0px'});
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
        user_settings.service_url = $c.settings.service_url_base;
        user_settings.service_url_currenttype = $c.settings.service_url_currenttype;
        user_settings.service_checkApp = $c.settings.service_checkApp;
        user_settings.service_pushnotifications = $c.settings.service_pushnotifications;
        user_settings.service_device_role = $c.settings.service_device_role;
        user_settings.service_generateGUID = $c.settings.service_generateGUID;
        user_settings.service_logRegister = $c.settings.service_logRegister;
        user_settings.service_getPropertiesIdToken = $c.settings.service_getPropertiesIdToken;
        user_settings.service_getCategories = $c.settings.service_getCategories;
        user_settings.service_setCategories = $c.settings.service_setCategories;
        user_settings.service_notifications = $c.settings.service_notifications;
        user_settings.service_saveReadNotifications = $c.settings.service_saveReadNotifications;
        user_settings.service_saveRemoveNotifications = $c.settings.service_saveRemoveNotifications;
        user_settings.service_readNumNotifications = $c.settings.service_readNumNotifications;
        user_settings.deviceIdentifier = deviceIdentifier;
       	saveSettings();
        updateUserSettings();
        preloadWelcome();
    });
    
    /*$('#bottom_menu').bind('click',function(){
                         
        if(DEBUG_MODE) console.log("home clicked!");
        saveSettings();
        preloadWelcome();                   
     });*/
    
	// Events for the "prodbtn" button:
    $('#prodbtn').bind('click',function(){
                    
        $('#prodbtn').attr('src', $c.localgraphics.prdbtn_hover);
        resetSettings();
        $c.settings.service_url_base = $c.settings.service_url_base_pro;
        $c.settings.service_pushnotifications = $c.settings.service_pushnotifications_pro;
        $c.settings.service_device_role = $c.settings.service_device_role_pro;
        $c.settings.service_checkApp = $c.settings.service_checkApp_pro;
        $c.settings.service_url_currenttype = "PRO";
        $c.settings.service_generateGUID = $c.settings.service_generateGUID_pro;
        $c.settings.service_logRegister = $c.settings.service_logRegister_pro;
        $c.settings.service_getPropertiesIdToken = $c.settings.service_getPropertiesIdToken_pro;
        $c.settings.service_getCategories = $c.settings.service_getCategories_pro;
        $c.settings.service_setCategories = $c.settings.service_setCategories_pro;
        $c.settings.service_notifications = $c.settings.service_notifications_pro;
        $c.settings.service_saveReadNotifications = $c.settings.service_saveReadNotifications_pro;
        $c.settings.service_saveRemoveNotifications = $c.settings.service_saveRemoveNotifications_pro;
        $c.settings.service_readNumNotifications = $c.settings.service_readNumNotifications_pro;
        mf.page.show('splash');               
    });
    
	// Events for the "prebtn" button:
    $('#prebtn').bind('click',function(){
                       
       $('#prebtn').attr('src', $c.localgraphics.prebtn_hover);
       resetSettings();
       $c.settings.service_url_base = $c.settings.service_url_base_pre;
       $c.settings.service_pushnotifications = $c.settings.service_pushnotifications_pre;
       $c.settings.service_device_role = $c.settings.service_device_role_pre;
       $c.settings.service_checkApp = $c.settings.service_checkApp_pre;
       $c.settings.service_url_currenttype = "PRE";
       $c.settings.service_generateGUID = $c.settings.service_generateGUID_pre;
       $c.settings.service_logRegister = $c.settings.service_logRegister_pre;
       $c.settings.service_getPropertiesIdToken = $c.settings.service_getPropertiesIdToken_pre;
       $c.settings.service_getCategories = $c.settings.service_getCategories_pre;
       $c.settings.service_setCategories = $c.settings.service_setCategories_pre;
       $c.settings.service_notifications = $c.settings.service_notifications_pre;
       $c.settings.service_saveReadNotifications = $c.settings.service_saveReadNotifications_pre;
       $c.settings.service_saveRemoveNotifications = $c.settings.service_saveRemoveNotifications_pre;
       $c.settings.service_readNumNotifications = $c.settings.service_readNumNotifications_pre;
       mf.page.show('splash');
    });

	// Events for the "devbtn" button:
    $('#devbtn').bind('click',function(){
                       
        $('#devbtn').attr('src', $c.localgraphics.devbtn_hover);
        resetSettings();
        $c.settings.service_url_base = $c.settings.service_url_base_dev;
        $c.settings.service_pushnotifications = $c.settings.service_pushnotifications_dev;
        $c.settings.service_device_role = $c.settings.service_device_role_dev;
        $c.settings.service_checkApp = $c.settings.service_checkApp_dev;
        $c.settings.service_url_currenttype = "DES";
        $c.settings.service_generateGUID = $c.settings.service_generateGUID_dev;
        $c.settings.service_logRegister = $c.settings.service_logRegister_dev;
        $c.settings.service_getPropertiesIdToken = $c.settings.service_getPropertiesIdToken_dev;
        $c.settings.service_getCategories = $c.settings.service_getCategories_dev;
        $c.settings.service_setCategories = $c.settings.service_setCategories_dev;
        $c.settings.service_notifications = $c.settings.service_notifications_dev;
        $c.settings.service_saveReadNotifications = $c.settings.service_saveReadNotifications_dev;
        $c.settings.service_saveRemoveNotifications = $c.settings.service_saveRemoveNotifications_dev;
        $c.settings.service_readNumNotifications = $c.settings.service_readNumNotifications_dev;
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
        preloadCouncilslist(deviceIdentifier);
    });
    
    
    // Language selection handling:
    $('#settings_language').bind('click',function(){
        preloadLanguageslist(deviceIdentifier);
    });
    
    
    // Notifications categories selection handling:
    $('#settings_categories').bind('click',function(){
        preloadCategorieslist(deviceIdentifier);
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
          
          /*response.d.HOMEPAGEACTIVATED = true;
          response.d.URLHOMEPAGE = "http://participa.absis.es/ParticipaAdmin/html5.html";
          
          alert("html:" + response.d.HOMEPAGEACTIVATED );
          if (response.d.HOMEPAGEACTIVATED == true)
            mf.page.show('welcomeHtml5', welcome_information);
          else
            mf.page.show('welcome', welcome_information);
          */
          
          mf.page.show('welcome', welcome_information);
          
          
	},'JSON').error(function(msg){
		if(DEBUG_MODE) console.log("Failed to load welcome information: " + JSON.stringify(msg));
		mf.loader.hide();
                    //navigator.notification.alert($c.lang.settings.loading_council_info_failed, function(){}, $c.lang.settings.loading_council_info_failed_title);
                    navigator.notification.alert($c.preloaded_errors_loaders[user_settings.language.code].loading_app_settings_failed, function(){}, $c.preloaded_errors_loaders[user_settings.language.code].loading_app_settings_failed_title);
	});
    
}


function welcomeInit(welcome_information){
	$('#title_bar_txt').text(welcome_information.TITLE);
	
	var img = new Image();
	
	img.onload = function() {
		if(this.width > this.height)
			$('#welcome_banner').html('<img src="' + welcome_information.BANNER + '" width="100%" />');
		else
			$('#welcome_banner').html('<img src="' + welcome_information.BANNER + '" height="100%" />');
			
		$('#settings').attr("src", $c.localgraphics.settings ); 
		$('#settings').css({'display':'inline'});

		$('#settings').bind('click', function(){
                            
        $('#settings').attr("src", $c.localgraphics.settings_hover );
            setTimeout(function(){
                mf.page.show("settings", {});			// To settings screen.
            },100);
                            
        });
        
        // Notifications List
        $('#notifications').attr("src", $c.localgraphics.readNotificationsbtn );
		$('#notifications').css({'display':'inline'});

		$('#notifications').bind('click', function(){
                            
            $('#notifications').attr("src", $c.localgraphics.readNotificationsbtn_hover );
              setTimeout(function(){
              preloadNotificationlist(deviceIdentifier);  // Preload notifications screen.
           },100);
                            
        });
        // Notifications List

	    $('#welcome_title').css({'font-weight':'bold', 'font-size':'17px', 'color':'#2E2E2E'});
	    $('#welcome_title').text(welcome_information.WELCOMETXT);
	    $('#welcome_text').css({'font-style':'italic', 'font-size':'12px', 'color':'#2E2E2E'});
	    $('#welcome_text').text(welcome_information.SUBTITLE);

	    
	    $('#bottom_menu').html('<img id="start" src="' + $c.localgraphics.arrowright + '" height="90%" style="padding-top: 2px; padding-left: 10px;"  />');
	    
	    $('#start').bind('click', function(){
            $('#start').attr('src', $c.localgraphics.arrowright_hover);
            $('#start').css('cursor','pointer');
	        preloadCategory();						// To category screen.
            
	    });
		
        readNumberOfNotifications();
  	}
  	
	img.src = welcome_information.BANNER;	// Sets the source of the online image to be checked (this also initiates the load).
}

function readNumberOfNotifications()
{
    try
    {
        var serviceToCall = $c.settings.service_readNumNotifications;
        var councilToken = user_settings.council.id;
        
        var xmlhttp=new XMLHttpRequest();
        xmlhttp.open("POST",serviceToCall,false);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        if(DEBUG_MODE) console.log("readNumberOfNotifications: " + serviceToCall);
        if(DEBUG_MODE) console.log("idToken="+deviceIdentifier+"&idCouncil="+councilToken);
        xmlhttp.send("idToken="+deviceIdentifier+"&idCouncil="+councilToken);
        
        var numNotifications = JSON.parse(xmlhttp.responseText);
        if(DEBUG_MODE) console.log("readNumberOfNotifications: " + JSON.stringify(xmlhttp.responseText));
        if(DEBUG_MODE) console.log("readNumberOfNotifications: " + numNotifications.result);
        
        $('#notificationsNumber').text(numNotifications.result);
        
        if (numNotifications.result > 0)
            $('#notificationsNumber').css({'display':'inline'});
        else
            $('#notificationsNumber').css({'display':'none'});
    }
    catch(e)
    {
        $('#notificationsNumber').text("");
        $('#notificationsNumber').css({'display':'none'});
        if(DEBUG_MODE) console.log("Error getting read Number Of Notifications: " + e);
    }
    
}

function welcomeHtml5Init(welcome_information){
    
    childbrowser.showWebPage(welcome_information.URLHOMEPAGE, welcome_information.TITLE);
    
	/*$('#title_bar_txt').text(welcome_information.TITLE);

    $('#welcomePage').attr("src", welcome_information.URLHOMEPAGE );
    
    $('#welcome_banner').html('<img src="' + welcome_information.BANNER + '" width="100%" />');
    
    $('#settings').attr("src", $c.localgraphics.settings );
    $('#settings').css({'display':'inline'});
    
    // Notifications List
    $('#notifications').attr("src", $c.localgraphics.settings );
    $('#notifications').css({'display':'inline'});
    
    $('#notifications').bind('click', function(){
                             
                             $('#notifications').attr("src", $c.localgraphics.settings_hover );
                             setTimeout(function(){
                                        preloadNotificationlist(deviceIdentifier);  // Preload notifications screen.
                                        },100);
                             
                             });
    // Notifications List
    
    $('#welcome_title').css({'font-weight':'bold', 'font-size':'17px', 'color':'#2E2E2E'});
    $('#welcome_title').text(welcome_information.WELCOMETXT);
    $('#welcome_text').css({'font-style':'italic', 'font-size':'12px', 'color':'#2E2E2E'});
    $('#welcome_text').text(welcome_information.SUBTITLE);
    
    
    
    $('#bottom_menu').html('<img id="start" src="' + $c.localgraphics.arrowright + '" height="90%" style="padding-top: 2px; padding-left: 10px;"  />');
    
    $('#start').bind('click', function(){
                     $('#start').attr('src', $c.localgraphics.arrowright_hover);
                     $('#start').css('cursor','pointer');
                     preloadCategory();						// To category screen.
                     
                     });
    
    $('#settings').bind('click', function(){
                        
                        $('#settings').attr("src", $c.localgraphics.settings_hover );
                        setTimeout(function(){
                                   mf.page.show("settings", {});			// To settings screen.
                                   },100);
                        
                        });*/
    
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
  	$('#title_bar_txt').text(user_settings.appsettings.themeHeaderTitle);
    $('#bottom_menu').html('<img id="back" src="' + $c.localgraphics.arrowleft + '" height="90%" style="padding-top: 2px;margin-left: 2px;" />');
    
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
	
    
	// Send the user properties to dabase only the first time.
	if (firstLoad)
		storeToken(deviceIdentifier,deviceToken);
    

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

			
			$('<li />', {'id': 'li_' + i, 'name': 'li_' + i, 'style': 'width: ' + bg_offset_per_slice + 'px; height: ' + height + 'px; left: ' + left + 'px; top: ' + top + 'px; background: url(' + wheel_image_url + '); -webkit-transform-origin: ' + origin_x + 'px ' + origin_y + 'px; background-position:' + position + 'px 0;  -webkit-transform:rotate3d(0,0,1,' + degree + 'deg) translate3d(0, ' + translate + 'px,0);'}).appendTo('#zodiac');		        
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
	
    try
    {

        var products = theme_products.products;
        
        $('#title_bar_txt').text(user_settings.appsettings.productHeaderTitle + ' ' /*': '*/  + theme_products.themename);

        $('#bottom_menu').html('<img id="back" src="' + $c.localgraphics.arrowleft + '" height="90%" style="padding-top: 2px;margin-left: 2px;" /><img id="home" src="' + $c.localgraphics.home + '" height="90%" style="padding-top: 2px;margin-right: 2px; margin-left: 224px; display: none;" />');
        
        $('#back').bind("click", function(){
            $('#back').attr('src', $c.localgraphics.arrowleft_hover);
            preloadCategory();
        });
      
        $('#home').bind("click", function(){
            $('#home').attr('src', $c.localgraphics.home_hover);
            preloadCategory();
        });
        
        // Childbrowser plugin:
        childbrowser.onClose = function()
        {
        };
        childbrowser.onHome = function(){
            preloadCategory();
        };
        
        
        for(var i = 0; i <= products.length-1; i++){
            
            var productStyle = 'style="font-weight:' + (products[i].PRDTITLEFONTBOLDSTYLE == true ? 'bold' : 'normal');
            productStyle += ';font-size:' + products[i].PRDTITLEFONTSIZESTYLE + '"';

            var productDescriptionStyle = 'style="font-weight:' + (products[i].PRDDESCRIPTIONFONTCOLORSTYLE == true ? 'bold' : 'normal');
            productDescriptionStyle += ';font-size:' + products[i].PRDDESCRIPTIONFONTSIZESTYLE + '"';
            
            $('<div />', {'id': 'prolistitem' + i, 'class': 'productlist_item'}).append('<img src="' + products[i].PRDICON + '" width="30" height="30" style="float: left;"/><div class="productlist_item_text"><span ' + productStyle + '>' + products[i].PRDTITLE + '</span><br/><span ' + productDescriptionStyle + '>' + products[i].PRDDESCRIPTION + '</span></div>').appendTo('#prolist').bind('click', function(){
                

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
                                                                                                                                                                                                                                                                                                                                                              
                                childbrowser.showWebPage(product.PRDURL, product.PRDTITLE);    // Else	simply open the childbrowser with url as destination.
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
                            
                            if(DEBUG_MODE) console.log("Mobile alert product params: " + JSON.stringify(product));
                            initMobileAlert(product);
                            break;
                        }
                        case 4:{	// 4: Map
                            if(DEBUG_MODE) console.log("initMap product params: " + JSON.stringify(product));
                            initMap(product);
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
        
        // If only have 1 product try to go
        //if (products.length == 1)
        //    $( "#prolistitem0" ).click();
        
	}
    catch(e)
    {}
}

/********************************************************/
/*              Councils screen                    */
/********************************************************/
function preloadCouncilslist(deviceId){

    	mf.loader.show($c.lang.settings.loading_councils);
    	
    	var service_url = $c.settings.service_url_base + 'GetCouncils?$format=json&language=' + user_settings.language.code;
    	if(DEBUG_MODE) console.log("Service call: " + service_url);
    	
                                
    	// Calling the service:
    	$.get(service_url, function(response){
              
              mf.loader.hide();
              mf.page.show('councilsList', response.d);
	           	
        },'JSON').error(function(msg){
           		if(DEBUG_MODE) console.log("Failed to load councils: " + JSON.stringify(msg));
           		mf.loader.hide();
           		navigator.notification.alert($c.preloaded_errors_loaders[user_settings.language.code].loading_app_settings_council_failed, function(){}, $c.preloaded_errors_loaders[user_settings.language.code].loading_app_settings_council_failed_title);
           });
}

function councilsListInit(councils){
    
    
	$('#title_bar_txt').text(user_settings.appsettings.councilHeaderTitle);
    
    $('#bottom_menu').html('<img id="back" src="' + $c.localgraphics.arrowleft + '" height="90%" style="padding-top: 2px;margin-left: 2px;" />');
    
    $('#back').bind("click", function(){
         $('#back').attr('src', $c.localgraphics.arrowleft_hover);
         mf.page.show('settings', {});
    });
    
    var councilsListValues = [];
    
    for(var i = 0; i < councils.length; i++)
    {
        var councilItem = {};
        councilItem.Name = councils[i].councilName;
        councilItem.Id = councils[i].councilID;
        councilItem.Description = councils[i].councilName;
        councilItem.LangCode = councils[i].defaultCouncilLanguage;
        councilItem.LangDesc = councils[i].defaultconcilLanguageDesc;
        councilsListValues.push(councilItem);
    }
    
    
    var dataSource = new kendo.data.DataSource({
        schema   : {
            model: {
               fields: {
                    Name: { type: "string" },
                    Id: { type: "string" },
                    Description: { type: "string" },
                    LangCode: { type: "string" },
                    LangDesc: { type: "string" }
               }
            }
        },
        transport: {
           read: function (op) {
               op.success(councilsListValues);
           }
        }
    });
    
    $("#notlist").kendoListView({
        dataSource: dataSource,
        selectable: "single",
        dataBound : setItemDoubleClickEvent,
        template  : kendo.template($("#template").html())
    
    });

    var listView = $("#notlist").data("kendoListView");
    function setItemDoubleClickEvent() {
        $(".native_list_item", listView).on("click", function () {
            var uid = $(this).data("uid");
            var item = listView.dataSource.getByUid(uid);
            user_settings.council = {'id': item.Id, 'name': item.Name};
            user_settings.language.code = item.LangCode;
            user_settings.language.name = item.LangDesc;

            getAppRessources(function(){
               saveSettings();		// Save the new settings.
               updateUserSettings();
               mf.page.show('settings', {});                             
            }, false);

        });
    }

	// Sets up iScroll for the productlist:
	$('#notlist').css('height', $('#notlist').height() + 50);
    myScroll = new iScroll('content_area');
    
}

/********************************************************/




/********************************************************/
/*              Languagues screen                    */
/********************************************************/

function preloadLanguageslist(deviceId){
    
    
    mf.loader.show($c.lang.settings.loading_languages);
            
    var service_url = $c.settings.service_url_base + 'COUNCILS(' + user_settings.council.id + ')/LANGUAGES?$format=json&language=' + user_settings.language.code;
    if(DEBUG_MODE) console.log("Service call: " + service_url);
            
            // Calling the service:
    $.get(service_url, function(response){
                
        mf.loader.hide();
        mf.page.show('languagesList', response.d);
          
                    
    },'JSON').error(function(msg){
        if(DEBUG_MODE) console.log("Failed to load languages: " + JSON.stringify(msg));
        mf.loader.hide();
        navigator.notification.alert($c.preloaded_errors_loaders[user_settings.language.code].loading_app_settings_languages_failed, function(){}, $c.preloaded_errors_loaders[user_settings.language.code].loading_app_settings_languages_failed_title);
    });
    
    
}


function languagesListInit(languages){
    
	$('#title_bar_txt').text(user_settings.appsettings.languageHeaderTitle);
    
    $('#bottom_menu').html('<img id="back" src="' + $c.localgraphics.arrowleft + '" height="90%" style="padding-top: 2px;margin-left: 2px;" />');
    
    $('#back').bind("click", function(){
        $('#back').attr('src', $c.localgraphics.arrowleft_hover);
        mf.page.show('settings', {});
    });
    
    
    var languagesListValues = [];
    
    for(var i = 0; i < languages.length; i++)
    {
        var languageItem = {};
        languageItem.Name = languages[i].LANGUAGE;
        languageItem.Code = languages[i].IDLANGUAGE;
        languagesListValues.push(languageItem);
    }
    
    
    var dataSource = new kendo.data.DataSource({
        schema   : {
            model: {
               fields: {
                    Name: { type: "string" },
                    Code: { type: "string" }
               }
            }
        },
        transport: {
           read: function (op) {
               op.success(languagesListValues);
           }
        }
    });
    
    $("#notlist").kendoListView({
        dataSource: dataSource,
        selectable: "single",
        dataBound : setItemDoubleClickEvent,
        template  : kendo.template($("#templateLanguages").html())
    
    });

    var listView = $("#notlist").data("kendoListView");
    function setItemDoubleClickEvent() {
        $(".native_list_item", listView).on("click", function () {
            var uid = $(this).data("uid");
            var item = listView.dataSource.getByUid(uid);
                                        
            user_settings.language = {'name': item.Name, 'code': item.Code};	// Sets the corresponding language and language id.
            getAppRessources(function(){
                saveSettings();					// Save the new settings.
                mf.page.show('settings', {});
                             
                                     
            }, false);
                                            
        });
    }

	// Sets up iScroll for the notlist:
	$('#notlist').css('height', $('#notlist').height());
    myScroll = new iScroll('content_area');    
    
    
}

/********************************************************/






/********************************************************/
/*              Categories screen                    */
/********************************************************/
function preloadCategorieslist(deviceId){
    
    var categoriesSettings = JSON.parse(user_settings.appsettings.categoriesConf);
    mf.loader.show(categoriesSettings.categoryHeaderTitle); // $c.lang.settings.loading_languages
    
    var languageToken = "";
    var councilToken = "";
    var service_url = $c.settings.service_getCategories;
    
    // Get user information
    try
    {
        languageToken = user_settings.language.code;
        councilToken = user_settings.council.id;
        var xmlhttp=new XMLHttpRequest();
        xmlhttp.open("POST",service_url,false);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        
        if(DEBUG_MODE) console.log("preloadCategorieslist: " +service_url +"idCouncil="+councilToken+"&idProduct="+participaId+"&idLanguage="+languageToken+"&idToken="+deviceIdentifier+"");
        xmlhttp.send("idCouncil="+councilToken+"&idProduct="+participaId+"&idLanguage="+languageToken+"&idToken="+deviceIdentifier+"");
        
        
        var notificationsResult = JSON.parse(xmlhttp.responseText);
        
        if(DEBUG_MODE) console.log("preloadCategorieslist: " + JSON.stringify(xmlhttp.responseText));
        if(DEBUG_MODE) console.log("preloadCategorieslist: " + notificationsResult.length);
        
        mf.loader.hide();
        mf.page.show('categoriesList', notificationsResult);
        
        
    }
    catch(e)
    {
        mf.loader.hide();        
        if(DEBUG_MODE) console.log("Error preloadCategorieslist: " + e);
    }
    
}

function categoriesListInit(notificationsResult){
    
    canalsChanged = false;
	var languages = notificationsResult;
	
    if(DEBUG_MODE) console.log("languages: " + JSON.stringify(languages));
    
    var categoriesSettings = JSON.parse(user_settings.appsettings.categoriesConf);
    
    if(DEBUG_MODE) console.log("languages: " + JSON.stringify(categoriesSettings));
    
	$('#title_bar_txt').text(user_settings.appsettings.categoryHeaderTitle);
    
    $('#bottom_menu').html('<img id="back" src="' + $c.localgraphics.arrowleft + '" height="90%" style="padding-top: 2px;margin-left: 2px;" />');
    
    $('#back').bind("click", function(){
        
        if (languages.length > 0)
        {
            if (canalsChanged == true)
            {
                var alertTitle = categoriesSettings.categoryHeaderTitle;
                var alertMessage = categoriesSettings.alertCategoriesMessage;
                var buttonsStr = categoriesSettings.confirmButton + ", " + categoriesSettings.cancelButton;
                navigator.notification.confirm(alertMessage, function onConfirm(btn) {
                  
                    if(btn == 1)
                    {
                                           
                        if(DEBUG_MODE) console.log('yes');
             
                        try
                        {
                             var setCategories = "[";
                                           
                             for(var i = 0; i < languages.length; i++)
                             {
                                var category = {};
                                try
                                {
                                   setCategories += (i > 0 ? "," : "") + "{ 'idToken': '" + deviceIdentifier + "', 'idCategory': " + languages[i].IDCATEGORY + ", 'ACTIVED': " + languages[i].ACTIVED + "}";
                                
                                }
                                catch(e)
                                {
                                }
                          
                             }

                             setCategories += "]";
                                        
                             var xmlhttp=new XMLHttpRequest();
                             xmlhttp.open("POST",$c.settings.service_setCategories,false);
                             xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                             if(DEBUG_MODE) console.log("setCategories: " + $c.settings.service_setCategories);
                             if(DEBUG_MODE) console.log("param="+setCategories);
                             xmlhttp.send("param="+setCategories);
                        
                             if(DEBUG_MODE) console.log("setCategoriesResult: " + xmlhttp.responseText);
                             var setCategoriesResult = JSON.parse(xmlhttp.responseText);
                             if(DEBUG_MODE) console.log("setCategoriesResult: " + JSON.stringify(xmlhttp.responseText));
                             //alert("setCategories: " + $c.settings.service_setCategories + "param="+setCategories);

                         }
                         catch(e)
                        {

                        }

                        $('#back').attr('src', $c.localgraphics.arrowleft_hover);
                        mf.page.show('settings', {});
                    }
                    else{
                        if(DEBUG_MODE) console.log('no');
                        $('#back').attr('src', $c.localgraphics.arrowleft_hover);
                       mf.page.show('settings', {});
                    }
                }, alertTitle, buttonsStr);
            }
            else
            {
                $('#back').attr('src', $c.localgraphics.arrowleft_hover);
                mf.page.show('settings', {});
            }
                    
        }
        else
        {
            $('#back').attr('src', $c.localgraphics.arrowleft_hover);
            mf.page.show('settings', {});
        }
    });
    
    var notificationDate = "";
    var removeNotifId = "";
    
    // Populate the language list:
    for(var i = 0; i < languages.length; i++){
        
        $('<div />', {'id': 'categorieslistitem' + i, 'class': 'native_list_item'}).append('<div><dl><dt>' + languages[i].NAMETRANS + '</dt><dd><input id="email-switch' + i + '" data-role="switch" data-subscriptionId="' + i + '"/></dd></dl></div>').appendTo('#notlist');
    }
    
    for(var i = 0; i < languages.length; i++)
    {
        $("#email-switch" + i).kendoMobileSwitch({
                                                 checked: languages[i].ACTIVED,
                                                 onLabel: "YES",
                                                 offLabel: "NO",
                                                 id: i
        });
        
        $("#email-switch" + i).data("kendoMobileSwitch").bind("change", function(e) {
                                                    
            var id = e.sender.element.data("subscriptionid");
            languages[id].ACTIVED = e.checked;
            canalsChanged = true;
        });
        
    }
    
    
	// Sets up iScroll for the productlist:
	$('#notlist').css('height', $('#notlist').height() + 50);
    myScroll = new iScroll('content_area');
	
}

/********************************************************/



/********************************************************/
/*              Notifications screen                    */
/********************************************************/
function preloadNotificationlist(deviceId){
    
    mf.loader.show($c.lang.productlist.loading_products);
    
    var languageToken = "";
    var councilToken = "";
    var urlNotifications = $c.settings.service_notifications;
    
    // Get user information
    try
    {
        languageToken = user_settings.language.code;
        councilToken = user_settings.council.id;
        var xmlhttp=new XMLHttpRequest();
        xmlhttp.open("POST",urlNotifications,false);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        
        if(DEBUG_MODE) console.log("Information response parameters: " + urlNotifications + "&idLanguage="+languageToken+"&idToken="+deviceIdentifier+"&idCouncil="+councilToken);
        xmlhttp.send("idLanguage="+languageToken+"&idToken="+deviceIdentifier+"&idCouncil="+councilToken);
        
        
        var notificationsResult = JSON.parse(xmlhttp.responseText);
        
        if(DEBUG_MODE) console.log("notificationsResult: " + JSON.stringify(xmlhttp.responseText));
        if(DEBUG_MODE) console.log("notificationsResult: " + notificationsResult.length);
        
        mf.loader.hide();
        mf.page.show('notificationsList', notificationsResult);
        

    }
    catch(e)
    {
        if(DEBUG_MODE) console.log("Error preload Notificationlist. Information response parameters: " + urlNotifications + "&idLanguage="+languageToken+"&idToken="+deviceIdentifier+"");
        
        mf.loader.hide();
        mf.page.show('notificationsList', null);
    }
    
    
}

function notificationsListInit(notificationsResult){

    
    try
    {
        var listNotifications = notificationsResult;
        var notificationsSettings = JSON.parse(user_settings.appsettings.notificationsConf);
        
        $('#title_bar_txt').text(notificationsSettings.notificationHeaderTitle);
        
        $('#bottom_menu').html('<img id="back" src="' + $c.localgraphics.arrowleft + '" height="90%" style="padding-top: 2px;margin-left: 2px;" /><img id="home" src="' + $c.localgraphics.home + '" height="90%" style="padding-top: 2px;margin-right: 2px; margin-left: 224px; display: none;" />');
        
        $('#back').bind("click", function(){
            $('#back').attr('src', $c.localgraphics.arrowleft_hover);
            preloadWelcome();					// Back to welcome screen (reloads it from scracth).
        });
        
        $('#home').bind("click", function(){
            $('#home').attr('src', $c.localgraphics.home_hover);
            preloadWelcome();					// Back to welcome screen (reloads it from scracth).
        });
        
     
        var notificationDate = "";
        var removeNotifId = "";
        var readId = "";
        var removeId = "";
        
        if (listNotifications != null)
        {
            for(var i = 0; i <= listNotifications.length-1; i++){
                
                notificationDate = (listNotifications[i].TotalDays > 0 ? notificationsSettings.sinceText + " " + listNotifications[i].TotalDays + " " + notificationsSettings.dayText + " " : (listNotifications[i].TotalHours > 0 ? notificationsSettings.sinceText + " " + listNotifications[i].TotalHours + " " + notificationsSettings.hoursText : notificationsSettings.sinceText + " " + listNotifications[i].TotalMin + " " + notificationsSettings.minutesText));
                
                
                removeNotifId = listNotifications[i].IDNOTIFICATION;
                readId = "readImg" + i;
                removeId = "removeImg" + i;
                
                if (listNotifications[i].READED == 0)
                {
                    // onclick="javascript:removeNotication('+ i + ',' + removeNotifId + '); return false;"
                    // onclick="javascript:checkReadedNotication('+ i + ',' + removeNotifId + ');"
                    $('<div />', {'id': 'notlistitem' + i, 'class': 'productlist_item'}).append('<img src="' + listNotifications[i].URLICON + '" width="30" height="30" style="float: left;"/><img src="' + $c.localgraphics.removenotification + '" id="' + removeId + '" listPosition="' + i + '" removeNotifId="' + removeNotifId + '" width="30" height="30" style="float: right; top:20px;" /><img src="' + $c.localgraphics.readnotification + '" id="' + readId + '" listPosition="' + i + '" removeNotifId="' + removeNotifId + '" width="30" height="30" style="float: right; top: 0px;" /><div class="productlist_item_text"><span style="font-weight: bold;">' + listNotifications[i].CATEGORYNAME + '</span><br/><span>' + listNotifications[i].TEXTNOTIFICATION + '</span><br/>' + notificationDate + '</div>').appendTo('#notlist'); //.bind('click', function(){});
                    
                        $("#"+removeId).bind("click", function() {
                                             
                            var removeNotifIdItem = $(this).attr('removeNotifId');
                            var listPositionItem = $(this).attr('listPosition');
                            removeNotication(listPositionItem,removeNotifIdItem);
                                             return false;
                            
                        });
                    
                        $("#"+readId).bind("click", function() {
                            var removeNotifIdItem = $(this).attr('removeNotifId');
                            var listPositionItem = $(this).attr('listPosition');
                            checkReadedNotication(listPositionItem,removeNotifIdItem);
                                           return false;
                        });
                }
                else
                {
                    // onclick="javascript:removeNotication('+ i + ',' + removeNotifId + '); return false;"
                    $('<div />', {'id': 'notlistitem' + i, 'class': 'productlist_item'}).append('<img src="' + listNotifications[i].URLICON + '" width="30" height="30" style="float: left;"/><img src="' + $c.localgraphics.removenotification + '" id="' + removeId + '" listPosition="' + i + '" removeNotifId="' + removeNotifId + '" width="30" height="30" style="float: right; top:20px;" /><div class="productlist_item_text"><span style="font-weight: bold;">' + listNotifications[i].CATEGORYNAME + '</span><br/><span>' + listNotifications[i].TEXTNOTIFICATION + '</span><br/>' + notificationDate + '</div>').appendTo('#notlist'); //.bind('click', function(){});
                    
                        $("#"+removeId).bind("click", function() {
                            var removeNotifIdItem = $(this).attr('removeNotifId');
                            var listPositionItem = $(this).attr('listPosition');
                            removeNotication(listPositionItem,removeNotifIdItem);
                                             return false;
                        });
                }
            }
            
            console.log($('#notlistItems').html());
        }
        // Sets up iScroll for the productlist:
        $('#notlist').css('height', $('#notlist').height() + 50);
        myScroll = new iScroll('content_area');
    }
    catch(e)
    {
        preloadWelcome();					// Back to welcome screen (reloads it from scracth).
    }

	
}


function removeNotication(listPosition, notificationId)
{
    try
    {
        if(DEBUG_MODE) console.log("Called removeNotication function. NotificationId: " + notificationId);
        var notificationsSettings = JSON.parse(user_settings.appsettings.notificationsConf);

        var alertTitle = notificationsSettings.delNotificationTitle;
        var alertMessage = notificationsSettings.delNotificationsMessage;
        var buttonsStr = notificationsSettings.confirmButton + ", " + notificationsSettings.cancelButton;
        navigator.notification.confirm(alertMessage, function onConfirm(btn)
        {
                  
            if(btn == 1)
            {
                if(DEBUG_MODE) console.log('yes');
                var idToRemove = "#notlistitem" + listPosition;
                var readId = "#readImg" + listPosition;
                var removeId = "#removeImg" + listPosition;
                                       
                try
                {
                    var urlReadNotification = $c.settings.service_saveRemoveNotifications;
                    languageToken = user_settings.language.code;
                    var xmlhttp=new XMLHttpRequest();
                    xmlhttp.open("POST",urlReadNotification,false);
                    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        
                    if(DEBUG_MODE) console.log("Information response parameters: " + urlReadNotification + "&idNotification="+notificationId+"&idToken="+deviceIdentifier+"");
                    xmlhttp.send("idNotification="+notificationId+"&idToken="+deviceIdentifier+"");
        
        
                    var notificationsResult = JSON.parse(xmlhttp.responseText);
        
                    if(DEBUG_MODE) console.log("notificationsResult: " + JSON.stringify(xmlhttp.responseText));

                    $(idToRemove).css({'display':'none'});
                    $(idToRemove).remove();
                    $(readId).unbind();
                    $(removeId).unbind();
                                   
                }
                catch(e)
                {
                }

            }
            else{
                if(DEBUG_MODE) console.log('no');
       
            }
                                       
        }, alertTitle, buttonsStr);
    }
    catch(e)
    {
    }
    

}

function checkReadedNotication(listPosition, notificationId)
{
    try
    {
        var notificationsSettings = JSON.parse(user_settings.appsettings.notificationsConf);
        
        var alertTitle = notificationsSettings.readedNotificationTitle;
        var alertMessage = notificationsSettings.readedNotificationsMessage;
        var buttonsStr = notificationsSettings.confirmButton + ", " + notificationsSettings.cancelButton;
        navigator.notification.confirm(alertMessage, function onConfirm(btn)
        {
                  
            if(btn == 1){
                
                if(DEBUG_MODE) console.log('yes');
                var idToRemove = "#readImg" + listPosition;
         
                try
                {
                    var urlReadNotification = $c.settings.service_saveReadNotifications;
                    languageToken = user_settings.language.code;
                    var xmlhttp=new XMLHttpRequest();
                    xmlhttp.open("POST",urlReadNotification,false);
                    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        
                    if(DEBUG_MODE) console.log("Information response parameters: " + urlReadNotification + "&idNotification="+notificationId+"&idToken="+deviceIdentifier+"");
                    xmlhttp.send("idNotification="+notificationId+"&idToken="+deviceIdentifier+"");
        
        
                    var notificationsResult = JSON.parse(xmlhttp.responseText);
        
                    $(idToRemove).css({'display':'none'});
                                       
                    if(DEBUG_MODE) console.log("notificationsResult: " + JSON.stringify(xmlhttp.responseText));
            
                                   
                }
                catch(e)
                {

                }

            }
            else{
                if(DEBUG_MODE) console.log('no');
       
            }
                                       
        }, alertTitle, buttonsStr);
    }
    catch(e)
    {
        //alert("error: "+e);
    }

}

// End Notifications List
// *******************************************************************


function productmapviewInit(params){
	var theme_products = params.themeproducts;
	var product = params.product;
	var showProductView = params.showProductView;
	
	$('#title_bar_txt').text(user_settings.appsettings.consumeTitle);

	$('#bottom_menu').html('<img id="back" src="' + $c.localgraphics.arrowleft + '" height="90%" style="position: relative; float: left; padding-top: 2px;margin-left: 2px;" />' + 
			        							   '<img id="centermaploc" src="' + $c.localgraphics.target + '" height="90%" style="position: relative; float: left; margin-top: 0px; padding-top: 2px; margin-left: 2px;" />' +
			        							   '<input id="adressfield" type="text" name="adressfield" style="font-size: 12px; position: relative; float: left; width: 170px; height: 20px; top: 10px; margin-left: 6px; margin-right: 4px;" />' +
			        							   '<img id="done" src="' + $c.localgraphics.arrowright + '" height="90%" style="position: relative; float: left; padding-top: 2px;margin-left: 2px; margin-right: 2px; margin-top: 0px;" />' +
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
	
		var point = new OpenLayers.LonLat(p.longitude, p.latitude).transform(
			new OpenLayers.Projection("EPSG:4326"),
			map.getProjectionObject()
		);
	
		map.setCenter(point, 17);
	});	   
	
	
	// Next / ok handling:
	$('#done').bind("click", function(){

        $('#done').attr('src', $c.localgraphics.arrowright_hover);
                    
        setTimeout(function(){
		var lonlat = map.getLonLatFromPixel(new OpenLayers.Pixel(160,193/*208*/)).transform(map.getProjectionObject(),new OpenLayers.Projection("EPSG:4326"));
	
		var pos_from_map = {};
		
		pos_from_map.lat = lonlat.lat;
		pos_from_map.lon = lonlat.lon;
		pos_from_map.accuracy = -2;
		
		var params = {'product': product, 'themeproducts': theme_products, 'position':pos_from_map};
		
		if(DEBUG_MODE) console.log("params.showProductView: " + params.showProductView);
		
		if(showProductView){
			mf.page.show("documentview", params);
		}
		else{
			childbrowser.showWebPage(product.PRDURL + 'x=' + lonlat.lon + '&y=' + lonlat.lat, product.PRDTITLE);
            $('#done').attr('src', $c.localgraphics.arrowright);
		}
        },100);
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
	
	$('#title_bar_txt').text(product.PRDTITLE);

	
	if(product.PRDPREVIEWIMAGE_MODE == true){	
		$('#preview').css({'width': '80px', 'margin-right': '198px'});
		$('#preview').html('<img id="previewimage" src="' + product.PRDPREVIEWIMAGE + '" height="100%" width="100%" />');
	}
	else{	
		$('#preview').css({'width': '160px', 'margin-right': '118px'});
		$('#preview').html('<img id="previewimage" src="' + product.PRDPREVIEWIMAGE + '" height="100%" width="100%" />');
	}
		
	$('#header').text(product.PRDTITLE);
	$('#description').text(product.PRDLONGDESC);

	$('#bottom_menu').html('<img id="back" src="' + $c.localgraphics.arrowleft + '" height="90%" style="position: relative; float: left; padding-top: 2px;margin-left: 2px;" /><img id="home" src="' + $c.localgraphics.home + '" height="90%" style="position: relative; float: left; padding-top: 2px;margin-left: 240px; margin-right: 2px;" />'
			        							   );
			        							   
	childbrowser.onClose = function(){
		mf.page.show('productlist', theme_products);
        if (parseFloat(window.device.version) >= 7.0)
            document.body.style.marginTop = "20px";
        
	};
    
    
	// Back button handling:
	$('#back').bind("click", function(){
  
        $('#back').attr('src', $c.localgraphics.arrowleft_hover);

        setTimeout(function(){
                   
           if(product.REQUIRESPOSITION === 'true')
           {
              if(DEBUG_MODE) console.log('REQUIRESPOSITION = true');
                               
              var params = {'product': product, 'themeproducts': theme_products};
                               
              mf.page.show('productmapview', params);
           }	 
           else{
              mf.page.show('productlist', theme_products);
           }                       
        },100);
		
		
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
    			
                $('#content_area').css({'display':'none'});
    			$('#home').css({'display':'none'});
    			
    			if(typeof(position) != 'undefined' && position != null)
    				childbrowser.showWebPage(product.PRDURL + 'x=' + position.lon + '&y=' + position.lat, product.PRDTITLE); 
    			else
    				childbrowser.showWebPage(product.PRDURL, product.PRDTITLE); 
    		}
    		else{
    			if(DEBUG_MODE) console.log('no');
    			}
		  }, $c.lang.productlist.product_document_title, 'Yes, No');
                   
        },100);
	});
    
    // previewimage handling:
	$('#previewimage').bind("click", function(){
                        
        setTimeout(function(){
                                   
            navigator.notification.confirm($c.lang.productlist.product_document, function onConfirm(btn) {
            if(btn == 1){
                if(DEBUG_MODE) console.log('yes');
                                                                  
                $('#content_area').css({'display':'none'});
                $('#home').css({'display':'none'});
                                                                  
                if(typeof(position) != 'undefined' && position != null)
                    childbrowser.showWebPage(product.PRDURL + 'x=' + position.lon + '&y=' + position.lat, product.PRDTITLE); 
                else
                    childbrowser.showWebPage(product.PRDURL, product.PRDTITLE); 
                }
                else{
                    if(DEBUG_MODE) console.log('no');
                }
            }, $c.lang.productlist.product_document_title, 'Yes, No');
                                   
        },100);
    });

    
}

function initMap(params)
{
    var json = {};
    json.product = params;
    
    var MYVRURL = json.product.MYVRURL;
    var MYVR2D = false;
    var MYVRVIEW2D = "";
    var MYVR3D = false;
    var MYVRVIEW3D = "";
    
    if (json.product.MYVR2D != undefined)
    {
        if (json.product.MYVR2D != null)
        {
            if (json.product.MYVR2D == true)
            {
                if (json.product.MYVRVIEW2D != null)
                {
                    if (json.product.MYVRVIEW2D != "")
                    {
                        MYVR2D = true;
                        MYVRVIEW2D = json.product.MYVRVIEW2D;
                    }
                }
            }
        }
    }
    
    if (json.product.MYVR3D != undefined)
    {
        if (json.product.MYVR3D != null)
        {
            if (json.product.MYVR3D == true)
            {
                if (json.product.MYVRVIEW3D != null)
                {
                    if (json.product.MYVRVIEW3D != "")
                    {
                        MYVR3D = true;
                        MYVRVIEW3D = json.product.MYVRVIEW3D;
                    }
                }
            }
        }
    }
    
    var params = {};
    params['MYVRURL'] = MYVRURL;
    params['MYVR2D'] = MYVR2D;
    params['MYVRVIEW2D'] = MYVRVIEW2D;
    params['MYVR3D'] = MYVR3D;
    params['MYVRVIEW3D'] = MYVRVIEW3D;
    params['SEND'] = false;


    if(DEBUG_MODE) console.log("Params: " + JSON.stringify(params));
    if (validateMyvrParams(json.product) == true)
    {
    
        mf.gps.get(function(){},function()
                   {
                   //navigator.notification.alert($c.maconf.lang.notifications.noGPS.text, function(){}, $c.maconf.lang.notifications.noGPS.title);
                   });
        mf.gps.watch(function(pos){p = pos.coords;},function(){},1000);
        
        // SI navigator.compass.getCurrentHeading(function(){}, function(){}, {});
        // Start Case myVR
        mf.loader.hide();
        childMapbrowser.showMyVRPage(p.longitude, p.latitude, JSON.stringify(params));
    }
    // End Case myVR
    
}

/////////////////////////
// Mobile Alert flow:
/////////////////////////
function initMobileAlert(params){
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
          
          if(DEBUG_MODE) console.log("ma_init_data: " + JSON.stringify(ma_init_data));
          
          mf.loader.hide();
          
          mf.gps.get(function(){}, function(){
                     //navigator.notification.alert($maconf.lang.notifications.noGPS.text, function(){}, $maconf.lang.notifications.noGPS.title);
          });
			
		  //mf.gps.watch(function(pos){p = pos.coords;},function(){},1000);
		  mf.gps.watch(function(pos){p = pos.coords;},function(){},1000);
		  // SI navigator.compass.getCurrentHeading(function(){}, function(){}, {});
			
        
		  //navigator.compass.getCurrentHeading(function(){}, function(){}, {});
		
          // Start Change to remove the mobile alert front page
		  //mf.page.show('front', {});
          $('.pContent').hide();
          mf.loader.show($maconf.lang.loader.cameraText);
          //setTimeout("accelerometerInit();",3000);
          setTimeout(function(){
                     cameraInit(params);
          },1000);
          
          //setTimeout("cameraInit(" + params + ");",1000);
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
        //setTimeout("accelerometerInit();",3000);
        setTimeout("cameraInit();",1000);
    });
    
    $('#cancelbtn').bind('click',function(){

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


function cameraInit(params)
{
    	setTimeout(function(){mf.loader.hide();},1000);
        var onSuccess = function(imageData) 
		{
            if (parseFloat(window.device.version) >= 7.0)
                document.body.style.marginTop = "20px";
            
            var json = {};
			json.imageFile = imageData;
			json.heading = heading;
            json.product = params;
            
            if(DEBUG_MODE) console.log("cameraInit: " + JSON.stringify(json));
            
            mf.page.show('type',json);
		};

		var onFail =function(message) 
		{
            if (parseFloat(window.device.version) >= 7.0)
                document.body.style.marginTop = "20px";
            
			mf.loader.hide();
            // Start Change to remove the mobile alert front page
			// mf.page.show('front',{});
            preloadProductlist(ma_init_data.themeid, ma_init_data.themename);
            // End Change to remove the mobile alert front page

			if(DEBUG_MODE) console.log("Failed initializing camera!");

		};	
	navigator.camera.getPicture(onSuccess, onFail, { quality: 50, targetWidth: 640, targetHeight: 480, destinationType: navigator.camera.DestinationType.FILE_URI}); 
}


function typeInit(json)
{    

	if(DEBUG_MODE) console.log(JSON.stringify(ma_init_data));

    try{
        $('#title_bar_txt').text(user_settings.appsettings.incidenceHeaderTitle);
        
        $('#bottom_menu').html('<img id="back" src="' + $c.localgraphics.arrowleft + '" height="90%" style="padding-top: 2px;margin-left: 2px;" />');
        
        // Back button handling:
        $('#back').bind('click', function(){
                $('#back').attr('src', $c.localgraphics.arrowleft_hover);
                preloadProductlist(ma_init_data.themeid, ma_init_data.themename);
        });
        
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
    $('#title_bar_txt').text(user_settings.appsettings.emailHeaderTitle);
	$('#comment').attr('placeholder',$maconf.lang.form.placeholder);
	$('#emailcomment').attr('placeholder',$maconf.lang.form.textEmail);
    $('#emailItemLabel').text(" ");
    
    $('#emailcomment').bind('keypress', function(e) {
        if ((e.keyCode || e.which) == 13) {
           return false;
        }
    });
    
    $('#bottom_menu').html('<img id="back" src="' + $c.localgraphics.arrowleft + '" height="90%" style="position: relative; float: left; padding-top: 2px;margin-left: 2px;" /><img id="home" src="' + $c.localgraphics.arrowright + '" height="90%" style="position: relative; float: left; padding-top: 2px;margin-left: 240px; margin-right: 2px;" />'
                           );
    
    if(DEBUG_MODE) console.log("json input: " + JSON.stringify(json));
    
    $('#home').bind("click", function(){
        $('#home').attr('src', $c.localgraphics.arrowright_hover);
        if(online)
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
            params['deviceId'] = deviceIdentifier;
                    
                    
            var inputs = $("#form").serializeArray();
            for(var input in inputs)
                params[inputs[input].name] = String(inputs[input].value);
                    
            params['heading'] = String("-1");
            if(typeof(json.heading) != 'undefined')
            params['heading'] = String(json.heading);
                    
                    
            for(var k in p)
                params[k] = String(p[k]);
                    
                    
                    
                    
            setTimeout(function()
            {
                if(typeof(params['accuracy']) != 'undefined' && params['accuracy'] != null)
                {
                    // If GPS haven't gotten a fix yet.
                    if(parseFloat(params['accuracy']) > 1/*25 */)
                    {
                       
                        if (validateMyvrParams(json.product) == false)
                        {
                            if(DEBUG_MODE) console.log("Params: " + JSON.stringify(params));
                            // Start Case Openlayers
                            mf.loader.show($maconf.lang.loader.loadingMap);
                            mf.page.show('map',params);
                            // End Case Openlyaers
                        }
                        else
                        {
                            var MYVRURL = json.product.MYVRURL;
                            var MYVR2D = false;
                            var MYVRVIEW2D = "";
                            var MYVR3D = false;
                            var MYVRVIEW3D = "";
                       
                            if (json.product.MYVR2D != undefined)
                            {
                                if (json.product.MYVR2D != null)
                                {
                                    if (json.product.MYVR2D == true)
                                    {
                                        if (json.product.MYVRVIEW2D != null)
                                        {
                                            if (json.product.MYVRVIEW2D != "")
                                            {
                                                MYVR2D = true;
                                                MYVRVIEW2D = json.product.MYVRVIEW2D;
                                            }
                                        }
                                    }
                                }
                            }
                       
                            if (json.product.MYVR3D != undefined)
                            {
                                if (json.product.MYVR3D != null)
                                {
                                    if (json.product.MYVR3D == true)
                                    {
                                        if (json.product.MYVRVIEW3D != null)
                                        {
                                            if (json.product.MYVRVIEW3D != "")
                                            {
                                                MYVR3D = true;
                                                MYVRVIEW3D = json.product.MYVRVIEW3D;
                                            }
                                        }
                                    }
                                }
                            }
                       
                            params['MYVRURL'] = MYVRURL;
                            params['MYVR2D'] = MYVR2D;
                            params['MYVRVIEW2D'] = MYVRVIEW2D;
                            params['MYVR3D'] = MYVR3D;
                            params['MYVRVIEW3D'] = MYVRVIEW3D;
                            params['SEND'] = true;
                       
                            if(DEBUG_MODE) console.log("Params: " + JSON.stringify(params));
                            // Start Case myVR
                            mf.loader.hide();
                            childMapbrowser.showMyVRPage(params['longitude'], params['latitude'], JSON.stringify(params));
                            $('#home').attr('src', $c.localgraphics.arrowright);
                            // End Case myVR
                        }
                    }
                    else{
                        //Under 25 meters
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
    

    $('#back').bind("click", function()
    {
        $('#back').attr('src', $c.localgraphics.arrowleft_hover);
        setTimeout(function(){
            mf.page.show('type',json);    
        },100);
        
    });
    
    
	$('#btn').text($maconf.lang.form.sendButton);
	
	$('#btn').bind('click',function()
	{
        if(online)
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
            params['deviceId'] = deviceIdentifier;
			
                   
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
                if(typeof(params['accuracy']) != 'undefined' && params['accuracy'] != null){					// If GPS haven't gotten a fix yet.
                       if(parseFloat(params['accuracy']) > 1/*25 */)
                       {
                            if (usingMyvr == false)
                            {
                                // Start Case Openlayers
                                mf.loader.show($maconf.lang.loader.loadingMap);
                                mf.page.show('map',params);
                                // End Case Openlyaers
                            }
                            else
                            {
                                // Start Case myVR
                                mf.loader.hide();
                                childMapbrowser.showMyVRPage(params['longitude'], params['latitude'], JSON.stringify(params));
                                // End Case myVR
                            }
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
    
    childMapbrowser.onSendNotification = function(x, y, params){
        
        $('.pContent').hide();
        mf.loader.hide();

        var paramsToSend = {};
        paramsToSend = JSON.parse(params);
        paramsToSend.longitude = x;
        paramsToSend.latitude = y;
        paramsToSend.accuracy = -2;
        
        mf.gps.get(function(){},function()
                   {
                   //navigator.notification.alert($c.maconf.lang.notifications.noGPS.text, function(){}, $c.maconf.lang.notifications.noGPS.title);
                   });
        mf.gps.watch(function(pos){p = pos.coords;},function(){},1000);
        
        // SI navigator.compass.getCurrentHeading(function(){}, function(){}, {});
        paramsToSend.gpsLongitude = p.longitude;
        paramsToSend.gpsLatitude = p.latitude;
        
        if(DEBUG_MODE) console.log(paramsToSend);
        send(paramsToSend);
    };
    
    childMapbrowser.onHome = function(){
    };
	
}

function trim(str) {
    return str.replace(/^\s+|\s+$/g,"");
}

function validateMyvrParams(product)
{
    var validate = false;
    var validate2D = false;
    var validate3D = false;
    try
    {
        if (product.MYVRURL != undefined)
        {
            if (product.MYVRURL != null)
            {
                if (trim(product.MYVRURL) != "")
                {
                    if (product.MYVR2D != undefined)
                    {
                        if (product.MYVR2D != null)
                        {
                            if (product.MYVR2D == true)
                            {
                                if (product.MYVRVIEW2D != null)
                                {
                                    if (trim(product.MYVRVIEW2D) != "")
                                    {
                                        validate2D = true;
                                    }
                                }
                            }
                        }            
                    }
        
                    if (product.MYVR3D != undefined)
                    {
                        if (product.MYVR3D != null)
                        {
                            if (product.MYVR3D == true)
                            {
                                if (product.MYVRVIEW3D != null)
                                {
                                    if (trim(product.MYVRVIEW3D) != "")
                                    {
                                        validate3D = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
        validate = (validate2D || validate3D);
        
    }catch(e)
    {
        validate = false;
    }

    return validate;
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
    
    $('#mapSendButton').bind('click',function()
    {
            mf.gps.get(function(){},function()
            {
                                        //navigator.notification.alert($c.maconf.lang.notifications.noGPS.text, function(){}, $c.maconf.lang.notifications.noGPS.title);
            });
            mf.gps.watch(function(pos){p = pos.coords;},function(){},1000);
                             
            // SI navigator.compass.getCurrentHeading(function(){}, function(){}, {});
                    
    		var lonlat = map.getLonLatFromPixel(new OpenLayers.Pixel(160,208)).transform(map.getProjectionObject(),new OpenLayers.Projection("EPSG:4326"));
                             
    		json.longitude = lonlat.lon;
    		json.latitude = lonlat.lat;
    		json.accuracy = -2;
            json.gpsLongitude = p.longitude;
            json.gpsLatitude = p.latitude;
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
	//setTimeout(function(){mf.page.show('finished', {});}, 1500);
	
	// Disabled så vi ikke lige får send mens vi tester:
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
    $('#title_bar_txt').text($maconf.lang.finished.heading);
    $('#bottom_menu').html('<img id="finishbtn" src="' + $c.localgraphics.home + '" height="90%" style="padding-top: 2px; padding-left: 10px;" />');

	$('#finishedtext').text($maconf.lang.finished.text);
	//$('#finishbtn').text($maconf.lang.finished.newButton);

    
	$('#finishbtn').bind("click", function()
	{
        $('#finishbtn').attr('src', $c.localgraphics.home_hover);
        preloadProductlist(ma_init_data.themeid, ma_init_data.themename);
		/*$.get('conf/conf.js')
		.success(function(result) {
			$.globalEval(result);
			$c.lang = user_settings.appsettings.loaders_and_errors;
			preloadProductlist(ma_init_data.themeid, ma_init_data.themename);
		})
		.error(function(jqXHR, textStatus, errorThrown) {
			if(DEBUG_MODE) console.log('Error loading mobile alert config file');
		});*/
	});

}

