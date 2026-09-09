# 振り返りアプリ（review_app）

毎日の振り返りを KPT / YWT の2形式で記録し、可視化・AI分析できる Web アプリです。

## 機能

- **振り返り入力**：KPT または YWT を選択して、日付ごとに回答を入力
- **履歴管理**：一覧表示・編集・削除、JSON 形式のエクスポート/インポート
- **可視化**：記録数、連続日数、週次記録数の棒グラフ、35日ヒートマップ
- **AI分析**：OpenAI 互換 API を使って振り返り履歴から傾向とアドバイスを生成

## 技術スタック

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- date-fns
- recharts
- lucide-react

## 起動手順

```bash
npm install
npm run dev
```

ブラウザで http://localhost:5173/ を開きます。

## ビルド

```bash
npm run build
npm run lint
```

## AI分析の API キー設定

「AI分析」タブで OpenAI 互換 API のベースURL、モデル名、API キーを入力してください。API キーはブラウザ内の localStorage に保存され、コードやリポジトリには含まれません。

## データ保存

すべての振り返りデータはブラウザの localStorage に保存されます。データのバックアップには履歴画面の「エクスポート」機能を利用してください。
