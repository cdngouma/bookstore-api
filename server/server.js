const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

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
app.use('/api/books', bookRoutes);

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

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () => { console.log(`Server started on port ${port}`) });