var app = app || {};

    (function(){
        'use strict';
        /*
         * Attraction Class constructor
         */
        var Attraction = function(data){
            this.name = ko.observable(data.name);
            this.locations = ko.observable(data.locations);
        };

        /*
         * View Model of App
         */
        app.ViewModel = function(){
            console.log("ViewModel");
            var self = this;
            //stores attractions as an array of object instances
            this.initialPOIList = ko.observableArray([]);

            // add each object instance to the array
            app.initialPOI.forEach(function(attraction, index){
                self.initialPOIList.push(new Attraction(attraction));
            });

            // attach marker
            self.initialPOIList().forEach(function(attraction, index){
            var marker = new google.maps.Marker({
                position: attraction.locations(),
                map: app.map,// this attaches markers to the map
                title: attraction.name(),
                animation: google.maps.Animation.DROP,
                id: index
                });
            attraction.marker = marker;
            app.bounds.extend(marker.position); // adjust boundaries for each location
            });

            // Extend the boundaries of the map for each marker
            app.map.fitBounds(app.bounds);

            // click test
            this.clickEvent = function(obj){
                console.log(obj.marker.id);
            }
        }
    })();