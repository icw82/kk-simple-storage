import { parallel, src, dest, watch } from 'gulp';


const glob = [
    'requirejs/require.js',
    'tslib/tslib.js',
    'mocha/mocha.js',
    'mocha/mocha.css',
    'chai/chai.js',
].map(item => './node_modules/' + item);

const thirdParty = () => src(glob)
    .pipe(dest('build/third-party/'));

const thirdPartyWatch = cb => {
    const watcher = watch(glob);
    watcher.on('change', parallel(thirdParty));
    cb();
};


export {
    thirdParty,
    thirdPartyWatch,
};
