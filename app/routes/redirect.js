var express = require('express');
var router = express.Router();
var urlService = require('../services/urlService');
var statsService = require('../services/statsService');

router.get('*', function (req, res) {
    var shortUrl = req.originalUrl.slice(1);
    var longUrl = urlService.getLongUrl(shortUrl, function (url) {
        if (url) {
            res.redirect(url.longUrl);
            statsService.logRequest(shortUrl, req);
        } else {      // 當傳進去HashMap的shortUrl找不到時, longUrl會變成undefined, 這裡解決這個問題 (too many requests problem)
            res.sendfile('./public/views/404.html');
        }
    });
});

module.exports = router;