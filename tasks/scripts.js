import { parallel, src, dest, watch } from 'gulp';
import ts from 'gulp-typescript';


const ext = '.ts';
const glob = [
    `sources/**/*${ ext }`,
    `!sources/**/*.test${ ext }`,
];

const scripts = () => src(glob)
    .pipe(ts({
        target: 'es5',
        // strict: true,
        // module: 'amd',
    }))
    .pipe(dest('build/scripts/'));

const scriptsWatch = cb => {
    const watcher = watch(glob);
    // 'add', 'addDir', 'change', 'unlink', 'unlinkDir', 'ready', 'error', 'all'
    watcher.on('change', parallel(scripts));
    cb();
};


export {
    scripts,
    scriptsWatch,
};
