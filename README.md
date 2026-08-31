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
npm ci
npm run dev
# → http://localhost:3000
```

## コマンド

| コマンド | 用途 |
|---|---|
| `npm run dev` | 開発サーバー |
| `npm run build` | 静的出力を `out/` へ生成 |
| `npm run check` | 方針・文書・生成物・lint・型・テスト・静的 build |
| `npm run check:fast` | 実装中の lint・型・テスト |
| `npm run verify` | check + desktop/mobile E2E |
| `npm run start` | out/ を localhost:3210 で静的配信 |
| `npm run generate` | 共通レビュー契約からエージェント設定を生成 |
| `npm run test` | Vitest |
| `npm run test:e2e` | Playwright（`out/` を配信して実行） |

Node/npm は `.node-version` と `package.json` に固定。初回 E2E 前に `npm exec -- playwright install chromium` を実行する。`test:e2e` 単独なら先に `npm run build`。

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
| [specs/README.md](specs/README.md) | プロダクトと受け入れ条件 |
| [docs/workflow.md](docs/workflow.md) | Web-Template 由来の Issue / PR / レビュー方式 |
| [docs/verification.md](docs/verification.md) | ローカルと CI の検証 |
| [docs/decisions/](docs/decisions/) | 設計判断の記録 |
