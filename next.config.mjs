/**
 * 配信先ごとに基準パスが変わる。
 * - Vercel (app.yutodev.com): ルート配信なので basePath は空。
 * - GitHub Pages (yuto1201.github.io/AppLibrary/): サブディレクトリ配信なので
 *   NEXT_PUBLIC_BASE_PATH=/AppLibrary を渡してビルドする。
 * 静的出力は絶対パスで資産を参照するため、ここを誤ると 404 になる。
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静的出力。Vercel と GitHub Pages の両方で配信でき、
  // 既存 AppLibrary の静的サイト方針とも整合する。
  output: "export",
  basePath,
  // 静的出力では Next.js の画像最適化サーバーが動かないため無効化する。
  images: { unoptimized: true },
  // ディレクトリ URL を index.html へ解決させ、GitHub Pages 配信での 404 を防ぐ。
  trailingSlash: true,
  reactStrictMode: true,
  // 親ディレクトリに他プロジェクトがあるため、root 推論を明示して警告を防ぐ。
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
