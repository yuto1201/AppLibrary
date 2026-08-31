# TODO — AppLibrary

最終更新日: 2026-08-31

進行中の改善タスクと持ち越し事項。完了したものはチェックを入れる、もしくは「完了済み」に移動する。

> 注: このファイルは作業ログのため `ステータス:` 行を持たない(他の docs/ 配下と異なる例外)。

---

## 🔴 優先度: 高（本来の課題）

- [ ] **掲載アプリを増やす** — 現在 2 本。`~/Documents/Xcode` にある SimplePomo / GoshuinPocket / Elsefolk / Flower / PayCycle / ManholeMap などを `src/data/registry.ts` へ追加する
- [ ] **スコープ拡張の反映** — iOS 以外のアプリを掲載し、`platforms` フィルタを実際に機能させる

## 🟡 優先度: 中（仕上げ）

- [ ] **OGP 画像作成** — `public/ogp.png`（1200×630）を作って `src/app/layout.tsx` の `openGraph.images` を有効化
- [ ] **サイト全体の `/terms` と `/privacy`** — 現状はアプリ個別のプライバシーページのみ。サイト共通の法務ページが無い
- [ ] **機能カードの移植** — 旧 `apps/<slug>/index.html` にあった絵文字アイコン＋説明文のリッチな機能カードが未移植。registry へ項目を足すか判断する
- [ ] **フィルタ UI の整理** — プラットフォーム軸とカテゴリ軸で「すべて」チップが 2 つ並び、どちらの軸か視覚的に区別しにくい
- [ ] `src/data/registry.ts` の sublog/caflog に正確な `releaseDate` を入れる（現状 `year` のみ）

## アプリごと

- [ ] App Store 審査用に各プライバシー本文を実態に合わせて確認する

## 文書の追随

- [ ] **旧構成を参照している文書の更新** — Next.js 移行で実体が変わったが未更新のもの。`docs/README.md`、`docs/operations.md`、`docs/design/top.md`、`docs/design/app-page.md`、`docs/design/components.md`、`docs/apps/README.md`、`docs/apps/sublog.md`、`docs/apps/caflog.md`。`docs/decisions/` と `docs/superpowers/completed/` は履歴なので更新しない

## 運用

- [ ] Cloudflare Pages プロジェクト `applibrary` の扱いを決める（カスタムドメインは切り離し済み、`applibrary-ag2.pages.dev` は残存）
- [ ] specs / config / CI などの統治層を Web-Template から移植するか判断する

---

## 完了済み

- [x] 2026-08-31 Next.js 化と Vercel 移行完了: <https://app.yutodev.com/> が Vercel 配信で稼働
  - 経緯は `docs/decisions/2026-08-31-nextjs-vercel-migration.md`
  - GitHub Pages の公開を終了（多重公開の解消）
  - Cloudflare Pages からカスタムドメインを切り離し、DNS を Vercel へ（**DNS only**）
  - 旧静的サイト（`index.html` / `assets/` / `apps/` / `_headers` / `.nojekyll`）を撤去
  - プラットフォーム軸のフィルタを新設
- [x] 2026-05-20 Cloudflare Pages 公開完了（Vercel 移行により役割終了）
