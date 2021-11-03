import Discord from "discord.js";

export function _rt(client: Discord.Client) {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith("RT:")) {
      const regex = /https:\/\/discord.com\/channels\/\d+\/(\d+)\/(\d+)/;
      const str = message.content;
      const match = str.match(regex);
      if (match === null) return;
      const channelID = match[1];
      const messageID = match[2];
      const quoteChannel = client.channels.cache.get(`${channelID}`);
      // @ts-ignore
      if ([quoteChannel, quoteChannel].includes(null)) return;
      if (!quoteChannel?.isText()) return;
      const quoteMessage = await quoteChannel?.messages.fetch(`${messageID}`);

      if (quoteMessage == null || quoteMessage.system) return;

      const rtEmbed = new Discord.MessageEmbed()
        .setAuthor(
          `${message.author.username} さんが ${quoteMessage.author.username} さんのTimesをRTしました。`,
          `${message.author.avatarURL()}`
        )
        .setDescription(`${quoteMessage.content}`)
        .setFooter(`${quoteMessage.createdAt}`)
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
