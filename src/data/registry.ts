import { registrySchema, type App } from "./schema";

/**
 * 掲載アプリの唯一の真実。
 * 新しいアプリを追加するときはこの配列へ 1 件足すだけでよい。
 * 一覧カード・詳細ページ・プライバシーページはすべてここから生成される。
 */
const entries = [
  {
    slug: "sublog",
    name: "SubLog",
    tagline: "毎月のサブスクを、ひと目で。",

    platforms: ["iOS"],
    status: "release",
    releaseDate: null,
    year: 2026,

    icon: "icon.png",
    iconGlyph: "￥",
    color: "#E8E1F2",
    accent: "#6B5B8E",
    featured: false,

    category: "ファイナンス",
    description:
      "サブスクリプションの管理を、ひとつの画面で。月々の支払いを可視化し、無駄な支出を見つけられます。シンプルな UI と、必要十分なウィジェットで日々の確認を後押しします。",
    features: ["サブスク一覧", "月次サマリー", "ウィジェット", "通知"],
    price: "無料",
    version: "1.0",

    screenshots: ["1.png", "2.png", "3.png", "4.png"],

    appStoreUrl: "https://apps.apple.com/us/app/sublog/id6761677813",
    siteUrl: null,
  },
  {
    slug: "caflog",
    name: "CafLog",
    tagline: "カフェインとの付き合いを、見える化。",

    platforms: ["iOS"],
    status: "release",
    releaseDate: null,
    year: 2026,

    icon: "icon.png",
    iconGlyph: "☕",
    color: "#F5EBDD",
    accent: "#8B5E3C",
    featured: false,

    category: "ヘルスケア",
    description:
      "いつ・どれくらいのカフェインを摂ったかを記録し、1 日の合計と就寝時の体内残量を可視化します。睡眠の質を意識した飲み方をサポート。",
    features: ["カフェイン量記録", "残量計算", "日別サマリー", "通知"],
    price: "無料",
    version: "1.0",

    screenshots: ["1.png", "2.png", "3.png", "4.png", "5.png"],

    appStoreUrl: "https://apps.apple.com/us/app/caflog/id6760961086",
    siteUrl: null,
  },
] satisfies unknown[];

/** ビルド時に検証する。スキーマ違反があれば build が失敗する。 */
export const apps: App[] = registrySchema.parse(entries);

export function getApp(slug: string): App | undefined {
  return apps.find((app) => app.slug === slug);
}

/** 掲載中のアプリが持つプラットフォームを、PLATFORMS の定義順で返す。 */
export function usedPlatforms(): string[] {
  const seen = new Set(apps.flatMap((app) => app.platforms));
  return [...seen];
}

export function usedCategories(): string[] {
  return [...new Set(apps.map((app) => app.category))];
}
