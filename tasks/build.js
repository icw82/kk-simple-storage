import { parallel } from 'gulp';
import { scripts, scriptsWatch } from './scripts.js';
import { thirdParty, thirdPartyWatch } from './third-party.js';
// import { styles, stylesWatch } from './styles.js';


const build = parallel(
    thirdParty,
    scripts,
    // styles
);

const buildWatch = parallel(
    thirdPartyWatch,
    scriptsWatch,
    // stylesWatch,
);


export {
    build,
    buildWatch,
    // stylesWatch,
}
