const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {type:String, required: true},
    date: Date,
    author: String,
    content: String,
    comments: Array
});

const Post = mongoose.model('post', postSchema);

module.exports = Post;
