(function(app, undefined) {
    'use strict';

    /**
     * @consructor ViewModel Class
     * @description A parent view model to house all view models
     */
    var ViewModel = function(){
        this.mapVM = app.mapvm;
        this.sectionVM = app.sectionvm;
        this.venueVM = app.venuevm;
        this.searchVM = app.searchvm;
    };

    // Create an instance of parent view model
    app.vm = new ViewModel();

    // When Document is ready apply bindings to ViewModel
    $(function() {
        ko.applyBindings(app.vm);

    });

})(window.app = window.app || {});