import { Client, MessageEmbed } from 'discord.js'

export function _help(client: Client) {
  client.on('interactionCreate', (i) => {
    if (!i.isCommand()) return
    if (i.commandName === 'help') {
      const embed = new MessageEmbed()
        .setTitle('ヘルプ')
        .setColor('#FFC9E9')
        .setAuthor('MessageQuote', `${client.user?.avatarURL()}`)
        .addField(
          'メッセージ引用',
          'メッセージリンクが送られるとそのメッセージの内容を読み込み送信します。MessageQuoteが参加しているサーバーのメッセージは全て取得できます。'
        )
        .addField(
          'メッセージ引用スキップ',
          'メッセージの最初に`;`をつけるとメッセージ引用がキャンセルされます。'
        )
        .addField(
          '開発者',
          '[merunno](https://github.com/merunno)・[mirror-kt](https://github.com/mirror-kt)・[isso0424](https://github.com/isso0424)・[loxygenK](https://github.com/loxygenK)\n**開発にご協力くださった3人、ありがとう。**'
        )
        .addField(
          '実行しているdiscord.jsバージョン',
          require('discord.js').version
        )
        .addField(
          'リポジトリ',
          '[approvers/MessageQuote](https://github.com/approvers/MessageQuote)'
        )
      i.reply({ embeds: [embed], ephemeral: true }).catch(console.error)
    }
  })
}
