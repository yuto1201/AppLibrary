# ホーム Hero オープニング演出 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** トップページの hero に、初回訪問時のみ 0.7s で再生される文字分割リビールのオープニング演出を追加する。

**Architecture:** バニラ JS / ビルド不要のスタックを維持。FOUC 対策スクリプトで sessionStorage と reduced-motion を見て `<html data-hero-opening="play|off">` を確定 → CSS の `[data-hero-opening="play"]` セレクタ配下で `@keyframes` が自動再生 → `main.js` の `renderHero()` で h1 を文字単位に分割。新ファイル無し。

**Tech Stack:** Vanilla JS、CSS3 (`@keyframes`, custom properties, `prefers-reduced-motion`)、sessionStorage

**Spec:** `docs/superpowers/specs/2026-05-09-home-hero-opening-design.md`

**Testing approach:** 自動テスト無し。各タスク末尾で `python3 -m http.server` 起動 + Playwright MCP で視覚確認 + spec のチェックリストを順次踏む。

---

### Task 1: デザイントークン追加

**Files:**
- Modify: `assets/css/tokens.css`（末尾の `:root` ブロック内、L72 付近、`--font-stack` 定義の直後）

- [ ] **Step 1: tokens.css に Hero アニメーション用トークンを追加**

`assets/css/tokens.css` の `--font-stack: var(--font-sans);` 行の直後（`:root` ブロック内、`}` の手前）に以下を追加:

```css
  /* --- Hero opening animation --- */
  --hero-anim-duration: 0.5s;
  --hero-letter-duration: 0.4s;
  --hero-anim-easing: cubic-bezier(0.2, 0.8, 0.2, 1);
  --hero-letter-easing: cubic-bezier(0.16, 1, 0.3, 1);
  --hero-letter-base: 150ms;
  --hero-letter-stagger: 24ms;
```

- [ ] **Step 2: 視覚確認（変更なし想定）**

```bash
cd /Users/uesugiyuuto/Documents/Web/Applibrary && python3 -m http.server 8765
```

ブラウザで `http://localhost:8765/index.html?v=task1` を開く。Hero の見た目に変化が無いことを確認（トークン追加だけで未使用なので影響ゼロ）。

- [ ] **Step 3: コミット**

```bash
git add assets/css/tokens.css
git commit -m "$(cat <<'EOF'
feat(tokens): hero opening 用アニメーショントークン追加

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: FOUC スクリプトに hero-opening フラグ判定を追加

**Files:**
- Modify: `index.html` L28-L41（既存の FOUC IIFE）

- [ ] **Step 1: index.html の FOUC スクリプトを差し替え**

`index.html` の L28-L41 の `<script>` ブロックを以下に置き換える:

```html
  <!-- FOUC 対策: 保存済みテーマ等を first paint 前に当てる + Hero opening 判定 -->
  <script>
    (function () {
      var html = document.documentElement;
      try {
        var s = JSON.parse(localStorage.getItem('applibrary_state') || 'null');
        if (s) {
          if (s.theme)   html.setAttribute('data-theme',   s.theme);
          if (s.layout)  html.setAttribute('data-layout',  s.layout);
          if (s.density) html.setAttribute('data-density', s.density);
          if (s.font)    html.setAttribute('data-font',    s.font);
          if (s.accent)  html.style.setProperty('--accent', s.accent);
        }
      } catch (_) { /* localStorage unavailable */ }

      try {
        var seen = sessionStorage.getItem('applibrary_hero_seen');
        var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (seen || prefersReducedMotion) {
          html.setAttribute('data-hero-opening', 'off');
        } else {
          html.setAttribute('data-hero-opening', 'play');
          sessionStorage.setItem('applibrary_hero_seen', '1');
        }
      } catch (_) {
        html.setAttribute('data-hero-opening', 'off');
      }
    })();
  </script>
```

- [ ] **Step 2: 視覚確認**

```bash
cd /Users/uesugiyuuto/Documents/Web/Applibrary && python3 -m http.server 8765
```

ブラウザで `http://localhost:8765/index.html?v=task2` を開く。DevTools の Elements で `<html>` を確認:
- 1 回目アクセス: `data-hero-opening="play"` が付いている
- リロード: `data-hero-opening="off"` に切り替わる
- DevTools コンソールで `sessionStorage.removeItem('applibrary_hero_seen')` → リロードで再び `play`

見た目はまだ変化しない（CSS が未だ参照していない）。

- [ ] **Step 3: コミット**

```bash
git add index.html
git commit -m "$(cat <<'EOF'
feat(home): FOUC スクリプトで hero-opening 再生フラグを確定

sessionStorage applibrary_hero_seen と prefers-reduced-motion を見て
<html data-hero-opening="play|off"> をfirst paint 前に確定する。

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: renderHero() を文字分割構造に書き換え

**Files:**
- Modify: `assets/js/main.js` L136-L160 (`renderHero` 関数)
- 追加ヘルパー: 同ファイル L88 付近、`appIconHTML` の直後

- [ ] **Step 1: 文字分割ヘルパーを追加**

`assets/js/main.js` の L88 の `}` の直後（`// ────────────────────────────────────────────────────────────` セパレータ行の直前）に追加:

```js
  // 文字分割: 1 行のテキストを <span class="hero-letter" style="--i:N"> 群に変換。
  // サロゲートペア対応のため Array.from を使う。スペースは &nbsp; に置換。
  // baseIndex は連番の開始値（複数行で letter index を通し番号にしたいときに使う）。
  function splitToLetters(text, baseIndex) {
    if (text == null) return { html: '', count: 0 };
    var chars = Array.from(String(text));
    var html = chars.map(function (ch, i) {
      var safe = ch === ' ' ? '&nbsp;' : esc(ch);
      return '<span class="hero-letter" style="--i:' + (baseIndex + i) + '">' + safe + '</span>';
    }).join('');
    return { html: html, count: chars.length };
  }
```

- [ ] **Step 2: renderHero の h1 部分を文字分割構造に書き換え**

`assets/js/main.js` の `renderHero()` 関数（L136-L160）を以下に置き換え:

```js
  function renderHero() {
    const T = t();
    const profile = window.SITE_DATA.profile;
    const total = (window.APP_REGISTRY || []).length;

    const lineA = splitToLetters(T.hero_h1_a, 0);
    const lineB = splitToLetters(T.hero_h1_b, lineA.count);
    const ariaLabel = (T.hero_h1_a || '') + (T.hero_h1_b || '');

    return `
      <section class="hero">
        <div class="hero-eyebrow reveal">${esc(T.hero_eyebrow)} · ${esc(profile.tagline)}</div>
        <h1 class="hero-h1 reveal" style="transition-delay:80ms;" aria-label="${attr(ariaLabel)}">
          <span class="hero-line" aria-hidden="true">${lineA.html}</span>
          <span class="hero-line accent" aria-hidden="true">${lineB.html}</span>
        </h1>
        <p class="hero-bio reveal" style="transition-delay:160ms;">${esc(profile.bio)}</p>
        <div class="hero-meta reveal" style="transition-delay:240ms;">
          <span>📍 ${esc(profile.location)}</span>
          <span>● ${total} ${esc(T.hero_meta_apps)}</span>
          <span>● Swift · SwiftUI</span>
        </div>
        <div class="hero-cta-wrap reveal" style="transition-delay:320ms;">
          <a class="cta-btn" href="#apps">
            <span>${esc(T.hero_cta)}</span>
            ${ICON_ARROW_DOWN}
          </a>
        </div>
      </section>
    `;
  }
```

主な変更:
- `<br>` を削除し、`<span class="hero-line">` で各行をラップ
- 各行の中身を `splitToLetters()` で `<span class="hero-letter">` に展開
- h1 全体に `class="hero-h1"`（CSS で line を block 化するための足場）と `aria-label`（元テキスト）を付ける
- accent クラスは line ラッパー側に移動（letter span ではなく）

- [ ] **Step 3: 視覚確認 (CSS まだ未調整なので崩れる前提)**

```bash
cd /Users/uesugiyuuto/Documents/Web/Applibrary && python3 -m http.server 8765
```

ブラウザで `http://localhost:8765/index.html?v=task3` を開く。
- DevTools の Elements で h1 の中身が `<span class="hero-line"><span class="hero-letter" style="--i:0">小</span>...` 構造になっていること
- aria-label が "小さなアプリを、丁寧に。" になっていること
- 見た目: hero-line がインライン要素なので 2 行が 1 行に並んで見える可能性あり（次の Task 4 で `display: block` を当てて修正）

- [ ] **Step 4: VoiceOver 確認（任意・後回し可）**

macOS で Cmd+F5 → VoiceOver ON → h1 にフォーカス → 「小さなアプリを、丁寧に。 見出しレベル 1」と 1 回読まれることを確認。文字単位で読まれていれば aria 設定が間違っている。

- [ ] **Step 5: コミット**

```bash
git add assets/js/main.js
git commit -m "$(cat <<'EOF'
feat(home): hero h1 を文字単位の span に分割して描画

aria-label で元テキストを保持しスクリーンリーダーは 1 見出しとして読む。
各 .hero-letter に --i カスタムプロパティを付与し、CSS 側で stagger delay を計算可能にする。

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: 新構造の基本 CSS（layout のみ、まだアニメーション無し）

**Files:**
- Modify: `assets/css/standard.css` L195 付近（既存 `.hero h1 .accent` ルールの直後、`.hero-bio` の直前）

- [ ] **Step 1: hero-line / hero-letter / hero-h1 の基本スタイルを追加**

`assets/css/standard.css` の L207（`[data-theme="light"] .hero h1 .accent { ... }` ブロックの閉じ `}` の直後、`.hero-bio` 定義の直前）に以下を挿入:

```css

/* --- Hero h1: line/letter 分割構造（renderHero で生成） --- */
.hero-h1 {
  perspective: 800px; /* letter-rise の rotateX 用（将来用、現状は translateY のみ） */
}
.hero-h1 .hero-line {
  display: block;
}
.hero-h1 .hero-line.accent {
  background: linear-gradient(120deg, #ffd4b4 0%, #ff8fd0 50%, #9cc7ff 100%);
  background-size: 200% 200%;
  background-position: 0% 50%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
[data-theme="light"] .hero-h1 .hero-line.accent {
  background: linear-gradient(120deg, #e85b8a 0%, #af52de 50%, #0a84ff 100%);
  background-size: 200% 200%;
  background-position: 0% 50%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
.hero-h1 .hero-letter {
  display: inline-block;
  white-space: pre; /* &nbsp; を確実に幅として出す */
}
```

注意: 既存の `.hero h1 .accent` (L196-L201) と `[data-theme="light"] .hero h1 .accent` (L202-L207) は **削除してよい**（新ルールが上書きする）。互換のため残しても害は無いが、二度書きを避けるため削除する。

- [ ] **Step 2: 既存の重複 .accent ルールを削除**

`assets/css/standard.css` の以下のブロック（L196-L207）を削除:

```css
.hero h1 .accent {
  background: linear-gradient(120deg, #ffd4b4 0%, #ff8fd0 50%, #9cc7ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
[data-theme="light"] .hero h1 .accent {
  background: linear-gradient(120deg, #e85b8a 0%, #af52de 50%, #0a84ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

（理由：`renderHero` の新構造では `.accent` は `.hero-line.accent` であり、`.hero h1 .accent` セレクタの「直接の子としての .accent」とは違うため一応マッチはするが、Step 1 で追加したルールと値が同じで二重管理になる）

- [ ] **Step 3: 視覚確認**

```bash
cd /Users/uesugiyuuto/Documents/Web/Applibrary && python3 -m http.server 8765
```

ブラウザで `http://localhost:8765/index.html?v=task4` を開く。DevTools コンソールで `sessionStorage.clear()` してリロード。
- h1 が 2 行で正しく改行されている（`<br>` 無しでも `display: block` で改行される）
- 1 行目は通常色、2 行目は元と同じグラデーション
- letter-spacing -0.035em が崩れていないこと（kerning 確認、英字 "Apps & Things." を `?lang=en` 切替の代わりに DevTools で `state.lang='en'; render()` で確認可能 — または右上の言語トグルで EN に切替）
- カーニングが目に見えて崩れる場合は `.hero-letter` の `letter-spacing` 個別調整が必要だがまず問題無いはず

DevTools で `<html data-hero-opening="play">` のときも、まだアニメーション CSS が無いので静止表示のはず。

- [ ] **Step 4: モバイル幅確認**

DevTools の device toolbar で 375px 表示。h1 が画面からはみ出さない、letter 分割で 1 行目／2 行目の改行が崩れない（`hero-line` の `display: block` で各行が独立しているのでそもそも崩れにくい）。

- [ ] **Step 5: コミット**

```bash
git add assets/css/standard.css
git commit -m "$(cat <<'EOF'
feat(home): hero-line/hero-letter の基本スタイルを追加

旧 .hero h1 .accent ルールは新構造 .hero-line.accent に統合し削除。
hero-line を block 化して <br> 無しで改行、letter は inline-block + pre 化。

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: アニメーション @keyframes の追加

**Files:**
- Modify: `assets/css/standard.css` Task 4 で追加した hero-h1 ブロックの直後

- [ ] **Step 1: @keyframes 4 個を追加**

`assets/css/standard.css` の Task 4 で追加した `.hero-h1 .hero-letter { ... }` ブロックの直後に挿入:

```css

/* --- Hero opening animation: keyframes --- */
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
@keyframes hero-cta-glow {
  0%   { box-shadow: 0 6px 24px rgba(0, 122, 255, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.5); }
  50%  { box-shadow: 0 10px 40px rgba(0, 122, 255, 0.55), 0 0 60px rgba(90, 200, 250, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.6); }
  100% { box-shadow: 0 6px 24px rgba(0, 122, 255, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.5); }
}
```

- [ ] **Step 2: 視覚確認（変化無し想定）**

ブラウザで `http://localhost:8765/index.html?v=task5` を開く。@keyframes は宣言だけでは何も起きない。Hero の見た目に変化が無いことを確認。

- [ ] **Step 3: コミット**

```bash
git add assets/css/standard.css
git commit -m "$(cat <<'EOF'
feat(home): hero opening 用 @keyframes 4 個を定義

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: [data-hero-opening="play"] 配下の適用ルール

**Files:**
- Modify: `assets/css/standard.css` Task 5 で追加した @keyframes ブロックの直後

- [ ] **Step 1: play 状態の適用ルールを追加**

`assets/css/standard.css` の Task 5 で追加した `@keyframes hero-cta-glow` ブロックの直後に挿入:

```css

/* --- Hero opening animation: play モード（初回訪問時のみ） --- */
[data-hero-opening="play"] .hero .reveal {
  /* 既存 .reveal の opacity:0 / translateY を打ち消し、新 keyframes に任せる。
     IntersectionObserver が .in を付けても上書きしないよう important。 */
  opacity: 1 !important;
  transform: none !important;
  transition: none !important;
}
[data-hero-opening="play"] .hero .hero-eyebrow {
  animation: hero-fade-up var(--hero-anim-duration) var(--hero-anim-easing) 50ms both;
}
[data-hero-opening="play"] .hero .hero-h1 {
  /* h1 自体は静止、letter が立ち上がる */
  opacity: 1;
}
[data-hero-opening="play"] .hero-h1 .hero-letter {
  opacity: 0;
  transform: translateY(0.5em);
  animation: hero-letter-rise var(--hero-letter-duration) var(--hero-letter-easing)
             calc(var(--hero-letter-base) + var(--i, 0) * var(--hero-letter-stagger)) both;
}
[data-hero-opening="play"] .hero-h1 .hero-line.accent {
  animation: hero-grad-flow 1.2s var(--hero-anim-easing) 200ms both;
}
[data-hero-opening="play"] .hero .hero-bio {
  animation: hero-fade-up var(--hero-anim-duration) var(--hero-anim-easing) 450ms both;
}
[data-hero-opening="play"] .hero .hero-meta {
  animation: hero-fade-up var(--hero-anim-duration) var(--hero-anim-easing) 550ms both;
}
[data-hero-opening="play"] .hero .hero-cta-wrap {
  animation: hero-fade-up var(--hero-anim-duration) var(--hero-anim-easing) 650ms both;
}
[data-hero-opening="play"] .hero .cta-btn {
  animation: hero-cta-glow 0.6s var(--hero-anim-easing) 1100ms both;
}
```

- [ ] **Step 2: 視覚確認（オープニング再生）**

```bash
cd /Users/uesugiyuuto/Documents/Web/Applibrary && python3 -m http.server 8765
```

DevTools コンソールで `sessionStorage.clear()` → リロード → `http://localhost:8765/index.html?v=task6`

期待動作:
- 50ms 後に eyebrow がフェードアップ
- 150ms 後から h1 の文字が 1 文字ずつ約 24ms 間隔で立ち上がる
- 200ms 後に accent 行のグラデが左→右に流れる（h1 のグラデ部分のみ）
- 450ms 後に bio
- 550ms 後に meta
- 650ms 後に CTA がフェードアップ
- 1100ms 後に CTA が 1 度 glow して落ち着く
- 全体 1.7s 程度で完全に着地

リロード（sessionStorage 残った状態）→ 全要素が即時最終状態で表示、アニメ無し

- [ ] **Step 3: dark/light テーマ両方確認**

右上のテーマトグルで切り替え → どちらのテーマでも accent グラデが正しく流れること。

- [ ] **Step 4: 言語切替確認**

右上の JA/EN トグルで切替 → re-render が走り、新しい言語で hero がもう一度オープニング再生されないこと（sessionStorage が `1` のまま）。
※ もし切替時に再生したい仕様にしたい場合はここで気づくが、spec では「リロード時のみ」なので何もしない。

- [ ] **Step 5: コミット**

```bash
git add assets/css/standard.css
git commit -m "$(cat <<'EOF'
feat(home): [data-hero-opening='play'] 配下に hero opening 適用ルール

eyebrow→letter(stagger)→bio→meta→CTA の順で 0.05s〜1.1s に展開。
既存 .reveal クラスは hero 内では !important で打ち消し、letter 制御のみ有効化。

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: prefers-reduced-motion フォールバック追加

**Files:**
- Modify: `assets/css/standard.css` 末尾の `@media (prefers-reduced-motion: reduce)` ブロック内（既存 L1070-L1091）

- [ ] **Step 1: reduced-motion ブロックに hero-opening 無効化ルールを追加**

`assets/css/standard.css` の `@media (prefers-reduced-motion: reduce)` ブロック内、`.icon-btn:hover { transform: none; }` の直後（閉じ `}` の直前）に追加:

```css
  /* hero opening を CSS 側でも無効化（FOUC スクリプトが先に off にしているはずだが二重防御） */
  [data-hero-opening="play"] .hero-h1 .hero-letter,
  [data-hero-opening="play"] .hero-h1 .hero-line.accent,
  [data-hero-opening="play"] .hero .hero-eyebrow,
  [data-hero-opening="play"] .hero .hero-bio,
  [data-hero-opening="play"] .hero .hero-meta,
  [data-hero-opening="play"] .hero .hero-cta-wrap,
  [data-hero-opening="play"] .hero .cta-btn {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
```

- [ ] **Step 2: macOS の reduced-motion ON で確認**

System Settings → Accessibility → Display → "Reduce motion" を ON にする。

ブラウザで DevTools コンソール → `sessionStorage.clear()` → リロード。
- Hero が即時最終状態で表示される（オープニング再生されない）
- DevTools の Elements で `<html data-hero-opening="off">` が付いている（FOUC スクリプトが reduced-motion を見て off にしている）
- 念のため DevTools で手動で `data-hero-opening="play"` に書き換え + リロード → CSS フォールバックで動かないこと

確認後 reduced motion を OFF に戻す。

- [ ] **Step 3: コミット**

```bash
git add assets/css/standard.css
git commit -m "$(cat <<'EOF'
feat(home): prefers-reduced-motion で hero opening を無効化

FOUC スクリプトが先に data-hero-opening='off' にしているため
通常は CSS のこのフォールバックは発火しないが、二重防御として残す。

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: CLAUDE.md に開発時リプレイ手順を追記、最終チェック

**Files:**
- Modify: `CLAUDE.md`（既存の「変更してよいもの」付近、または「やってはいけないこと」の前あたり）

- [ ] **Step 1: CLAUDE.md にリプレイ手順を追記**

`CLAUDE.md` の `## 共通トップページ（index.html）` セクションの末尾、`### 変更してはいけないもの` ブロックの後に、新セクションを追加:

```markdown
### Hero オープニング演出（初回訪問のみ）

トップを開いた瞬間に Hero が文字単位で立ち上がるオープニングシーケンス。
sessionStorage キー `applibrary_hero_seen` で同セッション中の再生を抑制。
`prefers-reduced-motion: reduce` で自動的に無効化。

**開発中にもう一度見たいとき:**
DevTools コンソールで以下を実行:
```js
sessionStorage.removeItem('applibrary_hero_seen'); location.reload();
```

設計詳細は `docs/superpowers/specs/2026-05-09-home-hero-opening-design.md`。
```

- [ ] **Step 2: spec のチェックリストを 1 つずつ踏む**

`docs/superpowers/specs/2026-05-09-home-hero-opening-design.md` の「手動確認チェックリスト」を順に実施:

```bash
cd /Users/uesugiyuuto/Documents/Web/Applibrary && python3 -m http.server 8765
```

ブラウザで以下を順に確認:
- [ ] sessionStorage クリア → 初回訪問で h1 が 1 文字ずつ立ち上がる
- [ ] そのままリロード → 再生されない
- [ ] sessionStorage クリア後リロードで再生される
- [ ] OS の「視差効果を減らす」ON で即時表示
- [ ] dark / light 両テーマで違和感なし
- [ ] モバイル 375px で hero がはみ出さず letter 分割で改行が崩れない
- [ ] VoiceOver で h1 を読むと元テキスト 1 回（macOS Cmd+F5）
- [ ] Tweaks パネル（`?dev=1`）で font/density 切替後にリロードしても破綻しない
- [ ] 既存 `.reveal` と競合しない（apps/posts/contact セクションは従来通り scroll reveal で出現）

問題があれば Task 6 のルール調整に戻る。

- [ ] **Step 3: 最終コミット**

```bash
git add CLAUDE.md
git commit -m "$(cat <<'EOF'
docs(claude): hero opening 演出と開発時リプレイ手順を CLAUDE.md に追記

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 4: TODO.md 更新**

`TODO.md` の「完了済み」セクションに 1 行追加:

```markdown
- [x] 2026-05-09 ホーム Hero オープニング演出追加（初回訪問のみ文字分割リビール、reduced-motion フォールバック付き）
```

```bash
git add TODO.md
git commit -m "$(cat <<'EOF'
docs: TODO.md にホーム Hero オープニング演出の完了を記録

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## 完了基準

- 全 8 タスクのチェックボックスが埋まっている
- spec の手動確認チェックリストが全項目クリア
- 8 commits が `main` に追加されている
- リロード前提の挙動（同セッション再生スキップ）が想定通り
