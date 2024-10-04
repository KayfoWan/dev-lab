// USES ROUTES/MOVIEROUTE.JS
const express = require('express');
const morgan = require('morgan');

const moviesRouter = require('./routes/movieRoutes.js');

let app = express();
const port = 3000;

const logger = function (res, req, next) {
    console.log('Custom middleware called.');
}

app.use(express.json());
app.use(morgan('dev'));
app.use(express.static('./public'));
app.use(logger);
app.use((req,res,next)=>{
    req.requestedAt = new Date().toISOString();
    next();
});

app.use('/api/v1/movies', moviesRouter);

app.listen(port, ()=>{
    console.log('server is singing...');
});