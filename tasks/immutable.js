import { src, dest } from 'gulp';
// import replace from 'gulp-replace';
// const info = require('./../package.json');

const glob = 'sources/immutable/**/*.*';

const immutable = () => src(glob, {allowEmpty: true})
    // .pipe(replace(/::version::/g, info.version))
    .pipe(dest('build'));

export { immutable }
