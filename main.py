import time
import re
import requests
from bs4 import BeautifulSoup
from tqdm import tqdm
from urllib.parse import urlparse

inputURL = input("サイトのURLを入力してください: ")
inputLevel = int(input("探索する階層数を入力してください（1 or 2）: "))
# inputLevelが1か2かでなければ、終了する
if inputLevel not in [1, 2]:
    print("1か2を入力してください")
    exit()

# https://www.python.ambitious-engineer.com/archives/35
# URLをパースする
parsed_url = urlparse(inputURL)
# URLスキーマ
# print(parsed_url.scheme) # http
# ネットワーク上の位置(≒ドメイン)を取得する
# print(parsed_url.netloc) # www.python.ambitious-engineer.com
# 階層パス
# print(parsed_url.path) # /archives/
# クエリ要素
# print(parsed_url.query) # s=hoge&x=0&y=0
# フォーマットする
rootURL = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_url)[:-1]
# print(rootURL) # http://www.python.ambitious-engineer.com/
netloc = parsed_url.netloc
netlocSplited = netloc.split('.')
domain = netlocSplited[-2] + '.' + netlocSplited[-1]
# print(domain)

def getURLlist(url, domain):
    #GETリクエストを送信
    reqs = requests.get(url)
    #URLをテキスト化し、解析を行う。その後BeautifulSoupオブジェクトを作る
    soup = BeautifulSoup(reqs.content, 'html.parser')
    #空のurlsのリストを用意
    urls = []
    #全てのaタグをループ処理し、hrefで指定されたURLを出力する
    for link in soup.find_all('a'):
        href = link.get('href')
        if href==None:
            continue
        elif href not in urls and domain in href:
            urls.append(href)
        # URLがリストに含まれていない場合かつ、
        # ルートURLが含まれている場合はリストに追加する
        elif href not in urls and re.match(r'\/(?!/)', href):
            _url = rootURL + href
            urls.append(_url)
        else:
            continue
    time.sleep(0.3)
    return urls

def getAllInfo(urls):
    allSiteInfos = {
        "data":[]
    }
    for path in tqdm(urls):
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

urls = []
urls = getURLlist(rootURL, domain)
if inputLevel == 2:
    _urls = urls
    for url in tqdm(_urls):
        urls2 = getURLlist(url, domain)
        urls =  set(urls) | set(urls2)

allSiteInfos = getAllInfo(urls)

import json
with open('allSiteInfos.json', 'w') as f:
    json.dump(allSiteInfos, f, indent=4, ensure_ascii=False)
