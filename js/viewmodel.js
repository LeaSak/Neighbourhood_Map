(function(app, undefined) {
    'use strict';

    /*
     * Attraction Class constructor
     * Gets properties from Model
     */
    var Attraction = function(data) {
        this.name = data.name;
        this.location = {
            lat: data.location.lat,
            lng: data.location.lng
        }
        this.address = data.address;
        this.postalCode = data.postalCode;
        this.city = 'Vienna';
        this.hours = '';
        this.url = data.url;
        this.foursquareID = data.foursquareID;
        this.marker = '';
    };

    // Section class
    var Section = function(name, id) {
        this.name = name;
        this.id = id;
    };

    /*
     * View Model of App
     *
     */
    var ViewModel = function() {
        console.log('View Model');
        var self = this;

        /*
         * UI View Model
         */
        self.chosenTab = ko.observable();

        //observable array of sections
        self.sections = ko.observableArray([
            new Section("Venues", "venueView"),
            new Section("Map", "mapView")
        ]);

        //set click target as current chosen object/tab
        self.activateSection = function(tab) {
            self.chosenTab(tab);
            self.resizeMap();
        };

        // if map div is resized while hidden,
        // map needs to be resized.
        self.resizeMap = function() {
            if (self.chosenTab().id === "mapView") {
                var center = map.getCenter();
                google.maps.event.trigger(map, "resize");
                map.setCenter(center);
            }
        }

        self.showContent = function(element) {
            return element === self.chosenTab().id;
        }

        //switch to map
        self.openMap = function(attraction) {
            self.activateSection(self.sections()[1]);
            google.maps.event.trigger(attraction.marker, 'click');
        }


        // Set Map as default open tab
        self.chosenTab(self.sections()[1]);


        /*
         * Content View Model
         */

        // Creates a ko observable array of location objects
        this.attractionList = ko.observableArray(ko.utils.arrayMap(app.initialPOI, function(attraction) {
            return new Attraction(attraction);
        }));

        // make input field an observable
        this.searchTerm = ko.observable('');

        //return search results for listings in an array
        // Google dependent
        this.filteredItems = ko.computed(this._filter, this);

    };

    ViewModel.prototype._filter = function() {
        var filterText = this.searchTerm().toLowerCase();
        return ko.utils.arrayFilter(this.attractionList(), function(attraction) {
            if (attraction.name.toLowerCase().indexOf(filterText) >= 0) {
                if (attraction.marker) {
                    attraction.marker.setVisible(true);
                }
                return true;
            } else {
                attraction.marker.setVisible(false);
                return false;
            }
        });
    }

    // // Assign View Model to a variable
    app.vm = new ViewModel();
    ko.applyBindings(app.vm);

})(window.app = window.app || {});