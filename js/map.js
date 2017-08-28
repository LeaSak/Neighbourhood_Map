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
        zoom: 13
    });
    // Create one infowindow
    infowindow = new google.maps.InfoWindow({
        maxWidth: 250
    });
    //Create markers
    renderMarkers(app.vm.filteredItems());

    //resize map, tell it to redraw when window is resized
    google.maps.event.addDomListener(window, 'resize', function() {
        var center = map.getCenter();
        google.maps.event.trigger(map, 'resize');
        map.setCenter(center);
    });

    // apply bindings to ViewModel
    // var vm = new app.ViewModel();
    // ko.applyBindings(vm);
}

function renderMarkers(list) {
    // declare bounds of map
    'use strict';
    var bounds = new google.maps.LatLngBounds();
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
        bounds.extend(marker.position);
        map.fitBounds(bounds);
        marker.addListener('click', function() {
            toggleBounce(this);
            populateInfoWindow(this, infowindow, venue);
        });
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
    //infowindow.setContent('loading');
    infowindow.open(map, marker);
    infowindow.addListener('closeclick', function() {
        infowindow.setMarker = null;
    });

    //AJAX Request
    var foursquareClientID = 'V3SD0U1WAIJOPXUK4W2AR0DPZXUKFQQL5Y2FXKK4YO25FVX0';
    var foursquareClientSecret = 'NEH1GYLAFDS2CL5DSBFRO3DENB55KPWAVJE5ERBWQ1MGLD0X';
    var foursquareVersion = '20170801';
    var foursquareURL_venue = 'https://api.foursquare.com/v2/venues/' + marker.id;

    $.ajax({
        url: foursquareURL_venue,
        dataType: "jsonp",
        data: {
            client_id: 'V3SD0U1WAIJOPXUK4W2AR0DPZXUKFQQL5Y2FXKK4YO25FVX0',
            client_secret: 'NEH1GYLAFDS2CL5DSBFRO3DENB55KPWAVJE5ERBWQ1MGLD0X',
            v: '20170801',
            async: true
        },
        success: function(data) {
            var url = data.response.venue.canonicalUrl + '?' + foursquareClientID || venue.url;
            var name = data.response.venue.name || venue.name;
            var street = data.response.venue.location.address || venue.address;
            var postalCode = data.response.venue.location.postalCode || venue.postalCode;
            var city = data.response.venue.location.city || venue.city;
            var hours = data.response.venue.popular.timeframes[0].open[0].renderedTime || 'Check website';
            var foursquareString = '<article class="infowindow-text">' +
                '<h1><a class="venue-link" href=' + url + '>' +
                name + '</a></h1>' +
                '<div class="contact-box"><i class="fa fa-map-marker" aria-hidden="true"></i>' +
                '<address>' + street + ', ' + postalCode + ' ' +
                city + '</address></div>' +
                '<div class="time-box"><i class="fa fa-clock-o" aria-hidden="true"></i>' +
                '<p> Today: ' + hours + '</p></div>' +
                '<div class="image-box"><img class="foursquare-img" src="foursquare.png"></div></article>';
            infowindow.setContent(foursquareString);
        },
        error: function() {
            console.log(venue);
            var htmlString = '<article class="infowindow-text">' +
                '<h1><a class="venue-link" href=' + venue.url + '>' + venue.name + '</a></h1>' +
                '<div class="contact-box"><i class="fa fa-map-marker" aria-hidden="true"></i>' +
                '<address>' + venue.address + ', ' + venue.postalCode + ' ' +
                venue.city + '</address></div></article>';
            infowindow.setContent(htmlString);
        }
    });
}


// Google maps load error
function mapError() {
    console.log('Google Maps failed to load. Please reload the page.');
}