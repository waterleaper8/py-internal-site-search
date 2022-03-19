<?php
if (!array_key_exists("keyword", $_GET)) {
  echo "コメントは必須項目です。";
} else {
  $keyword = $_GET['keyword'];
}
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><?php echo $keyword ?> - サイト内検索</title>
  <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="scss/styles.css" />
</head>

<body>
  <a href="./">トップへ戻る</a>
  <h1><?php echo $keyword ?>の検索結果</h1>
  <form action="search-result.php" method="GET" class="search_container">
    <input type="text" name="keyword" id="keyword" placeholder="検索キーワードを入力してください。" />
    <input type="submit" value="&#xf002">
  </form>
  <div id="js-search-result">
  </div>

  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <!-- ページネーションを行うjQueryのライブラリ -->
  <!-- https://github.com/alfrcr/paginathing -->
  <script src="js/paginathing.min.js"></script>
  <script src="js/main.js"></script>
  <script src="js/search.js"></script>
</body>

</html>
