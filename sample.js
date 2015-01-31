var Starbucks = require('starbucks-egift-client'); // npmの読み込む
var config = require('./config'); // 設定を読み込む

config.starbucks.credit.numbers = ''; //誤って購入しないように。実運用では不要。

var twitterBot = Starbucks.twitterBot(config); // botのインスタンスを取得

twitterBot.gift('cgetc', 'サンクス', 'スタバのチケットあげる♥'); // 指定したユーザにStarbucks eGiftを送信