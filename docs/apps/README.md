# アプリ索引

ステータス: 確定
最終更新日: 2026-05-18

各アプリの**機械情報の唯一の真実は `apps/registry.js`**。本フォルダはそれを補完する「人間が書き残す情報」の置き場。

| slug | 名前 | ステータス | プラットフォーム | 個別ページ | 詳細メモ |
|---|---|---|---|---|---|
| sublog | SubLog | release | iOS | [apps/sublog/index.html](../../apps/sublog/index.html) | [sublog.md](./sublog.md) |
| caflog | CafLog | release | iOS | [apps/caflog/index.html](../../apps/caflog/index.html) | [caflog.md](./caflog.md) |

---

## このフォルダに書くこと / 書かないこと

**書くこと** (`<slug>.md`)
- 開発経緯・動機(なぜ作ったか)
- リリース履歴
- 設計判断・トレードオフ
- ノウハウ・既知の罠
- 関連リンク(spec / ADR / 外部資料)

**書かないこと**(`registry.js` を見れば分かる情報の重複)
- slug / name / tagline / category / status / version / price / appStoreUrl など
- 機能リスト(`features`)
- アイコン情報 / 色トークン

---

## 新規アプリ追加時の更新

1. `apps/registry.js` に 1 件追加
2. 上の索引表に 1 行追加
3. `apps/<slug>.md` をテンプレ枠でプレースホルダ作成(中身は最初空でも可)
