# MessageQuote

メッセージリンクからIDを取得して引用できるDiscord Bot

TypeScriptとDiscord.jsを使い、メッセージIDからDiscord APIでメッセージを取得しています。

----

```shell
$ git clone https://github.com/approvers/MessageQuote.git
$ yarn install 
$ echo .env >> TOKEN=
```

```shell
$ yarn debug 
$ yarn compile
$ yarn start
```

## 環境変数

| 値 | 概要 |
| --- | --- |
| TOKEN | DiscordのBotのToken |

## 実装

### メッセージ引用
`./src/_messageQ.ts`

- メッセージリンクからメッセージIDを取得
- メッセージIDでメッセージを取得
- Embedに代入

### Slash Command
`./src/_Command.ts` (限界開発鯖内でのみ利用できるギルドコマンド)

- interactionAPIを使っています。

### スレッド参加
`./src/_Event.ts`

- スレッド作成のイベントハンドラを使用

