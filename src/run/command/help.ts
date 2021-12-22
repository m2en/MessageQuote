import { Client, MessageEmbed, version } from 'discord.js'

export function _help(client: Client) {
  const embed = new MessageEmbed()
    .setTitle('ヘルプ')
    .setColor('#FFC9E9')
    .setAuthor('MessageQuote v' + version)
    .addField(
      'メッセージ引用',
      'メッセージリンクが送られるとそのメッセージの内容を読み込み送信します。MessageQuoteが参加しているサーバーのメッセージは全て取得できますが、引用はされません。'
    )
    .addField(
      'メッセージ引用スキップ',
      'メッセージの最初に`;`をつけるとメッセージ引用がキャンセルされます。'
    )
    .addField(
      '開発者',
      '[merunno](https://github.com/merunno)・[mirror-kt](https://github.com/mirror-kt)・[isso0424](https://github.com/isso0424)・[loxygenK](https://github.com/loxygenK)\n**開発にご協力くださった3人、ありがとう。**'
    )
    .addField('実行しているdiscord.jsバージョン', version)
    .addField(
      'リポジトリ',
      '[approvers/MessageQuote](https://github.com/approvers/MessageQuote)'
    )

  client.on('interactionCreate', (i) => {
    if (!i.isCommand()) return
    if (i.commandName !== 'help') return
    i.reply({ embeds: [embed], ephemeral: true }).catch(console.error)
  })

  client.on('messageCreate', (m) => {
    if (m.author.bot) return
    if (client.user == null) return
    if (m.content === '*help' || m.mentions.users.has(client.user.id)) {
      m.reply({ embeds: [embed] }).catch(console.error)
    }
  })
}
