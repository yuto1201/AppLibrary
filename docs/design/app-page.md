# アプリ詳細ページのデザイン

ステータス: 確定
最終更新日: 2026-08-31

`src/app/apps/[slug]/page.tsx` が registry から `/apps/<slug>/` を静的生成する。HTML やアプリ別の script/style ファイルをコピーしない。

- Hero: 戻るリンク、アイコン、名前、紹介、プラットフォーム、配布先 CTA。
- Features: `features` タグを共通カードで表示。旧ページの絵文字＋説明文カードや Pro 専用セクションは未移植。
- Screenshots: `public/apps/<slug>/screenshots/` の実ファイルを registry の順序で表示。lazy loading と alt を付ける。
- Footer: `/apps/<slug>/privacy/` とトップへの導線。

共通 CSS は `src/styles/app-page.css`、基本トークンは `src/styles/tokens.css`。`--app-*` / `--glass-*` の既存名を維持する。掲載画像は正方形アイコン（128px 以上）と縦長スクリーンショットを使用する。

プライバシー本文は `src/data/privacy/<slug>.ts` に保持し、privacy route の `PRIVACY` へ登録する。現在の詳細ページは常に privacy リンクを表示するので、追加時には本文と生成 URL が実在することを必ず検証する。

URL・見出し・戻り導線・画像読み込みは `tests/e2e/site.spec.ts` で確認する。過去の設計は [旧仕様](../superpowers/completed/specs/2026-05-09-app-page-design.md) に残すが、現行の実装手順ではない。
