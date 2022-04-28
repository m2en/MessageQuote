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
- なお、開発者がホストしているバージョンを導入する際は [このリンク](https://discord.com/api/oauth2/authorize?client_id=889343802433757185&permissions=515396339712&scope=bot%20applications.commands) から導入できます。

### コマンドの登録

セットアップ後、スラッシュコマンドをギルドに追加する必要があります。

1. BOTをギルドに招待する。この際 `BOT SCOPE` にて `bot` と `application.commands` を指定してリンクを発行して招待する必要があります。
2. `.env` にて以下の値を追加します。
   1. `DISCORD_BOT_TOKEN` -- Botのトークンを指定します。
   2. `CLIENT_ID` -- BotのクライアントIDを指定します。クライアントIDはBotのユーザーIDと同一です。
   3. `TARGET_GUILD_ID` -- ギルドコマンドとして導入する際は追加したいギルドのIDを指定します。(指定しない場合はグローバルコマンドとして登録されます。)
3. `yarn compile` を実行し、JavaScriptにコンパイルしてください。
4. `yarn deloy` を実行し、コマンドを登録してください。
5. Discord クライアント上でスラッシュコマンドを確認できたら成功です。

- 2022/04/28からギルド上でスラッシュコマンドの使用制限等がかけられるようになりました。詳細はDiscord ヘルプセンターのページを確認してください。
  - [Command Permissions - Discord ヘルプセンター](https://support.discord.com/hc/ja/articles/4644915651095)

<details><summary>グローバルコマンドとギルドコマンドの違い</summary><div>

**グローバルコマンド:** このBotが導入される全てのギルドで利用できるコマンドです。(登録に時間がかかったりします。)

**ギルドコマンド:** 登録作業を行ったギルドで利用できるコマンドです。

[Making a Global Command - Discord Developer Documentation](https://discord.com/developers/docs/interactions/application-commands#registering-a-command)

</div></details>


## 環境変数

| 値                 | 説明                           | 必須    |
|-------------------|------------------------------|-------|
| `DISCORD_TOKEN`   | Discord Botのトークン             | true  |
| `CLIENT_ID`       | Discord BotのクライアントID(ユーザーID) | true  |
| `TARGET_GUILD_ID` | GuildCommandとして登録したいギルドのID   | false |

詳細は [.example.env](https://github.com/approvers/MessageQuote/blob/master/.example.env) を参照してください。
