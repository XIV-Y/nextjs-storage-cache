Next.js + TypeScript で localStorage/sessionStorage を活用したクライアントサイドキャッシュシステムの実装デモプロジェクトです。

## 概要

このプロジェクトは、ブラウザのWeb Storage API（localStorage / sessionStorage）を使用して、効率的なクライアントサイドキャッシュ機能を実装するためのデモアプリケーションです。外部API（JSONPlaceholder）からデータを取得し、設定された期間内はキャッシュされたデータを使用することで、不要なネットワークリクエストを削減します。

## 環境構築手順

### 前提条件
- Node.js 18以上
- npm または yarn

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd nextjs-storage-cache
```

### 2. 依存関係のインストール

```bash
npm install
# または
yarn install
```

### 3. 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
```

### 4. アプリケーションにアクセス

ブラウザで http://localhost:3000 を開いてください。

## 動作確認手順

### 基本的なキャッシュ動作の確認

1. **投稿一覧ページにアクセス**
   ```
   http://localhost:3000/posts
   ```

2. **初回読み込みの確認**
   - ブラウザの開発者ツール（F12）でConsoleタブを開く
   - 「API Call!!!」と「Refresh Cache!!!」のログが表示される
   - ネットワークタブでJSONPlaceholder APIへのリクエストを確認

3. **キャッシュヒットの確認**
   - ページを再読み込み（F5）
   - 「Return Cache!!!」のログが表示される
   - APIリクエストが発生しないことを確認
