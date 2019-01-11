var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cleanCss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    del = require('del');



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

gulp.task('copy-categories-and-tasks-to-json', function (done) {
   gulp.src('output_dev/categories-and-tags/index.html')
       .pipe(rename('categories-and-tags.json'))
       .pipe(gulp.dest('output_dev/'));
   gulp.src('output_prod/categories-and-tags/index.html')
       .pipe(rename('categories-and-tags.json'))
       .pipe(gulp.dest('output_prod/'));
    done();
});

gulp.task('delete-old-categories-and-tasks-html-folder', gulp.series(['copy-categories-and-tasks-to-json']), function () {
    return del([
        'output_dev/categories-and-tags/**',
        'output_dev/_posts/**',
        'output_dev/_sass/**',
        'output_prod/categories-and-tags/**',
        'output_prod/_posts/**',
        'output_prod/_sass/**'
    ])
});

gulp.task('categories-and-tasks-to-json', gulp.series(['copy-categories-and-tasks-to-json', 'delete-old-categories-and-tasks-html-folder']));

gulp.task('default', gulp.series(['sass', 'bootstrap-js', 'categories-and-tasks-to-json']));

gulp.task('sculpin', gulp.series(['default']));
