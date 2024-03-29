import time
import re
import requests
from bs4 import BeautifulSoup
from tqdm import tqdm
import unicodedata
from urllib.parse import urlparse

headers_dic = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36"}

inputURL = input("Input Site URL: ")
inputLevel = input("Please enter the number of levels to explore（1 or 2）: ")
# 全角数字などを整数型に変換
inputLevel = int(unicodedata.normalize("NFKC", inputLevel))
# inputLevelが1か2かでなければ、終了する
if inputLevel not in [1, 2]:
    print("1か2を入力してください")
    exit()

# URLからドメイン名を抽出する
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

def getTitle(url):
    res = requests.get(url, headers=headers_dic)
    soup = BeautifulSoup(res.content, "html.parser")
    try:
        title = soup.select("title")[0].text
    except IndexError:
        title = "タイトルなし"
    return title

def getURLlist(url, domain):
    # GETリクエストを送信
    reqs = requests.get(url, headers=headers_dic)
    # BeautifulSoupオブジェクトを作る
    soup = BeautifulSoup(reqs.content, 'html.parser')

    urls = []
    # 全てのaタグをループ処理し、hrefで指定されたURLを出力する
    for link in soup.find_all('a'):
        try:
            href = link.get('href')
            # ページ内リンクの場合、末尾から#を削除する
            if '#' in href:
                href = href.split('#')[0]
            # hrefの中身が空の場合は、continueで処理をスキップする
            if href[:2] == "//":
                href = href.replace("//", "https://")
            if href == None:
                continue
            # URLがリストに含まれていない場合かつ、
            # hrefが指定のドメインを含む場合はリストに追加する
            elif href not in urls and domain in href:
                urls.append(href)
            # URLがリストに含まれていない場合かつ、
            # hrefが/で始まる場合はリストに追加する
            elif href not in urls and re.match(r'\/(?!/)', href):
                _url = rootURL + href
                urls.append(_url)
            else:
                continue
        except TypeError:
            continue
    time.sleep(0.3)
    return urls

def getAllInfo(urls):
    allSiteInfos = {
        "data":[]
    }
    for path in tqdm(urls):
        res = requests.get(path, headers=headers_dic)
        soup = BeautifulSoup(res.content, "html.parser")

        # タイトルとメタ説明とメタ画像を取得
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
        time.sleep(0.5)

    return allSiteInfos

urls = []
urls = getURLlist(rootURL, domain)
if inputLevel == 2:
    _urls = urls
    for url in tqdm(_urls):
        urls2 = getURLlist(url, domain)
        urls =  set(urls) | set(urls2)

allSiteInfos = {
    "siteTitle": getTitle(rootURL),
    "data": getAllInfo(urls)["data"]
    }

import json
with open('allSiteInfos.json', 'w') as f:
    json.dump(allSiteInfos, f, indent=4, ensure_ascii=False)
