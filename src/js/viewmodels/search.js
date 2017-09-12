(function(app, undefined) {
    'use strict';

    /**
     * @description Search View Model
     * @class
     */
    var SearchVM = function() {
        var self = this;

        // Make input field an observable
        self.searchTerm = ko.observable('');


        /**
         * @description Clear search field.
         *
         */
        self.clearSearch = function() {
            return self.searchTerm('');
        };

        /**
         * @description Filters locations by name
         *
         */
        self.filteredItems = ko.computed(function() {
            var filterText = self.searchTerm().toLowerCase();
            return ko.utils.arrayFilter(app.venuevm.attractionList(), function(venue) {

                // If filter text matches venue name
                if (venue.name.toLowerCase().indexOf(filterText) >= 0) {

                    // If map is visible, show marker
                    if (app.mapvm.mapElem()) {
                        app.mapvm.showMarker(venue.marker);
                    }
                    return true;
                } else {

                    // If map is visible, close infowindow and hide marker
                    if (app.mapvm.mapElem()) {
                        app.mapvm.infowindow.close();
                        app.mapvm.hideMarker(venue.marker);
                    }
                    return false;
                }
            });

        }, self);

        /**
         * @description Opens Map View and animates Location
         * on enter key press if one match is found.
         */
        self.returnSearchItem = function() {
            var venue;
            var totalVenues = self.filteredItems().length;
            if (totalVenues === 1) {
                venue = self.filteredItems()[0];
                app.venuevm.showLocation(venue);
            } else {
                return null;
            }

        };

        // Make search label observable
        self.searchLabel = ko.observable('');

        /**
         * @description Determines input label text
         */
        self.searchMessage = ko.computed(function() {
            return self.filteredItems().length === 0 ? 'Sorry, no matches. Try again.' : 'Filter destinations by venue name';
        }, self);

        // Clear search button observable
        self.cancelBtn = ko.observable();

        /**
         * @description Show or hide clear search button
         */
        self.showBtn = ko.computed(function() {
            if (self.searchTerm() === '') {
                self.cancelBtn(false);
            } else {
                self.cancelBtn(true);
            }
        });

    };

    // Create an instance of SearchVM
    app.searchvm = new SearchVM();

})(window.app = window.app || {});