# 個別アプリページ デザイン仕様

ステータス: 確定
最終更新日: 2026-05-16

`apps/<slug>/index.html` の共通骨格・CSS 階層・必須要素を規定する。
トップページの仕様は [top.md](./top.md)、共通コンポーネントは [components.md](./components.md) を参照。

---

## 全体方針

**ハイブリッド: 骨格共通・表現個別**

- レイアウト・セクション構成・コンポーネント CSS は共通化
- 色・アクセント・スクリーンショット表現は個別アプリで自由
- 「色を差し替えるだけで新アプリページが完成する」のがデフォルト動線
- 攻めた表現が必要なときは個別 `style.css` で追加クラスを足す escape hatch を許容

設計判断の経緯: [completed/specs/2026-05-09-app-page-design.md](../superpowers/completed/specs/2026-05-09-app-page-design.md)

---

## 共通骨格(セクション順序固定)

```
1. hero        — icon / title / tagline / desc / CTA 2 つ
2. features    — カード 6 枚程度のグリッド
3. screenshots — iPhone 風モック付き、3〜5 枚を横並び or グリッド
4. pro         — オプション挿入(Pro プランがあるアプリのみ)
5. cta         — リリース予告 or App Store ボタン
6. footer      — プライバシー・戻り導線・コピーライト
```

`pro` セクションは骨格に含めず、必要なアプリだけ `screenshots` と `cta` の間に追加する規約。

---

## ファイル配置

```
apps/<slug>/
├── index.html              テンプレ HTML をコピー、中身を書き換え
├── style.css               色トークンと任意カスタムだけ
├── script.js
├── icon.png                正方形、128×128 以上
├── privacy.html            プライバシーポリシー(App Store 審査用に必須)
└── screenshots/            1.png 2.png 3.png ... の連番固定
```

---

## CSS 階層(読み込み順)

```html
<link rel="stylesheet" href="../../assets/css/tokens.css">    <!-- 色・余白の土台 -->
<link rel="stylesheet" href="../../assets/css/app-page.css">  <!-- 骨格・レイアウト -->
<link rel="stylesheet" href="./style.css">                    <!-- 色トークン上書き + 任意 -->
```

順序を変えると上書きが効かなくなる。固定。

---

## 色トークン

共通 CSS は汎用名で参照する:

| トークン | 用途 |
|---|---|
| `--app-bg-1`, `--app-bg-2`, `--app-bg-base` | 背景グラデーション色 |
| `--app-ink`, `--app-ink-2` | テキスト色(メイン / セカンダリ) |
| `--app-accent`, `--app-accent-2` | アクセント色(リンク / ハイライト) |

個別 `style.css` で上書きするだけで色替え完了:

```css
:root {
  --app-bg-1:     #e7f2ff;
  --app-bg-2:     #eaf6ff;
  --app-bg-base:  #f7fbff;
  --app-ink:      #0e1e3a;
  --app-ink-2:    #4a5b80;
  --app-accent:   #1e88e5;
  --app-accent-2: #42a5f5;
}
```

アプリ固有の独自色(グロー色など)は `--<slug>-xxx` プレフィックスで追加(衝突防止)。

---

## screenshots セクション仕様

```html
<section id="screenshots" class="screenshots">
  <h2 class="section-title">Screenshots</h2>
  <div class="screenshot-rail">
    <figure class="shot">
      <img src="./screenshots/1.png" alt="ホーム画面" loading="lazy">
      <figcaption>ホーム画面</figcaption>
    </figure>
    <!-- 繰り返し -->
  </div>
</section>
```

レイアウト:
- デスクトップ(≥768px): `grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))` でグリッド
- モバイル(<768px): `overflow-x: auto; scroll-snap-type: x mandatory` で横スワイプカルーセル
- 各画像は CSS で iPhone 風モック枠(`border-radius: 28px` / 影 / 細枠)。実機ベゼル画像は使わない
- 縦長スクショ前提(`aspect-ratio: 9/19.5`)

画像規約:
- ファイル名は `1.png 2.png 3.png ...` の連番固定
- `loading="lazy"` 必須
- WebP 化は任意(最初は PNG のままで OK)
- キャプション(`<figcaption>`)は任意。空にしたければタグごと削除

---

## 必須要素チェックリスト

- [ ] `hero-nav` に `../../index.html` への戻り導線(`← AppLibrary`)
- [ ] `footer` に `privacy.html` へのリンク
- [ ] OGP / Twitter Card の meta タグ一式
- [ ] スクリーンショット `<img>` に `loading="lazy"`
- [ ] `lang="ja"`
- [ ] CSS 読み込み順を守る(tokens → app-page → style)

---

## 個別ページから liquid-glass を使う場合

`assets/css/standard.css` と `assets/js/glass-filter.js` を読み込めばトップページと同じ見た目になる。
ただしデフォルトは「明色グラデ路線」を維持(アプリの雰囲気に合わせて選ぶ)。

---

## 関連

- 新規アプリ追加手順: [../README.md](../README.md) の「いつ何を更新するか」+ ルート `CLAUDE.md`
- アプリ別の開発経緯: [../apps/](../apps/)
- 共通コンポーネント: [components.md](./components.md)
