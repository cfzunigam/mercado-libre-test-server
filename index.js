const express = require('express');
const routes = require('./route');

const app = express();
const port = 8080;

app.use(routes);

app.listen(port, () => {
    console.log(`API escuchando en http://localhost:${port}`);
});
