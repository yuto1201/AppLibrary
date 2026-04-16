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
    tagline: 'サブスクをシンプルに可視化。',  // 1-2 行の短い説明

    // --- 表示メタ ---
    platform: 'iOS',                        // iOS / macOS / Web 等
    status: 'alpha',                        // alpha / beta / release （バッジ色に反映）
    releaseDate: null,                      // 'YYYY-MM-DD' or null（審査中/未公開）

    // --- ビジュアル ---
    icon: null,                             // アイコン画像ファイル名（apps/<slug>/ からの相対）例: 'icon.png'

    // --- リンク ---
    appStoreUrl: null,                      // App Store URL（公開後に追加）
    introUrl: './apps/sublog/',             // 個別紹介ページ
    privacyUrl: './apps/sublog/privacy.html', // プライバシーポリシー（App Store 審査で必須）
  },

  {
    slug: 'callog',
    name: 'CalLog',
    tagline: '（タグラインを入れる）',

    platform: 'iOS',
    status: 'alpha',
    releaseDate: null,

    icon: null,

    appStoreUrl: null,
    introUrl: './apps/callog/',
    privacyUrl: './apps/callog/privacy.html',
  },

  // --- 新しいアプリ追加時はここに { ... } を増やす ---
];
