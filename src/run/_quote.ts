import { Client, MessageEmbed } from "discord.js";

export function _quote(client: Client) {
  client.on("messageCreate", async (msg) => {
    if (
      msg.author.bot ||
      msg.content.startsWith(";") ||
      msg.content.startsWith("RT:")
    )
      return;

    /**
     * https://(ptb.|canary.)?discord.com/channels/サーバーID/チャンネルID/メッセージID
     */
    const regex = /https:\/\/discord.com\/channels\/\d+\/(\d+)\/(\d+)/;
    const str = msg.content;
    const match = str.match(regex);
    if (match === null) return;
    const [, channelID, messageID] = match;
    const quoteChannel = client.channels.cache.get(channelID);

    const errorEmbed = new MessageEmbed()
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

    const quoteMessage = await quoteChannel.messages.fetch(messageID);

    if (quoteMessage == null) {
      await msg.reply({
        embeds: [errorEmbed.setDescription("Message not found.")],
      });

      return;
    }
    if (quoteMessage.system) {
      return;
    }

    const quoteEmbed = new MessageEmbed()
      .setDescription(quoteMessage.content)
      .setColor("AQUA")
      .setAuthor(
        quoteMessage.author.username,
        `${quoteMessage.author.avatarURL()}`
      )
      .setTimestamp(quoteMessage.createdAt);
    if (quoteMessage.attachments.size) {
      const file = quoteMessage.attachments.map((attachment) => attachment.url);
      quoteEmbed.setImage(`${file}`);
    }
    msg.channel
      .send({
        embeds: [quoteEmbed],
      })
      .catch(console.error);
  });
}
