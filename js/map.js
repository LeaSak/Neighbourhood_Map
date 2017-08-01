var app = app || {};

(function(){
    'use strict';

    var map = app.map;
    var bounds = app.bounds;

    app.initMap = function(){
        console.log("initMap");
        //create google map and append it to the page
        var vienna = {lat: 48.2082, lng: 16.3738};
        app.bounds = new google.maps.LatLngBounds();

        // Constructor creates a new map - only center and zoom are required.
        app.map = new google.maps.Map(document.getElementById('map'), {
          center: vienna,
          zoom: 13
          });

        //create a marker for each location
        // attach marker to attraction object
        // app.vm.initialPOIList().forEach(function(attraction, index){
        // var marker = new google.maps.Marker({
        //     position: attraction.locations(),
        //     map: app.map,// this attaches markers to the map
        //     title: attraction.name(),
        //     animation: google.maps.Animation.DROP,
        //     id: index
        //     });
        // attraction.marker = marker;
        // bounds.extend(marker.position); // adjust boundaries for each location
        // });


        // Extend the boundaries of the map for each marker
        // app.map.fitBounds(bounds);

        // apply bindings after initMap
        var vm = new app.ViewModel();
        ko.applyBindings(vm);
    };

})();
