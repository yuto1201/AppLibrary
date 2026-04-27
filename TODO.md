# TODO — AppLibrary

ステータス: 作成中
最終更新日: 2026-04-27

進行中の改善タスクと持ち越し事項。完了したものはチェックを入れる、もしくは「完了済み」に移動する。

---

## 🔴 優先度: 高（公開前ブロッカー）

- [ ] **モバイルナビ実装** — `@media (max-width: 600px)` で `.nav-links` を `display: none` にしたまま。ハンバーガーメニュー or ドロップダウンを追加して導線を維持する
- [ ] **モーダルのフォーカストラップ** — Tab で背後にフォーカスが抜ける。focus-trap の実装と、開いた瞬間 modal 内へ初期フォーカスを移す
- [ ] **FOUC（テーマ切替時のチラつき）対策** — `<head>` 内インラインスクリプトで localStorage を読み `data-theme` を first paint 前に当てる
- [ ] **プレースホルダー差し替え（公開前 必須）**
  - [ ] `assets/js/site-data.js` の `profile.bio` を実情に
  - [ ] `social[]` の X / GitHub URL を実 URL に
  - [ ] `social[]` の Email を実アドレスに

## 🟡 優先度: 中

- [ ] **featured 設定の見直し** — sublog / caflog 両方 `featured: true` で大小の対比が無い。アプリが増えるまで片方は通常サイズに落とすか、`featured` 自体を一旦使わない
- [ ] **Tweaks パネルの位置づけ整理** — 一般訪問者には複雑。テーマ切替だけ nav に残し、レイアウト/密度/フォント切替は dev フラグ or 削除を検討
- [ ] **ヒーロー直下の primary CTA** — 「アプリを見る ↓」ボタン追加。マーケ目的（ダウンロード促進）を強化
- [ ] **重い視覚効果のフォールバック** — `prefers-reduced-motion` で `.glass::before` の filter / blur を弱める。古めの iPhone でカクつき対策

## 🟢 優先度: 低（仕上げ）

- [ ] **OGP 画像作成** — `assets/img/ogp.png`（1200×630）を作って `index.html` の `<meta property="og:image">` を有効化
- [ ] **アプリカード→個別ページの直行リンク** — hover 時に「サイトへ →」のサブリンクを出して回遊増
- [ ] **IME 入力対応** — 検索 input で `compositionstart` / `compositionend` を扱い、変換中の re-render を抑制
- [ ] **categories 自動収集** — `site-data.js` の `categories` を `registry.js` から派生させて、手動同期を不要にする
- [ ] **アクセシビリティ改善** — `aria-live`、キーボードナビ、empty 状態のアナウンス

## アプリごと

- [ ] sublog: 個別ページデザイン方針確定（liquid-glass 共通化 vs 独自）
- [ ] caflog: 同上
- [ ] sublog / caflog: App Store 公開後 `appStoreUrl` を `apps/registry.js` に追加（バッジボタンが自動有効化される）
- [ ] App Store 審査用に各 `privacy.html` の中身を実態に合わせて確認

## 運用

- [ ] `.gitignore` に `.DS_Store` が入っているか確認、入っていなければ追加
- [ ] GitHub Pages 設定確認（Settings → Pages → main / root）

---

## 完了済み

- [x] 2026-04-27 トップページを liquid-glass デザインに刷新（Claude Design 由来）
- [x] 2026-04-27 旧テンプレ由来の `src/` `docs/{infrastructure,spec,todo,ui}` を削除
- [x] 2026-04-27 ドキュメント刷新（`TODO.md` / `docs/design.md` / `docs/apps.md`）
