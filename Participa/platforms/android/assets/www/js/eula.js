
var eula = function () {

    /********************/
    /*   Eula screen    */
    /********************/

    function eulaInit(json)
    {
        $('#title_bar_txt').text("End-user license agreement (EULA)");

        //$c.preloaded_errors_loaders[user_settings.language.code].eula_ok
        //$c.preloaded_errors_loaders[user_settings.language.code].eula_cancel
        $('#bottom_menu').html('<img id="home" src="' + $c.localgraphics.eulabtn + '" height="90%" style="margin-right: 2px; padding-top: 2px;" />');

        // Events for the "Home" button:
        $('#home').bind('click',function(){
            $('#home').attr('src', $c.localgraphics.eulabtn_hover);
            if(DEBUG_MODE) console.log("home clicked!");
            createEULAFile();
            mf.page.show('splash');
        });

        //$('#wrapperEula').css('width', screen.width - 20);
        //$('#infoEula').css('width', screen.width - 20);
        //$('#infoEula').css('height',($('#content_area').height() - 30));
        var scroller = $("#infoEula").kendoMobileScroller();
        //$("#infoEula").data("kendoMobileScroller").reset();
        //    alert($('#wrapperEula').height() );
        //$('<div />', {'id': 'eula1', 'class': 'native_list_item'}).append('<div></div>').appendTo('#eulaParent');
        //alert($('#infoEula').height());
        // Sets up iScroll for the productlist:
        //$('#wrapperEula').css('height', $('#wrapperEula').height());
        //myScroll = new iscroll('content_area');
        //myScroll = new iscroll('wrapperEula');
        //$('#wrapperEula').css('height', $('#wrapperEula').height());


    }

    function loadEulaSettings(){

        var storage_value = null;

        try
        {
            window.requestFileSystem(window.LocalFileSystem.PERSISTENT,
                                     0,
                                     function (fileSystem)
                                     {
                                     fileSystem.root.getFile($c.settings.eula_file_settings, {create: false},
                                                             function (fileEntry) {
                                                             var reader = new FileReader();
                                                             reader.onloadend = function(evt)
                                                             {
                                                                showedEula = true;
                                                                //deleteFile($c.settings.eula_file_settings);
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


    function gotFSEula(fileSystem) {
        fileSystem.root.getFile($c.settings.eula_file_settings, {create: true, exclusive: false}, gotFileEntryEula, fail);
    }

    function gotFileEulaWriter(writer) {

        var eulaSetting = {};
        eulaSetting.version = "1";
        writer.write(JSON.stringify(eulaSetting));
    }


    function gotFileEntryEula(fileEntry) {
        fileEntry.createWriter(gotFileEulaWriter, failEula);
    }

    function failEula(error) {
        console.log(error.code);
    }

    function createEULAFile()
    {
        try
        {
            var eulaSetting = {};
            eulaSetting.version = "1";
            window.localStorage.setItem($c.settings.eula_file_settings, JSON.stringify(eulaSetting));
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFSEula, failEula);
            if(DEBUG_MODE) console.log('create EULAFile ok');
            showedEula = true;

        }
        catch(e)
        {
        }

    }

    // delete file
    function deleteFile(fileName){

            window.requestFileSystem(window.LocalFileSystem.PERSISTENT,
                                     0,
                                     function (fileSystem)
                                     {
                                     fileSystem.root.getFile(fileName, {create: false},
                                                             function (fileEntry) {

                                                             fileEntry.remove(function() {
                                                                              //displayDirectory();
                                                                              }, function(e) {});

                                                             },
                                                             failR);
                                     },
                                     failR);


    }

};