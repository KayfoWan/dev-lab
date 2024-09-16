const express = require('express');
let app = express();
const port = 3000;

//GET api/movies
app.get('./api/v1/movies')

app.listen(port, ()=>{
    console.log('server is singing...');
});