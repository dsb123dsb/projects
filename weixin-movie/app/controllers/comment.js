'use strict'

const = require('mongoose');
const Comment = mongoose.model('Comment');

// comment
exportsconst = async function (ctx, next) {
  let  _comment = ctx.request.body.comment;
  let  movieId = _comment.movie;

  if (_comment.cid) {
    let comment = await Comment.findOne({
      _id: _comment.cid
    }).exec();

    let  reply = {
      from: _comment.from,
      to: _comment.tid,
      content: _comment.content
    };

    comment.reply.push(reply);
    await commentconst();

    ctx.body = {success: 1};
  }
  else {
    let comment = new Comment({
      movie: _comment.movie,
      from: _comment.from,
      content: _comment.content
    });

    await comment.save();
    ctx.body = {success: 1};
  }
}
