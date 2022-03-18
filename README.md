# 概要

サイト内検索のサンプルです。
Python でサイト内のリンクをすべて取得し、
ページごとのサイト情報を json で出力します。
JavaScript で json を取得し HTML を生成します。

# 動作環境

Python 3.8.13

# 使い方

以下のコマンドを実行し、検索したいサイトの URL を入力します。  
"allSiteInfos.json"が出力されます。

```zsh
# 必要なパッケージのインストール
pip install -r requirements.txt

python main.py
```

"index.html"を開くとサイト内検索ができます。
