// jQueryでキーワード検索の機能を実装する
// https://cly7796.net/blog/javascript/implement-keyword-search-function-with-jquery/
let paramKey = "keyword" // 検索キーワードとして取得するパラメータのキー
let jsonPath = "allSiteInfos.json" // 記事情報のjsonのパス
let jsonKeys = ["title", "captionText"] // 検索対象にするjson内のキー
let output = "#js-search-result" // 検索対象にするjson内のキー

$(function () {
  const query = location.search.substring(1).split("&")
  // URLからキーワードを取得
  let s = get_search_keywords(paramKey)

  if (s) {
    // ajaxで記事情報を取得
    $.ajax({
      url: jsonPath,
      cache: false,
    }).then(
      function (data) {
        // キーワードに一致する記事情報のインデックスを取得
        let [index, counts] = keyword_search(data, s, jsonKeys)
        console.log(index)
        console.log(counts)

        // 最もシンプルで(驚くべき)ソートアルゴリズム？
        // https://sucrose.hatenablog.com/entry/2021/10/13/231331
        for (let i = 0; i < counts.length; i++) {
          for (let j = 0; j < counts.length; j++) {
            if (counts[i] > counts[j]) {
              let tmp = counts[i]
              counts[i] = counts[j]
              counts[j] = tmp
              let tmp2 = index[i]
              index[i] = index[j]
              index[j] = tmp2
            }
          }
        }

        console.log(index)
        console.log(counts)
        // console.log(sortedIndex)
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
  let params = []
  let param = location.search.substring(1).split("&")
  for (let i = 0; i < param.length; i++) {
    params[i] = param[i].split("=")
  }
  // キーワードを配列形式で格納
  let keywords = []
  let separator = / |　|\+/g
  for (let i = 0; i < params.length; i++) {
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
  for (let i = 0; i < keywords.length; i++) {
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
  let data = articleData["data"]
  let h = []
  // 検索対象の値を配列にまとめる
  for (let i = 0; i < data.length; i++) {
    let v = []
    for (let j = 0; j < jsonKeys.length; j++) {
      let thisVal = data[i][jsonKeys[j]]
      // 値が配列の場合はその各値を取得
      if (Array.isArray(thisVal)) {
        for (let k = 0; k < thisVal.length; k++) {
          v.push(thisVal[k].toLowerCase())
        }
      } else {
        v.push(thisVal.toLowerCase())
      }
    }
    h.push(v)
  }

  // 一致する配列のindexを取得
  let matchIndex = []
  let keywordCountList = []
  let matchCount
  let keywordCount
  let keywordCountSum
  let thisArr
  // 各記事のループ
  for (let i = 0; i < h.length; i++) {
    keywordCountSum = 0
    matchCount = 0
    thisArr = h[i]
    // 検索キーワードでのループ
    for (let j = 0; j < keywords.length; j++) {
      // 記事の各項目でのループ
      for (let k = 0; k < thisArr.length; k++) {
        // 記事項目内に検索キーワードが含まれる場合
        if (thisArr[k].indexOf(keywords[j]) > -1) {
          matchCount++
          keywordCount = (thisArr[k].match(new RegExp(keywords[j], "g")) || [])
            .length
          // console.log(thisArr[k], keywords[j], keywordCount)
          keywordCountSum += keywordCount
        }
      }
      // 検索キーワードが各項目に含まれなかった場合
      if (matchCount <= j) {
        break
      }
      // 検索キーワードが全て記事に含まれていた場合
      if (matchCount >= keywords.length) {
        matchIndex.push(i)
        keywordCountList.push(keywordCountSum)
      }
    }
  }
  return [matchIndex, keywordCountList]
}

/**
 * 検索に一致した記事で検索結果を生成
 * @param {object} articleData (required) 検索する記事情報
 * @param {array}  index       (required) 検索に一致する記事情報のindex
 */
function generate_result(articleData, index) {
  let data = articleData["data"]
  let ins = ""
  for (let i = 0; i < index.length; i++) {
    let t = index[i]
    ins += '<div class="article">'
    ins += '<h3 class="article_ttl">'
    ins += `<a href=${data[t]["url"]}>`
    ins += data[t]["title"]
    ins += "</a>"
    ins += "</h3>"
    ins += '<div class="article_body">'
    if (data[t]["captionImage"] !== "") {
      ins += `<img width='128' src='${data[t]["captionImage"]}' />`
    }
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
