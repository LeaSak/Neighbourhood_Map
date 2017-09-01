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
    renderMarkers(app.vm.filteredItems());

    //resize map, tell it to redraw when window is resized
    google.maps.event.addDomListener(window, 'resize', app.vm.resizeMap);
}

function renderMarkers(list) {
    'use strict';
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
        venue.marker = marker;
        marker.addListener('click', function() {
            toggleBounce(this);
            populateInfoWindow(this, infowindow, venue);
        });
        var bounds = new google.maps.LatLngBounds();
        bounds.extend(marker.position);
    });
}

function toggleBounce(marker) {
    'use strict';
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null);
        }, 1500);
    }
}

function populateInfoWindow(marker, infowindow, venue) {
    'use strict';
    infowindow.marker = marker;
    infowindow.setContent('Fetching...');
    infowindow.open(map, marker);
    infowindow.addListener('closeclick', function() {
        infowindow.setMarker = null;
    });

    //AJAX Request
    var foursquareClientID = 'V3SD0U1WAIJOPXUK4W2AR0DPZXUKFQQL5Y2FXKK4YO25FVX0';
    var foursquareClientSecret = 'NEH1GYLAFDS2CL5DSBFRO3DENB55KPWAVJE5ERBWQ1MGLD0X';
    var foursquareVersion = '20170801';
    var foursquareURL_venue = 'https://api.foursquare.com/v2/venues/' + venue.foursquareID;

    $.ajax({
        url: foursquareURL_venue,
        dataType: "jsonp",
        data: {
            client_id: foursquareClientID,
            client_secret: foursquareClientSecret,
            v: '20170801',
        }
    }).done(function(data){
        var location = data.response.venue;
        console.log(data.response);
            var url = location.canonicalUrl ? venue.canonicalUrl + '?' + foursquareClientID : venue.url();
            var name = location.name ? location.name : venue.name;
            var street = location.location.address ? location.location.address : venue.address;
            var postalCode = location.location.postalCode ? location.location.postalCode : venue.postalCode;
            var city = location.location.city ? location.location.city : venue.city;
            var hours = location.popular ? location.popular.timeframes[0].open[0].renderedTime : 'Check website';
            var foursquareString = '<article class="infowindow-text">' +
                '<h2><a class="venue-link" href=' + url + '>' +
                name + '</h2></a>' +
                '<div class="contact-box"><i class="fa fa-map-marker" aria-hidden="true"></i>' +
                '<address>' + street + ', ' + postalCode + ' ' +
                city + '</address></div>' +
                '<div class="time-box"><i class="fa fa-clock-o" aria-hidden="true"></i>' +
                '<p> Today: ' + hours + '</p></div>' +
                '<div class="image-box"><img class="foursquare-img" src="foursquare.png"></div></article>';
            infowindow.setContent(foursquareString);
    }).fail(function(){
        var htmlString = '<article class="infowindow-text">' +
                '<h2><a class="venue-link" href=' + venue.url() + '>' + venue.name + '</a></h2>' +
                '<div class="contact-box"><i class="fa fa-map-marker" aria-hidden="true"></i>' +
                '<address>' + venue.address + ', ' + venue.postalCode + ' ' +
                venue.city + '</address></div></article>';
            infowindow.setContent(htmlString);
    });
}


// Google maps load error
function mapError() {
    app.vm.mapElem(false);
}