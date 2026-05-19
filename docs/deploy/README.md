ステータス：確定
最終更新日：2026-05-20

---

# デプロイ

AppLibrary の公開設定とリリース手順をまとめたディレクトリ。

## ドキュメント一覧

| ファイル | 用途 |
|---|---|
| [cloudflare-publish-plan.md](cloudflare-publish-plan.md) | 公開までの全体プラン (Phase 0〜5)、スケジュール、検証手順 |
| [cloudflare-pages.md](cloudflare-pages.md) | Cloudflare Pages プロジェクト作成・GitHub 連携・ビルド設定 |
| [custom-domain.md](custom-domain.md) | カスタムドメイン接続・DNS・SSL・WWW リダイレクト |

## 公開先

| 種別 | URL | 状態 |
|---|---|---|
| 本番（カスタムドメイン） | <https://app.yutodev.com/> | 運用中（2026-05-20 公開） |
| Pages サブドメイン | <https://applibrary-ag2.pages.dev/> | 運用中（内部・プレビュー用） |
| プレビュー（PR ごと自動） | `https://<hash>.applibrary-ag2.pages.dev` | 有効 |
| 旧（GitHub Pages） | <https://yuto1201.github.io/AppLibrary/> | 停止予定（Source: None 切替待ち） |

> 補足: `applibrary.pages.dev` は他テナント占有のため、プロジェクトサブドメインは `applibrary-ag2` になっている。実利用は本番カスタムドメイン側で完結する想定。

## デプロイ関連の設定ファイル

| ファイル | 役割 |
|---|---|
| [`../../_headers`](../../_headers) | キャッシュ + CSP + セキュリティヘッダ（Cloudflare Pages 標準形式） |
| [`../../.nojekyll`](../../.nojekyll) | GitHub Pages の Jekyll 無効化（移行後も無害なので残置） |
| [`../../404.html`](../../404.html) | カスタム 404 ページ |

## 進捗

進行中の Phase は [cloudflare-publish-plan.md](cloudflare-publish-plan.md) のスケジュール表を参照。タスク粒度の進捗は [../TODO.md](../TODO.md) に記録。
