ステータス：確定
最終更新日：2026-05-18

---

# カスタムドメイン接続手順

Cloudflare で取得済みのドメインを Cloudflare Pages プロジェクト `applibrary` に紐づけ、HTTPS で配信する手順。

## 前提
- ドメインを Cloudflare で取得・DNS 管理済み（同一アカウント）
- [cloudflare-pages.md](cloudflare-pages.md) の手順で Pages プロジェクトが作成済み
- `applibrary.pages.dev` で動作確認済み

---

## 1. カスタムドメインの追加

1. Cloudflare Dashboard → **Workers & Pages** → **applibrary**
2. **Custom domains** タブ → **Set up a custom domain**
3. ドメインを入力:
   - apex の場合: `example.com`
   - サブドメインの場合: `applibrary.example.com` 等
4. Cloudflare が DNS レコードを自動提案
   - apex: CNAME flattening で `example.com` → `applibrary.pages.dev`
   - サブドメイン: CNAME `applibrary` → `applibrary.pages.dev`
5. **Activate domain** をクリック

同一アカウント・DNS 管理下なので、DNS レコードはワンクリックで作成される。

## 2. SSL/TLS 設定

1. Dashboard → 該当ドメインのゾーン → **SSL/TLS** → **Overview**
2. **Full (strict)** に設定
   - Off / Flexible / Full / Full (strict) のうち、最も厳格な選択
3. **Edge Certificates** タブ:
   - **Always Use HTTPS**: ON
   - **Automatic HTTPS Rewrites**: ON
   - **Minimum TLS Version**: `TLS 1.2`
   - **Opportunistic Encryption**: ON

## 3. WWW リダイレクト（apex を本番にする場合）

apex (`example.com`) を本番にし、`www.example.com` から 301 リダイレクトする例:

### 3-1. WWW の DNS レコード作成
- **DNS** タブ → **Add record**
- Type: `CNAME` / Name: `www` / Target: `example.com` / Proxy: **Proxied** (オレンジ雲)

### 3-2. リダイレクトルール作成
- **Rules** → **Redirect Rules** → **Create rule**
- **When incoming requests match**:
  - Field: `Hostname` / Operator: `equals` / Value: `www.example.com`
- **Then**:
  - Type: `Static` / URL: `https://example.com${1}` / Status: `301`

逆に `www` を本番にする場合は、apex → `www` へ同様にリダイレクト。

## 4. 動作確認

```bash
curl -I https://<your-domain>
```

期待される出力:
```
HTTP/2 200
content-type: text/html; charset=utf-8
cf-ray: ... (Cloudflare 経由の証跡)
strict-transport-security: max-age=31536000  (HSTS)
content-security-policy: default-src 'self'; ...  (_headers から)
cache-control: public, max-age=0, must-revalidate
```

ブラウザでも:
- HTTPS で接続できる（鍵マーク表示）
- 証明書の発行者が `Cloudflare Inc ECC CA-3` 等
- `www.<your-domain>` で apex にリダイレクトされる（設定した場合）

## 5. DNS 反映タイミング

| シナリオ | 反映までの目安 |
|---|---|
| 同一 Cloudflare アカウント内・DNS 管理下 | **数秒〜数分** |
| 外部 DNS から Cloudflare に移管したばかり | 数時間〜24 時間 |
| NS レコード変更を伴う場合 | 最大 48 時間 |

---

## トラブルシューティング

| 症状 | 対処 |
|---|---|
| 526 SSL Handshake Failed | SSL/TLS を **Full** または **Full (strict)** に。Flexible だとループする場合あり |
| 522 Connection Timeout | Cloudflare Pages 側のデプロイ状態を確認 |
| 525 SSL Handshake Failed | オリジン証明書の問題。Cloudflare Pages 利用なら通常起きない |
| 証明書が Active にならない | Dashboard → SSL/TLS → **Edge Certificates** で「Universal SSL」が Active か確認。DNS が Cloudflare 管理外だと発行失敗 |
| `www` 付きでアクセスできない | Step 3 の DNS レコード + リダイレクトルールが両方必要 |

## 関連リンク
- [Cloudflare Pages カスタムドメイン公式](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Cloudflare SSL/TLS 公式](https://developers.cloudflare.com/ssl/)
