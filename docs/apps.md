# アプリカタログ — AppLibrary

ステータス: 確定
最終更新日: 2026-04-27

`apps/registry.js` の内容を人間が読みやすい形でまとめたカタログ。
GitHub で repo を見た人が、サイトを動かさずにアプリ一覧を読める用途。

> **注意:** *真の正(source of truth)* は `apps/registry.js`。本ファイルは派生物。
> 内容を更新する時は **registry.js を編集 → このファイルにも追記** の順を守る。

---

## SubLog

| 項目 | 内容 |
|---|---|
| slug | `sublog` |
| プラットフォーム | iOS |
| ステータス | β テスト中 |
| カテゴリ | ファイナンス |
| バージョン | 1.0 |
| 価格 | 無料 |
| App Store | 未公開（審査前） |

**タグライン**: 毎月のサブスクを、ひと目で。

**説明**: サブスクリプションの管理を、ひとつの画面で。月々の支払いを可視化し、無駄な支出を見つけられます。シンプルな UI と、必要十分なウィジェットで日々の確認を後押しします。

**主な機能**: サブスク一覧 / 月次サマリー / ウィジェット / 通知

**リンク**:
- 個別ページ: [`apps/sublog/index.html`](../apps/sublog/index.html)
- プライバシーポリシー: [`apps/sublog/privacy.html`](../apps/sublog/privacy.html)

---

## CafLog

| 項目 | 内容 |
|---|---|
| slug | `caflog` |
| プラットフォーム | iOS |
| ステータス | β テスト中 |
| カテゴリ | ヘルスケア |
| バージョン | 1.0 |
| 価格 | 無料 |
| App Store | 未公開（審査前） |

**タグライン**: カフェインとの付き合いを、見える化。

**説明**: いつ・どれくらいのカフェインを摂ったかを記録し、1 日の合計と就寝時の体内残量を可視化します。睡眠の質を意識した飲み方をサポート。

**主な機能**: カフェイン量記録 / 残量計算 / 日別サマリー / 通知

**リンク**:
- 個別ページ: [`apps/caflog/index.html`](../apps/caflog/index.html)
- プライバシーポリシー: [`apps/caflog/privacy.html`](../apps/caflog/privacy.html)

---

## 新規アプリ追加時のチェックリスト

詳細は CLAUDE.md「アプリを新しく追加する手順」を参照。要点だけ:

1. `apps/<slug>/` フォルダを作成（slug は英小文字+ハイフン）
2. `apps/sublog/` を雛形にコピー → 中身を実態に合わせて編集
   - `index.html` / `style.css` / `script.js` / `privacy.html`
3. アイコン `apps/<slug>/icon.png` を配置
4. `apps/registry.js` にエントリ追加（必須／任意フィールドはファイル先頭コメント参照）
5. **このファイル（`docs/apps.md`）にもセクションを追加**
6. ローカル確認: `open index.html` でカード表示、個別ページ、スマホ幅崩れ
7. 公開後に App Store URL を `registry.js` の `appStoreUrl` に設定
