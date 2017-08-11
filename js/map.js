// (function(app, undefined) {
//     'use strict';

//     // declare map as global variable
//     var map;

//     app.mapView = {
//         init: function() {
//             console.log('initMap');
//             // define variables
//             this.mapElem = document.getElementById('map');
//             // center of map is in Vienna, Austria
//             this.center = { lat: 48.2082, lng: 16.3738 };
//             // declare bounds of map
//             this.bounds = new google.maps.LatLngBounds();
//             //create one info window for all markers
//             this.infowindow = new google.maps.InfoWindow({
//                 maxWidth: 250
//             });

//             // envoke below functions
//             this.renderMap();
//             this.createMarkers();

//             //followed by calls to ko.View Model
//             // Assign View Model to a variable
//             var vm = new app.ViewModel();
//             ko.applyBindings(vm);

//         },
//         renderMap: function() {
//             map = new google.maps.Map(this.mapElem, {
//                 center: this.center,
//                 zoom: 13
//             });
//         },
//         createMarkers: function() {
//             var marker;
//             var self = this;
//             app.initialPOI.forEach(function(attraction) {
//                 marker = new google.maps.Marker({
//                     position: new google.maps.LatLng(
//                         attraction.location.lat,
//                         attraction.location.lng),
//                     map: map,
//                     title: attraction.name,
//                     animation: google.maps.Animation.DROP,
//                 });
//                 // assign marker to attraction
//                 attraction.marker = marker;
//                 // adjust boundaries for each location
//                 this.bounds.extend(marker.position);
//                 // Extend the boundaries of the map for each marker
//                 map.fitBounds(this.bounds);

//                 //add event listener to marker
//                 marker.addListener('click', function() {
//                     self.getInfoWindowContent(attraction);
//                     self.toggleBounce(attraction);
//                 });

//             }, app.mapView);

//         },
//         toggleBounce: function(attraction){
//             if (attraction.marker.getAnimation() !== null) {
//                     attraction.marker.setAnimation(null);
//                 } else {
//                     attraction.marker.setAnimation(google.maps.Animation.BOUNCE);
//                     setTimeout(function() {
//                         attraction.marker.setAnimation(null);
//                     }, 1500);
//                 }
//         },
//         getInfoWindowContent: function(attraction) {
//             self = this;
//             this.infowindow.marker = attraction.marker;
//             this.infowindow.setContent('<div>' + attraction.marker.title + '</div>');
//             this.infowindow.open(map, attraction.marker);
//             this.infowindow.addListener('closeclick', function() {
//                 self.infowindow.setMarker = null;
//                 });
//         }
//     }

// })(window.app = window.app || {});