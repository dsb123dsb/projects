'use strict'

const mongoose = require('mongoose');
const Movie = mongoose.model('Movie');
const Category = mongoose.model('Category');
const Comment = mongoose.model('Comment');
const _ = require('lodash');
const path = require('path');

// detail page
exports.detail =async function (ctx, next) {
  let id = ctx.params.id

  await Movie.update({_id: id}, {$inc: {pv: 1}}).exec();

  let movie = await Movie.findOne({_id: id}).exec();
  let comments = await Comment
    .find({movie: id})
    .populate('from', 'name')
    .populate('reply.from reply.to', 'name')
    .exec();

  await ctx.render('pages/detail', {
    title: 'imooc 详情页',
    movie: movie,
    comments: comments
  });
}

// admin new page
exports.new =async function (ctx, next) {
  let categories = await Category.find({}).exec();

  await ctx.render('pages/admin', {
    title: 'imooc 后台录入页',
    categories: categories,
    movie: {}
  });
}

// admin update page
exports.update =async function (ctx, next) {
  let id = ctx.params.id

  if (id) {
    let movie = await Movie.findOne({_id: id}).exec();
    let categories = await Category.find({}).exec();

    await ctx.render('pages/admin', {
      title: 'imooc 后台更新页',
      movie: movie,
      categories: categories
    });
  }
}

const util = require('../../libs/util');

// admin poster
exports.savePoster =async function (ctx, next) {
  let posterData = ctx.request.body.files.uploadPoster;
  let filePath = posterData.path;
  let name = posterData.name;

  if (name) {
    let data = await util.readFileAsync(filePath);
    let timestamp = Date.now();
    let type = posterData.type.split('/')[1];
    let poster = timestamp + '.' + type;
    let newPath = path.join(__dirname, '../../', '/public/upload/' + poster);

    await util.writeFileAsync(newPath, data);

    ctx.poster = poster;
  }

  await next();
}

// admin post movie
exports.save =async function (ctx, next) {
  let movieObj = ctx.request.body.fields || {};
  let _movie;

  if (ctx.poster) {
    movieObj.poster = ctx.poster;
  }

  if (movieObj._id) {
    let movie = await Movie.findOne({_id: movieObj._id}).exec();

    _movie = _.extend(movie, movieObj);
    await _movie.save();

    ctx.redirect('/movie/' + movie._id);
  }
  else {
    _movie = new Movie(movieObj);

    let categoryId = movieObj.category;
    let categoryName = movieObj.categoryName;

    await _movie.save();

    if (categoryId) {
      let category = await Category.findOne({_id: categoryId}).exec();

      category.movies.push(movie._id);
      await category.save();

      ctx.redirect('/movie/' + movie._id);
    }
    else if (categoryName) {
      let category = new Category({
        name: categoryName,
        movies: [movie._id]
      })

      await category.save();
      movie.category = category._id;
      await movie.save();

      ctx.redirect('/movie/' + movie._id);
    }
  }
}

// list page
exports.list =async function (ctx, next) {
  let movies = await Movie.find({})
    .populate('category', 'name')
    .exec();

  await ctx.render('pages/list', {
    title: 'imooc 列表页',
    movies: movies
  })
}

// list page
exports.del =async function (ctx, next) {
  let id = ctx.query.id;

  if (id) {
    try {
      await Movie.remove({_id: id}).exec();

      ctx.body = {success: 1};
    }
    catch(err) {
      ctx.body = {success: 0};
    }
  }
}
