# CLAUDE.md — AppLibrary

`AGENTS.md` がこのリポジトリの共通正本です。**矛盾する場合は `AGENTS.md` が優先されます。** この文書は Claude 向けの補足だけを置き、`AGENTS.md` の内容を複製しません。

## 最初に読むもの

1. [AGENTS.md](AGENTS.md) — 開発規約、ディレクトリ構成、アプリ追加手順
2. [docs/TODO.md](docs/TODO.md) — 進行中タスク
3. [docs/deploy/README.md](docs/deploy/README.md) — 公開とデプロイ

## このリポジトリでの権限

Claude はローカル作業、Git 操作、ローカル検証、`gh` による Issue / PR 運用を自分で実行します。ユーザーへ手作業を丸投げしません。

実行前にユーザーの明示的な承認が必要なのは次の操作です。

- `main` へのマージ、公開内容を変える push
- Vercel のドメイン設定変更、デプロイ設定変更
- Cloudflare の DNS 変更、Pages プロジェクトの削除
- リポジトリの visibility 変更

承認は現在の会話で exact target について得ます。過去の曖昧な発言から推定しません。

## 検証の原則

検証していない項目を検証済みとして報告しません。

- `npm run check` と `npm run build` が通ることは、**ブラウザでの表示確認の代わりになりません**
- UI を変えたら自分でローカル配信して表示を確認します。ユーザーへ「確認してください」と依頼しません
- ローカル検証とライブ公開状態は別の証拠として扱います

## 移行後に踏みやすい落とし穴

Next.js 移行時に実際に発生した不具合です。同じ轍を踏まないこと。

- **`.reveal` の表示クラスは `.in`**。`is-visible` ではありません
- **className を DOM へ直接書き込まない**。React の再描画で失われます。`useReveal` フックを使います
- **`<html>` の `data-*` 属性は初回訪問でも必ず適用する**。`layout.tsx` のインラインスクリプトは保存値がある場合しか属性を付けないため、`SiteStateProvider` 側の適用を消さないこと
- **静的出力は絶対パスを使う**。サブディレクトリ配信はできません
- **Cloudflare の `app` レコードは DNS only を維持**。プロキシを有効にすると壊れます

## 反対モデルレビュー

重要な判断や大きな変更では、`ask-codex` スキルで Codex に read-only レビューを依頼します。必要なら `ask-grok` も使います。Claude 自身の再読を反対モデルレビューとして報告しません。
