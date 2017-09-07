(function(app, undefined) {
    'use strict';

    // Map View Model
    var MapVM = function() {
        console.log('MapVM');
        var self = this;
        this.init = function() {

            self.mapDiv = document.getElementById('map');
            //create google map and append it to the page
            self.vienna = { lat: 48.2082, lng: 16.3738 };
            // Constructor creates a new map - only center and zoom are required.
            self.map = new google.maps.Map(self.mapDiv, {
                center: self.vienna,
                zoom: 13,
                mapTypeControl: false
            });
            // add a transit layer to map
            self.renderTransitLayer(self.map);

            // Create one infowindow
            // this could be moved outside of the initMap callback
            self.infowindow = new google.maps.InfoWindow({
                maxWidth: 300
            });

            //Create markers for each location
            // this could be moved outside of initMap callback
            self.renderMarkers(app.vm.searchVM.filteredItems());

            //resize map, tell it to redraw when window is resized
            google.maps.event.addDomListener(window, 'resize', self.resizeMap);
        };

        self.renderMarkers = function(list) {
            list.forEach(function(venue) {
                // create a marker
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(
                        venue.location.lat,
                        venue.location.lng),
                    map: self.map,
                    title: venue.name,
                    id: venue.foursquareID,
                    animation: google.maps.Animation.DROP
                });
                //assigning marker to venue property
                venue.marker = marker;
                marker.addListener('click', function() {
                    self.toggleBounceMarker(this);
                    self.populateInfowindow(this, self.infowindow, venue);

                });
                //create bounds for the map based on the marker position
                var bounds = new google.maps.LatLngBounds();
                bounds.extend(marker.position);
            });
        };

        self.renderTransitLayer = function(map) {
            self.transitLayer = new google.maps.TransitLayer();
            self.transitLayer.setMap(self.map);
        };

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

        self.showMarker = function(marker) {
            if (marker) {
                marker.setVisible(true);
            }
        };

        self.hideMarker = function(marker) {
            if (marker) {
                marker.setVisible(false);
            }
        };

        //redundant
        self.openInfoWindow = function(map, marker) {
            self.infowindow.open(self.map, marker);
        };

        //redundant
        self.closeInfoWindow = function() {
            self.infowindow.close();
        };

        // make ajax request
        self.getAJAXdata = function(venue) {
            var foursquareClientID = 'V3SD0U1WAIJOPXUK4W2AR0DPZXUKFQQL5Y2FXKK4YO25FVX0';
            var foursquareClientSecret = 'NEH1GYLAFDS2CL5DSBFRO3DENB55KPWAVJE5ERBWQ1MGLD0X';
            var foursquareVersion = '20170801';
            var foursquareURL_venue = 'https://api.foursquare.com/v2/venues/' + venue.foursquareID;

            return $.ajax({
                url: foursquareURL_venue,
                dataType: "jsonp",
                data: {
                    client_id: foursquareClientID,
                    client_secret: foursquareClientSecret,
                    v: foursquareVersion,
                }
            });
        };
        // create foursquare location object from data received.
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

        self.buildString = function(venue) {
            var htmlString = '<article class="infowindow-text">' +
                '<h2><a class="venue-link" href=' + venue.url + '>' +
                venue.name + '</h2></a>' +
                '<div class="contact-box"><i class="fa fa-map-marker" aria-hidden="true"></i>' +
                '<address>' + venue.address + ', ' + venue.postalCode + ' ' +
                venue.city + '</address></div>' +
                '<div class="time-box"><i class="fa fa-clock-o" aria-hidden="true"></i>' +
                '<p> Today: ' + venue.hours + '</p></div></article>';
            var foursquareString = htmlString + '<div class="image-box"><img class="foursquare-img" src="foursquare.png"></div>';
            return [htmlString, foursquareString];
        };

        // success callback for infowindow
        self.successCallback = function(data) {
            var ajaxData = self.fetchData(data);
            var htmlString = self.buildString(ajaxData)[1];
            self.infowindow.setContent(htmlString);
        };
        // error callback for infowindow
        self.failCallback = function(venue) {
            var htmlString = self.buildString(venue)[0];
            self.infowindow.setContent(htmlString);
        };

        // clear infowindow content
        // make ajax call to foursquare
        // get venue data and return a venue object
        // create infowindow string based on ajax results
        // open infowindow
        // close infowindow on click
        // if ajax call errors, use hard-coded location data
        // for infowindow content
        self.populateInfowindow = function(marker, infowindow, venue) {
            self.infowindow.setContent('Fetching..');

            self.getAJAXdata(venue).done(function(data) {
                self.successCallback(data);
            });

            self.getAJAXdata(venue).fail(function() {
                self.failCallback(venue);
            });

            //open infowindow with its anchor being the marker.
            self.openInfoWindow(self.map, marker);
            self.infowindow.addListener('closeclick', self.closeInfoWindow);
        };

        self.resizeMap = function() {
            var center = self.map.getCenter();
            google.maps.event.trigger(self.map, "resize");
            self.map.setCenter(center);
        };

        // Map Elem observable
        // Used for error messaging;
        self.mapElem = ko.observable(true);

        self.mapError = function() {
            self.mapElem(false);
        };

    }
    app.mapvm = new MapVM();

})(window.app = window.app || {});