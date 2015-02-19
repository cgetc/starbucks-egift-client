# Starbucks eGift Client

## 概要

[Starbucks eGift](https://gift.starbucks.co.jp/card/)を送付するnpmです。

## インストール

以下のコマンドでインストールできます。

```
npm install starbucks-egift-client
```

* 動作には別途Seleniumが必要です。
* Selenium-RCでの動作も確認できています。

## 作成サンプルコード

```
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
```

## TwitterBotのサンプルコード

```tiwtter_sample.js
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
```

## 設定ファイル

```config.js
module.exports = {
    site_url: 'https://gift.starbucks.co.jp/card/',
    remote_url: 'Selenium-RCを使用する場合はホストを指定(任意）',
    capability: 'chromeもしくはfirefoxを指定'
};
```

## 注意事項
※ twitterのID/Passwordやクレジットカードの番号等は平文で保持していますので、取り扱いに注意してください。

※ クレジットカードは漏洩や使いすぎのリスクを考慮し、プリペイド式のものの利用をお勧めします。

※ 現在は以下の機能のみ実装されています。
* ギフトカードを作成し、そのURLを取得するプログラム
* Twitterのフォロワーに送付するbotプログラム