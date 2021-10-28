import Discord from "discord.js";

export function _quote(client: Discord.Client) {
  client.on("messageCreate", async (msg) => {
    if (msg.author.bot || msg.content.startsWith(";")) return;

    /**
     * https://(ptb.|canary.)?discord.com/channels/サーバーID/チャンネルID/メッセージID
     */
    const regex = /https:\/\/discord.com\/channels\/[0-9]+\/([0-9]+)\/([0-9]+)/;
    const str = msg.content;
    const match = str.match(regex);
    if (match === null) return;
    const channelID = match[1];
    const messageID = match[2];
    const quoteChannel = client.channels.cache.get(`${channelID}`);

    const errorEmbed = new Discord.MessageEmbed()
      .setTitle("例外の呼び出し - エラーが発生しました。")
      .setColor("RED");
    if (quoteChannel == null) {
      msg
        .reply({
          embeds: [errorEmbed.setDescription(`Channel not found`)],
        })
        .catch(console.error);
      return;
    }
    if (!quoteChannel.isText()) {
      msg
        .reply({
          embeds: [
            errorEmbed.setDescription(
              `**Channel:**<#${quoteChannel.id}> not text channel`
            ),
          ],
        })
        .catch(console.error);
      return;
    }

    const quoteMessage = await quoteChannel.messages
      .fetch(`${messageID}`)
      .catch(console.error);
    if (quoteMessage == null) {
      msg
        .reply({
          embeds: [errorEmbed.setDescription("Message not found.")],
        })
        .catch(console.error);
      return;
    }
    if (quoteMessage.system) {
      return;
    }

    const quoteEmbed = new Discord.MessageEmbed()
      .setDescription(`${quoteMessage.content}`)
      .setColor("RANDOM")
      .setAuthor(
        `${quoteMessage.author.username}`,
        `${quoteMessage.author.avatarURL()}`
      )
      .setFooter(`${quoteMessage.createdAt}`);
    try {
      if (quoteMessage.attachments.size) {
        const file = quoteMessage.attachments.map(
          (attachment) => attachment.url
        );
        await msg.reply({
          embeds: [quoteEmbed.setImage(`${file}`)],
        });
      } else {
        await msg.reply({
          embeds: [quoteEmbed],
        });
      }
    } catch (error) {
      await console.error(error);
    }
  });

  client.on("threadCreate", (thread) => {
    if (thread === null) {
      return;
    }
    thread.join().catch(console.error);
    thread
      .send({
        content: `<@${thread.ownerId}>, **スレッド:${thread.name}**に自動参加しました。スレッド内のメッセージを引用することが可能になりました。`,
      })
      .catch(console.error);
  });
}
