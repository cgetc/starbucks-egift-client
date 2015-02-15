var config = require('./config'); // 設定を読み込む
var Starbucks = require('starbucks-egift-client').client(config); // clientを読み込む

var twitterBot = Starbucks.twitterBot({ // botのインスタンスを取得
    username: 'twitterのID',
    password: 'twitterのパスワード'
});

var setting = {
    'to': 'twitter_id',
    'message': 'Twitterのメッセージ'
}

var form =  {
    card_message: 'ギフトカードのメッセージ'
    mail_address: '決済通知用のメールアドレス',
    credit_number: 'クレジットカード番号',
    credit_month: 'クレジットカードの有効期限(月)',
    credit_year: 'クレジットカードの有効期限(年)'
};
twitterBot.gift(setting, form); // 指定したユーザにStarbucks eGiftを送信