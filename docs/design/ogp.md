ステータス: 確定
最終更新日: 2026-09-01

# OGP 画像

`public/ogp.png` は 1200 × 630 の PNG。AppLibrary の共通 Open Graph / Twitter 画像として使う。

2026-09-01 版は `tools/generate-ogp.py` と `tools/requirements-ogp.txt` で固定した Pillow 11.3.0 を使い、背景、ガラス調パネル、Pillow 同梱フォントの英字、次のリポジトリ内画像を合成する。OS のシステムフォントと外部画像には依存しない。

- `public/apps/sublog/icon.png`
- `public/apps/caflog/icon.png`

初回は `.python-version` と同じ Python 3.13.3 の専用仮想環境へ `python3 -m pip install --no-deps -r tools/requirements-ogp.txt` で依存を導入する。Pillow がない場合、生成スクリプトはこの導入コマンドを案内して終了する。掲載アプリを追加・削除した場合は、生成スクリプトの `APPS` も更新して `npm run generate:ogp` を実行する。`npm run check:ogp` は生成結果の全ピクセルと commit 済み画像を比較し、`npm run check:docs` と CI で同期を強制する。Vitest は出力形式と 1200 × 630 の寸法も検査する。
