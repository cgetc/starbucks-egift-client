var fs = require('fs');
var webdriver = require('selenium-webdriver');

function Screenshot (driver, dir) {
  this.driver = driver;
  this.dir = dir;
}

Screenshot.prototype.take = function (name) {
    var defer = webdriver.promise.defer();
    var filename = this.dir + '/' + name;
    this.driver.takeScreenshot().
        then(function (data, err) {
            if (err) {
                defer.reject(err);
            } else {
                fs.writeFile(filename, data, 'base64', function (err) {
                    if (err) {
                        defer.reject(err);
                    } else {
                        defer.fulfill(data);
                    }
                });
            }
        });
    return defer.promise;
};

module.exports = Screenshot;
