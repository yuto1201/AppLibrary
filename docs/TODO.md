# TODO — AppLibrary

最終更新日: 2026-05-16

進行中の改善タスクと持ち越し事項。完了したものはチェックを入れる、もしくは「完了済み」に移動する。

> 注: このファイルは作業ログのため `ステータス:` 行を持たない(他の docs/ 配下と異なる例外)。

---

## 🔴 優先度: 高（公開前ブロッカー）

- [ ] **プレースホルダー実値の差し替え（ユーザー入力待ち）**
  - [ ] `assets/js/site-data.js` の `profile.bio` を実情の文に
  - [ ] `social[]` の X URL（現在 `#`、未表示）を実 URL に
  - [ ] `social[]` の Email（現在コメントアウト）を実アドレスに復帰

## 🟡 優先度: 中（仕上げ）

- [ ] **OGP 画像作成** — `assets/img/ogp.png`（1200×630）を作って `index.html` の `<meta property="og:image">` を有効化
- [ ] **caflog スクリーンショット撮影と配置** — `apps/caflog/screenshots/1.png`〜 を撮影して配置、`apps/caflog/index.html` に `<section id="screenshots">` を追加

## アプリごと

- [ ] sublog / caflog: App Store 公開後 `appStoreUrl` を `apps/registry.js` に追加（バッジボタンが自動有効化される）
- [ ] App Store 審査用に各 `privacy.html` の中身を実態に合わせて確認

## 運用

- [ ] GitHub Pages 設定確認（Settings → Pages → main / root）

---

## 完了済み

- [x] 2026-05-09 ホーム Hero オープニング演出追加（初回訪問のみ文字分割リビール、reduced-motion フォールバック付き）
- [x] 2026-05-09 個別アプリページ デザイン方針確定（共通骨格＋個別色トークン）／sublog・caflog を新方式にリファクタ／apps/_template/ 整備／sublog に screenshots セクション追加
- [x] 2026-04-27 トップページを liquid-glass デザインに刷新（Claude Design 由来）
- [x] 2026-04-27 旧テンプレ由来の `src/` `docs/{infrastructure,spec,todo,ui}` を削除
- [x] 2026-04-27 ドキュメント刷新（`TODO.md` / `docs/design.md` / `docs/apps.md`）
- [x] 2026-04-27 `.gitignore` / `.nojekyll` 追加、`.DS_Store` を git index から除外
- [x] 2026-04-27 P1 改修一括: モバイルナビ（ハンバーガー）/ モーダル focus-trap / FOUC 対策 / プレースホルダー描画スキップ
- [x] 2026-04-27 P2 改修一括: featured 解除 / Tweaks dev フラグ化（`?dev=1`） / ヒーロー primary CTA / `prefers-reduced-motion` フォールバック
- [x] 2026-04-27 P3 改修一括: アプリカード直行リンク（hover 時表示）/ 検索 IME 対応（compositionstart/end）/ カテゴリ自動収集 / `:focus-visible` + ARIA 強化
