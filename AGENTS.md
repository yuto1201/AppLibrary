# AGENTS.md — AppLibrary

## プロジェクト概要

AppLibrary は、Xcode で作った iOS / macOS アプリを紹介する静的 Web サイトです。
GitHub Pages での公開を前提に、HTML / CSS / JavaScript のみで構成されています。ビルドツールやパッケージマネージャは使いません。

- トップページ: `index.html`
- アプリ個別ページ: `apps/<slug>/index.html`
- アプリ一覧データ: `apps/registry.js`
- 共通 CSS: `assets/css/tokens.css`, `assets/css/standard.css`, `assets/css/app-page.css`
- 共通 JS: `assets/js/main.js`, `assets/js/site-data.js`, `assets/js/glass-filter.js`
- 詳細な既存規定: `CLAUDE.md`
- 進行中タスク: `TODO.md`

## 作業前に確認すること

1. `CLAUDE.md` を確認し、既存ルールと衝突しないようにする。
2. 公開前の未確定事項は `TODO.md` を確認する。
3. 既存の未コミット変更がある場合は、ユーザー作業として扱い、勝手に戻さない。

## 基本方針

- 静的サイト方針を維持する。新しいビルド工程、依存パッケージ、フレームワークは追加しない。
- 既存の DOM 構造、class 名、デザイントークンを優先する。
- 共通化済みの見た目は `assets/css/tokens.css` と `assets/css/app-page.css` を使う。
- 変更は必要範囲に限定し、無関係なリファクタやデザイン変更を混ぜない。
- 現状の主要言語は日本語。HTML は `lang="ja"` を基本にする。

## パスとリンクのルール

GitHub Pages のサブディレクトリ配信と `file://` 直開きの両方で壊れないようにする。

- `/` から始まる絶対パスは禁止。
- CSS / JS / 画像 / ページリンクは `./` または `../` の相対パスを使う。
- ディレクトリ URL ではなく、必ずファイル名まで書く。
- `registry.js` の `introUrl` は `./apps/<slug>/index.html` にする。
- `registry.js` の `privacyUrl` は `./apps/<slug>/privacy.html` にする。
- 例外: `404.html` の「トップに戻る」リンクだけは `/` を使ってよい。

```html
<!-- OK -->
<link rel="stylesheet" href="../../assets/css/tokens.css">
<a href="./apps/sublog/index.html">SubLog を見る</a>

<!-- NG -->
<link rel="stylesheet" href="/assets/css/tokens.css">
<a href="./apps/sublog/">SubLog を見る</a>
```

## デザインと CSS

### トップページ

トップページは liquid-glass デザインを標準にする。

- `index.html` は `assets/css/tokens.css` と `assets/css/standard.css` を使う。
- glass 表現を使うページでは `assets/js/glass-filter.js` を読む。
- `assets/css/tokens.css` の `--glass-*` トークン名は変更しない。色味を変える場合は値だけ調整する。
- `assets/js/main.js` がアプリカードを `apps/registry.js` から生成するため、カード DOM 構造の変更は慎重に行う。

### 個別アプリページ

個別ページの CSS 読み込み順は固定する。

```html
<link rel="stylesheet" href="../../assets/css/tokens.css">
<link rel="stylesheet" href="../../assets/css/app-page.css">
<link rel="stylesheet" href="./style.css">
```

個別アプリの `style.css` は原則として `--app-*` トークンの上書きに使う。

```css
:root {
  --app-bg-1: #e7f2ff;
  --app-bg-2: #eaf6ff;
  --app-bg-base: #f7fbff;
  --app-ink: #0e1e3a;
  --app-ink-2: #4a5b80;
  --app-accent: #1e88e5;
  --app-accent-2: #42a5f5;
}
```

独自色や追加トークンが必要な場合は `--<slug>-xxx` のプレフィックスを付ける。

## 個別アプリページの構成

`apps/<slug>/index.html` は次の順序を基本にする。

1. `hero` — icon / title / tagline / desc / CTA
2. `features` — 機能カード
3. `screenshots` — `apps/<slug>/screenshots/<番号>.png`
4. `pro` — Pro プランがある場合のみ
5. `cta` — リリース予告または App Store ボタン
6. `footer` — プライバシー、戻り導線、コピーライト

必須要素:

- `hero-nav` に `../../index.html` への戻り導線を置く。
- `footer` に `privacy.html` へのリンクを置く。
- OGP / Twitter Card の meta タグを入れる。
- スクリーンショット画像には `loading="lazy"` を付ける。

## アプリメタデータ

`apps/registry.js` がアプリカタログの唯一の真実です。
新規アプリを追加する時は、アプリフォルダ作成に加えて `window.APP_REGISTRY` に 1 件追加する。

必須フィールド:

- `slug`
- `name`
- `tagline`
- `platform`
- `status`
- `introUrl`
- `privacyUrl`

`slug` はフォルダ名と一致させる。英小文字とハイフンを基本にする。
`status` は `alpha`, `beta`, `release` のいずれかにする。
App Store 公開前の `appStoreUrl` は `null` にする。

## 新規アプリ追加手順

1. `apps/_template` を `apps/<slug>` にコピーする。
2. `{{APP_NAME}}`, `{{APP_TAGLINE}}`, `{{APP_DESC_META}}`, `{{APP_DESC_HERO}}`, `{{APP_SLUG}}` を置換する。
3. `apps/<slug>/style.css` の `--app-*` をアプリ色に合わせる。
4. `apps/<slug>/icon.png` を置く。正方形、128x128 以上を推奨。
5. `apps/<slug>/screenshots/1.png` 以降を置く。縦長 iPhone スクリーンショット、3〜5 枚を推奨。
6. `apps/<slug>/privacy.html` を実態に合わせて修正する。
7. `apps/registry.js` にエントリを追加する。
8. ブラウザでトップページと個別ページを確認する。

## プライバシーポリシー

iOS アプリの App Store 審査ではプライバシーポリシー URL が必須です。
各アプリに `apps/<slug>/privacy.html` を必ず置く。
テンプレートや既存ページをコピーした場合でも、公開前にデータ収集、第三者送信、問い合わせ先などを実態に合わせて確認する。

## OGP と画像

各 `index.html` には以下の系統の meta タグを入れる。

- `og:type`
- `og:site_name`
- `og:title`
- `og:description`
- `og:image` は画像を用意してから有効化する。
- `twitter:card`

画像の目安:

- アプリアイコン: 正方形、128x128 以上、PNG または WebP
- スクリーンショット: WebP 優先、PNG でも可
- OGP 画像: 1200x630 推奨

## 確認方法

ビルドコマンドはありません。HTML を直接開くか、必要に応じてローカル静的サーバーで確認する。

```bash
python3 -m http.server 8000
```

確認観点:

- `index.html` からアプリカードが表示される。
- アプリカードから `apps/<slug>/index.html` に遷移できる。
- 個別ページから `../../index.html` に戻れる。
- `privacy.html` へのリンクが切れていない。
- `file://` 直開きでもディレクトリ一覧に飛ばない。
- モバイル幅でテキストやボタンが重ならない。

## 注意する既知事項

- `assets/js/site-data.js` のプロフィールや SNS は未確定値が残っている可能性がある。`TODO.md` を確認する。
- OGP 画像は未作成の可能性がある。有効化する前に実ファイルの存在を確認する。
- `caflog` のスクリーンショットは未配置の可能性がある。
- トップページの Hero オープニングは `sessionStorage` の `applibrary_hero_seen` で同一セッション内の再生を抑制する。
