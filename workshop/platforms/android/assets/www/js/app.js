// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

  /* ---------------------------------- Local Variables ---------------------------------- */

  var slider = new PageSlider($('body'));


  var service = new EmployeeService();
  service.initialize().done(function () {
    router.addRoute('', function() {
      slider.slidePage(new HomeView(service).render().$el);

    });

    router.addRoute('employees/:id', function(id) {
      service.findById(parseInt(id)).done(function(employee) {
        slider.slidePage(new EmployeeView(employee).render().$el);

      });
    });

    router.start();
  });


  /* --------------------------------- Event Registration -------------------------------- */
    //$('.search-key').on('keyup', findByName);
    // $('.help-btn').on('click', function() {
    //     alert("Employee Directory v3.4");
    // });

/* ---------------------------------- Local Functions ---------------------------------- */

}());

document.addEventListener('deviceready', function () {
  // StatusBar.overlaysWebView( false );
  // StatusBar.backgroundColorByHexString('#ffffff');
  // StatusBar.styleDefault();

  if (navigator.notification) { // Override default HTML alert with native dialog
    window.alert = function (message) {
      navigator.notification.alert(
              message,    // message
              null,       // callback
              "Workshop", // title
              'OK'        // buttonName
              );
    };
  }

  FastClick.attach(document.body);

}, false);
