const express = require('express');
const fs = require('fs');
let app = express();
const port = 3000;

let movies = JSON.parse(fs.readFileSync('./data/movies.json'));
app.use(express.json());
//GET api/v1/movies
app.get('./api/v1/movies', (req, res)=>{
    res.status(200).json({
        status: "success",
        count: movies.length,
        data: {
            movies: movies
        }
    })
});

//POST api/v1/movies
app.post('./api/v1/movies', (req, res)=>{
    //console.log(req.body); //Needs app.use(express.json()) middleware to be able to recieve the body on req. from my understanding.
    const newId = movies[movies.length - 1].id + 1;

    const newMovie = Object.assign({id: newId}, req.body);

    movies.push(newMovie);

    fs.writeFile('./data/movies.json', JSON.stringify(movies), (err)=>{
        console.error(err);
        res.status(201).json({
            status: "success",
            data: {
                movie: newMovie
            }
        });
    });
    //res.send('Created');
});

//GET Route Parameters api/v1/movies/:id
app.get('/api/v1/movies/:id', (res,req)=>{
    console.log(req.params);
    //const id = +req.params.id; // + converts string to numeric type. This is another way to do it.
    const id = req.params.id * 1;

    let movie = movies.find((el)=>el.id === id);

    if (!movie) {
        return res.status(404).json({
            status: "fail",
            message: "Movie with ID " + id + " is not found",
        });
    };

    res.status(200).json({
        status: "success",
        data: {
            movie: movie,
        }
    });
});
app.get('/api/v1/movies/:id/:name?/:x?', (res,req)=>{
    console.log(req.params);
    res.send('Test movie');
});

//PUT /api/v1/movie/:id //updates whole object.
//PATCH /api/v1/movies/:id //updates single value of an object.
app.patch('/api/v1/movies/:id', (req,res)=>{
    let id = req.params.id * 1;
    let movieToUpdate = movies.find(el=>el.id===id);
    if (!movieToUpdate) {
        return res.status(404).json({
            status: 'fail',
            message: 'No movie object with ID ' +id+ ' is found.',
        });
    }
    let index = movies.indexOf(movieToUpdate);
    Object.assign(movieToUpdate, req.body);
    movies[index] = movieToUpdate;

    fs.writeFile('./data/movies.json', JSON.stringify(movies), (err)=>res.status(200).json({
        status: 'success',
        data: {
            movie: movieToUpdate,
        }
    }));
});

//DELETE api/v1/movies/:id
app.delete('api/v1/movies/:id', (req,res)=>{
    const id = req.params.id * 1;
    const movieToDelete = movies.find(el=>el.id===id);
    if(!movieToDelete) {
        return res.status(404).json({
            status: "fail",
            message: "No movie object with ID " +id+ " is found to delete.",
        });
    };
    const index = movies.indexOf(movieToDelete);
    movies.splice(index, 1);

    fs.writeFile('./data/movies.json', JSON.stringify(movies), (err)=>{
        res.status(204).json({
            status: "success",
            data: {
                movie: null,
            }
        });
    });
});

//app.route('/api/v1/movies').get(getAllMoviesFunction).post(getAllMoviesFunction);
//app.route('/api/v1/movies/:id').get(getAllFunct).patch(getAllFunct).delete(getAllFunct);

app.listen(port, ()=>{
    console.log('server is singing...');
});