var config = require('./config'); // 設定を読み込む
var Starbucks = require('starbucks-egift-client').client(config); // npmの読み込む

var form = {
    card_message: 'ギフトカードのメッセージ'
    mail_address: '決済通知用のメールアドレス',
    credit_number: 'クレジットカード番号',
    credit_month: 'クレジットカードの有効期限(月)',
    credit_year: 'クレジットカードの有効期限(年)'
};
// 指定したメッセージのStarbucks eGiftを作成する
Starbucks.create_giftcard(form, function (url) {
    // Starbucks eGiftのURL
    console.log(url);
});