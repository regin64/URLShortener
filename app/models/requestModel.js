var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RequestSchema = new Schema ({
    shortUrl: String,
    platform: String,
    browser: String,
    referer: String,
    country: String,
    timestamp: Date
});

var requestModel = mongoose.model('requestModel', RequestSchema);

module.exports = requestModel;