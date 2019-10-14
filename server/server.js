const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const app = express();

const env = require('dotenv');
env.config();

const API_VERSION = process.env.API_VERSION || 'dev';
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// import routes
const userRoutes = require('./api/routes/user');
const sellerRoutes = require('./api/routes/sellers');
const bookRoutes = require('./api/routes/books');

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/sellers', sellerRoutes);
app.use('/api/v1/books', bookRoutes);

// fires when uri is not supported (does not exist)
app.use((req, res, next) => {
    console.log("not found");
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// handle any unhandled error
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: {
            message: err.message
        }
    });
});

app.set('port', PORT);

const server = http.createServer(app);
server.listen(PORT, () => { console.log(`running version ${API_VERSION} on port ${PORT}`) });