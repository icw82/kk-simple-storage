import del from 'del';


const clear = done => del([
    'build/**/*',
], done);


export { clear }
