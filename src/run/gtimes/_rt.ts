import { Client, MessageEmbed } from "discord.js";

export function _rt(client: Client) {
  client.on("messageCreate", async (message) => {
    const regex = /https:\/\/discord.com\/channels\/\d+\/(\d+)\/(\d+)/;
    if (message.author.bot) return;
    if (message.content.startsWith("RT:")) {
      const str = message.content;
      const match = str.match(regex);
      if (match === null) return;
      const [, channelID, messageID] = match;
      const quoteChannel = client.channels.cache.get(channelID);
      if ([quoteChannel].includes(undefined)) return;
      if (!quoteChannel?.isText()) return;
      const quoteMessage = await quoteChannel?.messages.fetch(messageID);

      if (quoteMessage == null || quoteMessage.system) return;

      const rtEmbed = new MessageEmbed()
        .setAuthor(
          `${message.author.username} さんが ${quoteMessage.author.username} さんのTimesをRTしました。`,
          `${message.author.avatarURL()}`
        )
        .addField("送信日時", `<t:${quoteMessage.createdTimestamp}>`)
        .setDescription(quoteMessage.content)
        .setColor("GREEN");

      if (quoteMessage.attachments.size) {
        const file = quoteMessage.attachments.map(
          (attachment) => attachment.url
        );
        rtEmbed.setImage(`${file}`);
      }
      message.channel
        .send({
          embeds: [rtEmbed],
        })
        .catch(console.error);
    }
  });
}
