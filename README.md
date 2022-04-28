# MessageQuote

[![Auto Pull Request Labeler](https://github.com/approvers/MessageQuote/actions/workflows/auto-label.yml/badge.svg)](https://github.com/approvers/MessageQuote/actions/workflows/auto-label.yml)
[![GitHub Actions#CodeQL](https://github.com/approvers/MessageQuote/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/approvers/MessageQuote/actions/workflows/codeql-analysis.yml)

[![GitHub Actions#eslint](https://github.com/approvers/MessageQuote/actions/workflows/eslint.yml/badge.svg)](https://github.com/approvers/MessageQuote/actions/workflows/eslint.yml)
[![GitHub Actions#prettier](https://github.com/approvers/MessageQuote/actions/workflows/prettier.yml/badge.svg)](https://github.com/approvers/MessageQuote/actions/workflows/prettier.yml)

----

メッセージリンクからメッセージを取得して展開するDiscord Bot

## 依存関係

TypeScript(node.js) + discord.js

- dotenv
- pm2

## セットアップ

1. MessageQuoteをクローンしてください。
2. `.env` を作成し、必要な環境変数を記入してください。
3. `yarn install` を実行し、依存関係をインストールしてください。
4. `yarn compile` を実行し、コンパイルしてください。
5. `yarn setup` を実行してください。

- 以後 pm2 で MessageQuote を管理することが出来るようになりました。
- pm2に関する詳細は [pm2](https://pm2.io/) を参照してください。
- この状態ではコマンドを使用することができないので、セットアップが完了したら [Application (/) Commandのセットアップ](src/setup/README.md) を見ながら、Slash Command
  を設定してください。

なお、開発者がホストしているバージョンを導入する際は [このリンク](https://discord.com/api/oauth2/authorize?client_id=889343802433757185&permissions=515396339712&scope=bot%20applications.commands) から導入できます。

## 環境変数

| 値                 | 説明                           | 必須    |
|-------------------|------------------------------|-------|
| `DISCORD_TOKEN`   | Discord Botのトークン             | true  |
| `CLIENT_ID`       | Discord BotのクライアントID(ユーザーID) | true  |
| `TARGET_GUILD_ID` | GuildCommandとして登録したいギルドのID   | false |

詳細は [.example.env](https://github.com/approvers/MessageQuote/blob/master/.example.env) を参照してください。
