var app = app || {};

(function() {
    'use strict';

    app.initMap = function() {
        console.log("initMap");
        var mapElem = document.getElementById('map');
        //create google map and append it to the page
        var vienna = { lat: 48.2082, lng: 16.3738 };
        // declare bounds of map
        var bounds = new google.maps.LatLngBounds();
        // create one info window for all markers
        app.vm.infoWindow = new google.maps.InfoWindow({
            maxWidth: 250
        });

        // Constructor creates a new map - only center and zoom are required.
        app.vm.map = new google.maps.Map(mapElem, {
            center: vienna,
            zoom: 13
        });

        //create a marker for each location in the filtered items array
        //attach marker to attraction object
        app.vm.filteredItems().forEach(function(attraction, index) {
            var marker = new google.maps.Marker({
                position: attraction.locations(),
                map: app.vm.map,
                title: attraction.name(),
                animation: google.maps.Animation.DROP,
                id: index
            });
            attraction.marker = marker;
            marker.addListener('click', function() {
                app.getInfoWindowContent(this, app.vm.infoWindow);
                app.toggleBounce(this);
            });
            bounds.extend(marker.position); // adjust boundaries for each location
        });

        //Extend the boundaries of the map for each marker
        app.vm.map.fitBounds(bounds);

        //show info window;

    };

    // Make markers bounce;
    // callback function
    app.toggleBounce = function(marker) {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null)
            }, 1500);
        }
    }

    // Assign marker to infowindow marker property
    // Add marker specific content to info window
    // clear marker content on close
    app.getInfoWindowContent = function(marker, infowindow){
          infowindow.marker = marker;
          infowindow.setContent('<div>' + marker.title + '</div>');
          infowindow.open(app.vm.map, marker);
          infowindow.addListener('closeclick',function(){
            infowindow.setMarker = null;
          });
  };

})();