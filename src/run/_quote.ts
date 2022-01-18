import { Client, MessageEmbed } from 'discord.js';

export function _quote(client: Client) {
  client.on('messageCreate', async (msg) => {
    if (msg.author.bot) return;
    if (msg.content.startsWith(';')) {
      msg.react('🔕').catch(console.error);
      console.log('Skip: 引用スキップが使用されました。');
      return;
    }

    /**
     * https://(ptb.|canary.)?discord.com/channels/サーバーID/チャンネルID/メッセージID
     */
    const regex =
      /https:\/\/(?:ptb.|canary.)?discord(?:app)?.com\/channels\/(\d+)\/(\d+)\/(\d+)/;
    const str = msg.content;
    const match = str.match(regex);
    if (match === null) return;
    const [, serverID, channelID, messageID] = match;
    const quoteChannel = client.channels.cache.get(channelID);
    const quoteServerID = msg.guild?.id;

    const errorEmbed = new MessageEmbed().setTitle('エラー').setColor('RED');
    if (serverID === quoteServerID) {
      if (quoteChannel == null) {
        msg.react('❌').catch(console.error);
        console.error(
          'Error: チャンネルが見つからなかったため、引用をスキップしました。'
        );
        return;
      }
      if (!quoteChannel.isText()) {
        msg.react('❌').catch(console.error);
        console.error(
          'Error: テキストチャンネルではなかったため、引用をスキップしました。'
        );
        return;
      }

      const quoteMessage = await quoteChannel.messages.fetch(messageID);

      if (quoteMessage == null) {
        msg.react('❌').catch(console.error);
        console.error(
          'Error: メッセージが見つからなかったため、引用をスキップしました。'
        );

        return;
      }
      if (quoteMessage.system) {
        msg.react('❌').catch(console.error);
        await msg.reply({
          embeds: [
            errorEmbed.setDescription('システムメッセージは引用できません。')
          ]
        });
        console.error(
          'Error: システムメッセージだったため、引用をスキップしました。'
        );

        return;
      }

      const quoteUserName: string | undefined = quoteMessage.author.username;
      const quoteUserAvatar: string | null = quoteMessage.author.avatarURL();
      if (!quoteUserName || !quoteUserAvatar) return;
      const quoteEmbed = new MessageEmbed()
        .setDescription(quoteMessage.content)
        .setColor('#FFC9E9')
        .setAuthor({ name: quoteUserName, iconURL: quoteUserAvatar })
        .setTimestamp(quoteMessage.createdAt);
      if (quoteMessage.attachments.size) {
        const [file] = quoteMessage.attachments.map(
          (attachment) => attachment.url
        );
        quoteEmbed.setImage(file);
      }
      msg
        .reply({
          embeds: [quoteEmbed]
        })
        .catch(console.error);
      console.log('Quote: ' + msg.author.username + 'が引用を使用.');
    } else {
      msg.react('❌').catch(console.error);
      console.error(
        'Error: 別サーバー同士の引用だったため、引用をキャンセルしました。'
      );
    }
  });
}
