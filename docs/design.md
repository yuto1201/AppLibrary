# 画面デザイン仕様 — AppLibrary トップ

ステータス: 確定
最終更新日: 2026-04-27

トップページ（`index.html`）の画面構成・デザインルールをまとめた仕様書。
個別アプリページは「自由デザイン OK」の方針（CLAUDE.md 参照）のため、ここでは扱わない。

---

## 全体方針

| 項目 | 内容 |
|---|---|
| ビジュアルテーマ | Apple 風 liquid-glass（半透明 + backdrop-filter + SVG distortion） |
| 背景 | シーニックなマルチ radial gradient（紫〜青〜オレンジ〜ピンク／ライト時はパステル） |
| テキスト方針 | 白テキスト既定 + ドロップシャドウでコントラスト確保。ライト切替時は黒テキスト |
| アクセント | 6 色から選択可能（青/赤/緑/紫/オレンジ/インディゴ） |
| フォント | Inter（sans）/ Iowan Old Style（serif）/ JetBrains Mono（mono）切替可 |
| 言語 | 日本語/英語切替（UI ラベルのみ。アプリ説明は日本語のまま） |
| 状態保存 | テーマ・アクセント・レイアウト・密度・フォント・言語を localStorage に保存 |

---

## セクション構成（縦に上から）

1. **Nav (`.nav`)** — sticky な浮遊ピル型ガラスナビ
   - 左: ブランド名
   - 中央: アプリ / お知らせ / お問い合わせ のアンカーリンク
   - 右: 言語切替（JA↔EN）/ テーマ切替（☀︎/🌙）/ Tweaks トグル
2. **Hero (`.hero`)** — 上下に余白を取った大型ヒーロー
   - 構成: eyebrow（小タグ）→ h1（2 行目に gradient accent）→ bio → meta チップ（位置・アプリ数・スタック）
3. **App Library (`.section #apps`)** — モザイクカード一覧
   - controls: 検索 input + カテゴリチップ
   - mosaic: featured = `grid-column: span 6`、通常 = `span 4`（12 カラムグリッド）
4. **Notes (`.section #posts`)** — お知らせ／リリースノート（`SITE_DATA.posts` が空なら非表示）
5. **Contact (`.section #contact`)** — 連絡先＋ SNS リンク
6. **Footer (`.footer`)** — copyright と Privacy リンク

---

## コンポーネント

### Glass パネル（`.glass`）
全ガラスパネルの共通ベース。

- `::before` で `backdrop-filter: blur(22px)` + `filter: url(#glass-distortion)`
- `::after` で半透明 tint と inset highlight
- ライトテーマでは tint と border を白寄りに自動切替

### App カード（`.app-card`）
- 必須表示: アイコン / 名前 / タグライン
- 任意表示: カテゴリ / 価格 / レーティング（無ければステータスバッジ）
- ホバー: `translateY(-6px)` + アイコン回転 + 背景 glow 拡大
- featured 版: `min-height: 440px` + アイコンも一回り大きく（120×120）
- レイアウト切替（`[data-layout]`）: `mosaic` / `grid` / `list`

### モーダル（`.modal`）
カードクリックで開く詳細ビュー。背景 blur + scale-in transition。

構成:
- ヘッダ: アイコン + カテゴリ + 名前 + タグライン
- スタッツ: バージョン / ステータス / リリース / 価格（4 カラム）
- 本文: description
- フィーチャータグ: features 配列を chip 表示
- アクション: App Store badge ボタン + 「アプリサイトへ ↗」visit ボタン

App Store URL が `null` の場合、badge ボタンは disabled 表示（label は「審査中 / In Review」に切替）。

### Tweaks パネル（`.tweaks-panel`）
画面右下のフローティング設定パネル。テーマ / アクセント / レイアウト / 密度 / フォント を即時切替。
※ 一般訪問者向け UX としては要再検討（TODO 参照）。

### バッジボタン（`.badge-btn`）/ Visit ボタン（`.visit-btn`）
モーダル下部のアクション。App Store ダウンロードバッジ風（黒背景 + 小/大 2 段組）と、ガラス調のアプリサイト導線をペアで配置。

---

## デザイントークン

`assets/css/tokens.css` に集約。**色・余白・角丸・glass 関連変数はすべてここから継承**。

主な変数:
- `--space-1〜12`、`--radius-sm/md/lg/full`、`--font-sans/mono/serif/stack`
- `--glass-blur`、`--glass-tint*`、`--glass-border*`、`--glass-text*`、`--glass-glow*`
- `--shadow-out/out-sm/out-lg/in/in-sm`
- `--accent`（runtime で `--accent` を上書きしてアクセント切替）
- `[data-density]` で `--card-pad` を切替
- `[data-font]` で `--font-stack` を切替
- `[data-theme="light"]` で glass 系トークンをライト寄りに上書き

個別アプリ色を追加する場合は `:root { --<slug>-xxx }` のように **slug プレフィックス必須**（衝突防止）。

---

## レスポンシブ

| ブレークポイント | 振る舞い |
|---|---|
| > 900px | デフォルト。featured = span 6、通常 = span 4 |
| ≤ 900px | 全カードが span 12（1 列） |
| ≤ 600px | section 余白を縮小、modal を縦積み、tweaks-panel を画面幅にフィット、`.nav-links` 非表示（→ TODO: ハンバーガー要実装） |

---

## 出典

`Claude Design / OYivY5YiIkO3C7OiANSYNw` から HTML/CSS/JS バンドル形式で export → バニラ JS で再実装。
原本 design は React + Babel ランタイムだったが、AppLibrary はビルド不要方針のため **バニラ JS + 文字列テンプレート** にリライトしている。

主要ファイル対応:
- 原 `app.jsx` → `assets/js/main.js`
- 原 `i18n.js` → `assets/js/site-data.js` の `i18n` キー
- 原 `data.js` → `apps/registry.js`（アプリ部分） + `assets/js/site-data.js`（プロフィール／投稿／SNS）
- 原 `styles.css` → `assets/css/standard.css`（一部トークンは `tokens.css` に切り出し）
- SVG distortion filter は `assets/js/glass-filter.js` で注入
