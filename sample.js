var Starbucks = require('starbucks-egift-client').client({
  log_dir: '/var/tmp/starbucks-egift',
  payment: {
    mail_address: '決済通知用のメールアドレス',
    credit_number: 'クレジットカード番号',
    credit_month: 'クレジットカードの有効期限(月)',
    credit_year: 'クレジットカードの有効期限(年)'
  }
}); // npmの読み込む

// 指定したメッセージのStarbucks eGiftを作成する
Starbucks.create_giftcard('ギフトカードのメッセージ', function (url) {
    // Starbucks eGiftのURL
    console.log(url);
}, function (err) {
    console.log(err);
});
