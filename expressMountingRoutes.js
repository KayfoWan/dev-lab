const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
let app = express();
const port = 3000;

let movies = JSON.parse(fs.readFileSync('./data/movies.json'));

const logger = function (res, req, next) {
    console.log('Custom middleware called.');
}

app.use(express.json());
app.use(morgan());
app.use(logger);
app.use((req,res,next)=>{
    req.requestedAt = new Date().toISOString();
    next();
});

function getAllMovies(req, res) {
    res.status(200).json({
        status: "success",
        count: movies.length,
        requestedAt: req.requestedAt,
        data: {
            movies: movies
        }
    });
}

function createMovie(req, res) {
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
}

function updateMovie(req, res) {
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
}

function deleteMovie(req, res) {
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
}

function getMovie(req, res) {
    console.log(req.params);
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
}

const moviesRouter = express.Router();

moviesRouter.route('/')
    .get(getAllMovies)
    .post(createMovie);

moviesRouter.route('/:id')
    .get(getMovie)
    .patch(updateMovie)
    .delete(deleteMovie);

app.use('/api/v1/movies', moviesRouter)

app.listen(port, ()=>{
    console.log('server is singing...');
});