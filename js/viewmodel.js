(function(app, undefined) {
    'use strict';

    /* Global variables
     *
     */
    var map;

    // public method
    // callback in Google Maps API request
    // what the map first looks like when it loads
    // adds markers to the view model

    app.initMap = function() {
        console.log("initMap");
        var mapElem = document.getElementById('map');
        //create google map and append it to the page
        var vienna = { lat: 48.2082, lng: 16.3738 };
        // declare bounds of map
        var bounds = new google.maps.LatLngBounds();

        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(mapElem, {
            center: vienna,
            zoom: 13
        });

        var transitLayer = new google.maps.TransitLayer();
        transitLayer.setMap(map);

        //create one info window for all markers
        var infowindow = new google.maps.InfoWindow({
            maxWidth: 250
        });

        // create a marker for each location
        // attach marker to attraction object
        // define click events on marker
        vm.filteredItems().forEach(function(attraction) {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(
                    attraction.location.lat,
                    attraction.location.lng),
                map: map,
                title: attraction.name,
                animation: google.maps.Animation.DROP,
                gestureHandling: 'cooperative',
                //scrollwheel: false
            });
            // assign marker to attraction
            attraction.marker = marker;
            // adjust boundaries for each location
            bounds.extend(marker.position);
            // Extend the boundaries of the map for each marker
            map.fitBounds(bounds);

            //add event listener to marker
            marker.addListener('click', function() {
                toggleBounce();
                getInfoWindowContent();
            });

            // toggle Bounce marker with setTimeout
            function toggleBounce() {
                if (attraction.marker.getAnimation() !== null) {
                    attraction.marker.setAnimation(null);
                } else {
                    attraction.marker.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(function() {
                        attraction.marker.setAnimation(null);
                    }, 1500);
                }
            }

            // get infowindow content
            function getInfoWindowContent() {
                infowindow.marker = attraction.marker;
                setVenueContent();
                infowindow.open(map, attraction.marker);
                infowindow.addListener('closeclick', function() {
                    infowindow.setMarker = null;
                });
            };

            // create infowindow string
            function getInfoString(){
                var contentArray = [];

                var foursquareString = '<article class="infowindow-text">' +
                            '<h1><a class="venue-link" href=' + attraction.url + '>' +
                            attraction.name + '</a></h1>' +
                            '<div class="contact-box"><i class="fa fa-map-marker" aria-hidden="true"></i>' +
                            '<address>' + attraction.address + ', ' + attraction.postalCode + ' ' +
                            attraction.city + '</address></div>' +
                            '<div class="time-box"><i class="fa fa-clock-o" aria-hidden="true"></i>' +
                            '<p> Today: ' + attraction.hours + '</p></div>' +
                            '<div class="image-box"><img class="foursquare-img" src="foursquare.png"></div></article>';

                var dataModelString = '<article class="infowindow-text">' +
                            '<h1><a class="venue-link" href=' + attraction.url + '>' +
                            attraction.name + '</a></h1>' +
                            '<div class="contact-box"><i class="fa fa-map-marker" aria-hidden="true"></i>' +
                            '<address>' + attraction.address + ', ' + attraction.postalCode + ' ' +
                            attraction.city + '</address></div></article>';

                contentArray.push(foursquareString, dataModelString);

                            return contentArray;
            }

            // update venue information in DOM
            function setVenueContent() {
                var foursquareClientID = 'V3SD0U1WAIJOPXUK4W2AR0DPZXUKFQQL5Y2FXKK4YO25FVX0';
                var foursquareClientSecret = 'NEH1GYLAFDS2CL5DSBFRO3DENB55KPWAVJE5ERBWQ1MGLD0X';
                var foursquareVersion = '20170801';
                var foursquareURL_venue = 'https://api.foursquare.com/v2/venues/' + attraction.foursquareID;

                $.ajax({
                    url: foursquareURL_venue,
                    dataType: "jsonp",
                    data: {
                        client_id: 'V3SD0U1WAIJOPXUK4W2AR0DPZXUKFQQL5Y2FXKK4YO25FVX0',
                        client_secret: 'NEH1GYLAFDS2CL5DSBFRO3DENB55KPWAVJE5ERBWQ1MGLD0X',
                        v: '20170801',
                        async: true
                    },
                    success: function(data){
                        console.log(data.response.venue);
                        attraction.url = data.response.venue.canonicalUrl + '?' + foursquareClientID;
                        attraction.name = data.response.venue.name || attraction.name;
                        attraction.address = data.response.venue.location.address || attraction.address;
                        attraction.postalCode = data.response.venue.location.postalCode || attract.postalCode;
                        attraction.city = data.response.venue.location.city || attraction.city;
                        attraction.hours = data.response.venue.popular.timeframes[0].open[0].renderedTime || 'Unknown';
                        var html = getInfoString()[0];
                        infowindow.setContent(html);
                    },
                    error: function(){
                        var html = getInfoString()[1]
                        infowindow.setContent(html);
                    }
                });
            }

        });

        //resize map, tell it to redraw when window is resized
        google.maps.event.addDomListener(window, 'resize', function() {
            var center = map.getCenter();
            google.maps.event.trigger(map, 'resize');
            map.setCenter(center);
        });
    };

    // Google maps load error
    app.mapError = function() {
        console.log('Google Maps failed to load. Please reload the page.');
    }

    /*
     * Attraction Class constructor
     * Gets properties from Model
     */
    var Attraction = function(data) {
        this.name = data.name;
        this.location = {
            lat: data.location.lat,
            lng: data.location.lng
        }
        this.address = '';
        this.postalCode = '';
        this.city = 'Vienna';
        this.phone = '';
        this.url = '';
        this.foursquareID = data.foursquareID;
        this.marker = '';
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
        console.log("ViewModel");
        var self = this;

        /*
         * UI View Model
         */
        self.chosenTab = ko.observable();

        //observable array of sections
        self.sections = ko.observableArray([
            new Section("Venues", "venueView"),
            new Section("Map", "mapView")
        ]);

        //set click target as current chosen object/tab
        self.activateSection = function(tab) {
            self.chosenTab(tab);
            self.resizeMap();
        };

        // if map div is resized while hidden,
        // map needs to be resized.
        self.resizeMap = function() {
            if (self.chosenTab().id === "mapView") {
                var center = map.getCenter();
                google.maps.event.trigger(map, "resize");
                map.setCenter(center);
            }
        }

        self.showContent = function(element) {
            return element === self.chosenTab().id;
        }

        //switch to map
        self.openMap = function(attraction) {
            self.activateSection(self.sections()[1]);
            google.maps.event.trigger(attraction.marker, 'click');
        }


        // Set Map as default open tab
        self.chosenTab(self.sections()[1]);


        /*
         * Content View Model
         */

        // Creates a ko observable array of location objects
        this.attractionList = ko.observableArray(ko.utils.arrayMap(app.initialPOI, function(attraction) {
            return new Attraction(attraction);
        }));

        //console.log(this.attractionList()[0]);

        // make input field an observable
        this.searchTerm = ko.observable('');

        //return search results for listings in an array
        // Google dependent
        this.filteredItems = ko.computed(this._filter, this);

    };

    ViewModel.prototype._filter = function() {
        var filterText = this.searchTerm().toLowerCase();
        return ko.utils.arrayFilter(this.attractionList(), function(attraction) {
            if (attraction.name.toLowerCase().indexOf(filterText) >= 0) {
                if (attraction.marker) {
                    attraction.marker.setVisible(true);
                }
                return true;
            } else {
                attraction.marker.setVisible(false);
                return false;
            }
        });
    }

    // // Assign View Model to a variable
    var vm = new ViewModel();
    ko.applyBindings(vm);

})(window.app = window.app || {});