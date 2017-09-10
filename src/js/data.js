(function(app, undefined){
    'use strict';
        /*
         * Stores data for Map Markers
         * This is the model
         */
    app.initialPOI = [
            {
                name: 'Dianabad',
                location: {
                    lat: 48.214209,
                    lng: 16.377812
                },
                address: 'Lilienbrunngasse 7-9',
                postalCode: '1020',
                url: 'http://www.dianabad.at/',
                foursquareID: '4c8df3ce58668cfa9a96cdec',
                tag: ['#pirates', '#mermaids']
            },
            {
                name: 'Haus des Meeres - Aqua Terra Zoo',
                location: {
                    lat: 48.197731,
                    lng: 16.352923
                },
                address: 'Fritz-Grünbaum-Platz 1',
                postalCode: '1060',
                url: 'https://www.haus-des-meeres.at/',
                foursquareID: '4b7cf243f964a52002aa2fe3',
                tag: ['#marine biologists', '#crocodile hunters']
            },
            {
                name: 'Haus der Musik',
                location: {
                    lat: 48.203787,
                    lng: 16.373061
                },
                address: 'Seilerstätte 30',
                postalCode: '1010',
                url: 'http://www.hausdermusik.com/',
                foursquareID: '4b058895f964a520f5ce22e3',
                tag: ['#mini mozarts', '#rockstars']
            },
            {
                name: 'Zoom Kindermuseum',
                location: {
                    lat: 48.202336,
                    lng: 16.359377
                },
                address:'Museumsplatz 1',
                postalCode: '1070',
                url: 'https://www.kindermuseum.at/en',
                foursquareID: '4bd68e887b1876b03abf8c86',
                tag: ['#tinkerers', '#artists'],
            },
            {
                name: 'Palmenhaus Schönbrunn',
                location: {
                    lat: 48.184550,
                    lng: 16.302921
                },
                address: 'Schlosspark Schönbrunn',
                postalCode: '1130',
                url: 'https://www.schoenbrunn.at/ueber-schoenbrunn/schlosspark/rundgang/palmenhaus/',
                foursquareID: '4d7ce2a38f89224bcaf4ab26',
                tag: ['#hobby gardeners', '#botanists']
            },
            {
                name: 'Figurentheater Lilarum',
                location: {
                    lat: 48.200770,
                    lng: 16.399158
                },
                address:'Göllnergasse 8',
                postalCode: '1030',
                url: 'http://lilarum.at/',
                foursquareID: '4b7e696cf964a52009ec2fe3',
                tag: ['#puppeteers', '#cabaret artists']
            },
            {
                name: 'Schmetterlinghaus im Burggarten',
                location: {
                    lat: 48.205378,
                    lng: 16.366604
                },
                address: 'Palmenhaus Burggarten Hofburg',
                postalCode: '1010',
                url:'http://www.schmetterlinghaus.at/',
                foursquareID: '4edf58459adf1692b4aa18a1',
                tag: ['#butterflies', '#biologists']
            },
            {
                name: 'wienXtra-cinemagic Kinderkino',
                location: {
                    lat: 48.211406,
                    lng: 16.383912
                },
                address: 'Uraniastrasse 1',
                postalCode: '1010',
                url: 'http://www.wienxtra.at/cinemagic/',
                foursquareID: '4c9a689e971676b0de2055e2',
                tag: ['#film critics', '#movie stars']
            },
            {
                name: 'Dschungel Vienna',
                location: {
                    lat: 48.202419,
                    lng: 16.360220
                },
                address:'Museumsplatz 1',
                postalCode: '1070',
                url: 'https://www.dschungelwien.at/',
                foursquareID: '4b87979af964a520acc331e3',
                tag: ['#drama queens', '#drama kings']
            },
            {
                name: 'Technisches Museum Wien',
                location: {
                    lat: 48.190902,
                    lng: 16.318252
                },
                address:'Mariahilfer Strasse 212',
                postalCode: '1140',
                url: 'https://www.technischesmuseum.at/',
                foursquareID: '4b058894f964a520d5ce22e3',
                tag: ['#engineers', '#scientists']
            },
            {
                name: 'Naturhistorisches Museum',
                location: {
                    lat: 48.205276,
                    lng: 16.359845
                },
                address:'Burgring 7',
                postalCode: '1010',
                url: 'http://www.nhm-wien.ac.at/en',
                foursquareID: '4b1699f8f964a520c5ba23e3',
                tag:['#dinosaur fans', '#history buffs']
            }

        ];
})(window.app = window.app || {});