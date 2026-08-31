# AppLibrary の仕様

Web-Template の仕様優先の開発方式を、既存の静的サイトへ適用する。

- [product.md](product.md): 対象ユーザー、機能、非対象
- [acceptance.md](acceptance.md): 維持する受け入れ条件
- [../docs/architecture.md](../docs/architecture.md): 現在の構成
- [../docs/design/top.md](../docs/design/top.md): 既存テーマと画面仕様
- [../docs/decisions/](../docs/decisions/): 判断の履歴

優先順位はユーザーの現在の指示 → Issue の受け入れ条件 → `specs/` と採用済み ADR → 運用文書 → 実装・テスト。矛盾で公開範囲や安全性が変わる場合は判断を記録する。
