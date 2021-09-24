import Discord from "discord.js";

export function messageQ(client: Discord.Client) {
  client.on("messageCreate", async (message) => {
    if (!message.content.startsWith("https://discord.com/channels/")) {
      return;
    }

    const splitMessage = message.content.split("/");
    const channelID = splitMessage[5];
    const messageID = splitMessage[6];
    const channel = client.channels.cache.get(`${channelID}`);

    const errorEmbed = new Discord.MessageEmbed()
      .setTitle("お例外がお呼ばれされました")
      .setColor("RED");
    const notFound: string = "Nonexistent error: The channel does not exist.";
    const notMsg: string = "Missing content: The message does not exist.";
    const noText: string =
      "Unavailable Content: The source channel of the message you are trying to quote is not a text channel. Messages in threaded channels, etc. cannot be quoted.";

    if (channel == null) {
      console.error(notFound);
      await message.reply({
        embeds: [errorEmbed.setDescription(notFound)],
      });
      return;
    }
    if (!channel.isText()) {
      console.error(noText);
      await message.reply({
        embeds: [errorEmbed.setDescription(noText)],
      });
      return;
    }

    const fetchMessage = await channel?.messages?.fetch(`${messageID}`);

    if (fetchMessage == null) {
      console.error(notMsg);
      await message.reply({
        embeds: [errorEmbed.setDescription(notMsg)],
      });
      return;
    }

    const messageButton = new Discord.MessageButton()
      .setStyle("LINK")
      .setLabel("ジャンプ")
      .setURL(`${message.content}`);

    const quoteEmbed = new Discord.MessageEmbed()
      .setDescription(`${fetchMessage.content}`)
      .setColor("AQUA")
      .setAuthor(
        `${fetchMessage.author.username}`,
        `${fetchMessage.author.avatarURL()}`
      );

    await message
      .reply({
        embeds: [quoteEmbed],
        components: [
          new Discord.MessageActionRow().addComponents([messageButton]),
        ],
      })
      .catch(console.error);
  });

  return "messageQ";
}
