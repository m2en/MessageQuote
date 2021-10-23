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
    if (message.author.bot || !regex.test(str)) return;
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

  // 引用する - ContextMenuの処理 //
  client.on("interactionCreate", (interaction) => {
    if (!interaction.isContextMenu()) return;
    if (interaction.targetId === "引用する") {
      const contextMessage = interaction.options.getMessage("引用する");
      if (contextMessage === null) {
        return;
      }
      try {
        interaction.reply({
          embeds: [
            new Discord.MessageEmbed()
              .setDescription(`${contextMessage}`)
              .setAuthor(`${contextMessage.author}`)
              .setColor("AQUA"),
          ],
        });
      } catch (error) {
        return;
      }
    }
  });
}
