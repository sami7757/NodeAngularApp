var gulp = require('gulp');
var jshint = require('gulp-jshint');
var paths = {
	scripts: 'modules/*.js'
};

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('scripts', function() {
  gulp.src(['./bower_components/angular/angular.min.js',
            './bower_components/angular-ui-router/release/angular-ui-router.min.js',
            './bower_components/angular-animate/angular-animate.min.js',
            './bower_components/angular-sanitize/angular-sanitize.min.js',
            './bower_components/angular-resource/angular-resource.min.js',
            './bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
            './bower_components/angularUtils-pagination/dirPagination.js',
            './bower_components/lodash/lodash.js',
            './modules/common/common.module.js',
            './modules/user/user.module.js',
            './modules/app.module.js',
            './modules/user/userdataservice.js',
            './modules/user/usercontroller.js', 
            './modules/user/userdetailscontroller.js'])
    .pipe(concat('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./modules/dist/'))
});

gulp.task('watch', [], function () {
    gulp.watch(paths.scripts).on('change', function (event) {
        if (event.type === 'changed') {
            gulp.src(event.path)
                .pipe(jshint('.jshintrc'))
                .pipe(jshint.reporter('jshint-stylish'));
        }
    });
});

gulp.task('jshint', [], function () {
    gulp.src(paths.scripts)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('css', function(){
    return gulp.src('client/templates/*.less')
      .pipe(less())
      .pipe(minifyCSS())
      .pipe(gulp.dest('build/css'))
});
  
gulp.task('default', [ 'scripts' ]);
