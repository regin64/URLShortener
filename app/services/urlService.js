var UrlModel = require('../models/urlModel');
var redis = require('redis');
var host = process.env.REDIS_PORT_6379_TCP_ADDR || '127.0.0.1';
var port = process.env.REDIS_PORT_6379_TCP_PORT || '6379';

var redisClient = redis.createClient(port, host);

var encode = [];

var genCharArray = function (charA, charZ) {
    var arr = [];
    var i = charA.charCodeAt(0);
    var j = charZ.charCodeAt(0);

    for ( ; i <= j; i++ ) {
        arr.push(String.fromCharCode(i));
    }
    return arr;
}

encode = encode.concat(genCharArray('a', 'z'));
encode = encode.concat(genCharArray('A', 'Z'));
encode = encode.concat(genCharArray('0', '9'));

var getShortUrl = function (longUrl, callback) {
    if ( longUrl.indexOf('http') === -1 ) {   // if 'http' does not exist in longUrl
        longUrl = "http://" + longUrl;
    }

    redisClient.get(longUrl, function (err, shortUrl) {
        if (shortUrl) {
            console.log("successful");
            callback({
                longUrl: longUrl,
                shortUrl: shortUrl
            });
        } else {
            UrlModel.findOne({ longUrl: longUrl }, function (err, url) {    // 'url' here is an JS object in urlModel
                // error needs to be taken care later
                // i.e. { if (err) return handleError(err); }
                if (url) {
                    callback(url);
                } else {
                    generateShortUrl(function (shortUrl) {
                        var url = new UrlModel({ shortUrl: shortUrl, longUrl: longUrl});
                        url.save();
                        redisClient.set(shortUrl, longUrl);
                        redisClient.set(longUrl, shortUrl);
                        callback(url);
                    });
                }
            });
        }
    });
};

var generateShortUrl = function (callback) {
    UrlModel.find({}, function (err, urls) {
        callback(convertTo62(urls.length));
    });
};

var convertTo62 = function (num) {
    var result = '';
    do {
        result += encode[ num % 62];
        num = Math.floor( num / 62 );
    } while (num);
    return result;
}

var getLongUrl = function (shortUrl, callback) {
    redisClient.get(shortUrl, function (err, longUrl) {
        if (longUrl) {
            console.log("successful");
            callback({
                longUrl: longUrl,
                shortUrl: shortUrl
            });
        } else {
            UrlModel.findOne({ shortUrl: shortUrl }, function (err, url) {
                callback(url);
            });
        }
    });
};

module.exports = {
    getShortUrl: getShortUrl,
    getLongUrl: getLongUrl
};