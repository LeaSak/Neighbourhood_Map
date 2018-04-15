var gulp = require('gulp'),
    htmlmin = require('gulp-htmlmin'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    maps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    lazypipe = require('lazypipe'),
    imagemin = require('gulp-imagemin');

// Working directories
var bases = {
    src: 'src/',
    dist: './'
};

// Paths to files
var paths = {
    html: ['index.html'],
    css: ['css/styles.css'],
    js: ['js/**/*.js'],
    assets: ['images/foursquare.png'],
    bower: ['bower_components/normalize-css/normalize.css',
        'bower_components/jquery/dist/jquery.js',
        'bower_components/knockout/dist/knockout.js'
    ]
};

// Replace links and script tags in html
// Autoprefix, minify, concat css
// Minify, concat js
// Write sourcemaps
gulp.task('buildHTML', ['minifyImages'], function(){
    return gulp.src(paths.html, {cwd: bases.src})
        .pipe(useref({}, lazypipe().pipe(maps.init, { loadMaps: true })))
        .pipe(gulpif(paths.css, autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        })))
        .pipe(gulpif('*.css', cssnano()))
        .pipe(gulpif('*.js', uglify()))
        .pipe(maps.write('maps'))
        .pipe(gulp.dest(bases.dist));
});

// Minify HTML in production folder
gulp.task('minifyHTML', ['buildHTML'], function() {
    return gulp.src(paths.html, { cwd: bases.dist })
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(bases.dist));
});

// Compress and copy image
gulp.task('minifyImages', function(){
    return gulp.src(paths.assets, {cwd: bases.src})
    .pipe(imagemin())
    .pipe(gulp.dest(bases.dist + 'images/'));
});


// Watch task
// Watches changes in files in src folder
gulp.task('watch', ['minifyHTML'], function() {
    return gulp.watch(bases.src + '**/*.*', ['minifyHTML']);
});

// Build task
gulp.task('build', ['minifyHTML']);

//Default task
gulp.task('default', ['watch']);