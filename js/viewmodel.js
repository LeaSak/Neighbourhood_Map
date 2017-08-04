(function(app, undefined) {
    'use strict';

    /* Global variables
     *
     */
    //app.initMap()
    //app.toggleBounce()
    //app.getInfoWindowContent()
    //app.vm;
    //app.vm.map
    //app.vm.filteredItems()
    var map = app.map;
    var bounds;
    var markers = [];

    // public method
    // callback in Google Maps API request
    // what the map first looks like when it loads
    app.initMap = function() {
        console.log("initMap");
        var mapElem = document.getElementById('map');
        //create google map and append it to the page
        var vienna = { lat: 48.2082, lng: 16.3738 };
        // declare bounds of map
        bounds = new google.maps.LatLngBounds();
        // create one info window for all markers
        var infoWindow = new google.maps.InfoWindow({
            maxWidth: 250
        });

        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(mapElem, {
            center: vienna,
            zoom: 13
        });

        //create a marker for each location
        //attach marker to attraction object
        app.initialPOI.forEach(function(attraction, index) {
            var marker = new google.maps.Marker({
                position: attraction.locations,
                map: map,
                title: attraction.name,
                animation: google.maps.Animation.DROP,
            });
            // attach marker to  data list
            attraction.marker = marker;
            markers.push(attraction.marker);
            // marker.addListener('click', function() {
            //     app.getInfoWindowContent(this, infoWindow);
            //     app.toggleBounce(this);
            // });
            bounds.extend(marker.position); // adjust boundaries for each location
        });

        // Extend the boundaries of the map for each marker
        map.fitBounds(bounds);

    // Assign View Model to a variable
    // apply bindings here to make sure
    // google map is loaded before the View Model
    var vm = new ViewModel();
    ko.applyBindings(vm);

    };

    // Make markers bounce;
    // callback function
    // app.toggleBounce = function(marker) {
    //     if (marker.getAnimation() !== null) {
    //         marker.setAnimation(null);
    //     } else {
    //         marker.setAnimation(google.maps.Animation.BOUNCE);
    //         setTimeout(function() {
    //             marker.setAnimation(null)
    //         }, 1500);
    //     }
    // }

    // Assign marker to infowindow marker property
    // Add marker specific content to info window
    // clear marker content on close
    // app.getInfoWindowContent = function(marker, infowindow) {
    //     infowindow.marker = marker;
    //     infowindow.setContent('<div>' + marker.title + '</div>');
    //     infowindow.open(app.vm.map, marker);
    //     infowindow.addListener('closeclick', function() {
    //         infowindow.setMarker = null;
    //     });
    // };

    /*
     * Attraction Class constructor
     */
    var Attraction = function(data) {
        this.name = ko.observable(data.title);
        this.locations = ko.observable(data.position);
        this.marker = data;
        // this.marker = new google.maps.Marker({
        //          position: this.locations(),
        //          map: map,// this attaches markers to the map
        //          title: this.name(),
        //          animation: google.maps.Animation.DROP,
        //           });
        // this.visible = ko.observable(true);
    };

    /*
     * View Model of App
     */
    var ViewModel = function() {
        console.log("ViewModel");
        var self = this;

        // Creates a ko observable array of location objects
        // maps marker array created by app.initMap
        this.initialPOIList = ko.observableArray(ko.utils.arrayMap(markers, function(marker){
            return new Attraction(marker);
        }));

        this.initialPOIList().forEach(function(obj){
            obj.marker.setVisible(false);
        });
        //this.initialPOIList()[0].marker.setVisible(false);

        // attach markers
        // self.initialPOIList().forEach(function(attraction){
        //     var marker = new google.maps.Marker({
        //      position: attraction.locations(),
        //      map: map,// this attaches markers to the map
        //      title: attraction.name(),
        //      animation: google.maps.Animation.DROP,
        //       });
        //     attraction.marker = marker;
        //     console.log(attraction.marker.title);
        //     bounds.extend(attraction.marker.position)
        // });

        // Make filter input observable
        // this.filterInput = ko.observable("");

        //return search results for listings
        // self.filteredItems = ko.computed(function() {
        //     var filterText = self.filterInput().toLowerCase();
        //     if (!filterText) {
        //         return self.initialPOIList();
        //     } else {
        //         return ko.utils.arrayFilter(self.initialPOIList(), function(attraction) {
        //             var match = attraction.name().toLowerCase().indexOf(filterText) >= 0;
        //             if (match && attraction.visible()) {
        //                 attraction.marker.setVisible(true);
        //                 return match;
        //             } else {
        //                 attraction.marker.setVisible(false);
        //             }
        //         });
        //     }
        // }, self);

        // bounce target when link is clicked
        // this.targetResponse = function(obj) {
        //     var pin = obj.marker;
        //     app.getInfoWindowContent(pin, app.vm.infoWindow);
        //     app.toggleBounce(pin);
        // }
    };

    // // Assign View Model to a variable
    // // apply bindings
    // app.vm = new ViewModel();
    // ko.applyBindings(app.vm);

})(window.app = window.app || {});
