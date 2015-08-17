var gulp         = require('gulp');
var browserSync  = require('browser-sync').create();
var sass         = require('gulp-sass');
var shell        = require('gulp-shell');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var uncss        = require('gulp-uncss');
var size         = require('gulp-size');
var minifyCss    = require('gulp-minify-css');
var run          = require('run-sequence');
var ghPages      = require('gulp-gh-pages');

// Static Server + watching scss/html files
gulp.task('serve', function() {

    browserSync.init({
        server: "./_build"
    });

    gulp.watch("./_sass/**/*.scss", ['sass']);
    gulp.watch("./_build/*.html").on('change', browserSync.reload);
    gulp.watch(['./**/*.html', '!_build'], ['jekyll-rebuild']);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function () {
  return gulp.src('./_sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(autoprefixer({ browsers: ['last 2 version'] }))
    .pipe(gulp.dest('./css'))
    .pipe(gulp.dest('./_build/css'))
    .pipe(size({
        title: 'Compiled SASS:',
        showFiles: true
    }))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task("jekyll-build", shell.task("jekyll build"));

gulp.task("jekyll-rebuild", ["jekyll-build"], function () {
  browserSync.reload();
});

gulp.task('uncss', function() {
    return gulp.src('./_build/css/style.css')
        .pipe(uncss({
            html: ['./_build/index.html']
        }))
        .pipe(gulp.dest('./css'))
        .pipe(gulp.dest('./_build/css/'))
        .pipe(size({
            title: 'Unused CSS removed:',
            showFiles: true
        }));
    });

gulp.task('minifyCSS', function() {
    return gulp.src('./_build/css/style.css')
        .pipe(minifyCss({
            compatibility: 'ie8',
            keepSpecialComments: 0
        }))
        .pipe(gulp.dest('./css'))
        .pipe(gulp.dest('./_build/css'))
        .pipe(size({
            title: 'Minified CSS:',
            showFiles: true
        }));
});

gulp.task('publish', function() {
  return gulp.src('./**/*')
    .pipe(ghPages());
});

// Routines
gulp.task('default', ['jekyll-build', 'sass', 'serve']);
gulp.task('production', function() {
    run('sass', 'uncss', 'minifyCSS');
});
gulp.task('deploy', function() {
    run('production', )
})
