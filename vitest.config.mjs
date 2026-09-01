import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["tests/**/*.test.{ts,tsx,mjs}"],
    exclude: ["tests/e2e/**"],
  },
  resolve: {
    alias: { "@": path.resolve(process.cwd(), "src") },
  },
});
