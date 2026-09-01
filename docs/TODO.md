# TODO — AppLibrary

最終更新日: 2026-09-01

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

- [x] **旧構成を参照している文書の更新** — 現行文書を Next.js 構成へ更新。古い `docs/operations.md` は deploy / workflow / verification に統合して削除。過去の ADR と完了済み計画は保存

## 運用

- [x] Cloudflare Pages プロジェクト `applibrary` を削除し、プロジェクト固有の Git 接続と `applibrary-ag2.pages.dev` の二重配信を終了
- [x] specs / config / CI・検証ツールを Web-Template から静的サイト用に移植（ローカル実装。公開有効化は別）
- [x] 移植 PR の所有者確認と main 反映、`Repository checks` / `Browser checks` の Ruleset 必須化
- [ ] `/apps/*` の 1 年 immutable キャッシュ方針を見直す（HTML と固定名画像も対象で、再デプロイだけではブラウザキャッシュは失効しない）

---

## 完了済み

- [x] 2026-08-31 Next.js 化と Vercel 移行完了: <https://app.yutodev.com/> が Vercel 配信で稼働
  - 経緯は `docs/decisions/2026-08-31-nextjs-vercel-migration.md`
  - GitHub Pages の公開を終了（多重公開の解消）
  - Cloudflare Pages からカスタムドメインを切り離し、DNS を Vercel へ（**DNS only**）
  - 旧静的サイト（`index.html` / `assets/` / `apps/` / `_headers` / `.nojekyll`）を撤去
  - プラットフォーム軸のフィルタを新設
- [x] 2026-05-20 Cloudflare Pages 公開完了（Vercel 移行により役割終了）
