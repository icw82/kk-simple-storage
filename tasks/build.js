import { parallel, src, dest, watch } from 'gulp';

// 'third-party',
// 'scripts',
// 'styles'

const ext = `.js`;
const glob = [
    `sources/**/*${ ext }`,
    `!sources/**/*.test${ ext }`,
];

const build = () => src(glob)
    .pipe(dest('build/'));

// 'add', 'addDir', 'change', 'unlink', 'unlinkDir', 'ready', 'error', 'all'

const buildWatch = (cb) => {
    const watcher = watch(glob);//
    watcher.on('change', parallel(build));
    cb();
};

export {
    build,
    buildWatch,
}
