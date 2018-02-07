'use strict'

const Movie = require('../api/movie');

// index page
exports.index = async function(ctx, next){

  let categories = yield Movie.findAll();

  await ctx.render('pages/index', {
    title: '微信电影课程首页-[zyh]',
    categories: categories
  });
};

// search page
exports.search = async function(ctx, next){
  let catId = ctx.query.cat;
  let q = ctx.query.q
  let page = parseInt(ctx.query.p, 10) || 0;
  let count = 2;
  let index = page * count;

  if (catId) {
    let categories = await Movie.searchByCategory(catId);
    let category = categories[0] || {};
    let movies = category.movies || [];
    let results = movies.slice(index, index + count);

    await ctx.render('pages/results', {
      title: 'imooc 结果列表页面',
      keyword: category.name,
      currentPage: (page + 1),
      query: 'cat=' + catId,
      totalPage: Math.ceil(movies.length / count),
      movies: results
    });
  }
  else {
    let movies = yield Movie.searchByName(q);
    let results = movies.slice(index, index + count);

    await ctx.render('pages/results', {
      title: 'imooc 结果列表页面',
      keyword: q,
      currentPage: (page + 1),
      query: 'q=' + q,
      totalPage: Math.ceil(movies.length / count),
      movies: results
    });
  }
};
