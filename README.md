# Starbucks eGift Client

## 概要

[Starbucks eGift](https://gift.starbucks.co.jp/card/)を送付するnpmです。

## インストール

以下のコマンドでインストールできます。

```
npm install starbucks-egift-client
```

※ 動作には別途Seleniumが必要です。
※ Selenium-RCでの動作も確認できています。

## サンプルコード

```sample.js
var Starbucks = require('starbucks-egift-twitterbot'); // npmの読み込む
var config = require('./config'); // 設定を読み込む

config.starbucks.credit.numbers = ''; //誤って購入しないように。実運用では不要。

var twitterBot = Starbucks.twitterBot(config); // botのインスタンスを取得

twitterBot.gift('cgetc', 'サンクス', 'スタバのチケットあげる♥'); // 指定したユーザにStarbucks eGiftを送信
```

## 設定ファイル

```config.js
module.exports = {
    webdriver: {
        remote_url: 'Selenium-RCを使用する場合はホストを指定(任意）',
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
```

## 注意事項
* twitterのID/Passwordやクレジットカードの番号等は平文で保持していますので、取り扱いに注意してください。
* クレジットカードは漏洩や使いすぎのリスクを考慮し、プリペイド式のものの利用をお勧めします。
* 現在はTwitterのフォロワーに送付するbotプログラムのみ実装されています。
* e-mailやFacebook,LINEでの送付には現在対応していません。