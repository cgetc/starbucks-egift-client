var url = require('url');
var connect = require('connect');
var serveStatic = require('serve-static');
var assert = require("assert");
var port = 8080;
var hostname = process.env.SELENIUM_REMOTE_URL? url.parse(process.env.SELENIUM_REMOTE_URL).hostname : 'localhost';
var mock_url = 'http://' + hostname + ':' + port + '/mail/';
var app = connect();

app.use(serveStatic(__dirname + '/mock', {'index': ['index.html', 'index.htm']}));
app.listen(port);

var Starbucks = require('starbucks-egift-client').client({
    payment: {
        mail_address: 'test@test.com',
        credit_number: '123456781234',
        credit_month: '01',
        credit_year: '20'
    }
}, mock_url); // npmの読み込む

describe('create_giftcard', function () {
    this.timeout(0);
    it('success', function (done) {
        Starbucks.create_giftcard('test', function (url) {
            assert.equal(url, 'http://gift.starbucks.co.jp/c/thisisdummy');
            done();
        }, done);
    });
});
