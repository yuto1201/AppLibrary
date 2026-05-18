# TODO — AppLibrary

最終更新日: 2026-05-18

進行中の改善タスクと持ち越し事項。完了したものはチェックを入れる、もしくは「完了済み」に移動する。

> 注: このファイルは作業ログのため `ステータス:` 行を持たない(他の docs/ 配下と異なる例外)。

---

## 🔴 優先度: 高（公開前ブロッカー）

- [x] **プレースホルダー実値の差し替え** — 2026-05-18 完了
  - [x] `assets/js/site-data.js` の `profile.bio` は現状文を確定として維持
  - [x] `social[]` の X を `https://x.com/Yuto_Program`（handle `@Yuto_Program`）に
  - [x] `social[]` の Email は **非公開方針**でエントリ削除
  - [x] GitHub アカウント名を `yuto1201` に統一（旧 `uesugiyuuto` から修正）

## 🟡 優先度: 中（仕上げ）

- [ ] **OGP 画像作成** — `assets/img/ogp.png`（1200×630）を作って `index.html` の `<meta property="og:image">` を有効化
- [ ] **caflog スクリーンショット撮影と配置** — `apps/caflog/screenshots/1.png`〜 を撮影して配置、`apps/caflog/index.html` に `<section id="screenshots">` を追加

## アプリごと

- [ ] App Store 審査用に各 `privacy.html` の中身を実態に合わせて確認
- [ ] `apps/registry.js` の sublog/caflog に正確な `releaseDate` ('YYYY-MM-DD') を入れる（現状 `year: 2026` だけ）

## 運用

- [ ] GitHub Pages 設定確認（Settings → Pages → main / root）

---

## 完了済み

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
