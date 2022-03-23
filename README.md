# 概要

サイト内検索のサンプルです。  
Python でサイト内のリンクをすべて取得し、  
ページごとのサイト情報を json で出力します。  
JavaScript で json を取得し 検索結果を HTML 上 で生成します。

# 動作確認環境

PHP 7.4.21
Python 3.8.13

# 使い方

以下のコマンドを実行し、検索したいサイトの URL を入力します。  
サイト情報が格納された"allSiteInfos.json"が出力されます。

```zsh
# 必要なパッケージのインストール
pip install -r requirements.txt

python main.py
```

"index.html"を開くとサイト内検索ができます。
