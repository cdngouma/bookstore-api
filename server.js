const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const bodyParser = require('body-parser');
const config = require('./config');

const app = express();

// import routes
const bookRoutes = require('./routes/books');

// Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

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