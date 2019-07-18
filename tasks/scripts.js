import { parallel, src, dest, watch } from 'gulp';
import ts from 'gulp-typescript';


const tsProject = ts.createProject({
    target: 'es5',
    module: 'amd',
    lib: [
        'es2015',
        'es2016',
        'es2017',
        'dom',
    ],

    declaration: true,
    noImplicitReturns: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    strict: true,

    forceConsistentCasingInFileNames: true,

    moduleResolution: 'Classic', // 'node'
});

const glob = [
    'sources/**/*.ts',
    '!sources/immutable/**/*',
    // '!sources/**/*.test.ts',
];

const scripts = () => src(glob)
    .pipe(tsProject())
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
