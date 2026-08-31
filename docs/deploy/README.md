ステータス：確定
最終更新日：2026-08-31

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
- `/apps/*`: 1 年 immutable（画像差し替え時は再デプロイで反映）

CSP を緩める変更は理由を PR に書く。

## 移行の履歴

2026-08-31 に Cloudflare Pages から Vercel へ移行した。GitHub Pages の公開も同時に終了している。経緯は [decisions/2026-08-31-nextjs-vercel-migration.md](../decisions/2026-08-31-nextjs-vercel-migration.md) を参照。

Cloudflare Pages プロジェクト `applibrary` は残っているが、カスタムドメインは切り離し済みで本番配信には使っていない。
