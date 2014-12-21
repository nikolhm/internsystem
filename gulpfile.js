var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    ngAnnotate = require('gulp-ng-annotate'),
    gulpif = require('gulp-if'),
    args = require('yargs').argv,
    templates = require('gulp-angular-templatecache'),
    minifyHTML = require('gulp-minify-html'),
    rename = require('gulp-rename'),
    rev = require('gulp-rev'),
    buffer = require('gulp-buffer'),
    extend = require('gulp-extend'),
    runSequence = require('run-sequence'),
    minifyCSS = require('gulp-minify-css');

// run with --production to do more compressing etc
var isProd = !!args.production;

var js_files_library = [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-ui-router/release/angular-ui-router.min.js',
    'bower_components/angular-animate/angular-animate.js'
];

var js_files = [
    'varer/frontend/app.js',
    'varer/frontend/**/module.js',
    'varer/frontend/**/*.js'
];

var css_files = [
    'varer/frontend/app.scss'
];

var processScripts = function (files, name) {
    return gulp.src(files)
        .pipe(sourcemaps.init())
        .pipe(concat(name + '.js'))
        .pipe(gulpif(isProd, ngAnnotate()))
        .pipe(gulpif(isProd, uglify()))
        .pipe(buffer())
        .pipe(rev())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('varer/static_build'))
        .pipe(rev.manifest({path: 'rev-manifest-scripts-' + name + '.json'}))
        .pipe(gulp.dest('varer/static_build'));
};

gulp.task('styles', function() {
    return gulp.src(css_files)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(concat('frontend.css'))
        .pipe(gulpif(isProd, minifyCSS()))
        .pipe(buffer())
        .pipe(rev())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('varer/static_build'))
        .pipe(rev.manifest({path: 'rev-manifest-styles.json'}))
        .pipe(gulp.dest('varer/static_build'));
});

gulp.task('scripts-library', function () {
    return processScripts(js_files_library, 'library');
});

gulp.task('scripts', function() {
    return processScripts(js_files, 'frontend');
});

gulp.task('templates', ['templates-normal'], function() {
    return gulp.src('varer/frontend/**/*.html')
        .pipe(gulp.dest('varer/static_build/views'));
});

gulp.task('templates', function() {
    return gulp.src(['varer/frontend/**/*.html'])
        .pipe(rename(function(path) {
            path.dirname = "views/" + path.dirname;
        }))
        .pipe(minifyHTML({
            quotes: true,
            empty: true
        }))
        .pipe(templates('templates.js', {module: 'cyb.varer'}))
        .pipe(buffer())
        .pipe(rev())
        .pipe(gulp.dest('varer/static_build'))
        .pipe(rev.manifest({path: 'rev-manifest-templates.json'}))
        .pipe(gulp.dest('varer/static_build'));
});

gulp.task('fonts', function() {
    return gulp.src('./bower_components/bootstrap-sass-official/assets/fonts/**')
        .pipe(gulp.dest('varer/static_build/fonts'));
});

gulp.task('rev-concat', function() {
    return gulp.src('varer/static_build/rev-manifest-*.json')
        .pipe(extend('rev-manifest.json'))
        .pipe(gulp.dest('varer/static_build'));
});

gulp.task('watch', function() {
    gulp.watch('varer/frontend/**/*.scss').on('change', function () { runSequence('styles', 'rev-concat'); });
    gulp.watch(js_files).on('change', function () { runSequence('scripts', 'rev-concat'); });
    gulp.watch('varer/frontend/**/*.html').on('change', function () { runSequence('templates', 'rev-concat'); });
});

gulp.task('production', function(cb) {
    isProd = true;
    runSequence(
        ['styles', 'scripts-library', 'scripts', 'fonts', 'templates'],
        'rev-concat',
        cb);
});

gulp.task('default', function(cb) {
    runSequence(
        ['styles', 'scripts-library', 'scripts', 'templates'],
        'rev-concat',
        cb);
});