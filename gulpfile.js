var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cleanCss = require('gulp-clean-css');

gulp.task('default', ['sass', 'bootstrap-js']);

gulp.task('sculpin', ['default']);

gulp.task('bootstrap-js', function () {
    return gulp.src('node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js')
        .pipe(gulp.dest('output_dev/js/'))
        .pipe(gulp.dest('output_prod/js/'))
});

gulp.task('sass', function () {
    return gulp.src('source/_sass/style.sass')
        .pipe(sass())
        .pipe(cleanCss())
        .pipe(gulp.dest('output_dev/css/'))
        .pipe(gulp.dest('output_prod/css/'))
});