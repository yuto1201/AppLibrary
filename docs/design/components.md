# 共通コンポーネント仕様 — AppLibrary

ステータス: 確定
最終更新日: 2026-05-16

トップページ / 個別アプリページで再利用される UI コンポーネントの仕様。
トップページの全体構成は [top.md](./top.md)、個別アプリページは [app-page.md](./app-page.md) を参照。

---

## Glass パネル(`.glass`)

全ガラスパネルの共通ベース。

- `::before` で `backdrop-filter: blur(22px)` + `filter: url(#glass-distortion)`
- `::after` で半透明 tint と inset highlight
- ライトテーマでは tint と border を白寄りに自動切替
- SVG フィルター `#glass-distortion` に依存するため `assets/js/glass-filter.js` を必ず読む

---

## App カード(`.app-card`)

- 必須表示: アイコン / 名前 / タグライン
- 任意表示: カテゴリ / 価格 / レーティング(無ければステータスバッジ)
- ホバー: `translateY(-6px)` + アイコン回転 + 背景 glow 拡大
- featured 版: `min-height: 440px` + アイコンも一回り大きく(120×120)
- レイアウト切替(`[data-layout]`): `mosaic` / `grid` / `list`

`assets/js/main.js` が `apps/registry.js` からカードを生成。DOM 構造を変える場合は両方を整合させる。

---

## モーダル(`.modal`)

カードクリックで開く詳細ビュー。背景 blur + scale-in transition。

構成:
- ヘッダ: アイコン + カテゴリ + 名前 + タグライン
- スタッツ: バージョン / ステータス / リリース / 価格(4 カラム)
- 本文: description
- フィーチャータグ: features 配列を chip 表示
- アクション: App Store badge ボタン + 「アプリサイトへ ↗」visit ボタン

App Store URL が `null` の場合、badge ボタンは disabled 表示(label は「審査中 / In Review」に切替)。

---

## バッジボタン(`.badge-btn`)/ Visit ボタン(`.visit-btn`)

モーダル下部のアクション。App Store ダウンロードバッジ風(黒背景 + 小/大 2 段組)と、ガラス調のアプリサイト導線をペアで配置。

---

## Tweaks パネル(`.tweaks-panel`)

画面右下のフローティング設定パネル。テーマ / アクセント / レイアウト / 密度 / フォント を即時切替。
`?dev=1` でのみ表示される(本番訪問者には非表示)。

---

## Hero オープニング

トップを開いた瞬間に Hero が文字単位で立ち上がるオープニングシーケンス。

- sessionStorage キー `applibrary_hero_seen` で同セッション中の再生を抑制
- `prefers-reduced-motion: reduce` で自動的に無効化
- 文字分割: `Array.from(text)` でサロゲートペア対応、各文字を `<span class="hero-letter">` でラップ
- アクセシビリティ: h1 の `aria-label` で元テキスト、各文字 span は `aria-hidden="true"`

詳細仕様(タイムライン、easing、keyframes): [completed/specs/2026-05-09-home-hero-opening-design.md](../superpowers/completed/specs/2026-05-09-home-hero-opening-design.md)

開発中にもう一度見たいとき:
```js
sessionStorage.removeItem('applibrary_hero_seen'); location.reload();
```

---

## バッジ / ステータス表示の規約

- ステータス値: `alpha` / `beta` / `release`(`apps/registry.js` 由来)
- `appStoreUrl: null` のときは「審査中 / In Review」表示
- アプリ価格表示: `'無料'` / `'無料 (Pro ¥600)'` / `'¥300'` 等の表示用文字列を `registry.js` の `price` で持つ
