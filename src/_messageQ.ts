import Discord from "discord.js";
import ErrorInfo from "./message/error/error.json";

export function messageQ(client: Discord.Client) {
  client.on("messageCreate", async (message) => {
    const regex = /https:\/\/discord.com\/channels\/[0-9]+\/([0-9]+)\/([0-9]+)/;
    const str = message.content;

    const match = str.match(regex);
    if (message.author.bot || match == null) return;
    const channelID = match[1];
    const messageID = match[2];

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

    const fetchMessage = await channel?.messages
      ?.fetch(`${messageID}`)
      .catch(console.error);
    if (fetchMessage == null) {
      console.error(ErrorInfo.notMsg);
      await message.reply({
        embeds: [errorEmbed.setDescription(ErrorInfo.notMsg)],
      });
      return;
    }
    if (fetchMessage.system) {
      await message.reply({
        embeds: [
          errorEmbed.setDescription(
            "システムメッセージのため引用をキャンセルしました。"
          ),
        ],
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
      if (fetchMessage.attachments.size) {
        const file = fetchMessage.attachments.map(
          (attachment) => attachment.url
        );
        await message.reply({
          embeds: [quoteEmbed.setImage(`${file}`)],
        });
      } else {
        await message.reply({
          embeds: [quoteEmbed],
        });
      }
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
}
