const Movie = require('../models/movies');
const Category = require('../models/category');
const Comment = require('../models/comment');
const _underscore = require('underscore');

//后台录入页admin 
exports.new = function(req, res){
	res.render('category_admin', {
		title: 'immoc 后台分类录入页',
		category: {}
	});
};

// admin post category
exports.save = function(req, res){
	console.log('body:', req.body);
	var _category = req.body.category;

	let category = new Category(_category);
	category.save((err, movie) => {
		if(err){
			console.log(err);
		}

		res.redirect('/admin/category/list' );
	});
};

//Category list
exports.list = function(req, res){
	Category.fetch((err ,categories) => {
		if(err){
			console.log(err);
		}
		res.render('categorylist', {
			title: '分类列表页',
			categories: categories
		});

	});
};
