# プロダクト仕様

AppLibrary は個人開発したアプリの紹介サイト。訪問者が一覧を検索・絞り込み、各アプリの特徴、スクリーンショット、配布先、プライバシーポリシーを確認できる。

- 掲載対象は iOS / iPadOS / macOS / watchOS / visionOS / Web / CLI。
- アプリ情報は `src/data/registry.ts`、本文は `src/data/privacy/`、画像は `public/apps/` に保持する。
- 表示設定は端末の localStorage に保存し、アカウントを作らない。
- Next.js App Router の静的出力を Vercel からドメインルートへ配信する。Cloudflare は DNS only。
- 既存の Liquid Glass テーマ、公開 URL、掲載内容をこの移植では変更しない。

DB、認証、API サーバー、Supabase、Cursor Cloud の起動、テンプレート生成、プロバイダー操作の自動化は本移植の対象外。将来必要になった時は別 Issue として設計する。

サイト共通の利用規約は `/terms/`、ウェブサイトのプライバシーポリシーは `/privacy/` で静的公開する。アプリ別のプライバシー本文はテンプレートの未確認文言を公開せず、現行実装・既存公開文書・公開 App Store のプライバシー表示と照合する。
