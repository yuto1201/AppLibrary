# CLAUDE.md — AppLibrary 規定

## プロジェクト概要

Xcode で作ったアプリ（iOS/macOS）を紹介する Web サイト。
トップページ（共通）と、アプリごとの個別紹介ページで構成される。

- 初期公開先: GitHub Pages
- 将来: 独自ドメイン／自前サーバーに移行予定
- 静的サイト（HTML / CSS / JavaScript のみ。ビルドツール不使用）

---

## フォルダ構成

```
AppLibrary/
├── index.html                  # 共通トップページ（liquid-glass 標準デザイン）
├── 404.html                    # 404（GitHub Pages 用、スタイル自己完結）
├── CLAUDE.md                   # この規定
├── README.md
├── TODO.md                     # 進行中タスクと持ち越し事項
├── docs/                       # ドキュメント（軽量に保つ）
│   ├── design.md               # 画面デザイン仕様（トップページ）
│   └── apps.md                 # アプリカタログ（registry.js の人間用ビュー）
├── assets/                     # 共通資産
│   ├── css/
│   │   ├── tokens.css          # デザイントークン（全ページ必読）
│   │   ├── standard.css        # 共通トップページ用コンポーネント（liquid-glass）
│   │   └── app-page.css        # 個別アプリページ用の共通骨格
│   ├── js/
│   │   ├── glass-filter.js     # SVG filter 注入（liquid-glass 使用時）
│   │   ├── main.js             # トップページのレンダラー
│   │   └── site-data.js        # プロフィール / お知らせ / SNS / i18n ラベル
│   └── img/                    # 背景画像・OGP 画像等
└── apps/
    ├── registry.js             # アプリメタデータ（唯一の真実）
    ├── _template/              # 新規アプリ作成時の雛形（cp して使う）
    └── <slug>/                 # アプリごとのフォルダ（slug = 英小文字+ハイフン）
        ├── index.html          # 個別紹介ページ
        ├── style.css           # 色トークン上書き + 任意カスタム
        ├── script.js
        ├── privacy.html        # プライバシーポリシー（必須）
        ├── icon.png
        └── screenshots/        # 1.png 2.png 3.png ...
```

---

## 絶対ルール

### 1. パスは相対パスに統一

GitHub Pages では `https://<user>.github.io/AppLibrary/` のようにサブディレクトリ配信になる。
独自ドメイン／自前サーバー移行時の破綻を防ぐため、**`/` から始まる絶対パスは禁止**。

```html
<!-- ✅ OK -->
<link rel="stylesheet" href="./assets/css/tokens.css">
<link rel="stylesheet" href="../../assets/css/tokens.css">

<!-- ❌ NG -->
<link rel="stylesheet" href="/assets/css/tokens.css">
```

例外: `404.html` の「トップに戻る」リンクは `/` を使ってよい（GitHub Pages が任意深さで返すため）。

**ディレクトリ URL を使わない（必ず `index.html` まで書く）:**
`./apps/sublog/` のようにディレクトリで終わる URL は、サーバー配信時は index.html が返るが、
ローカルで `file://` 直開きするとブラウザがディレクトリ一覧を表示してしまう。
GitHub Pages・ローカル両方で動くよう、リンクは必ず `./apps/sublog/index.html` まで書く。

```html
<!-- ✅ OK -->
<a href="../../index.html">← AppLibrary</a>
<a href="./apps/sublog/index.html">SubLog を見る</a>

<!-- ❌ NG（file:// で一覧表示される） -->
<a href="../../">← AppLibrary</a>
<a href="./apps/sublog/">SubLog を見る</a>
```

`registry.js` の `introUrl` / `privacyUrl` も同様に `index.html` / `privacy.html` まで明示する。

### 2. デザイントークンは継承する

- 全ページ共通：`assets/css/tokens.css`（色・余白・角丸・shadow の土台）
- 個別アプリページ専用：`assets/css/app-page.css`（hero / features / screenshots / pro / cta / footer のレイアウト）
- 個別アプリの `style.css` は **`--app-*` トークン上書きだけ**を持つ：

  ```css
  :root {
    --app-bg-1:     #e7f2ff;
    --app-bg-2:     #eaf6ff;
    --app-bg-base:  #f7fbff;
    --app-ink:      #0e1e3a;
    --app-ink-2:    #4a5b80;
    --app-accent:   #1e88e5;
    --app-accent-2: #42a5f5;
  }
  ```

- 独自色を足したい場合は `--<slug>-xxx` プレフィックスで追加（例：`--sublog-glow`）
- レイアウト調整したい時は `app-page.css` を変えると全アプリに影響するので注意。片方だけ変えたい時は個別 `style.css` で `.hero { ... }` 等を override する

### 3. アプリメタデータは `apps/registry.js` に集約

新規アプリ追加時はこのファイルに 1 件 push するだけ。トップページのカードは自動生成される。

```js
{
  slug: 'myapp',              // フォルダ名と一致
  name: 'MyApp',
  tagline: '短い説明',
  platform: 'iOS',
  status: 'alpha',            // alpha / beta / release
  releaseDate: null,
  icon: 'icon.png',           // apps/<slug>/icon.png
  appStoreUrl: null,
  introUrl: './apps/myapp/',
  privacyUrl: './apps/myapp/privacy.html',
}
```

### 4. プライバシーポリシーは必ず用意する

iOS アプリの App Store 審査では **プライバシーポリシー URL が必須**。
各アプリに `apps/<slug>/privacy.html` を置き、App Store Connect に URL を登録する。
雛形は `apps/sublog/privacy.html` を参照。**公開前に必ず内容を実態に合わせて修正する**こと。

### 5. OGP メタタグを入れる

各 `index.html`（トップ・個別）に以下を必ず含める:

```html
<meta property="og:type" content="website">
<meta property="og:site_name" content="AppLibrary">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="./ogp.png">   <!-- 画像用意したら有効化 -->
<meta name="twitter:card" content="summary_large_image">
```

### 6. `lang="ja"` で統一・将来の英語化を見越す

- 現状は日本語のみ
- 英語版を足すなら URL は `/en/` プレフィックス方式にする（`/en/apps/sublog/`）
- ルートドメイン直下を日本語（`/apps/sublog/`）とする設計を崩さない

### 7. 画像は最適化

- スクリーンショット: WebP 優先、`<img loading="lazy">`
- アプリアイコン: 正方形、128×128 以上、PNG or WebP
- OGP 画像: 1200×630 推奨

---

## 共通トップページ（`index.html`）

### デザイン

liquid-glass（Apple 風フロストガラス）を標準として採用。
`assets/css/standard.css` の `.section` `.app-card` `.btn` 等を使う。

- 背景は `standard.css` 内のグラデーション。画像に差し替える場合は `body { background: url('./assets/img/bg.jpg')... }` に変更
- 白テキスト前提。`body::before` の半透明黒レイヤーでコントラスト保険済み
- `.section` は SVG フィルター `#glass-distortion` に依存するため `glass-filter.js` を必ず読む

### 変更してよいもの

- 背景画像・グラデーション色
- アプリリストのソート順（`main.js` 内で調整）
- セクション追加（About / Contact 等）

### 変更してはいけないもの

- `tokens.css` の `--glass-*` トークン名（標準を崩すので、色味変えるなら値だけ変更）
- アプリカードの DOM 構造（`main.js` とデータ構造が合わなくなる）

### Hero オープニング演出（初回訪問のみ）

トップを開いた瞬間に Hero が文字単位で立ち上がるオープニングシーケンス。
sessionStorage キー `applibrary_hero_seen` で同セッション中の再生を抑制。
`prefers-reduced-motion: reduce` で自動的に無効化。

**開発中にもう一度見たいとき:**
DevTools コンソールで以下を実行:
```js
sessionStorage.removeItem('applibrary_hero_seen'); location.reload();
```

設計詳細は `docs/superpowers/completed/specs/2026-05-09-home-hero-opening-design.md`。

---

## 個別アプリページ（`apps/<slug>/`）

### 共通骨格（必須）

セクション順序は以下を厳守：

1. `hero` — icon / title / tagline / desc / CTA
2. `features` — カード 6 枚程度
3. `screenshots` — `apps/<slug>/screenshots/<番号>.png` から表示
4. `pro` — オプション挿入（Pro プランがあるアプリのみ）
5. `cta` — リリース予告 or App Store ボタン
6. `footer` — プライバシー・戻り導線・コピーライト

### CSS 階層（読み込み順）

```html
<link rel="stylesheet" href="../../assets/css/tokens.css">
<link rel="stylesheet" href="../../assets/css/app-page.css">
<link rel="stylesheet" href="./style.css">
```

### スクリーンショット規約

- `apps/<slug>/screenshots/` に `1.png` 〜 `N.png` を連番配置（推奨 3〜5 枚、最大 6 枚）
- 縦長 iPhone スクショ前提（`aspect-ratio: 9/19.5`）
- WebP 化は任意（最初は PNG のまま OK）
- `<img loading="lazy">` を必ず付ける

### 守るべきこと

| 項目 | ルール |
|---|---|
| トークン | `tokens.css` と `app-page.css` を読み込む |
| 色トークン | `--app-*` を `style.css` で上書きするだけで色替え完了 |
| 独自色 | `--<slug>-xxx` プレフィックスで追加 |
| 戻り導線 | `← AppLibrary` リンクを hero-nav に配置 |
| フッター | プライバシーポリシーへのリンクを配置 |
| OGP | 共通の meta タグ一式を入れる |
| lang | `lang="ja"` |

### 個別ページから liquid-glass を使いたい場合

`standard.css` と `glass-filter.js` を読み込めば共通トップページと同じ見た目が使える。アプリの雰囲気を変えたい場合は `app-page.css` ベースで色トークンだけ変える。

---

## アプリを新しく追加する手順

1. テンプレをコピー：`cp -R apps/_template apps/<slug>`（slug は英小文字+ハイフン）
2. `apps/_template/README.md` の「手順」に沿って placeholder を一括置換
3. `style.css` の `--app-*` トークン値をアプリ色に差し替え
4. `apps/<slug>/icon.png` を配置（128×128 以上、正方形）
5. `apps/<slug>/screenshots/1.png` 〜 `N.png` を配置
6. `apps/<slug>/privacy.html` の中身を実態に合わせて修正
7. `apps/registry.js` にエントリを 1 件追加
8. トップを `open index.html` でカード表示確認、`open apps/<slug>/index.html` で個別ページ確認
9. スマホ幅（〜479px）でレスポンシブ確認

---

## デプロイ

### GitHub Pages（現在）

- リポジトリの Settings → Pages → Branch を `main` / root に
- `https://<user>.github.io/AppLibrary/` で公開
- 反映まで数分

### 独自サーバー移行時（将来）

- すべて静的ファイルなので `AppLibrary/` の中身をそのまま配信すれば OK
- 相対パス縛りを守っていれば追加作業なし
- 独自ドメインにする場合はルートにしてもサブディレクトリにしても動く

---

## 将来のためのスロット（今は空でも位置だけ確保）

### Analytics

`index.html` および各 `apps/<slug>/index.html` の `</body>` 直前に `<!-- TODO: Analytics -->` コメントあり。
導入する場合は **全ページに同じ 1 行を追加**。`plausible` 推奨（Cookie 不要 → GDPR/プライバシーポリシー改訂不要）。

### サイトマップ

アプリが 10 件を超えたあたりで `sitemap.xml` を生成する。`registry.js` から手書き OK。

### 検索・フィルター

アプリ数が増えたらトップに検索 UI 追加。`main.js` を拡張する想定。

---

## やってはいけないこと

- ❌ **絶対パス（`/assets/...`）を使う** — GitHub Pages/ドメイン移行で壊れる
- ❌ **`index.html` をアプリフォルダ以外の場所（例: リポジトリ直下）に増やす** — ルート `index.html` だけが例外
- ❌ **`tokens.css` を各ページで再定義する** — トークンの値を変えたい時は `tokens.css` 自体を編集
- ❌ **プライバシーポリシーなしで App Store 審査に出す** — URL 必須
- ❌ **OGP メタタグを省略する** — SNS シェア時の見た目が崩れる
- ❌ **画像をフルサイズのまま貼る** — WebP 化 + `loading="lazy"`
- ❌ **`innerHTML` にユーザー入力を直接代入する** — 常に `escape` してから
- ❌ **ビルドツールを導入する（今は）** — 規模に見合わない複雑性
- ❌ **個別 `style.css` にレイアウト CSS を書く** — `app-page.css` 側に集約、個別は色トークンと最小限の override だけ

---

## 変更履歴（管理不要）

本ドキュメントは常に「最新の状態」を維持する。履歴は残さず上書きする。
