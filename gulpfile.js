var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    browserSync = require('browser-sync').create(),
    runSequence = require('run-sequence');

var path = {
    css: "css/",
    src: "js/",
    components: "bower_components/"
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
        'minify-frontpage-css'
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

    return gulp.src(path.src + 'spoooky.Blueprints.js')
        .pipe(uglify())
        .pipe(rename('spoooky.Blueprints.min.js'))
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

gulp.task('serve', function() {

    browserSync.init({
        server: {
            baseDir: './'
        },
        port: 1503
    });
});