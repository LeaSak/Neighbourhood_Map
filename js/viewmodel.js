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

        //create one info window for all markers
        var infowindow = new google.maps.InfoWindow({
            maxWidth: 250
        });

        // create a marker for each location
        // attach marker to attraction object
        app.initialPOI.forEach(function(attraction) {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(
                    attraction.location.lat,
                    attraction.location.lng),
                    map: map,
                title: attraction.name,
                animation: google.maps.Animation.DROP,
            });
            // assign marker to attraction
            attraction.marker = marker;
            // adjust boundaries for each location
            bounds.extend(marker.position);
            // Extend the boundaries of the map for each marker
            map.fitBounds(bounds);

            // add event listener to marker
            marker.addListener('click', function() {
                getInfoWindowContent();
                toggleBounce();
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

            // create infowindow content
            function getInfoWindowContent() {
                infowindow.marker = attraction.marker;
                infowindow.setContent('<div>' + attraction.marker.title + '</div>');
                infowindow.open(map, attraction.marker);
                infowindow.addListener('closeclick', function() {
                    infowindow.setMarker = null;
                });
            };

        });

        // // Assign View Model to a variable
        var vm = new ViewModel();
        ko.applyBindings(vm);

    };

    // Google maps load error
    app.mapError = function(){
        alert('Google Maps failed to load. Please reload the page.');
    }

    /*
     * Attraction Class constructor
     * Gets properties from Model
     */
    var Attraction = function(data) {
        this.name = ko.observable(data.name);
        this.location = data.location;
        this.marker = data.marker;
    };

    /*
     * View Model of App
     *
     */
    var ViewModel = function() {
        console.log("ViewModel");

        // Creates a ko observable array of location objects
        this.attractionList = ko.observableArray(ko.utils.arrayMap(app.initialPOI, function(attraction) {
            return new Attraction(attraction);
        }));

        // make input field an observable
        this.searchTerm = ko.observable('');

        //return search results for listings in an array
        // Google dependent
        this.filteredItems = ko.computed(this._filter, this);


    };

    ViewModel.prototype._filter = function(){
        var filterText = this.searchTerm().toLowerCase();
             return ko.utils.arrayFilter(this.attractionList(), function(attraction) {
                if (attraction.name().toLowerCase().indexOf(filterText) >= 0) {
                    attraction.marker.setVisible(true);
                    return true;
                } else {
                    attraction.marker.setVisible(false);
                    return false;
                }
            });
    }

    ViewModel.prototype.revealLocation = function(attraction){
        google.maps.event.trigger(attraction.marker, 'click');
    }

})(window.app = window.app || {});