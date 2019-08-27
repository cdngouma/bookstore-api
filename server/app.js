const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const bookRoutes = require('./api/routes/books');
const authorRoutes = require('./api/routes/authors');

const MONGO_ATLAS_PW = "root";

mongoose.connect(
    "mongodb+srv://root:" + MONGO_ATLAS_PW + 
    "@cdz-bqppm.mongodb.net/test?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useCreateIndex: true
    }
);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// handle CORS errors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headears', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, GET, DELETE');
        return res.status(200).json({});
    }

    next();
});

// routes which handle requests
app.use('/authors', authorRoutes);
app.use('/books', bookRoutes);
// app.use('/orders', orderRoutes);

// fires if url is not valid (does not exist)
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

module.exports = app;