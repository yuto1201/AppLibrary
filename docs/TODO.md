# TODO — AppLibrary

最終更新日: 2026-05-20

進行中の改善タスクと持ち越し事項。完了したものはチェックを入れる、もしくは「完了済み」に移動する。

> 注: このファイルは作業ログのため `ステータス:` 行を持たない(他の docs/ 配下と異なる例外)。

---

## 🟡 優先度: 中（仕上げ）

- [ ] **OGP 画像作成** — `assets/img/ogp.png`（1200×630）を作って `index.html` の `<meta property="og:image">` を有効化
- [ ] **GitHub Pages を停止** — Settings → Pages → Source を **None** に（Cloudflare Pages へ一本化、CF 側は 2026-05-20 公開済）

## アプリごと

- [ ] App Store 審査用に各 `privacy.html` の中身を実態に合わせて確認
- [ ] `apps/registry.js` の sublog/caflog に正確な `releaseDate` ('YYYY-MM-DD') を入れる（現状 `year: 2026` だけ）

---

## 完了済み

- [x] 2026-05-20 Cloudflare Pages 公開完了: <https://app.yutodev.com/> で本番稼働開始
  - Phase 3 (Pages デプロイ) / Phase 4 (カスタムドメイン接続) を 1 日で完了（予定 05-24 → 05-20 前倒し）
  - Pages サブドメインは `applibrary-ag2.pages.dev`（`applibrary` は他テナント占有）
  - 公開後の追加修正:
    - `_headers` の CSP に `https://static.cloudflareinsights.com` を許可（CF Web Analytics beacon ブロック解消）
    - `_headers` の Cache-Control を HTML/assets でパス別に分離（重複結合問題を解消）
    - `assets/img/favicon.svg` 配置 + 全 HTML に `<link rel="icon">` 追加（`/favicon.ico` 404 解消）
- [x] 2026-05-18 プレースホルダー実値化:
  - `site-data.js` `profile.bio` 確定 / `social[]` の X URL 設定 / Email 非公開
  - GitHub アカウント名を `yuto1201` に統一
- [x] 2026-05-18 caflog スクリーンショット 5 枚配置 + `<section id="screenshots">` 追加
- [x] 2026-05-18 Phase 1A 完了: site-data.js プレースホルダー実値化 / ルート README.md 拡充 / docs/deploy/cloudflare-publish-plan.md 作成
- [x] 2026-05-18 sublog / caflog: App Store 公開対応（status=release、appStoreUrl 設定、個別ページの「公開予定」UI を実リンクに置換、Smart App Banner 有効化）
- [x] 2026-05-09 ホーム Hero オープニング演出追加（初回訪問のみ文字分割リビール、reduced-motion フォールバック付き）
- [x] 2026-05-09 個別アプリページ デザイン方針確定（共通骨格＋個別色トークン）／sublog・caflog を新方式にリファクタ／apps/_template/ 整備／sublog に screenshots セクション追加
- [x] 2026-04-27 トップページを liquid-glass デザインに刷新（Claude Design 由来）
- [x] 2026-04-27 旧テンプレ由来の `src/` `docs/{infrastructure,spec,todo,ui}` を削除
- [x] 2026-04-27 ドキュメント刷新（`TODO.md` / `docs/design.md` / `docs/apps.md`）
- [x] 2026-04-27 `.gitignore` / `.nojekyll` 追加、`.DS_Store` を git index から除外
- [x] 2026-04-27 P1 改修一括: モバイルナビ（ハンバーガー）/ モーダル focus-trap / FOUC 対策 / プレースホルダー描画スキップ
- [x] 2026-04-27 P2 改修一括: featured 解除 / Tweaks dev フラグ化（`?dev=1`） / ヒーロー primary CTA / `prefers-reduced-motion` フォールバック
- [x] 2026-04-27 P3 改修一括: アプリカード直行リンク（hover 時表示）/ 検索 IME 対応（compositionstart/end）/ カテゴリ自動収集 / `:focus-visible` + ARIA 強化
