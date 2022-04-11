<?php
$jsonData = file_get_contents("./allSiteInfos.json");
$jsonDataDecoded = json_decode($jsonData, true);
$siteTitle = $jsonDataDecoded["siteTitle"];
?>

<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>サイト内検索</title>
  <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="scss/styles.css" />
</head>

<body>
  <h1>サイト内検索 【<?php echo $siteTitle; ?>】</h1>
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
