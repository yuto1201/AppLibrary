# 個別アプリページ デザイン方針 — Spec

ステータス：確定（実装計画作成待ち）
最終更新日：2026-05-09

## 背景

`apps/sublog/` `apps/caflog/` の個別ページは現状、DOM 構造が完全に一致し、`style.css` も色トークン以外はほぼ同一。一方で TODO.md には「個別ページのデザイン方針確定（liquid-glass 共通化 vs 独自）」が積み残しており、新規アプリ追加のたびに重複した CSS を書くか、明確なテンプレを用意するかの判断が必要だった。

加えて、`sublog/Preview/` にシミュレータスクショが 4 枚あるが、現状どの個別ページにもスクショは表示されていない。アプリ紹介サイトとしての訴求力に欠ける。

## 方針

**ハイブリッド：骨格共通・表現個別**

- レイアウト・セクション構成・コンポーネント CSS は共通化
- 色・アクセント・スクリーンショット表現は個別アプリで自由
- 「色を差し替えるだけで新アプリページが完成する」のがデフォルト動線
- 攻めた表現が必要なときは escape hatch（個別 `style.css` で追加クラス）

## 共通骨格（セクション順序固定）

```
hero        — icon / title / tagline / desc / CTA 2 つ
features    — カード 6 枚程度のグリッド
screenshots — iPhone 風モック付き、3〜5 枚を横並び or グリッド（新規）
[pro]       — オプション挿入（このアプリだけ Pro プランがある場合）
cta         — リリース予告 or App Store ボタン
footer      — プライバシー・戻り導線・コピーライト
```

`pro` セクションは骨格に含めず、必要なアプリだけ `screenshots` と `cta` の間に追加する規約。

## ファイル配置

**新規ファイル**

```
assets/css/app-page.css      # 共通骨格 CSS（レイアウト・タイポ・コンポーネント）
apps/_template/              # 新規アプリ作成時の雛形（sublog をベースに作成）
```

**個別アプリの構成（規約）**

```
apps/<slug>/
├── index.html              # テンプレ HTML をコピー、中身を書き換え
├── style.css               # 色トークンと任意カスタムだけ
├── script.js
├── icon.png
├── privacy.html
└── screenshots/            # 新設規約：1.png 2.png 3.png ...
```

## CSS 階層（読み込み順）

```html
<link rel="stylesheet" href="../../assets/css/tokens.css">    <!-- 色・余白の土台 -->
<link rel="stylesheet" href="../../assets/css/app-page.css">  <!-- 骨格・レイアウト -->
<link rel="stylesheet" href="./style.css">                    <!-- 色トークン上書き + 任意 -->
```

## 色トークン命名規約

共通 CSS は汎用名で参照する：

```
--app-bg-1, --app-bg-2     背景グラデーション色
--app-ink, --app-ink-2     テキスト色（メイン / セカンダリ）
--app-accent, --app-accent-2 アクセント色（リンク / ハイライト）
```

個別 `style.css` で以下のように上書きするだけで色替えが完了する：

```css
:root {
  --app-bg-1:   #e7f2ff;
  --app-bg-2:   #eaf6ff;
  --app-ink:    #0e1e3a;
  --app-ink-2:  #4a5b80;
  --app-accent: #1e88e5;
  --app-accent-2: #42a5f5;
}
```

個別追加色（アプリ固有のグロー色など）は従来どおり `--<slug>-xxx` プレフィックスで足す。

現在の `--sublog-*` `--caflog-*` 命名は `--app-*` に置換する。1 ページ 1 アプリなので衝突は起きない。

## screenshots セクション仕様

**HTML マークアップ**

```html
<section id="screenshots" class="screenshots">
  <h2 class="section-title">Screenshots</h2>
  <div class="screenshot-rail">
    <figure class="shot">
      <img src="./screenshots/1.png" alt="ホーム画面" loading="lazy">
      <figcaption>ホーム画面</figcaption>
    </figure>
    <!-- 繰り返し -->
  </div>
</section>
```

**レイアウト**

- デスクトップ（≥768px）：`grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))` でグリッド
- モバイル（<768px）：`overflow-x: auto; scroll-snap-type: x mandatory` で横スワイプカルーセル
- 各画像に iPhone 風モック枠を CSS で付与（`border-radius: 28px` / 影 / 細枠）
- 実機ベゼル画像は使わない（軽量化＋モック差替コスト削減）
- 縦長スクショ前提（`aspect-ratio: 9/19.5`）

**画像規約**

- ファイル名は `1.png 2.png 3.png ...` の連番固定
- `apps/<slug>/screenshots/` に配置
- WebP 変換は任意（最初は PNG のまま OK、重くなったら切り替え）
- `loading="lazy"` 必須
- キャプション（`<figcaption>`）は任意。空にしたければタグごと削除

## 既存 sublog / caflog のリファクタ範囲

1. **共通 CSS 抽出**：両者の `style.css` から重複しているレイアウト系（hero / features / pro / cta / footer）を `assets/css/app-page.css` に移動
2. **色トークン置換**：`--sublog-*` `--caflog-*` を `--app-*` に rename。各 `style.css` は色トークン値だけを保持
3. **screenshots セクション追加**：
   - sublog：`Preview/` 内のスクショ 4 枚を `screenshots/1.png`〜`4.png` にリネーム移動し、HTML に挿入
   - caflog：スクショ未撮影 → セクションは入れず、TODO.md に「caflog スクショ撮影と screenshots/ 配置」を追加
4. **HTML 更新**：両アプリの `index.html` に `app-page.css` の `<link>` を追加、screenshots セクションを挿入
5. **CLAUDE.md 規約追記**：
   - 個別ページ作成時は `assets/css/app-page.css` を読み込む
   - 色トークンは `--app-*` を上書き、独自色は `--<slug>-*` プレフィックス
   - スクショは `apps/<slug>/screenshots/<番号>.png`
6. **`apps/_template/` 作成**：sublog をベースに雛形化、`README` に「コピーして使う」手順を書く

## スコープ外（別タスク）

- liquid-glass を sublog/caflog に強制適用しない（現状の明色グラデ路線を維持）
- pro セクション内容の見直し
- 画像最適化（WebP 化）
- TODO.md の他項目（site-data.js プロフィール実値・OGP 画像）
- caflog のスクショ撮影本体（TODO 化のみ）

## 移行リスクと緩和策

**リスク**：共通化後、片方だけレイアウト調整したいときに `app-page.css` を変更すると両方に影響する。

**緩和策**：個別 `style.css` で `.hero { ... }` 等を override するパターンを「正規の個別カスタマイズ手段」として CLAUDE.md に明記。共通 CSS は最大公約数だけを持つ方針を維持する。

## 受け入れ基準

- `assets/css/app-page.css` が存在し、hero / features / screenshots / pro / cta / footer のレイアウトを定義している
- `apps/sublog/` `apps/caflog/` がリファクタ後も従来と同じ見た目（色・余白・タイポ）を維持
- `apps/sublog/screenshots/1.png`〜`4.png` が存在し、個別ページにスクショセクションが表示される
- `apps/sublog/style.css` `apps/caflog/style.css` がそれぞれ 60 行以下に収まる（色トークンと最小限の独自カスタムのみ）
- `apps/_template/` が存在し、コピーするだけで新アプリページを開始できる
- `CLAUDE.md` に新規約（共通 CSS / 色トークン名 / screenshots 規約）が反映されている
- `open apps/sublog/index.html` `open apps/caflog/index.html` で表示崩れなし、モバイル幅（375px）でも崩れなし
