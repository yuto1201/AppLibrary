# AGENTS.md — AppLibrary

## プロジェクト概要

AppLibrary は、個人開発したアプリを紹介する Web サイトです。iOS 限定ではなく、macOS / Web / CLI などプラットフォームを問わず掲載します。

Next.js の静的出力 (`output: "export"`) を Vercel で配信しています。動的サーバーも DB も認証も使いません。

- 公開 URL: <https://app.yutodev.com/>
- ホスティング: Vercel（`main` への push で自動デプロイ）
- DNS: Cloudflare（`app` は CNAME・**DNS only**。プロキシは有効にしない）
- リポジトリ: <https://github.com/yuto1201/AppLibrary>

2026-08-31 に Cloudflare Pages から Vercel へ移行し、同時に素の HTML/CSS/JS から Next.js へ移行しました。GitHub Pages での公開は終了しています。

## 読む順番

1. この `AGENTS.md`（root 契約）
2. `docs/TODO.md`（進行中タスク）
3. `docs/deploy/README.md`（公開手順）
4. `CLAUDE.md`（Claude 向けの補足。この文書と矛盾する場合はこの文書が優先）

## 開発コマンド

```bash
npm install        # 依存の取得
npm run dev        # 開発サーバー
npm run build      # 静的出力を out/ へ生成
npm run check      # typecheck + lint + テスト
npm run test       # Vitest のみ
npm run test:e2e   # Playwright（out/ を配信して実行）
```

Node は `.node-version` に固定しています。`npm run check` が通らない変更はマージしません。

## ディレクトリ構成

```
src/
  app/                    ルーティング（App Router）
    page.tsx              トップページ
    apps/[slug]/          アプリ詳細（registry から静的生成）
    apps/[slug]/privacy/  プライバシーポリシー
  components/             UI コンポーネント
  data/
    schema.ts             registry の zod スキーマ
    registry.ts           掲載アプリの唯一の真実
    privacy/<slug>.ts     アプリ固有の法務文書
  lib/
    site-data.ts          プロフィール / お知らせ / SNS / i18n
    state.tsx             テーマ等の設定（localStorage 永続化）
    use-reveal.ts         スクロール表示アニメーション
  styles/                 デザインシステム（tokens / standard / app-page）
public/
  apps/<slug>/            アイコンとスクリーンショット
tests/                    Vitest / Playwright
```

## アプリメタデータ

`src/data/registry.ts` がアプリカタログの唯一の真実です。`src/data/schema.ts` の zod スキーマでビルド時に検証され、違反があればビルドが失敗します。

- `slug` は lowercase kebab-case。`public/apps/<slug>/` と一致させる
- `platforms` は**配列**。`iOS` / `iPadOS` / `macOS` / `watchOS` / `visionOS` / `Web` / `CLI` から 1 つ以上
- `status` は `alpha` / `beta` / `release` / `archived`
- App Store 未公開なら `appStoreUrl` を `null` にする
- フィルタのプラットフォーム軸とカテゴリ軸は registry の実データから自動生成される

## 新規アプリ追加手順

1. `public/apps/<slug>/icon.png` を置く（正方形、128x128 以上）
2. `public/apps/<slug>/screenshots/1.png` 以降を置く（縦長、3〜5 枚推奨）
3. `src/data/registry.ts` の配列へ 1 件追加する。`screenshots` に実ファイル名を並べる
4. プライバシーポリシーが必要なら `src/data/privacy/<slug>.ts` を作り、`src/app/apps/[slug]/privacy/page.tsx` の `PRIVACY` へ登録する
5. `npm run check && npm run build` を通す
6. ブラウザでトップページと個別ページを確認する

詳細ページとプライバシーページは registry から自動生成されます。**HTML を手でコピーする運用は廃止しました。**

## デザインと CSS

`src/styles/` は旧サイトから無改変で移植したデザインシステムです。

- `tokens.css` の `--glass-*` などトークン名は変更しない。色味を変える場合は値だけ調整する
- `standard.css` はトップページ、`app-page.css` は個別ページが使う
- `.reveal` の表示クラスは **`.in`**。`useReveal` フックが React の状態として付与する
- className を DOM へ直接書き込まない。React の再描画で失われる
- Liquid Glass は `GlassFilter` コンポーネントが SVG フィルタを描画する

## テーマ設定の永続化

`localStorage` の `applibrary_state` に theme / accent / layout / density / font / lang を保存します。初回描画前の適用は `src/app/layout.tsx` のインラインスクリプトが担当し、以降は `SiteStateProvider` が `<html>` の `data-*` 属性へ反映します。この二重構造は FOUC を防ぐためのもので、片方だけを消さないこと。

## プライバシーポリシー

App Store 審査ではプライバシーポリシー URL が必須です。各アプリの本文は `src/data/privacy/<slug>.ts` に持ちます。テンプレートを流用した場合でも、公開前にデータ収集・第三者送信・問い合わせ先を実態に合わせて確認します。

## 公開とデプロイ

`main` への push で Vercel が自動デプロイします。`main` へ直接 push せず、ブランチと PR を通します。

`vercel.json` がセキュリティヘッダとキャッシュ制御を持ちます。CSP を緩める変更は理由を PR に書きます。

DNS を触る場合、`app` レコードは **DNS only** を維持します。Cloudflare のプロキシを有効にすると Vercel の証明書と経路で問題が出ます。

## 完了報告の原則

検証していない項目を検証済みとして報告しません。ローカル検証とライブ公開状態は別の証拠として扱います。ビルドが通ることは、ブラウザでの表示確認の代わりになりません。

## 注意する既知事項

- `src/lib/site-data.ts` のプロフィールや SNS に未確定値が残る可能性がある。`docs/TODO.md` を参照
- OGP 画像は未作成。`src/app/layout.tsx` の `openGraph` に画像を足す前に実ファイルを用意する
- 旧サイトの個別ページにあった手書きの機能カード（絵文字＋説明文）は未移植。現在は registry の `features` タグのみ表示される
- サイト全体の `/terms` と `/privacy` は未整備
