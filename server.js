const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const bodyParser = require('body-parser');
const config = require('./config');

const app = express();

// import routes
const userRoutes = require('./routes/user');
const sellerRoutes = require('./routes/sellers');
const bookRoutes = require('./routes/books');

// Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//const VERSION = config.API_VERSION;

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/sellers', sellerRoutes);
app.use('/api/v1/books', bookRoutes);

// Config
app.set('port', config.PORT);

const server = http.createServer(app);
server.listen(config.PORT, () => {
    mongoose.connect(
        config.MONGODB_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }
    );
});

const db = mongoose.connection;

db.on('error', (err) => console.log(err));

db.once('open', () => {
    console.log(`server started on port ${config.PORT}...`);
});