var gulp = require('gulp'),
	htmlmin = require('gulp-htmlmin'),
	pug = require('gulp-pug'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	cleanCSS = require('gulp-clean-css'),
	browserSync = require('browser-sync').create(),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	runSequence = require('run-sequence');

gulp.task('serve', function() {
	browserSync.init({
		server: { baseDir: "dist" },
		notify: false
	});
});

gulp.task('pug', function() {
	return gulp.src('src/pug/*.pug')
	.pipe(pug({ pretty: true }))
	.on('error', console.log)
	.pipe(htmlmin({collapseWhitespace: true}))
	.pipe(gulp.dest('dist'));
});

gulp.task('sass', function () {
	return gulp.src('src/sass/*.sass')
	.pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer({
		browsers: ['last 10 versions'],
		cascade: false
	}))
	.pipe(cleanCSS())
	.pipe(gulp.dest('dist/css'))
	.pipe(browserSync.stream());
});

gulp.task('scripts-libs', function() {
	return gulp.src('node_modules/jquery/dist/jquery.min.js')
	.pipe(concat('libs.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dist/js'));
});

gulp.task('scripts', function() {
	return gulp.src('src/js/*.js')
	.pipe(uglify())
	.pipe(gulp.dest('dist/js'));
});

gulp.task('img', function() {
	return gulp.src('src/img/*')
	.pipe(imagemin())
	.pipe(gulp.dest('dist/img'));
});

gulp.task('fonts', function() {
	return gulp.src('src/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'));
});

gulp.task('watch', function() {
	gulp.watch('src/pug/*.pug', ['pug', browserSync.reload]);
	gulp.watch('src/sass/*.sass', ['sass']);
	gulp.watch('src/js/*.js', ['scripts', browserSync.reload]);
});

gulp.task('build', function() {
	runSequence(['img', 'fonts'], ['pug', 'sass', 'scripts-libs', 'scripts']);
});

gulp.task('default', function() {
	runSequence(['img', 'fonts'], ['pug', 'sass', 'scripts-libs', 'scripts'], 'serve', 'watch');
});