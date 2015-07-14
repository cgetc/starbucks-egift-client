var Screenshot = require('./utils/Screenshot');
var webdriver = require('selenium-webdriver'),
    By = webdriver.By;

module.exports = {
    client: function (config, site_url) {
        if (!site_url) {
            site_url = 'https://gift.starbucks.co.jp/card/';
        }
        var builder = new webdriver.Builder();
        if (config.selenium) {
            if (config.capability) {
        		builder = builder.forBrowser(config.selenium.capability);
            }
            if (config.selenium.remote_url) {
                builder = builder.usingServer(config.selenium.remote_url);
            }
        }
        return {
            create_giftcard: function (card_message, success, failure) {
                var driver;
                var screenshot;
                var retry = 2;

                start();

                function start() {
	                  try {
		                    driver = builder.build();
                            if (config.log_dir) {
                                screenshot = new Screenshot(driver, config.log_dir);
                            }
		                    driver.get(site_url).
		                        then(select_mail, handle_error).
		                        then(send_cart, handle_error).
		                        then(complete, handle_error);
	                  } catch (e) {
		                    quit();
		                    if (--retry) {
			                      setTimeout(start, 1000);
		                    } else if (failure) {
		                      	failure.call(this, e);
		                    }
	                  }
                }

                function quit() {
                    driver.quit();
                }

                function select_mail() {
                    driver.findElement(By.name('cart_form[message]')).sendKeys(card_message);
                    driver.findElement(By.xpath('//*[@data-provider="mail"]')).click();
                    return driver.findElement(By.id('new_cart_form')).submit();
                }

                function send_cart () {
                    driver.findElement(By.name('cart_form[email]')).sendKeys(config.payment.mail_address);
                    driver.findElement(By.name('cart_form[email_confirmation]')).sendKeys(config.payment.mail_address);
                    driver.findElement(By.name('cart_form[card_num]')).sendKeys(config.payment.credit_number);
                    driver.findElement(By.xpath('//select[@name="cart_form[card_expired_month]"]')).click();
                    driver.findElement(By.xpath('//select[@name="cart_form[card_expired_month]"]/option[@value="' + config.payment.credit_month + '"]')).click();
                    driver.findElement(By.xpath('//select[@name="cart_form[card_expired_year]"]')).click();
                    driver.findElement(By.xpath('//select[@name="cart_form[card_expired_year]"]/option[@value="' + config.payment.credit_year + '"]')).click();
                    return driver.findElement(By.id('new_cart_form')).submit();
                }

                function complete () {
                    driver.wait(function () {
                        return driver.findElement(By.xpath('//*[@id="gift_url"]/a/input')).getAttribute('value');
                    }, 15000).
                        then(function (url) {
                            quit();
                            success.call(this, url.trim());
                        }, handle_error);
                }

                function handle_error (e) {
                    if (screenshot) {
                        screenshot.take('error.' + new Date().getTime() + '.png').
                            then(quit, function (err) {
                                console.log(err);
                                quit();
                            });
                    } else {
                        quit();
                    }
                    if (failure) {
                        failure.call(this, e);
                    }
                }
            },
            twitterBot: function (twitter) {
                return {
                    gift: function (setting, card_message) {
                        var driver;
                        var screenshot;
                        var retry = 2;

                        start();

                        function start() {
	                          try {
		                            driver = builder.build();
                                    if (config.log_dir) {
                                        screenshot = new Screenshot(driver, config.log_dir);
                                    }
		                            driver.get(site_url).
		                                then(select_twitter, handle_error).
		                                then(send_cart, handle_error).
		                                then(complete);
	                          } catch (e) {
		                            quit();
		                            if (--retry) {
		                                setTimeout(start, 1000);
		                            }
	                          }
                        }

                        function quit() {
                            driver.quit();
                        }

                        var defer = webdriver.promise.defer();
                        function select_twitter() {
                            setTimeout(function () {
                                try {
                                    driver.findElement(By.xpath('//*[@data-provider="twitter"]')).click().
                                        then(function () {
                                            driver.wait(function () {
                                                return driver.findElement(By.id('by_twitter')).isDisplayed();
                                            }, 10000).
                                                then(function () {
                                                    driver.findElements(By.xpath('//*[@id="authorize"]//a[@class="twitter"]')).then(function (btn) {
                                                        if (btn.length) {
                                                            btn[0].click().
                                                                then(connect_twitter, handle_error).
                                                                then(select_twitter, handle_error);
                                                        } else {
                                                            driver.findElements(By.xpath('//*[contains(@class,"filter_target")]/figure/figcaption[text()="'+ setting.to + '"]')).
                                                                then(function (target) {
                                                                    if (target.length) {
                                                                        driver.findElement(By.name('cart_form[message]')).sendKeys(card_message);
                                                                        target[0].click();
                                                                        driver.findElement(By.id('new_cart_form')).submit().
                                                                            then(function () {
                                                                                return defer.fulfill();
                                                                            });
                                                                    } else {
                                                                        console.log('no twitter_screen_name:[' + setting.to + ']');
                                                                        driver.quit();
                                                                    }
                                                                }, handle_error);
                                                        }
                                                    });
                                                });
                                        }, handle_error);
                                } catch (e) {
                                    handle_error(e);
                                }
                            }, 5000);
                            return defer.promise;
                        }

                        function connect_twitter () {
                            driver.findElement(By.name('session[username_or_email]')).sendKeys(twitter.username);
                            driver.findElement(By.name('session[password]')).sendKeys(twitter.password);
                            return driver.findElement(By.id('oauth_form')).submit();
                        }

                        function send_cart () {
                            driver.findElement(By.xpath('//a[@data-modal-id="modify_direct_message"]')).click();
                            return driver.wait(function () {
                                return driver.findElement(By.name('cart_form[splash]')).isDisplayed();
                            }, 10000)
                                .then(function () {
                                   var splash = driver.findElement(By.name('cart_form[splash]'));
                                   splash.clear();
                                   splash.sendKeys(setting.message);
                                   return driver.findElement(By.xpath('//*[@class="modal_content"]//a[contains(@class,"submit")]')).click();
                                }, handle_error)
                                .then(function () {
                                    driver.findElement(By.name('cart_form[email]')).sendKeys(config.payment.mail_address);
                                    driver.findElement(By.name('cart_form[email_confirmation]')).sendKeys(config.payment.mail_address);
                                    driver.findElement(By.name('cart_form[card_num]')).sendKeys(config.payment.credit_number);
                                    driver.findElement(By.xpath('//select[@name="cart_form[card_expired_month]"]/option[@value="' + config.payment.credit_month + '"]')).click();
                                    driver.findElement(By.xpath('//select[@name="cart_form[card_expired_year]"]/option[@value="' + config.payment.credit_year + '"]')).click();
                                    return driver.findElement(By.id('new_cart_form')).submit();
                                }, handle_error);
                        }

                        function complete () {
                            setTimeout(quit, 30000);
                        }

                        function handle_error (e) {
	                        console.log(e);
                            if (screenshot) {
                                screenshot.take('error.' + new Date().getTime() + '.png').
                                    then(quit, function (err) {
                                        console.log(err);
                                        quit();
                                    });
                            } else {
                                quit();
                            }
                        }
                    }
                };
            }
        }
    }
};
