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
        this.url = ko.observable(data.url);
        this.foursquareID = data.foursquareID;
        this.marker = "";
        this.tag = data.tag;
    };


    // Section class
    var Section = function(name, id) {
        this.name = name;
        this.id = id;
    };


    /*
     * View Model of App
     *
     */
    var ViewModel = function() {
        var self = this;
        console.log('View Model');
        /*
         * Sections
         */

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
                self.resizeMap();
            }
        };

        // this returns true or false if
        // conditions are met or not met.
        self.showContent = function(element) {
            return element === self.chosenSection().id;
        };


        /*
         * Map View
         */

        // Map Elem observable
        // Used for error messaging;
        self.mapElem = ko.observable(true);

        // switch to map
        // click callback function
        // return true to enable default link
        // behaviour when map is disabled
        self.openMap = function(venue) {
            if (self.mapElem()) {
                var marker = venue.marker;
                self.activateSection(self.sections()[1]);
                google.maps.event.trigger(marker, 'click');
            } else {
                return true;
            }
        };

        // if map div is resized while hidden,
        // map needs to be resized.
        self.resizeMap = function() {
            var center = map.getCenter();
            google.maps.event.trigger(map, "resize");
            map.setCenter(center);
        };

        self.renderMarkers = function(list) {
            list.forEach(function(venue) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(
                        venue.location.lat,
                        venue.location.lng),
                    map: map,
                    title: venue.name,
                    id: venue.foursquareID,
                    animation: google.maps.Animation.DROP
                });
                //assigning marker to venue property
                venue.marker = marker;
                marker.addListener('click', function() {
                    self.toggleMarker(marker);
                    self.populateInfowindow(marker, infowindow, venue);

                });
                //marker.addListener('click', fetchVenue.bind(null, marker, infowindow, venue), false);
                var bounds = new google.maps.LatLngBounds();
                bounds.extend(marker.position);
            }, list);
        }

        self.toggleMarker = function(marker) {
            if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
            } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    marker.setAnimation(null);
                }, 1500);
            }
        }

        self.populateInfowindow = function(marker, infowindow, venue) {
            infowindow.marker = marker;
            infowindow.setContent('Fetching...');
            infowindow.open(map, marker);
            infowindow.addListener('closeclick', function() {
                infowindow.setMarker = null;
            });

            self.getAJAXdata(venue).done(function(data) {
                var location = data.response.venue;
                var url = location.canonicalUrl ? location.canonicalUrl + '?' + data.client_id : venue.url();
                var name = location.name ? location.name : venue.name;
                var address = location.location.address ? location.location.address : venue.address;
                var postalCode = location.location.postalCode ? location.location.postalCode : venue.postalCode;
                var city = location.location.city ? location.location.city : venue.city;
                var hours = location.popular ? location.popular.timeframes[0].open[0].renderedTime : venue.hours;
                var htmlString = createContent(url, name, address, postalCode, city, hours)[1];
                infowindow.setContent(htmlString);
            });

            self.getAJAXdata(venue).fail(function() {
                var htmlString = createContent(venue.url(), venue.name, venue.address, venue.postalCode, venue.city, venue.hours)[0];
                infowindow.setContent(htmlString);
            });
        }

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
        }

        /*
         * Venue View
         */

        self.attractionList = ko.observableArray([]);

        // Creates a ko observable array of location objects
        self.attractionList = ko.observableArray(ko.utils.arrayMap(app.initialPOI, function(attraction) {
            return new Attraction(attraction);
        }));

        // make input field an observable
        self.searchTerm = ko.observable('');

        //clear search input button
        self.cancelBtn = ko.observable();

        // make search label observable
        self.searchLabel = ko.observable('');

        // if the filteredItems has one match
        // let user open map and activate marker on enter key press
        self.returnSearchItem = function(formElement) {
            var venue;
            var totalVenues = self.filteredItems().length;
            // if only one item is found
            if (totalVenues === 1) {
                venue = self.filteredItems()[0];
                self.openMap(venue);
            } else {
                return null;
            }

        };

        // return search results for listings in an array
        // search is base on venue name
        self.filteredItems = ko.computed(function() {
            var filterText = this.searchTerm().toLowerCase();
            return ko.utils.arrayFilter(this.attractionList(), function(attraction) {
                if (attraction.name.toLowerCase().indexOf(filterText) >= 0) {
                    if (attraction.marker) {
                        attraction.marker.setVisible(true);
                    }
                    return true;
                } else {
                    attraction.marker.setVisible(false);
                    infowindow.close();
                    return false;
                }
            });

        }, this);

        // this computes the search label text
        self.searchMessage = ko.computed(function() {
            return self.filteredItems().length === 0 ? 'Sorry, no matches. Try again.' : 'Filter destinations by venue name';
        }, self);

        self.clearSearch = function() {
            return self.searchTerm('');
        };

        self.showBtn = ko.computed(function() {
            if (self.searchTerm() === '') {
                self.cancelBtn(false);
            } else {
                self.cancelBtn(true);
            }
        });
    };

    // // Assign View Model to a variable
    app.vm = new ViewModel();
    ko.applyBindings(app.vm);



})(window.app = window.app || {});