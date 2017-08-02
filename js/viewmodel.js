var app = app || {};

    (function(){
        'use strict';
        /*
         * Attraction Class constructor
         */
        var Attraction = function(data){
            this.name = ko.observable(data.name);
            this.locations = ko.observable(data.locations);
            this.marker = "";
        };

        /*
         * View Model of App
         */
        var ViewModel = function(){
            console.log("ViewModel");
            var self = this;
            //stores attractions as an array of object instances
            this.initialPOIList = ko.observableArray([]);

            // add each object instance to the array
            app.initialPOI.forEach(function(attraction){
                self.initialPOIList.push(new Attraction(attraction));
            });

            // bounce target when link is clicked
            this.bounceTarget = function(obj){
                var pin = obj.marker;
                app.getInfoWindowContent(pin, app.vm.infoWindow);
                app.toggleBounce(pin);
            }
        };

        // Assign View Model to a variable
        // apply bindings
        app.vm = new ViewModel();
        ko.applyBindings(app.vm);

    })();
