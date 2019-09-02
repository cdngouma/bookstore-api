const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/database');

// Test DB connection
db.authenticate()
.then(() => console.log('Connection has been established successfully.'))
.catch((err) => console.log('Unable to connect to the database:', err));

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// handle CORS errors
/*app.use((req, res, next) => {
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
});*/

const bookRoutes = require('./routes/books');

// routes which handle requests
app.use('/books', bookRoutes);

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

module.exports = app;