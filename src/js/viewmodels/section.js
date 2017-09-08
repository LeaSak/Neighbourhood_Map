(function(app, undefined) {
    'use strict';

    // Section class
    var Section = function(name, id) {
        this.name = name;
        this.id = id;
    };


    /*
     * Section View Model of App
     *
     */
    var SectionVM = function() {
        var self = this;
        console.log('SectionVM');

        //observable array of sections
        // sections contain main content
        self.sections = ko.observableArray([
            new Section("Search Venues", "venueView"),
            new Section("Map", "mapView")
        ]);

        // Keeps track of which section is selected
        // Set Map as default open tab
        self.chosenSection = ko.observable(self.sections()[1]);

        // set click target as current chosen section
        // trigger resize map if condition met
        self.activateSection = function(section) {
            self.chosenSection(section);
            if (self.chosenSection().name === "Map") {
                app.mapvm.resizeMap();
            }
        };

        // this returns true or false if
        // conditions are met or not met.
        self.showContent = function(element) {
            return element === self.chosenSection().id;
        };
    };

    // create an instance of SectionVM
    app.sectionvm = new SectionVM();


})(window.app = window.app || {});