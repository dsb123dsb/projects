const Movie = require('../models/movies');
const Comment = require('../models/comment');
const Category = require('../models/category');
const _underscore = require('underscore');
const fs = require('fs');
const path = require('path');

// 详情页
exports.detail = function(req, res){
	let id = req.params.id;

	Movie.update({_id: id}, {$inc: {pv:1}}, function(err){
		if(err){
			console.log(err);
		}
	});
	Movie.findById(id, (err, movie) => { // 根据Movie查评论
		Comment
			.find({movie: id})
			.populate('from', 'name') // 根据from去USer表查name
			.populate('reply.from reply.to', 'name')
			.exec((err, comments)=>{
				// console.log(comments);
				res.render('detail', {
					title: 'zhou\'site: ' + movie.title, // 'Movie ' + movie.title + ' 详情',
					movie: movie,
					comments: comments
					/*movie: {
						doctor: 'zhou',
						country: 'china',
						title: 'hehhe',
						year: 2014,
						flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
						language: 'chinese',
						summary: 'dwhduwhduwhdwd氮化物氮化物氮化物氮化物'
					}*/
				});		
		});

	});
};
//后台录入页admin 
exports.new = function(req, res){
	Category.find({}, (err, categories)=>{
		// console.log(categories);
		res.render('admin', {
			title: 'immoc 后台录入页',
			categories: categories,
			movie: {}
		});		
	});

};

// admin update movie
exports.update = function(req, res){
	var id = req.params.id;

	if(id){
		Category.find({}, (err, categories)=>{	
			Movie.findById(id, (err, movie) => {
				res.render('admin', {
					titel: 'zhouSite 后台更新页',
					movie: movie,
					categories: categories
				});
			});
		});
	}
};

// admin poster
exports.savePoster = function(req, res, next){
	let posterData = req.files.uploadPoster;
	let filePath = posterData.path;
	let originalFilename = posterData.originalFilename;
	// console.log(req.files);中间件生成
	if(originalFilename){
		fs.readFile(filePath, (err, data)=>{
			let timestamp = Date.now();
			let type = posterData.type.split('/')[1];
			let poster = timestamp+'.'+type;
			let newPath = path.join(__dirname, '../../', '/public/upload/'+poster);
			fs.writeFile(newPath, data, function(err){
				req.poster = poster;
				next();
			});

		});
	}else{
		next();
	}
};

// admin post movie
exports.save = function(req, res){
	// console.log('body:', req.body);
	let id = req.body.movie._id;
	// console.log('id: ', id);
	let movieObj = req.body.movie;
	var _movie;

	if(req.poster){
		movieObj.poster = req.poster;
	};

	if(id) { // 根据报错排查问题'Cast to ObjectId failed for value "" at path "_id" for model "Movie"'
		Movie.findById(id, (err ,movie) => {
			if(err){
				console.log(err);
			}

			_movie = _underscore.extend(movie, movieObj);
			_movie.save((err, movie) => {
				if(err){
					console.log(err);
				}

				res.redirect('/movie/' + movie._id);
			});
		});
	}else{
		_movie = new Movie(movieObj); // 不能给有_id的对象new，会报错castId，bug
		// console.log(_movie);
		// console.log(movieObj);
		let categoryId = movieObj.category;
		let categoryName = movieObj.categoryName;

		_movie.save((err, movie) => {
			if(err){
				console.log(err);
			}

			if(categoryId){
				// 分类只能先查一个，多个不能用findById,会是数组
				Category.findById(categoryId, (err, category)=>{
					// console.log(category);
					category.movies.push(movie._id);
					category.save((err, category)=>{
						res.redirect('/movie/' + movie._id);
					});
				});	
			}else if(categoryName){
					let category = new Category({
						name: categoryName,
						movies: [movie._id]
					});

					category.save((err ,category)=>{
						movie.category = category._id;
						movie.save((err, movie)=>{
							res.redirect('/movie/' + movie._id);
						});
					});
			}
			
		});
	}
};

//moive列表页list
exports.list = function(req, res){
	Movie.fetch((err ,movies) => {
		if(err){
			console.log(err);
		}
		res.render('list', {
			title: 'zhou\'site 列表页',
			movies: movies
			/*movies: [{
				title: '机械战警',
				_id: 1,
				country: 'china',
				year: 2014,
				doctor: 'zhou'
			}]	*/	
		});

	});
};

// list delete movie
exports.del = function(req, res){
	var id = req.query.id;

	if(id){
		Movie.remove({_id: id}, (err, movie) => {
			if(err){
				console.log(err);
			}else{
				res.json({success: 1});
			}
		});
	}
};	