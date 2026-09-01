# CafLog

ステータス: 公開中
最終更新日: 2026-09-01

機械情報は [registry.ts](../../src/data/registry.ts) が正本。

App Store の初回公開日は 2026-04-10。2026-09-01 に [Apple Lookup API](https://itunes.apple.com/lookup?id=6760961086&country=us) を照会し、配布中の version `1.0`、`releaseDate` の `2026-04-10T07:00:00Z`、`currentVersionReleaseDate` の `2026-04-11T06:17:31Z` を確認して registry へ記録した。同じ公開説明が示す 18 種類のプリセット、13 種類の分析、21 種類の称号を version 1.0 の表示内容の根拠とする。開発中のローカル作業ツリーは配布版の正本として扱わない。
2026-08-31 の現行構成ではスクリーンショット 5 枚を `public/apps/caflog/screenshots/` に配置済み。

2026-09-01 に現行実装（確認時の commit `97c4fd8f380df200b60073ac7cd3f41d0a4a05e4` と未コミット作業ツリー）、既存の公開プライバシーポリシー、公開 App Store の「データの収集なし」表示を照合した。このローカル commit は配布版の証明ではなく、本文の挙動確認点を固定するための記録である。端末内の App Group 保存、任意の private CloudKit 同期、HealthKit の明示許可による読み書き、StoreKit、ローカル通知、アプリ内のお問い合わせフォームを本文へ反映し、仮文言と架空の連絡先を除去した。「すべての情報を削除」の実装対象と、同操作では残るカスタムドリンク・メモ・設定も明記した。

- [公開ページ](https://app.yutodev.com/apps/caflog/)
- [プライバシー本文](../../src/data/privacy/caflog.ts)
- [個別ページ仕様](../design/app-page.md)

動機や個別の設計判断は未記録。推測で補完しない。
