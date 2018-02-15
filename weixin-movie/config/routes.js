'use strict'

const Index = require('../app/controllers/index');
const User = require('../app/controllers/user');
const Movie = require('../app/controllers/movie');
const Comment = require('../app/controllers/comment');
const Game = require('../app/controllers/game');
const Wechat = require('../app/controllers/wechat');
const Category = require('../app/controllers/category');
const koaBody = require('koa-body');

module.exports = function(router){

	//路由编写 .调用controller

	// index page
	router.get('/', Index.index);

	// User
	router.post('/user/signup',User.signup);
	router.post('/user/signin', User.signin);
	router.get('/signin', User.showSignin);
	router.get('/signup', User.showSignup);
	router.get('/logout',User.logout);
	router.get('/user/user/list', User.signinRequired, User.adminRequired, User.list); // 中间件概念

	// wechat
	router.get('/wechat/movie', Game.guess);
	router.get('/wechat/movie/:id', Game.find);
	router.get('/wechat/jump/:id', Game.jump);
	router.get('/wx', Wechat.hear); // 监听来自微信的请求
	router.post('/wx', Wechat.hear);

	// Movie
	router.get('/movie/:id', Movie.detail);
	router.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new);
	router.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update);
	router.post('/admin/movie', User.signinRequired, User.adminRequired, koaBody({multipart: true}), Movie.savePoster, Movie.save);
	router.get('/admin/movie/list',User.signinRequired, User.adminRequired, Movie.list);
	router.delete('/admin/movie/list',User.signinRequired, User.adminRequired, Movie.del);	
	// Comment
	router.post('/user/comment', User.signinRequired, Comment.save);

	// Category
	router.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new);
	router.post('/admin/category',User.signinRequired, User.adminRequired, Category.save);
	router.get('/admin/category/list',User.signinRequired, User.adminRequired, Category.list);	

	// Results
	router.get('/results', Index.search);	
};

