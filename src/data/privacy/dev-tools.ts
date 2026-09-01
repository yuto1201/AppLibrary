/** Dev-Tools の公開実装と既存法務文書を 2026-09-01 に照合した本文。 */
export const html = `
  <h1>Dev-Tools プライバシーポリシー</h1>
  <p class="meta">最終更新日: 2026年9月1日</p>
  <p class="legal-language">本ページは日本語で提供しています。 <span lang="en">This page is available in Japanese only.</span></p>

  <p>
    Dev-Tools（以下「本サービス」）は、開発に使う複数のブラウザツールを静的な Web サイトとして提供します。
    運営者は、本サービスのためのアプリケーションサーバー、データベース、広告 SDK、アクセス解析 SDK を運用していません。
  </p>

  <h2>1. ブラウザ内で扱うデータ</h2>
  <p>
    各ツールで入力・作成した ER 図、スクリーンショット編集情報、デザインメモ、登録画像、表示設定などは、
    利用者のブラウザの localStorage に保存されます。入力内容を運営者のサーバーへ送信する機能はありません。
    Text Counter の入力内容は同期対象ではありません。
  </p>

  <h2>2. 任意の Google アカウント連携</h2>
  <p>
    対応ツールで利用者が Google アカウントによるサインインを選んだ場合に限り、Google OAuth 2.0 と Google Drive API を使います。
    本サービスは次のスコープを要求します。
  </p>
  <ul>
    <li><code>https://www.googleapis.com/auth/drive.appdata</code> — 本サービスが作成したデータを、利用者自身の Google Drive にある非表示の appDataFolder へ保存・読み込み・削除するため</li>
    <li><code>https://www.googleapis.com/auth/userinfo.email</code> — サインイン中のメールアドレスを画面に表示するため</li>
  </ul>
  <p>
    Drive の通常のファイルやフォルダへアクセスする権限は要求しません。同期中は Google Drive 側を一次保存先とし、
    localStorage をキャッシュとして使います。メールアドレスと同期データを運営者のサーバーへ送信・保存することはありません。
    Google が発行したアクセストークン、期限、表示用メールアドレスは、サインイン状態を維持するため localStorage に一時保存します。
  </p>

  <h2>3. GitHub Pages と外部サービス</h2>
  <p>
    本サービスは GitHub Pages で配信されています。ページの取得時には、GitHub が IP アドレス、ブラウザ情報、リクエスト時刻などの
    通信情報を処理・記録する場合があります。Google 連携を選んだ場合は、Google Identity Services と Google Drive API への通信が発生します。
    これらの処理には、各社のプライバシーポリシーが適用されます。
  </p>
  <ul>
    <li><a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">GitHub General Privacy Statement</a></li>
    <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google プライバシーポリシー</a></li>
    <li><a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">Google API Services User Data Policy</a></li>
  </ul>

  <h2>4. Cookie、解析、広告</h2>
  <p>
    運営者は、行動追跡用 Cookie、Google Analytics などのアクセス解析、広告配信、トラッキングピクセルを使用しません。
    Google のサインイン処理では、Google 側が認証に必要な情報を取り扱う場合があります。
  </p>

  <h2>5. データの削除</h2>
  <ul>
    <li>ブラウザに保存したデータは、各ツールの削除機能またはブラウザのサイトデータ消去から削除できます。</li>
    <li>Google 連携は Google アカウントの「サードパーティ製のアプリとサービス」から解除できます。</li>
    <li>同期データは、Google Drive のストレージ管理にある「非表示のアプリデータ」から削除できます。</li>
  </ul>

  <h2>6. 変更とお問い合わせ</h2>
  <p>
    本ポリシーは、機能やデータ処理の変更に応じて更新します。ご質問や不具合の報告は、
    <a href="https://github.com/yuto1201/Dev-Tools/issues" target="_blank" rel="noopener noreferrer">Dev-Tools お問い合わせ</a>
    からお送りください。
  </p>
`;
