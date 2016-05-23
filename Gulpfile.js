var gulp = require('gulp');
var g = require('gulp-load-plugins')();
var autoprefixer = require('autoprefixer');
var pngquant = require('imagemin-pngquant');
var del = require('del');
var path = require('path');
var pkg = require('./package.json');

//  Post-minification gulp-rename configuration.
var minifiedRenameConfig = {
    suffix: '.min'
};

function handleError(error) {
    g.util.log(g.util.colors.red.bold('[✘] ' + error.plugin) + ' error in ' + g.util.colors.underline(error.relativePath) + ':\n\t   '
        + error.messageOriginal + ' (line ' + error.line + ', column ' + error.column + ')');
    return g.notify.onError({
        title: error.plugin,
        message: error.messageOriginal
    })(error);
}

//  Helper function for gulp.dest() to make sure 'target' in package.json is used as target directory.
function targetDir(dir) {
    return path.join(pkg.config.target, dir);
}


//  CSS TASK
//      1. Compiles Sass to CSS.
//      2. Adds vendor prefixes where needed.
//      3. Minify.

gulp.task('css', function () {

    var postcssPlugins = [
        autoprefixer({
            browsers: ['last 2 versions']
        })
    ];

    return gulp.src('sass/main.scss')
        .pipe(g.sass().on('error', handleError))
        .pipe(g.postcss(postcssPlugins))
        .pipe(g.minifyCss())  //  CSSNano (postCSS): http://cssnano.co/optimisations/
        .pipe(g.rename(minifiedRenameConfig))
        .pipe(gulp.dest(targetDir('css')));

});


//  JSHINT TASK
//      Finds and reports javascript errors to the terminal.

gulp.task('jshint', function () {

    var sourceFiles = [
        'js/main.js',
        'js/components/*.js'
    ];

    return gulp.src(sourceFiles)
        .pipe(g.jshint())
        .pipe(g.jshint.reporter('jshint-stylish'));

});


//  JS TASK
//      1. Runs JSHint task (see above ^).
//      2. Concatenates source javascript files.
//      3. Minifies the result.

gulp.task('js', gulp.series('jshint', function javascript() {

    var sourceFiles = [
        'js/libs/*.js',
        'js/libs/bootstrap/*.js',
        '!js/bootstrap/excludes/*',
        'js/components/*.js',
        'js/main.js'
    ];

    return gulp.src(sourceFiles)
        .pipe(g.concat('main.js'))
        .pipe(g.uglify())
        .pipe(g.rename(minifiedRenameConfig))
        .pipe(gulp.dest(targetDir('js')));

}));


//  IMG TASK
//      1. Minifies .svg, .png, .jpg, .gif and .ico files.
//      2. Provides .png fallbacks for .svg images.

gulp.task('img', function () {

    var imageminConfig = {
        progressive: true,
        interlaced: true,
        svgoPlugins: [
            {removeViewBox: false},
            {cleanupIDs: false},
            {removeUselessStrokeAndFill: false}
        ],
        use: [pngquant()]
    };

    var svgFilter = g.filter('**/*.svg');

    return gulp.src('img/**/*.{svg,png,jpg,gif,ico}')
        .pipe(g.imagemin(imageminConfig))
        .pipe(gulp.dest(targetDir('img')))
        .pipe(svgFilter)
        .pipe(g.svg2png())
        .pipe(g.imagemin(imageminConfig))
        .pipe(gulp.dest(targetDir('img/svg/fallback')));

});


//  WEBFONTS TASK
//      Copies fonts.

gulp.task('webfonts', function () {

    return gulp.src('fonts/**/*.*')
        .pipe(gulp.dest(targetDir('fonts')));

});


//  ICONFONT TASK
//      Creates an iconfont from .svg files.

gulp.task('iconfont', function () {

    var iconfontConfig = {
        fontName: 'icons'
    };

});


//  FONTS TASK
//      Copies webfonts, generates iconfont (see above ^).

gulp.task('fonts', gulp.parallel('webfonts'));


//  BUILD TASK
//      Runs css, js, img and fonts tasks (see above ^).

gulp.task('build', gulp.parallel('css', 'js', 'img', 'fonts'));


//  WATCH TASK

gulp.task('watch', function () {

    gulp.watch('sass/**/*.scss', gulp.task('css'));
    gulp.watch('js/**/*.js', gulp.task('js'));
    gulp.watch('img/**/*.{svg,png,jpg,gif,ico}', gulp.task('img'));

});

//  SERVE TASK
//      

gulp.task('serve', gulp.series('build', function serve() {

    browserSync.init({
        //
    });

    gulp.watch(targetDir(), browserSync.reload);

}, 'watch'));

//  DEFAULT TASK
//      Runs css, js, img and fonts tasks, then watches for changes.

gulp.task('default', gulp.series('build', 'watch'));