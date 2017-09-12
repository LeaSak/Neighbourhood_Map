(function(app, undefined) {
    'use strict';
    /**
     * @consructor Attraction Class
     */
    var Attraction = function(data) {
        this.name = data.name;
        this.location = {
            lat: data.location.lat,
            lng: data.location.lng
        };
        this.address = data.address;
        this.postalCode = data.postalCode;
        this.city = 'Vienna';
        this.hours = 'Check website';
        this.url = data.url;
        this.foursquareID = data.foursquareID;
        this.marker = "";
        this.tag = data.tag;
    };


    /**
     * @consructor Venue ViewModel
     * @description All venue related properties and methods
     */

    var VenueVM = function() {
        var self = this;

        /**
         * @description Creates an array of Attraction instances from data.js
         */
        self.attractionList = ko.observableArray(ko.utils.arrayMap(app.initialPOI, function(attraction) {
            return new Attraction(attraction);
        }));

        /**
         * @description Shows Location on Map
         * @param {object} venue
         */
        self.showLocation = function(venue) {
            // If map is appended
            // Go to Map Tab
            // Trigger marker click event
            if (app.mapvm.mapElem()) {
                var marker = venue.marker;
                app.sectionvm.activateSection(app.sectionvm.sections()[1]);
                google.maps.event.trigger(marker, 'click');
            } else {
                // Return true to enable default link
                // Behaviour when map is not appended.
                return true;
            }
        };

    };

    // Create an instance of venueVM
    app.venuevm = new VenueVM();

})(window.app = window.app || {});