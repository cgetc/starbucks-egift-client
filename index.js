var webdriver = require('selenium-webdriver'),
    By = webdriver.By;

module.exports = {
    twitterBot: function (config) {
        var builder = new webdriver.Builder();
        if (config.webdriver.remote_url) {
            builder = usingServer(config.webdriver.remote_url);
        }
        var capability = config.webdriver.capability.match(/firefox/i)? webdriver.Capabilities.firefox() : webdriver.Capabilities.chrome();
        var driver = builder.withCapabilities(capability).build();
        return {
            gift: function (twitter_id, card_message, sns_message) {

                var defer = webdriver.promise.defer();
                function select_twitter() {
                    driver.findElement(By.xpath('//*[@data-provider="twitter"]')).click().
                        then(function () {
                            driver.wait(function () {
                                return driver.findElement(By.id('by_twitter')).isDisplayed();
                            }, 10000).
                                then(function () {
                                    driver.findElements(By.xpath('//*[@id="authorize"]//a[@class="twitter"]')).then(function (btn) {
                                        if (btn.length) {
                                            driver.findElement(By.name('cart_form[message]')).sendKeys(card_message);
                                            btn[0].click().
                                                then(connect_twitter).
                                                then(select_twitter);
                                        } else {
                                            driver.findElements(By.xpath('//*[contains(@class,"filter_target")]/figure/figcaption[text()="'+ twitter_id + '"]')).
                                                then(function (target) {
                                                    if (target.length) {
                                                        target[0].click();
                                                        driver.findElement(By.id('new_cart_form')).submit().
                                                            then(function () {
                                                                return defer.fulfill();
                                                            });
                                                    } else {
                                                        console.log('no twitter_screen_name:[' + twitter_id + ']');
                                                        driver.quit();
                                                    }
                                                });
                                        }
                                    });
                                });
                        });
                    return defer.promise;
                }

                function connect_twitter () {
                    driver.findElement(By.name('session[username_or_email]')).sendKeys(config.twitter.username);
                    driver.findElement(By.name('session[password]')).sendKeys(config.twitter.password);
                    return driver.findElement(By.id('oauth_form')).submit();
                }

                function send_cart () {
                    var defer = webdriver.promise.defer();
                    driver.findElement(By.xpath('//a[@data-modal-id="modify_direct_message"]')).click();
                    return driver.wait(function () {
                        return driver.findElement(By.name('cart_form[splash]')).isDisplayed();
                    }, 10000)
                        .then(function () {
                           var splash = driver.findElement(By.name('cart_form[splash]'));
                           splash.clear();
                           splash.sendKeys(sns_message);
                           return driver.findElement(By.xpath('//*[@class="modal_content"]//a[contains(@class,"submit")]')).click()
                        })
                        .then(function () {
                            driver.findElement(By.name('cart_form[email]')).sendKeys(config.starbucks.mail_address);
                            driver.findElement(By.name('cart_form[email_confirmation]')).sendKeys(config.starbucks.mail_address);
                            driver.findElement(By.name('cart_form[card_num]')).sendKeys(config.starbucks.credit.numbers);
                            driver.findElement(By.xpath('//select[@name="cart_form[card_expired_month]"]/option[@value="' + config.starbucks.credit.month + '"]')).click();
                            driver.findElement(By.xpath('//select[@name="cart_form[card_expired_year]"]/option[@value="' + config.starbucks.credit.year + '"]')).click();
                            return driver.findElement(By.id('new_cart_form')).submit();
                        });
                }

                function complete () {
                    driver.quit();
                }

                driver.get('https://gift.starbucks.co.jp/card/').
                    then(select_twitter).
                    then(send_cart).
                    then(function () {// wait to redirect.
                        var defer = webdriver.promise.defer();
                        setTimeout(function () {
                            defer.fulfill();
                        }, 10000);
                        return defer.promise;
                    }).
                    then(complete);
            }
        };
    }
};