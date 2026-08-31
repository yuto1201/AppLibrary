# トップページのデザイン

ステータス: 確定
最終更新日: 2026-08-31

実装は `src/app/page.tsx` と `src/components/`。既存の Liquid Glass テーマを維持する。半透明パネル、SVG distortion、背景 gradient、dark/light、アクセントとレイアウトのトークンは `src/styles/tokens.css` / `standard.css` を使う。

1. `Nav`: ブランド、アンカー、言語・テーマ切替、モバイルメニュー。
2. `Hero`: タグライン、見出し、紹介、アプリ数、一覧への導線。文字送りと reduced-motion 対応。
3. `AppsSection`: 検索、プラットフォームとカテゴリの 2 軸、絞り込み解除、カード、空状態。
4. `NotesSection`: お知らせ。データは `src/lib/site-data.ts`。
5. `ContactSection` / `Footer`: 連絡先と著作権表示。

カードは registry から生成する。mosaic/grid/list、密度、フォントは `<html>` の `data-*` と CSS のトークンで切り替わる。言語切替は UI ラベルが対象で、アプリ説明を自動翻訳しない。

`standard.css` の 900px / 600px 付近でカードとナビが再配置される。desktop と iPhone 相当の viewport を E2E で確認する。画面全体の方向性を変える時は、代表画面を提示してユーザーと確認する。

旧バニラ JS の生成スクリプトと HTML コピーは廃止。過去の経緯は [完了済み仕様](../superpowers/completed/specs/2026-05-09-home-hero-opening-design.md) に残す。
