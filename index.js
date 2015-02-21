var webdriver = require('selenium-webdriver'),
    By = webdriver.By;

module.exports = {
    client: function (config) {
        var builder = new webdriver.Builder();
        if (config.remote_url) {
            builder = builder.usingServer(config.remote_url);
        }
        var capability = config.capability.match(/firefox/i)? webdriver.Capabilities.firefox() : webdriver.Capabilities.chrome();
        var driver = builder.withCapabilities(capability).build();
        return {
            create_giftcard: function (form, success, failure) {

                function select_mail() {
                    driver.findElement(By.name('cart_form[message]')).sendKeys(form.card_message);
                    driver.findElement(By.xpath('//*[@data-provider="mail"]')).click();
                    return driver.findElement(By.id('new_cart_form')).submit();
                }

                function send_cart () {
                    driver.findElement(By.name('cart_form[email]')).sendKeys(form.mail_address);
                    driver.findElement(By.name('cart_form[email_confirmation]')).sendKeys(form.mail_address);
                    driver.findElement(By.name('cart_form[card_num]')).sendKeys(form.credit_number);
                    driver.findElement(By.xpath('//select[@name="cart_form[card_expired_month]"]/option[@value="' + form.credit_month + '"]')).click();
                    driver.findElement(By.xpath('//select[@name="cart_form[card_expired_year]"]/option[@value="' + form.credit_year + '"]')).click();
                    return driver.findElement(By.id('new_cart_form')).submit();
                }

                function complete () {
                    driver.wait(function () {
                        return driver.findElement(By.xpath('//*[@id="gift_url"]/a/input')).getAttribute('value');
                    }, 15000).
                        then(function (url) {
                            driver.quit();
                            success.call(this, url.trim());
                        }, handle_error);
                }

                function handle_error (e) {
                    driver.quit();
                    if (failure) {
                        failure.call(this, e);
                    }
                }

                try {
                    driver.get(config.site_url).
                        then(select_mail, handle_error).
                        then(send_cart, handle_error).
                        then(complete, handle_error);
                } catch (e) {
                    handle_error(e);
                }
            },
            twitterBot: function (twitter) {
                return {
                    gift: function (setting, form) {

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
                                                    driver.findElement(By.name('cart_form[message]')).sendKeys(form.card_message);
                                                    btn[0].click().
                                                        then(connect_twitter).
                                                        then(select_twitter);
                                                } else {
                                                    driver.findElements(By.xpath('//*[contains(@class,"filter_target")]/figure/figcaption[text()="'+ setting.to + '"]')).
                                                        then(function (target) {
                                                            if (target.length) {
                                                                target[0].click();
                                                                driver.findElement(By.id('new_cart_form')).submit().
                                                                    then(function () {
                                                                        return defer.fulfill();
                                                                    });
                                                            } else {
                                                                console.log('no twitter_screen_name:[' + setting.to + ']');
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
                            driver.findElement(By.name('session[username_or_email]')).sendKeys(twitter.username);
                            driver.findElement(By.name('session[password]')).sendKeys(twitter.password);
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
                                   splash.sendKeys(setting.message);
                                   return driver.findElement(By.xpath('//*[@class="modal_content"]//a[contains(@class,"submit")]')).click();
                                })
                                .then(function () {
                                    driver.findElement(By.name('cart_form[email]')).sendKeys(form.mail_address);
                                    driver.findElement(By.name('cart_form[email_confirmation]')).sendKeys(form.mail_address);
                                    driver.findElement(By.name('cart_form[card_num]')).sendKeys(form.credit_number);
                                    driver.findElement(By.xpath('//select[@name="cart_form[card_expired_month]"]/option[@value="' + form.credit_month + '"]')).click();
                                    driver.findElement(By.xpath('//select[@name="cart_form[card_expired_year]"]/option[@value="' + form.credit_year + '"]')).click();
                                    return driver.findElement(By.id('new_cart_form')).submit();
                                });
                        }

                        function complete () {
                            setTimeout(function () {
                                driver.quit();
                            }, 15000);
                        }

                        driver.get(config.site_url).
                            then(select_twitter).
                            then(send_cart).
                            then(complete);
                    }
                };
            }
        }
    }
};