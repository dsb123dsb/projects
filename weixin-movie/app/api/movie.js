'use strict'

const mongoose = require('mongoose');
const Movie = mongoose.model('Movie');
const Category = mongoose.model('Category');
const Promise = require('bluebird')
const request = Promise.promisify(require('request'))

// index page
exports.findAll = async () => await Category
  .find({})
  .populate({
    path: 'movies',
    select: 'title poster',
    options: { limit: 5 }
  })
  .exec();

// search page
exports.searchByCategory = async (catId) => await Category
  .find({_id: catId})
  .populate({
    path: 'movies',
    select: 'title poster'
  })
  .exec();

exports.searchByName = async (q) => await Movie
  .find({title: new RegExp(q + '.*', 'i')})
  .exec();

exports.searchByDouban = async (q) => {
  let options = {
    url: 'https://api.douban.com/v2/movie/search?q='
  }

  options.url += encodeURIComponent(q);

  let response = await request(options);
  let data = JSON.parse(response.body);
  let subjects = [];
  let movies = [];

  if (data && data.subjects) {
    subjects = data.subjects;
  }
  return subjects;
  console.log(subjects)
  // if (subjects.length > 0) {
  //   let queryArray = [];

  //   subjects.forEach(item => {
  //     queryArray.push(async () => {
  //       let movie = await Movie.findOne({doubanId: item.id})

  //       if (movie) {
  //         movies.push(movie);
  //       }
  //       else {
  //         let directors = item.directors || [];
  //         let director = directors[0] || {};

  //         movie = new Movie({
  //           director: director.name || '',
  //           title: item.title,
  //           doubanId: item.id,
  //           poster: item.images.large,
  //           year: item.year,
  //           genres: item.genres || []
  //         })

  //         movie = await movie.save();
  //         movies.push(movie);
  //       }
  //     });
  //   });

  //   await queryArray;

  //   movies.forEach(movie => {
  //     updateMovies(movie)
  //   })
  // }

  // return movies
}
