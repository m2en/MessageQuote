# MessageQuote

## v4.0.1 (2022/04/05)

### Added

- スレッドに自動で参加するようになりました。

### Changed

- 引用キャンセルの判定を最初の方で行うように ([#131](https://github.com/approvers/MessageQuote/pull/131))
- グレイヴ・アクセント(`)があった際の置き換え判定時に文字を検索する方式に変更 ([#131](https://github.com/approvers/MessageQuote/pull/131))
- 一部の型を修正 ([#130](https://github.com/approvers/MessageQuote/pull/130))

### Bug Fixes

- メッセージリンクを送信したユーザーのアバターが取得できなかった際に、ただしくEmbedを作成できない問題を修正 ([#132](https://github.com/approvers/MessageQuote/pull/132))

### Docs Fixes

- リンクが地の文にまで波及している箇所を修正 (CHANGELOG.md) ([#129](https://github.com/approvers/MessageQuote/pull/129))

### Security

- [正規表現](https://github.com/approvers/MessageQuote/blob/639f3ab4a0129dee8c2324c3a94e88d9c29ac9a2/src/server/service/quote.ts#L8-L9)
  - メッセージリンクで使用されている一部の記号を利用することで、引用内容を任意の文字列に変更できる脆弱性を修正しました。
  - `https://discord.com` などのメッセージリンクにおいてDiscord PTB・Canaryなどのベータ版で発行されるメッセージリンク `ptb.discord.com`, `canary.discord.com` で指定されている `.`(ピリオド) がエスケープされていなかったのが原因です。

## v4.0.0 (2022-03-30)

### Added

- 新規コマンドを追加しました。
  - `/help`
  - `/ping`
  - 使用するには [Slash Command](./src/setup/README.md) を設定してください。
- デバック機能を追加しました。
  - `/debug <id>` で指定したIDのメッセージをコードブロックで表示することでデバックを行える機能です。
  - 使用するには [Slash Command](./src/setup/README.md) を設定してください。

### Changed

- 引用処理を最適化しました。
  - `233`行から`49`行の減量に成功しました。

### Removed

- 引用削除機能が廃止になりました。
  - 現在ギルドで表示されているボタンはアップデート後使用できなくなります。

### Security

- [CVE-2021-44906](https://github.com/advisories/GHSA-xvch-5gv4-984h)
  - `minimist <=v1.2.5` で使われている `setKey()` 関数を経由した脆弱性が報告されています。
  - MessageQuoteでは使用されていませんが、今一度確認をお願いします。

## v0.3.0 ~ v3.4.0

[GitHubのリリース](https://github.com/approvers/MessageQuote/releases) を参照ください。
