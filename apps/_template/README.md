# 個別アプリページ テンプレート

新しいアプリの紹介ページを作る時は、このフォルダをコピーして使う。

## 手順

1. このフォルダをアプリ名（slug）でコピー：

   ```bash
   cp -R apps/_template apps/<slug>
   ```

2. 中の `{{APP_NAME}}` `{{APP_TAGLINE}}` `{{APP_DESC_META}}` `{{APP_DESC_HERO}}` `{{APP_SLUG}}` を一括置換：

   ```bash
   cd apps/<slug>
   find . -type f \( -name '*.html' -o -name '*.css' \) -exec sed -i '' \
     -e 's/{{APP_NAME}}/MyApp/g' \
     -e 's/{{APP_TAGLINE}}/短いキャッチコピー/g' \
     -e 's/{{APP_DESC_META}}/SEO 用の説明（120字程度）/g' \
     -e 's/{{APP_DESC_HERO}}/ヒーロー本文/g' \
     -e 's/{{APP_SLUG}}/<slug>/g' {} +
   ```

3. `style.css` の `--app-*` トークン値をアプリ色に差し替え（TODO コメント参照）

4. `apps/<slug>/icon.png` を配置（128×128 以上、正方形）

5. `apps/<slug>/screenshots/1.png` 〜 `N.png` を配置（縦長 iPhone スクショ、3〜5 枚推奨）

6. `apps/<slug>/privacy.html` の中身を実態に合わせて修正

7. `apps/registry.js` にエントリを追加（`apps/sublog` の項目を参考に）

8. ブラウザで確認：
   ```bash
   open apps/<slug>/index.html
   ```

9. Pro プランがあるアプリだけ、`index.html` のコメントアウト済み `<section class="pro">` ブロックのコメント記号を外して内容を書く

## 守るべきルール

- 相対パス（`./` `../`）のみ。`/` 始まりは禁止
- 共通骨格 CSS の class 名は変更しない（`hero` `features` `screenshots` `pro` `cta` 等）
- 独自色を足したい時は `--<slug>-xxx` のプレフィックスで `style.css` に追加
