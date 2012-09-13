var modules = modules || {};

/**
 * Back link that allows us to setup any link to be a link to the previous page.  No init method required
 * this runs immediately.
 * @param  {[type]} $ Gives us a local instance of jQuery
 * @return {[type]}              Exposes our public methods and properties
 */
modules.back = (function($){
    "use strict"; // Set our object to be in strict mode

    // Get the back link and bind our click event
    $("[data-plugin=back]").on("click",function(e){
        e.preventDefault();
        history.back();
    });

}(jQuery || {}));