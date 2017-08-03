var app = app || {};

    (function(){
        'use strict';
        /*
         * Attraction Class constructor
         */
        var Attraction = function(data){
            this.name = ko.observable(data.name);
            this.locations = ko.observable(data.locations);
            this.visible = ko.observable(true);
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

            // Make filter input observable
            this.filterInput = ko.observable("");

            //return search results for listings
            self.filteredItems = ko.computed(function(){
                var filterText = self.filterInput().toLowerCase();
                if(!filterText){
                    return self.initialPOIList();
                } else {
                    return ko.utils.arrayFilter(self.initialPOIList(), function(attraction){
                        var match = attraction.name().toLowerCase().indexOf(filterText) >= 0;
                        if (match && attraction.visible()){
                            attraction.marker.setVisible(true);
                            return match;
                        } else {
                            attraction.marker.setVisible(false);
                        }
                    });
            }
        }, self);

            // bounce target when link is clicked
            this.targetResponse = function(obj){
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
