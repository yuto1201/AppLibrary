# 共通コンポーネント

ステータス: 確定
最終更新日: 2026-08-31

- `GlassFilter`: 共通 SVG フィルタ。旧 JS による DOM 注入は不要。
- `AppCard`: registry の名前・アイコン・ステータス・価格を表示し、モーダルと詳細 URL を提供する。`.reveal.in` は `useReveal` の React 状態で制御する。
- `AppModal`: 詳細・配布先リンク、Escape で閉じる、Tab の循環、背面スクロール抑制。
- `Nav`: 言語・テーマ切替とモバイルメニュー。旧 Tweaks パネルは現行 React UI に存在しない。
- `Hero`: 文字 span によるアニメーション。見出しの aria-label を維持し、文字 span は aria-hidden にする。
- `SiteStateProvider`: theme / accent / layout / density / font / lang を `applibrary_state` に保存。初回の inline script と hydration 後の属性適用を両方維持する。

Hero の再生履歴は sessionStorage の `applibrary_hero_seen`。開発時に消して再読み込みすると再生できる。reduced-motion では再生しない。

表示ラベルは `src/lib/site-data.ts` / `labels.ts`。ステータスは alpha / beta / release / archived。未公開 URL は null を維持し、架空の配布先を作らない。
