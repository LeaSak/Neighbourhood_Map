(function(app, undefined) {
    'use strict';

    /**
     * @description All Google Map methods and properties
     * @class
     */
    var MapVM = function() {
        var self = this;
        self.init = function() {
            // Map is appended to this element.
            self.mapDiv = document.getElementById('map');

            // Create google map and append it to the page
            self.vienna = { lat: 48.2082, lng: 16.3738 };

            // Creates a new map - only center and zoom are required.
            self.map = new google.maps.Map(self.mapDiv, {
                center: self.vienna,
                zoom: 13,
                mapTypeControl: false
            });

            // Add a transit layer to map
            self.renderTransitLayer(self.map);

            // Create one infowindow
            self.infowindow = new google.maps.InfoWindow({
                maxWidth: 300
            });

            // Create markers for each location
            self.renderMarkers(app.vm.searchVM.filteredItems());

            // Resize map, tell it to redraw when window is resized
            google.maps.event.addDomListener(window, 'resize', self.resizeMap);
        };

        /**
         * @description Creates map markers
         * @param {array} list - the locations
         *
         */
        self.renderMarkers = function(list) {
            list.forEach(function(venue) {
                // create a marker
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(
                        venue.location.lat,
                        venue.location.lng),
                    map: self.map,
                    title: venue.name,
                    animation: google.maps.Animation.DROP
                });

                // Assign marker to venue
                venue.marker = marker;
                marker.addListener('click', function() {
                    self.toggleBounceMarker(this);
                    self.populateInfowindow(this, self.infowindow, venue);

                });

                // Create bounds for the map based on the marker position
                var bounds = new google.maps.LatLngBounds();
                bounds.extend(marker.position);
            });
        };

        /**
         * @description Adds transit layer to map
         * @param {object} map
         */

        self.renderTransitLayer = function(map) {
            self.transitLayer = new google.maps.TransitLayer();
            self.transitLayer.setMap(map);
        };

        /**
         * @description Animates marker
         * @param {object} marker
         */
        self.toggleBounceMarker = function(marker) {
            if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
            } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    marker.setAnimation(null);
                }, 1500);
            }
        };

        /**
         * @description Sets marker to visible
         * @param {object} marker
         */
        self.showMarker = function(marker) {
            if (marker) {
                marker.setVisible(true);
            }
        };

        /**
         * @description Hides marker
         * @param {object} marker
         */
        self.hideMarker = function(marker) {
            if (marker) {
                marker.setVisible(false);
            }
        };

        /**
         * @description Opens infowindow
         * @param {object} marker
         * @param {object} map
         */
        self.openInfoWindow = function(map, marker) {
            self.infowindow.open(self.map, marker);
        };

        /**
         * @description Closes infowindow
         */
        self.closeInfoWindow = function() {
            self.infowindow.close();
        };

        /**
         * @description Makes AJAX call to Foursquare API
         * @param {object} venue
         */
        self.getAJAXdata = function(venue) {
            var foursquareClientID = 'V3SD0U1WAIJOPXUK4W2AR0DPZXUKFQQL5Y2FXKK4YO25FVX0';
            var foursquareClientSecret = 'NEH1GYLAFDS2CL5DSBFRO3DENB55KPWAVJE5ERBWQ1MGLD0X';
            var foursquareVersion = '20170801';
            var foursquareURL_venue = 'https://api.foursquare.com/v2/venues/' + venue.foursquareID;

            var ajaxCall = $.ajax({
                url: foursquareURL_venue,
                dataType: "jsonp",
                data: {
                    client_id: foursquareClientID,
                    client_secret: foursquareClientSecret,
                    v: foursquareVersion,
                }
            });

            // Ajax success call
            ajaxCall.done(function(data) {
                self.successCallback(data);
            });

            // Ajax error call
            ajaxCall.fail(function() {
                self.failCallback(venue);
            });
        };

        /**
         * @description Assign values from AJAX response to venue properties
         * @param {object[]} data
         * @returns {object} venue
         */
        self.fetchData = function(data) {
            var location = data.response.venue;
            var venue = {};
            venue.url = location.canonicalUrl ? location.canonicalUrl : "#";
            venue.name = location.name ? location.name : "Name not provided";
            venue.address = location.location.address ? location.location.address : "Address not provided";
            venue.postalCode = location.location.postalCode ? location.location.postalCode : "Zipcode not provided";
            venue.city = location.location.city ? location.location.city : "City not provided";
            venue.hours = location.popular ? location.popular.timeframes[0].open[0].renderedTime : "Hours not provided";
            return venue;

        };

        /**
         * @description Creates an array of infowindow strings
         * @param {object} venue
         * @returns {array} - Infowindow Strings
         */
        self.buildString = function(venue) {
            var htmlString = '<article class="infowindow-text">' +
                '<h2><a class="venue-link" href=' + venue.url + '>' +
                venue.name + '</h2></a>' +
                '<div class="contact-box"><i class="fa fa-map-marker" aria-hidden="true"></i>' +
                '<address>' + venue.address + ', ' + venue.postalCode + ' ' +
                venue.city + '</address></div>' +
                '<div class="time-box"><i class="fa fa-clock-o" aria-hidden="true"></i>' +
                '<p class="hours"> Today: ' + venue.hours + '</p></div></article>';
            var foursquareString = htmlString + '<div class="image-box"><img class="foursquare-img" src="images/foursquare.png"></div>';
            return [htmlString, foursquareString];
        };

        /**
         * @description AJAX request success callback.
         * Takes response data to build infowindow string.
         * @param {object[]} data
         */
        self.successCallback = function(data) {
            var ajaxData = self.fetchData(data);
            var htmlString = self.buildString(ajaxData)[1];
            self.infowindow.setContent(htmlString);
        };

        /**
         * @description AJAX request failure callback.
         * Uses hard-coded data to build infowindow string.
         * @param {object} venue
         */
        self.failCallback = function(venue) {
            var htmlString = self.buildString(venue)[0];
            self.infowindow.setContent(htmlString);
        };


        /**
         * @description Builds infowindow string.
         * @param {object} marker
         * @param {object} infowindow
         * @param {object} venue
         */
        self.populateInfowindow = function(marker, infowindow, venue) {
            // Clear infowindow content
            self.infowindow.setContent('Fetching..');

            // Make AJAX call
            self.getAJAXdata(venue);

            // Open infowindow with its anchor being the marker.
            self.openInfoWindow(self.map, marker);

            // Close infowindow on click.
            self.infowindow.addListener('closeclick', self.closeInfoWindow);
        };

        /**
         * @description Make map responsive.
         */
        self.resizeMap = function() {
            var center = self.map.getCenter();
            google.maps.event.trigger(self.map, "resize");
            self.map.setCenter(center);
        };

        /**
         * @description Make map element observable.
         */
        self.mapElem = ko.observable(true);

        /**
         * @description Set map element to false/invisible.
         */
        self.mapError = function() {
            self.mapElem(false);
        };

    };

    // Create an instance of MapVM
    app.mapvm = new MapVM();

})(window.app = window.app || {});