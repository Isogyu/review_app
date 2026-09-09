現在のタスク:
Loop 1: 設計・技術選定

完了:
- リポジトリ https://github.com/Isogyu/review_app.git を作業ディレクトリへ clone
- 技術スタックの選定
  - フレームワーク: React 19 + TypeScript（型安全・保守性）
  - ビルドツール: Vite 8（高速な開発・本番ビルド）
  - スタイリング: Tailwind CSS v4（ユーティリティクラスでレスポンシブ対応）
  - グラフ: recharts（React ネイティブで週次推移等を実装）
  - 日付処理: date-fns
  - アイコン: lucide-react
  - 保存: IndexedDB（dexie.js 導入予定）または localStorage。IndexedDBを採用予定
- 雛形のビルド・lint確認（`npm run build`、`npm run lint` 成功）
- STATE.md の作成

未完了:
- 各機能の実装（Loop 2 以降）

前回の失敗と原因:
- なし

次回:
Loop 2: 振り返り入力（KPT/YWT）のコア機能を実装する

備考:
- AI APIキー管理方式は Loop 6 で決定。当面は未実装。
- ブランチ戦略: 各Loopで feature/loopN ブランチを切り、PR経由でマージ。
