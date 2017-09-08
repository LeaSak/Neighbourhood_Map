(function(app, undefined) {
    'use strict';

    /*
     * Attraction Class constructor
     * Gets properties from Model
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


    /*
     * Venue View Model of App
     *
     *
     */

    var VenueVM = function() {
        var self = this;
        console.log('VenueVM');
        // Creates a ko observable array of location objects
        self.attractionList = ko.observableArray(ko.utils.arrayMap(app.initialPOI, function(attraction) {
            return new Attraction(attraction);
        }));
        // One line of google
        // switch to map
        // click callback function
        // return true to enable default link
        // behaviour when map is not available
        self.showLocation = function(venue) {
            if (app.mapvm.mapElem()) {
                var marker = venue.marker;
                app.sectionvm.activateSection(app.sectionvm.sections()[1]);
                google.maps.event.trigger(marker, 'click');
            } else {
                return true;
            }
        };

    };

    // create an instance of venueVM
    app.venuevm = new VenueVM();

})(window.app = window.app || {});