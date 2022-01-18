import {
  Client,
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu,
  version
} from 'discord.js';

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
    .addField('開発者', '[merunno](https://github.com/merunno)')
    .addField('実行しているdiscord.jsバージョン', version)
    .addField(
      'リポジトリ',
      '[approvers/MessageQuote](https://github.com/approvers/MessageQuote)'
    );
  const helpSelect = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId('select')
      .setPlaceholder('ヘルプの種類選択')
      .addOptions([
        {
          label: '概要',
          description: 'このBotの概要を確認する',
          value: 'about'
        },
        {
          label: 'コマンド',
          description: 'コマンド一覧を確認する',
          value: 'command'
        }
      ])
  );

  client.on('messageCreate', (m) => {
    if (m.author.bot) return;
    if (m.content === '*help') {
      m.reply({
        embeds: [embed],
        components: [helpSelect]
      }).catch(console.error);
    }
  });
}
