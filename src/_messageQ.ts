import Discord from "discord.js";
import ErrorInfo from "./message/error/error.json";

export function messageQ(client: Discord.Client) {
  client.on("messageCreate", async (message) => {
    const regex = /https:\/\/discord.com\/channels\/([0-9]+)\/([0-9]+)/;
    const str = message.content;
    const splitMessage = message.content.split("/");
    const channelID = splitMessage[5];
    const messageID = splitMessage[6];
    const channel = client.channels.cache.get(`${channelID}`);

    const errorEmbed = new Discord.MessageEmbed()
      .setTitle("お例外がお呼ばれされました")
      .setColor("RED");
    if (!regex.test(str)) {
      return;
    }
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

    const quoteEmbed = new Discord.MessageEmbed()
      .setDescription(`${fetchMessage.content}`)
      .setColor("AQUA")
      .setAuthor(
        `${fetchMessage.author.username}`,
        `${fetchMessage.author.avatarURL()}`
      )
      .setTimestamp();

    try {
      await message.reply({
        embeds: [quoteEmbed],
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
