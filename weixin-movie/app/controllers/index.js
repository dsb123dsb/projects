const Movie = require('../models/movies');
const Category = require('../models/category');

// index page
exports.index = function(req, res){
	// console.log('user in session');
	// console.log(req.session.user);

	Movie.fetch((err, movies) => {
		Category
			.find({})
			.populate({path: 'movies', options: {limit: 5}})
			.exec((err, categories)=>{
				if(err){
					console.log(err);
				}
				res.render('index', { // 返回首页
					title: 'immoc 首页' ,// 传递参数，替代占位符
					categories: categories
					/*movies: [
					{
						title: '机械战警',
						_id: 7,
						poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
					}
					]*/
				});		
			});
	});
};

// search page
exports.search = function(req, res){
	let catId = req.query.cat;
	let q = req.query.q;
	let page = parseInt(req.query.p, 10) || 0; // 没传默认0
	let index = page*2;

	if(catId){
		Category
			.find({_id: catId})
			.populate({
				path: 'movies',
				select: 'title poster'
				// options: {limit: 2, skip: index}
			})
			.exec((err, categories)=>{
				if(err){
					console.log(err);
				}
				let category = categories[0] || {};
				let movies =category.movies || [];
				let results = movies.slice(index, index + 2)
				// console.log(movies)
				res.render('results', { // 返回首页
					title: '结果列表页面',// 传递参数，替代占位符
					keyword: category.name,
					movies: results,
					currentPage: (page + 1),
					totalPage: Math.ceil(movies.length/2),
					query: 'cat='+catId
				});
			});
	}else{
		Movie
			.find({title: new RegExp((q+'.*'),'i')})
			.exec((err, movies)=>{
				if(err){
					console.log(err);
				}

				let results = movies.slice(index, index + 2);

				// console.log(movies)
				res.render('results', { // 返回首页
					title: '结果列表页面',// 传递参数，替代占位符
					keyword: q,
					movies: results,
					currentPage: (page + 1),
					totalPage: Math.ceil(movies.length/2),
					query: 'q='+q
				});
			});
	}
};

// app.get('/', (req, res) => {

// });