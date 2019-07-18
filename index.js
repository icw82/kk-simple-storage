/* eslint-disable no-undef */
require = require('esm')(module, {
    await: true,
    // wasm: true,
});

module.exports = require('./main.js');
