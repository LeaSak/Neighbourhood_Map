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
        };
        this.address = data.address;
        this.postalCode = data.postalCode;
        this.city = 'Vienna';
        this.hours = 'Check website';
        this.url = data.url;
        this.foursquareID = data.foursquareID;
        this.marker = "";
        this.tag = data.tag;
    };


    // Section class
    var Section = function(name, id) {
        this.name = name;
        this.id = id;
    };


    /*
     * Section View Model of App
     *
     */
    var SectionVM = function() {
        var self = this;
        console.log('SectionVM');

        //observable array of sections
        // sections contain main content
        self.sections = ko.observableArray([
            new Section("Search Venues", "venueView"),
            new Section("Map", "mapView")
        ]);

        // Keeps track of which section is selected
        // Set Map as default open tab
        self.chosenSection = ko.observable(self.sections()[1]);

        // set click target as current chosen section
        // trigger resize map if condition met
        self.activateSection = function(section) {
            self.chosenSection(section);
            if (self.chosenSection().name === "Map") {
                app.mapvm.resizeMap();
            }
        };

        // this returns true or false if
        // conditions are met or not met.
        self.showContent = function(element) {
            return element === self.chosenSection().id;
        };
    };

    // create an instance of SectionVM
    var sectionvm = new SectionVM();


    /*
     * Venue View Model of App
     *
     *
     */

    var VenueVM = function() {
        var self = this;
        console.log('VenueVM');
        // Creates a ko observable array of location objects
        self.attractionList = ko.observableArray(ko.utils.arrayMap(app.initialPOI, function(attraction) {
            return new Attraction(attraction);
        }));
       // One line of google
        // switch to map
        // click callback function
        // return true to enable default link
        // behaviour when map is not available
        self.showLocation = function(venue) {
            if (app.mapvm.mapElem()) {
                var marker = venue.marker;
                sectionvm.activateSection(sectionvm.sections()[1]);
                google.maps.event.trigger(marker, 'click');
            } else {
                return true;
            }
        };

    };

    // create an instance of venueVM
    var venuevm = new VenueVM();

    /*
     * Search View Model of App
     *
     */
    var SearchVM = function(){
        var self = this;
        console.log('SearchVM');
        // make input field an observable
        self.searchTerm = ko.observable('');

        self.clearSearch = function() {
            return self.searchTerm('');
        };

        // return search results for listings in an array
        // search is base on venue name
        self.filteredItems = ko.computed(function() {
            var filterText = self.searchTerm().toLowerCase();
            return ko.utils.arrayFilter(venuevm.attractionList(), function(venue) {
                if (venue.name.toLowerCase().indexOf(filterText) >= 0) {
                    // check for map
                    if (app.mapvm.mapElem()){
                        app.mapvm.showMarker(venue.marker);
                    }

                    return true;
                } else {
                    //check for map
                    if (app.mapvm.mapElem()){
                        app.mapvm.infowindow.close();
                        app.mapvm.hideMarker(venue.marker);
                    }
                    return false;
                }
            });

        }, self);

        // if the filteredItems has one match
        // let user open map and activate marker on enter key press
        self.returnSearchItem = function() {
            var venue;
            var totalVenues = self.filteredItems().length;
            // if only one item is found
            if (totalVenues === 1) {
                venue = self.filteredItems()[0];
                venuevm.showLocation(venue);
            } else {
                return null;
            }

        };

        // make search label observable
        self.searchLabel = ko.observable('');

        // this computes the search label text
        self.searchMessage = ko.computed(function() {
            return self.filteredItems().length === 0 ? 'Sorry, no matches. Try again.' : 'Filter destinations by venue name';
        }, self);

         //clear search input button
        self.cancelBtn = ko.observable();

        self.showBtn = ko.computed(function() {
            if (self.searchTerm() === '') {
                self.cancelBtn(false);
            } else {
                self.cancelBtn(true);
            }
        });

    };

    // create an instance of search view model
    var searchvm = new SearchVM();

    // create a parent view model to house all view models
    var ViewModel = function(){
        this.mapVM = app.mapvm;
        this.sectionVM = sectionvm;
        this.venueVM = venuevm;
        this.searchVM = searchvm;
    }

    // create an instance of parent view model
    app.vm = new ViewModel();
    ko.applyBindings(app.vm);



})(window.app = window.app || {});