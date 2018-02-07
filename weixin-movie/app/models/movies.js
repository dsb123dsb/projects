const mongoose = require('mongoose');
const MovieSchema = require('../schemas/movies');
const Movie = mongoose.model('Movie', MovieSchema);

module.exports=Movie;