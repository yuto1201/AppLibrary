/* ============================================================
   Apps Registry — 紹介するアプリのメタデータ（唯一の真実）
   新しいアプリを追加する時はこの配列に 1 件追加するだけ。
   index.html はこのデータから自動でカードを生成する。
   ============================================================ */

window.APP_REGISTRY = [
  {
    // --- 識別子（必須） ---
    slug: 'sublog',                         // フォルダ名と一致させる（apps/<slug>/）
    name: 'SubLog',                         // アプリ名
    tagline: '毎月のサブスクを、ひと目で。',  // 1-2 行の短い説明

    // --- 表示メタ ---
    platform: 'iOS',                        // iOS / macOS / Web 等
    status: 'beta',                         // alpha / beta / release （バッジ色に反映）
    releaseDate: null,                      // 'YYYY-MM-DD' or null（審査中/未公開）

    // --- ビジュアル ---
    icon: 'icon.png',                       // apps/<slug>/ からの相対

    // --- リンク ---
    appStoreUrl: null,                      // App Store URL（公開後に追加）
    introUrl: './apps/sublog/index.html',   // 個別紹介ページ（file:// でも動くよう明示）
    privacyUrl: './apps/sublog/privacy.html', // プライバシーポリシー（App Store 審査で必須）
  },

  {
    slug: 'caflog',
    name: 'CafLog',
    tagline: 'カフェインとの付き合いを、見える化。',

    platform: 'iOS',
    status: 'beta',
    releaseDate: null,

    icon: 'icon.png',

    appStoreUrl: null,
    introUrl: './apps/caflog/index.html',
    privacyUrl: './apps/caflog/privacy.html',
  },

  // --- 新しいアプリ追加時はここに { ... } を増やす ---
];
