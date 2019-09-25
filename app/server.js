const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const app = express();

const env = require('dotenv');
env.config();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const userRoutes = require('./api/routes/user');
//const merchantRoutes = require('./api/routes/merchants');
//const bookRoutes = require('./api/routes/books');

// routes which handle requests
const API_VERSION = process.env.API_VERSION || 'dev';
app.use(`/api/${API_VERSION}/user`, userRoutes);
//app.use(`/api/${API_VERSION}/merchants`, merchantRoutes);
//app.use(`/api/${API_VERSION}/books`, bookRoutes);

// fires when uri is not supported (does not exist)
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// handle any other thrown errors
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: {
            message: err.message
        }
    });
});

const PORT = process.env.PORT || 3000;
app.set('port', PORT);

const server = http.createServer(app);
server.listen(PORT, () => { console.log(`running version ${API_VERSION} on port ${PORT}`) });