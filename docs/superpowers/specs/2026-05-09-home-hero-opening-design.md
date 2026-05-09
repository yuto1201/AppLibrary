# ホーム Hero オープニング演出 設計

**作成日:** 2026-05-09
**対象:** `index.html`（共通トップページ）の hero セクション
**目的:** トップを訪れた瞬間に「おっ」と思わせる、スマートなオープニングシーケンスを追加し、サイト全体の印象を一段上に引き上げる。

---

## ゴール

- 初回訪問時、Hero が 0.7s 程度かけて段階的に立ち上がる「映画オープニング感」を演出する
- 文字単位のリビールで h1 を主役に据え、サブ要素は控えめな stagger フェードで脇役に徹する
- 2 回目以降のロードでは静止状態で表示し、利用者を疲れさせない
- アクセシビリティ・パフォーマンス・既存テーマ（dark/light）を一切壊さない

## 非対象

- カード・posts・contact 等、Hero 以外のセクションのアニメーション
- Tweaks パネルへの replay ボタン追加（YAGNI 判断）
- 自動テストの導入

---

## 1. アーキテクチャ

新ファイルは作らず、既存ファイルへの追記のみで完結させる。

| 役割 | 場所 | 追加内容 |
|---|---|---|
| 再生判定 | `index.html` の FOUC 対策スクリプト | sessionStorage と `prefers-reduced-motion` を見て `<html data-hero-opening="play\|off">` を確定 |
| アニメ定義 | `assets/css/standard.css` の Hero セクション | `@keyframes` 4 個と `[data-hero-opening="play"]` 配下の適用ルール |
| 文字分割 | `assets/js/main.js` の hero レンダラー | h1 を `<span class="hero-letter">` に分解、`aria-label` で元テキストを保持 |
| トークン | `assets/css/tokens.css` | `--hero-anim-stagger`, `--hero-anim-duration`, `--hero-easing` を追加 |

データフローは「初回判定 → `data-hero-opening` フラグ → CSS animation 自動再生」の単方向。JS の責務はトリガーと分割のみで、補間処理は CSS に寄せる。

---

## 2. h1 文字分割とアクセシビリティ

### 変換ルール

```html
<!-- Before -->
<h1>uesugiyuuto's <span class="accent">Apps &amp; Things.</span></h1>

<!-- After -->
<h1 aria-label="uesugiyuuto's Apps &amp; Things.">
  <span class="hero-line" aria-hidden="true">
    <span class="hero-letter">u</span><span class="hero-letter">e</span>...<span class="hero-letter">s</span>
    <span class="hero-letter">&nbsp;</span>
  </span>
  <span class="hero-line accent" aria-hidden="true">
    <span class="hero-letter">A</span><span class="hero-letter">p</span>...
  </span>
</h1>
```

### 仕様

- 分割単位は **文字 (grapheme)**。`Array.from(text)` を用いてサロゲートペアに対応
- 半角/全角スペースは `&nbsp;` に置換し、`<span class="hero-letter">` でラップして幅を保つ
- accent 部分は `<span class="hero-line accent">` でラップ。グラデ背景を line 単位で当て、文字 span を `display: inline-block` にしても色が切れないようにする
- 元テキストは h1 の `aria-label` に保持し、各文字 span は `aria-hidden="true"`
- スクリーンリーダーは h1 を 1 見出しとして 1 回読む

### 実装

`main.js` の hero レンダリング関数の末尾で `splitHeroH1(h1Element)` を呼ぶ。元テキストは site-data.js から取得（hardcode しない）。失敗時は try/catch でサイレントに諦め、コンソール warn のみ。

### 注意点

- h1 全体に `letter-spacing: -0.035em` が当たっているため、`.hero-letter` を `display: inline-block` にすると kerning が崩れる可能性。実装時に視覚比較で確認
- text-shadow は line ラッパーに寄せ、`.hero-letter` には付けない（文字単位の影は重く見える）

---

## 3. アニメーション仕様

### タイムライン（合計 0.78s）

| t (s) | 要素 | アニメーション |
|---|---|---|
| 0.00 | `body` 背景レイヤー | `opacity 0.6 → 1`（0.5s） |
| 0.05 | `.hero-eyebrow` | fade-up（translateY 16px → 0, 0.5s） |
| 0.15 | `.hero-letter` 1 文字目 | letter-rise（translateY 0.5em → 0, 0.4s）|
| 0.15 + n × 0.024 | n 番目の `.hero-letter` | 同上、24ms ずつディレイ |
| 0.45 | `.hero-bio` | fade-up |
| 0.55 | `.hero-meta` | fade-up（コンテナ単位） |
| 0.65 | `.cta-btn` | fade-up + 直後に `cta-glow-pulse`（0.6s, 1 回のみ） |

### Easing

- 共通: `cubic-bezier(0.2, 0.8, 0.2, 1)`（既存サイトの統一値）
- letter-rise のみ: `cubic-bezier(0.16, 1, 0.3, 1)`（弾むような感）

### `@keyframes`

```css
@keyframes hero-fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: none; }
}
@keyframes hero-letter-rise {
  from { opacity: 0; transform: translateY(0.5em); }
  to   { opacity: 1; transform: none; }
}
@keyframes hero-grad-flow {
  from { background-position: 0% 50%; }
  to   { background-position: 100% 50%; }
}
@keyframes cta-glow-pulse {
  0%   { box-shadow: 0 6px 24px rgba(0,122,255,0.35), inset 0 1px 0 rgba(255,255,255,0.5); }
  50%  { box-shadow: 0 10px 40px rgba(0,122,255,0.55), 0 0 60px rgba(90,200,250,0.4), inset 0 1px 0 rgba(255,255,255,0.6); }
  100% { box-shadow: 0 6px 24px rgba(0,122,255,0.35), inset 0 1px 0 rgba(255,255,255,0.5); }
}
```

### 初期状態と適用範囲

- `[data-hero-opening="play"]` 配下でのみ animation を適用
- 各要素の `animation-fill-mode: backwards` で delay 中も初期 transform/opacity を維持
- `[data-hero-opening="off"]` 時は何もしない（最終状態がそのまま見える）

---

## 4. リプレイ制御

### 仕組み

- sessionStorage キー `applibrary_hero_seen` に `"1"` を保存
- 同セッション中の 2 回目以降はスキップ
- ブラウザを閉じれば再生される

### 判定スクリプト

`index.html` の既存 FOUC 対策 IIFE 内で実施。first paint 前にフラグを立てる必要があるため。

```html
<script>
  (function () {
    try {
      // 既存のテーマ復元処理...

      var seen = sessionStorage.getItem('applibrary_hero_seen');
      var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (seen || prefersReducedMotion) {
        document.documentElement.setAttribute('data-hero-opening', 'off');
      } else {
        document.documentElement.setAttribute('data-hero-opening', 'play');
        sessionStorage.setItem('applibrary_hero_seen', '1');
      }
    } catch (_) {
      document.documentElement.setAttribute('data-hero-opening', 'off');
    }
  })();
</script>
```

### バージョニング

将来 hero リニューアル時はキー名に suffix を付ける（`applibrary_hero_seen_v2` 等）→ 全ユーザーに 1 度だけ再生される。

### 開発時のリプレイ手順

DevTools コンソールで以下を実行:
```js
sessionStorage.removeItem('applibrary_hero_seen'); location.reload();
```

`CLAUDE.md` にこの手順をメモする。

---

## 5. アクセシビリティ・失敗時挙動・テスト

### `prefers-reduced-motion: reduce`

- セクション 4 の判定スクリプトで `data-hero-opening="off"` を確定 → アニメ無効
- 二重防御として `standard.css` の既存 `@media (prefers-reduced-motion: reduce)` ブロックにも `[data-hero-opening="play"]` 配下を上書きするルールを追加

### スクリーンリーダー

- h1 の `aria-label` で元テキスト全体を読み上げ
- `.hero-letter` / `.hero-line` は `aria-hidden="true"`
- VoiceOver/NVDA で 1 文字ずつ読まれない

### フォーカス挙動

- アニメ中も DOM 要素は最終位置に存在（CSS transform のみ動かす）
- Tab 順序は影響を受けない

### JS 失敗時

- `splitHeroH1()` が失敗 → 元の h1 がそのまま残る
- CSS の `.hero-letter` 適用ルールは空振りするだけ
- try/catch でサイレントに諦め、コンソール warn のみ

### ブラウザ対応

- 全機能：Safari 15+ / Chrome 90+ / Firefox 90+

### 手動確認チェックリスト

- [ ] 初回訪問で h1 が 1 文字ずつ立ち上がる
- [ ] リロードで再生されない（同セッション内）
- [ ] sessionStorage クリア後リロードで再生される
- [ ] OS の「視差効果を減らす」を ON で即時表示
- [ ] dark / light 両テーマで違和感なし
- [ ] モバイル 375px で hero がはみ出さず、letter 分割で改行が崩れない
- [ ] VoiceOver で h1 を読むと元テキストが 1 回読まれる
- [ ] Tweaks パネルで font/density 切り替え後にリロードしても破綻しない
- [ ] 既存の `.reveal` クラス（scroll reveal）と競合しない

### 自動テスト

導入しない。バニラ静的サイトでテスト基盤未整備、アニメ自動検証コストが見合わない。

---

## 受入基準

1. 初回訪問で 0.7s 程度の Hero オープニングが再生され、h1 が文字単位で立ち上がる
2. 同セッション内のリロードでは再生されない
3. `prefers-reduced-motion: reduce` で即時表示される
4. 既存の theme/layout/density 切り替え機能が動作し続ける
5. VoiceOver で h1 が元テキストを 1 回だけ読む
6. JS が失敗しても hero は表示される
