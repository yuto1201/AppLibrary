# アーキテクチャ概要

ステータス: 確定
最終更新日: 2026-05-16

AppLibrary 全体の構造とサイトマップ。新規参加者および Claude Code が「どこに何があるか」を 1 ファイルで把握するための索引。

---

## サイトマップ

```
/                                       (公開ルート)
├── /                                   トップページ (index.html)
├── /apps/<slug>/                       アプリ個別ページ (例: /apps/sublog/)
│   ├── /apps/<slug>/index.html         紹介ページ
│   └── /apps/<slug>/privacy.html       プライバシーポリシー
└── /404.html                           404 ページ
```

URL 設計:
- `/` がトップ、`/apps/<slug>/` で各サブ画面にアクセス
- 全リンクは相対パス。`/` 始まりの絶対パスは原則禁止(例外: `404.html` のトップへの戻りのみ)
- ディレクトリ URL は使わず、`index.html` までフルパスで書く(`file://` 直開きでの破綻防止)

---

## ファイルツリー(主要部分)

```
AppLibrary/
├── index.html                      共通トップページ
├── 404.html                        404(スタイル自己完結)
├── CLAUDE.md / AGENTS.md           プロジェクト規定
├── README.md / TODO.md
├── docs/                           本フォルダ(規定とドキュメント)
├── assets/
│   ├── css/
│   │   ├── tokens.css              デザイントークン(全ページ必読)
│   │   ├── standard.css            トップページ用(liquid-glass)
│   │   └── app-page.css            個別アプリページ用の共通骨格
│   ├── js/
│   │   ├── glass-filter.js         SVG filter 注入
│   │   ├── main.js                 トップページのレンダラー
│   │   └── site-data.js            プロフィール / お知らせ / SNS / i18n
│   └── img/                        背景画像・OGP
└── apps/
    ├── registry.js                 アプリメタデータ(唯一の真実)
    ├── _template/                  新規アプリ作成時の雛形
    └── <slug>/                     アプリごとのフォルダ
        ├── index.html
        ├── style.css               色トークン上書き
        ├── script.js
        ├── privacy.html
        ├── icon.png
        └── screenshots/            1.png 2.png ...
```

---

## 主要モジュール

| 役割 | ファイル | 備考 |
|---|---|---|
| トップページ DOM 構造 | `index.html` | レンダリングは main.js |
| トップページのレンダラー | `assets/js/main.js` | registry.js + site-data.js を読みカードを動的生成 |
| アプリメタデータ(SOT) | `apps/registry.js` | 必須/任意フィールドはファイル先頭コメント参照 |
| プロフィール・お知らせ・SNS | `assets/js/site-data.js` | i18n ラベルも同居 |
| デザイントークン | `assets/css/tokens.css` | 色・余白・角丸・glass・font の土台 |
| トップ専用スタイル | `assets/css/standard.css` | liquid-glass コンポーネント |
| 個別ページ共通スタイル | `assets/css/app-page.css` | hero / features / screenshots / pro / cta / footer の骨格 |
| Liquid-glass SVG フィルター | `assets/js/glass-filter.js` | `#glass-distortion` を注入 |

---

## データフロー

```
apps/registry.js  ─┐
                   ├──► assets/js/main.js  ──► index.html の app-card / modal
assets/js/site-data.js ─┘
                                    │
                                    └──► assets/css/standard.css + glass-filter.js で描画
```

- アプリの追加は `registry.js` への 1 件追加で完結。`main.js` 側は変更不要
- DOM 構造を変える場合は `main.js` のレンダリング関数と整合させる
- ステータス値(`alpha` / `beta` / `release`)とリンクの null 判定は `main.js` がハンドリング

---

## デプロイと配信

- 静的ファイル(HTML/CSS/JS のみ)。ビルドツール無し
- GitHub Pages: `https://<user>.github.io/AppLibrary/` で公開
- 詳細・将来移行は [operations.md](./operations.md) を参照

---

## 関連ドキュメント

- ルート規定: [`CLAUDE.md`](../CLAUDE.md)(変更されない正規ルール集)
- トップページ仕様: [design/top.md](./design/top.md)
- 個別アプリページ仕様: [design/app-page.md](./design/app-page.md)
- 共通コンポーネント: [design/components.md](./design/components.md)
- アプリ別ノート: [apps/](./apps/)
- 意思決定履歴: [decisions/](./decisions/)
