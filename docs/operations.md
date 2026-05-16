# デプロイ・運用

ステータス: 確定
最終更新日: 2026-05-16

公開先・ローカル確認・将来の独自ドメイン移行手順をまとめる。

---

## 公開先(現在)

| 項目 | 値 |
|---|---|
| ホスティング | GitHub Pages |
| URL | `https://<user>.github.io/AppLibrary/` |
| ブランチ | `main` / root |
| 設定 | Repository → Settings → Pages |

反映までは数分。GitHub Pages の Build / Deploy ステータスは Actions タブで確認できる。

---

## ローカル確認

ビルドコマンドは無い。HTML を直接開くか、ローカル静的サーバーで配信する。

```bash
# ファイルを直接開く
open index.html

# ローカルサーバー(相対パスの動作確認に推奨)
python3 -m http.server 8000
# → http://localhost:8000/
```

### 確認観点(リリース前チェック)

- [ ] `index.html` からアプリカードが表示される(registry.js の各アプリ)
- [ ] アプリカードから `apps/<slug>/index.html` に遷移できる
- [ ] 個別ページから `../../index.html` に戻れる
- [ ] `privacy.html` へのリンクが切れていない
- [ ] `file://` 直開きでもディレクトリ一覧に飛ばない(ディレクトリ URL を使っていないことの確認)
- [ ] モバイル幅(375px 等)でテキストやボタンが重ならない
- [ ] dark / light テーマ両方で違和感なし
- [ ] OGP メタタグが入っている(SNS シェア時の見た目)

---

## 独自ドメイン移行(将来)

全て静的ファイルのため、`AppLibrary/` の中身をそのまま新サーバーへ配信すれば動く。
相対パス縛り(`/` 始まりの絶対パス禁止)を守っていれば追加作業は不要。

### 手順(想定)

1. 移行先サーバーに `AppLibrary/` の中身を配置(サブディレクトリでもルートでも動く)
2. DNS を移行先に向ける
3. HTTPS 証明書を設定(Let's Encrypt 等)
4. 404 ハンドリング: `404.html` を default error page に
5. リダイレクト: 旧 GitHub Pages URL → 新ドメインへ(必要なら HTTP 301)
6. OGP の `og:url` を新ドメインに更新

### 移行時に注意するパス

- `/` で始まる絶対パスを使っている箇所が無いか確認(`grep -rn "href=\"/\\|src=\"/\\|url(/" .`)
- 例外として許容している `404.html` の `href="/"` は移行先でも動く(GitHub Pages・自前サーバー両方で「ドメインルートに戻る」になるため)

---

## 既知の運用上の注意

- `assets/js/site-data.js` のプロフィールや SNS には未確定値が残っている可能性あり(`TODO.md` を参照)
- OGP 画像(`assets/img/ogp.png`)は未作成の可能性がある。有効化前にファイル存在確認
- `caflog` のスクリーンショットは未配置(2026-05-16 時点)
- トップページの Hero オープニングは `sessionStorage` の `applibrary_hero_seen` で同一セッション内の再生を抑制(開発中の確認手順は [design/components.md](./design/components.md) を参照)

---

## Analytics(現在は未導入)

`index.html` および各 `apps/<slug>/index.html` の `</body>` 直前に `<!-- TODO: Analytics -->` コメントを置いている。
導入時は全ページに同じ 1 行を追加する。Cookie 不要な Plausible 等が推奨(GDPR/プライバシーポリシー改訂の負担を避ける)。

---

## サイトマップ(将来)

アプリが 10 件を超えたあたりで `sitemap.xml` を生成する想定。`registry.js` から手書きでよい。
