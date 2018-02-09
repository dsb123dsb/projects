'use strict'

const mongoose = require('mongoose');
const Movie = mongoose.model('Movie');
const Category = mongoose.model('Category');
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
let _ = require('lodash');

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

exports.searchById = async (id) => await Movie
  .findOne({_id: id})
  .exec();

const updateMovies = async movie => {
  let options = {
    url: 'https://api.douban.com/v2/movie/subject/' + movie.doubanId,
    json: true
  };

  let response = await request(options);

  let data = JSON.parse(response.body);

  _.extend(movie, {
    country: data.countries[0],
    language: data.language,
    summary: data.summary
  });

  console.log(data);

  let genres = movie.genres;

  if (genres && genres.length > 0) {
    let cateArray =genres.map(genre => {
		return ((async () => {
	        let cat = await Category.findOne({name: genre}).exec();

	        if (cat) {
	          cat.movies.push(movie._id);
	          await cat.save();
	        }
	        else {
	          cat = new Category({
	            name: genre,
	            movies: [movie._id]
	          });

	          cat = await cat.save();
	          movie.category = cat._id;
	          await movie.save();
	        }
    	})());
    });
    for(let promise of cateArray){
    	await promise;
    }
  }else {
    movie.save();
  }
};
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

  if (subjects.length > 0) {
  	 // 多个异步并发,, 真你尼玛烦
    let moviePromises =  subjects.map( item => {
    	return (async ()=>{
	        let movie = await Movie.findOne({doubanId: item.id});// 查询是否存储过

	        if (movie) {
	          movies.push(movie);
	        }
	        else {
	          let directors = item.directors || [];
	          let director = directors[0] || {};

	          movie = new Movie({
	            director: director.name || '',
	            title: item.title,
	            doubanId: item.id,
	            poster: item.images.large,
	            year: item.year,
	            genres: item.genres || []
	          });

	          movie = await movie.save();
	          movies.push(movie);
	        };
    	})();
    });
    for(let promise of moviePromises){
    	await promise;
    }
    // 首次批量爬取时没有电影简介，需要再次分别在subject下爬取每一部电影，进行异步
    movies.forEach(movie => {
      updateMovies(movie);
  	});
 	return movies
  }
}
