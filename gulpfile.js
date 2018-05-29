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
    return gulp.src(['src/js/libs/*.js', 'src/js/helper/*.js', 'src/js/main.js'])
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

var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var log = require('gulplog');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');

// add custom browserify options here
var customOpts = {
    entries: ['/Applications/XAMPP/xamppfiles/htdocs/qaapp/node_modules/dragula/'],
    debug: true 
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

// add transformations here
// i.e. b.transform(coffeeify);

gulp.task('js-bundle', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', log.info); // output build logs to terminal

function bundle() {
    return b.bundle()
        // log errors if they happen
        .on('error', log.error.bind(log, 'Browserify Error'))
        .pipe(source('bundle.js'))
        // optional, remove if you don't need to buffer file contents
        .pipe(buffer())
        // optional, remove if you dont want sourcemaps
        .pipe(sourcemaps.init({ loadMaps: true })) // loads map from browserify file
        // Add transformation tasks to the pipeline here.
        .pipe(sourcemaps.write('./')) // writes .map file
        .pipe(gulp.dest('./dist'));
}