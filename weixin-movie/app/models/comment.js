const mongoose = require('mongoose');
const CommentSchema = require('../schemas/Comment');
const Comment = mongoose.model('Comment', CommentSchema);

module.exports=Comment;