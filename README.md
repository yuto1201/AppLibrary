ステータス：運用中
最終更新日：2026-05-18

---

# AppLibrary

Xcode で作った iOS / macOS アプリを紹介する静的 Web サイト。liquid-glass デザインを標準採用。

- 制作: [@Yuto_Program](https://x.com/Yuto_Program)
- リポジトリ: <https://github.com/yuto1201/AppLibrary>
- 公開先: GitHub Pages（Cloudflare Pages + 独自ドメインへ移行予定 — 2026-05-24 完了見込み）

---

## セットアップ

```bash
# ブラウザで直接開く（最も簡単）
open index.html

# ローカルサーバーで確認する場合
python3 -m http.server 8000
# → http://localhost:8000
```

ビルドツールは不使用。HTML / CSS / JavaScript（バニラ）のみで完結。

### アプリページ単体で確認
```bash
open apps/sublog/index.html
open apps/caflog/index.html
```

### 開発 Tweaks パネルを出す
`?dev=1` を URL に付ける（例: `http://localhost:8000/?dev=1`）。テーマ・アクセント・レイアウト・余白・フォントを切替可能。

### Hero オープニング演出を再生する
DevTools コンソールで:
```js
sessionStorage.removeItem('applibrary_hero_seen'); location.reload();
```

---

## フォルダ構成（要点）

```
AppLibrary/
├── index.html              # 共通トップページ
├── 404.html
├── assets/
│   ├── css/                # tokens / standard / app-page
│   ├── js/                 # main / site-data / glass-filter
│   └── img/                # 背景・OGP 画像
├── apps/
│   ├── registry.js         # アプリメタデータ（唯一の真実）
│   ├── _template/          # 新規アプリの雛形
│   ├── sublog/             # SubLog 紹介ページ
│   └── caflog/             # CafLog 紹介ページ
└── docs/                   # ドキュメント
```

詳細・絶対ルールは [CLAUDE.md](CLAUDE.md) を参照。

---

## ドキュメント

| 資料 | 場所 | 用途 |
|---|---|---|
| プロジェクト規定 | [CLAUDE.md](CLAUDE.md) | 絶対ルール・フォルダ構成・デザイン方針 |
| タスク管理 | [docs/TODO.md](docs/TODO.md) | 進行中タスク・完了履歴 |
| アーキテクチャ | [docs/architecture.md](docs/architecture.md) | 技術的な構造 |
| 運用 | [docs/operations.md](docs/operations.md) | 日々の運用手順 |
| デザイン仕様 | [docs/design/](docs/design/) | トップ・アプリページ・コンポーネント |
| アプリカタログ | [docs/apps/](docs/apps/) | 各アプリの仕様メモ |
| 公開設定 | [docs/deploy/](docs/deploy/) | Cloudflare Pages・ドメイン設定 |
| 設計判断 | [docs/decisions/](docs/decisions/) | ADR（Architecture Decision Record） |

---

## アプリを追加する

1. `cp -R apps/_template apps/<slug>`（slug = 英小文字+ハイフン）
2. `apps/<slug>/` 内の placeholder を実情に置換
3. `apps/<slug>/style.css` の `--app-*` トークンを差し替え
4. `apps/<slug>/icon.png` と `apps/<slug>/screenshots/1.png` 〜 を配置
5. `apps/<slug>/privacy.html` の内容を実態に合わせる
6. `apps/registry.js` にエントリを 1 件追加

詳細は [CLAUDE.md](CLAUDE.md) の「アプリを新しく追加する手順」を参照。

---

## ライセンス

未設定。
