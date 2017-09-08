(function(app, undefined) {
    'use strict';

    // create a parent view model to house all view models
    var ViewModel = function(){
        console.log('ViewModel');
        this.mapVM = app.mapvm;
        this.sectionVM = app.sectionvm;
        this.venueVM = app.venuevm;
        this.searchVM = app.searchvm;
    }

    // create an instance of parent view model
    app.vm = new ViewModel();
    //ko.applyBindings(app.vm);

    // When Document is ready
    // apply bindings
    $(function() {
        console.log('DOM Content Loaded');
        ko.applyBindings(app.vm);

    });



})(window.app = window.app || {});