# FEND Neighbourhood Map Project

This is project five in Udacity's Front-End Web Development Nanodegree. The aim of this project was to develop a single page application using **Knockout.js**, **Google Maps API** and another **third-party API**. The app should display map markers for at least 5 destinations within a chosen neighbourhood, a filter, and further information on the locations via infowindows or DOM elements.

### Project Features
------
* Wet weather entertainment options for children in Vienna, Austria.
* Filter by name search field with enter key functionality.
* A Google Map with animated Google Map Markers and Infowindows for each venue retrieved asynchronously from the **Google Maps API**.
* A Google Map Transit Layer showing the underground transit map in Vienna.
* Infowindow content fetched asynchronously from the **Foursquare API**.
* Responsive Design built with **Knockout.js**. All application components can be used on mobile, tablet and on desktop.
* Error Handling - If a response error occurs from either the Foursquare API or Google Maps API, the app still provides basic information about the destinations via external links or hard-coded data and the search filter also functions.
* This project was build using **Gulp** and **Bower**

### Getting started
------

First go to the master branch of the project and get a copy of the repository by either downloading the zipped project files to your computer or via the command line.

```sh
https://github.com/LeaSak/Neighbourhood_Map
```

To view the app, navigate to the project, go to the project's root directory, and open **index.html** in your browser. So far it's only been tested in Google Chrome.

All development files are located in the **src** directory.

If you wish to build the project, see below.

### Build the App
------
To build the app, you first need to setup your development environment.

#### Step 1: Install node.js, npm, Gulp, and Bower
Make sure you have **node.js**, **npm**, **gulp**, and **bower** installed. For instructions on how to install these consult the following links: [node](https://nodejs.org/en/), [npm](https://docs.npmjs.com/getting-started/installing-node), [gulp.js](http://gulpjs.com/), [bower.js](https://bower.io/)
*Note*: You do not need to create `package.json` and `gulpfile.js` files.

#### Step 2: Install Gulp Dependencies
Make sure you're in the project directory.
To install the **Gulp** dependencies, run:
```sh
$ npm install
```
You should now find these plugins in your **node_modules** folder.

#### Step 3: Install Bower Dependencies
Make sure you're in the project directory. Now we'll install the project's development dependencies.
To install the **Bower** dependencies, run:
```sh
$ bower install
```
You should now find the bower packages in the **bower_components** folder.

#### Step 4: Build
To simply build the site, run the following command within your project directory:
```sh
$ gulp build
```
If you want build the site and make changes to the app, run the default gulp task:
```sh
$ gulp
```
The default gulp task includes watch tasks, so when you make any changes to the files in the **src** directory, the site will be rebuilt again and your changes will be implemented. You'll need to refresh the browser to see your changes.
For more information, please inspect **gulpfile.js**

#### Step 4: Inspect
Navigate to the root directory and open **index.html** in your browser.

## Feedback
------
Feedback is very welcome, leaann.sakmann@gmail.com