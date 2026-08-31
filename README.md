ステータス：運用中
最終更新日：2026-08-31

---

# AppLibrary

個人開発したアプリを紹介する Web サイト。iOS に限らず、macOS / Web / CLI などプラットフォームを問わず掲載する。liquid-glass デザインを標準採用。

- 制作: [@Yuto_Program](https://x.com/Yuto_Program)
- リポジトリ: <https://github.com/yuto1201/Web-AppLibrary>
- 公開先: <https://app.yutodev.com/>（Vercel + Cloudflare DNS、2026-08-31 移行）

Next.js の静的出力を Vercel で配信している。サーバー処理・DB・認証は使わない。

---

## セットアップ

```bash
npm install
npm run dev
# → http://localhost:3000
```

## コマンド

| コマンド | 用途 |
|---|---|
| `npm run dev` | 開発サーバー |
| `npm run build` | 静的出力を `out/` へ生成 |
| `npm run check` | typecheck + lint + テスト |
| `npm run test` | Vitest |
| `npm run test:e2e` | Playwright（`out/` を配信して実行） |

Node のバージョンは `.node-version` に固定。

### Hero オープニング演出を再生する

DevTools コンソールで:

```js
sessionStorage.removeItem('applibrary_hero_seen'); location.reload();
```

---

## アプリを追加する

`src/data/registry.ts` へ 1 件追加し、`public/apps/<slug>/` に画像を置くだけ。詳細ページとプライバシーページは registry から自動生成される。

手順の詳細は [AGENTS.md](AGENTS.md) を参照。

---

## 構成

| パス | 内容 |
|---|---|
| `src/app/` | ルーティング（App Router） |
| `src/components/` | UI コンポーネント |
| `src/data/registry.ts` | 掲載アプリの唯一の真実（zod で検証） |
| `src/lib/site-data.ts` | プロフィール / お知らせ / SNS / i18n |
| `src/styles/` | デザインシステム |
| `public/apps/<slug>/` | アイコンとスクリーンショット |

---

## 現状と未着手

- 掲載アプリは 2 本。`~/Documents/Xcode` には他にも複数あり、追加が主な残作業
- OGP 画像は未作成
- サイト全体の `/terms` と `/privacy` は未整備
- 旧サイトの個別ページにあった手書きの機能カードは未移植

進行中タスクは [docs/TODO.md](docs/TODO.md) を参照。

---

## 関連ドキュメント

| ドキュメント | 内容 |
|---|---|
| [AGENTS.md](AGENTS.md) | 開発規約（root 契約） |
| [docs/deploy/README.md](docs/deploy/README.md) | 公開とデプロイ |
| [docs/decisions/](docs/decisions/) | 設計判断の記録 |
