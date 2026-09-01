ステータス：確定
最終更新日：2026-09-01

---

# デプロイ

## 公開先

| 種別 | URL | 状態 |
|---|---|---|
| 本番 | <https://app.yutodev.com/> | 稼働中 |
| Vercel 既定 | <https://applibrary-yuto16.vercel.app/> | 稼働中（同一デプロイ） |

## 仕組み

`main` へ push すると Vercel が自動でビルドしデプロイする。手動操作は不要。

- Vercel プロジェクト: `applibrary`（team `yuto16`）
- フレームワーク検出: Next.js
- 出力: `output: "export"` による静的ファイル（`out/`）

PR を作るとプレビューデプロイが自動生成される。

## Node/npm の互換範囲

ローカル/CI は `.node-version` と `packageManager` で完全固定する。Vercel の install/build は `engines` の Node 24.x / npm 11.x を許容する。Vercel は minor/patch を自動更新し、major のみ選択可能なため、完全一致の engines と engine-strict を組み合わせない。[Vercel の仕様](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)

クラウドは `npm run build` を実行する。完全固定環境での `npm run verify` は GitHub CI が担当する。

## DNS

Cloudflare がゾーン `yutodev.com` を管理している。

| 名前 | タイプ | 値 | プロキシ |
|---|---|---|---|
| `app` | CNAME | `392c47f2b226d996.vercel-dns-017.com` | **DNS only** |

**プロキシ（オレンジ雲）を有効にしないこと。** Vercel が `disableProxy: true` を要求しており、有効にすると証明書と経路で問題が出る。同ゾーンの `web-template` も同じ設定。

証明書は Vercel が Let's Encrypt で自動発行・更新する。

## ヘッダ

`vercel.json` がセキュリティヘッダとキャッシュ制御を持つ。

- 全パス: CSP、`X-Frame-Options: DENY`、`X-Content-Type-Options`、`Referrer-Policy`、`Permissions-Policy`
- `/_next/static/*`: 1 年 immutable（ファイル名にハッシュを含むため）
- `/apps/*`: 現在は 1 年 immutable。HTML と固定名画像も対象で、再デプロイだけではブラウザに保存済みの応答は失効しない。変更する場合は別 Issue で短縮または画像のバージョン付けを検討する

CSP を緩める変更は理由を PR に書く。

PR の `Repository checks` / `Browser checks` と独立レビューの実際の出力を確認してから、承認された対象をマージする。両 check は active な GitHub Ruleset で必須化されており、正規化した設定は `config/github-ruleset.json` に保存する。この export は取得時点の記録であり、実効状態は GitHub API で別途確認する。[../workflow.md](../workflow.md) を参照。

## 移行の履歴

2026-08-31 に Cloudflare Pages から Vercel へ移行した。GitHub Pages の公開も同時に終了している。経緯は [decisions/2026-08-31-nextjs-vercel-migration.md](../decisions/2026-08-31-nextjs-vercel-migration.md) を参照。

2026-09-01 に旧 Cloudflare Pages プロジェクト `applibrary` を削除した。プロジェクト一覧は空で、同名プロジェクトの取得は not found、`applibrary-ag2.pages.dev` は名前解決しないことを確認した。削除後はプロジェクト固有の Git 設定も参照できない。Cloudflare は `yutodev.com` の DNS 管理だけを継続し、`app` の Vercel CNAME と DNS only 設定は変更していない。Cloudflare のアカウント単位の GitHub App installation は別の権限設定であり、このプロジェクト削除の完了証拠には含めない。
