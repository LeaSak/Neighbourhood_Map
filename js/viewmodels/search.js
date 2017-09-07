(function(app, undefined) {
    'use strict';

    /*
     * Search View Model of App
     *
     */
    var SearchVM = function() {
        var self = this;
        console.log('SearchVM');

        // make input field an observable
        self.searchTerm = ko.observable('');

        self.clearSearch = function() {
            return self.searchTerm('');
        };

        // return search results for listings in an array
        // search is based on venue name
        // if map is shown, hide or show markers, infowindow
        self.filteredItems = ko.computed(function() {
            var filterText = self.searchTerm().toLowerCase();
            return ko.utils.arrayFilter(app.venuevm.attractionList(), function(venue) {
                if (venue.name.toLowerCase().indexOf(filterText) >= 0) {
                    if (app.mapvm.mapElem()) {
                        app.mapvm.showMarker(venue.marker);
                    }

                    return true;
                } else {
                    if (app.mapvm.mapElem()) {
                        app.mapvm.infowindow.close();
                        app.mapvm.hideMarker(venue.marker);
                    }
                    return false;
                }
            });

        }, self);

        // if the filteredItems has one match
        // let user open map and activate marker on enter key press
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

        // make search label observable
        self.searchLabel = ko.observable('');

        // this computes the search label text
        self.searchMessage = ko.computed(function() {
            return self.filteredItems().length === 0 ? 'Sorry, no matches. Try again.' : 'Filter destinations by venue name';
        }, self);

        // clear search input button
        self.cancelBtn = ko.observable();

        // show or hide clear search button
        self.showBtn = ko.computed(function() {
            if (self.searchTerm() === '') {
                self.cancelBtn(false);
            } else {
                self.cancelBtn(true);
            }
        });

    };

    // create an instance of search view model
    app.searchvm = new SearchVM();

})(window.app = window.app || {});