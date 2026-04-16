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
├── assets/                     # 共通資産
│   ├── css/
│   │   ├── tokens.css          # デザイントークン（全ページ必読）
│   │   └── standard.css        # 共通ページ用コンポーネント
│   ├── js/
│   │   ├── glass-filter.js     # SVG filter 注入（liquid-glass 使用時）
│   │   └── main.js             # トップページのレンダラー
│   └── img/                    # 背景画像・OGP 画像等
└── apps/
    ├── registry.js             # アプリメタデータ（唯一の真実）
    └── <slug>/                 # アプリごとのフォルダ（slug = 英小文字+ハイフン）
        ├── index.html          # 個別紹介ページ（自由デザイン OK）
        ├── style.css
        ├── script.js
        └── privacy.html        # プライバシーポリシー（必須）
```

### 削除予定（旧テンプレ由来）

- `src/` `docs/` は Web 開発テンプレの雛形。本プロジェクトでは使わない方針。
  整理タイミングで削除してよい。

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

### 2. デザイントークンは `assets/css/tokens.css` から継承

- 色・余白・角丸・shadow をハードコードしない → `var(--xxx)` を使う
- 個別アプリページも必ず `tokens.css` を読み込む（`../../assets/css/tokens.css`）
- トークンの値を変えたい時は `tokens.css` 自体を編集する
- 個別ページで独自色を追加したい場合は `:root { --<app>-xxx: ... }` のように**プレフィックス付き**で追加

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

---

## 個別アプリページ（`apps/<slug>/`）

### 方針

**アプリの雰囲気に合わせた自由デザイン OK**。
ただし以下のルールは守る:

| 項目 | ルール |
|---|---|
| トークン | `tokens.css` を読み込む（色・余白の土台を共有） |
| ハードコード | アプリ固有色は `:root { --<slug>-xxx }` で追加、他はトークン参照 |
| 戻り導線 | `← AppLibrary` のようにトップへ戻れるリンクを必ず配置 |
| フッター | プライバシーポリシーへのリンクを配置 |
| OGP | 上記のメタタグ一式を入れる |
| lang | `lang="ja"` |

### 個別ページから liquid-glass を使いたい場合

`standard.css` と `glass-filter.js` を読み込めば共通ページと同じ見た目が使える。
アプリごとに雰囲気を変えたい場合は独自 CSS を書く（SubLog がその例）。

---

## アプリを新しく追加する手順

1. `apps/<slug>/` フォルダを作る（slug は英小文字+ハイフン）
2. `apps/sublog/` を参考に `index.html` / `style.css` / `script.js` / `privacy.html` を作成
3. アイコンがあれば `apps/<slug>/icon.png` として配置
4. `apps/registry.js` にエントリを追加
5. トップを `open index.html` で開いてカードが出ることを確認
6. 個別ページを `open apps/<slug>/index.html` で確認
7. スマホ幅（〜479px）で崩れないかレスポンシブ確認

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

---

## 変更履歴（管理不要）

本ドキュメントは常に「最新の状態」を維持する。履歴は残さず上書きする。
