var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// To define our own schema, which contains two stuff: 1. a longUrl which is a string and 2. a shortUrl which is
// also a string.

var UrlSchema = new Schema ({
    longUrl: String,
    shortUrl: String
});

// Define a model to help us use mongoose connect with mongoDB
var urlModel = mongoose.model('urlModel', UrlSchema); // means we use UrlSchema we created earlier to create urlModel

module.exports = urlModel;