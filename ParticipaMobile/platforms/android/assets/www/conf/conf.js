(function(){
	var conf = 
	{
	    app:
        {
            version:'1.1.0.5'
        },
		settings:
		{
		    saved_file_settings:'participa_settings.txt',
            eula_file_settings:'participa_eula.txt',		    
            service_url_base:'http://service.participa.ws/Participa/Participa.svc/',            // Demo version
            service_url_base_pro:'http://service.participa.ws/Participa/Participa.svc/',        //Production version
            service_url_base_pre:'http://service.participa.ws/Participa-pre/Participa.svc/',    //PreProduction version
            service_url_base_dev:'http://participa.absis.es/Participa-pre/Participa.svc/',      //Test version
            service_url_type:'PRO',
            service_url_currenttype:'PRO',
			service_address_lookup_base:'http://nominatim.openstreetmap.org/search?q=',
			saved_settings_key:'cpp_saved_settings',
			mobilealert_send_url: 'http://participa.absis.es/participautils/Notification/SendNotification',
            service_pushnotifications: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/RegisterNewDevice/',
            service_pushnotifications_pro: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/RegisterNewDevice/',
            service_pushnotifications_pre: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/RegisterNewDevice/',
            service_pushnotifications_dev: 'http://participa.absis.es/ParticipaDevices/RegisterDevice/RegisterNewDevice/',
            service_device_role: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/roleDevice/',
            service_device_role_pro: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/roleDevice/',
            service_device_role_pre: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/roleDevice/',
            service_device_role_dev: 'http://participa.absis.es/ParticipaDevices/RegisterDevice/roleDevice/',
            service_checkApp: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/checkApp/',
            service_checkApp_pro: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/checkApp/',
            service_checkApp_pre: ' http://service.participa.ws/ParticipaDevices/RegisterDevice/checkApp/',
            service_checkApp_dev: 'http://participa.absis.es/ParticipaDevices/RegisterDevice/checkApp/',
            service_generateGUID: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/generateGUID/',
            service_generateGUID_pro: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/generateGUID/',
            service_generateGUID_pre: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/generateGUID/',
            service_generateGUID_dev: 'http://participa.absis.es/ParticipaDevices/RegisterDevice/generateGUID/',
            service_logRegister: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/logRegister/',
            service_logRegister_pro: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/logRegister/',
            service_logRegister_pre: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/logRegister/',
            service_logRegister_dev: 'http://participa.absis.es/ParticipaDevices/RegisterDevice/logRegister/',
            service_getPropertiesIdToken: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/getPropertiesIdToken/',
            service_getPropertiesIdToken_pro: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/getPropertiesIdToken/',
            service_getPropertiesIdToken_pre: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/getPropertiesIdToken/',
            service_getPropertiesIdToken_dev: 'http://participa.absis.es/ParticipaDevices/RegisterDevice/getPropertiesIdToken/',
			service_getCategories: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/getDeviceCouncilCategories?',
            service_getCategories_pro: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/getDeviceCouncilCategories?',
            service_getCategories_pre: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/getDeviceCouncilCategories?',
            service_getCategories_dev: 'http://participa.absis.es/ParticipaDevices/RegisterDevice/getDeviceCouncilCategories?',
            service_notifications: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/getNotDeletedDeviceNotifications/',
            service_notifications_pro: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/getNotDeletedDeviceNotifications/',
            service_notifications_pre: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/getNotDeletedDeviceNotifications/',
            service_notifications_dev: 'http://participa.absis.es/ParticipaDevices/RegisterDevice/getNotDeletedDeviceNotifications/',
            service_setCategories: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/setDeviceCategories?',
            service_setCategories_pro: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/setDeviceCategories?',
            service_setCategories_pre: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/setDeviceCategories?',
            service_setCategories_dev: 'http://participa.absis.es/ParticipaDevices/RegisterDevice/setDeviceCategories?',
            service_saveReadNotifications: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/readDeviceNotification/',
            service_saveReadNotifications_pro: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/readDeviceNotification/',
            service_saveReadNotifications_pre: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/readDeviceNotification/',
            service_saveReadNotifications_dev: 'http://participa.absis.es/ParticipaDevices/RegisterDevice/readDeviceNotification/',
            service_saveRemoveNotifications: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/delDeviceNotification/',
            service_saveRemoveNotifications_pro: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/delDeviceNotification/',
            service_saveRemoveNotifications_pre: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/delDeviceNotification/',
            service_saveRemoveNotifications_dev: 'http://participa.absis.es/ParticipaDevices/RegisterDevice/delDeviceNotification/',
            service_readNumNotifications: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/numNotReadedDeviceNotifications?',
            service_readNumNotifications_pro: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/numNotReadedDeviceNotifications?',
            service_readNumNotifications_pre: 'http://service.participa.ws/ParticipaDevices/RegisterDevice/numNotReadedDeviceNotifications?',
            service_readNumNotifications_dev: 'http://participa.absis.es/ParticipaDevices/RegisterDevice/numNotReadedDeviceNotifications?'          
		},
		localgraphics:
		{
			arrowleft:'images/icons/icon_arrow_left_b.png',
            arrowleft_hover:'images/icons/icon_arrow_left_w.png',
			arrowright:'images/icons/icon_arrow_right_b.png',
            arrowright_hover:'images/icons/icon_arrow_right_w.png',
			checkmark:'images/icons/icon_checkmark.png',
			arrowcircle:'images/icons/icon_circle_arrow_left.png',
			download:'images/icons/icon_download_b.png',
            download_hover:'images/icons/icon_download_w.png',
            home:'images/icons/home_b.png',
            home_hover:'images/icons/home_w.png',
			location:'images/icons/icon_locate_b.png',
 			location_hover:'images/icons/icon_locate_w.png',
			settings:'images/icons/icon_settings_b.png',
            settings_hover:'images/icons/icon_settings_w.png',
			addressbook:'images/icons/icon_address_lookup.png',
            addressbook_hover:'images/icons/icon_address_lookup.png',
			target:'images/icons/icon_locate_b.png',
            target_hover:'images/icons/icon_locate_w.png',
            prdbtn:'images/icons/public1.png',
            prdbtn_hover:'images/icons/public2.png',
            prebtn:'images/icons/preproduccio1.png',
            prebtn_hover:'images/icons/preproduccio2.png',
            devbtn:'images/icons/desenvol1.png',
            devbtn_hover:'images/icons/desenvol2.png',
            sendbtn:'images/icons/icon_send_b.png',
            sendbtn_hover:'images/icons/icon_send_w.png',
            removenotification:'images/icons/remove_notification.png',
            readnotification:'images/icons/readnotification.png',
            readNotificationsbtn:'images/icons/notification1.png',
            readNotificationsbtn_hover:'images/icons/Notification2.png',
            eulabtn:'images/icons/ACCEPT_EULA_b.png', 
            eulabtn_hover:'images/icons/ACCEPT_EULA.png'         	
		},
		preloaded_errors_loaders:
		{
			'en-EN':
			{
				loading_app_settings:'Loading application Settings',
				loading_app_settings_failed_title:'Failed to load application ressources',
				loading_app_settings_failed:'Please check your internet connection'	
			},
			'ca-ES':
			{
				loading_app_settings:"Carregant la configuraci&#243; de l'aplicaci&#243;",
				loading_app_settings_failed_title:"Error carregant els recursos de l'aplicaci&#243;",
				loading_app_settings_failed: 'Si us plau verificar la connexi&#243; a Internet'
			},
			'es-ES':
			{
				loading_app_settings: "Cargando la configuraci&#243;n de la aplicaci&#243;n",
				loading_app_settings_failed_title: "Error cargando los recursos de la aplicaci&#243;n",
				loading_app_settings_failed: 'Por favor verificar la conexi&#243;n a Internet'
			},
			'gl-ES':
			{
				loading_app_settings:" Cargando a configuraci&#243;n da aplicaci&#243;n",
				loading_app_settings_failed_title:" Error cargando os recursos da aplicaci&#243;n",
				loading_app_settings_failed:' Por favor verificar a conexi&#243;n a Internet'
			}			
		},		
		lang:
		{
		}
		
	}
	
	window.$c = conf;
})();