(function(app, undefined) {
    'use strict';

    function fourSq(array) {
        app.initialPOI.forEach(function(venue) {
            var foursquareClientID = 'V3SD0U1WAIJOPXUK4W2AR0DPZXUKFQQL5Y2FXKK4YO25FVX0';
            var foursquareClientSecret = 'NEH1GYLAFDS2CL5DSBFRO3DENB55KPWAVJE5ERBWQ1MGLD0X';
            var foursquareVersion = '20170801';
            var foursquareURL_venue = 'https://api.foursquare.com/v2/venues/' + venue.foursquareID;

            $.ajax({
                url: foursquareURL_venue,
                dataType: "jsonp",
                data: {
                    client_id: 'V3SD0U1WAIJOPXUK4W2AR0DPZXUKFQQL5Y2FXKK4YO25FVX0',
                    client_secret: 'NEH1GYLAFDS2CL5DSBFRO3DENB55KPWAVJE5ERBWQ1MGLD0X',
                    v: '20170801',
                    async: true
                },
                done: function(data) {
                    venue = data.response.venue;
                    array.push(new Attraction(venue));
                },
                error: function() {
                    array.push(new Attraction(venue));
                }
            });
        });
    }

    // var locationArray = [];
    // fourSq(locationArray);
    // console.log(locationArray);

    /*
     * Attraction Class constructor
     * Gets properties from Model
     */
    var Attraction = function(data) {
        var self = this;
        this.name = data.name;
        this.location = {
            lat: data.location.lat,
            lng: data.location.lng
        }
        this.address = data.location.address;
        this.postalCode = data.location.postalCode;
        this.city = 'Vienna';
        this.hours = data.popular.timeframes[0].open[0].renderedTime || 'Check website';
        this.url = ko.observable(data.shortUrl || data.url);
        this.foursquareID = data.foursquareID;
        this.marker = "";
        // this.marker = new google.maps.Marker({
        //     position: new google.maps.LatLng(
        //         self.location.lat,
        //         self.location.lng),
        //     map: map,
        //     title: self.name,
        //     id: self.foursquareID,
        //     animation: google.maps.Animation.DROP
        // });;
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
        }


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
        }

        // if map div is resized while hidden,
        // map needs to be resized.
        self.resizeMap = function() {
            var center = map.getCenter();
            google.maps.event.trigger(map, "resize");
            map.setCenter(center);
        }

        /*
         * Venue View
         */

        this.attractionList = ko.observableArray([]);

        fourSq(self.attractionList());

        console.log(self.attractionList());

        // Creates a ko observable array of location objects
        // this.attractionList = ko.observableArray(ko.utils.arrayMap(app.initialPOI, function(attraction) {
        //     return new Attraction(attraction);
        // }));

        // make input field an observable
        this.searchTerm = ko.observable('');

        // if the filteredItems has one match
        // let user open map and activate marker on enter key press
        this.returnSearchItem = function(formElement) {
            var venue;
            var totalVenues = self.filteredItems().length;
            // if only one item is found
            if (totalVenues === 1) {
                venue = self.filteredItems()[0];
                self.openMap(venue);
            }
            // if the array doesn't return any matches
            // TODO: Show no matches message
            else {
                return null;
            }

        }

        //return search results for listings in an array
        this.filteredItems = ko.computed(function() {
            var filterText = this.searchTerm().toLowerCase();
            if (!filterText) {
                return self.attractionList();
            } else {
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

            }
        }, this);
    };

    // // Assign View Model to a variable
    app.vm = new ViewModel();
    ko.applyBindings(app.vm);

})(window.app = window.app || {});