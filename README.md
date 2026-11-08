# うずら BOT v2.1.44.10934

VALLADは[新しいカラーミーショップ](https://test.valladstudio.com/)のトップと商品一覧で「うずら BOT · VALLAD」を開き、商品ID・商品URL・型番、または正式な商品名を指定します。サイズ・数量・発売日時（日本時間）を入れて開始し、このタブを開いたままにします。初期時刻は20:00（日本時間）です。発売時刻から最大2分間、応答後0.3秒間隔で確認し、一致した在庫があれば商品詳細を開いて指定数量をカートに入れます。商品名は新着一覧に表示された全商品を確認し、色名の「×」と「X」などの表記差を吸収します。型番は新着一覧の先頭12商品を確認します。VALLADパネル内の「実行ログ（日本時間）」で、直近の検索結果・停止理由を確認できます。サイズ展開がない商品はサイズ欄を空欄にします。「うずら BOT · VALLAD」内の「お届け先設定」に保存すると、カートの氏名・住所・連絡先の空欄に自動入力します。カード欄はSafariの自動入力を利用し、注文確定はショップ画面で行います。

STÜSSY JapanのトップページとNEW ARRIVALSでは、新作一覧だけを監視します。既存商品をテストするときは、商品詳細ページから開始すると開いている商品を直接確認できます。アクセサリーなどのカテゴリを開いて開始すると、そのカテゴリの商品を検索します。STÜSSYの実行ログには配布版の番号と検索先を表示します。

- iPhone。SafariのUserscriptsで [iPhone版](uzura-mellojoy-shop.user.js) を使います。導入済みの場合は、Userscriptsの「Updates」から「Check Updates」を実行してください。
- Android。FirefoxのTampermonkeyで [メロジョイ版](uzura-android-mellojoy.user.js) と [ショップ版](uzura-android-shops.user.js) を別々に登録します。VALLADはショップ版に入っています。

[対応店舗一覧](SUPPORTED_STORES.md)

公開ファイルでは、スクリプト管理アプリに保存済みのDiscord通知先を使います。

実際のカート投入、決済、スマートフォン実機での動作は未検証です。

ソースはSYNOVAJOY 2.1.44.10908とSYNOVA Shop BOT 1.9.8がベースです。
https://gist.github.com/thanhhoai98/24a357db5cc813a3b357edca4a7e1344
