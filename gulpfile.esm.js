
import { series, parallel } from 'gulp';

import {
    clear,

    immutable,
    immutableWatch,

    build,
    buildWatch,

    scripts,
    scriptsWatch,

} from './tasks/'


const watch = parallel(
    immutableWatch,
    buildWatch,
)

const defaultTask = series(
    clear,
    immutable,
    build,
    watch,
)


export {
    defaultTask as default,

    clear,

    immutable,
    immutableWatch,

    build,
    buildWatch,

    scripts,
    scriptsWatch,

    watch,
}

// import { readdirSync, existsSync, statSync } from 'fs';
// const isFile = path => existsSync(path) && statSync(path).isFile();
// const isDirectory = path => existsSync(path) && statSync(path).isDirectory();
