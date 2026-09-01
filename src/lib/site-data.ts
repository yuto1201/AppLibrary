/**
 * サイト全体のデータ。プロフィール / お知らせ / SNS / UI 文言。
 * アプリのメタデータは src/data/registry.ts が持つ。ここは「サイトの顔」用。
 * i18n は UI ラベルの切替のみで、アプリ説明文は registry 側の日本語を使う。
 */
export const LANGS = ["ja", "en"] as const;
export type Lang = (typeof LANGS)[number];

export const profile = {
  name: "uesugiyuuto",
  // iOS 限定から全プラットフォームへ広げたため "iOS App Maker" を改めた。
  tagline: "App Maker",
  bio: "つくったアプリたち。日々を少しだけ丁寧にする、小さな道具を作っています。",
  location: "東京, 日本",
} as const;

export type Post = { date: string; title: string; excerpt: string };

export const posts: Post[] = [
  {
    date: "2026-04-19",
    title: "AppLibrary を新デザインに刷新",
    excerpt: "liquid-glass デザインの新しいトップページに切り替えました。",
  },
];

export type Social = { label: string; handle: string; url: string };

/** url が空 / "#" のエントリは未公開とみなして描画しない。 */
export const social: Social[] = [
  { label: "X", handle: "@Yuto_Program", url: "https://x.com/Yuto_Program" },
  { label: "GitHub", handle: "yuto1201", url: "https://github.com/yuto1201" },
];

export const allCategoryLabel: Record<Lang, string> = { ja: "すべて", en: "All" };
export const allPlatformLabel: Record<Lang, string> = { ja: "すべて", en: "All" };

type Dict = {
  nav: { apps: string; posts: string; contact: string };
  a11y_primary_nav: string;
  a11y_language: string;
  a11y_switch_language: string;
  a11y_theme: string;
  a11y_switch_light: string;
  a11y_switch_dark: string;
  a11y_open_menu: string;
  a11y_close_menu: string;
  a11y_close_dialog: string;
  hero_eyebrow: string;
  hero_h1_a: string;
  hero_h1_b: string;
  hero_meta_apps: string;
  hero_cta: string;
  section_apps: string;
  section_apps_sub: string;
  section_posts: string;
  section_posts_sub: string;
  search_placeholder: string;
  filter_platform: string;
  filter_category: string;
  contact_h: string;
  contact_p: string;
  footer_copyright: string;
  privacy: string;
  terms: string;
  modal_dl_small: string;
  modal_dl_large: string;
  modal_dl_unavailable: string;
  modal_web_small: string;
  modal_web_large: string;
  modal_visit_site: string;
  stat_version: string;
  stat_status: string;
  stat_release: string;
  stat_price: string;
  stat_unset: string;
  empty_title: string;
  empty_sub: string;
  active_filters: string;
  clear_filters: string;
  status_alpha: string;
  status_beta: string;
  status_release: string;
  status_archived: string;
  tba: string;
};

export const i18n: Record<Lang, Dict> = {
  ja: {
    nav: { apps: "アプリ", posts: "お知らせ", contact: "お問い合わせ" },
    a11y_primary_nav: "メインナビゲーション",
    a11y_language: "言語",
    a11y_switch_language: "英語に切り替える",
    a11y_theme: "テーマ",
    a11y_switch_light: "ライトモードに切り替える",
    a11y_switch_dark: "ダークモードに切り替える",
    a11y_open_menu: "メニューを開く",
    a11y_close_menu: "メニューを閉じる",
    a11y_close_dialog: "閉じる",
    hero_eyebrow: "App Maker",
    hero_h1_a: "小さなアプリを、",
    hero_h1_b: "丁寧に。",
    hero_meta_apps: "個のアプリ",
    hero_cta: "アプリを見る",
    section_apps: "App Library",
    section_apps_sub: "つくったアプリたち",
    section_posts: "Notes",
    section_posts_sub: "近況とリリースノート",
    search_placeholder: "アプリを検索",
    filter_platform: "プラットフォーム",
    filter_category: "カテゴリ",
    contact_h: "お仕事・感想・雑談まで。",
    contact_p: "お気軽にご連絡ください。SNS・メール、どちらでも。",
    footer_copyright: "© 2026 · 東京から、愛を込めて",
    privacy: "プライバシー",
    terms: "利用規約",
    modal_dl_small: "Download on the",
    modal_dl_large: "App Store",
    modal_dl_unavailable: "審査中",
    modal_web_small: "ブラウザで開く",
    modal_web_large: "Web アプリ",
    modal_visit_site: "アプリサイトへ",
    stat_version: "バージョン",
    stat_status: "ステータス",
    stat_release: "リリース",
    stat_price: "価格",
    stat_unset: "—",
    empty_title: "見つかりませんでした",
    empty_sub: "別のキーワードで試してみてください",
    active_filters: "絞り込み中",
    clear_filters: "条件をクリア",
    status_alpha: "α 開発中",
    status_beta: "β テスト中",
    status_release: "リリース済み",
    status_archived: "公開終了",
    tba: "未定",
  },
  en: {
    nav: { apps: "Apps", posts: "Notes", contact: "Contact" },
    a11y_primary_nav: "Primary navigation",
    a11y_language: "Language",
    a11y_switch_language: "Switch to Japanese",
    a11y_theme: "Theme",
    a11y_switch_light: "Switch to light mode",
    a11y_switch_dark: "Switch to dark mode",
    a11y_open_menu: "Open menu",
    a11y_close_menu: "Close menu",
    a11y_close_dialog: "Close",
    hero_eyebrow: "App Maker",
    hero_h1_a: "Small apps,",
    hero_h1_b: "made with care.",
    hero_meta_apps: "apps",
    hero_cta: "Browse apps",
    section_apps: "App Library",
    section_apps_sub: "Things I have built",
    section_posts: "Notes",
    section_posts_sub: "Updates & release notes",
    search_placeholder: "Search apps",
    filter_platform: "Platform",
    filter_category: "Category",
    contact_h: "Work, feedback, or just hi.",
    contact_p: "Always happy to hear from you — email or social, either works.",
    footer_copyright: "© 2026 · Made in Tokyo, with care",
    privacy: "Privacy",
    terms: "Terms",
    modal_dl_small: "Download on the",
    modal_dl_large: "App Store",
    modal_dl_unavailable: "In Review",
    modal_web_small: "Open in browser",
    modal_web_large: "Web app",
    modal_visit_site: "Visit app site",
    stat_version: "Version",
    stat_status: "Status",
    stat_release: "Released",
    stat_price: "Price",
    stat_unset: "—",
    empty_title: "No apps found",
    empty_sub: "Try a different search",
    active_filters: "Filtered",
    clear_filters: "Clear filters",
    status_alpha: "In Development",
    status_beta: "In Beta",
    status_release: "Released",
    status_archived: "Archived",
    tba: "TBA",
  },
};
