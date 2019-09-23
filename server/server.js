const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const env = require('dotenv');

const app = express();
env.config();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const userRoutes = require('./routes/user');
const merchantRoutes = require('./routes/merchants');
const bookRoutes = require('./routes/books');

// routes which handle requests
app.use(`/api/${process.env.API_VERSION}/user`, userRoutes);
app.use(`/api/${process.env.API_VERSION}/merchants`, merchantRoutes);
app.use(`/api/${process.env.API_VERSION}/books`, bookRoutes);

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

const server = http.createServer(app);

server.listen(process.env.PORT, () => { console.log(`running version ${process.env.API_VERSION} on port ${process.env.PORT}`) });