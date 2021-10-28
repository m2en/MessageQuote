import Discord from "discord.js";

export function _quote(client: Discord.Client) {
  client.on("messageCreate", async (msg) => {
    if (msg.author.bot || msg.content.startsWith(";")) return;

    /**
     * https://(ptb.|canary.)?discord.com/channels/サーバーID/チャンネルID/メッセージID
     */
    const regex = /https:\/\/discord.com\/channels\/\d+\/(\d+)\/(\d+)/;
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
      await msg.reply({
        embeds: [errorEmbed.setDescription(`Channel not found`)],
      });

      return;
    }
    if (!quoteChannel.isText()) {
      await msg.reply({
        embeds: [
          errorEmbed.setDescription(
            `**Channel:**<#${quoteChannel.id}> not text channel`
          ),
        ],
      });

      return;
    }

    const quoteMessage = await quoteChannel.messages.fetch(`${messageID}`);

    if (quoteMessage == null) {
      await msg.reply({
        embeds: [errorEmbed.setDescription("Message not found.")],
      });

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
      console.error(error);
    }
  });

  client.on("threadCreate", async (thread) => {
    if (thread === null) {
      return;
    }
    await thread.join();
    await thread.send({
      content: `<@${thread.ownerId}>, **スレッド:${thread.name}**に自動参加しました。スレッド内のメッセージを引用することが可能になりました。`,
    });
  });
}
