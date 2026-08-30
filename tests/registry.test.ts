import { describe, expect, it } from "vitest";
import { apps, getApp, usedPlatforms, usedCategories } from "@/data/registry";
import { appSchema } from "@/data/schema";

describe("apps registry", () => {
  it("全エントリがスキーマを満たす", () => {
    for (const app of apps) {
      expect(() => appSchema.parse(app)).not.toThrow();
    }
  });

  it("slug が一意である", () => {
    const slugs = apps.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("すべてのアプリが 1 つ以上のプラットフォームを持つ", () => {
    for (const app of apps) {
      expect(app.platforms.length).toBeGreaterThan(0);
    }
  });

  it("getApp は slug で引ける / 無い slug は undefined", () => {
    expect(getApp("sublog")?.name).toBe("SubLog");
    expect(getApp("does-not-exist")).toBeUndefined();
  });

  it("フィルタ候補が実データから導出される", () => {
    expect(usedPlatforms()).toContain("iOS");
    expect(usedCategories()).toEqual(expect.arrayContaining(["ファイナンス", "ヘルスケア"]));
  });
});
