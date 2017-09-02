/*
 * Global variables
 */
var map;
var infowindow;

function initMap() {
    'use strict';
    console.log("initMap");
    var mapElem = document.getElementById('map');
    //create google map and append it to the page
    var vienna = { lat: 48.2082, lng: 16.3738 };
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(mapElem, {
        center: vienna,
        zoom: 13,
        mapTypeControl: false
    });
    // add a transit layer to map
    var transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(map);
    // Create one infowindow
    infowindow = new google.maps.InfoWindow({
        maxWidth: 300
    });

    //Create markers for each location
    app.vm.renderMarkers(app.vm.filteredItems());

    //resize map, tell it to redraw when window is resized
    google.maps.event.addDomListener(window, 'resize', app.vm.resizeMap);
}

function createContent(url, name, address, postalCode, city, hours) {
    var htmlString = '<article class="infowindow-text">' +
        '<h2><a class="venue-link" href=' + url + '>' +
        name + '</h2></a>' +
        '<div class="contact-box"><i class="fa fa-map-marker" aria-hidden="true"></i>' +
        '<address>' + address + ', ' + postalCode + ' ' +
        city + '</address></div>' +
        '<div class="time-box"><i class="fa fa-clock-o" aria-hidden="true"></i>' +
        '<p> Today: ' + hours + '</p></div></article>';
    var foursquareString = htmlString + '<div class="image-box"><img class="foursquare-img" src="foursquare.png"></div>';
    return [htmlString, foursquareString];
}

// Google maps load error
function mapError() {
    app.vm.mapElem(false);
}