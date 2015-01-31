module.exports = {
    webdriver: {
        remote_url: 'Selenium-RCを使用する場合はURLを指定(任意）',
        capability: 'chromeもしくはfirefoxを指定'
    },
    twitter: {
        username: 'twitterのID',
        password: 'twitterのパスワード'
    },
    starbucks: {
	    mail_address: '決済通知用のメールアドレス',
	    credit: {
	        numbers: 'クレジットカード番号',
	        month: 'クレジットカードの有効期限(月)',
	        year: 'クレジットカードの有効期限(年)'
	    }
	}
};