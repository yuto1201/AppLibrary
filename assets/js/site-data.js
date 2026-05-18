/* ============================================================
   Site-wide data — プロフィール / お知らせ / SNS / UI 文言
   ※ アプリのメタデータは apps/registry.js を編集する。ここは「サイトの顔」用。
   ※ アプリ説明文は registry.js 側で持つ（日本語のみ）。
      i18n は UI ラベル（ナビ・セクション名・ボタン等）の切替のみ。
   ============================================================ */

window.SITE_DATA = {
  /* --- プロフィール（ヒーロー＆フッター） --- */
  profile: {
    name: 'uesugiyuuto',
    tagline: 'iOS App Maker',
    // TODO: 実情に合わせて書き換える（職業、活動、好きなもの等）
    bio: 'Xcode で作ったアプリたち。日々を少しだけ丁寧にする、小さな道具を作っています。',
    location: '東京, 日本',
  },

  /* --- カテゴリの先頭（「すべて」相当）のラベル ---
     ※ それ以降のカテゴリ一覧は registry.js から自動収集される（main.js: visibleCategories）。
     新規カテゴリを追加するときは registry.js の `category` を書くだけで良い。 */
  allCategoryLabel: { ja: 'すべて', en: 'All' },

  /* --- お知らせ／リリースノート ---
     空配列にすればセクション自体が非表示になる。 */
  posts: [
    {
      date: '2026-04-19',
      title: 'AppLibrary を新デザインに刷新',
      excerpt: 'liquid-glass デザインの新しいトップページに切り替えました。',
    },
  ],

  /* --- SNS / 連絡先 ---
     `url` が `#` 始まり、空、未設定のエントリは描画されない（プレースホルダー隠し）。
     公開する分だけ実 URL を埋めれば、その項目だけ表示される。 */
  social: [
    { label: 'X',      handle: '@uesugiyuuto', url: '#' },                                  // TODO: 実 URL を入れる
    { label: 'GitHub', handle: 'uesugiyuuto',  url: 'https://github.com/uesugiyuuto' },
    // { label: 'Email', handle: 'hello@example.com', url: 'mailto:hello@example.com' },    // TODO: 実アドレスに
  ],

  /* --- i18n（UI ラベルのみ） --- */
  i18n: {
    ja: {
      nav: { apps: 'アプリ', posts: 'お知らせ', contact: 'お問い合わせ' },
      hero_eyebrow: 'iOS App Maker',
      hero_h1_a: '小さなアプリを、',
      hero_h1_b: '丁寧に。',
      hero_meta_apps: '個のアプリ',
      hero_cta: 'アプリを見る',
      section_apps: 'App Library',
      section_apps_sub: 'Xcode で作ったアプリたち',
      section_posts: 'Notes',
      section_posts_sub: '近況とリリースノート',
      search_placeholder: 'アプリを検索',
      contact_h: 'お仕事・感想・雑談まで。',
      contact_p: 'お気軽にご連絡ください。SNS・メール、どちらでも。',
      footer_copyright: '© 2026 · 東京から、愛を込めて',
      privacy: 'プライバシー',
      modal_dl_small: 'Download on the',
      modal_dl_large: 'App Store',
      modal_dl_unavailable: '審査中',
      modal_visit_site: 'アプリサイトへ',
      stat_version: 'バージョン',
      stat_status: 'ステータス',
      stat_release: 'リリース',
      stat_price: '価格',
      stat_unset: '—',
      empty_title: '見つかりませんでした',
      empty_sub: '別のキーワードで試してみてください',
      active_filters: '絞り込み中',
      clear_filters: '条件をクリア',
      tweaks_title: 'Tweaks',
      tweak_theme: 'テーマ',
      tweak_accent: 'アクセントカラー',
      tweak_layout: 'レイアウト',
      tweak_density: '余白',
      tweak_font: 'フォント',
      opt_light: 'ライト', opt_dark: 'ダーク',
      opt_mosaic: 'モザイク', opt_grid: 'グリッド', opt_list: 'リスト',
      opt_tight: '狭い', opt_relaxed: '標準', opt_spacious: '広い',
      opt_sans: 'Sans', opt_serif: 'Serif', opt_mono: 'Mono',
      status_alpha: 'α 開発中',
      status_beta: 'β テスト中',
      status_release: 'リリース済み',
      tba: '未定',
    },
    en: {
      nav: { apps: 'Apps', posts: 'Notes', contact: 'Contact' },
      hero_eyebrow: 'iOS App Maker',
      hero_h1_a: 'Small apps,',
      hero_h1_b: 'made with care.',
      hero_meta_apps: 'apps',
      hero_cta: 'Browse apps',
      section_apps: 'App Library',
      section_apps_sub: 'Apps crafted in Xcode',
      section_posts: 'Notes',
      section_posts_sub: 'Updates & release notes',
      search_placeholder: 'Search apps',
      contact_h: 'Work, feedback, or just hi.',
      contact_p: "Always happy to hear from you — email or social, either works.",
      footer_copyright: '© 2026 · Made in Tokyo, with care',
      privacy: 'Privacy',
      modal_dl_small: 'Download on the',
      modal_dl_large: 'App Store',
      modal_dl_unavailable: 'In Review',
      modal_visit_site: 'Visit app site',
      stat_version: 'Version',
      stat_status: 'Status',
      stat_release: 'Released',
      stat_price: 'Price',
      stat_unset: '—',
      empty_title: 'No apps found',
      empty_sub: 'Try a different search',
      active_filters: 'Filtered',
      clear_filters: 'Clear filters',
      tweaks_title: 'Tweaks',
      tweak_theme: 'Theme',
      tweak_accent: 'Accent',
      tweak_layout: 'Layout',
      tweak_density: 'Density',
      tweak_font: 'Font',
      opt_light: 'Light', opt_dark: 'Dark',
      opt_mosaic: 'Mosaic', opt_grid: 'Grid', opt_list: 'List',
      opt_tight: 'Tight', opt_relaxed: 'Relaxed', opt_spacious: 'Spacious',
      opt_sans: 'Sans', opt_serif: 'Serif', opt_mono: 'Mono',
      status_alpha: 'In Development',
      status_beta: 'In Beta',
      status_release: 'Released',
      tba: 'TBA',
    },
  },
};
