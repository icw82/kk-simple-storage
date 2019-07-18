import express from 'express';


const port = 3000;
const app = express();

// eslint-disable-next-line no-undef
app.use('/', express.static('build'));

app.listen(port, () => {
    console.log(`Static server is running at localhost:${ port }.`);
});
