var gulp = require('gulp'),
    docco = require('gulp-docco'),
    connect = require('gulp-connect'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify');

gulp.task('connect', function() {
  connect.server({
    root: './',
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src('./**/*.html')
    .pipe(connect.reload());
});

gulp.task('docs', function() {
  gulp.src("./catquery.js")
    .pipe(docco({
      template: 'docs/docs.jst'
    }))
    .pipe(rename("index.html"))
    .pipe(gulp.dest('./docs'))
});

gulp.task('minify', function() {
  gulp.src("./catquery.js")
    .pipe(uglify())
    .pipe(rename("catquery.min.js"))
    .pipe(gulp.dest('./'))
});

gulp.task('watch', function () {
  gulp.watch(['./catquery.js'], ['docs','minify','html']);
});

gulp.task('default', ['connect', 'watch']);
