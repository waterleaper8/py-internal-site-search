// jQueryでキーワード検索の機能を実装する
// https://cly7796.net/blog/javascript/implement-keyword-search-function-with-jquery/
var paramKey = "keyword" // 検索キーワードとして取得するパラメータのキー
var jsonPath = "allSiteInfos.json" // 記事情報のjsonのパス
var jsonKeys = ["title", "captionText"] // 検索対象にするjson内のキー
var output = "#js-search-result" // 検索対象にするjson内のキー

$(function () {
  const query = location.search.substring(1).split("&")
  // URLからキーワードを取得
  var s = get_search_keywords(paramKey)

  if (s) {
    // ajaxで記事情報を取得
    $.ajax({
      url: jsonPath,
      cache: false,
    }).then(
      function (data) {
        // キーワードに一致する記事情報のインデックスを取得
        var index = keyword_search(data, s, jsonKeys)
        if (index.length > 0) {
          // 検索結果一覧を生成
          generate_result(data, index)
        } else {
          alert("キーワードに一致する記事がありませんでした。")
        }
      },
      function () {
        console.log("取得に失敗しました。")
      }
    )
  } else {
    console.log("キーワードが入力されていません。")
    return
  }
})

/**
 * 検索に使用するキーワードを取得する
 * キーワードがない場合はfalseを返す
 * @param {string} key (required) パラメータのkey
 */
function get_search_keywords(key) {
  // URLからパラメータ取得
  var params = []
  var param = location.search.substring(1).split("&")
  for (var i = 0; i < param.length; i++) {
    params[i] = param[i].split("=")
  }
  // キーワードを配列形式で格納
  var keywords = []
  var separator = / |　|\+/g
  for (var i = 0; i < params.length; i++) {
    if (params[i][0] === key && params[i][1] !== undefined) {
      keywords = decodeURIComponent(params[i][1]).split(separator)
      break
    }
  }
  // キーワードの値が空のものを除去
  keywords = keywords.filter(function (e) {
    return e !== ""
  })
  // キーワードがない場合はfalseを返す
  if (keywords.length <= 0) {
    return false
  }
  // キーワードを小文字に変換
  for (var i = 0; i < keywords.length; i++) {
    keywords[i] = keywords[i].toLowerCase()
  }
  return keywords
}

/**
 * 記事内のキーワード検索
 * @param {object} articleData (required) 検索する記事情報
 * @param {array}  keywords    (required) 検索するキーワード
 * @param {array}  jsonKeys    (required) 検索対象にする記事情報のキー
 */
function keyword_search(articleData, keywords, jsonKeys) {
  var data = articleData["data"]
  console.log(data)
  var h = []
  // 検索対象の値を配列にまとめる
  for (var i = 0; i < data.length; i++) {
    var v = []
    for (var j = 0; j < jsonKeys.length; j++) {
      var thisVal = data[i][jsonKeys[j]]
      // 値が配列の場合はその各値を取得
      if (Array.isArray(thisVal)) {
        for (var k = 0; k < thisVal.length; k++) {
          v.push(thisVal[k].toLowerCase())
        }
      } else {
        v.push(thisVal.toLowerCase())
      }
    }
    h.push(v)
  }

  // 一致する配列のindexを取得
  var matchIndex = []
  var matchCount
  var thisArr
  // 各記事のループ
  for (var i = 0; i < h.length; i++) {
    matchCount = 0
    thisArr = h[i]
    // 検索キーワードでのループ
    for (var j = 0; j < keywords.length; j++) {
      // 記事の各項目でのループ
      for (var k = 0; k < thisArr.length; k++) {
        // 記事項目内に検索キーワードが含まれる場合
        if (thisArr[k].indexOf(keywords[j]) > -1) {
          matchCount++
          break
        }
      }
      // 検索キーワードが各項目に含まれなかった場合
      if (matchCount <= j) {
        break
      }
      // 検索キーワードが全て記事に含まれていた場合
      if (matchCount >= keywords.length) {
        matchIndex.push(i)
      }
    }
  }
  return matchIndex
}

/**
 * 検索に一致した記事で検索結果を生成
 * @param {object} articleData (required) 検索する記事情報
 * @param {array}  index       (required) 検索に一致する記事情報のindex
 */
function generate_result(articleData, index) {
  var data = articleData["data"]
  var ins = ""
  for (var i = 0; i < index.length; i++) {
    var t = index[i]
    ins += '<div class="article">'
    ins += '<h3 class="article_ttl">'
    ins += `<a href=${data[t]["url"]}>`
    ins += data[t]["title"]
    ins += "</a>"
    ins += "</h3>"
    ins += '<div class="article_body">'
    ins += `<img width='240' src='${data[t]["captionImage"]}' />`
    ins += '<div class="article_body_right">'
    ins += '<p class="article_url">'
    ins += data[t]["url"]
    ins += "</p>"
    ins += '<p class="article_captionText">'
    ins += data[t]["captionText"]
    ins += "</p>"
    ins += "</div>"
    ins += "</div>"
    ins += "</div>"
  }
  $(output).html(ins)
  pagenating()
}

// jQuery：「paginathing.js」を使えば静的なHTMLページへのページネーション実装が簡単にできる！
// https://www.omakase.net/blog/2021/04/paginathingjs.html
function pagenating() {
  $("#js-search-result").paginathing({
    //親要素のclassを記述
    perPage: 5, //1ページあたりの表示件数
    firstLast: true,
    firstText: "最初へ",
    lastText: "最後へ",
    prevText: "前へ", //1つ前のページへ移動するボタンのテキスト
    nextText: "次へ", //1つ次のページへ移動するボタンのテキスト
    activeClass: "navi-active", //現在のページ番号に任意のclassを付与できます
  })
}
