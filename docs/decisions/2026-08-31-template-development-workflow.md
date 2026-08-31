# Web-Template の開発機構を静的サイト用に移植する

ステータス: 確定
最終更新日: 2026-08-31

ユーザーから Web-Template の開発機構の取り込みと不要物整理が依頼された。

参照元は `yuto1201/Web-Template` の commit `997b15c4662b544888206660463b22b32765fd51`。ローカル参照リポジトリに Git pack の破損があったため、変更せず GitHub の fresh clone から読んだ。

採用するのは仕様優先、Issue / branch / PR、固定 runtime、policy / link / acceptance / generated 検証、Next 型生成、ローカルと CI の共通コマンド、desktop/mobile E2E、共通レビュー契約、対象 Head を明記した所有者によるレビュー結果確認。リンク検証と型生成は元ツールを再利用し、他は静的サイト用に縮小した実装とする。

移植しないのは自動レビューゲート、Supabase / Auth / RLS、プロバイダー操作の権限アダプター、外部 account registry、Cursor Cloud activation、新規アプリ生成と clean-room template 検証。対象機能を持たない AppLibrary へ追加すると未使用の設定とサービス依存が増える。既存の外部操作の承認境界は維持する。

静的 export、既存テーマ、アプリ情報・画像・法務本文・URL は維持する。旧 GitHub Pages basePath、`next start`、実行時 `npx serve`、存在しない assets/apps の lint 除外、不要な空の計画フォルダを整理する。現行文書を Next.js 構成へ更新する。過去の ADR と完了済み仕様・計画は履歴として保持する。

CI 定義の導入と GitHub の必須チェック有効化は別である。元の自動レビューゲートは外部操作アダプターと結合しており、縮小版の自作は同等の保証にならない。独立レビューの指摘を採用し、機械的 CI と所有者のレビュー確認を分ける。マージ・デプロイ・DNS・Pages プロジェクト削除はこのローカル移植では実施しない。
