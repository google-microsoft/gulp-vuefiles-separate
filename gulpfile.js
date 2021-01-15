const {src, dest, task, series} = require('gulp');
const {pickScript, scriptSrcLink} = require('./gulp-vfiles');
const del = require('del');

exports.createJs = function () {
    del.sync('output');
    return src(['src/**/*.vue'])
        .pipe(pickScript({extname: '.js'}))
        .pipe(dest('output/'));
}

exports.createBDBVue = function () {
    return src(['src/**/*.vue'])
        .pipe(scriptSrcLink({extname: '.vue', prefix: 'bdb.'}))
        .pipe(dest('output/'));

};

exports.createHJBVue = function () {
    return src(['src/**/*.vue'])
        .pipe(scriptSrcLink({extname: '.vue', prefix: 'hjb.'}))
        .pipe(dest('output/'));

};
exports.createXXBVue = function () {
    return src(['src/**/*.vue'])
        .pipe(scriptSrcLink({extname: '.vue', prefix: 'xxb.'}))
        .pipe(dest('output/'));

};

