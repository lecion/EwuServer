/**
 * Created by Lecion on 3/21/16.
 */
'use strict';
var gulp    = require('gulp');
var nodemon = require('gulp-nodemon');

var paths = {
    server : {
        index : 'bin/www'
    }
}

var nodemonConfig = {
    script : paths.server.index,
    ext    : 'js html',
    ignore : [
        'README.md',
        'node_modules/**',
        '.DS_Store'
    ],
    env    : {
        'NODE_ENV' : 'development'
    }
};

gulp.task('default', ['start']);

//gulp.watch(['app/views/**', 'public/js/**', 'app/models/**/*.js', 'schemas/**/*.js', 'routes/**/*.js'], function (event) {
//    console.log('File' + event.path + ' was ' + event.type + ', running tasks...');
//});

gulp.task('start', function () {
    return nodemon(nodemonConfig).on('restart', function () {
        console.log('restarted!')
    });
})