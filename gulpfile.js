var gulp = require('gulp'),
    del = require('del'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    browserSync = require('browser-sync').create(),
    runSequence = require('run-sequence');

var path = {
    css: 'src/css/',
    src: 'src/js/',
    components: 'bower_components/',
    dist: 'dist/'
};

gulp.task('build', function() {

    runSequence(
        'clean',
        'compress-spoooky',
        'compress-worker',
        'compress-blueprints',
        'compress-deps',
        'compress-deps-worker',
        'compress-deps-frontpage',
        'minify-css',
        'minify-frontpage-css',
        'html2js',
        'copy-modules',
        'copy-fonts',
        'copy-images',
        'copy-tutorials',
        'copy-games',
        'copy-index',
        'copy-apidocs'
    );
});

gulp.task('clean', function() {

    return del(path.dist + '**/*');
});

gulp.task('copy-fonts', function() {

    var bsFontPath = path.components + 'bootstrap/dist/fonts';
    return gulp.src(bsFontPath + '**/*', { base: bsFontPath })
        .pipe(gulp.dest(path.dist + 'fonts'));
});

gulp.task('copy-images', function() {

    return gulp.src('src/img/**/*')
        .pipe(gulp.dest(path.dist + 'img'));
});

gulp.task('copy-games', function() {

    return gulp.src('src/games/**/*')
        .pipe(gulp.dest(path.dist + 'games'));
});

gulp.task('copy-tutorials', function() {

    return gulp.src('src/tutorials/**/*')
        .pipe(gulp.dest(path.dist + 'tutorials'));
});

gulp.task('copy-index', function() {

    return gulp.src('src/index.html')
        .pipe(gulp.dest(path.dist));
});

gulp.task('copy-modules', function() {

    return gulp.src('src/js/spoooky.Modules.js')
        .pipe(gulp.dest(path.dist + 'js'));
});

gulp.task('copy-apidocs', function() {

    return gulp.src('docs/**/*')
        .pipe(gulp.dest(path.dist + 'docs'));
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
        .pipe(gulp.dest(path.dist + 'js'))
        .pipe(rename('spoooky.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(path.dist + 'js'));
});

gulp.task('compress-worker', function() {

    return gulp.src(path.src + 'spoooky.Worker.js')
        .pipe(uglify())
        .pipe(rename('spoooky.Worker.min.js'))
        .pipe(gulp.dest(path.dist + 'js'));
});

gulp.task('compress-blueprints', function() {

    return gulp.src([path.src + '/blueprints/*.js', '!' + path.src + '/blueprints/*.min.js'])
        .pipe(uglify())
        .pipe(rename({
            dirname: 'blueprints/',
            extname: '.min.js'
        }))
        .pipe(gulp.dest(path.dist + 'js'));
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
        .pipe(gulp.dest(path.dist + 'js'));
});

gulp.task('compress-deps-worker', function() {

    return gulp.src([
        path.components + 'underscore/underscore-min.js']
    ).pipe(concat('deps-worker.min.js'))
        .pipe(gulp.dest(path.dist + 'js'));
});

gulp.task('compress-deps-frontpage', function() {

    return gulp.src([
        path.components + 'jquery/dist/jquery.min.js',
        path.components + 'bootstrap/dist/js/bootstrap.min.js']
    ).pipe(concat('deps-frontpage.min.js'))
        .pipe(gulp.dest(path.dist + 'js'));
});

gulp.task('minify-css', function(){

    return gulp.src([
            path.components + 'bootstrap/dist/css/bootstrap.css',
            path.css + 'spoookystyle.css',
            path.components + 'c3/c3.css']
    )
        .pipe(minifyCSS())
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest(path.dist + 'css'))
});

gulp.task('minify-frontpage-css', function(){

    return gulp.src([
            path.components + 'bootstrap/dist/css/bootstrap.css',
            path.css + 'startstyle.css',
            path.css + 'prettify.css']
        )
        .pipe(minifyCSS())
        .pipe(concat('style-frontpage.min.css'))
        .pipe(gulp.dest(path.dist + 'css'))
});

var ngHtml2Js = require('gulp-ng-html2js');
var minifyHtml = require('gulp-minify-html');

gulp.task('html2js', function() {

    return gulp.src('src/templates/**/*.htm')
        .pipe(minifyHtml())
        .pipe(ngHtml2Js({ moduleName: 'spoooky.templates', prefix: 'templates/' }))
        .pipe(concat('spoooky.tpls.js'))
        .pipe(gulp.dest(path.dist + 'js'));
});

gulp.task('serve', ['build'], function() {

    browserSync.init({
        server: {
            baseDir: './dist'
        },
        port: 1503
    });

    gulp.watch(['src/js/spoooky.js',
        'src/js/spoooky.Models.js',
        'src/js/spoooky.Game.js',
        'src/js/spoooky.DiceBox.js',
        'src/js/spoooky.GridWelt.js',
        'src/js/spoooky.OffBoard.js',
        'src/js/spoooky.GameEvents.js',
        'src/js/spoooky.JobQueue.js',
        'src/js/spoooky.Areas.js',
        'src/js/spoooky.Agent.js',
        'src/js/spoooky.MetaAgent.js',
        'src/js/spoooky.Entity.js',
        'src/js/spoooky.AI.js'], ['compress-spoooky']);

    gulp.watch(path.src + 'spoooky.Worker.js', ['compress-worker']);
    gulp.watch(path.src + 'blueprints/*.js', ['compress-blueprints']);
    gulp.watch('src/games/**/*', ['copy-games']);
    gulp.watch('src/css/**/*', ['minify-css']);

    gulp.watch('src/templates/**/*.htm', ['html2js']);
    gulp.watch('src/tutorials/**/*', ['copy-tutorials']);

    gulp.watch(['src/index.htm',
        'src/css/**/*',
        'src/templates/*.htm',
        'src/tutorials/**/*',
        'src/games/**/index.htm',
        'src/games/**/game.js',
        'src/js/**/*'], browserSync.reload);
});