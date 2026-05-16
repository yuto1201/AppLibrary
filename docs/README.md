# AppLibrary docs/

ステータス: 確定
最終更新日: 2026-05-16

`docs/` の地図。何がどこにあるか、Claude Code が「いつ何を更新するか」迷わないためのガイド。

---

## 目次

| パス | 内容 |
|---|---|
| [architecture.md](./architecture.md) | サイト全体構造とサイトマップ、主要モジュール、データフロー |
| [operations.md](./operations.md) | デプロイ・公開・ローカル確認・将来の独自ドメイン移行 |
| [design/top.md](./design/top.md) | トップページ(`index.html`)のデザイン仕様 |
| [design/app-page.md](./design/app-page.md) | 個別アプリページ(`apps/<slug>/`)の共通骨格 |
| [design/components.md](./design/components.md) | glass / app-card / modal / tweaks-panel など共通コンポーネント |
| [apps/README.md](./apps/README.md) | アプリ索引(slug / 名前 / ステータス) |
| [apps/<slug>.md](./apps/) | 各アプリの「registry.js にない情報」(経緯・履歴・設計判断・ノウハウ) |
| [decisions/README.md](./decisions/README.md) | ADR(意思決定の履歴)インデックス |
| [decisions/YYYY-MM-DD-*.md](./decisions/) | 個別 ADR |
| [superpowers/specs/](./superpowers/specs/) | 進行中の design spec(brainstorming skill の出力) |
| [superpowers/plans/](./superpowers/plans/) | 進行中の implementation plan(writing-plans skill の出力) |
| [superpowers/completed/](./superpowers/completed/) | 完了 spec/plan のアーカイブ |

ルート直下の `CLAUDE.md` / `AGENTS.md` / `TODO.md` / `README.md` は本フォルダの管轄外(変更ルールは別)。

---

## いつ何を更新するか(Claude 向けガイド)

Claude Code は**大きな実装・コミット時に、変更内容を見て関連ドキュメントを更新する**。
厳密なルールではなく判断指針。迷ったら下記を参照。

### 新アプリ追加コミット
- `apps/registry.js` にエントリ追加(SOT)
- `docs/apps/README.md` の索引表に 1 行追加
- `docs/apps/<slug>.md` をテンプレからプレースホルダ作成(中身は最初空でも OK)

### デザイン・UI 変更コミット
- 該当する `docs/design/*.md` の関連節を更新
- 影響範囲が大きい(全体方針が変わる等)なら `docs/decisions/` に ADR を 1 件追加

### 構造・アーキ変更コミット
- `docs/architecture.md` の該当節(サイトマップ / 主要モジュール / データフロー)を更新

### デプロイ設定・移行コミット
- `docs/operations.md` を更新

### 大きな実装の完了
- 対応する spec/plan を `docs/superpowers/completed/{specs,plans}/` に**同名のまま**移動
- 設計判断が新しい場合は `docs/decisions/` に ADR を 1 件追加
- アプリ固有のノウハウが出たなら `docs/apps/<slug>.md` の「ノウハウ・既知の罠」に追記

### 重要な意思決定が下された時
- `docs/decisions/YYYY-MM-DD-<topic>.md` を追加
- `docs/decisions/README.md` のインデックス表に 1 行追加

### 迷ったら
- 「これは現状の記録か?(状態)」→ `docs/` の該当カテゴリ(architecture / operations / design / apps)
- 「これはルールか?(規範)」→ ルート `CLAUDE.md`(本フォルダのスコープ外、ユーザー判断)
- 「これは作業中の覚書か?」→ ルート `TODO.md`(本フォルダのスコープ外)

---

## 共通フォーマット規約

全 md ファイルの先頭:
```markdown
# <タイトル>

ステータス: 作成中 | レビュー中 | 確定
最終更新日: YYYY-MM-DD
```

- 内容を実質的に更新したら `最終更新日` を当日に更新する
- ステータス値は CLAUDE.md ルールに従う

ADR のファイル名は `YYYY-MM-DD-<topic>.md`、spec/plan は `YYYY-MM-DD-<topic>-design.md` / `YYYY-MM-DD-<topic>.md`。
完了した spec/plan は `superpowers/completed/{specs,plans}/` に**同名のまま**移動する(ファイル名は変えない)。

---

## なぜこの構造か

設計の背景と検討した代替案は [decisions/2026-05-16-docs-restructure.md](./decisions/2026-05-16-docs-restructure.md) を参照。
