import Discord from "discord.js";
import ErrorInfo from "./message/error/error.json";

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

    if (channel == null) {
      console.error(ErrorInfo.notFound);
      await message.reply({
        embeds: [errorEmbed.setDescription(ErrorInfo.notFound)],
      });
      return;
    }
    if (!channel.isText()) {
      console.error(ErrorInfo.notText);
      await message.reply({
        embeds: [errorEmbed.setDescription(ErrorInfo.notText)],
      });
      return;
    }

    const fetchMessage = await channel?.messages?.fetch(`${messageID}`);

    if (fetchMessage == null) {
      console.error(ErrorInfo.notMsg);
      await message.reply({
        embeds: [errorEmbed.setDescription(ErrorInfo.notMsg)],
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

    try {
      await message.reply({
        embeds: [quoteEmbed],
        components: [
          new Discord.MessageActionRow().addComponents([messageButton]),
        ],
      });
    } catch (error) {
      await message.reply({
        embeds: [
          errorEmbed
            .setDescription(ErrorInfo.AllErrors)
            .addField("Reason for error", "```\n" + error + "\n```"),
        ],
      });
      console.error(error);
    }
  });

  return "messageQ";
}
