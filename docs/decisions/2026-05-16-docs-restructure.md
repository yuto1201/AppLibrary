# docs/ 構造の再編

ステータス: 採択
日付: 2026-05-16
関連: なし(初回 ADR)

---

## 背景

`docs/` 配下が以下の課題を抱えていた:

- **カテゴリ分けが不明確**: 新しい情報をどこに書けばいいか毎回迷う
- **重複・ドリフト**: `docs/apps.md` が `apps/registry.js` の手動ミラーで同期負担
- **カバー漏れ**: 個別アプリページのデザイン仕様、デプロイ・運用、意思決定履歴、サイトマップが docs/ に無い
- **`superpowers/specs|plans/` の散らかり**: 完了済みと進行中が同居し、ブレストの度に積み上がる

Claude Code が大きな実装やコミット時に「どこに何を書けばいいか」迷わずに自律的に更新できる構造が必要だった。

## 決定

`docs/` をハイブリッド構造(主要カテゴリはフラット md、スケールするものだけフォルダ)で再編する。

```
docs/
├── README.md                  地図 + Claude 自律記述ガイド
├── architecture.md            全体構造とサイトマップ
├── operations.md              デプロイ・運用
├── design/                    top.md / app-page.md / components.md
├── apps/                      README.md + <slug>.md(registry.js にない情報のみ)
├── decisions/                 ADR(本ファイルが 1 件目)
└── superpowers/
    ├── specs/ plans/          進行中
    └── completed/             完了アーカイブ
```

各ファイルに骨格テンプレを定義し、Claude が一貫した形で記入できるようにする。
「いつ何を更新するか」のガイドは `docs/README.md` に集約。**厳密なトリガールールではなく判断指針**として書く(基本は Claude の判断に委ねる)。

## 検討した代替案

- **案 A: カテゴリ別フォルダ(全部フォルダで切る)** → 不採用。最初から空フォルダができやすく、ファイル数の少ない領域でも 1 階層深くなる
- **案 B: フラット少数(全部 1 ファイルにまとめる)** → 不採用。design / apps / decisions などスケールする領域があり、単一ファイル肥大化のリスク
- **派生情報の自動生成スクリプト導入** → 不採用。静的サイトでビルドツール不使用方針と矛盾。Claude の手動同期で十分

## 影響

- 旧 `docs/apps.md` を削除し、`apps/README.md`(索引)+ `apps/<slug>.md`(各アプリの非機械情報)に分割
- 旧 `docs/design.md` を削除し、`design/top.md`(トップ)/ `design/app-page.md`(個別)/ `design/components.md`(共通)に分割
- `superpowers/specs|plans/` の既存 2 件(計 4 ファイル)を `completed/` 配下へ git mv
- `CLAUDE.md` L186 のパス参照を 1 行だけ追従更新(例外措置、内容には手を入れない)
- 今後、新規アプリ追加・デザイン変更・大きな実装の際に、`docs/README.md` のガイドに従って関連ドキュメントを更新する運用が成立する

スコープ外(別 ADR で扱う場合あり):
- `CLAUDE.md` / `AGENTS.md` の重複問題(今回触らない)
- 過去判断(liquid-glass 採用など)の遡及 ADR 化
