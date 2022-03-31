# MessageQuote

## v4.0.0 (2022-03-30)

### feat

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
