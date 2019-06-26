
import { series } from 'gulp';

import {
    clear,
    immutable,
    build,
    // watch,
} from './tasks/'

const defaultTask = series(
    clear,
    immutable,
    build,
    // watch, // gulp.parallel(...tasks)
)

export {
    defaultTask as default,

    clear,
    immutable,
    build,
    // watch,
}

// import { readdirSync, existsSync, statSync } from 'fs';
// const isFile = path => existsSync(path) && statSync(path).isFile();
// const isDirectory = path => existsSync(path) && statSync(path).isDirectory();
