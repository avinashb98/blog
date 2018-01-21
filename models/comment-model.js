const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const commentSchema = new Schema({
  posted: Date,
  author: String,
  content: String,
  post: String
});

const Comment = mongoose.model('comment', commentSchema);

module.exports = Comment;
