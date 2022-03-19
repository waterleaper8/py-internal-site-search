import time
import re
import requests
from bs4 import BeautifulSoup
from tqdm import tqdm
from urllib.parse import urlparse

inputURL = input("サイトのURLを入力してください: ")
# https://www.python.ambitious-engineer.com/archives/35
# URLをパースする
parsed_url = urlparse(inputURL)
# URLスキーマ
print(parsed_url.scheme) # http
# ネットワーク上の位置(≒ドメイン)を取得する
print(parsed_url.netloc) # www.python.ambitious-engineer.com
# 階層パス
# print(parsed_url.path) # /archives/
# クエリ要素
# print(parsed_url.query) # s=hoge&x=0&y=0
# フォーマットする
rootURL = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_url)[:-1]
print(rootURL) # http://www.python.ambitious-engineer.com/

def getPathlist(rootURL):
    #GETリクエストを送信
    reqs = requests.get(rootURL)
    #URLをテキスト化し、解析を行う。その後BeautifulSoupオブジェクトを作る
    soup = BeautifulSoup(reqs.content, 'html.parser')
    #空のurlsのリストを用意
    urls = []
    #全てのaタグをループ処理し、hrefで指定されたURLを出力する
    for link in soup.find_all('a'):
        url = link.get('href')
        if url==None:
            continue
        if url not in urls and rootURL in url:
            print(url)
            urls.append(url)
        elif url not in urls and re.match(r'\/(?!/)', url):
            _url = rootURL+url
            print(_url)
            urls.append(_url)
        else:
            continue
    return urls

def getAllInfo(pathlist):
    allSiteInfos = {
        "data":[]
    }
    for path in tqdm(pathlist):
        res = requests.get(path)

        soup = BeautifulSoup(res.content, "html.parser")

        soup

        try:
            title = soup.select("title")[0].text
        except IndexError:
            title = "タイトルなし"

        try:
            captionText = soup.select("meta[name='description']")[0]["content"]
        except IndexError:
            captionText = "説明はありません"

        try:
            captionImage = soup.select('meta[property="og:image"]')[0]["content"]
        except IndexError:
            captionImage = ""

        _dict = {
            "title": title,
            "url": path,
            "captionText": captionText,
            "captionImage": captionImage
        }
        allSiteInfos["data"].append(_dict)
        time.sleep(0.3)

    return allSiteInfos

pathlist = getPathlist(rootURL)
allSiteInfos = getAllInfo(pathlist)

import json
with open('allSiteInfos.json', 'w') as f:
    json.dump(allSiteInfos, f, indent=4, ensure_ascii=False)
