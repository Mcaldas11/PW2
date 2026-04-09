import express from 'express';

const app = express();
const router = express.Router();
const host = 'localhost';
const port = 3000;


app.listen(port, host, () => {
    console.log(`App listening at http://${host}:${port}/`);
});