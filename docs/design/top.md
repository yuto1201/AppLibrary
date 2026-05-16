# 画面デザイン仕様 — AppLibrary トップ

ステータス: 確定
最終更新日: 2026-05-16

トップページ(`index.html`)の画面構成・デザインルールをまとめた仕様書。
個別アプリページは [app-page.md](./app-page.md)、共通コンポーネントは [components.md](./components.md) を参照。

---

## 全体方針

| 項目 | 内容 |
|---|---|
| ビジュアルテーマ | Apple 風 liquid-glass(半透明 + backdrop-filter + SVG distortion) |
| 背景 | シーニックなマルチ radial gradient(紫〜青〜オレンジ〜ピンク／ライト時はパステル) |
| テキスト方針 | 白テキスト既定 + ドロップシャドウでコントラスト確保。ライト切替時は黒テキスト |
| アクセント | 6 色から選択可能(青/赤/緑/紫/オレンジ/インディゴ) |
| フォント | Inter(sans)/ Iowan Old Style(serif)/ JetBrains Mono(mono)切替可 |
| 言語 | 日本語/英語切替(UI ラベルのみ。アプリ説明は日本語のまま) |
| 状態保存 | テーマ・アクセント・レイアウト・密度・フォント・言語を localStorage に保存 |

---

## セクション構成(縦に上から)

1. **Nav (`.nav`)** — sticky な浮遊ピル型ガラスナビ
   - 左: ブランド名
   - 中央: アプリ / お知らせ / お問い合わせ のアンカーリンク
   - 右: 言語切替(JA↔EN)/ テーマ切替(☀︎/🌙)/ Tweaks トグル
2. **Hero (`.hero`)** — 上下に余白を取った大型ヒーロー
   - 構成: eyebrow(小タグ)→ h1(2 行目に gradient accent)→ bio → meta チップ(位置・アプリ数・スタック)
   - 初回訪問時のオープニング演出は [components.md#hero-オープニング](./components.md#hero-オープニング) を参照
3. **App Library (`.section #apps`)** — モザイクカード一覧
   - controls: 検索 input + カテゴリチップ
   - mosaic: featured = `grid-column: span 6`、通常 = `span 4`(12 カラムグリッド)
4. **Notes (`.section #posts`)** — お知らせ／リリースノート(`SITE_DATA.posts` が空なら非表示)
5. **Contact (`.section #contact`)** — 連絡先＋ SNS リンク
6. **Footer (`.footer`)** — copyright と Privacy リンク

---

## 関連デザイントークン

`assets/css/tokens.css` に集約。**色・余白・角丸・glass 関連変数はすべてここから継承**。

主な変数:
- `--space-1〜12`、`--radius-sm/md/lg/full`、`--font-sans/mono/serif/stack`
- `--glass-blur`、`--glass-tint*`、`--glass-border*`、`--glass-text*`、`--glass-glow*`
- `--shadow-out/out-sm/out-lg/in/in-sm`
- `--accent`(runtime で `--accent` を上書きしてアクセント切替)
- `[data-density]` で `--card-pad` を切替
- `[data-font]` で `--font-stack` を切替
- `[data-theme="light"]` で glass 系トークンをライト寄りに上書き

個別アプリ色を追加する場合は `:root { --<slug>-xxx }` のように **slug プレフィックス必須**(衝突防止)。

---

## レスポンシブ

| ブレークポイント | 振る舞い |
|---|---|
| > 900px | デフォルト。featured = span 6、通常 = span 4 |
| ≤ 900px | 全カードが span 12(1 列) |
| ≤ 600px | section 余白を縮小、modal を縦積み、tweaks-panel を画面幅にフィット、`.nav-links` 非表示 |

---

## 出典・関連

- `Claude Design / OYivY5YiIkO3C7OiANSYNw` から HTML/CSS/JS バンドル形式で export → バニラ JS で再実装
- 原本 design は React + Babel ランタイムだったが、AppLibrary はビルド不要方針のため **バニラ JS + 文字列テンプレート** にリライト

主要ファイル対応:
- 原 `app.jsx` → `assets/js/main.js`
- 原 `i18n.js` → `assets/js/site-data.js` の `i18n` キー
- 原 `data.js` → `apps/registry.js`(アプリ部分) + `assets/js/site-data.js`(プロフィール／投稿／SNS)
- 原 `styles.css` → `assets/css/standard.css`(一部トークンは `tokens.css` に切り出し)
- SVG distortion filter は `assets/js/glass-filter.js` で注入

関連 ADR: なし(初版採用時の判断は遡及記録していない)
