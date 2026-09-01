# Dev-Tools の掲載根拠

ステータス: 確定
最終更新日: 2026-09-01

公開中の開発者向け Web ツール集を、AppLibrary で最初の `Web` アプリとして掲載する。

- ソース: <https://github.com/yuto1201/Dev-Tools> の commit `ae479a752e9038b1c3a60eca895582623cbaf4c6`
- 公開先: <https://yuto1201.github.io/Dev-Tools/>
- 初回公開日: repository の最初の commit と GitHub Pages 公開履歴に基づく 2026-03-30
- 掲載状態: ツール集の主なカードが beta v0.8 であるため、カタログ上も beta / 0.8 とする

公開トップで確認できる構成は、ER Diagram beta v0.8、App Store Preview beta v0.8、Design Pocket alpha v0.2、Text Counter release v1.0、Icon Gallery beta v0.8。Icon Gallery のリポジトリ内カタログは 321 件である。カタログ上の version は全ツール共通のリリース番号ではなく、ツール集の代表状態を示す。

プライバシー本文は `legal/privacy.html` と実装を照合した。未サインイン時は localStorage、対応ツールで任意に Google OAuth を使った場合は Drive `appDataFolder` を一次保存先、localStorage をキャッシュとして使う。要求スコープは `drive.appdata` と `userinfo.email`。アクセストークン、期限、表示用メールアドレスは localStorage に一時保存する。運営者のアプリケーションサーバー、解析、広告はなく、配信は GitHub Pages。Text Counter の入力は同期対象ではない。

画像の出所:

- `public/apps/dev-tools/icon.png`: ER 図、スクリーンショット、文字、アイコンの4タイルを組み合わせた AppLibrary 掲載用の自作画像
- `public/apps/dev-tools/screenshots/1.png`: 公開トップページを 2026-09-01 に撮影
- `public/apps/dev-tools/screenshots/2.png`: 公開 ER Diagram を 2026-09-01 に撮影
- `public/apps/dev-tools/screenshots/3.png`: 公開 Icon Gallery を 2026-09-01 に撮影

機械情報の正本は [registry.ts](../../src/data/registry.ts)、公開する法務本文は [dev-tools.ts](../../src/data/privacy/dev-tools.ts)。
