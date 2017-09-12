(function(app, undefined) {
    'use strict';

    /**
     * @description Custom JQuery FadeIn/FadeOut Binding
     * http://learn.knockoutjs.com/#/?tutorial=custombindings
     */
    ko.bindingHandlers.fadeVisible = {
        init: function(element, valueAccessor) {
            // Set the element to be instantly visible/hidden
            var value = valueAccessor();
            $(element).toggle(ko.unwrap(value));
        },
        update: function(element, valueAccessor) {
            // Slowly fade the element in or out
            var value = valueAccessor();
            ko.unwrap(value) ? $(element).fadeIn('fast') : $(element).fadeOut('fast');
        }
    };

    /**
     * @class Section Class
     */
    var Section = function(name, id) {
        this.name = name;
        this.id = id;
    };

    /**
     * @class Section View Model
     * @description Tab Functions
     * http://learn.knockoutjs.com/#/?tutorial=webmail
     */
    var SectionVM = function() {
        var self = this;

        // Observable array of sections
        self.sections = ko.observableArray([
            new Section("Search Venues", "venueView"),
            new Section("Map", "mapView")
        ]);

        /**
         * @description Keeps track of chosen section
         * Set Map Section as chosen onload.
         */
        self.chosenSection = ko.observable(self.sections()[1]);

        /**
         * @description Set click target as current chosen section
         * Trigger resize map if section is map
         * https://stackoverflow.com/questions/3782632/google-map-display-from-a-hidden-area?noredirect=1&lq=1
         */
        self.activateSection = function(section) {
            self.chosenSection(section);
            if (self.chosenSection().name === "Map") {
                app.mapvm.resizeMap();
            }
        };

        /**
         * @description Return true or false if element
         * matches ID of chosen section
         * @param {object} element
         */
        self.showContent = function(element) {
            return element === self.chosenSection().id;
        };
    };

    // Create an instance of SectionVM
    app.sectionvm = new SectionVM();


})(window.app = window.app || {});