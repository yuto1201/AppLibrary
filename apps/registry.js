/* ============================================================
   Apps Registry — 紹介するアプリのメタデータ（唯一の真実）
   新しいアプリを追加する時はこの配列に 1 件追加するだけ。
   index.html はこのデータから自動でカードを生成する。

   ─── 必須フィールド ───
   slug / name / tagline / platform / status / introUrl / privacyUrl

   ─── 任意フィールド（リッチカード用） ───
   featured  : true で大きいカードに（モザイクで span 6）
   category  : site-data.js の categories と一致させる（フィルタチップ）
   icon      : apps/<slug>/ からの相対パス（PNG 等の画像）
   iconGlyph : 画像が無いとき表示する 1〜2 文字の絵文字／記号
   color     : カードのアイコン背景グラデーション開始色
   accent    : カードのアイコン背景グラデーション終了色＋光彩
   description : モーダルで表示する詳しい説明（1〜3 行）
   features    : モーダル下部のタグ（短い名詞リスト）
   price       : '無料' '無料 (Pro ¥600)' '¥300' 等の表示用
   version     : '1.0' 等
   year        : 公開年（リリース済みアプリ用）
   rating      : 0.0〜5.0（無ければ非表示）
   reviews     : レビュー数（rating とセット）
   ============================================================ */

window.APP_REGISTRY = [
  {
    // --- 識別子（必須） ---
    slug: 'sublog',
    name: 'SubLog',
    tagline: '毎月のサブスクを、ひと目で。',

    // --- 表示メタ ---
    platform: 'iOS',
    status: 'beta',                         // alpha / beta / release
    releaseDate: null,                      // 'YYYY-MM-DD' or null（審査中／未公開）

    // --- ビジュアル（カード／モーダル） ---
    icon: 'icon.png',                       // apps/sublog/icon.png
    iconGlyph: '￥',                         // 画像読み込み失敗時のフォールバック
    color:  '#E8E1F2',                      // 背景グラデ開始
    accent: '#6B5B8E',                      // 背景グラデ終了＋光彩
    // featured: true,                      // モザイクで大きく表示（アプリ数が増えてから差別化）

    // --- 詳細（モーダル） ---
    category: 'ファイナンス',
    description: 'サブスクリプションの管理を、ひとつの画面で。月々の支払いを可視化し、無駄な支出を見つけられます。シンプルな UI と、必要十分なウィジェットで日々の確認を後押しします。',
    features: ['サブスク一覧', '月次サマリー', 'ウィジェット', '通知'],
    price: '無料',
    version: '1.0',

    // --- リンク ---
    appStoreUrl: null,                      // App Store URL（公開後に追加）
    introUrl: './apps/sublog/index.html',   // 個別紹介ページ
    privacyUrl: './apps/sublog/privacy.html',
  },

  {
    slug: 'caflog',
    name: 'CafLog',
    tagline: 'カフェインとの付き合いを、見える化。',

    platform: 'iOS',
    status: 'beta',
    releaseDate: null,

    icon: 'icon.png',
    iconGlyph: '☕',
    color:  '#F5EBDD',
    accent: '#8B5E3C',

    category: 'ヘルスケア',
    description: 'いつ・どれくらいのカフェインを摂ったかを記録し、1 日の合計と就寝時の体内残量を可視化します。睡眠の質を意識した飲み方をサポート。',
    features: ['カフェイン量記録', '残量計算', '日別サマリー', '通知'],
    price: '無料',
    version: '1.0',

    appStoreUrl: null,
    introUrl: './apps/caflog/index.html',
    privacyUrl: './apps/caflog/privacy.html',
  },

  // --- 新しいアプリを追加する時はここに { ... } を増やす ---
];
