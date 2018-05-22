var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    sprite = require('gulp.spritesmith'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    newer = require('gulp-newer'),
    buffer = require('vinyl-buffer'),
    merge = require('merge-stream'),
    gutil = require('gulp-util'),
    slug = "qaapp",
    reportError = function (error) {
        notify({
            title: 'Oh no, an error!',
            message: 'Check the console.'
        }).write(error);

        console.log(error.toString());

        this.emit('end');
    };

gulp.task('styles', function() {
    return gulp.src('src/scss/main.scss')
        .pipe(plumber({
            errorHandler: reportError
        }))
        .pipe(sass({
          includePaths: ["src/scss/"],
          outputStyle: "compact"
        }))
        .pipe(autoprefixer({
          browsers: [
              'last 2 versions',
              '> 5% in US',
              'safari 5',
              'ie 8',
              'iOS 6',
              'android 4']
        }))
        .pipe(rename(slug + '-style.css'))
        .pipe(gulp.dest(slug))
        .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('scripts', function() {
    return gulp.src(['src/js/main.js', 'src/js/libs/*.js'])
        .pipe(plumber({
            errorHandler: reportError
        }))
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(concat(slug + '-script.js'))
        .pipe(gulp.dest(slug))
        .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('deploy', ['styles', 'scripts']);

gulp.task('default', function() {
    // Watch .scss files
    gulp.watch('src/scss/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('src/js/**/*.js', ['scripts']);

});
