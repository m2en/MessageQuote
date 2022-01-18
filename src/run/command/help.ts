import { Client, MessageEmbed, version } from 'discord.js';

export function _help(client: Client) {
  const projectVersion: string | undefined = process.env.npm_package_version;

  const embed = new MessageEmbed()
    .setTitle(`ヘルプ: v${String(projectVersion)}`)
    .setColor('#FFC9E9')
    .addField(
      'メッセージ引用',
      'メッセージリンクが送られるとそのメッセージの内容を読み込み送信します。MessageQuoteが参加しているサーバーのメッセージは全て取得できますが、引用はされません。'
    )
    .addField(
      'メッセージ引用スキップ',
      'メッセージの最初に`;`をつけるとメッセージ引用がキャンセルされます。'
    )
    .addField('コマンド', '`*help`')
    .addField('開発者', '[merunno](https://github.com/merunno)')
    .addField('実行しているdiscord.jsバージョン', version)
    .addField(
      'リポジトリ',
      '[approvers/MessageQuote](https://github.com/approvers/MessageQuote)'
    );

  client.on('messageCreate', (m) => {
    if (m.author.bot) return;
    if (m.content === '*help') {
      m.reply({
        embeds: [embed]
      }).catch(console.error);
    }
  });
}
