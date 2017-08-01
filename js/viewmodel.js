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
        var ViewModel = function(){
            var self = this;
            //stores attractions as an array of object instances
            this.initialPOIList = ko.observableArray([]);
            // add each object instance to the array
            app.initialPOI.forEach(function(attraction){
                self.initialPOIList.push(new Attraction(attraction));
            });

            // click test
            this.clickEvent = function(obj){
                console.log(obj.marker.id);
            }
        }

        app.vm = new ViewModel();
        ko.applyBindings(app.vm);
    })();