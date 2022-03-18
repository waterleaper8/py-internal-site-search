<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>サイト内検索</title>
  <link rel="stylesheet" href="styles.css" />
  <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />
</head>

<body>
  <h1>サイト内検索</h1>
  <form action="./" method="get" class="search_container">
    <input type="text" name="keyword" id="keyword" placeholder="検索キーワードを入力してください。" />
    <input type="submit" value="&#xf002">
  </form>
  <div id="js-search-result">
  </div>

  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="paginathing.min.js"></script>
  <script src="main.js"></script>
</body>

</html>
