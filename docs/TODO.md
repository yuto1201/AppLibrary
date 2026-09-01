# TODO — AppLibrary

最終更新日: 2026-09-01

進行中の改善タスクと持ち越し事項。完了したものはチェックを入れる、もしくは「完了済み」に移動する。

> 注: このファイルは作業ログのため `ステータス:` 行を持たない(他の docs/ 配下と異なる例外)。

---

## 🔴 優先度: 高（本来の課題）

- [ ] **掲載アプリを増やす** — 現在 2 本。`~/Documents/Xcode` にある SimplePomo / GoshuinPocket / Elsefolk / Flower / PayCycle / ManholeMap などを `src/data/registry.ts` へ追加する
- [ ] **スコープ拡張の反映** — iOS 以外のアプリを掲載し、`platforms` フィルタを実際に機能させる

## 🟡 優先度: 中（仕上げ）

- [x] **OGP 画像作成** — `public/ogp.png`（1200×630）を作り、Open Graph / Twitter metadata へ設定
- [x] **サイト全体の `/terms` と `/privacy`** — 静的サイトの実際のデータ処理と利用条件を記載し、トップページからリンク
- [x] **機能カードの移植** — registry をアイコン・見出し・説明の構造へ拡張し、個別ページへ表示
- [x] **フィルタ UI の整理** — プラットフォーム軸とカテゴリ軸に可視ラベルを追加
- [x] `src/data/registry.ts` の sublog/caflog に Apple 公式 Lookup API の初回公開日を反映

## アプリごと

- [x] App Store 審査用の SubLog / CafLog プライバシー本文を、現行実装・既存公開文書・公開 App Store のプライバシー表示と照合し、仮文言と架空の連絡先を除去する

## 文書の追随

- [x] **旧構成を参照している文書の更新** — 現行文書を Next.js 構成へ更新。古い `docs/operations.md` は deploy / workflow / verification に統合して削除。過去の ADR と完了済み計画は保存

## 運用

- [x] Cloudflare Pages プロジェクト `applibrary` を削除し、プロジェクト固有の Git 接続と `applibrary-ag2.pages.dev` の二重配信を終了
- [x] specs / config / CI・検証ツールを Web-Template から静的サイト用に移植（ローカル実装。公開有効化は別）
- [x] 移植 PR の所有者確認と main 反映、`Repository checks` / `Browser checks` の Ruleset 必須化（2026-09-01 に API で実効設定を確認）
- [x] `/apps/*` を再検証可能なキャッシュへ変更し、1 年 immutable は内容ハッシュ付き `/_next/static/*` のみに限定

---

## 完了済み

- [x] 2026-08-31 Next.js 化と Vercel 移行完了: <https://app.yutodev.com/> が Vercel 配信で稼働
  - 経緯は `docs/decisions/2026-08-31-nextjs-vercel-migration.md`
  - GitHub Pages の公開を終了（多重公開の解消）
  - Cloudflare Pages からカスタムドメインを切り離し、DNS を Vercel へ（**DNS only**）
  - 旧静的サイト（`index.html` / `assets/` / `apps/` / `_headers` / `.nojekyll`）を撤去
  - プラットフォーム軸のフィルタを新設
- [x] 2026-05-20 Cloudflare Pages 公開完了（Vercel 移行により役割終了）
