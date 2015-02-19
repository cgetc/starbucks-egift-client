var server=require('node-http-server');
var assert = require("assert");
var port = 8080;
var config = {
    site_url: 'http://localhost:' + port + '/mail/',
    capability: 'chrome'
};

server.deploy({
        port: port,
        root: './test/mock/'
    }
);

var Starbucks = require('starbucks-egift-client').client(config); // npmの読み込む

describe('create_giftcard', function () {
    it('success', function (done) {
        this.timeout(60000);
        var form = {
            card_message: 'test',
            mail_address: 'test@test.com',
            credit_number: '123456781234',
            credit_month: '01',
            credit_year: '20'
        };
        Starbucks.create_giftcard(form, function (url) {
            assert.equal(url, 'http://gift.starbucks.co.jp/c/thisisdummy');
            done();
        });
    });
});