# Cloudflare Pages 公開プラン

**ステータス**: 確定（2026-05-18 ユーザー承認済み）
**最終更新日**: 2026-05-18
**目的**: AppLibrary を Cloudflare Pages へ公開し、取得済み独自ドメインで配信するまでの全フェーズを定義する。
**期限**: 2026-05-24（日）

---

## 背景・現状評価

AppLibrary は Xcode 製アプリ（sublog / caflog）紹介サイトとして、liquid-glass デザインを採用した本格サイト。実装度は **約 92%**：

| 領域 | 状態 |
|---|---|
| HTML / CSS / JS | ✅ 完成（index.html 734行、tokens/standard/app-page CSS、main.js データ駆動） |
| liquid-glass デザイン | ✅ 完全実装（blur 22px、glass tint、glass border、glow、inset highlight） |
| レスポンシブ | ✅ 768px / 480px ブレークポイント、モバイルナビ実装済み |
| ダーク/ライトテーマ | ✅ `[data-theme="light"]` で完全切替 |
| アプリページ | sublog ✅ 完全 / caflog ⚠️ スクショ未配置 |
| OGP | ⚠️ メタタグ準備済み、画像（`ogp.png`）未作成 |
| ホスティング | 現状 GitHub Pages、Cloudflare Pages へ移行予定 |
| 公開先設定（`_headers`, `docs/deploy/`） | ❌ 未整備 |

### 公開前ブロッカー

1. `assets/js/site-data.js` のプレースホルダー（`profile.bio` / SNS の `X` URL / `Email`）
2. `assets/img/ogp.png`（1200×630px）の作成・配置
3. `apps/caflog/screenshots/1〜4.png` の撮影・配置 + caflog ページに `<section id="screenshots">` 追加
4. ルート `README.md`（現状 1 行スタブ）の拡充
5. Cloudflare 用 `_headers` ファイル・デプロイドキュメントの整備

---

## 前提条件（2026-05-18 確認済み）

| 項目 | 内容 |
|---|---|
| ドメイン | **Cloudflare で取得 & DNS 管理済み**（ネームサーバー切替不要） |
| Cloudflare アカウント | セットアップ済み |
| GitHub repo | `https://github.com/yuto1201/AppLibrary` |
| ホスティング方針 | **Cloudflare Pages 一本化**（GitHub Pages は無効化） |
| コンテンツ補完 | 公開前にすべて仕上げる |

---

## フェーズ構成（7 日間スケジュール）

```
05-18 (月) Phase 0  現状評価・本プラン承認         ✅ 完了
05-19 (火) Phase 1A コンテンツ実値補完             2〜3 時間
05-20 (水) Phase 1B OGP 画像 + caflog スクショ     2〜3 時間
05-21 (木) Phase 2  Cloudflare 用設定・ドキュメント 1〜2 時間
05-22 (金) Phase 3  Cloudflare Pages デプロイ      1 時間
05-23 (土) Phase 4  カスタムドメイン接続・DNS      30 分
05-24 (日) Phase 5  切替確認・GH Pages 無効化      1 時間
```

合計実働 **8〜11 時間**。週内 1〜2 日をバッファとして確保。

---

## Phase 1A — コンテンツ実値補完

**ねらい**: TODO.md「優先度: 高」のプレースホルダー差し替えを完了する。

### 必要なユーザー入力
- `profile.bio`（自己紹介 1〜2 文）
- X (Twitter) の URL
- 公開連絡先メールアドレス（公開可否含む）

### 作業
1. `assets/js/site-data.js` を編集
   - `profile.bio` を実文に
   - `social[]` の `X` を実 URL に（現状 `#`）
   - `social[]` の `Email` をコメントアウト解除し実アドレスに
2. ルート `README.md` を `_template/README.md` を参考に拡充
   - プロジェクト概要 / 公開先 URL / ローカル起動方法 / ドキュメント索引
3. `docs/TODO.md` の優先度高 3 項目をチェック済みに

### 完了基準
- `open AppLibrary/index.html` でプロフィール欄に bio が表示される
- フッターまたはヘッダーから X / Email アイコンが押下できる

---

## Phase 1B — OGP 画像 + caflog スクショ

**ねらい**: ソーシャルプレビューと caflog ページの完成度を引き上げる。

### 作業
1. **OGP 画像作成** `assets/img/ogp.png` (1200×630px)
   - Claude が liquid-glass 風 SVG を生成 → Preview.app などで PNG 書き出し
   - もしくは index.html の hero を実機スクショして縮尺調整
2. `index.html` の `<meta property="og:image">` コメントアウト解除
3. **caflog スクショ撮影**（ユーザー作業）
   - iPhone シミュレーター or 実機で 4 枚
   - `apps/caflog/screenshots/1.png 〜 4.png` に配置
4. `apps/caflog/index.html` に `<section id="screenshots">` を追加
   - 流用元: `apps/sublog/index.html` の同セクション構造

### 完了基準
- caflog ページにスクショ 4 枚が表示される
- ローカルで OGP メタタグが反映（実プレビュー検証は Phase 3 で）

---

## Phase 2 — Cloudflare 用設定・デプロイドキュメント整備

**ねらい**: Cloudflare Pages の挙動を最適化する設定と、運用ドキュメントを揃える。

### 作業
1. **`_headers` 作成**（リポジトリルート）
   - `assets/**` : `Cache-Control: public, max-age=31536000, immutable`
   - HTML : `Cache-Control: public, max-age=0, must-revalidate`
   - セキュリティ: `X-Content-Type-Options: nosniff` / `Referrer-Policy: strict-origin-when-cross-origin` / `Permissions-Policy`
   - CSP: `default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src https://fonts.gstatic.com`
2. **`_redirects` 作成**（必要に応じて）
3. **`docs/deploy/` 配下を追加整備**:
   - `README.md` — デプロイ全体の目次
   - `cloudflare-pages.md` — プロジェクト作成 / GitHub 連携 / ビルド設定（None）/ プレビュー URL 確認
   - `custom-domain.md` — Cloudflare DNS で CNAME / SSL Full(strict) / WWW リダイレクト
   - `cloudflare-publish-plan.md` — **本ファイル**
4. `CLAUDE.md`「デプロイ」セクション（255-267 行）を Cloudflare 前提に書き換え、GitHub Pages は「過去の運用」として移動

### 完了基準
- `docs/deploy/` 配下に 4 ドキュメント揃う
- `_headers` のフォーマットが [Cloudflare Pages 公式仕様](https://developers.cloudflare.com/pages/configuration/headers/) 準拠

---

## Phase 3 — Cloudflare Pages デプロイ

**ねらい**: GitHub repo を Cloudflare Pages に接続し、プレビュー URL で動作確認する。

### 作業（ユーザー手動 + Claude サポート）
1. Cloudflare Dashboard → Pages → **Create a project** → GitHub 連携で `yuto1201/AppLibrary` を選択
2. ビルド設定:
   - Framework preset: **None**
   - Build command: **（空）**
   - Build output directory: **`/`**
   - Root directory: **`/`**
3. デプロイ完了後、`<project>.pages.dev` のプレビュー URL で全機能確認
   - liquid-glass / hero opening / モバイルナビ / アプリページ遷移 / モーダル
   - DevTools Network タブで `_headers` のキャッシュヘッダ反映確認
4. Phase 1A/1B/2 の変更を整理コミットして push（自動デプロイトリガー）

### 完了基準
- `<project>.pages.dev` で全機能が動作
- Lighthouse Mobile スコア Performance / Accessibility / Best Practices / SEO ≥ 90

---

## Phase 4 — カスタムドメイン接続・DNS

**ねらい**: 取得済みドメインを Cloudflare Pages プロジェクトに紐づけ、HTTPS で配信する。

### 作業
1. Cloudflare Pages → プロジェクト → **Custom domains** → **Set up a custom domain**
2. ドメインを入力 → 同一アカウント・DNS 管理下なので CNAME レコードがワンクリックで自動作成される
3. SSL/TLS → **Full (strict)** 確認
4. WWW サブドメインを使う場合は別途 `www.<domain>` も追加し apex へ 301 リダイレクト
5. 本番ドメインで動作確認

### 完了基準
- 本番ドメインで HTTPS 接続成功（証明書 valid）
- `curl -I https://<domain>` で Cloudflare の `cf-ray` ヘッダ確認

---

## Phase 5 — 切替確認・GitHub Pages 無効化

**ねらい**: GH Pages を停止し、Cloudflare 一本化を完了する。

### 作業
1. GitHub repo → Settings → Pages → Source を **None** に
2. `CLAUDE.md` / `README.md` の公開先 URL を最終確定値に更新
3. `docs/TODO.md` に「2026-05-24 Cloudflare Pages 公開完了」を「完了済み」に追記

### 公開検証チェックリスト
- [ ] HTTPS で本番ドメイン表示
- [ ] OGP プレビュー（Twitter Card Validator / opengraph.xyz）
- [ ] モバイル実機（iOS Safari）で動作
- [ ] sublog / caflog ページ遷移
- [ ] テーマトグル動作
- [ ] Lighthouse モバイル ≥ 90
- [ ] favicon 表示

### 完了基準
全チェック ✅、`docs/TODO.md` 更新済み、Phase 5 完了コミット push 済み。

---

## 編集対象ファイル一覧

### 既存（編集）
- `index.html`（734行 / OGP 有効化）
- `README.md`（1 行 / 拡充）
- `CLAUDE.md`（305 行 / デプロイ章書換）
- `assets/js/site-data.js`（133 行 / 実値補完）
- `apps/caflog/index.html`（スクショ section 追加）
- `docs/TODO.md`（高優先度タスクのチェック更新）

### 新規作成
- `_headers`
- `_redirects`（任意）
- `assets/img/ogp.png`
- `apps/caflog/screenshots/1.png 〜 4.png`
- `docs/deploy/README.md`
- `docs/deploy/cloudflare-pages.md`
- `docs/deploy/custom-domain.md`
- `docs/deploy/cloudflare-publish-plan.md`（**本ファイル**）

### 参考（流用元）
- `~/Documents/Web/_template/README.md` — README 拡充の参考
- `~/Documents/Web/_template/CLAUDE.md` — 標準セクション構成
- `apps/sublog/index.html` — スクショ section の流用元

---

## 検証コマンド

### ローカル動作
```bash
cd ~/Documents/Web/AppLibrary
open index.html               # トップ
open apps/sublog/index.html   # sublog
open apps/caflog/index.html   # caflog（スクショ確認）
```

### Cloudflare Pages プレビュー
```bash
curl -I https://<project>.pages.dev
# 確認項目: Cache-Control / cf-ray / Content-Security-Policy
```

### 本番ドメイン
```bash
curl -I https://<custom-domain>
```
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- OpenGraph プレビュー: https://www.opengraph.xyz/
- Lighthouse: Chrome DevTools → Lighthouse → Mobile

### Git
```bash
git -C ~/Documents/Web/AppLibrary status
git -C ~/Documents/Web/AppLibrary log --oneline -5
```
コミット分割推奨例:
- `chore: fill content placeholders (bio, social, OGP)`
- `feat: add caflog screenshots and section`
- `feat: cloudflare pages config (_headers, _redirects)`
- `docs: cloudflare deploy guides`

---

## リスク・注意

1. **未コミット 11 ファイル**: 既に modified なファイルがあるため、Phase 1 着手前に内容を確認し、関係ない変更は別コミットへ。
2. **CSP `'unsafe-inline'`**: 既存 HTML 内の inline `<script>` / `<style>` に依存。後日 nonce/hash 化を別タスクで。
3. **GH Pages CNAME ファイル**: 既存 repo に `CNAME` ファイルなし。新規追加不要。
4. **OGP 画像の生成**: Claude 単体では PNG 直接生成不可。SVG → 手動 PNG 変換が必要（Preview.app の書き出しで十分）。
5. **`docs/superpowers/`**: 別系統のドキュメント。今回は触らない。

---

## 関連リソース

- マスタープラン（Claude 実行用）: `~/.claude/plans/cloudflare-markdown-docs-stateful-quail.md`
- 横断運用ガイド: `~/Documents/Web/CLAUDE.md`
- テンプレ: `~/Documents/Web/_template/`
- Cloudflare Pages 公式: https://developers.cloudflare.com/pages/
- Cloudflare `_headers` 仕様: https://developers.cloudflare.com/pages/configuration/headers/
