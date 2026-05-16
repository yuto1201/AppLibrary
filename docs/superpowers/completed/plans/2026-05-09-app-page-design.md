# 個別アプリページ デザイン共通化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** sublog/caflog の個別ページ間で重複しているレイアウト CSS を `assets/css/app-page.css` に抽出し、screenshots セクションと `apps/_template/` を整備する。

**Architecture:** 共通 CSS は汎用トークン名（`--app-*`）で書き、各アプリの `style.css` はその上書きと任意カスタムだけに絞る。HTML はテンプレ化して `apps/_template/` から `cp` で増やせるようにする。screenshots は `apps/<slug>/screenshots/<番号>.png` 規約に統一。

**Tech Stack:** バニラ HTML / CSS / JavaScript、ビルドツール無し、GitHub Pages 配信。CSS は `color-mix(in srgb, ...)` を使用（Safari 16.2+ / Chrome 111+ / Firefox 113+ 対応）。

**Spec:** `docs/superpowers/specs/2026-05-09-app-page-design.md`

**Verification approach:** UI 単体テストは無いため、各タスクで `open` コマンドで HTML を開いてスクリーンショット確認 + Playwright MCP で `file://` ナビゲーション + ビジュアル検査を実施する。リファクタの場合は「リファクタ前後で見た目が変わらないこと」を確認する。

---

## File Structure

**新規作成**
- `assets/css/app-page.css` — 共通骨格 CSS（hero / features / screenshots / pro / cta / footer / buttons）
- `apps/sublog/screenshots/1.png` 〜 `4.png` — `apps/sublog/Preview/` から移動
- `apps/_template/index.html` — 個別ページテンプレ HTML
- `apps/_template/style.css` — 色トークン値のテンプレ
- `apps/_template/script.js` — 空のテンプレ
- `apps/_template/privacy.html` — プライバシーポリシーのテンプレ（既存 sublog のものをコピー）
- `apps/_template/README.md` — 「コピーして使う手順」

**変更**
- `apps/sublog/style.css` — レイアウト CSS を削除、`--app-*` 上書きに簡素化
- `apps/sublog/index.html` — `app-page.css` を読み込み、screenshots セクション追加
- `apps/caflog/style.css` — 同上（screenshots セクションは無し）
- `apps/caflog/index.html` — `app-page.css` を読み込み（screenshots セクションは追加しない）
- `CLAUDE.md` — 個別ページ作成規約を新方式に更新
- `TODO.md` — 完了項目を移動、caflog スクショ撮影タスクを追加

**削除**
- `apps/sublog/Preview/` — 移動完了後にディレクトリごと削除

---

## Task 1: 共通 CSS `assets/css/app-page.css` を作成

**Files:**
- Create: `assets/css/app-page.css`

- [ ] **Step 1: ファイルを作成**

`assets/css/app-page.css` に以下の内容を書く：

```css
/* ============================================================
   App Page — 個別アプリ紹介ページの共通骨格
   各アプリの style.css で --app-* トークンを上書きして使う。
   ─── 必須トークン（個別 style.css で必ず定義） ───
   --app-bg-1, --app-bg-2     背景グラデーション色
   --app-ink, --app-ink-2     テキスト色（メイン / セカンダリ）
   --app-accent, --app-accent-2 アクセント色（リンク / ハイライト）
   --app-bg-base              ページ最下層の背景色
   ============================================================ */

* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: auto; }
body {
  font-family: var(--font-sans);
  color: var(--app-ink);
  background:
    radial-gradient(1200px 700px at 10% -10%, var(--app-bg-1), transparent 70%),
    radial-gradient(900px 600px at 110% 20%, var(--app-bg-2), transparent 70%),
    var(--app-bg-base);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  line-height: 1.7;
}

img { max-width: 100%; display: block; }
a { color: var(--app-accent); text-decoration: none; }
a:hover { text-decoration: underline; }

/* ═══ Hero ═══ */
.hero { padding: var(--space-6) var(--space-5) var(--space-12); }
.hero-nav { max-width: 1040px; margin: 0 auto var(--space-8); }
.nav-back { font-size: 14px; color: var(--app-ink-2); font-weight: 500; }
.hero-inner {
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
  padding: var(--space-8) var(--space-4);
}
.hero-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto var(--space-6);
  border-radius: 28px;
  box-shadow: 0 20px 40px -12px color-mix(in srgb, var(--app-accent) 45%, transparent);
}
.hero-title {
  font-size: clamp(40px, 6vw, 64px);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--app-ink);
}
.hero-tagline {
  margin-top: var(--space-3);
  font-size: clamp(18px, 2.2vw, 22px);
  font-weight: 600;
  background: linear-gradient(90deg, var(--app-accent), var(--app-accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.hero-desc { margin-top: var(--space-5); font-size: 16px; color: var(--app-ink-2); }
.hero-actions {
  margin-top: var(--space-8);
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  flex-wrap: wrap;
}

/* ═══ Buttons ═══ */
.btn {
  display: inline-flex;
  align-items: center;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-full);
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
  cursor: pointer;
  border: 1px solid transparent;
}
.btn:hover { text-decoration: none; transform: translateY(-1px); }
.btn-primary {
  color: #fff;
  background: linear-gradient(135deg, var(--app-accent), var(--app-accent-2));
  box-shadow: 0 10px 24px -8px color-mix(in srgb, var(--app-accent) 50%, transparent);
}
.btn-primary:hover { box-shadow: 0 14px 32px -8px color-mix(in srgb, var(--app-accent) 60%, transparent); }
.btn-primary[aria-disabled="true"] { opacity: 0.55; cursor: not-allowed; }
.btn-primary[aria-disabled="true"]:hover { transform: none; }
.btn-ghost {
  color: var(--app-ink);
  background: #fff;
  border-color: color-mix(in srgb, var(--app-ink) 12%, transparent);
}
.btn-ghost:hover { background: color-mix(in srgb, var(--app-bg-1) 60%, #fff); }

/* ═══ Main ═══ */
.page { max-width: 1040px; margin: 0 auto; padding: 0 var(--space-5); }
.section-title {
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 800;
  letter-spacing: -0.02em;
  text-align: center;
  margin-bottom: var(--space-8);
}

/* ═══ Features ═══ */
.features { padding: var(--space-12) 0; }
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--space-5);
}
.feature-card {
  padding: var(--space-6);
  background: #fff;
  border-radius: var(--radius-lg);
  box-shadow: 0 10px 30px -12px color-mix(in srgb, var(--app-ink) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--app-ink) 6%, transparent);
}
.feature-icon { font-size: 32px; margin-bottom: var(--space-3); }
.feature-card h3 { font-size: 18px; font-weight: 700; margin-bottom: var(--space-2); }
.feature-card p { font-size: 14px; color: var(--app-ink-2); }

/* ═══ Screenshots ═══ */
.screenshots { padding: var(--space-12) 0; }
.screenshot-rail {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--space-5);
}
.shot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}
.shot img {
  width: 100%;
  max-width: 280px;
  aspect-ratio: 9 / 19.5;
  object-fit: cover;
  border-radius: 28px;
  box-shadow: 0 24px 48px -12px color-mix(in srgb, var(--app-ink) 25%, transparent);
  border: 1px solid color-mix(in srgb, var(--app-ink) 8%, transparent);
  background: #000;
}
.shot figcaption {
  font-size: 13px;
  color: var(--app-ink-2);
  text-align: center;
}
@media (max-width: 767px) {
  .screenshot-rail {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: var(--space-4);
    padding-bottom: var(--space-4);
    -webkit-overflow-scrolling: touch;
  }
  .shot { flex: 0 0 70%; scroll-snap-align: center; }
}

/* ═══ Pro section（オプション挿入） ═══ */
.pro {
  margin: var(--space-8) 0;
  padding: 0;
}
.pro-inner {
  max-width: 760px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-6);
  background: #fff;
  border-radius: var(--radius-lg);
  border: 1px solid color-mix(in srgb, var(--app-ink) 8%, transparent);
  box-shadow: 0 10px 30px -12px color-mix(in srgb, var(--app-ink) 10%, transparent);
}
.pro-badge {
  display: inline-block;
  padding: 4px 12px;
  background: linear-gradient(135deg, var(--app-accent), var(--app-accent-2));
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  border-radius: var(--radius-full);
  margin-bottom: var(--space-3);
}
.pro-title {
  font-size: clamp(20px, 2.6vw, 26px);
  font-weight: 800;
  margin-bottom: var(--space-2);
}
.pro-price {
  font-size: 14px;
  color: var(--app-ink-2);
  margin-bottom: var(--space-5);
}
.pro-list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: var(--space-3);
}
.pro-list li {
  padding-left: 28px;
  position: relative;
  font-size: 15px;
  color: var(--app-ink-2);
  line-height: 1.6;
}
.pro-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  top: 0;
  width: 20px;
  height: 20px;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, var(--app-accent), var(--app-accent-2));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pro-list strong { color: var(--app-ink); font-weight: 700; }

/* ═══ CTA ═══ */
.cta {
  margin: var(--space-12) 0;
  padding: var(--space-10) var(--space-6);
  text-align: center;
  background: linear-gradient(135deg, var(--app-accent), var(--app-accent-2));
  color: #fff;
  border-radius: var(--radius-lg);
  box-shadow: 0 20px 40px -12px color-mix(in srgb, var(--app-accent) 40%, transparent);
}
.cta-title { font-size: clamp(22px, 3vw, 28px); font-weight: 800; margin-bottom: var(--space-2); }
.cta-desc { opacity: 0.92; }

/* ═══ Footer ═══ */
.page-footer {
  padding: var(--space-10) var(--space-5);
  text-align: center;
  color: var(--app-ink-2);
  font-size: 14px;
}
.page-footer a { color: var(--app-ink); }
.copyright { margin-top: var(--space-2); font-size: 13px; opacity: 0.7; }

@media (max-width: 479px) {
  .hero { padding: var(--space-4); }
  .hero-inner { padding: var(--space-4) 0; }
  .features { padding: var(--space-8) 0; }
  .pro-inner { padding: var(--space-6) var(--space-5); }
}
```

- [ ] **Step 2: コミット**

```bash
git add assets/css/app-page.css
git commit -m "Add shared app-page.css for individual app pages"
```

---

## Task 2: sublog をリファクタ前にスクリーンショット保存

**Files:**
- 一時保存: `/tmp/sublog-before.png`

- [ ] **Step 1: Playwright MCP で file:// 開いてスクリーンショット**

絶対パス：`file:///Users/uesugiyuuto/Documents/Web/Applibrary/apps/sublog/index.html`

`mcp__plugin_playwright_playwright__browser_navigate` で開き、`mcp__plugin_playwright_playwright__browser_take_screenshot` で `/tmp/sublog-before.png` に full page スクショを保存。

- [ ] **Step 2: 内容を目視確認**

`Read /tmp/sublog-before.png` で表示してレイアウトを確認。後で比較に使う。コミット不要。

---

## Task 3: sublog の `style.css` を `--app-*` トークン上書きだけに置き換え

**Files:**
- Modify: `apps/sublog/style.css`（全置換）

- [ ] **Step 1: ファイル全体を以下で上書き**

```css
/* ============================================================
   SubLog 個別紹介ページ — 色トークン上書き
   レイアウト CSS は assets/css/app-page.css に集約。
   ここでは --app-* トークンの値だけを定義する。
   独自色を足す場合は --sublog-xxx プレフィックスで追加。
   ============================================================ */

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

- [ ] **Step 2: コミット（次タスクとセットでも可。先に保存しておく）**

このステップではまだコミットしない。Task 4 の HTML 更新まで終わってから一緒にコミットする。

---

## Task 4: sublog の `index.html` に `app-page.css` 読み込みを追加

**Files:**
- Modify: `apps/sublog/index.html:29-30`

- [ ] **Step 1: link タグを 1 行追加**

`apps/sublog/index.html` の以下の部分：

```html
  <!-- 共通トークン（必須） -->
  <link rel="stylesheet" href="../../assets/css/tokens.css">
  <link rel="stylesheet" href="./style.css">
```

を以下に置き換え：

```html
  <!-- 共通トークン（必須） -->
  <link rel="stylesheet" href="../../assets/css/tokens.css">
  <link rel="stylesheet" href="../../assets/css/app-page.css">
  <link rel="stylesheet" href="./style.css">
```

- [ ] **Step 2: ビジュアル検証（リファクタ前後比較）**

`mcp__plugin_playwright_playwright__browser_navigate` で `file:///Users/uesugiyuuto/Documents/Web/Applibrary/apps/sublog/index.html` を開き、`browser_take_screenshot` で `/tmp/sublog-after-refactor.png` に保存。

`/tmp/sublog-before.png` と `/tmp/sublog-after-refactor.png` を Read して見比べ、レイアウト・色・余白が同一であることを確認する。差分があればこのタスクで修正する。

許容差分：色トークンの rgba() を color-mix() に置換した部分で**ごく僅かな**色味差が出る可能性は許容（色覚で違いがわからないレベル）。

- [ ] **Step 3: モバイル幅検証**

`browser_resize` で 375x812 にリサイズ → `browser_take_screenshot` で `/tmp/sublog-mobile-after.png` に保存。崩れが無いことを Read で確認。

- [ ] **Step 4: コミット**

```bash
git add apps/sublog/style.css apps/sublog/index.html
git commit -m "Refactor sublog page to use shared app-page.css"
```

---

## Task 5: sublog のスクショを `Preview/` から `screenshots/` に移動

**Files:**
- Move: `apps/sublog/Preview/Simulator Screenshot - iPhone 17 Pro Max - 2026-04-12 at *.png` → `apps/sublog/screenshots/{1,2,3,4}.png`
- Delete: `apps/sublog/Preview/`

- [ ] **Step 1: ディレクトリ作成 + リネーム移動**

```bash
cd /Users/uesugiyuuto/Documents/Web/Applibrary/apps/sublog
mkdir -p screenshots
ls Preview/
```

`Preview/` 内のファイルを古い順（`00.08.16` → `00.10.44` → `00.11.37` → `00.11.57`）に `1.png` 〜 `4.png` にリネーム移動：

```bash
mv "Preview/Simulator Screenshot - iPhone 17 Pro Max - 2026-04-12 at 00.08.16.png" screenshots/1.png
mv "Preview/Simulator Screenshot - iPhone 17 Pro Max - 2026-04-12 at 00.10.44.png" screenshots/2.png
mv "Preview/Simulator Screenshot - iPhone 17 Pro Max - 2026-04-12 at 00.11.37.png" screenshots/3.png
mv "Preview/Simulator Screenshot - iPhone 17 Pro Max - 2026-04-12 at 00.11.57.png" screenshots/4.png
rmdir Preview
ls screenshots/
```

- [ ] **Step 2: 確認**

```bash
ls /Users/uesugiyuuto/Documents/Web/Applibrary/apps/sublog/screenshots/
```

Expected: `1.png 2.png 3.png 4.png`

```bash
ls /Users/uesugiyuuto/Documents/Web/Applibrary/apps/sublog/ | grep -i preview
```

Expected: 何も出力されない（Preview/ が消えている）

- [ ] **Step 3: コミットしない（次の HTML 更新と一緒にコミット）**

---

## Task 6: sublog の `index.html` に screenshots セクションを追加

**Files:**
- Modify: `apps/sublog/index.html`（features セクションと pro セクションの間に追加）

- [ ] **Step 1: features セクションの直後に screenshots セクションを挿入**

`apps/sublog/index.html` の以下の部分：

```html
        <article class="feature-card">
          <div class="feature-icon">📱</div>
          <h3>ウィジェット & Face ID</h3>
          <p>ホーム画面ウィジェットで月額合計を常時表示。Face ID ロックにも対応。</p>
        </article>
      </div>
    </section>

    <section class="pro">
```

を以下に置き換え：

```html
        <article class="feature-card">
          <div class="feature-icon">📱</div>
          <h3>ウィジェット & Face ID</h3>
          <p>ホーム画面ウィジェットで月額合計を常時表示。Face ID ロックにも対応。</p>
        </article>
      </div>
    </section>

    <section id="screenshots" class="screenshots">
      <h2 class="section-title">Screenshots</h2>
      <div class="screenshot-rail">
        <figure class="shot">
          <img src="./screenshots/1.png" alt="SubLog のスクリーンショット 1" loading="lazy">
        </figure>
        <figure class="shot">
          <img src="./screenshots/2.png" alt="SubLog のスクリーンショット 2" loading="lazy">
        </figure>
        <figure class="shot">
          <img src="./screenshots/3.png" alt="SubLog のスクリーンショット 3" loading="lazy">
        </figure>
        <figure class="shot">
          <img src="./screenshots/4.png" alt="SubLog のスクリーンショット 4" loading="lazy">
        </figure>
      </div>
    </section>

    <section class="pro">
```

- [ ] **Step 2: ビジュアル検証**

`mcp__plugin_playwright_playwright__browser_navigate` で `file:///Users/uesugiyuuto/Documents/Web/Applibrary/apps/sublog/index.html` を開き、`browser_take_screenshot` で full page を `/tmp/sublog-with-screenshots.png` に保存し Read。

確認項目:
- features の下に screenshots セクションが表示される
- 4 枚の画像が並ぶ（デスクトップ幅ならグリッド）
- 画像に角丸＋影＋細枠がついている
- pro セクションがその下にある

- [ ] **Step 3: モバイル幅検証**

`browser_resize` 375x812 → `browser_take_screenshot` /tmp/sublog-mobile-with-screenshots.png` 保存して Read。
確認項目: モバイル幅では screenshot-rail が横スワイプ可能なカルーセルになっている（`overflow-x: auto`）。

- [ ] **Step 4: コミット**

`Preview/` 配下のファイル削除も明示的にステージする必要があるため、削除ステージを含めて 1 コミット：

```bash
git status   # Preview/* が deleted になっていることを確認
git add apps/sublog/Preview apps/sublog/screenshots apps/sublog/index.html
git commit -m "Add screenshots section to sublog page"
```

---

## Task 7: caflog をリファクタ前にスクリーンショット保存

**Files:**
- 一時保存: `/tmp/caflog-before.png`

- [ ] **Step 1: Playwright MCP で開いてスクショ**

`mcp__plugin_playwright_playwright__browser_navigate` で `file:///Users/uesugiyuuto/Documents/Web/Applibrary/apps/caflog/index.html` を開き、`browser_take_screenshot` で `/tmp/caflog-before.png` に保存。

- [ ] **Step 2: 内容を Read で確認**

後の比較に使う。コミット不要。

---

## Task 8: caflog の `style.css` を `--app-*` トークン上書きだけに置き換え

**Files:**
- Modify: `apps/caflog/style.css`（全置換）

- [ ] **Step 1: ファイル全体を以下で上書き**

```css
/* ============================================================
   CafLog 個別紹介ページ — 色トークン上書き
   レイアウト CSS は assets/css/app-page.css に集約。
   ここでは --app-* トークンの値だけを定義する。
   独自色を足す場合は --caflog-xxx プレフィックスで追加。
   ============================================================ */

:root {
  --app-bg-1:     #fff1e3;
  --app-bg-2:     #ffe4ec;
  --app-bg-base:  #fffaf5;
  --app-ink:      #2d1a1a;
  --app-ink-2:    #6d4a4a;
  --app-accent:   #ff8a3d;
  --app-accent-2: #ff6b9d;
}
```

- [ ] **Step 2: 次タスクとまとめてコミットするためここでは保存のみ**

---

## Task 9: caflog の `index.html` に `app-page.css` 読み込みを追加

**Files:**
- Modify: `apps/caflog/index.html:29-30`

- [ ] **Step 1: link タグを 1 行追加**

`apps/caflog/index.html` の以下の部分：

```html
  <!-- 共通トークン（必須） -->
  <link rel="stylesheet" href="../../assets/css/tokens.css">
  <link rel="stylesheet" href="./style.css">
```

を以下に置き換え：

```html
  <!-- 共通トークン（必須） -->
  <link rel="stylesheet" href="../../assets/css/tokens.css">
  <link rel="stylesheet" href="../../assets/css/app-page.css">
  <link rel="stylesheet" href="./style.css">
```

- [ ] **Step 2: ビジュアル検証（リファクタ前後比較）**

`browser_navigate` で `file:///Users/uesugiyuuto/Documents/Web/Applibrary/apps/caflog/index.html` を開き、`browser_take_screenshot` で `/tmp/caflog-after-refactor.png` に保存。Read で `/tmp/caflog-before.png` と比較。

レイアウト・色・余白が同一であることを確認。差分があればこのタスクで修正する。

許容差分：rgba() → color-mix() の僅かな色味差は許容。

- [ ] **Step 3: モバイル幅検証**

`browser_resize` 375x812 → `browser_take_screenshot` で `/tmp/caflog-mobile-after.png` に保存し Read。

- [ ] **Step 4: コミット**

```bash
git add apps/caflog/style.css apps/caflog/index.html
git commit -m "Refactor caflog page to use shared app-page.css"
```

---

## Task 10: `apps/_template/` を sublog ベースで作成

**Files:**
- Create: `apps/_template/index.html`
- Create: `apps/_template/style.css`
- Create: `apps/_template/script.js`
- Create: `apps/_template/privacy.html`
- Create: `apps/_template/README.md`

- [ ] **Step 1: ディレクトリ作成**

```bash
mkdir -p /Users/uesugiyuuto/Documents/Web/Applibrary/apps/_template
```

- [ ] **Step 2: `apps/_template/index.html` を作成**

`{{APP_NAME}}` `{{APP_TAGLINE}}` `{{APP_DESC_META}}` `{{APP_DESC_HERO}}` `{{APP_SLUG}}` をプレースホルダにしたテンプレを作る。以下を `apps/_template/index.html` に書く：

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{APP_NAME}} — {{APP_TAGLINE}}</title>
  <meta name="description" content="{{APP_DESC_META}}">

  <!-- OGP -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="AppLibrary">
  <meta property="og:title" content="{{APP_NAME}} — {{APP_TAGLINE}}">
  <meta property="og:description" content="{{APP_DESC_META}}">
  <meta property="og:image" content="./icon.png">
  <meta name="twitter:card" content="summary_large_image">

  <!-- iOS Smart App Banner（App Store ID 取得後に有効化） -->
  <!-- <meta name="apple-itunes-app" content="app-id=XXXXXXXXXX"> -->

  <link rel="icon" href="./icon.png">
  <link rel="apple-touch-icon" href="./icon.png">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <!-- 共通トークン（必須）+ 共通骨格 + 個別色 -->
  <link rel="stylesheet" href="../../assets/css/tokens.css">
  <link rel="stylesheet" href="../../assets/css/app-page.css">
  <link rel="stylesheet" href="./style.css">
</head>
<body>

  <header class="hero">
    <nav class="hero-nav">
      <a href="../../index.html" class="nav-back">← AppLibrary</a>
    </nav>

    <div class="hero-inner">
      <img class="hero-icon" src="./icon.png" alt="{{APP_NAME}} アイコン">
      <h1 class="hero-title">{{APP_NAME}}</h1>
      <p class="hero-tagline">{{APP_TAGLINE}}</p>
      <p class="hero-desc">
        {{APP_DESC_HERO}}
      </p>

      <div class="hero-actions">
        <a class="btn btn-primary" href="#" aria-disabled="true">App Store（準備中）</a>
        <a class="btn btn-ghost" href="#features">機能を見る</a>
      </div>
    </div>
  </header>

  <main class="page">

    <section id="features" class="features">
      <h2 class="section-title">Features</h2>
      <div class="feature-grid">
        <article class="feature-card">
          <div class="feature-icon">✨</div>
          <h3>機能タイトル</h3>
          <p>機能の説明。1〜2 文で簡潔に。</p>
        </article>
        <!-- 6 枚程度を推奨。必要に応じて追加 -->
      </div>
    </section>

    <section id="screenshots" class="screenshots">
      <h2 class="section-title">Screenshots</h2>
      <div class="screenshot-rail">
        <figure class="shot">
          <img src="./screenshots/1.png" alt="{{APP_NAME}} のスクリーンショット 1" loading="lazy">
        </figure>
        <!-- 3〜5 枚を推奨。screenshots/ に番号順で配置 -->
      </div>
    </section>

    <!-- Pro プランがあるアプリだけ以下を残す。無ければ削除する。
    <section class="pro">
      <div class="pro-inner">
        <span class="pro-badge">Pro</span>
        <h2 class="pro-title">Pro プランで、さらに使い込む</h2>
        <p class="pro-price">買い切り ¥XXX</p>
        <ul class="pro-list">
          <li><strong>機能 A</strong> — 説明</li>
        </ul>
      </div>
    </section>
    -->

    <section class="cta">
      <h2 class="cta-title">まもなくリリース予定</h2>
      <p class="cta-desc">App Store での公開準備中です。</p>
    </section>

  </main>

  <footer class="page-footer">
    <p>
      <a href="./privacy.html">プライバシーポリシー</a> ·
      <a href="../../index.html">AppLibrary</a>
    </p>
    <p class="copyright">&copy; 2026 uesugiyuuto</p>
  </footer>

  <script src="./script.js"></script>
</body>
</html>
```

- [ ] **Step 3: `apps/_template/style.css` を作成**

```css
/* ============================================================
   {{APP_NAME}} 個別紹介ページ — 色トークン上書き
   レイアウト CSS は assets/css/app-page.css に集約。
   独自色を足す場合は --{{APP_SLUG}}-xxx プレフィックスで追加。
   ============================================================ */

:root {
  --app-bg-1:     #FFFFFF; /* TODO: アプリ色に差し替え */
  --app-bg-2:     #FFFFFF; /* TODO */
  --app-bg-base:  #FFFFFF; /* TODO */
  --app-ink:      #111111; /* TODO */
  --app-ink-2:    #555555; /* TODO */
  --app-accent:   #000000; /* TODO */
  --app-accent-2: #333333; /* TODO */
}
```

- [ ] **Step 4: `apps/_template/script.js` を作成（空でよい）**

```js
// 個別ページ用 JS。必要に応じて追加。
```

- [ ] **Step 5: `apps/_template/privacy.html` を sublog のものを雛形にコピー**

```bash
cp /Users/uesugiyuuto/Documents/Web/Applibrary/apps/sublog/privacy.html /Users/uesugiyuuto/Documents/Web/Applibrary/apps/_template/privacy.html
```

その後、ファイル冒頭にコメントを追加するため、Edit ツールで先頭の `<!DOCTYPE html>` を：

```html
<!DOCTYPE html>
<!-- TODO: アプリ名・社名・問い合わせ先・データ取扱を実態に合わせて差し替える -->
```

に置き換える。

- [ ] **Step 6: `apps/_template/README.md` を作成**

```markdown
# 個別アプリページ テンプレート

新しいアプリの紹介ページを作る時は、このフォルダをコピーして使う。

## 手順

1. このフォルダをアプリ名（slug）でコピー：

   \`\`\`bash
   cp -R apps/_template apps/<slug>
   \`\`\`

2. 中の `{{APP_NAME}}` `{{APP_TAGLINE}}` `{{APP_DESC_META}}` `{{APP_DESC_HERO}}` `{{APP_SLUG}}` を一括置換：

   \`\`\`bash
   cd apps/<slug>
   find . -type f \\( -name '*.html' -o -name '*.css' \\) -exec sed -i '' \\
     -e 's/{{APP_NAME}}/MyApp/g' \\
     -e 's/{{APP_TAGLINE}}/短いキャッチコピー/g' \\
     -e 's/{{APP_DESC_META}}/SEO 用の説明（120字程度）/g' \\
     -e 's/{{APP_DESC_HERO}}/ヒーロー本文/g' \\
     -e 's/{{APP_SLUG}}/<slug>/g' {} +
   \`\`\`

3. `style.css` の `--app-*` トークン値をアプリ色に差し替え（TODO コメント参照）

4. `apps/<slug>/icon.png` を配置（128×128 以上、正方形）

5. `apps/<slug>/screenshots/1.png` 〜 `N.png` を配置（縦長 iPhone スクショ、3〜5 枚推奨）

6. `apps/<slug>/privacy.html` の中身を実態に合わせて修正

7. `apps/registry.js` にエントリを追加（`apps/sublog` の項目を参考に）

8. ブラウザで確認：
   \`\`\`bash
   open apps/<slug>/index.html
   \`\`\`

9. Pro プランがあるアプリだけ、`index.html` のコメントアウト済み `<section class="pro">` ブロックのコメント記号を外して内容を書く

## 守るべきルール

- 相対パス（`./` `../`）のみ。`/` 始まりは禁止
- 共通骨格 CSS の class 名は変更しない（`hero` `features` `screenshots` `pro` `cta` 等）
- 独自色を足したい時は `--<slug>-xxx` のプレフィックスで `style.css` に追加
```

- [ ] **Step 7: コミット**

```bash
git add apps/_template
git commit -m "Add apps/_template/ scaffold for new app pages"
```

---

## Task 11: `CLAUDE.md` の規約を新方式に更新

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: フォルダ構成セクションの更新**

`CLAUDE.md:25-42` の `assets/` フォルダ構成内、

```
│   │   ├── tokens.css          # デザイントークン（全ページ必読）
│   │   └── standard.css        # 共通ページ用コンポーネント
```

を以下に置き換え：

```
│   │   ├── tokens.css          # デザイントークン（全ページ必読）
│   │   ├── standard.css        # 共通トップページ用コンポーネント（liquid-glass）
│   │   └── app-page.css        # 個別アプリページ用の共通骨格
```

`apps/<slug>/` のサブツリーに `screenshots/` を追加：

```
└── apps/
    ├── registry.js             # アプリメタデータ（唯一の真実）
    └── <slug>/                 # アプリごとのフォルダ（slug = 英小文字+ハイフン）
        ├── index.html          # 個別紹介ページ
        ├── style.css           # 色トークン上書き + 任意カスタム
        ├── script.js
        ├── privacy.html        # プライバシーポリシー（必須）
        ├── icon.png
        └── screenshots/        # 1.png 2.png 3.png ...
```

- [ ] **Step 2: 「絶対ルール 2. デザイントークン」を更新**

`CLAUDE.md` の「### 2. デザイントークンは ...」セクションを以下に置き換え：

```markdown
### 2. デザイントークンは継承する

- 全ページ共通：`assets/css/tokens.css`（色・余白・角丸・shadow の土台）
- 個別アプリページ専用：`assets/css/app-page.css`（hero / features / screenshots / pro / cta / footer のレイアウト）
- 個別アプリの `style.css` は **`--app-*` トークン上書きだけ**を持つ：

  \`\`\`css
  :root {
    --app-bg-1:     #e7f2ff;
    --app-bg-2:     #eaf6ff;
    --app-bg-base:  #f7fbff;
    --app-ink:      #0e1e3a;
    --app-ink-2:    #4a5b80;
    --app-accent:   #1e88e5;
    --app-accent-2: #42a5f5;
  }
  \`\`\`

- 独自色を足したい場合は `--<slug>-xxx` プレフィックスで追加（例：`--sublog-glow`）
- レイアウト調整したい時は `app-page.css` を変えると全アプリに影響するので注意。片方だけ変えたい時は個別 `style.css` で `.hero { ... }` 等を override する
```

- [ ] **Step 3: 「個別アプリページ」セクションを更新**

`CLAUDE.md` の「## 個別アプリページ（`apps/<slug>/`）」以降のセクションを以下に置き換え：

```markdown
## 個別アプリページ（`apps/<slug>/`）

### 共通骨格（必須）

セクション順序は以下を厳守：

1. `hero` — icon / title / tagline / desc / CTA
2. `features` — カード 6 枚程度
3. `screenshots` — `apps/<slug>/screenshots/<番号>.png` から表示
4. `pro` — オプション挿入（Pro プランがあるアプリのみ）
5. `cta` — リリース予告 or App Store ボタン
6. `footer` — プライバシー・戻り導線・コピーライト

### CSS 階層（読み込み順）

\`\`\`html
<link rel="stylesheet" href="../../assets/css/tokens.css">
<link rel="stylesheet" href="../../assets/css/app-page.css">
<link rel="stylesheet" href="./style.css">
\`\`\`

### スクリーンショット規約

- `apps/<slug>/screenshots/` に `1.png` 〜 `N.png` を連番配置（推奨 3〜5 枚、最大 6 枚）
- 縦長 iPhone スクショ前提（`aspect-ratio: 9/19.5`）
- WebP 化は任意（最初は PNG のまま OK）
- `<img loading="lazy">` を必ず付ける

### 守るべきこと

| 項目 | ルール |
|---|---|
| トークン | `tokens.css` と `app-page.css` を読み込む |
| 色トークン | `--app-*` を `style.css` で上書きするだけで色替え完了 |
| 独自色 | `--<slug>-xxx` プレフィックスで追加 |
| 戻り導線 | `← AppLibrary` リンクを hero-nav に配置 |
| フッター | プライバシーポリシーへのリンクを配置 |
| OGP | 共通の meta タグ一式を入れる |
| lang | `lang="ja"` |

### 個別ページから liquid-glass を使いたい場合

`standard.css` と `glass-filter.js` を読み込めば共通トップページと同じ見た目が使える。アプリの雰囲気を変えたい場合は `app-page.css` ベースで色トークンだけ変える。
```

- [ ] **Step 4: 「アプリを新しく追加する手順」を更新**

`CLAUDE.md` の「## アプリを新しく追加する手順」を以下に置き換え：

```markdown
## アプリを新しく追加する手順

1. テンプレをコピー：`cp -R apps/_template apps/<slug>`（slug は英小文字+ハイフン）
2. `apps/_template/README.md` の「手順」に沿って placeholder を一括置換
3. `style.css` の `--app-*` トークン値をアプリ色に差し替え
4. `apps/<slug>/icon.png` を配置（128×128 以上、正方形）
5. `apps/<slug>/screenshots/1.png` 〜 `N.png` を配置
6. `apps/<slug>/privacy.html` の中身を実態に合わせて修正
7. `apps/registry.js` にエントリを 1 件追加
8. トップを `open index.html` でカード表示確認、`open apps/<slug>/index.html` で個別ページ確認
9. スマホ幅（〜479px）でレスポンシブ確認
```

- [ ] **Step 5: 「やってはいけないこと」に 1 行追加**

`CLAUDE.md` の「## やってはいけないこと」リストに以下を追加：

```markdown
- ❌ **個別 `style.css` にレイアウト CSS を書く** — `app-page.css` 側に集約、個別は色トークンと最小限の override だけ
```

- [ ] **Step 6: コミット**

```bash
git add CLAUDE.md
git commit -m "Update CLAUDE.md for new app-page.css convention"
```

---

## Task 12: `TODO.md` を更新

**Files:**
- Modify: `TODO.md`

- [ ] **Step 1: 「アプリごと」セクションの完了済みタスクを移動・追加**

`TODO.md` の「## アプリごと」セクション内の：

```markdown
- [ ] sublog: 個別ページデザイン方針確定（liquid-glass 共通化 vs 独自）
- [ ] caflog: 同上
```

を削除し、以下を「## 完了済み」に追加：

```markdown
- [x] 2026-05-09 個別アプリページ デザイン方針確定（共通骨格＋個別色トークン）／sublog・caflog を新方式にリファクタ／apps/_template/ 整備
```

- [ ] **Step 2: caflog スクショ撮影タスクを追加**

`TODO.md` の「## 🟡 優先度: 中（仕上げ）」セクションに以下を追加：

```markdown
- [ ] **caflog スクリーンショット撮影と配置** — `apps/caflog/screenshots/1.png`〜 を撮影して配置、`apps/caflog/index.html` に `<section id="screenshots">` を追加
```

- [ ] **Step 3: 最終更新日を更新**

`TODO.md:4` の `最終更新日: 2026-04-27` を `最終更新日: 2026-05-09` に変更。

- [ ] **Step 4: コミット**

```bash
git add TODO.md
git commit -m "Update TODO.md after design refactor"
```

---

## Task 13: 最終ビジュアル確認

**Files:**
- なし（確認のみ）

- [ ] **Step 1: トップページに影響が出ていないことを確認**

`browser_navigate` で `file:///Users/uesugiyuuto/Documents/Web/Applibrary/index.html` を開き、`browser_take_screenshot` で `/tmp/top-final.png` 保存し Read。トップは触っていないので変化が無いはず。

- [ ] **Step 2: sublog 個別ページの最終確認**

`browser_navigate` で `file:///Users/uesugiyuuto/Documents/Web/Applibrary/apps/sublog/index.html` を開き、`browser_take_screenshot` `/tmp/sublog-final.png`。
確認項目：hero / features / screenshots（4 枚） / pro / cta / footer がこの順で表示。

- [ ] **Step 3: caflog 個別ページの最終確認**

`browser_navigate` で `file:///Users/uesugiyuuto/Documents/Web/Applibrary/apps/caflog/index.html` を開き、`browser_take_screenshot` `/tmp/caflog-final.png`。
確認項目：hero / features / pro / cta / footer がこの順で表示（screenshots はまだ無いので OK）。

- [ ] **Step 4: モバイル幅最終確認**

`browser_resize` 375x812 にして sublog/caflog をそれぞれ再 navigate + screenshot。崩れが無いことを確認。

- [ ] **Step 5: 問題があれば該当タスクに戻って修正、無ければ完了**

問題ゼロなら作業完了。何か残っていればこのタスク内で修正してから追加コミット。
