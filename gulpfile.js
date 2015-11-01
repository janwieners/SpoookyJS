var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css');

var path = {
    css: "css/",
    src: "js/",
    lib: "js/libs/"
};

gulp.task('default', function() {

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
            path.lib + 'jquery.min.js',
            path.lib + 'angular.min.js',
            path.lib + 'underscore-min.js',
            path.lib + 'bootstrap.min.js',
            path.lib + 'ui-bootstrap-tpls.min.js',
            path.lib + 'FileSaver.js',
            path.lib + 'd3.min.js',
            path.lib + 'c3.min.js']
    ).pipe(concat('deps.min.js'))
        .pipe(gulp.dest(path.lib));
});

gulp.task('minify-css', function(){

    gulp.src([
            path.css + 'bootstrap.min.css',
            path.css + 'c3.min.css',
            path.css + 'spoookystyle.css']
    ).pipe(minifyCSS())
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest(path.css))
});