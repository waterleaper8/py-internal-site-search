// jQuery：「paginathing.js」を使えば静的なHTMLページへのページネーション実装が簡単にできる！
// https://www.omakase.net/blog/2021/04/paginathingjs.html

function pagenating() {
  $("#js-search-result").paginathing({
    //親要素のclassを記述
    perPage: 5, //1ページあたりの表示件数
    prevNext: false, //前後のページへのリンクを表示するか
    firstLast: false, //最初のページへのリンクを表示するか
    pageNumbers: false, //ページ番号を表示するかどうか
    firstText: "最初へ",
    lastText: "最後へ",
    prevText: "前へ", //1つ前のページへ移動するボタンのテキスト
    nextText: "次へ", //1つ次のページへ移動するボタンのテキスト
    activeClass: "navi-active", //現在のページ番号に任意のclassを付与できます
    disabledClass: "navi-disable", //無効なページ番号に任意のclassを付与できます
  })
}
