ステータス：確定
最終更新日：2026-05-20

---

# Cloudflare Pages デプロイ手順

GitHub repo `yuto1201/AppLibrary` を Cloudflare Pages に接続し、`main` への push で自動デプロイされる状態を作るまでの手順。

## 前提
- Cloudflare アカウントにログイン済み
- GitHub `yuto1201/AppLibrary` リポジトリへの管理権限あり
- ブランチ `main` を本番として配信する

---

## 1. プロジェクト作成

1. Cloudflare Dashboard → **Workers & Pages** → **Create application** → **Pages** タブ
2. **Connect to Git** をクリック
3. GitHub を認証（初回のみ） → リポジトリ `yuto1201/AppLibrary` を選択
4. **Begin setup** をクリック

## 2. ビルド設定

| 項目 | 値 |
|---|---|
| Project name | `applibrary` |
| Pages サブドメイン | `applibrary-ag2.pages.dev`（`applibrary` は他テナント占有のため `-ag2` サフィックスが自動付与された） |
| Production branch | `main` |
| Framework preset | **None** |
| Build command | **（空欄）** ※ ビルドツール不使用 |
| Build output directory | `/` |
| Root directory | `/` |
| Environment variables | なし |

**Save and Deploy** をクリック → 初回デプロイが走る。

## 3. 初回デプロイの動作確認

数十秒でデプロイ完了。`https://applibrary-ag2.pages.dev` を開き以下を確認:

- liquid-glass デザイン / hero opening が再生される
- アプリカードからの sublog / caflog ページ遷移
- 各個別ページに screenshots セクションが表示される
- DevTools → Console にエラーなし
- モバイル幅 (〜479px) でナビゲーション・レイアウト崩れなし

### `_headers` の反映確認

```bash
curl -I https://applibrary-ag2.pages.dev
```

期待されるヘッダー:
- `cache-control: public, max-age=0, must-revalidate`（HTML）
- `content-security-policy: default-src 'self'; ...`
- `x-content-type-options: nosniff`
- `x-frame-options: DENY`
- `referrer-policy: strict-origin-when-cross-origin`

アセットも確認:

```bash
curl -I https://applibrary-ag2.pages.dev/assets/css/standard.css
# → cache-control: public, max-age=31536000, immutable
```

## 4. プレビューデプロイ（自動）

PR を作成すると、Cloudflare Pages が自動で **プレビュー URL** を生成し PR コメントに投稿する:

- 形式: `https://<commit-hash>.applibrary-ag2.pages.dev`
- マージ前の動作確認に使う
- PR がマージ・クローズされても URL は当面残る

## 5. ロールバック手順

問題のあるデプロイをマージしてしまった場合:

1. Dashboard → Pages → applibrary → **Deployments**
2. 前回の安定版を探す → **...** → **Rollback to this deployment**
3. 数秒で適用

ただし基本は **新しいコミットで前進的に修正** する方が履歴として綺麗。

---

## カスタムドメイン

ドメイン接続は [custom-domain.md](custom-domain.md) を参照。

---

## トラブルシューティング

| 症状 | 対処 |
|---|---|
| `_headers` の CSP で外部リソースがブロックされる | DevTools Console の `Content-Security-Policy` エラーを確認 → `_headers` の対応する `*-src` ディレクティブにホストを追加 |
| キャッシュが効きすぎて更新が反映されない | Dashboard → Caching → **Purge cache**。または assets ファイル名を変更 |
| デプロイが失敗する | デプロイログを確認。`_headers` / `_redirects` の構文エラーが典型 |
| プレビュー URL が PR に貼られない | リポジトリの GitHub App 連携が切れている可能性。Settings → Integrations → Cloudflare Pages を再認証 |
