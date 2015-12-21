var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    browserSync = require('browser-sync').create(),
    runSequence = require('run-sequence');

var path = {
    css: 'css/',
    src: 'js/',
    components: 'bower_components/'
};

gulp.task('build', function() {

    runSequence(
        'compress-spoooky',
        'compress-worker',
        'compress-blueprints',
        'compress-deps',
        'compress-deps-worker',
        'compress-deps-frontpage',
        'minify-css',
        'minify-frontpage-css',
        'html2js'
    );
});

gulp.task('default', function() {

    runSequence(
        'build'
    );
});

gulp.task('compress-spoooky', function() {

    return gulp.src([
            path.src + 'spoooky.js',
            path.src + 'spoooky.Models.js',
            path.src + 'spoooky.Game.js',
            path.src + 'spoooky.DiceBox.js',
            path.src + 'spoooky.GridWelt.js',
            path.src + 'spoooky.OffBoard.js',
            path.src + 'spoooky.GameEvents.js',
            path.src + 'spoooky.JobQueue.js',
            path.src + 'spoooky.Areas.js',
            path.src + 'spoooky.Agent.js',
            path.src + 'spoooky.MetaAgent.js',
            path.src + 'spoooky.Entity.js',
            path.src + 'spoooky.AI.js']
    ).pipe(concat('spoooky.max.js'))
        .pipe(gulp.dest(path.src))
        .pipe(rename('spoooky.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(path.src));
});

gulp.task('compress-worker', function() {

    return gulp.src(path.src + 'spoooky.Worker.js')
        .pipe(uglify())
        .pipe(rename('spoooky.Worker.min.js'))
        .pipe(gulp.dest(path.src));
});

gulp.task('compress-blueprints', function() {

    return gulp.src([path.src + '/blueprints/*.js', '!' + path.src + '/blueprints/*.min.js'])
        .pipe(uglify())
        .pipe(rename({
            dirname: 'blueprints/',
            extname: '.min.js'
        }))
        .pipe(gulp.dest(path.src));
});

gulp.task('compress-deps', function() {

    return gulp.src([
        path.components + 'jquery/dist/jquery.min.js',
        path.components + 'angular/angular.min.js',
        path.components + 'angular-bootstrap/ui-bootstrap-tpls.min.js',
        path.components + 'bootstrap/dist/js/bootstrap.min.js',
        path.components + 'c3/c3.min.js',
        path.components + 'd3/d3.min.js',
        path.components + 'filesaver/FileSaver.min.js',
        path.components + 'underscore/underscore-min.js']
    ).pipe(concat('deps.min.js'))
        .pipe(gulp.dest(path.src));
});

gulp.task('compress-deps-worker', function() {

    return gulp.src([
        path.components + 'underscore/underscore-min.js']
    ).pipe(concat('deps-worker.min.js'))
        .pipe(gulp.dest(path.src));
});

gulp.task('compress-deps-frontpage', function() {

    return gulp.src([
        path.components + 'jquery/dist/jquery.min.js',
        path.components + 'bootstrap/dist/js/bootstrap.min.js']
    ).pipe(concat('deps-frontpage.min.js'))
        .pipe(gulp.dest(path.src));
});

gulp.task('minify-css', function(){

    return gulp.src([
            path.components + 'bootstrap/dist/css/bootstrap.css',
            path.css + 'spoookystyle.css',
            path.components + 'c3/c3.css']
    )
        .pipe(minifyCSS())
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest(path.css))
});

gulp.task('minify-frontpage-css', function(){

    return gulp.src([
            path.components + 'bootstrap/dist/css/bootstrap.css',
            path.css + 'startstyle.css',
            path.css + 'prettify.css']
        )
        .pipe(minifyCSS())
        .pipe(concat('style-frontpage.min.css'))
        .pipe(gulp.dest(path.css))
});

// converts, minifies and concatenates html templates to a single js file in build dir
var ngHtml2Js = require('gulp-ng-html2js');
var minifyHtml = require('gulp-minify-html');

gulp.task('html2js', function() {

    return gulp.src('templates/**/*.htm')
        .pipe(minifyHtml())
        .pipe(ngHtml2Js({ moduleName: 'spoooky.templates', prefix: 'templates/' }))
        .pipe(concat('spoooky.tpls.js'))
        .pipe(gulp.dest('js'));
});

gulp.task('serve', ['compress-spoooky', 'compress-worker', 'compress-blueprints', 'html2js'], function() {

    browserSync.init({
        server: {
            baseDir: './'
        },
        port: 1503
    });

    gulp.watch(['js/spoooky.js',
        'js/spoooky.Models.js',
        'js/spoooky.Game.js',
        'js/spoooky.DiceBox.js',
        'js/spoooky.GridWelt.js',
        'js/spoooky.OffBoard.js',
        'js/spoooky.GameEvents.js',
        'js/spoooky.JobQueue.js',
        'js/spoooky.Areas.js',
        'js/spoooky.Agent.js',
        'js/spoooky.MetaAgent.js',
        'js/spoooky.Entity.js',
        'js/spoooky.AI.js'], ['compress-spoooky']);

    gulp.watch('js/spoooky.Worker.js', ['compress-worker']);
    gulp.watch('js/blueprints/*.js', ['compress-blueprints']);

    gulp.watch('templates/**/*.htm', ['html2js']);

    gulp.watch(['index.htm',
        'templates/*.htm',
        'games/**/index.htm',
        'games/**/game.js',
        'js/*.js'], browserSync.reload);
});