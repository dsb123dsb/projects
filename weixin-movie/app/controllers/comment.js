const Comment = require('../models/comment');
const _underscore = require('underscore');

// comment
exports.save = function(req, res){
	let _comment = req.body.comment;
	let movieId = _comment.movie;
	
	if(_comment.cid){
		Comment.findById(_comment.cid,(err,comment)=>{
			let reply = {
				from: _comment.from,
				to: _comment.tid,
				content: _comment.content
			};

			comment.reply.push(reply);
			comment.save((err, comment)=>{
				if(err){
					console.log(err);
				}

				res.redirect('/movie/' + movieId);			
			});
		});
	}
	else{
		let comment = new Comment(_comment);

		comment.save((err, newComment) => {
			if(err){
				console.log(err);
			}

			res.redirect('/movie/' + movieId);
		});		
	}

};

