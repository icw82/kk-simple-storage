import { parallel, src, dest, watch } from 'gulp';
// import replace from 'gulp-replace';
// const info = require('./../package.json');


const glob = 'sources/immutable/**/*.*';

const immutable = () => src(glob, {allowEmpty: true})
    // .pipe(replace(/::version::/g, info.version))
    .pipe(dest('build'));

const immutableWatch = cb => {
    const watcher = watch(glob);
    watcher.on('change', parallel(immutable));
    cb();
};


export {
    immutable,
    immutableWatch,
};
